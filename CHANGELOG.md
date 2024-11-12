# Changelog

## [1.3.0](https://github.com/globus/static-search-portal/compare/1.2.0...1.3.0) (2024-11-12)


### Features

* Improves "globus.embed" behaviors ([#253](https://github.com/globus/static-search-portal/issues/253)) ([57a5a25](https://github.com/globus/static-search-portal/commit/57a5a25bfd3dfca798d122acd660d776a82ecd9e))


### Fixes

* Updates "globus.embed" fields to prompt for authorization when no session is found ([#255](https://github.com/globus/static-search-portal/issues/255)) ([bd25b05](https://github.com/globus/static-search-portal/commit/bd25b05de46cccd5f4ed7d3cf7d6d3fa235d8bf6))

## [1.2.0](https://github.com/globus/static-search-portal/compare/1.1.0...1.2.0) (2024-11-08)


### Features

* adds "globus.embed" field type support ([#243](https://github.com/globus/static-search-portal/issues/243)) ([baa2d7e](https://github.com/globus/static-search-portal/commit/baa2d7ee8b5271b1d58d6455e5096e077c19aecd))
* adds support for rendering embedded Globus assets as a Plotly graph or chart ([#248](https://github.com/globus/static-search-portal/issues/248)) ([272e4a6](https://github.com/globus/static-search-portal/commit/272e4a675c3e9008e90107cd68a41c15b61dfb79))


### Fixes

* Ensure application path is accounted for in OAuth redirects ([8fac9a1](https://github.com/globus/static-search-portal/commit/8fac9a178c49b01aef5ff83e0dc384a9d6fccfac))

## [1.1.0](https://github.com/globus/static-search-portal/compare/1.0.0...1.1.0) (2024-11-01)


### Features

* Adds support for `features.requireAuthentication` – this will update built-in routes to prompt for authentication before any information is displayed. This feature is useful for mostly/completely private Globus Search indicies. ([abdd9cf](https://github.com/globus/static-search-portal/commit/abdd9cff0c03724326dd98fcc070de36126c8f57))


### Fixes

* **OAuth:** Ensures users are redirected back to the path they initiated a "Sign In" request from. ([#236](https://github.com/globus/static-search-portal/issues/236)) ([abdd9cf](https://github.com/globus/static-search-portal/commit/abdd9cff0c03724326dd98fcc070de36126c8f57))

## [1.0.0](https://github.com/globus/static-search-portal/compare/0.12.0...1.0.0) (2024-11-01)


### ⚠ BREAKING CHANGES

* Use in-memory based storage for authorization tokens, by default. ([#235](https://github.com/globus/static-search-portal/issues/235))

### Features

* Use in-memory based storage for authorization tokens, by default. ([#235](https://github.com/globus/static-search-portal/issues/235)) ([427d9e7](https://github.com/globus/static-search-portal/commit/427d9e768bedde4f5dc3d367aa2f475355b36dde))


### Fixes

* Improves result rendering to account for 404s on hard refresh. ([#233](https://github.com/globus/static-search-portal/issues/233)) ([2dc2bbc](https://github.com/globus/static-search-portal/commit/2dc2bbcd1b77666c964c7d4ed97620a0d998e74e))

## [0.12.0](https://github.com/globus/static-search-portal/compare/0.11.0...0.12.0) (2024-10-22)


### Features

* **Transfer:** Adds `stat` integration for files added to the Transfer list. ([#219](https://github.com/globus/static-search-portal/issues/219)) ([e3d27f5](https://github.com/globus/static-search-portal/commit/e3d27f585e305be340986f80186f9e14ff780449))

## [0.11.0](https://github.com/globus/static-search-portal/compare/0.10.1...0.11.0) (2024-10-11)


### Features

* Adds support for rendering fields a links. ([#212](https://github.com/globus/static-search-portal/issues/212)) ([889d966](https://github.com/globus/static-search-portal/commit/889d966bcbef78fa38a86c28eabf3bdf2ef843f9))

## [0.10.1](https://github.com/globus/static-search-portal/compare/0.10.0...0.10.1) (2024-10-10)


### Fixes

* include basePath in publicRuntimeConfig ([0e4585f](https://github.com/globus/static-search-portal/commit/0e4585f82123b150f857b853f553309b6ea12aaa))

## [0.10.0](https://github.com/globus/static-search-portal/compare/0.9.0...0.10.0) (2024-10-10)


### Features

* Allows configuration of custom navigation using "attributes.content.navigation" ([#205](https://github.com/globus/static-search-portal/issues/205)) ([e9356b8](https://github.com/globus/static-search-portal/commit/e9356b8733ccef5ab18f75136aceb2da32453bb6))


### Fixes

* Improves default styling of Markdown components. ([e9356b8](https://github.com/globus/static-search-portal/commit/e9356b8733ccef5ab18f75136aceb2da32453bb6))
* Improves general layout styling. ([e9356b8](https://github.com/globus/static-search-portal/commit/e9356b8733ccef5ab18f75136aceb2da32453bb6))

## [0.9.0](https://github.com/globus/static-search-portal/compare/0.8.3...0.9.0) (2024-10-08)


### Features

* adds support for "content" directory and landing page customization ([#189](https://github.com/globus/static-search-portal/issues/189)) ([63b3319](https://github.com/globus/static-search-portal/commit/63b3319c808cb06e52cbcbea624b6407796f7b45))
* use 'primary' and 'secondary' colors for styling ([#192](https://github.com/globus/static-search-portal/issues/192)) ([0877f8e](https://github.com/globus/static-search-portal/commit/0877f8e169cbdc03e7fd8f9b62438ffcc19f2b01))

## 0.8.3 (2024-05-22)

## What's Changed
* chore: adds Apache-2.0 LICENSE by @jbottigliero in https://github.com/globus/static-search-portal/pull/59
* deps: bump the react group with 3 updates by @dependabot in https://github.com/globus/static-search-portal/pull/61
* deps: bump eslint-plugin-react-hooks from 4.6.1 to 4.6.2 by @dependabot in https://github.com/globus/static-search-portal/pull/62
* deps: bump @globus/sdk from 3.0.0-alpha.17 to 3.0.0 by @dependabot in https://github.com/globus/static-search-portal/pull/63
* deps: bump @types/node from 20.12.7 to 20.12.8 by @dependabot in https://github.com/globus/static-search-portal/pull/65
* deps: bump @globus/sdk from 3.0.0 to 3.1.0 by @dependabot in https://github.com/globus/static-search-portal/pull/64
* deps: bump jsonata from 2.0.4 to 2.0.5 by @dependabot in https://github.com/globus/static-search-portal/pull/75
* deps: bump @types/node from 20.12.8 to 20.12.11 by @dependabot in https://github.com/globus/static-search-portal/pull/73
* deps: bump framer-motion from 11.1.7 to 11.1.9 by @dependabot in https://github.com/globus/static-search-portal/pull/72
* deps: bump @globus/sdk from 3.1.0 to 3.2.0 by @dependabot in https://github.com/globus/static-search-portal/pull/74
* deps: bump framer-motion from 11.1.9 to 11.2.4 by @dependabot in https://github.com/globus/static-search-portal/pull/82
* deps: bump @types/node from 20.12.11 to 20.12.12 by @dependabot in https://github.com/globus/static-search-portal/pull/78
* deps: bump @globus/sdk from 3.2.0 to 3.3.0 by @dependabot in https://github.com/globus/static-search-portal/pull/79
* deps: bump @types/react from 18.3.1 to 18.3.2 in the react group by @dependabot in https://github.com/globus/static-search-portal/pull/76
* deps: bump typedoc-plugin-markdown from 3.17.1 to 4.0.2 by @dependabot in https://github.com/globus/static-search-portal/pull/80
* deps: bump framer-motion from 11.2.4 to 11.2.5 by @dependabot in https://github.com/globus/static-search-portal/pull/84
* deps: bump @globus/sdk from 3.3.0 to 3.3.1 by @dependabot in https://github.com/globus/static-search-portal/pull/83
* fix: ensure "Authorization" header is included when fetching a single result. by @jbottigliero in https://github.com/globus/static-search-portal/pull/85


**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.8.2...0.8.3

## 0.8.2 (2024-04-26)

## What's Changed
* deps: bump the react group with 4 updates by @dependabot in https://github.com/globus/static-search-portal/pull/56
* deps: bump the next group with 2 updates by @dependabot in https://github.com/globus/static-search-portal/pull/55
* deps: bump eslint-plugin-react-hooks from 4.6.0 to 4.6.1 by @dependabot in https://github.com/globus/static-search-portal/pull/57


**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.8.1...0.8.2

## 0.8.1 (2024-04-24)

## What's Changed
* fix: improved image rendering by providing source and more obvious 'View Image' button by @jbottigliero in https://github.com/globus/static-search-portal/pull/53


**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.8.0...0.8.1

## 0.8.0 (2024-04-23)

## What's Changed
* ops: run 'tsc' on CI by @jbottigliero in https://github.com/globus/static-search-portal/pull/51


**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.7.0...0.8.0

## 0.7.0 (2024-04-23)

**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.6.1...0.7.0

## 0.6.1 (2024-04-22)

**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.6.0...0.6.1

## 0.6.0 (2024-04-22)

## What's Changed
* deps: bump @fontsource/ibm-plex-mono from 5.0.12 to 5.0.13 by @dependabot in https://github.com/globus/static-search-portal/pull/46
* deps: bump @fontsource/ibm-plex-sans from 5.0.19 to 5.0.20 by @dependabot in https://github.com/globus/static-search-portal/pull/45
* feat: adds support for jsonata based references in static.json by @jbottigliero in https://github.com/globus/static-search-portal/pull/47


**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.5.1...0.6.0

## 0.5.1 (2024-04-19)

**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.5.0...0.5.1

## 0.5.0 (2024-04-19)

## What's Changed
* deps: bump the next group with 2 updates by @dependabot in https://github.com/globus/static-search-portal/pull/39
* deps: bump framer-motion from 11.1.1 to 11.1.7 by @dependabot in https://github.com/globus/static-search-portal/pull/43


**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.4.0...0.5.0

## 0.4.0 (2024-04-17)

## What's Changed
* feat: adds basic pagination and improved loading state by @jbottigliero in https://github.com/globus/static-search-portal/pull/37
* deps: bump @globus/sdk from 3.0.0-alpha.8 to 3.0.0-alpha.17 by @dependabot in https://github.com/globus/static-search-portal/pull/34


**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.3.0...0.4.0

## 0.3.0 (2024-04-17)

## What's Changed
* deps: bump typescript from 5.3.3 to 5.4.5 by @dependabot in https://github.com/globus/static-search-portal/pull/35
* deps: bump typedoc from 0.25.12 to 0.25.13 by @dependabot in https://github.com/globus/static-search-portal/pull/36


**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.2.2...0.3.0

## 0.2.2 (2024-04-16)

**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.2.1...0.2.2

## 0.2.1 (2024-04-16)

**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.2.0...0.2.1

## 0.2.0 (2024-04-16)

## What's Changed
* feat: adds support for globus.search.facet to generate filter UI based on configured facets and responses from the index by @jbottigliero in https://github.com/globus/static-search-portal/pull/28
* deps: bump the next group with 2 updates by @dependabot in https://github.com/globus/static-search-portal/pull/24
* deps: bump @types/react from 18.2.78 to 18.2.79 in the react group by @dependabot in https://github.com/globus/static-search-portal/pull/23
* deps: bump @emotion/styled from 11.11.0 to 11.11.5 by @dependabot in https://github.com/globus/static-search-portal/pull/27
* deps: bump eslint from 8.56.0 to 8.57.0 by @dependabot in https://github.com/globus/static-search-portal/pull/25
* deps: bump framer-motion from 10.18.0 to 11.1.1 by @dependabot in https://github.com/globus/static-search-portal/pull/30


**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.1.1...0.2.0

## 0.1.1 (2024-04-15)

## What's Changed
* deps: bump eslint-plugin-react from 7.33.2 to 7.34.1 by @dependabot in https://github.com/globus/static-search-portal/pull/1
* deps: bump @fontsource/ibm-plex-mono from 5.0.8 to 5.0.12 by @dependabot in https://github.com/globus/static-search-portal/pull/5
* deps: bump @types/node from 20.11.4 to 20.12.7 by @dependabot in https://github.com/globus/static-search-portal/pull/19
* deps: bump @types/react from 18.2.48 to 18.2.78 by @dependabot in https://github.com/globus/static-search-portal/pull/22
* deps: bump @types/react-dom from 18.2.18 to 18.2.25 by @dependabot in https://github.com/globus/static-search-portal/pull/20
* deps: bump @emotion/react from 11.11.3 to 11.11.4 by @dependabot in https://github.com/globus/static-search-portal/pull/2
* deps: bump @fontsource/ibm-plex-sans from 5.0.18 to 5.0.19 by @dependabot in https://github.com/globus/static-search-portal/pull/4

## New Contributors
* @dependabot made their first contribution in https://github.com/globus/static-search-portal/pull/1

**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.1.0...0.1.1

## 0.1.0 (2024-03-29)

**Full Changelog**: https://github.com/globus/static-search-portal/compare/0.0.0...0.1.0
