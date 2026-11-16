# Accessibility statement

This page says what the portal does for accessibility, which checks run in CI, where the known gaps are and how to report a barrier. It describes the code in this repository. It makes no claim about any conformance level, because no test in this repository proves one.

## What the portal does

- The page language is set to Indonesian (`lang="id"`) on the root `html` element.
- The portal follows the color scheme of the system by default and offers a light and a dark theme. The dark theme changes the focus outline color.
- Animations and transitions shrink to a near zero duration under `prefers-reduced-motion`.
- A "Lewati ke konten" link at the top of the app shell becomes visible on keyboard focus and jumps to the main content.
- Interactive elements get a focus outline from a global `:focus-visible` rule in `src/app/globals.css`.
- Icon only controls carry an `aria-label`. The logos that sit beside a visible name have an empty `alt`.
- Some status messages use `aria-live` or a `role` of `alert` or `status`.

## What CI checks

- ESLint with the Next.js config runs on every pull request. The config turns on six `jsx-a11y` rules, which check image alt text and the validity of ARIA attributes and roles. They are set to warn, so a finding shows in the output and does not fail the check.
- Nothing in CI measures color contrast, runs an accessibility engine such as axe, or drives the app with a keyboard or a screen reader.

An automated lint finds only part of the possible barriers. A clean lint does not mean that the pages are free of barriers.

## Known limitations

- Nobody has audited the portal with a screen reader or other assistive technology.
- Nobody has measured the contrast of the color tokens in both themes.
- The printed QR label sheet and the downloadable ticket image are visual outputs. The ticket image is a picture and has no text alternative.
- The portal is in Indonesian only.

## Report a barrier

Report a barrier by email to **hi@labmgm.org**, the same address that [SECURITY.md](SECURITY.md) uses. You can also open an issue with the [bug report form](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/issues/new?template=bug_report.yml) and say that it is an accessibility barrier.

Describe the page, what you tried to do, where it went wrong and which browser and assistive tools you use. The maintainer reads reports as time allows and does not promise a reply time. Do not use a public issue for a security problem, and follow [SECURITY.md](SECURITY.md) for those.
