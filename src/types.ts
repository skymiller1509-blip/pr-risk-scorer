// Types for the Pull Request Risk Scorer.
// These mirror the shapes returned by the Bitbucket Cloud REST API v2.0
// (see src/resolvers/bitbucket.ts) and the score the panel displays.

export interface PullRequestSignals {
  // Total lines added + removed across the whole pull request.
  linesChanged: number;
  // Number of files touched by the pull request.
  filesChanged: number;
  // Number of those files that look like tests.
  testFilesChanged: number;
  // Number of those files that look like source code (not tests).
  sourceFilesChanged: number;
  // Number of commits on the pull request.
  commitCount: number;
  // Merged pull requests by this author in this repository, all time.
  // null means the author history lookup failed and the factor is skipped.
  authorMergedPrCount: number | null;
  // Length of the pull request description in characters.
  descriptionLength: number;
  // Participants who have approved the pull request.
  approvals: number;
}

export interface RiskReason {
  // Points this factor added to the score (negative = it lowered the score).
  points: number;
  // Plain-language explanation, shown in the panel.
  text: string;
}

export type RiskBand = "Low" | "Medium" | "High";

export interface RiskScore {
  // 0-100. Higher means riskier.
  score: number;
  band: RiskBand;
  // Contributing factors, biggest first. At most 5.
  reasons: RiskReason[];
  signals: PullRequestSignals;
}

// Minimal shapes from the Bitbucket API used by buildSignals().
export interface BitbucketPullRequest {
  id: number;
  title: string;
  description?: string | null;
  author?: { uuid?: string; display_name?: string } | null;
  participants?: Array<{
    approved?: boolean;
    user?: { uuid?: string } | null;
  }> | null;
}

export interface BitbucketDiffstatEntry {
  lines_added?: number;
  lines_removed?: number;
  new?: { path?: string } | null;
  old?: { path?: string } | null;
}

export interface RiskScoreResponse extends RiskScore {
  pr: { id: number; title: string; authorName: string };
}
