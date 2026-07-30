'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">awg-app documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-21ba48fa0fec5d5d93201d27954436ec08ec7a76e1888bbfb6d21e46d11d504cf12d98eff6911ed78119486067d0846d4d528ebe07445d018ac2cce27655608f"' : 'data-bs-target="#xs-components-links-module-AppModule-21ba48fa0fec5d5d93201d27954436ec08ec7a76e1888bbfb6d21e46d11d504cf12d98eff6911ed78119486067d0846d4d528ebe07445d018ac2cce27655608f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-21ba48fa0fec5d5d93201d27954436ec08ec7a76e1888bbfb6d21e46d11d504cf12d98eff6911ed78119486067d0846d4d528ebe07445d018ac2cce27655608f"' :
                                            'id="xs-components-links-module-AppModule-21ba48fa0fec5d5d93201d27954436ec08ec7a76e1888bbfb6d21e46d11d504cf12d98eff6911ed78119486067d0846d4d528ebe07445d018ac2cce27655608f"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewContainerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewContainerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CodeMirrorModule.html" data-type="entity-link" >CodeMirrorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CodeMirrorModule-e980061e575128eb2ab90649a7d1904d0b17644951174981ead18669977172e0cdae663933cb3c2712df0ae24fba55b4260db0025e4043fb68a1a5131e3473d3"' : 'data-bs-target="#xs-components-links-module-CodeMirrorModule-e980061e575128eb2ab90649a7d1904d0b17644951174981ead18669977172e0cdae663933cb3c2712df0ae24fba55b4260db0025e4043fb68a1a5131e3473d3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CodeMirrorModule-e980061e575128eb2ab90649a7d1904d0b17644951174981ead18669977172e0cdae663933cb3c2712df0ae24fba55b4260db0025e4043fb68a1a5131e3473d3"' :
                                            'id="xs-components-links-module-CodeMirrorModule-e980061e575128eb2ab90649a7d1904d0b17644951174981ead18669977172e0cdae663933cb3c2712df0ae24fba55b4260db0025e4043fb68a1a5131e3473d3"' }>
                                            <li class="link">
                                                <a href="components/CodeMirrorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeMirrorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CompileHtmlModule.html" data-type="entity-link" >CompileHtmlModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CompileHtmlModule-d8501a955a97369b10271f6f5d0a86ff3310e84b67b981ae00210d6d361c852fc3f990b06338df769d61f2112591375eb31f27ccac292a20fba7587aed9d1e75"' : 'data-bs-target="#xs-components-links-module-CompileHtmlModule-d8501a955a97369b10271f6f5d0a86ff3310e84b67b981ae00210d6d361c852fc3f990b06338df769d61f2112591375eb31f27ccac292a20fba7587aed9d1e75"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CompileHtmlModule-d8501a955a97369b10271f6f5d0a86ff3310e84b67b981ae00210d6d361c852fc3f990b06338df769d61f2112591375eb31f27ccac292a20fba7587aed9d1e75"' :
                                            'id="xs-components-links-module-CompileHtmlModule-d8501a955a97369b10271f6f5d0a86ff3310e84b67b981ae00210d6d361c852fc3f990b06338df769d61f2112591375eb31f27ccac292a20fba7587aed9d1e75"' }>
                                            <li class="link">
                                                <a href="components/CompileHtmlComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompileHtmlComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionAccoladeModule.html" data-type="entity-link" >EditionAccoladeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionAccoladeModule-a8d10a09261affea4f0e49089b845860738e3a46799a19a17e5a2a6d8abfa0ba7ad16c25f06d16bdd202fe11c19724d624dc4ca558e19dc9a6bd46352c5b7f11"' : 'data-bs-target="#xs-components-links-module-EditionAccoladeModule-a8d10a09261affea4f0e49089b845860738e3a46799a19a17e5a2a6d8abfa0ba7ad16c25f06d16bdd202fe11c19724d624dc4ca558e19dc9a6bd46352c5b7f11"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionAccoladeModule-a8d10a09261affea4f0e49089b845860738e3a46799a19a17e5a2a6d8abfa0ba7ad16c25f06d16bdd202fe11c19724d624dc4ca558e19dc9a6bd46352c5b7f11"' :
                                            'id="xs-components-links-module-EditionAccoladeModule-a8d10a09261affea4f0e49089b845860738e3a46799a19a17e5a2a6d8abfa0ba7ad16c25f06d16bdd202fe11c19724d624dc4ca558e19dc9a6bd46352c5b7f11"' }>
                                            <li class="link">
                                                <a href="components/EditionAccoladeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionAccoladeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionConvoluteModule.html" data-type="entity-link" >EditionConvoluteModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionConvoluteModule-db3858753027d8d3f0cb2b5da8f065809205d8d08a6dfa80e235975703f8bb01338254c29709cc60808a9afaff0877871fbc654128aa53d8ca4a97bd4a04c2cb"' : 'data-bs-target="#xs-components-links-module-EditionConvoluteModule-db3858753027d8d3f0cb2b5da8f065809205d8d08a6dfa80e235975703f8bb01338254c29709cc60808a9afaff0877871fbc654128aa53d8ca4a97bd4a04c2cb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionConvoluteModule-db3858753027d8d3f0cb2b5da8f065809205d8d08a6dfa80e235975703f8bb01338254c29709cc60808a9afaff0877871fbc654128aa53d8ca4a97bd4a04c2cb"' :
                                            'id="xs-components-links-module-EditionConvoluteModule-db3858753027d8d3f0cb2b5da8f065809205d8d08a6dfa80e235975703f8bb01338254c29709cc60808a9afaff0877871fbc654128aa53d8ca4a97bd4a04c2cb"' }>
                                            <li class="link">
                                                <a href="components/EditionConvoluteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionConvoluteComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionFolioViewerFolioModule.html" data-type="entity-link" >EditionFolioViewerFolioModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionFolioViewerFolioModule-91d1ae354eece29850e9e75dec632f5a63b12e888937af3749fb1ade9de5fe24e3c9239bb2411efbdac236a80f09de7d4fe0c23a5e0d61e634eb57b5034cf6f4"' : 'data-bs-target="#xs-components-links-module-EditionFolioViewerFolioModule-91d1ae354eece29850e9e75dec632f5a63b12e888937af3749fb1ade9de5fe24e3c9239bb2411efbdac236a80f09de7d4fe0c23a5e0d61e634eb57b5034cf6f4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionFolioViewerFolioModule-91d1ae354eece29850e9e75dec632f5a63b12e888937af3749fb1ade9de5fe24e3c9239bb2411efbdac236a80f09de7d4fe0c23a5e0d61e634eb57b5034cf6f4"' :
                                            'id="xs-components-links-module-EditionFolioViewerFolioModule-91d1ae354eece29850e9e75dec632f5a63b12e888937af3749fb1ade9de5fe24e3c9239bb2411efbdac236a80f09de7d4fe0c23a5e0d61e634eb57b5034cf6f4"' }>
                                            <li class="link">
                                                <a href="components/EditionFolioViewerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionFolioViewerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionGraphModule.html" data-type="entity-link" >EditionGraphModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionGraphModule-8d9169519dc4d77c68a3eee526286fbbac67d2dc90fef8f4883f5e84191412ad5791d9d381179659de149670dd739b7f2bf4b07fb3c78536041c21fb64b1cf9b"' : 'data-bs-target="#xs-components-links-module-EditionGraphModule-8d9169519dc4d77c68a3eee526286fbbac67d2dc90fef8f4883f5e84191412ad5791d9d381179659de149670dd739b7f2bf4b07fb3c78536041c21fb64b1cf9b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionGraphModule-8d9169519dc4d77c68a3eee526286fbbac67d2dc90fef8f4883f5e84191412ad5791d9d381179659de149670dd739b7f2bf4b07fb3c78536041c21fb64b1cf9b"' :
                                            'id="xs-components-links-module-EditionGraphModule-8d9169519dc4d77c68a3eee526286fbbac67d2dc90fef8f4883f5e84191412ad5791d9d381179659de149670dd739b7f2bf4b07fb3c78536041c21fb64b1cf9b"' }>
                                            <li class="link">
                                                <a href="components/EditionGraphComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionGraphRoutingModule.html" data-type="entity-link" >EditionGraphRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionIntroModule.html" data-type="entity-link" >EditionIntroModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionIntroModule-83e4b5b73a3a4ba39b8252f7e782b56b116d114f07746baabb25425bfd24ebd3b996e3f6016c0699e4de024580d8e0f92bd9576892ab72c634e567a18fb7bda5"' : 'data-bs-target="#xs-components-links-module-EditionIntroModule-83e4b5b73a3a4ba39b8252f7e782b56b116d114f07746baabb25425bfd24ebd3b996e3f6016c0699e4de024580d8e0f92bd9576892ab72c634e567a18fb7bda5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionIntroModule-83e4b5b73a3a4ba39b8252f7e782b56b116d114f07746baabb25425bfd24ebd3b996e3f6016c0699e4de024580d8e0f92bd9576892ab72c634e567a18fb7bda5"' :
                                            'id="xs-components-links-module-EditionIntroModule-83e4b5b73a3a4ba39b8252f7e782b56b116d114f07746baabb25425bfd24ebd3b996e3f6016c0699e4de024580d8e0f92bd9576892ab72c634e567a18fb7bda5"' }>
                                            <li class="link">
                                                <a href="components/EditionIntroComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionIntroComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionIntroContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionIntroContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionIntroNavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionIntroNavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionIntroPartialDisclaimerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionIntroPartialDisclaimerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionIntroPlaceholderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionIntroPlaceholderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionIntroRoutingModule.html" data-type="entity-link" >EditionIntroRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionPrefaceModule.html" data-type="entity-link" >EditionPrefaceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionPrefaceModule-6308526cb957d60016464287e7fdcc29d38a79eb6c7f14fe8326f991e3d44276cf894b0916594ec3ac136f746abda7aeb9ee01a86f3b0ce87c92151cb5bd14d3"' : 'data-bs-target="#xs-components-links-module-EditionPrefaceModule-6308526cb957d60016464287e7fdcc29d38a79eb6c7f14fe8326f991e3d44276cf894b0916594ec3ac136f746abda7aeb9ee01a86f3b0ce87c92151cb5bd14d3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionPrefaceModule-6308526cb957d60016464287e7fdcc29d38a79eb6c7f14fe8326f991e3d44276cf894b0916594ec3ac136f746abda7aeb9ee01a86f3b0ce87c92151cb5bd14d3"' :
                                            'id="xs-components-links-module-EditionPrefaceModule-6308526cb957d60016464287e7fdcc29d38a79eb6c7f14fe8326f991e3d44276cf894b0916594ec3ac136f746abda7aeb9ee01a86f3b0ce87c92151cb5bd14d3"' }>
                                            <li class="link">
                                                <a href="components/EditionPrefaceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionPrefaceComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionPrefaceRoutingModule.html" data-type="entity-link" >EditionPrefaceRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionReportModule.html" data-type="entity-link" >EditionReportModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionReportModule-4b42b9acb88dcfaec53b17c3ce7312d4774c856ce6e55d37fa11f12b169bf977e825562e19aa8aadd853e6992b4be013dd4ead0e8faf6d0dfaf1e2c1582528e0"' : 'data-bs-target="#xs-components-links-module-EditionReportModule-4b42b9acb88dcfaec53b17c3ce7312d4774c856ce6e55d37fa11f12b169bf977e825562e19aa8aadd853e6992b4be013dd4ead0e8faf6d0dfaf1e2c1582528e0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionReportModule-4b42b9acb88dcfaec53b17c3ce7312d4774c856ce6e55d37fa11f12b169bf977e825562e19aa8aadd853e6992b4be013dd4ead0e8faf6d0dfaf1e2c1582528e0"' :
                                            'id="xs-components-links-module-EditionReportModule-4b42b9acb88dcfaec53b17c3ce7312d4774c856ce6e55d37fa11f12b169bf977e825562e19aa8aadd853e6992b4be013dd4ead0e8faf6d0dfaf1e2c1582528e0"' }>
                                            <li class="link">
                                                <a href="components/EditionReportComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionReportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourceEvaluationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceEvaluationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourceListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TextcriticsListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TextcriticsListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionReportRoutingModule.html" data-type="entity-link" >EditionReportRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionRowtablesModule.html" data-type="entity-link" >EditionRowtablesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionRowtablesModule-897464e0be660e4d6ebb8e93ca86c62030a3ae3f7aa5b3901e111c52297fdf279578c9c8edb72de3f90105e92bad0ad7eeb277291aa29ccb641f66e6004c103b"' : 'data-bs-target="#xs-components-links-module-EditionRowtablesModule-897464e0be660e4d6ebb8e93ca86c62030a3ae3f7aa5b3901e111c52297fdf279578c9c8edb72de3f90105e92bad0ad7eeb277291aa29ccb641f66e6004c103b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionRowtablesModule-897464e0be660e4d6ebb8e93ca86c62030a3ae3f7aa5b3901e111c52297fdf279578c9c8edb72de3f90105e92bad0ad7eeb277291aa29ccb641f66e6004c103b"' :
                                            'id="xs-components-links-module-EditionRowtablesModule-897464e0be660e4d6ebb8e93ca86c62030a3ae3f7aa5b3901e111c52297fdf279578c9c8edb72de3f90105e92bad0ad7eeb277291aa29ccb641f66e6004c103b"' }>
                                            <li class="link">
                                                <a href="components/EditionRowtablesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionRowtablesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionRowtablesRoutingModule.html" data-type="entity-link" >EditionRowtablesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionSectionDetailModule.html" data-type="entity-link" >EditionSectionDetailModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionSectionDetailModule-8fb96e3fdfced04928c799e3f9acfb72181f3070746cab5ef13c42cc07428f282f1b430fd15e47022a9256bed1a3673bd7f04c07346a0b079ba7f3398abcfb04"' : 'data-bs-target="#xs-components-links-module-EditionSectionDetailModule-8fb96e3fdfced04928c799e3f9acfb72181f3070746cab5ef13c42cc07428f282f1b430fd15e47022a9256bed1a3673bd7f04c07346a0b079ba7f3398abcfb04"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionSectionDetailModule-8fb96e3fdfced04928c799e3f9acfb72181f3070746cab5ef13c42cc07428f282f1b430fd15e47022a9256bed1a3673bd7f04c07346a0b079ba7f3398abcfb04"' :
                                            'id="xs-components-links-module-EditionSectionDetailModule-8fb96e3fdfced04928c799e3f9acfb72181f3070746cab5ef13c42cc07428f282f1b430fd15e47022a9256bed1a3673bd7f04c07346a0b079ba7f3398abcfb04"' }>
                                            <li class="link">
                                                <a href="components/EditionSectionDetailComplexCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSectionDetailComplexCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSectionDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSectionDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSectionDetailDisclaimerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSectionDetailDisclaimerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSectionDetailIntroCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSectionDetailIntroCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSectionDetailOverviewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSectionDetailOverviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSectionDetailPlaceholderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSectionDetailPlaceholderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionSectionDetailRoutingModule.html" data-type="entity-link" >EditionSectionDetailRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionSheetsModule.html" data-type="entity-link" >EditionSheetsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionSheetsModule-02c8e5b6b620a4541b6156f3732bf8745fcb8433d81322943fdc4c60794d476386ac924f986b8080add4ab820aaf8ac3ed684e1df420dcd79cffe11b6dd71246"' : 'data-bs-target="#xs-components-links-module-EditionSheetsModule-02c8e5b6b620a4541b6156f3732bf8745fcb8433d81322943fdc4c60794d476386ac924f986b8080add4ab820aaf8ac3ed684e1df420dcd79cffe11b6dd71246"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionSheetsModule-02c8e5b6b620a4541b6156f3732bf8745fcb8433d81322943fdc4c60794d476386ac924f986b8080add4ab820aaf8ac3ed684e1df420dcd79cffe11b6dd71246"' :
                                            'id="xs-components-links-module-EditionSheetsModule-02c8e5b6b620a4541b6156f3732bf8745fcb8433d81322943fdc4c60794d476386ac924f986b8080add4ab820aaf8ac3ed684e1df420dcd79cffe11b6dd71246"' }>
                                            <li class="link">
                                                <a href="components/EditionSheetsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSheetsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionSheetsRoutingModule.html" data-type="entity-link" >EditionSheetsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionSvgSheetFacetModule.html" data-type="entity-link" >EditionSvgSheetFacetModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionSvgSheetFacetModule-56b57ce5591b22e321e31e1bc382ee909f0817f05aad68abe7dbe1bf32d010a80a10e3e66a3ea072bee3d9282bad52bc771f987693b1027db50de040fbdacc99"' : 'data-bs-target="#xs-components-links-module-EditionSvgSheetFacetModule-56b57ce5591b22e321e31e1bc382ee909f0817f05aad68abe7dbe1bf32d010a80a10e3e66a3ea072bee3d9282bad52bc771f987693b1027db50de040fbdacc99"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionSvgSheetFacetModule-56b57ce5591b22e321e31e1bc382ee909f0817f05aad68abe7dbe1bf32d010a80a10e3e66a3ea072bee3d9282bad52bc771f987693b1027db50de040fbdacc99"' :
                                            'id="xs-components-links-module-EditionSvgSheetFacetModule-56b57ce5591b22e321e31e1bc382ee909f0817f05aad68abe7dbe1bf32d010a80a10e3e66a3ea072bee3d9282bad52bc771f987693b1027db50de040fbdacc99"' }>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetFacetComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetFacetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetFacetItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetFacetItemComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionSvgSheetFooterModule.html" data-type="entity-link" >EditionSvgSheetFooterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionSvgSheetFooterModule-b6421ed0b2b4f4f8803de316c59179a233fac20beeb0e26af5f4606a3773a99527e9cfbc87ca0d82aa6f545827c7d9bed25ad4c206e4cf8560b22a0e5378be6e"' : 'data-bs-target="#xs-components-links-module-EditionSvgSheetFooterModule-b6421ed0b2b4f4f8803de316c59179a233fac20beeb0e26af5f4606a3773a99527e9cfbc87ca0d82aa6f545827c7d9bed25ad4c206e4cf8560b22a0e5378be6e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionSvgSheetFooterModule-b6421ed0b2b4f4f8803de316c59179a233fac20beeb0e26af5f4606a3773a99527e9cfbc87ca0d82aa6f545827c7d9bed25ad4c206e4cf8560b22a0e5378be6e"' :
                                            'id="xs-components-links-module-EditionSvgSheetFooterModule-b6421ed0b2b4f4f8803de316c59179a233fac20beeb0e26af5f4606a3773a99527e9cfbc87ca0d82aa6f545827c7d9bed25ad4c206e4cf8560b22a0e5378be6e"' }>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetFooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetFooterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionSvgSheetViewerModule.html" data-type="entity-link" >EditionSvgSheetViewerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionSvgSheetViewerModule-5f5da467b9f257805215935e0942f63aa7bd51b7b43cd1f34868f8376d4f389e63e572d94619d900b1c97681c35448acaf10a1e32453c42eb6d324f0e50ac931"' : 'data-bs-target="#xs-components-links-module-EditionSvgSheetViewerModule-5f5da467b9f257805215935e0942f63aa7bd51b7b43cd1f34868f8376d4f389e63e572d94619d900b1c97681c35448acaf10a1e32453c42eb6d324f0e50ac931"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionSvgSheetViewerModule-5f5da467b9f257805215935e0942f63aa7bd51b7b43cd1f34868f8376d4f389e63e572d94619d900b1c97681c35448acaf10a1e32453c42eb6d324f0e50ac931"' :
                                            'id="xs-components-links-module-EditionSvgSheetViewerModule-5f5da467b9f257805215935e0942f63aa7bd51b7b43cd1f34868f8376d4f389e63e572d94619d900b1c97681c35448acaf10a1e32453c42eb6d324f0e50ac931"' }>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetViewerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetViewerNavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetViewerNavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetViewerSwitchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetViewerSwitchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionTkaModule.html" data-type="entity-link" >EditionTkaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionTkaModule-30716d8a6bbbd821bb450720ed9b3ca01ab857f0ef1320784a1b5916cfb124b2f464a51295ac4c11da23b074c89afa78c91598f1cce656584248b3919bacd2eb"' : 'data-bs-target="#xs-components-links-module-EditionTkaModule-30716d8a6bbbd821bb450720ed9b3ca01ab857f0ef1320784a1b5916cfb124b2f464a51295ac4c11da23b074c89afa78c91598f1cce656584248b3919bacd2eb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionTkaModule-30716d8a6bbbd821bb450720ed9b3ca01ab857f0ef1320784a1b5916cfb124b2f464a51295ac4c11da23b074c89afa78c91598f1cce656584248b3919bacd2eb"' :
                                            'id="xs-components-links-module-EditionTkaModule-30716d8a6bbbd821bb450720ed9b3ca01ab857f0ef1320784a1b5916cfb124b2f464a51295ac4c11da23b074c89afa78c91598f1cce656584248b3919bacd2eb"' }>
                                            <li class="link">
                                                <a href="components/EditionTkaEvaluationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionTkaEvaluationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionTkaLabelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionTkaLabelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionTkaTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionTkaTableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionViewModule.html" data-type="entity-link" >EditionViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionViewModule-1ad914d21f91ae605c1d6673771d56ab21ed298a801b77fe27835ec21f32a45c39ecbd84852907eea6889e3e040aed2eb7b8019c6af50d481faddfeaf2f9b390"' : 'data-bs-target="#xs-components-links-module-EditionViewModule-1ad914d21f91ae605c1d6673771d56ab21ed298a801b77fe27835ec21f32a45c39ecbd84852907eea6889e3e040aed2eb7b8019c6af50d481faddfeaf2f9b390"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionViewModule-1ad914d21f91ae605c1d6673771d56ab21ed298a801b77fe27835ec21f32a45c39ecbd84852907eea6889e3e040aed2eb7b8019c6af50d481faddfeaf2f9b390"' :
                                            'id="xs-components-links-module-EditionViewModule-1ad914d21f91ae605c1d6673771d56ab21ed298a801b77fe27835ec21f32a45c39ecbd84852907eea6889e3e040aed2eb7b8019c6af50d481faddfeaf2f9b390"' }>
                                            <li class="link">
                                                <a href="components/EditionComplexComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionComplexComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionDetailNavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionDetailNavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionJumbotronComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionJumbotronComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSectionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSectionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSeriesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSeriesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSeriesDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSeriesDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionViewRoutingModule.html" data-type="entity-link" >EditionViewRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GraphVisualizerModule.html" data-type="entity-link" >GraphVisualizerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' : 'data-bs-target="#xs-components-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' :
                                            'id="xs-components-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' }>
                                            <li class="link">
                                                <a href="components/ConstructResultsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConstructResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForceGraphComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForceGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GraphVisualizerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GraphVisualizerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectResultsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SelectResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SparqlEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SparqlEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SparqlNoResultsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SparqlNoResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SparqlTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SparqlTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TriplesEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TriplesEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UnsupportedTypeResultsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UnsupportedTypeResultsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' : 'data-bs-target="#xs-injectables-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' :
                                        'id="xs-injectables-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' }>
                                        <li class="link">
                                            <a href="injectables/GraphVisualizerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GraphVisualizerService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' : 'data-bs-target="#xs-pipes-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' :
                                            'id="xs-pipes-links-module-GraphVisualizerModule-69d353afc77a36b8309f753bea5c3eb7226ac164820c0fb41ef4433a5d831599815b29dd13b65cd5fd0ff9eb2d110c069d205a70afd44c47d5597eedf584cc87"' }>
                                            <li class="link">
                                                <a href="pipes/PrefixPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrefixPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' : 'data-bs-target="#xs-components-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' :
                                            'id="xs-components-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' }>
                                            <li class="link">
                                                <a href="components/AlertErrorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlertErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AlertInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlertInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DisclaimerWorkeditionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DisclaimerWorkeditionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FullscreenToggleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FullscreenToggleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeadingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeadingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/JsonViewerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JsonViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LanguageSwitcherComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LanguageSwitcherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LicenseComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LicenseComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MetaIdentifierBadgesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetaIdentifierBadgesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RouterLinkButtonGroupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RouterLinkButtonGroupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScrollToTopButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScrollToTopButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TablePaginationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TablePaginationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToastComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToastComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TwelveToneSpinnerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TwelveToneSpinnerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewHandleButtonGroupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewHandleButtonGroupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' : 'data-bs-target="#xs-directives-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' :
                                        'id="xs-directives-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' }>
                                        <li class="link">
                                            <a href="directives/AbbrDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AbbrDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ExternalLinkDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExternalLinkDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' : 'data-bs-target="#xs-pipes-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' :
                                            'id="xs-pipes-links-module-SharedModule-db44123259b708e5670bf78932df3eaa322949810b29dd2d0da7ecaaac345892725e6142e518f5f388a9e762d295593e67b90e5979b82dcc1eb27b4b509fa957"' }>
                                            <li class="link">
                                                <a href="pipes/OrderByPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderByPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedNgbootstrapModule.html" data-type="entity-link" >SharedNgbootstrapModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SourceDescriptionModule.html" data-type="entity-link" >SourceDescriptionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SourceDescriptionModule-8ce28c5325dc69ad7a2b5d59413567e5848039b386a68d887deff3a768ff13210515b4d6383ac6a4e8471ee1f63630618b111898175d93a9d00cb36077145e83"' : 'data-bs-target="#xs-components-links-module-SourceDescriptionModule-8ce28c5325dc69ad7a2b5d59413567e5848039b386a68d887deff3a768ff13210515b4d6383ac6a4e8471ee1f63630618b111898175d93a9d00cb36077145e83"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SourceDescriptionModule-8ce28c5325dc69ad7a2b5d59413567e5848039b386a68d887deff3a768ff13210515b4d6383ac6a4e8471ee1f63630618b111898175d93a9d00cb36077145e83"' :
                                            'id="xs-components-links-module-SourceDescriptionModule-8ce28c5325dc69ad7a2b5d59413567e5848039b386a68d887deff3a768ff13210515b4d6383ac6a4e8471ee1f63630618b111898175d93a9d00cb36077145e83"' }>
                                            <li class="link">
                                                <a href="components/SourceDescriptionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceDescriptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourceDescriptionContentTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceDescriptionContentTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourceDescriptionContentsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceDescriptionContentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourceDescriptionCorrectionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceDescriptionCorrectionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourceDescriptionDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceDescriptionDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourceDescriptionWritingMaterialsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceDescriptionWritingMaterialsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AlertErrorComponent.html" data-type="entity-link" >AlertErrorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AlertInfoComponent.html" data-type="entity-link" >AlertInfoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConstructResultsComponent.html" data-type="entity-link" >ConstructResultsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactAddressComponent.html" data-type="entity-link" >ContactAddressComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactMapComponent.html" data-type="entity-link" >ContactMapComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactSideInfoComponent.html" data-type="entity-link" >ContactSideInfoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactViewComponent.html" data-type="entity-link" >ContactViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionDetailComponent.html" data-type="entity-link" >EditionDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionInfoComponent.html" data-type="entity-link" >EditionInfoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionIntroContentComponent.html" data-type="entity-link" >EditionIntroContentComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionIntroNavComponent.html" data-type="entity-link" >EditionIntroNavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionIntroPartialDisclaimerComponent.html" data-type="entity-link" >EditionIntroPartialDisclaimerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionIntroPlaceholderComponent.html" data-type="entity-link" >EditionIntroPlaceholderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionJumbotronComponent.html" data-type="entity-link" >EditionJumbotronComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailComplexCardComponent.html" data-type="entity-link" >EditionSectionDetailComplexCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailDisclaimerComponent.html" data-type="entity-link" >EditionSectionDetailDisclaimerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailIntroCardComponent.html" data-type="entity-link" >EditionSectionDetailIntroCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailPlaceholderComponent.html" data-type="entity-link" >EditionSectionDetailPlaceholderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSvgSheetViewerNavComponent.html" data-type="entity-link" >EditionSvgSheetViewerNavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSvgSheetViewerSwitchComponent.html" data-type="entity-link" >EditionSvgSheetViewerSwitchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionTkaEvaluationsComponent.html" data-type="entity-link" >EditionTkaEvaluationsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionTkaLabelComponent.html" data-type="entity-link" >EditionTkaLabelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionTkaTableComponent.html" data-type="entity-link" >EditionTkaTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterComponent.html" data-type="entity-link" >FooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterCopyrightComponent.html" data-type="entity-link" >FooterCopyrightComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterDeclarationComponent.html" data-type="entity-link" >FooterDeclarationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterPoweredbyComponent.html" data-type="entity-link" >FooterPoweredbyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ForceGraphComponent.html" data-type="entity-link" >ForceGraphComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FullscreenToggleComponent.html" data-type="entity-link" >FullscreenToggleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeadingComponent.html" data-type="entity-link" >HeadingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeViewCardComponent.html" data-type="entity-link" >HomeViewCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeViewComponent.html" data-type="entity-link" >HomeViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LicenseComponent.html" data-type="entity-link" >LicenseComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogoComponent.html" data-type="entity-link" >LogoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MetaIdentifierBadgesComponent.html" data-type="entity-link" >MetaIdentifierBadgesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link" >NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarDropdownLinkComponent.html" data-type="entity-link" >NavbarDropdownLinkComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarItemComponent.html" data-type="entity-link" >NavbarItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PageNotFoundViewComponent.html" data-type="entity-link" >PageNotFoundViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ScrollToTopButtonComponent.html" data-type="entity-link" >ScrollToTopButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SelectResultsComponent.html" data-type="entity-link" >SelectResultsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescriptionContentsComponent.html" data-type="entity-link" >SourceDescriptionContentsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescriptionContentTableComponent.html" data-type="entity-link" >SourceDescriptionContentTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescriptionCorrectionsComponent.html" data-type="entity-link" >SourceDescriptionCorrectionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescriptionDetailsComponent.html" data-type="entity-link" >SourceDescriptionDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescriptionWritingMaterialsComponent.html" data-type="entity-link" >SourceDescriptionWritingMaterialsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceEvaluationComponent.html" data-type="entity-link" >SourceEvaluationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceListComponent.html" data-type="entity-link" >SourceListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SparqlEditorComponent.html" data-type="entity-link" >SparqlEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SparqlNoResultsComponent.html" data-type="entity-link" >SparqlNoResultsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SparqlTableComponent.html" data-type="entity-link" >SparqlTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatisticsBreakdownBadgeComponent.html" data-type="entity-link" >StatisticsBreakdownBadgeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatisticsComplexBreakdownComponent.html" data-type="entity-link" >StatisticsComplexBreakdownComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatisticsOverallProgressComponent.html" data-type="entity-link" >StatisticsOverallProgressComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatisticsProgressBarComponent.html" data-type="entity-link" >StatisticsProgressBarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatisticsSeriesBreakdownComponent.html" data-type="entity-link" >StatisticsSeriesBreakdownComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatisticsSummaryCardComponent.html" data-type="entity-link" >StatisticsSummaryCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatisticsSummaryComponent.html" data-type="entity-link" >StatisticsSummaryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatisticsViewComponent.html" data-type="entity-link" >StatisticsViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StructureSideInfoComponent.html" data-type="entity-link" >StructureSideInfoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StructureViewComponent.html" data-type="entity-link" >StructureViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TextcriticsListComponent.html" data-type="entity-link" >TextcriticsListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TriplesEditorComponent.html" data-type="entity-link" >TriplesEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UnsupportedTypeResultsComponent.html" data-type="entity-link" >UnsupportedTypeResultsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewContainerComponent.html" data-type="entity-link" >ViewContainerComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/ExternalLinkDirective.html" data-type="entity-link" >ExternalLinkDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppConfig.html" data-type="entity-link" >AppConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/D3ForceSimulation.html" data-type="entity-link" >D3ForceSimulation</a>
                            </li>
                            <li class="link">
                                <a href="classes/D3SimulationData.html" data-type="entity-link" >D3SimulationData</a>
                            </li>
                            <li class="link">
                                <a href="classes/D3SimulationLink.html" data-type="entity-link" >D3SimulationLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/D3SimulationNode.html" data-type="entity-link" >D3SimulationNode</a>
                            </li>
                            <li class="link">
                                <a href="classes/D3SimulationNodeTriple.html" data-type="entity-link" >D3SimulationNodeTriple</a>
                            </li>
                            <li class="link">
                                <a href="classes/EDITION_CATALOGUE_TYPE_CONSTANTS.html" data-type="entity-link" >EDITION_CATALOGUE_TYPE_CONSTANTS</a>
                            </li>
                            <li class="link">
                                <a href="classes/EDITION_ROUTE_CONSTANTS.html" data-type="entity-link" >EDITION_ROUTE_CONSTANTS</a>
                            </li>
                            <li class="link">
                                <a href="classes/EDITION_TYPE_CONSTANTS.html" data-type="entity-link" >EDITION_TYPE_CONSTANTS</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionComplex.html" data-type="entity-link" >EditionComplex</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionComplexesList.html" data-type="entity-link" >EditionComplexesList</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionComplexPubStatement.html" data-type="entity-link" >EditionComplexPubStatement</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionComplexRespStatement.html" data-type="entity-link" >EditionComplexRespStatement</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionComplexTitleStatement.html" data-type="entity-link" >EditionComplexTitleStatement</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionOutline.html" data-type="entity-link" >EditionOutline</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionRouteConstant.html" data-type="entity-link" >EditionRouteConstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSectionLink.html" data-type="entity-link" >EditionSectionLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgLinkBox.html" data-type="entity-link" >EditionSvgLinkBox</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgOverlay.html" data-type="entity-link" >EditionSvgOverlay</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgSheet.html" data-type="entity-link" >EditionSvgSheet</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgSheetContent.html" data-type="entity-link" >EditionSvgSheetContent</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgSheetList.html" data-type="entity-link" >EditionSvgSheetList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Folio.html" data-type="entity-link" >Folio</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculation.html" data-type="entity-link" >FolioCalculation</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationContentSegment.html" data-type="entity-link" >FolioCalculationContentSegment</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationContentSegmentCenteredPositions.html" data-type="entity-link" >FolioCalculationContentSegmentCenteredPositions</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationContentSegmentLabel.html" data-type="entity-link" >FolioCalculationContentSegmentLabel</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationContentSegmentVertices.html" data-type="entity-link" >FolioCalculationContentSegmentVertices</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationLine.html" data-type="entity-link" >FolioCalculationLine</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationPoint.html" data-type="entity-link" >FolioCalculationPoint</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationRectangle.html" data-type="entity-link" >FolioCalculationRectangle</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationSheet.html" data-type="entity-link" >FolioCalculationSheet</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationSystems.html" data-type="entity-link" >FolioCalculationSystems</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationSystemsDimensions.html" data-type="entity-link" >FolioCalculationSystemsDimensions</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationSystemsLabels.html" data-type="entity-link" >FolioCalculationSystemsLabels</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationSystemsLines.html" data-type="entity-link" >FolioCalculationSystemsLines</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationSystemsMargins.html" data-type="entity-link" >FolioCalculationSystemsMargins</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioContent.html" data-type="entity-link" >FolioContent</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioConvolute.html" data-type="entity-link" >FolioConvolute</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioConvoluteList.html" data-type="entity-link" >FolioConvoluteList</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioDimensions.html" data-type="entity-link" >FolioDimensions</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioSegment.html" data-type="entity-link" >FolioSegment</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioSettings.html" data-type="entity-link" >FolioSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioSvgContentSegment.html" data-type="entity-link" >FolioSvgContentSegment</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioSvgData.html" data-type="entity-link" >FolioSvgData</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioSvgSheet.html" data-type="entity-link" >FolioSvgSheet</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioSvgSystems.html" data-type="entity-link" >FolioSvgSystems</a>
                            </li>
                            <li class="link">
                                <a href="classes/Graph.html" data-type="entity-link" >Graph</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphList.html" data-type="entity-link" >GraphList</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphRDFData.html" data-type="entity-link" >GraphRDFData</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphSparqlQuery.html" data-type="entity-link" >GraphSparqlQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/Intro.html" data-type="entity-link" >Intro</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntroBlock.html" data-type="entity-link" >IntroBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntroList.html" data-type="entity-link" >IntroList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Preface.html" data-type="entity-link" >Preface</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrefaceList.html" data-type="entity-link" >PrefaceList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Prefix.html" data-type="entity-link" >Prefix</a>
                            </li>
                            <li class="link">
                                <a href="classes/RouterLinkButton.html" data-type="entity-link" >RouterLinkButton</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rowtables.html" data-type="entity-link" >Rowtables</a>
                            </li>
                            <li class="link">
                                <a href="classes/RowtablesList.html" data-type="entity-link" >RowtablesList</a>
                            </li>
                            <li class="link">
                                <a href="classes/SliderConfig.html" data-type="entity-link" >SliderConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/Source.html" data-type="entity-link" >Source</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescription.html" data-type="entity-link" >SourceDescription</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionContent.html" data-type="entity-link" >SourceDescriptionContent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionFolio.html" data-type="entity-link" >SourceDescriptionFolio</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionList.html" data-type="entity-link" >SourceDescriptionList</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionPhysDesc.html" data-type="entity-link" >SourceDescriptionPhysDesc</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionSystem.html" data-type="entity-link" >SourceDescriptionSystem</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionSystemRow.html" data-type="entity-link" >SourceDescriptionSystemRow</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionWritingInstruments.html" data-type="entity-link" >SourceDescriptionWritingInstruments</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionWritingMaterial.html" data-type="entity-link" >SourceDescriptionWritingMaterial</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionWritingMaterialDimension.html" data-type="entity-link" >SourceDescriptionWritingMaterialDimension</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionWritingMaterialDimensions.html" data-type="entity-link" >SourceDescriptionWritingMaterialDimensions</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionWritingMaterialItemLocus.html" data-type="entity-link" >SourceDescriptionWritingMaterialItemLocus</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionWritingMaterialSystems.html" data-type="entity-link" >SourceDescriptionWritingMaterialSystems</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionWritingMaterialTrademark.html" data-type="entity-link" >SourceDescriptionWritingMaterialTrademark</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionWritingMaterialWatermark.html" data-type="entity-link" >SourceDescriptionWritingMaterialWatermark</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceEvaluation.html" data-type="entity-link" >SourceEvaluation</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceEvaluationList.html" data-type="entity-link" >SourceEvaluationList</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceList.html" data-type="entity-link" >SourceList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Statistics.html" data-type="entity-link" >Statistics</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatisticsBreakdownBase.html" data-type="entity-link" >StatisticsBreakdownBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatisticsComplexBreakdown.html" data-type="entity-link" >StatisticsComplexBreakdown</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatisticsSectionBreakdown.html" data-type="entity-link" >StatisticsSectionBreakdown</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatisticsSeriesBreakdown.html" data-type="entity-link" >StatisticsSeriesBreakdown</a>
                            </li>
                            <li class="link">
                                <a href="classes/TableData.html" data-type="entity-link" >TableData</a>
                            </li>
                            <li class="link">
                                <a href="classes/TableOptions.html" data-type="entity-link" >TableOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/TablePaginatorOptions.html" data-type="entity-link" >TablePaginatorOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextcriticalComment.html" data-type="entity-link" >TextcriticalComment</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextcriticalCommentary.html" data-type="entity-link" >TextcriticalCommentary</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextcriticalCommentBlock.html" data-type="entity-link" >TextcriticalCommentBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/Textcritics.html" data-type="entity-link" >Textcritics</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextcriticsList.html" data-type="entity-link" >TextcriticsList</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextSource.html" data-type="entity-link" >TextSource</a>
                            </li>
                            <li class="link">
                                <a href="classes/TkaTableHeaderColumn.html" data-type="entity-link" >TkaTableHeaderColumn</a>
                            </li>
                            <li class="link">
                                <a href="classes/Toast.html" data-type="entity-link" >Toast</a>
                            </li>
                            <li class="link">
                                <a href="classes/ToastMessage.html" data-type="entity-link" >ToastMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ViewBox.html" data-type="entity-link" >ViewBox</a>
                            </li>
                            <li class="link">
                                <a href="classes/ViewHandle.html" data-type="entity-link" >ViewHandle</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AnalyticsService.html" data-type="entity-link" >AnalyticsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/D3Service.html" data-type="entity-link" >D3Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionComplexesService.html" data-type="entity-link" >EditionComplexesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionDataService.html" data-type="entity-link" >EditionDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionGlyphService.html" data-type="entity-link" >EditionGlyphService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionOutlineService.html" data-type="entity-link" >EditionOutlineService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionSheetsService.html" data-type="entity-link" >EditionSheetsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionSnippetService.html" data-type="entity-link" >EditionSnippetService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionStateService.html" data-type="entity-link" >EditionStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionSvgDrawingService.html" data-type="entity-link" >EditionSvgDrawingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionSvgOverlayService.html" data-type="entity-link" >EditionSvgOverlayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionViewService.html" data-type="entity-link" >EditionViewService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FolioService.html" data-type="entity-link" >FolioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FullscreenService.html" data-type="entity-link" >FullscreenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GraphVisualizerService.html" data-type="entity-link" >GraphVisualizerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link" >LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatisticsService.html" data-type="entity-link" >StatisticsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToastService.html" data-type="entity-link" >ToastService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AbstractTriple.html" data-type="entity-link" >AbstractTriple</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3DragBehaviour.html" data-type="entity-link" >D3DragBehaviour</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3ForceSimulationOptions.html" data-type="entity-link" >D3ForceSimulationOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3Selection.html" data-type="entity-link" >D3Selection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3Simulation.html" data-type="entity-link" >D3Simulation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3ZoomBehaviour.html" data-type="entity-link" >D3ZoomBehaviour</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionComplexesJsonData.html" data-type="entity-link" >EditionComplexesJsonData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionComplexJsonData.html" data-type="entity-link" >EditionComplexJsonData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionComplexJsonPersonRef.html" data-type="entity-link" >EditionComplexJsonPersonRef</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionDataAssetsError.html" data-type="entity-link" >EditionDataAssetsError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionOutlineComplexItem.html" data-type="entity-link" >EditionOutlineComplexItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionOutlineComplexTypes.html" data-type="entity-link" >EditionOutlineComplexTypes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionOutlineIntroItem.html" data-type="entity-link" >EditionOutlineIntroItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionOutlineJsonData.html" data-type="entity-link" >EditionOutlineJsonData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionOutlineSection.html" data-type="entity-link" >EditionOutlineSection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionOutlineSectionContent.html" data-type="entity-link" >EditionOutlineSectionContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionOutlineSectionsContentJsonData.html" data-type="entity-link" >EditionOutlineSectionsContentJsonData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionOutlineSectionsJsonData.html" data-type="entity-link" >EditionOutlineSectionsJsonData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionOutlineSeries.html" data-type="entity-link" >EditionOutlineSeries</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionOutlineSeriesJsonData.html" data-type="entity-link" >EditionOutlineSeriesJsonData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSvgOverlayState.html" data-type="entity-link" >EditionSvgOverlayState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionViewContext.html" data-type="entity-link" >EditionViewContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionViewData.html" data-type="entity-link" >EditionViewData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionViewDataTypeMapping.html" data-type="entity-link" >EditionViewDataTypeMapping</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FullscreenToggleConfig.html" data-type="entity-link" >FullscreenToggleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HomeViewCard.html" data-type="entity-link" >HomeViewCard</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HomeViewCardExternalLink.html" data-type="entity-link" >HomeViewCardExternalLink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HomeViewCardInternalLink.html" data-type="entity-link" >HomeViewCardInternalLink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFolioLegend.html" data-type="entity-link" >IFolioLegend</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMockAnalytics.html" data-type="entity-link" >IMockAnalytics</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMockCache.html" data-type="entity-link" >IMockCache</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMockConsole.html" data-type="entity-link" >IMockConsole</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LabeledRoute.html" data-type="entity-link" >LabeledRoute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Logo.html" data-type="entity-link" >Logo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Meta.html" data-type="entity-link" >Meta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaContact.html" data-type="entity-link" >MetaContact</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaIdentifierBadge.html" data-type="entity-link" >MetaIdentifierBadge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaIdentifiers.html" data-type="entity-link" >MetaIdentifiers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaPage.html" data-type="entity-link" >MetaPage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaPerson.html" data-type="entity-link" >MetaPerson</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaStructure.html" data-type="entity-link" >MetaStructure</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Namespace.html" data-type="entity-link" >Namespace</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NavbarItem.html" data-type="entity-link" >NavbarItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NavbarItems.html" data-type="entity-link" >NavbarItems</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuerySelectResult.html" data-type="entity-link" >QuerySelectResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuerySelectResultBindings.html" data-type="entity-link" >QuerySelectResultBindings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuerySelectResultBody.html" data-type="entity-link" >QuerySelectResultBody</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuerySelectResultHead.html" data-type="entity-link" >QuerySelectResultHead</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RDFStoreConstructResponse.html" data-type="entity-link" >RDFStoreConstructResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RDFStoreConstructResponseTriple.html" data-type="entity-link" >RDFStoreConstructResponseTriple</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RDFStoreConstructResponseTripleSegment.html" data-type="entity-link" >RDFStoreConstructResponseTripleSegment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RDFStoreSelectResponse.html" data-type="entity-link" >RDFStoreSelectResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RDFStoreSelectResponseTriple.html" data-type="entity-link" >RDFStoreSelectResponseTriple</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RDFStoreSelectResponseTripleSegment.html" data-type="entity-link" >RDFStoreSelectResponseTripleSegment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatisticsBreakDownBadge.html" data-type="entity-link" >StatisticsBreakDownBadge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatisticsComplexCounter.html" data-type="entity-link" >StatisticsComplexCounter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatisticsProgressBarItem.html" data-type="entity-link" >StatisticsProgressBarItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatisticsSummaryCardData.html" data-type="entity-link" >StatisticsSummaryCardData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableRows.html" data-type="entity-link" >TableRows</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Triple.html" data-type="entity-link" >Triple</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/PrefixPipe.html" data-type="entity-link" >PrefixPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});