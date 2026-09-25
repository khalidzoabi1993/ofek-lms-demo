# Meeting-demo verification — 25 September 2026

Performed through the browser against the local frontend and the actual Supabase project.

| Check | Observed result |
|---|---|
| Sign in | Supabase presenter account accepted |
| Import original SCORM 2004 archive | Catalog accepted; SHA-256 verified |
| Assign course | Four separate fictional learner assignments saved |
| Launch advanced course | Original Rustici content loaded in iframe; SCORM Initialize and location visible |
| Submit mixed quiz answers | Original course reported score 73, 15 questions, four incorrect responses |
| Teacher report | Same score, questions and evidence-based topic recommendations displayed |
| Cloud persistence | Reload retained score and assignments; independent authenticated API read confirmed score 73 |
| Access control | Missing/invalid bearer token rejected; anonymous table access rejected; foreign-owner read empty and write rejected |
| Local ZIP upload | Basic SCORM 1.2 archive selected with native file chooser and imported |
| Genially embedding | User-supplied unit displayed inside assigned learner view; explicitly no score capture |
| Workflow simulator | 89% coverage blocked staging; current-revision approvals, coverage and manual acceptance allowed simulated release |
| Real CI | First GitHub Actions run succeeded: https://github.com/khalidzoabi1993/ofek-lms-demo/actions/runs/36093815818 |

Automated domain/runtime tests measure 100% lines, 100% functions and more than 98% branches combined. This is **not whole-system coverage**. UI/Edge Function coverage, production student authorization and broad SCORM compatibility are not claimed. Human product acceptance remains pending.

Genially source: https://view.genially.com/6888260819c2db6967dce6cb
Genially tracking integration documentation: https://genially.com/features/lms-integration/

Additional browser check: SCORM 1.2 course was opened, advanced by two pages, closed and reopened. Its original resume confirmation appeared and returned to the saved scoring page.


## TES-58 — Genially playback follow-up, 25 September 2026

- Reproduced: the two YouTube anchors in the supplied Genially use `target="_top"`; clicking them in the old sandbox left the LMS URL unchanged.
- Added only user-activated top navigation to this allowlisted external course iframe; scripted top navigation remains disallowed. SCORM iframe policy unchanged.
- Verified on the deployed private Site: the original video hotspot now navigates to YouTube `5KLPxDtMqe8` (Your Brain is Plastic); Back returns to the LMS.
- Added a separate YouTube link using a new tab so the LMS can stay open. Confirmed a separate tab opened.
- Verified the labeled fullscreen button expands the existing player, switches to a return button, and retains the open Genially information window after returning. A CSS expansion fallback is included for unsupported/denied fullscreen; that fallback was not forced in this browser.
- Existing 10 automated core tests pass: 100% lines/functions and 98.46% branches in the two measured core modules. This does not measure the browser integration or whole system.
- Local preview's third-party iframe stayed blank in this IAB session; the deployed HTTPS Site loaded and was used for the interaction checks above.
- Public-link mode still records opens/window duration only, not quiz responses or video completion.
