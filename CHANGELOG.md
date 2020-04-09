# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.7.3](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.2...v0.7.3) (2020-04-09)

### Bug Fixes

-   **app:** move editor info from home to edition view ([f0434cc](https://github.com/webern-unibas-ch/awg-app/commit/f0434cce4962f5ff7c06e8bfe1033e4b2c91c69a))
-   **app:** use rel attribute for target links instead of wrong ref attr ([04578ee](https://github.com/webern-unibas-ch/awg-app/commit/04578ee1bfa811613beb72bf0faa2084bbd88a2c))
-   **core:** add sagw logo to footer ([b41d013](https://github.com/webern-unibas-ch/awg-app/commit/b41d013deec3e30fca6ae03e1398676199b48a82))
-   **core:** remove MetaEdition from MetaModel ([010d02f](https://github.com/webern-unibas-ch/awg-app/commit/010d02f07173d93a152ec9fe0f48c81da4baa5fe))
-   **edition:** add dropdown for sample queries in graph view ([c995ada](https://github.com/webern-unibas-ch/awg-app/commit/c995ada1d10101b2e8fb3f0930b798f7b309d220))
-   **edition:** add modal hint on how to use graph ([626d024](https://github.com/webern-unibas-ch/awg-app/commit/626d0240f7e75ba9a6ad1d44ded459217ff8d579))
-   **edition:** add resp statement to work model ([d9eefae](https://github.com/webern-unibas-ch/awg-app/commit/d9eefae9f4f5ae15f55ce687d749cdf481b20941))
-   **edition:** do not remove all svg when redrawing force graph ([e6cfdac](https://github.com/webern-unibas-ch/awg-app/commit/e6cfdac716aadb11211834be0d6be8bb9266910d))
-   **edition:** improve general remarks for graph view ([b1b1c24](https://github.com/webern-unibas-ch/awg-app/commit/b1b1c2499080728b5f0ca144a512331094187a87))
-   **edition:** improve handling of triples dropdown button in force-graph ([c41925b](https://github.com/webern-unibas-ch/awg-app/commit/c41925b796815a1670fbc415bfb96541e89f30cc))
-   **edition:** improve query reset in graph view ([09e309c](https://github.com/webern-unibas-ch/awg-app/commit/09e309ca8dcfa0e6290e32cdbb1535a965d725dc))
-   **edition:** refactor EditionWork to provide all needed info ([0319790](https://github.com/webern-unibas-ch/awg-app/commit/03197908d689c59a0235a1a9616b362edf6eeeff))
-   **edition:** remove unused EditionDetailNotification ([4e1f151](https://github.com/webern-unibas-ch/awg-app/commit/4e1f15100fa6de68346c991d284825edf0318315))
-   **edition:** shorten short forms of some EditionConstants ([61a297d](https://github.com/webern-unibas-ch/awg-app/commit/61a297d8c5af924dc69ef096b67015143970982d))
-   **edition:** use full EditionRoute for EditionWork routes ([2c98f5d](https://github.com/webern-unibas-ch/awg-app/commit/2c98f5d39b28a4cf961cc9812dd8e160eeb054aa))
-   **edition:** use modal for edition detail hint & improve hint message ([0383470](https://github.com/webern-unibas-ch/awg-app/commit/0383470e67715b76898562329f3f90b1b34d1707))
-   **edition:** use queryList in graph data to allow multiple queries ([ca988f2](https://github.com/webern-unibas-ch/awg-app/commit/ca988f208a699045063679245effa200089afd69))
-   **home:** add sketch edition link to Opus 25 header ([aaeaa80](https://github.com/webern-unibas-ch/awg-app/commit/aaeaa801669f4d8a3a32823e0e8872d39f7f14ea))

### [0.7.2](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.1...v0.7.2) (2020-03-20)

### Features

-   **core:** expose gnd to inseri test-server ([9023915](https://github.com/webern-unibas-ch/awg-app/commit/9023915c6863d801e6198750e08af9daa4d5016e))
-   **edition:** add dynamic graph visualizer ([c6ec94b](https://github.com/webern-unibas-ch/awg-app/commit/c6ec94b4234c2e8121e3e8550528817d39ddef01)), ([89aa106](https://github.com/webern-unibas-ch/awg-app/commit/89aa106317c5a02be72dc89c53e748eca8e99ed1)), ([c0166ef](https://github.com/webern-unibas-ch/awg-app/commit/c0166ef8e9c3ebb73f27117717a1bed1cd787788)), ([b6f8935](https://github.com/webern-unibas-ch/awg-app/commit/b6f89355cafe2f2b0f8b0feeaf6529cb8ce922e1)), ([9db4968](https://github.com/webern-unibas-ch/awg-app/commit/9db49682ed27704434d88ceabb5f08f5d297f7ab)), ([6db5ba0](https://github.com/webern-unibas-ch/awg-app/commit/6db5ba02e794c202e2c6ef004095313f88be114d)), ([caf77c7](https://github.com/webern-unibas-ch/awg-app/commit/caf77c79f87442c084af17211b8eaa6ac870ec8e))
-   **edition:** add generalized prefix pipe ([af5163b](https://github.com/webern-unibas-ch/awg-app/commit/af5163be2a3c0a59a293595f661d1e580cd29b2c))
-   **edition:** add graph query service to handle rdfstore methods ([0f5e959](https://github.com/webern-unibas-ch/awg-app/commit/0f5e9593b3657bc0006cce18193e52f51c5f7ca1))
-   **edition:** add limiter for graph nodes ([fccab25](https://github.com/webern-unibas-ch/awg-app/commit/fccab250b9489294c5b318e48fa88d47b512f149))
-   **edition:** add no result component to force graph ([71d7eba](https://github.com/webern-unibas-ch/awg-app/commit/71d7eba616640b71a9e0b89391eb72b5f5700b1d))
-   **edition:** add zoom & drag to force graph ([1b640ba](https://github.com/webern-unibas-ch/awg-app/commit/1b640baa99b98cbecd17d594510b6c1d8ea56b00))

### Bug Fixes

-   **app:** adjust license to CC BY-SA-4.0 ([93e35a8](https://github.com/webern-unibas-ch/awg-app/commit/93e35a8904385752343f333107e1e7e310780aae))
-   **edition:** add missing textcritical comments for op. 25 Sk4 ([53313f7](https://github.com/webern-unibas-ch/awg-app/commit/53313f7002767b815443492f4ea7f8f504065036)), closes [#13](https://github.com/webern-unibas-ch/awg-app/issues/13)
-   **edition:** adjust inputs and outputs of ForceGraphComponent ([602ebe7](https://github.com/webern-unibas-ch/awg-app/commit/602ebe79dcf1214a1b224501c10d710f62152f2a))
-   **edition:** avoid loading of empty graph data ([d9e25cb](https://github.com/webern-unibas-ch/awg-app/commit/d9e25cbff46fa309e4130b905e6ed99447415fa0))
-   **edition:** close visualizer's triple and query panel by default ([8da4768](https://github.com/webern-unibas-ch/awg-app/commit/8da4768f4ee0a0740e66ae3b3699bafdc31c7790))
-   **edition:** fix import of rdfstore library ([1b01220](https://github.com/webern-unibas-ch/awg-app/commit/1b01220cb29573f95508daed70a6ef027a508d88))
-   **edition:** improve graph forces ([7ac5add](https://github.com/webern-unibas-ch/awg-app/commit/7ac5add177d3e06976485c93a49bde3cbe587d94))
-   **edition:** improve naming of graph visualizer service methods ([6bc12af](https://github.com/webern-unibas-ch/awg-app/commit/6bc12afd691a9bb19949733e8a90b51e2245acb0))
-   **edition:** improve resize listener for graph visualization ([9e91335](https://github.com/webern-unibas-ch/awg-app/commit/9e913352079b06436071c84457f1cc2ad795db14))
-   **edition:** make public variables public & type limits as number ([1bc539c](https://github.com/webern-unibas-ch/awg-app/commit/1bc539c8d38feaf85be0651211a4e9c83384255e))
-   **edition:** move all graph visualizer parts into separate module ([61d2c12](https://github.com/webern-unibas-ch/awg-app/commit/61d2c123d061151d75ad0225580a11dc75219654))
-   **edition:** move d3 calculations into separate service and models ([366c5a2](https://github.com/webern-unibas-ch/awg-app/commit/366c5a27b6f347a033f7bbeffe281e163615ae9d))
-   **edition:** move graph models into separate files ([d8ff681](https://github.com/webern-unibas-ch/awg-app/commit/d8ff681dc0d5d399a503594364b0ba77834b2c8d))
-   **edition:** pass down default height to force graph components ([dc0f1de](https://github.com/webern-unibas-ch/awg-app/commit/dc0f1def1ff31894f1a9665e0559fa83f3a6b21c))
-   **edition:** update triple data for graph visualizer ([3243296](https://github.com/webern-unibas-ch/awg-app/commit/324329618e314d20a46d45aac35adbec7d75f9be))
-   **edition:** use graphContainer for resize HostListener ([9865db9](https://github.com/webern-unibas-ch/awg-app/commit/9865db9ac22352c0b5b0ce2a2b1692c51abb1639))
-   **home:** add links to header titles ([f711afb](https://github.com/webern-unibas-ch/awg-app/commit/f711afb7dc84d3a5a8896b88bcd279b97d315201))

### [0.7.1](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.0...v0.7.1) (2020-02-10)

### Features

-   **core:** add RouterEventsService to store previous route ([23e3656](https://github.com/webern-unibas-ch/awg-app/commit/23e365690b35b6ec9f7169401f1d9fbe35883db9))
-   **core:** add StorageService ([bde1f1e](https://github.com/webern-unibas-ch/awg-app/commit/bde1f1eff3b49341d1ebf621cc5f535b4e9ec1e4)), closes [#5](https://github.com/webern-unibas-ch/awg-app/issues/5)
-   **core:** expose GND via postMessage to communicate with inseri ([80648c5](https://github.com/webern-unibas-ch/awg-app/commit/80648c5204a7bc0a46455491bff5de23497978f1)), relates to [nie-ine/inseri#388](https://github.com/nie-ine/inseri/issues/388)
-   **edition:** add almost complete TkA for op25 (Sk4 incomplete) ([3dabd8a](https://github.com/webern-unibas-ch/awg-app/commit/3dabd8af6b438088b7a87c65b2134b9e39f58dbe))
-   **edition:** make tka list toggleable per sketch ([01ec0fd](https://github.com/webern-unibas-ch/awg-app/commit/01ec0fd45db4f92e6e01e8364045c6a6df4bacce))
-   **edition:** prepare embedding of op25 sheets ([1f25f63](https://github.com/webern-unibas-ch/awg-app/commit/1f25f63148e61f00461496d25081a448a6310091))

### Bug Fixes

-   **app:** move GND exposition to PropsComp and GndService ([e44b332](https://github.com/webern-unibas-ch/awg-app/commit/e44b3324d092d2b799242c9a7b0d0a3cfce371a6), [98bd896](https://github.com/webern-unibas-ch/awg-app/commit/98bd896d6151c09d806fef1c82734e899a55d43d))
-   **core:** add removeItem method to StorageService ([19a6f8d](https://github.com/webern-unibas-ch/awg-app/commit/19a6f8d85548782397e836cd8fd802fb1d840628))
-   **core:** fix check for detecting Storage ([b5c4c08](https://github.com/webern-unibas-ch/awg-app/commit/b5c4c08bf370e9bb6048fa9775ab30ea8690ce45))
-   **core:** use StorageService to expose GND ([e591885](https://github.com/webern-unibas-ch/awg-app/commit/e591885d64977ae9ef87ab6bdc58193f323adefd))
-   **edition:** add missing content description of op. 25 ([29d1c34](https://github.com/webern-unibas-ch/awg-app/commit/29d1c34b7e31b0135982a9061085e75b1d781b90))
-   **edition:** add svg's with path information ([50d23ba](https://github.com/webern-unibas-ch/awg-app/commit/50d23ba0e6413f89f7f759ef8f023ea1296cbc94))
-   **edition:** adjust modal hint for op25 ([d6b4909](https://github.com/webern-unibas-ch/awg-app/commit/d6b4909428450716f320c568763feb7f19cdf4f9))
-   **edition:** get selectability of convolute item from data ([9fcb2dd](https://github.com/webern-unibas-ch/awg-app/commit/9fcb2ddff22f49a019c41c71fcf2d488dcd3fd75))
-   **edition:** handle placeholder for op. 12 Aa:SkI/1 ([ecbb32b](https://github.com/webern-unibas-ch/awg-app/commit/ecbb32b228438a19768ba8b83ef85ad07d7c90d0))
-   **edition:** improve folio handling and rendering ([8c871cc](https://github.com/webern-unibas-ch/awg-app/commit/8c871cc7f435910daea3789a0c2b111982904a29))
-   **edition:** move convolute logic to parent component (edition detail) ([7a9c5ed](https://github.com/webern-unibas-ch/awg-app/commit/7a9c5edaca439fe54a887de7afd75a42496e4dc6), [fb77f72](https://github.com/webern-unibas-ch/awg-app/commit/fb77f72aa9c817c8e0d09e2e9d204dfbf8508683))
-   **home:** adjust title of op. 25 ([9f1c9fc](https://github.com/webern-unibas-ch/awg-app/commit/9f1c9fc07960335d2e4c5c8bec0f7ace44054a9f))

## [0.7.0](https://github.com/webern-unibas-ch/awg-app/compare/v0.6.1...v0.7.0) (2020-02-05)

### ⚠ BREAKING CHANGES

-   **edition:** This change affects the url of the edition sheet view.
    Sketch id's are now provided via query params instead of "normal" route params.

### Features

-   **core:** write the GND value of a resource to the localStorage ([29234f5](https://github.com/webern-unibas-ch/awg-app/commit/29234f5ae995a5699613c93b5e2c475f6579cde3))
-   **edition:** add edition constants ([74f7156](https://github.com/webern-unibas-ch/awg-app/commit/74f715678ace35442ac7d92adaff3c40b4e802d5))
-   **edition:** add graph component with static graphs ([f7cf641](https://github.com/webern-unibas-ch/awg-app/commit/f7cf641e7cb9ca9c7fead047118dd8f2d2597048))
-   **edition:** add svg assets for op25 ([aac1f2f](https://github.com/webern-unibas-ch/awg-app/commit/aac1f2f7978bb899c41f7e73ddb92be177387357))
-   **edition:** add SvgSheetList to handle SvgSheet array ([f9a1c53](https://github.com/webern-unibas-ch/awg-app/commit/f9a1c53ec1473f1a91b09fdc3b04d6b8a74d543e))
-   **edition:** auto-instantiate EditionPath from class ([c7403dc](https://github.com/webern-unibas-ch/awg-app/commit/c7403dca7e200b70e75f2c8cc5c690ed510ccc2c))
-   **edition:** get EditionReportData for multiple works ([782d0b3](https://github.com/webern-unibas-ch/awg-app/commit/782d0b34f84acb76590fb1b78a95aece418f71ca))
-   **edition:** make convolute view handle multiple convolutes ([81e8fef](https://github.com/webern-unibas-ch/awg-app/commit/81e8fef2a8143422fcdec9cf3c27615ebf6e40a0))
-   **edition:** make EditionIntro handle multiple works ([f0d3215](https://github.com/webern-unibas-ch/awg-app/commit/f0d32159f806d4b712e4aadeb77d320864053421))
-   **edition:** make routes working with multiple compositions ([c37be2a](https://github.com/webern-unibas-ch/awg-app/commit/c37be2ad394758ff4f6904a4b02dcba33080e55d))
-   **edition:** make source description work with multiple compositions ([d31b29d](https://github.com/webern-unibas-ch/awg-app/commit/d31b29df98a54400a18f22569b8fd9dbc7212467))
-   **edition:** make source evaluation work with multiple compositions ([2743b42](https://github.com/webern-unibas-ch/awg-app/commit/2743b426438be49d390e28a1cdea93852e1e325e))
-   **edition:** make textcritics work with multiple compositions ([a03430d](https://github.com/webern-unibas-ch/awg-app/commit/a03430da0ee2d052100405ce423beb1325d977b5))
-   **edition:** move edition assets into structured folders ([afe526b](https://github.com/webern-unibas-ch/awg-app/commit/afe526bc84e0aa4034810415e6fef6ccc19dc17a))
-   **edition:** prepare EditionView to handle multiple EditionWorks ([c26d355](https://github.com/webern-unibas-ch/awg-app/commit/c26d355bdb9c7401b503e1f33c9c0d135d0b3da6))
-   **edition:** use queryParams instead of urlParams for sketch routing ([af9ef35](https://github.com/webern-unibas-ch/awg-app/commit/af9ef357c0bfedd3111b3172657b35e70b672053))

### Bug Fixes

-   **app:** move op12 assets into separate folder ([7036d30](https://github.com/webern-unibas-ch/awg-app/commit/7036d301e10c4c8e384d70bb58750fdd9882c0cd))
-   **app:** use EditionConstants for routerLinks ([7824cd8](https://github.com/webern-unibas-ch/awg-app/commit/7824cd8cda686dd75f9fbc4f747e2b9dc24a3e40))
-   **core:** improve handling for gnd recognition ([c2fdbd8](https://github.com/webern-unibas-ch/awg-app/commit/c2fdbd86ec3c07aa0dd0edd18ee874430122a916))
-   **edition:** avoid circular dependency in EditionPath imports ([15ee461](https://github.com/webern-unibas-ch/awg-app/commit/15ee461137e89225f506b09742b539f3350aedf7))
-   **edition:** get firmSigns dynamically ([3415f84](https://github.com/webern-unibas-ch/awg-app/commit/3415f8447b7fbb7044a2f34baea79ac4b8193c34))
-   **edition:** improve handling of textcritical comments flow ([de94dbe](https://github.com/webern-unibas-ch/awg-app/commit/de94dbe367c6279f0535d0edbc07904f809dc66c))
-   **edition:** make modals work with multiple works ([5c84f76](https://github.com/webern-unibas-ch/awg-app/commit/5c84f76bee00eac87dabcf0a6bf9ba3d4989cd2c))
-   **edition:** move back to root and link for routerLinks ([8f1c476](https://github.com/webern-unibas-ch/awg-app/commit/8f1c4764cb549eb84acc198b7372ca08404d254c))
-   **edition:** move edition assets path to edition constants ([e906b6d](https://github.com/webern-unibas-ch/awg-app/commit/e906b6d620edb4a39e915e8f165f44bbca07d1bf))
-   **edition:** remove hard-coded EditionWork from navigation ([8ed8f47](https://github.com/webern-unibas-ch/awg-app/commit/8ed8f476caea6d4f0ba656e86c3ec16a4747b054))
-   **edition:** use EditionRoutes for EditionWork class ([c6e0da7](https://github.com/webern-unibas-ch/awg-app/commit/c6e0da71a08aab14ff41a99fa914d5a24313f40e))
-   **search:** repair nav arrows for imageobject component ([78e0f73](https://github.com/webern-unibas-ch/awg-app/commit/78e0f730e573311bad52fe4fc4867b8e4bfdc246))
-   **shared:** make queryParamsHandling for routerLinkButton configurable ([233e1d8](https://github.com/webern-unibas-ch/awg-app/commit/233e1d831e1aed39a744832f78f6efded612dda7))
-   **shared:** name routerLinkButtons consistently ([fba09ab](https://github.com/webern-unibas-ch/awg-app/commit/fba09abbccb1170118056e8e4a863f4415560a9d))

### [0.6.1](https://github.com/webern-unibas-ch/awg-app/compare/v0.6.0...v0.6.1) (2019-07-19)

### Build System

-   **app:** update `yarn.lock` to fix GitHub security alerts ([7602f14](https://github.com/webern-unibas-ch/awg-app/commit/7602f14))

## [0.6.0](https://github.com/webern-unibas-ch/awg-app/compare/v0.5.4...v0.6.0) (2019-07-19)

### Bug Fixes

-   **app:** add 404 fallback route ([c0ade9b](https://github.com/webern-unibas-ch/awg-app/commit/c0ade9b))
-   **app:** fix errors after update to Angular 8 ([2771649](https://github.com/webern-unibas-ch/awg-app/commit/2771649))
-   **app:** get correct section of meta data for remaining views ([80bbe10](https://github.com/webern-unibas-ch/awg-app/commit/80bbe10))
-   **app:** patch issue with CustomHammerConfig of ngx-gallery ([cb1a0d4](https://github.com/webern-unibas-ch/awg-app/commit/cb1a0d4))
-   **app:** remove temporary workaround with static ngInjectableDef ([962ffeb](https://github.com/webern-unibas-ch/awg-app/commit/962ffeb))
-   **app:** use onPush CD strategy on dumb components if possible ([f42f706](https://github.com/webern-unibas-ch/awg-app/commit/f42f706)), closes [#2](https://github.com/webern-unibas-ch/awg-app/issues/2)
-   **contact:** get correct section of meta data for contact view ([5d5a754](https://github.com/webern-unibas-ch/awg-app/commit/5d5a754))
-   **core:** fix missing space in copyright desc ([17f0865](https://github.com/webern-unibas-ch/awg-app/commit/17f0865))
-   **core:** fix visibility of centered navbar-brand ([c879bec](https://github.com/webern-unibas-ch/awg-app/commit/c879bec))
-   **core:** get only page meta data for footer and navbar ([2f51775](https://github.com/webern-unibas-ch/awg-app/commit/2f51775))
-   **core:** use better default values for clearing subjects ([9f65f13](https://github.com/webern-unibas-ch/awg-app/commit/9f65f13))
-   **core:** use MetaPerson class for authors and editors ([ff7df06](https://github.com/webern-unibas-ch/awg-app/commit/ff7df06))
-   **edition:** remove unnecessary toggle methods ([7f4b303](https://github.com/webern-unibas-ch/awg-app/commit/7f4b303))
-   **edition:** return only first emit of EditionDataService observables ([6e02f0b](https://github.com/webern-unibas-ch/awg-app/commit/6e02f0b))
-   **edition:** use async pipe for data in report component ([075a97e](https://github.com/webern-unibas-ch/awg-app/commit/075a97e))
-   **edition:** use CDS.onPush for report component's children ([a31483d](https://github.com/webern-unibas-ch/awg-app/commit/a31483d))
-   **search:** add bottom pagination in search result list ([6668f87](https://github.com/webern-unibas-ch/awg-app/commit/6668f87))
-   **search:** avoid bindings to pass static strings to native attributes ([945e259](https://github.com/webern-unibas-ch/awg-app/commit/945e259))
-   **search:** change snapshot path to get current url in search overview ([46995ff](https://github.com/webern-unibas-ch/awg-app/commit/46995ff))
-   **search:** clear search info on destroy of SearchResultListComponent ([c9ef240](https://github.com/webern-unibas-ch/awg-app/commit/c9ef240))
-   **search:** fix ngIfs in nested children templates of resource detail ([90d64ac](https://github.com/webern-unibas-ch/awg-app/commit/90d64ac))
-   **search:** improve communication btw overview and info ([357872e](https://github.com/webern-unibas-ch/awg-app/commit/357872e))
-   **search:** improve handling of resource detail requests ([431f9ab](https://github.com/webern-unibas-ch/awg-app/commit/431f9ab))
-   **search:** improve handling of searchResponseWithQuery subscription ([9be21c6](https://github.com/webern-unibas-ch/awg-app/commit/9be21c6))
-   **search:** improve linked objects component ([4e1347e](https://github.com/webern-unibas-ch/awg-app/commit/4e1347e))
-   **search:** improve search form building ([c2cab36](https://github.com/webern-unibas-ch/awg-app/commit/c2cab36))
-   **search:** move interceptor providers into separate file ([d9c7d2d](https://github.com/webern-unibas-ch/awg-app/commit/d9c7d2d))
-   **search:** move resource detail header out of tabset ([522c867](https://github.com/webern-unibas-ch/awg-app/commit/522c867))
-   **search:** provide loading status as observable ([ca41c8d](https://github.com/webern-unibas-ch/awg-app/commit/ca41c8d))
-   **search:** remove unused conversion service from resource detail ([5e377b3](https://github.com/webern-unibas-ch/awg-app/commit/5e377b3))
-   **search:** set search parameter nRows to 25 per default ([39b3f63](https://github.com/webern-unibas-ch/awg-app/commit/39b3f63))
-   **search:** simplify subscription to search result list data ([a9374d2](https://github.com/webern-unibas-ch/awg-app/commit/a9374d2))
-   **search:** subscribe to resource data instead of async pipe ([c8dab3f](https://github.com/webern-unibas-ch/awg-app/commit/c8dab3f))
-   **search:** use `this` instead of `super` in data api service ([42bac0a](https://github.com/webern-unibas-ch/awg-app/commit/42bac0a))
-   **search:** use async pipe for data in bibliography component ([05ff800](https://github.com/webern-unibas-ch/awg-app/commit/05ff800))
-   **search:** use async pipe for data in bibliography detail ([a95a45b](https://github.com/webern-unibas-ch/awg-app/commit/a95a45b))
-   **search:** use async pipe for data in resource detail ([7ae1372](https://github.com/webern-unibas-ch/awg-app/commit/7ae1372))
-   **search:** use enum for SearchParam view types ([7e53fa5](https://github.com/webern-unibas-ch/awg-app/commit/7e53fa5))
-   **search:** use getter for httpGetUrl in resourceDetail & searchPanel ([272d618](https://github.com/webern-unibas-ch/awg-app/commit/272d618))
-   **search:** use id tracker for search result list ([b9ebaa2](https://github.com/webern-unibas-ch/awg-app/commit/b9ebaa2))
-   **search:** use loading spinner for resource detail ([23b1272](https://github.com/webern-unibas-ch/awg-app/commit/23b1272)), closes [#5](https://github.com/webern-unibas-ch/awg-app/issues/5)
-   **search:** use SearchResponseWithQuery to update search params ([adb3d48](https://github.com/webern-unibas-ch/awg-app/commit/adb3d48))
-   **shared:** add optional 'toHtml' property to property json ([f7a3de5](https://github.com/webern-unibas-ch/awg-app/commit/f7a3de5))
-   **shared:** update compile html module & component ([73a9526](https://github.com/webern-unibas-ch/awg-app/commit/73a9526))
-   **side-info:** add getter/setter for osm urls in contact-info ([d578987](https://github.com/webern-unibas-ch/awg-app/commit/d578987))
-   **side-info:** get osm urls in contact-info from AppConfig ([f106c5f](https://github.com/webern-unibas-ch/awg-app/commit/f106c5f))
-   **side-info:** make address & osm map of contact-info shared components ([8846558](https://github.com/webern-unibas-ch/awg-app/commit/8846558))
-   **side-info:** make resource info data update immutable ([d248703](https://github.com/webern-unibas-ch/awg-app/commit/d248703))
-   **side-info:** remove nested subscription from resource-info ([779965f](https://github.com/webern-unibas-ch/awg-app/commit/779965f))
-   **side-info:** set edition info header from component ([15eb693](https://github.com/webern-unibas-ch/awg-app/commit/15eb693))
-   **side-info:** use async pipe for data in search info ([c7c9791](https://github.com/webern-unibas-ch/awg-app/commit/c7c9791))

### Build System

-   **app:** add compodoc and format check scripts to package.json ([92a6852](https://github.com/webern-unibas-ch/awg-app/commit/92a6852))
-   **app:** add compodoc build to build scripts in package.json ([f3047b5](https://github.com/webern-unibas-ch/awg-app/commit/f3047b5))
-   **app:** configure karma.conf.js to run tests in order ([19cec04](https://github.com/webern-unibas-ch/awg-app/commit/19cec04))
-   **app:** remove core-js and update dependencies ([f25fcd3](https://github.com/webern-unibas-ch/awg-app/commit/f25fcd3))
-   **app:** update angular (^8.0.3) and cli (~8.0.6) ([001474e](https://github.com/webern-unibas-ch/awg-app/commit/001474e))
-   **app:** update dependencies after upgrade to Angular 8 ([0b00a91](https://github.com/webern-unibas-ch/awg-app/commit/0b00a91))
-   **app:** update dependency font-awesome ([bcc0f07](https://github.com/webern-unibas-ch/awg-app/commit/bcc0f07))
-   **app:** update remaining dependencies after upgrade to Angular 8 ([aeb5bfa](https://github.com/webern-unibas-ch/awg-app/commit/aeb5bfa))

### Features

-   **app:** add compodoc for code documentation ([8945988](https://github.com/webern-unibas-ch/awg-app/commit/8945988))
-   **app:** update angular (^8.0.2) and cli (~8.0.3) ([3844e27](https://github.com/webern-unibas-ch/awg-app/commit/3844e27))
-   **contact:** add documentation section and link to Github repo ([3688358](https://github.com/webern-unibas-ch/awg-app/commit/3688358))
-   **core:** add loading interceptor to set load status ([7669bad](https://github.com/webern-unibas-ch/awg-app/commit/7669bad))
-   **core:** split meta object into sections and provide service method ([555fd11](https://github.com/webern-unibas-ch/awg-app/commit/555fd11))

### Tests

-   **app:** fix broken tests - ongoing ([42d8a5d](https://github.com/webern-unibas-ch/awg-app/commit/42d8a5d))
-   **app:** fix broken tests after changes ([db2630f](https://github.com/webern-unibas-ch/awg-app/commit/db2630f))
-   **app:** fix tests with HttpTestingController ([6743f2c](https://github.com/webern-unibas-ch/awg-app/commit/6743f2c))
-   **app:** move nativeElement in own variable in tests ([70dba2d](https://github.com/webern-unibas-ch/awg-app/commit/70dba2d))
-   **core:** extend navbar tests ([6410bf8](https://github.com/webern-unibas-ch/awg-app/commit/6410bf8))
-   **home:** adjust tests for home-view component ([573ccd9](https://github.com/webern-unibas-ch/awg-app/commit/573ccd9))
-   **page-not-found:** fix broken tests after renaming of variables ([6db4d3c](https://github.com/webern-unibas-ch/awg-app/commit/6db4d3c))
-   **search:** add service method to searchResultList test after changes ([36512fb](https://github.com/webern-unibas-ch/awg-app/commit/36512fb))
-   **search:** add TwelveToneSpinnerStub to resource detail test ([0dd7ee2](https://github.com/webern-unibas-ch/awg-app/commit/0dd7ee2))
-   **search:** fix broken tests after switch to CD.OnPush - ongoing ([cb8a968](https://github.com/webern-unibas-ch/awg-app/commit/cb8a968))
-   **search:** fix broken tests after switch to CD.OnPush - ongoing ([01e7fdc](https://github.com/webern-unibas-ch/awg-app/commit/01e7fdc))
-   **search:** use SearchPramsViewTypes in search result list ([7793172](https://github.com/webern-unibas-ch/awg-app/commit/7793172))
-   **side-info:** add header test for structure-info ([4a18b67](https://github.com/webern-unibas-ch/awg-app/commit/4a18b67))
-   **side-info:** add test for contact-info and its child components ([48434d6](https://github.com/webern-unibas-ch/awg-app/commit/48434d6))
-   **side-info:** add tests for edition-info component ([b08216c](https://github.com/webern-unibas-ch/awg-app/commit/b08216c))
-   **side-info:** add tests for structure info component ([1a8bbaf](https://github.com/webern-unibas-ch/awg-app/commit/1a8bbaf))

## [0.5.4](https://github.com/webern-unibas-ch/awg-app/compare/v0.5.3...v0.5.4) (2019-04-09)

### Bug Fixes

-   **app:** add angular-cli-ghpages to devDependencies ([878852a](https://github.com/webern-unibas-ch/awg-app/commit/878852a))

## [0.5.3](https://github.com/webern-unibas-ch/awg-app/compare/v0.5.2...v0.5.3) (2019-04-09)

### Bug Fixes

-   **app:** use HTTPS over HTTP whenever possible ([5c573ad](https://github.com/webern-unibas-ch/awg-app/commit/5c573ad))
-   **core:** add link to CHANGELOG from footer declaration ([6f2004f](https://github.com/webern-unibas-ch/awg-app/commit/6f2004f))

## [0.5.2](https://github.com/webern-unibas-ch/awg-app/compare/v0.5.1...v0.5.2) (2019-04-09)

Empty patch version bump to trigger build via Travis CI after moving the repository to GitHub.

## [0.5.1](https://github.com/webern-unibas-ch/awg-app/compare/v0.5.0...v0.5.1) (2019-04-09)

### BREAKING CHANGES

Repository moved from Gitlab to public GitHub repository. All commit and version links prior to this version are not publicly available.

Only patch version bump.

## [0.5.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.4.0...v0.5.0) (2019-04-09)

### Bug Fixes

-   **app:** add project specific favicon ([4d430f8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4d430f8))
-   **app:** fix hostname for GoogleAnalytics ([a92f44e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a92f44e))
-   **app:** get app version from package.json ([6ab1a77](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/6ab1a77))
-   **app:** get global constants from package.json ([903f276](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/903f276))
-   **app:** improve page not found view ([bf134b4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/bf134b4))
-   **app:** make Contact & Structure view lazy loading ([879f5be](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/879f5be))
-   **app:** preserve query params & fragments on routing ([408d1ea](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/408d1ea))
-   **app:** use HTTPS for salsah API ([63eb4a7](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/63eb4a7))
-   **app:** use urls from AppConfig for main homepages ([a6b6c7f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a6b6c7f))
-   **contact:** add license statement to disclaimer ([8134d97](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/8134d97))
-   **core:** small changes & renaming to api service routes & inputs ([53e403f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/53e403f))
-   **core:** use smaller version of snf logo ([d1209a4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d1209a4))
-   **edition:** rename DataService -> EditionDataService ([dc99cc3](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/dc99cc3))
-   **search:** add constructor to BibliographyService ([e9c91d9](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e9c91d9))
-   **search:** check for changes in ImageObjectComponent ([a2bdce9](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a2bdce9))
-   **search:** create search button array on init ([a2d6440](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a2d6440))
-   **search:** disable view buttons when there is no searchresult ([723498a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/723498a))
-   **search:** do not call data API on view change ([0871432](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/0871432))
-   **search:** improve handling of search params ([779b179](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/779b179))
-   **search:** move result conversion to data api service ([225ee3c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/225ee3c))
-   **search:** use ngOnChanges to detect input changes ([d7ce548](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d7ce548))
-   **search:** use NgxGallery in ImageObjectsComponent ([ced6906](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ced6906))
-   **search:** use search params model ([383454b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/383454b))
-   **shared:** create RouterLinkButton with constructor ([1b093d2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/1b093d2))
-   **shared:** remove custom get functions from property-json ([61fa115](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/61fa115))
-   **shared:** use typed jsonViewerData input ([c0f0d34](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/c0f0d34))
-   **side-info:** use query params when navigating back to search ([30a7c0f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/30a7c0f))

### Features

-   **search:** add pagination for search results ([3e8ec1c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3e8ec1c))
-   **shared:** add NgxGallery module ([b929629](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b929629))

<a name="0.4.0"></a>

## [0.4.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.3.0...v0.4.0) (2019-01-22)

### Bug Fixes

-   **app:** add include files to tsconfig app ([fa3a662](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/fa3a662))
-   **app:** change LOCALE_ID to "de-DE" globally ([c5d3b70](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/c5d3b70))
-   **contact:** add separate section for citations ([324d553](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/324d553))
-   **core:** add fixed bottom footer ([66b2c5a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/66b2c5a))
-   **core:** add footer module ([253e6c7](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/253e6c7))
-   **core:** add separate component for view container ([5a3fe0c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/5a3fe0c))
-   **core:** highlight active nav-link on page load ([41c7f81](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/41c7f81))
-   **core:** make bottom footer logos wrap at breakpoint ([184fbb4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/184fbb4))
-   **core:** make header fully responsive with bootstrap 4 ([963f228](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/963f228))
-   **core:** move footer declaration & attribution to own component ([0bf9dc8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/0bf9dc8))
-   **core:** move footer text into own component ([8207e82](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/8207e82))
-   **core:** use fa-icons for navbar ([fd1d77f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/fd1d77f))
-   **edition:** fix margin of textcritics panel footer ([d8a2cdb](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d8a2cdb))
-   **edition:** fix wrong folio format for folio 1r-v ([adce66c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/adce66c))
-   **edition:** move pre-notification into accolade component ([7b12d60](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/7b12d60))
-   **edition:** refactor button group with bootstrap 4 ([a0b609d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a0b609d))
-   **edition:** refactor edition accolade with bootstrap 4 ([208a870](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/208a870))
-   **edition:** refactor edition convolute with bootstrap 4 ([dc9d959](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/dc9d959))
-   **edition:** refactor report panels with bootstrap 4 ([7e68088](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/7e68088))
-   **edition:** use json viewer to display API json response ([6082869](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/6082869))
-   **search:** add grid and table view buttons to searchResultsHeader ([de6fc1f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/de6fc1f))
-   **search:** fix wrong id for linked obj links ([51629ee](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/51629ee))
-   **search:** refactor image objects with bootstrap 4 ([1c93f82](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/1c93f82))
-   **search:** refactor linked objects accordion with bootstrap 4 ([cbc8d67](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/cbc8d67))
-   **search:** refactor linked objects with bootstrap 4 ([d2b1195](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d2b1195))
-   **search:** refactor props with bootstrap 4 ([67a2131](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/67a2131))
-   **search:** refactor resource header with bootstrap 4 ([64c8ccb](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/64c8ccb))
-   **search:** refactor search form with Angular 6 ([8cf98e6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/8cf98e6))
-   **search:** refactor search form with bootstrap 4 ([27d7c37](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/27d7c37))
-   **search:** refactor search results with bootstrap 4 ([4a6416e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4a6416e))
-   **shared:** refactor button group with bootstrap 4 ([dfd8720](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/dfd8720))
-   **shared:** refactor modal with bootstrap 4 ([28715a1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/28715a1))
-   **side-info:** refactor resource-info with bootstrap 4 ([66990a4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/66990a4))

### Features

-   **app:** add and configure GoogleAnalytics pageview events ([dc7d213](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/dc7d213))
-   **app:** refactor the whole app with bootstrap 4 ([891ef5a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/891ef5a))
-   **build:** update `angular-cli`(^7.2.2) and `angular` (^7.2.1) ([9baf470](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/9baf470))
-   **shared:** add json viewer component ([92f3f3e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/92f3f3e))

### BREAKING CHANGES

-   **app:** Bootstrap 4 is a major rewrite of the entire Bootstrap project, so the upgrade to Bootstrap 4 involves some refactoring of essential parts of the application structure, including
    -   navbar, tabsets, dropdowns, list-items, panels (cards)
    -   a lot of style classes (mt, pb)
    -   the use of `ngx-bootstrap` instead of `jQuery`

For more details, see

-   https://getbootstrap.com/docs/4.1/migration/

Only minor version bump.

<a name="0.3.0"></a>

## [0.3.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.2.0...v0.3.0) (2018-11-15)

### Bug Fixes

-   **app:** add noopener norefferer to target blank links ([5e465d8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/5e465d8))
-   **app:** apply new tree-shakable injector strategy for services ([35e24ce](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/35e24ce))
-   **app:** change root selector to `awg-app` ([9a87bd4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/9a87bd4))
-   **app:** fix issue with service inheritance (`ngInjectableDef`), cf. https://stackoverflow.com/questions/50263722/angular-6-services-and-class-inheritance ([b260f2d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b260f2d))
-   **app:** replace scroll fix with new anchorScroll strategy of angular 6 ([cb9c25e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/cb9c25e))
-   **app:** update CHANGELOG ([68ecdf6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/68ecdf6))
-   **core:** fetch metaData and logos in FooterComponent ([0af8f57](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/0af8f57))
-   **core:** move footer logos into separate component ([17a34f5](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/17a34f5))
-   **core:** remove circular dependencies from api service and update service models ([74637eb](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/74637eb))
-   **core:** rename metaService -> coreService ([4906516](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4906516))
-   **edition:** get active class from comparison of overlays ([23095ee](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/23095ee))
-   **edition:** use `SourceList` model instead of `Source[]` (array) ([53c5630](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/53c5630))
-   **shared:** replace `mapToIterable` pipe with angular's in-built `keyvalue` pipe ([a52bce0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a52bce0))

### Features

-   **build:** update to latest `angular-cli`(^6.2.4) and `angular` (^6.1.9) ([3c0b115](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3c0b115))
-   **contact:** add OpenStreetMap map to contact page ([2c68478](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/2c68478))

### BREAKING CHANGES

-   **build:** The update to Angular 6 involves some refactoring of essential parts of the application build structure, including
-   `angular-cli.json` -> `angular.json`
-   upgrade to RxJS 6 (bundling of imports & use of pipe() for operators)

For more details, see

-   https://blog.angular.io/version-6-of-angular-now-available-cc56b0efa7a4
-   https://update.angular.io/
-   https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md

Only minor version bump.

<a name="0.2.0"></a>

## [0.2.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.3...v0.2.0) (2018-10-01)

### Bug Fixes

-   **app:** use path aliases (`awg-{app/core/shared/views}`) for imports ([3297cc9](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3297cc9))
-   **build:** add bundle analyzing tools to `devDependencies` ([0ab8d4d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/0ab8d4d))
-   **build:** add `snapsvg` to project `dependencies` ([3fec1ae](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3fec1ae))
-   **build:** add production build script ([619c5bc](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/619c5bc))
-   **data:** rename resource-detail models ([f7151e0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/f7151e0))
-   **edition:** add overlay model to handle textcritics' overlays ([e125b5c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e125b5c))
-   **edition:** change behaviour of panels ([0f9dc31](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/0f9dc31))
-   **edition:** move svg grid to folio component / service calculations to models ([56a4176](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/56a4176))
-   **edition:** move tka table beneath sheet svg ([600861e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/600861e))
-   **edition:** move accolade to its own component ([37e006b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/37e006b))
-   **edition:** move convolute to its own component ([d09dbfa](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d09dbfa))
-   **edition:** minimize the calls to dataservice ([be779f5](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/be779f5))
-   **edition:** coordinate folio view with sheet view ([b15572d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b15572d))
-   **edition:** move content of overview folder directly under edition-outlets ([6fabdab](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/6fabdab))
-   **edition:** simplify tka handling & display ([e534430](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e534430))
-   **edition:** remove sourceList type and clarify observable types of data service ([e1694a8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e1694a8))
-   **edition:** remove unnecessary form component from folio ([ede03f4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ede03f4))
-   **edition:** group folio models in resp. main model file ([8e5c9a2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/8e5c9a2))
-   **edition:** fix typo in `folio.json` ([627047d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/627047d))
-   **edition:** some styling to position svg-grid correctly ([b694768](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b694768))

### Features

-   **edition:** add basic support for folio visualisation ([dacac10](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/dacac10))

<a name="0.1.3"></a>

## [0.1.3](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.2...v0.1.3) (2018-09-03)

### Bug Fixes

-   **edition:** open source description panel when clicking on corresponding sigle ([ed41c4e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ed41c4e))
-   **edition:** use `ngIf/else` template for sourcelist sources ([4424f0a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4424f0a))
-   **search:** fix link label for JSON data ([3f54dc1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3f54dc1))

### Features

-   **app:** add disclaimer information about citation, analytics, and data protection ([acb5c8b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/acb5c8b))
-   **build:** add `standard-version` for automatic changelog & release script ([3efd32b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3efd32b))

Only patch version bump.

<a name="0.1.2"></a>

## [0.1.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.1...v0.1.2) (2018-08-31)

### Bug Fixes

-   **app:** move bootstrap modules from core to shared module ([af42832](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/af42832))
-   **build:** add `gitignore` file to Prototype v1 ([3b86faf](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3b86faf))
-   **search:** move `resource detail html header` one level up ([42352ea](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/42352ea))
-   **search:** rename `resource detail html header` -> `resource detail header` ([21b2ab2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/21b2ab2))
-   **search:** adjust header texts for json views ([a349bb8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a349bb8))
-   **search:** move streamerSubscription from searchPanel to search result list ([46208b8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/46208b8))
-   **search:** refactor search panel subscriptions ([b82b647](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b82b647))
-   **search:** refactor resource detail subscriptions ([04bbe2c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/04bbe2c))
-   **search:** prevent result list from being loaded twice (through search form `ng-model`) ([fa39e42](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/fa39e42))
-   **search:** fix search result transmission between components ([0af2740](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/0af2740))
-   **search:** fix `ng-template` handling with nested `if-else` ([fad4624](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/fad4624))
-   **side-info:** prevent change detection during destroy phase of component (search info)([d6cf75d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d6cf75d))

### Features

-   **app:** add custom loading spinner (twelve-tone) for `index.html` ([1b71e36](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/1b71e36))
-   **app:** add custom loading spinner (twelve-tone) for app ([18840d7](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/18840d7))

Only patch version bump.

<a name="0.1.1"></a>

## [0.1.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.0.2...v0.1.1) (2018-03-23)

### Bug Fixes

-   **app:** add metadata, remove favicon from `index.html` ([d75c7dc](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d75c7dc)), cf. [0.1.0.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.0...v0.1.0.1) (2018-03-20)
-   **app:** update `gitignore` file ([ca10942](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ca10942)), cf. [0.1.0.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.0.1...v0.1.0.2) (2018-03-21)
-   **app:** remove unused timeline plugin ([79bedda](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/79bedda))
-   **search:** rename `search-view` as `data-view` ([446b7fa](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/446b7fa))

### Features

-   **app:** lazy load data (olim search) and edition modules ([b0b4f31](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b0b4f31))
-   **build:** update to latest `angular-cli` (v1.7.3) and `angular` (v5.2.9) ([ca10942](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ca10942)), cf. [0.1.0.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.0.1...v0.1.0.2) (2018-03-21)

### Possible Breaking Changes

-   **search:** The former `search-view` is renamed to `data-view`.

Only patch version bump.

<a name="0.1.0"></a>

## [0.1.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9.4...v0.1.0) (2018-03-20)

### Bug Fixes

-   **app:** remove unused directive sidenav-outlet ([9ff882d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/9ff882d))
-   **build:** add `gitignore` file ([d04020b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d04020b)), cf. [0.0.9.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9...v0.0.9.1) (2016-12-12)
-   **build:** ignore nested system files (node modules, bower components, tmp, dist) ([b3cd7b1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b3cd7b1)), cf. [0.0.9.4](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9.3...v0.0.9.4) (2017-08-28)
-   **contact:** remove unused end of `div`-tag ([17a65ff](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/17a65ff)), cf. [0.0.9.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9.1...v0.0.9.2) (2017-01-06)
-   **edition:** add missing closing tag for comment ([bbc03d0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/bbc03d0)), cf. [0.0.9.3](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9.2...v0.0.9.3) (2017-01-09)
-   **edition:** set timeOut when scrolling into changing route ([5f58cf2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/5f58cf2))
-   **search:** track search results by `$index` for unique numbering ([ff3ddb6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ff3ddb6)), cf. [0.0.9.4](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9.3...v0.0.9.4) (2017-08-28)
-   **search:** disable timeline & bibliography router buttons for now ([52cb6a0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/52cb6a0))

### Features

-   **app:** start refactoring layout and app for Prototype v2 - ongoing([72e589a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/72e589a))
-   **app:** add sidenav outlets (edition, structure, contact) ([4710394](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4710394))
-   **app:** use yarn and add lock file ([d13322d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d13322d))
-   **search:** refactor resource detail view (cf. [Arachne](https://arachne.dainst.org/entity/1121229))
-   **shared:** add pipe MapToIterable ([7d542cb](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/7d542cb))
-   **shared:** add pipe OrderBy ([63f30c2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/63f30c2))
-   **views:** add PageNotFoundView ([eba34d1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/eba34d1))

### Breaking Changes

-   **build:** update from `angular.js` to `angular` (v5.0) & `angular-cli` (v1.5.0) ([46a1f30](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/46a1f30))

Fundamental refactoring of the whole application, including:

-   **app:** move app routing configuration into a routing module ([a29a872](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a29a872))
-   **app:** move shared comps into separate module ([76e0793](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/76e0793))
-   **app:** move `framework` to `core` ([2d79a3dd](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/9ff882d))
-   **app:** move `/views` one level up ([e62a542](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e62a542))
-   **build:** upgrade `ng2-bootstrap` to `ngx-bootstrap` ([d772f68](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d772f68))
-   **edition:** refactor edition-view
-   **search:** refactor search-view
-   **shared:** refactor `awg-heading` as shared component ([e524c8b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e524c8b))

Only minor version bump.

<a name="0.0.9"></a>

## [0.0.9](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.8.2...v0.0.9) (2016-11-21)

### Bug Fixes

-   **contact:** remove unused end of `a`-tag ([5e0a44d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/5e0a44d)), cf. [0.0.8.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.8.1...v0.0.8.2) (2016-10-20)
-   **search:** allow handling of multiple hlist values in search service ([9eb0353](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/9eb0353)), cf. [0.0.8.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.8...v0.0.8.1) (2016-08-19)

### Features

-   **search:** add handling of image objects ([36b9658](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/36b9658))

Only patch version bump.

<a name="0.0.8"></a>

## [0.0.8](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.7...v0.0.8) (2016-08-19)

### Bug Fixes

-   **build:** embedd external libraries & scripts locally ([974f933](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/974f933))
-   **edition:** fix wrong line number in `sourceDesc` ([9322bed](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/9322bed))
-   **edition:** rebuild getTkA-Functions and directives ([09d00af](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/09d00af))
-   **search:** fix control button for timeline ([5894b79](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/5894b79))
-   **search:** get search results number from array length, not from nhits ([1925a71](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/1925a71))

### Features

-   **build:** start using [Git flow workflow](https://nvie.com/posts/a-successful-git-branching-model/)
-   **edition:** add basic data for integration of sketch Aa:SkI/1 - ongoing ([b2ff8ab](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b2ff8ab))
-   **search:** add handling for geoname values in search service ([a07dae6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a07dae6))
-   **search:** add handling for hlist values in search service ([886911c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/886911c))

Only patch version bump.

<a name="0.0.7"></a>

## [0.0.7](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.6...v0.0.7) (2016-07-14)

### Bug Fixes

-   **app:** use edition date separated from version & its release date ([2174277](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/2174277))
-   **search:** change order of search results (by restype) ([c9e2a05](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/c9e2a05))

### Features

-   **search:** add timeline for 'daily events' ([18e4969](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/18e4969))

Timeline feature based on: Robert Pocklington ([@rpocklin](https://github.com/rpocklin/)), Melbourne, VIC, AU, 2015–2016, [Angular Timeline](https://github.com/rpocklin/angular-timeline) (accessed 10.7.2016).

Only patch version bump.

<a name="0.0.6"></a>

## [0.0.6](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.5...v0.0.6) (2016-04-28)

### Bug Fixes

-   **search:** improve default object header in search service ([c1b9e79](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/c1b9e79))
-   **search:** exclude html tags from highlighted search ([7d09f19](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/7d09f19))

<a name="0.0.5"></a>

## [0.0.5](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.4...v0.0.5) (2016-04-14)

### Bug Fixes

-   **search:** improve routine for highlighted search ([e435868](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e435868))

### Features

-   **search:** add handling of selection lists and supplements in search service ([3143f71](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3143f71))

Only patch version bump.

<a name="0.0.4"></a>

## [0.0.4](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.3...v0.0.4) (2016-03-31)

### Bug Fixes

-   **search:** use `restype_id` instead of `restype_label` to identify correct resource type ([2a3983a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/2a3983a))

<a name="0.0.3"></a>

## [0.0.3](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.2...v0.0.3) (2016-03-17)

### Features

-   **search:** add highlighting for searchresults ([4149940](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4149940))

Only patch version bump.

<a name="0.0.2"></a>

## [0.0.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.1...v0.0.2) (2016-03-03)

### Bug Fixes

-   **search:** replace salsah links in searchresults ([f451123](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/f451123))

### Features

-   **app:** add sidenav templates for app views ([4758bc1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4758bc1))

Only patch version bump.

<a name="0.0.1"></a>

## [0.0.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/68eac337) (2016-02-02)
