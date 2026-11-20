# CI/CD

Every pull request and every merge to `main` of `github.com/MGM-Laboratory/mgm-inventaris-portal-frontend` runs the workflows below. `main` is protected. Every change goes through a branch, a pull request and the required checks, and it is merged with a merge commit, never squash or rebase.

The portal is not deployed from this repository yet. The `Dockerfile` builds the production image of the frontend, and the workflow `Docker` builds, scans and signs it. A prototype demo runs on a separate Vercel project, which this repository does not configure.

## GitHub Actions workflows

| Workflow       | Triggers                                              | What it does                                                                                                                    |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| CI             | Pull request, push to `main`, manual                  | Installs with `npm ci`, runs ESLint and the production build. The build also type checks. The job `CI gate` summarizes the run. |
| Config lint    | Pull request, push to `main`, manual                  | Actionlint, Zizmor, ShellCheck, Hadolint for the Dockerfile, ls-lint for file names and the Renovate validator. The job `Config gate` summarizes the run.                |
| Security       | Pull request, push to `main`, Mondays 03:00 UTC, manual | CodeQL, dependency review (pull requests only), gitleaks and a Trivy filesystem scan. Gitleaks, dependency review and Trivy fail on a finding. Trivy fails on a CRITICAL or HIGH finding and also sends its findings to code scanning. CodeQL sends its findings to code scanning and fails only when the tool itself fails. OSSF Scorecard runs on the schedule and by hand. The job `Security gate` summarizes the run. |
| Docker | Pull request, push to `main`, tags `v*.*.*`, manual | Builds the image of the `Dockerfile` for amd64 and arm64 (amd64 only on a pull request), pushes it to GitHub Container Registry by digest, joins the platforms under the tags, scans it with Trivy, attaches a CycloneDX SBOM attestation and signs it with cosign (keyless, classic `.sig` format). A pull request from a fork or from a bot only builds. |
| Commit messages | Pull request                                         | Runs commitlint on every commit and checks that the title follows Conventional Commits. The job is named `Conventional commits`. |
| Release Please | Push to `main`, manual | Opens and updates the release pull request, and creates the tag `vX.Y.Z` and the GitHub release when that pull request is merged. The job `Release PR and tag` builds a token from the release GitHub App `syafa-bot`. |
| Pull request format | Pull request | Checks the branch name, the label, the assignee, that the body holds only bullets and that the bullets match the commits, not counting merge commits. The job is named `PR format`. |

The lint tools that run as Docker images (actionlint, Zizmor, ShellCheck, Hadolint and gitleaks) are pinned by digest in `.github/tools/Dockerfile`, which nothing builds. Renovate reads that file, so a bump there is the bump the jobs use. The action `.github/actions/pull-images` sends image pulls through `mirror.gcr.io` and logs in to Docker Hub only when the secret `DOCKERHUB_PULL_TOKEN` exists. The username comes from the variable `DOCKERHUB_USERNAME`.

## Required checks

The ruleset `main` on the default branch requires a pull request with a merge commit, resolved review threads, signed commits, up to date branches, and no deletion or force push. It has no bypass actor. It requires these status checks, all pinned to GitHub Actions.

- Conventional commits
- PR format
- CI gate
- Config gate
- Security gate

A second ruleset, `main-merge-and-approval`, requires one approving review and the approval of a code owner, and it allows only merge commits. It also has the rule `update`, so only the bypass team can merge into `main`. `.github/CODEOWNERS` names the owner. The team `mgm-inventaris-portal-maintainer` can bypass this second ruleset through a pull request, and it cannot bypass the first one. The bypass covers only the approval, the code owner review and the `update` rule. Signed commits, resolved threads, up to date branches and the five checks still apply to the team. A pull request from anyone else needs the approval of the owner. A Renovate pull request that changes `package.json` needs the owner as well, and a pull request that changes only `package-lock.json` needs any one approval.

## Releases

Release Please reads the Conventional Commits on `main` and keeps one release pull request open. Merging it writes `CHANGELOG.md`, raises the version in `package.json` and `package-lock.json`, creates the tag and publishes the GitHub release. `.release-please-manifest.json` holds the current version, and `release-please-config.json` starts the changelog at the commit named in `bootstrap-sha`.

