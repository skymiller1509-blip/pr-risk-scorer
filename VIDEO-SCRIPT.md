# Demo video script — Pull Request Risk Scorer (Codegeist 2026)

- Target length: **about 4 minutes** (event needs under 5 minutes, public on YouTube).
- Format: screen recording of the sample-PR demo that already works (`npm run demo`), read aloud in plain words. Do NOT claim a live Bitbucket run — the app has never run on a real Bitbucket site yet, and the video must say so.
- The sentence a judge should repeat an hour later: **"It scores a pull request 85 out of 100, High risk, and shows every reason why — before you read a line of code."**

## Hook options — pick the clearest, say it aloud, keep the best take

1. "85 out of 100. High risk. And it tells you exactly why."
2. "This pull request rewrites checkout. Would you wave it through? The scorer says no."
3. "A reviewer sees 1,400 changed lines. This tells them where to look first."

## Shot-by-shot script

### 0:00–0:05 — Hook (sound off must still work)

- On screen, big text: **"85 / 100 — HIGH RISK"**
- Behind the text: the terminal showing `Risk score: 85 / 100 — High risk`.
- Say: "85 out of 100. High risk. And it tells you exactly why."

### 0:05–0:20 — Problem, one sentence, one named user

- On screen: `demo/sample-pr.json` open, showing the title "Rewrite the checkout flow".
- Say: "Ada is a reviewer. A pull request lands that rewrites the whole checkout flow — over 1,400 lines changed, nine commits, no tests touched. She has to decide in seconds whether to read it carefully or wave it through. This is the Pull Request Risk Scorer, a Forge app for Bitbucket Cloud, built for Codegeist in the Apps for Software Teams category."

### 0:20–2:30 — The one live flow (DEMO — sample PR, not a live Bitbucket site)

Run `npm run demo` in the terminal on camera. Say clearly at the start of this section that this is a sample pull request, not a live Bitbucket run.

- **Run it (0:20–0:40).** Type `npm run demo` and press Enter. Say: "This is a demo with a sample pull request — pull request 42, 'Rewrite the checkout flow', by Ada. The app has not run on a real Bitbucket site yet, so I am showing the scoring on a sample first."
- **The score (0:40–1:00).** The output shows `Risk score: 85 / 100 — High risk`. Say: "85 out of 100. High risk. That is the headline — now here is why."
- **The reasons (1:00–2:00).** Scroll through the reasons as they print, one at a time: over 1,400 lines changed; 12 files touched; 9 commits; no test file changed; the author has zero merged pull requests in this repo; the description is two words — "rewrites checkout". Say each one in plain words: "Big change, lots of files, lots of commits, no tests changed, a first-time author in this repo, and a two-word description. Every point is a named rule, and every point is shown."
- **What was checked (2:00–2:30).** Show the "What was checked" lines: lines changed, files changed, test files changed, commits, author's merged PRs, approvals (zero). Say: "Nothing here is a guess about the code. It is size, history, and description — the things a reviewer checks first anyway."

### 2:30–3:00 — How it works (30 seconds, plain words)

- On screen: `manifest.yml` and `src/scoring.ts` open briefly.
- Say: "Underneath, it is a Forge app. It adds a Pull Request Risk panel to the pull request page in Bitbucket. When a pull request opens, it reads the details, the changed lines, and the author's history through the Bitbucket API — read-only, it never writes anything — and adds up the named rules into a score from 0 to 100: under 30 is Low, 30 to 59 is Medium, 60 and up is High. The scoring logic is tested — 9 tests, all passing."

### 3:00–3:30 — Honest limits (say them out loud)

- Say: "One honest limit, and it matters: this has never run on a real Bitbucket site. There is no Atlassian account yet, so the deploy, the install, and the panel in a real pull request are all untested. The scoring is tested; the live Bitbucket calls are written from Atlassian's official example app, but they have not run against the real API. And the score is a guide, not a verdict — it cannot see what the code does, only how big it is and who wrote it."

### 3:30–4:00 — What's next, and the close

- Say: "Next is a free Atlassian account, then deploy with the Forge CLI, install it on a demo site, and share the installation link so judges can try it on a real pull request. Pull Request Risk Scorer — it scores the pull request and shows every reason why, before you read a line of code."
- End screen, big text: **"85 / 100 — HIGH RISK. EVERY REASON SHOWN."**

## What NOT to say or show

- Do NOT show a Bitbucket page or say "here it is running in Bitbucket". There is no live install. The terminal demo is the demo.
- Do not claim the 85/100 came from a real pull request. It is sample PR 42 in `demo/sample-pr.json`.
- Do not claim a Marketplace listing exists. None is needed for the main prizes, and none has been made.
- Do not show any API token or Atlassian login on screen.

## Recording notes (phone)

- Android screen recorder: swipe down twice, tap Screen record, microphone ON, wait for the countdown.
- Turn on Do Not Disturb first, so no notification lands mid-take.
- Film in landscape. Terminal text must be readable: use a large font, zoom the terminal to 125% if you can, full screen, extra tabs closed.
- Run `npm run demo` once before recording so you know the output fits on screen and nothing errors.
- Add captions in CapCut (free) after recording — judges may watch with sound off.
- Record the hook (0:00–0:05) two or three times and keep the best take.
- Also save a separate 60-second insurance capture of `npm run demo` printing the 85/100 score, in case anything breaks on submission day.
