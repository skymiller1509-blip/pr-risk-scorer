// Pure scoring logic for the Pull Request Risk Scorer.
// No Forge or Bitbucket imports here, so this file can be unit-tested
// with plain Node. The model is deliberately simple and transparent:
// every point comes from a named rule, and the panel shows the reasons.
//
// Scoring table (points added to a 0-100 score):
//   Size (lines changed):  0-100: 0 | 101-300: +10 | 301-800: +20
//                          801-2000: +30 | 2000+: +40
//   Files touched:         >10 files: +10 | >25 files: +10 more
//   Commits:               >5 commits: +5 | >10 commits: +5 more
//   No tests changed:      source changed but no test file changed: +15
//   New author:            0 merged PRs in this repo: +15 | 1-4: +5
//   Short description:     under 50 characters: +10
//   Approvals:             -5 per approval, at most -10
// Bands: 0-29 Low, 30-59 Medium, 60-100 High.

import {
  BitbucketDiffstatEntry,
  BitbucketPullRequest,
  PullRequestSignals,
  RiskBand,
  RiskReason,
  RiskScore,
} from "./types";

const TEST_DIR_PATTERN = /(^|\/)(test|tests|__tests__|spec|specs)\//i;
const TEST_FILE_PATTERN = /\.(test|spec)\.[a-z0-9]+$/i;

export function isTestPath(path: string): boolean {
  return TEST_DIR_PATTERN.test(path) || TEST_FILE_PATTERN.test(path);
}

export function bandForScore(score: number): RiskBand {
  if (score >= 60) return "High";
  if (score >= 30) return "Medium";
  return "Low";
}

export function scorePullRequest(signals: PullRequestSignals): RiskScore {
  const reasons: RiskReason[] = [];
  let score = 0;

  const add = (points: number, text: string) => {
    if (points === 0) return;
    score += points;
    reasons.push({ points, text });
  };

  // Size: big diffs are harder to review well.
  if (signals.linesChanged > 2000) {
    add(40, `Very large change: ${signals.linesChanged} lines changed.`);
  } else if (signals.linesChanged > 800) {
    add(30, `Large change: ${signals.linesChanged} lines changed.`);
  } else if (signals.linesChanged > 300) {
    add(20, `Fairly large change: ${signals.linesChanged} lines changed.`);
  } else if (signals.linesChanged > 100) {
    add(10, `Moderate change: ${signals.linesChanged} lines changed.`);
  }

  // Breadth: many files means many places a mistake can hide.
  if (signals.filesChanged > 25) {
    add(10, `Touches ${signals.filesChanged} files, which is a lot to review.`);
    add(10, `More than 25 files changed.`);
  } else if (signals.filesChanged > 10) {
    add(10, `Touches ${signals.filesChanged} files.`);
  }

  // Commits: a long commit trail usually means the change kept shifting.
  if (signals.commitCount > 10) {
    add(5, `Has ${signals.commitCount} commits.`);
    add(5, `More than 10 commits on one pull request.`);
  } else if (signals.commitCount > 5) {
    add(5, `Has ${signals.commitCount} commits.`);
  }

  // Tests: changing source without touching a test is the classic miss.
  if (signals.sourceFilesChanged > 0 && signals.testFilesChanged === 0) {
    add(15, "No tests changed, but source code did.");
  }

  // Author history: a first-time author in this repo has no track record here.
  if (signals.authorMergedPrCount === 0) {
    add(15, "Author has no merged pull requests in this repo yet.");
  } else if (
    signals.authorMergedPrCount !== null &&
    signals.authorMergedPrCount <= 4
  ) {
    add(5, `Author has only ${signals.authorMergedPrCount} merged pull requests here.`);
  }
  // authorMergedPrCount === null: history lookup failed, factor skipped.

  // Description: reviewers need something to read before the code.
  if (signals.descriptionLength < 50) {
    add(10, "Description is very short, so reviewers have little context.");
  }

  // Approvals lower the score: someone already read it and signed off.
  if (signals.approvals > 0) {
    add(
      -5 * Math.min(signals.approvals, 2),
      `${signals.approvals} approval${signals.approvals > 1 ? "s" : ""} from reviewers.`,
    );
  }

  score = Math.max(0, Math.min(100, score));

  // Biggest contributors first, at most 5 reasons shown.
  reasons.sort((a, b) => Math.abs(b.points) - Math.abs(a.points));

  return {
    score,
    band: bandForScore(score),
    reasons: reasons.slice(0, 5),
    signals,
  };
}

// Build the scoring inputs from raw Bitbucket API data.
// Pure function: no network calls, so it is unit-testable.
export function buildSignals(input: {
  pr: BitbucketPullRequest;
  diffstat: BitbucketDiffstatEntry[];
  commitCount: number;
  authorMergedPrCount: number | null;
}): PullRequestSignals {
  let linesChanged = 0;
  let testFilesChanged = 0;
  let sourceFilesChanged = 0;

  for (const entry of input.diffstat) {
    linesChanged += (entry.lines_added ?? 0) + (entry.lines_removed ?? 0);
    const path = entry.new?.path ?? entry.old?.path ?? "";
    if (isTestPath(path)) {
      testFilesChanged += 1;
    } else if (path) {
      sourceFilesChanged += 1;
    }
  }

  const approvals = (input.pr.participants ?? []).filter(
    (p) => p.approved === true,
  ).length;

  return {
    linesChanged,
    filesChanged: input.diffstat.length,
    testFilesChanged,
    sourceFilesChanged,
    commitCount: input.commitCount,
    authorMergedPrCount: input.authorMergedPrCount,
    descriptionLength: (input.pr.description ?? "").trim().length,
    approvals,
  };
}
