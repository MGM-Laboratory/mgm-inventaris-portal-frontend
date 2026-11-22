# Changelog

## [0.3.1](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/compare/v0.3.0...v0.3.1) (2026-11-22)


### Bug Fixes

* **api:** do not refresh the token again when the refresh itself answers csrf_failed, and test more routes ([1707259](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/1707259470ce005c1eb55fa0e4d3031b8a3e6f21))
* **api:** skip only the GET of the session route when the refresh answers csrf_failed ([e48b75a](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/e48b75a7f5616dc20a21a833f40c7dee8be5c59b))

## [0.3.0](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/compare/v0.2.0...v0.3.0) (2026-11-20)


### Features

* **api:** add the typed API client and the dev proxy for the backend ([4db2fd4](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/4db2fd493edea06f5eb1c82216b2919452187fc0))
* **api:** add the typed client, the error type, the session query and the query provider ([5c3a35c](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/5c3a35cb76bbf0f0908909f52a58516f66b38532))
* **dev:** proxy /api to the backend in development and document the settings ([a96f06b](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/a96f06b1e2c759f1b39670dbbbe1dee00e1c57c4))


### Bug Fixes

* **api:** keep the original 403 when the token refresh fails, ignore malformed details and send lists comma separated ([a219081](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/a219081124d03c18363bb1289ba447fc1dd5f22d))
* **api:** pin a release older than 7 days, parse only the token routes and harden the empty cases ([ed04655](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/ed04655a04f31eff1b9b1e41d64771770e2ae087))

## [0.2.0](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/compare/v0.1.2...v0.2.0) (2026-11-20)


### Features

* **docker:** add the production Dockerfile, the health route and the standalone output ([6593963](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/65939631badc340b8efba9d4765b3bc2f263ad1d))
* **docker:** add the production image of the frontend ([856be35](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/856be35bae2096e34be9f20d321f0b3b9049e788))
* **forms:** add the honeypot field to the guest sign in and the request form ([d8aabfc](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/d8aabfcaa6b54cebee0e8fd3b17b78cf8ca6578d))
* **forms:** prepare the forms and dates for the API contract ([39ca2fd](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/39ca2fd68b196b5be4db3581e80357f27418d793))


### Bug Fixes

* **dates:** read the year, month and day of today from one clock sample ([8473fc6](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/8473fc6f8f7f2a62a81c65b72be94bb212109403))
* **dates:** use the Jakarta date for today and compute the due date in UTC ([e98fffd](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/e98fffdc2b23e7fab99f510d11b9dd030cb40dee))
* **docker:** merge the two RUN lines of the runtime stage and note the font download ([b0992b4](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/b0992b43ab5944c8e7104263f9f838b011da6ce2))
* **forms:** guard bad dates, keep the caret in the ticket field and harden the honeypot ([176239e](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/176239efba6289702c24466f2eb087eaf954b46a))
* **lacak:** uppercase the ticket number as it is typed ([6b2adf0](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/6b2adf022f0ff5cca25cd5b6c306cd7f3c6ba4be))

## [0.1.2](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/compare/v0.1.1...v0.1.2) (2026-11-16)


### Bug Fixes

* **lint:** ban workflow names with four dots and a yml ending ([9b8a1f2](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/9b8a1f2d2d296eaf4a24d1127ec37e07a831ebc3))
* **lint:** ban yaml names with four dots and say which folders the ban covers ([de405d5](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/de405d563b346298fc0ed704ac097e488fb4aae6))
* **lint:** repeat the shared naming rules in every folder entry ([d087bf0](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/d087bf06635cea50f2c8bfeabcfe8cd2bc1ba663))
* **lint:** repeat the shared naming rules in every folder entry and ban dotted yaml names ([ca2801c](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/ca2801ce3d61ea7af8aa1acc94a0cbfb1cb4488a))

## [0.1.1](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/compare/v0.1.0...v0.1.1) (2026-11-16)


### Bug Fixes

* **assets:** encode the asset tag in the links to the asset page ([f15c54f](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/f15c54f43feb6b14e2f6eaa105612eea68ce46fa))
* **assets:** encode the asset tag in the links to the asset page ([c354f0e](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/c354f0e086dfb678e8099a6a96d947a1a11cebdb))
* **assets:** encode the tag in the other asset page URLs and the QR values ([c78d9ec](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/c78d9ecab601f167a7d247310d2022df57a2cd31))
* **pre-commit:** use a schedule value that pre-commit.ci accepts ([7e35072](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commit/7e35072e1a242fc64150b0b33626aef983de82c6))
