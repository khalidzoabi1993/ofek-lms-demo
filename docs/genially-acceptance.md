# TES-61 acceptance evidence — 25 September 2026

Manually exercised the real browser with the official, unmodified Genially Questions ZIP:

- Uploaded `ofek-genially-questions.zip` using the file chooser, verified the package and assigned it to demo learners.
- Launched as fictional learner Noa through the authenticated presenter workspace.
- Submitted all 10 questions using the vendor UI, intentionally including three wrong answers.
- Received raw score 70 and SCORM `failed`; the configured passing score is 80. Completion and pass are displayed separately.
- Found two distinct vendor questions with the same interaction ID (generic fill-in title). The report now preserves the vendor's distinct interaction indices for this exact vetted course. An automated regression exercises that collision.
- Saved and exited, refreshed the app, and opened the teacher report: 10 answers, 3 wrong, score 70, not passed.
- Independently queried Supabase: `course_id=genially-questions`, `student_id=noa`, score `70`, status `failed`, 10 interaction IDs. Existing learning records were preserved.
- Visually inspected the original quiz final screen. Vendor branding and assets remain unchanged.

Automated: 11 tests pass; domain/runtime coverage is 100% lines, 100% functions, 98.51% branches. This does not claim whole-application coverage. Syntax and all three sample integrity checks pass.

This is a vetted-sample upload flow: the ZIP is hash-verified and launches the pre-extracted original. Arbitrary course upload, independent student accounts, and certification as a full SCORM LMS remain outside this demonstration. Reporting depends on what the package sends; raw sort-order codes and vendor-provided question titles are preserved.
