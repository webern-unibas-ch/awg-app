# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.1.0](https://github.com/webern-unibas-ch/awg-app/compare/v1.0.1...v1.1.0) (2024-11-14)

### Features

-   **assets:** activate edition complex M 322 ([cb2f960](https://github.com/webern-unibas-ch/awg-app/commit/cb2f96072026d6cbf9e09403b3e008290a5c53d3))
-   **assets:** add corrections for Op4: H ([7490357](https://github.com/webern-unibas-ch/awg-app/commit/7490357de9ca590a46ca019f67a318000ebacc5a); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add files for M 140 TF1 ([fce218a](https://github.com/webern-unibas-ch/awg-app/commit/fce218a1f3bf51989803a216570ffac9252605f2); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add files for m321 Sk1 & Sk2 ([39a5a54](https://github.com/webern-unibas-ch/awg-app/commit/39a5a549947972439f1bb81491bab5bed03846d3); thanks to [@masthom](https://github.com/masthom)), closes [#551](https://github.com/webern-unibas-ch/awg-app/issues/551)
-   **assets:** add files for m322 Sk1 & Sk2 ([2d9eb0f](https://github.com/webern-unibas-ch/awg-app/commit/2d9eb0f7f7dd19d8b59b470ab0aa7299263621a8); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add files for m322 Sk3 ([7fa50d7](https://github.com/webern-unibas-ch/awg-app/commit/7fa50d7a97ec445f0b5d4238023922a206f37570); thanks to [@masthom](https://github.com/masthom))
-   **core:** add fullscreen service ([610d45f](https://github.com/webern-unibas-ch/awg-app/commit/610d45f3a9cf6562362cefb4b9da0527aef6018b))
-   **edition:** add fullscreen option to svg sheet viewer ([ea42db2](https://github.com/webern-unibas-ch/awg-app/commit/ea42db24f1d675c46163dfd916d624ca92f8a7a0)), closes [#1964](https://github.com/webern-unibas-ch/awg-app/issues/1964)

### Bug Fixes

-   **app:** make fields only assigned in the constructor readonly ([a6611cc](https://github.com/webern-unibas-ch/awg-app/commit/a6611cca748122ff06f4f3cf9d6faeac1c5df329))
-   **app:** make fields only assigned in the constructor readonly (final) ([8cd868b](https://github.com/webern-unibas-ch/awg-app/commit/8cd868b5209e352dddd4f56215914488f111fed4))
-   **assets:** add item links for m321 & m322 ([fa8f690](https://github.com/webern-unibas-ch/awg-app/commit/fa8f6902db061ccd7fe78fc63237aa89d1b2cad0))
-   **assets:** add item links to m140 ([f720528](https://github.com/webern-unibas-ch/awg-app/commit/f72052855652ad47c37daba87deb74ed9f47dd7f))
-   **assets:** add missing supplied classes in M 321 Sk1 & Sk2 ([77d8a19](https://github.com/webern-unibas-ch/awg-app/commit/77d8a1933b3d9f069da4ff0bfd834fd730c54d44); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add missing supplied classes to svg files of m317 ([29bc4b9](https://github.com/webern-unibas-ch/awg-app/commit/29bc4b9f51c9b09338bef12c95dbca1686a19c68))
-   **assets:** adjust files for row tables ([fd29b81](https://github.com/webern-unibas-ch/awg-app/commit/fd29b81e0c278bcbeba2f35c47174a3340a75ee4))
-   **assets:** fix missing glyphs ([662ef69](https://github.com/webern-unibas-ch/awg-app/commit/662ef690367cbfbd27b4cbf200f75108f4576472))
-   **assets:** fix wrong references in files for m322 ([a4b9ccf](https://github.com/webern-unibas-ch/awg-app/commit/a4b9ccf2d5470c6ab162b4481ebd553f7313cf56))
-   **assets:** optimize svgs for AWG I/5 with SVGO ([0d3e880](https://github.com/webern-unibas-ch/awg-app/commit/0d3e8806b97dc4cea2558c9f64ae3fcd9e9a9280))
-   **assets:** optimize svgs for op25 with SVGO ([191eb49](https://github.com/webern-unibas-ch/awg-app/commit/191eb49f5b0cf1d9d5b98de087f55f66eb129ed6))
-   **assets:** optimize svgs for op25 with SVGO ([953e37d](https://github.com/webern-unibas-ch/awg-app/commit/953e37dd6985df53a4b92835d3b8f30b30ff8a24))
-   **assets:** update source description of op25 ([ca05932](https://github.com/webern-unibas-ch/awg-app/commit/ca059327bc493a684833a3a8ab081adc8bb4d2be); thanks to [@masthom](https://github.com/masthom))
-   **edition:** add missing glyphs for quadruple dynamics ([a40720f](https://github.com/webern-unibas-ch/awg-app/commit/a40720f3e8251df63713ca9dd1e23a0de36f627d))

### Code Refactoring

-   **edition:** reorganize glyphs data file ([fffae9d](https://github.com/webern-unibas-ch/awg-app/commit/fffae9d66d69d910f2ee529942add36e49c674ce))
-   **edition:** use loading service for edition sheets ([42a2c31](https://github.com/webern-unibas-ch/awg-app/commit/42a2c315a200c0723014d686da316225a79264f7))
-   **shared:** move fullscreen toggle into separate component ([8b075f3](https://github.com/webern-unibas-ch/awg-app/commit/8b075f395d52ce949f734383e803ab58d77d00eb))

### Tests

-   **core:** fix deprecated method in tests for navbar ([5954682](https://github.com/webern-unibas-ch/awg-app/commit/5954682823c039a6e2a72d7ec6c05be99fc82bb8))

### Styles

-   **edition:** use card style for sheet footer ([a19f00c](https://github.com/webern-unibas-ch/awg-app/commit/a19f00cd75879296323dbca37481e32c294ca27f))
-   **edition:** use rounded corners for sheet viewer ([c2bba3c](https://github.com/webern-unibas-ch/awg-app/commit/c2bba3c388dece236749e5898b27d3fca24f2cb5))

### Build System

-   **deps-dev:** bump @types/node from 20.14.14 to 22.9.0 ([5055c14](https://github.com/webern-unibas-ch/awg-app/commit/5055c14cc67a2f68cbccf5ad25c8b57e9684c5e7))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.4.3 to 50.5.0 ([0c63c8f](https://github.com/webern-unibas-ch/awg-app/commit/0c63c8f69614f3ebe056ba0701b41999b8e2fa63))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([bc02c02](https://github.com/webern-unibas-ch/awg-app/commit/bc02c02f0137ed2e418979c40bb56b69bfa0da50))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([9286a39](https://github.com/webern-unibas-ch/awg-app/commit/9286a3910ef6ff4836614087d25f3ca0dadef152))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([bbdd6bb](https://github.com/webern-unibas-ch/awg-app/commit/bbdd6bba60baa2676b666705a404c4c9d051371a))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([13a2e4c](https://github.com/webern-unibas-ch/awg-app/commit/13a2e4c0af4db876ce2ed22503ada5776cf37f8d))
-   **deps:** bump @codemirror/legacy-modes from 6.4.1 to 6.4.2 ([817ba8d](https://github.com/webern-unibas-ch/awg-app/commit/817ba8dc66647c96b5ed20e8c61fabc68ed6862e))
-   **deps:** bump actions/dependency-review-action from 4.3.5 to 4.4.0 ([4f7a578](https://github.com/webern-unibas-ch/awg-app/commit/4f7a578af2238e7506c4319cf4662343e0648562))
-   **deps:** bump github/codeql-action from 3.27.0 to 3.27.1 ([d0feb24](https://github.com/webern-unibas-ch/awg-app/commit/d0feb24e461e714527f1bf46d35901ab514c7280))
-   **deps:** bump github/codeql-action from 3.27.1 to 3.27.2 ([e1c3b28](https://github.com/webern-unibas-ch/awg-app/commit/e1c3b2855490d052595e6f49034431566d79ec60))
-   **deps:** bump github/codeql-action from 3.27.2 to 3.27.3 ([0b92434](https://github.com/webern-unibas-ch/awg-app/commit/0b9243409d76b755a3f8cf3dfccbf6ba2065d879))
-   **deps:** bump github/codeql-action from 3.27.3 to 3.27.4 ([7e246a8](https://github.com/webern-unibas-ch/awg-app/commit/7e246a8d98354c8019792d7dabf61fd2dcccb69a))
-   **deps:** bump n3 from 1.22.3 to 1.23.0 ([da7531b](https://github.com/webern-unibas-ch/awg-app/commit/da7531bd73ab35f4ca47757b62d7feacd48528c5))
-   **deps:** bump softprops/action-gh-release from 2.0.8 to 2.0.9 ([1facc9d](https://github.com/webern-unibas-ch/awg-app/commit/1facc9df4f4936fc9042e7d63b7b67df3f54f57b))
-   **deps:** bump softprops/action-gh-release from 2.0.9 to 2.1.0 ([2638e77](https://github.com/webern-unibas-ch/awg-app/commit/2638e774a705e5aeec874e4bb8604cb870d6bab6))
-   **deps:** bump the angular group with 11 updates ([5245667](https://github.com/webern-unibas-ch/awg-app/commit/5245667e053e653f5d3d9fd4d434263c2025694b))
-   **deps:** bump the angular group with 11 updates ([8e8384d](https://github.com/webern-unibas-ch/awg-app/commit/8e8384d3b85c2ffe0182369a1eed2c51c121df49))

## [1.0.1](https://github.com/webern-unibas-ch/awg-app/compare/v1.0.0...v1.0.1) (2024-11-12)

### Bug Fixes

-   **edition:** fix wrong tracking index in tka table ([4662928](https://github.com/webern-unibas-ch/awg-app/commit/4662928acccc8bc6555812cb7fab6d56d6b906d9))

## [1.0.0](https://github.com/webern-unibas-ch/awg-app/compare/v0.14.0...v1.0.0) (2024-10-26)

### ⚠ BREAKING CHANGES

-   **app:** This ends the status of the app as a prototype.

### Features

-   **app:** move away from prototype ([0495501](https://github.com/webern-unibas-ch/awg-app/commit/0495501db4a05edc59a23d525f0f67d5f2bd769b))
-   **assets:** add corrections in Op12: C ([627979a](https://github.com/webern-unibas-ch/awg-app/commit/627979afd42153b0b1892bd4f172bfd556ad498e); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op25: E ([af3804f](https://github.com/webern-unibas-ch/awg-app/commit/af3804f473c0d47dd6d2aa8afda0cbc8075ad605); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op3: A ([efff423](https://github.com/webern-unibas-ch/awg-app/commit/efff423b071df0376e4215f84b511b1433fb278c); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op3: B ([afbde12](https://github.com/webern-unibas-ch/awg-app/commit/afbde12b5a6194dbc716c817f04c60fa21f6c0ea); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op3: C ([29873dc](https://github.com/webern-unibas-ch/awg-app/commit/29873dc9d29b5d3215c7db098494507cccdcbccb); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op3: E ([8fd65a3](https://github.com/webern-unibas-ch/awg-app/commit/8fd65a35df30647ef1c27b17ba005d3a03ad9a21); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op3: F ([6aa4ee9](https://github.com/webern-unibas-ch/awg-app/commit/6aa4ee9c2e67d84f23041a49b827895dfc187685); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op3: G ([6a9a559](https://github.com/webern-unibas-ch/awg-app/commit/6a9a559691e64ea476a08a8f21aaa0aae42bec90); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op3: H ([1e978d1](https://github.com/webern-unibas-ch/awg-app/commit/1e978d1ef67471c8c58398a4b568ebb4b7ae2d21); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op3: I + J ([490313d](https://github.com/webern-unibas-ch/awg-app/commit/490313dc6e56c8ac37cad515e8769cf20239a96f); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op4: A ([21243a0](https://github.com/webern-unibas-ch/awg-app/commit/21243a0c29363359fff069174ab553fd49862cda); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op4: B ([#1881](https://github.com/webern-unibas-ch/awg-app/issues/1881)) ([c5dda47](https://github.com/webern-unibas-ch/awg-app/commit/c5dda4715d685b6e05b86d6ac46510b7bcaffcb7); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op4: D ([b8569b2](https://github.com/webern-unibas-ch/awg-app/commit/b8569b284fc8cd96b59f0209d7a35d268eb35de1); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op4: GH ([2087ead](https://github.com/webern-unibas-ch/awg-app/commit/2087eadcbd4f5040e3d21f62c6842076ae384821); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add corrections in Op4: I ([c73d9df](https://github.com/webern-unibas-ch/awg-app/commit/c73d9df536fa6485f1714b4ea5fa7cb53bd36c25); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add intro preview to section detail ([dbf516a](https://github.com/webern-unibas-ch/awg-app/commit/dbf516a075fe92f702baea8ec33fd94b492ab86c))
-   **assets:** create section wide intro file ([49bdbad](https://github.com/webern-unibas-ch/awg-app/commit/49bdbade5b9898ecef9ce5c1d2efad38e2c1ec08))
-   **edition:** add breadcrumb for section intro ([5ee951b](https://github.com/webern-unibas-ch/awg-app/commit/5ee951b4dab6c2770cd5878fc3b5e514c95b5cfc))
-   **edition:** add check for intro view ([91442e2](https://github.com/webern-unibas-ch/awg-app/commit/91442e21d6cfcf6a7e498e44d25f6a1869002380))
-   **edition:** add cover images to section overview ([9024e76](https://github.com/webern-unibas-ch/awg-app/commit/9024e7681bb85d044414dd9fd28990a295d68473))
-   **edition:** add disclaimer for partial intros ([c772332](https://github.com/webern-unibas-ch/awg-app/commit/c7723327b972f258ede2aab1c18f064a5b2f4987))
-   **edition:** add disclaimer for workeditions ([b3cd451](https://github.com/webern-unibas-ch/awg-app/commit/b3cd451e6926b2f16b6a68674d499fbde1277b80))
-   **edition:** add english version of intro AWG I/5 ([e79f4c1](https://github.com/webern-unibas-ch/awg-app/commit/e79f4c13fc41900efc683d47c22e4bb113774fae))
-   **edition:** add language switcher to intro ([cd3471b](https://github.com/webern-unibas-ch/awg-app/commit/cd3471b05bd54f6871fbd0d2ab11464cf72c7999))
-   **edition:** add route for section intro ([f6e29ac](https://github.com/webern-unibas-ch/awg-app/commit/f6e29acfcbffb7db49a062c8ebbd5b210f111a59))
-   **edition:** add scrollable menu to intro ([c1b49d6](https://github.com/webern-unibas-ch/awg-app/commit/c1b49d6a3638f44596cb649e480ea64ad91fde05))
-   **edition:** add section intro link to side info ([a4326c3](https://github.com/webern-unibas-ch/awg-app/commit/a4326c335fef302c57a5803833174f085f919253))
-   **edition:** add service method to load section intro data ([7bc1a87](https://github.com/webern-unibas-ch/awg-app/commit/7bc1a87231060e43aaa867e52f228cee5037ca4e))
-   **edition:** include intro and disclaimer in edition section detail ([10b517c](https://github.com/webern-unibas-ch/awg-app/commit/10b517c04b998f11dbedc339d1401b2c9cd84a6b))
-   **home:** add card navigation to home view ([79cb5e3](https://github.com/webern-unibas-ch/awg-app/commit/79cb5e33814dc449f33c72e40634de4dc707f729))
-   **shared:** add abbreviation directive ([c9d75d8](https://github.com/webern-unibas-ch/awg-app/commit/c9d75d81e401f834d6afda8a6d4eac04e24f2530))

### Bug Fixes

-   **app:** do not show sideOutlet on home view ([dc42407](https://github.com/webern-unibas-ch/awg-app/commit/dc42407ed302d21ca122b6ca431d5a2cdf2fbfe1))
-   **assets:** add full intro for AWG I/5 ([169be29](https://github.com/webern-unibas-ch/awg-app/commit/169be29fcb767f73ad0e98266490f715e6059dcb))
-   **assets:** fix formatting of corrections ([10797f9](https://github.com/webern-unibas-ch/awg-app/commit/10797f92c39dfcc11d328aaca9b69114563929ce))
-   **assets:** fix formatting of corrections op3 ([1231ef7](https://github.com/webern-unibas-ch/awg-app/commit/1231ef74a501213e8018c123f9ae44ea45519505))
-   **assets:** fix formatting of corrections op3: B ([b234ef6](https://github.com/webern-unibas-ch/awg-app/commit/b234ef6b6d8331600414d156a3503f9c234b4741))
-   **assets:** fix formatting of corrections op3: C ([c49b0fb](https://github.com/webern-unibas-ch/awg-app/commit/c49b0fb6150c2e18a8d4c5529f49514bed28c422))
-   **assets:** fix formatting of corrections op3: E ([d52628d](https://github.com/webern-unibas-ch/awg-app/commit/d52628dda7446768c3a94ce86a5c27d2269963d3))
-   **assets:** fix formatting of corrections op3: F–H ([2b57b7f](https://github.com/webern-unibas-ch/awg-app/commit/2b57b7fdc33207273762b199ca810cd73ad924d1))
-   **assets:** fix link boxes in m38 ([d00e60d](https://github.com/webern-unibas-ch/awg-app/commit/d00e60de1c34a479590af8c061292bb3d2a46bf6); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** fix typo in label in op3: source_Ee_corr2 ([cd91a14](https://github.com/webern-unibas-ch/awg-app/commit/cd91a1459e2b71e6e0acfa18517de321318f1ca3))
-   **assets:** fix typo in textcritics for m38 ([62eff2c](https://github.com/webern-unibas-ch/awg-app/commit/62eff2c9e132ac062cdbac2863d0fb471fb35e7a))
-   **assets:** fix typos in intro AWG I/5 ([9780252](https://github.com/webern-unibas-ch/awg-app/commit/9780252585afa940f8f5d8aa464349986630793b))
-   **assets:** make sources of intro navigable ([836ea8a](https://github.com/webern-unibas-ch/awg-app/commit/836ea8a73d4bd7947cec029483bf89eb4003424d))
-   **assets:** optimize svgs for m38 with SVGO ([af48f6a](https://github.com/webern-unibas-ch/awg-app/commit/af48f6a65a7000ccbda9892f0e638f574c2f5234))
-   **assets:** provide intro notes as blockNotes ([267aa0f](https://github.com/webern-unibas-ch/awg-app/commit/267aa0f7bac894dc7980e7d6740919a6b870f2f0))
-   **assets:** remove disclaimer for corrections of op25 ([9087bfc](https://github.com/webern-unibas-ch/awg-app/commit/9087bfccf7b5ef6d06193faafe0e68277f885050); thanks to [@masthom](https://github.com/masthom))
-   **assets:** remove side outlet from data ([d9421de](https://github.com/webern-unibas-ch/awg-app/commit/d9421de1b243c8f4b02e96de4c3368826e120d3e))
-   **assets:** remove unnecessary line break from intro AWG I/5 ([b0905bc](https://github.com/webern-unibas-ch/awg-app/commit/b0905bc0cd11c65694fa8c368924cb75ebc0e07f))
-   **assets:** small fixes in source descriptions AWG I/5 ([c520b4e](https://github.com/webern-unibas-ch/awg-app/commit/c520b4e20596a8a3924cd771ac69cb5bda5430fb); thanks to [@masthom](https://github.com/masthom))
-   **assets:** use glyphs for note values ([eb26661](https://github.com/webern-unibas-ch/awg-app/commit/eb26661b8b5c1838a60d24b44d4a729440e2f6cd))
-   **core:** mute search button on navbar ([53a1d90](https://github.com/webern-unibas-ch/awg-app/commit/53a1d90109bedf97b31ff38b110440592367f965))
-   **edition:** add complex to breadcrumb if given ([86857ec](https://github.com/webern-unibas-ch/awg-app/commit/86857ecd7feff170a0544c74f592a4d902810b48))
-   **edition:** add description to series overview ([c517895](https://github.com/webern-unibas-ch/awg-app/commit/c517895fe7d64187c7d9a1587a5fddba5fc6f9fd))
-   **edition:** add missing glyph for sfz ([d1d3c41](https://github.com/webern-unibas-ch/awg-app/commit/d1d3c4101bd9b2a86c2631fe6654e4a9161e0263))
-   **edition:** add missing glyphs for note values ([2d08ad1](https://github.com/webern-unibas-ch/awg-app/commit/2d08ad1286f55726d2972facd58933958f2e20dd))
-   **edition:** add missing glyphs for sf and sp ([7cebd28](https://github.com/webern-unibas-ch/awg-app/commit/7cebd281a186342154e04e2773e97d07e38ff475))
-   **edition:** don't display table if there are no corrections ([02bf591](https://github.com/webern-unibas-ch/awg-app/commit/02bf591abfd43ae21266dcb18d0c1b2f65e73b3c))
-   **edition:** finish formatting of intro AWG I/5 ([464e16e](https://github.com/webern-unibas-ch/awg-app/commit/464e16e1f20d7aca49ef0c16f00ad585c05d729b))
-   **edition:** fix check for section III/5 in outline model ([317c66d](https://github.com/webern-unibas-ch/awg-app/commit/317c66d2e0ea4ecae254e13b8f75c68895ccff4c))
-   **edition:** fix typo in textcritics for m38 ([c03ba8c](https://github.com/webern-unibas-ch/awg-app/commit/c03ba8c3c2ae6afe8e9d5fccb15a9f67205ef28f))
-   **edition:** improve wording in section detail disclaimer ([dc3ec09](https://github.com/webern-unibas-ch/awg-app/commit/dc3ec0986d431d868ff770493700785bd3f0d150))
-   **edition:** improve wording of section detail disclaimer ([b4f6ff2](https://github.com/webern-unibas-ch/awg-app/commit/b4f6ff253cce4921b4ef71605fb49f2a45d36f51))
-   **edition:** make footnotes of intro navigable ([57d575a](https://github.com/webern-unibas-ch/awg-app/commit/57d575a6b082c2e71f0ffcbe029718dcc6388d68))
-   **edition:** move intro parts into separate components ([7965435](https://github.com/webern-unibas-ch/awg-app/commit/79654355a70ce97c62145e79ca4013a590500889))
-   **edition:** move section detail overview into separate comp ([4dc7bd9](https://github.com/webern-unibas-ch/awg-app/commit/4dc7bd9e459e0a39702cb5f44e79d8c3a717d8c1))
-   **edition:** update series and section from edition complex too ([4b87cc6](https://github.com/webern-unibas-ch/awg-app/commit/4b87cc6520a078612e034bb45e26b46cf9c3b056))
-   **edition:** use solid icon for calendarX ([64df1f1](https://github.com/webern-unibas-ch/awg-app/commit/64df1f1f262fad2340a37abdfe5406b00996608f))
-   **home:** display sections instead of complexes in home-view ([261b97a](https://github.com/webern-unibas-ch/awg-app/commit/261b97a02040b9a73da7a6c0ad08a4af29824988))
-   **home:** link to doku page instead of compodoc ([c2707c9](https://github.com/webern-unibas-ch/awg-app/commit/c2707c9bd7c569826e75d8f28cfd87ec9941fc65))
-   **home:** update landing page content ([9053f3d](https://github.com/webern-unibas-ch/awg-app/commit/9053f3d8fe131c8694bdb0fb00a10c6d689fa207))
-   **side-info:** collapse section menus by default ([417d0a4](https://github.com/webern-unibas-ch/awg-app/commit/417d0a4d1380a97f9ef6db45656ab5e9a55a82f7))
-   **side-info:** open sections dynamically ([f02325b](https://github.com/webern-unibas-ch/awg-app/commit/f02325b40f27064cbc41a39b12046d3d0dca814d))
-   **structure:** replace SALSAH with DSP in structure-view ([b4dae1d](https://github.com/webern-unibas-ch/awg-app/commit/b4dae1d678f770b093dca3f72eb0b9c398f45412))

### Code Refactoring

-   **app:** rename routeToSidenav method ([889e4e4](https://github.com/webern-unibas-ch/awg-app/commit/889e4e447c55c4718ef62ccb8708f8961ceda3a9))
-   **core:** improve handling of navbar icons and labels ([d78e66b](https://github.com/webern-unibas-ch/awg-app/commit/d78e66b84e44f7059fc98958408caf6499cc542b))
-   **core:** unify naming of core data ([5a4b4cc](https://github.com/webern-unibas-ch/awg-app/commit/5a4b4cc6302f244412f4f17b85cb423ac889db24))
-   **edition:** adjust outline model to account for intro ([33fb9ed](https://github.com/webern-unibas-ch/awg-app/commit/33fb9ed0c4277951478dfd52c714b3611013c8af))
-   **edition:** adjust wording for headings and disclaimer ([ac82f9d](https://github.com/webern-unibas-ch/awg-app/commit/ac82f9d6799b8cb0adb70a20ab82d7cc6baf4d14))
-   **edition:** improve naming of intro scroll methods ([3a6e00b](https://github.com/webern-unibas-ch/awg-app/commit/3a6e00b88493d1f4f86647940549ccec4b13055b))
-   **edition:** improve wording of disclaimers ([90faae0](https://github.com/webern-unibas-ch/awg-app/commit/90faae0354c7ab8aea68181d37076e94e5d550b5))
-   **edition:** rename EditionIntroEmptyComponent ([e638f35](https://github.com/webern-unibas-ch/awg-app/commit/e638f3585cfdedaa17ba68e5b764240d804cedc1))
-   **edition:** rename EditionService -> EditionStateService ([4800f27](https://github.com/webern-unibas-ch/awg-app/commit/4800f27927180acae9aa206ea2ce4b441990a8a4))
-   **edition:** rename intro footnotes --> notes ([62a5e06](https://github.com/webern-unibas-ch/awg-app/commit/62a5e066c3a35f48147e174b635549657553baa1))
-   **edition:** reorganize edition view routing ([9152c8f](https://github.com/webern-unibas-ch/awg-app/commit/9152c8ffe03a0020b9d38194ec19d35b80d1c015))
-   **home:** move home cards into separate component ([8ce8dd7](https://github.com/webern-unibas-ch/awg-app/commit/8ce8dd7f9535aa138b7b73546d622749e7c1f3b0))
-   **shared:** move alert-info into separate component ([f55a6ff](https://github.com/webern-unibas-ch/awg-app/commit/f55a6ffde221a03a434e7ae2f65517c9fe2a8bfa))
-   **shared:** move language switcher into separate component ([7999eab](https://github.com/webern-unibas-ch/awg-app/commit/7999eab51dcdfa7a1e235eab5788e188fdfde391))
-   **shared:** rename AlertErrorComponent ([9cc9d76](https://github.com/webern-unibas-ch/awg-app/commit/9cc9d76b8073a7dcbd6db900d57bcaec5123c1ec))

### Tests

-   **edition:** fix tests for intro components after changes ([4a6bccb](https://github.com/webern-unibas-ch/awg-app/commit/4a6bccb543d156baf6ae77bc6d06f030f5f9fc90))
-   **home:** fix tests after changes ([1aae98d](https://github.com/webern-unibas-ch/awg-app/commit/1aae98d4b751bf8939df76a081c3cc0f60606f1a))
-   **search:** fix tests after changes ([ccc2864](https://github.com/webern-unibas-ch/awg-app/commit/ccc2864574b735c0874e1c4ff473224470aa3bb1))
-   **side-info:** fix tests for EditionInfo after changes ([ef11d3a](https://github.com/webern-unibas-ch/awg-app/commit/ef11d3ab9720caf55de3b0116b694a3d7b34054f))

### Documentation

-   **README:** update project image ([1a5b9e6](https://github.com/webern-unibas-ch/awg-app/commit/1a5b9e6ce1ea05928326265734f8a306a400b0e8))
-   **shared:** add JSDocs to new AlertInfo class ([4a18a5e](https://github.com/webern-unibas-ch/awg-app/commit/4a18a5e9767789f88ba00fa3c8911a62ecded339))

### Styles

-   **app:** justify block text ([5b5b59b](https://github.com/webern-unibas-ch/awg-app/commit/5b5b59b70d4eeb2e71d7b3c2f4009862aa49f8ee))
-   **app:** swap display web font ([d00be32](https://github.com/webern-unibas-ch/awg-app/commit/d00be32e6ca5af0213041ede6a7ff17109623ffd))
-   **app:** unify layout of main view components ([5e96699](https://github.com/webern-unibas-ch/awg-app/commit/5e9669978f80c051d42aa3c1c95e5bbcec4cc90a))
-   **edition:** fix style for intro components ([204ea18](https://github.com/webern-unibas-ch/awg-app/commit/204ea18761041f291c98318de59f72b17fbd3203))
-   **edition:** highlight blockHeaders in tka tables ([d61482b](https://github.com/webern-unibas-ch/awg-app/commit/d61482b61f4db2d761f5a1b77f69d2425cc98bfa))
-   **edition:** improve display of corrections ([40dfe94](https://github.com/webern-unibas-ch/awg-app/commit/40dfe94d3cdeb947f54f4f4d3beb9f216b4a1e1b))
-   **edition:** improve responsivity of cover images ([57f67c7](https://github.com/webern-unibas-ch/awg-app/commit/57f67c7ee97877d3d43dc2fabaaea138d56b95bf))
-   **edition:** justify preface text ([343c277](https://github.com/webern-unibas-ch/awg-app/commit/343c2779533ab4d3d46e43d9d6f61fabc75ffdc3))
-   **edition:** remove bg-colors from intro helper classes ([4343fb7](https://github.com/webern-unibas-ch/awg-app/commit/4343fb787bf7477ea9034abb5a9a76d857d6f1e4))
-   **home:** stretch links of home view cards ([ea0a657](https://github.com/webern-unibas-ch/awg-app/commit/ea0a6571966930b0678d706d22d9290b98823c32))
-   **page-not-found:** improve styling ([5559862](https://github.com/webern-unibas-ch/awg-app/commit/5559862c87edf163368ca15bc8abd11d806c9b45))

### Build System

-   **deps-dev:** bump @compodoc/compodoc from 1.1.25 to 1.1.26 ([c99aba1](https://github.com/webern-unibas-ch/awg-app/commit/c99aba19b2646d1959e46acb72e1fd43f4b72246))
-   **deps-dev:** bump angular-cli-ghpages from 2.0.1 to 2.0.3 ([c0c965b](https://github.com/webern-unibas-ch/awg-app/commit/c0c965b24bf7bd93296d142f18000953af5bb678))
-   **deps-dev:** bump commit-and-tag-version from 12.4.1 to 12.4.2 ([453d6f3](https://github.com/webern-unibas-ch/awg-app/commit/453d6f3164a331b5dd012a5f7685bba55357e258))
-   **deps-dev:** bump commit-and-tag-version from 12.4.2 to 12.4.3 ([a55f678](https://github.com/webern-unibas-ch/awg-app/commit/a55f678103afcb9400712bc76057d635bd7085ec))
-   **deps-dev:** bump commit-and-tag-version from 12.4.3 to 12.4.4 ([c0cc93f](https://github.com/webern-unibas-ch/awg-app/commit/c0cc93f3bcfbf3038f3eecc3b77925b0a3a50cd6))
-   **deps-dev:** bump commit-and-tag-version from 12.4.4 to 12.5.0 ([9f2abfc](https://github.com/webern-unibas-ch/awg-app/commit/9f2abfc05d93f1a7a2d0b8ddacdc860d5cec1c16))
-   **deps-dev:** bump eslint-plugin-import from 2.29.1 to 2.30.0 ([486f7e9](https://github.com/webern-unibas-ch/awg-app/commit/486f7e934e636b6ac3af29a5434ec443dc986368))
-   **deps-dev:** bump eslint-plugin-import from 2.30.0 to 2.31.0 ([0d0ef06](https://github.com/webern-unibas-ch/awg-app/commit/0d0ef0630f4cdef992c04b9d9d2a520159901344))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.2.2 to 50.2.3 ([e640d63](https://github.com/webern-unibas-ch/awg-app/commit/e640d63aed133a4795cb721b5e89ffd20f9b3f22))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.2.3 to 50.2.4 ([e0c28ea](https://github.com/webern-unibas-ch/awg-app/commit/e0c28ea3bfdc7e6d509bfe42456c5dfd9fa645e4))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.2.4 to 50.2.5 ([1ad6cbd](https://github.com/webern-unibas-ch/awg-app/commit/1ad6cbdbaff0c959fb0399208dceb18d6e96864b))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.2.5 to 50.3.0 ([0d70055](https://github.com/webern-unibas-ch/awg-app/commit/0d70055cc12529d56311f6dee29f012bc6a9fb12))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.3.0 to 50.3.1 ([110a2de](https://github.com/webern-unibas-ch/awg-app/commit/110a2de552c70c00de602ccff3eabf42677abe82))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.3.1 to 50.4.0 ([1de101f](https://github.com/webern-unibas-ch/awg-app/commit/1de101f3371c41cda476af2dcfab3f2047d4bd17))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.4.0 to 50.4.1 ([28243f6](https://github.com/webern-unibas-ch/awg-app/commit/28243f620f35fb6199520479156a5bc75bf67b0c))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.4.1 to 50.4.3 ([709259b](https://github.com/webern-unibas-ch/awg-app/commit/709259b15b85acfdfc02a241687823a3bd799031))
-   **deps-dev:** bump husky from 9.1.4 to 9.1.5 ([0c7b7a1](https://github.com/webern-unibas-ch/awg-app/commit/0c7b7a1dc5033f86f98ae137dde6ec93e824f29f))
-   **deps-dev:** bump husky from 9.1.5 to 9.1.6 ([375a190](https://github.com/webern-unibas-ch/awg-app/commit/375a19098d0f20e07dbe409b3191c02e697f53da))
-   **deps-dev:** bump jasmine-core from 5.2.0 to 5.3.0 ([994b48b](https://github.com/webern-unibas-ch/awg-app/commit/994b48b212e3484a44c916b321b694689e5044aa))
-   **deps-dev:** bump jasmine-core from 5.3.0 to 5.4.0 ([cb7cdd8](https://github.com/webern-unibas-ch/awg-app/commit/cb7cdd84ac24a3d3754467adc3f82408ea19643d))
-   **deps-dev:** bump lint-staged from 15.2.9 to 15.2.10 ([f60bc07](https://github.com/webern-unibas-ch/awg-app/commit/f60bc07f238009056fa16826b67db289ef76c0d8))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([60915df](https://github.com/webern-unibas-ch/awg-app/commit/60915dfdcf7f5f17746fd9cdb59cf18531285214))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([ba4ac9f](https://github.com/webern-unibas-ch/awg-app/commit/ba4ac9f809906c131efe58e71ef781a1bbbe48ed))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([5622c9c](https://github.com/webern-unibas-ch/awg-app/commit/5622c9cd5eebe1f3083a0ddbc75cb63e019bd240))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([aa7dc82](https://github.com/webern-unibas-ch/awg-app/commit/aa7dc82cd82aef0fcbd0268fb61c783598c18e1e))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([abbdcb1](https://github.com/webern-unibas-ch/awg-app/commit/abbdcb1af23817cf28e732e1841d7f34b7f222ef))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([b883d76](https://github.com/webern-unibas-ch/awg-app/commit/b883d76739f865e3b23107a26fee9dde688054df))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([f7e2c33](https://github.com/webern-unibas-ch/awg-app/commit/f7e2c3361ff9a7106b84aa3dace2f78e7bfca4cd))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([9b378ed](https://github.com/webern-unibas-ch/awg-app/commit/9b378edf6f922cf9673411919be07c86b0de725e))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([f91b3b6](https://github.com/webern-unibas-ch/awg-app/commit/f91b3b6b28c3ad8fde935125ce2af9404bb1b0e8))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([3670f3f](https://github.com/webern-unibas-ch/awg-app/commit/3670f3f9139f07bcf2f8d3c11c77e48b62db6ae3))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([75f9e80](https://github.com/webern-unibas-ch/awg-app/commit/75f9e80be6df5165da9057ce60c986eb09664e53))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([82910f1](https://github.com/webern-unibas-ch/awg-app/commit/82910f19bf0412db4f3fced80e781c29913abfd3))
-   **deps-dev:** bump the commitlint group with 2 updates ([1720367](https://github.com/webern-unibas-ch/awg-app/commit/1720367ee6fc4b153efaeaa7639381eb98c2f893))
-   **deps-dev:** bump the commitlint group with 2 updates ([8869fbb](https://github.com/webern-unibas-ch/awg-app/commit/8869fbb30244e9dda883610e0d1eda7baf478229))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([39b042e](https://github.com/webern-unibas-ch/awg-app/commit/39b042ed329fc96747a76eb8f9be041eeefc5f66))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([3e54644](https://github.com/webern-unibas-ch/awg-app/commit/3e5464459c5346d43bad497936df6c70d2002db3))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([2865d33](https://github.com/webern-unibas-ch/awg-app/commit/2865d33e87e886ceef45c55c07b18decd7324871))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([7fc0dfd](https://github.com/webern-unibas-ch/awg-app/commit/7fc0dfda02764828fd31f76913fe68a806a26cbb))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([c1e7244](https://github.com/webern-unibas-ch/awg-app/commit/c1e7244217aa7689948e1c538a31506a502d4bcd))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([7bfe627](https://github.com/webern-unibas-ch/awg-app/commit/7bfe627efdb04fd9d3dd96adf2d353b87207d7fd))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([3c11cb8](https://github.com/webern-unibas-ch/awg-app/commit/3c11cb81bbc051763aa9a6f72bbd81428729e5d8))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([23fa261](https://github.com/webern-unibas-ch/awg-app/commit/23fa2617b1af8a5d275c11d436ad4c0a0185e379))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([5fb8d75](https://github.com/webern-unibas-ch/awg-app/commit/5fb8d75ed31706e8a4f4e1ddd7da8c9af6f77660))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([d5eecba](https://github.com/webern-unibas-ch/awg-app/commit/d5eecba3ffe5b5128a64c32d2b5c90d58e74402f))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([7d5141b](https://github.com/webern-unibas-ch/awg-app/commit/7d5141b8c37ef8837ace5fd47cd7940b7df7caf4))
-   **deps:** add fontawesome regular svg icons ([bda78bb](https://github.com/webern-unibas-ch/awg-app/commit/bda78bb4ec8bbc783578d19922bd33ffb9713fcd))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 17.0.0 to 17.0.1 ([3b81441](https://github.com/webern-unibas-ch/awg-app/commit/3b81441558865920951c84d5c33d72d445a435a2))
-   **deps:** bump actions/checkout from 4.1.7 to 4.2.0 ([30866b3](https://github.com/webern-unibas-ch/awg-app/commit/30866b3f020f52e9ad41645a54de9f86874ac481))
-   **deps:** bump actions/checkout from 4.2.0 to 4.2.1 ([9e27174](https://github.com/webern-unibas-ch/awg-app/commit/9e27174fa26c9196fbd79796cf45f9059b0c9564))
-   **deps:** bump actions/checkout from 4.2.1 to 4.2.2 ([90a0530](https://github.com/webern-unibas-ch/awg-app/commit/90a053082ff300aa4706d676f0eac8db1634e51c))
-   **deps:** bump actions/dependency-review-action from 4.3.4 to 4.3.5 ([861f203](https://github.com/webern-unibas-ch/awg-app/commit/861f203f04ae6cbed959314429228653510a1a09))
-   **deps:** bump actions/setup-node from 4.0.3 to 4.0.4 ([1651f83](https://github.com/webern-unibas-ch/awg-app/commit/1651f8370b0f5affb3ff7198fa7acf9a70064153))
-   **deps:** bump actions/setup-node from 4.0.4 to 4.1.0 ([182332a](https://github.com/webern-unibas-ch/awg-app/commit/182332a784811cbdb48a70dc9302d1d1765289a4))
-   **deps:** bump actions/upload-artifact from 4.3.6 to 4.4.0 ([13eb56d](https://github.com/webern-unibas-ch/awg-app/commit/13eb56d0ee8f47c6a3fdc37d6540f21bef46eb65))
-   **deps:** bump actions/upload-artifact from 4.4.0 to 4.4.2 ([337c221](https://github.com/webern-unibas-ch/awg-app/commit/337c221b93d4a30262fa9393e31efc4801b805c4))
-   **deps:** bump actions/upload-artifact from 4.4.2 to 4.4.3 ([42102f3](https://github.com/webern-unibas-ch/awg-app/commit/42102f36b32ec2f6fddf6b581cc06be45b1ef850))
-   **deps:** bump body-parser from 1.20.2 to 1.20.3 ([1d26dcd](https://github.com/webern-unibas-ch/awg-app/commit/1d26dcd7ebdefd39c76a7393a647e0ff5a24190f))
-   **deps:** bump codecov/codecov-action from 4.5.0 to 4.6.0 ([c0651ae](https://github.com/webern-unibas-ch/awg-app/commit/c0651ae5207859a400980e248d2323ee9072d1fe))
-   **deps:** bump express from 4.19.2 to 4.20.0 ([31276cd](https://github.com/webern-unibas-ch/awg-app/commit/31276cd906171835364eaf8faf3ef739cc19d25b))
-   **deps:** bump github/codeql-action from 3.26.10 to 3.26.11 ([c0900fd](https://github.com/webern-unibas-ch/awg-app/commit/c0900fd2c08f9d4599b8db5077ec0bd7684a477f))
-   **deps:** bump github/codeql-action from 3.26.11 to 3.26.12 ([097f982](https://github.com/webern-unibas-ch/awg-app/commit/097f9827ec3ffef5514a54a1864bcf344165720c))
-   **deps:** bump github/codeql-action from 3.26.12 to 3.26.13 ([c51506c](https://github.com/webern-unibas-ch/awg-app/commit/c51506c32a00a7db87b0c62d2cb30a5e4bf22ee6))
-   **deps:** bump github/codeql-action from 3.26.13 to 3.27.0 ([40af3b3](https://github.com/webern-unibas-ch/awg-app/commit/40af3b32b0969f898c93062eee5fe1df6fda74dc))
-   **deps:** bump github/codeql-action from 3.26.2 to 3.26.3 ([331426e](https://github.com/webern-unibas-ch/awg-app/commit/331426e8db01b8b084bf11b6225c6dbd8bdbc47a))
-   **deps:** bump github/codeql-action from 3.26.3 to 3.26.4 ([7c744e6](https://github.com/webern-unibas-ch/awg-app/commit/7c744e660d1464947788ca5f990b073f7a98b277))
-   **deps:** bump github/codeql-action from 3.26.4 to 3.26.5 ([00ea16d](https://github.com/webern-unibas-ch/awg-app/commit/00ea16d63a08a2b2950b5200858a58897741484a))
-   **deps:** bump github/codeql-action from 3.26.5 to 3.26.6 ([6e92f38](https://github.com/webern-unibas-ch/awg-app/commit/6e92f388328e3a1018eca8b058b1e2e0fea49b84))
-   **deps:** bump github/codeql-action from 3.26.6 to 3.26.7 ([6d60b1c](https://github.com/webern-unibas-ch/awg-app/commit/6d60b1c7853ade162e0ced27c3ceefc7d2d8ea9f))
-   **deps:** bump github/codeql-action from 3.26.7 to 3.26.8 ([93f13d0](https://github.com/webern-unibas-ch/awg-app/commit/93f13d0594ffe5574f268fa3cf5450f5061d19c7))
-   **deps:** bump github/codeql-action from 3.26.8 to 3.26.9 ([474070a](https://github.com/webern-unibas-ch/awg-app/commit/474070aa5908fc8fbc54b860df5bf6173c5d1ad2))
-   **deps:** bump github/codeql-action from 3.26.9 to 3.26.10 ([2615d0b](https://github.com/webern-unibas-ch/awg-app/commit/2615d0b12ce6cdc8d633c2c54e4160c3bcbfe527))
-   **deps:** bump http-proxy-middleware from 2.0.6 to 2.0.7 ([d3b9048](https://github.com/webern-unibas-ch/awg-app/commit/d3b90484c681843166728df051e0228fb1fe15db))
-   **deps:** bump micromatch from 4.0.7 to 4.0.8 ([edfeebe](https://github.com/webern-unibas-ch/awg-app/commit/edfeebe9f5cd92b9e9b6722320df52374add9229))
-   **deps:** bump n3 from 1.20.4 to 1.21.0 ([e91ca31](https://github.com/webern-unibas-ch/awg-app/commit/e91ca311105bc11ca148da12ff351f94fd1541ce))
-   **deps:** bump n3 from 1.21.0 to 1.21.1 ([105a74c](https://github.com/webern-unibas-ch/awg-app/commit/105a74c5b4840caa2c8bcf67569d5cdecbd71427))
-   **deps:** bump n3 from 1.21.1 to 1.22.0 ([7749846](https://github.com/webern-unibas-ch/awg-app/commit/7749846c6937389c4d7f3f500df48c62f168998f))
-   **deps:** bump n3 from 1.22.0 to 1.22.1 ([45445b0](https://github.com/webern-unibas-ch/awg-app/commit/45445b0dfdc7df06f11417717e2f32ae50709972))
-   **deps:** bump n3 from 1.22.1 to 1.22.3 ([9551bbd](https://github.com/webern-unibas-ch/awg-app/commit/9551bbd438b49c6a44f6a8ac118281f3047310f3))
-   **deps:** bump rdfstore from v0.9.18-alpha.16 to v0.9.18-alpha.17 ([500b47e](https://github.com/webern-unibas-ch/awg-app/commit/500b47eb4184c6c7607cdbe0e4cae736b833ad41))
-   **deps:** bump rollup from 4.22.0 to 4.22.4 ([6d65df8](https://github.com/webern-unibas-ch/awg-app/commit/6d65df81b5ca910a18fadbbe8c333fedc24a06a6))
-   **deps:** bump SonarSource/sonarcloud-github-action ([6e2fa81](https://github.com/webern-unibas-ch/awg-app/commit/6e2fa811039a69d1e90a41b290e12ee653d66040))
-   **deps:** bump SonarSource/sonarcloud-github-action ([883e23f](https://github.com/webern-unibas-ch/awg-app/commit/883e23fc8a5e41d0d38dd8743e49cce4fee2b271))
-   **deps:** bump step-security/harden-runner from 2.9.1 to 2.10.1 ([dfba1df](https://github.com/webern-unibas-ch/awg-app/commit/dfba1df6721ee4b3cce89181354ca1a4d2f2bb20))
-   **deps:** bump the angular group with 11 updates ([322139f](https://github.com/webern-unibas-ch/awg-app/commit/322139f9607d5f52e6de8d23cf36dfb18f9e1f67))
-   **deps:** bump the angular group with 11 updates ([f6447e3](https://github.com/webern-unibas-ch/awg-app/commit/f6447e3d2a325dec1079518981816d89907bede1))
-   **deps:** bump the angular group with 11 updates ([1d18b4d](https://github.com/webern-unibas-ch/awg-app/commit/1d18b4db5228dc51edd6863c0aed8e732505097f))
-   **deps:** bump the angular group with 11 updates ([005107f](https://github.com/webern-unibas-ch/awg-app/commit/005107f5a012bbf417dbd85fe3828a9406cadfe3))
-   **deps:** bump the angular group with 11 updates ([75ce249](https://github.com/webern-unibas-ch/awg-app/commit/75ce2493dedbbd78ad3a30033a82d43d2eae18e0))
-   **deps:** bump the angular group with 11 updates ([77a68bd](https://github.com/webern-unibas-ch/awg-app/commit/77a68bd326a06ece38151a8161293897e5f3a782))
-   **deps:** bump the angular group with 11 updates ([d7489a3](https://github.com/webern-unibas-ch/awg-app/commit/d7489a3708c6aa5be85337089e623e3d874fb70a))
-   **deps:** bump the angular group with 11 updates ([0602b82](https://github.com/webern-unibas-ch/awg-app/commit/0602b82c16125c3fc96cec61ec4b52b3a7719a3b))
-   **deps:** bump the angular group with 11 updates ([b3d7069](https://github.com/webern-unibas-ch/awg-app/commit/b3d7069fd5039ce48d7b77096fb2bae1e8c20e51))
-   **deps:** bump tslib from 2.6.3 to 2.7.0 ([504ca75](https://github.com/webern-unibas-ch/awg-app/commit/504ca75a95aa037f868c4c43b5726068020d8ad9))
-   **shared:** activate NgbPopoverModule ([66158cf](https://github.com/webern-unibas-ch/awg-app/commit/66158cf22d0ac249f579de444ccd588af02fdb7f))

## [0.14.0](https://github.com/webern-unibas-ch/awg-app/compare/v0.12.3...v0.14.0) (2024-08-19)

### Note

Version 0.13.0 was intentionally skipped in honor of Arnold Schönberg, Anton Webern's lifelong teacher and friend, who feared the number 13 ([Triskaidekaphobia](https://en.wikipedia.org/wiki/Triskaidekaphobia)).

### Features

-   **assets:** add corrections in Op12: EH + F ([8b42d86](https://github.com/webern-unibas-ch/awg-app/commit/8b42d864944d259b48fd649d906cf9c078d27540); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add files for m36 ([5e2ffe6](https://github.com/webern-unibas-ch/awg-app/commit/5e2ffe64f3392efe6f3ad53930c5c9e6182203f2); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** add files for m38 ([03a6c17](https://github.com/webern-unibas-ch/awg-app/commit/03a6c17fd9dca14ecfa86be24b9c713b2ebe3afe); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** add preface content ([3a0210c](https://github.com/webern-unibas-ch/awg-app/commit/3a0210c26559265a63565c5eddda0be46e99ae6a); thanks to [@masthom](https://github.com/masthom))
-   **assets:** move complexes to separate assets file ([fe5571f](https://github.com/webern-unibas-ch/awg-app/commit/fe5571fa47ae820cbc326478e49d401cd091b309))
-   **assets:** move outline to separate assets file ([1e8997d](https://github.com/webern-unibas-ch/awg-app/commit/1e8997d3850e3af4056d369d573166bcef606d1b))
-   **core:** add EditionComplexes service ([c83edf3](https://github.com/webern-unibas-ch/awg-app/commit/c83edf3bf7e0057f8f6bab6f45f56a27b107a639))
-   **core:** add EditionOutline service ([7972875](https://github.com/webern-unibas-ch/awg-app/commit/7972875134ac3adb8a9bae642d548da1aefe2538))
-   **edition:** activate edition complex M 36 ([311b0b4](https://github.com/webern-unibas-ch/awg-app/commit/311b0b4c767ce56add9dd280a2cab81df787d94e))
-   **edition:** activate edition complex M 38 ([5b2a9bf](https://github.com/webern-unibas-ch/awg-app/commit/5b2a9bf6896e1d5c794678cdb685a0467a3e75d7))
-   **edition:** activate preface in app ([4213ea6](https://github.com/webern-unibas-ch/awg-app/commit/4213ea6358706c3443bdddcd3813a2c02bfd42a9))
-   **edition:** add initService & activate EditionOutline service in app ([2eb12d2](https://github.com/webern-unibas-ch/awg-app/commit/2eb12d230bfa4bcb13dfe4761431eead414816f9))
-   **edition:** add option to place folio items next to systems ([06ed541](https://github.com/webern-unibas-ch/awg-app/commit/06ed541e9ca5b3faf2d4930c667bdfccd01ea29f))
-   **edition:** add preface component and methods ([d4af6e8](https://github.com/webern-unibas-ch/awg-app/commit/d4af6e8b40e609759b971e85adcedde199e6fcb4))
-   **edition:** add ScrollToTop button to edition view ([3c75bbd](https://github.com/webern-unibas-ch/awg-app/commit/3c75bbd984ff032c2308e661733d80e8d26628e3))
-   **edition:** add textcritical comment blocks with headers ([7cf3a9b](https://github.com/webern-unibas-ch/awg-app/commit/7cf3a9b3b81247a730588fa0260ede4fdaeaa334))
-   **shared:** add ErrorAlertComponent ([dfbf6ce](https://github.com/webern-unibas-ch/awg-app/commit/dfbf6ce3bd96f35085ec8518560c70761426e650))

### Bug Fixes

-   **app:** fix import paths ([8183d6f](https://github.com/webern-unibas-ch/awg-app/commit/8183d6fc2d276cc856586b585def2a7fcd3b251a))
-   **assets:** add missing colons ([3a256a4](https://github.com/webern-unibas-ch/awg-app/commit/3a256a407391c421025fe2e908f5088ef3bc6f44))
-   **assets:** add missing data files and placeholders for m36 ([feca45b](https://github.com/webern-unibas-ch/awg-app/commit/feca45baf7a028d1017269e91c23297c3900d7ab))
-   **assets:** add missing data files and placeholders for m38 ([62f0ad2](https://github.com/webern-unibas-ch/awg-app/commit/62f0ad297e6227a1034525fe500b094859333945))
-   **assets:** add missing italics ([67c1120](https://github.com/webern-unibas-ch/awg-app/commit/67c1120d932d4340ef5fe414fa05e55cda6fefd1))
-   **assets:** add missing M to source list in m36 ([5aab381](https://github.com/webern-unibas-ch/awg-app/commit/5aab38148620c79fe40158f63f968e6966116c2a))
-   **assets:** adjust corrections op12 to new block style ([8512841](https://github.com/webern-unibas-ch/awg-app/commit/851284112feb80d5327c9d37aba806e84db470f8))
-   **assets:** fix addendum for source E in op25 ([3621bd1](https://github.com/webern-unibas-ch/awg-app/commit/3621bd158e749bb825953d5faca38d029796a9fc); thanks to [@masthom](https://github.com/masthom))
-   **assets:** fix link boxes and textcritics for m36 ([153811c](https://github.com/webern-unibas-ch/awg-app/commit/153811c6fe4bd91d24aac454f26c64c355768df3))
-   **assets:** fix link boxes and textcritics for m38 ([d4fd615](https://github.com/webern-unibas-ch/awg-app/commit/d4fd61555cf856bd335ab2e076a1c26957716f3e))
-   **assets:** fix M number of M 135 ([97fbf07](https://github.com/webern-unibas-ch/awg-app/commit/97fbf07fe93f52de1bc954082f9ebc85753272d1))
-   **assets:** fix order of sources in op. 4 ([d4b9538](https://github.com/webern-unibas-ch/awg-app/commit/d4b95388c0e414c90a4cc55134eea509c3710095))
-   **assets:** fix source lists for m36 and m38 ([4ea7ddf](https://github.com/webern-unibas-ch/awg-app/commit/4ea7ddf3f554e8dfbf24553183271c0ed7b3a0b5))
-   **assets:** fix textcritics for m36 ([a1c2d20](https://github.com/webern-unibas-ch/awg-app/commit/a1c2d2044f96b3ca4a0cdeadd46e224b604581a6))
-   **assets:** fix typo in op25 ([463683d](https://github.com/webern-unibas-ch/awg-app/commit/463683d20c479fd54c2f0b90200e90510f2e554d))
-   **assets:** fix typos and missing infos ([b93a4a4](https://github.com/webern-unibas-ch/awg-app/commit/b93a4a450639ea76b94e541336a3c4dbf60c87b9))
-   **assets:** fix whitespace in intro op12 ([f01c916](https://github.com/webern-unibas-ch/awg-app/commit/f01c9169bad4f2ed89bf3c373efc103bd86f466a))
-   **assets:** optimize svgs for m36 with SVGO ([a747bf0](https://github.com/webern-unibas-ch/awg-app/commit/a747bf0b12ed636364a0c4871594296f3a10700b))
-   **assets:** optimize svgs for m38 with SVGO ([ed6bca2](https://github.com/webern-unibas-ch/awg-app/commit/ed6bca244947d1024d26db986e4fe1767b659630))
-   **assets:** remove doc file ([1773fe8](https://github.com/webern-unibas-ch/awg-app/commit/1773fe8cd6f563108125613aed5104a1d33bf89a))
-   **assets:** remove parentheses from C & D in op. 23 ([5eb4d0d](https://github.com/webern-unibas-ch/awg-app/commit/5eb4d0deceaa3e0994172e1f576e6ab9898ffd8b))
-   **assets:** remove Textfassung for m39 from source list ([f882bf7](https://github.com/webern-unibas-ch/awg-app/commit/f882bf73655dbbe0d1a3ce755fe30c79bbfdee71))
-   **assets:** rename files for m38 ([745abcb](https://github.com/webern-unibas-ch/awg-app/commit/745abcb546f47bf4f424cd924719e26d6a0b2bde))
-   **assets:** update contained M numbers in m34–m38 ([9ffa781](https://github.com/webern-unibas-ch/awg-app/commit/9ffa7815a90e722f1049bd69b638bcae6a4192ba))
-   **assets:** update folio convolute for m36 ([46fa626](https://github.com/webern-unibas-ch/awg-app/commit/46fa626701ece99966f98f9d0d26526c28ba2efa))
-   **assets:** update folio convolute for m38 ([1de1aa5](https://github.com/webern-unibas-ch/awg-app/commit/1de1aa59416a795bc1c3dbb219782174162dc442))
-   **assets:** update m22 ([51e0cf0](https://github.com/webern-unibas-ch/awg-app/commit/51e0cf04c045b769a79091b313ccb72be915aee8))
-   **assets:** update m34 ([a42d5bd](https://github.com/webern-unibas-ch/awg-app/commit/a42d5bd8e97122d3b06f8ef1876233215a0d219b))
-   **assets:** update m35_42 ([c99842a](https://github.com/webern-unibas-ch/awg-app/commit/c99842a894201d284ea505e51069a1d01ae27147))
-   **assets:** update m37 ([e318db3](https://github.com/webern-unibas-ch/awg-app/commit/e318db3923c1cde37d4c496d44e016be26a5f814))
-   **assets:** update source description for m36 ([8543e91](https://github.com/webern-unibas-ch/awg-app/commit/8543e91d771eec2d7400de253cd77bae2972f115))
-   **assets:** update source description for m38 ([e2530cf](https://github.com/webern-unibas-ch/awg-app/commit/e2530cf4aad675599d9c58247285042edef54be1))
-   **assets:** use angular white space instead of nbsp ([6fc51e6](https://github.com/webern-unibas-ch/awg-app/commit/6fc51e692de2e4238fbca680b14c4f359c79c241))
-   **assets:** use correct syntax for missing sources in op3 and op4 ([168c9e1](https://github.com/webern-unibas-ch/awg-app/commit/168c9e1db63aa01a8a3f3dafa25a4063cc3f3f95))
-   **core:** remove unused var and method from navbar ([490937c](https://github.com/webern-unibas-ch/awg-app/commit/490937c27d5ace98a07b30aae85c32f870beb4ec))
-   **edition:** activate EditionComplexes service in app ([b9200f0](https://github.com/webern-unibas-ch/awg-app/commit/b9200f095b224cbf3b518c3b94f3111bcb001756))
-   **edition:** add missing glyphs ([e261a31](https://github.com/webern-unibas-ch/awg-app/commit/e261a3141277638cce185c93293f1c64964c9203))
-   **edition:** add pedal to glyphs ([e4880c9](https://github.com/webern-unibas-ch/awg-app/commit/e4880c9a0aa46342e9ce76aa3bea3d0f2af7f44d))
-   **edition:** auto-generate message for empty textcritics ([b18f999](https://github.com/webern-unibas-ch/awg-app/commit/b18f999f6d4e4615e8596b9b44779debd4290a8f))
-   **edition:** clean up code ([2c8d513](https://github.com/webern-unibas-ch/awg-app/commit/2c8d5132d884b0e9c8e0e9109cafbede7027e003))
-   **edition:** fix track-by indices for EditionSeries ([3aa2da3](https://github.com/webern-unibas-ch/awg-app/commit/3aa2da32f8ea6756749c3f3fd14ab49f8fa3c00d))
-   **edition:** remove deprecated data files ([d5fb3fe](https://github.com/webern-unibas-ch/awg-app/commit/d5fb3fedce24906cc02ff3887ad3c615e4a99996))
-   **edition:** remove landscape image from jumbotron ([79f2766](https://github.com/webern-unibas-ch/awg-app/commit/79f276604e278364804bb97389bf536747aa81cd))
-   **edition:** remove unused edition type component ([0459b53](https://github.com/webern-unibas-ch/awg-app/commit/0459b53aad604a6ce91182d7ff4294540f4e504c))
-   **edition:** remove unused method from edition service ([6e7b8dc](https://github.com/webern-unibas-ch/awg-app/commit/6e7b8dca332d0a64ae9db40f4b9f44b87716bfc8))
-   **edition:** remove unused type from complex model ([c8b1882](https://github.com/webern-unibas-ch/awg-app/commit/c8b1882423fb6adc137fadfc4980817b053308b7))
-   **edition:** simplify handling of sources in SourceList ([9c34a77](https://github.com/webern-unibas-ch/awg-app/commit/9c34a77562b8456601baac1dd57044c076c5d3c4))
-   **edition:** use correct constant for AWG III/5 ([d6b52a7](https://github.com/webern-unibas-ch/awg-app/commit/d6b52a7e8ce9e93449cd5026df69bdceb1815e14))
-   **edition:** use jumbotron for complex titles ([4f47a9a](https://github.com/webern-unibas-ch/awg-app/commit/4f47a9a2395d516927563284bb11c50662d2be34))
-   **edition:** use loading spinner for all edition views ([1c2135e](https://github.com/webern-unibas-ch/awg-app/commit/1c2135e0a5646c6256ca06a538e9bd47f87b0865))
-   **edition:** use shared ErrorAlertComponent ([e230c68](https://github.com/webern-unibas-ch/awg-app/commit/e230c6834590bb249f6a17796145304185fc7283))

### Code Refactoring

-   **assets:** use blocks for textcritics ([77e50a1](https://github.com/webern-unibas-ch/awg-app/commit/77e50a1c9ebf127125a5c83b7539562442f9ae03))
-   **assets:** use complex id as object key in JSON structure ([6216c48](https://github.com/webern-unibas-ch/awg-app/commit/6216c48ca4bb4acb01ca999cbf78543ab42637f8))
-   **core:** rename EditionComplexes service folder ([21994a5](https://github.com/webern-unibas-ch/awg-app/commit/21994a52a7fbfa717ea88d10de5652107e2f6b2f))
-   **edition:** move complex creation logic from data to model ([66e9613](https://github.com/webern-unibas-ch/awg-app/commit/66e9613c0b6695d4fddf1fbd5ae071324f096b0b))
-   **edition:** move series and section into pubStatement ([172a729](https://github.com/webern-unibas-ch/awg-app/commit/172a729cce9335cd5c9688226eb2b6c1b27e8736))
-   **edition:** rename class for intro paragraph ([fa99e4f](https://github.com/webern-unibas-ch/awg-app/commit/fa99e4f24af196137a4e54f1642f43506025e9b8))
-   **edition:** rename complex json data model ([b58a0d4](https://github.com/webern-unibas-ch/awg-app/commit/b58a0d403ea32c2bf1c9b4133108a2842436a84a))
-   **edition:** rename edition complex subclasses ([0e6bc38](https://github.com/webern-unibas-ch/awg-app/commit/0e6bc38144b7f2f54f3e5d63da800d1d88849d4a))
-   **edition:** rename edition related service and comp methods ([ac1b098](https://github.com/webern-unibas-ch/awg-app/commit/ac1b09815453ee0a83a901bde657082c2a02e47d))
-   **edition:** rename method for EditionView setup ([d0d4094](https://github.com/webern-unibas-ch/awg-app/commit/d0d40948dc3a1a2833426a419d63bb507d87f07b))
-   **edition:** rename parts of edition outline model ([308b8ae](https://github.com/webern-unibas-ch/awg-app/commit/308b8ae6ee7cf94d3d5ebdda64d0c13a3d840b1f))
-   **edition:** rename respStatment ([242c934](https://github.com/webern-unibas-ch/awg-app/commit/242c934272fa6a70584c1124f2cd3cdcb6b59a74))
-   **edition:** simplify and fully test GraphVisualizerService ([dce9676](https://github.com/webern-unibas-ch/awg-app/commit/dce967666dadedf9053da2a92232326cd15e0415))
-   **edition:** simplify generation of edition breadcrumb ([d9d9a5d](https://github.com/webern-unibas-ch/awg-app/commit/d9d9a5d9bb0fd4d081e1d5b482ad4ae1b30d0fd4))
-   **edition:** sort methods in editionDataService ([c7b048d](https://github.com/webern-unibas-ch/awg-app/commit/c7b048d69c7d6a23204a224eff4cb8bbd55614b2))

### Tests

-   **app:** fix syntax of remaining tests ([e057b49](https://github.com/webern-unibas-ch/awg-app/commit/e057b4912a9f1b2da3d80d495f5913e5b6f0b3de))
-   **app:** fix syntax of some more tests ([25c395b](https://github.com/webern-unibas-ch/awg-app/commit/25c395be97b219dbe338dc3fd44342706959945b))
-   **app:** fix tests after changes ([11ff7ab](https://github.com/webern-unibas-ch/awg-app/commit/11ff7aba433d82986100ec9f318aa8f562576ffa))
-   **app:** fix tests for AppComponent ([52d7a6a](https://github.com/webern-unibas-ch/awg-app/commit/52d7a6a394f66dbf259216f916bce2e897c12d7a))
-   **app:** fix typos and order in some tests ([9355e33](https://github.com/webern-unibas-ch/awg-app/commit/9355e33b7d7876b3aeb502885a600cb3de1ac1c2))
-   **app:** fix updated models and services in tests ([6f78602](https://github.com/webern-unibas-ch/awg-app/commit/6f78602e402b021e403aa3bfec4ee6aadae9761b))
-   **edition:** add more tests for edition sheets ([7308d6f](https://github.com/webern-unibas-ch/awg-app/commit/7308d6fa4c83153770830fab7f8029be2d7e6cb2))
-   **edition:** add tests for EditionSectionsComponent ([d626e57](https://github.com/webern-unibas-ch/awg-app/commit/d626e57468f57e38c1d1ff32c8c622aafbc2ee86))
-   **edition:** add tests for preface service methods ([b3efad1](https://github.com/webern-unibas-ch/awg-app/commit/b3efad199fc456f30e832068fc21885aa4676792))
-   **edition:** fix incorrect awg constant ([f8b8291](https://github.com/webern-unibas-ch/awg-app/commit/f8b829149b57c962f39e448d5c52b0e8a43fc5f8))
-   **edition:** fix intro paragraph class after change ([b2e99b4](https://github.com/webern-unibas-ch/awg-app/commit/b2e99b4d012ec00419d9f479605fb1d193e8d4da))
-   **edition:** fix tests after changes ([89abcbb](https://github.com/webern-unibas-ch/awg-app/commit/89abcbb6aa09db60f63d050228e1b21ff9cfdb7e))
-   **edition:** fix tests after changes ([d0e738e](https://github.com/webern-unibas-ch/awg-app/commit/d0e738eec6de46dce044a77d9ca79e385adab414))
-   **edition:** fix tests for EditionComplexes service ([40a3d93](https://github.com/webern-unibas-ch/awg-app/commit/40a3d93c569c91184fa78d43451551ef86f9024e))
-   **edition:** fix tests for textcritical comment blocks ([d419ae9](https://github.com/webern-unibas-ch/awg-app/commit/d419ae98767196007a90db6b5a66c397ee4e490c))
-   **edition:** remove focus from test ([12c6551](https://github.com/webern-unibas-ch/awg-app/commit/12c6551d6ed5c8e5c8d40b9659eb2b8021d7b12c))
-   **edition:** use regular edition outline in EditionView test ([97b5926](https://github.com/webern-unibas-ch/awg-app/commit/97b592625c7f14a71d748ef20d5110aed8bfd77b))

### Continuous Integration

-   **gh-actions:** include node 22 in workflow ([2684667](https://github.com/webern-unibas-ch/awg-app/commit/2684667984427ab9a3b4bead1da4e317d1381ecd))
-   **gh-actions:** pin fixed node version temporarily ([eb8e8c5](https://github.com/webern-unibas-ch/awg-app/commit/eb8e8c56a1e899c764c010f0cd0a76965ab0c763))
-   **gh-actions:** switch back to latest node v22 ([19a196d](https://github.com/webern-unibas-ch/awg-app/commit/19a196d3375956ee79e07c66ed3f47b8d017f02c))

### Documentation

-   **edition:** add JSDocs to new SourceDescription sub-classes ([bfd6360](https://github.com/webern-unibas-ch/awg-app/commit/bfd636080a97e7252cfbd08b41c925c8bb7768ad))

### Styles

-   **edition:** use shadow for cards ([2c4dad6](https://github.com/webern-unibas-ch/awg-app/commit/2c4dad6e35dbab8f9c2c635f2f8d6fa2769505b6))
-   **search:** fix error class ([a424df0](https://github.com/webern-unibas-ch/awg-app/commit/a424df0c4c6f6ae34d08a8a1306e34f34222a519))

### Build System

-   **deps-dev:** bump @commitlint/cli in the commitlint group ([8eadc48](https://github.com/webern-unibas-ch/awg-app/commit/8eadc4816d9af96fc6b1feae5a51e90147c99060))
-   **deps-dev:** bump @types/node from 18.19.39 to 18.19.40 ([88a8559](https://github.com/webern-unibas-ch/awg-app/commit/88a8559e07401fb362eb65db9017028ff81faa75))
-   **deps-dev:** bump @types/node from 18.19.40 to 18.19.41 ([7b2b8fe](https://github.com/webern-unibas-ch/awg-app/commit/7b2b8fe47d4335a178f2109397c8777c7260b244))
-   **deps-dev:** bump @types/node from 18.19.41 to 18.19.42 ([ef03a45](https://github.com/webern-unibas-ch/awg-app/commit/ef03a45bd47943ccaa0517d74bf1fe926347cd52))
-   **deps-dev:** bump @types/node from 18.19.42 to 20.14.14 ([a7a517e](https://github.com/webern-unibas-ch/awg-app/commit/a7a517e6a1fe9b957ad9df5aace977bb6772af8b))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.10.2 to 48.11.0 ([ba58324](https://github.com/webern-unibas-ch/awg-app/commit/ba583245841157874a353fe551302ed6c42133ed))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.11.0 to 50.0.0 ([13d1071](https://github.com/webern-unibas-ch/awg-app/commit/13d107130553229a51c3a878eeb3e2d1fd005d27))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.5.0 to 48.5.2 ([be1bd20](https://github.com/webern-unibas-ch/awg-app/commit/be1bd209680d2cbb96b5efee71c0ada2414daf5c))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.5.2 to 48.6.0 ([47d0c31](https://github.com/webern-unibas-ch/awg-app/commit/47d0c31a88d2f0986920f86325bab2a7d7875c66))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.6.0 to 48.7.0 ([ddcf59a](https://github.com/webern-unibas-ch/awg-app/commit/ddcf59a419bf5f9348d2339aa578ff3652fe132b))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.7.0 to 48.8.3 ([cec7fed](https://github.com/webern-unibas-ch/awg-app/commit/cec7fedba402c4259693a386dfc9aa92c8bc7f92))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.8.3 to 48.9.2 ([490d1ff](https://github.com/webern-unibas-ch/awg-app/commit/490d1ffaa39523330d2b24b0c0d85e97fd82b752))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.9.2 to 48.10.2 ([53d904b](https://github.com/webern-unibas-ch/awg-app/commit/53d904b13aa33513e73827c8b59f8b4170b03d9f))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.0.0 to 50.0.1 ([4069d81](https://github.com/webern-unibas-ch/awg-app/commit/4069d81491763d30c06ac52426293e2175c3b187))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.0.1 to 50.2.1 ([e399969](https://github.com/webern-unibas-ch/awg-app/commit/e399969a0b184c4958c81eb3c3f9a933eface7bb))
-   **deps-dev:** bump eslint-plugin-jsdoc from 50.2.1 to 50.2.2 ([09fabda](https://github.com/webern-unibas-ch/awg-app/commit/09fabda42f6c81e099e5d72eb6bf27027b5ac819))
-   **deps-dev:** bump eslint-plugin-prettier from 5.1.3 to 5.2.1 ([fb531b4](https://github.com/webern-unibas-ch/awg-app/commit/fb531b4d5b214ba1519db8d871c1076bc2ace6fa))
-   **deps-dev:** bump husky from 9.0.11 to 9.1.1 ([aa0566f](https://github.com/webern-unibas-ch/awg-app/commit/aa0566f3413d9bcf44014e2e581d80cf1e76fe35))
-   **deps-dev:** bump husky from 9.1.1 to 9.1.2 ([612f448](https://github.com/webern-unibas-ch/awg-app/commit/612f44860baed9c975d9126abaa2b07f2ca2f117))
-   **deps-dev:** bump husky from 9.1.2 to 9.1.4 ([baa3501](https://github.com/webern-unibas-ch/awg-app/commit/baa350151922dcd0048caba49b63518c0acb4628))
-   **deps-dev:** bump jasmine-core from 5.1.2 to 5.2.0 ([b903c1e](https://github.com/webern-unibas-ch/awg-app/commit/b903c1ee3c01f5c3c2cbaf3abac3c62ca028dac1))
-   **deps-dev:** bump karma from 6.4.3 to 6.4.4 ([3e9ba46](https://github.com/webern-unibas-ch/awg-app/commit/3e9ba4665182b8f58f4907a7192365e390894b78))
-   **deps-dev:** bump lint-staged from 15.2.7 to 15.2.8 ([f4513de](https://github.com/webern-unibas-ch/awg-app/commit/f4513de5d45e51b23531e9fff1c4fd69071e195d))
-   **deps-dev:** bump lint-staged from 15.2.8 to 15.2.9 ([32b44c2](https://github.com/webern-unibas-ch/awg-app/commit/32b44c2925c049cb857d19746613157fcb066e2f))
-   **deps-dev:** bump prettier from 3.3.2 to 3.3.3 ([bd8330c](https://github.com/webern-unibas-ch/awg-app/commit/bd8330c6d86c70b8f870fb39bcfb6035947ad3ee))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([2285f9b](https://github.com/webern-unibas-ch/awg-app/commit/2285f9bca446f055f8298ee8b3ef968d000e4703))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([9f4319d](https://github.com/webern-unibas-ch/awg-app/commit/9f4319d3e34e4f241ec37378842aac2b2a10bf74))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([61e438e](https://github.com/webern-unibas-ch/awg-app/commit/61e438e11e56547bc3c6ecff2066b891a36f37f2))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([f9fb819](https://github.com/webern-unibas-ch/awg-app/commit/f9fb819ff4f0eb2649848fe38dbd810f347ba0ab))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([46432b5](https://github.com/webern-unibas-ch/awg-app/commit/46432b509d1b77a50ab8289f246deafaebd5fa68))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([688da7e](https://github.com/webern-unibas-ch/awg-app/commit/688da7ec256c46472e4352c09c1f0d2ec491b19b))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([26fce92](https://github.com/webern-unibas-ch/awg-app/commit/26fce928e28d4f4a743231ec8aa96820c0656029))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([5f37c41](https://github.com/webern-unibas-ch/awg-app/commit/5f37c419bdc27f33ec965931ab4a835e65ff710f))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([73b4783](https://github.com/webern-unibas-ch/awg-app/commit/73b47838a8bf5ec447ad2dcdb6395f61f72eaebb))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([f58e89b](https://github.com/webern-unibas-ch/awg-app/commit/f58e89b794c8995cc5da10230bc79dae70df97b0))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([94a0151](https://github.com/webern-unibas-ch/awg-app/commit/94a01519fc1654e6b2a1e57ba526329dddacfefc))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([185e1d9](https://github.com/webern-unibas-ch/awg-app/commit/185e1d9dfa140ad0231991dd5cdd2bac1cbdd8bf))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([5db38a8](https://github.com/webern-unibas-ch/awg-app/commit/5db38a80fd5319ac749c19de91654b1eb59ac80a))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([4010d7a](https://github.com/webern-unibas-ch/awg-app/commit/4010d7a1a1451df6c8ef160e5e498caede477f79))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([6e2bf13](https://github.com/webern-unibas-ch/awg-app/commit/6e2bf13266eab01fc3f3ea2368922fbfa9150d93))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([edae3ff](https://github.com/webern-unibas-ch/awg-app/commit/edae3ffa154c44d705e8247021be6a3368db7763))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([00e701c](https://github.com/webern-unibas-ch/awg-app/commit/00e701c8ef6cad84734186b61906368c286cbb5e))
-   **deps-dev:** bump typescript from 5.5.2 to 5.5.4 ([e5dd837](https://github.com/webern-unibas-ch/awg-app/commit/e5dd83730a004b817c79ef258e45b34656e021f9))
-   **deps-dev:** update husky ([6e58c7c](https://github.com/webern-unibas-ch/awg-app/commit/6e58c7c0236087f2b31597c1090afe3adb2d0772))
-   **deps:** bump @codemirror/legacy-modes from 6.4.0 to 6.4.1 ([59cb709](https://github.com/webern-unibas-ch/awg-app/commit/59cb7097a6d263bcfa44f8ab629adeae28dc3dc5))
-   **deps:** bump @fortawesome/free-solid-svg-icons ([192df83](https://github.com/webern-unibas-ch/awg-app/commit/192df8366ff5b8b568aa928fd178ad5e09082026))
-   **deps:** bump actions/dependency-review-action from 4.3.3 to 4.3.4 ([9a2bd0c](https://github.com/webern-unibas-ch/awg-app/commit/9a2bd0cb11694ad87e4e15b1078329f14e9a8b85))
-   **deps:** bump actions/download-artifact from 4.1.7 to 4.1.8 ([003e5d0](https://github.com/webern-unibas-ch/awg-app/commit/003e5d0ddfb4d310904ecb086196d3e8c2954c7e))
-   **deps:** bump actions/setup-node from 4.0.2 to 4.0.3 ([5dc9a95](https://github.com/webern-unibas-ch/awg-app/commit/5dc9a95d047aabcf2013ff839714063391591e67))
-   **deps:** bump actions/upload-artifact from 4.3.3 to 4.3.4 ([1cd8e55](https://github.com/webern-unibas-ch/awg-app/commit/1cd8e555ea7727fde0d1f377291725d50cd36b55))
-   **deps:** bump actions/upload-artifact from 4.3.4 to 4.3.5 ([5c795e4](https://github.com/webern-unibas-ch/awg-app/commit/5c795e431fb0ef10a4ec7c3eea04ee6277460b6f))
-   **deps:** bump actions/upload-artifact from 4.3.5 to 4.3.6 ([7cc20df](https://github.com/webern-unibas-ch/awg-app/commit/7cc20df20411b3c04ab0b4e3c3791b58d59729d0))
-   **deps:** bump axios from 1.7.2 to 1.7.4 ([42e32d1](https://github.com/webern-unibas-ch/awg-app/commit/42e32d1154c4e1552eb1f61e26be37010e4889ec))
-   **deps:** bump github/codeql-action from 3.25.10 to 3.25.11 ([f135634](https://github.com/webern-unibas-ch/awg-app/commit/f13563420f6067da96618390d3d4573f0a338b53))
-   **deps:** bump github/codeql-action from 3.25.11 to 3.25.12 ([80de336](https://github.com/webern-unibas-ch/awg-app/commit/80de33633cb73937d73fa5e0e3573c4e86efc6ac))
-   **deps:** bump github/codeql-action from 3.25.12 to 3.25.13 ([cb03a00](https://github.com/webern-unibas-ch/awg-app/commit/cb03a00684d6c05ce4c86ed33e566a0bb46b59a0))
-   **deps:** bump github/codeql-action from 3.25.13 to 3.25.15 ([b053cf9](https://github.com/webern-unibas-ch/awg-app/commit/b053cf99ae1e7a0e427a415d51a713d93937c547))
-   **deps:** bump github/codeql-action from 3.25.15 to 3.26.0 ([3fa2067](https://github.com/webern-unibas-ch/awg-app/commit/3fa2067eb64ee807a0274cb4037cb6f4e41b6e96))
-   **deps:** bump github/codeql-action from 3.26.0 to 3.26.1 ([91455ad](https://github.com/webern-unibas-ch/awg-app/commit/91455adc853e67c8388b6ac12980d1eec284d5b2))
-   **deps:** bump github/codeql-action from 3.26.1 to 3.26.2 ([9a2c7ae](https://github.com/webern-unibas-ch/awg-app/commit/9a2c7aea2fe6c5cb67cf273c8b08e6badb6bcef4))
-   **deps:** bump n3 from 1.17.4 to 1.20.3 ([239a91f](https://github.com/webern-unibas-ch/awg-app/commit/239a91f390f55b5a0d199b36bd997360b044d05e))
-   **deps:** bump n3 from 1.20.3 to 1.20.4 ([965de9b](https://github.com/webern-unibas-ch/awg-app/commit/965de9bf734225a01e1b5443fef43fad77eedee3))
-   **deps:** bump ossf/scorecard-action from 2.3.3 to 2.4.0 ([0df58ee](https://github.com/webern-unibas-ch/awg-app/commit/0df58eed5b81397548e075631f87eb58ccb26d5f))
-   **deps:** bump softprops/action-gh-release from 2.0.6 to 2.0.8 ([86c7296](https://github.com/webern-unibas-ch/awg-app/commit/86c729603f101fdd5ddfecf86f5afbd770a7e409))
-   **deps:** bump step-security/harden-runner from 2.8.1 to 2.9.0 ([4fce8a7](https://github.com/webern-unibas-ch/awg-app/commit/4fce8a709e9f4b2fe2238589f01ce2f4e453cc0a))
-   **deps:** bump step-security/harden-runner from 2.9.0 to 2.9.1 ([1df7522](https://github.com/webern-unibas-ch/awg-app/commit/1df75228c0d65864d817719368bfcc6e605e6e6a))
-   **deps:** bump the angular group with 11 updates ([986c124](https://github.com/webern-unibas-ch/awg-app/commit/986c124c9ed37fa626e43f7d8b81c5ce7d14727c))
-   **deps:** bump the angular group with 11 updates ([cb33669](https://github.com/webern-unibas-ch/awg-app/commit/cb336690cc4195d4f840105565ecb0051f0c8c55))
-   **deps:** bump the angular group with 11 updates ([d8de582](https://github.com/webern-unibas-ch/awg-app/commit/d8de58266ba658348a715e43020adc17037c0aaf))
-   **deps:** bump the angular group with 11 updates ([2b8ec44](https://github.com/webern-unibas-ch/awg-app/commit/2b8ec44a161d9791776be8f041d13f20540d2a7f))
-   **deps:** bump the angular group with 11 updates ([e7589fe](https://github.com/webern-unibas-ch/awg-app/commit/e7589fe92525767d164a850f9a3be92c64806ba5))
-   **deps:** bump the angular group with 11 updates ([972d326](https://github.com/webern-unibas-ch/awg-app/commit/972d32656c33cfb5ed35e0edee30ac708053f2ff))
-   **deps:** bump the angular group with 11 updates ([a132ec2](https://github.com/webern-unibas-ch/awg-app/commit/a132ec2951c9fd8710f731eabb387003cb19f3f9))
-   **deps:** bump zone.js from 0.14.7 to 0.14.8 ([ef54a7d](https://github.com/webern-unibas-ch/awg-app/commit/ef54a7dc4c986b3fab6382de55ac70b4a8198f32))
-   **deps:** bump zone.js from 0.14.8 to 0.14.10 ([dc5f651](https://github.com/webern-unibas-ch/awg-app/commit/dc5f65162025246fef64775327b5c30f5ee3745d))

## [0.12.3](https://github.com/webern-unibas-ch/awg-app/compare/v0.12.2...v0.12.3) (2024-07-01)

### Features

-   **assets:** add source descriptions for George-Lieder ([ab8dfc4](https://github.com/webern-unibas-ch/awg-app/commit/ab8dfc474551a43785ad350167b13484ba9c6cf0); thanks to [@masthom](https://github.com/masthom))
-   **edition:** activate edition complexes for George-Lieder ([12b5b2e](https://github.com/webern-unibas-ch/awg-app/commit/12b5b2e239e5cef56d5e601e540653be102c9a4a))
-   **edition:** add corrections to source description ([c8936f4](https://github.com/webern-unibas-ch/awg-app/commit/c8936f4318cc1e7174cfae50462a3a0572de09a8))
-   **edition:** add George Lieder to menus ([e752649](https://github.com/webern-unibas-ch/awg-app/commit/e75264915e2c58cb8489990d0e2312056fac1c8e))
-   **edition:** enable cross-complex report navigation ([139b5b2](https://github.com/webern-unibas-ch/awg-app/commit/139b5b287854686e707aa63263a5aa6cde9984b7))
-   **edition:** plurify sourceDesc details and move into component ([66a00a9](https://github.com/webern-unibas-ch/awg-app/commit/66a00a9af5707a25a983fe29d7d7f440b8f2e423))

### Bug Fixes

-   **app:** add corresponding keyboard event to mouse events ([31921e0](https://github.com/webern-unibas-ch/awg-app/commit/31921e0e674518e7a45e8d15d9cd7df4820a3ac6))
-   **app:** fix expensive track-by indices ([7d67440](https://github.com/webern-unibas-ch/awg-app/commit/7d6744005e6b4f74359f69fd52c6c7549d756c1e))
-   **assets:** activate cross-complex report links in op3 and op4 ([28cdf78](https://github.com/webern-unibas-ch/awg-app/commit/28cdf78156289f17e74b4d359b9b9f6e90034f0d))
-   **assets:** add correction ids ([fa2e8e0](https://github.com/webern-unibas-ch/awg-app/commit/fa2e8e07d1046baca6ead1972eb29f7d52ae1f67))
-   **assets:** add more placeholder files for George-Lieder ([3459e39](https://github.com/webern-unibas-ch/awg-app/commit/3459e396dfdfe5ccd67562acf533cd4749076079))
-   **assets:** add placeholder files for George-Lieder ([2b4b3f9](https://github.com/webern-unibas-ch/awg-app/commit/2b4b3f99eab57a728833c92ef6fe956e583dbb80))
-   **assets:** apply new source desc model to assets ([91ee49a](https://github.com/webern-unibas-ch/awg-app/commit/91ee49a4c3707d9f063e098e40ead98d23b7d4cd))
-   **assets:** fix description and link of corrections in m212 ([f4041a9](https://github.com/webern-unibas-ch/awg-app/commit/f4041a95acfc86657d361f7e21f9f52fcbaddd63))
-   **assets:** fix tabs and quotes in source-list op. 23 ([821c748](https://github.com/webern-unibas-ch/awg-app/commit/821c7483969e8c1e957d3ff36f62356019268d32); thanks to [@masthom](https://github.com/masthom))
-   **assets:** mark reversed systems in m22 ([521f378](https://github.com/webern-unibas-ch/awg-app/commit/521f378405658583d060bf19b9ad1d0f6ef6f42c))
-   **assets:** remove redundant file ([20d90d0](https://github.com/webern-unibas-ch/awg-app/commit/20d90d058a7566a1f04b5b3869fc0e9c7eaa45ea))
-   **assets:** remove unused ids from corrections in op12 ([32ca1c8](https://github.com/webern-unibas-ch/awg-app/commit/32ca1c898bd5642ced9feae36414af3d62b871b0))
-   **assets:** use updated method signature with data ([374206c](https://github.com/webern-unibas-ch/awg-app/commit/374206c8f7c3b79b414f5ff59bf12e6f55a5c036))
-   **assets:** various fixes in source descriptions ([35a6c79](https://github.com/webern-unibas-ch/awg-app/commit/35a6c79a45ca2fc75d30f4dc447e6c5e02e0e831); thanks to [@masthom](https://github.com/masthom))
-   **core:** improve typings for distinctSubject conversion ([3d01d67](https://github.com/webern-unibas-ch/awg-app/commit/3d01d67a58556d6c8d2f02b5d85b9b7561faf585))
-   **core:** simplify conversion of date values ([cdf2512](https://github.com/webern-unibas-ch/awg-app/commit/cdf25129e41d746dea15b3b81b78923f1fa60c12))
-   **core:** simplify conversion of link values ([d95fb2e](https://github.com/webern-unibas-ch/awg-app/commit/d95fb2ecfe89996368b5f80570486f2be830fba8))
-   **core:** update SNF logo ([6be9daf](https://github.com/webern-unibas-ch/awg-app/commit/6be9daf7b82092c1857fb8b709fbb9f2c48476ae))
-   **edition:** allow edited sheets to be empty ([243b292](https://github.com/webern-unibas-ch/awg-app/commit/243b292ebfa9e2bfc0d564c2077cba664ee00b8e))
-   **edition:** do not add punctuation marks for source description desc ([582dc59](https://github.com/webern-unibas-ch/awg-app/commit/582dc59ebde0d4a64ef71ceaf5d24fb0da4d6625))
-   **edition:** do not display colon for stand-alone systems in SourceDesc ([4a03e0f](https://github.com/webern-unibas-ch/awg-app/commit/4a03e0fdb4181e2032148cbc656c22d3fc40e114))
-   **edition:** fix track-by indices in SourceDescriptionComponent ([b97c3dd](https://github.com/webern-unibas-ch/awg-app/commit/b97c3ddab087ee9338bde7c70afd52766582785f))
-   **edition:** use correct headings for source desc corrections ([8144b19](https://github.com/webern-unibas-ch/awg-app/commit/8144b1961416ae3e090308da90f4faffbae3f7d8))
-   **edition:** use non-breakable space for catalogue numbers ([f880854](https://github.com/webern-unibas-ch/awg-app/commit/f880854fbce74ce99206185755445757b4a1503b))
-   **edition:** use optional chaining for navigation with complex ids ([718662c](https://github.com/webern-unibas-ch/awg-app/commit/718662c5706ed503f9e3b79f8f18ecd3df198480))
-   **search:** fix track-by indices for SearchResultList ([9a76ae3](https://github.com/webern-unibas-ch/awg-app/commit/9a76ae3ec0f6b80ac325451944cabcca9abe5d37))
-   **search:** removed unused conversionService from SearchPanel ([12e90fa](https://github.com/webern-unibas-ch/awg-app/commit/12e90fa9a50afa2145973b2ef6b178d749dd7eff))

### Code Refactoring

-   **edition:** improve display of evaluation labels in SheetFooter ([555e821](https://github.com/webern-unibas-ch/awg-app/commit/555e821f78b8eec4ee724a3c52326ba1220e70dd))
-   **edition:** move corrections into separate component ([02ae6cb](https://github.com/webern-unibas-ch/awg-app/commit/02ae6cb05a547a1443ff9c9f2b72143071bcdecc))
-   **edition:** move sheet viewer nav into separate component ([b17d6ab](https://github.com/webern-unibas-ch/awg-app/commit/b17d6ab79b940844b265c6a8969566d5007a09c3))
-   **edition:** move source description into own module ([512193e](https://github.com/webern-unibas-ch/awg-app/commit/512193ef60cb275cddc79f6193d92f119ad0474a))
-   **edition:** rename doubletab_two -> doubletab_extended ([d450570](https://github.com/webern-unibas-ch/awg-app/commit/d45057075b88487953f30c6c06d2bad3f5c1693a))
-   **edition:** rename SourceDescriptionDetails component ([8cfd983](https://github.com/webern-unibas-ch/awg-app/commit/8cfd9834356d27b5399b3b4ec2c91ad6fb50fc87))
-   **edition:** rename writingMaterial -> writingMaterials ([869e8d1](https://github.com/webern-unibas-ch/awg-app/commit/869e8d13fd79e6fca33ad7f83095b5b806537b67))
-   **edition:** unify signature of selectSvgSheet method ([49048c7](https://github.com/webern-unibas-ch/awg-app/commit/49048c784f7536502d25cf1fceaad275af458b02))
-   **shared:** simplify and reduce size of spinner ([79b533c](https://github.com/webern-unibas-ch/awg-app/commit/79b533c95a084af86c6da8f1469999e729ad9525))

### Tests

-   **app:** fix test errors after bootstrap update ([217f20b](https://github.com/webern-unibas-ch/awg-app/commit/217f20b2a2f17a13989ce159d5897fa5eaebefd4))
-   **edition:** add tests for source description corrections ([dfa2ad3](https://github.com/webern-unibas-ch/awg-app/commit/dfa2ad333e62452319c6d4ec0d82de61fc1de473))
-   **edition:** add tests for SourceDescriptionDetail component ([462c9c4](https://github.com/webern-unibas-ch/awg-app/commit/462c9c474244ade8c65760b2dee4c5e4e8a9f60e))
-   **edition:** adjust test to refactored method signature ([fc55037](https://github.com/webern-unibas-ch/awg-app/commit/fc5503767dfd357bba118b08ffadc6e339c0b409))

### Continuous Integration

-   **gh-actions:** bring back test build on any branch ([e553020](https://github.com/webern-unibas-ch/awg-app/commit/e553020fb7044d75cc99e05c33a5a7c7a009f54f))
-   **gh-actions:** improve wording of step names ([4ccc665](https://github.com/webern-unibas-ch/awg-app/commit/4ccc665f85c465093631eea8e7025801246412dc))
-   **gh-actions:** remove existing files when updating dev ([1ba131e](https://github.com/webern-unibas-ch/awg-app/commit/1ba131e6557bed8b7a9e4d685c151f2c6668381c))
-   **gh-actions:** remove unused variable ([47b6bf8](https://github.com/webern-unibas-ch/awg-app/commit/47b6bf83b2f2a9040c6a50721c680260b60bb8f1))
-   **gh-actions:** update yarn installation in build workflow ([9fa49d9](https://github.com/webern-unibas-ch/awg-app/commit/9fa49d9a7ce1084751cd5c487425c69ac8d62da0))

### Documentation

-   **core:** fix typo in JDN date model ([7ec7bbc](https://github.com/webern-unibas-ch/awg-app/commit/7ec7bbcb1d708ced7bb3a69815c6ca87a43b3542))
-   **README:** update install instructions ([#1583](https://github.com/webern-unibas-ch/awg-app/issues/1583)) ([27b2755](https://github.com/webern-unibas-ch/awg-app/commit/27b275502c666b3a38a31e6029579575460c375f))

### Styles

-   **app:** fix linting errors after update ([cb014cd](https://github.com/webern-unibas-ch/awg-app/commit/cb014cd862ce97a7fdfc452749b0ef5e9e38b895))

### Build System

-   **app:** fix npm scripts after yarn update ([fe0f688](https://github.com/webern-unibas-ch/awg-app/commit/fe0f688f66ba448e7ac49b79806beb7615fc7214))
-   **app:** update yarn.lock after upgrade ([6c17e5b](https://github.com/webern-unibas-ch/awg-app/commit/6c17e5b2ed9fbe6afd4cd3bc93ebbdf2a0a571d0))
-   **app:** upgrade yarn to 4.3.0 ([07564b6](https://github.com/webern-unibas-ch/awg-app/commit/07564b6f8acf892d8951e70824e3a4d0606fc658))
-   **app:** upgrade yarn to berry ([0f79e9a](https://github.com/webern-unibas-ch/awg-app/commit/0f79e9a7f0eb6f96c910050714be5a00d3ad0f59))
-   **deps-dev:** bump @types/node from 18.19.33 to 18.19.34 ([ae7d3f1](https://github.com/webern-unibas-ch/awg-app/commit/ae7d3f1cc5cf890c1f27292c49e4267ccef7adfd))
-   **deps-dev:** bump @types/node from 18.19.34 to 18.19.36 ([420a6cc](https://github.com/webern-unibas-ch/awg-app/commit/420a6cc54b16066790c76ead58f10e0f04724284))
-   **deps-dev:** bump @types/node from 18.19.36 to 18.19.37 ([d686f91](https://github.com/webern-unibas-ch/awg-app/commit/d686f916bd08bf0bf7d7004995666319d4fa0f0f))
-   **deps-dev:** bump @types/node from 18.19.37 to 18.19.38 ([479ebfd](https://github.com/webern-unibas-ch/awg-app/commit/479ebfd09cb654376c83867a6835dfc461764994))
-   **deps-dev:** bump @types/node from 18.19.38 to 18.19.39 ([646b0e1](https://github.com/webern-unibas-ch/awg-app/commit/646b0e15b04ef20b5b14179981d267d15fc32e3d))
-   **deps-dev:** bump angular-cli-ghpages from 2.0.0 to 2.0.1 ([2655871](https://github.com/webern-unibas-ch/awg-app/commit/2655871380eff9c97a082809da0b2e3ca0a1527b))
-   **deps-dev:** bump eslint-plugin-deprecation from 2.0.0 to 3.0.0 ([2553be7](https://github.com/webern-unibas-ch/awg-app/commit/2553be74cdf042a7f375780a91045b4b8aa03822))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.12 to 48.4.0 ([ffdeca5](https://github.com/webern-unibas-ch/awg-app/commit/ffdeca5f38e629e0085a7767eeecb9aeb3587a46))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.7 to 48.2.8 ([7b53094](https://github.com/webern-unibas-ch/awg-app/commit/7b530949a3416ae056162ade0d03ab406135e493))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.8 to 48.2.9 ([30a912b](https://github.com/webern-unibas-ch/awg-app/commit/30a912b0c9b12bac9e2c951247e4e8f082270052))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.9 to 48.2.12 ([bb1ad94](https://github.com/webern-unibas-ch/awg-app/commit/bb1ad94089a4fdb744d902701bf4a842dd02a4ea))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.4.0 to 48.5.0 ([9c87878](https://github.com/webern-unibas-ch/awg-app/commit/9c87878db3b2ce89f2ad6f7ec7812acab02226a9))
-   **deps-dev:** bump lint-staged from 15.2.5 to 15.2.6 ([dc180dd](https://github.com/webern-unibas-ch/awg-app/commit/dc180ddd786ec5da8c31ef9e21900a93702145f0))
-   **deps-dev:** bump lint-staged from 15.2.6 to 15.2.7 ([4b5ec58](https://github.com/webern-unibas-ch/awg-app/commit/4b5ec58355dacb94ef70f61b4e2ed350e17370db))
-   **deps-dev:** bump prettier from 3.2.5 to 3.3.0 ([293ef60](https://github.com/webern-unibas-ch/awg-app/commit/293ef606bb39ba248c7f46b80ff569a518a1b6a4))
-   **deps-dev:** bump prettier from 3.3.1 to 3.3.2 ([9940cd4](https://github.com/webern-unibas-ch/awg-app/commit/9940cd4540ef7b01fc6a377a3b1881bddda68f89))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([6d9ba31](https://github.com/webern-unibas-ch/awg-app/commit/6d9ba31c565f26983ecaa8d1dc151f6500082b69))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([4439c34](https://github.com/webern-unibas-ch/awg-app/commit/4439c34b72db363cc679ab7fea4946e4ce4065f5))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([2904a50](https://github.com/webern-unibas-ch/awg-app/commit/2904a50e6926055603201ef32f765d35bed2c408))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([c1fa46f](https://github.com/webern-unibas-ch/awg-app/commit/c1fa46f369f89c5b2babaca2b09776d81a8bd8b4))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([82fe089](https://github.com/webern-unibas-ch/awg-app/commit/82fe08989986dc2d26267e52bb3dadc0802fbd8c))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([388f40d](https://github.com/webern-unibas-ch/awg-app/commit/388f40dbfbde0423ee98a8abf2311c4b9266e853))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([f3b856e](https://github.com/webern-unibas-ch/awg-app/commit/f3b856e0efdce0fc59406b8cbcc6cb9048761735))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([1459e3a](https://github.com/webern-unibas-ch/awg-app/commit/1459e3a63699fa54add5b90748a2184d831a4950))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([61a228f](https://github.com/webern-unibas-ch/awg-app/commit/61a228f27df5699ef3bce404088de7c4b70e2e90))
-   **deps-dev:** bump typescript from 5.4.5 to 5.5.2 ([8656459](https://github.com/webern-unibas-ch/awg-app/commit/8656459490dac26de38a9c4455e07be13fe05b4c))
-   **deps:** bump @fortawesome/angular-fontawesome from 0.14.1 to 0.15.0 ([718f64c](https://github.com/webern-unibas-ch/awg-app/commit/718f64ccf5ba089cf66cce71d4f29b4fec12d0c2))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 16.0.0 to 17.0.0 ([6a565fc](https://github.com/webern-unibas-ch/awg-app/commit/6a565fcb656d12080f98acdc6e41506d53272135))
-   **deps:** bump actions/checkout from 4.1.6 to 4.1.7 ([493a1ba](https://github.com/webern-unibas-ch/awg-app/commit/493a1babbab2af514b9f1df348153f0ca863ce1e))
-   **deps:** bump actions/dependency-review-action from 4.3.2 to 4.3.3 ([9ef8618](https://github.com/webern-unibas-ch/awg-app/commit/9ef86180d64dcd8efafe9a9cc394f6152858b6f0))
-   **deps:** bump codecov/codecov-action from 4.4.1 to 4.5.0 ([c0a0504](https://github.com/webern-unibas-ch/awg-app/commit/c0a050416df3c00fee51cd0b373f0fdf57e40f79))
-   **deps:** bump github/codeql-action from 3.25.6 to 3.25.7 ([ab2788f](https://github.com/webern-unibas-ch/awg-app/commit/ab2788f4881bc4345c068c0f6b8f4c7b84b5bca5))
-   **deps:** bump github/codeql-action from 3.25.7 to 3.25.8 ([87922bd](https://github.com/webern-unibas-ch/awg-app/commit/87922bd8aed8216c947b901114eae636bbb112cd))
-   **deps:** bump github/codeql-action from 3.25.8 to 3.25.10 ([051ea2f](https://github.com/webern-unibas-ch/awg-app/commit/051ea2f230e9f2f60c34ccb6138107d73c1bace4))
-   **deps:** bump n3 from 1.17.3 to 1.17.4 ([832201e](https://github.com/webern-unibas-ch/awg-app/commit/832201e09fc622d5e7faa8f13e67ac35052800d5))
-   **deps:** bump rdfstore from v0.9.18-alpha.15 to v0.9.18-alpha.16 ([452a6e0](https://github.com/webern-unibas-ch/awg-app/commit/452a6e0d953c8ad3e01f26f99bc42b67d1146897))
-   **deps:** bump softprops/action-gh-release from 2.0.5 to 2.0.6 ([e41deab](https://github.com/webern-unibas-ch/awg-app/commit/e41deab5d38f3cab4090784f69b3344859d3c6b8))
-   **deps:** bump SonarSource/sonarcloud-github-action ([165efc6](https://github.com/webern-unibas-ch/awg-app/commit/165efc60ade60d1f1f2c6a87f3ea0863d1649198))
-   **deps:** bump step-security/harden-runner from 2.8.0 to 2.8.1 ([d10e1c1](https://github.com/webern-unibas-ch/awg-app/commit/d10e1c15e1607d3af128a2f052f06262de9c0457))
-   **deps:** bump stream from 0.0.2 to 0.0.3 ([01100ac](https://github.com/webern-unibas-ch/awg-app/commit/01100acb1912bce48fd25fca0a28e4b3b1a59c4e))
-   **deps:** bump the angular group with 11 updates ([70aa18c](https://github.com/webern-unibas-ch/awg-app/commit/70aa18c4bea9530ca11a6423b86ba62104aa93f1))
-   **deps:** bump the angular group with 11 updates ([f08b99d](https://github.com/webern-unibas-ch/awg-app/commit/f08b99d67268435d182d62fdb2c09d76b42dacb9))
-   **deps:** bump the angular group with 11 updates ([1ef99cb](https://github.com/webern-unibas-ch/awg-app/commit/1ef99cb50be7379c8a3b8fd241997da4bef75994))
-   **deps:** bump the angular group with 11 updates ([d0cbd38](https://github.com/webern-unibas-ch/awg-app/commit/d0cbd3844a8702bd408596aac678b8ec4d762958))
-   **deps:** bump ws from 7.5.9 to 7.5.10 ([97dc4b4](https://github.com/webern-unibas-ch/awg-app/commit/97dc4b4801582158dd910afce5d31f11562cb456))
-   **deps:** bump zone.js from 0.14.6 to 0.14.7 ([fcfbfce](https://github.com/webern-unibas-ch/awg-app/commit/fcfbfce82db2c449ae86bd494329a5c1b448d9f0))
-   **deps:** remove `@fortawesome/fontawesome-svg-core` from deps ([b406378](https://github.com/webern-unibas-ch/awg-app/commit/b406378f4f746db94bf6d844fd8e36ffd4b245a5))

## [0.12.2](https://github.com/webern-unibas-ch/awg-app/compare/v0.12.1...v0.12.2) (2024-05-31)

### Features

-   **edition:** add TkaTableHeader model ([7d24681](https://github.com/webern-unibas-ch/awg-app/commit/7d2468181f450de9afb538e9d70d6d759e4641f8))
-   **edition:** prepare TkaTableHeader for corrections ([db4b708](https://github.com/webern-unibas-ch/awg-app/commit/db4b708248e156e50d4b4c3cfc4bf0856477af5e))

### Bug Fixes

-   **app:** fix linting errors and warnings ([33db68d](https://github.com/webern-unibas-ch/awg-app/commit/33db68d28cb3c5ec411407edc2ebe89ec1593ec0))
-   **assets:** fix source description op. 25 D ([21359e3](https://github.com/webern-unibas-ch/awg-app/commit/21359e369a269e900403e1b72d503f6902f43c78); thanks to [@masthom](https://github.com/masthom))
-   **core:** simplify conversion of full text search response ([7548f51](https://github.com/webern-unibas-ch/awg-app/commit/7548f511e22be7b3decf81c9a21b9c656532e116))
-   **edition:** don't adjust comment label for corrections ([25056f4](https://github.com/webern-unibas-ch/awg-app/commit/25056f44212b75a0b3e9abb57753d97752fbe38f))
-   **edition:** fix direction of arrows in SheetFooter ([9085158](https://github.com/webern-unibas-ch/awg-app/commit/908515849e6a35c7d7c157bc8d1dba0ce32ad76a))
-   **edition:** include check for rowtable sketch ids (SkRT) ([b8e0e94](https://github.com/webern-unibas-ch/awg-app/commit/b8e0e9489de1c916aec7b5068fe2d05341f57963))
-   **edition:** pass down info about sketches to TkaTable ([df6f608](https://github.com/webern-unibas-ch/awg-app/commit/df6f60806c2848057d8f8b519a06093c5942bf1d))
-   **edition:** remove placeholder for now available sources ([e122641](https://github.com/webern-unibas-ch/awg-app/commit/e12264195abe451311b03107a47d3e131c43a382))
-   **edition:** simplify check for sketches ([2eee26f](https://github.com/webern-unibas-ch/awg-app/commit/2eee26f3de30a53d39ecd6c3d1771f580001e6ba))
-   **edition:** use correct string for source evaluation ([a93aac9](https://github.com/webern-unibas-ch/awg-app/commit/a93aac9b1fa73377264c32f18378f86e09658783))
-   **edition:** use correct string for textcritical comments ([71182dd](https://github.com/webern-unibas-ch/awg-app/commit/71182dd5486f8ea1dae6ae9a4bd6a86cb289b0a3))
-   **edition:** use tka label component in SheetViewerSwitch ([7619f8a](https://github.com/webern-unibas-ch/awg-app/commit/7619f8a516302f113be8a672846b944c9b2f9b57))

### Code Refactoring

-   **edition:** improve creation of TkaTableHeader ([cf84944](https://github.com/webern-unibas-ch/awg-app/commit/cf84944d7e2ec0da47938e7f177998404b342d9b))
-   **edition:** move isSketchId check into utility service ([e1bb971](https://github.com/webern-unibas-ch/awg-app/commit/e1bb9710e06a1a6c307b384c4ff33cc405ec4841))
-   **edition:** move logic for tka label into component ([c092f46](https://github.com/webern-unibas-ch/awg-app/commit/c092f466e4701609195298d13254cba4aecb5d6e))
-   **edition:** rename isTextcriticsForSketch -> isSketchId ([a3bddf4](https://github.com/webern-unibas-ch/awg-app/commit/a3bddf4ece151f0605b0fed45d4a7af342ab82b5))

### Tests

-   **core:** fix tests for cleanSubjectValueLabels ([f8c7a5d](https://github.com/webern-unibas-ch/awg-app/commit/f8c7a5d8fe7a5f8d7a43ee9499e204c4a4539886))
-   **edition:** add tests for TkaTableHeaders ([b6a8da7](https://github.com/webern-unibas-ch/awg-app/commit/b6a8da75158d8aeb3a2e796237a2c8ff0508d8ee))
-   **edition:** fix test limitation ([ddac1d1](https://github.com/webern-unibas-ch/awg-app/commit/ddac1d19a058805e330e8b240ca7825525fd6a01))
-   **edition:** fix tests after changes ([2f71abd](https://github.com/webern-unibas-ch/awg-app/commit/2f71abdc4a68a46d629fba09f03be7f5f8244343))

### Continuous Integration

-   **app:** upgrade node to 20.13 ([bac64ac](https://github.com/webern-unibas-ch/awg-app/commit/bac64ac2f995a81caf174939c7150550bc6493a1))
-   **gh-actions:** remove ratchet comment ([405416f](https://github.com/webern-unibas-ch/awg-app/commit/405416f73ff57fb3e4ba0bcfcef4cb7d472a0f55))

### Documentation

-   **README:** udpate supported minimal node version ([7f8117a](https://github.com/webern-unibas-ch/awg-app/commit/7f8117a131b32b8297caebbe0dcccfd1a28afbb6))

### Build System

-   **app:** add nx/cache to gitignore file ([6a443ef](https://github.com/webern-unibas-ch/awg-app/commit/6a443ef3e8b95acb82a4b2ba0807562b480f2f67))
-   **app:** adjust config values after update to Angular v18 ([f1f363c](https://github.com/webern-unibas-ch/awg-app/commit/f1f363cf3188dc86ed513238c1be0fae907176dd))
-   **app:** adjust content files after update to Angular v18 ([746ab15](https://github.com/webern-unibas-ch/awg-app/commit/746ab15e3bc080b1961d6fda7d0346518b6be1c2))
-   **app:** update to Angular v18 ([0a927b1](https://github.com/webern-unibas-ch/awg-app/commit/0a927b1427fcb6753361f69afcd6cfa8ce0fc1e6))
-   **app:** update to angular-eslint v18 ([d1abdef](https://github.com/webern-unibas-ch/awg-app/commit/d1abdef0da81519a4e83b199ab91ebe44c6bd50f))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.24 to 1.1.25 ([5d8b109](https://github.com/webern-unibas-ch/awg-app/commit/5d8b10954181116e98b8bfb2d7d31f838b346990))
-   **deps-dev:** bump angular-cli-ghpages from 1.0.7 to 2.0.0 ([c882929](https://github.com/webern-unibas-ch/awg-app/commit/c8829293107ef3717556ef3c27a773f26790c852))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.4 to 48.2.5 ([44999bc](https://github.com/webern-unibas-ch/awg-app/commit/44999bc64cb4098e8dfb755b64897c481651ac8c))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.5 to 48.2.6 ([f9e178d](https://github.com/webern-unibas-ch/awg-app/commit/f9e178d54030154e1fc98473749abc2637dacc6d))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.6 to 48.2.7 ([e7cae49](https://github.com/webern-unibas-ch/awg-app/commit/e7cae4913fc46bc391ba4ee03a15aca3cd4ad7d1))
-   **deps-dev:** bump lint-staged from 15.2.4 to 15.2.5 ([295fee9](https://github.com/webern-unibas-ch/awg-app/commit/295fee9dd1b088619da3b8099e1dc0a6957245c4))
-   **deps-dev:** bump the angular-eslint group across 1 directory with 5 updates ([a995dd7](https://github.com/webern-unibas-ch/awg-app/commit/a995dd7fa96889b1188ccfb233067db164041f4e))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([b9b7989](https://github.com/webern-unibas-ch/awg-app/commit/b9b79894663e7a84ffb31a945a0bd99a1b448a9a))
-   **deps:** bump actions/checkout from 4.1.5 to 4.1.6 ([f92b7cd](https://github.com/webern-unibas-ch/awg-app/commit/f92b7cd97492a7fa53aa00376128320a6fa66df5))
-   **deps:** bump codecov/codecov-action from 4.4.0 to 4.4.1 ([ecc91d3](https://github.com/webern-unibas-ch/awg-app/commit/ecc91d349dc19534b5b178ab0bff1f5a89ba0a04))
-   **deps:** bump github/codeql-action from 3.25.5 to 3.25.6 ([d4ca50e](https://github.com/webern-unibas-ch/awg-app/commit/d4ca50e8b6e039243f8b579f0c377026adf78ba4))
-   **deps:** bump SonarSource/sonarcloud-github-action ([0586455](https://github.com/webern-unibas-ch/awg-app/commit/05864559d60eabf622b5d51c20e99a97ee0a4f48))
-   **deps:** bump the angular group with 11 updates ([566e4bc](https://github.com/webern-unibas-ch/awg-app/commit/566e4bc190fb5fccfa6521933465fdd55bcab5a3))
-   **deps:** bump zone.js from 0.14.2 to 0.14.6 ([30b5647](https://github.com/webern-unibas-ch/awg-app/commit/30b5647420ab78b431db611bbdf76b8fedd35f51))
-   **deps:** update .github/workflows/ci_workflow.yml ([ca3c2f6](https://github.com/webern-unibas-ch/awg-app/commit/ca3c2f6aeffc10fa2eb7568e36bd32ef814f2de7))

## [0.12.1](https://github.com/webern-unibas-ch/awg-app/compare/v0.12.0...v0.12.1) (2024-05-15)

### Features

-   **app:** add DSP_API_URL to AppConfig ([e634f0c](https://github.com/webern-unibas-ch/awg-app/commit/e634f0c8b7bfa5a98483152353573a7d77d22874))
-   **assets:** update files for m22 ([33b6944](https://github.com/webern-unibas-ch/awg-app/commit/33b6944deacbe8482f8bdfd16ffb23b8d3e3c738); thanks to [@chael-mi](https://github.com/chael-mi))
-   **core:** add dev preview to footer ([4f24429](https://github.com/webern-unibas-ch/awg-app/commit/4f24429650532a5d5eea4f4994d59b58e1cfed59))

### Bug Fixes

-   **app:** use bracket notation to access logos ([f9139e4](https://github.com/webern-unibas-ch/awg-app/commit/f9139e4dc519ecc6f38e3ae61dbf390313cf75ad))
-   **assets:** fix files for m22 ([2e0b73e](https://github.com/webern-unibas-ch/awg-app/commit/2e0b73ed62eb759cb17fd87909aa806876723f0d); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** fix link boxes and textcritics for m22 ([4b12f0e](https://github.com/webern-unibas-ch/awg-app/commit/4b12f0e93dc0dee4a4c0cd176594c39b8604067e))
-   **assets:** fix lost changes in files for m22 ([7bd616a](https://github.com/webern-unibas-ch/awg-app/commit/7bd616a31c528e96794b8f5f968dab8ba46b629c); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** fix source descriptions op12 & 23 ([d559ff0](https://github.com/webern-unibas-ch/awg-app/commit/d559ff0d4b6f1189bb32ac9453e71cfd134676ec))
-   **assets:** fix source evaluation for TF1 of m22 ([#1478](https://github.com/webern-unibas-ch/awg-app/issues/1478)) ([440e4bd](https://github.com/webern-unibas-ch/awg-app/commit/440e4bdbf63429654c00fb63e5c031d704ac09cd); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** pathify svg files for m22 ([#1480](https://github.com/webern-unibas-ch/awg-app/issues/1480)) ([92230c0](https://github.com/webern-unibas-ch/awg-app/commit/92230c05e3ed576b4a2a0db4ca8a01bd47c54763); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** rename and format files for m22 ([fcd18a2](https://github.com/webern-unibas-ch/awg-app/commit/fcd18a25b199a0a98dae65d9ec9554b021c69ab3))
-   **assets:** update files for m22 ([#1491](https://github.com/webern-unibas-ch/awg-app/issues/1491)) ([8caf1df](https://github.com/webern-unibas-ch/awg-app/commit/8caf1dfd3141733d32b8e6e52205cb74ac56bd1b); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** update source description for op12 ([b90d23d](https://github.com/webern-unibas-ch/awg-app/commit/b90d23d37e2c5499ba7e9c6438f9155224dba104); thanks to [@masthom](https://github.com/masthom))
-   **assets:** update source descriptions for AWG I/5 ([d53de7b](https://github.com/webern-unibas-ch/awg-app/commit/d53de7bb7b2b442b56edb401220fcb50da46db5f); thanks to [@masthom](https://github.com/masthom))
-   **core:** remove obsolete app dev url ([9a5e0ca](https://github.com/webern-unibas-ch/awg-app/commit/9a5e0ca72f96348969d53631e0174ed05c35bafb))
-   **home:** fix link to DaSCH mission statement ([c2fce5b](https://github.com/webern-unibas-ch/awg-app/commit/c2fce5b67c55fcae43636d772ecce42908560cc4))
-   **search:** fix html hierarchy in ResourceDetailHeader ([5f0688b](https://github.com/webern-unibas-ch/awg-app/commit/5f0688bb03a9361bb81d6e8654d6cb1ca1211864))
-   **search:** fix tracking id for searchResponse subjects ([643d06a](https://github.com/webern-unibas-ch/awg-app/commit/643d06aca043a0a93228998d14eeaef5d9d7b1e9))
-   **search:** remove additional quotation marks in search results ([5559278](https://github.com/webern-unibas-ch/awg-app/commit/5559278eb3aa8c196423002848bc4036fad81dd2))

### Code Refactoring

-   **core:** improve preparation of fulltext search results ([#1495](https://github.com/webern-unibas-ch/awg-app/issues/1495)) ([6ee433d](https://github.com/webern-unibas-ch/awg-app/commit/6ee433d94e5df99afac1ec9d1c99c68f24fd58a1))
-   **core:** improve preparation of fulltext search result text ([936d6f7](https://github.com/webern-unibas-ch/awg-app/commit/936d6f7ba38d7a2961c0642560f5230a83ac553e))
-   **core:** make replaceParagraphTags static method ([a3bf9e9](https://github.com/webern-unibas-ch/awg-app/commit/a3bf9e919d326a083888d05515e716d56a621980))
-   **core:** simplify conversion of richtext values ([fc9ffba](https://github.com/webern-unibas-ch/awg-app/commit/fc9ffba363a430c813581f74b074f8614ebf749f))

### Tests

-   **core:** add tests for dev preview ([7685d49](https://github.com/webern-unibas-ch/awg-app/commit/7685d49fa910d3b680e4ce5d074e58ef63f8a27b))

### Continuous Integration

-   **gh-actions:** add permissions ([42b9017](https://github.com/webern-unibas-ch/awg-app/commit/42b9017843f6c605508e80f7969a736728cd4217))
-   **gh-actions:** adjust baseHref ([12a1b43](https://github.com/webern-unibas-ch/awg-app/commit/12a1b434cdb5499a208aae1615a0c96f5c11f66a))
-   **gh-actions:** adjust build workflow for dev ([47aa7e4](https://github.com/webern-unibas-ch/awg-app/commit/47aa7e426980c3fcdb1831431bafedfc2e26d5c6))
-   **gh-actions:** adjust gitHead variable ([baf3558](https://github.com/webern-unibas-ch/awg-app/commit/baf35580fe34a1eaee7fa4db5b9f28ee0682c9c3))
-   **gh-actions:** Apply security best practices [StepSecurity] ([a3e6ca0](https://github.com/webern-unibas-ch/awg-app/commit/a3e6ca005d8780ab191e93fffff99e644ba9c24e))
-   **gh-actions:** bring back node setup ([3722f6a](https://github.com/webern-unibas-ch/awg-app/commit/3722f6a157bc4667fdadee209f6218682dcac1b9))
-   **gh-actions:** build dev build once more ([e0741f4](https://github.com/webern-unibas-ch/awg-app/commit/e0741f461729608ffa0e16487e5b1b633a089d51))
-   **gh-actions:** change baseHref for dev build ([e7d8756](https://github.com/webern-unibas-ch/awg-app/commit/e7d87565c7b62494190c9638ecda0c1844b2fa7c))
-   **gh-actions:** copy only content of dist folder ([5454fc5](https://github.com/webern-unibas-ch/awg-app/commit/5454fc5fcea87979bea688cdaa3464dc887261cb))
-   **gh-actions:** create visualize-repo.yml ([3f4dab2](https://github.com/webern-unibas-ch/awg-app/commit/3f4dab20cf9f402013e1e67f85d6ce67195ed89f))
-   **gh-actions:** deploy to website dev ([6699039](https://github.com/webern-unibas-ch/awg-app/commit/669903953ea63002d9d12df45672265a23bbd2f2))
-   **gh-actions:** deploy to website dev (dry-run) ([886a072](https://github.com/webern-unibas-ch/awg-app/commit/886a072638ceb9401f70c76e3e9d53013c1690cf))
-   **gh-actions:** dry run deployment from develop ([2e8b295](https://github.com/webern-unibas-ch/awg-app/commit/2e8b295cb84583d868adca1480f34b3221564eb1))
-   **gh-actions:** fix env variable ([f487bf0](https://github.com/webern-unibas-ch/awg-app/commit/f487bf0a67a2fc399d54cad7ba14c1d61149d7ca))
-   **gh-actions:** fix file syntax ([2ef9f0b](https://github.com/webern-unibas-ch/awg-app/commit/2ef9f0ba97a158ff6d30c2c947b80e1149ba7c2b))
-   **gh-actions:** fix typo ([f5753cc](https://github.com/webern-unibas-ch/awg-app/commit/f5753cc8ad8ca68c2b2ea81f13790d9d62e7f61b))
-   **gh-actions:** fix typoin branch name ([7a39969](https://github.com/webern-unibas-ch/awg-app/commit/7a3996955bdededc6df062afdb8599db49e938da))
-   **gh-actions:** get git sha and fix typo ([a9ab2e5](https://github.com/webern-unibas-ch/awg-app/commit/a9ab2e56f1d439338ec0f4364122ffebfcb75291))
-   **gh-actions:** get sha from describe ([af2f3ab](https://github.com/webern-unibas-ch/awg-app/commit/af2f3ab543aa39f0c431ca7bf8c852568478f1b9))
-   **gh-actions:** move script args to package.json ([2bcafd0](https://github.com/webern-unibas-ch/awg-app/commit/2bcafd00d036b67ad394706cca59488854dfcc22))
-   **gh-actions:** reduce retention period for artifacts ([c288149](https://github.com/webern-unibas-ch/awg-app/commit/c288149d7a0a32399b6778f18569718c7fef9196))
-   **gh-actions:** refactor deploy_dev job ([7f3ddfb](https://github.com/webern-unibas-ch/awg-app/commit/7f3ddfbb4dc54b2870ec5f10266025729e0da95f))
-   **gh-actions:** remove deprecated svgo action ([4bf7a70](https://github.com/webern-unibas-ch/awg-app/commit/4bf7a70c70b49029293e150cf45e8d684caff190))
-   **gh-actions:** remove dry-run ([e622158](https://github.com/webern-unibas-ch/awg-app/commit/e622158cb4db867164f69a56c982a041c7c63244))
-   **gh-actions:** remove dry-run flag ([ef98c75](https://github.com/webern-unibas-ch/awg-app/commit/ef98c757d54ddaa58ae859f8030d4d5e295c4478))
-   **gh-actions:** remove obsolete node setup ([6129f6e](https://github.com/webern-unibas-ch/awg-app/commit/6129f6e4f8c36e637ca2dcdba95d330d2004a52a))
-   **gh-actions:** switch to deploy key ([b6e4957](https://github.com/webern-unibas-ch/awg-app/commit/b6e4957c7b052628e4182cab187b1716e5455777))
-   **gh-actions:** update ci_workflow.yml ([1706573](https://github.com/webern-unibas-ch/awg-app/commit/1706573158538ff5606c3361fccd79085c6094b0))
-   **gh-actions:** update codeql.yml ([8219c4e](https://github.com/webern-unibas-ch/awg-app/commit/8219c4e4b1e8e60b24acef88f7de1bf265b7696f))
-   **gh-actions:** update dev version on build ([ab43248](https://github.com/webern-unibas-ch/awg-app/commit/ab43248e77e78540ad3c0571a09cffb70b975787))
-   **gh-actions:** update scorecards.yml ([5204d88](https://github.com/webern-unibas-ch/awg-app/commit/5204d886db51a1492912f827d2ddca80f39c22cf))
-   **gh-actions:** update visualize-repo.yml ([ecccb8e](https://github.com/webern-unibas-ch/awg-app/commit/ecccb8ee43b90c0b8eb73994242a5b332689a26d))
-   **gh-actions:** upload build artifact only for latest node version ([a1726cf](https://github.com/webern-unibas-ch/awg-app/commit/a1726cfbb8f6840726603eec7774a5d555896a52))
-   **gh-actions:** upload build artifacts ([dbbaa58](https://github.com/webern-unibas-ch/awg-app/commit/dbbaa58dc5214428d1cfa10bfbb50dbc82c4f4b2))
-   **gh-actions:** use correct directory ([f1db97e](https://github.com/webern-unibas-ch/awg-app/commit/f1db97ed409000a6736bf8ac51863464384dd508))
-   **gh-actions:** use dev repo for develop build ([ca5a601](https://github.com/webern-unibas-ch/awg-app/commit/ca5a60172b2b433f9223354c59bdf9dc74201489))
-   **gh-actions:** use different build scripts for develop/main ([49f8b34](https://github.com/webern-unibas-ch/awg-app/commit/49f8b34ecfb59ca8e0da6655662f2af039722485))
-   **gh-actions:** use existing deploy command ([2ff00e9](https://github.com/webern-unibas-ch/awg-app/commit/2ff00e98b21fe9d4cad22e827173923f6e7a0bc6))
-   **gh-actions:** use prebuilt artifacts ([19f0a24](https://github.com/webern-unibas-ch/awg-app/commit/19f0a245f2f5cb91bd20d9dc8c3093aa3a14fe02))
-   **gh-actions:** use script instead of direct command ([acb2a52](https://github.com/webern-unibas-ch/awg-app/commit/acb2a5277964713fe8a3f1e7f989752e570e7522))

### Documentation

-   **app:** create SECURITY.md ([ee97005](https://github.com/webern-unibas-ch/awg-app/commit/ee9700566cd919a008a08c5b8f70b972a6bbc29a))
-   **CONTRIBUTING:** update contribution guidelines ([3ec4889](https://github.com/webern-unibas-ch/awg-app/commit/3ec48891f5bbbca61caefa79fa0d3dce483855e7))
-   **README:** add OSSF best pratices badge ([80ee019](https://github.com/webern-unibas-ch/awg-app/commit/80ee019bc1e01f7a52e81adc6f22129d5642ded2))
-   **README:** add sample image of the app ([ff3b009](https://github.com/webern-unibas-ch/awg-app/commit/ff3b0090abd7d534db17f758686e4b0d6ac35f9c))
-   **README:** fix typo in TOC ([39a2a44](https://github.com/webern-unibas-ch/awg-app/commit/39a2a444cd75b2ea361ec7baa3fd7c206bf4a5c6))
-   **README:** update codecov badge ([c652dcd](https://github.com/webern-unibas-ch/awg-app/commit/c652dcd82d3cd5e0957d9b2a142a20cb097bd399))
-   **README:** update README.md ([6f8c4db](https://github.com/webern-unibas-ch/awg-app/commit/6f8c4dbff580c1e4ffe192f7aada5dbd7b269e31))
-   **README:** update README.md ([496b8d4](https://github.com/webern-unibas-ch/awg-app/commit/496b8d4e7c19d9e9ac15e37c5a5cb083cb893825))
-   **README:** update README.md ([44a00af](https://github.com/webern-unibas-ch/awg-app/commit/44a00af977219949da1d4f25a92d31ff9573224b))

### Styles

-   **app:** rename class caps -> smallcaps ([#1485](https://github.com/webern-unibas-ch/awg-app/issues/1485)) ([c5a7427](https://github.com/webern-unibas-ch/awg-app/commit/c5a7427f93c55b6d61dea0775f4816f044462ddb))
-   **search:** fix grid and badge classes in search result list ([cf1c29c](https://github.com/webern-unibas-ch/awg-app/commit/cf1c29c98b5cabeaa17a5b337b16e35f158af6fa))

### Build System

-   **app:** move build attachments into separate script ([46a0f0b](https://github.com/webern-unibas-ch/awg-app/commit/46a0f0be6c2efb358a5589d31796cc891163b4ef))
-   **app:** update zenodo config file ([8b33b13](https://github.com/webern-unibas-ch/awg-app/commit/8b33b13cc72f66615da26342c3985d88070bb1ff))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.23 to 1.1.24 ([18b5741](https://github.com/webern-unibas-ch/awg-app/commit/18b57411e4dba4ee6d18ca8ab4695ed6e05af084))
-   **deps-dev:** bump @types/node from 18.19.31 to 18.19.32 ([827fb66](https://github.com/webern-unibas-ch/awg-app/commit/827fb66b7dc6101b704d6507f82d90d44bb9dcac))
-   **deps-dev:** bump @types/node from 18.19.32 to 18.19.33 ([8f7bd32](https://github.com/webern-unibas-ch/awg-app/commit/8f7bd3230f95e72e88717c9b5aa3c33d8b1a26c8))
-   **deps-dev:** bump commit-and-tag-version from 12.4.0 to 12.4.1 ([2a75acf](https://github.com/webern-unibas-ch/awg-app/commit/2a75acf30ff113f8abd979f9f65a4a26283cf170))
-   **deps-dev:** bump conventional-recommended-bump from 9.0.0 to 10.0.0 ([f3951cc](https://github.com/webern-unibas-ch/awg-app/commit/f3951cc6366cf07bcf427fc9fe651f15f5865eaa))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.3 to 48.2.4 ([d269688](https://github.com/webern-unibas-ch/awg-app/commit/d269688af5be5d38347a59d8cb86795d2ed22045))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([156cdde](https://github.com/webern-unibas-ch/awg-app/commit/156cdde2e9fe5d710ccc7277cd5e8e5df1d40bb7))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([5f720d0](https://github.com/webern-unibas-ch/awg-app/commit/5f720d02e3ccbd9abecdc07dd02f3b6f635b989f))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([30416a5](https://github.com/webern-unibas-ch/awg-app/commit/30416a5b52fbec24fccd37f6dcf200e8decc2fc4))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([27dff2c](https://github.com/webern-unibas-ch/awg-app/commit/27dff2cd40dd93b3a95b181feab65598dfaebe97))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([f3eadf1](https://github.com/webern-unibas-ch/awg-app/commit/f3eadf1b79b43a1c6c2c1427551da7f4178d6de2))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([00bd33b](https://github.com/webern-unibas-ch/awg-app/commit/00bd33b5dde00ece41468b6f3f668bfc397970e8))
-   **deps-dev:** replace deprecated standard-version lib ([08276a5](https://github.com/webern-unibas-ch/awg-app/commit/08276a530f820fc8af0f7b978a1348462cd97011))
-   **deps:** bump actions/checkout from 3.6.0 to 4.1.4 ([ef2ed29](https://github.com/webern-unibas-ch/awg-app/commit/ef2ed29e87490cf67b6cc47ba92162cd0c852145))
-   **deps:** bump actions/checkout from 4.1.3 to 4.1.4 ([e77f141](https://github.com/webern-unibas-ch/awg-app/commit/e77f141e37dc0629fb75ead9122dd7de8fab747c))
-   **deps:** bump actions/checkout from 4.1.4 to 4.1.5 ([c07d798](https://github.com/webern-unibas-ch/awg-app/commit/c07d798ea6df79fd54e92f9d85ba46c87f77824c))
-   **deps:** bump actions/dependency-review-action from 2.5.1 to 4.3.1 ([e177336](https://github.com/webern-unibas-ch/awg-app/commit/e17733654d1ad113648f37cdd4504bb52c58ddbf))
-   **deps:** bump actions/dependency-review-action from 4.3.1 to 4.3.2 ([69f33b6](https://github.com/webern-unibas-ch/awg-app/commit/69f33b6fe33736191adbeef3c636666753b3955d))
-   **deps:** bump actions/upload-artifact from 3.1.3 to 4.3.3 ([9c3ddad](https://github.com/webern-unibas-ch/awg-app/commit/9c3ddadb365737c8f164a250e865bc54930d1d58))
-   **deps:** bump codecov/codecov-action from 4.3.0 to 4.3.1 ([6fb176a](https://github.com/webern-unibas-ch/awg-app/commit/6fb176a8c7a3e889b026e2a2144bd722abb46519))
-   **deps:** bump codecov/codecov-action from 4.3.1 to 4.4.0 ([98642d2](https://github.com/webern-unibas-ch/awg-app/commit/98642d2b36921d84b0b66aceff80005e62b40d79))
-   **deps:** bump ejs from 3.1.9 to 3.1.10 ([36c3416](https://github.com/webern-unibas-ch/awg-app/commit/36c34163d18854800dd7ee566406003bcb875e2a))
-   **deps:** bump github/codeql-action from 3.25.3 to 3.25.4 ([c369f84](https://github.com/webern-unibas-ch/awg-app/commit/c369f848aa4e4d0188546860f21f2466a903531f))
-   **deps:** bump github/codeql-action from 3.25.4 to 3.25.5 ([2c810d2](https://github.com/webern-unibas-ch/awg-app/commit/2c810d2f144455a2daf5d3613d345848b574ce03))
-   **deps:** bump ossf/scorecard-action from 2.0.6 to 2.3.1 ([9be10cf](https://github.com/webern-unibas-ch/awg-app/commit/9be10cfe31b0ac9a4422562c46aff726f170fad3))
-   **deps:** bump ossf/scorecard-action from 2.3.1 to 2.3.3 ([ea380f6](https://github.com/webern-unibas-ch/awg-app/commit/ea380f6e4407a0b7d703f7c8570547ce45e17b56))
-   **deps:** bump softprops/action-gh-release from 2.0.4 to 2.0.5 ([164013a](https://github.com/webern-unibas-ch/awg-app/commit/164013a87cabe4d537f232ae94cd0128a50b1f19))
-   **deps:** bump step-security/harden-runner from 2.7.0 to 2.7.1 ([7bbbc48](https://github.com/webern-unibas-ch/awg-app/commit/7bbbc4891d4d904ecdae193c3dff573c7cfe3da7))
-   **deps:** bump the angular group with 11 updates ([31dcc27](https://github.com/webern-unibas-ch/awg-app/commit/31dcc27e8da6cdc6fe2e941649b0c19032723b93))
-   **deps:** bump the angular group with 11 updates ([4436d0d](https://github.com/webern-unibas-ch/awg-app/commit/4436d0df081e92d87e1bd0a034980eacd816d517))
-   **deps:** bump the angular group with 11 updates ([5bcee59](https://github.com/webern-unibas-ch/awg-app/commit/5bcee59c0d545816fd01c085c33900648222f123))

## [0.12.0](https://github.com/webern-unibas-ch/awg-app/compare/v0.11.7...v0.12.0) (2024-04-23)

### Features

-   **assets:** add intro for op12 ([5430937](https://github.com/webern-unibas-ch/awg-app/commit/54309378e273c4040588da24f9403b03bd3f63db))
-   **assets:** add source description for Op 23 (A) ([32a4749](https://github.com/webern-unibas-ch/awg-app/commit/32a4749e076601c4bb7677e733f4499a5ec65836); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add source description for op 23 (C + D) ([104882f](https://github.com/webern-unibas-ch/awg-app/commit/104882fc2befff7553bdd5590e9263213e0f132f); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add source descriptions for op12 (Ab, Ac, Ad) ([8b02e47](https://github.com/webern-unibas-ch/awg-app/commit/8b02e477bb72534be5e61fe1b27fc2b0695ef07a); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add source descriptions for op12 (C, D, E, F, G) ([#1414](https://github.com/webern-unibas-ch/awg-app/issues/1414)) ([484371d](https://github.com/webern-unibas-ch/awg-app/commit/484371dc9b55bdb8c861bf4e10adefdc3c4bb939); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add source descriptions for op25 (D, E) ([eb48485](https://github.com/webern-unibas-ch/awg-app/commit/eb484850369d94ea5f1fc6efca98de393f91d108); thanks to [@masthom](https://github.com/masthom))
-   **core:** use awg logo in navbar ([778c2c9](https://github.com/webern-unibas-ch/awg-app/commit/778c2c923ba0b1dcc643cfcb8d46b6cecaf7e219))
-   **edition:** activate edition complex M 22 ([3598748](https://github.com/webern-unibas-ch/awg-app/commit/3598748e1933070bd332df7c5718693923ad2861))
-   **edition:** add footnotes to edition intro ([be48231](https://github.com/webern-unibas-ch/awg-app/commit/be48231a7b509bd8cbf75ee726a7a6791da4afd3))
-   **edition:** add M22 to menus ([efd5a2e](https://github.com/webern-unibas-ch/awg-app/commit/efd5a2ea7eb5984dcd182be5276bb349cc24e407))
-   **edition:** add option to indicate missing sources ([676b313](https://github.com/webern-unibas-ch/awg-app/commit/676b313e7f889d991cf3f1737e625e16f7d0b53f))
-   **edition:** add watermarks to source description ([50f0122](https://github.com/webern-unibas-ch/awg-app/commit/50f0122432ee9fafc590c467d3e2398f7cce89c6))

### Bug Fixes

-   **app:** fix typo in text content of "More" link button ([c58d90f](https://github.com/webern-unibas-ch/awg-app/commit/c58d90f7ce2703f5d297fa81000490aaa47bf5b7))
-   **assets:** activate source description A in op23 ([7e9d24c](https://github.com/webern-unibas-ch/awg-app/commit/7e9d24c8c4f65aeede0c87c25e34bad1bb62273e))
-   **assets:** activate source description C and D in op23 ([800db70](https://github.com/webern-unibas-ch/awg-app/commit/800db70e7bec83e15252109429f4a10554cffd6c))
-   **assets:** activate source description D and E in op25 ([9abae08](https://github.com/webern-unibas-ch/awg-app/commit/9abae086948881979dc9a5daff184464bca95442))
-   **assets:** add latest text from intro of op12 ([0ecac8f](https://github.com/webern-unibas-ch/awg-app/commit/0ecac8ff88670920ed54a132571cfa337c8d1d79))
-   **assets:** add link boxes for m22 ([d8fc315](https://github.com/webern-unibas-ch/awg-app/commit/d8fc3157b4e77ebe38e66818e692cde629efe28a))
-   **assets:** add missing data files and placeholders for m22 ([e2f8e0f](https://github.com/webern-unibas-ch/awg-app/commit/e2f8e0f5faf2e0f93d8230f8856abbec84868c2f))
-   **assets:** adjust source list and description for op12 ([e66fab5](https://github.com/webern-unibas-ch/awg-app/commit/e66fab5e9ae80444cf3106604981372de988411d))
-   **assets:** corrections of source list in comparison to print version ([1787852](https://github.com/webern-unibas-ch/awg-app/commit/1787852c8a13336ebce3f7010e782a7ebbefb9ee))
-   **assets:** escape curly brackets in op25 D ([7bf9905](https://github.com/webern-unibas-ch/awg-app/commit/7bf9905424d6e6696523211577855d5f9847548c))
-   **assets:** fix formattings in source description op25 ([37f3ce9](https://github.com/webern-unibas-ch/awg-app/commit/37f3ce9eedd99f99366b542ac04ba23fd7da5351))
-   **assets:** fix incomplete tags in op12 G ([b7305b0](https://github.com/webern-unibas-ch/awg-app/commit/b7305b021d43326544f47b66fb21c40b2433f1dc))
-   **assets:** fix item links in op12 ([f147b0f](https://github.com/webern-unibas-ch/awg-app/commit/f147b0f9dc70ee72b7c632fcb92730d3efdeab96))
-   **assets:** fix item links in op25 D and E ([acb628a](https://github.com/webern-unibas-ch/awg-app/commit/acb628a7287aca34daa41ef8d491aa910c7d1212))
-   **assets:** fix links to report fragments ([695b05d](https://github.com/webern-unibas-ch/awg-app/commit/695b05d76bc7a7a051d9cdbfa629e751ad7e40d2))
-   **assets:** fix missing characters in op23 C and D ([e5077c3](https://github.com/webern-unibas-ch/awg-app/commit/e5077c328eab3a4149b6d0878486efd62624f4e8))
-   **assets:** fix missing source EF1-2 in op25 ([0045e1c](https://github.com/webern-unibas-ch/awg-app/commit/0045e1ca95f7ad5e8df790f5427f4249a7caffa1))
-   **assets:** fix missing values and formatting in op23 & 25 ([b858f5e](https://github.com/webern-unibas-ch/awg-app/commit/b858f5e472ecdebb1dbd3c14968b72ad294f607d))
-   **assets:** fix supplied classes in m30 Sk1 ([c6fc241](https://github.com/webern-unibas-ch/awg-app/commit/c6fc241706f5bc0f60844c383e4d08520f90e252))
-   **assets:** fix text source in op25 ([2b14c8c](https://github.com/webern-unibas-ch/awg-app/commit/2b14c8c640a34bd184269449134580338262376d))
-   **assets:** fix typo in op12 G ([c2dd1af](https://github.com/webern-unibas-ch/awg-app/commit/c2dd1af56c3ff855313c5465aae82404928b01ca))
-   **assets:** fix typos in textcritics for m22 ([e8b1be0](https://github.com/webern-unibas-ch/awg-app/commit/e8b1be0cf55fcdce92dfa59ef546fcac53d86dda))
-   **assets:** fix writing material in op23 A ([77059e4](https://github.com/webern-unibas-ch/awg-app/commit/77059e440b31387d9e11ce06e8142f18eebf4d61))
-   **assets:** fix writing material in op23 C and D ([4c11017](https://github.com/webern-unibas-ch/awg-app/commit/4c110177d7665b3b0e99329cfe21e070e629331d))
-   **assets:** fix writing material in op25 D and E ([ac90cce](https://github.com/webern-unibas-ch/awg-app/commit/ac90ccecf6c342d3183a436451d68cd03d4322a5))
-   **assets:** fix wrong id in textcritics for m22 ([be630c2](https://github.com/webern-unibas-ch/awg-app/commit/be630c2ebaeb7155cadef331f4b590be8e567d95))
-   **assets:** lint textcritics file for m22 ([e67a72d](https://github.com/webern-unibas-ch/awg-app/commit/e67a72df230be1fbc12fd79f0732adec650463d5))
-   **assets:** optimize svgs for m22 with SVGO ([f917e6c](https://github.com/webern-unibas-ch/awg-app/commit/f917e6c37f7e60abfb1484830907712dfd395c47))
-   **assets:** remove item links in op23 A for now ([90e5c3b](https://github.com/webern-unibas-ch/awg-app/commit/90e5c3bfd4192d6c74a08b5fea5a97a7e6c5375d))
-   **assets:** remove obsolete intro from op12 folder ([b6d43bb](https://github.com/webern-unibas-ch/awg-app/commit/b6d43bba7445ce06a4b108ac2aeecdb8435d0fdd))
-   **edition:** allow navigating to report fragments from sourceDesc ([9cfc734](https://github.com/webern-unibas-ch/awg-app/commit/9cfc7340a937a9a6666897045b842a675a3994e9))
-   **edition:** datafy writingMaterial for op12 sources ([c1c1e98](https://github.com/webern-unibas-ch/awg-app/commit/c1c1e98938f0f3d3aeb8a9629a879091c3841eee))
-   **edition:** display items without sigla correctly ([1b9f609](https://github.com/webern-unibas-ch/awg-app/commit/1b9f6090980aeb38407ac0db9aaa6879f862f343))
-   **edition:** enable (printed) pages in source description ([40f0b55](https://github.com/webern-unibas-ch/awg-app/commit/40f0b55e7f5e949cf0cb33e437d19ad742baf0d9))
-   **edition:** fix names of section II/2a and II/2b ([d148a4c](https://github.com/webern-unibas-ch/awg-app/commit/d148a4c0b6e2e5b4447e13aa841ef58a38ae35e2))
-   **edition:** fix overview section in EditionInfo and Navbar ([099519a](https://github.com/webern-unibas-ch/awg-app/commit/099519ac49ea37209159037c4e58746bbdd20a60))
-   **edition:** fix typo in route for section 2b ([21ae506](https://github.com/webern-unibas-ch/awg-app/commit/21ae50679a7c5fac9409a8397af67c95bcae6f07))
-   **edition:** make sheet viewer settings responsive ([ee4aa5c](https://github.com/webern-unibas-ch/awg-app/commit/ee4aa5c7f2ca360db6210215b9f1fce23327e9e6))
-   **edition:** make subsources navigable ([1f88d96](https://github.com/webern-unibas-ch/awg-app/commit/1f88d9608f3e6a1717ddf22cb257bc8e887d334b))
-   **edition:** parse writing instruments correctly ([04b0f6f](https://github.com/webern-unibas-ch/awg-app/commit/04b0f6f4bd1b1157065a64f3d795bc90684e7306))
-   **edition:** update modification dates ([0f007b7](https://github.com/webern-unibas-ch/awg-app/commit/0f007b7755811bcc9c993f1a9fc2df7a0895c868))
-   **edition:** use br instead of p elements for new description blocks ([c0ed431](https://github.com/webern-unibas-ch/awg-app/commit/c0ed431ae2f62aadbb70422530d7952580c02b91))
-   **shared:** fix centering of license ([1845d40](https://github.com/webern-unibas-ch/awg-app/commit/1845d4081b48c63a599b372437366aed1e089ac4))
-   **shared:** remove TODO comments from API objects ([d71b3ac](https://github.com/webern-unibas-ch/awg-app/commit/d71b3ac1e24ae9be1d71f51b64357d6de98bd2e7))

### Code Refactoring

-   **app:** separate app router options ([839ccfb](https://github.com/webern-unibas-ch/awg-app/commit/839ccfb491d8b513aa768f58ec4f6b51c1dfce3c))
-   **edition:** filter selectedSeries explicitly ([58c89cf](https://github.com/webern-unibas-ch/awg-app/commit/58c89cf2766775f35dfbd6e026d4bc87218ff6ac))
-   **edition:** rename WritingMaterialFirmSignLocation model ([fe5a360](https://github.com/webern-unibas-ch/awg-app/commit/fe5a360682466de72fbdf2f6fe828575e049d647))
-   **shared:** apply website layout to router link button group ([e772be4](https://github.com/webern-unibas-ch/awg-app/commit/e772be47f2c7a1a633a25960f85be27db82dc00d))

### Tests

-   **edition:** add tests for missing sources ([0a96ee4](https://github.com/webern-unibas-ch/awg-app/commit/0a96ee46132600def73769c9823e6da9090bab20))
-   **edition:** add tests for SeriesComponent ([dd9c894](https://github.com/webern-unibas-ch/awg-app/commit/dd9c8944d240a4f2e9d371c573d8924a3791ae27))
-   **edition:** adjust tests for source-description ([1062b90](https://github.com/webern-unibas-ch/awg-app/commit/1062b90849d9e04e38e7078876fd107de5155d9d))
-   **edition:** fix class name after updates ([83a67ac](https://github.com/webern-unibas-ch/awg-app/commit/83a67ac8f61e3dcd37d926247dc432081c8a4385))
-   **edition:** fix report tests after updates ([a54a2b4](https://github.com/webern-unibas-ch/awg-app/commit/a54a2b4b7d57162760edcb6e7f7cd3c3c45bf8a0))
-   **edition:** fix source list tests after update ([8d5c164](https://github.com/webern-unibas-ch/awg-app/commit/8d5c16448dc3aeb030ea64e09d565cc7863b309e))
-   **edition:** fix tests after updates ([6401eec](https://github.com/webern-unibas-ch/awg-app/commit/6401eecb4d11e95531722c2cbcdc7ea8806c18a3))
-   **edition:** fix writing material tests after updates ([ef02e1a](https://github.com/webern-unibas-ch/awg-app/commit/ef02e1a558c063f8d49c4db193fb74288f5c2185))
-   **shared:** fix tests for router link button group after refactoring ([2b0a138](https://github.com/webern-unibas-ch/awg-app/commit/2b0a13847bc1f395bebf300e6a81dfe6af013e17))

### Styles

-   **edition:** adjust intro text to print layout ([cc0dff6](https://github.com/webern-unibas-ch/awg-app/commit/cc0dff61512f9e56dbc1b8ac009f204d505bcb20))
-   **edition:** fix card headers in series overview ([214bcb8](https://github.com/webern-unibas-ch/awg-app/commit/214bcb82bdac800862fffc08c249f557b6f62b14))
-   **edition:** prevent line breaks in source sigla ([edeca40](https://github.com/webern-unibas-ch/awg-app/commit/edeca4090eef4975d1c60ebef1847254517d9f37))

### Continuous Integration

-   **gh-actions:** add codecov token to ci workflow ([5ee7846](https://github.com/webern-unibas-ch/awg-app/commit/5ee78466014850539e50aaa3f74595aabc8850af))
-   **gh-actions:** update ci_workflow.yml ([5b4778a](https://github.com/webern-unibas-ch/awg-app/commit/5b4778aa425ab45d3ae2dfe67fa65acd1853c12c))
-   **gh-actions:** update ratchet versions ([fdaa78f](https://github.com/webern-unibas-ch/awg-app/commit/fdaa78f2cf141e66ee20834af2abafd0c404371f))

### Build System

-   **deps-dev:** bump @types/node from 18.19.22 to 18.19.31 ([cac58bc](https://github.com/webern-unibas-ch/awg-app/commit/cac58bc72c8102642c7eb6d7c661a3092466a2d8))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.1 to 48.2.2 ([f1a67f8](https://github.com/webern-unibas-ch/awg-app/commit/f1a67f8eb0008ec6dd75a79139e975a3576b60ce))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.2 to 48.2.3 ([2ce63c2](https://github.com/webern-unibas-ch/awg-app/commit/2ce63c25ee05b901314c015f2795e40ea92b1604))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([cb9808c](https://github.com/webern-unibas-ch/awg-app/commit/cb9808ccf78ac0fac47af0e8dff2164fde7fc3b9))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([6f49db0](https://github.com/webern-unibas-ch/awg-app/commit/6f49db07422b8284f5eff46f87e71c56250913b1))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([9c549ff](https://github.com/webern-unibas-ch/awg-app/commit/9c549ffb5daa0d0de6141f9111d905e30801301e))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([d3a1a29](https://github.com/webern-unibas-ch/awg-app/commit/d3a1a292cfa73c24037a4e1166e9d4c89ad7deb7))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([4329d6e](https://github.com/webern-unibas-ch/awg-app/commit/4329d6e61393018c2408dd39aea4bd2eeb775de6))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([36e18b4](https://github.com/webern-unibas-ch/awg-app/commit/36e18b488d7013c81da18e8362ce1d04704d61e3))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([a8775e9](https://github.com/webern-unibas-ch/awg-app/commit/a8775e94d0e4d38e831d341123b420f9207f11db))
-   **deps-dev:** bump the commitlint group with 1 update ([14c259b](https://github.com/webern-unibas-ch/awg-app/commit/14c259bb02b467ee12c347f09b20ea3d91505a47))
-   **deps-dev:** bump the commitlint group with 1 update ([5a8f5bf](https://github.com/webern-unibas-ch/awg-app/commit/5a8f5bfc26210d84eafe7bc959222888b5b0dd7f))
-   **deps-dev:** bump the commitlint group with 2 updates ([9e9f271](https://github.com/webern-unibas-ch/awg-app/commit/9e9f271b0fe9bbdf62ff23d765319a2d8c62d1e8))
-   **deps-dev:** bump the commitlint group with 2 updates ([b7d9679](https://github.com/webern-unibas-ch/awg-app/commit/b7d967920068444046876a74e3a7de693d3d61e1))
-   **deps-dev:** bump the commitlint group with 2 updates ([9f967a2](https://github.com/webern-unibas-ch/awg-app/commit/9f967a2e1eff3fc3da86b8131dd9e595f97e5279))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([aa7afdd](https://github.com/webern-unibas-ch/awg-app/commit/aa7afddbee91e3bf9d30ae1f6dd3b70ca24c68e1))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([7fb6874](https://github.com/webern-unibas-ch/awg-app/commit/7fb687457c0f6fef92f2c6f0928d8ca5395e8348))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([fc006d9](https://github.com/webern-unibas-ch/awg-app/commit/fc006d9e61c87021d43e1490fe7b83c14460d3c9))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([2538fce](https://github.com/webern-unibas-ch/awg-app/commit/2538fce9dfb3e712011cf2fbcb58ea15f3f252bf))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([1c5b6cd](https://github.com/webern-unibas-ch/awg-app/commit/1c5b6cd1963a98789815d1e240a0ce368567376f))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([e1a3223](https://github.com/webern-unibas-ch/awg-app/commit/e1a3223d3a30fa8d4075f8413aceaf2f3bba7968))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([aa09870](https://github.com/webern-unibas-ch/awg-app/commit/aa098704c3c9c503545bc0901a54aaf053031348))
-   **deps-dev:** bump webpack-bundle-analyzer from 4.10.1 to 4.10.2 ([c916992](https://github.com/webern-unibas-ch/awg-app/commit/c916992e71ea062fcc5a7909e3ff1385a1d69261))
-   **deps-dev:** clean up yarn.lock file after updates ([c37c17c](https://github.com/webern-unibas-ch/awg-app/commit/c37c17c92e1731ae9e288d880c539c2aa7a244a9))
-   **deps:** bump @codemirror/legacy-modes from 6.3.3 to 6.4.0 ([62321ad](https://github.com/webern-unibas-ch/awg-app/commit/62321ad2e8bd922ed20e01d33730f925bedb81c1))
-   **deps:** bump actions/checkout from 4.1.1 to 4.1.3 ([7ee8ecb](https://github.com/webern-unibas-ch/awg-app/commit/7ee8ecb0e988d67b7203f0867546e9554bbd1033))
-   **deps:** bump codecov/codecov-action from 4.1.0 to 4.1.1 ([c7d3b80](https://github.com/webern-unibas-ch/awg-app/commit/c7d3b80e6ba32027ac23725eb186ab9b8f2447e5))
-   **deps:** bump codecov/codecov-action from 4.1.1 to 4.2.0 ([bddfe5c](https://github.com/webern-unibas-ch/awg-app/commit/bddfe5c62c0aa01a6a8568dbeb4389dccaf926f8))
-   **deps:** bump codecov/codecov-action from 4.2.0 to 4.3.0 ([bdf08d9](https://github.com/webern-unibas-ch/awg-app/commit/bdf08d932eaa5fc9ac16d41e57f2f3c3f2f6ae24))
-   **deps:** bump express from 4.18.2 to 4.19.2 ([c1e01d6](https://github.com/webern-unibas-ch/awg-app/commit/c1e01d6cdeb2b8916ba57c3e1b036063cff55d37))
-   **deps:** bump follow-redirects from 1.15.4 to 1.15.6 ([6c04fa0](https://github.com/webern-unibas-ch/awg-app/commit/6c04fa08b012ef1c8f68a15ceef57b3e98575e9d))
-   **deps:** bump n3 from 1.17.2 to 1.17.3 ([9814089](https://github.com/webern-unibas-ch/awg-app/commit/981408906746d006272c37490ecebcf7c278e07e))
-   **deps:** bump rdfstore from `687f120` to `0f57edd` ([19fa19f](https://github.com/webern-unibas-ch/awg-app/commit/19fa19f562f13e083b43aaf04171fd05a3f665bc))
-   **deps:** bump rdfstore from v0.9.18-alpha.14 to v0.9.18-alpha.15 ([5bcf210](https://github.com/webern-unibas-ch/awg-app/commit/5bcf2103748fce56ea36d7c035e4a36bc903b20d))
-   **deps:** bump softprops/action-gh-release from 1 to 2 ([1e66819](https://github.com/webern-unibas-ch/awg-app/commit/1e668196528d4e592428ccbd3a9f14fa18772c31))
-   **deps:** bump stefanzweifel/git-auto-commit-action ([9f489aa](https://github.com/webern-unibas-ch/awg-app/commit/9f489aa0bcd3faa6d0e0eaaaf42d09f181ccbbca))
-   **deps:** bump tar from 6.1.15 to 6.2.1 ([adc3341](https://github.com/webern-unibas-ch/awg-app/commit/adc33411d7a502aa498a27d5bee2b9e28cb5601c))
-   **deps:** bump the angular group with 11 updates ([2721223](https://github.com/webern-unibas-ch/awg-app/commit/2721223030f56350b40907deee8db27d2f9f05a1))
-   **deps:** bump the angular group with 11 updates ([c4349d9](https://github.com/webern-unibas-ch/awg-app/commit/c4349d9ae5a22027c38aca712822ccb55ba9f4e1))
-   **deps:** bump the angular group with 11 updates ([438b818](https://github.com/webern-unibas-ch/awg-app/commit/438b818ebf8dd74c0fe9e82a06da2484e89442d4))
-   **deps:** bump the angular group with 11 updates ([858e7e1](https://github.com/webern-unibas-ch/awg-app/commit/858e7e13ecf8c47c62a073cc159e18140d7e681b))
-   **deps:** bump the angular group with 11 updates ([7e7e4a8](https://github.com/webern-unibas-ch/awg-app/commit/7e7e4a8bc5ca967a89a253ca65917b06e64810c1))
-   **deps:** bump the angular group with 11 updates ([512b14e](https://github.com/webern-unibas-ch/awg-app/commit/512b14ebeca2cd5ac786298ab27910df08bb28fc))
-   **deps:** bump the fortawesome group with 2 updates ([279e2c8](https://github.com/webern-unibas-ch/awg-app/commit/279e2c828ff17453c7b8a505838813e45ac737f0))
-   **deps:** bump undici from 5.28.3 to 5.28.4 ([0df299f](https://github.com/webern-unibas-ch/awg-app/commit/0df299f89e22ed72f7116cfe159eb6581f13641b))
-   **deps:** bump webpack-dev-middleware from 5.3.3 to 5.3.4 ([19b013c](https://github.com/webern-unibas-ch/awg-app/commit/19b013c907cb8d235aba1dde71dd27428ec75abb))

### [0.11.7](https://github.com/webern-unibas-ch/awg-app/compare/v0.11.6...v0.11.7) (2024-03-07)

### Features

-   **assets:** add files for M 22 ([d968bea](https://github.com/webern-unibas-ch/awg-app/commit/d968bea5b9d18355586ab12f4836c7aa6ddbe719); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** datafy writing material of source description ([7aa0937](https://github.com/webern-unibas-ch/awg-app/commit/7aa0937cd22570b8989e3d7285c77ca31d09a393))

### Bug Fixes

-   **assets:** add firm signs for source B and D of m35/42 ([860609d](https://github.com/webern-unibas-ch/awg-app/commit/860609d5a211b12c30309629917e6d78afe3dbdd))
-   **assets:** fix convolute sigle for m34 Sk1.1 ([26b4f27](https://github.com/webern-unibas-ch/awg-app/commit/26b4f27621eec95222d6340b24b3644cc8907f49))
-   **assets:** fix folio info for firm signs in vol. II/2a ([df59bab](https://github.com/webern-unibas-ch/awg-app/commit/df59bab38903e33a046714f4344e82e8ba9f52d1))
-   **assets:** fix supplied class names ([c028516](https://github.com/webern-unibas-ch/awg-app/commit/c028516f6a3b64a987bab54874d7622e62a9c6cc))
-   **assets:** fix typo in Verlaufsskizze ([e2b37dd](https://github.com/webern-unibas-ch/awg-app/commit/e2b37ddfb4d532e83f286d78e8135256cfe6218b))
-   **assets:** optimize svgs with SVGO ([90bd051](https://github.com/webern-unibas-ch/awg-app/commit/90bd051aa9ecfbd4a38419741e07943ab85f210a))
-   **assets:** optimize svgs with SVGO ([5f3cffd](https://github.com/webern-unibas-ch/awg-app/commit/5f3cffd8d4eaceb45d0333c5e834a737150a1584))
-   **assets:** optimize svgs with SVGO ([5a99451](https://github.com/webern-unibas-ch/awg-app/commit/5a994515610d5618e4625e35e0765cd018951bb9))
-   **assets:** unify wording in sketch commentary ([7891b65](https://github.com/webern-unibas-ch/awg-app/commit/7891b65b834b75e9917385d36610620f56cfc3ad))
-   **assets:** update svg file for m35/42 Sk2 ([019f29d](https://github.com/webern-unibas-ch/awg-app/commit/019f29d6fdd47196671b11b215501665f30c2847); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** update svg files for m37 Sk1 & Sk2 ([7ce8314](https://github.com/webern-unibas-ch/awg-app/commit/7ce83147879609278d0874aa154b6f12fef65753); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** improve queryParams handling when loading SheetViewer ([3f333f0](https://github.com/webern-unibas-ch/awg-app/commit/3f333f054ebf135ea256ff6616959b52e632dc03))
-   **edition:** lint source description file ([37e49bd](https://github.com/webern-unibas-ch/awg-app/commit/37e49bdb0fba6153544dfca1b7f4917b75fd06aa))
-   **edition:** move folio viewer colors to folio service ([7385b98](https://github.com/webern-unibas-ch/awg-app/commit/7385b9855e11f4ceb2b04eb36c85874472d9f145))
-   **edition:** remove redundant mapping of firm signs ([8542df5](https://github.com/webern-unibas-ch/awg-app/commit/8542df51193e0b78956fe2dcc0263b40e0969c14))
-   **edition:** set fontFamily and fontSize correctly in FolioService ([2391f8a](https://github.com/webern-unibas-ch/awg-app/commit/2391f8a4f5e42f219171a643896903a79a99f23b))
-   **home:** fix wording on landing page ([8a6eb71](https://github.com/webern-unibas-ch/awg-app/commit/8a6eb719465e73c3e1d05da48ecc1ac1fe2fbdde))

### Code Refactoring

-   **edition:** atomize FolioService for better readability ([74fc383](https://github.com/webern-unibas-ch/awg-app/commit/74fc38323b729b3afd67e39d5a677ab91a262c5f))
-   **edition:** move from Snap.js to D3.js for FolioViewer ([f301a79](https://github.com/webern-unibas-ch/awg-app/commit/f301a79133a11b70af65181b95399d9c85df8245))
-   **edition:** refactor FolioCalculationModel (finish) ([99e8350](https://github.com/webern-unibas-ch/awg-app/commit/99e8350edb2734eb7f1187f9bdf38b9601da17c3))
-   **edition:** refactor FolioCalculationModel (ongoing) ([c8b0222](https://github.com/webern-unibas-ch/awg-app/commit/c8b02224febbb3038e20851220e812760762c1c6))
-   **edition:** rename contentItem -> contentSegment ([aeab45c](https://github.com/webern-unibas-ch/awg-app/commit/aeab45c1817d74f0584329cc6940229bef3522b2))
-   **edition:** rename contentItem -> contentSegment (continued) ([0547141](https://github.com/webern-unibas-ch/awg-app/commit/0547141e0662f7814e1685df9803701a092304dc))
-   **edition:** rename systemArray ([b01689b](https://github.com/webern-unibas-ch/awg-app/commit/b01689bb696d0863c6679da0c0786e7c7ac7d5c2))
-   **edition:** rename writingMaterialString ([7735209](https://github.com/webern-unibas-ch/awg-app/commit/7735209d0346c85550e5aceb3232e799e1eb6040))
-   **edition:** use helper method for writing instruments ([1167e40](https://github.com/webern-unibas-ch/awg-app/commit/1167e4004c946c9e2e86c3812a5c225095459844))

### Tests

-   **app:** adjust test syntax ([4b3bdab](https://github.com/webern-unibas-ch/awg-app/commit/4b3bdab8c13c7f833e9d60d95f92e08998cdb2f4))
-   **edition:** add more tests for FolioService ([3cd082f](https://github.com/webern-unibas-ch/awg-app/commit/3cd082f149e5da69cc950fb0ef489546db51587a))
-   **edition:** add tests for FolioService ([c2f0f60](https://github.com/webern-unibas-ch/awg-app/commit/c2f0f60c4624c57c1f102cb04f229714259314b7))
-   **edition:** add tests for FolioViewer Component ([9ef9ca0](https://github.com/webern-unibas-ch/awg-app/commit/9ef9ca0556a7dbbd0dd6eff3ea367b75a65bca52))
-   **edition:** adjust check for attributes lengths in FolioService ([7aad995](https://github.com/webern-unibas-ch/awg-app/commit/7aad9956d37a249f2d8fb0d328b80e87c3af060a))
-   **edition:** fix tests for edition sheets ([2f3a597](https://github.com/webern-unibas-ch/awg-app/commit/2f3a597b564c1efa65465acb2ae27ad7cb79494d))
-   **edition:** fix tests for EditionComplexComponent ([80ac3a2](https://github.com/webern-unibas-ch/awg-app/commit/80ac3a2185a4bd3e720a4df97213fa8361acdc6f))
-   **edition:** fix tests for writing material ([cf8c698](https://github.com/webern-unibas-ch/awg-app/commit/cf8c69891ba61df6e043a55c4887a7fa4ab699ae))
-   **edition:** fix tests in FolioService ([cc4b95b](https://github.com/webern-unibas-ch/awg-app/commit/cc4b95bbfb18be72920237a4fb6c77f5ffdfc405))
-   **edition:** unify syntax for test descriptions ([6c1376f](https://github.com/webern-unibas-ch/awg-app/commit/6c1376f34c9b327638e2c5c019bde6c1028c44c4))

### Build System

-   **deps-dev:** bump @types/node from 18.19.14 to 18.19.18 ([051a648](https://github.com/webern-unibas-ch/awg-app/commit/051a648b2d7f8ebcc5e72391677bba5b4c2387b3))
-   **deps-dev:** bump @types/node from 18.19.18 to 18.19.22 ([81ce5c8](https://github.com/webern-unibas-ch/awg-app/commit/81ce5c8bba85b6a593a2ff284716c52e9ec914ce))
-   **deps-dev:** bump eslint from 8.56.0 to 8.57.0 ([74b5bb4](https://github.com/webern-unibas-ch/awg-app/commit/74b5bb47352a5d45aad7e0acdbea44135fbfcf0e))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.1.0 to 48.2.0 ([71e1c6b](https://github.com/webern-unibas-ch/awg-app/commit/71e1c6b72f0eb1696bb36f25ccf1409a374fa4b0))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.2.0 to 48.2.1 ([e600384](https://github.com/webern-unibas-ch/awg-app/commit/e60038453297fa6a43f13c210df2bd891bd67018))
-   **deps-dev:** bump karma from 6.4.2 to 6.4.3 ([eea00e8](https://github.com/webern-unibas-ch/awg-app/commit/eea00e8f8d68460599c3c2833bb8652d4f82d15c))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([6a65040](https://github.com/webern-unibas-ch/awg-app/commit/6a65040f011de2ef6915c84a33c85a12298f00e4))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([1e33b73](https://github.com/webern-unibas-ch/awg-app/commit/1e33b739daffbd2f1740dabd707d26a7198186cd))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([2a22c3a](https://github.com/webern-unibas-ch/awg-app/commit/2a22c3a1036f0ff6ee50b752cf7b54ac9813d56d))
-   **deps-dev:** bump the commitlint group with 2 updates ([cf29606](https://github.com/webern-unibas-ch/awg-app/commit/cf29606945626ef38faaf7e3278a5861562358bd))
-   **deps-dev:** bump the commitlint group with 2 updates ([46cb940](https://github.com/webern-unibas-ch/awg-app/commit/46cb94085f7d7d2a60f4236305f3a2dc346960ca))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([7ba70b0](https://github.com/webern-unibas-ch/awg-app/commit/7ba70b0e112813bd6bdf36663776d9dbb4f4ea97))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([15ee52e](https://github.com/webern-unibas-ch/awg-app/commit/15ee52e247db4fee9a782372790964b197008be0))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([af142e6](https://github.com/webern-unibas-ch/awg-app/commit/af142e6b925f32ef94f0bf799e1a61e6b31f8284))
-   **deps:** bump bootstrap from 5.3.2 to 5.3.3 ([2aad2a3](https://github.com/webern-unibas-ch/awg-app/commit/2aad2a3a0a42153318eca2b4726c3e70428d0224))
-   **deps:** bump codecov/codecov-action from 4.0.1 to 4.0.2 ([fa3a172](https://github.com/webern-unibas-ch/awg-app/commit/fa3a17261e31e0ad06e31ba48271e4959aa6ebdf))
-   **deps:** bump codecov/codecov-action from 4.0.2 to 4.1.0 ([40e903c](https://github.com/webern-unibas-ch/awg-app/commit/40e903ced5a9e3d99f83be612dcdbc740e467927))
-   **deps:** bump es5-ext from 0.10.62 to 0.10.63 ([c61dd6f](https://github.com/webern-unibas-ch/awg-app/commit/c61dd6f38cf5d6156cdb61e693516b9ec2467ed8))
-   **deps:** bump ip from 2.0.0 to 2.0.1 ([071fd28](https://github.com/webern-unibas-ch/awg-app/commit/071fd2822e78411473fb5c6c28c3d88aec299a55))
-   **deps:** bump rdfstore from v0.9.18-alpha.13 to v0.9.18-alpha.14 ([4690ab4](https://github.com/webern-unibas-ch/awg-app/commit/4690ab4667cc6579c995bc8d541b4c1ab38029fd))
-   **deps:** bump the angular group with 11 updates ([0102d9a](https://github.com/webern-unibas-ch/awg-app/commit/0102d9a26cd78b8e9f19880a9cfc781c07bf5a8d))
-   **deps:** bump the angular group with 11 updates ([c97e3dc](https://github.com/webern-unibas-ch/awg-app/commit/c97e3dc4a8654609b8b917e73afd799a53fdab03))
-   **deps:** bump the angular group with 11 updates ([493df86](https://github.com/webern-unibas-ch/awg-app/commit/493df86a981151d816392f1fe12edbb296ee9f52))

### [0.11.6](https://github.com/webern-unibas-ch/awg-app/compare/v0.11.5...v0.11.6) (2024-02-19)

### Features

-   **edition:** add option to display reversed folio items ([08df6b4](https://github.com/webern-unibas-ch/awg-app/commit/08df6b4bee336f666cd46a0fa4f05dde17ff9ebc))

### Bug Fixes

-   **assets:** add convolute ids for text versions ([612be8b](https://github.com/webern-unibas-ch/awg-app/commit/612be8b3e375c88ffceaa799e1e152c1b4a6d79e))
-   **assets:** move convolutes to sheet contents ([2dd0b77](https://github.com/webern-unibas-ch/awg-app/commit/2dd0b7751c8b9b2d6f6f3696da7b73c848428cf7))
-   **assets:** unify description of writing material in op25 ([1fcbdcf](https://github.com/webern-unibas-ch/awg-app/commit/1fcbdcf76827baf66f0b4367b2eb85084fa8f468))
-   **edition:** fix overlapping of svgs on reload ([b9b0cf6](https://github.com/webern-unibas-ch/awg-app/commit/b9b0cf6aa90e72f0d8830f5fcb32e88c28054e54))
-   **edition:** fix reload of svgs again ([cf857c8](https://github.com/webern-unibas-ch/awg-app/commit/cf857c8484012ace28be5bc97e462413d33a3c8d))
-   **edition:** move convolute to sheet content model ([946ad3e](https://github.com/webern-unibas-ch/awg-app/commit/946ad3e952809721ff2b171ea3bf2cc1453b3fbf))
-   **edition:** update condition for displaying sheet viewer switch ([46d1426](https://github.com/webern-unibas-ch/awg-app/commit/46d1426a2963dbbd7055f541363806c65dbc488d))

### Tests

-   **edition:** create deep instead of shallow copy of mock objects ([bb30323](https://github.com/webern-unibas-ch/awg-app/commit/bb30323385dd0420edf28618431edefad6f511fc))

### Build System

-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([b7aec87](https://github.com/webern-unibas-ch/awg-app/commit/b7aec87fd87e3d7f5446f43336b085cc6837d515))
-   **deps:** bump ericcornelissen/svgo-action from 4.0.7 to 4.0.8 ([20d5ba4](https://github.com/webern-unibas-ch/awg-app/commit/20d5ba44ab70f0364f9d587adee6e03d3fcb0bdf))
-   **deps:** bump the angular group with 11 updates ([02be766](https://github.com/webern-unibas-ch/awg-app/commit/02be766b40306e134226c0aa808d5e4cb1da208b))
-   **deps:** bump undici from 5.27.2 to 5.28.3 ([b1ba896](https://github.com/webern-unibas-ch/awg-app/commit/b1ba8964b72a09f7e87c86fffdecf391edba25af))

### Code Refactoring

-   **assets:** restructure firm sign folder ([98356bc](https://github.com/webern-unibas-ch/awg-app/commit/98356bc575c95b5617c112db7909b5215638e86b))

### [0.11.5](https://github.com/webern-unibas-ch/awg-app/compare/v0.11.4...v0.11.5) (2024-02-14)

### Features

-   **assets:** add files for m35_42 ([d77c706](https://github.com/webern-unibas-ch/awg-app/commit/d77c70646b157c8e58bc6c3c84758a32113eac11); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** add edition complex M 35/42 ([8f7847a](https://github.com/webern-unibas-ch/awg-app/commit/8f7847a67fc331fd18a31cc7961348c42a3cfee6))
-   **edition:** add M35/42 to menus ([b043495](https://github.com/webern-unibas-ch/awg-app/commit/b043495c1e37b902cddb5469717cfc0ad1dccf99))
-   **edition:** add switch to toggle tkk highlighting ([7852b46](https://github.com/webern-unibas-ch/awg-app/commit/7852b463401ef06c689b68b1e98c985914f9ebbb))

### Bug Fixes

-   **assets:** add firm signs for m35/42 ([c56e335](https://github.com/webern-unibas-ch/awg-app/commit/c56e335cc7fb047d12524bdaf1f7716e940f7362))
-   **assets:** add link boxes for m35/42 ([32849c2](https://github.com/webern-unibas-ch/awg-app/commit/32849c241ca7164612f60275f86eaea3fbf8c574))
-   **assets:** add missing data files and placeholders for m35/42 ([e39413b](https://github.com/webern-unibas-ch/awg-app/commit/e39413b1b11b97e5679279750b2e845a5ef56b41))
-   **assets:** adjust folio convolute for m35/42 ([0481b8b](https://github.com/webern-unibas-ch/awg-app/commit/0481b8becee65d5082c03573e94ec20a1016fae7))
-   **assets:** fix file names and folders for m35/42 ([d8bb0e0](https://github.com/webern-unibas-ch/awg-app/commit/d8bb0e07dd3bf38bfe0b54ad6b6da318507401e4))
-   **assets:** fix link boxes for m35/42 Sk1.1 and Sk2 ([167e174](https://github.com/webern-unibas-ch/awg-app/commit/167e17427b495ee859d745161d9fb48d7555aff7))
-   **assets:** fix source descriptions for m35/42 ([f5dd5a6](https://github.com/webern-unibas-ch/awg-app/commit/f5dd5a67631977bcfe708a6fc3b73f899058bdaa))
-   **assets:** fix svg file for m35/42 Sk1.1 ([a807baf](https://github.com/webern-unibas-ch/awg-app/commit/a807baf1cf610c79f4393a4a2dd85bbea07e0b9f); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** fix textcritics for m35/42 ([9466c2d](https://github.com/webern-unibas-ch/awg-app/commit/9466c2d4f10cc41af1405150ae416c455f709a2c))
-   **assets:** fix textcritics for m35/42 ([3042a3a](https://github.com/webern-unibas-ch/awg-app/commit/3042a3a3b2a3ea5f99f76fbfb87f16e961b25cd0))
-   **assets:** mute unused link-boxes for now ([bfde47e](https://github.com/webern-unibas-ch/awg-app/commit/bfde47ebd7344e48978b534c4bb78d97a6c1f3ba))
-   **assets:** optimize svgs with SVGO ([4265dd2](https://github.com/webern-unibas-ch/awg-app/commit/4265dd246c4527db07aac6d50fc33b93878fe791))
-   **assets:** optimize svgs with SVGO ([03e6200](https://github.com/webern-unibas-ch/awg-app/commit/03e62003bc8d5ba2faca953414be4cc55ecb0ac7))
-   **assets:** optimize svgs with SVGO ([259ce83](https://github.com/webern-unibas-ch/awg-app/commit/259ce83ebd1e1105ca77acaac6473a75e419961d))
-   **assets:** optimize svgs with SVGO ([dde69ed](https://github.com/webern-unibas-ch/awg-app/commit/dde69edae2503ae36110cd8daab8354d6514ec20))
-   **assets:** update files for m35_42 ([e053eeb](https://github.com/webern-unibas-ch/awg-app/commit/e053eebedf649ad2b1cda047e9d9bf730c5d84bf); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** update svg file for m35/42 Sk1.1 ([d021f04](https://github.com/webern-unibas-ch/awg-app/commit/d021f0497badea3c1ef728bc8e16c0847240ba20); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** update svg files for m35/42 ([731fb49](https://github.com/webern-unibas-ch/awg-app/commit/731fb49797190eeb6461110851dbee698dd982a0); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** add clef_key to supplied classes map ([af7f116](https://github.com/webern-unibas-ch/awg-app/commit/af7f116fb75e6f651a0bd31079b72c6610566372))
-   **edition:** adjust supplied classes lookup ([a299192](https://github.com/webern-unibas-ch/awg-app/commit/a299192e746553e2ca86da90ee08428cb0967f2a))
-   **edition:** avoid use of conditional expression for default assignment ([9d2c6e4](https://github.com/webern-unibas-ch/awg-app/commit/9d2c6e4bc424ea73daf5e1a885f99dbf66db41af))
-   **edition:** fix updating of tkk colors in drawing service ([8e84ef9](https://github.com/webern-unibas-ch/awg-app/commit/8e84ef96ebf704b6e70a2d4d2de3c4f9691d0a10))
-   **edition:** remove tka switch if no tka overlays are given ([92b8428](https://github.com/webern-unibas-ch/awg-app/commit/92b84284a19113312d76cf838bfac20afc4be350))
-   **edition:** reset all classes switch on change of svg ([79decdf](https://github.com/webern-unibas-ch/awg-app/commit/79decdf13d2d758c4a2bcf33d88c905185c504da))
-   **edition:** update last modification date for edition complexes ([d0e3b88](https://github.com/webern-unibas-ch/awg-app/commit/d0e3b88388ae82e4d573c0f1f2dd40f94a1f898b))

### Code Refactoring

-   **edition:** add enum for EditionSvgOverlayActionTypes ([6af1c10](https://github.com/webern-unibas-ch/awg-app/commit/6af1c10c526b16fa6ffdd496cbb1b9be3917b1f4))
-   **edition:** move overlay selection into separate method ([ddbf73a](https://github.com/webern-unibas-ch/awg-app/commit/ddbf73a4aba778d73610f96f644023b04043250c))
-   **edition:** rename allClassesVisible flag ([5395991](https://github.com/webern-unibas-ch/awg-app/commit/539599128755b2a0a30b730111d5d69a3768dd51))
-   **edition:** rename clearSvg method ([d9ee607](https://github.com/webern-unibas-ch/awg-app/commit/d9ee6078609dea1b541d80d01b7148d9d9460dc8))
-   **edition:** rename EditionSvgSheetViewerSwitch component ([6a7b944](https://github.com/webern-unibas-ch/awg-app/commit/6a7b944092792c9ffb32b2933ab27c42f436f83e))
-   **edition:** rename SvgOverlayType.item -> tka ([95fbfeb](https://github.com/webern-unibas-ch/awg-app/commit/95fbfeb87409bf0b83ec15b5cb442ef7bc6eaf6d))

### Tests

-   **edition:** add helper function for expected order of headers ([e45e0cd](https://github.com/webern-unibas-ch/awg-app/commit/e45e0cd09a66dbf99d56cce036c4115564a0b9ec))
-   **edition:** add tests for new sheet viewer methods ([ab8b281](https://github.com/webern-unibas-ch/awg-app/commit/ab8b28171ba9ec84de1dd1a2e2a80a7f5c3d12f0))
-   **edition:** fix errors after changes ([f891deb](https://github.com/webern-unibas-ch/awg-app/commit/f891deb3b50639aae47cdf437aed434f9d829600))
-   **edition:** fix tests for firm signs ([341c2dc](https://github.com/webern-unibas-ch/awg-app/commit/341c2dce0c0d072cd989d82548f0240d6e809d38))
-   **edition:** fix tests for sheet viewer settings ([31071cf](https://github.com/webern-unibas-ch/awg-app/commit/31071cf64dac9b55b3dc2c77aa26d7cd90fdf6e8))

### Build System

-   **deps-dev:** bump @types/node from 18.19.6 to 18.19.14 ([7eb1cb3](https://github.com/webern-unibas-ch/awg-app/commit/7eb1cb3d52e267b97b13b99fc2b1fd93fde7d637))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.0.4 to 48.0.6 ([9ccbb2a](https://github.com/webern-unibas-ch/awg-app/commit/9ccbb2aaa1ee5a619f39a74e80b88bf0bb3e7532))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.0.6 to 48.1.0 ([4c0b683](https://github.com/webern-unibas-ch/awg-app/commit/4c0b683249080dd16b4f8e2fcffe92ee8aa13d39))
-   **deps-dev:** bump husky from 9.0.10 to 9.0.11 ([6bfe5a3](https://github.com/webern-unibas-ch/awg-app/commit/6bfe5a3abf4299b55e4cc1e3d657f720d6789f48))
-   **deps-dev:** bump jasmine-core from 5.1.1 to 5.1.2 ([855a9f6](https://github.com/webern-unibas-ch/awg-app/commit/855a9f6b1421e6291e91da850ac9e606182cf1af))
-   **deps-dev:** bump lint-staged from 15.2.1 to 15.2.2 ([96f5af4](https://github.com/webern-unibas-ch/awg-app/commit/96f5af4ae27cdc5ed15fea3f86a70b30b71870f2))
-   **deps-dev:** bump prettier from 3.2.4 to 3.2.5 ([a1faf3a](https://github.com/webern-unibas-ch/awg-app/commit/a1faf3adc095d562fe17fb39c93d05ae104d79b8))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([319f0a3](https://github.com/webern-unibas-ch/awg-app/commit/319f0a33b18fc336fecd559d8dcc9d516a6b5e63))
-   **deps-dev:** bump the commitlint group with 2 updates ([cc2bc77](https://github.com/webern-unibas-ch/awg-app/commit/cc2bc77ee2adb22bb882c18539f7154fba9075e1))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([32e3941](https://github.com/webern-unibas-ch/awg-app/commit/32e3941adffe95b6b82d0da512c0033d009fe9f9))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([e82eb9b](https://github.com/webern-unibas-ch/awg-app/commit/e82eb9bd39394ceefc11f4b28c15481be389d8e3))
-   **deps:** bump actions/setup-node from 4.0.1 to 4.0.2 ([d415dee](https://github.com/webern-unibas-ch/awg-app/commit/d415deeab884bab99a6a317420c58b6b883f7cde))
-   **deps:** bump ericcornelissen/svgo-action from 4.0.6 to 4.0.7 ([b25740a](https://github.com/webern-unibas-ch/awg-app/commit/b25740a290331512b7bdb9c4731d61269e806a93))
-   **deps:** bump the angular group with 11 updates ([6467077](https://github.com/webern-unibas-ch/awg-app/commit/646707739c57ad6a09cc3af69f4514fa8263291a))

### [0.11.4](https://github.com/webern-unibas-ch/awg-app/compare/v0.11.3...v0.11.4) (2024-02-04)

### Features

-   **edition:** add component & service methods for supplied classes ([6ac13d9](https://github.com/webern-unibas-ch/awg-app/commit/6ac13d910730e1e22acc6729e70cb1430106adb6))
-   **edition:** add M31 to menus ([7884012](https://github.com/webern-unibas-ch/awg-app/commit/7884012d24cf57438942a5a3d8b436800da9fcf6))

### Bug Fixes

-   **app:** remove unused constructors ([403aefa](https://github.com/webern-unibas-ch/awg-app/commit/403aefa33b303513655f7a218cea75de751e1c10))
-   **assets:** add link boxes for Sk1 in m31 ([eb4a281](https://github.com/webern-unibas-ch/awg-app/commit/eb4a28174c972ffad3cc977867a5c4160950e411))
-   **assets:** adjust multiple supplied classes (for now) ([a4e795d](https://github.com/webern-unibas-ch/awg-app/commit/a4e795d14e93006c910bfe5c64b328c4510cb4bf))
-   **assets:** fix link boxes in m31 ([694716f](https://github.com/webern-unibas-ch/awg-app/commit/694716fac5e81b25e2b68fd55ccd0a6df79cc833))
-   **assets:** fix links to sources from source lists ([1b3b64f](https://github.com/webern-unibas-ch/awg-app/commit/1b3b64fb121860e53c741005f2d1057870643d85))
-   **assets:** fix typos in textcritics for m31 ([587da39](https://github.com/webern-unibas-ch/awg-app/commit/587da394f13d95ec3126b760ad5b456a9110dce9))
-   **asssets:** fix svg files for m30 and m31 ([#1325](https://github.com/webern-unibas-ch/awg-app/issues/1325)) ([7d9cb22](https://github.com/webern-unibas-ch/awg-app/commit/7d9cb2254df3d5130cac2b71a1f0e766e50700c5); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** fix label in supplied classes look up map ([bb072e1](https://github.com/webern-unibas-ch/awg-app/commit/bb072e1e452e333500748204f5164eda7d5e8597))
-   **edition:** fix object chaining expressions ([cee1a95](https://github.com/webern-unibas-ch/awg-app/commit/cee1a95cf3a608c982602063e671f249a4173509))
-   **edition:** fix stepSize value in slider config ([984ca26](https://github.com/webern-unibas-ch/awg-app/commit/984ca26d973ca843e5c9bd8a57d93f86484a8873))
-   **edition:** fix typo in variable name ([3eeea8d](https://github.com/webern-unibas-ch/awg-app/commit/3eeea8d328c309a24db0d60f8319a19c1a81e893))
-   **edition:** remove unreachable condition from sheet viewer method ([5a3d167](https://github.com/webern-unibas-ch/awg-app/commit/5a3d167c527f48fce8d6a1a2b2eda8dde6995d1e))
-   **edition:** use ChangeDetectorRef for SheetViewer ([b902da6](https://github.com/webern-unibas-ch/awg-app/commit/b902da65a7aa02807128f9cfd80558e128e98eaa))
-   **gh-actions:** do not run svg optimization on forks ([a7c7c34](https://github.com/webern-unibas-ch/awg-app/commit/a7c7c34d92b582265a0087245ccc6da044c0e19e))
-   **search:** remove resolved TODO ([39f4e7f](https://github.com/webern-unibas-ch/awg-app/commit/39f4e7f8820260772d889a0b08d725e0d1b0e00c))

### Build System

-   **app:** update husky command ([c3f41ff](https://github.com/webern-unibas-ch/awg-app/commit/c3f41ff53b77731fb8c17eb7cea0acc2ba567ce1))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.0.2 to 48.0.3 ([9aeec1f](https://github.com/webern-unibas-ch/awg-app/commit/9aeec1f7e17ea8044e57f4b99b37512d5f2221a9))
-   **deps-dev:** bump eslint-plugin-jsdoc from 48.0.3 to 48.0.4 ([f676a4b](https://github.com/webern-unibas-ch/awg-app/commit/f676a4b3f094acffbf3753ece9cfdbc4d0f32578))
-   **deps-dev:** bump husky from 8.0.3 to 9.0.6 ([4403c50](https://github.com/webern-unibas-ch/awg-app/commit/4403c50d598a0f7c104b9a64024d3c23249dd76e))
-   **deps-dev:** bump husky from 9.0.6 to 9.0.7 ([6a3d97e](https://github.com/webern-unibas-ch/awg-app/commit/6a3d97e5f97aa93dc0993801ffb0a13ef710c505))
-   **deps-dev:** bump husky from 9.0.7 to 9.0.8 ([1730de7](https://github.com/webern-unibas-ch/awg-app/commit/1730de7f6f712ded600a8ef5e3d029e90439a362))
-   **deps-dev:** bump husky from 9.0.8 to 9.0.10 ([7b50c71](https://github.com/webern-unibas-ch/awg-app/commit/7b50c719f8d5529213413ad0cf18e8962be9dce9))
-   **deps-dev:** bump lint-staged from 15.2.0 to 15.2.1 ([706a8b3](https://github.com/webern-unibas-ch/awg-app/commit/706a8b38456b765f7630036cd1104771110ad5eb))
-   **deps-dev:** bump prettier from 3.2.2 to 3.2.4 ([f3f475b](https://github.com/webern-unibas-ch/awg-app/commit/f3f475b850e65f79eeb70e5a8b80cbaef97b6dfd))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([79a13e0](https://github.com/webern-unibas-ch/awg-app/commit/79a13e0d1d21206664a22addb7b7de2ea268909e))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([732aa43](https://github.com/webern-unibas-ch/awg-app/commit/732aa43e35723e2c6303b15a4eb3de12355da4bf))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([10c68c3](https://github.com/webern-unibas-ch/awg-app/commit/10c68c3045337a786736b239f6088532d00e1cfb))
-   **deps-dev:** bump the commitlint group with 2 updates ([8e31dfa](https://github.com/webern-unibas-ch/awg-app/commit/8e31dfa21787b6ca9ef1096171a1e92c11347867))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([f114742](https://github.com/webern-unibas-ch/awg-app/commit/f114742a555a1c611ffae55b9be91d15294bd22a))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([0dcf4ac](https://github.com/webern-unibas-ch/awg-app/commit/0dcf4accc9aa8967662e572964f24c6480879938))
-   **deps:** bump codecov/codecov-action from 3.1.4 to 3.1.5 ([6dc74ce](https://github.com/webern-unibas-ch/awg-app/commit/6dc74cea2a157c6da14abecdfd9a3c67aa884690))
-   **deps:** bump codecov/codecov-action from 3.1.5 to 3.1.6 ([d3f6e3b](https://github.com/webern-unibas-ch/awg-app/commit/d3f6e3b36554054c4596bf1b6655db2ae6136d6e))
-   **deps:** bump codecov/codecov-action from 3.1.6 to 4.0.0 ([a859a5a](https://github.com/webern-unibas-ch/awg-app/commit/a859a5aa66d5fe6bfd9ca32b937836b3cd6c74b4))
-   **deps:** bump codecov/codecov-action from 4.0.0 to 4.0.1 ([ef5290e](https://github.com/webern-unibas-ch/awg-app/commit/ef5290e60a7cea5a1dc5c749b4404574141f4560))
-   **deps:** bump the angular group with 11 updates ([7b1f7b0](https://github.com/webern-unibas-ch/awg-app/commit/7b1f7b0b0c4a965ac955926ddb7bcfdeb1cdabd8))
-   **deps:** bump the angular group with 11 updates ([cca12d9](https://github.com/webern-unibas-ch/awg-app/commit/cca12d99ef0aae2d57def4c027cfb2cc6fe05464))

### Styles

-   **edition:** adjust styles for supplied classes elements ([03a2f87](https://github.com/webern-unibas-ch/awg-app/commit/03a2f87f44c7a389db48827715d924962f059067))
-   **edition:** fix style for dropdown in force graph ([d3d5a65](https://github.com/webern-unibas-ch/awg-app/commit/d3d5a65941f659ce68d95cd316a427692ab4fce7))

### Code Refactoring

-   **edition:** move sheet footer component into separate module ([a3ca8db](https://github.com/webern-unibas-ch/awg-app/commit/a3ca8db2b8d87a76e41db989c969e9b96522db1a))
-   **edition:** move sheet nav components into separate module ([0b49486](https://github.com/webern-unibas-ch/awg-app/commit/0b4948646e7d67ef37cd335ee794c86affcf8bb7))
-   **edition:** move sheet viewer component into separate module ([34cd20a](https://github.com/webern-unibas-ch/awg-app/commit/34cd20a303da66a3062f7d2d87d868a9d7106055))
-   **edition:** move tka components into separate module ([c3056f8](https://github.com/webern-unibas-ch/awg-app/commit/c3056f849323a800e47010ad86149d65400f3299))
-   **edition:** use more precise naming in sheet viewer methods ([e3cd18e](https://github.com/webern-unibas-ch/awg-app/commit/e3cd18e495c149e20b8f65cd6cda5a4a9920c79c))

### Tests

-   **app:** fix tests after inclusion of m31 ([e3346d9](https://github.com/webern-unibas-ch/awg-app/commit/e3346d9d465024608269f46f26e6e88d876ebe2a))
-   **edition:** add more tests for EditionSheetViewer ([3643205](https://github.com/webern-unibas-ch/awg-app/commit/36432056475d44a51008e65bd51da4dbce8b09bf))
-   **edition:** add tests for supplied classes ([ac59db3](https://github.com/webern-unibas-ch/awg-app/commit/ac59db3a4bcc9c93240f1962ac36bf6a7a7dd7ba))
-   **edition:** fix scope issue in form-switch test ([2f96526](https://github.com/webern-unibas-ch/awg-app/commit/2f965267dbfaabcbe4a6ffc4f627c617e84f0048))

### [0.11.3](https://github.com/webern-unibas-ch/awg-app/compare/v0.11.2...v0.11.3) (2024-01-19)

### Features

-   **assets:** add files for M 31 ([#844](https://github.com/webern-unibas-ch/awg-app/issues/844)) ([1a5347b](https://github.com/webern-unibas-ch/awg-app/commit/1a5347b80d3a7338e988adf4d72ee4a06009dee4); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** add edition complex M 31 ([b66bb54](https://github.com/webern-unibas-ch/awg-app/commit/b66bb54b5aa5c9e806af8ec2d5872c0c6d9e3d6c))
-   **edition:** adjust selectSvgSheet for cross-complex linking ([81a9940](https://github.com/webern-unibas-ch/awg-app/commit/81a99408e9a0462e21f35b4e04a6a5d27a0fbc45))

### Bug Fixes

-   **app:** avoid conditional expression for default assignment ([ae21c7f](https://github.com/webern-unibas-ch/awg-app/commit/ae21c7f3daa313815e8934b5c929e12812078d9b))
-   **app:** fix unexpected lexical declaration in case blocks ([ff30f8d](https://github.com/webern-unibas-ch/awg-app/commit/ff30f8d8df397c806b317df44a4ea717f4f3316b))
-   **app:** fix unnecessary use of boolean literals ([a2e999e](https://github.com/webern-unibas-ch/awg-app/commit/a2e999ec760a1a801ed82176d6abe21a27ba7c7c))
-   **app:** prefer object chaining for object checks ([e4c3749](https://github.com/webern-unibas-ch/awg-app/commit/e4c37493ab680a9f85f8ce5100ca1bc046dd5964))
-   **assets:** activate Textfassung 1 for m30 and m31 ([9ad3657](https://github.com/webern-unibas-ch/awg-app/commit/9ad36578f780d816d82881e089ae634ca7244f6f))
-   **assets:** add firm signs for m30, m31, m34, and m37 ([47692d0](https://github.com/webern-unibas-ch/awg-app/commit/47692d0aa3c9846a147a7263dc8f8d3bc2bf70cd))
-   **assets:** add linkBoxes for m30 ([2d0cf21](https://github.com/webern-unibas-ch/awg-app/commit/2d0cf21db080846302373dc9f046e14b4fbdb757))
-   **assets:** add missing data files and placeholders for m31 ([dac88d0](https://github.com/webern-unibas-ch/awg-app/commit/dac88d037ce295f505e1c2cb6955e03ffdc087b4))
-   **assets:** adjust data after changes to svg link models ([1ee7268](https://github.com/webern-unibas-ch/awg-app/commit/1ee72685f4f72886e795ad6483e21873bf861c71))
-   **assets:** adjust folio convolute for m34 and m37 ([957feb9](https://github.com/webern-unibas-ch/awg-app/commit/957feb90da833ff5acf2ec072979aae47c4a1ab9))
-   **assets:** fix folio convolute file for m30 ([d5dc23a](https://github.com/webern-unibas-ch/awg-app/commit/d5dc23a0e11388a44976978408707bb495407cb9))
-   **assets:** fix link box for m37 ([7ee69f0](https://github.com/webern-unibas-ch/awg-app/commit/7ee69f0722fa715ca4676699be6ade5dcee5d0a5))
-   **assets:** fix source descriptions for m34 and m37 ([bfd2e83](https://github.com/webern-unibas-ch/awg-app/commit/bfd2e83e120dcb261dd20d5d84f68ff3c47b7623))
-   **assets:** format textcritics files ([0db6905](https://github.com/webern-unibas-ch/awg-app/commit/0db69053d149983115980c59f3b3a8d7d4f6eb2d))
-   **assets:** rename svg file for m 31 ([6b49eae](https://github.com/webern-unibas-ch/awg-app/commit/6b49eaeca64ac6cfd7fa9fe9c6c511ce6aa4e0c0))
-   **assets:** unify naming of sources ([bbb444b](https://github.com/webern-unibas-ch/awg-app/commit/bbb444b220d17cc8814fe91238ad6d06f971b224))
-   **assets:** update files for m30, m31, and m37 ([#1308](https://github.com/webern-unibas-ch/awg-app/issues/1308)) ([e87a7e0](https://github.com/webern-unibas-ch/awg-app/commit/e87a7e06448c7ba2f7e03eae6888678ddc9e92a4))
-   **assets:** update source description for m30 ([a6ab069](https://github.com/webern-unibas-ch/awg-app/commit/a6ab069884e62bd27ec0ce0e177ee8ec5ea00934))
-   **assets:** update source evaluation for Textfassung 1 for m34 and m37 ([3b7b728](https://github.com/webern-unibas-ch/awg-app/commit/3b7b7283bf596242da777ce719d28b753a3af7d9))
-   **edition:** add graph query example for edition complexes ([fe0bce0](https://github.com/webern-unibas-ch/awg-app/commit/fe0bce0ed9dbee92987e313d5d75be0e711af693))
-   **edition:** adjust folio model for non-selectable items ([e8fb6ee](https://github.com/webern-unibas-ch/awg-app/commit/e8fb6eeced313a54c4556ca522100f8c07c31411))
-   **edition:** fix naming and formatting of graph RDF triples ([6dfd59b](https://github.com/webern-unibas-ch/awg-app/commit/6dfd59b29e285612f7671cf222c27ef564ab17ca))
-   **edition:** remove unused method from sheet viewer ([8fe1e8a](https://github.com/webern-unibas-ch/awg-app/commit/8fe1e8a79388b59933b1d9fd2a96ffd9932fb1d1))

### Tests

-   **edition:** adjust tests after changes to svg link models ([08e687f](https://github.com/webern-unibas-ch/awg-app/commit/08e687f10169bf6848bb9e4ec1c11ac7fba3de3f))

### Code Refactoring

-   **edition:** move tka description into separate component ([5a2fab9](https://github.com/webern-unibas-ch/awg-app/commit/5a2fab90742da512ec3f945f96bef8c8483615a7))
-   **search:** simplify methods in bibliography format pipe ([eebc87d](https://github.com/webern-unibas-ch/awg-app/commit/eebc87dde827c8e3917f0a29faa7bfbe2de8a444))

### Build System

-   **deps-dev:** bump prettier from 3.1.1 to 3.2.2 ([01b85dd](https://github.com/webern-unibas-ch/awg-app/commit/01b85dd64c43ce744e70005b4359ea4e950c240b))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([06c26a9](https://github.com/webern-unibas-ch/awg-app/commit/06c26a92297113138a01b23ae7aecb17379fa295))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([01f5691](https://github.com/webern-unibas-ch/awg-app/commit/01f569174ee7fd25760e1366aa9f5eb466c1b1c9))
-   **deps:** bump the angular group with 11 updates ([d5c2895](https://github.com/webern-unibas-ch/awg-app/commit/d5c28958b1ce7d76d34b88eb7c64034adc20e6d8))
-   **deps:** bump the angular group with 11 updates ([930dd6f](https://github.com/webern-unibas-ch/awg-app/commit/930dd6fc7f838d1c7fddeac4de0882ccfa12ea67))

### [0.11.2](https://github.com/webern-unibas-ch/awg-app/compare/v0.11.1...v0.11.2) (2024-01-10)

### Features

-   **assets:** enable linkBoxes for m37 ([f3beb9e](https://github.com/webern-unibas-ch/awg-app/commit/f3beb9e1bb21bc249bd0fe6798b00feac8e81891))
-   **edition:** add edition complex M 37 ([ed04f02](https://github.com/webern-unibas-ch/awg-app/commit/ed04f022497954f4624ee250c5a2dbec49d3e752); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** add M37 to menus ([1e667d7](https://github.com/webern-unibas-ch/awg-app/commit/1e667d73da1a4b3d16f24e5943d63ac2caf04bdc))

### Bug Fixes

-   **assets:** add missing data files and placeholders for m37 ([17353cb](https://github.com/webern-unibas-ch/awg-app/commit/17353cb1299b2bf26ecda1aaff55f22bd4586a26))
-   **assets:** fix itemLinks in sourceDescription of m37 ([2c1355c](https://github.com/webern-unibas-ch/awg-app/commit/2c1355c430d46b16584c90c16568e3e1f1e12d94))
-   **assets:** fix textcritics for m37 ([f11b79e](https://github.com/webern-unibas-ch/awg-app/commit/f11b79e5eba00b755af1c14d12ba32221d599fec))
-   **assets:** optimize 2 SVG(s) with SVGO ([7253315](https://github.com/webern-unibas-ch/awg-app/commit/7253315fb3b21c771c1c028229f844289101e579))
-   **assets:** optimize 6 SVG(s) with SVGO ([a0ba894](https://github.com/webern-unibas-ch/awg-app/commit/a0ba89401bc81d2868fbce74ddf162faf934dd46))

### Continuous Integration

-   **gh-actions:** update ratchet versions ([bc2e4ca](https://github.com/webern-unibas-ch/awg-app/commit/bc2e4ca2fb3644daf81d457a394e18ae61cf7dcf))
-   **gh-actions:** update ratchet versions ([d036f8b](https://github.com/webern-unibas-ch/awg-app/commit/d036f8b3db7165c6fc154037392af2d99d1fd7e9))

### Code Refactoring

-   **side-info:** use accordion for edition side-info ([77c735f](https://github.com/webern-unibas-ch/awg-app/commit/77c735f8bcf469083aa2e6191cc0ed3bd981dba0))

### Build System

-   **app:** bump minimal supported node version to 18.19.0 ([806b745](https://github.com/webern-unibas-ch/awg-app/commit/806b7454677a364d944035da469a3c793299bc3a))
-   **deps-dev:** bump @types/node from 18.19.3 to 18.19.6 ([83ef36a](https://github.com/webern-unibas-ch/awg-app/commit/83ef36aeb464392a65555d042cb80f2a4bce66ca))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.9.1 to 48.0.2 ([ce8747a](https://github.com/webern-unibas-ch/awg-app/commit/ce8747ae924542fd0ba129b84529969096f38444))
-   **deps-dev:** bump eslint-plugin-prettier from 5.0.1 to 5.1.0 ([3b241d5](https://github.com/webern-unibas-ch/awg-app/commit/3b241d57b0af93ce498c47e8fb91aa6cf7ce1b3e))
-   **deps-dev:** bump eslint-plugin-prettier from 5.1.0 to 5.1.1 ([2f0744e](https://github.com/webern-unibas-ch/awg-app/commit/2f0744ea5748b5e2901b18519cd78ccaf18a52c8))
-   **deps-dev:** bump eslint-plugin-prettier from 5.1.1 to 5.1.2 ([e1d23b4](https://github.com/webern-unibas-ch/awg-app/commit/e1d23b476894f836741bebdf3fbec910e55eed02))
-   **deps-dev:** bump eslint-plugin-prettier from 5.1.2 to 5.1.3 ([e8f8747](https://github.com/webern-unibas-ch/awg-app/commit/e8f8747f7a4a36b836ab958caae1d68b6a92ef8d))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([56fb1a2](https://github.com/webern-unibas-ch/awg-app/commit/56fb1a2b8b4d68b92e4dd61152973355de2736f2))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([ffca069](https://github.com/webern-unibas-ch/awg-app/commit/ffca0694cd49c376515324ab531ba2063540bc3b))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([ab38a34](https://github.com/webern-unibas-ch/awg-app/commit/ab38a3479bc8b8dcba7cb59a197b1d92c338d8a9))
-   **deps-dev:** bump the commitlint group with 2 updates ([7f4ef60](https://github.com/webern-unibas-ch/awg-app/commit/7f4ef6057ab3591f57cc2f6f0db877a2090a7a08))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([464f3c0](https://github.com/webern-unibas-ch/awg-app/commit/464f3c0e39d9091be41b8e1c4ccbae2e16b884f6))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([a640dcc](https://github.com/webern-unibas-ch/awg-app/commit/a640dccdd97dee1afdc870276b0da4bd74557592))
-   **deps:** bump @fortawesome/angular-fontawesome from 0.14.0 to 0.14.1 ([420f3cc](https://github.com/webern-unibas-ch/awg-app/commit/420f3cc78858b87bc4c070a0273909d23846ae9a))
-   **deps:** bump ericcornelissen/svgo-action from 4.0.4 to 4.0.6 ([9233f14](https://github.com/webern-unibas-ch/awg-app/commit/9233f14e5ae6521046d73b966810aede22a6ac07))
-   **deps:** bump follow-redirects from 1.15.2 to 1.15.4 ([61f1a20](https://github.com/webern-unibas-ch/awg-app/commit/61f1a2005f78ffe5cd3583f5e8a4f6e3431f35af))
-   **deps:** bump rdfstore from v0.9.18-alpha.12 to v0.9.18-alpha.13 ([3fbd2bb](https://github.com/webern-unibas-ch/awg-app/commit/3fbd2bbf2a94f21b174aba592c8d31889e516cfb))
-   **deps:** bump the angular group with 11 updates ([13c7216](https://github.com/webern-unibas-ch/awg-app/commit/13c7216b33e654dbb75d8c1929ae81ee3e1cd844))

### [0.11.1](https://github.com/webern-unibas-ch/awg-app/compare/v0.11.0...v0.11.1) (2023-12-18)

### ⚠ BREAKING CHANGES

-   **app:** Node v14 and v16 support is removed. Minimal node version is now v18.

### Bug Fixes

-   **app:** fix lint issues after update to v16 ([47b3c0b](https://github.com/webern-unibas-ch/awg-app/commit/47b3c0b4ca57b555f47c45705b8449d92b0ecdda))
-   **app:** fix linting errors after update to v16 ([0bec15a](https://github.com/webern-unibas-ch/awg-app/commit/0bec15a5d43d6652c5136a6f40539724a0332e66))
-   **app:** fix scss import path after update to v17 ([ac5974a](https://github.com/webern-unibas-ch/awg-app/commit/ac5974ad0cb1185eed3cd5ff10dcd82d30e17de3))
-   **app:** migrate to new control-flow syntax ([c2f729d](https://github.com/webern-unibas-ch/awg-app/commit/c2f729df58571c2df18ca5fd6a44f968b45c67c1))
-   **assets:** fix M317_Sk4-1von4-final ([8251d8a](https://github.com/webern-unibas-ch/awg-app/commit/8251d8a7d90f28861b6eb4b34bcfe45b5d2caca9); thanks to [@masthom](https://github.com/masthom))
-   **assets:** fix n-dash in textcritics for op. 12 ([6339fd7](https://github.com/webern-unibas-ch/awg-app/commit/6339fd79e1b69cb0221aeda9332a5b78773e334d))
-   **assets:** update files for m30 ([#1193](https://github.com/webern-unibas-ch/awg-app/issues/1193)) ([3bc34a8](https://github.com/webern-unibas-ch/awg-app/commit/3bc34a803b6de756dfcaf37b40165463a0ed7500); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** update measures in source description for m34 ([97993ad](https://github.com/webern-unibas-ch/awg-app/commit/97993ad7c0007b31fcf55a7c310671a2827ed2a7); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** update source description for m34 ([57850aa](https://github.com/webern-unibas-ch/awg-app/commit/57850aac9defe17602e4e3cb4940273f249774db); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** disable toggling of UnsupportedTypeCmp on fullScreen ([66a1428](https://github.com/webern-unibas-ch/awg-app/commit/66a1428b798a1ea474beaff376614880e12e92d6))
-   **edition:** fix linting errors after update to v17 ([e5678cb](https://github.com/webern-unibas-ch/awg-app/commit/e5678cb59dc7954b3cc052af85cc3ffd8d512d2d))
-   **edition:** improve check for empty sparql results ([b89b0fb](https://github.com/webern-unibas-ch/awg-app/commit/b89b0fb0d6d13a106b024d965edb8513e954e0d9))
-   **edition:** replace deprecated accordion syntax ([1effcef](https://github.com/webern-unibas-ch/awg-app/commit/1effcef21814b38e6ed7ff3f48fd8feb681f6318))
-   **edition:** use div instead of h2 for header in TriplesEditor ([5f0e0e0](https://github.com/webern-unibas-ch/awg-app/commit/5f0e0e016e5e99121d0d6dd5190b171986a7507c))
-   **gh-actions:** apply suggestions from code review ([393344b](https://github.com/webern-unibas-ch/awg-app/commit/393344b0f8af55efc71cda9c785d661b39510e1c))
-   **gh-actions:** apply suggestions from code review ([973b921](https://github.com/webern-unibas-ch/awg-app/commit/973b921ac124fcf84d35e15e2a205f3f15d444ec))

### Styles

-   **edition:** fix styles of GraphVisualizer in fullscreen mode ([e517ecb](https://github.com/webern-unibas-ch/awg-app/commit/e517ecb443eeed27db3f762d2c45cf4dc9500450))
-   **edition:** improve styles for SparqlEditor ([b80008e](https://github.com/webern-unibas-ch/awg-app/commit/b80008e90400a2f7188d8adfd2be47b721486653))
-   **edition:** improve styles for SparqlEditor ([2445d29](https://github.com/webern-unibas-ch/awg-app/commit/2445d2929cf1db76dbba7b0eae7dc1dd494d6a96))

### Code Refactoring

-   **edition:** replace deprecated NgbAccordion in SelectedResultsCmp ([ae313c3](https://github.com/webern-unibas-ch/awg-app/commit/ae313c3d5cae7683672d9788196628e26d8b758d))
-   **edition:** replace deprecated NgbAccordion in SparqlEditor ([93f043a](https://github.com/webern-unibas-ch/awg-app/commit/93f043a2f42f88f3bac575b807cf082c2faeb2dc))
-   **edition:** replace deprecated NgbAccordion in UnsupportedTypeCmp ([6b622d7](https://github.com/webern-unibas-ch/awg-app/commit/6b622d733affb5de0d03e7b4bdf4ff2968a56ba4))
-   **search:** replace deprecated NgbAccordion in LinkedObjectsCmp ([54fa23e](https://github.com/webern-unibas-ch/awg-app/commit/54fa23e11823ec53159625b3155e75128c6ab119))

### Documentation

-   **app:** add missing jsdocs ([349df13](https://github.com/webern-unibas-ch/awg-app/commit/349df13a4e44ff7889c5fc4e36889094de56a940))
-   **edition:** fix typo in ngbAccordion comments ([ba95e1b](https://github.com/webern-unibas-ch/awg-app/commit/ba95e1b0ae9ac66523bdb6ab91d4993786802e14))
-   **README:** add badge for node version ([1eefb4c](https://github.com/webern-unibas-ch/awg-app/commit/1eefb4c3ffce7d013b9f7632cbd30ba1a3ad2783))

### Tests

-   **app:** fix syntax of some more tests ([0e2ee55](https://github.com/webern-unibas-ch/awg-app/commit/0e2ee55788cf8c9b68994395291c6e352ea1ea82))
-   **core:** fix tests for interceptors after update to v17 ([e6125c2](https://github.com/webern-unibas-ch/awg-app/commit/e6125c2739756af02564c07bb8aff08a9b01e52c))
-   **edition:** fix tests after bootstrap upgrade ([c9c2b05](https://github.com/webern-unibas-ch/awg-app/commit/c9c2b05a4ffa91b9439b41d4d770c439596893b6))
-   **edition:** fix tests for components with new accordion ([f0e03a8](https://github.com/webern-unibas-ch/awg-app/commit/f0e03a8d727a84add45dbeff1198764586e1aa07))

### Continuous Integration

-   **app:** exclude Node 21 from ci workflow for now ([045b900](https://github.com/webern-unibas-ch/awg-app/commit/045b9006e901e8f740efed5d1cfea6a4671058bc))
-   **gh-actions:** add dependabot groups ([056d1a6](https://github.com/webern-unibas-ch/awg-app/commit/056d1a6e9dc59d10eda6254657096e670cda5d13))
-   **gh-actions:** add groups to dependabot config ([a557761](https://github.com/webern-unibas-ch/awg-app/commit/a557761868bacf431b14d7a92b8569203d9f65aa))
-   **gh-actions:** update dependabot.yml ([e95893f](https://github.com/webern-unibas-ch/awg-app/commit/e95893f7a6ba3c0c4b547848085438fa6b3c008b))
-   **gh-actions:** upgrade to node version 18.16 as default ([c9706dd](https://github.com/webern-unibas-ch/awg-app/commit/c9706dd1c56dff79efa67e862e20c6adccc9b1bb))
-   **github:** update .github/workflows/ci_optimize_svgs.yml ([4b01e73](https://github.com/webern-unibas-ch/awg-app/commit/4b01e738d64fb754870fca05e890473e26fd6eae))

### Build System

-   **app:** bump minimal supported node version to 18.13.0 ([894da1d](https://github.com/webern-unibas-ch/awg-app/commit/894da1d180707408befd0c22fca962e8489448e8))
-   **app:** drop support of node 16 ([cecfce3](https://github.com/webern-unibas-ch/awg-app/commit/cecfce30afcf8416fb5f70d5b67f6c45ab2a48ae))
-   **app:** increase budget ([6c0f70d](https://github.com/webern-unibas-ch/awg-app/commit/6c0f70d37b77eef07de469246101846f7a484ac8))
-   **app:** remove node 14 support ([25772de](https://github.com/webern-unibas-ch/awg-app/commit/25772de1d1308656939e40e427da7cf84e3fdb96))
-   **app:** switch to node 20 as default ([4d8a5a9](https://github.com/webern-unibas-ch/awg-app/commit/4d8a5a97bca2a4f84eaa7f70e497b0275c73a926))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) packages from 16.0.1 to 16.0.2 ([08743df](https://github.com/webern-unibas-ch/awg-app/commit/08743df542fb7d9a654984e5e07e611e6e183ca9))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) packages from 16.0.2 to 16.0.3 ([ccd8b48](https://github.com/webern-unibas-ch/awg-app/commit/ccd8b486f54f2a54625bc5667dbac1d1d8ba5624))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) packages from 16.0.3 to 16.1.0 ([bd987fe](https://github.com/webern-unibas-ch/awg-app/commit/bd987fe57510e8cb74c694693edfe4964bea16a9))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) packages from 16.1.0 to 16.1.1 ([463b496](https://github.com/webern-unibas-ch/awg-app/commit/463b4969930ff81b45481b30cf84000fa4e4bf02))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) related packages to v16 ([afe35e9](https://github.com/webern-unibas-ch/awg-app/commit/afe35e92d7daf7cdfb9a0330dd8f724223e14dff))
-   **deps-dev:** bump [@angular](https://github.com/angular) packages from 16.0.1 to 16.0.2 ([c009ec1](https://github.com/webern-unibas-ch/awg-app/commit/c009ec16c868c031b0dbfac6ff0174e630f3ef16))
-   **deps-dev:** bump [@angular](https://github.com/angular) packages from 16.0.2 to 16.0.3 ([057e39b](https://github.com/webern-unibas-ch/awg-app/commit/057e39b2ec1e8a1a27d793bfd40bd11fb6294d77))
-   **deps-dev:** bump [@angular](https://github.com/angular) packages from 16.0.3 to 16.0.4 ([2a0eb1a](https://github.com/webern-unibas-ch/awg-app/commit/2a0eb1a23569e9024c148670a82f4a22fbbc7a61))
-   **deps-dev:** bump [@angular](https://github.com/angular) packages from 16.0.4 to 16.0.5 ([cb4b327](https://github.com/webern-unibas-ch/awg-app/commit/cb4b32738cabd262cab8acb4acac4c6d245afb81))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.6.3 to 17.6.5 ([76fe873](https://github.com/webern-unibas-ch/awg-app/commit/76fe8730cbbfef827de2c887a7601bf88ce0fba7))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.6.5 to 17.6.6 ([d5c506a](https://github.com/webern-unibas-ch/awg-app/commit/d5c506abd03457870830f87a02aa61fa76f69061))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.6.6 to 17.6.7 ([c973f17](https://github.com/webern-unibas-ch/awg-app/commit/c973f17f8c2fccfa39ea630f70fc374bf7573dad))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.6.7 to 17.7.1 ([04fe427](https://github.com/webern-unibas-ch/awg-app/commit/04fe427b3843f92274ea912f0ff98dda5b9f9bd8))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.59.11 to 5.60.0 ([23b8976](https://github.com/webern-unibas-ch/awg-app/commit/23b89763ca58f347188ef6b6238875431c87d5ff))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.59.5 to 5.59.7 ([59d6c75](https://github.com/webern-unibas-ch/awg-app/commit/59d6c75c51a9222237cb20bf5a45fd46f81b2ae3))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.59.7 to 5.59.9 ([3a9cdac](https://github.com/webern-unibas-ch/awg-app/commit/3a9cdac415c55fd89310496f6c6fa539faffe8f0))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.59.9 to 5.59.11 ([b5268d7](https://github.com/webern-unibas-ch/awg-app/commit/b5268d7bd4ac00439430041c3cba63885ca1d73f))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.60.0 to 5.60.1 ([e22d014](https://github.com/webern-unibas-ch/awg-app/commit/e22d0143c3e4eb101a0624f58b388c0ee9143eb6))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.60.1 to 5.61.0 ([df293b0](https://github.com/webern-unibas-ch/awg-app/commit/df293b07ecd94f4c08828dc2b1078e7285ac0ff7))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.61.0 to 5.62.0 ([25a5166](https://github.com/webern-unibas-ch/awg-app/commit/25a5166736278527f4527727b99dad7bd20d151a))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.62.0 to 6.0.0 ([5fc762d](https://github.com/webern-unibas-ch/awg-app/commit/5fc762d4ff1227be37b56e862e4257e2581a26c6))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 6.0.0 to 6.1.0 ([03f3e42](https://github.com/webern-unibas-ch/awg-app/commit/03f3e42b13b46dad1356551b1650cbaf59e58d0a))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 6.1.0 to 6.2.0 ([61995d4](https://github.com/webern-unibas-ch/awg-app/commit/61995d4283f651d4a3e0be9636aa5a55f1712270))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 6.2.0 to 6.3.0 ([45946c3](https://github.com/webern-unibas-ch/awg-app/commit/45946c3fedd4b7a3bf7331a395f59ed64802d405))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 6.3.0 to 6.5.0 ([0f932fc](https://github.com/webern-unibas-ch/awg-app/commit/0f932fca7aece06f22a7fd2f79e8236675c37b0f))
-   **deps-dev:** bump @angular-devkit/build-angular ([ef5d9eb](https://github.com/webern-unibas-ch/awg-app/commit/ef5d9ebdcc898bc6a156eb1bfbb86e8b0e249f25))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.0.1 to 16.0.2 ([225e730](https://github.com/webern-unibas-ch/awg-app/commit/225e730a20d4a2956a3c1010d8e0e0b9ab0e3168))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.0.3 to 16.0.4 ([b242c62](https://github.com/webern-unibas-ch/awg-app/commit/b242c62fa0d4e6c38e8180cfa3d1f3cd2e95e522))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.0.4 to 16.0.5 ([2eda7ee](https://github.com/webern-unibas-ch/awg-app/commit/2eda7ee84dbe3aae40409f4c1ff9b664d3ec2ce5))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.0.5 to 16.1.0 ([24899e8](https://github.com/webern-unibas-ch/awg-app/commit/24899e8e78180118d7830a4c2c7c6f3cdb84ccc7))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.1.0 to 16.1.1 ([02ea9d4](https://github.com/webern-unibas-ch/awg-app/commit/02ea9d4a72f057871e68a907d40c1bb54cc3a530))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.1.1 to 16.1.2 ([2b3cf24](https://github.com/webern-unibas-ch/awg-app/commit/2b3cf24e2b5296494ebae0df6876105ad6f024e9))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.1.2 to 16.1.3 ([d03f4f2](https://github.com/webern-unibas-ch/awg-app/commit/d03f4f26a8306d86e5b7b5323bb7c5c39ae8cdfb))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.1.3 to 16.1.4 ([f42dfee](https://github.com/webern-unibas-ch/awg-app/commit/f42dfee795b15b68850977fadc2f70250af72cd0))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.1.4 to 16.1.5 ([be137c5](https://github.com/webern-unibas-ch/awg-app/commit/be137c5a2c542864fdc84f87a7170be9dd95bca5))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.1.5 to 16.1.6 ([271215f](https://github.com/webern-unibas-ch/awg-app/commit/271215f305055c864bff0f4459eb269641ab7efa))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.1.6 to 16.2.0 ([7cd1aa5](https://github.com/webern-unibas-ch/awg-app/commit/7cd1aa5040543f24bcbeb69c9c17561f8f02ac25))
-   **deps-dev:** bump @angular/{cli,build-angular} from 16.2.0 to 16.2.1 ([e207122](https://github.com/webern-unibas-ch/awg-app/commit/e2071224050103538aef54eaed1b0c490f4b28cd))
-   **deps-dev:** bump @angular/cli from 16.0.2 to 16.0.3 ([fe75429](https://github.com/webern-unibas-ch/awg-app/commit/fe75429a4fb1133b105e0a128dfe5946e49cc003))
-   **deps-dev:** bump @commitlint/cli from 17.7.1 to 17.7.2 ([814e2b7](https://github.com/webern-unibas-ch/awg-app/commit/814e2b7e2886bd4d6817ba975f8e6a6d557b18f5))
-   **deps-dev:** bump @commitlint/cli from 17.7.2 to 17.8.0 ([dd4419c](https://github.com/webern-unibas-ch/awg-app/commit/dd4419ce7c31d1c8d5ef0d4147fc8419781e4166))
-   **deps-dev:** bump @commitlint/cli from 17.8.0 to 18.0.0 ([657548a](https://github.com/webern-unibas-ch/awg-app/commit/657548afc72c31c977cda1915f5a5e378b48d44a))
-   **deps-dev:** bump @commitlint/cli from 18.0.0 to 18.1.0 ([e1c46c5](https://github.com/webern-unibas-ch/awg-app/commit/e1c46c5eb814451720bf0654cfab7be550731006))
-   **deps-dev:** bump @commitlint/cli from 18.1.0 to 18.2.0 ([facc223](https://github.com/webern-unibas-ch/awg-app/commit/facc2231a181faf73f4e584d60a253a7a0d7df48))
-   **deps-dev:** bump @commitlint/cli from 18.2.0 to 18.4.3 ([06e5ab1](https://github.com/webern-unibas-ch/awg-app/commit/06e5ab185fdee3dd55c929741b84e58e7ef40a06))
-   **deps-dev:** bump @commitlint/config-angular from 17.7.0 to 17.8.0 ([4c2257d](https://github.com/webern-unibas-ch/awg-app/commit/4c2257d1a4bcc514e08d3f359399c9dfb292794e))
-   **deps-dev:** bump @commitlint/config-angular from 17.8.0 to 18.0.0 ([4e0a95a](https://github.com/webern-unibas-ch/awg-app/commit/4e0a95a638882bbd6fa057bfd988265d4e12a459))
-   **deps-dev:** bump @commitlint/config-angular from 18.0.0 to 18.1.0 ([75af917](https://github.com/webern-unibas-ch/awg-app/commit/75af917d36d7e7ce669d72a994caebe5392d1e23))
-   **deps-dev:** bump @commitlint/config-angular from 18.1.0 to 18.4.3 ([7e59dcb](https://github.com/webern-unibas-ch/awg-app/commit/7e59dcbbd1d33efd46c71c72329e0188b4c2ec24))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.19 to 1.1.21 ([c1aaa33](https://github.com/webern-unibas-ch/awg-app/commit/c1aaa333e64dc49ee7c176d507d77a1099b9cc40))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.21 to 1.1.22 ([59bea28](https://github.com/webern-unibas-ch/awg-app/commit/59bea283004d219349e5994f1c5cd25d5fa321fd))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.22 to 1.1.23 ([edaf82b](https://github.com/webern-unibas-ch/awg-app/commit/edaf82badfe688acb7521c99a4aad55409683210))
-   **deps-dev:** bump @types/d3 from 7.4.0 to 7.4.1 ([238ff9b](https://github.com/webern-unibas-ch/awg-app/commit/238ff9be0edcd92fba9e0b3a009da05f16846b9d))
-   **deps-dev:** bump @types/d3 from 7.4.1 to 7.4.2 ([fe09435](https://github.com/webern-unibas-ch/awg-app/commit/fe09435ecf5ffd132c7849adc2888e83365c52dc))
-   **deps-dev:** bump @types/d3 from 7.4.2 to 7.4.3 ([7180d42](https://github.com/webern-unibas-ch/awg-app/commit/7180d424e3f35b1c0e66763ea902bbb18e4ca409))
-   **deps-dev:** bump @types/jasmine from 4.3.1 to 4.3.2 ([7afc871](https://github.com/webern-unibas-ch/awg-app/commit/7afc871c76d2fd24e223927ec618448f8f2d38e5))
-   **deps-dev:** bump @types/jasmine from 4.3.4 to 4.3.5 ([c83f06d](https://github.com/webern-unibas-ch/awg-app/commit/c83f06d1588ecd9d3844a95648ec12179bcfbba8))
-   **deps-dev:** bump @types/jasmine from 4.3.5 to 4.3.6 ([60900e7](https://github.com/webern-unibas-ch/awg-app/commit/60900e791f590fed4de0c1bc805e4b209e716a58))
-   **deps-dev:** bump @types/jasmine from 4.3.6 to 5.1.1 ([88e34ca](https://github.com/webern-unibas-ch/awg-app/commit/88e34ca676e82ae9dceaa6b152da3c0939c8b231))
-   **deps-dev:** bump @types/jasmine from 5.1.1 to 5.1.4 ([b937c34](https://github.com/webern-unibas-ch/awg-app/commit/b937c3449f00173bf4a1aa8ffae5cc6140cfacee))
-   **deps-dev:** bump @types/node from 16.18.27 to 18.16.8 ([802a60b](https://github.com/webern-unibas-ch/awg-app/commit/802a60b2ce5dfb32e48fa68a9ce6f88bfe0f6524))
-   **deps-dev:** bump @types/node from 18.16.14 to 18.16.16 ([5087558](https://github.com/webern-unibas-ch/awg-app/commit/5087558727533787b10f126b8dfe54ec50504148))
-   **deps-dev:** bump @types/node from 18.16.16 to 18.16.18 ([eaa9276](https://github.com/webern-unibas-ch/awg-app/commit/eaa927650d7c8d9981d4de94ca648773f8235c6e))
-   **deps-dev:** bump @types/node from 18.16.18 to 18.17.1 ([37345b3](https://github.com/webern-unibas-ch/awg-app/commit/37345b32af5e3f226afb5000b68aa17a9f9d448f))
-   **deps-dev:** bump @types/node from 18.16.8 to 18.16.14 ([83c0728](https://github.com/webern-unibas-ch/awg-app/commit/83c072808930f65a207b320c5650887a83184d9a))
-   **deps-dev:** bump @types/node from 18.17.1 to 18.17.4 ([e341179](https://github.com/webern-unibas-ch/awg-app/commit/e341179e5553888477691c352f0c793801d7c01e))
-   **deps-dev:** bump @types/node from 18.17.14 to 18.19.3 ([3f9b0a9](https://github.com/webern-unibas-ch/awg-app/commit/3f9b0a9513f32ff01996bc8bc872721bb0ea8ea1))
-   **deps-dev:** bump @types/node from 18.17.4 to 18.17.14 ([a629b06](https://github.com/webern-unibas-ch/awg-app/commit/a629b06b231511f82040b23c1e3c897364d89c65))
-   **deps-dev:** bump angular-cli-ghpages from 1.0.5 to 1.0.6 ([2d6a1d1](https://github.com/webern-unibas-ch/awg-app/commit/2d6a1d1bad242096d4351c95cc8a8e5f0839902c))
-   **deps-dev:** bump angular-cli-ghpages from 1.0.6 to 1.0.7 ([f7b7ade](https://github.com/webern-unibas-ch/awg-app/commit/f7b7aded1766675b1eddf6d7171ae6b32b10f94d))
-   **deps-dev:** bump conventional-recommended-bump from 6.1.0 to 7.0.1 ([7af4e57](https://github.com/webern-unibas-ch/awg-app/commit/7af4e574a24881178c309dde7bf0216658108864))
-   **deps-dev:** bump conventional-recommended-bump from 7.0.1 to 8.0.0 ([46fd461](https://github.com/webern-unibas-ch/awg-app/commit/46fd461f76089a67188b53542e2474a1822b4c17))
-   **deps-dev:** bump conventional-recommended-bump from 8.0.0 to 9.0.0 ([c987fb7](https://github.com/webern-unibas-ch/awg-app/commit/c987fb70cac4d035cd90a5dd508f6d7c668b87f2))
-   **deps-dev:** bump eslint from 8.40.0 to 8.41.0 ([8028df4](https://github.com/webern-unibas-ch/awg-app/commit/8028df4d78859df03e47992cca714f98a71265a0))
-   **deps-dev:** bump eslint from 8.41.0 to 8.42.0 ([d12ff0c](https://github.com/webern-unibas-ch/awg-app/commit/d12ff0ca836f12b35031a53ea20b9420110ff912))
-   **deps-dev:** bump eslint from 8.42.0 to 8.43.0 ([b96582e](https://github.com/webern-unibas-ch/awg-app/commit/b96582e3349322897a64c59921f00051a7049d00))
-   **deps-dev:** bump eslint from 8.43.0 to 8.44.0 ([032cd02](https://github.com/webern-unibas-ch/awg-app/commit/032cd025cd50d1cb9aa37c1c652bd85225066a13))
-   **deps-dev:** bump eslint from 8.44.0 to 8.45.0 ([47bacf3](https://github.com/webern-unibas-ch/awg-app/commit/47bacf3814fa1a2aa977334f7ad0de9caf139803))
-   **deps-dev:** bump eslint from 8.45.0 to 8.46.0 ([aa63714](https://github.com/webern-unibas-ch/awg-app/commit/aa63714eb8d94a94bb4a740aa0a68a1b3bdb5559))
-   **deps-dev:** bump eslint from 8.46.0 to 8.48.0 ([7f3cad2](https://github.com/webern-unibas-ch/awg-app/commit/7f3cad2ffa533fc454bc473931b5218079d432ba))
-   **deps-dev:** bump eslint from 8.48.0 to 8.49.0 ([82f7518](https://github.com/webern-unibas-ch/awg-app/commit/82f75182702dbfaf3e59f25063a6bce556868ce4))
-   **deps-dev:** bump eslint from 8.49.0 to 8.50.0 ([3622198](https://github.com/webern-unibas-ch/awg-app/commit/3622198b323c525457c650ab2fa3b3e6f4b3bb50))
-   **deps-dev:** bump eslint from 8.50.0 to 8.51.0 ([3c6ff6f](https://github.com/webern-unibas-ch/awg-app/commit/3c6ff6f7762c8b5396bcbcb50f4888e1cdd294ee))
-   **deps-dev:** bump eslint from 8.51.0 to 8.52.0 ([47e7fa8](https://github.com/webern-unibas-ch/awg-app/commit/47e7fa8cd96a65b03b3c0e919bcb70b4566bd34c))
-   **deps-dev:** bump eslint from 8.52.0 to 8.53.0 ([6778689](https://github.com/webern-unibas-ch/awg-app/commit/6778689900f4cc44d36ddb06b04b647212aac721))
-   **deps-dev:** bump eslint from 8.53.0 to 8.54.0 ([2360026](https://github.com/webern-unibas-ch/awg-app/commit/2360026f64f0799eb3fd64e09f4345079ca4939d))
-   **deps-dev:** bump eslint from 8.54.0 to 8.55.0 ([0550b57](https://github.com/webern-unibas-ch/awg-app/commit/0550b57e0d6ab1ce2bf44d540212edad3d3f79c7))
-   **deps-dev:** bump eslint from 8.55.0 to 8.56.0 ([127e6ec](https://github.com/webern-unibas-ch/awg-app/commit/127e6ec06a55a1673dd1c355cbf2128615f4c5a3))
-   **deps-dev:** bump eslint-config-prettier from 8.8.0 to 8.9.0 ([626ba65](https://github.com/webern-unibas-ch/awg-app/commit/626ba6547229b124650ebdfc5e279d3c1d898cd5))
-   **deps-dev:** bump eslint-config-prettier from 8.9.0 to 9.0.0 ([9c49399](https://github.com/webern-unibas-ch/awg-app/commit/9c493991db786ca8a2f2e3b106660e494f9e90aa))
-   **deps-dev:** bump eslint-config-prettier from 9.0.0 to 9.1.0 ([165f054](https://github.com/webern-unibas-ch/awg-app/commit/165f05426e30a96154b6786a4368e450dbc54996))
-   **deps-dev:** bump eslint-plugin-deprecation from 1.4.1 to 1.5.0 ([5024069](https://github.com/webern-unibas-ch/awg-app/commit/502406907b254ca76d8cc5fea78fe86fc049c386))
-   **deps-dev:** bump eslint-plugin-deprecation from 1.5.0 to 2.0.0 ([536833a](https://github.com/webern-unibas-ch/awg-app/commit/536833a43aba898a761b95ad7c92c6e3fae2bdcf))
-   **deps-dev:** bump eslint-plugin-import from 2.27.5 to 2.28.0 ([f36d17d](https://github.com/webern-unibas-ch/awg-app/commit/f36d17d506edb6c815089c220a62351fa4067e17))
-   **deps-dev:** bump eslint-plugin-import from 2.28.0 to 2.28.1 ([839b7b0](https://github.com/webern-unibas-ch/awg-app/commit/839b7b05fdd76e7e87068ebccce9301869bb1378))
-   **deps-dev:** bump eslint-plugin-import from 2.28.1 to 2.29.0 ([3dbde8b](https://github.com/webern-unibas-ch/awg-app/commit/3dbde8b6f15cf64be68c1a7bd448c3706a56442c))
-   **deps-dev:** bump eslint-plugin-import from 2.29.0 to 2.29.1 ([7495eb7](https://github.com/webern-unibas-ch/awg-app/commit/7495eb7127a337394c40207331510b394b40f668))
-   **deps-dev:** bump eslint-plugin-jsdoc from 43.0.7 to 44.2.3 ([b66d3fc](https://github.com/webern-unibas-ch/awg-app/commit/b66d3fc49baaa60cf0bf252c2229feb44e535c5f))
-   **deps-dev:** bump eslint-plugin-jsdoc from 44.2.3 to 44.2.4 ([3facb82](https://github.com/webern-unibas-ch/awg-app/commit/3facb82e8d4b781e34d6290b36cb5fad02266829))
-   **deps-dev:** bump eslint-plugin-jsdoc from 44.2.4 to 44.2.7 ([1da63a2](https://github.com/webern-unibas-ch/awg-app/commit/1da63a2b7b7212f47a3c5ac19ecddb747500b4dc))
-   **deps-dev:** bump eslint-plugin-jsdoc from 44.2.7 to 46.2.4 ([62a8a10](https://github.com/webern-unibas-ch/awg-app/commit/62a8a10041ec0525dabca1afea2fb96d217ceb6f))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.2.4 to 46.2.6 ([1ad71f0](https://github.com/webern-unibas-ch/awg-app/commit/1ad71f0a4575f5be7108ac2a12a467b5b895b359))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.2.6 to 46.4.2 ([9fa34a5](https://github.com/webern-unibas-ch/awg-app/commit/9fa34a55bfe4d1c4f34a849add24293d0ddb1c83))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.4.2 to 46.4.3 ([4d93ac4](https://github.com/webern-unibas-ch/awg-app/commit/4d93ac4e59803ff9b77f80f4f35d162ba09898e1))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.4.3 to 46.4.4 ([2f398c7](https://github.com/webern-unibas-ch/awg-app/commit/2f398c74b74934dd756c2e37d890e3af35ae113a))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.4.4 to 46.4.5 ([31475bf](https://github.com/webern-unibas-ch/awg-app/commit/31475bfa2153b77ae55fd5fdc351c064fcee9e1b))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.4.5 to 46.4.6 ([4e28491](https://github.com/webern-unibas-ch/awg-app/commit/4e2849155474cef0c6dd28e0b46401e6019fc820))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.4.6 to 46.5.1 ([a430c6e](https://github.com/webern-unibas-ch/awg-app/commit/a430c6e5f8b7ba41e1d46c2d35ee4729a0305aca))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.5.1 to 46.8.1 ([f63eaa5](https://github.com/webern-unibas-ch/awg-app/commit/f63eaa5e29047408fedbf18a07894b40ddc3a6ac))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.8.1 to 46.8.2 ([2126ce3](https://github.com/webern-unibas-ch/awg-app/commit/2126ce3302eb21b764a3db638378ee9dfec2b82f))
-   **deps-dev:** bump eslint-plugin-jsdoc from 46.8.2 to 46.9.1 ([24b7ef8](https://github.com/webern-unibas-ch/awg-app/commit/24b7ef8cba373a770f3eec40e22de2b57d187385))
-   **deps-dev:** bump eslint-plugin-prettier from 4.2.1 to 5.0.0 ([9fb65f1](https://github.com/webern-unibas-ch/awg-app/commit/9fb65f1e074fc302d3e3ae3324d47321a8d2527e))
-   **deps-dev:** bump eslint-plugin-prettier from 5.0.0 to 5.0.1 ([e009c34](https://github.com/webern-unibas-ch/awg-app/commit/e009c344fdcc3a4da2db7035438adb0fa1fdbb2b))
-   **deps-dev:** bump jasmine-core from 4.6.0 to 5.0.1 ([63458f0](https://github.com/webern-unibas-ch/awg-app/commit/63458f0fd082239a72e333be36d496e1fb4b3c58))
-   **deps-dev:** bump jasmine-core from 5.0.1 to 5.1.0 ([18e0542](https://github.com/webern-unibas-ch/awg-app/commit/18e05424a39b3c59ff1fe6057edfe223476cc09b))
-   **deps-dev:** bump jasmine-core from 5.1.0 to 5.1.1 ([25ee394](https://github.com/webern-unibas-ch/awg-app/commit/25ee394aa5596d48a367db77c990556c0fd7c6ef))
-   **deps-dev:** bump karma-coverage from 2.2.0 to 2.2.1 ([ae6590f](https://github.com/webern-unibas-ch/awg-app/commit/ae6590f31678be3167dd68a670b983232621c84f))
-   **deps-dev:** bump karma-jasmine-html-reporter from 2.0.0 to 2.1.0 ([3efab3e](https://github.com/webern-unibas-ch/awg-app/commit/3efab3eaf62d00d64180b92336ba574a39f6b61b))
-   **deps-dev:** bump lint-staged from 13.2.2 to 13.2.3 ([25b0942](https://github.com/webern-unibas-ch/awg-app/commit/25b09428f7f8d7ec5b1c2bf2bbe00f222d0a9196))
-   **deps-dev:** bump lint-staged from 13.2.3 to 14.0.1 ([098e5aa](https://github.com/webern-unibas-ch/awg-app/commit/098e5aa7f7cf2d73d5b737f47c6560d7353528ed))
-   **deps-dev:** bump lint-staged from 14.0.1 to 15.0.2 ([3a759a6](https://github.com/webern-unibas-ch/awg-app/commit/3a759a60d11fd0d9956b3ddd967a44ef96dc5c6d))
-   **deps-dev:** bump lint-staged from 15.0.2 to 15.1.0 ([0573820](https://github.com/webern-unibas-ch/awg-app/commit/05738209019a77370b8ad3c01f55d687b337db1c))
-   **deps-dev:** bump lint-staged from 15.1.0 to 15.2.0 ([7c441ad](https://github.com/webern-unibas-ch/awg-app/commit/7c441ad214810bf2f255ecbb511022eca38b89f5))
-   **deps-dev:** bump prettier from 2.8.8 to 3.0.0 ([4dd14ef](https://github.com/webern-unibas-ch/awg-app/commit/4dd14ef30dcc841adc8666efcf2cda754fbb2cd3))
-   **deps-dev:** bump prettier from 3.0.0 to 3.0.1 ([63824b6](https://github.com/webern-unibas-ch/awg-app/commit/63824b62d128ff652a406a276e2af1aebe0db8a7))
-   **deps-dev:** bump prettier from 3.0.1 to 3.0.3 ([8367ab3](https://github.com/webern-unibas-ch/awg-app/commit/8367ab349fb69ebd827945cb30a4f28eeb899c9f))
-   **deps-dev:** bump prettier from 3.0.3 to 3.1.1 ([de60a81](https://github.com/webern-unibas-ch/awg-app/commit/de60a81054a4d6d17065fc13c2e395aa89a4c22a))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([305602d](https://github.com/webern-unibas-ch/awg-app/commit/305602d52137ee7b4ec07f1739cb8519c67d3696))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([325c694](https://github.com/webern-unibas-ch/awg-app/commit/325c694312cb8c09dd76d3b56981d8032e4df556))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([9353ba7](https://github.com/webern-unibas-ch/awg-app/commit/9353ba7ab8704532aa14a410f35f866339739ce0))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([01a7918](https://github.com/webern-unibas-ch/awg-app/commit/01a79184ceec5af5b93cb1a114d7b51533fcf9c1))
-   **deps-dev:** bump the angular-cli-devkit group with 2 updates ([91e9326](https://github.com/webern-unibas-ch/awg-app/commit/91e9326e5a6b8830051b81696374ee4f3ab099e1))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([c965190](https://github.com/webern-unibas-ch/awg-app/commit/c9651900c8fb77c462d2a3f57b17ef6ebf392771))
-   **deps-dev:** bump the angular-eslint group with 5 updates ([2b862d6](https://github.com/webern-unibas-ch/awg-app/commit/2b862d6d05aec3c85b390136e9462ccdc8a6958a))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([4aac2d2](https://github.com/webern-unibas-ch/awg-app/commit/4aac2d29e886b41357ca0fba57c2b34262fe86ac))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([3fc34b6](https://github.com/webern-unibas-ch/awg-app/commit/3fc34b60f3c6b90b1632ecff6313604f52a4e491))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([c732cb1](https://github.com/webern-unibas-ch/awg-app/commit/c732cb13d889320f9f097d08fa4bc85597d4fc34))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([08ea678](https://github.com/webern-unibas-ch/awg-app/commit/08ea6783300b91e112b7cc2c066c2159fe87edad))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([a5f1c5b](https://github.com/webern-unibas-ch/awg-app/commit/a5f1c5b9afe3b49e62faf9f72b0ed5b7f48e2d2f))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([965cf0f](https://github.com/webern-unibas-ch/awg-app/commit/965cf0f145cfd910c40022640a21058f0e36903f))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([51b5450](https://github.com/webern-unibas-ch/awg-app/commit/51b5450ab986d5c87ca6453f9c62f4ec801637b6))
-   **deps-dev:** bump the typescript-eslint group with 2 updates ([4ecd004](https://github.com/webern-unibas-ch/awg-app/commit/4ecd0048c443c62abd90d81d2e3ac2f1d4d638f7))
-   **deps-dev:** bump typescript from 4.9.5 to 5.0.4 ([52c5281](https://github.com/webern-unibas-ch/awg-app/commit/52c52815c49a54db20be803f3262b6e85bb57460))
-   **deps-dev:** bump webpack-bundle-analyzer from 4.8.0 to 4.9.0 ([f6d3523](https://github.com/webern-unibas-ch/awg-app/commit/f6d352366512c57b913f457c60de30154d4062b5))
-   **deps-dev:** bump webpack-bundle-analyzer from 4.9.0 to 4.9.1 ([78f3625](https://github.com/webern-unibas-ch/awg-app/commit/78f3625a80ac8c07dfc41fb57318fe1ba6cd1a54))
-   **deps-dev:** bump webpack-bundle-analyzer from 4.9.1 to 4.10.1 ([6cca129](https://github.com/webern-unibas-ch/awg-app/commit/6cca129a0c07d897acb197566b8cab166550284d))
-   **deps-dev:** clean up yarn.lock file after updates ([c0a8f55](https://github.com/webern-unibas-ch/awg-app/commit/c0a8f559bda37471f4838c028eaf8b3b162b82dd))
-   **deps:** add stream ([53510dc](https://github.com/webern-unibas-ch/awg-app/commit/53510dcd1e3a349ee6381337cb0be5f6e2f257ac))
-   **deps:** bump [@angular](https://github.com/angular) packages from 16.0.5 to 16.1.0 ([28cabcc](https://github.com/webern-unibas-ch/awg-app/commit/28cabcc4fdf003f450e35a0b97815f3093125963))
-   **deps:** bump [@angular](https://github.com/angular) packages from 16.1.0 to 16.1.1 ([f0452a0](https://github.com/webern-unibas-ch/awg-app/commit/f0452a0b7389618a6d100fc345f57d839f8380b5))
-   **deps:** bump [@angular](https://github.com/angular) packages from 16.1.1 to 16.1.2 ([ead3571](https://github.com/webern-unibas-ch/awg-app/commit/ead3571b9e8bb9d5b13fad4ceb0dd52f006c086f))
-   **deps:** bump [@angular](https://github.com/angular) packages from 16.1.2 to 16.1.3 ([e014d9d](https://github.com/webern-unibas-ch/awg-app/commit/e014d9d9c2e41577e2ba3c1811aed371ea8515b6))
-   **deps:** bump [@angular](https://github.com/angular) packages from 16.1.3 to 16.1.4 ([6063d2c](https://github.com/webern-unibas-ch/awg-app/commit/6063d2c4a1a0a9e3a5e9b1a5ab3d354ae9582740))
-   **deps:** bump [@angular](https://github.com/angular) packages from 16.1.4 to 16.1.5 ([62ce61c](https://github.com/webern-unibas-ch/awg-app/commit/62ce61cdaae2b6453a9b28540bf7063b3c877201))
-   **deps:** bump [@angular](https://github.com/angular) packages from 16.1.5 to 16.1.6 ([4cf70bf](https://github.com/webern-unibas-ch/awg-app/commit/4cf70bfe9f5b0c0650b891b061626ba8e0b9d150))
-   **deps:** bump [@angular](https://github.com/angular) packages from 16.1.6 to 16.1.7 ([eb933cf](https://github.com/webern-unibas-ch/awg-app/commit/eb933cf8f57f6163ce8dc4b46e20d861d90cc6e2))
-   **deps:** bump [@angular](https://github.com/angular) packages from 16.1.7 to 16.2.0 ([83f6b33](https://github.com/webern-unibas-ch/awg-app/commit/83f6b339fbdd0ec2dbd2bd37f7c2ad8f4f6f4bf6))
-   **deps:** bump [@angular](https://github.com/angular) packages from 16.2.0 to 16.2.3 ([2c35f47](https://github.com/webern-unibas-ch/awg-app/commit/2c35f47ff144557be27ce71218ce7925b67ae978))
-   **deps:** bump [@fortawesome](https://github.com/fortawesome) packages from 6.4.0 to 6.4.2 ([b4a30a4](https://github.com/webern-unibas-ch/awg-app/commit/b4a30a4c0ac117d579ac6aaa0fdc2041481456fd))
-   **deps:** bump [@fortawesome](https://github.com/fortawesome) packages from 6.4.2 to 6.5.1 ([62a8c47](https://github.com/webern-unibas-ch/awg-app/commit/62a8c470e3f3b337afe26d540803304c905b268d))
-   **deps:** bump @babel/traverse from 7.22.5 to 7.23.2 ([648d789](https://github.com/webern-unibas-ch/awg-app/commit/648d789485f72cede80f24c98280e7ffcd0ebee9))
-   **deps:** bump @codemirror/legacy-modes from 6.3.2 to 6.3.3 ([cd9f3ae](https://github.com/webern-unibas-ch/awg-app/commit/cd9f3ae15342d6255c79e83fe909f04668bfb3a3))
-   **deps:** bump @fortawesome/angular-fontawesome from 0.12.1 to 0.13.0 ([788f9a7](https://github.com/webern-unibas-ch/awg-app/commit/788f9a7831e7f71e71d3177a15206b9093d416a2))
-   **deps:** bump @fortawesome/angular-fontawesome from 0.13.0 to 0.14.0 ([88b1f0a](https://github.com/webern-unibas-ch/awg-app/commit/88b1f0a56f5d1ffc478991d8d7700bc4dfca225c))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 14.1.1 to 15.0.1 ([21d55a3](https://github.com/webern-unibas-ch/awg-app/commit/21d55a3d7120b9583799e1be92275ffdcacd7f12))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 15.0.1 to 15.1.0 ([b2aafee](https://github.com/webern-unibas-ch/awg-app/commit/b2aafeef71a390f5f4267636a8ca4b5ec15c4f5b))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 15.1.0 to 15.1.1 ([478b46c](https://github.com/webern-unibas-ch/awg-app/commit/478b46c3959f768893ef8cf52feafc683caa115e))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 15.1.1 to 15.1.2 ([cf5365e](https://github.com/webern-unibas-ch/awg-app/commit/cf5365e9e2e2e7c05ce927c45a7a8193f6b49400))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 15.1.2 to 16.0.0 ([f99f0ab](https://github.com/webern-unibas-ch/awg-app/commit/f99f0abf5b93795af09fffea3c480e9fa817f5d2))
-   **deps:** bump @popperjs/core from 2.11.7 to 2.11.8 ([9a48a76](https://github.com/webern-unibas-ch/awg-app/commit/9a48a7673a9b118993bafe5d2d639ca795c1ea53))
-   **deps:** bump actions/checkout from 3.5.2 to 3.5.3 ([2823b2b](https://github.com/webern-unibas-ch/awg-app/commit/2823b2bd520742e0ce176785daec753d42cf2961))
-   **deps:** bump actions/checkout from 3.5.3 to 3.6.0 ([2fb4e30](https://github.com/webern-unibas-ch/awg-app/commit/2fb4e3079451390e5f176f54c5cd8933d70eb861))
-   **deps:** bump actions/checkout from 3.6.0 to 4.0.0 ([71e3666](https://github.com/webern-unibas-ch/awg-app/commit/71e3666c018a68989131eb95f698afe2cb5d8bd0))
-   **deps:** bump actions/checkout from 4.0.0 to 4.1.0 ([7b45a44](https://github.com/webern-unibas-ch/awg-app/commit/7b45a44e8d6f076117eaf21cb61559f474318236))
-   **deps:** bump actions/checkout from 4.1.0 to 4.1.1 ([a982643](https://github.com/webern-unibas-ch/awg-app/commit/a982643e53d949d8afd66a8aa42656a16be3c728))
-   **deps:** bump actions/setup-node from 3.6.0 to 3.7.0 ([5086b81](https://github.com/webern-unibas-ch/awg-app/commit/5086b815102a86a3c871c0f213b4fc75449126ed))
-   **deps:** bump actions/setup-node from 3.7.0 to 3.8.1 ([c394401](https://github.com/webern-unibas-ch/awg-app/commit/c394401530efb85ab6ea27f33f665bb873c3490a))
-   **deps:** bump actions/setup-node from 3.8.1 to 3.8.2 ([f3c8aa1](https://github.com/webern-unibas-ch/awg-app/commit/f3c8aa19e1543281a8f9b1629c6ce07a4222abe7))
-   **deps:** bump actions/setup-node from 3.8.2 to 4.0.0 ([faab6b0](https://github.com/webern-unibas-ch/awg-app/commit/faab6b0b8bd2600cda0bfad5d070fc44dc26f30b))
-   **deps:** bump actions/setup-node from 4.0.0 to 4.0.1 ([7bf0612](https://github.com/webern-unibas-ch/awg-app/commit/7bf061218611e778064b5e0a0a3501da5a087b39))
-   **deps:** bump axios from 1.4.0 to 1.6.2 ([264d314](https://github.com/webern-unibas-ch/awg-app/commit/264d314d3c729391050069c81462083d215512bb))
-   **deps:** bump bootstrap from 5.3.0 to 5.3.1 ([0b30b61](https://github.com/webern-unibas-ch/awg-app/commit/0b30b61e0bbf664cb447d8e3190d7a81466dbfea))
-   **deps:** bump bootstrap from 5.3.1 to 5.3.2 ([a192202](https://github.com/webern-unibas-ch/awg-app/commit/a192202f16d83dedc3472551cba6d7a7434717b5))
-   **deps:** bump codecov/codecov-action from 3.1.3 to 3.1.4 ([e99d79e](https://github.com/webern-unibas-ch/awg-app/commit/e99d79e66959141449fd9559c196a30b3c8f4e4e))
-   **deps:** bump crypto-js from 4.1.1 to 4.2.0 ([dfb4a66](https://github.com/webern-unibas-ch/awg-app/commit/dfb4a6652f19f0a9ed48157f0599c07734d6900d))
-   **deps:** bump ericcornelissen/svgo-action from 3.1.4 to 4.0.0 ([fff90c0](https://github.com/webern-unibas-ch/awg-app/commit/fff90c041caf958b4276f8fbbe7d020b2de34dac))
-   **deps:** bump ericcornelissen/svgo-action from 4.0.0 to 4.0.4 ([73a8c2f](https://github.com/webern-unibas-ch/awg-app/commit/73a8c2fd4453f42ee73ddf7e9e4d2b03d2a88015))
-   **deps:** bump github/codeql-action from 2.3.3 to 2.3.5 ([d2d4bca](https://github.com/webern-unibas-ch/awg-app/commit/d2d4bcaf2ea50fb478ac77c37f3554e1c9687e66))
-   **deps:** bump github/codeql-action from 2.3.5 to 2.3.6 ([1bcecb2](https://github.com/webern-unibas-ch/awg-app/commit/1bcecb28dd65949b4d9125a1afabea53a013b482))
-   **deps:** bump github/codeql-action from 2.3.6 to 2.13.4 ([a36bff3](https://github.com/webern-unibas-ch/awg-app/commit/a36bff34e14fec57e77aa1433e51e9a61e331729))
-   **deps:** bump n3 from 1.16.4 to 1.17.0 ([e7ec5b1](https://github.com/webern-unibas-ch/awg-app/commit/e7ec5b191604c58f3a6d2db514134ce4180ddac2))
-   **deps:** bump n3 from 1.17.0 to 1.17.1 ([2c38c1b](https://github.com/webern-unibas-ch/awg-app/commit/2c38c1b5707b134aeab1166f09a1a8a2bc9ffd94))
-   **deps:** bump n3 from 1.17.1 to 1.17.2 ([83be72a](https://github.com/webern-unibas-ch/awg-app/commit/83be72a61b19977509b9c2de4d9dd5342bc8234c))
-   **deps:** bump semver from 5.7.1 to 5.7.2 ([57a04f8](https://github.com/webern-unibas-ch/awg-app/commit/57a04f8d4cc7259bf60998b88a8ba9d4dd610b01))
-   **deps:** bump socket.io-parser from 4.2.2 to 4.2.3 ([#1002](https://github.com/webern-unibas-ch/awg-app/issues/1002)) ([395466c](https://github.com/webern-unibas-ch/awg-app/commit/395466ca196d40b47175235d5cafbbb2fcf7dfd4))
-   **deps:** bump stefanzweifel/git-auto-commit-action ([38dccda](https://github.com/webern-unibas-ch/awg-app/commit/38dccda4bdaf4206419428a16eb99da8a76324b6))
-   **deps:** bump the angular group with 11 updates ([eefb937](https://github.com/webern-unibas-ch/awg-app/commit/eefb9371c874c8d87485515aea1aa5a2d45c2434))
-   **deps:** bump the angular group with 11 updates ([47fbfee](https://github.com/webern-unibas-ch/awg-app/commit/47fbfee2cb3ffe492cfe2a04bf65299da3d802ce))
-   **deps:** bump the angular group with 11 updates ([21694a6](https://github.com/webern-unibas-ch/awg-app/commit/21694a6c246e443013f28d480bfdb8fd8df04432))
-   **deps:** bump the angular group with 11 updates ([19933cc](https://github.com/webern-unibas-ch/awg-app/commit/19933ccdbda729efe62908d7ef13aa044603d962))
-   **deps:** bump the angular group with 11 updates ([e8b46ea](https://github.com/webern-unibas-ch/awg-app/commit/e8b46eae190c381069a9b9f6c5491a40e648eb4b))
-   **deps:** bump the angular group with 11 updates ([dd0c09e](https://github.com/webern-unibas-ch/awg-app/commit/dd0c09ecdd1441de3c6066815d7132186598bacb))
-   **deps:** bump tslib from 2.5.0 to 2.5.2 ([9bec3b4](https://github.com/webern-unibas-ch/awg-app/commit/9bec3b4acd81ce3b6ab28d0a65c2475d7efaadae))
-   **deps:** bump tslib from 2.5.2 to 2.5.3 ([9295fb9](https://github.com/webern-unibas-ch/awg-app/commit/9295fb9f4f634ec61332a6276deab38934f1c8f6))
-   **deps:** bump tslib from 2.5.3 to 2.6.0 ([b59e2ed](https://github.com/webern-unibas-ch/awg-app/commit/b59e2edb79f36c086d3e3ce51ee95aa05acd6134))
-   **deps:** bump tslib from 2.6.0 to 2.6.1 ([af12637](https://github.com/webern-unibas-ch/awg-app/commit/af12637cffa4d357bbe5ce3be7c72554a5ac069b))
-   **deps:** bump tslib from 2.6.1 to 2.6.2 ([4fd7eed](https://github.com/webern-unibas-ch/awg-app/commit/4fd7eed54f5177409feaeb22d469c40af3b20725))
-   **deps:** bump undici from 5.22.1 to 5.26.3 ([e2f8ac1](https://github.com/webern-unibas-ch/awg-app/commit/e2f8ac14d32a3d39f2b49d3bc694390982016116))
-   **deps:** bump word-wrap from 1.2.3 to 1.2.4 ([e9f7a24](https://github.com/webern-unibas-ch/awg-app/commit/e9f7a244cfb9f70e1e764759d445136ee7ba4f3d))
-   **deps:** bump zone.js from 0.13.0 to 0.13.1 ([fa03983](https://github.com/webern-unibas-ch/awg-app/commit/fa039834ef802b24b68224f50896a93817c43dcc))
-   **deps:** bump zone.js from 0.13.1 to 0.13.3 ([1dbb783](https://github.com/webern-unibas-ch/awg-app/commit/1dbb783f6f15450a78112cba20788d6a022733d5))
-   **deps:** fix bootstrap imports ([d7b5eb2](https://github.com/webern-unibas-ch/awg-app/commit/d7b5eb23bcb8f006f0a19f7a3b9b19d52f791e58))
-   **deps:** rebuild yarn.lock after updates ([b976fae](https://github.com/webern-unibas-ch/awg-app/commit/b976fae3ca8f655de34e4ce312a7300d9d13e41f))
-   **deps:** update [@angular](https://github.com/angular) to version 16 ([cc121b4](https://github.com/webern-unibas-ch/awg-app/commit/cc121b4f33d99e9fe86f58ebb876b46c96118eb9))
-   **deps:** update [@angular](https://github.com/angular) to version 17 ([b94b035](https://github.com/webern-unibas-ch/awg-app/commit/b94b0354621f2ccdbd60232a13949ae7f12c981d))

## [0.11.0](https://github.com/webern-unibas-ch/awg-app/compare/v0.10.2...v0.11.0) (2023-05-09)

### Features

-   **assets:** add M212 Textfassung 1 ([1bdcece](https://github.com/webern-unibas-ch/awg-app/commit/1bdcece2a8c7e035c3a5e9fd73d0e6b9e8d9ddce); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add op27 row table ([4e42ac9](https://github.com/webern-unibas-ch/awg-app/commit/4e42ac921eca18bf2a23af87b7db322b799c05f3); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add row table for op22 ([07dbf6d](https://github.com/webern-unibas-ch/awg-app/commit/07dbf6dab33fabcfa03e7fdd603ca0a6c79d3160); thanks to [@masthom](https://github.com/masthom))
-   **core:** add translation snippet ([2b55e63](https://github.com/webern-unibas-ch/awg-app/commit/2b55e63ea61d40c4138bc9de52399bd40c1daf94))
-   **edition:** add license hint to svg sheet viewer ([f662b12](https://github.com/webern-unibas-ch/awg-app/commit/f662b12ea00bb5e5b4b3c9e2bdfbe8b4250764b6))
-   **edition:** add text sources to sourceList ([3381e7e](https://github.com/webern-unibas-ch/awg-app/commit/3381e7ecbb79ed3855f6c8d4190fa33a006c5736)), closes [#909](https://github.com/webern-unibas-ch/awg-app/issues/909)
-   **edition:** allow sources to be linked from textcritics ([1f2fdae](https://github.com/webern-unibas-ch/awg-app/commit/1f2fdae47ae9f1072ab9f557b67f32af05a9318a))

### Bug Fixes

-   **assets:** activate textcritics for M 317 TF1 ([3303348](https://github.com/webern-unibas-ch/awg-app/commit/33033480d0c506d9c61d98c8d2ce804a916c967f))
-   **assets:** activate Textfassung 1 for m34 ([afc1dd4](https://github.com/webern-unibas-ch/awg-app/commit/afc1dd454ddaa55bfe32ab25448dd24ed1e7b0bd))
-   **assets:** add links to M 317 sketches in source description ([7ae2fe4](https://github.com/webern-unibas-ch/awg-app/commit/7ae2fe4c7deb806eb003c6fbb64422f9160f01ff))
-   **assets:** add missing tkk class in M317 TF1 ([d528919](https://github.com/webern-unibas-ch/awg-app/commit/d5289192d761d069839c2a6c932250da6973f24e))
-   **assets:** adjust svg for M 317 TF1 ([808eb30](https://github.com/webern-unibas-ch/awg-app/commit/808eb30ab1334afa33cabccb6d5a2926af950962); thanks to [@masthom](https://github.com/masthom))
-   **assets:** fix and adjust data for M 212 Textfassung 1 ([d7f4f70](https://github.com/webern-unibas-ch/awg-app/commit/d7f4f70d01fba185d6ffa5d182db000683cb26ae)), closes [#909](https://github.com/webern-unibas-ch/awg-app/issues/909)
-   **assets:** fix duplicated svg ids in op22 ([f8b35d6](https://github.com/webern-unibas-ch/awg-app/commit/f8b35d6bc1b2f577f2dc5206e3bc04fe196d37c2))
-   **assets:** fix duplicated svg ids in op27 ([22d5e5c](https://github.com/webern-unibas-ch/awg-app/commit/22d5e5c02b90697f850a60652d189f8ae0d60900))
-   **assets:** fix files and names for op27 row table ([2da4a31](https://github.com/webern-unibas-ch/awg-app/commit/2da4a316ce0639e2723ca41065de590e3d293a76))
-   **assets:** fix SPARQL query for paratexts ([7bc7a8e](https://github.com/webern-unibas-ch/awg-app/commit/7bc7a8e4f715cfeabfcc0d9d66e8ed3d57cbfa93))
-   **assets:** fix TkK findings in op27 row table ([7fb84fd](https://github.com/webern-unibas-ch/awg-app/commit/7fb84fda7e2a387b98029a4171e7818d8a741735); thanks to [@masthom](https://github.com/masthom))
-   **assets:** fix typo in sic comment for M 212 ([95540d1](https://github.com/webern-unibas-ch/awg-app/commit/95540d12f6fbbd7e5955ee2aa8a764aa150984bc))
-   **assets:** fix typo in textcritics for M 34 TF1 ([65ebc8c](https://github.com/webern-unibas-ch/awg-app/commit/65ebc8c04fc43743ed79e4b28a537b830afd32ef))
-   **assets:** fix typos in M212 and op22 ([76329fa](https://github.com/webern-unibas-ch/awg-app/commit/76329fa0989844d71607aed811d1a18d619a08f9); thanks to [@masthom](https://github.com/masthom))
-   **assets:** fix typos in sourceDescriptions of op12 and op22 ([3d60d70](https://github.com/webern-unibas-ch/awg-app/commit/3d60d70656ef525d4884d22110b3aa564cc4b5f4))
-   **assets:** fix wrong line break in sourceDescription of op12 ([9aad120](https://github.com/webern-unibas-ch/awg-app/commit/9aad120b70daab8fe2f25d2e6d0e4bf54ccbd437))
-   **assets:** fix wrong svg id in M212 TF1 ([48569a4](https://github.com/webern-unibas-ch/awg-app/commit/48569a48bdc0d8b98bc720ba2a5f7b151bd59f4f))
-   **assets:** highlight Textfassung in SourceEvaluation ([77e5cbf](https://github.com/webern-unibas-ch/awg-app/commit/77e5cbf5486afa4ce960ec2dda3cd761f1aceba6))
-   **assets:** link sources and sheets in m34, op12 & op25 ([a6851ea](https://github.com/webern-unibas-ch/awg-app/commit/a6851eadafb20eb591ce2863fbe26c58fb2ddb58))
-   **assets:** link textsources in op12 ([0c0f7f2](https://github.com/webern-unibas-ch/awg-app/commit/0c0f7f2dd9fee5ab4668b88ebe193aa4d3c188b7))
-   **assets:** move empty sheets in op22 to separate items ([028ffde](https://github.com/webern-unibas-ch/awg-app/commit/028ffde87fe990bffbca264c1a1c9902221b96c2))
-   **assets:** move updated files for m34 in correct folder ([fe576a4](https://github.com/webern-unibas-ch/awg-app/commit/fe576a428c0eec8fcd643cdb8d1174106ddf24d4))
-   **assets:** optimize svgs with SVGO ([d49fc75](https://github.com/webern-unibas-ch/awg-app/commit/d49fc75bf21ce0829c85816289716b6519e02067))
-   **assets:** remove links from unavailable sketches for m31 ([b5c69d5](https://github.com/webern-unibas-ch/awg-app/commit/b5c69d54343561ac7d92de37c994db250fedd404))
-   **assets:** remove self-references from textcritics in m30 ([65a7479](https://github.com/webern-unibas-ch/awg-app/commit/65a7479fe1120e19ef6b58a27fae575263b0daf8))
-   **assets:** remove self-references from textcritics in op25 ([1354d39](https://github.com/webern-unibas-ch/awg-app/commit/1354d39dd24f914be0ee7074a3eb8ce392477829))
-   **assets:** rename svg files for op22 ([ca6e061](https://github.com/webern-unibas-ch/awg-app/commit/ca6e0619029518f957b248a0af08518ba07ccce6))
-   **assets:** rename variable in SPARQL query for concomitating objects ([1fc44cb](https://github.com/webern-unibas-ch/awg-app/commit/1fc44cbabc1ef8939825c8b57cb7bbc85dd3377c))
-   **assets:** update files for m34 ([ced07af](https://github.com/webern-unibas-ch/awg-app/commit/ced07af28bf346fd97870350052b08d8de742dad); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** activate edition complex op22 ([06fd2c9](https://github.com/webern-unibas-ch/awg-app/commit/06fd2c95b78339145cc9a9746888d1712c7d80cb))
-   **edition:** activate edition complex op27 ([5301ca9](https://github.com/webern-unibas-ch/awg-app/commit/5301ca9be0f711f25cefc62aa76a93fedea6f09a))
-   **edition:** add graph file for op22 ([a053e31](https://github.com/webern-unibas-ch/awg-app/commit/a053e315f77805512f3e7513d252d11a49650f42))
-   **edition:** add siglumAddendum to sourceList model ([37f4a88](https://github.com/webern-unibas-ch/awg-app/commit/37f4a88ce822dba750e3c09af82a6e0a594aeb0d))
-   **edition:** add square brackets to folio label in folioViewer ([580c680](https://github.com/webern-unibas-ch/awg-app/commit/580c6804e9fe47c65d8b28a716df34ca5931da65))
-   **edition:** fix order of glyphs ([ed458a4](https://github.com/webern-unibas-ch/awg-app/commit/ed458a4950e51bdaa71d37d10f58bbbe08f09c48))
-   **edition:** fix source ids ([b63b27e](https://github.com/webern-unibas-ch/awg-app/commit/b63b27edabb92b2bba665924620caee939155e15))
-   **edition:** fix typos in op27 files ([96f75f5](https://github.com/webern-unibas-ch/awg-app/commit/96f75f55ad7078a6b0f88ac045164684a654557c))
-   **edition:** fix variable name of firm sign ([3dc9ea7](https://github.com/webern-unibas-ch/awg-app/commit/3dc9ea78eae9122dd1b01fc1a5df977d047012f4))
-   **edition:** generate graph placeholder from component ([72aa1a6](https://github.com/webern-unibas-ch/awg-app/commit/72aa1a61fc552009b298a87e623ee674b68a992d))
-   **edition:** improve responsible design for svg sheet viewer ([bb7ce5b](https://github.com/webern-unibas-ch/awg-app/commit/bb7ce5bc0915bb5e4956c4ecf86643c9059b2e12))
-   **edition:** indicate number of sheets in sheet nav dropdown ([8cb2e6d](https://github.com/webern-unibas-ch/awg-app/commit/8cb2e6def7335ba7727c60101803bcd56df81ed5))
-   **edition:** move text.id to th element instead of span ([c24722e](https://github.com/webern-unibas-ch/awg-app/commit/c24722e07a88671ad2e2d01d19e3ba96bde165d8))
-   **edition:** relabel transcription button ([27268ab](https://github.com/webern-unibas-ch/awg-app/commit/27268ab257e99ee0f205d82e7d4d82dbf7e8a1b8))
-   **edition:** remove unneccesary assertion (SonarCloud fix) ([bf5b426](https://github.com/webern-unibas-ch/awg-app/commit/bf5b42672acdef104838fd851755153df3d8d619))
-   **edition:** remove whitespace from rowtable line endings in sourceDesc ([cadd4d9](https://github.com/webern-unibas-ch/awg-app/commit/cadd4d9607a6c582054f5365f5568ad092bee553))
-   **search:** fix badge class in LinkedObjectsComponent ([6b45f0b](https://github.com/webern-unibas-ch/awg-app/commit/6b45f0b6420e0ceef9dfd0d0233a15bf180d4c72))
-   **search:** improve logic for extendedSearchForm component ([42bb7ff](https://github.com/webern-unibas-ch/awg-app/commit/42bb7ff2a67ec3590a0915778063451693d5e8e2))
-   **search:** use Map for COMPOPSET_LOOKUP ([dec2221](https://github.com/webern-unibas-ch/awg-app/commit/dec22213fe46e472432e74edf6a2d8c12a18d6dc))
-   **search:** use refresh icon for reset button ([e45c4b1](https://github.com/webern-unibas-ch/awg-app/commit/e45c4b179215d42b1a585f1785c35edbe791c099))
-   **shared:** fix code smells in OrderByPipe (SonarCloudAnalysis) ([782b7d1](https://github.com/webern-unibas-ch/awg-app/commit/782b7d11390bfc85270ea3fa69232b04ea46da3c))
-   **shared:** fix more code smells in OrderByPipe (SonarCloudAnalysis) ([a166290](https://github.com/webern-unibas-ch/awg-app/commit/a166290a085f3cdb241c97efc4f1d861d7f199e7))
-   **shared:** remove deprecated scrolling attribute from iframe ([0f2a429](https://github.com/webern-unibas-ch/awg-app/commit/0f2a4296d6a9160a35c1687ba0bfceeb7b97dff3))
-   **shared:** update edition modal snippets for op12 ([b08b860](https://github.com/webern-unibas-ch/awg-app/commit/b08b8606e1c2a85a33bb9bf7ce7f9202a3f213f2))

### Documentation

-   **README:** update contributors ([68cc67a](https://github.com/webern-unibas-ch/awg-app/commit/68cc67a2bed8b554b478aa3638f896b97642ac81))

### Tests

-   **app:** remove redundant context from undefined assertions ([3140e0a](https://github.com/webern-unibas-ch/awg-app/commit/3140e0acfa0ea3ebff2d4d30f37e69d5ee8da30d))
-   **edition:** add tests for graph placeholder ([5cc6051](https://github.com/webern-unibas-ch/awg-app/commit/5cc6051e1ffedbdf6e408bc311a0ec50c31d7da7))
-   **edition:** fix tests for source description ([ba43111](https://github.com/webern-unibas-ch/awg-app/commit/ba431113d7fae76add08c78eb1cc19a9b1bba349))
-   **search:** add tests for extendedSearchForm component ([87a0a30](https://github.com/webern-unibas-ch/awg-app/commit/87a0a306426ba13bca9bb5df084ee1006f965ef8))
-   **search:** add tests for view of extendedSearchForm ([84e7e91](https://github.com/webern-unibas-ch/awg-app/commit/84e7e912dab5a89a581b29a304146da3ce68f3a0))
-   **shared:** use mockDocument in TablePagination tests ([60a6a3c](https://github.com/webern-unibas-ch/awg-app/commit/60a6a3c2294b7a14970d5660f8fc5a8c2fecbf20))

### Styles

-   **edition:** use cards for parts of critical report ([c88c7fa](https://github.com/webern-unibas-ch/awg-app/commit/c88c7fa21dc21e9b10aa3a82433c317cca56def1))

### Continuous Integration

-   **gh-actions:** add gh action for SVG optimization with SVGO ([55b23e5](https://github.com/webern-unibas-ch/awg-app/commit/55b23e5be6542a20be980cf5a9c3398cfda6784b))
-   **gh-actions:** add node v20 to matrix ([ccddb05](https://github.com/webern-unibas-ch/awg-app/commit/ccddb058d80a8e24dd861e94df5b2e34aa48cbbb))
-   **gh-actions:** adjust SVG optimization workflow ([ca9a65a](https://github.com/webern-unibas-ch/awg-app/commit/ca9a65a11fde4e8ca4421646c73f20b4ee200c7c))
-   **gh-actions:** adjust SVG optimization workflow ([9998abb](https://github.com/webern-unibas-ch/awg-app/commit/9998abb6e0f697ab2eab714495406a1f6d9306c3))
-   **gh-actions:** adjust SVG optimization workflow ([1b40549](https://github.com/webern-unibas-ch/awg-app/commit/1b405495f19efb4a1a3d368c8a2ea6852c440a56))
-   **gh-actions:** pin action versions to sha-1 with ratchet ([ecf2fd1](https://github.com/webern-unibas-ch/awg-app/commit/ecf2fd15485fbbb93cea64e2224884fbbed3ddd9))

### Code Refactoring

-   **edition:** load row tables data from JSON ([d3c4be4](https://github.com/webern-unibas-ch/awg-app/commit/d3c4be45f6152214b44c0100b47bac2a25cfa136))
-   **edition:** reduce complexity of overlay creation methods ([6ee62d5](https://github.com/webern-unibas-ch/awg-app/commit/6ee62d500e009b694466b3774329dea2f9ce0e79))
-   **edition:** replace deprecated NgbAccordion in TriplesEditor ([2f76e38](https://github.com/webern-unibas-ch/awg-app/commit/2f76e38aac7870ee1c30870fbfad69cb1405f9da))
-   **search:** improve naming in fulltextSearchForm component ([cb77bf9](https://github.com/webern-unibas-ch/awg-app/commit/cb77bf92c1e11ae50f5eb079d5ecc827100b7214))
-   **search:** refactor functions of BibliographyFormatPipe ([0c55a06](https://github.com/webern-unibas-ch/awg-app/commit/0c55a0696746535f2ad1efc37c2614fa5c2ae55e))
-   **search:** remove nested ternary operator in ResourceDetail ([8802231](https://github.com/webern-unibas-ch/awg-app/commit/880223173a8c43517cd1a01653864ee1f3644d72))
-   **search:** separate ValueType and SearchCompop data from model ([d73b387](https://github.com/webern-unibas-ch/awg-app/commit/d73b387c8075ad8c36231ed1f3538ba4c18d0bde))
-   **side-info:** remove commented out code (SonarCloudAnalysis) ([e7e9af7](https://github.com/webern-unibas-ch/awg-app/commit/e7e9af7ae9ed869d7a7073301151ce440fe51b1b))

### Build System

-   **app:** fix email field in package.json ([827863a](https://github.com/webern-unibas-ch/awg-app/commit/827863a8a7c86b269f20bd65e48e9d94b3c4c529))
-   **app:** fix typo in sourcemap script ([33d7ef0](https://github.com/webern-unibas-ch/awg-app/commit/33d7ef03189f8fd5366bbbe10cfd83735d70975a))
-   **app:** update test:ci script ([8862e09](https://github.com/webern-unibas-ch/awg-app/commit/8862e09c87bd524a9e2f4d8e19736eac42c1211b))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.4.4 to 17.6.1 ([1fbfcfb](https://github.com/webern-unibas-ch/awg-app/commit/1fbfcfb8b083403b22e9091635da87f60cbd8817))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.6.1 to 17.6.3 ([a053eaf](https://github.com/webern-unibas-ch/awg-app/commit/a053eafa1195786873109201fa99947fa6c0cab5))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.55.0 to 5.56.0 ([7b81042](https://github.com/webern-unibas-ch/awg-app/commit/7b81042e8d3335d6673d9c3a17760db9cd44a108))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.56.0 to 5.57.0 ([5ed2a71](https://github.com/webern-unibas-ch/awg-app/commit/5ed2a715a64f6e92efe93c69d54f703cd491c347))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.57.0 to 5.58.0 ([b9e1e17](https://github.com/webern-unibas-ch/awg-app/commit/b9e1e1729532201975169d1c90cb76e22714dd57))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.58.0 to 5.59.0 ([9b16972](https://github.com/webern-unibas-ch/awg-app/commit/9b169727e9d1fff12cdda13dd0ef1dbdf89bbefe))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.59.0 to 5.59.1 ([e1b3397](https://github.com/webern-unibas-ch/awg-app/commit/e1b339716d5ca5434e616861d59de00cabc2dd0a))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.59.1 to 5.59.2 ([2c1ef88](https://github.com/webern-unibas-ch/awg-app/commit/2c1ef889dbb8648054740b7153b86868f5f8fe58))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.59.2 to 5.59.5 ([787edaa](https://github.com/webern-unibas-ch/awg-app/commit/787edaa597da98af55cc97bb73f48cb18128cabd))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.2.3 to 15.2.4 ([3528c47](https://github.com/webern-unibas-ch/awg-app/commit/3528c475f8a26eb4c48bb4e9d5bc6133935277bb))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.2.4 to 15.2.5 ([8db8ec5](https://github.com/webern-unibas-ch/awg-app/commit/8db8ec5635a81bae28600238c17917d52747aaa7))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.2.5 to 15.2.6 ([b73193a](https://github.com/webern-unibas-ch/awg-app/commit/b73193a8fba5bdf861ee328a15ddec63517addaa))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.2.6 to 15.2.7 ([94817e0](https://github.com/webern-unibas-ch/awg-app/commit/94817e00b8e22b3785925181347dacebc4da9d74))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.2.7 to 15.2.8 ([db08e56](https://github.com/webern-unibas-ch/awg-app/commit/db08e56ffb200ea351a5508c65bfe90a492cccaa))
-   **deps-dev:** bump @commitlint/cli from 17.4.4 to 17.5.1 ([9c1e74a](https://github.com/webern-unibas-ch/awg-app/commit/9c1e74a53a12be474f111470e636ee067ea33dea))
-   **deps-dev:** bump @types/node from 16.18.16 to 16.18.18 ([5dbb3a2](https://github.com/webern-unibas-ch/awg-app/commit/5dbb3a27debcf87e7e2f502929d83a0502a60bb6))
-   **deps-dev:** bump @types/node from 16.18.18 to 16.18.22 ([65988b0](https://github.com/webern-unibas-ch/awg-app/commit/65988b073cb874f4c1f9986b237472c17e49d145))
-   **deps-dev:** bump @types/node from 16.18.22 to 16.18.23 ([3a8587b](https://github.com/webern-unibas-ch/awg-app/commit/3a8587bb40c8364368e498f3e608e231a98fa2e2))
-   **deps-dev:** bump @types/node from 16.18.23 to 16.18.24 ([5f48b9c](https://github.com/webern-unibas-ch/awg-app/commit/5f48b9ca1aa3978e26ba8519234e11c33ac33a8f))
-   **deps-dev:** bump @types/node from 16.18.24 to 16.18.25 ([dae5ef5](https://github.com/webern-unibas-ch/awg-app/commit/dae5ef5b2bfacef3028dc2344d6a27da1366c0f0))
-   **deps-dev:** bump @types/node from 16.18.25 to 16.18.26 ([d0c48b7](https://github.com/webern-unibas-ch/awg-app/commit/d0c48b74cf38b59fd3829d8a3340c1b7f21142cb))
-   **deps-dev:** bump @types/node from 16.18.26 to 16.18.27 ([c1db149](https://github.com/webern-unibas-ch/awg-app/commit/c1db1497d67f5b6d37594fb96f13e8e5c28f7b8b))
-   **deps-dev:** bump eslint from 8.36.0 to 8.37.0 ([be855a4](https://github.com/webern-unibas-ch/awg-app/commit/be855a44ce87b14afe945e69c8715fbd7e844122))
-   **deps-dev:** bump eslint from 8.37.0 to 8.38.0 ([52c254e](https://github.com/webern-unibas-ch/awg-app/commit/52c254e3c45b84b4f77b16659d28ae5c537db759))
-   **deps-dev:** bump eslint from 8.38.0 to 8.39.0 ([4fe67c6](https://github.com/webern-unibas-ch/awg-app/commit/4fe67c6e48124590a6c48a6f6e85d6e6765bcdfb))
-   **deps-dev:** bump eslint from 8.39.0 to 8.40.0 ([e606e0e](https://github.com/webern-unibas-ch/awg-app/commit/e606e0e38fcd13f6f0e92a0917964bcc9a35a1d5))
-   **deps-dev:** bump eslint-config-prettier from 8.7.0 to 8.8.0 ([24713d8](https://github.com/webern-unibas-ch/awg-app/commit/24713d831891bd5bc385ac8d49a295e163c23739))
-   **deps-dev:** bump eslint-plugin-deprecation from 1.3.3 to 1.4.0 ([6bf79e8](https://github.com/webern-unibas-ch/awg-app/commit/6bf79e8a383ceff0570f4abe16d6e3afe3d31a16))
-   **deps-dev:** bump eslint-plugin-deprecation from 1.4.0 to 1.4.1 ([156f670](https://github.com/webern-unibas-ch/awg-app/commit/156f67092af651ae82f825f22419c8f65fe36826))
-   **deps-dev:** bump eslint-plugin-jsdoc from 40.0.3 to 40.1.0 ([65e8876](https://github.com/webern-unibas-ch/awg-app/commit/65e8876e2a383dc400857064b60e70ebfdfa479d))
-   **deps-dev:** bump eslint-plugin-jsdoc from 40.1.0 to 40.1.1 ([16903fb](https://github.com/webern-unibas-ch/awg-app/commit/16903fbd52d33a6ddff2465c3df924c38942707c))
-   **deps-dev:** bump eslint-plugin-jsdoc from 40.1.1 to 41.1.1 ([6868f6f](https://github.com/webern-unibas-ch/awg-app/commit/6868f6f85f8715fd20864f0b329123187184cf34))
-   **deps-dev:** bump eslint-plugin-jsdoc from 41.1.1 to 41.1.2 ([407b881](https://github.com/webern-unibas-ch/awg-app/commit/407b8810e44b448afc73117a9d9814191ea36ad9))
-   **deps-dev:** bump eslint-plugin-jsdoc from 41.1.2 to 43.0.6 ([0344035](https://github.com/webern-unibas-ch/awg-app/commit/0344035907fb48e6a5e3beaa124402e0a04989c4))
-   **deps-dev:** bump eslint-plugin-jsdoc from 43.0.6 to 43.0.7 ([6a1cce6](https://github.com/webern-unibas-ch/awg-app/commit/6a1cce6e1369049e982c4c7427597316949fb355))
-   **deps-dev:** bump jasmine-core from 4.5.0 to 4.6.0 ([47a84db](https://github.com/webern-unibas-ch/awg-app/commit/47a84db85da0b368ec06a9cd2d44cf6c51686028))
-   **deps-dev:** bump karma from 6.4.1 to 6.4.2 ([4b3d585](https://github.com/webern-unibas-ch/awg-app/commit/4b3d585adeb5352119462a311d1270dc0ad0fad2))
-   **deps-dev:** bump karma-chrome-launcher from 3.1.1 to 3.2.0 ([326d661](https://github.com/webern-unibas-ch/awg-app/commit/326d661abb055327f3844cdef61d4de122af3364))
-   **deps-dev:** bump lint-staged from 13.2.0 to 13.2.1 ([bf79048](https://github.com/webern-unibas-ch/awg-app/commit/bf79048ef1d9daa5e8f1cd80302206ef73b7847e))
-   **deps-dev:** bump lint-staged from 13.2.1 to 13.2.2 ([4464c56](https://github.com/webern-unibas-ch/awg-app/commit/4464c5683e93a73a04d972051c033a63ccad19e5))
-   **deps-dev:** bump prettier from 2.8.4 to 2.8.6 ([8e65d34](https://github.com/webern-unibas-ch/awg-app/commit/8e65d34df048f6730dabac7c09e1af71d44c2619))
-   **deps-dev:** bump prettier from 2.8.6 to 2.8.7 ([e7fe679](https://github.com/webern-unibas-ch/awg-app/commit/e7fe679341b68f330669afdf5be42ea9d386ce79))
-   **deps-dev:** bump prettier from 2.8.7 to 2.8.8 ([06cfec4](https://github.com/webern-unibas-ch/awg-app/commit/06cfec4985bae6efe43de9d88417a342340df3bf))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.2.2 to 15.2.3 ([9b675ab](https://github.com/webern-unibas-ch/awg-app/commit/9b675ab0ee181b509901d34e1035ddb53821702f))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.2.3 to 15.2.4 ([fb607f2](https://github.com/webern-unibas-ch/awg-app/commit/fb607f29f143c3910b73db95d8ef92ec14f54ae8))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.2.4 to 15.2.5 ([8659a1b](https://github.com/webern-unibas-ch/awg-app/commit/8659a1b196ffb869db877726888e169406268aa1))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.2.5 to 15.2.6 ([83b9b58](https://github.com/webern-unibas-ch/awg-app/commit/83b9b58dd6ac6e0e2e086aa620c061f7340a1fd9))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.2.6 to 15.2.7 ([23467af](https://github.com/webern-unibas-ch/awg-app/commit/23467af816fcf1742ae90c5b52d922f20e9ae515))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.2.7 to 15.2.8 ([2b5dead](https://github.com/webern-unibas-ch/awg-app/commit/2b5deadf18a423f60283460bc240870551ff755d))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.2.8 to 15.2.9 ([6dad0c9](https://github.com/webern-unibas-ch/awg-app/commit/6dad0c99af2a3f03e3eb47906e4dc8ed3dd695fa))
-   **deps:** bump [@fortawesome](https://github.com/fortawesome) packages from 6.3.0 to 6.4.0 ([fdf3c7f](https://github.com/webern-unibas-ch/awg-app/commit/fdf3c7f5e7e7baf47a08da959cac181f63e2eb51))
-   **deps:** bump @codemirror/legacy-modes from 6.3.1 to 6.3.2 ([0763559](https://github.com/webern-unibas-ch/awg-app/commit/0763559823bd14163905fcb4e45cacfb42d71518))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 14.0.1 to 14.1.0 ([18c7901](https://github.com/webern-unibas-ch/awg-app/commit/18c7901608a9d5c4a957c709449571f096e38e2d))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 14.1.0 to 14.1.1 ([fd1c6e9](https://github.com/webern-unibas-ch/awg-app/commit/fd1c6e944e96ad46d2da40274d2728d404cd8bfd))
-   **deps:** bump @popperjs/core from 2.11.6 to 2.11.7 ([9a81b0b](https://github.com/webern-unibas-ch/awg-app/commit/9a81b0b70c1294e5c22525bc2d13d4c1a011eff9))
-   **deps:** bump codecov/codecov-action from 3.1.1 to 3.1.2 ([731b7cd](https://github.com/webern-unibas-ch/awg-app/commit/731b7cd28a02184d99258b258b5286a82783b657))
-   **deps:** bump codecov/codecov-action from 3.1.2 to 3.1.3 ([15cf881](https://github.com/webern-unibas-ch/awg-app/commit/15cf88123471af274d6bf3b3d54feab2a661c0f6))
-   **deps:** bump engine.io from 6.4.0 to 6.4.2 ([400f58f](https://github.com/webern-unibas-ch/awg-app/commit/400f58f350be8d272d5ae4ff185c12a2a190ccc7))
-   **deps:** bump n3 from 1.16.3 to 1.16.4 ([6808bd9](https://github.com/webern-unibas-ch/awg-app/commit/6808bd94f73bd9f2f119368b4facc1bd7a0cf5f0))
-   **deps:** bump rdfstore from v0.9.18-alpha.11 to v0.9.18-alpha.12 ([abc9de4](https://github.com/webern-unibas-ch/awg-app/commit/abc9de449209dc55706982e787eb7f5e5bc40641))
-   **deps:** bump rxjs from 7.8.0 to 7.8.1 ([2a50066](https://github.com/webern-unibas-ch/awg-app/commit/2a500666ad6ee6e0d70311d8abcedba986bd9c6b))
-   **deps:** bump zone.js from 0.12.0 to 0.13.0 ([4473285](https://github.com/webern-unibas-ch/awg-app/commit/44732854527d7f7e6a35a014e21dd5d3a9c1b333))

### [0.10.2](https://github.com/webern-unibas-ch/awg-app/compare/v0.10.1...v0.10.2) (2023-03-15)

### Features

-   **assets:** enable linkBoxes for M317 ([#855](https://github.com/webern-unibas-ch/awg-app/issues/855)) ([97d551f](https://github.com/webern-unibas-ch/awg-app/commit/97d551f9d8082ed5599455609387e291d260d135); thanks to [@masthom](https://github.com/masthom))
-   **edition:** add optional system description in sourceDesc ([2ad4ea5](https://github.com/webern-unibas-ch/awg-app/commit/2ad4ea5b76dc80dac68a2daccc12760f31e28a2e))
-   **edition:** add possibility to browse svg sheets ([4d7e169](https://github.com/webern-unibas-ch/awg-app/commit/4d7e16984a280306b37c28bd05bc52f9a7741062))

### Bug Fixes

-   **assets:** add source description and convolute for M30 ([0dc8b23](https://github.com/webern-unibas-ch/awg-app/commit/0dc8b23eab85b8b1d0562017577061245fc73438))
-   **assets:** add svgGroupIds for M317 TF1 ([2100b8f](https://github.com/webern-unibas-ch/awg-app/commit/2100b8fc8d5ffbc8edab84c7fb08521eddf563b1); thanks to [@masthom](https://github.com/masthom))
-   **assets:** adjust folio-convolute for M 317 ([c024731](https://github.com/webern-unibas-ch/awg-app/commit/c024731d14c846d5ce2393b493a7daea43d377bf))
-   **assets:** adjust naming convention for svg files ([0dfe793](https://github.com/webern-unibas-ch/awg-app/commit/0dfe793cbd952f9db91a66c3bc33b9c4d671cbc3))
-   **assets:** fix edition data for M 317 ([8b3434f](https://github.com/webern-unibas-ch/awg-app/commit/8b3434fd79f7ad6e0c9f27f13d889e3deb9203fb); thanks to [@masthom](https://github.com/masthom))
-   **assets:** fix group ids for M30 and M34 ([123fc1e](https://github.com/webern-unibas-ch/awg-app/commit/123fc1e3342b1271607b9324c378dc35f2be40c6))
-   **assets:** fix item label for M 317 TF1 ([699b4fe](https://github.com/webern-unibas-ch/awg-app/commit/699b4fe5184ff8b32de12fc7e8ad6c75fa3332fd))
-   **assets:** fix misc svg issues for M317 ([b04eca7](https://github.com/webern-unibas-ch/awg-app/commit/b04eca7ff61c8d76d0894eeb6ca830a7762bf917); thanks to [@masthom](https://github.com/masthom))
-   **assets:** fix svgGroupIds and classes for M 30 ([d3dd772](https://github.com/webern-unibas-ch/awg-app/commit/d3dd7729270c62563b76fa9e48d342c2ecaad4f6))
-   **assets:** fix typos in measure labels for M 30 ([387c6a3](https://github.com/webern-unibas-ch/awg-app/commit/387c6a33b8e591aa1a4fb891a466f9ca03eb2eb8))
-   **assets:** lint updated svg files for M30 ([bdeef4e](https://github.com/webern-unibas-ch/awg-app/commit/bdeef4eafab9ab99d7e0648d73896bcd59cabc64))
-   **assets:** lint updated svg files for M30 and M34 ([fc07f54](https://github.com/webern-unibas-ch/awg-app/commit/fc07f546f652c6971a5625d8a07a0463d324d740))
-   **assets:** remove unused files ([de314e1](https://github.com/webern-unibas-ch/awg-app/commit/de314e10a6bc026ae9bc7a8051c8c861138658b1))
-   **assets:** tkk findings for M 317 ([#852](https://github.com/webern-unibas-ch/awg-app/issues/852)) ([40a0606](https://github.com/webern-unibas-ch/awg-app/commit/40a0606cdde6206fc790f3963ce861cd6b4cf72a); thanks to [@masthom](https://github.com/masthom))
-   **assets:** update files for M 30 and M 34 ([8c05351](https://github.com/webern-unibas-ch/awg-app/commit/8c05351e7dbe690bf8cc651aaed67dda59e867d4); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** update files for M30 ([5dcdf02](https://github.com/webern-unibas-ch/awg-app/commit/5dcdf0226c17043a84232de70ab2fd319aa88ea4); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** update textcritical comment in M 30 with glyph ([852b744](https://github.com/webern-unibas-ch/awg-app/commit/852b7449d0cab7ddf3480057cb5e96d57c458bb6))
-   **edition:** clear textcritical comments when changing svg sheet ([6bc1b45](https://github.com/webern-unibas-ch/awg-app/commit/6bc1b45594d4fef876f073614ae3a1ad11c08c06))
-   **edition:** fix condition for displaying sheet footer ([a19bec0](https://github.com/webern-unibas-ch/awg-app/commit/a19bec027af38ca88fb18c7c9f1d5883946412f4))
-   **edition:** improve handling of music glyphs ([eef4cf4](https://github.com/webern-unibas-ch/awg-app/commit/eef4cf432f5aa7f27e425d78ef891d46057e6c2d))
-   **edition:** simplify display of deleted measures ([624e331](https://github.com/webern-unibas-ch/awg-app/commit/624e33197d367ee733d3c662df114dfc861d4ec0))

### Documentation

-   **CHANGELOG:** add contributors ([683747f](https://github.com/webern-unibas-ch/awg-app/commit/683747fbd3e2a6b59f9b57fe4cebc2a900c3a0d1))
-   **edition:** add missing jsdoc comments ([6b1b885](https://github.com/webern-unibas-ch/awg-app/commit/6b1b8857316667849ebe0d24a053b5f074a7062a))

### Tests

-   **app:** fix some more style conventions for tests ([e556691](https://github.com/webern-unibas-ch/awg-app/commit/e556691adf4583d23d758ca8a62652b61a125375))
-   **app:** fix some style conventions for tests ([9a6d0b7](https://github.com/webern-unibas-ch/awg-app/commit/9a6d0b71a50f0bfa955891605fbbdefccb5c5e6a))
-   **edition:** add tests for glyphs in textcritical comments ([db6113a](https://github.com/webern-unibas-ch/awg-app/commit/db6113ad880ba76fa7157eb4844eaa6584976b12))
-   **edition:** fix references from and to mockEditionData from tests ([da010d7](https://github.com/webern-unibas-ch/awg-app/commit/da010d7067a1365ab6a6ad6aef635383805b8af3))

### Code Refactoring

-   **edition:** move functions for sheets to EditionSheetsService ([bf35ec3](https://github.com/webern-unibas-ch/awg-app/commit/bf35ec32739862a9bfe452c4205c9b9bc76d7e36))

### Build System

-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.53.0 to 5.54.0 ([df8c544](https://github.com/webern-unibas-ch/awg-app/commit/df8c544c464c72e4872455f3ab7fa42e6e8965c2))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.54.0 to 5.54.1 ([a179e32](https://github.com/webern-unibas-ch/awg-app/commit/a179e32778df0db105ee43ea336ac232087b3013))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.54.1 to 5.55.0 ([cc04f5a](https://github.com/webern-unibas-ch/awg-app/commit/cc04f5ac463e89e8f2f6370abfaa69050a6f0fe1))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.2.0 to 15.2.1 ([43ea0b0](https://github.com/webern-unibas-ch/awg-app/commit/43ea0b0010b88a1647617d75384963a4041a8c1e))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.2.1 to 15.2.2 ([52ba7cf](https://github.com/webern-unibas-ch/awg-app/commit/52ba7cfc67d83e98bb129a526c72f5618d0f9e51))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.2.2 to 15.2.3 ([7be0023](https://github.com/webern-unibas-ch/awg-app/commit/7be0023724d7252c67cd7b1d8382b2c88982bc0d))
-   **deps-dev:** bump @types/node from 16.18.12 to 16.18.13 ([6934a8b](https://github.com/webern-unibas-ch/awg-app/commit/6934a8b8bfec92c7e88904a3389b0313869290e8))
-   **deps-dev:** bump @types/node from 16.18.13 to 16.18.14 ([cbbcd8f](https://github.com/webern-unibas-ch/awg-app/commit/cbbcd8fc557e4ebbcfb05937fc6f9bf75b66e669))
-   **deps-dev:** bump @types/node from 16.18.14 to 16.18.16 ([91bed3b](https://github.com/webern-unibas-ch/awg-app/commit/91bed3b8e201065262eb85b50ae0ca3903dd4221))
-   **deps-dev:** bump eslint from 8.34.0 to 8.35.0 ([27e466c](https://github.com/webern-unibas-ch/awg-app/commit/27e466c49c9bc07a1eaecf1de35dacf0d8d0d7b2))
-   **deps-dev:** bump eslint from 8.35.0 to 8.36.0 ([eba76b3](https://github.com/webern-unibas-ch/awg-app/commit/eba76b39a8481c0a48b3fd1b3d0e266116e997df))
-   **deps-dev:** bump eslint-config-prettier from 8.6.0 to 8.7.0 ([cff0cc9](https://github.com/webern-unibas-ch/awg-app/commit/cff0cc918a684294b3478ea1c76ad89a7728582e))
-   **deps-dev:** bump eslint-plugin-jsdoc from 40.0.0 to 40.0.1 ([85fe75b](https://github.com/webern-unibas-ch/awg-app/commit/85fe75b4296a206624078a99c5ed5240c81ab44c))
-   **deps-dev:** bump eslint-plugin-jsdoc from 40.0.1 to 40.0.3 ([dbe77b1](https://github.com/webern-unibas-ch/awg-app/commit/dbe77b10d495a7eec9118844cdc5c70d503da930))
-   **deps-dev:** bump lint-staged from 13.1.2 to 13.2.0 ([ea67276](https://github.com/webern-unibas-ch/awg-app/commit/ea672763725571f1f149f41484314e0553265630))
-   **deps-dev:** bump typescript from 4.8.4 to 4.9.5 ([f6f4d60](https://github.com/webern-unibas-ch/awg-app/commit/f6f4d60d8ecc6967b36e44ae3bce682b87fd2198))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.2.0 to 15.2.1 ([076dd41](https://github.com/webern-unibas-ch/awg-app/commit/076dd41f68ab686439750d24eba2a7e50464ed6f))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.2.1 to 15.2.2 ([c3261b8](https://github.com/webern-unibas-ch/awg-app/commit/c3261b86e2c1f7c62e97cf13555ad7bf77bb69af))
-   **deps:** bump rdfstore from v0.9.18-alpha.10 to v0.9.18-alpha.11 ([6a3dd4e](https://github.com/webern-unibas-ch/awg-app/commit/6a3dd4ead75ce7ff953a01f4d533076ca6744898))
-   **deps:** bump rdfstore from v0.9.18-alpha.9 to v0.9.18-alpha.10 ([0baa194](https://github.com/webern-unibas-ch/awg-app/commit/0baa1949a4d9649a3fce2d170e3fdb7955711368))
-   **deps:** bump SonarSource/sonarcloud-github-action from 1.8 to 1.9 ([2c56fc8](https://github.com/webern-unibas-ch/awg-app/commit/2c56fc8193bc4b311ea9248cd0e2addf593c92b1))
-   **deps:** bump sqlite3 from 5.1.4 to 5.1.5 ([065e530](https://github.com/webern-unibas-ch/awg-app/commit/065e530c8d3ab6ef07beb864b9d25383c5dc4e61))
-   **deps:** bump tslib from 2.4.1 to 2.5.0 ([2a73e08](https://github.com/webern-unibas-ch/awg-app/commit/2a73e08a6039ba7bfb3b83a771abc563f843fcd8))

### [0.10.1](https://github.com/webern-unibas-ch/awg-app/compare/v0.10.0...v0.10.1) (2023-02-25)

### Bug Fixes

-   **assets:** fix id for M 317 Textfassung 1 ([6b83e07](https://github.com/webern-unibas-ch/awg-app/commit/6b83e07bbbac72348dbe6121bc22a4af08b92570))
-   **edition:** fix queryParams for sheet ids ([d44404b](https://github.com/webern-unibas-ch/awg-app/commit/d44404be3ce949591bc20932180fa993c0fb9ab1))
-   **home:** add M 30 to start page ([c041593](https://github.com/webern-unibas-ch/awg-app/commit/c041593b6d425391d42c00fce24c99c081a64e1d))

### Tests

-   **app:** fix tests for routerLinks ([1500e94](https://github.com/webern-unibas-ch/awg-app/commit/1500e947a9f1197f3ffe34cb64ea326dcb78091c))

## [0.10.0](https://github.com/webern-unibas-ch/awg-app/compare/v0.9.3...v0.10.0) (2023-02-25)

### Features

-   **assets:** add files for M 30 ([135aec1](https://github.com/webern-unibas-ch/awg-app/commit/135aec170688f5905b531cde741f7a3c7bb5157a); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** add svgGroupId for M 317 ([ac59509](https://github.com/webern-unibas-ch/awg-app/commit/ac59509d7959bd10b8f18c78ab7bd81b990a2c8d); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add svgGroupId for op19 row table ([7210959](https://github.com/webern-unibas-ch/awg-app/commit/721095940884bc39f685a348748b63733e663b3f); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add svgGroupId for op23 row table ([63de820](https://github.com/webern-unibas-ch/awg-app/commit/63de820a5d9048700c4e7fb3c53f63b8beea5b76); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add svgGroupId for op24 row table ([050e880](https://github.com/webern-unibas-ch/awg-app/commit/050e880335536f66197f9bd7e009f31d7b05f092); thanks to [@masthom](https://github.com/masthom))
-   **edition:** add edition complex M 30 ([08e09da](https://github.com/webern-unibas-ch/awg-app/commit/08e09daa5421f6bf9fb59f67c263d052fc4912af))
-   **edition:** add pagination to source description model ([9a55905](https://github.com/webern-unibas-ch/awg-app/commit/9a55905c37991030528b42e6ef99817a69b9524a))
-   **edition:** add Skizzenkommentar to SVG view ([744004a](https://github.com/webern-unibas-ch/awg-app/commit/744004a276bd8858476d077661f923cdc0fca527))
-   **edition:** extend EditionSvgSheet model to include edition types ([e60979c](https://github.com/webern-unibas-ch/awg-app/commit/e60979cf06e98b2ab3290b8e41ceb7e9eb179db6))
-   **edition:** first test with inclusion of edition types ([c3edfa8](https://github.com/webern-unibas-ch/awg-app/commit/c3edfa887df2cdf3982de179936c4e9881415304))
-   **edition:** highlight and follow link boxes in SVGs ([06d3007](https://github.com/webern-unibas-ch/awg-app/commit/06d30070458be05d9618f2532871a9e6d632c847))
-   **edition:** separate opus and mnr numbers in outline ([91e0b58](https://github.com/webern-unibas-ch/awg-app/commit/91e0b580f61acc209009386684a0d2b7775b14f4))

### Bug Fixes

-   **assets:** add links in comments to M 317 ([2b62ce2](https://github.com/webern-unibas-ch/awg-app/commit/2b62ce2c1c5663e1048005f6c059bfa5bc3d173f); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add updated files for M 34 ([60bea15](https://github.com/webern-unibas-ch/awg-app/commit/60bea15aae6257ac2bd247a8aafd51f0a4eb8858))
-   **assets:** adjust viewboxes for op24 row table ([2d4556b](https://github.com/webern-unibas-ch/awg-app/commit/2d4556bc7f6bb3bea7898e27c6249ab12c4990c4))
-   **assets:** fix id in textcritics for op25 ([4d67f94](https://github.com/webern-unibas-ch/awg-app/commit/4d67f94264ab75e98cb37e429039e04c7e76e88d))
-   **assets:** fix ids of sheets in data files ([317ea06](https://github.com/webern-unibas-ch/awg-app/commit/317ea06ab5889502a80f01d92d3e94ba70c958de))
-   **assets:** fix incorrect convolute for M 34 Sk1.1 ([f158e39](https://github.com/webern-unibas-ch/awg-app/commit/f158e39d05a1cb61337e5202b9da68ecb95e28be))
-   **assets:** fix label of convolutes to use RISM sigla ([a0bbe9f](https://github.com/webern-unibas-ch/awg-app/commit/a0bbe9ff76b0c17c55c897067cf8bf4458248063))
-   **assets:** fix length of hypen in textcritics of op19 ([2ff6e19](https://github.com/webern-unibas-ch/awg-app/commit/2ff6e198e8a1b53d250c399c48cea260cc03eb58))
-   **assets:** fix M30 data files ([8efd89c](https://github.com/webern-unibas-ch/awg-app/commit/8efd89cf83dfba9ddac6becd653bdd0085d9fb69))
-   **assets:** fix order of SVG overlays in M 137 Sk4b and Sk3.1 ([67c5ada](https://github.com/webern-unibas-ch/awg-app/commit/67c5ada1c5dfaa0da08d6e730b72bb254debbd14))
-   **assets:** fix sigla in textcritics and svg-link-boxes for M 212 ([8b68326](https://github.com/webern-unibas-ch/awg-app/commit/8b683264c8dd9b448c13de58bb5764ff9068ec8b); thanks to [@masthom](https://github.com/masthom))
-   **assets:** fix textcritics id for op19 row table ([315b4ca](https://github.com/webern-unibas-ch/awg-app/commit/315b4cae74434080f43355cca2799205f983bce2))
-   **assets:** fix textcritics id for op23 row table ([89d1011](https://github.com/webern-unibas-ch/awg-app/commit/89d1011027ba01acc01d1739cd47f2ce85dffa19))
-   **assets:** lint all svg files with prettier ([a2117ef](https://github.com/webern-unibas-ch/awg-app/commit/a2117efe5149d168adff789f9dccc12b1ce81c9c))
-   **assets:** move M30 svg files to img assets ([c5bd84a](https://github.com/webern-unibas-ch/awg-app/commit/c5bd84a4f9941e40f6e6af4d47c74300763a4ebe))
-   **contact:** replace KNORA with DSP in contact-view ([4ff61e0](https://github.com/webern-unibas-ch/awg-app/commit/4ff61e0094d51e664b1fe148365b8fe4d73d97c6))
-   **core:** add more urls to metaPage model ([4b021fe](https://github.com/webern-unibas-ch/awg-app/commit/4b021fe731aee8c810211eed1d1d0593dca03be5))
-   **core:** update analytics to GA4 ([7b2a33d](https://github.com/webern-unibas-ch/awg-app/commit/7b2a33dcd17b286e6d026174e7cd92d083188d46))
-   **edition:** add M 30 to navigation ([1c7da41](https://github.com/webern-unibas-ch/awg-app/commit/1c7da4138f70c2a7895231323f0b8ea33b31ddf7))
-   **edition:** add overlayHoverFillColor to SVG viewer ([4966a69](https://github.com/webern-unibas-ch/awg-app/commit/4966a691b794ce29a8d784b1a33615c703be63f1))
-   **edition:** add UtilityService to EditionComplexComponent ([09c367e](https://github.com/webern-unibas-ch/awg-app/commit/09c367e11104b7bb19da4c2ab3f25ded6e6911b5))
-   **edition:** adjust colors and cursor for svg overlays ([6f30cdb](https://github.com/webern-unibas-ch/awg-app/commit/6f30cdb41f8192733548abaf9510390d2912241d))
-   **edition:** adjust content of comple overview page ([c06b5b6](https://github.com/webern-unibas-ch/awg-app/commit/c06b5b6bac287a2a6b5be55bbfc3f271f4459935))
-   **edition:** correctly highlight dropdown labels with active sub items ([2afd34d](https://github.com/webern-unibas-ch/awg-app/commit/2afd34dd293017ae4a23a719e7af07ef36f62624))
-   **edition:** do not hide textcritics on sheet change ([cc70654](https://github.com/webern-unibas-ch/awg-app/commit/cc70654ecda51275d3fadd0552c105688d619cb3))
-   **edition:** first test with inclusion of text edition ([75d84cf](https://github.com/webern-unibas-ch/awg-app/commit/75d84cffd528f310652b9ddeb6b05296361c7b0a))
-   **edition:** fix asset path construction ([9d053c1](https://github.com/webern-unibas-ch/awg-app/commit/9d053c1069833af7a048ef1f053176cba7574587))
-   **edition:** fix broken parts after complex changes ([75a65e2](https://github.com/webern-unibas-ch/awg-app/commit/75a65e2ea8fa763f6b372a1cb87446f0075bc907))
-   **edition:** fix display of convolutes ([84c27f1](https://github.com/webern-unibas-ch/awg-app/commit/84c27f10141f873a3c7a07ddf459b58a4f4f2ef1))
-   **edition:** fix display of sketch commentary if empty ([b198d59](https://github.com/webern-unibas-ch/awg-app/commit/b198d59579d10a936b4a5a2df417946fc03273bf))
-   **edition:** fix type constant routes ([01025d9](https://github.com/webern-unibas-ch/awg-app/commit/01025d90cb88ed1bba30c7c691137286fc05e72d))
-   **edition:** highlight active convolute items with partials ([8742f70](https://github.com/webern-unibas-ch/awg-app/commit/8742f70724b9eab13bfa0f5cc71fe5bbbfe92867))
-   **edition:** move SVG item navigation to the left ([5db1f5a](https://github.com/webern-unibas-ch/awg-app/commit/5db1f5aae8c6a712f3b8b9199b72ed110c3e6df3))
-   **edition:** remove route constants from EditionComplex model ([f3c580e](https://github.com/webern-unibas-ch/awg-app/commit/f3c580ea81e0d27a07a9f9b7f1a8aeff46cfcb97))
-   **edition:** return empty textcritics if none is selected ([58eaede](https://github.com/webern-unibas-ch/awg-app/commit/58eaedea7be2a35083e1b2e96c215294103146ec))
-   **edition:** show convolute only for sketch editions ([327eb11](https://github.com/webern-unibas-ch/awg-app/commit/327eb1194ba616b4bd879d721b5ffdeb406fb12f))
-   **edition:** use editionRouteConstants in editionInfo ([291aa4f](https://github.com/webern-unibas-ch/awg-app/commit/291aa4ff1cd24029713bbdbb507d79ff8d8721f6))
-   **edition:** use polyline instead of line for convolute content items ([cec58f1](https://github.com/webern-unibas-ch/awg-app/commit/cec58f12ecd3310a15a18aee29a9eede10e733a7))
-   **home:** use pageMetaData in home-view ([ca6e9d2](https://github.com/webern-unibas-ch/awg-app/commit/ca6e9d24965a0c6c2239558c7357b5002238da97))
-   **shared:** fix typo in modal snippets ([bc5926f](https://github.com/webern-unibas-ch/awg-app/commit/bc5926fd9e004af2a48ee6703952767ee07937cd))

### Continuous Integration

-   **gh-actions:** fix wording ([8b22c21](https://github.com/webern-unibas-ch/awg-app/commit/8b22c216efe67dfb4049250996fc024af0d3e19b))

### Documentation

-   **app:** update code of conduct ([6bc8b11](https://github.com/webern-unibas-ch/awg-app/commit/6bc8b11ff4858bf96ec911e55598c12ffe8f17b7))
-   **README:** fix contributors names ([e108589](https://github.com/webern-unibas-ch/awg-app/commit/e10858955981b7e3b6eb85115bc294aae44ab54f))
-   **README:** fix wording ([da58e13](https://github.com/webern-unibas-ch/awg-app/commit/da58e1345b926cbee053e17637f01bffb1901173))
-   **README:** fix workflow badges ([c328935](https://github.com/webern-unibas-ch/awg-app/commit/c32893592603bdac8f75e79b37624efc9372f0aa))
-   **README:** update badges ([999bf6c](https://github.com/webern-unibas-ch/awg-app/commit/999bf6c6e95287030c0fce041f5d9631385c572a))

### Styles

-   **edition:** remove border from dropdown buttons in SVG sheet nav ([8a36896](https://github.com/webern-unibas-ch/awg-app/commit/8a36896a28daea3285d9f5e795b0c99b9dad6c1d))

### Tests

-   **app:** fix deprecated syntax in tests ([365b08b](https://github.com/webern-unibas-ch/awg-app/commit/365b08bce7892a90fff4848fa796610e6c20cc9d))
-   **app:** fix smaller issues in some tests ([066d482](https://github.com/webern-unibas-ch/awg-app/commit/066d48291bd9c5b3689731d07bb7c70bc1b5f270))
-   **contact:** fix deprecated syntax in tests for contact-view ([cdd5575](https://github.com/webern-unibas-ch/awg-app/commit/cdd5575287e4844534814819df27150ef48c36fe))
-   **core:** add tests for navbar view ([c941ab3](https://github.com/webern-unibas-ch/awg-app/commit/c941ab32f823fceab4dce0320564931fcda3ebae))
-   **core:** complete test suite for storage service ([04bf0af](https://github.com/webern-unibas-ch/awg-app/commit/04bf0af13ea90250e9e9379d245d30cb7bb04b1b))
-   **edition:** add and fix tests after changes for SvgSheetFooter ([ca71d50](https://github.com/webern-unibas-ch/awg-app/commit/ca71d50d1a9b63c4f00e762523d0467be39dc5fa))
-   **edition:** add final tests for EditionSvgDrawingService ([aff6491](https://github.com/webern-unibas-ch/awg-app/commit/aff6491724e939b47ee8cf90ff19d6b73149ea4c))
-   **edition:** add tests for EditionComplexCard ([08762a6](https://github.com/webern-unibas-ch/awg-app/commit/08762a6871565aa6162b2f046196b2b970f4576a))
-   **edition:** add tests for EditionSectionDetail ([37298fd](https://github.com/webern-unibas-ch/awg-app/commit/37298fd0168409206e7fd605c9f8872d8764d88f))
-   **edition:** add tests for EditionService ([e0bd84d](https://github.com/webern-unibas-ch/awg-app/commit/e0bd84d19114a1100e5c9f7acca31d9cc1c14ba6))
-   **edition:** fix inccorect route ([12ab558](https://github.com/webern-unibas-ch/awg-app/commit/12ab558871dca5bfad0c52778dcf4c6d1f76ffc5))
-   **edition:** fix tests for EditionConvoluteCmp ([d86e755](https://github.com/webern-unibas-ch/awg-app/commit/d86e7551d0f2e63ad9c0d1fc63d9eb0560fbebad))
-   **edition:** rename variables in Intro and Report tests ([2a1565c](https://github.com/webern-unibas-ch/awg-app/commit/2a1565c3aa5ef7a4c908dce1c91668f736bf15ca))
-   **edition:** update tests for AccoladeComponent after changes ([fa0d888](https://github.com/webern-unibas-ch/awg-app/commit/fa0d888cec93c6500ffc193129bfab9ff314756f))
-   **home:** add tests for pageMetaData in home-view ([0bec8d1](https://github.com/webern-unibas-ch/awg-app/commit/0bec8d17324a6b6990d5acfdd7e39a4c97fe1216))
-   **home:** fix wrong route ([885a6ce](https://github.com/webern-unibas-ch/awg-app/commit/885a6ce9c009c12305f010f6a8bfec64a973625b))
-   **search:** add tests for full text search form ([2895968](https://github.com/webern-unibas-ch/awg-app/commit/28959689ad36f9ec8491b2c964604f99fed71923))
-   **shared:** adjust tests for view handle button group ([2e27928](https://github.com/webern-unibas-ch/awg-app/commit/2e279288fdec73999ab3f990f3bc7b019d4137c3))

### Code Refactoring

-   **app:** organize imports ([17b37b4](https://github.com/webern-unibas-ch/awg-app/commit/17b37b4dce8988fcdfe8339693b7a07a2976480e))
-   **edition:** clean up edition section detail ([1a72ae0](https://github.com/webern-unibas-ch/awg-app/commit/1a72ae0b348a30b6866252ea20d7a5a5cde597e1))
-   **edition:** fix selector for renamed EditionSvgSheetViewerCmp ([a1b23a5](https://github.com/webern-unibas-ch/awg-app/commit/a1b23a5565875003a3a9646b05cf0e92ffc2db4b))
-   **edition:** move assets constants into separate class ([a2c90f8](https://github.com/webern-unibas-ch/awg-app/commit/a2c90f8a28a53fe9286dd70a94a35b7b3bca39ef))
-   **edition:** move catalogue types into separate class ([2d82d0d](https://github.com/webern-unibas-ch/awg-app/commit/2d82d0d907549300edfee383e684dd6efee83ab1))
-   **edition:** move EDITION_ASSETS_DATA to data ([2cd004e](https://github.com/webern-unibas-ch/awg-app/commit/2cd004e6e68dd27a4f8d32d0017f81c97b64ab70))
-   **edition:** move EDITION_FIRM_SIGNS_DATA to data ([2d699e5](https://github.com/webern-unibas-ch/awg-app/commit/2d699e5894058d051b28039d8a4686d42666cc5c))
-   **edition:** move EDITION_GRAPH_IMAGES_DATA to data ([033f005](https://github.com/webern-unibas-ch/awg-app/commit/033f005766dbb71a0e20f9834be29f66de926637))
-   **edition:** move editionTypes into separate class ([5788e96](https://github.com/webern-unibas-ch/awg-app/commit/5788e96e71ca02449615dcda71beb6669b5b5989))
-   **edition:** refactor EditionFirmSignConstants ([ea95222](https://github.com/webern-unibas-ch/awg-app/commit/ea952227a4f28321b91f80a09644d56eda3ef3a5))
-   **edition:** refactor EditionGraphImageConstants ([eabb1b3](https://github.com/webern-unibas-ch/awg-app/commit/eabb1b3443a6748f53d300e20302aaf433dd63a3))
-   **edition:** refactor onSvgSelect methods in EditionSheetsCmp ([4191146](https://github.com/webern-unibas-ch/awg-app/commit/41911467d80040effd60274acb04e56ef2766c59))
-   **edition:** rename EDITION_CATALOGUE_TYPES ([1885f6e](https://github.com/webern-unibas-ch/awg-app/commit/1885f6e32b7705315c0e4e21d859f8f63ad992a2))
-   **edition:** rename EditionAssetsConstants --> EDITION_ASSETS_DATA ([a72aa6b](https://github.com/webern-unibas-ch/awg-app/commit/a72aa6b458bf13c7dd1a25ddd4e325545a3de6db))
-   **edition:** rename EditionRoute --> EditionRouteInfo ([fbf1636](https://github.com/webern-unibas-ch/awg-app/commit/fbf1636d3fdb39beddc9c6637e63217e7294f314))
-   **edition:** rename EditionRouteConstants ([8d22a30](https://github.com/webern-unibas-ch/awg-app/commit/8d22a30db5d254ab1792954b686e537584e35edc))
-   **edition:** rename EditionRouteInfo -> EditionRouteConstant ([7c1fae6](https://github.com/webern-unibas-ch/awg-app/commit/7c1fae6bc155587038c52ba4ee1fbc7a2fd7b7c1))
-   **edition:** rename EditionSvgSheetCmp to EditionSvgSheetViewerCmp ([cb45d60](https://github.com/webern-unibas-ch/awg-app/commit/cb45d60922f14216a02b49dec98930da52c0c81d))
-   **edition:** rename FolioOverview --> EditionFolioViewer ([26f312c](https://github.com/webern-unibas-ch/awg-app/commit/26f312cb2a8976fe8639974977bcc2ae03591961))
-   **edition:** rename LinkBox --> EditionSvgLinkBox ([f346877](https://github.com/webern-unibas-ch/awg-app/commit/f346877132c6d297e11e428e33fff78098aaab2e))
-   **edition:** separate different kinds of edition constants ([7b3282a](https://github.com/webern-unibas-ch/awg-app/commit/7b3282a04769a6f780a1949c01b1d0715e3b39ef))
-   **edition:** separate EDITION_ROUTE_CONSTANTS ([80a1bef](https://github.com/webern-unibas-ch/awg-app/commit/80a1befdb89907a44371762a8bdc8925d6b3210b))
-   **edition:** separate EditonRouteConstant model ([29e3bd5](https://github.com/webern-unibas-ch/awg-app/commit/29e3bd55154d404f1e7180586db41ba1ac67cfdb))
-   **edition:** separate outline models ([bf74136](https://github.com/webern-unibas-ch/awg-app/commit/bf7413633ad518f8c7cbdfb0d561d5a1b707f97b))
-   **edition:** simplify findConvolute method in EditionSheetsCmp ([9d14bb2](https://github.com/webern-unibas-ch/awg-app/commit/9d14bb25ff3fcd03bfac2369a8e4adf7e905eeee))
-   **edition:** simplify functions for SVG sheets ([9a272e1](https://github.com/webern-unibas-ch/awg-app/commit/9a272e1d1e6bc4bc23d84872efb70e79d64bccca))
-   **edition:** simplify onLinkBoxSelect method in EditionSheetsCmp ([ffc3853](https://github.com/webern-unibas-ch/awg-app/commit/ffc385395fce2ac5f70f52ffbf2ec07aac6bb821))
-   **edition:** simplify onOverlaySelect method in EditionSheetsCmp ([482d410](https://github.com/webern-unibas-ch/awg-app/commit/482d4108f39e744386f8a3e3e283f4a687f97c9a))
-   **edition:** use EDITION_ROUTE_CONSTANTS consistently ([195fcdc](https://github.com/webern-unibas-ch/awg-app/commit/195fcdc2f704f692bed09b0ac97c1a8f084c7303))
-   **edition:** use EDITION_ROUTE_CONSTANTS in EditionComplex ([6849a48](https://github.com/webern-unibas-ch/awg-app/commit/6849a4841b78dc53db241337db1fd285f71d4ac8))
-   **edition:** use EDITION_ROUTE_CONSTANTS in EditionDetailNav ([a155fea](https://github.com/webern-unibas-ch/awg-app/commit/a155feaab112842a0dce0103b28b280c4eedf309))
-   **edition:** use EDITION_ROUTE_CONSTANTS in EditionInfoComponent ([7382a58](https://github.com/webern-unibas-ch/awg-app/commit/7382a580366b106218baaba16a3d67eed038349c))
-   **edition:** use EDITION_ROUTE_CONSTANTS in EditionIntro ([a419399](https://github.com/webern-unibas-ch/awg-app/commit/a4193993a90f74c501a3e7ca3758b3e29e203516))
-   **edition:** use EDITION_ROUTE_CONSTANTS in EditionReport ([71ecedc](https://github.com/webern-unibas-ch/awg-app/commit/71ecedce55aff0603a16d1613f7b9634b334e2c0))
-   **edition:** use EDITION_ROUTE_CONSTANTS in EditionSheets ([6eaa74e](https://github.com/webern-unibas-ch/awg-app/commit/6eaa74e1a86bb95ed172be93d85ace74e4386654))
-   **edition:** use EDITION_ROUTE_CONSTANTS in EditionView ([0cd2743](https://github.com/webern-unibas-ch/awg-app/commit/0cd27433ead4d6c34cefcf94dc23ed533221dca5))
-   **edition:** use EDITION_ROUTE_CONSTANTS in HomeView ([8e29ad0](https://github.com/webern-unibas-ch/awg-app/commit/8e29ad0ca94a8e55523df5be49991410e1d01f89))
-   **edition:** use EDITION_ROUTE_CONSTANTS in Navbar ([2190d78](https://github.com/webern-unibas-ch/awg-app/commit/2190d785c8dbad980e9e42c70ede5cf8e77a7d17))
-   **edition:** use EDITION_ROUTE_CONSTANTS in SourceEvaluation ([5694dcc](https://github.com/webern-unibas-ch/awg-app/commit/5694dcc76fcf972dff1ae2fa5353768724bc3826))

### Build System

-   **app:** add import/no-cycle rule to linter ([b62258a](https://github.com/webern-unibas-ch/awg-app/commit/b62258a373e4b224a030774d6d0b9cfb00981cec))
-   **app:** switch order of generated CHANGELOG types ([bbebbe1](https://github.com/webern-unibas-ch/awg-app/commit/bbebbe1fb8faab8fbe750d3d01595140a5f5e02a))
-   **deps-dev:** add eslint-plugin-deprecation package ([32352db](https://github.com/webern-unibas-ch/awg-app/commit/32352dbc2f05259f3771f3986a4808527055be5f))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) packages from 15.2.0 to 15.2.1 ([19e1d69](https://github.com/webern-unibas-ch/awg-app/commit/19e1d69e1c2aaefb43fe654629bcded4141d79e8))
-   **deps-dev:** bump [@angular](https://github.com/angular) packages from 15.0.4 to 15.1.0 ([1149c38](https://github.com/webern-unibas-ch/awg-app/commit/1149c384a05f525f07fa7b340475d279aa77ab86))
-   **deps-dev:** bump [@angular](https://github.com/angular) packages from 15.1.1 to 15.1.2 ([55a5445](https://github.com/webern-unibas-ch/awg-app/commit/55a54453b1e8e7abfe4dff0a79acd166d38594bc))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.3.0 to 17.4.0 ([5f8ead1](https://github.com/webern-unibas-ch/awg-app/commit/5f8ead1b3f432fb68182eb85b3a13b320046ca7a))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.4.1 to 17.4.2 ([f85ac01](https://github.com/webern-unibas-ch/awg-app/commit/f85ac019123f6bea99cc629f7f9f10adc8110faf))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.4.2 to 17.4.3 ([8d56ccd](https://github.com/webern-unibas-ch/awg-app/commit/8d56ccd64ec63098c73ac459a049629ec373d32a))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.4.3 to 17.4.4 ([484be2e](https://github.com/webern-unibas-ch/awg-app/commit/484be2e4bec8e724ca5a4ab7aea9a3c85a33d869))
-   **deps-dev:** bump [@typescript-eslin](https://github.com/typescript-eslin) packages from 5.48.2 to 5.49.0 ([b69f1eb](https://github.com/webern-unibas-ch/awg-app/commit/b69f1eb7b3bcaf7f8d847bc4e996a589dfc82efc))
-   **deps-dev:** bump [@typescript-eslin](https://github.com/typescript-eslin) packages from 5.49.0 to 5.51.0 ([d452985](https://github.com/webern-unibas-ch/awg-app/commit/d452985ea1be346fd3a380806b1155a46cfe482f))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.47.0 to 5.47.1 ([01a3609](https://github.com/webern-unibas-ch/awg-app/commit/01a3609143f13a3f83eb6a8a83c08838744f6414))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.47.1 to 5.48.0 ([0f4d4eb](https://github.com/webern-unibas-ch/awg-app/commit/0f4d4ebf0f6b8897bbc9c661b73b90a2012b35c1))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.48.0 to 5.48.1 ([699c177](https://github.com/webern-unibas-ch/awg-app/commit/699c17729900b0fe7e6aee9582bec92612138ca1))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.51.0 to 5.52.0 ([21635a9](https://github.com/webern-unibas-ch/awg-app/commit/21635a94227541852340a87e34a96ef340eeb3b1))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.52.0 to 5.53.0 ([6671f0a](https://github.com/webern-unibas-ch/awg-app/commit/6671f0a6c76db986e8b35e49ff805546de392e9e))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.0.4 to 15.0.5 ([36b2ba3](https://github.com/webern-unibas-ch/awg-app/commit/36b2ba3634fe01c1f70baae6dc1c5ca461fd46f1))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.0.5 to 15.1.1 ([6de91d9](https://github.com/webern-unibas-ch/awg-app/commit/6de91d9dec8e8a2debcb72c1f5698fc0181e4178))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.1.1 to 15.1.2 ([f65ec69](https://github.com/webern-unibas-ch/awg-app/commit/f65ec69244d3a76708303c052bb2438edb591da8))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.1.2 to 15.1.3 ([93b4f2f](https://github.com/webern-unibas-ch/awg-app/commit/93b4f2f58ab756eee22fc3a6309790fbd9c090ec))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.1.3 to 15.1.5 ([3f63939](https://github.com/webern-unibas-ch/awg-app/commit/3f63939ed271ea2fc58abcfbddbb496cc3049e8b))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.1.5 to 15.1.6 ([f9678ec](https://github.com/webern-unibas-ch/awg-app/commit/f9678ec176c7f2f94fe62be08f95ce19099254b8))
-   **deps-dev:** bump @angular/{cli,build-angular} from 15.1.6 to 15.2.0 ([9268c23](https://github.com/webern-unibas-ch/awg-app/commit/9268c23c75e31027c80462d43b802018ebb5ac75))
-   **deps-dev:** bump @commitlint/cli from 17.4.0 to 17.4.1 ([72abbd2](https://github.com/webern-unibas-ch/awg-app/commit/72abbd231f07f725658635312871a3ae39779527))
-   **deps-dev:** bump @types/node from 16.18.10 to 16.18.11 ([5261b9a](https://github.com/webern-unibas-ch/awg-app/commit/5261b9aa001ac52b985157cac1b7929eb8bda405))
-   **deps-dev:** bump @types/node from 16.18.11 to 16.18.12 ([e08731b](https://github.com/webern-unibas-ch/awg-app/commit/e08731be217f479882f1316129b9e55b813a5043))
-   **deps-dev:** bump eslint from 8.30.0 to 8.31.0 ([9f78ed4](https://github.com/webern-unibas-ch/awg-app/commit/9f78ed4ae2fb33064f80dc5a5a0ba669c1f7dbd2))
-   **deps-dev:** bump eslint from 8.32.0 to 8.33.0 ([b87c8de](https://github.com/webern-unibas-ch/awg-app/commit/b87c8de61aafd1fbaaacf3f13dd780548d7367a2))
-   **deps-dev:** bump eslint from 8.33.0 to 8.34.0 ([ca5fe6f](https://github.com/webern-unibas-ch/awg-app/commit/ca5fe6fb9042e75a1ebb67c89513f8d3fe823a0e))
-   **deps-dev:** bump eslint-config-prettier from 8.5.0 to 8.6.0 ([28f721c](https://github.com/webern-unibas-ch/awg-app/commit/28f721ccb88b9a55008d6da98c64e1ca95437dd0))
-   **deps-dev:** bump eslint-plugin-import from 2.26.0 to 2.27.4 ([d85d35f](https://github.com/webern-unibas-ch/awg-app/commit/d85d35fd2163d67eb50c1841594b5663c64a0ec6))
-   **deps-dev:** bump eslint-plugin-jsdoc from 39.6.4 to 39.6.6 ([b78c997](https://github.com/webern-unibas-ch/awg-app/commit/b78c99772e7d442a50459d08663ba55f922d53bc))
-   **deps-dev:** bump eslint-plugin-jsdoc from 39.6.6 to 39.6.8 ([b07a0ef](https://github.com/webern-unibas-ch/awg-app/commit/b07a0ef231398296d676bd3a681cbd9d71d75940))
-   **deps-dev:** bump eslint-plugin-jsdoc from 39.6.6 to 39.8.0 ([151bde2](https://github.com/webern-unibas-ch/awg-app/commit/151bde261790b56dcd744e3fc02885439c9feb2d))
-   **deps-dev:** bump eslint-plugin-jsdoc from 39.8.0 to 40.0.0 ([d6f0bd6](https://github.com/webern-unibas-ch/awg-app/commit/d6f0bd66e0964b071f96ac680e0ad5c4d8c70728))
-   **deps-dev:** bump husky from 8.0.2 to 8.0.3 ([a26e613](https://github.com/webern-unibas-ch/awg-app/commit/a26e61371fd55328eb9e85e921bc6ddcb5f4c3ea))
-   **deps-dev:** bump lint related packages to latest version ([0869083](https://github.com/webern-unibas-ch/awg-app/commit/08690830e41ed3b47947db667a059f8a5bc69783))
-   **deps-dev:** bump lint related packages to latest version ([4edd35e](https://github.com/webern-unibas-ch/awg-app/commit/4edd35ec54911076a50e39ba1dab13cf4384b17a))
-   **deps-dev:** bump lint-staged from 13.1.0 to 13.1.1 ([50d7934](https://github.com/webern-unibas-ch/awg-app/commit/50d793478567a03c01d7e1aee30a2a7b55546924))
-   **deps-dev:** bump lint-staged from 13.1.1 to 13.1.2 ([8779335](https://github.com/webern-unibas-ch/awg-app/commit/8779335f58747cd178d152d689eb5c24849c03d2))
-   **deps-dev:** bump prettier from 2.8.1 to 2.8.2 ([1be552e](https://github.com/webern-unibas-ch/awg-app/commit/1be552e6e8affc436ffd0f0e37390cc1ae0ee6b0))
-   **deps-dev:** bump prettier from 2.8.2 to 2.8.3 ([ba7c72e](https://github.com/webern-unibas-ch/awg-app/commit/ba7c72e48611c0b2a4d5dda0c8d01a133abc081b))
-   **deps-dev:** bump prettier from 2.8.3 to 2.8.4 ([0905a8d](https://github.com/webern-unibas-ch/awg-app/commit/0905a8da495ea34b4f9302510062b0af2396cd85))
-   **deps-dev:** bump webpack-bundle-analyzer from 4.7.0 to 4.8.0 ([6298cee](https://github.com/webern-unibas-ch/awg-app/commit/6298cee540c41bc0268844b67a7c3d904c773970))
-   **deps-dev:** clean up yarn.lock file after updates ([eed4ef9](https://github.com/webern-unibas-ch/awg-app/commit/eed4ef929b34438ed2a7fed551cfe25fb769157a))
-   **deps-dev:** get rid of deprecated cross-var ([4fb247f](https://github.com/webern-unibas-ch/awg-app/commit/4fb247f3e348b2ef9061a7581da3fe850e6f0526))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.1.0 to 15.1.1 ([0f494de](https://github.com/webern-unibas-ch/awg-app/commit/0f494de9c6f4f7fe255e94ad9c07d1e9f95c1ce9))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.1.2 to 15.1.4 ([b68d82e](https://github.com/webern-unibas-ch/awg-app/commit/b68d82e80a5648923a2fd575393565d8e03cd913))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.1.4 to 15.1.5 ([4b45334](https://github.com/webern-unibas-ch/awg-app/commit/4b45334ab26c02d20519e22b401ec82dc16e1721))
-   **deps:** bump [@angular](https://github.com/angular) packages from 15.1.6 to 15.2.0 ([6ae8776](https://github.com/webern-unibas-ch/awg-app/commit/6ae8776ed71486ee05ebe4db17271540935f0664))
-   **deps:** bump [@fortawesome](https://github.com/fortawesome) packages from 6.2.1 to 6.3.0 ([7076519](https://github.com/webern-unibas-ch/awg-app/commit/7076519c4105f6e34ae12110aaec9d4a7b501baa))
-   **deps:** bump @fortawesome/angular-fontawesome from 0.12.0 to 0.12.1 ([23d5e8a](https://github.com/webern-unibas-ch/awg-app/commit/23d5e8a5e16240ca6cbbdf7ec299df72e416bd00))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 14.0.0 to 14.0.1 ([583e432](https://github.com/webern-unibas-ch/awg-app/commit/583e432470917c4ef09fc83b2ac3cf5004790f6e))
-   **deps:** bump http-cache-semantics from 4.1.0 to 4.1.1 ([6b78991](https://github.com/webern-unibas-ch/awg-app/commit/6b789917d8edd150bcfc7f912257f9f0993973f0))
-   **deps:** bump rdfstore from v0.9.18-alpha.7 to v0.9.18-alpha.8 ([60352cf](https://github.com/webern-unibas-ch/awg-app/commit/60352cf7ca0338c0cd37b05d508c7874bdc32b7c))
-   **deps:** bump rdfstore from v0.9.18-alpha.8 to v0.9.18-alpha.9 ([44c86de](https://github.com/webern-unibas-ch/awg-app/commit/44c86de2b83f1739a7e697e207d38a0ad885449c))
-   **deps:** bump ua-parser-js from 0.7.32 to 0.7.33 ([43a4343](https://github.com/webern-unibas-ch/awg-app/commit/43a43433bc4a1657024ce7862e435cd01cac0952))
-   **gh-actions:** update codeql-analysis.yml ([3344eab](https://github.com/webern-unibas-ch/awg-app/commit/3344eab3c96fc2467db95a50a6c908e579513e86))

### [0.9.3](https://github.com/webern-unibas-ch/awg-app/compare/v0.9.2...v0.9.3) (2022-12-20)

### Features

-   **edition:** use updated codemirror editor in GraphVisualizer ([e635a26](https://github.com/webern-unibas-ch/awg-app/commit/e635a2672539edc5b02dbd6c2d1a529af2a54fae))
-   **shared:** add editor instance of CodeMirror 6 ([d2f1ff8](https://github.com/webern-unibas-ch/awg-app/commit/d2f1ff82d02a2ffbb6058e79bef78c648f49d555))

### Bug Fixes

-   **assets:** fix brackets in source description for M34 ([07a9c95](https://github.com/webern-unibas-ch/awg-app/commit/07a9c9571fa0087080b973a6a0043e837c715f32); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** fix typo in source description for M34 Sk3 ([f2d4486](https://github.com/webern-unibas-ch/awg-app/commit/f2d448689341022dc01453a0d736e0fef9c1492e); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** minor fixes in textcritics of M212_Sk2 ([90d8a90](https://github.com/webern-unibas-ch/awg-app/commit/90d8a90654c78d366d341cf3d10c19411e55c91f); thanks to [@masthom](https://github.com/masthom))
-   **edition:** generate evaluation placeholder from component ([b06ac37](https://github.com/webern-unibas-ch/awg-app/commit/b06ac373f76833d1cbdb7c3db46392e55dc935a3))
-   **edition:** generate intro placeholder from component ([ceac4b8](https://github.com/webern-unibas-ch/awg-app/commit/ceac4b8f11499881a83bbae79ffbe6f1b4079175))
-   **shared:** remove B from OP25_SOURCE_NOT_AVAILABLE modal ([3dca7fa](https://github.com/webern-unibas-ch/awg-app/commit/3dca7fafe66bdd272bf8796cd6511ca984c0323c)), closes [#650](https://github.com/webern-unibas-ch/awg-app/issues/650)

### Styles

-   **app:** apply changes after prettier update ([9115e3e](https://github.com/webern-unibas-ch/awg-app/commit/9115e3e747785602f162b0a5012c87859086f6ac))

### Continuous Integration

-   **gh-actions:** adjust version for node 14 ([23af8c2](https://github.com/webern-unibas-ch/awg-app/commit/23af8c247b38b4072d8fcbefa6696f3c04f08f84))
-   **gh-actions:** update node version to 16.18 ([cac4879](https://github.com/webern-unibas-ch/awg-app/commit/cac4879e8a0fa5c270833ced365ba9174fc359b0))

### Build System

-   **app:** update targetted ES versions in tsconfig ([a586614](https://github.com/webern-unibas-ch/awg-app/commit/a58661489c573bff35610d48d20fdadae618ce54))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) packages from 14.1.2 to 14.2.0 ([39cdaa3](https://github.com/webern-unibas-ch/awg-app/commit/39cdaa364e4d5337f90fa75de2298e8aa47c6abf))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) packages from 14.1.2 to 14.4.0 ([e73837c](https://github.com/webern-unibas-ch/awg-app/commit/e73837cf2a0621f0bdd7f784105c43b354fa4666))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) packages from 14.4.0 to 15.1.0 ([8d9feb4](https://github.com/webern-unibas-ch/awg-app/commit/8d9feb4faaa54ac3a85cd98f6b76d23e102e1778))
-   **deps-dev:** bump [@angular](https://github.com/angular) packages from 15.0.1 to 15.0.4 ([f8eb62e](https://github.com/webern-unibas-ch/awg-app/commit/f8eb62eec3cace49dafa83c084340999fe310ff4))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) related packages from 17.2.0 to 17.3.0 ([ef383b1](https://github.com/webern-unibas-ch/awg-app/commit/ef383b182081e0b5a1cfcc25364c334b4160b8c9))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.42.1 to 5.43.0 ([93067ca](https://github.com/webern-unibas-ch/awg-app/commit/93067ca5f318b93678ec61b171f9c0fd0df8c494))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.43.0 to 5.44.0 ([ef81899](https://github.com/webern-unibas-ch/awg-app/commit/ef818999ec5315dcfe15064272769c2d81d2079d))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.45.0 to 5.47.0 ([7ccf09f](https://github.com/webern-unibas-ch/awg-app/commit/7ccf09f4972bce3de06d4d8b35a3435cd90c9f2d))
-   **deps-dev:** bump @angular-devkit/build-angular ([02ded88](https://github.com/webern-unibas-ch/awg-app/commit/02ded889f442f729a3b1c9caaeccd9ecd9ae4d9c))
-   **deps-dev:** bump @angular-devkit/build-angular ([ac016e1](https://github.com/webern-unibas-ch/awg-app/commit/ac016e14b24fad0f7e7e001f859ea60020abec71))
-   **deps-dev:** bump @angular-devkit/build-angular ([0c43941](https://github.com/webern-unibas-ch/awg-app/commit/0c43941eba6705e060c8f5eaa86ddd91a6c7c412))
-   **deps-dev:** bump @angular-devkit/build-angular ([fa1b03b](https://github.com/webern-unibas-ch/awg-app/commit/fa1b03b48718284e6e9a29134b9b204c761c6828))
-   **deps-dev:** bump @angular/cli from 14.2.10 to 14.2.11 ([0b2e010](https://github.com/webern-unibas-ch/awg-app/commit/0b2e0104345449847a6d9673b06b7edf01030ef8))
-   **deps-dev:** bump @angular/cli from 14.2.5 to 14.2.6 ([49a12c6](https://github.com/webern-unibas-ch/awg-app/commit/49a12c61b4769f76bc45b902116ba4662ce93184))
-   **deps-dev:** bump @angular/cli from 14.2.6 to 14.2.7 ([12a78dc](https://github.com/webern-unibas-ch/awg-app/commit/12a78dcfe84271767f5b3b16e12bcb698f0e8a2f))
-   **deps-dev:** bump @angular/cli from 14.2.7 to 14.2.8 ([9e612cd](https://github.com/webern-unibas-ch/awg-app/commit/9e612cddebe9c5bcb6640d4d2195214fd158213d))
-   **deps-dev:** bump @angular/cli from 14.2.8 to 14.2.9 ([c43fcb6](https://github.com/webern-unibas-ch/awg-app/commit/c43fcb69ebf0a31cb8fbaaad5f9ca7513cad9d78))
-   **deps-dev:** bump @angular/cli from 14.2.9 to 14.2.10 ([6f48e68](https://github.com/webern-unibas-ch/awg-app/commit/6f48e681924a03bb75e199ffed4da91297c1d13e))
-   **deps-dev:** bump @angular/cli from 15.0.1 to 15.0.2 ([377a80a](https://github.com/webern-unibas-ch/awg-app/commit/377a80aac431dc69a9c94e5b36a95d891f8aef43))
-   **deps-dev:** bump @commitlint/cli from 17.1.2 to 17.2.0 ([68f6476](https://github.com/webern-unibas-ch/awg-app/commit/68f6476257077165d311735355468dc5ec1775c4))
-   **deps-dev:** bump @commitlint/config-angular from 17.1.0 to 17.2.0 ([2a53a6e](https://github.com/webern-unibas-ch/awg-app/commit/2a53a6ec25346637953ad635065d341eff8ecf10))
-   **deps-dev:** bump @types/jasmine from 4.3.0 to 4.3.1 ([03c1b7d](https://github.com/webern-unibas-ch/awg-app/commit/03c1b7d467520bad6c4d610a7c0679bbcd70d50a))
-   **deps-dev:** bump @types/node from 16.11.64 to 16.18.0 ([ff1e005](https://github.com/webern-unibas-ch/awg-app/commit/ff1e0056b9deed21fff68bc2c2d70abba8156ab3))
-   **deps-dev:** bump @types/node from 16.18.0 to 16.18.3 ([2fc22ae](https://github.com/webern-unibas-ch/awg-app/commit/2fc22aece53a955a39a280db7e2cb4aff0dbfc63))
-   **deps-dev:** bump @types/node from 16.18.3 to 16.18.10 ([017e57a](https://github.com/webern-unibas-ch/awg-app/commit/017e57aa909e749592443e76c88c5d480fc088e5))
-   **deps-dev:** bump @typescript-eslint/eslint-plugin ([ba065b5](https://github.com/webern-unibas-ch/awg-app/commit/ba065b5b9cc3a92d3d099ec694278145be6dc7f6))
-   **deps-dev:** bump @typescript-eslint/eslint-plugin ([d36b822](https://github.com/webern-unibas-ch/awg-app/commit/d36b82291f6ba0e61a4a9b9e14566cba19e5fb77))
-   **deps-dev:** bump @typescript-eslint/parser from 5.39.0 to 5.40.0 ([934a77f](https://github.com/webern-unibas-ch/awg-app/commit/934a77f30c9af2c0f9c8c0d30102a0a31dcf5715))
-   **deps-dev:** bump @typescript-eslint/parser from 5.40.1 to 5.42.0 ([791cac0](https://github.com/webern-unibas-ch/awg-app/commit/791cac0d5c9b3c7478c27526d15ccff96021eff9))
-   **deps-dev:** bump @typescript-eslint/parser from 5.44.0 to 5.45.0 ([63bca33](https://github.com/webern-unibas-ch/awg-app/commit/63bca33bc279786aeb7af7e88bb7d5a75d5c1fb9))
-   **deps-dev:** bump angular-cli-ghpages from 1.0.3 to 1.0.5 ([a7fd754](https://github.com/webern-unibas-ch/awg-app/commit/a7fd75456d4018e9a118a30528ee3731c6fa9d69))
-   **deps-dev:** bump eslint from 8.27.0 to 8.28.0 ([804f4a9](https://github.com/webern-unibas-ch/awg-app/commit/804f4a9ada8fec8fc4c6c087ae15aa8e224e2bf6))
-   **deps-dev:** bump eslint from 8.28.0 to 8.30.0 ([7bf924b](https://github.com/webern-unibas-ch/awg-app/commit/7bf924b97f6669f00dc1bbb376f73bba2a6e5b21))
-   **deps-dev:** bump eslint related packages to latest version ([291f400](https://github.com/webern-unibas-ch/awg-app/commit/291f4007fe090ceb48fbcaaa3b3155aeedb4c60c))
-   **deps-dev:** bump eslint related packages to latest version ([341673e](https://github.com/webern-unibas-ch/awg-app/commit/341673e8b4016964798abb7bbc7cb24085701b59))
-   **deps-dev:** bump eslint-plugin-jsdoc from 39.3.23 to 39.3.24 ([2856bdb](https://github.com/webern-unibas-ch/awg-app/commit/2856bdb9de836ceba14bdd317ce129175e3b81d2))
-   **deps-dev:** bump eslint-plugin-jsdoc from 39.3.23 to 39.4.0 ([c792e9f](https://github.com/webern-unibas-ch/awg-app/commit/c792e9fa10eabeffbcdc686b6537019402c9aed3))
-   **deps-dev:** bump eslint-plugin-jsdoc from 39.4.0 to 39.6.2 ([003b5cd](https://github.com/webern-unibas-ch/awg-app/commit/003b5cd2a1b0e1dd181b6d2e1373b6fa05d7b07c))
-   **deps-dev:** bump eslint-plugin-jsdoc from 39.6.2.0 to 39.6.3 ([d4fdcbc](https://github.com/webern-unibas-ch/awg-app/commit/d4fdcbc0f600d1405a2f65f026f72db915a5ea24))
-   **deps-dev:** bump eslint-plugin-jsdoc from 39.6.3 to 39.6.4 ([0e8564e](https://github.com/webern-unibas-ch/awg-app/commit/0e8564e216ed5d164e6e2da88e85e5c8c8be0b14))
-   **deps-dev:** bump gzipper from 7.1.0 to 7.2.0 ([6c76bff](https://github.com/webern-unibas-ch/awg-app/commit/6c76bff71eb0f447061e8658e9edc1fbfe48bf58))
-   **deps-dev:** bump husky from 8.0.1 to 8.0.2 ([df11f00](https://github.com/webern-unibas-ch/awg-app/commit/df11f004b3f80ea89ba00c11192ce1b13dff1437))
-   **deps-dev:** bump jasmine-core from 4.4.0 to 4.5.0 ([5757ced](https://github.com/webern-unibas-ch/awg-app/commit/5757cedac5097fcef8eca0ca0e57e2e8a50d91fc))
-   **deps-dev:** bump lint-staged from 13.0.3 to 13.0.4 ([b925950](https://github.com/webern-unibas-ch/awg-app/commit/b9259500b479f5cc183f48672dfebc966dd725b3))
-   **deps-dev:** bump lint-staged from 13.0.4 to 13.1.0 ([691414a](https://github.com/webern-unibas-ch/awg-app/commit/691414aa305d6103c1ef560423f0914f587739bd))
-   **deps-dev:** bump prettier from 2.7.1 to 2.8.0 ([309ee24](https://github.com/webern-unibas-ch/awg-app/commit/309ee246d88a055811dcaa8da3baba016bfecaea))
-   **deps-dev:** bump prettier from 2.8.0 to 2.8.1 ([8260ca3](https://github.com/webern-unibas-ch/awg-app/commit/8260ca3cedeaf415bca3a9333572dccb0c35cb50))
-   **deps-dev:** bump webpack-bundle-analyzer from 4.6.1 to 4.7.0 ([2ef493c](https://github.com/webern-unibas-ch/awg-app/commit/2ef493ce2a2825b1d7aec292a3abaeefc7c89094))
-   **deps:** bump [@angular](https://github.com/angular) packages from 14.2.5 to 14.2.7 ([4a90d87](https://github.com/webern-unibas-ch/awg-app/commit/4a90d87bab83f9f2757ad694be07cccace35f2be))
-   **deps:** bump [@fortawesome](https://github.com/fortawesome) packages from 6.2.0 to 6.2.1 ([1387698](https://github.com/webern-unibas-ch/awg-app/commit/13876989eabf8fe73ed48892ce3c2744839ef34e))
-   **deps:** bump @codemirror/legacy-modes from 6.2.0 to 6.3.0 ([8504469](https://github.com/webern-unibas-ch/awg-app/commit/85044696f9f002869e8cf73560580ef38f764b80))
-   **deps:** bump @codemirror/legacy-modes from 6.3.0 to 6.3.1 ([29697d8](https://github.com/webern-unibas-ch/awg-app/commit/29697d80185b49d6274d73377d177956ae8179ec))
-   **deps:** bump @fortawesome/angular-fontawesome from 0.11.1 to 0.12.0 ([09ad85a](https://github.com/webern-unibas-ch/awg-app/commit/09ad85a2f08ad89613e2b67d05757ccdcba6610c))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 13.0.0 to 13.1.0 ([fde4869](https://github.com/webern-unibas-ch/awg-app/commit/fde4869dae87a0b42caa0fc248c1c78a5828011c))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 13.1.0 to 13.1.1 ([3db0e3a](https://github.com/webern-unibas-ch/awg-app/commit/3db0e3a5f93d36cc7ba1462b648c7444cb470d07))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 13.1.1 to 14.0.0 ([36d030e](https://github.com/webern-unibas-ch/awg-app/commit/36d030e06bf9059b875982ac6654646c412eac61))
-   **deps:** bump angular related packages from 14.2.10 to 14.2.11 ([e74e3c9](https://github.com/webern-unibas-ch/awg-app/commit/e74e3c945dc3dd95f3aab49c4a3d248d08c490d2))
-   **deps:** bump angular related packages from 14.2.7 to 14.2.10 ([6a8f847](https://github.com/webern-unibas-ch/awg-app/commit/6a8f8473eeb039e47f174a21ece0cdd7e7c93481))
-   **deps:** bump bootstrap from 5.2.2 to 5.2.3 ([fc5c4d4](https://github.com/webern-unibas-ch/awg-app/commit/fc5c4d46c4df0e2bbe870308c23e9cac4f166356))
-   **deps:** bump engine.io from 6.2.0 to 6.2.1 ([4d62160](https://github.com/webern-unibas-ch/awg-app/commit/4d6216012a926e54a4200f37a189274fbea2b521))
-   **deps:** bump loader-utils from 2.0.0 to 2.0.3 ([1bb3aab](https://github.com/webern-unibas-ch/awg-app/commit/1bb3aab9c1dbe26fd601aa1d513cf1eb5fa99aac))
-   **deps:** bump loader-utils from 2.0.3 to 2.0.4 ([b959589](https://github.com/webern-unibas-ch/awg-app/commit/b9595895a1a80f8d84ad29949567fd122a31f2b0))
-   **deps:** bump n3 from 1.16.2 to 1.16.3 ([a50cfc3](https://github.com/webern-unibas-ch/awg-app/commit/a50cfc33bb12b21e6b393bf1f7b61aebf4bc82c6))
-   **deps:** bump ngx-json-viewer from 3.1.0 to 3.2.0 ([c826197](https://github.com/webern-unibas-ch/awg-app/commit/c826197498089a18c926593f51ad5bdeb32757b6))
-   **deps:** bump ngx-json-viewer from 3.2.0 to 3.2.1 ([b1c11bd](https://github.com/webern-unibas-ch/awg-app/commit/b1c11bdb49d0adbaee63194ee0715e0e7f13e65d))
-   **deps:** bump rdfstore from v0.9.18-alpha.6 to v0.9.18-alpha.7 ([1d9ebf9](https://github.com/webern-unibas-ch/awg-app/commit/1d9ebf9b5fa1bfe1849265d83fa7001520431717))
-   **deps:** bump rxjs from 7.5.7 to 7.8.0 ([263f650](https://github.com/webern-unibas-ch/awg-app/commit/263f650b8901feb2a895b324d17c44cefb8203a5))
-   **deps:** bump socket.io-parser from 4.0.4 to 4.0.5 ([c25ff4f](https://github.com/webern-unibas-ch/awg-app/commit/c25ff4fafc84b31e081c7ec181805943913808ee))
-   **deps:** bump SonarSource/sonarcloud-github-action from 1.7 to 1.8 ([3432d3a](https://github.com/webern-unibas-ch/awg-app/commit/3432d3a8ae0ad8fedd507b3656a299396fbdba02))
-   **deps:** bump tslib from 2.4.0 to 2.4.1 ([421a76f](https://github.com/webern-unibas-ch/awg-app/commit/421a76f886f250c7323610dad3fa25f4977a0d07))
-   **deps:** bump zone.js from 0.11.8 to 0.12.0 ([1df9d51](https://github.com/webern-unibas-ch/awg-app/commit/1df9d51dd01aec9e50ebf03d944939af63506415))
-   **deps:** move from codemirror 5 to version 6 ([16a4fd8](https://github.com/webern-unibas-ch/awg-app/commit/16a4fd81aa86f765f0dcc572c23a620fd387ce03))
-   **deps:** update [@angular](https://github.com/angular) to version 15 ([3b6d714](https://github.com/webern-unibas-ch/awg-app/commit/3b6d7144c55ef67eaf32db4353c4000df0a326b7))

### Tests

-   **app:** fix tests after bootstrap update ([d95171d](https://github.com/webern-unibas-ch/awg-app/commit/d95171d5ee423dd04d27144949f1911cdd98cc78))
-   **edition:** add test for intro placeholder ([ed65e61](https://github.com/webern-unibas-ch/awg-app/commit/ed65e61837275dce012973040f0becb1bfbda23a))
-   **edition:** add test for source evaluation placeholder ([c532dfc](https://github.com/webern-unibas-ch/awg-app/commit/c532dfcd3d67c1defb632f519569261fedcf67d1))
-   **edition:** fix innerHtml of edition placeholder ([ba8d3d2](https://github.com/webern-unibas-ch/awg-app/commit/ba8d3d2764e7ff8bba63a5b68b402a2b607195c1))
-   **edition:** fix tests after changes for GraphVisualizer editors ([80a2809](https://github.com/webern-unibas-ch/awg-app/commit/80a2809879a449c26b8e46853b20dd095baa5501))
-   **edition:** remove unused imports ([a930659](https://github.com/webern-unibas-ch/awg-app/commit/a9306591d1c9d4f51b8dd79cdec0bad863e70880))
-   **edition:** simplify test for edition placeholder ([77aa58a](https://github.com/webern-unibas-ch/awg-app/commit/77aa58a90c3107e5687ba316039d2b370cec5216))
-   **shared:** add tests for codemirror component ([dd34c15](https://github.com/webern-unibas-ch/awg-app/commit/dd34c15d43f711fda1d5c990c4fc8cb91e23f8a1))

### [0.9.2](https://github.com/webern-unibas-ch/awg-app/compare/v0.9.1...v0.9.2) (2022-10-10)

### Bug Fixes

-   **app:** fix linting errors after update to v14 ([4bb6608](https://github.com/webern-unibas-ch/awg-app/commit/4bb66086cbfa092a67480a20e2a8d88126b4dd4d))
-   **app:** remove deprecated tilde from SCSS imports ([ece9560](https://github.com/webern-unibas-ch/awg-app/commit/ece956064aa14586db28de339264fb74e66423f5))
-   **app:** remove last remaining dependency on lodash ([c8d591e](https://github.com/webern-unibas-ch/awg-app/commit/c8d591e2f14302662dd0f1be8f486bd58f507ae6))
-   **app:** update allowedCommonJsDependencies ([d54fb94](https://github.com/webern-unibas-ch/awg-app/commit/d54fb9497d289ddb478f455b25e981fef642564c))
-   **edition:** add redirect from composition to complex route ([c0f8825](https://github.com/webern-unibas-ch/awg-app/commit/c0f8825046c345ee1c8d8397f63be32634c963c1))
-   **edition:** fix deprecated legacy link resolution ([b675066](https://github.com/webern-unibas-ch/awg-app/commit/b675066164f07ceede9f19e3371c3ff8bfcd3614))

### Code Refactoring

-   **app:** remove unused imports (SonarCloud) ([6f786c5](https://github.com/webern-unibas-ch/awg-app/commit/6f786c5e68bc39c3c5536e44e66f6f508410f1df))

### Build System

-   **app:** adjust project to cli changes in angular v14 ([29acf03](https://github.com/webern-unibas-ch/awg-app/commit/29acf03c8d82cda86ab1d4a9e9b0e3ae4d19621f))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) packages to v14 ([9871174](https://github.com/webern-unibas-ch/awg-app/commit/987117404b09373bf088f02a9d9255911727746b))
-   **deps-dev:** bump @types/node from 16.11.59 to 16.11.61 ([2bb569b](https://github.com/webern-unibas-ch/awg-app/commit/2bb569b768abcb4698eb532712d01539fbee6014))
-   **deps-dev:** bump @types/node from 16.11.61 to 16.11.64 ([30c7f97](https://github.com/webern-unibas-ch/awg-app/commit/30c7f97bdc722cfccc0f78266fd812e18999dcca))
-   **deps-dev:** bump angular-cli-ghpages from 1.0.0 to 1.0.3 ([7938acc](https://github.com/webern-unibas-ch/awg-app/commit/7938accb24991763415c8ab15c361fbc02d79a87))
-   **deps-dev:** bump eslint from 8.23.1 to 8.24.0 ([93b8534](https://github.com/webern-unibas-ch/awg-app/commit/93b8534094d50483bb841d769bc99345686df93e))
-   **deps-dev:** bump lint related packages to latest version ([323e92f](https://github.com/webern-unibas-ch/awg-app/commit/323e92fc8c8668233d89fcbaa9317910c7734e62))
-   **deps-dev:** bump source-map-explorer from 2.5.2 to 2.5.3 ([101ef34](https://github.com/webern-unibas-ch/awg-app/commit/101ef34b72f800e8ee2fcf1561a414a5b9d8562f))
-   **deps-dev:** bump typescript from 4.6.4 to 4.7.4 ([587bb9b](https://github.com/webern-unibas-ch/awg-app/commit/587bb9bf0789c64d61aaf87e7ae000712e16bb51))
-   **deps:** bump [@angular](https://github.com/angular) packages from 14.2.3 to 14.2.5 ([5f7eece](https://github.com/webern-unibas-ch/awg-app/commit/5f7eecef6e334cdd98571a7c0d18e64b161671a1))
-   **deps:** bump @fortawesome/angular-fontawesome from 0.10.2 to 0.11.1 ([c435d5f](https://github.com/webern-unibas-ch/awg-app/commit/c435d5fc6aeb7aa9ed6aa65aac0777d798dd4183))
-   **deps:** bump @ng-bootstrap/ng-bootstrap to v13 ([57fa099](https://github.com/webern-unibas-ch/awg-app/commit/57fa099b6338f182b3d1272ad85468c6292a0a66))
-   **deps:** bump bootstrap from 5.2.1 to 5.2.2 ([f4f7c32](https://github.com/webern-unibas-ch/awg-app/commit/f4f7c324501beca5dade33bc067da90454937194))
-   **deps:** bump codemirro from 5.65.7 to 5.65.9 ([bde9e00](https://github.com/webern-unibas-ch/awg-app/commit/bde9e00b7685dc00188d531ef470a7d0c715cb51))
-   **deps:** bump rxjs from 7.5.6 to 7.5.7 ([913b705](https://github.com/webern-unibas-ch/awg-app/commit/913b7057ceefc8a9148f8967d2596a8d77ecdccf))
-   **deps:** bump SonarSource/sonarcloud-github-action from 1.6 to 1.7 ([d50311f](https://github.com/webern-unibas-ch/awg-app/commit/d50311f868bcf7d01a5b522ef4f6d468328bb047))
-   **deps:** update [@angular](https://github.com/angular) to version 14 ([f0c7bed](https://github.com/webern-unibas-ch/awg-app/commit/f0c7bed30bb0e79e9f28b57b0bc3d057790e1a13))

### Documentation

-   **edition:** update JSdocs of EditionRowTablesComponent ([c02dba7](https://github.com/webern-unibas-ch/awg-app/commit/c02dba7db4a16b3a6c180bc8d2c7d972b7088abf))

### [0.9.1](https://github.com/webern-unibas-ch/awg-app/compare/v0.9.0...v0.9.1) (2022-09-21)

### Features

-   **assets:** add files for M 317 TF1 ([6b2eb63](https://github.com/webern-unibas-ch/awg-app/commit/6b2eb63632d76741bf8ee7810ebb4351630d6f00); thanks to [@masthom](https://github.com/masthom))
-   **edition:** add M34 to menus ([dd32509](https://github.com/webern-unibas-ch/awg-app/commit/dd32509a6832c30efdac852e08fe14cf4296a877); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** make edition complexes available from outline ([ce3d07a](https://github.com/webern-unibas-ch/awg-app/commit/ce3d07a7d3607dc3ccd1982cb42e2afbfbcc60f9))

### Bug Fixes

-   **assets:** add missing brackets ([1b1c154](https://github.com/webern-unibas-ch/awg-app/commit/1b1c154da68695668a6313f0db3f3a57e291efad))
-   **assets:** add missing dots in convolute types of m34 ([03544f0](https://github.com/webern-unibas-ch/awg-app/commit/03544f0f620eb7eceeb44dcff6282f98d4fdced1))
-   **assets:** adjust eighth flag in svg of M 317 Sk2.1.2 ([0956d60](https://github.com/webern-unibas-ch/awg-app/commit/0956d601e7e86ee2511c9c25f5582d4d91069944); thanks to [@masthom](https://github.com/masthom))
-   **assets:** adjust source description (B) for op. 25 ([aa928c8](https://github.com/webern-unibas-ch/awg-app/commit/aa928c85f7d2e0538ef3acb24563eb401ef50286); thanks to [@masthom](https://github.com/masthom))
-   **assets:** fix naming for unavailable sources ([729a963](https://github.com/webern-unibas-ch/awg-app/commit/729a963a6295de255a34286c3a5ae5fadcd3d3c8))
-   **assets:** fix svg and TkK of M 212 Sk1e ([4b6737b](https://github.com/webern-unibas-ch/awg-app/commit/4b6737b7300f5cfc90429e9f9dbbc0b7dd3aed73); thanks to [@masthom](https://github.com/masthom))
-   **assets:** fix syntax for empty systemGroups in op25 B ([a3b320b](https://github.com/webern-unibas-ch/awg-app/commit/a3b320b56ad2ce91e92ffc40f9794cf3039055bd))
-   **assets:** update files for M34 ([bffd63e](https://github.com/webern-unibas-ch/awg-app/commit/bffd63ea6ff899f88f74597e2f3aaf9a55d35f10); thanks to [@chael-mi](https://github.com/chael-mi))
-   **edition:** add firm sign JE No2 Lin12 ([100c83e](https://github.com/webern-unibas-ch/awg-app/commit/100c83e41826c1f5858f7b4376a01e6ef83642c6))
-   **edition:** disable unavailable sections ([0336fbe](https://github.com/webern-unibas-ch/awg-app/commit/0336fbe125cda428c3e1d91493d7fee9f5d45131))
-   **edition:** fix layout of source description ([69327b8](https://github.com/webern-unibas-ch/awg-app/commit/69327b8b9663c47f092e9fce153d2315bf907512))
-   **edition:** simplify model of edition complexes ([d250786](https://github.com/webern-unibas-ch/awg-app/commit/d25078607dbfe5b2b0e63957f76246d097e09825))

### Code Refactoring

-   **edition:** move outline data out of edition-service ([bf5b64e](https://github.com/webern-unibas-ch/awg-app/commit/bf5b64eedced07083a90e5767f32ea9d2c726cf6))
-   **edition:** rename composition -> edition complex ([828627b](https://github.com/webern-unibas-ch/awg-app/commit/828627b2c2ec4b2d41641707e63eeb77a0ea239b))
-   **edition:** rename edition work -> edition complex ([727587c](https://github.com/webern-unibas-ch/awg-app/commit/727587c14afec9a2b0ed5a6e9f54bb6245d9cf34))

### Tests

-   **edition:** fix tests after changes ([2646b6b](https://github.com/webern-unibas-ch/awg-app/commit/2646b6b46fd22ea2cdf8b34a2b8cbc307398a37a))
-   **edition:** fix tests after changes ([2dc31a4](https://github.com/webern-unibas-ch/awg-app/commit/2dc31a4ed2006d30b5eb15c101a4e728b0da30f4))
-   **edition:** fix tests after changes ([0242060](https://github.com/webern-unibas-ch/awg-app/commit/0242060f3e548646238e66030e179853a77fa32d))

### Build System

-   **deps-dev:** bump @commitlint/cli from 17.0.3 to 17.1.2 ([e74e95c](https://github.com/webern-unibas-ch/awg-app/commit/e74e95cc8afb74267f22f53d4d2f001fa9135720))
-   **deps-dev:** bump @commitlint/config-angular from 17.0.3 to 17.1.0 ([b664fe1](https://github.com/webern-unibas-ch/awg-app/commit/b664fe191bf92feb2dfda6725d48732afceac84d))
-   **deps-dev:** bump @types/jasmine from 4.0.3 to 4.3.0 ([c1d6026](https://github.com/webern-unibas-ch/awg-app/commit/c1d6026be598faddcf208d4645d3ad80bf8082ba))
-   **deps-dev:** bump @types/node from 16.11.49 to 16.11.57 ([0f576b9](https://github.com/webern-unibas-ch/awg-app/commit/0f576b9f19e3f79095224ad88daeea5861a25383))
-   **deps-dev:** bump @types/node from 16.11.57 to 16.11.59 ([935d754](https://github.com/webern-unibas-ch/awg-app/commit/935d7547caa3e7233a4527c2bb9b2b790cd23209))
-   **deps-dev:** bump @typescript-eslint/eslint-plugin ([75ac342](https://github.com/webern-unibas-ch/awg-app/commit/75ac342d3ba35f9a9f0baf1d1a14e3e3d7199662))
-   **deps-dev:** bump @typescript-eslint/eslint-plugin ([5a4f438](https://github.com/webern-unibas-ch/awg-app/commit/5a4f4386c5d79cd3990ca2503e9a3dbfd550a8d5))
-   **deps-dev:** bump @typescript-eslint/parser from 5.33.0 to 5.37.0 ([8e97219](https://github.com/webern-unibas-ch/awg-app/commit/8e972198fd0cee4b1151694202b4beb7eef8979c))
-   **deps-dev:** bump @typescript-eslint/parser from 5.37.0 to 5.38.0 ([127f2d2](https://github.com/webern-unibas-ch/awg-app/commit/127f2d2434da8995dab76e23d09cf986e5a0d857))
-   **deps-dev:** bump eslint from 8.22.0 to 8.23.1 ([677c9ea](https://github.com/webern-unibas-ch/awg-app/commit/677c9ea6060b3a3a92b692048a0c0b068f609282))
-   **deps-dev:** bump jasmine-core from 4.3.0 to 4.4.0 ([5fd1ac8](https://github.com/webern-unibas-ch/awg-app/commit/5fd1ac8955e50cea03261bb6f3d45e8d8848bd90))
-   **deps-dev:** bump karma from 6.4.0 to 6.4.1 ([82a5a5d](https://github.com/webern-unibas-ch/awg-app/commit/82a5a5d559f508ba6877f094b72ed828ae4f7cce))
-   **deps-dev:** bump webpack-bundle-analyzer from 4.5.0 to 4.6.1 ([fe471f5](https://github.com/webern-unibas-ch/awg-app/commit/fe471f5ab7bc3117dfca32564f3e0207283f3d63))
-   **deps:** bump @fortawesome/fontawesome-svg-core from 6.1.2 to 6.2.0 ([14176f1](https://github.com/webern-unibas-ch/awg-app/commit/14176f1d8ff708cfe97d275ef699575ea8f14a47))
-   **deps:** bump @fortawesome/free-solid-svg-icons from 6.1.2 to 6.2.0 ([9530bc7](https://github.com/webern-unibas-ch/awg-app/commit/9530bc71712619cab9afd1be8c8f530944f05c75))
-   **deps:** bump bootstrap from 5.2.0 to 5.2.1 ([3f710ff](https://github.com/webern-unibas-ch/awg-app/commit/3f710fff887ebe4f12d0ff0863ed17ec612b1ba8))
-   **deps:** bump codecov/codecov-action from 3.1.0 to 3.1.1 ([ba8f6d5](https://github.com/webern-unibas-ch/awg-app/commit/ba8f6d55a7f892eb84208e61fa35e1cfda06b47b))
-   **deps:** bump rdfstore from v0.9.18-alpha.5 to v0.9.18-alpha.6 ([15e95e6](https://github.com/webern-unibas-ch/awg-app/commit/15e95e6dd2d8beea261e280de9032236fdf7c3e7))

## [0.9.0](https://github.com/webern-unibas-ch/awg-app/compare/v0.8.5...v0.9.0) (2022-08-19)

### ⚠ BREAKING CHANGES

-   **edition:** The former workflow to display SVG files and overlays one-by-one is replaced by (re)drawing the SVGs with D3 library and creating the overlays automatically.

### Features

-   **assets:** add classes in svg files of M 212 and M 317 Sk1 ([80721cc](https://github.com/webern-unibas-ch/awg-app/commit/80721ccf9521916227eb7d4f02df51bfa934f5cc); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add classes to M 317 Sk5 ([11dd42f](https://github.com/webern-unibas-ch/awg-app/commit/11dd42f34669a2cfb3d57647515cab7988e9e7ac); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add files for M 34 ([df94020](https://github.com/webern-unibas-ch/awg-app/commit/df94020abcc29c23ded489d3d519095261cae063), [411051f](https://github.com/webern-unibas-ch/awg-app/commit/411051faf30d9e8097af6fc1fa0ea8b441a45f1a), [bd0d342](https://github.com/webern-unibas-ch/awg-app/commit/bd0d342a089d463f34fc746cd983a2e4541566a3), [362d42b](https://github.com/webern-unibas-ch/awg-app/commit/362d42b3eae36f079fbe0f0ed571b5b5f07fcd02); thanks to [@chael-mi](https://github.com/chael-mi))
-   **assets:** add svgGroupId to textcritics files ([f983c61](https://github.com/webern-unibas-ch/awg-app/commit/f983c610cb0a74f0633780064a806317f0e64bf3))
-   **assets:** fix foliation in M 212 and add classes in some sketches of M 317 ([cd3cfd4](https://github.com/webern-unibas-ch/awg-app/commit/cd3cfd423ba20f8a2050044aaf744e5ae18b9c23); thanks to [@masthom](https://github.com/masthom))
-   **core:** add UtilityService for app-wide util functions ([6ef3654](https://github.com/webern-unibas-ch/awg-app/commit/6ef365467f487012d37f8bd01178ec5b8d4f7d77))
-   **edition:** activate M 34 in app ([404d780](https://github.com/webern-unibas-ch/awg-app/commit/404d78027f6736cbd7d42ae65a648bedb67a1e9a))
-   **edition:** add Clear button to SparqlEditor ([1b90f03](https://github.com/webern-unibas-ch/awg-app/commit/1b90f03f91df1e6ee357dda5f31090190cc9e428))
-   **edition:** add Clear button to TriplesEditor ([75a8dd9](https://github.com/webern-unibas-ch/awg-app/commit/75a8dd9f0b0d9f33dba76d619264a09031a65103))
-   **edition:** add ToastMessage class to ToastService ([ce101d4](https://github.com/webern-unibas-ch/awg-app/commit/ce101d41ef10a6a4f6f459006ab137dce59b89e0))
-   **edition:** extend overlay model with selection status ([49cbb2e](https://github.com/webern-unibas-ch/awg-app/commit/49cbb2e0ed35959e5c033f4d5f9b9ba97f349bec))
-   **edition:** generate source descriptions semi-automatically from JSON ([67ada7c](https://github.com/webern-unibas-ch/awg-app/commit/67ada7c5681702690082f93b08175522b910e703))
-   **edition:** use D3 library to render SVG sheets and overlays ([ba0676c](https://github.com/webern-unibas-ch/awg-app/commit/ba0676c00e7a774fd2ca0c871d32ff722db28693))
-   **shared:** add ViewHandleButtonGroup ([78a6c0c](https://github.com/webern-unibas-ch/awg-app/commit/78a6c0ce708bcac2f320f62f154a90a0fa1c68bf))
-   **shared:** create SliderConfig class ([b2f2ee3](https://github.com/webern-unibas-ch/awg-app/commit/b2f2ee3fa0339638df8aee905ad39f7213ac4165))
-   **shared:** integrate OrderByPipe lib as shared pipe (module issues) ([7ef2a2e](https://github.com/webern-unibas-ch/awg-app/commit/7ef2a2e51aaa3a8a5ad1e4d9bec073f22eee6a5c))

### Bug Fixes

-   **app:** remove unused imports (SonarCloud) ([79fb6dd](https://github.com/webern-unibas-ch/awg-app/commit/79fb6dd433ace12e36a1406dd97ed229b801b57c))
-   **app:** remove unused variables ([376aae4](https://github.com/webern-unibas-ch/awg-app/commit/376aae4e24e4934c63c11d7800b4768a1081c472))
-   **assets:** add folio dimensions for M 34 ([8f168af](https://github.com/webern-unibas-ch/awg-app/commit/8f168af0dd8683e72a311f5ff253f520e93088f8))
-   **assets:** add g element to path242 in M 317 Sk2.1 ([2250314](https://github.com/webern-unibas-ch/awg-app/commit/2250314e3078daccc113cb6088fef0a5e2200b14))
-   **assets:** add links to svg files for M 317 in source-description.json ([0c186be](https://github.com/webern-unibas-ch/awg-app/commit/0c186bed27b100a5b7601c271b0e5c35b85be171); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add links to svg files in textcritics.json ([1e5bbbd](https://github.com/webern-unibas-ch/awg-app/commit/1e5bbbd4195b3fec7c186daa1c22c1dadaeec6b2); thanks to [@masthom](https://github.com/masthom))
-   **assets:** add M number in source list for M 34 A ([7f601c1](https://github.com/webern-unibas-ch/awg-app/commit/7f601c10b67bc2169d8b2504fb2981dad625d198))
-   **assets:** add missing data files and placeholders for M 34 ([5b9427d](https://github.com/webern-unibas-ch/awg-app/commit/5b9427d559dcac38b89ff45d4f3e5517dfca0cb1))
-   **assets:** add missing svgGroupIds to op12 textcritics ([1b1b19d](https://github.com/webern-unibas-ch/awg-app/commit/1b1b19d2e1fb07f0602d4fb2d66fc4b3a2a2dd39))
-   **assets:** add missing svgGroupIds to op25 textcritics ([9f887ad](https://github.com/webern-unibas-ch/awg-app/commit/9f887ad64f43eda2926d266141fb3f2030017622))
-   **assets:** add svg ids to M 34 textcritics ([5fbbf4f](https://github.com/webern-unibas-ch/awg-app/commit/5fbbf4fcb8b3f9366a1edfacbfbeea522ba5766d))
-   **assets:** adjust source description for M 34 to new format ([f1946ec](https://github.com/webern-unibas-ch/awg-app/commit/f1946ec6dc6252e1f9d2eaa1c370ec210565d629))
-   **assets:** adjust svg-sheets.json and folio-convolute.json for new svg files ([3447c10](https://github.com/webern-unibas-ch/awg-app/commit/3447c10c204fb7912029072bd405eaa33f0abb98); thanks to [@masthom](https://github.com/masthom))
-   **assets:** adjust tabs in source descriptions ([7e4f66c](https://github.com/webern-unibas-ch/awg-app/commit/7e4f66cbe2c13328ae0b0a7023432d1b40bb50b6))
-   **assets:** fix typo in file name fpr M 34 Sk1b ([2fbe15b](https://github.com/webern-unibas-ch/awg-app/commit/2fbe15b57f3f45b9e1fc0531b20e7537a2cdc2f6))
-   **assets:** fix typos in textcritics of M 34 ([a4b6286](https://github.com/webern-unibas-ch/awg-app/commit/a4b62865fca524d43dfba42c4dd42abee2726417))
-   **assets:** link source descriptions of op19, 23 & 24 with svgs ([50e0b2f](https://github.com/webern-unibas-ch/awg-app/commit/50e0b2f407183b282cd75f87c1140155a81e2978))
-   **assets:** minor fixes (mainly tabs etc.) in source-decription and source-list of op12 and op25 ([54ee38c](https://github.com/webern-unibas-ch/awg-app/commit/54ee38c3d8604ac8d50259c67519cf42e6baf160); thanks to [@masthom](https://github.com/masthom))
-   **assets:** move inner svg group out of outer group ([82d603b](https://github.com/webern-unibas-ch/awg-app/commit/82d603b2d875b5f8ed10c099c856a139d6135883))
-   **assets:** remove deprecated SVGs ([104f951](https://github.com/webern-unibas-ch/awg-app/commit/104f951b3a2114d8d810578a4f8f3ea93485367d))
-   **assets:** update svg files for M 317 ([5272975](https://github.com/webern-unibas-ch/awg-app/commit/52729756f18c6f80851ce0240d594698ee063395); thanks to [@masthom](https://github.com/masthom))
-   **assets:** use RISM sigla for op19, 23 & 24 ([9a0d8de](https://github.com/webern-unibas-ch/awg-app/commit/9a0d8de1ca3b0b2794bc3b96350a5295db67126a))
-   **core:** adjust UtilityService to be stricter ([f6c9aaa](https://github.com/webern-unibas-ch/awg-app/commit/f6c9aaa3e0c5037be8026f8f0f27563c4b77cb4e))
-   **core:** highlight Edition link in navbar when active ([75867c6](https://github.com/webern-unibas-ch/awg-app/commit/75867c626127b74d407a79d4f6cee10d3c434a6d))
-   **edition:** add errorMessageRequest to SparqlEditor ([bd13db8](https://github.com/webern-unibas-ch/awg-app/commit/bd13db8e6a0059378cb97b6ffb22fa9324d88b88))
-   **edition:** add errorMessageRequest to TriplesEditor ([1625ae3](https://github.com/webern-unibas-ch/awg-app/commit/1625ae34dd94a909ab67a5a691beba4c7f179c83))
-   **edition:** compile html for all source description parts ([5dd3e8a](https://github.com/webern-unibas-ch/awg-app/commit/5dd3e8a62210f16a4b38c73a6cf3890df57998ee))
-   **edition:** do only prevent convolute selection if conv has modal link ([0ee0301](https://github.com/webern-unibas-ch/awg-app/commit/0ee0301e3a0cde94ab856660a56b063256f145a6))
-   **edition:** fix clearing order for svg ([c600bb1](https://github.com/webern-unibas-ch/awg-app/commit/c600bb1d4c981bc7ef9295776b9735493cb18113))
-   **edition:** fix container height of ForceGraph ([3d20803](https://github.com/webern-unibas-ch/awg-app/commit/3d208038ae1dd2abb8396cb16d5e8fbdf78a0973))
-   **edition:** iterate over tkkGroup nodes instead of artificial array ([915f056](https://github.com/webern-unibas-ch/awg-app/commit/915f0564e4234161cf2ea73752e38e34864d7b89))
-   **edition:** mute link boxes in svgs for now ([4007c42](https://github.com/webern-unibas-ch/awg-app/commit/4007c42f89fa6ad1d08cc7bb3cba38857a07cefb))
-   **edition:** remove EditionSvgSheetCmp from accolade module ([d46f24b](https://github.com/webern-unibas-ch/awg-app/commit/d46f24b8db2b0f47870d9a2a79c10468659a403f))
-   **edition:** remove unused import of EditionSvgOverlayTypes ([a10e6e8](https://github.com/webern-unibas-ch/awg-app/commit/a10e6e822b4553346120b8f96652ea52aa8044eb))
-   **edition:** use plural form for Edierte Notentexte ([30ab551](https://github.com/webern-unibas-ch/awg-app/commit/30ab551cb2d5ad183a5c5f33452094b7a4ad4702))
-   **edition:** use utility service in app ([f0c13d8](https://github.com/webern-unibas-ch/awg-app/commit/f0c13d841c17a5b1ac3960c210abfc689dde058a))
-   **edition:** use utility service to check for empty array ([d98a991](https://github.com/webern-unibas-ch/awg-app/commit/d98a991c15c2a5d72a338b03040cf8a0d2f1abd8))
-   **edition:** use ViewHandleButtonGroup in SearchResultList ([1a313f3](https://github.com/webern-unibas-ch/awg-app/commit/1a313f3234e6cda50da231808d5200a5d5227266))
-   **edition:** use ViewHandleButtonGroup in SparqlComponent ([47cfd44](https://github.com/webern-unibas-ch/awg-app/commit/47cfd449fa51afc3644cc49568b740caaeb1c3cf))
-   **shared:** add barrels for SliderConfig model class ([0255dab](https://github.com/webern-unibas-ch/awg-app/commit/0255dabb510c91b875720ab52d00f3b196d29b67))
-   **shared:** fix modal snippet for op12 ([87ec17c](https://github.com/webern-unibas-ch/awg-app/commit/87ec17c8e49749cbd743ffc5e6f57be7f4f56d1d))

### Styles

-   **app:** adjust tab size ([dcc488f](https://github.com/webern-unibas-ch/awg-app/commit/dcc488fe506ec1833fd85701df61c162bd0081d3))
-   **app:** extend tab class ([2aa683a](https://github.com/webern-unibas-ch/awg-app/commit/2aa683a7007f90415f8f42a2a15aa69df0916a1f))
-   **app:** fix styles after bootstrap update ([94dcd83](https://github.com/webern-unibas-ch/awg-app/commit/94dcd83f0ffb7cfca8806981e1ee0bd261230f2e))

### Documentation

-   **app:** fix typo in metadata ([43c87f3](https://github.com/webern-unibas-ch/awg-app/commit/43c87f30e722f0d9d2b07b0e0f38ec82c081db73))
-   **edition:** add docs for EditionSvgDrawingService ([0f0e94a](https://github.com/webern-unibas-ch/awg-app/commit/0f0e94a8eda440956d92a22ec93abb829037a2c8))
-   **shared:** fix incorrect line break in table docs ([fc77c3a](https://github.com/webern-unibas-ch/awg-app/commit/fc77c3a30ae25b275381718c7aca6e08655e4ebb))
-   **shared:** fix syntax for jsdocs in SliderConfig ([5fb19e7](https://github.com/webern-unibas-ch/awg-app/commit/5fb19e7c8986992b092c3d16aec2d32869f119a8))

### Tests

-   **app:** fix file paths after changes ([b8b058d](https://github.com/webern-unibas-ch/awg-app/commit/b8b058dfe8e6d39bee4705029a55953572af6f39))
-   **core:** adjust tests for StorageService ([d634c96](https://github.com/webern-unibas-ch/awg-app/commit/d634c9625d0b2b7e2bcffb07efb460face65b4c5))
-   **core:** adjust tests for ToastService ([94d3a12](https://github.com/webern-unibas-ch/awg-app/commit/94d3a12fe052a17cb02b78ffd86d954b51a32045))
-   **edition:** add tests for SvgDrawingService (started) ([16caef1](https://github.com/webern-unibas-ch/awg-app/commit/16caef1ec85c7cd2601c3d00215593444128bc1b))
-   **edition:** add tests for TableComponent ([c425119](https://github.com/webern-unibas-ch/awg-app/commit/c4251192f2bac2461d9f6b76d3899727249f9c6c))
-   **edition:** add tests for TextCriticsListComponent ([8098c00](https://github.com/webern-unibas-ch/awg-app/commit/8098c005017b5ecd6f4d8fe39d57ec344ae4596b))
-   **edition:** adjust tests for GraphVisualizerComponent after changes ([1d701c0](https://github.com/webern-unibas-ch/awg-app/commit/1d701c091dbbe4cd4dd4c9df5cad1846e2ebe1b4))
-   **edition:** adjust tests for SourceDescriptionComp after changes ([5976390](https://github.com/webern-unibas-ch/awg-app/commit/5976390627285e616456c4403db8d66d5addd614))
-   **edition:** adjust tests for SparqlEditorComponent after changes ([fdbe9a0](https://github.com/webern-unibas-ch/awg-app/commit/fdbe9a0d554c28cc09be715e84c63b31f4c47c0b))
-   **edition:** adjust tests for SparqlEditorComponent after changes ([e5c4880](https://github.com/webern-unibas-ch/awg-app/commit/e5c4880e97e971bfcd07e5a4fdb9efba7cc68332))
-   **edition:** adjust tests for TriplesEditorComponent after changes ([456ddc5](https://github.com/webern-unibas-ch/awg-app/commit/456ddc523739adaae88e6b12cb04bce0edd6b0bc))
-   **edition:** fix accolade tests after changes ([4c230a7](https://github.com/webern-unibas-ch/awg-app/commit/4c230a7eae08d6f3cf247b6a845ec9f7cb946f92))
-   **edition:** fix tests after changes ([4d437cd](https://github.com/webern-unibas-ch/awg-app/commit/4d437cdccc576551a7c494698222d7c6434595f4))
-   **edition:** fix tests for GraphVisualizer after changes ([1402141](https://github.com/webern-unibas-ch/awg-app/commit/1402141e926ce43c07907fd3845fb83c0a2fce2d))
-   **edition:** fix typo in test for SparqlEditorCOmponent ([4cae2a1](https://github.com/webern-unibas-ch/awg-app/commit/4cae2a177acde0bb0dd2c46ff8664ecac2acc522))
-   **edition:** remove unused imports from test for EditionIntroComponent ([370930f](https://github.com/webern-unibas-ch/awg-app/commit/370930fc8be824bc6554e5e69cb847caee903096))
-   **search:** adjust tests for DataViewComponent ([d1f922a](https://github.com/webern-unibas-ch/awg-app/commit/d1f922a26412f18525ea703687fad33d6e70b658))
-   **search:** fix tests after changes in SearchParams ([8c8af2a](https://github.com/webern-unibas-ch/awg-app/commit/8c8af2adf9e3895adf39cf86d7d027604f735e2d))
-   **shared:** add tests for TablePaginationComponent ([a818bbb](https://github.com/webern-unibas-ch/awg-app/commit/a818bbb3d1313d17c0a9443b017adb4a147fe2a4))
-   **shared:** add tests for ViewHandleButtonGroup ([58349ac](https://github.com/webern-unibas-ch/awg-app/commit/58349acf33dcc966f846ca1730dd7e2d49c1c2ec))
-   **shared:** fix tests for OrderByPipe ([f7f2414](https://github.com/webern-unibas-ch/awg-app/commit/f7f2414693cd351fcdc18dd1b5b482537bcfff79))

### Build System

-   **deps-dev:** bump @angular-devk/build-angular from 13.3.8 to 13.3.9 ([b5a35ea](https://github.com/webern-unibas-ch/awg-app/commit/b5a35ead4bc2e4989d33654d2409177b0653958e))
-   **deps-dev:** bump @angular/cli from 13.3.8 to 13.3.9 ([0771c25](https://github.com/webern-unibas-ch/awg-app/commit/0771c25d6200a3602a7454cb67b04586c32b1f7d))
-   **deps-dev:** bump @types/node from 16.11.41 to 16.11.49 ([5d8c662](https://github.com/webern-unibas-ch/awg-app/commit/5d8c662dd897fca2a6413e7733b0d13f4ac7a70b))
-   **deps-dev:** bump eslint related packages to latest version ([bbb3cd3](https://github.com/webern-unibas-ch/awg-app/commit/bbb3cd39b4de1b76529cb1923b3fc8b2db1f8287))
-   **deps-dev:** bump jasmine-core from 4.2.0 to 4.3.0 ([997634e](https://github.com/webern-unibas-ch/awg-app/commit/997634e0867c274a5aa28c102792bf724cf88653))
-   **deps:** add d3-fetch to dependencies ([635aa1f](https://github.com/webern-unibas-ch/awg-app/commit/635aa1f10c4fd25d69be95866288fbf9eff1e8e7))
-   **deps:** bump @fortawesome/fontawesome-svg-core from 6.1.1 to 6.1.2 ([b533058](https://github.com/webern-unibas-ch/awg-app/commit/b533058eed120cc647504f46cb59bc25b965f053))
-   **deps:** bump @fortawesome/free-solid-svg-icons from 6.1.1 to 6.1.2 ([d49d331](https://github.com/webern-unibas-ch/awg-app/commit/d49d331daa588ffeceed5eb66edf272d6b115b6c))
-   **deps:** bump bootstrap from 5.1.3 to 5.2.0 ([f667083](https://github.com/webern-unibas-ch/awg-app/commit/f667083ef07c52f4da44df371c856e5ec5c38394))
-   **deps:** bump codemirror from 5.65.6 to 5.65.7 ([6d9c17b](https://github.com/webern-unibas-ch/awg-app/commit/6d9c17b208a184513b477a98d6b08b3aaed75d06))
-   **deps:** bump custom rdfstore from 0.9.18-alpha.4 to -alpha.5 ([ba83f1f](https://github.com/webern-unibas-ch/awg-app/commit/ba83f1f16ede44f828f3a358f5e6dd43ef9a456f))
-   **deps:** bump rxjs from 7.5.5 to 7.5.6 ([df4132c](https://github.com/webern-unibas-ch/awg-app/commit/df4132c00c451ab213ece281821c5885536d1c9a))
-   **deps:** bump terser from 5.7.1 to 5.14.2 ([322d3b5](https://github.com/webern-unibas-ch/awg-app/commit/322d3b538d2ecea052300c46c9d917bb6bdab6cb))
-   **deps:** bump undici from 5.5.1 to 5.8.0 ([df097f9](https://github.com/webern-unibas-ch/awg-app/commit/df097f93e08d7710abfe29d343125e8bc8c27efb))
-   **deps:** bump undici from 5.8.0 to 5.9.1 ([8e893bf](https://github.com/webern-unibas-ch/awg-app/commit/8e893bf5c4b3837ab1ef7cea9fd940a5f8b0e9ea))
-   **deps:** bump zone.js from 0.11.6 to 0.11.7 ([e6007ff](https://github.com/webern-unibas-ch/awg-app/commit/e6007ff05b5ed08f0e57ffc3f0376084361bce10))
-   **deps:** bump zone.js from 0.11.7 to 0.11.8 ([ef553fe](https://github.com/webern-unibas-ch/awg-app/commit/ef553fea698da6e8f8d071dce8d47ddc3684951e))

### Code Refactoring

-   **app:** use capital letters for prefix enum ([988bcce](https://github.com/webern-unibas-ch/awg-app/commit/988bcce95cfc06a1cc3e18448024ebcdd6c304c0))
-   **assets:** rename and reorganize files for M 34 ([f38b89b](https://github.com/webern-unibas-ch/awg-app/commit/f38b89bdd853ccf181b8516bf21ae90d333fe249))
-   **core:** move ToastService to shared ToastComponent ([b7e9e1f](https://github.com/webern-unibas-ch/awg-app/commit/b7e9e1f7a3f33bb8c01091d87d6354c8325d60eb))
-   **edition:** calculate container dimensions in separate method ([38b0bcd](https://github.com/webern-unibas-ch/awg-app/commit/38b0bcd90aab01b3065104868e93ae4aefb23ae6))
-   **edition:** move accolade and convolute into separate modules ([4a84c45](https://github.com/webern-unibas-ch/awg-app/commit/4a84c455b1aa13238272d8c9b32468d924ab02b9))
-   **edition:** move shared D3 models to general edition models ([638d308](https://github.com/webern-unibas-ch/awg-app/commit/638d3083c358fb7e7edf696513432736d21bd150))
-   **edition:** refactor TableComponent ([c1204af](https://github.com/webern-unibas-ch/awg-app/commit/c1204af55db728a9586d84b36019d17701bc6641))
-   **edition:** refactor ViewBox model to be used generic ([412b0fc](https://github.com/webern-unibas-ch/awg-app/commit/412b0fc5ecb0897e84c69f38359157ff54c6064b))
-   **edition:** rename createSVGOverlayGroup method ([582ef4d](https://github.com/webern-unibas-ch/awg-app/commit/582ef4d72966617d7e5601ceb806c8aaa57838fe))
-   **edition:** rename svgSheetRootSelection ([99ae616](https://github.com/webern-unibas-ch/awg-app/commit/99ae616a151b5ff4c7f5170741418b0a86509698))
-   **edition:** rename view -> viewType in SparqlEditor ([8e16652](https://github.com/webern-unibas-ch/awg-app/commit/8e166526f1baafc8efe3186aa17c6d6e886bd4aa))
-   **edition:** simplify retrieval of container coords in ForceGraph ([517ef78](https://github.com/webern-unibas-ch/awg-app/commit/517ef787b54401111ec3b8989a1dd7923ef6e7df))
-   **search:** use ViewHandleTypes for refactored SearchParams ([89bf082](https://github.com/webern-unibas-ch/awg-app/commit/89bf082fec64bb88822b4aab0e484935c0d8391d))
-   **shared:** rename formatInput method in TablePagination ([3179561](https://github.com/webern-unibas-ch/awg-app/commit/31795613fdc8cde4a145e515774d56544260f98a))
-   **shared:** rename OrderPipe -> OrderByPipe ([d836018](https://github.com/webern-unibas-ch/awg-app/commit/d836018a0ffdddf707544a8f6ffdfe39f4243fec))

### [0.8.5](https://github.com/webern-unibas-ch/awg-app/compare/v0.8.4...v0.8.5) (2022-07-01)

### Bug Fixes

-   **edition:** add response type for doQuery in visualizer service ([44331ef](https://github.com/webern-unibas-ch/awg-app/commit/44331efc91d450d4c143d9e9325da6fae5668b9f))
-   **edition:** add barrels for graph visualizer module participants ([3d4c86e](https://github.com/webern-unibas-ch/awg-app/commit/3d4c86e9ab27e4541d1ec1eedf78f5c7ce32c2a9))
-   **edition:** add some more default prefixes to PrefixPipe ([51cbb5a](https://github.com/webern-unibas-ch/awg-app/commit/51cbb5a7e60b1ade86354bb5f195e69cd790f81b))
-   **edition:** added colons in source description ([0ba69d0](https://github.com/webern-unibas-ch/awg-app/commit/0ba69d037a591f7f9ba91c2c44713c3c92bb918e); thanks to [@masthom](https://github.com/masthom))
-   **edition:** adjust modal.components.ts ([#485](https://github.com/webern-unibas-ch/awg-app/issues/485)) ([4f3a4b2](https://github.com/webern-unibas-ch/awg-app/commit/4f3a4b2f841dbe8f9ebf1bd054255df9788deb7d); thanks to [@masthom](https://github.com/masthom))
-   **edition:** adjustment in source-description of op25 ([6ec0a17](https://github.com/webern-unibas-ch/awg-app/commit/6ec0a1711ab6bb1802f462c10ad1edd945687367); thanks to [@masthom](https://github.com/masthom))
-   **edition:** adjustments in source-list and -description of op12 ([61d1e19](https://github.com/webern-unibas-ch/awg-app/commit/61d1e196917150c96fd6c1301de12d2a18f57402); thanks to [@masthom](https://github.com/masthom))
-   **edition:** fix typo in RISM sigle ([e56aaae](https://github.com/webern-unibas-ch/awg-app/commit/e56aaae0bdcd01711001f23a3f84311e128b2380))
-   **edition:** more adjustments in source-description op op12 and op25, ([f6d5250](https://github.com/webern-unibas-ch/awg-app/commit/f6d5250b3eee6fb0610153f259ebd57792ef155b); thanks to [@masthom](https://github.com/masthom))
-   **edition:** more adjustments to source-list of op12 and op25 ([c2e6e92](https://github.com/webern-unibas-ch/awg-app/commit/c2e6e92d7a609b70796f7342bfa039808afc5f2f))
-   **edition:** remove or underscore unused function parameters ([6380c9c](https://github.com/webern-unibas-ch/awg-app/commit/6380c9cf0622d26defbf049a37c8c76c6cc762bd))
-   **edition:** remove redundant await from non-promise call ([354e23b](https://github.com/webern-unibas-ch/awg-app/commit/354e23b44e667a58b1f1a4ee5430521cb7f57656))
-   **edition:** remove unused import ([a8a2de1](https://github.com/webern-unibas-ch/awg-app/commit/a8a2de10ceb6a6de35075764fa55883ab68a3b32))
-   **edition:** removed unused import from visualizer service ([7161c7e](https://github.com/webern-unibas-ch/awg-app/commit/7161c7e54a2894579e0126ef6f0d4c3e439a494d))
-   **edition:** throw error in switch default with enums ([bbd3a42](https://github.com/webern-unibas-ch/awg-app/commit/bbd3a42229fb632573b4e3fb15feaa9bda343b48))
-   **shared:** remove unused imports ([f0facaa](https://github.com/webern-unibas-ch/awg-app/commit/f0facaa83aad1c932fdbe0104ad6b3bc2dc81f74))

### Documentation

-   **app:** add [@AMWilke](https://github.com/AMWilke) to contributors in package.json ([bdd97d2](https://github.com/webern-unibas-ch/awg-app/commit/bdd97d2421728f1b6b1aace8e5f85f9036d4e48a))
-   **CHANGELOG:** add credits to [@masthom](https://github.com/masthom) and [@AMWilke](https://github.com/AMWilke) in v0.8.2 release ([ae581d3](https://github.com/webern-unibas-ch/awg-app/commit/ae581d3e0845102a3538cbbfcaad60df32fd68f8))
-   **CONTRIBUTING:** fix incorrect sorting of core scope ([9774f51](https://github.com/webern-unibas-ch/awg-app/commit/9774f511dab82adcd7bd7c76baf35390f9f1ca7c))
-   **CONTRIBUTING:** update commit message schema ([5632f8f](https://github.com/webern-unibas-ch/awg-app/commit/5632f8feab281ee8fd51ceeaf2fdd1a40fc6956b))
-   **edition:** add jsdocs for EditionDetail ([5512e31](https://github.com/webern-unibas-ch/awg-app/commit/5512e319279409f2171fd8fc8f92cd417018e254))
-   **edition:** remove console.log ([bdf04d2](https://github.com/webern-unibas-ch/awg-app/commit/bdf04d2ff540ae3ec0738521f46c17e7c789e5d5))
-   **README:** add AMWilke as a contributor for data ([#472](https://github.com/webern-unibas-ch/awg-app/issues/472)) ([055ff9d](https://github.com/webern-unibas-ch/awg-app/commit/055ff9d0093d457bf8215c1067fb82f30cc43fc7))

### Tests

-   **edition:** add first tests for visualizer service ([edd2179](https://github.com/webern-unibas-ch/awg-app/commit/edd2179dd424c5f791db60544a10a03659fe9434))
-   **edition:** add further tests for visualizer service ([8705bb6](https://github.com/webern-unibas-ch/awg-app/commit/8705bb6fc4ff3cddd321789d89aacb199d2cec94))
-   **edition:** add tests for PrefixPipe ([8112d81](https://github.com/webern-unibas-ch/awg-app/commit/8112d817486f57b59c412690e8ca46e0ba462ef5))
-   **edition:** fix tests for row tables after changes ([cde00eb](https://github.com/webern-unibas-ch/awg-app/commit/cde00eb3404c98b632754474c2e73924f9c0a4ef))
-   **edition:** fix tests for ToastComponent ([47b0dc2](https://github.com/webern-unibas-ch/awg-app/commit/47b0dc2791e74bd321e93896a9497d2122d03ce9))
-   **edition:** improve readability of tests for visualizer service ([cd8be97](https://github.com/webern-unibas-ch/awg-app/commit/cd8be97e34469f93168e4a847ee56a8ea8a7d312))
-   **edition:** remove log from test ([c39e57d](https://github.com/webern-unibas-ch/awg-app/commit/c39e57dfca807b07fd2d1cf2c86fe866029df53d))
-   **shared:** add tests for ModalComponent ([2de15d7](https://github.com/webern-unibas-ch/awg-app/commit/2de15d7f51aa90e775bd4b7d2b453b22db718dc3))

### Code Refactoring

-   **core:** rename core mock-data -> core-data ([8ed4aa7](https://github.com/webern-unibas-ch/awg-app/commit/8ed4aa747f5477b62fbd1e01d50c4d63ecd4a637))
-   **edition:** get row tables data from service ([13ddd60](https://github.com/webern-unibas-ch/awg-app/commit/13ddd60ee28229b2a385ecb49c25cb526fcfe793))
-   **edition:** lazy load RowTablesComponent ([54ce0b1](https://github.com/webern-unibas-ch/awg-app/commit/54ce0b12704c68b2127cbd00af30ae637f85e0f9))
-   **edition:** make Triple class distinctive from StoreTriple ([479b62f](https://github.com/webern-unibas-ch/awg-app/commit/479b62fccf2393a852abea4fd0e337cb21013f1e))
-   **edition:** move EditionWorks from model to data ([d966ccd](https://github.com/webern-unibas-ch/awg-app/commit/d966ccda22f511daf52d908fa9aa282a41cf41ba))
-   **edition:** move jumbotron into separate component ([dfb18bf](https://github.com/webern-unibas-ch/awg-app/commit/dfb18bf4b2a777e0756682260940e9e75a5898b7))
-   **edition:** re-organize folder structure ([fbe8d0a](https://github.com/webern-unibas-ch/awg-app/commit/fbe8d0aa4476927bbea52166255d533d263a1c23))
-   **edition:** refactor interfaces related to rdfstore response ([1a3cc91](https://github.com/webern-unibas-ch/awg-app/commit/1a3cc915e113075e280f3fbb612c3807958964cd))
-   **edition:** refactor PrefixPipe ([a8df392](https://github.com/webern-unibas-ch/awg-app/commit/a8df39239dc9655d78a779118c294d817521aa9c))
-   **edition:** refactor select response prep in visualizer service ([acc6a33](https://github.com/webern-unibas-ch/awg-app/commit/acc6a33231669b998e73eb1546a2fc2c65c4d944))
-   **edition:** refactor some methods in visualizer service ([01c21f9](https://github.com/webern-unibas-ch/awg-app/commit/01c21f95945befcd9130a539d40496e83c9002c2))
-   **edition:** rename method parseTriples -> parseTripleString ([6848a78](https://github.com/webern-unibas-ch/awg-app/commit/6848a78eabb1bd9a7295aac38cd6f5a4c3c9cc68))
-   **edition:** rename model QueryResult -> TriplestoreResponse ([e692269](https://github.com/webern-unibas-ch/awg-app/commit/e69226993adc2629ebd54f6fbd2de0ba9f452fb9))
-   **edition:** rename model SearchResult -> QueryResult ([1751500](https://github.com/webern-unibas-ch/awg-app/commit/1751500e8b8440a4dec434e4d33deb1af1692b17))
-   **edition:** rename prefixes -> qNames in visualizer service ([4299886](https://github.com/webern-unibas-ch/awg-app/commit/42998869d9eec552c116e3322f5861e07ec4c42b))
-   **edition:** rename TripleComponent -> TripleValue ([f780cf2](https://github.com/webern-unibas-ch/awg-app/commit/f780cf2212cf19ca7acc1396202c6df887a20fc6))
-   **shared:** move modal snippets into data file ([654cc9f](https://github.com/webern-unibas-ch/awg-app/commit/654cc9f32593a8d48963ab3fd63aaba648cdd3aa))
-   **shared:** refactor table models ([da0e170](https://github.com/webern-unibas-ch/awg-app/commit/da0e1703336311868a3b82a1f614211f6eddafd1))
-   **shared:** rename and clarify members of ModalComponent ([1efca5b](https://github.com/webern-unibas-ch/awg-app/commit/1efca5ba74ada51afa7b86c232b90eebcc802e1f))
-   **shared:** rename MODAL_CONTENT_SNIPPETS ([fc6afd3](https://github.com/webern-unibas-ch/awg-app/commit/fc6afd3d2443b93fb0ba46f0462ca147168ce188))

### Build System

-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 17.0.x to 17.0.3 ([8adef93](https://github.com/webern-unibas-ch/awg-app/commit/8adef93f1e8ad9c268d28809e4186e9ae10154db))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.29.0 to 5.30.0 ([8f2f701](https://github.com/webern-unibas-ch/awg-app/commit/8f2f70184bf1ac73344c0c481b5cb25fc5d34c99))
-   **deps-dev:** bump eslint-plugin-prettier from 4.0.0 to 4.1.0 ([aa237c3](https://github.com/webern-unibas-ch/awg-app/commit/aa237c3b7956beb9b268bdaa7c9dec45113f2464))
-   **deps-dev:** bump eslint-plugin-prettier from 4.1.0 to 4.2.1 ([0958569](https://github.com/webern-unibas-ch/awg-app/commit/0958569a3e277f1b1996d360eb6d4f40737b7f79))
-   **deps-dev:** bump lint-staged from 13.0.2 to 13.0.3 ([f02586c](https://github.com/webern-unibas-ch/awg-app/commit/f02586cfbec7dc879733ae62ff9fd44b8de78f6a))
-   **deps:** bump custom rdfstore from 0.9.18-alpha.3 to -alpha.4 ([3379505](https://github.com/webern-unibas-ch/awg-app/commit/33795053df012c48c8814235bd4dc8348ffab1dc))
-   **deps:** bump tar from 6.1.0 to 6.1.11 ([efd22e4](https://github.com/webern-unibas-ch/awg-app/commit/efd22e43648676cc124bc1a4cb1a9f968bb771ed))

### Continuous Integration

-   **gh-actions:** do not trigger sonar cloud analysis on forks ([af2db69](https://github.com/webern-unibas-ch/awg-app/commit/af2db69130e299efa347d2f5bdded8bb72d341ea))
-   **gh-actions:** fix more syntax in if-clause ([76b1dc8](https://github.com/webern-unibas-ch/awg-app/commit/76b1dc8655d5d9163d1eeae7727ee08f5187dddd))
-   **gh-actions:** fix syntax in if-clause ([364f32e](https://github.com/webern-unibas-ch/awg-app/commit/364f32e4083e01a681d2826705b94269ea7fbf53))

### [0.8.4](https://github.com/webern-unibas-ch/awg-app/compare/v0.8.3...v0.8.4) (2022-06-22)

### Features

-   **edition:** add svg files for op12: M212 Sk1-5 ([2dc24af](https://github.com/webern-unibas-ch/awg-app/commit/2dc24af6072281ce5084940cfa3dee6e9a5534b8); thanks to [@masthom](https://github.com/masthom))
-   **edition:** add textcritics for op12: M212 Sk1 ([8d082c3](https://github.com/webern-unibas-ch/awg-app/commit/8d082c3b02cceb2f994b86f1330cca22fc15891c); thanks to [@masthom](https://github.com/masthom))
-   **edition:** prepare svg panel to handle partial sheets ([98bf540](https://github.com/webern-unibas-ch/awg-app/commit/98bf5408eaf5f7d1899ecf0618acfc4dad77459b))

### Bug Fixes

-   **app:** do not lazy-load default route ([6435579](https://github.com/webern-unibas-ch/awg-app/commit/6435579b3cdcf7654e90d5adf7a143f56fadd27b))
-   **edition:** check for partialIndex before constructing sheetId ([411410b](https://github.com/webern-unibas-ch/awg-app/commit/411410b88d562148eeab42abf3f3774b1b4c3c13))
-   **edition:** fix overlay coordinates after update of op12 ([7172a5c](https://github.com/webern-unibas-ch/awg-app/commit/7172a5c0cbb8344df525b2897ed45254e9d834ac))
-   **edition:** fix typo in textcritics for op12 ([f3c7186](https://github.com/webern-unibas-ch/awg-app/commit/f3c71863b6d7b14f78a701a18a72135a380aecf5))
-   **edition:** remove deprecated alt label from op25 content ([c8bb12c](https://github.com/webern-unibas-ch/awg-app/commit/c8bb12cf612427b8f53bac88c4cffc6814fef208))
-   **edition:** update folio-convolute + svg-sheets for op12 ([e38c073](https://github.com/webern-unibas-ch/awg-app/commit/e38c073c5b317a54116f9ef60909ffe52c982be8); thanks to [@masthom](https://github.com/masthom))
-   **edition:** update source-description, intro and textcritics for op12: M212 Sk2-5 ([e9a963e](https://github.com/webern-unibas-ch/awg-app/commit/e9a963e897041761b6d988850b53ea7b692c3e6e); thanks to [@masthom](https://github.com/masthom))

### Styles

-   **app:** fix indentation for route paths ([9ee8922](https://github.com/webern-unibas-ch/awg-app/commit/9ee8922ca855c83765e2155b23c2f3ac693ca92f))

### Documentation

-   **app:** fix exclude path to display routes with compodoc ([5b5c734](https://github.com/webern-unibas-ch/awg-app/commit/5b5c734348e5f4fe71df3704dfce9a56c62464dd))

### Code Refactoring

-   **app:** preparation for stricter mode ([38b238a](https://github.com/webern-unibas-ch/awg-app/commit/38b238a2cac0d6ea6dfd5e1db35dbb6fd0e91229))
-   **app:** use SNAKE_CASE (all caps) for route variables ([38e9d4b](https://github.com/webern-unibas-ch/awg-app/commit/38e9d4b46ab90d26757564c5b3cdba3481fb6af3))

### Tests

-   **app:** adjust tests after preparation for stricter mode ([b5bb8c8](https://github.com/webern-unibas-ch/awg-app/commit/b5bb8c827d4cc008b99f06aa16daee6c3705b1fa))
-   **edition:** adjust tests to handle svg sheets with partials ([9edb1fa](https://github.com/webern-unibas-ch/awg-app/commit/9edb1fa878e4127460d8f84df4ebf30f86713d07))
-   **edition:** remove console.log from test ([6941364](https://github.com/webern-unibas-ch/awg-app/commit/6941364c75f812804732540c48693bbfdcdde7dd))

### Build System

-   **app:** add brotli compression to build script ([01f4ac7](https://github.com/webern-unibas-ch/awg-app/commit/01f4ac7a99b89349d2f01ea7d92b40c34c120b25))
-   **app:** adjust budget sizes ([6462a53](https://github.com/webern-unibas-ch/awg-app/commit/6462a53d850693aa0e063ad4fed663cbcae139b4))
-   **app:** adjust project to cli changes in angular v13 ([5fb0fa3](https://github.com/webern-unibas-ch/awg-app/commit/5fb0fa30bafa9a9369590563da502bad541db2df))
-   **app:** adjust project to cli changes in angular v13 (cont'd) ([8581164](https://github.com/webern-unibas-ch/awg-app/commit/858116475bb61b8dca2257fc19b741c2673f6081))
-   **app:** move from node v14 to v16-lts as default ([3d0c475](https://github.com/webern-unibas-ch/awg-app/commit/3d0c4752f9751d70381d39aa5feacf8bcfcfa7b4))
-   **deps-dev:** bump @angular/cli related packages to v13-lts ([cdf1b27](https://github.com/webern-unibas-ch/awg-app/commit/cdf1b2776dcad27a761d77a273b04037b35545ca))
-   **deps-dev:** bump lint related packages to latest version ([0ac5d6f](https://github.com/webern-unibas-ch/awg-app/commit/0ac5d6fc1948d66c23db862cce49a8e59c6c106d))
-   **deps-dev:** bump lint related packages to latest version ([c997dba](https://github.com/webern-unibas-ch/awg-app/commit/c997dbacc3af121cd59832717cc577cd2558b5a4))
-   **deps-dev:** bump lint-staged from 13.0.1 to 13.0.2 ([1859a33](https://github.com/webern-unibas-ch/awg-app/commit/1859a3304e0b5a1749cdb117e29a2c0018407468))
-   **deps-dev:** bump test related packages to latest version ([1962f1b](https://github.com/webern-unibas-ch/awg-app/commit/1962f1b150dbcd4a344de14913a97edece79de00))
-   **deps:** bump codemirror from 5.65.5 to 5.65.6 ([396a3b6](https://github.com/webern-unibas-ch/awg-app/commit/396a3b6f8e761b83f47fe8d19e5f197e4163a246))
-   **deps:** bump ngx-json-viewer from 3.0.2 to 3.1.0 ([626b69d](https://github.com/webern-unibas-ch/awg-app/commit/626b69dd69e9c9a2cd821257bd024dbfe66909c7))
-   **deps:** remove unnecessary dependency core-js ([3d7cb80](https://github.com/webern-unibas-ch/awg-app/commit/3d7cb80ed7ff7c8ac95abcf27218ef3044c96fe8))
-   **deps:** use latest tagged version of custom rdfstore ([ab18c2c](https://github.com/webern-unibas-ch/awg-app/commit/ab18c2cbdb19757e211e98652cbb5a8e95150c3d))

### [0.8.3](https://github.com/webern-unibas-ch/awg-app/compare/v0.8.2...v0.8.3) (2022-06-06)

### Features

-   **edition:** update op12 ([#424](https://github.com/webern-unibas-ch/awg-app/issues/424)) ([ada63a1](https://github.com/webern-unibas-ch/awg-app/commit/ada63a1d2dd3deb709fbf5c479664c01e5a9c363); thanks to [@masthom](https://github.com/masthom))

### Bug Fixes

-   **edition:** add rowtable flag where needed ([42bb1b9](https://github.com/webern-unibas-ch/awg-app/commit/42bb1b97104c655b4854c6a0a7b325719a5c2d2d))
-   **edition:** fix source description of op12 ([08ec11f](https://github.com/webern-unibas-ch/awg-app/commit/08ec11fef41ab8fd82ae9a64e1a115bf000761e0))
-   **edition:** fix typos in source descriptions ([c82af93](https://github.com/webern-unibas-ch/awg-app/commit/c82af93c5d1a3732f38fa2fa6c63654eff0f5aee))
-   **edition:** show html for source description type ([7d19ff1](https://github.com/webern-unibas-ch/awg-app/commit/7d19ff19f5a74e19d08024fcc5d8c44ba4200095))
-   **edition:** update modification date for op12 ([27a0393](https://github.com/webern-unibas-ch/awg-app/commit/27a03936b82fc0935d1250863eedd1355383d027))
-   **edition:** use correct IDs to display op12 SVGs ([d715832](https://github.com/webern-unibas-ch/awg-app/commit/d715832dffb88404272fd9a8e14c10e1f7231d05))
-   **edition:** use id instead of labels to identify textcritical comments ([2811885](https://github.com/webern-unibas-ch/awg-app/commit/2811885eb1a2355584bce5e3d9f7bbf287dc339f))
-   **gh-actions:** exclude SonarCloud analysis from pull requests ([ca7011c](https://github.com/webern-unibas-ch/awg-app/commit/ca7011c32bb4310986a824d0cffee64d435dcede))
-   **gh-actions:** increase dependabot limits ([aa4ffc1](https://github.com/webern-unibas-ch/awg-app/commit/aa4ffc1911f210d108f8575b69dfc27106c6a0c9))

### Tests

-   **edition:** fix tests after update of op12 ([30676b6](https://github.com/webern-unibas-ch/awg-app/commit/30676b67f7b7c6bf39906974eb9144cd5a20bf5c))

### Build System

-   **deps-dev:** bump lint related packages to latest version ([007fd8c](https://github.com/webern-unibas-ch/awg-app/commit/007fd8cd882024047a7d1e3114316e4846d55165))
-   **deps:** bump [@angular](https://github.com/angular) packages from 13.3.9 to 13.3.11 ([b295da0](https://github.com/webern-unibas-ch/awg-app/commit/b295da0dec0c3bfd3d832ad53a89c319c1fb3274))
-   **deps:** bump async from 2.6.3 to 2.6.4 ([1c0833e](https://github.com/webern-unibas-ch/awg-app/commit/1c0833e6701961681cef9e3ecd6773678580a951))
-   **deps:** bump remaining dependencies to latest versions ([7473df7](https://github.com/webern-unibas-ch/awg-app/commit/7473df798aaba3210a3577f47bc99b911447e3b5))
-   **deps:** revert angular-fontawesome bump from 0.10.2 to 0.11.0 ([0dce0e6](https://github.com/webern-unibas-ch/awg-app/commit/0dce0e632ec48856d8b8dc63f2edc0b438ace5fe))
-   **deps:** use customized version of rdfstore ([329c9c7](https://github.com/webern-unibas-ch/awg-app/commit/329c9c7dcb1759afb108d41a8ae9e07a39234633))

### [0.8.2](https://github.com/webern-unibas-ch/awg-app/compare/v0.8.1...v0.8.2) (2022-05-23)

### Features

-   **edition:** add op19 ([ff07aa0](https://github.com/webern-unibas-ch/awg-app/commit/ff07aa0a862fd8d03f40a87f7e3583f4b8acfe65); thanks to[@AMWilke](https://github.com/AMWilke))
-   **edition:** add op24 ([ec474b8](https://github.com/webern-unibas-ch/awg-app/commit/ec474b86dd41d6acf0a85795b3b45fb7bb2b6e7b); thanks to[@masthom](https://github.com/masthom))
-   **edition:** add textcritics for "SkRT" in op25 ([373e8af](https://github.com/webern-unibas-ch/awg-app/commit/373e8afff58051429faf4e16e2c85d0e727c68d5); thanks to[@masthom](https://github.com/masthom))

### Bug Fixes

-   **app:** immediately return inline variables (Sonar Cloud) ([944b85b](https://github.com/webern-unibas-ch/awg-app/commit/944b85b76e779212ef6feefb3d5c64bce56b82f7))
-   **app:** remove redundant jumps (Sonar Cloud) ([738eb1c](https://github.com/webern-unibas-ch/awg-app/commit/738eb1ca6e3f7276d6d173bb79983034008afff4))
-   **app:** use observer argument instead of deprecated subscribe ([bc9bdc3](https://github.com/webern-unibas-ch/awg-app/commit/bc9bdc316d4bb35283cddd954320ea4dcf9faaf1))
-   **app:** use observer argument instead of deprecated subscribe ([7f553ec](https://github.com/webern-unibas-ch/awg-app/commit/7f553eca512c8f899f654772bfdd0295f1fc4f62))
-   **core:** use correct API for observable throwError (SonarCloud) ([f640b55](https://github.com/webern-unibas-ch/awg-app/commit/f640b55ddfdc7ccbdd38594c5dc3906d558dfb9a))
-   **edition:** activate op19, op23 and op24 ([2f19cd2](https://github.com/webern-unibas-ch/awg-app/commit/2f19cd25fd6ecf6b6b646ca21623f1a20e7deb92))
-   **edition:** add graph files for op19, op23 and op24 ([fe4fcc5](https://github.com/webern-unibas-ch/awg-app/commit/fe4fcc5857f0bde9e691ccef529ee3b4942a8c68))
-   **edition:** add modal snippets for op19, op23 and op24 ([0efaa84](https://github.com/webern-unibas-ch/awg-app/commit/0efaa842a20d1eed4913954b8d79309a0a4dd905))
-   **edition:** adjust textcritics table headers for rowtables ([90c7c23](https://github.com/webern-unibas-ch/awg-app/commit/90c7c234a2e22cda4e5eed5b5f3360ad1576adb3))
-   **edition:** fix file name for op19 row table ([409a665](https://github.com/webern-unibas-ch/awg-app/commit/409a665e7bd1f673a0dfa1b88cfde641e3bf56e9))
-   **edition:** fix ids for op24 sheets ([db21439](https://github.com/webern-unibas-ch/awg-app/commit/db21439c9f8817ed090c4129caea80e166a26b3d))
-   **edition:** fix textcritical comment for op19 ([f5f1eeb](https://github.com/webern-unibas-ch/awg-app/commit/f5f1eebde0f546a5eed5e23aac74989009357f6b))
-   **edition:** fix typos and names in json files for op24 ([0c1e36d](https://github.com/webern-unibas-ch/awg-app/commit/0c1e36d1010a0f1d3bf548b3cdeeed7031afc736))
-   **edition:** fix typos in textcritics for op19 ([e75b91c](https://github.com/webern-unibas-ch/awg-app/commit/e75b91c18d63797f526cbd0e9ea85ca960d619c4))
-   **edition:** fix wrong closing tags in textcritics of op25 ([5fc3a3e](https://github.com/webern-unibas-ch/awg-app/commit/5fc3a3ecd60ea166acb565749dbdef321a3f6de4))
-   **edition:** replace deprecated error signature in EditionDataService ([8322991](https://github.com/webern-unibas-ch/awg-app/commit/832299155191c91bfe33a096fc04a71f2ba51865))
-   **edition:** use type alias for union type (Sonar Cloud) ([eed5da7](https://github.com/webern-unibas-ch/awg-app/commit/eed5da7e0b56a53b18ba569eac373f13f32106fe))
-   **search:** remove unnecessary error type assertions ([c19f664](https://github.com/webern-unibas-ch/awg-app/commit/c19f664691a7f8962820575e3b00ba88eb44a3a2))
-   **shared:** fix unexpected empty arrow functions (SonarCloud) ([3198744](https://github.com/webern-unibas-ch/awg-app/commit/3198744e9cf5026285fc25872ef45937f844a72e))
-   **shared:** remove deprecated NgbButtonsModule ([d24c30f](https://github.com/webern-unibas-ch/awg-app/commit/d24c30fecd0c6b8b0cec35e8dbe207b00d33bba5))
-   **shared:** use concise character class syntax '\D' instead of '[^0-9]' ([b6973dc](https://github.com/webern-unibas-ch/awg-app/commit/b6973dce90e2ab1e3b64256f54fdae3c742e0e20))

### Styles

-   **edition:** fix SCSS issues in ForceGraphComponent (SonarCloud) ([6afdb08](https://github.com/webern-unibas-ch/awg-app/commit/6afdb08c388d4f9e439872156112fc0cf7f01d65))

### Code Refactoring

-   **app:** remove unused imports (SonarCloud) ([06b02fe](https://github.com/webern-unibas-ch/awg-app/commit/06b02fedb3dd7fd189c1ac83da14fa6d76b3dfbf))
-   **edition:** clean up code ([4d80c29](https://github.com/webern-unibas-ch/awg-app/commit/4d80c29f89d3ae8c73bb57a02ba1be702323443c))
-   **edition:** get SVG sheets dynamically ([640d012](https://github.com/webern-unibas-ch/awg-app/commit/640d012546c9805b79b2ff07395dc18043919948))

### Tests

-   **app:** fix tests after updates ([ced0ef8](https://github.com/webern-unibas-ch/awg-app/commit/ced0ef8d15a2e8a3e4a6ed1403d31a7dea9b5cc1))
-   **edition:** add test for EditionIntro- and -ReportComponents ([0be52e3](https://github.com/webern-unibas-ch/awg-app/commit/0be52e39bfd5c72d2ade4b167a0153d032e7f81b))
-   **edition:** fix deprecated symbols ([266e67f](https://github.com/webern-unibas-ch/awg-app/commit/266e67ff20cf9192a6d76a4ceae773ee58b974fd))
-   **edition:** fix tests for EditionIntro- and -ReportComponents ([ff01f60](https://github.com/webern-unibas-ch/awg-app/commit/ff01f600f671e94f8ef7d776180c6f30a21e0332))
-   **edition:** fix tests for EditionTkaTable component ([539cb78](https://github.com/webern-unibas-ch/awg-app/commit/539cb785cea8575e9147625aadcc6ca8c65f936a))

### Build System

-   **deps-dev:** bump lint related packages to latest version ([7f80459](https://github.com/webern-unibas-ch/awg-app/commit/7f804598b69022b2a130915040d44c28b85c212c))
-   **deps-dev:** bump lint related packages to latest version ([61cafce](https://github.com/webern-unibas-ch/awg-app/commit/61cafce22313bb417b0e03d34ee23e3c713df63b))
-   **deps-dev:** bump test related packages to latest version ([56c691f](https://github.com/webern-unibas-ch/awg-app/commit/56c691f1b8a47c406e2480fd23e3b57d6cb4fd07))
-   **deps:** bump [@angular](https://github.com/angular) packages from 13.3.0 to 13.3.7 ([9cf9f23](https://github.com/webern-unibas-ch/awg-app/commit/9cf9f23c2145ff5265ce489e9ce11de937d7861f))
-   **deps:** bump [@angular](https://github.com/angular) packages from 13.3.7 to 13.3.9 ([bd8a60b](https://github.com/webern-unibas-ch/awg-app/commit/bd8a60b9853da41eef8242bffcebdd59a7e3b1c3))
-   **deps:** bump codecov/codecov-action from 2.1.0 to 3.1.0 ([#403](https://github.com/webern-unibas-ch/awg-app/issues/403)) ([f29dfd5](https://github.com/webern-unibas-ch/awg-app/commit/f29dfd509a4275960c7371de15bf25bda63be9f3))
-   **deps:** bump ejs from 3.1.6 to 3.1.8 ([f2581e6](https://github.com/webern-unibas-ch/awg-app/commit/f2581e6e9a1d1cc822d01c8d1ed7bdf33b5e8cf7))
-   **deps:** bump github/codeql-action from 1 to 2 ([#406](https://github.com/webern-unibas-ch/awg-app/issues/406)) ([e686e22](https://github.com/webern-unibas-ch/awg-app/commit/e686e225608d892cd7b947d96ba11d8fc22fc9d9))
-   **deps:** bump minimist from 1.2.5 to 1.2.6 ([00e4837](https://github.com/webern-unibas-ch/awg-app/commit/00e48379e4a222986373fb732ef4b047a6d03993))
-   **deps:** bump node-forge from 1.2.1 to 1.3.0 ([f523dbd](https://github.com/webern-unibas-ch/awg-app/commit/f523dbdf5be69305ffcfb495988cc7112ed374a5))
-   **deps:** bump remaining dependencies to latest versions ([ed83424](https://github.com/webern-unibas-ch/awg-app/commit/ed834241ee5469dcb9665f46e3002f706281c6b6))
-   **deps:** bump remaining dependencies to latest versions ([e38b753](https://github.com/webern-unibas-ch/awg-app/commit/e38b7535f1e0ac078d68b10794e210f26ceaffa1))
-   **deps:** bump tslib from 2.3.1 to 2.4.0 ([e33e871](https://github.com/webern-unibas-ch/awg-app/commit/e33e871fdbaeacff64e0b33e0266a9f14236b50e))

### [0.8.1](https://github.com/webern-unibas-ch/awg-app/compare/v0.8.0...v0.8.1) (2022-03-23)

### Bug Fixes

-   **edition:** avoid collapsing graph result panels in fullscreen ([4dfbf19](https://github.com/webern-unibas-ch/awg-app/commit/4dfbf1980821a61e77450b9582855f36ad1e4ce0))
-   **edition:** fix typo in textcritics for M 317 Sk2.1.3 ([92dabd6](https://github.com/webern-unibas-ch/awg-app/commit/92dabd60ad3cd60f7637bee984f3609311002d88))
-   **search:** type form controls in ExtendedSearch ([7a7f3d0](https://github.com/webern-unibas-ch/awg-app/commit/7a7f3d02e076911723b6dcda9e3cbeff6d940576))
-   **shared:** move logic for table pagination in separate component ([3992c4f](https://github.com/webern-unibas-ch/awg-app/commit/3992c4f84bc32ccee82c484c589bb930a0dc1ff7))

### Code Refactoring

-   **edition:** simplify HTML of graph visualizer component ([d29f132](https://github.com/webern-unibas-ch/awg-app/commit/d29f132683d3aad8a622df1f7392817866a2ec23))
-   **search:** adjust grid view of search results to bootstrap 5 ([8b05d8d](https://github.com/webern-unibas-ch/awg-app/commit/8b05d8d683e01dda6fffdd4e6333efd624c5a13f))
-   **search:** adjust search result view buttons to bootstrap 5 ([8af2ff0](https://github.com/webern-unibas-ch/awg-app/commit/8af2ff03afbfe586e2746521654f92f4c433e6b7))
-   **search:** move fulltext search input validation into method ([b891105](https://github.com/webern-unibas-ch/awg-app/commit/b8911058a8464d9e65b2835803f39951bc182536))

### Tests

-   **app:** fix tests after update to bootstrap 5 - complete ([809168d](https://github.com/webern-unibas-ch/awg-app/commit/809168ddaa10eded3563a067a78203b6b8ddb3d4))
-   **app:** fix tests after update to bootstrap 5 - ongoing ([6e32d73](https://github.com/webern-unibas-ch/awg-app/commit/6e32d73d5f0372d2189054122a4833566388163d))
-   **core:** fix return value for ApiServiceError in ApiService ([f94b125](https://github.com/webern-unibas-ch/awg-app/commit/f94b125d1b4ab801da77a92dffb9f22950c3a63e))

### Build System

-   **app:** adjust hidden sections for CHANGELOG ([be8ec38](https://github.com/webern-unibas-ch/awg-app/commit/be8ec38ded0764b1aac18d762496a2594c1b487a))
-   **app:** integrate scss files in linting workflow ([4f0c6e3](https://github.com/webern-unibas-ch/awg-app/commit/4f0c6e3db5e4ed5a035e47e26eb00f63308a6c46))
-   **deps-dev:** bump eslint related packages to latest version ([dfeef51](https://github.com/webern-unibas-ch/awg-app/commit/dfeef512a04b5f3dc972225853c12e37178b6f9d))
-   **deps-dev:** bump lint related packages to latest version ([f7c7006](https://github.com/webern-unibas-ch/awg-app/commit/f7c700654ef84771c7f438e85fc2d047cf0a4b29))
-   **deps-dev:** bump test related packages to latest version ([5425f7b](https://github.com/webern-unibas-ch/awg-app/commit/5425f7b11c9a0ebc985e1a53f90b297e6248355a))
-   **deps-dev:** bump typescript from 4.5.5 to 4.6.2 ([1e0d6ee](https://github.com/webern-unibas-ch/awg-app/commit/1e0d6eef3b1074300ac3ed1c65731ca20b99d1b1))
-   **deps:** add popper.js ([b5806a3](https://github.com/webern-unibas-ch/awg-app/commit/b5806a3e10f15658410dd454fc4f3c10fcd528ab))
-   **deps:** bump [@angular](https://github.com/angular) packages from 13.2.4 to 13.2.6 ([515b54c](https://github.com/webern-unibas-ch/awg-app/commit/515b54cb1c9ba3cc656bda500bd3b1b34cc74ee6))
-   **deps:** bump [@angular](https://github.com/angular) packages from 13.2.6 to 13.3.0 ([5703a6e](https://github.com/webern-unibas-ch/awg-app/commit/5703a6e9392112318724f0f1c4669c855b01d25f))
-   **deps:** bump actions/checkout from 2 to 3 ([7012aa0](https://github.com/webern-unibas-ch/awg-app/commit/7012aa07f697c81175f9170e83ed255cd13b1063))
-   **deps:** bump layout related packages to latest version ([aabd5a2](https://github.com/webern-unibas-ch/awg-app/commit/aabd5a2ca1bc81d010d0dce103a4f15996669719))
-   **deps:** bump n3 from 1.13.0 to 1.15.0 ([baea81f](https://github.com/webern-unibas-ch/awg-app/commit/baea81f31764907401d530a25056788129dd4d84))
-   **deps:** update to bootstrap 5 ([e779295](https://github.com/webern-unibas-ch/awg-app/commit/e7792951e64932c699fe721b6650522fbf6ebf1c))

### Styles

-   **app:** add customized bootstrap scss file ([c97749d](https://github.com/webern-unibas-ch/awg-app/commit/c97749dd2a5aec70a64e3d2eafb86980e82c5db5))
-   **app:** apply changes from prettier ([3fc7ef5](https://github.com/webern-unibas-ch/awg-app/commit/3fc7ef58ed6e235c674d291135b5a3c49ee4074a))
-   **app:** apply scss style format ([89a71c9](https://github.com/webern-unibas-ch/awg-app/commit/89a71c9f344a2ddba05de802f1e416b140e98b57))
-   **app:** reformat files with prettier ([4cb9391](https://github.com/webern-unibas-ch/awg-app/commit/4cb93918c1ebdbbc681d7c33aa72c67b54e9e988))
-   **app:** rename .boder-left &-right to .border-start &-end (BS5) ([e5fa68b](https://github.com/webern-unibas-ch/awg-app/commit/e5fa68b16914b493235ea49211ff84745ed3a56d))
-   **app:** rename .ml- and .mr- to .ms- and .me- (bootstrap 5) ([a08f7c3](https://github.com/webern-unibas-ch/awg-app/commit/a08f7c38e79ede9860dea0be2f42cc105111b893))
-   **app:** rename .pl- and .pr- to .ps- and .pe- (bootstrap 5) ([dc215c5](https://github.com/webern-unibas-ch/awg-app/commit/dc215c5b47f8f3d6ac4213ba3579a159060c7c26))
-   **app:** rename .text-left .text-right to .text-start .text-end (BS5) ([e934119](https://github.com/webern-unibas-ch/awg-app/commit/e9341190be6eafd7ad48b81e610a1e7b03792ffc))
-   **app:** set custom color for info items ([0e09f95](https://github.com/webern-unibas-ch/awg-app/commit/0e09f958707c651408159c0f0c869651c8e35196))
-   **app:** switch from css to scss ([5ca5ded](https://github.com/webern-unibas-ch/awg-app/commit/5ca5dedb1318915e1e251692fd66ea1379458977))
-   **app:** use variables for colors ([3848ec0](https://github.com/webern-unibas-ch/awg-app/commit/3848ec076b55aefcf385dfebef252c670bdef324))
-   **core:** fix navbar brand padding values ([6ce77a0](https://github.com/webern-unibas-ch/awg-app/commit/6ce77a0eae4a1a70dc8bfddbb71ff2f2408ae175))
-   **edition:** add borders to intro and graph blocks ([fed9823](https://github.com/webern-unibas-ch/awg-app/commit/fed98237cc1d4b36a7925d58d100afe3835ae50d))
-   **edition:** adjust accordions after upgrade to bootstrap 5 ([2e0db76](https://github.com/webern-unibas-ch/awg-app/commit/2e0db765f00b2c715b86120f97a12b3b1cea6075))
-   **edition:** adjust card-decks to bootstrap 5 syntax ([6cf5c0f](https://github.com/webern-unibas-ch/awg-app/commit/6cf5c0f15c30450132b4db0f8d0d441103ea12e3))
-   **edition:** fix slider input group of graph visualizer ([b9e8f89](https://github.com/webern-unibas-ch/awg-app/commit/b9e8f891ef653e8b3d6a6275578daa550da602c2))
-   **search:** add border to search panels ([d86ddb0](https://github.com/webern-unibas-ch/awg-app/commit/d86ddb04439dc9014599ccf5446e98b703461312))
-   **search:** fix aria-label binding of full text search input ([84261d2](https://github.com/webern-unibas-ch/awg-app/commit/84261d2ae0c0b05cbf8a68f0e9af7bfa50357efe))
-   **search:** fix extended search input after upgrade to bootstrap 5 ([c202df5](https://github.com/webern-unibas-ch/awg-app/commit/c202df500d9e93a39fbabcd4373cf19d80a5f9f5))
-   **search:** fix full text search input after upgrade to bootstrap 5 ([1215cea](https://github.com/webern-unibas-ch/awg-app/commit/1215ceabdd458309ce37da7aa1f3cf7660399dd6))
-   **shared:** fix modal close button ([43e1245](https://github.com/webern-unibas-ch/awg-app/commit/43e124560117d1d5835600e84916cdee4b9be576))
-   **shared:** use outline button for router link group ([7774c6e](https://github.com/webern-unibas-ch/awg-app/commit/7774c6ed2783b10fa8497b84c20a269598cf4c51))

## [0.8.0](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.19...v0.8.0) (2022-02-26)

### Features

-   **edition:** add EditionComplexComponent ([b7ae6eb](https://github.com/webern-unibas-ch/awg-app/commit/b7ae6eb33ff24971159a2fd4af9879ae820dcbe5))
-   **edition:** add routing and components for series and sections ([ca9be52](https://github.com/webern-unibas-ch/awg-app/commit/ca9be5249136cf31a48a2aff376f1f5cae9ff227))
-   **edition:** add RowTablesComponent for overview of rows ([6c67b2c](https://github.com/webern-unibas-ch/awg-app/commit/6c67b2c6f655a1eb4a45cad0dded289fe4484a49))
-   **search:** add dynamic compops for ExtendedSearch ([46f0619](https://github.com/webern-unibas-ch/awg-app/commit/46f061943c5dce5d3796a631bd729977edc313d5))
-   **search:** add extended search form & functionality - ongoing ([4617a28](https://github.com/webern-unibas-ch/awg-app/commit/4617a28659847fe83bbc1a92399685570181ac68))
-   **search:** add routing to resource detail tabs ([9e2d460](https://github.com/webern-unibas-ch/awg-app/commit/9e2d4609a22451e7e072c6dc6f8b8cd1d703bd98))
-   **search:** continue with ExtendedSearchForm - ongoing ([1d6bf52](https://github.com/webern-unibas-ch/awg-app/commit/1d6bf52c9c9cf8e3debe15e60fc256eeda2caef5))
-   **search:** prepare DataApiService to query property type lists ([7abce03](https://github.com/webern-unibas-ch/awg-app/commit/7abce037b541a9c7d21e1daff04f8598987c9715))
-   **shared:** move table to shared components ([c91950c](https://github.com/webern-unibas-ch/awg-app/commit/c91950caa801ff298ecaf082f903ad55d78aae82))

### Bug Fixes

-   **app:** restructure edition navbar ([08a3763](https://github.com/webern-unibas-ch/awg-app/commit/08a3763fd31941a4c1ef034d8d5b687f9d1b2abf))
-   **app:** revert ngx-gallery version to 1.2.3 (BrowserModule issue) ([3d1664a](https://github.com/webern-unibas-ch/awg-app/commit/3d1664ae686d232e8a99c267ad93f54bcfb76279))
-   **core:** enhance duplicate filter for search results ([b5524ac](https://github.com/webern-unibas-ch/awg-app/commit/b5524ac68c2a6202ed1c64b0d0c2300ed40bf42c))
-   **core:** ignore angular cache files ([3eab2a8](https://github.com/webern-unibas-ch/awg-app/commit/3eab2a8efaee94b2c933ce4e4f67ecfd96706ef2))
-   **core:** use forEach not map in conversion service method (SonarCloud) ([8b89720](https://github.com/webern-unibas-ch/awg-app/commit/8b8972032c42b69e3a108c6a0553811c55222235))
-   **edition:** adjust displayed titles in edition view ([b974204](https://github.com/webern-unibas-ch/awg-app/commit/b9742044ae29e0005d173d37d190c8eeee8163a0))
-   **edition:** adjust handling of svg sheet ids ([cc421bd](https://github.com/webern-unibas-ch/awg-app/commit/cc421bd6169221c855ffafc9cd0f0b0f7c67797f))
-   **edition:** adjust side info for edition view ([009d816](https://github.com/webern-unibas-ch/awg-app/commit/009d816202c4810b54559074a1864c21d315e3d7))
-   **edition:** adjust sigle of row table op. 25 ([de9aea6](https://github.com/webern-unibas-ch/awg-app/commit/de9aea698120e329716be89b55b23ea04a78d6c7))
-   **edition:** adjust source list & description to include row tables ([51f3697](https://github.com/webern-unibas-ch/awg-app/commit/51f3697a2848149c57db1670d3b42bed36fb2310))
-   **edition:** check for rowTableView in ViewComponent ([e102614](https://github.com/webern-unibas-ch/awg-app/commit/e102614d430c6e76b15d069c6b9db03eeae9a2a5))
-   **edition:** don't use snapshot to observe queryParamMap ([5b2bde0](https://github.com/webern-unibas-ch/awg-app/commit/5b2bde0aeacd645ba04a1e212a296b90eac967d3))
-   **edition:** fix source description of op. 25 ([a82ca09](https://github.com/webern-unibas-ch/awg-app/commit/a82ca0997e4780ebb96bdfe4c96c6d5ba5785156))
-   **edition:** fix type errors after RxJS update ([1ae7b25](https://github.com/webern-unibas-ch/awg-app/commit/1ae7b2547bb7c53a4ab80ac2ab497e0c28dbbaf7))
-   **edition:** fix wrong route paths and names ([3f0ca35](https://github.com/webern-unibas-ch/awg-app/commit/3f0ca35a082503ba5ef577efc0a92493e58ce29c))
-   **edition:** include breadcrumb navigation for series and complexes ([b6d9d9f](https://github.com/webern-unibas-ch/awg-app/commit/b6d9d9f4535082f412ab1ee8baa2e395e1dcd746))
-   **edition:** include row table for op. 25 ([025eb09](https://github.com/webern-unibas-ch/awg-app/commit/025eb095214d0b921c91c5b72dcea949fb4e355c))
-   **edition:** list sections in series overview ([8fc4b6d](https://github.com/webern-unibas-ch/awg-app/commit/8fc4b6d06c289748fe944965291456c1810ef1db))
-   **edition:** move components of edition report to same level ([ec52c82](https://github.com/webern-unibas-ch/awg-app/commit/ec52c82d10002ebe9a4a358da39a24d079a4696d))
-   **edition:** remove unused image placeholders from edition cards ([6dc1e9f](https://github.com/webern-unibas-ch/awg-app/commit/6dc1e9f6b5e46e563583a90fcf58d630356e759e))
-   **edition:** reset query params when switching routes ([41cfc0e](https://github.com/webern-unibas-ch/awg-app/commit/41cfc0ea823de74fcb8533e50244d0301c81ce70))
-   **edition:** split convoluteId into id and label ([74e086b](https://github.com/webern-unibas-ch/awg-app/commit/74e086bbfe78c09827cf1ec7f87c2c2df0bf014b))
-   **edition:** switch order of convolute and accolade view ([f1693eb](https://github.com/webern-unibas-ch/awg-app/commit/f1693ebfb64aff10e17d4ef84dd3ad5c7a34d55f))
-   **edition:** update modification date for op. 25 ([3d2e7cd](https://github.com/webern-unibas-ch/awg-app/commit/3d2e7cd29254d7ccece8994df71069219adc79e8))
-   **edition:** update source description op. 25 C ([ff31b2e](https://github.com/webern-unibas-ch/awg-app/commit/ff31b2e49222ac31b4e83d9083a536b1c032c054))
-   **edition:** use ActivatedRoute not Router to trigger EditionSheetsData ([09c6124](https://github.com/webern-unibas-ch/awg-app/commit/09c6124fb9121c70aa655058ef5178da176fa335))
-   **home:** include row tables link in home view text ([eb86673](https://github.com/webern-unibas-ch/awg-app/commit/eb86673e52de57f5a4b804595e1eba991dde4228))
-   **home:** update home text and links ([baa53f6](https://github.com/webern-unibas-ch/awg-app/commit/baa53f690a814abcea4e2129099599b366943b53))
-   **search:** add compop conditions for res pointer and edge cases ([0daf91f](https://github.com/webern-unibas-ch/awg-app/commit/0daf91fe701dd038872be665ccec2c525529ab4c))
-   **search:** add index files for search view components ([2126a35](https://github.com/webern-unibas-ch/awg-app/commit/2126a35feecd1d90c4127bca3cce67026ce3766d))
-   **search:** add required validation with custom if-condition - ongoing ([1f8e8e5](https://github.com/webern-unibas-ch/awg-app/commit/1f8e8e544e4dc1cfb3adcf20fb9662817d0878da))
-   **search:** adjust DataApiervice to handle ExtendedSearch queries ([8eb4cb8](https://github.com/webern-unibas-ch/awg-app/commit/8eb4cb8cdf36c4ddeddb99c4ae09daf589b87346))
-   **search:** adjust SearchPanel to handle different search modes ([da19e77](https://github.com/webern-unibas-ch/awg-app/commit/da19e77401dff084134a7ebfea3754719cf5a8e8))
-   **search:** adjust type of search queries ([f3c530d](https://github.com/webern-unibas-ch/awg-app/commit/f3c530d9407ad3cfe4a04a53e5e9200c4f34d08e))
-   **search:** clean up code ([ef4f4bb](https://github.com/webern-unibas-ch/awg-app/commit/ef4f4bb0458811dd283c9a59d734f71043053fc0))
-   **search:** clean up extended search form ([0ff354f](https://github.com/webern-unibas-ch/awg-app/commit/0ff354f297d348563888f827145d52dc8a36748b))
-   **search:** do not reset ExtendedSearchForm ([60e116e](https://github.com/webern-unibas-ch/awg-app/commit/60e116ea744e8c05a57ff5fd19f7488369b5c8e6))
-   **search:** do not use incorrect API nhits for search result length ([b9a070a](https://github.com/webern-unibas-ch/awg-app/commit/b9a070a28065b0235cf49d766211bf0c11807e07))
-   **search:** extend SearchParamsModel ([d9fc138](https://github.com/webern-unibas-ch/awg-app/commit/d9fc1386c520b969db6466f4bd3914de814019be))
-   **search:** fix wrong compop values ([65d251d](https://github.com/webern-unibas-ch/awg-app/commit/65d251dbf87921fbc52209dddf1347ebba4751c9))
-   **search:** improve change conditions in FullText search input ([e330001](https://github.com/webern-unibas-ch/awg-app/commit/e330001a586b17739d111529cbe7bfbde2fcfd2e))
-   **search:** improve GET method in SearchPanelComponent ([0764f95](https://github.com/webern-unibas-ch/awg-app/commit/0764f95106c53df14ab6a756c399301efa020cbd))
-   **search:** improve handling of searchParam generation ([2130a9f](https://github.com/webern-unibas-ch/awg-app/commit/2130a9fd511a290f4383eb772fd6a94f70809094))
-   **search:** improve handling of SearchTabs ([34af7e6](https://github.com/webern-unibas-ch/awg-app/commit/34af7e6c83e59971537cb8c7e2e971beb8dc3871))
-   **search:** remove unused code from DataApiService ([bac8cc5](https://github.com/webern-unibas-ch/awg-app/commit/bac8cc59865ac2f0ea6483fc15af078c6292cc89))
-   **search:** reorganize DataView routes to include ExtendedSearch ([877a1c8](https://github.com/webern-unibas-ch/awg-app/commit/877a1c8d20396ebafeb186df5ac4c053417c1708))
-   **search:** simplify SearchPanelComponent ([c497c86](https://github.com/webern-unibas-ch/awg-app/commit/c497c86913a152a8f77a7c1e1cf3df5e98faddb3))
-   **search:** use common function for all API requests in DataApiService ([d6223cc](https://github.com/webern-unibas-ch/awg-app/commit/d6223cce4f819cadf7479724ff34236328c8079f))
-   **search:** use only one API GET method for search modes ([26b8eb9](https://github.com/webern-unibas-ch/awg-app/commit/26b8eb90ea6f3862a7308efe28d13b7bd1afde3b))
-   **search:** use tabs to display different search modes ([f8910f5](https://github.com/webern-unibas-ch/awg-app/commit/f8910f516fd06a1181c2c139a6c632582531f861))
-   **side-info:** adjust display message for search results ([d9d9a4b](https://github.com/webern-unibas-ch/awg-app/commit/d9d9a4b7ef5c9035d56bec2412fcdb6312e83af2))
-   **side-info:** adjust navigation back to search panel in ResSideInfo ([7223654](https://github.com/webern-unibas-ch/awg-app/commit/7223654a34dce7bf8819441d794adce1f8e00d33))

### Tests

-   **app:** fix tests after changes ([ab34087](https://github.com/webern-unibas-ch/awg-app/commit/ab34087b3a35ca62229f3efe9fe8b538f58b213f))
-   **app:** remove custom matcher toHaveCssClass to use toHaveClass ([3cbd7c8](https://github.com/webern-unibas-ch/awg-app/commit/3cbd7c80b5fa8d207baaef449252e264a4a3fd94))
-   **app:** use FontAwesomeTestingModule for tests ([f2ed316](https://github.com/webern-unibas-ch/awg-app/commit/f2ed3167b7e173f007b5fd8cbbc7f038363ddf8f))
-   **edition:** add tests for EditionComplexComponent ([85f9bab](https://github.com/webern-unibas-ch/awg-app/commit/85f9baba2df1e415df02067a4dbae91ed7bfa8f1))
-   **edition:** add tests for RowTablesComponent ([0c85678](https://github.com/webern-unibas-ch/awg-app/commit/0c85678b8fad1cda20925a37d04ba19a0360ac4c))
-   **edition:** add tests for SourceEvaluationComponent ([3dc72e3](https://github.com/webern-unibas-ch/awg-app/commit/3dc72e3ab3f17cadbd48bf091e9dc3ca838746ec))
-   **edition:** add tests for SourcesComponent ([0d297dd](https://github.com/webern-unibas-ch/awg-app/commit/0d297dd46d545a53c90af1a15ec002fcdf959184))
-   **edition:** add tests for SparqlTableComponent ([a2ba438](https://github.com/webern-unibas-ch/awg-app/commit/a2ba4387cdeae8a97c15d60626e55bd80d723413))
-   **edition:** add tests for TextCriticsComponent ([2c9861f](https://github.com/webern-unibas-ch/awg-app/commit/2c9861f5e6b164714986601b5c7f58b95aa63129))
-   **edition:** adjust tests after changes ([ab8d9e7](https://github.com/webern-unibas-ch/awg-app/commit/ab8d9e7854414eafd594388d7e56f27e357fe89a))
-   **edition:** adjust tests for SourceDescriptionComponent ([599e3da](https://github.com/webern-unibas-ch/awg-app/commit/599e3da377c28ade29db24d5c0acdb1b64333938))
-   **edition:** adjust tests for SourceListComponent ([2572ee4](https://github.com/webern-unibas-ch/awg-app/commit/2572ee47741a8b2cd88512bc9ec43269d5216295))
-   **edition:** fix setup for SearchPanel tests after changes ([176113b](https://github.com/webern-unibas-ch/awg-app/commit/176113b23797d8030c4acaec752eaf3305c12357))
-   **edition:** fix test setup for EditionComplexComponent ([d51c7a3](https://github.com/webern-unibas-ch/awg-app/commit/d51c7a31a04b8a64c5aa7200e3b4c4957ea21db1))
-   **edition:** fix tests after changes ([d29bed5](https://github.com/webern-unibas-ch/awg-app/commit/d29bed5494d6266093718a106e3f86e95cede28e))
-   **edition:** fix tests after changes ([eaea458](https://github.com/webern-unibas-ch/awg-app/commit/eaea45815dce0c1dd0709f77aa0fff1b49539224))
-   **edition:** fix tests after changes ([c63dd0b](https://github.com/webern-unibas-ch/awg-app/commit/c63dd0b6326fa4b558dd91cb2034e7e7fb2c4549))
-   **edition:** fix tests after changes ([b032f53](https://github.com/webern-unibas-ch/awg-app/commit/b032f533cef94c634b49cba7751074562d0b76a9))
-   **edition:** fix type errors after RxJS update ([a6e4048](https://github.com/webern-unibas-ch/awg-app/commit/a6e40484aaa3e17325d72cb0fc947a598ddd1e08))
-   **edition:** serve test data for edition components from test helpers ([60ff923](https://github.com/webern-unibas-ch/awg-app/commit/60ff9236164516d0a51161d4e9071c2d29c16ac2))
-   **home:** fix tests after changes ([4173d89](https://github.com/webern-unibas-ch/awg-app/commit/4173d892d3503c59d386b2d9091915d5d45fb945))
-   **search:** add tests for DataApiService after changes ([9f3fada](https://github.com/webern-unibas-ch/awg-app/commit/9f3fada1d5500623d0ef1479a7adbba976a760c3))
-   **search:** fix tests after changes ([52bd679](https://github.com/webern-unibas-ch/awg-app/commit/52bd679e522de065ac9034f0b02d19e9a50f9def))
-   **search:** fix tests for ResearchInfo after changes ([4182e3f](https://github.com/webern-unibas-ch/awg-app/commit/4182e3f971b1cdd2dfd7d98ff38c36a6c57ae883))
-   **search:** fix tests for ResourceDetailHtml components after changes ([cc80b1a](https://github.com/webern-unibas-ch/awg-app/commit/cc80b1a134de811c7122c74771d967e453d170db))
-   **search:** fix tests of SearchOverviewComponent after changes ([cf683bf](https://github.com/webern-unibas-ch/awg-app/commit/cf683bf3333b44fa11c7f0c553daa3db9b16bccb))
-   **search:** fix text for ResourceDetailProps component ([f632754](https://github.com/webern-unibas-ch/awg-app/commit/f63275414220c9010e03c1a7f4b7146613625fcf))
-   **search:** move accordion panel helper into test helpers ([704e7b9](https://github.com/webern-unibas-ch/awg-app/commit/704e7b952142c834002e6917bc78d229c609b583))
-   **shared:** adjust setup for TableComponent ([56e1801](https://github.com/webern-unibas-ch/awg-app/commit/56e1801d83be299409f17bcd2f4ac426c67d70f7))
-   **side-info:** fix class name of fa-icon after changes ([435d5d5](https://github.com/webern-unibas-ch/awg-app/commit/435d5d524a3fec7b4600af975264a4c11d87592a))

### Documentation

-   **app:** add missing jsdocs to components ([4f6abe9](https://github.com/webern-unibas-ch/awg-app/commit/4f6abe9566af90e337fdb6e52991517ad18895c8))
-   **edition:** add missing comment (SonarCloud fix) ([cf07266](https://github.com/webern-unibas-ch/awg-app/commit/cf072667e445aeb0143a4afdc301c4f0c89c832a))
-   **search:** add jsdocs to compop and valuetype models ([dec674c](https://github.com/webern-unibas-ch/awg-app/commit/dec674c3b764c390d9bd60f3bdced72531481fab))
-   **search:** add missing jsdocs to components ([628394b](https://github.com/webern-unibas-ch/awg-app/commit/628394bb6f8c2a28f07dec31c9570ce582a67cc8))

### Build System

-   **app:** adjust lint-staged target files ([4da3a1b](https://github.com/webern-unibas-ch/awg-app/commit/4da3a1bf50fd372965e9293e9dbb4a61928fec27))
-   **app:** rename prettier scripts ([cf162f9](https://github.com/webern-unibas-ch/awg-app/commit/cf162f95aae5727ca9b4bbc87adcffc16c9d65f2))
-   **core:** enable ng cli cache ([0b3fc99](https://github.com/webern-unibas-ch/awg-app/commit/0b3fc99f1a9b940dbe66c8cc8971d73b8805b00d))
-   **core:** update node version to 14 ([c419532](https://github.com/webern-unibas-ch/awg-app/commit/c419532af1d284dca65cf7e0253951634e6eb31b))
-   **deps-dev:** bump @commitlint/cli from 15.0.0 to 16.0.2 ([09ddcce](https://github.com/webern-unibas-ch/awg-app/commit/09ddcce68ff0e12439261196556b6fbf567e4585))
-   **deps-dev:** bump @commitlint/config-angular from 15.0.0 to 16.0.0 ([d4273c9](https://github.com/webern-unibas-ch/awg-app/commit/d4273c98c490f83032c8ee0f32fe4f9a4ffc65db))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.16 to 1.1.18 ([7b36633](https://github.com/webern-unibas-ch/awg-app/commit/7b36633478059fbce60adca2d53ec78de4c80016))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.18 to 1.1.19 ([b3c83c7](https://github.com/webern-unibas-ch/awg-app/commit/b3c83c70f86324eab7f60899e48570648322cf55))
-   **deps-dev:** bump commit related packages to latest versions ([2822602](https://github.com/webern-unibas-ch/awg-app/commit/2822602aeee2b8689d8002fa81018ce943ec87a3))
-   **deps-dev:** bump eslint related packages to latest version ([292d9fe](https://github.com/webern-unibas-ch/awg-app/commit/292d9fe6fb3e42ebf4825fcf3dba74f8cf0bbdaa))
-   **deps-dev:** bump eslint related packages to latest version ([3f3b9a3](https://github.com/webern-unibas-ch/awg-app/commit/3f3b9a317ad314e314817edf81a8caa64fee3727))
-   **deps-dev:** bump gzipper from 6.0.0 to 6.2.1 ([60a63fb](https://github.com/webern-unibas-ch/awg-app/commit/60a63fbe7e5213a047f12ae42ca38d20376dc81b))
-   **deps-dev:** bump gzipper from 6.2.1 to 7.0.0 ([ea41228](https://github.com/webern-unibas-ch/awg-app/commit/ea412284b1556bfb142ef251e61314fdc906fddc))
-   **deps-dev:** bump karma from 6.3.9 to 6.3.11 ([953cd6a](https://github.com/webern-unibas-ch/awg-app/commit/953cd6a82955db7e5f48712950f87fd6d5870895))
-   **deps-dev:** bump lint-staged from 12.1.2 to 12.1.7 ([c8e8c4e](https://github.com/webern-unibas-ch/awg-app/commit/c8e8c4ea28c0b0c4eb184198acb2e0b098f65a38))
-   **deps-dev:** bump pretty-quick from 3.1.2 to 3.1.3 ([c1ca56e](https://github.com/webern-unibas-ch/awg-app/commit/c1ca56e6574949141cab0e40c587c076a280f684))
-   **deps-dev:** bump test related packages to latest versions ([625e9ae](https://github.com/webern-unibas-ch/awg-app/commit/625e9aee9757eefded9f28ca0aa530147d80ca28))
-   **deps-dev:** bump typescript from 4.5.4 to 4.5.5 ([0975e5c](https://github.com/webern-unibas-ch/awg-app/commit/0975e5cf63dc288f54fc3e5e5f0dc3d3ffab7a96))
-   **deps-dev:** remove pretty-quick ([1693935](https://github.com/webern-unibas-ch/awg-app/commit/169393550ccaf1a39a67b8ab44a6ec2266f0ead2))
-   **deps:** bump [@angular](https://github.com/angular) packages from 13.1.1 to 13.1.3 ([67bd446](https://github.com/webern-unibas-ch/awg-app/commit/67bd4462e0f9cf52e75646f15f25e4aadd35f36f))
-   **deps:** bump [@angular](https://github.com/angular) packages from 13.1.3 to 13.2.4 ([b0bd395](https://github.com/webern-unibas-ch/awg-app/commit/b0bd3953c0f50837bf220e0c1ad32446a9eaa7f8))
-   **deps:** bump [@fortawesome](https://github.com/fortawesome) packages to latest version ([ab1466e](https://github.com/webern-unibas-ch/awg-app/commit/ab1466eac571c86e1cf1730c006eaa2a5fc0bc6a))
-   **deps:** bump @kolkov/ngx-gallery from 1.2.3 to 2.0.0 ([ea72980](https://github.com/webern-unibas-ch/awg-app/commit/ea7298062ac7ad1367868168be0a878e1aaa2d93))
-   **deps:** bump @kolkov/ngx-gallery from 1.2.3 to 2.0.1 ([2eebf16](https://github.com/webern-unibas-ch/awg-app/commit/2eebf169dece4fe706df44168a70a9572e3c901a))
-   **deps:** bump actions/setup-node from 2.5.0 to 2.5.1 ([01fec23](https://github.com/webern-unibas-ch/awg-app/commit/01fec23cd5b3c523c4dac2e867afa9f79a09989b))
-   **deps:** bump actions/setup-node from 2.5.1 to 3 ([d2f2c88](https://github.com/webern-unibas-ch/awg-app/commit/d2f2c887ddff79317dd4318c4c4f251bc7838df1))
-   **deps:** bump codemirror from 5.64.0 to 5.65.0 ([74aed1f](https://github.com/webern-unibas-ch/awg-app/commit/74aed1faac07fe8a8f40139e70fef4ac395dc22b))
-   **deps:** bump core-js from 3.19.1 to 3.21.1 ([7c52839](https://github.com/webern-unibas-ch/awg-app/commit/7c52839a1beafc16b29cb00b4a61d1ca329c1a91))
-   **deps:** bump nanoid from 3.1.23 to 3.2.0 ([e02265b](https://github.com/webern-unibas-ch/awg-app/commit/e02265b15b0268d218b5be4440f62380743baf65))
-   **deps:** bump remaining dependencies to latest versions ([e1fd0cd](https://github.com/webern-unibas-ch/awg-app/commit/e1fd0cd3aca180e0d052e458a6441d7a9cfb0b77))
-   **deps:** bump rxjs from 6.6.7 to 7.5.2 ([17f1d19](https://github.com/webern-unibas-ch/awg-app/commit/17f1d1924f46a1d62fca2026f978f81b3bc3e688))

### [0.7.19](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.18...v0.7.19) (2022-01-15)

### Build System

-   **deps:** bump follow-redirects from 1.14.4 to 1.14.7 ([aa25b3e](https://github.com/webern-unibas-ch/awg-app/commit/aa25b3eefa4ed8b41f2fc89ed9f92d28fc5b0837))
-   **deps:** bump follow-redirects from 1.14.4 to 1.14.7 ([4e3a7df](https://github.com/webern-unibas-ch/awg-app/commit/4e3a7dfa8257d0c9ac7139e4cca3fe6d422cf51f))
-   **deps:** bump marked from 4.0.7 to 4.0.10 ([ee804c2](https://github.com/webern-unibas-ch/awg-app/commit/ee804c2a9c40978b4dea88bb1edeab2b3959fc13))

### [0.7.18](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.17...v0.7.18) (2021-12-17)

### Features

-   **edition:** display self linking nodes in GraphVisualizer ([2731e05](https://github.com/webern-unibas-ch/awg-app/commit/2731e0504c4e4a44784abfa234484b9ae4281ef1))

### Bug Fixes

-   **assets:** fix typo in SPARQL example queries ([75ab140](https://github.com/webern-unibas-ch/awg-app/commit/75ab1407f5b4342680cd139fddfc6ac36fdb7475))
-   **edition:** fix wrong look up order of graph nodes ([8398418](https://github.com/webern-unibas-ch/awg-app/commit/8398418185b9a1f4c425fcd68d8df06683588166))
-   **edition:** improve force graph display settings ([a855216](https://github.com/webern-unibas-ch/awg-app/commit/a85521651d42f59e65124bd0f6bc1073e7d4e078))
-   **search:** fix SALSAH vocabulary name ([620b527](https://github.com/webern-unibas-ch/awg-app/commit/620b527e3ed26042fb54033e11ef9e272c1be22b))

### Build System

-   **core:** move lint-staged config into separate file ([3764942](https://github.com/webern-unibas-ch/awg-app/commit/3764942d75cf9dac52e8bf4bc9d6ebc21b062cd8))
-   **core:** move standard-version config into separate file ([bb9a8e8](https://github.com/webern-unibas-ch/awg-app/commit/bb9a8e8fa3a66cf8525056fc922079a81abce914))
-   **deps-dev:** bump @commitlint/cli from 14.1.0 to 15.0.0 ([0b318b3](https://github.com/webern-unibas-ch/awg-app/commit/0b318b3b6f11243dfb182df57332fbb27de505c9))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.15 to 1.1.16 ([eeaa2f1](https://github.com/webern-unibas-ch/awg-app/commit/eeaa2f1468b67ee4281895b7c9294dfb6517279b))
-   **deps-dev:** bump angular-cli-ghpages from 1.0.0-rc.2 to 1.0.0 ([7de2f2d](https://github.com/webern-unibas-ch/awg-app/commit/7de2f2dcde64677ba7069c726c843f70cff111a1))
-   **deps-dev:** bump eslint related packages to latest version ([cef283f](https://github.com/webern-unibas-ch/awg-app/commit/cef283f7de92ceeaa32550cd028c076a8fcc0c14))
-   **deps-dev:** bump lint related packages to latest version ([baf7aed](https://github.com/webern-unibas-ch/awg-app/commit/baf7aedfe377087977b9866ba46d719ec9ad9cbf))
-   **deps-dev:** bump ngx-order-pipe from 2.1.1 to 2.2.0 ([9b7368d](https://github.com/webern-unibas-ch/awg-app/commit/9b7368d9b43b46e166125ecb8d8ceebc72f0a354))
-   **deps-dev:** bump pretty-quick from 3.1.1 to 3.1.2 ([af57c47](https://github.com/webern-unibas-ch/awg-app/commit/af57c47f0777f10c7f56b4b037e056eb2bc81361))
-   **deps-dev:** bump test related package to latest version ([61d60c1](https://github.com/webern-unibas-ch/awg-app/commit/61d60c17982d8182a354dc71e0053d88199a5c77))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 10.0.0 to 11.0.0 ([3b0422b](https://github.com/webern-unibas-ch/awg-app/commit/3b0422bdb5222f67695be07da08a7e932a7b7c44))
-   **deps:** bump actions/setup-node from 2.4.1 to 2.5.0 ([1e69bcd](https://github.com/webern-unibas-ch/awg-app/commit/1e69bcd800cfe98dc8475f978d696fa09ec0fc9d))
-   **deps:** bump codemirror packages to latest version ([90c1a6d](https://github.com/webern-unibas-ch/awg-app/commit/90c1a6d5ba6afda5ad8032c336d2d3af8d5ba204))
-   **deps:** bump n3 from 1.11.2 to 1.12.2 ([f0f6d87](https://github.com/webern-unibas-ch/awg-app/commit/f0f6d878296b1c4f4c6a3b46b9491355edbe9a2a))
-   **deps:** bump nth-check from 2.0.0 to 2.0.1 ([afd66c5](https://github.com/webern-unibas-ch/awg-app/commit/afd66c5f934589831299486ec124ce4052cb9f4b))
-   **deps:** update [@angular](https://github.com/angular) to version 13 ([274c7be](https://github.com/webern-unibas-ch/awg-app/commit/274c7bea474d650fa53deb5739e63a194e8db838))

### Tests

-   **app:** fix type error in mockWindow ([db0b8c6](https://github.com/webern-unibas-ch/awg-app/commit/db0b8c6f147d711cd0d147d3ca72d04d28ce4fc7))

### [0.7.17](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.16...v0.7.17) (2021-11-15)

### Bug Fixes

-   **app:** add 'scope' attribute to <th> tags (SonarCloud analysis fix) ([4d6be54](https://github.com/webern-unibas-ch/awg-app/commit/4d6be54a17f65658af6933172f5d45ac308421fb))
-   **app:** add a description to tables (SonarCloud analysis fix) ([6f1512b](https://github.com/webern-unibas-ch/awg-app/commit/6f1512bb7f22e1a0d1b9e01e078a184e5604f61f))
-   **app:** fix regex for SALSAH resource ids ([522a438](https://github.com/webern-unibas-ch/awg-app/commit/522a438e4477987fe532a104b8586b05277092d8))
-   **app:** fix regex for SALSAH resource ids again ([c3636a2](https://github.com/webern-unibas-ch/awg-app/commit/c3636a2a73fd07d089e16b2859284505b2ab6490))
-   **app:** fix unexpected empty arrow functions (SonarCloud analysis fix) ([17e0aaa](https://github.com/webern-unibas-ch/awg-app/commit/17e0aaa5c1ee750f11bce72fb4ac5f4946c7fe09))
-   **app:** fix unexpected empty arrow functions (SonarCloud analysis fix) ([008ec50](https://github.com/webern-unibas-ch/awg-app/commit/008ec507a5614c87abad4faf229ade5ff71ea45c))
-   **app:** remove empty methodds (SonarCloud analysis fix) ([155b9d7](https://github.com/webern-unibas-ch/awg-app/commit/155b9d78855dfaeea7fb6c592feed295761713ef))
-   **app:** replace `<i>` tags by `<em>` (SonarCloud analysis fix) ([b7d3863](https://github.com/webern-unibas-ch/awg-app/commit/b7d3863cb51408cf5ca5df42ea09d28554e50a1a))
-   **app:** simplify import of converter plugins ([d14c742](https://github.com/webern-unibas-ch/awg-app/commit/d14c742df5b20cecea4c1cc9b799f18352488271))
-   **app:** use forEach instead of map if no return value (SonarCloud fix) ([e37f620](https://github.com/webern-unibas-ch/awg-app/commit/e37f620b6bc93676656733a7223cddfb997635d6))
-   **app:** use https links instead of http (SonarCloud analysis fix) ([9369b02](https://github.com/webern-unibas-ch/awg-app/commit/9369b029fff93af7fd971cb7d111398d4416951b))
-   **assets:** fix import of js plugins ([4de3d16](https://github.com/webern-unibas-ch/awg-app/commit/4de3d16bb21953dd025fe7e896b514f767591193))
-   **assets:** replace `<i>` tags by `<em>` (SonarCloud analysis fix) ([0ab4b22](https://github.com/webern-unibas-ch/awg-app/commit/0ab4b22242a429b07dcd4fd4e7f8ad66e6ceb5fd))
-   **assets:** use let/const instead of var in dateConverter (SonarCloud) ([1f56bd7](https://github.com/webern-unibas-ch/awg-app/commit/1f56bd79ea389bbcab7877c0d86d5f25ca2ef407))
-   **assets:** use let/const instead of var in htmlConverter (SonarCloud) ([53c0066](https://github.com/webern-unibas-ch/awg-app/commit/53c00660d1c45e3257697d6493a60dc0b2f13aa7))
-   **core:** continue with regex ([66b88fd](https://github.com/webern-unibas-ch/awg-app/commit/66b88fd583d0266f45ffe6cd6abc0d69a80a6a4b))
-   **edition:** add interface for cmConfig type ([8aea522](https://github.com/webern-unibas-ch/awg-app/commit/8aea522f6980ba6cf1594ba786122c43a92c3872))
-   **edition:** fix calculation of graph nodes' default radius ([fbfeb99](https://github.com/webern-unibas-ch/awg-app/commit/fbfeb99a5de10d021fa93a0723b87e4a008608bf))
-   **edition:** improve handling of namespaces in GraphVisualizer ([5a22ab5](https://github.com/webern-unibas-ch/awg-app/commit/5a22ab525a7b30f9c821ec341308f80ed3007e9d))
-   **edition:** move NamespaceTypes to model file ([c65d1d2](https://github.com/webern-unibas-ch/awg-app/commit/c65d1d2df8ac9ef669e5e2aa22dcb5d6e95c7c86))
-   **page-not-found:** add 'alt' attribute to `<img>` (SonarCloud analysis) ([b50e533](https://github.com/webern-unibas-ch/awg-app/commit/b50e5339469137e6caa5ee84fdf642dfda32d377))
-   **search:** improve handling of GND events ([ca69a06](https://github.com/webern-unibas-ch/awg-app/commit/ca69a069574bcafc383d397bdcbab16dfa05332a))
-   **search:** replace linkedObj table with `<ul>` (SonarCloud analysis fix) ([fcfd507](https://github.com/webern-unibas-ch/awg-app/commit/fcfd5077ef7e43cb1fd9c8dfbac185fa38a0186b))
-   **shared:** add a "title" attribute to `<iframe>` tag ([d8c7d3a](https://github.com/webern-unibas-ch/awg-app/commit/d8c7d3adb3a8b67fcf21f7e7844b014388dea41f))
-   **shared:** improve pseudo randomizer in compile-html (SonarCloud fix) ([2f52878](https://github.com/webern-unibas-ch/awg-app/commit/2f528787c615e6ed211643a07987db6253a08fca))
-   **shared:** use correct type for status in BasicResponseJson ([ef32ca6](https://github.com/webern-unibas-ch/awg-app/commit/ef32ca682085e3522bc5a5ae6180df9e2aa72766))

### Documentation

-   **app:** fix jsdoc errors after compodoc update ([8d7d0b3](https://github.com/webern-unibas-ch/awg-app/commit/8d7d0b3ea038d1bf643eac33890fdceea9ee869a))
-   **CHANGELOG:** add credits to [@vanBithoven](https://github.com/vanBithoven) ([a159267](https://github.com/webern-unibas-ch/awg-app/commit/a159267dbb940177feebe2b665c273252750e089))
-   **README:** fix link to code of conduct ([1224288](https://github.com/webern-unibas-ch/awg-app/commit/1224288e5d56889ff4c95d49bde4601a8a34ff06))

### Tests

-   **app:** fix diverse unused assignments (SonarCloud Analysis) ([5ff1579](https://github.com/webern-unibas-ch/awg-app/commit/5ff15797118dfe4e1e1d689116e682c5843ef527))
-   **app:** fix unused assignments of spy calls (SonarCloud Analysis) ([d2b333d](https://github.com/webern-unibas-ch/awg-app/commit/d2b333d322f332c3b6d0c02adf6f29b9b6ba2d8f))
-   **app:** remove unused assignments of compEl ([a50c81b](https://github.com/webern-unibas-ch/awg-app/commit/a50c81bc6614a7eaa548c752744adf49183bcfeb))
-   **edition:** complete the task associated to "TODO" comments ([62c1899](https://github.com/webern-unibas-ch/awg-app/commit/62c1899879b30fe27405e83c70eaedf13165a4ab))
-   **edition:** remove Regex from SourceDesc tests (SonarCloud fix) ([33726a2](https://github.com/webern-unibas-ch/awg-app/commit/33726a27c4360d98f6d31e50d65a1a216386b25d))

### Continuous Integration

-   **gh-actions:** add SonarCloud analysis workflow ([7616cac](https://github.com/webern-unibas-ch/awg-app/commit/7616cacf81e5fa63c4f5ee259fd8b3de719dd1f6))
-   **gh-actions:** configuring Sonar coverage ([dddb16d](https://github.com/webern-unibas-ch/awg-app/commit/dddb16deadc0ae214082e3959489b4d1670add71))
-   **gh-actions:** configuring Sonar lcov report paths ([25091f2](https://github.com/webern-unibas-ch/awg-app/commit/25091f26704d5334c74bda01825be740df52b1cc))
-   **gh-actions:** do not trigger ci workflow for dependabot push events ([e8454f0](https://github.com/webern-unibas-ch/awg-app/commit/e8454f0ed80db92184ae0abc500fd929e47eaa6a))
-   **gh-actions:** fix indentation ([8aadedf](https://github.com/webern-unibas-ch/awg-app/commit/8aadedf07e7c6b6e2512392120bdf0aa142f86dd))
-   **gh-actions:** include SonarCloud analysis in test workflow ([63282e1](https://github.com/webern-unibas-ch/awg-app/commit/63282e1c7456f9586381c50cf294c96622a0c801))
-   **gh-actions:** skip CodeQL run for Dependabot branches on push events ([5cf99d8](https://github.com/webern-unibas-ch/awg-app/commit/5cf99d8f2d3f0dcb9cad7787f8282bb52f5ba901))
-   **gh-actions:** upgrade to node version 14.17 as default ([bc3ee39](https://github.com/webern-unibas-ch/awg-app/commit/bc3ee39e62339efb0eb2fedc1445c4dd455db25e))

### Build System

-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages from 13.2.1 to 14.1.0 ([0774842](https://github.com/webern-unibas-ch/awg-app/commit/07748429e3d9a2aecb1d0924c2343e4515b12071))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 5.2.0 to 5.3.1 ([94189e8](https://github.com/webern-unibas-ch/awg-app/commit/94189e8c989640fec53b5ac7255027348185fb19))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.13 to 1.1.15 ([0cc6000](https://github.com/webern-unibas-ch/awg-app/commit/0cc6000f3a01479d8779553ef5adb81c66edc289))
-   **deps-dev:** bump @types/jasmine from 3.10.1 to 3.10.2 ([712dae6](https://github.com/webern-unibas-ch/awg-app/commit/712dae66bcdf134fa3298d3e8dd2f1efb04e0881))
-   **deps-dev:** bump commit related packages to latest versions ([d493121](https://github.com/webern-unibas-ch/awg-app/commit/d4931210c1b4bc4e0bf8307784d5be442cf134c2))
-   **deps-dev:** bump eslint packages to latest versions ([6a661dd](https://github.com/webern-unibas-ch/awg-app/commit/6a661ddd9420efb3b01687de99c88859dea7de80))
-   **deps-dev:** bump eslint related packages to latest version ([69e488a](https://github.com/webern-unibas-ch/awg-app/commit/69e488a8ef6136a226a386d2f37d7b63fc2fe275))
-   **deps-dev:** bump eslint related packages to latest version ([0bc28a0](https://github.com/webern-unibas-ch/awg-app/commit/0bc28a07303df64dede555296c5f87bd19dc043a))
-   **deps-dev:** bump eslint related packages to latest version ([4d19890](https://github.com/webern-unibas-ch/awg-app/commit/4d1989017e4200e8b030cd29eabb64ac5277f3bf))
-   **deps-dev:** bump eslint-plugin-import from 2.25.2 to 2.25.3 ([fcd8af3](https://github.com/webern-unibas-ch/awg-app/commit/fcd8af3dd45b1e34c9f14b9b2beff6f817b62551))
-   **deps-dev:** bump eslint-plugin-prettier from 3.4.1 to 4.0.0 ([e113eb5](https://github.com/webern-unibas-ch/awg-app/commit/e113eb5d1dc1961b41a344883ad8ab034e7a6caa))
-   **deps-dev:** bump gzipper from 5.0.0 to 5.0.1 ([b03d7f8](https://github.com/webern-unibas-ch/awg-app/commit/b03d7f874a1a12256f23f51a7569058495405764))
-   **deps-dev:** bump gzipper from 5.0.1 to 6.0.0 ([abe64d7](https://github.com/webern-unibas-ch/awg-app/commit/abe64d7d3b6f168b5e31d29a3b73743707700896))
-   **deps-dev:** bump jasmine packages from 3.8.2 to 3.10.0 ([2bf786e](https://github.com/webern-unibas-ch/awg-app/commit/2bf786e139e67c9580c6170759c1e3d2ac3d42e1))
-   **deps-dev:** bump karma from 6.3.6 to 6.3.8 ([d7db5c7](https://github.com/webern-unibas-ch/awg-app/commit/d7db5c77166d7d74ed001b00efe3a2b4c7aa40e5))
-   **deps-dev:** bump lint-staged from 11.2.3 to 11.2.6 ([2276719](https://github.com/webern-unibas-ch/awg-app/commit/22767196472786ad0287c7c24189b806f5f7f519))
-   **deps-dev:** bump lint-staged from 11.2.6 to 12.0.2 ([ea4e619](https://github.com/webern-unibas-ch/awg-app/commit/ea4e619a61cf6345600ea47f5e5408a0f1d05b4d))
-   **deps-dev:** bump prettier from 2.3.2 to 2.4.0 ([776403c](https://github.com/webern-unibas-ch/awg-app/commit/776403c00b96d2fa9b667a8cdbebb850509a916c))
-   **deps-dev:** bump prettier from 2.4.0 to 2.4.1 ([7a333b2](https://github.com/webern-unibas-ch/awg-app/commit/7a333b2ecdf4634c6f5d700cffa241073bd3af3c))
-   **deps-dev:** bump remaining dev dependencies to latest versions ([03d3961](https://github.com/webern-unibas-ch/awg-app/commit/03d396180323bbf9d63a524ad31c27e43f0d43f3))
-   **deps-dev:** bump test related packages to latest versions ([5378a4b](https://github.com/webern-unibas-ch/awg-app/commit/5378a4bc18184a2219ac5cf09784eafde02a9aee))
-   **deps-dev:** downgrade eslint until sub packages can handle v8 ([e50f491](https://github.com/webern-unibas-ch/awg-app/commit/e50f4916b3736c96b30302aa044fb5a86cc23326))
-   **deps-dev:** replace deprecated prettier option ([b4cf8c6](https://github.com/webern-unibas-ch/awg-app/commit/b4cf8c62fdf0f3ebad6e7f22f0beec7a200d7a37))
-   **deps:** bump [@angular](https://github.com/angular) packages from 12.2.11 to 12.2.12 ([24c52c6](https://github.com/webern-unibas-ch/awg-app/commit/24c52c6430ca2f6710d6640b27a4c89d24ac1425))
-   **deps:** bump [@angular](https://github.com/angular) packages from 12.2.12 to 12.2.13 ([10d820d](https://github.com/webern-unibas-ch/awg-app/commit/10d820db0d645d3285467db381d93704f7b2972c))
-   **deps:** bump [@angular](https://github.com/angular) packages from 12.2.4 to 12.2.5 ([ca60298](https://github.com/webern-unibas-ch/awg-app/commit/ca6029849df8d0f76702e8d34facf30793dff845))
-   **deps:** bump [@angular](https://github.com/angular) packages from 12.2.5 to 12.2.6 ([714b660](https://github.com/webern-unibas-ch/awg-app/commit/714b66043557eb5f4a87bf0970e66b6efea96aec))
-   **deps:** bump [@angular](https://github.com/angular) packages from 12.2.6 to 12.2.8 ([8d27579](https://github.com/webern-unibas-ch/awg-app/commit/8d2757904c4a8407b239286cccb620bc94ab7e91))
-   **deps:** bump [@angular](https://github.com/angular) packages from 12.2.6 to 12.2.8 ([6319b1a](https://github.com/webern-unibas-ch/awg-app/commit/6319b1aa91fbbf498e36ef2d54de96df207505e3))
-   **deps:** bump @ctrl/ngx-codemirror from 5.0.1 to 5.1.0 ([a261eff](https://github.com/webern-unibas-ch/awg-app/commit/a261effd1e3d12dd848938d5e673180ec9a3a147))
-   **deps:** bump @fortawesome/angular-fontawesome from 0.9.0 to 0.10.1 ([524a410](https://github.com/webern-unibas-ch/awg-app/commit/524a41069185e0558734541e2bd0c2ece75787fb))
-   **deps:** bump actions/setup-node from 2.4.0 to 2.4.1 ([c627aae](https://github.com/webern-unibas-ch/awg-app/commit/c627aaeff05c41066d537f87675e0891354a82f3))
-   **deps:** bump codecov/codecov-action from 2.0.3 to 2.1.0 ([9450bb3](https://github.com/webern-unibas-ch/awg-app/commit/9450bb3d792b4f107b8d321dabf2eeb7f04c4d65))
-   **deps:** bump codemirror from 5.62.3 to 5.63.0 ([1c77473](https://github.com/webern-unibas-ch/awg-app/commit/1c77473bed543899d3eec3dfd07eba906faa751b))
-   **deps:** bump codemirror from 5.63.1 to 5.63.3 ([bdcd5eb](https://github.com/webern-unibas-ch/awg-app/commit/bdcd5eb7f5275e0b8da877dbdb8a0564f2cdf785))
-   **deps:** bump codemirror packages to latest version ([1d87ef7](https://github.com/webern-unibas-ch/awg-app/commit/1d87ef7453e09213e06e2a7266827f3d3a4e5611))
-   **deps:** bump core-js from 3.18.3 to 3.19.1 ([c5541d7](https://github.com/webern-unibas-ch/awg-app/commit/c5541d78b6a145164b6b0aa7eb3d59a43a5ed933))
-   **deps:** bump lint related packages to latest version ([857aafb](https://github.com/webern-unibas-ch/awg-app/commit/857aafbd9667ccd8ed99c507a42dc81bff5a4299))
-   **deps:** bump n3 from 1.11.1 to 1.11.2 ([6245984](https://github.com/webern-unibas-ch/awg-app/commit/62459842962437a64a7274d8715910adf4bd654c))
-   **deps:** bump url-parse from 1.5.1 to 1.5.3 ([0043cbb](https://github.com/webern-unibas-ch/awg-app/commit/0043cbb7a5ab5d03cd17c6691311912ec2861ad3))

### [0.7.16](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.15...v0.7.16) (2021-09-08)

### Features

-   **edition:** add sample queries for select ([ba1b6b5](https://github.com/webern-unibas-ch/awg-app/commit/ba1b6b560e462e684e860abf3434f6c1a93b8312); thanks to [@vanBithoven](https://github.com/vanBithoven))

### Continuous Integration

-   **gh-actions:** remove node v15 from workflow matrix ([8e7afa0](https://github.com/webern-unibas-ch/awg-app/commit/8e7afa08aafc6b0ad91f6fa6b0af97e841792ecf))
-   **gh-actions:** trigger workflow on pull-request ([bab471b](https://github.com/webern-unibas-ch/awg-app/commit/bab471b5ef479bc0d6eb6a86ed628a325096062d); thanks to [@vanBithoven](https://github.com/vanBithoven))
-   **gh-actions:** trigger workflow on pull-request ([867acf8](https://github.com/webern-unibas-ch/awg-app/commit/867acf84be473a5b2ec3726f0dddaaf68aab7c4e); thanks to [@vanBithoven](https://github.com/vanBithoven))
-   **gh-actions:** use built-in cache from action/setup-node ([f28222b](https://github.com/webern-unibas-ch/awg-app/commit/f28222b93ccb4723f492c89f0f81fdab21025118))

### Tests

-   **app:** add tests for ToastService and ToastComponent ([086bb28](https://github.com/webern-unibas-ch/awg-app/commit/086bb2886c49419487e25fe462ea50c58b44dd8a))
-   **app:** fix phrasing of some tests ([f4ce441](https://github.com/webern-unibas-ch/awg-app/commit/f4ce44186e248de28a6afca0c9e3ebdc9e6deb9e))
-   **edition:** add more tests ([40213f9](https://github.com/webern-unibas-ch/awg-app/commit/40213f97c07b244bbdd0589ce6d955bf81578232))
-   **edition:** add tests for EditionAccoladeComponent ([4759178](https://github.com/webern-unibas-ch/awg-app/commit/475917825f0abf5cc574f003ee324b9bd2174b03))
-   **edition:** add tests for EditionConvoluteComponent ([bacae56](https://github.com/webern-unibas-ch/awg-app/commit/bacae5643e006efac9e363ef765ae902f93d71ad))
-   **edition:** add tests for EditionSvgSheetNavComponent ([21f8cea](https://github.com/webern-unibas-ch/awg-app/commit/21f8cea40fb40182900eae582fc2aa221c91e20d))
-   **edition:** add tests for EditionTkaTableComponent ([dc515ac](https://github.com/webern-unibas-ch/awg-app/commit/dc515ac6b9f01a061b1505993ceb3678dfbfb756))
-   **edition:** add tests for SourceDescriptionComponent ([db482e6](https://github.com/webern-unibas-ch/awg-app/commit/db482e6d3aecb24520dc6fd88c7b504785a2cc86))
-   **edition:** add tests for SourceListComponent ([9811169](https://github.com/webern-unibas-ch/awg-app/commit/9811169897d671690f95d89e446c17cb58bd96fc))
-   **edition:** additional testing for graph-view ([c793115](https://github.com/webern-unibas-ch/awg-app/commit/c793115bbf7e720cae9e2b713134e111de1ecf8f); thanks to [@vanBithoven](https://github.com/vanBithoven))
-   **edition:** additional testing for sparql-editor ([966183e](https://github.com/webern-unibas-ch/awg-app/commit/966183e4d33bd8409392036ad27f9999e38b67f7); thanks to [@vanBithoven](https://github.com/vanBithoven))
-   **edition:** fix testing for graph-visualizer.component ([14ccecc](https://github.com/webern-unibas-ch/awg-app/commit/14ccecc8309e5bf9592c570421c7935850d4970f); thanks to [@vanBithoven](https://github.com/vanBithoven))
-   **edition:** fix testing for graph-visualizer.component ([8a74e9b](https://github.com/webern-unibas-ch/awg-app/commit/8a74e9be54d3b6db2a2f9f42deb3332ff37ad814); thanks to [@vanBithoven](https://github.com/vanBithoven))
-   **edition:** fix tests for EditionSvgSheet and SparqlTable ([1549f19](https://github.com/webern-unibas-ch/awg-app/commit/1549f1951faa5a682ace3f62ac6a400b9ca4512b))

### Documentation

-   **core:** add JSDocs to Toast class ([7ddad0b](https://github.com/webern-unibas-ch/awg-app/commit/7ddad0bdab6c3278827afc1f6c33393de5fadaca))
-   **README:** add contributors ([e56a51a](https://github.com/webern-unibas-ch/awg-app/commit/e56a51afa39910b9b66192a90b230d0d48a961ec))

### Build System

-   **app:** add husky install script ([21ef203](https://github.com/webern-unibas-ch/awg-app/commit/21ef203c07dffd886f660e1a2a642b99ee3c35b4); thanks to [@vanBithoven](https://github.com/vanBithoven))
-   **app:** rename package.json scripts for build and docs ([61cbafa](https://github.com/webern-unibas-ch/awg-app/commit/61cbafa64b8eef66143746010c64f52c5013abe5))
-   **deps:** bump [@angular](https://github.com/angular) packages from 12.1.0 to 12.1.1 ([752fc72](https://github.com/webern-unibas-ch/awg-app/commit/752fc72647ba002c34d7e1627ac7e6178e5c6f8b))
-   **deps:** bump [@angular](https://github.com/angular) packages from 12.1.1 to 12.1.3 ([34d1426](https://github.com/webern-unibas-ch/awg-app/commit/34d1426aff4260d876ca4a3b8357de68203ac75d))
-   **deps:** bump [@angular](https://github.com/angular) packages from 12.1.3 to 12.2.0 ([19d0708](https://github.com/webern-unibas-ch/awg-app/commit/19d070857dbab0a0b25279e9201e01eea90d5ae6))
-   **deps:** bump [@angular](https://github.com/angular) packages from 12.2.0 to 12.2.4 ([fbb8131](https://github.com/webern-unibas-ch/awg-app/commit/fbb8131ea36f8903489dc6f37479cacab5f51cc4))
-   **deps:** bump [@fortawesome](https://github.com/fortawesome) packages to latest version ([c026b98](https://github.com/webern-unibas-ch/awg-app/commit/c026b985f062f3860aa0fde27b0c904c953d5b50))
-   **deps:** bump @angular/localize from 12.1.0 to 12.1.1 ([f7001a9](https://github.com/webern-unibas-ch/awg-app/commit/f7001a9ed293cf0a2bc89473c0b1a754525abafc))
-   **deps:** bump @ctrl/ngx-codemirror from 4.1.1 to 5.0.0 ([8493251](https://github.com/webern-unibas-ch/awg-app/commit/84932514e128b99b337563b414ac24c2731a8a36))
-   **deps:** bump @fortawesome/angular-fontawesome from 0.8.2 to 0.9.0 ([36874f4](https://github.com/webern-unibas-ch/awg-app/commit/36874f47ad0fb820812e8e0a18be82ec3004a7e0))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 9.1.3 to 10.0.0 ([dca4632](https://github.com/webern-unibas-ch/awg-app/commit/dca46320d7d33c7bbafb01a34a2cdbe470995d77))
-   **deps:** bump actions/setup-node from 2.1.5 to 2.2.0 ([c432351](https://github.com/webern-unibas-ch/awg-app/commit/c4323517aa6654a71f5d1064389bfb5516a5e1bd))
-   **deps:** bump actions/setup-node from 2.2.0 to 2.3.0 ([0bfbdef](https://github.com/webern-unibas-ch/awg-app/commit/0bfbdef2158cd15493b9ca94ce783037716dbc78))
-   **deps:** bump actions/setup-node from 2.3.0 to 2.3.1 ([9265cbf](https://github.com/webern-unibas-ch/awg-app/commit/9265cbf98be731cc3709635ef18c1faef03f06e8))
-   **deps:** bump actions/setup-node from 2.3.1 to 2.3.2 ([14b5373](https://github.com/webern-unibas-ch/awg-app/commit/14b5373d1a8285bd6f0861286e0410040e457c61))
-   **deps:** bump actions/setup-node from 2.3.2 to 2.4.0 ([708d06f](https://github.com/webern-unibas-ch/awg-app/commit/708d06f853b227a8af7c47cb12e1184264aff505))
-   **deps:** bump codecov/codecov-action from 1 to 2.0.1 ([690c7dd](https://github.com/webern-unibas-ch/awg-app/commit/690c7ddf220b727b91b74eb8dc0860f902404633))
-   **deps:** bump codecov/codecov-action from 2.0.1 to 2.0.2 ([1bb74c9](https://github.com/webern-unibas-ch/awg-app/commit/1bb74c9e5fba0fe2dee7a972eb8c47751ac1d256))
-   **deps:** bump codecov/codecov-action from 2.0.2 to 2.0.3 ([e6afd56](https://github.com/webern-unibas-ch/awg-app/commit/e6afd56c7696f0d93d9f61de4b94c7853df3e61a))
-   **deps:** bump codemirror and n3 to latest version ([8dfd3e8](https://github.com/webern-unibas-ch/awg-app/commit/8dfd3e89027f254d86ab94c89674d34adbac4279))
-   **deps:** bump core-js from 3.15.1 to 3.15.2 ([db46a07](https://github.com/webern-unibas-ch/awg-app/commit/db46a0705a756a654e412ccb71072fbdf5ec2625))
-   **deps:** bump n3 from 1.10.0 to 1.11.0 ([cb528f7](https://github.com/webern-unibas-ch/awg-app/commit/cb528f71bdbaa8c19ed68650e04964ddad8ca11f))
-   **deps:** bump remaining dependencies to latest versions ([1d340db](https://github.com/webern-unibas-ch/awg-app/commit/1d340db93cbfefba4a185869418184939673018b))
-   **deps:** downgrade compodoc to 1.1.13 ([7760dfa](https://github.com/webern-unibas-ch/awg-app/commit/7760dfaa8dab9a17af36d4a13ecc4f7753ffb3b9))
-   **deps-dev:** bump [@angular-eslint](https://github.com/angular-eslint) packages from 4.3.0 to 12.2.0 ([fd1da1e](https://github.com/webern-unibas-ch/awg-app/commit/fd1da1ee1bb7ffcfbea1e6b6239c8f6237b4b367))
-   **deps-dev:** bump [@angular](https://github.com/angular) dev packages from 12.1.0 to 12.1.1 ([c4672b2](https://github.com/webern-unibas-ch/awg-app/commit/c4672b2154923e96ed44f46c9699a9898796d577))
-   **deps-dev:** bump [@angular](https://github.com/angular) packages from 12.1.3 to 12.2.0 ([509669b](https://github.com/webern-unibas-ch/awg-app/commit/509669b45134265704b907d74a483ab4df7e859a))
-   **deps-dev:** bump [@commitlint](https://github.com/commitlint) packages 12.1.1 to 12.1.4 ([b5c35a2](https://github.com/webern-unibas-ch/awg-app/commit/b5c35a23070819966784d9ea1690e88abcb52f93))
-   **deps-dev:** bump [@types](https://github.com/types) packages to latest version ([37e90c7](https://github.com/webern-unibas-ch/awg-app/commit/37e90c701336ea2b3ef05f14286d930b5910729b))
-   **deps-dev:** bump [@typescript-eslint](https://github.com/typescript-eslint) packages from 4.28.1 to 4.28.2 ([caca9bf](https://github.com/webern-unibas-ch/awg-app/commit/caca9bf9ddaea92f760557efec261277bda551cd))
-   **deps-dev:** bump @angular-devkit/build-angular ([cf82a3e](https://github.com/webern-unibas-ch/awg-app/commit/cf82a3eb3c3d4641971a8cf7d5896116baaef8ee))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.11 to 1.1.12 ([c65c726](https://github.com/webern-unibas-ch/awg-app/commit/c65c72645c13f4005a3369a337400330fefa5e86))
-   **deps-dev:** bump @compodoc/compodoc from 1.1.12 to 1.1.13 ([8ff963a](https://github.com/webern-unibas-ch/awg-app/commit/8ff963a88d184cc55510446f15a3d39eda49d6a5))
-   **deps-dev:** bump @types/d3 from 6.7.4 to 7.0.0 ([1ce13d6](https://github.com/webern-unibas-ch/awg-app/commit/1ce13d65c9de492ab784175053cb1d3152f32f43))
-   **deps-dev:** bump dev-dependencies to latest versions ([21df395](https://github.com/webern-unibas-ch/awg-app/commit/21df39532ff192f576d98e8c8d6abe8c2b114973))
-   **deps-dev:** bump eslint packages to latest versions ([b75ebf6](https://github.com/webern-unibas-ch/awg-app/commit/b75ebf6a0c765a303fde4a38d30e4307349c10f4))
-   **deps-dev:** bump eslint packages to latest versions ([62d5d7e](https://github.com/webern-unibas-ch/awg-app/commit/62d5d7eedc4a02dfea324f25f4df97b19b2989af))
-   **deps-dev:** bump eslint packages to latest versions ([03b2287](https://github.com/webern-unibas-ch/awg-app/commit/03b2287afdd755030b0ec992120f63215fadf22e))
-   **deps-dev:** bump eslint-plugin-jsdoc from 35.4.1 to 35.4.2 ([80bc09e](https://github.com/webern-unibas-ch/awg-app/commit/80bc09e02f7c60fc6552680c9ef31b53866d98e1))
-   **deps-dev:** bump git hook related packages to latest versions ([7c17d95](https://github.com/webern-unibas-ch/awg-app/commit/7c17d95adb057c350f5983ab152763b8e46d89f1))
-   **deps-dev:** bump husky from 6.0.0 to 7.0.0 ([c324b3d](https://github.com/webern-unibas-ch/awg-app/commit/c324b3d85059c243cf49fb22c2ff2763561619dd))
-   **deps-dev:** bump husky from 7.0.0 to 7.0.1 ([9fc9d11](https://github.com/webern-unibas-ch/awg-app/commit/9fc9d118a04f4a86a1f9cc734bf208f9094cacb2))
-   **deps-dev:** bump lint-staged from 11.1.1 to 11.1.2 ([9bc29b8](https://github.com/webern-unibas-ch/awg-app/commit/9bc29b8171e4a4d85a059c168d10f3b1845a0afd))
-   **deps-dev:** bump remaining dev dependencies to latest versions ([ae06f19](https://github.com/webern-unibas-ch/awg-app/commit/ae06f1930578b838d1d967647478333b4468fc46))
-   **deps-dev:** bump typescript from 4.3.4 to 4.3.5 ([7e85a87](https://github.com/webern-unibas-ch/awg-app/commit/7e85a877905adbb11033d8ad3058b7d5ec6dd0a0))

### [0.7.15](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.14...v0.7.15) (2021-06-27)

### Features

-   **edition:** add highlighting to SparqlTable ([c116a64](https://github.com/webern-unibas-ch/awg-app/commit/c116a641aea9271e7ab2b2900c4eed8a7f5f063a))
-   **edition:** add pagination and sorting to SELECT table ([00f1b3b](https://github.com/webern-unibas-ch/awg-app/commit/00f1b3b1a979d08697739118838ec3070cf2a4aa))
-   **edition:** add select response model ([9c5ff36](https://github.com/webern-unibas-ch/awg-app/commit/9c5ff36430993d0333eac4b022f7b7f345cf8573))
-   **edition:** add SPARQL select request with table view ([f4ce7db](https://github.com/webern-unibas-ch/awg-app/commit/f4ce7db57fcd8f8d0a759756fade0c0b8d6b71c8))
-   **edition:** add ToastService to display error messages ([67fb64b](https://github.com/webern-unibas-ch/awg-app/commit/67fb64ba6262910d2725ba1692d8d1c77d3e849f))

### Bug Fixes

-   **edition:** activate onTableNodeClick function ([c940b0c](https://github.com/webern-unibas-ch/awg-app/commit/c940b0c7bd320b79fa4a3fb6a22c9ab7d7fb5e1a))
-   **edition:** add awg prefix to PrefixPipe ([0767bbc](https://github.com/webern-unibas-ch/awg-app/commit/0767bbcb53472e9fa7dacf646389b55540b9ddec))
-   **edition:** fix onTableNodeClick and small code clean up ([d8d273b](https://github.com/webern-unibas-ch/awg-app/commit/d8d273bbe50c19d09b611c023f5954ed61262397))
-   **edition:** improv error handling for graph viszualizer ([a01bf8a](https://github.com/webern-unibas-ch/awg-app/commit/a01bf8a8e96521c34f9e4ad212a618cd69dbdff7))
-   **edition:** improve interplay of search & pagination in SparqlTable ([012de28](https://github.com/webern-unibas-ch/awg-app/commit/012de28f524e95bbf9e2a303b5f970f4d7dd8321))
-   **edition:** improve logic of filtered and paginated rows ([98737dc](https://github.com/webern-unibas-ch/awg-app/commit/98737dc01bc9122b46c466c81ac4642768ae8520))
-   **edition:** improve sparql select result table ([cfbd5ee](https://github.com/webern-unibas-ch/awg-app/commit/cfbd5ee0550c5253312424a51aebc8371261e2e2))
-   **edition:** provide GraphVisualizerService from module, not root ([5cb82c8](https://github.com/webern-unibas-ch/awg-app/commit/5cb82c8a2b10cc4c68e78582b0a6a984dd018e36))
-   **edition:** send queryTime to SelectResultsComponent ([a2deb46](https://github.com/webern-unibas-ch/awg-app/commit/a2deb462e445197b31a883c49d679972ecdfaf2b))
-   **edition:** transform integer values to numbers for SELECT table ([178bd7d](https://github.com/webern-unibas-ch/awg-app/commit/178bd7d0091c99f6ad6f077878fd03c4e4d962cb))
-   **edition:** use prefix pipe for select results ([6323d79](https://github.com/webern-unibas-ch/awg-app/commit/6323d79194019e82280309e603a8f87f3e81dee5))

### Tests

-   **edition:** fix tests after changes for GraphVisualizer ([bc5e8a5](https://github.com/webern-unibas-ch/awg-app/commit/bc5e8a5a300e8e2e3272022985b065097ec8db15))

### Continuous Integration

-   **gh-actions:** add workaround for build path issue with node 16 ([321fd19](https://github.com/webern-unibas-ch/awg-app/commit/321fd19dabe207bb8349f953d25784926f5fe7b4))
-   **gh-actions:** move node to v15.14 ([a2ba516](https://github.com/webern-unibas-ch/awg-app/commit/a2ba516c1bc403429c698707989a8353dfbe94fe))
-   **gh-actions:** update codeql-analysis.yml ([fd31a91](https://github.com/webern-unibas-ch/awg-app/commit/fd31a91dda75a90f51d20885c038d63f25b76385))

### Documentation

-   **edition:** add jsdoc to new method in GraphVisualizerService ([2a0f470](https://github.com/webern-unibas-ch/awg-app/commit/2a0f4705c26cbdd9eb4abc6231e8a97e22342583))
-   **README:** add angular version badge ([560f0b9](https://github.com/webern-unibas-ch/awg-app/commit/560f0b9415ca676d49ec14c8b7bd2e87557b3810))
-   **README:** add link to angular version badge ([59869ba](https://github.com/webern-unibas-ch/awg-app/commit/59869baeef0327e58fc194ee8b78099b24b7e091))

### Build System

-   **app:** add zenodo config file ([935bd8f](https://github.com/webern-unibas-ch/awg-app/commit/935bd8fafd57afff0be7f2c090a286253b826df5))
-   **app:** clean up framework after update to angular 12 ([e6e02d2](https://github.com/webern-unibas-ch/awg-app/commit/e6e02d2e84a0b5677ffc8ea5f19937ababd68bea))
-   **app:** fix build script ([99ef0fe](https://github.com/webern-unibas-ch/awg-app/commit/99ef0feb45c6a7fc68caced55510ac426770d911))
-   **app:** switch order of husky pre-commit tasks ([498b5f2](https://github.com/webern-unibas-ch/awg-app/commit/498b5f23cc6d832478ab26275221007c19957df1))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 9.1.1 to 9.1.2 ([f645618](https://github.com/webern-unibas-ch/awg-app/commit/f645618086e5fea03f22dff9d9b5f16806874993))
-   **deps:** bump @ng-bootstrap/ng-bootstrap from 9.1.2 to 9.1.3 ([5b6ec51](https://github.com/webern-unibas-ch/awg-app/commit/5b6ec512afb38cace8e2e02a7d1cad0c961ffa17))
-   **deps:** bump actions/setup-node from 1 to 2.1.5 ([c9653f7](https://github.com/webern-unibas-ch/awg-app/commit/c9653f766671545fbb2cf79f6b915c9e9472e910))
-   **deps:** bump codemirror from 5.61.0 to 5.61.1 ([a6fcb30](https://github.com/webern-unibas-ch/awg-app/commit/a6fcb309897faa00114d493e0939b36dee91ca1e))
-   **deps:** bump codemirror from 5.61.1 to 5.62.0 ([e76efdb](https://github.com/webern-unibas-ch/awg-app/commit/e76efdb7d6b825361e6d843c925b730913beb338))
-   **deps:** bump core-js from 3.11.0 to 3.12.1 ([e0b6bbf](https://github.com/webern-unibas-ch/awg-app/commit/e0b6bbf8229dab01883a6f126c2ff7929f11638c))
-   **deps:** bump core-js from 3.14.0 to 3.15.1 ([61f78df](https://github.com/webern-unibas-ch/awg-app/commit/61f78dfc77f8cc431df046bffe8796e1d21125bc))
-   **deps:** bump d3-force from 2.1.1 to 3.0.0 ([1b046e2](https://github.com/webern-unibas-ch/awg-app/commit/1b046e2f720dcc381bd2a712fde19b585020def2))
-   **deps:** bump tslib from 2.2.0 to 2.3.0 ([6e21371](https://github.com/webern-unibas-ch/awg-app/commit/6e2137141881903669d52f1fd331d4f64f461d0e))
-   **deps:** enable production builds by default ([8a600fb](https://github.com/webern-unibas-ch/awg-app/commit/8a600fbd3c2903d0b4516d0c9b15640a23104eba))
-   **deps:** fix node version ([964969d](https://github.com/webern-unibas-ch/awg-app/commit/964969daa22f70f2dfe5b1e28de486ce2d40790d))
-   **deps:** move back to node v14 ([8babfcb](https://github.com/webern-unibas-ch/awg-app/commit/8babfcbe1062e2d85f9d51036915de977259750f))
-   **deps:** replace OrderByPipe by OrderModule ([4061220](https://github.com/webern-unibas-ch/awg-app/commit/4061220aed6e38b43d462c751d0115c0ae3b1b43))
-   **deps:** update [@angular](https://github.com/angular) to version 12 ([bba47b5](https://github.com/webern-unibas-ch/awg-app/commit/bba47b5d8eb25a3de52444eb331c80fb4807caf1))
-   **deps:** update d3 dependencies ([f373392](https://github.com/webern-unibas-ch/awg-app/commit/f37339275a7a97254bfcf26d5e24c523b463a809))
-   **deps:** update dependencies ([7c28b72](https://github.com/webern-unibas-ch/awg-app/commit/7c28b72dfe000c93355e3b7ede0d104a14dd13a2))
-   **deps:** update dependencies ([bcde536](https://github.com/webern-unibas-ch/awg-app/commit/bcde536afaab411f2a77f1459ae27d1386f20b5c))
-   **deps:** update node ([af5b28a](https://github.com/webern-unibas-ch/awg-app/commit/af5b28aa22c5dc9278eb9b94bce691d485ce8a88))
-   **deps-dev:** bump @angular-eslint/builder from 4.2.0 to 4.3.0 ([f52fd30](https://github.com/webern-unibas-ch/awg-app/commit/f52fd30ac443e2ef3ec1ce42b994107744b4274f))
-   **deps-dev:** bump @angular-eslint/eslint-plugin from 4.2.0 to 4.3.0 ([452b2f8](https://github.com/webern-unibas-ch/awg-app/commit/452b2f83d15ee19148d59108fc64fee567e4b8be))
-   **deps-dev:** bump @angular-eslint/eslint-plugin-template ([4df6166](https://github.com/webern-unibas-ch/awg-app/commit/4df6166465dc0a3b4f662804b032819d8edd99e8))
-   **deps-dev:** bump @types/d3 from 6.3.0 to 6.5.0 ([c06519c](https://github.com/webern-unibas-ch/awg-app/commit/c06519cd6823525a4ba7bd82ffeaab6a3ece8a1b))
-   **deps-dev:** bump @types/d3 from 6.5.0 to 6.7.0 ([f81d5d0](https://github.com/webern-unibas-ch/awg-app/commit/f81d5d00b320aceceefc7228f7374b66bf6d8899))
-   **deps-dev:** bump @types/d3 from 6.7.0 to 6.7.4 ([2d57e12](https://github.com/webern-unibas-ch/awg-app/commit/2d57e12373cc25f1accebfb635c2cf12718dcbb7))
-   **deps-dev:** bump @types/node from 15.0.3 to 15.3.0 ([4678d85](https://github.com/webern-unibas-ch/awg-app/commit/4678d85d2ab55e513ef4eea10c224759c0ed381a))
-   **deps-dev:** bump @types/node from 15.12.2 to 15.12.4 ([b9e064a](https://github.com/webern-unibas-ch/awg-app/commit/b9e064a4c64a46b7ab761f8ee51683702f2bd596))
-   **deps-dev:** bump @types/node from 15.3.0 to 15.3.1 ([7499cdd](https://github.com/webern-unibas-ch/awg-app/commit/7499cddaea9e13e8f722d340b45e9964d19ceab5))
-   **deps-dev:** bump @types/node from 15.3.1 to 15.6.1 ([48e8cce](https://github.com/webern-unibas-ch/awg-app/commit/48e8ccec10e1f9d04f6ba7cbeef2e1b65395eaee))
-   **deps-dev:** bump @typescript-eslint/eslint-plugin ([005e9cc](https://github.com/webern-unibas-ch/awg-app/commit/005e9ccdc6646f802284b83385ee4dfc6ef7fc96))
-   **deps-dev:** bump @typescript-eslint/eslint-plugin ([180e171](https://github.com/webern-unibas-ch/awg-app/commit/180e171556f44ca4cc16530a201e42dc2089174a))
-   **deps-dev:** bump @typescript-eslint/eslint-plugin ([14aa59a](https://github.com/webern-unibas-ch/awg-app/commit/14aa59a8280649dc95ca8dceb665f073c72e80e8))
-   **deps-dev:** bump @typescript-eslint/eslint-plugin ([75dced9](https://github.com/webern-unibas-ch/awg-app/commit/75dced9e044114f757c57549c1962bfe9249f20c))
-   **deps-dev:** bump @typescript-eslint/parser from 4.23.0 to 4.24.0 ([87e5371](https://github.com/webern-unibas-ch/awg-app/commit/87e5371b427bc5f5863ab2733247c75404b431b0))
-   **deps-dev:** bump @typescript-eslint/parser from 4.24.0 to 4.25.0 ([a2b35a5](https://github.com/webern-unibas-ch/awg-app/commit/a2b35a5dae34f1f5a7fc35cd52c88a88221ea40a))
-   **deps-dev:** bump @typescript-eslint/parser from 4.26.1 to 4.28.0 ([dbea1d0](https://github.com/webern-unibas-ch/awg-app/commit/dbea1d007a31920803bd82b11cdbcec52dbb510d))
-   **deps-dev:** bump angular-cli-ghpages from 1.0.0-rc.1 to 1.0.0-rc.2 ([e60aaa9](https://github.com/webern-unibas-ch/awg-app/commit/e60aaa9863910c657d49aab6d3dde0a1ad072557))
-   **deps-dev:** bump eslint from 7.26.0 to 7.27.0 ([41ad9ba](https://github.com/webern-unibas-ch/awg-app/commit/41ad9ba71fa04df605876f8fca02a09404446400))
-   **deps-dev:** bump eslint from 7.28.0 to 7.29.0 ([418c76a](https://github.com/webern-unibas-ch/awg-app/commit/418c76ad1dde82c6cfac8b17d97c1f145fa654b9))
-   **deps-dev:** bump eslint-plugin-import from 2.23.0 to 2.23.2 ([a595990](https://github.com/webern-unibas-ch/awg-app/commit/a595990a721f2f5249522b47048686ae8fe6624e))
-   **deps-dev:** bump eslint-plugin-import from 2.23.2 to 2.23.3 ([1afd145](https://github.com/webern-unibas-ch/awg-app/commit/1afd145dee635e828e587cdb58271c961b93e29a))
-   **deps-dev:** bump eslint-plugin-import from 2.23.3 to 2.23.4 ([01b004f](https://github.com/webern-unibas-ch/awg-app/commit/01b004f5e3de7e7a9efce0a3acae7c9ab444e169))
-   **deps-dev:** bump eslint-plugin-jsdoc from 32.3.4 to 34.8.2 ([df6a9fb](https://github.com/webern-unibas-ch/awg-app/commit/df6a9fbde5e56532b67ba112d5ab4748c70b24d5))
-   **deps-dev:** bump eslint-plugin-jsdoc from 34.8.2 to 35.0.0 ([54c671c](https://github.com/webern-unibas-ch/awg-app/commit/54c671c7a2ad4fa7b436aede654d8d3734bbd40a))
-   **deps-dev:** bump eslint-plugin-jsdoc from 35.0.0 to 35.1.3 ([6575090](https://github.com/webern-unibas-ch/awg-app/commit/6575090e26f02a922e49cc8648bd6a8610cd9f0c))
-   **deps-dev:** bump eslint-plugin-jsdoc from 35.1.3 to 35.4.0 ([94e259a](https://github.com/webern-unibas-ch/awg-app/commit/94e259a3f118989f78c3b6ffbaecae9880f000c6))
-   **deps-dev:** bump gzipper from 4.5.0 to 5.0.0 ([23734d1](https://github.com/webern-unibas-ch/awg-app/commit/23734d168c155233202029ba610aa9a2c4cf5402))
-   **deps-dev:** bump jasmine-core from 3.6.0 to 3.7.1 ([57e5acf](https://github.com/webern-unibas-ch/awg-app/commit/57e5acf3744fde0e7b2b2eddf788adf02810b64d))
-   **deps-dev:** bump karma from 6.3.3 to 6.3.4 ([f56571e](https://github.com/webern-unibas-ch/awg-app/commit/f56571e2e5b25d70c4577894af4585dfe7884141))
-   **deps-dev:** bump lint-staged from 10.5.4 to 11.0.0 ([2c3bc27](https://github.com/webern-unibas-ch/awg-app/commit/2c3bc279859ef41f464709ef146bc6d42f20287d))
-   **deps-dev:** bump pretty-quick from 3.1.0 to 3.1.1 ([ca98c53](https://github.com/webern-unibas-ch/awg-app/commit/ca98c5389903650c2f1fa83f3cdf96f843a6e039))
-   **deps-dev:** bump typescript from 4.1.5 to 4.1.6 ([f2c18bd](https://github.com/webern-unibas-ch/awg-app/commit/f2c18bd1092ba54eb0681402d28413fbed1e9428))
-   **deps-dev:** bump webpack-bundle-analyzer from 4.4.1 to 4.4.2 ([92d02c0](https://github.com/webern-unibas-ch/awg-app/commit/92d02c0647f501d60711e108b262916875992230))

### [0.7.14](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.13...v0.7.14) (2021-05-14)

### Tests

-   **app:** add codecov reporter ([9ea16d4](https://github.com/webern-unibas-ch/awg-app/commit/9ea16d4b6c7ff19d7e0a99d81630e51a4fb62020))
-   **app:** add codecov reporter ([955738f](https://github.com/webern-unibas-ch/awg-app/commit/955738fbc3977215e56e2483f25e26ebe4f3f9ba))

### Continuous Integration

-   **gh-actions:** fix syntax for dependabot.yml ([3ebdee3](https://github.com/webern-unibas-ch/awg-app/commit/3ebdee30f14dbb0d049b756e1152d8657b302dfb))

### Build System

-   **deps:** remove unused npm-run-all ([f6edf0b](https://github.com/webern-unibas-ch/awg-app/commit/f6edf0bb1771bc542a46e7bb1a30ba11518c782c))
-   **deps:** update dependencies ([d873eed](https://github.com/webern-unibas-ch/awg-app/commit/d873eed87209dec5b5c8ded09d29083cb2b3fa58))
-   **deps:** update dependencies ([0d038a6](https://github.com/webern-unibas-ch/awg-app/commit/0d038a63e32483531967ed9ad623efcf68e1cabe))

### [0.7.13](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.12...v0.7.13) (2021-04-25)

### Bug Fixes

-   **edition:** fix typo in graph data ([e08fa3d](https://github.com/webern-unibas-ch/awg-app/commit/e08fa3de533ac8ceeb03e2ac2f41dc2f35d22adc))
-   **edition:** fix typos in source description data ([1590a8b](https://github.com/webern-unibas-ch/awg-app/commit/1590a8b0f121ddd4a91280a9e6d2da328e4e75df))
-   **edition:** make textcritics id working as ngb selector ([aaff894](https://github.com/webern-unibas-ch/awg-app/commit/aaff894e5c43b2bf060b9ec30a6dedf7acd7f743))
-   **edition:** use upper case composition id with EditionService ([65ec61b](https://github.com/webern-unibas-ch/awg-app/commit/65ec61b701d501ad4a100456615ef5fd349f6e32))

### Tests

-   **edition:** fix tests after changes ([69f7fb6](https://github.com/webern-unibas-ch/awg-app/commit/69f7fb672a0cb6d6b0b35ff3322be4db567c89e3))

### [0.7.12](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.11...v0.7.12) (2021-04-25)

### Build System

-   **deps:** update angular-cli-ghpages ([a76976e](https://github.com/webern-unibas-ch/awg-app/commit/a76976e70b6ebf26949d3082fc0bc716aa88df26))

### Continuous Integration

-   **gh-actions:** fix typo in ci workflow ([7c6eaf9](https://github.com/webern-unibas-ch/awg-app/commit/7c6eaf905fd35ebadb27483a69666e12a4f855ca))
-   **gh-actions:** refactor ci workflow ([45e5630](https://github.com/webern-unibas-ch/awg-app/commit/45e5630051464ee646f72184635ca4ebb6be90cb))

### [0.7.11](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.10...v0.7.11) (2021-04-25)

### Documentation

-   **README:** add Zenodo DOI to README ([7b1ae18](https://github.com/webern-unibas-ch/awg-app/commit/7b1ae18dca647573572ff4f89cc687865d40f483))

### Continuous Integration

-   **gh-actions:** add release workflow ([bdfcbea](https://github.com/webern-unibas-ch/awg-app/commit/bdfcbea02a06f1b585cef923810a3c187ab477c9))
-   **gh-actions:** use full build:gh script in test workflow ([304a993](https://github.com/webern-unibas-ch/awg-app/commit/304a99378089adfc3825a3b8f59c09b02aa7bc96))

### Build System

-   **app:** adjust script for GitHub pages build ([57ea67f](https://github.com/webern-unibas-ch/awg-app/commit/57ea67f01169ab802f89f2a2946090374fce5148))
-   **deps:** remove unused devDependencies ([d1fabde](https://github.com/webern-unibas-ch/awg-app/commit/d1fabde58d782f731486115971b534396652bbca))

### [0.7.10](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.9...v0.7.10) (2021-04-24)

### Features

-   **app:** add open graph meta data to index ([8b9e036](https://github.com/webern-unibas-ch/awg-app/commit/8b9e0363f38857ab5a2907503dcc7aecb10200ac))
-   **app:** add titleService to set page title by route ([35bf69d](https://github.com/webern-unibas-ch/awg-app/commit/35bf69d6f9cfc7f215f48efc55d04dc7038f863f))
-   **edition:** add fullscreen mode to GraphVisualizer ([cb05db2](https://github.com/webern-unibas-ch/awg-app/commit/cb05db2d05e7c8329e9f2f37a4d495a93c159be1))

### Tests

-   **app:** fix tests after move to ESLint ([93e5c08](https://github.com/webern-unibas-ch/awg-app/commit/93e5c089f72ec73241d6b666b83c4c1eea111e07))
-   **app:** switch linting rules to eslint ([76c8bfc](https://github.com/webern-unibas-ch/awg-app/commit/76c8bfca3a97e7a28f37520199e7609ed17643e7))
-   **core:** add missing branch test for CachingInterceptor ([c26d34e](https://github.com/webern-unibas-ch/awg-app/commit/c26d34e9b99f284e9daea97ce320bd920e2c2649))
-   **core:** add missing branch test for SearchOverviewComponent ([fa3c95d](https://github.com/webern-unibas-ch/awg-app/commit/fa3c95d9ee09939e888c92a213b654b28d578237))
-   **edition:** fix tests after changes ([a8079b9](https://github.com/webern-unibas-ch/awg-app/commit/a8079b9c913d930f13b30df25288293208fe59ed))

### Continuous Integration

-   **gh-actions:** update CodeQL action ([2afca0d](https://github.com/webern-unibas-ch/awg-app/commit/2afca0d34e6ad854256a79a26d96aa5dca4b825e))
-   **travis:** remove Travis CI pipeline ([4046345](https://github.com/webern-unibas-ch/awg-app/commit/404634549c54c67c9f3f408cf530bcbb966fd202))

### Build System

-   **app:** configure eslint with prettier ([20173cd](https://github.com/webern-unibas-ch/awg-app/commit/20173cdbf909410a480befd7d958526678a6d289))
-   **app:** configure lint-staged with eslint ([b461687](https://github.com/webern-unibas-ch/awg-app/commit/b461687e7a8a2f7f25782c2deefb9463c3d7ed5d))
-   **app:** migrate from tslint to eslint ([a15ed76](https://github.com/webern-unibas-ch/awg-app/commit/a15ed769caace8f04e19e2bf7dc86f16bd6a92f8))
-   **app:** remove obsolete tsconfig.base.json ([7df79e6](https://github.com/webern-unibas-ch/awg-app/commit/7df79e6cea7771c745b4450395dbf3333f4252b2))
-   **app:** update eslint rules according to DSP ([f2918b9](https://github.com/webern-unibas-ch/awg-app/commit/f2918b9c0dbc8e0677ccc6801da93ba59f4e9dce))
-   **deps:** add nodeLinker strategy compatible with Angular ([0350dc9](https://github.com/webern-unibas-ch/awg-app/commit/0350dc9cca917b936b98c6e05b2e3ccc0c6bd00c))
-   **deps:** adjust scripts to yarn 2 ([b99918e](https://github.com/webern-unibas-ch/awg-app/commit/b99918e37c01a1be18af8b338f57162ff22ec61f))
-   **deps:** bump elliptic from 6.5.3 to 6.5.4 ([46243eb](https://github.com/webern-unibas-ch/awg-app/commit/46243eb8709af2d7c859e5b5cf6436e565cba59b))
-   **deps:** bump socket.io from 2.3.0 to 2.4.1 ([70a7031](https://github.com/webern-unibas-ch/awg-app/commit/70a7031b86580e5661603df598c215741889a688))
-   **deps:** bump y18n from 4.0.0 to 4.0.1 ([c97a090](https://github.com/webern-unibas-ch/awg-app/commit/c97a090e030db10ea4b65b7208c646f3ad6d004a))
-   **deps:** switch back to yarn 1 ([3d31803](https://github.com/webern-unibas-ch/awg-app/commit/3d31803c09d9b4dc3201bcd79f03201ca2fa86e1))
-   **deps:** update [@angular](https://github.com/angular) to version 11 ([3559e01](https://github.com/webern-unibas-ch/awg-app/commit/3559e01fb6dac2d83c938311666b35971337128a))
-   **deps:** update dependabot configuration ([47c1b0e](https://github.com/webern-unibas-ch/awg-app/commit/47c1b0e686386aff3cc8f098dc46240b24871a20))
-   **deps:** update dependencies after update to Angular 11 ([4349578](https://github.com/webern-unibas-ch/awg-app/commit/43495785ec4d0d76c28701ee11c508429da33969))
-   **deps:** update files after update to Angular 11 ([7b81eeb](https://github.com/webern-unibas-ch/awg-app/commit/7b81eeb1566c6d7ee867fd476dde8ca18117628b))
-   **deps:** update husky to v6 ([f9fb418](https://github.com/webern-unibas-ch/awg-app/commit/f9fb418da617a26bba55f834cef5bd933cd73a69))
-   **deps:** update version-control deps ([b172b49](https://github.com/webern-unibas-ch/awg-app/commit/b172b494bf99f342b755983ccc0d846cff7a3228))
-   **deps:** upgrade to yarn 2 ([64c6242](https://github.com/webern-unibas-ch/awg-app/commit/64c6242d5b2591d1034b4184c6923def005324a0))

### [0.7.9](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.8...v0.7.9) (2020-11-20)

### Features

-   **edition:** add zoom slider for graph ([6d1caa9](https://github.com/webern-unibas-ch/awg-app/commit/6d1caa92ac8364bd141cabb1b40ca3ca13022860))

### Bug Fixes

-   **app:** inject angular's DOCUMENT in AnalyticsService ([e4e2f71](https://github.com/webern-unibas-ch/awg-app/commit/e4e2f71ade4ee81760f5e4e8d71d29f820e33236))
-   **core:** fix incorrect gnd exposition ([3d6d6fd](https://github.com/webern-unibas-ch/awg-app/commit/3d6d6fd9eec97892cd85a30dccb2cd0f033acf65))
-   **core:** fix unescaped dot in salsah regex ([b22230e](https://github.com/webern-unibas-ch/awg-app/commit/b22230e7a346b16b1858f4b4555095a316f430c3))
-   **core:** improve escape sequence for salsah-links ([ab0f925](https://github.com/webern-unibas-ch/awg-app/commit/ab0f925b44ff03b314c16bbbf1e93e09369e753e))
-   **core:** improve logic for cache Map ([1e82e68](https://github.com/webern-unibas-ch/awg-app/commit/1e82e6819cd880b92a39805f1b2a68735e5c2407))
-   **core:** improve regex for replacing salsah links ([504acd7](https://github.com/webern-unibas-ch/awg-app/commit/504acd79f80827c6105224cf972ea4423d8677e8))
-   **core:** move analytics replacement message to init section ([7ac4fb1](https://github.com/webern-unibas-ch/awg-app/commit/7ac4fb1d925a75e51ddd49cf086a39664fe7abb3))
-   **core:** simplify logic for gnd exposition ([3b4f643](https://github.com/webern-unibas-ch/awg-app/commit/3b4f643408ff2cfc430717fe6e0dd4d88a213059))
-   **core:** switch from ga to gtag for analytics ([b12e2a9](https://github.com/webern-unibas-ch/awg-app/commit/b12e2a9f111d4da913b6dd6dc2ccf74a4c06c404))
-   **edition:** fix d3 event handling in force graph after update to d3 v6 ([e96becb](https://github.com/webern-unibas-ch/awg-app/commit/e96becbd13a205ba3df69c8b1064348b165f6376)), closes [#23](https://github.com/webern-unibas-ch/awg-app/issues/23)
-   **edition:** improve use of EditionSvgOverlayTypes in SvgSheetComponent ([62c1151](https://github.com/webern-unibas-ch/awg-app/commit/62c11517be53daec592426cddf024eb70f2382e3))
-   **edition:** move CONSTRUCT results panel into separate component ([dd46c60](https://github.com/webern-unibas-ch/awg-app/commit/dd46c604919cb5e56eb100ead48616f0495f81e6))
-   **edition:** move SELECT results panel into separate component ([0f2ed59](https://github.com/webern-unibas-ch/awg-app/commit/0f2ed59c7883fe7cb4deb861b57dd4a588c1ec36))
-   **edition:** move sparql editor into separate component ([aaf5f9a](https://github.com/webern-unibas-ch/awg-app/commit/aaf5f9afe3b42e2b05e01eb2bb83782d90fd6280))
-   **edition:** move triples editor into separate component ([28c5b1f](https://github.com/webern-unibas-ch/awg-app/commit/28c5b1fea7f66c52981b3f258bb5b4cd2838cf44))
-   **edition:** move unsupported type results into separate component ([9f1067b](https://github.com/webern-unibas-ch/awg-app/commit/9f1067bf6b24a426891a7134aca80ab23f143b24))
-   **edition:** remove unneeded go mode from code mirror ([4f9dced](https://github.com/webern-unibas-ch/awg-app/commit/4f9dced5291f537d9e85b0a074f6e4d1431190fa))
-   **edition:** simplify logic for typeKey of EditionSvgOverlay ([c61ddad](https://github.com/webern-unibas-ch/awg-app/commit/c61ddad159bbc876cd93cd4d6bba1cdae532a2e4))
-   **edition:** update d3Service to work with d3 v6 ([f6ae36b](https://github.com/webern-unibas-ch/awg-app/commit/f6ae36b8877aa5e0232c09af0df8043e8cdf4266))

### Documentation

-   **CHANGELOG:** rewrite changelog with new config ([7f1d041](https://github.com/webern-unibas-ch/awg-app/commit/7f1d0411a12d0b47494bd19f3c5516211f21b621))
-   **testing:** add JSDocs for new mock helper ([96c84fe](https://github.com/webern-unibas-ch/awg-app/commit/96c84fe0a2212cfb596e473f5c97ded597df77f9))

### Continuous Integration

-   **gh-actions:** run deployment only from master ([f638b58](https://github.com/webern-unibas-ch/awg-app/commit/f638b58a762cecc04cd70d26f8a12b6850dbedf3))
-   **gh-actions:** use push event for CI Tests workflow ([ada06f4](https://github.com/webern-unibas-ch/awg-app/commit/ada06f4ca57d9ce70532dbbda2b925e9985ec61d))
-   **travis:** remove unneeded deploy step ([1f43c9d](https://github.com/webern-unibas-ch/awg-app/commit/1f43c9dddec732d92a023de2cc7fb42ae44a5f1b))

### Build System

-   **app:** rename default github branch to main ([3238272](https://github.com/webern-unibas-ch/awg-app/commit/323827268b8dd7fca5ff53bd5f72e44cd4e66fb8))
-   **deps:** update d3 packages ([01bcfe2](https://github.com/webern-unibas-ch/awg-app/commit/01bcfe2330ae693a69bb17a56b02dd09622366d2))
-   **deps:** update dependencies for Angular v10.2.0 ([5ad2056](https://github.com/webern-unibas-ch/awg-app/commit/5ad20563571aa5dad400976c6bad8d2f31bd7c18))

### Tests

-   **app:** clean up some tests ([75a31de](https://github.com/webern-unibas-ch/awg-app/commit/75a31de44c11fd687aaad2bc72427e940818fa1c))
-   **app:** cleanup for some tests ([a2f79c4](https://github.com/webern-unibas-ch/awg-app/commit/a2f79c4ed86133364ac0de212e2492ffd2fb7ca4))
-   **app:** improve routing logic in AppComponent tests ([fd402bb](https://github.com/webern-unibas-ch/awg-app/commit/fd402bb6423f1ef104910488c4758fbd75316ca2))
-   **app:** remove unused logic from test helpers ([64dfebe](https://github.com/webern-unibas-ch/awg-app/commit/64dfebe3aeae93712198ec5af3d0272e70c1e0c0))
-   **app:** update test.ts ([2dbab11](https://github.com/webern-unibas-ch/awg-app/commit/2dbab1156d4a07d31b3e25c9566b4c72dd3642c2))
-   **core:** add more tests for app component ([a960336](https://github.com/webern-unibas-ch/awg-app/commit/a960336a36afe383ab6114e5d0bdea7aa960de7f))
-   **core:** add self-tests for storages of gnd service ([eebee95](https://github.com/webern-unibas-ch/awg-app/commit/eebee9507b515191a3f18834cc50b2195fcdf271))
-   **core:** add tests for analytics service ([dac95a5](https://github.com/webern-unibas-ch/awg-app/commit/dac95a52dd40c05b758385d9ca0d12f492cc81b4))
-   **core:** add tests for CachingInterceptor ([ed00641](https://github.com/webern-unibas-ch/awg-app/commit/ed00641df4a4b021c7fe7f86393050661d81d26e))
-   **core:** add tests for dataStreamerService ([ac6ea5c](https://github.com/webern-unibas-ch/awg-app/commit/ac6ea5c0f187fedfec32bad65431482a32152719))
-   **core:** add tests for GND exposition to parent windows ([58660c5](https://github.com/webern-unibas-ch/awg-app/commit/58660c57b059ec3962b3557749f54647014413bd))
-   **core:** add tests for HttpCacheService ([85e83a5](https://github.com/webern-unibas-ch/awg-app/commit/85e83a5db3ba24c4e13c1246df1df162f370051b))
-   **core:** add tests for loading service ([a2558df](https://github.com/webern-unibas-ch/awg-app/commit/a2558dfc5cf37502dfee243f862ba95cf394a0e2))
-   **core:** add tests for LoadingInterceptor ([8d8d941](https://github.com/webern-unibas-ch/awg-app/commit/8d8d9416975dba529d84dab8f3f1a519f570b09f))
-   **core:** add tests for sideInfoService ([b50b97d](https://github.com/webern-unibas-ch/awg-app/commit/b50b97dab0a7ae1a90130c3680bbe5a180e8dfbe))
-   **core:** adjust tests for gnd service after changes ([e83a80e](https://github.com/webern-unibas-ch/awg-app/commit/e83a80e33d3896062d0046e15b0df71120ae4962))
-   **core:** fix NgZone issue in AppComponent tests ([885e16b](https://github.com/webern-unibas-ch/awg-app/commit/885e16b8778e04c9a718598d7490f42e593059fd))
-   **core:** improve tests for LoadingService ([4bc3db3](https://github.com/webern-unibas-ch/awg-app/commit/4bc3db30fcd60691f9af16ec86fb6f1ee90e63d9))
-   **core:** move mock helper into separate files ([b50f5e2](https://github.com/webern-unibas-ch/awg-app/commit/b50f5e239ec414af977884da44f97449c44e4fed))
-   **core:** prevent setting of real gtag script in AnalyticsTest ([6b94170](https://github.com/webern-unibas-ch/awg-app/commit/6b9417017f998a6dda8370fe61a3d2cc40eac193))
-   **core:** remove unnecessary test from ApiService ([1c3e0e7](https://github.com/webern-unibas-ch/awg-app/commit/1c3e0e764e895c333aa9db59892251ac79ef842d))
-   **core:** set default values for services in beforeEach ([e945466](https://github.com/webern-unibas-ch/awg-app/commit/e9454669274c95941cde03cd2302f89a05e013e5))
-   **core:** use helper function for analytics setup ([52d0cf3](https://github.com/webern-unibas-ch/awg-app/commit/52d0cf31dc91bbf955f33e28dfd9f6b3c27641b3))
-   **core:** use mockStorage from external file in StorageService ([6e379ea](https://github.com/webern-unibas-ch/awg-app/commit/6e379ea9febc05cc9bd41d42175535530383c28f))
-   **edition:** add missing FontModule in ForceGraphComponent tests ([0247d44](https://github.com/webern-unibas-ch/awg-app/commit/0247d447a2bfadbe93b1b6e020d121216eb307b7))
-   **edition:** add tests for ConstructResultsComponent ([a2e465c](https://github.com/webern-unibas-ch/awg-app/commit/a2e465cdb76a9c4a4d20cf68601e12278ec7f760))
-   **edition:** add tests for EditionGraphComponent ([63165be](https://github.com/webern-unibas-ch/awg-app/commit/63165be60ac74f3dd38ad7050b43de5b2051e835))
-   **edition:** add tests for EditionService ([7e11656](https://github.com/webern-unibas-ch/awg-app/commit/7e11656713eba7b34860a84252fde6fac1821aa3))
-   **edition:** add tests for GraphVisualizerComponent ([9388d2e](https://github.com/webern-unibas-ch/awg-app/commit/9388d2eb211b466a835d02e9631a174fba1ebe16))
-   **edition:** add tests for SelectResultsComponent ([4954cc5](https://github.com/webern-unibas-ch/awg-app/commit/4954cc5712d5c435681f3da0f083a2971f623f62))
-   **edition:** add tests for SparqlComponent ([855f036](https://github.com/webern-unibas-ch/awg-app/commit/855f036d974600dd888dac2b44882dcde03a7a25))
-   **edition:** add tests for TriplesComponent ([f77150c](https://github.com/webern-unibas-ch/awg-app/commit/f77150c1324b56615702126e251325eb0127e0d8))
-   **edition:** add tests for UnsupportedTypeResultsComponent ([63c928b](https://github.com/webern-unibas-ch/awg-app/commit/63c928b267a03039ff40802801425f2d3e83a56d))
-   **edition:** finish tests for EditionDataService ([785bd33](https://github.com/webern-unibas-ch/awg-app/commit/785bd3367bcaa9508b03b39d642069479c68c142))
-   **edition:** finish tests for EditionViewComponent ([177f432](https://github.com/webern-unibas-ch/awg-app/commit/177f4326a5bef39bbccb9e0cb0e356161069bd57))
-   **edition:** use mockService for editionViewComponent ([7d23e0b](https://github.com/webern-unibas-ch/awg-app/commit/7d23e0b82e695bee71cfac8339b017b1c0a53845))
-   **search:** move HttpCacheService to core services ([f0fff03](https://github.com/webern-unibas-ch/awg-app/commit/f0fff03787f0bebe701fdb4cff202e1a7c7457d4))
-   **side-info:** add tests for ResourceInfoComponent ([b042014](https://github.com/webern-unibas-ch/awg-app/commit/b042014293cdab63041b5fb0d32fb4d25db669cf))
-   **side-info:** use mocked DataStreamerService in ResourceInfoComponent ([7a3f518](https://github.com/webern-unibas-ch/awg-app/commit/7a3f5185ada57453d95a5f14889e74798ba783e6))

### [0.7.8](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.7...v0.7.8) (2020-10-13)

### Bug Fixes

-   **core:** make postmessaging in GndService more restrict ([69120b6](https://github.com/webern-unibas-ch/awg-app/commit/69120b674d4718dc439b6a7923c8a0df11182e7d))

### Continuous Integration

-   **gh-actions:** add CodeQl action ([ac428a2](https://github.com/webern-unibas-ch/awg-app/commit/ac428a28a475533893f40a20c7d3d95d0e09f9bf))
-   **gh-actions:** adjust CodeQL action ([8828746](https://github.com/webern-unibas-ch/awg-app/commit/88287465ab6573e9746d6564fdc57d55ae492f90))
-   **gh-actions:** keep ignore commands in ci tests ([51dad76](https://github.com/webern-unibas-ch/awg-app/commit/51dad76f6669145450caecdeaeaa1f459ad525a5))

### [0.7.7](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.6...v0.7.7) (2020-10-09)

### Bug Fixes

-   **core:** fix broken link templates ([dc79bb7](https://github.com/webern-unibas-ch/awg-app/commit/dc79bb7b3c39e9b3235242f1dc8829e41ac8b25c))

### [0.7.6](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.5...v0.7.6) (2020-10-09)

### Features

-   **shared:** add directive for external links ([6a56a04](https://github.com/webern-unibas-ch/awg-app/commit/6a56a04538bb7a015406b08994b3ea5df9b79848))

### Bug Fixes

-   **app:** move target blank from links to directive ([af4223f](https://github.com/webern-unibas-ch/awg-app/commit/af4223fba57ecdd08dbc8db34304896eef2533ab))
-   **core:** move analytics config also into service ([6599fba](https://github.com/webern-unibas-ch/awg-app/commit/6599fba83af1af04cfac34796d70ecdf45b51ccd))
-   **core:** move analytics handling into service ([a6faaf3](https://github.com/webern-unibas-ch/awg-app/commit/a6faaf3c61c6d8c1adcc9452b29d93c7113eb88d))
-   **core:** move analytics id to app config ([57020b8](https://github.com/webern-unibas-ch/awg-app/commit/57020b894fa9c17cf54c07e462548b01305af55b))
-   **shared:** fix errors with osm and external link directive ([769fc1a](https://github.com/webern-unibas-ch/awg-app/commit/769fc1a9d3140969ace45dd6a3461c7dc582639a))

### Documentation

-   **app:** add documentation for ExternalLinkDirective ([401215d](https://github.com/webern-unibas-ch/awg-app/commit/401215d64d9dca999ed2b1722bc8856c8ee4e401))

### Continuous Integration

-   **gh-actions:** do not run tests on master again ([75e479e](https://github.com/webern-unibas-ch/awg-app/commit/75e479e207eae55bf97b64faaaef7809a25dcc6b))

### Tests

-   **shared:** add tests for ExternalLinkDirective ([ad39d0a](https://github.com/webern-unibas-ch/awg-app/commit/ad39d0a0a7f646f5ad2aacd7bc81eeab7b0f53ce))
-   **shared:** remove console output from test ([59479a7](https://github.com/webern-unibas-ch/awg-app/commit/59479a7e345babbdb0e545b5fc1e98ba1fd8e58a))

### Build System

-   **app:** use separate tsconfig file for compodoc ([3378f8d](https://github.com/webern-unibas-ch/awg-app/commit/3378f8d26583c6873af5dc0b849cbfae6818aa39))
-   **deps:** bump http-proxy from 1.17.0 to 1.18.1 ([b2ea4e0](https://github.com/webern-unibas-ch/awg-app/commit/b2ea4e0781e10b8a5b30f9f001ce3b6136cf472f))
-   **deps:** update dependencies ([5c6c126](https://github.com/webern-unibas-ch/awg-app/commit/5c6c1269c7334cf9ae3d6652bb96e5cdc6fe22ec))

### [0.7.5](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.4...v0.7.5) (2020-08-28)

### Features

-   **edition:** lazy load edition view feature modules ([88db959](https://github.com/webern-unibas-ch/awg-app/commit/88db959a4b0957bbe1e9b6b82cedc858e9979505))

### Bug Fixes

-   **app:** remove BrowserAnimationsModule ([3b7ef7c](https://github.com/webern-unibas-ch/awg-app/commit/3b7ef7ca32951aa8df2bb7dcf5db1b8238d2da88))
-   **edition:** add alpha value to forceSimulation restart ([7b2216f](https://github.com/webern-unibas-ch/awg-app/commit/7b2216fc7b1ec38601633f9337a7f111ee7658eb))
-   **edition:** end all subscriptions on destroy ([58306a4](https://github.com/webern-unibas-ch/awg-app/commit/58306a484087964e65383219c24d2fd2c649f9a5))
-   **edition:** fix convolute navigation error ([4c38f5a](https://github.com/webern-unibas-ch/awg-app/commit/4c38f5a06f975a0caabb492bdcd94ec023e37194)), closes [#15](https://github.com/webern-unibas-ch/awg-app/issues/15)
-   **edition:** fix ReferenceError of EditonGraphModule caused by N3 ([73d64c0](https://github.com/webern-unibas-ch/awg-app/commit/73d64c01c8466f87f4833accea4e8dd5bd39e7bf)), closes [#21](https://github.com/webern-unibas-ch/awg-app/issues/21)
-   **edition:** move N3 graph methods into service ([94cce2d](https://github.com/webern-unibas-ch/awg-app/commit/94cce2d1adb50a782d77831ab1efd410cdfb4c0e))
-   **edition:** remove service from GraphVisualizerModule ([3882525](https://github.com/webern-unibas-ch/awg-app/commit/3882525a968c9d7a9486366a24691ac43f34e4eb))
-   **page-not-found:** fix image width for 404 ([f5d5199](https://github.com/webern-unibas-ch/awg-app/commit/f5d5199ab80ec6095bcb59b6fbdb950d8e944cde))
-   **shared:** fix creation of dynamic module in compile-html ([f50f49a](https://github.com/webern-unibas-ch/awg-app/commit/f50f49a21fe58e1dd3793e9b42734621b2f6b1fc))
-   **shared:** fix json2typescript decorators after breaking change ([b826ecf](https://github.com/webern-unibas-ch/awg-app/commit/b826ecf62bbdeead39a9b0c098bef6e1f710ab9d))

### Tests

-   **app:** fix tests after update to Angular version 9 ([2989902](https://github.com/webern-unibas-ch/awg-app/commit/2989902ccc0dfb0b71d5de57f1ac5a826ae46217))
-   **app:** replace TestBed.get -> TestBed.inject ([b6e9940](https://github.com/webern-unibas-ch/awg-app/commit/b6e9940a13e741f57c0e9dc30a181b26546bca35))
-   **edition:** fix tests after changes in FolioOverviewComponent ([89144f0](https://github.com/webern-unibas-ch/awg-app/commit/89144f0b1573a384e9dafd4a39dd24fbf871e1a9))

### Continuous Integration

-   **gh-actions:** ignore markdown files in GH action ([2a04b88](https://github.com/webern-unibas-ch/awg-app/commit/2a04b88ad2fa345ae40cb83441ac8f3440bea76c))
-   **gh-actions:** simplify paths-ignore ([4b1dbe3](https://github.com/webern-unibas-ch/awg-app/commit/4b1dbe3bbce2a186df0f2238444354dfdaa6e98e))
-   **travis:** prevent travis from deploying ([d238b4a](https://github.com/webern-unibas-ch/awg-app/commit/d238b4abb95a7f0328533bf9da497abfcea5bd1c))

### Build System

-   **app:** add GH actions workflow ([91b66b6](https://github.com/webern-unibas-ch/awg-app/commit/91b66b69c64b005b214fa9b8753a7457a957b331))
-   **app:** add GH Actions workflow ([45ee564](https://github.com/webern-unibas-ch/awg-app/commit/45ee564b40f625d7eaeac5b419594fde7f937e25))
-   **app:** add n3 to allowedCommonJsDependencies ([7c6d8fc](https://github.com/webern-unibas-ch/awg-app/commit/7c6d8fc38e97c2088e7904be00477d9dc7746c4d))
-   **app:** allow commonJS dependencies ([5ffbc44](https://github.com/webern-unibas-ch/awg-app/commit/5ffbc440ea7c7d67c65676532391697947eea23f))
-   **app:** continue with GH Actions workflow ([a6a234f](https://github.com/webern-unibas-ch/awg-app/commit/a6a234f2ee3d1ee64ffce1b935b17f23721790f2))
-   **app:** disable Routes graph for compodoc ([ddde411](https://github.com/webern-unibas-ch/awg-app/commit/ddde4118c69ef46daad08c8ba5bde20eb8b58bf4))
-   **app:** include node 10 in allowed engines ([b62a97a](https://github.com/webern-unibas-ch/awg-app/commit/b62a97abe561bb824aa3b13c6a674ecf1f454359))
-   **app:** remove workaround needed with angular 8 ([08812fd](https://github.com/webern-unibas-ch/awg-app/commit/08812fd59e32317128b057b1c5990cd3ca45ae81))
-   **app:** restrict coverage report to current node version ([b166439](https://github.com/webern-unibas-ch/awg-app/commit/b166439abdaad1ed30c69a088cd5f7cd1e39f936))
-   **app:** run doc generation and gzipper only after gh build ([eaecb10](https://github.com/webern-unibas-ch/awg-app/commit/eaecb10a38911830ac57fa20a8a3fbb94d1a7dd6))
-   **deps:** add lint-staged packages ([2586574](https://github.com/webern-unibas-ch/awg-app/commit/25865745a7c49830a388188251bec581f7ad4a67))
-   **deps:** bump elliptic from 6.5.0 to 6.5.3 ([a3ca0c5](https://github.com/webern-unibas-ch/awg-app/commit/a3ca0c52345a151d1fa61dfd68e2afb50ea0148e))
-   **deps:** update [@angular](https://github.com/angular) to version 10 ([c641e71](https://github.com/webern-unibas-ch/awg-app/commit/c641e711aa1c256dc86d39e43d85b0f1d8c9bfdd))
-   **deps:** update [@angular](https://github.com/angular) to version 9 ([fa84943](https://github.com/webern-unibas-ch/awg-app/commit/fa84943612fe8649b89e5d30b12265e2b3bee9d0))
-   **deps:** update @angular/cli+core from 8.3.21 to 8.3.28 ([9ef8f52](https://github.com/webern-unibas-ch/awg-app/commit/9ef8f52ac537f52f8944be75fcc2dad2a0d73db4))
-   **deps:** update dependencies after update to Angular 10 ([ae611ec](https://github.com/webern-unibas-ch/awg-app/commit/ae611ec38d31524c42229c2ec1207f2a9ea2a5f2))
-   **deps:** update dependencies after upgrade to Angular 9 ([c7874e8](https://github.com/webern-unibas-ch/awg-app/commit/c7874e88a0b81127ba7c1ad73a1850d9aecef369))
-   **deps:** update dev-dependencies after upgrade to Angular 9 ([b13174e](https://github.com/webern-unibas-ch/awg-app/commit/b13174e4478d7eece67a6a38a580192873243faa))
-   **deps:** update jasmine types after update to Angular 10 ([9c80f7e](https://github.com/webern-unibas-ch/awg-app/commit/9c80f7ee8817d0a0742a5e5ba289a70861d7e478))
-   **deps:** update node & yarn engine versions ([440b522](https://github.com/webern-unibas-ch/awg-app/commit/440b5229b0ba35fca636eb902ef07dd8c5b98cde))
-   **deps:** update rxjs and remove unnecessary lang-service ([49b1dbe](https://github.com/webern-unibas-ch/awg-app/commit/49b1dbe6990d381720b44e6dfebbacdf3c22c3d5))

### Documentation

-   **edition:** add jsdoc to edition-detail destroy method ([49621cb](https://github.com/webern-unibas-ch/awg-app/commit/49621cb128f8c4c9d3c92d2c5d6712a2f1f3a4f6))

### [0.7.4](https://github.com/webern-unibas-ch/awg-app/compare/v0.7.3...v0.7.4) (2020-07-16)

### Build System

-   **deps:** bump npm-registry-fetch from 4.0.2 to 4.0.5 ([b1c2155](https://github.com/webern-unibas-ch/awg-app/commit/b1c21551b1dcd7dc5fee701c31ec1fb09ad0ccdf))
-   **deps:** bump websocket-extensions from 0.1.3 to 0.1.4 ([6aa49b0](https://github.com/webern-unibas-ch/awg-app/commit/6aa49b0876f95c4c2c464727a4e0448fb3f1314c))
-   **deps-dev:** bump standard-version from 7.0.1 to 8.0.1 ([6eb352f](https://github.com/webern-unibas-ch/awg-app/commit/6eb352f6cee1df607004cb65ebd77a7eff6b55e3))

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

### Tests

-   **app:** add CSS clean up helper ([3f8203d](https://github.com/webern-unibas-ch/awg-app/commit/3f8203d3f5b8770175eaad43237ef5bb82e198b9))
-   **app:** add more CSS clean up helper - ongoing ([a2dcedf](https://github.com/webern-unibas-ch/awg-app/commit/a2dcedf38ef8dc1262cd34edc33eb0d5b59fbd43))
-   **app:** fix tests after changes ([4e0f8df](https://github.com/webern-unibas-ch/awg-app/commit/4e0f8dfe02e810f5e0e790ab291f32faf4be4aef))
-   **edition:** fix tests after changes ([c198d91](https://github.com/webern-unibas-ch/awg-app/commit/c198d9174b041538b3d660d950e60f9b2baf5a70))
-   **home:** add test for heading component ([8da4f68](https://github.com/webern-unibas-ch/awg-app/commit/8da4f6896f2393f1ad20af8ecc629e96e9b07631))

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

### Tests

-   **app:** fix tests after changes ([48d2258](https://github.com/webern-unibas-ch/awg-app/commit/48d2258a0554f5be4d1e4af7a8d4b69626555d97))

### Continuous Integration

-   **travis:** update yarn version ([135d8a9](https://github.com/webern-unibas-ch/awg-app/commit/135d8a97231bb16e7d0cacee4678a5b0157db0ad))

### Build System

-   **app:** include external scripts in test setup ([32d4ee2](https://github.com/webern-unibas-ch/awg-app/commit/32d4ee2ff972cb4f8dec71a6a720db7f67044a64))
-   **deps:** add stream ([af2677b](https://github.com/webern-unibas-ch/awg-app/commit/af2677bbc05f774868497da6d92b908160f0b282)), closes [/github.com/angular/angular-cli/issues/10625#issuecomment-502964007](https://github.com/webern-unibas-ch//github.com/angular/angular-cli/issues/10625/issues/issuecomment-502964007)
-   **deps:** bump acorn from 5.7.3 to 5.7.4 ([b3db01c](https://github.com/webern-unibas-ch/awg-app/commit/b3db01c8bbb17f48a468934f1d96bba28116bf11))
-   **deps:** update @types/node ([eb69fd9](https://github.com/webern-unibas-ch/awg-app/commit/eb69fd9e3c1aa6b1649907d29661a199814f021d))
-   **deps:** update husky ([59db878](https://github.com/webern-unibas-ch/awg-app/commit/59db878ff60ddcd69cb51182a936032e381715e8))
-   **deps:** use latest version of d3 micro libraries ([fc5ee1b](https://github.com/webern-unibas-ch/awg-app/commit/fc5ee1bf9c6bca3c04c1d2e74c4d5fccbfb375ff))

### Documentation

-   **app:** improve wording ([19bcbee](https://github.com/webern-unibas-ch/awg-app/commit/19bcbee876ec588cee87681541123b92d7f4272f))
-   **CHANGELOG:** merge multiple identical commit messages ([03c0bbe](https://github.com/webern-unibas-ch/awg-app/commit/03c0bbead750e1d6d462667acbf6e2e88866de6a))
-   **edition:** add JSDocs to graph components ([a478cf0](https://github.com/webern-unibas-ch/awg-app/commit/a478cf09a8ce2a0ec3a0e812f305006c11977c18))

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

### Tests

-   **core:** add and improve tests for gnd & storage services ([b55fd71](https://github.com/webern-unibas-ch/awg-app/commit/b55fd711f1a78c591ab2d29a5d31fdc21505d573))
-   **edition:** fix tests after convolute changes ([4985045](https://github.com/webern-unibas-ch/awg-app/commit/4985045dcc7f8d57e7dd82923b9d54e350bfede8))

### Build System

-   **app:** add posttest:cov script ([c534509](https://github.com/webern-unibas-ch/awg-app/commit/c534509acc03b799c8363dbb300bb6cbdd8f0794))
-   **app:** fix test & doc scripts in package.json ([bcc2ceb](https://github.com/webern-unibas-ch/awg-app/commit/bcc2ceb174842d6f042c5d713160834873ead03f))
-   **deps:** bump handlebars from 4.1.2 to 4.7.3 ([84648c9](https://github.com/webern-unibas-ch/awg-app/commit/84648c990efdeea66891a146ab109219290dca88))

### Documentation

-   **CHANGELOG:** merge duplicated messages ([c6684e7](https://github.com/webern-unibas-ch/awg-app/commit/c6684e7b5eb633be2ffbc7f6f466207047ecc600))
-   **edition:** add missing docs after changes ([3b0f33a](https://github.com/webern-unibas-ch/awg-app/commit/3b0f33af5960098a96f182ceb2ee3024b0717e47))

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

### Build System

-   **app:** add componentstyle maximum ([9d2c449](https://github.com/webern-unibas-ch/awg-app/commit/9d2c449c24fb32a904c5bda8360241edecec6191))
-   **app:** remove files from tsconfig.app.json (fix for compodoc) ([a2cc687](https://github.com/webern-unibas-ch/awg-app/commit/a2cc6877e5e2adce690046d87d133d8b7e999d61))
-   **app:** update angular framework files ([a5a0760](https://github.com/webern-unibas-ch/awg-app/commit/a5a076029f9c094cdbee03455858aab22c57ba77))
-   **deps:** add dependabot configuration ([778bd72](https://github.com/webern-unibas-ch/awg-app/commit/778bd724ce3e20f4274da5c9229aeaf8640ffde2))
-   **deps:** add font-awesome for ngx-gallery ([6c0b016](https://github.com/webern-unibas-ch/awg-app/commit/6c0b0165bced078e1b04be1bd7e04e51e6d017fa))
-   **deps:** update angular (8.2.14) and cli (~8.3.21) ([a6f7d4e](https://github.com/webern-unibas-ch/awg-app/commit/a6f7d4ef483a43ee40733a535c8cb58bc4a4380a))
-   **deps:** upgrade and use official ngx-gallery library after fix ([50e9d96](https://github.com/webern-unibas-ch/awg-app/commit/50e9d960fadd8c3d61fedf2c0541450542c657bf))
-   **deps:** upgrade other dependencies to latest versions ([e81b6fd](https://github.com/webern-unibas-ch/awg-app/commit/e81b6fd28bd5a112ba3e266ec40d0e56cc29d648))

### Continuous Integration

-   **travis:** update config for chrome addon ([2bc1855](https://github.com/webern-unibas-ch/awg-app/commit/2bc1855dd836c52b05b6c6185862e1e3284becba))
-   **travis:** use ChromeHeadlessNoSandbox for ci tests ([7fc6a73](https://github.com/webern-unibas-ch/awg-app/commit/7fc6a734887071fde4f36a276f6b4b534f5c9b42))

### Documentation

-   **edition:** add more documentation for EditionIntroComponent ([9705c39](https://github.com/webern-unibas-ch/awg-app/commit/9705c3907c0f4ec7b137bd5ebff1bb7dcebcc1f9))
-   **edition:** add docs for new components ([84ec7cb](https://github.com/webern-unibas-ch/awg-app/commit/84ec7cb8abce1c3a6cdee387616b8174c07e749f))
-   **edition:** add jsdocs to new EditionPath and Constants ([f29e27e](https://github.com/webern-unibas-ch/awg-app/commit/f29e27e4e968a97b4c58db45f20d8d9448c14dfa))
-   **edition:** fix missing or wrong docs ([8ab33ef](https://github.com/webern-unibas-ch/awg-app/commit/8ab33efb7dc1d7901572ac0e3070c4372f125f8f))

### Tests

-   **app:** fix broken tests after upgrade ([4854c7c](https://github.com/webern-unibas-ch/awg-app/commit/4854c7c419d0ac41d47b1fa5659bb5a48d7810b5))
-   **app:** fix tests after changes for multiple works ([cb4c98d](https://github.com/webern-unibas-ch/awg-app/commit/cb4c98d6cd2736c1871930dd25890f224909a2e1))
-   **app:** fix tests with RouterLinkButton in components ([6aece31](https://github.com/webern-unibas-ch/awg-app/commit/6aece31240ef65169d33721cd178558423ff9630))
-   **edition:** fix imports for EditionSvgSheetComponent spec ([fefb448](https://github.com/webern-unibas-ch/awg-app/commit/fefb44824059e900449679ebc97eb62222a01dcc))
-   **edition:** fix paths in specs after changes of edition components ([960a537](https://github.com/webern-unibas-ch/awg-app/commit/960a537d57f71c05188ed6ccb45fde9bd0c01d3c))
-   **edition:** fix tests after changes of convolutes and folios ([0707705](https://github.com/webern-unibas-ch/awg-app/commit/07077058c6dcc5f8bbf42a91eb9d0ca44ce82486))
-   **edition:** fix tests after changes to tka flow ([dc5e578](https://github.com/webern-unibas-ch/awg-app/commit/dc5e5788c62c485f9d2596e25202864c9020dba6))
-   **edition:** fix tests for after changes to source evaluation ([a40ce99](https://github.com/webern-unibas-ch/awg-app/commit/a40ce9998817bdf0b8986c6810b689459e08912d))
-   **edition:** fix tests for report and source description ([1f86b55](https://github.com/webern-unibas-ch/awg-app/commit/1f86b55ee36507f98fc17390cc1b78eaeb17b010))
-   **search:** fix broken test for imageobject component ([0ecc46e](https://github.com/webern-unibas-ch/awg-app/commit/0ecc46ec412e639e856db537520633164e901da4))
-   **shared:** add tests for queryParamsHandling of routerLinkButtons ([6243b07](https://github.com/webern-unibas-ch/awg-app/commit/6243b0746992464b7b4010e68cd020a24501047b))

### [0.6.1](https://github.com/webern-unibas-ch/awg-app/compare/v0.6.0...v0.6.1) (2019-07-19)

### Build System

-   **app:** update `yarn.lock` to fix GitHub security alerts ([7602f14](https://github.com/webern-unibas-ch/awg-app/commit/7602f147a5de2a3456ce13b3e308d2de37771308))

## [0.6.0](https://github.com/webern-unibas-ch/awg-app/compare/v0.5.4...v0.6.0) (2019-07-19)

### Features

-   **app:** add compodoc for code documentation ([8945988](https://github.com/webern-unibas-ch/awg-app/commit/89459880b7c2d712ac9047f9e7010b8dfa9c50a3))
-   **app:** update angular (^8.0.2) and cli (~8.0.3) ([3844e27](https://github.com/webern-unibas-ch/awg-app/commit/3844e27ebf2c30c9bfb107aab5d8ca9e70022dcd))
-   **contact:** add documentation section and link to Github repo ([3688358](https://github.com/webern-unibas-ch/awg-app/commit/368835812870b330323e63540b0c71f5ab48ce81))
-   **core:** add loading interceptor to set load status ([7669bad](https://github.com/webern-unibas-ch/awg-app/commit/7669bad2d16a1462f012c9681e315d75332adae8))
-   **core:** split meta object into sections and provide service method ([555fd11](https://github.com/webern-unibas-ch/awg-app/commit/555fd115526dcc0b0f9162ec276cd14a3d8d2790))

### Bug Fixes

-   **app:** add 404 fallback route ([c0ade9b](https://github.com/webern-unibas-ch/awg-app/commit/c0ade9b27e22c9fecf55cc8e809348d6556d0a2e))
-   **app:** fix errors after update to Angular 8 ([2771649](https://github.com/webern-unibas-ch/awg-app/commit/27716499719a27749154eec07ffa2b1bbdeabc73))
-   **app:** get correct section of meta data for remaining views ([80bbe10](https://github.com/webern-unibas-ch/awg-app/commit/80bbe1010f682000954dd32c4ebdf2e1a939c120))
-   **app:** patch issue with CustomHammerConfig of ngx-gallery ([cb1a0d4](https://github.com/webern-unibas-ch/awg-app/commit/cb1a0d4335aab522ca8d3b356bbefd7c61bf711c))
-   **app:** remove temporary workaround with static ngInjectableDef ([962ffeb](https://github.com/webern-unibas-ch/awg-app/commit/962ffeb46224bf4a4b7aaf887561f214de287387))
-   **app:** use onPush CD strategy on dumb components if possible ([f42f706](https://github.com/webern-unibas-ch/awg-app/commit/f42f706c77378637fdd66a93c2f302fa9244396c)), closes [#2](https://github.com/webern-unibas-ch/awg-app/issues/2)
-   **contact:** get correct section of meta data for contact view ([5d5a754](https://github.com/webern-unibas-ch/awg-app/commit/5d5a754cf6519e4893be415c366de75f5419b48e))
-   **core:** fix missing space in copyright desc ([17f0865](https://github.com/webern-unibas-ch/awg-app/commit/17f0865fa8071bea8417cd9597df46a05ea3ea24))
-   **core:** fix visibility of centered navbar-brand ([c879bec](https://github.com/webern-unibas-ch/awg-app/commit/c879becce615583a1d3f94131a07bd2465416478))
-   **core:** get only page meta data for footer and navbar ([2f51775](https://github.com/webern-unibas-ch/awg-app/commit/2f517752a19cf47e8ca891871957945c8b429614))
-   **core:** use better default values for clearing subjects ([9f65f13](https://github.com/webern-unibas-ch/awg-app/commit/9f65f1364bed47920b05f9465ff8d4c60dd48fce))
-   **core:** use MetaPerson class for authors and editors ([ff7df06](https://github.com/webern-unibas-ch/awg-app/commit/ff7df067d8b53b352a38ae240395c6db9051bee2))
-   **edition:** remove unnecessary toggle methods ([7f4b303](https://github.com/webern-unibas-ch/awg-app/commit/7f4b3036de4d5087c0257f6f327840e1646c837f))
-   **edition:** return only first emit of EditionDataService observables ([6e02f0b](https://github.com/webern-unibas-ch/awg-app/commit/6e02f0bf9573223f1de8e06c0f1adb6be1eba635))
-   **edition:** use async pipe for data in report component ([075a97e](https://github.com/webern-unibas-ch/awg-app/commit/075a97e507b6a97c2dd2acda0aa4eb9820cb0c86))
-   **edition:** use CDS.onPush for report component's children ([a31483d](https://github.com/webern-unibas-ch/awg-app/commit/a31483d57ef62b23c935545fdfd4d880ffd89919))
-   **search:** add bottom pagination in search result list ([6668f87](https://github.com/webern-unibas-ch/awg-app/commit/6668f871614612c3d1e74be8d2c9902f3185d639))
-   **search:** avoid bindings to pass static strings to native attributes ([945e259](https://github.com/webern-unibas-ch/awg-app/commit/945e259a2d7bad776ee510465c4eb61638c79ad5))
-   **search:** change snapshot path to get current url in search overview ([46995ff](https://github.com/webern-unibas-ch/awg-app/commit/46995ff8dde0b52b5caea8d565d179ed99c649f0))
-   **search:** clear search info on destroy of SearchResultListComponent ([c9ef240](https://github.com/webern-unibas-ch/awg-app/commit/c9ef240ef8a06d3e3b21dc91c2394736ee8a5362))
-   **search:** fix ngIfs in nested children templates of resource detail ([90d64ac](https://github.com/webern-unibas-ch/awg-app/commit/90d64acdad1736e824ca7be281707e81414e4113))
-   **search:** improve communication btw overview and info ([357872e](https://github.com/webern-unibas-ch/awg-app/commit/357872e2d85e1d7ffadbf423c61bf2339dd4d1ae))
-   **search:** improve handling of resource detail requests ([431f9ab](https://github.com/webern-unibas-ch/awg-app/commit/431f9ab940ab88a67711a1d42dcc864fc8195935))
-   **search:** improve handling of searchResponseWithQuery subscription ([9be21c6](https://github.com/webern-unibas-ch/awg-app/commit/9be21c60d8873051fe9dad6d0efb90d598412340))
-   **search:** improve linked objects component ([4e1347e](https://github.com/webern-unibas-ch/awg-app/commit/4e1347e8d0c0b5fd34b0be6976836ebbe8d9cf3c))
-   **search:** improve search form building ([c2cab36](https://github.com/webern-unibas-ch/awg-app/commit/c2cab36009c5cdd05d9b702dcff56773c3c63e81))
-   **search:** move interceptor providers into separate file ([d9c7d2d](https://github.com/webern-unibas-ch/awg-app/commit/d9c7d2d9ae1eac3ca6e3bd4243142ea083803d7e))
-   **search:** move resource detail header out of tabset ([522c867](https://github.com/webern-unibas-ch/awg-app/commit/522c86733804985b10f92e1cd0d70f21c6e180dd))
-   **search:** provide loading status as observable ([ca41c8d](https://github.com/webern-unibas-ch/awg-app/commit/ca41c8de07c813879b89531ef4adc18a8b77d0a1))
-   **search:** remove unused conversion service from resource detail ([5e377b3](https://github.com/webern-unibas-ch/awg-app/commit/5e377b3a99da38e03ca0595ba2a754ec71350650))
-   **search:** set search parameter nRows to 25 per default ([39b3f63](https://github.com/webern-unibas-ch/awg-app/commit/39b3f6334e3ed8ac39e188e07fe68617431b5b91))
-   **search:** simplify subscription to search result list data ([a9374d2](https://github.com/webern-unibas-ch/awg-app/commit/a9374d205dff3f97e70cd9ca7eb8b668a848fa40))
-   **search:** subscribe to resource data instead of async pipe ([c8dab3f](https://github.com/webern-unibas-ch/awg-app/commit/c8dab3f786a161a2759522b4f2de32aab6bbab6b))
-   **search:** use `this` instead of `super` in data api service ([42bac0a](https://github.com/webern-unibas-ch/awg-app/commit/42bac0a1c12cb03cdd7e323988d2f37d105189b9))
-   **search:** use async pipe for data in bibliography component ([05ff800](https://github.com/webern-unibas-ch/awg-app/commit/05ff8009e4e1f1058e05fdb96a057b7a208f9a13))
-   **search:** use async pipe for data in bibliography detail ([a95a45b](https://github.com/webern-unibas-ch/awg-app/commit/a95a45be03ba91b78f42b49363d179f44482409e))
-   **search:** use async pipe for data in resource detail ([7ae1372](https://github.com/webern-unibas-ch/awg-app/commit/7ae13727caed6a9e5c108f6507376ddad01c72f0))
-   **search:** use enum for SearchParam view types ([7e53fa5](https://github.com/webern-unibas-ch/awg-app/commit/7e53fa516ba765efd4b18788e43a4d0767ce82c4))
-   **search:** use getter for httpGetUrl in resourceDetail & searchPanel ([272d618](https://github.com/webern-unibas-ch/awg-app/commit/272d6183cec8c7e309fc5ff3947a09e7a101d3c6))
-   **search:** use id tracker for search result list ([b9ebaa2](https://github.com/webern-unibas-ch/awg-app/commit/b9ebaa2afc0eda360714dfe8ec7b49d7a45a685c))
-   **search:** use loading spinner for resource detail ([23b1272](https://github.com/webern-unibas-ch/awg-app/commit/23b1272992d32ddfc5cd565ed52cec129a42f87d)), closes [#5](https://github.com/webern-unibas-ch/awg-app/issues/5)
-   **search:** use SearchResponseWithQuery to update search params ([adb3d48](https://github.com/webern-unibas-ch/awg-app/commit/adb3d484a27bd239006634371ed28a5dc97f08dd))
-   **shared:** add optional 'toHtml' property to property json ([f7a3de5](https://github.com/webern-unibas-ch/awg-app/commit/f7a3de516702017247c3a9226c61648bac10e8bb))
-   **shared:** update compile html module & component ([73a9526](https://github.com/webern-unibas-ch/awg-app/commit/73a9526beac6414d6c14a4e85f095e5e931178a8))
-   **side-info:** add getter/setter for osm urls in contact-info ([d578987](https://github.com/webern-unibas-ch/awg-app/commit/d5789873f95d47ea162075d2a898d36759b14f01))
-   **side-info:** get osm urls in contact-info from AppConfig ([f106c5f](https://github.com/webern-unibas-ch/awg-app/commit/f106c5f0ef59dac43eed600e0fc81dfe85819540))
-   **side-info:** make address & osm map of contact-info shared components ([8846558](https://github.com/webern-unibas-ch/awg-app/commit/88465587907e7ba5cda486c34639b321ba92f16b))
-   **side-info:** make resource info data update immutable ([d248703](https://github.com/webern-unibas-ch/awg-app/commit/d24870322cf348731181b2dd2df6cb16526954f8))
-   **side-info:** remove nested subscription from resource-info ([779965f](https://github.com/webern-unibas-ch/awg-app/commit/779965f862893e2069c9b4df8044fba1b74ed1f6))
-   **side-info:** set edition info header from component ([15eb693](https://github.com/webern-unibas-ch/awg-app/commit/15eb693d322decfd770a2b32563f631825e52a72))
-   **side-info:** use async pipe for data in search info ([c7c9791](https://github.com/webern-unibas-ch/awg-app/commit/c7c9791543a51e576fb5eae0f4f828cdb730daaf))

### Continuous Integration

-   **travis:** update yarn version ([b3bd432](https://github.com/webern-unibas-ch/awg-app/commit/b3bd432d5f545f9dfe9945b404e814e5460d1d81))

### Build System

-   **app:** add compodoc and format check scripts to package.json ([92a6852](https://github.com/webern-unibas-ch/awg-app/commit/92a6852008d794b1b2ecde1e69f37e6a549cbecf))
-   **app:** add compodoc build to build scripts in package.json ([f3047b5](https://github.com/webern-unibas-ch/awg-app/commit/f3047b5f92638893951a88ef5e366f65f87c67ac))
-   **app:** configure karma.conf.js to run tests in order ([19cec04](https://github.com/webern-unibas-ch/awg-app/commit/19cec0436619dc43ecbf3113bf26d207625970d5))
-   **app:** remove core-js and update dependencies ([f25fcd3](https://github.com/webern-unibas-ch/awg-app/commit/f25fcd36e96e3bd6065970e88f443f80fcc7aa90))
-   **app:** update angular (^8.0.3) and cli (~8.0.6) ([001474e](https://github.com/webern-unibas-ch/awg-app/commit/001474ef9fd34e6c65d9044b14d2f79a7a1bd34e))
-   **app:** update dependencies after upgrade to Angular 8 ([0b00a91](https://github.com/webern-unibas-ch/awg-app/commit/0b00a9143655ff18f6e385b33efd026f99a4022c))
-   **app:** update dependency font-awesome ([bcc0f07](https://github.com/webern-unibas-ch/awg-app/commit/bcc0f07e4cfeb57d8fa17b8ceb1ab67bcf6ed0ae))
-   **app:** update remaining dependencies after upgrade to Angular 8 ([aeb5bfa](https://github.com/webern-unibas-ch/awg-app/commit/aeb5bfa8560ed14b22fdaa0500d33c3924ce13de))

### Tests

-   **app:** fix broken tests - ongoing ([42d8a5d](https://github.com/webern-unibas-ch/awg-app/commit/42d8a5da2faf41ea9176800d60b0ca19286e0f2d))
-   **app:** fix broken tests after changes ([db2630f](https://github.com/webern-unibas-ch/awg-app/commit/db2630f59239d18c658c90c055fecf6cc399804c))
-   **app:** fix tests with HttpTestingController ([6743f2c](https://github.com/webern-unibas-ch/awg-app/commit/6743f2c1dabbc35340eb66bd04bbcadb318e35b5))
-   **app:** move nativeElement in own variable in tests ([70dba2d](https://github.com/webern-unibas-ch/awg-app/commit/70dba2d3af63d0f79f1a1999d5ec32f33c506245))
-   **core:** extend navbar tests ([6410bf8](https://github.com/webern-unibas-ch/awg-app/commit/6410bf8bf3021d52fb518cb165be211da8170eca))
-   **home:** adjust tests for home-view component ([573ccd9](https://github.com/webern-unibas-ch/awg-app/commit/573ccd9b8e4a4a58ee51ecb172aceca1800926b3))
-   **page-not-found:** fix broken tests after renaming of variables ([6db4d3c](https://github.com/webern-unibas-ch/awg-app/commit/6db4d3c81b9bae62b76e6e7b8f6f2257bb1274b1))
-   **search:** add service method to searchResultList test after changes ([36512fb](https://github.com/webern-unibas-ch/awg-app/commit/36512fb9c6cef11215ce06baa9f3807910e1dd86))
-   **search:** add TwelveToneSpinnerStub to resource detail test ([0dd7ee2](https://github.com/webern-unibas-ch/awg-app/commit/0dd7ee21d270acb727c7dcbbe35928b938e2206f))
-   **search:** fix broken tests after switch to CD.OnPush - ongoing ([01e7fdc](https://github.com/webern-unibas-ch/awg-app/commit/01e7fdc722fb0f38c091f1a4f6bc5793cb6d045a))
-   **search:** fix broken tests after switch to CD.OnPush - ongoing ([cb8a968](https://github.com/webern-unibas-ch/awg-app/commit/cb8a968dd9d6eddfa69a9f7f0b992eb47e5af134))
-   **search:** use SearchPramsViewTypes in search result list ([7793172](https://github.com/webern-unibas-ch/awg-app/commit/77931729602e345b8a43375e76eeff942196dd7e))
-   **side-info:** add header test for structure-info ([4a18b67](https://github.com/webern-unibas-ch/awg-app/commit/4a18b672b4ac2a90d9ca28d70572def0172d13ed))
-   **side-info:** add test for contact-info and its child components ([48434d6](https://github.com/webern-unibas-ch/awg-app/commit/48434d6f67f525c1c047d19826655c599c053a0a))
-   **side-info:** add tests for edition-info component ([b08216c](https://github.com/webern-unibas-ch/awg-app/commit/b08216c2d0beac757ea827ee9c582b1e550cf554))
-   **side-info:** add tests for structure info component ([1a8bbaf](https://github.com/webern-unibas-ch/awg-app/commit/1a8bbafc164f4323521df0b8d374851c2d340b52))

### Documentation

-   **app:** add blank line before 'return'; use '\*' for 'any' ([532614e](https://github.com/webern-unibas-ch/awg-app/commit/532614ec61fd7debb5f234acc2254542e1b76ea3))
-   **app:** add further jsdocs ([0ba22cb](https://github.com/webern-unibas-ch/awg-app/commit/0ba22cb3cd25ba01041664070e921db4ca67526b))
-   **app:** add jsdocs for all modules ([367fed4](https://github.com/webern-unibas-ch/awg-app/commit/367fed4f8cc98a01ae2770a7fde622a2e9e9859f))
-   **app:** add jsdocs to all models - done ([fa6c14d](https://github.com/webern-unibas-ch/awg-app/commit/fa6c14d935806eb4a4f57a77f7680057a1297feb))
-   **app:** add jsdocs to all pipes ([17f370e](https://github.com/webern-unibas-ch/awg-app/commit/17f370ec49252cd9e4b6f158dc7b77d620f19f37))
-   **app:** add jsdocs to all variables ([25e7226](https://github.com/webern-unibas-ch/awg-app/commit/25e7226702c83abfdb3cd220160c9b85500c3755))
-   **app:** add jsdocs to navigation methods ([c9c3938](https://github.com/webern-unibas-ch/awg-app/commit/c9c393836946059097c4d3310958065aa3472a76))
-   **app:** add jsdocs to services - ongoing ([094230d](https://github.com/webern-unibas-ch/awg-app/commit/094230d6c99a5f70d0acdaf9c0550329f2aa8e66))
-   **app:** add jsdosc for app level files ([5d62fdb](https://github.com/webern-unibas-ch/awg-app/commit/5d62fdb89f1ef402cecef36913784a20c9de0c3f))
-   **app:** add more jsdocs to app models ([e967a22](https://github.com/webern-unibas-ch/awg-app/commit/e967a22896457a4dcc8ce390dd89cc58a27f1d40))
-   **app:** add more jsdocs to components ([31dc38c](https://github.com/webern-unibas-ch/awg-app/commit/31dc38ca2f5659808e98992a1fd5dafc34165cf6))
-   **app:** continue with adding JSDOCs to services ([652b92d](https://github.com/webern-unibas-ch/awg-app/commit/652b92d904f9dfb202542537c7d0c4a5da7f02f2))
-   **app:** continue with adding JSDOCs to services and models ([4b9d40c](https://github.com/webern-unibas-ch/awg-app/commit/4b9d40c9b26e133fe21504b824771bfe2bfc15a0))
-   **app:** fix typos and order in structure-info and edition view ([593cb78](https://github.com/webern-unibas-ch/awg-app/commit/593cb78083f6abdf5985e27c7694fb7b0ef23876))
-   **app:** remove console.logs ([2246647](https://github.com/webern-unibas-ch/awg-app/commit/2246647992cf71463756070aa078ab603854332f))
-   **core:** add jsdocs to core services ([390e399](https://github.com/webern-unibas-ch/awg-app/commit/390e3995d8775030ea4c26f0c0ea17bf03e97aa3))
-   **core:** add jsdocs to the footer components ([6bcd4d5](https://github.com/webern-unibas-ch/awg-app/commit/6bcd4d520e8c6b63b6e6505bd7ff583863d8cd98))
-   **core:** finish adding jsdocs for services ([f4b2fe0](https://github.com/webern-unibas-ch/awg-app/commit/f4b2fe05b4f88626ea2129340c994749caaa4c05))
-   **edition:** add forgotten types and returns ([22ffda9](https://github.com/webern-unibas-ch/awg-app/commit/22ffda9c8bfe7a9388e0b52eb6d82781f95c804e))
-   **edition:** add jsdocs to edition outlets - ongoing ([7c1ea49](https://github.com/webern-unibas-ch/awg-app/commit/7c1ea495cff1047f719823abb93077e7d4de41ac))
-   **edition:** add jsdocs to edition outlets - ongoing ([6c4eb4f](https://github.com/webern-unibas-ch/awg-app/commit/6c4eb4f3c67548ad13a5313271fca053f45c7975))
-   **edition:** add jsdocs to Folio Component ([8b24e7b](https://github.com/webern-unibas-ch/awg-app/commit/8b24e7b53c6f321cd28f11bc8223fae81656e2dd))
-   **edition:** add jsdocs to folio models - ongoing ([4cc49c4](https://github.com/webern-unibas-ch/awg-app/commit/4cc49c45feb5ec92a72ef3f226d98316d054da47))
-   **edition:** add jsdocs to folio models - ongoing ([9da300f](https://github.com/webern-unibas-ch/awg-app/commit/9da300f51f2c94ddd848a814af56a362bfb6e44d))
-   **README:** add compodoc badge ([b888aa9](https://github.com/webern-unibas-ch/awg-app/commit/b888aa9cc61258626eb65dbf6514304b94fa4e2f))
-   **README:** move contribution guide into separate file ([f2f4e76](https://github.com/webern-unibas-ch/awg-app/commit/f2f4e76611e8c6e11af5b37dbe00c586726d00f0))
-   **search:** add jsdocs to bibliography section ([af46949](https://github.com/webern-unibas-ch/awg-app/commit/af469490e135fa81e33ec37d5fb18c62ee9e26d8))
-   **search:** add jsdocs to resource detail component ([2c67d84](https://github.com/webern-unibas-ch/awg-app/commit/2c67d84770c8c875d1ca62063a69e76fb7624d20))
-   **search:** add jsdocs to resource detail outlets - ongoing ([c10a6bf](https://github.com/webern-unibas-ch/awg-app/commit/c10a6bffbb3b87c8e7f86ad314ab6d84dee31d28))
-   **search:** add jsdocs to search panel ([3712aa8](https://github.com/webern-unibas-ch/awg-app/commit/3712aa836136b10bab4221ca52bd6cfcedffb8d0))
-   **search:** add jsdocs to SearchResultListComponent ([05d5fff](https://github.com/webern-unibas-ch/awg-app/commit/05d5fff5fe31b3005d92e692bcae30316848b5f2))
-   **search:** add some more jsdocs ([e5891fe](https://github.com/webern-unibas-ch/awg-app/commit/e5891fe333d27bd5f4831729329d5d1307062364))
-   **shared:** add jsdocs to last api-objects ([841e0f5](https://github.com/webern-unibas-ch/awg-app/commit/841e0f5cdcaa41c4d7457055ceeff918a6d21786))
-   **shared:** finish adding jsdocs to shared components ([3d86ab5](https://github.com/webern-unibas-ch/awg-app/commit/3d86ab5173c978b4fdb7cf7f2b1ec194d64b6ea6))
-   **side-info:** add jsdocs to search-info ([0161880](https://github.com/webern-unibas-ch/awg-app/commit/016188066610270c792c1e7ce68e821780d321cd))
-   **testing:** add jsdocs to test helper files ([8d73958](https://github.com/webern-unibas-ch/awg-app/commit/8d7395846e2431a2d7d8db6657ecb98d5397ff5e))

### [0.5.4](https://github.com/webern-unibas-ch/awg-app/compare/v0.5.3...v0.5.4) (2019-04-09)

### Bug Fixes

-   **app:** add angular-cli-ghpages to devDependencies ([878852a](https://github.com/webern-unibas-ch/awg-app/commit/878852ae0b9e1743b46db0788be544c2d6f2dcb2))

### Build System

-   **app:** update scripts in package.json ([a3532d3](https://github.com/webern-unibas-ch/awg-app/commit/a3532d3c2228d5f9ffb5aaee94825d87a1b9717c))

### Continuous Integration

-   **travis:** update .travis.yml ([66b5c86](https://github.com/webern-unibas-ch/awg-app/commit/66b5c869fd647510f51d0d9fefcb6b62361f6033))

### [0.5.3](https://github.com/webern-unibas-ch/awg-app/compare/v0.5.2...v0.5.3) (2019-04-09)

### Bug Fixes

-   **app:** use HTTPS over HTTP whenever possible ([5c573ad](https://github.com/webern-unibas-ch/awg-app/commit/5c573ad3b971a9a46fdafa2af412a3c29c5116f5))
-   **core:** add link to CHANGELOG from footer declaration ([6f2004f](https://github.com/webern-unibas-ch/awg-app/commit/6f2004f197f7112e6d553ccf408d227bd15c65f6))

### Tests

-   **core:** fix apiService test after switch to HTTPS ([7c0cfb8](https://github.com/webern-unibas-ch/awg-app/commit/7c0cfb8872a6837c802c3d663a83795dcf7f731d))

### Documentation

-   **CHANGELOG:** fix format for version headings ([65a9de7](https://github.com/webern-unibas-ch/awg-app/commit/65a9de70d24a6f62b2a856069707aa1bb66ccff4))
-   **core:** fix typo ([13db801](https://github.com/webern-unibas-ch/awg-app/commit/13db801a985c7c90cf69a2e3fba01ce76a58e206))

### [0.5.2](https://github.com/webern-unibas-ch/awg-app/compare/v0.5.1...v0.5.2) (2019-04-09)

Empty patch version bump to trigger build via Travis CI after moving the repository to GitHub.

### [0.5.1](https://github.com/webern-unibas-ch/awg-app/compare/v0.5.0...v0.5.1) (2019-04-09)

### ⚠ BREAKING CHANGES

Repository moved from Gitlab to public GitHub repository. All commit and version links prior to this version are not publicly available.

### Build System

-   **app:** init GitHub repo ([218014a](https://github.com/webern-unibas-ch/awg-app/commit/218014a9e68b7cd4923d658bf49054f77d83714b))

### Documentation

-   **CHANGELOG:** add breaking changes for v0.5.1 ([432767e](https://github.com/webern-unibas-ch/awg-app/commit/432767ef840fcd8214b2e1cc935140fa82d7c01e))

## [0.5.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.4.0...v0.5.0) (2019-04-09)

### Features

-   **search:** add pagination for search results ([3e8ec1c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/3e8ec1c980c0af835b857c5c19242358d7df40a8))
-   **shared:** add NgxGallery module ([b929629](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/b929629d85264e1c8c9c2d333471abe91d02028e))

### Bug Fixes

-   **app:** add project specific favicon ([4d430f8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/4d430f81abd85981d5571123d2eb6bec183e90e3))
-   **app:** fix hostname for GoogleAnalytics ([a92f44e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/a92f44e3cdd5bc5b1425f51c5a3b35d5ce84794b))
-   **app:** get app version from package.json ([6ab1a77](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/6ab1a777eabca2daa814a10275bf5342c7340adb))
-   **app:** get global constants from package.json ([903f276](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/903f2765336682f1e83a597eae242cd7efb3b77a))
-   **app:** improve page not found view ([bf134b4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/bf134b4ee81b2d0c9e300bbd1ab1aeb8a4d0ec49))
-   **app:** make Contact & Structure view lazy loading ([879f5be](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/879f5bed339c9572cc5a97c9231bc9824c7c7135))
-   **app:** preserve query params & fragments on routing ([408d1ea](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/408d1ea7c395d8d22a5108eb5542c057e4d54076))
-   **app:** use HTTPS for salsah API ([63eb4a7](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/63eb4a7080eaad909929f91e54fca14304084fb2))
-   **app:** use urls from AppConfig for main homepages ([a6b6c7f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/a6b6c7fcda1587b5c0c2b385afb6443a64857400))
-   **contact:** add license statement to disclaimer ([8134d97](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/8134d97b17936f443f4d8f254cd4d23c9469359c))
-   **core:** small changes & renaming to api service routes & inputs ([53e403f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/53e403f78322d8bce8a3c5225beb144b07047d6f))
-   **core:** use smaller version of snf logo ([d1209a4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/d1209a4645693b61ec4a511900090332b4199ae5))
-   **edition:** rename DataService -> EditionDataService ([dc99cc3](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/dc99cc30902df04b3aa6fe3bcc9b25a598accca0))
-   **search:** add constructor to BibliographyService ([e9c91d9](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/e9c91d994954a38d6aab15a2ef8461b4cc87c6e2))
-   **search:** check for changes in ImageObjectComponent ([a2bdce9](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/a2bdce9c3a3bd8ccdf7836b138c143f2fe0ec244))
-   **search:** create search button array on init ([a2d6440](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/a2d64408101ff910030be40ce1d02d3b64c4fcc5))
-   **search:** disable view buttons when there is no searchresult ([723498a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/723498ae9c3acc4b811c31bc6b1b9da5e16c627f))
-   **search:** do not call data API on view change ([0871432](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/087143211a16f50068641a5f5fd1448bbbe8b777))
-   **search:** improve handling of search params ([779b179](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/779b179e0ed6a6eb5cac06384f62de89838bf7c6))
-   **search:** move result conversion to data api service ([225ee3c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/225ee3cd577f207282255565129cc1816fd9c1f4))
-   **search:** use ngOnChanges to detect input changes ([d7ce548](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/d7ce5484193360ba1b082ec44c6f261738d4530d))
-   **search:** use NgxGallery in ImageObjectsComponent ([ced6906](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/ced69060da070bc4080109b0899ad6ebdead228b))
-   **search:** use search params model ([383454b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/383454b286aec381aa7c4004dfa57e5447847e63))
-   **shared:** create RouterLinkButton with constructor ([1b093d2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/1b093d24aa1bf7c02ec1df13821873485cc229b6))
-   **shared:** remove custom get functions from property-json ([61fa115](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/61fa115e0ad6f6b94ff462f7c7f8b7877b9762ce))
-   **shared:** use typed jsonViewerData input ([c0f0d34](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/c0f0d34084b4ff9316affb72c936f05f257b3c02))
-   **side-info:** use query params when navigating back to search ([30a7c0f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/30a7c0f99adab5fee3d006aaebab6357254e2b7d))

### Tests

-   **app:** add global helper functions ([cdbd969](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/cdbd96959e697715f1fd8de1b1169dabf07f7f71))
-   **app:** add test utilities & helpers ([13dc4a6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/13dc4a673183bbabdc9eaadc22e7b20b6e95125f))
-   **app:** adjust all tests to new helper functions ([f1cf482](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/f1cf4827eeb9ac1e7c90a58e84fdfc992d3e96fc))
-   **app:** adjust more test to use global helpers ([9c54b7a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/9c54b7a6b01f04dbff8fc4d8382ac3d661a7800a))
-   **app:** adjust status for contact-view and navbar ([a99d806](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/a99d806808adcdc73817d7269d25e9c58624757b))
-   **app:** adjust tests after recent changes ([d95dfad](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/d95dfada225480766d6adefab42c37be1d85761d))
-   **app:** fix tests after changes to METADATA ([5281cd3](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/5281cd3f2c71fff87405edcf07c7c4f76865955d))
-   **contact:** fix failing date test ([0e685be](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/0e685bee18c37cca2515a3554a2db125a98571b7))
-   **core:** add more tests (core-service) ([9326753](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/932675354d48b6c486bd15b75d4489a5bc9687c2))
-   **core:** add tests for api service ([3736571](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/37365712e49a7657fec52e2b567c4f762f9abc1b))
-   **edition:** add tests for EditionOverviewComponent ([d6b282f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/d6b282f38ac2a4878fcff1c2cbdd1dcfa574a71f))
-   **edition:** comment out forkJoin tests for now ([4d81fe0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/4d81fe0a776d55a2a150d59d05be52e434e02cfd))
-   **search:** add more tests for resource detail ([4327736](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/432773634b428ce25237695653df4ebd01520a28))
-   **search:** add some more mocked API responses ([e21ca86](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/e21ca868efc69f0650e4a3d2951df6742bed058e))
-   **search:** add tests for BibliographyService ([c338c16](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/c338c16262de41a96873aa2b5f48cb5b1b23d311))
-   **search:** add tests for DataApiService ([688dfba](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/688dfba060f748145552dbab3c9c39626954e9bf))
-   **search:** add tests for html content component ([3029bfc](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/3029bfcf82851f5a6e8a4eb216a8d5a342914f29))
-   **search:** add tests for ImageObjectComponent ([467e9a2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/467e9a271e540bb79eb3bc1380e5d51ae96ac3c5))
-   **search:** add tests for linked incoming objects ([6b09a01](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/6b09a01f9edbf533b2b1dbb5b0e0ea3346f43c40))
-   **search:** add tests for props component ([5ed6e63](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/5ed6e6330bb845ed278b68652db7250727a81921))
-   **search:** add tests for reasource detail header ([af0c19f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/af0c19f8c7e261a615125b7c16e19faac09b829a))
-   **search:** add tests for search overview ([4f8794c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/4f8794c1417a8e74bb2e89847d1f7d27cb6e6967))
-   **search:** adjust api services to request/response schema ([8c92b72](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/8c92b72234b17d653eab89233dc2ed9faccbe712))
-   **search:** finish tests for resource detail html content children ([09475ad](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/09475adff6a321ac738c13b742aeb197c056db1c))
-   **search:** finish tests for SearchOverviewComponent ([1ccc647](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/1ccc647d03990845f9fcd0a9eb73c188b9353e07))
-   **search:** started with tests for resource props ([77c1062](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/77c1062b45dfc13f6f97cef5de47275a1bfeb2e0))
-   **shared:** add and fix more test ([e3d752c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/e3d752c5fb83853ff61aa693dfddc7e71bbef477))
-   **shared:** add tests for json viewer component ([3a95081](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/3a950819daf3e4ebcec7767075032ccf9ab9773a))
-   **shared:** add tests for router link button group ([74612c6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/74612c67da80e7ef9df2ccb87db7c732ab6065e8))
-   **shared:** adjust tests after changes ([5d44830](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/5d4483009a4f536e0ead7101866be6126bdd956b))
-   **testing:** add custom jasmine matchers ([5fab4a1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/5fab4a17489236a7bd536849556c77ff0575ff2d))
-   **testing:** handle array input in spyCalls helper function ([5cf12d4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/5cf12d4941c2b22935465af5cb52d4bdf422b299))

### Documentation

-   **app:** add badges to README ([a3a1769](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/a3a1769eda9793766a91969ce085a11b8d5c9e0e))
-   **app:** fix errors in README ([d212090](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/d212090396a25fdc0e44e87e565b288680fb2e1f))
-   **app:** update README ([42fdf10](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/42fdf102ded362000c0ff9547cfd70f1a8058961))

### Continuous Integration

-   **travis:** use custom version of yarn ([74434e4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/74434e4fdac288c1d636c76d6e63702a6d5a0c24))

### Build System

-   **app:** add gzipper ([6fa4ad2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/6fa4ad20a095ec127175947c2bc47c5df6f07108))
-   **app:** add LICENSE & update package.json ([f25c6c3](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/f25c6c32eaeefa308f377c0a561870b13efe34cf))
-   **app:** add npm scripts for pre-release & deployment ([8248455](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/8248455a7e069e3020697eecd6fa64e853c47782))
-   **app:** add script for code coverage tests ([c8f821b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/c8f821bd5a8092f3a2ae4518575739e4fe6f18d3))
-   **app:** add tslint-config-prettier to dependencies ([7c1629d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/7c1629d387da6484a1af63c460c79794f771abc9))
-   **app:** configure deployment via Travis CI ([09d77de](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/09d77dee976d034500cab38c1d3203d215692b47))
-   **app:** update angular (7.2.9) and cli (7.3.6) ([6b637a0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/6b637a09fbcc9e6dfb8409743e30f325154f03d3))
-   **app:** update build & test scripts in package.json ([9443147](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/94431472b18645d6cd9a4c62a34a1d04bb4e7646))
-   **app:** update build after hotfix changes ([941eebf](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/941eebf32e18b60f5177af8979f95288c451fc33))
-   **app:** update build files ([f317a65](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/f317a65015ca047edd85f9c391443c4e240274fe))
-   **app:** update commit message scopes [ci skip] ([9393eed](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/9393eed5698053f616d10a7bbb684dfe911335e5))
-   **app:** update commitlint schema ([f4c1f86](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/f4c1f869eeac613ebde845ad49a84fb47f112e6e))
-   **app:** update dependencies ([8c601d7](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/8c601d78b03dc19e67262c891d814e800b7d45b9))
-   **app:** update dependencies ([a20539a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/a20539ab14a66838b99080c514b84d7f83efc527))
-   **app:** update dependency: json2typescript ([ea42c26](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/ea42c269cbf75b80a854aadccca17593031af5cd))
-   **app:** update framework files to latest cli version ([488851b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/488851b418c23c1864079d6201d5bbfb6674fe22))
-   **app:** update package.json scripts ([88287db](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/88287db26c0111b7a1b2e3535abaa30c793e18b2))
-   **app:** update travis config to exclude tags ([834cd91](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/834cd91c12f8a7036411b44c25bee9fdcbcfd7d6))
-   **app:** use stages in travis config ([c16ffb5](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/c16ffb58679533ae187f3fa4293af57599e612df))
-   **shared:** add NgbPaginationModule ([8fa3595](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/8fa3595995361c795bec0950f60ba0b38b936efa))

## [0.4.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.3.0...v0.4.0) (2019-01-22)

### ⚠ BREAKING CHANGES

-   **app:** Bootstrap 4 is a major rewrite of the entire Bootstrap project, so the upgrade to Bootstrap 4 involves some refactoring of essential parts of the application structure, including
    -   navbar, tabsets, dropdowns, list-items, panels (cards)
    -   a lot of style classes (mt, pb)
    -   the use of `ngx-bootstrap` instead of `jQuery`

For more details, see

-   https://getbootstrap.com/docs/4.1/migration/

### Features

-   **app:** add and configure GoogleAnalytics pageview events ([dc7d213](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/dc7d213acad1b7e9cfb0a086f1b33e9772492104)), cf. [/stackoverflow.com/questions/1251922/is-there-a-way-to-stop-google-analytics-counting-development-work-as-hits#8178283](https://stackoverflow.com/questions/1251922/is-there-a-way-to-stop-google-analytics-counting-development-work-as-hits/issues/8178283)
-   **build:** update `angular-cli`(^7.2.2) and `angular` (^7.2.1) ([9baf470](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/9baf4702a4460d3d7e8528611c2ad144bd2ba5cd))
-   **shared:** add json viewer component ([92f3f3e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/92f3f3edc5b56c54a8243c514def592bdfb2a672))

### Bug Fixes

-   **app:** add include files to tsconfig app ([fa3a662](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/fa3a66234c4aa9eb2f9c8a1b75d1a8669dc6ae3a))
-   **app:** change LOCALE_ID to "de-DE" globally ([c5d3b70](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/c5d3b7012b80450420b6978ad1b5f9c9c820fb5d))
-   **contact:** add separate section for citations ([324d553](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/324d553ff6973512c76c276f41df826fe9485138))
-   **core:** add fixed bottom footer ([66b2c5a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/66b2c5af0b222f1571e90f414a17679ab2c4fd14))
-   **core:** add footer module ([253e6c7](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/253e6c74d4ddd2900f958b2656bf988a00d86ef9))
-   **core:** add separate component for view container ([5a3fe0c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/5a3fe0c0471c7f07b83f544005821dd1e714e811))
-   **core:** highlight active nav-link on page load ([41c7f81](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/41c7f81296308d8f47751db57abf18b5582dcd8a))
-   **core:** make bottom footer logos wrap at breakpoint ([184fbb4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/184fbb45df24d75b9abb98f0f880605305ebb6a6))
-   **core:** make header fully responsive with bootstrap 4 ([963f228](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/963f2289c314a6510a99402407b68b032e9872ec))
-   **core:** move footer declaration & attribution to own component ([0bf9dc8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/0bf9dc8a4294fac75c53112f3d86a8c0e4ebaebd))
-   **core:** move footer text into own component ([8207e82](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/8207e826ec9734b4a7199913f7853aac9962033e))
-   **core:** use fa-icons for navbar ([fd1d77f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/fd1d77fe96f1b60bae5035edd1c79d5e56fa6793))
-   **edition:** fix margin of textcritics panel footer ([d8a2cdb](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/d8a2cdbb3e76df32cdd04505d137b28d90c63312))
-   **edition:** fix wrong folio format for folio 1r-v ([adce66c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/adce66cd8edaf2ac80d1be23a56340bd9ee1a300))
-   **edition:** move pre-notification into accolade component ([7b12d60](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/7b12d6030adbbe044a0b619948dc31fb5219b2eb))
-   **edition:** refactor button group with bootstrap 4 ([a0b609d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/a0b609dcca199743a0e1d95f4246dcf778483a46))
-   **edition:** refactor edition accolade with bootstrap 4 ([208a870](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/208a870239d413d6430ddd6118169ec27f6d0239))
-   **edition:** refactor edition convolute with bootstrap 4 ([dc9d959](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/dc9d959821ad15232f96a2bdec54953b91decff2))
-   **edition:** refactor report panels with bootstrap 4 ([7e68088](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/7e68088e38c4c4d6f7668226d17396653cbed159))
-   **edition:** use json viewer to display API json response ([6082869](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/6082869d08d7494ceeb9a646b194d03633e3018b))
-   **search:** add grid and table view buttons to searchResultsHeader ([de6fc1f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/de6fc1ff4c4de4f64457c5cf8d643d2e8f452e2d))
-   **search:** fix wrong id for linked obj links ([51629ee](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/51629eebcdbc54ce2989fd066b9e6be4ee2f179a))
-   **search:** refactor image objects with bootstrap 4 ([1c93f82](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/1c93f8289682b96e24ad17b9bbd88fbd1a0ed073))
-   **search:** refactor linked objects accordion with bootstrap 4 ([cbc8d67](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/cbc8d67822bc1f56250ac516ef322477d641110c))
-   **search:** refactor linked objects with bootstrap 4 ([d2b1195](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/d2b119540053806b89b92828d5bb5712f535b12b))
-   **search:** refactor props with bootstrap 4 ([67a2131](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/67a2131a6ad8dd71dc8462006c1770b56c45fff7))
-   **search:** refactor resource header with bootstrap 4 ([64c8ccb](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/64c8ccb0ff09969d8bcd5c59485d27288b244af5))
-   **search:** refactor search form with Angular 6 ([8cf98e6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/8cf98e6741b40efc83e2787a8bf7aea5281f3d0f))
-   **search:** refactor search form with bootstrap 4 ([27d7c37](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/27d7c370b9a43b82f8548f584736d915cc382614))
-   **search:** refactor search results with bootstrap 4 ([4a6416e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/4a6416e69a656e7666861da0e237b2d0671944d3))
-   **shared:** refactor button group with bootstrap 4 ([dfd8720](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/dfd87202833cb95ba124bde79524d09b1fad6cb7))
-   **shared:** refactor modal with bootstrap 4 ([28715a1](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/28715a1e49745ee5b94fd2c2bc67eb38ca5c1c0d))
-   **side-info:** refactor resource-info with bootstrap 4 ([66990a4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/66990a4a12ff88fa8b098f7f6661c39f426a66da))

### Tests

-   **app:** fix bootstrap imports ([beebc13](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/beebc13478b80afd82181a3f6c56fab18b13dc24))
-   **contact:** fix test for contact component ([e6102a4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/e6102a4cbf8f08774caf9359dac811062a7e57aa))
-   **core:** fix navbar test ([027b3b6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/027b3b62d5490e988788b1aa7150c0bc43d39eb8))
-   **core:** fix tests for changed footer components ([18e05a6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/18e05a6cff720fb0f0a01f02781b1dd5e1f991d9))
-   **core:** fix tests for changed footer components ([148d5a3](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/148d5a3ea6a1a7daad481012a4158986b2c87d6e))

### Build System

-   **app:** add montserrat font ([c07a09a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/c07a09aa2b3765ca8c4fe3b09759f097ad251723))
-   **app:** add ng-bootstrap & fontawesome, remove jquery ([6523fbf](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/6523fbf6588da639580696d645ffc2262ebf3291))
-   **app:** add production build from v0.4.0 (22.1.2019) ([a14614a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/a14614a92388643bfd00b3029b5b8691c47dd137))
-   **app:** RELEASE PROTOTYPE v0.4.0 (22.1.2019) ([d2c0196](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/d2c0196a8822642f7f03c0e8caecfb406b0b6113))
-   **shared:** add ngbTabsetModule ([342201b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/342201bac864ba008f54a82780865fbf5fc5208c))
-   **shared:** add ngbTooltipModule ([8f8013a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/8f8013aad8d2e2dbdee5a788a744b6c65c3f89ab))
-   **shared:** add NgxJsonViewerModule ([ff7f185](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/ff7f185a7319a43a6234fdbe36763289eae7f4bf))

## [0.3.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.2.0...v0.3.0) (2018-11-15)

### Features

-   **build:** update to latest `angular-cli`(^6.2.4) and `angular` (^6.1.9) ([3c0b115](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/3c0b115cc8477710e4ac40ec4d4964ebe37b2068))
-   **contact:** add OpenStreetMap map to contact page ([2c68478](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/2c684782c7b24d91cb282b92243a508355cbb1a1))

### Bug Fixes

-   **app:** add noopener norefferer to target blank links ([5e465d8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/5e465d8d5ccffb3eb7761cd31805ae8ff079ead9))
-   **app:** apply new tree-shakable injector strategy for services ([35e24ce](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/35e24cee68422ad60f6a70bd33f57e9a9b03df12))
-   **app:** change root selector to `awg-app` ([9a87bd4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/9a87bd4a5ef09dc68dc424921629aa1544294339))
-   **app:** fix issue with service inheritance (`ngInjectableDef`), cf. https://stackoverflow.com/questions/50263722/angular-6-services-and-class-inheritance ([b260f2d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/b260f2dcca9edd898616fe3b2f8aa9ef8373c75e))
-   **app:** replace scroll fix with new anchorScroll strategy of angular 6 ([cb9c25e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/cb9c25e47d7c5fd83d2ef562ffbad16eb36a4182))
-   **app:** update CHANGELOG ([68ecdf6](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/68ecdf6daf772e9690611199dca4a92407ca8d67))
-   **core:** fetch metaData and logos in FooterComponent ([0af8f57](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/0af8f57d05b33a597bc156e6f0834c675f9a2ad3))
-   **core:** move footer logos into separate component ([17a34f5](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/17a34f5b7badeaed8c81cd8f82cba66d68c2852b))
-   **core:** remove circular dependencies from api service and update service models ([74637eb](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/74637eb54c147354162210b369d94d763250800b))
-   **core:** rename metaService -> coreService ([4906516](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/490651688aa4dfd932240490512a8338df9bf0a3))
-   **edition:** get active class from comparison of overlays ([23095ee](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/23095ee61669a780eebef1c75dc1188279cdc236))
-   **edition:** use `SourceList` model instead of `Source[]` (array) ([53c5630](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/53c56304fab06661126ce275b07779be956357d0))
-   **shared:** replace `mapToIterable` pipe with angular's in-built `keyvalue` pipe ([a52bce0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/a52bce0f42f752eb515a1b12ea561ab38f9e1b94))

### Tests

-   **app:** add tests for app component ([316167a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/316167a6f96f8986b78714a0f4e02fb5f7f851e2))
-   **app:** continue to fix errors from ng test ([ce144b5](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/ce144b59918b2b70dafa973a2a6d3d7bb04db222))
-   **app:** fix and apply tests for StructureViewComponent ([547c2ea](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/547c2eac875fb0e1c67e1f9342d1de3e6e58342d))
-   **app:** fix errors from ng test ([0c879dc](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/0c879dcc88b1fc140ea0627d194374bf10af545f))
-   **app:** fix errors from ng test ([ea9e5f0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/ea9e5f0fab313059f72979d09ab09f4f5c14bb96))
-   **app:** fix more errors from ng test ([bbcdb93](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/bbcdb9318ca54022586ab3eb0f107ba536dd2945))
-   **core:** add tests for footer component ([3bb6b93](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/3bb6b932f473515aeeac199e23c2e725e6990371))
-   **core:** add tests for navbar ([e3ea1f8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/e3ea1f826bde23160883b0ce1e6bfd7dc8ad0dd2))

### Build System

-   **app:** add `--stats-json` flag to build output ([9401f01](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/9401f01a7966dd8ea3056fa6a52fdce2d6cadc9e))
-   **app:** add integrity check sum to `yarn.lock` ([396378f](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/396378f0a06cd0dde18026fc5f70ad63eb28cf93))
-   **app:** add packages for linting code and commits ([6f53f2b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/6f53f2bc9dcb5d9b5713995bec2ab5aa44f06c84))
-   **app:** add production build from v0.3.0 (15.11.2018) ([cb82e1c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/cb82e1cc4f24b6f1b4a35be281c2e3141d647fd1))
-   **app:** name build scripts consistently and remove unnecessary script ([56a5867](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/56a5867056df9fdb5acbe9b8cb38764c0032b600))
-   **app:** RELEASE PROTOTYPE v0.3.0 (15.11.2018) ([d0e8fd2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/d0e8fd2aaf594b9343024457f7854b6f901bb36f))
-   update dependencies in package.json according to new ng-cli project ([02adc95](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/02adc9535271aaef5342167e8dc099015382ad64))
-   **app:** update build after hotfix changes ([03fd96a](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/03fd96a127bfb2742ef0a2a3c6c0ec2dc1db22e8))

## [0.2.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.3...v0.2.0) (2018-10-03)

### Features

-   **edition-folio:** add basic support for folio visualisation ([dacac10](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/dacac1026d4120a74bc868fa5adea3ea8922e8dd))

### Bug Fixes

-   **app:** use path aliases (awg-{app/core/shared/views}) for imports ([3297cc9](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/3297cc928ac5124079516cfc0215d1a6b172688d))
-   **data:** rename resource-detail models ([f7151e0](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/f7151e0e0ee83a6b03ce21ee2ed5575d11ed1879))
-   **edition:** add overlay model to handle textcritics' overlays ([e125b5c](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/e125b5c1d5d137c79845a68c0b6c284ad6be83b9))
-   **edition:** change behaviour of panels ([0f9dc31](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/0f9dc3179ea489a35ef314ec19c032d6041710ef))
-   **edition:** move svg grid to folio component / service calculations to models ([56a4176](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/56a4176a795c40f380faba9643045bed7b02e610))
-   **edition:** move tka table beneath sheet svg ([600861e](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/600861eb6179c070a8c73e1f9421a2cdb5cea963))
-   **edition-accolade:** move accolade to its own component ([37e006b](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/37e006befb672ea1860ec9aad2492f0b7c9032eb))
-   **edition-convolute:** move convolute to its own component ([d09dbfa](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/d09dbfa0177efe5406f7733b31d9c5d5935d0717))
-   **edition-detail:** minimize the calls to dataservice ([be779f5](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/be779f515b45e25806500714c5dbc99f83825f93))
-   **edition-folio:** coordinate folio view with sheet view ([b15572d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/b15572d6c9f43855076e5d83bd3fce402bea2969))
-   **edition-overview:** move content of overview folder directly under edition-outlets ([6fabdab](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/6fabdabdea98b8cea59ae177ec54c5a1dbc8b5b2))
-   **edition-tka:** simplify tka handling & display ([e534430](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/e53443030112613b4dff8fec8727b5aea98d6ee9))
-   **edition-view:** remove sourceList type and clarify observable types of data service ([e1694a8](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/e1694a8fd6178ea9e55152c1a92dfea78763fa40))
-   **folio:** remove unnecessary form component ([ede03f4](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/ede03f497bb3c7fff892f0211eec0430ec0c6a89))
-   **folio models:** group models in resp. main model file ([8e5c9a2](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/8e5c9a2ec23eae9379f87868d21e9fe7cea592fa))
-   **folio.json:** fix typo ([627047d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/627047dbca770d92e89744805f67eed1f32b57b4))
-   **package.json:** add bundle analyzing tools to devDependencies ([0ab8d4d](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/0ab8d4d70f1500f02ce01906840801322cc83f95))
-   **package.json:** add production build script ([619c5bc](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/619c5bcf01d4e30da7a77dea1e7a90b032687af1))
-   **package.json:** add snapsvg to project dependencies ([3fec1ae](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/3fec1aea257c0ae76f756b26340cd29eb8f63071))
-   **svg grid:** some styling to position svg-grid correctly ([b694768](https://git.iml.unibas.ch/muennich/WebernLiveApp/commit/b69476862a918494e62885dd139c75cd358931fb))

### [0.1.3](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.2...v0.1.3) (2018-09-04)

### [0.1.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.1...v0.1.2) (2018-08-31)

### [0.1.1](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.1.0...v0.1.1) (2018-03-23)

## [0.1.0](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.9...v0.1.0) (2018-03-20)

### [0.0.9](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.8...v0.0.9) (2016-11-21)

### [0.0.8](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.7...v0.0.8) (2016-08-19)

### [0.0.7](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.6...v0.0.7) (2016-07-14)

### [0.0.6](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.5...v0.0.6) (2016-04-28)

### [0.0.5](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.4...v0.0.5) (2016-04-14)

### [0.0.4](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.3...v0.0.4) (2016-03-31)

### [0.0.3](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.2...v0.0.3) (2016-03-17)

### [0.0.2](https://git.iml.unibas.ch/muennich/WebernLiveApp/compare/v0.0.1...v0.0.2) (2016-03-03)

### 0.0.1 (2016-02-02)
