// Scoring tests. Run with `npm test` from pr-risk-scorer/.
// The scoring module is compiled to build-test/ first (see package.json).
// Expected scores are worked out by hand from the table in src/scoring.ts.

import test from "node:test";
import assert from "node:assert/strict";
import {
  bandForScore,
  buildSignals,
  isTestPath,
  scorePullRequest,
} from "../build-test/scoring.js";

const base = {
  linesChanged: 40,
  filesChanged: 2,
  testFilesChanged: 1,
  sourceFilesChanged: 1,
  commitCount: 2,
  authorMergedPrCount: 12,
  descriptionLength: 200,
  approvals: 0,
};

test("small clean PR scores 0, Low", () => {
  const r = scorePullRequest({ ...base, approvals: 1 });
  assert.equal(r.score, 0); // 1 approval is -5, clamped at 0
  assert.equal(r.band, "Low");
});

test("huge PR with no tests, new author, no description scores 100, High", () => {
  const r = scorePullRequest({
    linesChanged: 2500, // +40
    filesChanged: 30, // +20
    testFilesChanged: 0,
    sourceFilesChanged: 30, // +15 no tests
    commitCount: 12, // +10
    authorMergedPrCount: 0, // +15
    descriptionLength: 0, // +10
    approvals: 0,
  });
  assert.equal(r.score, 100); // 110 raw, clamped to 100
  assert.equal(r.band, "High");
  assert.equal(r.reasons[0].points, 40);
  assert.match(r.reasons[0].text, /Very large change/);
});

test("medium PR scores 50, Medium", () => {
  const r = scorePullRequest({
    linesChanged: 400, // +20
    filesChanged: 12, // +10
    testFilesChanged: 0,
    sourceFilesChanged: 12, // +15 no tests
    commitCount: 3,
    authorMergedPrCount: 3, // +5
    descriptionLength: 120,
    approvals: 0,
  });
  assert.equal(r.score, 50);
  assert.equal(r.band, "Medium");
});

test("two approvals lower the score by 10", () => {
  const mid = {
    linesChanged: 400,
    filesChanged: 12,
    testFilesChanged: 0,
    sourceFilesChanged: 12,
    commitCount: 3,
    authorMergedPrCount: 3,
    descriptionLength: 120,
    approvals: 0,
  };
  assert.equal(scorePullRequest(mid).score, 50);
  assert.equal(scorePullRequest({ ...mid, approvals: 2 }).score, 40);
  // A third approval does not lower it further (cap of -10).
  assert.equal(scorePullRequest({ ...mid, approvals: 5 }).score, 40);
});

test("band boundaries: 25 is Low, 30 is Medium, 60 is High", () => {
  assert.equal(bandForScore(25), "Low");
  assert.equal(bandForScore(29), "Low");
  assert.equal(bandForScore(30), "Medium");
  assert.equal(bandForScore(59), "Medium");
  assert.equal(bandForScore(60), "High");
  assert.equal(bandForScore(100), "High");
});

test("unknown author history skips the author factor", () => {
  const r = scorePullRequest({
    linesChanged: 150, // +10
    filesChanged: 5,
    testFilesChanged: 1,
    sourceFilesChanged: 4,
    commitCount: 1,
    authorMergedPrCount: null,
    descriptionLength: 80,
    approvals: 0,
  });
  assert.equal(r.score, 10);
  assert.equal(r.band, "Low");
  assert.ok(!r.reasons.some((x) => x.text.includes("Author")));
});

test("reasons are biggest first and at most 5", () => {
  const r = scorePullRequest({
    linesChanged: 2500,
    filesChanged: 30,
    testFilesChanged: 0,
    sourceFilesChanged: 30,
    commitCount: 12,
    authorMergedPrCount: 0,
    descriptionLength: 0,
    approvals: 0,
  });
  assert.ok(r.reasons.length <= 5);
  for (let i = 1; i < r.reasons.length; i++) {
    assert.ok(
      Math.abs(r.reasons[i - 1].points) >= Math.abs(r.reasons[i].points),
      "reasons must be sorted biggest first",
    );
  }
});

test("test path detection", () => {
  assert.equal(isTestPath("src/app.py"), false);
  assert.equal(isTestPath("tests/test_app.py"), true);
  assert.equal(isTestPath("src/app.test.ts"), true);
  assert.equal(isTestPath("src/app.spec.js"), true);
  assert.equal(isTestPath("__tests__/app.test.tsx"), true);
  assert.equal(isTestPath("test_data/fixtures.json"), false);
});

test("buildSignals counts lines, tests and approvals from API data", () => {
  const signals = buildSignals({
    pr: {
      id: 7,
      title: "Add login",
      description: "Adds login.",
      author: { uuid: "{abc}", display_name: "Ada" },
      participants: [
        { approved: true, user: { uuid: "{x}" } },
        { approved: false, user: { uuid: "{y}" } },
      ],
    },
    diffstat: [
      { lines_added: 100, lines_removed: 20, new: { path: "src/login.py" } },
      { lines_added: 30, lines_removed: 0, new: { path: "tests/test_login.py" } },
      { lines_added: 5, lines_removed: 5, new: { path: "README.md" } },
    ],
    commitCount: 4,
    authorMergedPrCount: 2,
  });
  assert.equal(signals.linesChanged, 160);
  assert.equal(signals.filesChanged, 3);
  assert.equal(signals.testFilesChanged, 1);
  assert.equal(signals.sourceFilesChanged, 2);
  assert.equal(signals.commitCount, 4);
  assert.equal(signals.approvals, 1);
  assert.equal(signals.descriptionLength, 11);

  const r = scorePullRequest(signals);
  // 160 lines +10, author 2 merged +5, short description +10, 1 approval -5 = 20
  assert.equal(r.score, 20);
  assert.equal(r.band, "Low");
});
