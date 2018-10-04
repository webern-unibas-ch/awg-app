# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.2.0"></a>
# [0.2.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.3...v0.2.0) (2018-10-01)


### Bug Fixes

* **app:** use path aliases (`awg-{app/core/shared/views}`) for imports ([3297cc9](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3297cc9))
* **build:** add bundle analyzing tools to `devDependencies` ([0ab8d4d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/0ab8d4d))
* **build:** add `snapsvg` to project `dependencies` ([3fec1ae](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3fec1ae))
* **build:** add production build script ([619c5bc](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/619c5bc))
* **data:** rename resource-detail models ([f7151e0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/f7151e0))
* **edition:** add overlay model to handle textcritics' overlays ([e125b5c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e125b5c))
* **edition:** change behaviour of panels ([0f9dc31](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/0f9dc31))
* **edition:** move svg grid to folio component / service calculations to models ([56a4176](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/56a4176))
* **edition:** move tka table beneath sheet svg ([600861e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/600861e))
* **edition:** move accolade to its own component ([37e006b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/37e006b))
* **edition:** move convolute to its own component ([d09dbfa](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d09dbfa))
* **edition:** minimize the calls to dataservice ([be779f5](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/be779f5))
* **edition:** coordinate folio view with sheet view ([b15572d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b15572d))
* **edition:** move content of overview folder directly under edition-outlets ([6fabdab](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/6fabdab))
* **edition:** simplify tka handling & display ([e534430](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e534430))
* **edition:** remove sourceList type and clarify observable types of data service ([e1694a8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e1694a8))
* **edition:** remove unnecessary form component from folio ([ede03f4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ede03f4))
* **edition:** group folio models in resp. main model file ([8e5c9a2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/8e5c9a2))
* **edition:** fix typo in `folio.json` ([627047d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/627047d))
* **edition:** some styling to position svg-grid correctly ([b694768](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b694768))


### Features

* **edition:** add basic support for folio visualisation ([dacac10](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/dacac10))



<a name="0.1.3"></a>
# [0.1.3](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.2...v0.1.3) (2018-09-03)


### Bug Fixes

* **edition:** open source description panel when clicking on corresponding sigle ([ed41c4e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ed41c4e))
* **edition:** use `ngIf/else` template for sourcelist sources ([4424f0a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4424f0a))
* **search:** fix link label for JSON data ([3f54dc1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3f54dc1))


### Features

* **app:** add disclaimer information about citation, analytics, and data protection  ([acb5c8b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/acb5c8b))
* **build:** add `standard-version` for automatic changelog & release script ([3efd32b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3efd32b))

Only patch version bump.



<a name="0.1.2"></a>
# [0.1.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.1...v0.1.2) (2018-08-31)


### Bug Fixes

* **app:** move bootstrap modules from core to shared module ([af42832](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/af42832))
* **build:** add `gitignore` file to Prototype v1 ([3b86faf](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3b86faf))
* **search:** move `resource detail html header` one level up ([42352ea](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/42352ea))
* **search:** rename `resource detail html header` -> `resource detail header` ([21b2ab2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/21b2ab2))
* **search:** adjust header texts for json views ([a349bb8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a349bb8))
* **search:** move streamerSubscription from searchPanel to search result list ([46208b8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/46208b8))
* **search:** refactor search panel subscriptions ([b82b647](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b82b647))
* **search:** refactor resource detail subscriptions ([04bbe2c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/04bbe2c))
* **search:** prevent result list from being loaded twice (through search form `ng-model`) ([fa39e42](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/fa39e42))
* **search:** fix search result transmission between components ([0af2740](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/0af2740))
* **search:** fix `ng-template` handling with nested `if-else` ([fad4624](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/fad4624))
* **side-info:**  prevent change detection during destroy phase of component (search info)([d6cf75d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d6cf75d))


### Features

* **app:** add custom loading spinner (twelve-tone) for `index.html` ([1b71e36](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/1b71e36))
* **app:** add custom loading spinner (twelve-tone) for app ([18840d7](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/18840d7))

Only patch version bump.



<a name="0.1.1"></a>
# [0.1.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.0.2...v0.1.1) (2018-03-23)


### Bug Fixes

* **app:** add metadata, remove favicon from `index.html` ([d75c7dc](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d75c7dc)), cf. [0.1.0.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.0...v0.1.0.1) (2018-03-20)
* **app:** update `gitignore` file ([ca10942](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ca10942)), cf. [0.1.0.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.0.1...v0.1.0.2) (2018-03-21)
* **app:** remove unused timeline plugin ([79bedda](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/79bedda))


### Features

* **app:** lazy load data (olim search) and edition modules ([b0b4f31](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b0b4f31))
* **build:** update to latest `angular-cli` (v1.7.3) and `angular` (v5.2.9) ([ca10942](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ca10942)), cf. [0.1.0.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.0.1...v0.1.0.2) (2018-03-21)


### Possible Breaking Changes

* **search:** rename `search-view` as `data-view` ([446b7fa](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/446b7fa))

Only patch version bump.



<a name="0.1.0"></a>
# [0.1.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9.4...v0.1.0) (2018-03-20)


### Bug Fixes

