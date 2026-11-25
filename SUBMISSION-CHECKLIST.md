# Submission checklist — Pull Request Risk Scorer (Codegeist 2026)

Event: Codegeist 2026, on Devpost. Category: **Apps for Software Teams**.
Deadline: **22 Dec 2026, 21:00 WAT** (12:00 Pacific).
Prizes: $120,000+ — 1st $15,000 x3, 2nd $8,000 x3, 3rd $5,000 x3, plus four bonus groups of 6 x $1,500 (Rovo agents, Atlassian MCP, Teamwork Graph, Marketplace published app).
Official page: https://codegeist2026.devpost.com/ (rules at /rules)
Judging 5 Jan – 3 Feb 2027; winners around 15 Feb 2027.

## Status key

- `[x] done` — verified finished
- `[ ] todo` — still to do
- `[E]` Eddie's step — only he can do it
- `[M]` Mabel's step

## Criterion zero — eligibility floor (check first)

- [x] done — Build is complete: 9/9 tests pass, `tsc --noEmit` passes, demo scores the sample PR 85/100 High risk
- [x] done — Solo is allowed (rules: open to individuals, teams and organisations; Nigeria is not on the excluded-countries list)
- [x] done — README has tagline, demo-video slot, what/why, tech stack, try-it-yourself, honest limits
- [ ] todo — **BLOCKED on Eddie's Atlassian account:** no account exists yet, so `forge deploy`, `forge install`, the panel in a real pull request, and the installation link are all untested. The installation link is a required submission field.
- [ ] todo — Public GitHub repo (not created yet)
- [ ] todo — Demo video under 5 minutes, public on YouTube (record per `VIDEO-SCRIPT.md` — sample-PR demo only, never claim a live Bitbucket run)
- [ ] todo — Devpost form submitted by 22 Dec 2026, 21:00 WAT — submit at least 30 minutes early, and at least one week early if the event shows an eligibility-review step

## Submission items

- [x] done — Scoring logic tested (9 tests); manifest checked field-for-field against Atlassian's official Bitbucket example manifest
- [x] done — Demo that works without any account: `npm test`, `npm run demo` (sample PR 42, "Rewrite the checkout flow", 85/100 High)
- [ ] todo — Free Atlassian account created [E]
- [ ] todo — API token with Forge scope made and kept in the Secure Vault, never in chat [E]
- [ ] todo — `forge register`, `forge deploy`, `forge install` on a demo site [M, once the account/token exist]
- [ ] todo — Installation link made in the developer console (Distribution → Edit → Sharing) and copied [M]
- [ ] todo — Public repo created and this folder pushed [E]
- [ ] todo — Demo video link pasted into README and into the Devpost form [E]
- [ ] todo — Devpost form: category (Apps for Software Teams), installation link, video link, explanation of how the app meets the tech requirement (Forge + Bitbucket panel module + read-only REST API)
- [ ] todo — No Marketplace listing needed for the main prizes (only for that bonus) — do not chase it
- [ ] todo — Open every link after submitting and check each one works

## Eddie's steps [E]

- [E] Make a free Atlassian account at id.atlassian.com (on his phone)
- [E] Make an API token with the Forge scope at id.atlassian.com/manage-profile/security/api-tokens; keep it in the Secure Vault, never in chat
- [E] Create the public GitHub repo and push this folder
- [E] Record the demo video (under 5 min, public on YouTube) — script in `VIDEO-SCRIPT.md`
- [E] Fill the Devpost form and submit by 22 Dec 2026, 21:00 WAT

## Mabel's steps [M]

- [M] Deploy and install with the Forge CLI once the account/token exist (note the VM quirk: `export XDG_CONFIG_HOME=/tmp/forge-config`, run `forge --non-interactive settings set usage-analytics false` once)
- [M] Make the installation link in the developer console
- [M] Draft the Devpost description and tech-requirement explanation from the README

## Payout / KYC

- [ ] todo — Prizes are cash amounts listed above. Payout route and any identity check not yet confirmed — check the Devpost rules page and record it here before submitting.

## Do-not-touch rule

- After submitting, do not edit the repo, the live install, or the video until winners are announced. (The Forge free dev site lasts 90 days — check it is still live through judging.)
