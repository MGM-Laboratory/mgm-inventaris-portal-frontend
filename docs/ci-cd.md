# CI/CD

Every pull request and every merge to `main` of `github.com/MGM-Laboratory/mgm-inventaris-portal-frontend` runs the workflows below. `main` is protected. Every change goes through a branch, a pull request and the required checks, and it is merged with a merge commit, never squash or rebase.

The portal is not deployed from this repository yet. There is no Dockerfile, no release automation and no image build. A prototype demo runs on a separate Vercel project, which this repository does not configure. Those parts join when the deployment is decided.

## GitHub Actions workflows

| Workflow       | Triggers                                              | What it does                                                                                                                    |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| CI             | Pull request, push to `main`, manual                  | Installs with `npm ci`, runs ESLint and the production build. The build also type checks. The job `CI gate` summarizes the run. |
| Config lint    | Pull request, push to `main`, manual                  | Actionlint, Zizmor, ShellCheck, ls-lint for file names and the Renovate validator. The job `Config gate` summarizes the run.                |
| Security       | Pull request, push to `main`, Mondays 03:00 UTC, manual | CodeQL, dependency review (pull requests only), gitleaks and a Trivy filesystem scan. Gitleaks, dependency review and Trivy fail on a finding. Trivy fails on a CRITICAL or HIGH finding and also sends its findings to code scanning. CodeQL sends its findings to code scanning and fails only when the tool itself fails. OSSF Scorecard runs on the schedule and by hand. The job `Security gate` summarizes the run. |
| Commit messages | Pull request                                         | Runs commitlint on every commit and checks that the title follows Conventional Commits. The job is named `Conventional commits`. |
| Pull request format | Pull request                                     | Checks the branch name, the label, the assignee and that the body holds only bullets. The job is named `PR format`.            |

The lint tools that run as Docker images (actionlint, Zizmor, ShellCheck and gitleaks) are pinned by digest in `.github/tools/Dockerfile`, which nothing builds. Renovate reads that file, so a bump there is the bump the jobs use. The action `.github/actions/pull-images` sends image pulls through `mirror.gcr.io` and logs in to Docker Hub only when the secret `DOCKERHUB_PULL_TOKEN` exists. The username comes from the variable `DOCKERHUB_USERNAME`.

## Required checks

The ruleset `main` on the default branch requires a pull request with a merge commit, resolved review threads, signed commits, up to date branches, and no deletion or force push. It has no bypass actor. It requires these status checks, all pinned to GitHub Actions.

- Conventional commits
- PR format
- CI gate
- Config gate
- Security gate

A second ruleset, `main-merge-and-approval`, requires one approving review and the approval of a code owner, and it allows only merge commits. It also has the rule `update`, so only the bypass team can merge into `main`. `.github/CODEOWNERS` names the owner. The team `mgm-inventaris-portal-maintainer` can bypass this second ruleset through a pull request, and it cannot bypass the first one. The bypass covers only the approval, the code owner review and the `update` rule. Signed commits, resolved threads, up to date branches and the five checks still apply to the team. A pull request from anyone else needs the approval of the owner. A Renovate pull request that changes `package.json` needs the owner as well, and a pull request that changes only `package-lock.json` needs any one approval.

## Naming rules

`.ls-lint.yml` sets the naming of files and folders. Folders are lowercase words joined by hyphens, with the Next.js forms for a dynamic segment, a route group, a private folder and a slot. Files are kebab case, and Markdown files may also use capitals such as `README.md`. Workflows end with `.yaml` and every other YAML file ends with `.yml`.

## Dependency updates

Renovate opens the pull requests through the Mend Renovate GitHub app, which an owner of the organization has to install on the repository. `renovate.json` sets a weekly run on Monday before 07:00 Asia/Jakarta, a minimum release age of 7 days, grouped minor and patch updates, and approval on the dependency dashboard for a major update of an npm package or of a tool version in a workflow. Major updates of GitHub Actions and of the lint tool images are not held. Dependabot alerts are on and Dependabot security updates are off, so only Renovate opens version pull requests.

## Not set up yet

- Release Please and the signed release tags need the release GitHub App and its secrets. Create the App before the first release.
- Tests with coverage and Codecov. The repository has no test files yet.
- A Dockerfile and the image build, scan and signing, which wait for the deployment decision.
- Prose linting, Lighthouse and browser tests.