* **app:** remove unused directive sidenav-outlet ([9ff882d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/9ff882d))
* **build:** add `gitignore` file ([d04020b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d04020b)), cf. [0.0.9.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9...v0.0.9.1) (2016-12-12)
* **build:** ignore nested system files (node modules, bower components, tmp, dist)  ([b3cd7b1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b3cd7b1)), cf. [0.0.9.4](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9.3...v0.0.9.4) (2017-08-28)
 * **contact:** remove unused end of `div`-tag ([17a65ff](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/17a65ff)), cf. [0.0.9.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9.1...v0.0.9.2) (2017-01-06)
 * **edition:** add missing closing tag for comment ([bbc03d0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/bbc03d0)), cf. [0.0.9.3](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9.2...v0.0.9.3) (2017-01-09) 
 * **edition:** set timeOut when scrolling into changing route ([5f58cf2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/5f58cf2))
 * **search:** track search results by `$index` for unique numbering ([ff3ddb6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/ff3ddb6)), cf. [0.0.9.4](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9.3...v0.0.9.4) (2017-08-28)
 * **search:** disable timeline & bibliography router buttons for now ([52cb6a0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/52cb6a0))


### Features

* **app:**  start refactoring layout and app for Prototype v2 - ongoing([72e589a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/72e589a))
* **app:**  add sidenav outlets (edition, structure, contact) ([4710394](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4710394))
* **app:**  use yarn and add lock file ([d13322d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d13322d))
* **search:** refactor resource detail view (cf. [Arachne](https://arachne.dainst.org/entity/1121229))
* **shared:** add pipe MapToIterable ([7d542cb](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/7d542cb))
* **shared:** add pipe OrderBy ([63f30c2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/63f30c2))
* **views:** add PageNotFoundView ([eba34d1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/eba34d1))


### Breaking Changes

* **build:** update from `angular.js` to `angular` (v5.0) & `angular-cli` (v1.5.0) ([46a1f30](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/46a1f30))

Fundamental refactoring of the whole application, including: 
* **app:** move app routing configuration into a routing module ([a29a872](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a29a872))
* **app:** move shared comps into separate module ([76e0793](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/76e0793))
* **app:** move `framework` to `core` ([2d79a3dd](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/9ff882d))
* **app:** move `/views` one level up ([e62a542](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e62a542))
* **build:** upgrade `ng2-bootstrap` to `ngx-bootstrap` ([d772f68](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/d772f68))
* **edition:** refactor edition-view  
* **search:** refactor search-view
* **shared:** refactor `awg-heading` as shared component ([e524c8b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e524c8b))

Only minor version bump.
 


<a name="0.0.9"></a>
# [0.0.9](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.8.2...v0.0.9) (2016-11-21)


### Bug Fixes

* **contact:** remove unused end of `a`-tag ([5e0a44d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/5e0a44d)), cf. [0.0.8.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.8.1...v0.0.8.2) (2016-10-20)
* **search:** allow handling of multiple hlist values in search service ([9eb0353](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/9eb0353)), cf. [0.0.8.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.8...v0.0.8.1) (2016-08-19)


### Features

* **search:** add handling of image objects ([36b9658](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/36b9658))

Only patch version bump.



<a name="0.0.8"></a>
# [0.0.8](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.7...v0.0.8) (2016-08-19)


### Bug Fixes

* **build:** embedd external libraries & scripts locally ([974f933](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/974f933))
* **edition:** fix wrong line number in `sourceDesc` ([9322bed](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/9322bed))
* **edition:** rebuild getTkA-Functions and directives ([09d00af](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/09d00af))
* **search:** fix control button for timeline ([5894b79](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/5894b79))
* **search:** get search results number from array length, not from nhits ([1925a71](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/1925a71))


### Features

* **build:** start using [Git flow workflow](https://nvie.com/posts/a-successful-git-branching-model/)
* **edition:** add basic data for integration of sketch Aa:SkI/1 - ongoing ([b2ff8ab](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/b2ff8ab))
* **search:** add handling for geoname values in search service ([a07dae6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/a07dae6))
* **search:** add handling for hlist values in search service ([886911c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/886911c))

Only patch version bump.



<a name="0.0.7"></a>
# [0.0.7](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.6...v0.0.7) (2016-07-14)


### Bug Fixes

* **app:** use edition date separated from version & its release date ([2174277](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/2174277))
* **search:** change order of search results (by restype) ([c9e2a05](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/c9e2a05))


### Features

* **search:** add timeline for 'daily events' ([18e4969](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/18e4969))

Timeline feature based on: Robert Pocklington ([@rpocklin](https://github.com/rpocklin/)), Melbourne, VIC, AU, 2015–2016, [Angular Timeline](https://github.com/rpocklin/angular-timeline) (accessed 10.7.2016).

Only patch version bump.



<a name="0.0.6"></a>
# [0.0.6](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.5...v0.0.6) (2016-04-28)


### Bug Fixes

* **search:** improve default object header in search service ([c1b9e79](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/c1b9e79))
* **search:** exclude html tags from highlighted search ([7d09f19](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/7d09f19))



<a name="0.0.5"></a>
# [0.0.5](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.4...v0.0.5) (2016-04-14)


### Bug Fixes

* **search:** improve routine for highlighted search ([e435868](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/e435868))


### Features

* **search:** add handling of selection lists and supplements in search service ([3143f71](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/3143f71))

Only patch version bump.



<a name="0.0.4"></a>
# [0.0.4](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.3...v0.0.4) (2016-03-31)


### Bug Fixes

* **search:** use `restype_id` instead of `restype_label` to identify correct resource type ([2a3983a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/2a3983a))



<a name="0.0.3"></a>
# [0.0.3](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.2...v0.0.3) (2016-03-17)


### Features

* **search:** add highlighting for searchresults ([4149940](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4149940))

Only patch version bump.



<a name="0.0.2"></a>
# [0.0.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.1...v0.0.2) (2016-03-03)


### Bug Fixes

* **search:** replace salsah links in searchresults ([f451123](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/f451123))


### Features

* **app:** add sidenav templates for app views ([4758bc1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/4758bc1))

Only patch version bump.



<a name="0.0.1"></a>
# [0.0.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commits/68eac337) (2016-02-02)
