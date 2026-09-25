# Ofek LMS meeting demo

A Hebrew, right-to-left LMS demonstration using existing, attributed Rustici SCORM packages. Built for a team meeting, with a real Supabase backend and an explicitly labelled development-process simulator.

## Working path

Sign in using the private presenter credentials supplied outside this repository. Import the advanced Golf sample ZIP, assign it to a fictional learner, switch to that learner's view, launch the original course, answer the quiz, and inspect the teacher report. Scores and question results come from the course. Insights use transparent rules, not an AI service.

- Relational PostgreSQL tables + JSONB for course reports, in Supabase.
- Supabase Auth and an Edge Function validating the user's token on every request.
- Row-level security isolates presenter workspaces by authenticated account.
- Resume bookmark, original SCORM 2004 question reports, SCORM 1.2 aggregate reports, CSV/JSON export.
- Only the two SHA-256 allowlisted samples are accepted; arbitrary uploaded HTML is not executed.

## Run locally

Node 22+ for tests; Python 3 for a static server:

```sh
npm run check
npm run test:coverage
python3 -m http.server 8877 --bind 127.0.0.1 --directory dist
```

`dist/config.js` contains only the public Supabase URL and anonymous client key. It is not a server credential. All cloud calls require a valid user's session. Never commit the private presenter password or service-role key.

## Actual delivery workflow

Jira tasks: [TES-58 learning](https://wiseapps.atlassian.net/browse/TES-58), [TES-59 data](https://wiseapps.atlassian.net/browse/TES-59), [TES-60 quality](https://wiseapps.atlassian.net/browse/TES-60).

GitHub Actions runs syntax checks, automated domain/runtime tests, a 90% lines/branches/functions coverage gate **for those two measured core modules**, sample-integrity validation and publishes evidence/artifact downloads. UI and Edge Function coverage are not included in that number. The user's eventual requirement is 90% across the system; that requirement is **not yet achieved or claimed** by this meeting prototype.

CodeRabbit is configured using the already-installed plan only. If the free allowance does not provide a review, the review remains pending. A human review and manual acceptance are still necessary. A config file alone does not enforce a required GitHub check: repository branch rules must require the actual available check names once established. This demo does not auto-merge.

Supabase deployment currently uses the authenticated CLI. GitHub Actions does **not** have cloud deployment secrets and does not claim automatic production deployment. Sites serves the static frontend.

## Deliberate boundaries

- Teacher/student switching is a presenter persona switch within one account, not separate authorization for real students.
- Development tickets with OFEK IDs, review buttons, coverage figures in the simulator, three environments and feature toggles are simulations. The TES Jira tickets and GitHub links are real.
- No paid upgrades or paid AI calls. No LLM connected.
- This is a small working demonstration, not a SCORM-certified engine or production LMS.
- Use fictional data only; do not use for real student assessment.
- Browser-to-course run-time calls are a local acknowledgement; the separate cloud indicator confirms remote persistence. Wait for it before closing the tab.

## Content attribution

Rustici Software Golf Examples: https://scorm.com/scorm-explained/technical-scorm/golf-examples/

Original archives, manifests and embedded attribution preserved. Creative Commons Attribution 3.0 US: https://creativecommons.org/licenses/by/3.0/us/. These are Rustici SCORM samples, not courses authored in Storyline. Original sample questions reveal their expected answers for demonstration purposes.

## Genially reference

The supplied public Learning Unit is available as an additional library item. It is embedded from Genially without copying or exporting its source. Only wrapper open/close duration is recorded; no quiz answers, scores, screen progress or completion are inferred. Actual tracking needs a suitable Genially export/integration and compatibility validation: https://genially.com/features/lms-integration/.

The meeting guide includes a reversible "new learning round" action: the existing library, assignments and attempts are retained as one backup before clearing the current presentation round. The previous round can be restored.