The private key of the release GitHub App is the secret `RELEASE_APP_PRIVATE_KEY` of the environment `release`, which only `main` can use. The client id is the variable `RELEASE_APP_CLIENT_ID`. Two tag rulesets protect the tags `v*`. `release-tags` blocks deletion, force pushes and updates for everyone, and `release-tags-creation` lets only the release App create a tag. Releases are immutable.

The release pull request is opened by the App, so the owner can approve it, or merge it through the bypass team like any other pull request. Its title is `chore(main): release X.Y.Z`. Commits of the types `ci`, `docs`, `chore` and `build` do not start a release, and the first `fix` or `feat` after the commit in `bootstrap-sha` does. While the version is below 1.0.0, a breaking change raises the minor version and not the major one, because of `bump-minor-pre-major`. The release to 1.0.0 is a decision of the owner.

## pre-commit.ci

The pre-commit.ci GitHub app runs the hooks of `.pre-commit-config.yaml` on every pull request. They check for large files, case conflicts, broken JSON, TOML and YAML, merge conflict markers, symbolic links that do not resolve, private keys, a final newline, mixed line endings and trailing whitespace. The run is not a required check. `autofix_prs` is off, because the ruleset only accepts signed commits and the app would push an unsigned fix. A failing run needs a fix by hand. The app has no setting to turn its update pull requests off, so `autoupdate_schedule` is `quarterly`, the longest interval that it allows. Its update pull request carries unsigned commits and fails the required checks `Conventional commits` and `PR format`, so close it. Renovate moves the hook revisions through its `pre-commit` manager, with the commit type `ci`.

## Docker image

The `Dockerfile` has a build stage and a runtime stage on `node:24-alpine`, pinned by digest. The build runs `npm ci` and `npm run build`, and `next.config.ts` sets `output: "standalone"`, so the runtime stage copies only the standalone server, the static files and `public`. The runtime image has no npm, runs as the user `nextjs` and listens on port 3000. The route `/healthz` answers `{"status":"ok"}` and makes no call to the API, and the `HEALTHCHECK` reads it. The build argument `BUILD_ID` is the commit, so two builds of one commit write the same build id. The production build sends the headers `X-Content-Type-Options`, `Strict-Transport-Security` (one year, no subdomains), `X-Frame-Options` and `Referrer-Policy`. Hadolint checks the `Dockerfile` in the job `Hadolint`, with the settings in `.hadolint.yml`. The image is `ghcr.io/mgm-laboratory/mgm-inventaris-portal-frontend`, with the tags `latest` and `sha-<short sha>` from `main`, `pr-<number>` from a pull request and the version tags from a release. The Docker workflow never gets `workflow_call`, because a signature made through a caller would carry another identity. Trivy findings of the image go to code scanning and do not fail the run. The package of a new image starts private on GitHub, and the owner makes it public in the package settings.

## Naming rules

`.ls-lint.yml` sets the naming of files and folders. Folders are lowercase words joined by hyphens, with the Next.js forms for a dynamic segment, a route group, a private folder and a slot. Files are kebab case in every folder, because each folder entry repeats the shared rules, and Markdown files may also use capitals such as `README.md`. Workflows end with `.yaml` and every other YAML file in the root, in `.github` and in `docs` ends with `.yml`, also when its name has more dots, except `.pre-commit-config.yaml`, which pre-commit reads by that name.

## Dependency updates

Renovate opens the pull requests through the Mend Renovate GitHub app, which an owner of the organization has to install on the repository. `renovate.json` sets a weekly run on Monday before 07:00 Asia/Jakarta, a minimum release age of 7 days, grouped minor and patch updates, and approval on the dependency dashboard for a major update of an npm package or of a tool version in a workflow. Major updates of GitHub Actions and of the lint tool images are not held. Dependabot alerts are on and Dependabot security updates are off, so only Renovate opens version pull requests.

## Not set up yet

- Tests with coverage and Codecov. The repository has no test files yet.
- The mirror of the image to Docker Hub, the re-sign workflow and the repeatable build check.
- Prose linting, Lighthouse and browser tests.
