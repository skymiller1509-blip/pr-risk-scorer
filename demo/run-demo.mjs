// Demo runner: scores the sample pull request in demo/sample-pr.json
// and prints what the Bitbucket panel would show. No Forge login,
// no Bitbucket account, no network needed. Run with `npm run demo`.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildSignals, scorePullRequest } from "../build-test/scoring.js";

const dir = dirname(fileURLToPath(import.meta.url));
const sample = JSON.parse(readFileSync(join(dir, "sample-pr.json"), "utf8"));

const signals = buildSignals(sample);
const result = scorePullRequest(signals);

console.log(`Pull request #${sample.pr.id}: ${sample.pr.title}`);
console.log(`Author: ${sample.pr.author.display_name}`);
console.log(`Risk score: ${result.score} / 100 — ${result.band} risk`);
console.log("");
console.log("Why this score:");
for (const reason of result.reasons) {
  console.log(`  ${reason.points > 0 ? "+" : ""}${reason.points} — ${reason.text}`);
}
console.log("");
console.log("What was checked:");
console.log(`  Lines changed: ${signals.linesChanged}`);
console.log(`  Files changed: ${signals.filesChanged}`);
console.log(`  Test files changed: ${signals.testFilesChanged}`);
console.log(`  Commits: ${signals.commitCount}`);
console.log(`  Author's merged PRs in this repo: ${signals.authorMergedPrCount}`);
console.log(`  Approvals: ${signals.approvals}`);
