import Resolver from "@forge/resolver";
import { buildSignals, scorePullRequest } from "../scoring";
import {
  getAuthorMergedCount,
  getCommitCount,
  getDiffstat,
  getPullRequest,
} from "./bitbucket";
import { RiskScoreResponse } from "../types";

const resolver = new Resolver();

resolver.define(
  "getRiskScore",
  async (req: any): Promise<RiskScoreResponse> => {
    const { context } = req;
    const workspaceId = context.workspaceId;
    const repoId = context.extension.repository.uuid;
    const prId = context.extension.pullRequest.id;

    const pr = await getPullRequest(workspaceId, repoId, prId);
    const diffstat = await getDiffstat(workspaceId, repoId, prId);
    const commitCount = await getCommitCount(workspaceId, repoId, prId);
    const authorMergedPrCount = await getAuthorMergedCount(
      workspaceId,
      repoId,
      pr.author?.uuid,
    );

    const signals = buildSignals({
      pr,
      diffstat,
      commitCount,
      authorMergedPrCount,
    });
    const score = scorePullRequest(signals);

    return {
      ...score,
      pr: {
        id: pr.id,
        title: pr.title,
        authorName: pr.author?.display_name ?? "Unknown author",
      },
    };
  },
);

export const handler = resolver.getDefinitions();
