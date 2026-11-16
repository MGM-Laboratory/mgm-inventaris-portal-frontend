# Security Policy

## Supported scope

`MGM-Laboratory/mgm-inventaris-portal-frontend` is the frontend of the LabMGM inventory and loan portal. Today it is a prototype that keeps sample data in the browser and has no server, so it holds no real personal data. A backend, when it exists, gets its own policy.

## Reporting a vulnerability

If you find a security issue, such as a way to read or change data that you should not reach, an injection vector, or anything that could harm a future production deployment, please **do not open a public issue**.

Instead, email **hi@labmgm.org**, or use "Report a vulnerability" in the Security tab of the repository, with a description of the issue and its impact, the steps to reproduce it, and any relevant logs or screenshots.

You can expect an initial response within 7 days. We keep you updated while the issue is triaged and fixed, and we credit reporters who want it once a fix has shipped.

## How we respond

1. The maintainer reads the report and answers the reporter within 7 days.
2. The maintainer reproduces the problem, rates its impact, and tells the reporter the result.
3. The maintainer makes the fix in a private fork of a GitHub security advisory, or in a normal pull request when the change reveals little. It passes the same checks as any other change.
4. The fix ships in a release. The release notes say that a vulnerability was fixed, without detail that helps an attacker before the users can update.
5. The maintainer asks the reporter whether they want credit, and names them in the release notes after the fix has shipped if they do.

## Scope notes

- The sample data and the demo mode of the prototype are not secrets. The demo bar lets anyone become an Admin on purpose, and `HANDOVER.md` lists it as something to remove before real use.
- Automated scanning that could degrade the availability of a live deployment is not authorized. Run the app locally instead.
- Findings from the automated tooling in this repository (CodeQL, dependency review, secret scanning, Trivy, OSSF Scorecard) are triaged the same way as external reports.
