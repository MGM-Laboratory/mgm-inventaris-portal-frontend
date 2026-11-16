# Contributing to the LabMGM inventory portal frontend

Thanks for taking the time to contribute. This repository is the frontend of the LabMGM inventory and loan portal. It is a Next.js app that runs on sample data in the browser. The backend is planned as a separate repository. Read `README.md` for what exists.

## Before you change code

- This is Next.js 16, which differs from older versions. Read the relevant guide in `node_modules/next/dist/docs/` before you write Next-specific code. `AGENTS.md` says the same.
- All data access goes through `src/lib/store.ts`. Do not read or write data in other files, because the backend work replaces that one file.
- Use the color tokens in `src/app/globals.css` and no ad-hoc colors. Every screen has to work in the light and the dark theme.
- Add tests with new logic when the repository has a test setup. A bug fix comes with a test that fails without it. When a change cannot be tested, say why in the pull request.
- ESLint checks the code and the build checks the types. CI fails a pull request on a lint error or a type error.
- Heavy work runs in CI. Push the branch and read the results there. Run a single narrow check locally only when CI cannot explain a failure.

## Workflow

There is no `dev` branch. Every change to `main` goes through a pull request.

1. Fork the repository, or branch directly if you are a collaborator.
2. Make your change.
3. Open a pull request against `main`. Keep it focused, because one discrete change is easier to review than a bundle.
4. Wait for the checks below. They have to be green, every review thread has to be resolved and the code owner has to approve the pull request. The maintainer team may bypass that approval, so the owner can merge their own pull request after the checks are green.
5. Only the maintainer merges, with a merge commit and never a squash or a rebase. Nobody can push to `main` directly, and every commit has to be signed.

## Required checks

Every pull request runs the checks below. The ruleset of the repository requires them.

- **Conventional commits** reads every commit message and the title of the pull request.
- **PR format** reads the branch name, the label, the assignee and the body.
- **CI gate** runs lint and the production build.
- **Config gate** runs actionlint, Zizmor, ShellCheck, ls-lint for file names and the Renovate validator.
- **Security gate** summarizes CodeQL, dependency review, gitleaks and a Trivy filesystem scan. Gitleaks, dependency review and Trivy fail on a finding. Trivy fails on a CRITICAL or HIGH finding and also sends its findings to code scanning. CodeQL sends its findings to code scanning and fails only when the tool itself fails.
- **pre-commit.ci** is not required by the ruleset, but its report should be clean. It runs repository hygiene checks on every pull request and does not push a fix.

A lint warning or a deprecation notice in the output of a check is still something to fix before the pull request is done, even when it does not turn the check red.

## Local setup

```bash
npm install
npm run dev -- -p 3004   # http://localhost:3004
```

| Command         | What it does                                |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Start the development server.               |
| `npm run build` | Build for production. This also type checks. |
| `npm start`     | Serve the production build.                 |
| `npm run lint`  | Run ESLint.                                 |

Node 24 (`.nvmrc`) is used in CI. Next.js 16 needs Node 20.9 or newer.

## Commit messages

Use Conventional Commits (`type(scope): summary`) in English, with one of feat, fix, docs, style, refactor, perf, test, build, ci, chore or revert. Sign every commit so that GitHub shows it as verified. Do not mention an AI tool in a commit message, a trailer, the pull request text or a code comment.

## Pull requests

- Name the branch `type/short-description`, for example `fix/ticket-lookup`. The type is the same as the type of the commits.
- Write the title as a Conventional Commit, for example `fix(tiket): reject a wrong email on lookup`.
- The body is only the list of commits, one bullet for each commit.
- Add one label, `bug` for a fix, `enhancement` for a feature and `documentation` for docs only, and assign the pull request to yourself. A contributor without write access cannot assign it, so ask a maintainer to do it and then rerun the failed check.
- The check Conventional commits reads every commit message and the title. The check PR format reads the branch, the label, the assignee and the body. A bad commit message needs a rebase that rewords it and a force push to your own branch. For a missing label or assignee, add it and rerun the failed check.
- The maintainer merges with a merge commit, never a squash or a rebase.
