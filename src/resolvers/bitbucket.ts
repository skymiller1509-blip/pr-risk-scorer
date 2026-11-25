// Bitbucket Cloud REST API calls, using the Forge `asApp` client.
// Pattern copied from Atlassian's official example app
// (forge-bitbucket-related-prs, Apache 2.0):
//   api.asApp().requestBitbucket(route`/2.0/repositories/...`)
// and routeFromAbsolute() to follow paginated `next` links.
// The app only reads pull request data, matching the manifest scope
// `read:pullrequest:bitbucket`. It never writes anything.

import api, { route, routeFromAbsolute } from "@forge/api";
import {
  BitbucketDiffstatEntry,
  BitbucketPullRequest,
} from "../types";

export const getPullRequest = async (
  workspaceId: string,
  repoId: string,
  prId: number,
): Promise<BitbucketPullRequest> => {
  const res = await api
    .asApp()
    .requestBitbucket(
      route`/2.0/repositories/${workspaceId}/${repoId}/pullrequests/${prId}`,
    );
  return res.json();
};

// Full diffstat, following pagination. Each entry has lines_added,
// lines_removed, and the new/old file path.
export const getDiffstat = async (
  workspaceId: string,
  repoId: string,
  prId: number,
): Promise<BitbucketDiffstatEntry[]> => {
  let resp = await api
    .asApp()
    .requestBitbucket(
      route`/2.0/repositories/${workspaceId}/${repoId}/pullrequests/${prId}/diffstat?pagelen=100`,
    );
  let result = await resp.json();
  const entries: BitbucketDiffstatEntry[] = result.values ?? [];

  while (result.next) {
    resp = await api.asApp().requestBitbucket(routeFromAbsolute(result.next));
    result = await resp.json();
    entries.push(...(result.values ?? []));
  }

  return entries;
};

// The commits list response has a `size` field with the total count,
// so one page of 1 is enough to learn how many commits there are.
export const getCommitCount = async (
  workspaceId: string,
  repoId: string,
  prId: number,
): Promise<number> => {
  const res = await api
    .asApp()
    .requestBitbucket(
      route`/2.0/repositories/${workspaceId}/${repoId}/pullrequests/${prId}/commits?pagelen=1`,
    );
  const result = await res.json();
  return typeof result.size === "number" ? result.size : 0;
};

// How many pull requests this author has merged in this repository.
// Uses a BBQL query on the pull requests list; `size` is the total.
// Returns null if the query fails, so the caller can skip the author
// factor instead of failing the whole panel.
export const getAuthorMergedCount = async (
  workspaceId: string,
  repoId: string,
  authorUuid: string | undefined,
): Promise<number | null> => {
  if (!authorUuid) return null;
  try {
    const query = `author.uuid="${authorUuid}" AND state="MERGED"`;
    const res = await api
      .asApp()
      .requestBitbucket(
        route`/2.0/repositories/${workspaceId}/${repoId}/pullrequests?q=${query}&pagelen=1`,
      );
    const result = await res.json();
    return typeof result.size === "number" ? result.size : null;
  } catch {
    return null;
  }
};
