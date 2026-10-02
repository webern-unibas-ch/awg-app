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
                                            'data-bs-target="#components-links-module-EditionSvgSheetFacetModule-178f5d963af2e875236a4ccbb76135e0f3d59d3c904fcb26b84f410e1abab0fca2f683204e383ddc0b46ae61c5d76eff23be65914bb301a579e0461e3e1e576a"' : 'data-bs-target="#xs-components-links-module-EditionSvgSheetFacetModule-178f5d963af2e875236a4ccbb76135e0f3d59d3c904fcb26b84f410e1abab0fca2f683204e383ddc0b46ae61c5d76eff23be65914bb301a579e0461e3e1e576a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionSvgSheetFacetModule-178f5d963af2e875236a4ccbb76135e0f3d59d3c904fcb26b84f410e1abab0fca2f683204e383ddc0b46ae61c5d76eff23be65914bb301a579e0461e3e1e576a"' :
                                            'id="xs-components-links-module-EditionSvgSheetFacetModule-178f5d963af2e875236a4ccbb76135e0f3d59d3c904fcb26b84f410e1abab0fca2f683204e383ddc0b46ae61c5d76eff23be65914bb301a579e0461e3e1e576a"' }>
                                            <li class="link">
                                                <a href="components/EditionDisclaimerWorkeditionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionDisclaimerWorkeditionsComponent</a>
                                            </li>
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
                                            'data-bs-target="#components-links-module-EditionSvgSheetFooterModule-5dd4bd41400b34957d100a0eb3ba22636719396484c49c332c743715271bc332c583ee5f64887276375b525b9d3dee7e6edae216b2102147429052bcb3f4991c"' : 'data-bs-target="#xs-components-links-module-EditionSvgSheetFooterModule-5dd4bd41400b34957d100a0eb3ba22636719396484c49c332c743715271bc332c583ee5f64887276375b525b9d3dee7e6edae216b2102147429052bcb3f4991c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionSvgSheetFooterModule-5dd4bd41400b34957d100a0eb3ba22636719396484c49c332c743715271bc332c583ee5f64887276375b525b9d3dee7e6edae216b2102147429052bcb3f4991c"' :
                                            'id="xs-components-links-module-EditionSvgSheetFooterModule-5dd4bd41400b34957d100a0eb3ba22636719396484c49c332c743715271bc332c583ee5f64887276375b525b9d3dee7e6edae216b2102147429052bcb3f4991c"' }>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetFooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetFooterComponent</a>
                                            </li>
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
                                <a href="modules/EditionSvgSheetViewerModule.html" data-type="entity-link" >EditionSvgSheetViewerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EditionSvgSheetViewerModule-fc5d7644ccaea5d9a157d0b2d3eb1f060bcf7adfa0ef36fdce67273e48deeffe3aa53ca744f87b5e162f31b98918e762e8c24e041151c7795954e60a85852491"' : 'data-bs-target="#xs-components-links-module-EditionSvgSheetViewerModule-fc5d7644ccaea5d9a157d0b2d3eb1f060bcf7adfa0ef36fdce67273e48deeffe3aa53ca744f87b5e162f31b98918e762e8c24e041151c7795954e60a85852491"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionSvgSheetViewerModule-fc5d7644ccaea5d9a157d0b2d3eb1f060bcf7adfa0ef36fdce67273e48deeffe3aa53ca744f87b5e162f31b98918e762e8c24e041151c7795954e60a85852491"' :
                                            'id="xs-components-links-module-EditionSvgSheetViewerModule-fc5d7644ccaea5d9a157d0b2d3eb1f060bcf7adfa0ef36fdce67273e48deeffe3aa53ca744f87b5e162f31b98918e762e8c24e041151c7795954e60a85852491"' }>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetViewerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetViewerNavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetViewerNavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetViewerSwitchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetViewerSwitchComponent</a>
                                            </li>
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
                                            'data-bs-target="#components-links-module-EditionViewModule-db4013e5f87562c800e19d6254e1881db74318c7677b2eed83cbea9856ec0d62d2fe46d3db4a15993c26faba09608dc975f7b9dcdb36dc8c4bcd02708055dca8"' : 'data-bs-target="#xs-components-links-module-EditionViewModule-db4013e5f87562c800e19d6254e1881db74318c7677b2eed83cbea9856ec0d62d2fe46d3db4a15993c26faba09608dc975f7b9dcdb36dc8c4bcd02708055dca8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionViewModule-db4013e5f87562c800e19d6254e1881db74318c7677b2eed83cbea9856ec0d62d2fe46d3db4a15993c26faba09608dc975f7b9dcdb36dc8c4bcd02708055dca8"' :
                                            'id="xs-components-links-module-EditionViewModule-db4013e5f87562c800e19d6254e1881db74318c7677b2eed83cbea9856ec0d62d2fe46d3db4a15993c26faba09608dc975f7b9dcdb36dc8c4bcd02708055dca8"' }>
                                            <li class="link">
                                                <a href="components/EditionBreadcrumbComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionBreadcrumbComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionComplexComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionComplexComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionDetailNavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionDetailNavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionJumbotronComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionJumbotronComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionOutlineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionOutlineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSectionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSectionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSeriesDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSeriesDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSideInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSideInfoComponent</a>
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
                                            'data-bs-target="#components-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' : 'data-bs-target="#xs-components-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' :
                                            'id="xs-components-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' }>
                                            <li class="link">
                                                <a href="components/AlertErrorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlertErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AlertInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlertInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ButtonScrollToTopComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ButtonScrollToTopComponent</a>
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
                                        'data-bs-target="#directives-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' : 'data-bs-target="#xs-directives-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' :
                                        'id="xs-directives-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' }>
                                        <li class="link">
                                            <a href="directives/AbbrDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AbbrDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/CompileHtmlDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompileHtmlDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ExternalLinkDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExternalLinkDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' : 'data-bs-target="#xs-pipes-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' :
                                            'id="xs-pipes-links-module-SharedModule-5bbc80aab0ffa8717be2aa6da5258f74522859f04f53939851741ac8eb1a5b3e4608f7817d64d567afe93ec1b849f8ba90895851d27863989aae646ebc4d4d71"' }>
                                            <li class="link">
                                                <a href="pipes/OrderByPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderByPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedNgbootstrapModule.html" data-type="entity-link" >SharedNgbootstrapModule</a>
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
                                <a href="components/ButtonExpandAllComponent.html" data-type="entity-link" >ButtonExpandAllComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ButtonMoreComponent.html" data-type="entity-link" >ButtonMoreComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ButtonScrollToTopComponent.html" data-type="entity-link" >ButtonScrollToTopComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConditionalLinkComponent.html" data-type="entity-link" >ConditionalLinkComponent</a>
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
                                <a href="components/EditionBreadcrumbComponent.html" data-type="entity-link" >EditionBreadcrumbComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionDetailComponent.html" data-type="entity-link" >EditionDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionDisclaimerWorkeditionsComponent.html" data-type="entity-link" >EditionDisclaimerWorkeditionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionIntroComponent.html" data-type="entity-link" >EditionIntroComponent</a>
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
                                <a href="components/EditionOutlineComponent.html" data-type="entity-link" >EditionOutlineComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionPrefaceComponent.html" data-type="entity-link" >EditionPrefaceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionReportComponent.html" data-type="entity-link" >EditionReportComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionRowtablesComponent.html" data-type="entity-link" >EditionRowtablesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionCardComponent.html" data-type="entity-link" >EditionSectionCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailComplexCardComponent.html" data-type="entity-link" >EditionSectionDetailComplexCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailComponent.html" data-type="entity-link" >EditionSectionDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailCoverComponent.html" data-type="entity-link" >EditionSectionDetailCoverComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailDisclaimerComponent.html" data-type="entity-link" >EditionSectionDetailDisclaimerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailIntroCardComponent.html" data-type="entity-link" >EditionSectionDetailIntroCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailOverviewComponent.html" data-type="entity-link" >EditionSectionDetailOverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionDetailPlaceholderComponent.html" data-type="entity-link" >EditionSectionDetailPlaceholderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSectionsComponent.html" data-type="entity-link" >EditionSectionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSeriesCardComponent.html" data-type="entity-link" >EditionSeriesCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSeriesDetailComponent.html" data-type="entity-link" >EditionSeriesDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSideInfoComponent.html" data-type="entity-link" >EditionSideInfoComponent</a>
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
                                <a href="components/EditionViewComponent.html" data-type="entity-link" >EditionViewComponent</a>
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
                                <a href="components/LanguageSwitcherComponent.html" data-type="entity-link" >LanguageSwitcherComponent</a>
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
                                <a href="components/ModalComponent.html" data-type="entity-link" >ModalComponent</a>
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
                                <a href="components/SelectResultsComponent.html" data-type="entity-link" >SelectResultsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescComponent.html" data-type="entity-link" >SourceDescComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescContentFolioComponent.html" data-type="entity-link" >SourceDescContentFolioComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescContentGridComponent.html" data-type="entity-link" >SourceDescContentGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescContentItemComponent.html" data-type="entity-link" >SourceDescContentItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescContentsComponent.html" data-type="entity-link" >SourceDescContentsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescContentSystemComponent.html" data-type="entity-link" >SourceDescContentSystemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescCorrectionsComponent.html" data-type="entity-link" >SourceDescCorrectionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescDetailsComponent.html" data-type="entity-link" >SourceDescDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescItemComponent.html" data-type="entity-link" >SourceDescItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescWritingInstrumentsComponent.html" data-type="entity-link" >SourceDescWritingInstrumentsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescWritingMaterialComponent.html" data-type="entity-link" >SourceDescWritingMaterialComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescWritingMaterialsComponent.html" data-type="entity-link" >SourceDescWritingMaterialsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescWritingTrademarkComponent.html" data-type="entity-link" >SourceDescWritingTrademarkComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescWritingWatermarkComponent.html" data-type="entity-link" >SourceDescWritingWatermarkComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceEvaluationComponent.html" data-type="entity-link" >SourceEvaluationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceEvaluationPlaceholderComponent.html" data-type="entity-link" >SourceEvaluationPlaceholderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceListComponent.html" data-type="entity-link" >SourceListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceSiglumComponent.html" data-type="entity-link" >SourceSiglumComponent</a>
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
                                <a href="components/TwelveToneSpinnerComponent.html" data-type="entity-link" >TwelveToneSpinnerComponent</a>
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
                                    <a href="directives/AbbrDirective.html" data-type="entity-link" >AbbrDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/CompileHtmlDirective.html" data-type="entity-link" >CompileHtmlDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/EditionIntroScrollDirective.html" data-type="entity-link" >EditionIntroScrollDirective</a>
                                </li>
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
                                <a href="classes/EditionComplex.html" data-type="entity-link" >EditionComplex</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionComplexesList.html" data-type="entity-link" >EditionComplexesList</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionComplexPubStatement.html" data-type="entity-link" >EditionComplexPubStatement</a>
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
                                <a href="classes/EditionSvgOverlay.html" data-type="entity-link" >EditionSvgOverlay</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgSheet.html" data-type="entity-link" >EditionSvgSheet</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgSheetsList.html" data-type="entity-link" >EditionSvgSheetsList</a>
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
                                <a href="classes/FolioConvolute.html" data-type="entity-link" >FolioConvolute</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioConvoluteList.html" data-type="entity-link" >FolioConvoluteList</a>
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
                                <a href="classes/IntroList.html" data-type="entity-link" >IntroList</a>
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
                                <a href="classes/RowtablesList.html" data-type="entity-link" >RowtablesList</a>
                            </li>
                            <li class="link">
                                <a href="classes/SliderConfig.html" data-type="entity-link" >SliderConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescList.html" data-type="entity-link" >SourceDescList</a>
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
                                <a href="classes/TablePaginatorOptions.html" data-type="entity-link" >TablePaginatorOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextcriticalCommentary.html" data-type="entity-link" >TextcriticalCommentary</a>
                            </li>
                            <li class="link">
                                <a href="classes/Textcritics.html" data-type="entity-link" >Textcritics</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextcriticsList.html" data-type="entity-link" >TextcriticsList</a>
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
                                    <a href="injectables/EditionBreadcrumbService.html" data-type="entity-link" >EditionBreadcrumbService</a>
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
                                    <a href="injectables/EditionNavigationService.html" data-type="entity-link" >EditionNavigationService</a>
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
                                    <a href="injectables/ModalService.html" data-type="entity-link" >ModalService</a>
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
                                <a href="interfaces/DynamicViewContexts.html" data-type="entity-link" >DynamicViewContexts</a>
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
                                <a href="interfaces/EditionComplexRespStatement.html" data-type="entity-link" >EditionComplexRespStatement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionComplexTitleStatement.html" data-type="entity-link" >EditionComplexTitleStatement</a>
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
                                <a href="interfaces/EditionSvgLinkBox.html" data-type="entity-link" >EditionSvgLinkBox</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSvgOverlayState.html" data-type="entity-link" >EditionSvgOverlayState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSvgSheetContent.html" data-type="entity-link" >EditionSvgSheetContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionViewData.html" data-type="entity-link" >EditionViewData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionViewDataTypeMapping.html" data-type="entity-link" >EditionViewDataTypeMapping</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Folio.html" data-type="entity-link" >Folio</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioContent.html" data-type="entity-link" >FolioContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioDimensions.html" data-type="entity-link" >FolioDimensions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSegment.html" data-type="entity-link" >FolioSegment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSettings.html" data-type="entity-link" >FolioSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FragmentClickEvent.html" data-type="entity-link" >FragmentClickEvent</a>
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
                                <a href="interfaces/Intro.html" data-type="entity-link" >Intro</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IntroBlock.html" data-type="entity-link" >IntroBlock</a>
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
                                <a href="interfaces/ModalData.html" data-type="entity-link" >ModalData</a>
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
                                <a href="interfaces/Preface.html" data-type="entity-link" >Preface</a>
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
                                <a href="interfaces/Rowtables.html" data-type="entity-link" >Rowtables</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SheetClickEvent.html" data-type="entity-link" >SheetClickEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Source.html" data-type="entity-link" >Source</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDesc.html" data-type="entity-link" >SourceDesc</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescContent.html" data-type="entity-link" >SourceDescContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescDetails.html" data-type="entity-link" >SourceDescDetails</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescFolio.html" data-type="entity-link" >SourceDescFolio</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescPhysDesc.html" data-type="entity-link" >SourceDescPhysDesc</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescSystem.html" data-type="entity-link" >SourceDescSystem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescSystemRow.html" data-type="entity-link" >SourceDescSystemRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescWritingInstruments.html" data-type="entity-link" >SourceDescWritingInstruments</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescWritingMaterial.html" data-type="entity-link" >SourceDescWritingMaterial</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescWritingMaterialDimension.html" data-type="entity-link" >SourceDescWritingMaterialDimension</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescWritingMaterialDimensions.html" data-type="entity-link" >SourceDescWritingMaterialDimensions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescWritingMaterialItemLocus.html" data-type="entity-link" >SourceDescWritingMaterialItemLocus</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescWritingMaterialSystems.html" data-type="entity-link" >SourceDescWritingMaterialSystems</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescWritingMaterialTrademark.html" data-type="entity-link" >SourceDescWritingMaterialTrademark</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceDescWritingMaterialWatermark.html" data-type="entity-link" >SourceDescWritingMaterialWatermark</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SourceEvaluation.html" data-type="entity-link" >SourceEvaluation</a>
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
                                <a href="interfaces/TableOptions.html" data-type="entity-link" >TableOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableRows.html" data-type="entity-link" >TableRows</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TextcriticalComment.html" data-type="entity-link" >TextcriticalComment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TextcriticalCommentBlock.html" data-type="entity-link" >TextcriticalCommentBlock</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TextSource.html" data-type="entity-link" >TextSource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TkaTableHeaderColumn.html" data-type="entity-link" >TkaTableHeaderColumn</a>
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