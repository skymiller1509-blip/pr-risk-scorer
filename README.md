# Pull Request Risk Scorer — Codegeist 2026

A Forge app that scores every Bitbucket pull request 0–100.

## Demo video

> TODO — record the demo video (under 5 minutes, public on YouTube — see `VIDEO-SCRIPT.md`) and paste the link here.

## What it does and why

A Forge app for Bitbucket Cloud. It adds a **Pull Request Risk** panel to the
overview tab of every pull request. The panel shows a risk score (0-100),
a Low / Medium / High band, and the top reasons in plain language, so a
reviewer knows in seconds whether to read carefully or wave it through.

Category: **Apps for Software Teams** (the brief's example is literally
"smarter code reviews").

## Tech stack

- Atlassian Forge (Bitbucket `repoPullRequestOverviewPanel` module, UI Kit)
- TypeScript, Node.js
- Bitbucket REST API v2.0, read-only (`read:pullrequest:bitbucket` scope)
- Plain `node:test` (9 tests, no account needed)

## Rules, verified live 2026-11-23

- Source: https://codegeist2026.devpost.com/ and /rules
- Deadline: **22 Dec 2026, 12:00 Pacific = 21:00 WAT**
- Prizes: **$120,000+** — 1st $15,000 x3, 2nd $8,000 x3, 3rd $5,000 x3,
  plus four bonus groups of 6 x $1,500 (Rovo agents, Atlassian MCP,
  Teamwork Graph, Marketplace published app)
- Solo: **yes** — the rules say the hackathon is open to individuals,
  teams and organisations. Nigeria is not on the excluded-countries list.
- Submission needs: an **installation link** judges can use, a **demo video
  under 5 minutes, public on YouTube**, the category, the bonus prizes if
  any, and an explanation of how the app meets the tech requirement.
  A Marketplace listing is NOT needed for the main prizes (only for that
  bonus). Judging 5 Jan - 3 Feb 2027; winners around 15 Feb 2027.
- **Bitbucket fit: YES, native.** Forge has a `bitbucket:repoPullRequestOverviewPanel`
  module (verified in the official manifest reference) and official Bitbucket
  example apps that call the Bitbucket REST API with `asApp`. This app uses
  exactly that module and that API pattern. No Jira/Confluence fallback was
  needed.

## How the score works

The score is a transparent sum of named rules. Every point is explained
in the panel. The full table is in `src/scoring.ts`.

| Signal | Points |
|---|---|
| Lines changed: 101-300 / 301-800 / 801-2000 / 2000+ | +10 / +20 / +30 / +40 |
| Files touched: over 10 / over 25 | +10 / +10 more |
| Commits: over 5 / over 10 | +5 / +5 more |
| Source changed but no test file changed | +15 |
| Author has 0 merged PRs in this repo / 1-4 | +15 / +5 |
| Description under 50 characters | +10 |
| Each reviewer approval (max 2 counted) | -5 each |

Bands: 0-29 Low, 30-59 Medium, 60-100 High. Score is clamped to 0-100.

Data comes from the live Bitbucket REST API v2.0, read-only, as the app:
PR details, diffstat (paginated), commit count, and the author's merged-PR
count in the repo (BBQL query). Only scope needed:
`read:pullrequest:bitbucket`. The app never writes anything.

## What is built

```
pr-risk-scorer/
  manifest.yml            Forge manifest (Bitbucket panel + resolver function)
  src/
    scoring.ts            pure scoring logic + buildSignals (no Forge imports)
    types.ts              signal / score / Bitbucket shapes
    resolvers/
      bitbucket.ts        Bitbucket API calls (asApp + route, as in Atlassian's
                          official forge-bitbucket-related-prs example)
      index.ts            getRiskScore resolver
    index.ts              exports the resolver handler
    frontend/index.tsx    UI Kit panel: score, band, reasons, checked metrics
  tests/scoring.test.mjs  9 tests, plain node:test
  demo/
    sample-pr.json        a sample pull request (no Bitbucket needed)
    run-demo.mjs          prints what the panel would show for the sample
```

## Run it locally (no Atlassian account needed)

```bash
cd pr-risk-scorer
npm install
npm test        # 9 tests, all pass
npm run demo    # scores the sample PR: 85/100, High risk
npm run typecheck
```

## Deploy it (needs Eddie's Atlassian account)

Nothing below has been done yet, because every step needs Eddie's login.

1. Make a free Atlassian account at id.atlassian.com (Eddie's phone).
2. Make an API token with the Forge scope at
   id.atlassian.com/manage-profile/security/api-tokens. Keep it in the
   Secure Vault, never in chat.
3. In this VM:
   ```bash
   npm install -g @forge/cli
   export FORGE_EMAIL=<his Atlassian email>
   export FORGE_API_TOKEN=<his token>
   ```
4. Register and deploy:
   ```bash
   cd pr-risk-scorer
   forge register
   npm install
   forge deploy
   forge install --demo-site   # or install on a workspace, then share
   ```
   `forge register` adds the app id to manifest.yml. Only the developer
   who registered the app can deploy and install it.
5. Make the installation link for the judges in the developer console:
   Distribution, Edit, Sharing, save, copy the link.
6. Record the demo video (under 5 min, public on YouTube) and submit the
   Devpost form before 22 Dec 2026 21:00 WAT.

VM quirk: the Forge CLI cannot write its config under `~/.config` here
(chown fails). Use `export XDG_CONFIG_HOME=/tmp/forge-config` before any
`forge` command, and first run
`forge --non-interactive settings set usage-analytics false` once.

## Honest limits

- **Never run on a real Bitbucket site.** No Atlassian account exists yet,
  so `forge deploy`, `forge install`, the panel in a real pull request,
  and the installation link are all untested. The scoring logic is tested;
  the live Bitbucket calls are written from Atlassian's official example
  app and docs, but the exact calls have not run against the real API.
- **Author history is a rough signal.** It counts the author's merged PRs
  in the same repo, all time. It does not know whether those PRs were
  good, and if the BBQL query fails the factor is skipped silently
  (score without it, no reason shown).
- **Test detection is a filename heuristic** (`tests/` folders and
  `.test.` / `.spec.` files). A repo that names tests differently will
  score "no tests changed" wrongly.
- **The score is a guide, not a verdict.** It cannot see what the code
  does, only how big it is and who wrote it. The panel says so.
- **`forge lint` could not run.** It refuses without a registered app id,
  which needs Eddie's login. The manifest was instead checked by parsing
  it and comparing it field for field with Atlassian's official
  forge-bitbucket-related-prs manifest (same top-level shape; only the
  module type differs, and that module's properties come from the official
  manifest reference). `tsc --noEmit` passes on all source, including the
  UI Kit frontend.
- No paid services are used anywhere. The Forge free dev site lasts
  90 days. Nothing is submitted, no repo has been created.
