import { invoke } from "@forge/bridge";
import ForgeReconciler, {
  DynamicTable,
  Lozenge,
  Text,
} from "@forge/react";
import React, { useEffect, useState } from "react";
import { RiskScoreResponse } from "../types";

const bandAppearance = (band: string) => {
  switch (band) {
    case "Low":
      return "success";
    case "Medium":
      return "inprogress";
    case "High":
      return "removed";
    default:
      return "default";
  }
};

const App = () => {
  const [result, setResult] = useState<RiskScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    invoke("getRiskScore")
      .then((res: any) => setResult(res as RiskScoreResponse))
      .catch(() => setError("Could not load the risk score for this pull request."));
  }, []);

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!result) {
    return <Text>Scoring this pull request...</Text>;
  }

  const s = result.signals;

  return (
    <>
      <Text>
        Risk score: {result.score} / 100{" "}
        <Lozenge appearance={bandAppearance(result.band)}>
          {result.band} risk
        </Lozenge>
      </Text>
      <Text>
        {result.band === "Low" &&
          "Looks safe to review. Nothing here stands out as risky."}
        {result.band === "Medium" &&
          "Worth a careful look. A few things below add risk."}
        {result.band === "High" &&
          "High risk. Review this one slowly, or ask the author to split it up."}
      </Text>
      {result.reasons.length > 0 ? (
        <>
          <Text>Why this score:</Text>
          {result.reasons.map((reason, i) => (
            <Text key={i}>
              {reason.points > 0 ? "+" : ""}
              {reason.points} — {reason.text}
            </Text>
          ))}
        </>
      ) : (
        <Text>No risk factors found.</Text>
      )}
      <DynamicTable
        head={{
          cells: [
            { key: "metric", content: "What was checked" },
            { key: "value", content: "Value" },
          ],
        }}
        rows={[
          {
            key: "lines",
            cells: [
              { key: "metric", content: "Lines changed" },
              { key: "value", content: `${s.linesChanged}` },
            ],
          },
          {
            key: "files",
            cells: [
              { key: "metric", content: "Files changed" },
              { key: "value", content: `${s.filesChanged}` },
            ],
          },
          {
            key: "tests",
            cells: [
              { key: "metric", content: "Test files changed" },
              { key: "value", content: `${s.testFilesChanged}` },
            ],
          },
          {
            key: "commits",
            cells: [
              { key: "metric", content: "Commits" },
              { key: "value", content: `${s.commitCount}` },
            ],
          },
          {
            key: "author",
            cells: [
              { key: "metric", content: "Author's merged PRs in this repo" },
              {
                key: "value",
                content:
                  s.authorMergedPrCount === null
                    ? "unknown"
                    : `${s.authorMergedPrCount}`,
              },
            ],
          },
          {
            key: "approvals",
            cells: [
              { key: "metric", content: "Approvals" },
              { key: "value", content: `${s.approvals}` },
            ],
          },
        ]}
      />
      <Text>
        Scored for {result.pr.authorName} — pull request #{result.pr.id}.
        The score is a guide, not a verdict: a human still reviews the code.
      </Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
