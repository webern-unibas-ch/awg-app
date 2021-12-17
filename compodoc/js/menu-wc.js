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
                                <span class="icon ion-ios-paper"></span>README
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
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-b56505907be836ff204dfe12d9b24c106855e5ea549b1ebce1bfe739ba406c7e444bf851084305ec8b68481808edc938f2f51b45ddc7036bc0b45a7cd6523b25"' : 'data-target="#xs-components-links-module-AppModule-b56505907be836ff204dfe12d9b24c106855e5ea549b1ebce1bfe739ba406c7e444bf851084305ec8b68481808edc938f2f51b45ddc7036bc0b45a7cd6523b25"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-b56505907be836ff204dfe12d9b24c106855e5ea549b1ebce1bfe739ba406c7e444bf851084305ec8b68481808edc938f2f51b45ddc7036bc0b45a7cd6523b25"' :
                                            'id="xs-components-links-module-AppModule-b56505907be836ff204dfe12d9b24c106855e5ea549b1ebce1bfe739ba406c7e444bf851084305ec8b68481808edc938f2f51b45ddc7036bc0b45a7cd6523b25"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BibliographyModule.html" data-type="entity-link" >BibliographyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-BibliographyModule-38f5f1003db075525d8a3f2eddcea2294f89b6508a108301c40e749f3f70022290da936d875528960b67f7e12d0be053bfe8468dada45efbf9fc56b8465318e5"' : 'data-target="#xs-components-links-module-BibliographyModule-38f5f1003db075525d8a3f2eddcea2294f89b6508a108301c40e749f3f70022290da936d875528960b67f7e12d0be053bfe8468dada45efbf9fc56b8465318e5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BibliographyModule-38f5f1003db075525d8a3f2eddcea2294f89b6508a108301c40e749f3f70022290da936d875528960b67f7e12d0be053bfe8468dada45efbf9fc56b8465318e5"' :
                                            'id="xs-components-links-module-BibliographyModule-38f5f1003db075525d8a3f2eddcea2294f89b6508a108301c40e749f3f70022290da936d875528960b67f7e12d0be053bfe8468dada45efbf9fc56b8465318e5"' }>
                                            <li class="link">
                                                <a href="components/BibliographyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BibliographyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BibliographyDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BibliographyDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BibliographyListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BibliographyListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BibliographySearchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BibliographySearchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-BibliographyModule-38f5f1003db075525d8a3f2eddcea2294f89b6508a108301c40e749f3f70022290da936d875528960b67f7e12d0be053bfe8468dada45efbf9fc56b8465318e5"' : 'data-target="#xs-pipes-links-module-BibliographyModule-38f5f1003db075525d8a3f2eddcea2294f89b6508a108301c40e749f3f70022290da936d875528960b67f7e12d0be053bfe8468dada45efbf9fc56b8465318e5"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-BibliographyModule-38f5f1003db075525d8a3f2eddcea2294f89b6508a108301c40e749f3f70022290da936d875528960b67f7e12d0be053bfe8468dada45efbf9fc56b8465318e5"' :
                                            'id="xs-pipes-links-module-BibliographyModule-38f5f1003db075525d8a3f2eddcea2294f89b6508a108301c40e749f3f70022290da936d875528960b67f7e12d0be053bfe8468dada45efbf9fc56b8465318e5"' }>
                                            <li class="link">
                                                <a href="pipes/BibliographyFormatPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BibliographyFormatPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BibliographyRoutingModule.html" data-type="entity-link" >BibliographyRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CompileHtmlModule.html" data-type="entity-link" >CompileHtmlModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CompileHtmlModule-2ddd602fdafc577fb7ca1a94457e4e5f2d931db3c0788afd30593d707530c5e85bb5fdb0129508afc8c7c80de46252a0edb3c65a69b5626ec588f2dc10fc52b4"' : 'data-target="#xs-components-links-module-CompileHtmlModule-2ddd602fdafc577fb7ca1a94457e4e5f2d931db3c0788afd30593d707530c5e85bb5fdb0129508afc8c7c80de46252a0edb3c65a69b5626ec588f2dc10fc52b4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CompileHtmlModule-2ddd602fdafc577fb7ca1a94457e4e5f2d931db3c0788afd30593d707530c5e85bb5fdb0129508afc8c7c80de46252a0edb3c65a69b5626ec588f2dc10fc52b4"' :
                                            'id="xs-components-links-module-CompileHtmlModule-2ddd602fdafc577fb7ca1a94457e4e5f2d931db3c0788afd30593d707530c5e85bb5fdb0129508afc8c7c80de46252a0edb3c65a69b5626ec588f2dc10fc52b4"' }>
                                            <li class="link">
                                                <a href="components/CompileHtmlComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompileHtmlComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ContactViewModule.html" data-type="entity-link" >ContactViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ContactViewModule-993edd1f3e2ebf378b68626ed1de564f66d93d2a7f81109b2be5e3622d9986b23443c87c870fe0873bb63bae8d8afba4935d8d3c7b375a98ed1c2c6b9be802b0"' : 'data-target="#xs-components-links-module-ContactViewModule-993edd1f3e2ebf378b68626ed1de564f66d93d2a7f81109b2be5e3622d9986b23443c87c870fe0873bb63bae8d8afba4935d8d3c7b375a98ed1c2c6b9be802b0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ContactViewModule-993edd1f3e2ebf378b68626ed1de564f66d93d2a7f81109b2be5e3622d9986b23443c87c870fe0873bb63bae8d8afba4935d8d3c7b375a98ed1c2c6b9be802b0"' :
                                            'id="xs-components-links-module-ContactViewModule-993edd1f3e2ebf378b68626ed1de564f66d93d2a7f81109b2be5e3622d9986b23443c87c870fe0873bb63bae8d8afba4935d8d3c7b375a98ed1c2c6b9be802b0"' }>
                                            <li class="link">
                                                <a href="components/ContactViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ContactViewRoutingModule.html" data-type="entity-link" >ContactViewRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link" >CoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CoreModule-66a09aba2c98681324ff0e552a7afa23892f4fe72a4eb49fc771f8123d8d9b9187b60c6121c8e8b7a6388b365b36cdada0783a27b8af1a99dd734fc5aeb89e00"' : 'data-target="#xs-components-links-module-CoreModule-66a09aba2c98681324ff0e552a7afa23892f4fe72a4eb49fc771f8123d8d9b9187b60c6121c8e8b7a6388b365b36cdada0783a27b8af1a99dd734fc5aeb89e00"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CoreModule-66a09aba2c98681324ff0e552a7afa23892f4fe72a4eb49fc771f8123d8d9b9187b60c6121c8e8b7a6388b365b36cdada0783a27b8af1a99dd734fc5aeb89e00"' :
                                            'id="xs-components-links-module-CoreModule-66a09aba2c98681324ff0e552a7afa23892f4fe72a4eb49fc771f8123d8d9b9187b60c6121c8e8b7a6388b365b36cdada0783a27b8af1a99dd734fc5aeb89e00"' }>
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
                                <a href="modules/DataViewModule.html" data-type="entity-link" >DataViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DataViewModule-35e1b8bd853e5639f35a377068a7ed03d69101f08722f089561b94601ba3b8970de4af781cf2ab0e658c715be9b07f1d7f661dea7808b41405a6bbf800dd7133"' : 'data-target="#xs-components-links-module-DataViewModule-35e1b8bd853e5639f35a377068a7ed03d69101f08722f089561b94601ba3b8970de4af781cf2ab0e658c715be9b07f1d7f661dea7808b41405a6bbf800dd7133"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DataViewModule-35e1b8bd853e5639f35a377068a7ed03d69101f08722f089561b94601ba3b8970de4af781cf2ab0e658c715be9b07f1d7f661dea7808b41405a6bbf800dd7133"' :
                                            'id="xs-components-links-module-DataViewModule-35e1b8bd853e5639f35a377068a7ed03d69101f08722f089561b94601ba3b8970de4af781cf2ab0e658c715be9b07f1d7f661dea7808b41405a6bbf800dd7133"' }>
                                            <li class="link">
                                                <a href="components/DataViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchOverviewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchOverviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchPanelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchResultListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchResultListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DataViewRoutingModule.html" data-type="entity-link" >DataViewRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionDetailModule.html" data-type="entity-link" >EditionDetailModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EditionDetailModule-8f8c19d5d2f6d378c02a336109ab8cbbe974a4755b67399ed8c68ae1d0e77f4a181f1ab83681c80d44f7c23eb0cf9fc4f302d755193d377cfcbbafdffdbee389"' : 'data-target="#xs-components-links-module-EditionDetailModule-8f8c19d5d2f6d378c02a336109ab8cbbe974a4755b67399ed8c68ae1d0e77f4a181f1ab83681c80d44f7c23eb0cf9fc4f302d755193d377cfcbbafdffdbee389"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionDetailModule-8f8c19d5d2f6d378c02a336109ab8cbbe974a4755b67399ed8c68ae1d0e77f4a181f1ab83681c80d44f7c23eb0cf9fc4f302d755193d377cfcbbafdffdbee389"' :
                                            'id="xs-components-links-module-EditionDetailModule-8f8c19d5d2f6d378c02a336109ab8cbbe974a4755b67399ed8c68ae1d0e77f4a181f1ab83681c80d44f7c23eb0cf9fc4f302d755193d377cfcbbafdffdbee389"' }>
                                            <li class="link">
                                                <a href="components/EditionAccoladeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionAccoladeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionConvoluteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionConvoluteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSvgSheetNavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSvgSheetNavComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionDetailRoutingModule.html" data-type="entity-link" >EditionDetailRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionGraphModule.html" data-type="entity-link" >EditionGraphModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EditionGraphModule-8d9169519dc4d77c68a3eee526286fbbac67d2dc90fef8f4883f5e84191412ad5791d9d381179659de149670dd739b7f2bf4b07fb3c78536041c21fb64b1cf9b"' : 'data-target="#xs-components-links-module-EditionGraphModule-8d9169519dc4d77c68a3eee526286fbbac67d2dc90fef8f4883f5e84191412ad5791d9d381179659de149670dd739b7f2bf4b07fb3c78536041c21fb64b1cf9b"' }>
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
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EditionIntroModule-28ab28d956b4af5abd9168d7f380c0cc965de032b8b76a8a03d6f2c72357143814e3fd1ed2b44c4e912fe28eb1eb121541b16754129234dfd4b00d49c46f2ab8"' : 'data-target="#xs-components-links-module-EditionIntroModule-28ab28d956b4af5abd9168d7f380c0cc965de032b8b76a8a03d6f2c72357143814e3fd1ed2b44c4e912fe28eb1eb121541b16754129234dfd4b00d49c46f2ab8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionIntroModule-28ab28d956b4af5abd9168d7f380c0cc965de032b8b76a8a03d6f2c72357143814e3fd1ed2b44c4e912fe28eb1eb121541b16754129234dfd4b00d49c46f2ab8"' :
                                            'id="xs-components-links-module-EditionIntroModule-28ab28d956b4af5abd9168d7f380c0cc965de032b8b76a8a03d6f2c72357143814e3fd1ed2b44c4e912fe28eb1eb121541b16754129234dfd4b00d49c46f2ab8"' }>
                                            <li class="link">
                                                <a href="components/EditionIntroComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionIntroComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionIntroRoutingModule.html" data-type="entity-link" >EditionIntroRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionReportModule.html" data-type="entity-link" >EditionReportModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EditionReportModule-611e8272c8419556d87c10824d314f4528f6b2439ee5da601d14c31cb618f9cc8d084bc05059e418bfde31714664da3bb2f2eb8c71474caf75061cf37d9c0a5d"' : 'data-target="#xs-components-links-module-EditionReportModule-611e8272c8419556d87c10824d314f4528f6b2439ee5da601d14c31cb618f9cc8d084bc05059e418bfde31714664da3bb2f2eb8c71474caf75061cf37d9c0a5d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionReportModule-611e8272c8419556d87c10824d314f4528f6b2439ee5da601d14c31cb618f9cc8d084bc05059e418bfde31714664da3bb2f2eb8c71474caf75061cf37d9c0a5d"' :
                                            'id="xs-components-links-module-EditionReportModule-611e8272c8419556d87c10824d314f4528f6b2439ee5da601d14c31cb618f9cc8d084bc05059e418bfde31714664da3bb2f2eb8c71474caf75061cf37d9c0a5d"' }>
                                            <li class="link">
                                                <a href="components/EditionReportComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionReportComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionReportRoutingModule.html" data-type="entity-link" >EditionReportRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EditionTkaTableModule.html" data-type="entity-link" >EditionTkaTableModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EditionTkaTableModule-4786982e1ca38794e0f86f4bd4d121e650734d375ad9ac73dbc287bea5917594e6c202f4fa47f7fc80384505ff9368cd13048667255368efc87002025151539f"' : 'data-target="#xs-components-links-module-EditionTkaTableModule-4786982e1ca38794e0f86f4bd4d121e650734d375ad9ac73dbc287bea5917594e6c202f4fa47f7fc80384505ff9368cd13048667255368efc87002025151539f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionTkaTableModule-4786982e1ca38794e0f86f4bd4d121e650734d375ad9ac73dbc287bea5917594e6c202f4fa47f7fc80384505ff9368cd13048667255368efc87002025151539f"' :
                                            'id="xs-components-links-module-EditionTkaTableModule-4786982e1ca38794e0f86f4bd4d121e650734d375ad9ac73dbc287bea5917594e6c202f4fa47f7fc80384505ff9368cd13048667255368efc87002025151539f"' }>
                                            <li class="link">
                                                <a href="components/EditionTkaTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionTkaTableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EditionViewModule.html" data-type="entity-link" >EditionViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EditionViewModule-e190bdc67165f067b7c7c7f0dec3b2b8f7844021275c30235660fc09d3f7fac2bac3c31f3a4852fbd5e6cd148c1ec7daeba1f40226717e9f46fad6648593b910"' : 'data-target="#xs-components-links-module-EditionViewModule-e190bdc67165f067b7c7c7f0dec3b2b8f7844021275c30235660fc09d3f7fac2bac3c31f3a4852fbd5e6cd148c1ec7daeba1f40226717e9f46fad6648593b910"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EditionViewModule-e190bdc67165f067b7c7c7f0dec3b2b8f7844021275c30235660fc09d3f7fac2bac3c31f3a4852fbd5e6cd148c1ec7daeba1f40226717e9f46fad6648593b910"' :
                                            'id="xs-components-links-module-EditionViewModule-e190bdc67165f067b7c7c7f0dec3b2b8f7844021275c30235660fc09d3f7fac2bac3c31f3a4852fbd5e6cd148c1ec7daeba1f40226717e9f46fad6648593b910"' }>
                                            <li class="link">
                                                <a href="components/EditionOverviewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionOverviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSectionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSectionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionSeriesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionSeriesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionTypeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionTypeComponent</a>
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
                                <a href="modules/FakeRouterModule.html" data-type="entity-link" >FakeRouterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FakeRouterModule-9a1136bb3e5d9c6a4a7cea34b91c2a4f9b547b816eca2f87c508467c0c3cbb1dc49d5d3cff0835bb577170ae255c0303abac95a270210bdad9e3d199eb5f0f38"' : 'data-target="#xs-components-links-module-FakeRouterModule-9a1136bb3e5d9c6a4a7cea34b91c2a4f9b547b816eca2f87c508467c0c3cbb1dc49d5d3cff0835bb577170ae255c0303abac95a270210bdad9e3d199eb5f0f38"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FakeRouterModule-9a1136bb3e5d9c6a4a7cea34b91c2a4f9b547b816eca2f87c508467c0c3cbb1dc49d5d3cff0835bb577170ae255c0303abac95a270210bdad9e3d199eb5f0f38"' :
                                            'id="xs-components-links-module-FakeRouterModule-9a1136bb3e5d9c6a4a7cea34b91c2a4f9b547b816eca2f87c508467c0c3cbb1dc49d5d3cff0835bb577170ae255c0303abac95a270210bdad9e3d199eb5f0f38"' }>
                                            <li class="link">
                                                <a href="components/RouterOutletStubComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RouterOutletStubComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-FakeRouterModule-9a1136bb3e5d9c6a4a7cea34b91c2a4f9b547b816eca2f87c508467c0c3cbb1dc49d5d3cff0835bb577170ae255c0303abac95a270210bdad9e3d199eb5f0f38"' : 'data-target="#xs-directives-links-module-FakeRouterModule-9a1136bb3e5d9c6a4a7cea34b91c2a4f9b547b816eca2f87c508467c0c3cbb1dc49d5d3cff0835bb577170ae255c0303abac95a270210bdad9e3d199eb5f0f38"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-FakeRouterModule-9a1136bb3e5d9c6a4a7cea34b91c2a4f9b547b816eca2f87c508467c0c3cbb1dc49d5d3cff0835bb577170ae255c0303abac95a270210bdad9e3d199eb5f0f38"' :
                                        'id="xs-directives-links-module-FakeRouterModule-9a1136bb3e5d9c6a4a7cea34b91c2a4f9b547b816eca2f87c508467c0c3cbb1dc49d5d3cff0835bb577170ae255c0303abac95a270210bdad9e3d199eb5f0f38"' }>
                                        <li class="link">
                                            <a href="directives/RouterLinkStubDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RouterLinkStubDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FolioModule.html" data-type="entity-link" >FolioModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FolioModule-2ef139bcae69ef0f69d9daa36c47d807802a4dd2ec508fb60a260f30d5c85e766cfdce812601f3ecc027e2f2fe1c27e86ac41e2759e9c52d83b514af63cdf91f"' : 'data-target="#xs-components-links-module-FolioModule-2ef139bcae69ef0f69d9daa36c47d807802a4dd2ec508fb60a260f30d5c85e766cfdce812601f3ecc027e2f2fe1c27e86ac41e2759e9c52d83b514af63cdf91f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FolioModule-2ef139bcae69ef0f69d9daa36c47d807802a4dd2ec508fb60a260f30d5c85e766cfdce812601f3ecc027e2f2fe1c27e86ac41e2759e9c52d83b514af63cdf91f"' :
                                            'id="xs-components-links-module-FolioModule-2ef139bcae69ef0f69d9daa36c47d807802a4dd2ec508fb60a260f30d5c85e766cfdce812601f3ecc027e2f2fe1c27e86ac41e2759e9c52d83b514af63cdf91f"' }>
                                            <li class="link">
                                                <a href="components/FolioOverviewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FolioOverviewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FooterModule.html" data-type="entity-link" >FooterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FooterModule-6a3c4dce6ea86d6dbf06ee0876e6a55774c424cc4455b0c341e85d47b60e7438984a1d5a1bc8b5362bc51ca5366f4e46451378f6ead9f1f2220bf9581cecae28"' : 'data-target="#xs-components-links-module-FooterModule-6a3c4dce6ea86d6dbf06ee0876e6a55774c424cc4455b0c341e85d47b60e7438984a1d5a1bc8b5362bc51ca5366f4e46451378f6ead9f1f2220bf9581cecae28"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FooterModule-6a3c4dce6ea86d6dbf06ee0876e6a55774c424cc4455b0c341e85d47b60e7438984a1d5a1bc8b5362bc51ca5366f4e46451378f6ead9f1f2220bf9581cecae28"' :
                                            'id="xs-components-links-module-FooterModule-6a3c4dce6ea86d6dbf06ee0876e6a55774c424cc4455b0c341e85d47b60e7438984a1d5a1bc8b5362bc51ca5366f4e46451378f6ead9f1f2220bf9581cecae28"' }>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterCopyrightComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterDeclarationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterDeclarationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterLogoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterLogoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterPoweredbyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterPoweredbyComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GraphVisualizerModule.html" data-type="entity-link" >GraphVisualizerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' : 'data-target="#xs-components-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' :
                                            'id="xs-components-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' }>
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
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' : 'data-target="#xs-injectables-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' :
                                        'id="xs-injectables-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' }>
                                        <li class="link">
                                            <a href="injectables/GraphVisualizerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GraphVisualizerService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' : 'data-target="#xs-pipes-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' :
                                            'id="xs-pipes-links-module-GraphVisualizerModule-67c24f9d7f3fa074e241c1c7bc58a5c6d87339c7099db1e4ea991050ec14732f326a845a5f0cf5317b1fb575a63da015594497ede9b041249ae49827aaf8f90e"' }>
                                            <li class="link">
                                                <a href="pipes/PrefixPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrefixPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeViewModule.html" data-type="entity-link" >HomeViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HomeViewModule-87102b404d71b0dc518b3189fbb31544dc0bfdc6bf470a91778ff152d5e30c90b17162d59b33b21aca584a51e839fa9be0928dc8e4edff20614bb0542343af2c"' : 'data-target="#xs-components-links-module-HomeViewModule-87102b404d71b0dc518b3189fbb31544dc0bfdc6bf470a91778ff152d5e30c90b17162d59b33b21aca584a51e839fa9be0928dc8e4edff20614bb0542343af2c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomeViewModule-87102b404d71b0dc518b3189fbb31544dc0bfdc6bf470a91778ff152d5e30c90b17162d59b33b21aca584a51e839fa9be0928dc8e4edff20614bb0542343af2c"' :
                                            'id="xs-components-links-module-HomeViewModule-87102b404d71b0dc518b3189fbb31544dc0bfdc6bf470a91778ff152d5e30c90b17162d59b33b21aca584a51e839fa9be0928dc8e4edff20614bb0542343af2c"' }>
                                            <li class="link">
                                                <a href="components/HomeViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeViewRoutingModule.html" data-type="entity-link" >HomeViewRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PageNotFoundViewModule.html" data-type="entity-link" >PageNotFoundViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PageNotFoundViewModule-6fb441cf7af1fdd72b6b55fd648e7f28ee06124c8598d55c6c9b9039bc46df818a33697b39ade2423a89fade03bcd5aec04551c49b503bd066a2640ad50a3e4c"' : 'data-target="#xs-components-links-module-PageNotFoundViewModule-6fb441cf7af1fdd72b6b55fd648e7f28ee06124c8598d55c6c9b9039bc46df818a33697b39ade2423a89fade03bcd5aec04551c49b503bd066a2640ad50a3e4c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PageNotFoundViewModule-6fb441cf7af1fdd72b6b55fd648e7f28ee06124c8598d55c6c9b9039bc46df818a33697b39ade2423a89fade03bcd5aec04551c49b503bd066a2640ad50a3e4c"' :
                                            'id="xs-components-links-module-PageNotFoundViewModule-6fb441cf7af1fdd72b6b55fd648e7f28ee06124c8598d55c6c9b9039bc46df818a33697b39ade2423a89fade03bcd5aec04551c49b503bd066a2640ad50a3e4c"' }>
                                            <li class="link">
                                                <a href="components/PageNotFoundViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageNotFoundViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PageNotFoundViewRoutingModule.html" data-type="entity-link" >PageNotFoundViewRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ResourceDetailModule.html" data-type="entity-link" >ResourceDetailModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ResourceDetailModule-253f802c23e8769837a3f21b8f8b520bddeb6d4d572204735110f0f1612bbebf38df768007f8103de4ecec0a3294cf04347d4171b226a1e1ecc6c129e2179ced"' : 'data-target="#xs-components-links-module-ResourceDetailModule-253f802c23e8769837a3f21b8f8b520bddeb6d4d572204735110f0f1612bbebf38df768007f8103de4ecec0a3294cf04347d4171b226a1e1ecc6c129e2179ced"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ResourceDetailModule-253f802c23e8769837a3f21b8f8b520bddeb6d4d572204735110f0f1612bbebf38df768007f8103de4ecec0a3294cf04347d4171b226a1e1ecc6c129e2179ced"' :
                                            'id="xs-components-links-module-ResourceDetailModule-253f802c23e8769837a3f21b8f8b520bddeb6d4d572204735110f0f1612bbebf38df768007f8103de4ecec0a3294cf04347d4171b226a1e1ecc6c129e2179ced"' }>
                                            <li class="link">
                                                <a href="components/ResourceDetailHeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceDetailHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceDetailHtmlComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceDetailHtmlComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceDetailHtmlContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceDetailHtmlContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceDetailHtmlContentImageobjectsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceDetailHtmlContentImageobjectsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceDetailHtmlContentLinkedobjectsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceDetailHtmlContentLinkedobjectsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceDetailHtmlContentPropsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceDetailHtmlContentPropsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceDetailJsonConvertedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceDetailJsonConvertedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceDetailJsonRawComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceDetailJsonRawComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-588e6010ef1c421d178aa1a5876d40b050c52da40c416ee4ee9342c7d30e68762b5a03f9d82f74e4eb36f31231392443cbc24ad64472917e9798e6201b9147a4"' : 'data-target="#xs-components-links-module-SharedModule-588e6010ef1c421d178aa1a5876d40b050c52da40c416ee4ee9342c7d30e68762b5a03f9d82f74e4eb36f31231392443cbc24ad64472917e9798e6201b9147a4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-588e6010ef1c421d178aa1a5876d40b050c52da40c416ee4ee9342c7d30e68762b5a03f9d82f74e4eb36f31231392443cbc24ad64472917e9798e6201b9147a4"' :
                                            'id="xs-components-links-module-SharedModule-588e6010ef1c421d178aa1a5876d40b050c52da40c416ee4ee9342c7d30e68762b5a03f9d82f74e4eb36f31231392443cbc24ad64472917e9798e6201b9147a4"' }>
                                            <li class="link">
                                                <a href="components/AddressComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddressComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeadingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeadingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/JsonViewerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JsonViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OpenStreetMapComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OpenStreetMapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RouterLinkButtonGroupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RouterLinkButtonGroupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToastComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToastComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TwelveToneSpinnerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TwelveToneSpinnerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SharedModule-588e6010ef1c421d178aa1a5876d40b050c52da40c416ee4ee9342c7d30e68762b5a03f9d82f74e4eb36f31231392443cbc24ad64472917e9798e6201b9147a4"' : 'data-target="#xs-directives-links-module-SharedModule-588e6010ef1c421d178aa1a5876d40b050c52da40c416ee4ee9342c7d30e68762b5a03f9d82f74e4eb36f31231392443cbc24ad64472917e9798e6201b9147a4"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-588e6010ef1c421d178aa1a5876d40b050c52da40c416ee4ee9342c7d30e68762b5a03f9d82f74e4eb36f31231392443cbc24ad64472917e9798e6201b9147a4"' :
                                        'id="xs-directives-links-module-SharedModule-588e6010ef1c421d178aa1a5876d40b050c52da40c416ee4ee9342c7d30e68762b5a03f9d82f74e4eb36f31231392443cbc24ad64472917e9798e6201b9147a4"' }>
                                        <li class="link">
                                            <a href="directives/ExternalLinkDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExternalLinkDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedNgbootstrapModule.html" data-type="entity-link" >SharedNgbootstrapModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SideInfoModule.html" data-type="entity-link" >SideInfoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SideInfoModule-3701b167522b320f390dc0b46ddca2351bba53ea17c41d1ea9fe0af83995d4480427148c187ac570269b5baa93e6bc11f7daa01cfde9cd3ca5de102439e51537"' : 'data-target="#xs-components-links-module-SideInfoModule-3701b167522b320f390dc0b46ddca2351bba53ea17c41d1ea9fe0af83995d4480427148c187ac570269b5baa93e6bc11f7daa01cfde9cd3ca5de102439e51537"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SideInfoModule-3701b167522b320f390dc0b46ddca2351bba53ea17c41d1ea9fe0af83995d4480427148c187ac570269b5baa93e6bc11f7daa01cfde9cd3ca5de102439e51537"' :
                                            'id="xs-components-links-module-SideInfoModule-3701b167522b320f390dc0b46ddca2351bba53ea17c41d1ea9fe0af83995d4480427148c187ac570269b5baa93e6bc11f7daa01cfde9cd3ca5de102439e51537"' }>
                                            <li class="link">
                                                <a href="components/ContactInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditionInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditionInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StructureInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StructureInfoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SideInfoRoutingModule.html" data-type="entity-link" >SideInfoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SourcesModule.html" data-type="entity-link" >SourcesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SourcesModule-f9d3be9d62530c41b437f9b7c97842b301254a1ba71ed37ac7f4be7c87929f1f6a4e4ca648eac687f4bf635513dbb1d90cc606b05b92acc16ab922c83641fbc2"' : 'data-target="#xs-components-links-module-SourcesModule-f9d3be9d62530c41b437f9b7c97842b301254a1ba71ed37ac7f4be7c87929f1f6a4e4ca648eac687f4bf635513dbb1d90cc606b05b92acc16ab922c83641fbc2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SourcesModule-f9d3be9d62530c41b437f9b7c97842b301254a1ba71ed37ac7f4be7c87929f1f6a4e4ca648eac687f4bf635513dbb1d90cc606b05b92acc16ab922c83641fbc2"' :
                                            'id="xs-components-links-module-SourcesModule-f9d3be9d62530c41b437f9b7c97842b301254a1ba71ed37ac7f4be7c87929f1f6a4e4ca648eac687f4bf635513dbb1d90cc606b05b92acc16ab922c83641fbc2"' }>
                                            <li class="link">
                                                <a href="components/SourceDescriptionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceDescriptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourceEvaluationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceEvaluationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourceListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourceListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourcesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SourcesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StructureViewModule.html" data-type="entity-link" >StructureViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StructureViewModule-a6dba9f61520c8531f282a268711c072e40574126f3ec6fee6ba635c5d4fa022195ea3feca7cad9928d77f5251b8109edafb2c33378886736cc816e917d4062f"' : 'data-target="#xs-components-links-module-StructureViewModule-a6dba9f61520c8531f282a268711c072e40574126f3ec6fee6ba635c5d4fa022195ea3feca7cad9928d77f5251b8109edafb2c33378886736cc816e917d4062f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StructureViewModule-a6dba9f61520c8531f282a268711c072e40574126f3ec6fee6ba635c5d4fa022195ea3feca7cad9928d77f5251b8109edafb2c33378886736cc816e917d4062f"' :
                                            'id="xs-components-links-module-StructureViewModule-a6dba9f61520c8531f282a268711c072e40574126f3ec6fee6ba635c5d4fa022195ea3feca7cad9928d77f5251b8109edafb2c33378886736cc816e917d4062f"' }>
                                            <li class="link">
                                                <a href="components/StructureViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StructureViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StructureViewRoutingModule.html" data-type="entity-link" >StructureViewRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TextcriticsModule.html" data-type="entity-link" >TextcriticsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TextcriticsModule-a210f55d79306ec77b71197ceaa11c708777f07f36815137faac906584d2c7ab2dacd7cce3f8654ed2a14e5c4a392b9a88ac3997a21a24e1c0f910f28d5585ac"' : 'data-target="#xs-components-links-module-TextcriticsModule-a210f55d79306ec77b71197ceaa11c708777f07f36815137faac906584d2c7ab2dacd7cce3f8654ed2a14e5c4a392b9a88ac3997a21a24e1c0f910f28d5585ac"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TextcriticsModule-a210f55d79306ec77b71197ceaa11c708777f07f36815137faac906584d2c7ab2dacd7cce3f8654ed2a14e5c4a392b9a88ac3997a21a24e1c0f910f28d5585ac"' :
                                            'id="xs-components-links-module-TextcriticsModule-a210f55d79306ec77b71197ceaa11c708777f07f36815137faac906584d2c7ab2dacd7cce3f8654ed2a14e5c4a392b9a88ac3997a21a24e1c0f910f28d5585ac"' }>
                                            <li class="link">
                                                <a href="components/CriticsListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CriticsListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TextcriticsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TextcriticsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/CriticsListComponent.html" data-type="entity-link" >CriticsListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionAccoladeComponent.html" data-type="entity-link" >EditionAccoladeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionConvoluteComponent.html" data-type="entity-link" >EditionConvoluteComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSvgSheetComponent.html" data-type="entity-link" >EditionSvgSheetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSvgSheetNavComponent.html" data-type="entity-link" >EditionSvgSheetNavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceDescriptionComponent.html" data-type="entity-link" >SourceDescriptionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceEvaluationComponent.html" data-type="entity-link" >SourceEvaluationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceListComponent.html" data-type="entity-link" >SourceListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TimelineComponent.html" data-type="entity-link" >TimelineComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ApiRequest.html" data-type="entity-link" >ApiRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiServiceError.html" data-type="entity-link" >ApiServiceError</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiServiceResult.html" data-type="entity-link" >ApiServiceResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppConfig.html" data-type="entity-link" >AppConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/BasicResponseJson.html" data-type="entity-link" >BasicResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/BibEntry.html" data-type="entity-link" >BibEntry</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContextJson.html" data-type="entity-link" >ContextJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurrentResource.html" data-type="entity-link" >CurrentResource</a>
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
                                <a href="classes/EditionConstants.html" data-type="entity-link" >EditionConstants</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionResponsibilityStatement.html" data-type="entity-link" >EditionResponsibilityStatement</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionRoute.html" data-type="entity-link" >EditionRoute</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgOverlay.html" data-type="entity-link" >EditionSvgOverlay</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgSheet.html" data-type="entity-link" >EditionSvgSheet</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgSheetList.html" data-type="entity-link" >EditionSvgSheetList</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionTitleStatement.html" data-type="entity-link" >EditionTitleStatement</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionWork.html" data-type="entity-link" >EditionWork</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionWorks.html" data-type="entity-link" >EditionWorks</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExtResIdJson.html" data-type="entity-link" >ExtResIdJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/Folio.html" data-type="entity-link" >Folio</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculation.html" data-type="entity-link" >FolioCalculation</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationContentItem.html" data-type="entity-link" >FolioCalculationContentItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationContentItemCache.html" data-type="entity-link" >FolioCalculationContentItemCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationContentItemCornerPoints.html" data-type="entity-link" >FolioCalculationContentItemCornerPoints</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationLine.html" data-type="entity-link" >FolioCalculationLine</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationPoint.html" data-type="entity-link" >FolioCalculationPoint</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationSheet.html" data-type="entity-link" >FolioCalculationSheet</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioCalculationSystems.html" data-type="entity-link" >FolioCalculationSystems</a>
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
                                <a href="classes/FolioFormat.html" data-type="entity-link" >FolioFormat</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioSection.html" data-type="entity-link" >FolioSection</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioSettings.html" data-type="entity-link" >FolioSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioSvgContentItem.html" data-type="entity-link" >FolioSvgContentItem</a>
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
                                <a href="classes/GeoDataItemJson.html" data-type="entity-link" >GeoDataItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeoDataJson.html" data-type="entity-link" >GeoDataJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeoNames.html" data-type="entity-link" >GeoNames</a>
                            </li>
                            <li class="link">
                                <a href="classes/GndEvent.html" data-type="entity-link" >GndEvent</a>
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
                                <a href="classes/HlistItemJson.html" data-type="entity-link" >HlistItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/HlistJson.html" data-type="entity-link" >HlistJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpCache.html" data-type="entity-link" >HttpCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/IncomingItemJson.html" data-type="entity-link" >IncomingItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/Intro.html" data-type="entity-link" >Intro</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntroList.html" data-type="entity-link" >IntroList</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocationItemJson.html" data-type="entity-link" >LocationItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/Logo.html" data-type="entity-link" >Logo</a>
                            </li>
                            <li class="link">
                                <a href="classes/Logos.html" data-type="entity-link" >Logos</a>
                            </li>
                            <li class="link">
                                <a href="classes/Meta.html" data-type="entity-link" >Meta</a>
                            </li>
                            <li class="link">
                                <a href="classes/MetaContact.html" data-type="entity-link" >MetaContact</a>
                            </li>
                            <li class="link">
                                <a href="classes/MetaPage.html" data-type="entity-link" >MetaPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/MetaPerson.html" data-type="entity-link" >MetaPerson</a>
                            </li>
                            <li class="link">
                                <a href="classes/MetaStructure.html" data-type="entity-link" >MetaStructure</a>
                            </li>
                            <li class="link">
                                <a href="classes/NextResource.html" data-type="entity-link" >NextResource</a>
                            </li>
                            <li class="link">
                                <a href="classes/NodeItemJson.html" data-type="entity-link" >NodeItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatorOptions.html" data-type="entity-link" >PaginatorOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagingItemJson.html" data-type="entity-link" >PagingItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/PermissionItemJson.html" data-type="entity-link" >PermissionItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/Prefix.html" data-type="entity-link" >Prefix</a>
                            </li>
                            <li class="link">
                                <a href="classes/PreviousResource.html" data-type="entity-link" >PreviousResource</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectItemJson.html" data-type="entity-link" >ProjectItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectJson.html" data-type="entity-link" >ProjectJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectListJson.html" data-type="entity-link" >ProjectListJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropertyDefinitionJson.html" data-type="entity-link" >PropertyDefinitionJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropertyJson.html" data-type="entity-link" >PropertyJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropertyJsonValue.html" data-type="entity-link" >PropertyJsonValue</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropertyTypesInResourceClassResponseJson.html" data-type="entity-link" >PropertyTypesInResourceClassResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropItemForResTypeJson.html" data-type="entity-link" >PropItemForResTypeJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropJson.html" data-type="entity-link" >PropJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropvalJson.html" data-type="entity-link" >PropvalJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegionJson.html" data-type="entity-link" >RegionJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResdataJson.html" data-type="entity-link" >ResdataJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResinfoJson.html" data-type="entity-link" >ResinfoJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceContextResponseJson.html" data-type="entity-link" >ResourceContextResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceData.html" data-type="entity-link" >ResourceData</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceDetail.html" data-type="entity-link" >ResourceDetail</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceDetailContent.html" data-type="entity-link" >ResourceDetailContent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceDetailGroupedIncomingLinks.html" data-type="entity-link" >ResourceDetailGroupedIncomingLinks</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceDetailHeader.html" data-type="entity-link" >ResourceDetailHeader</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceDetailImage.html" data-type="entity-link" >ResourceDetailImage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceDetailIncomingLink.html" data-type="entity-link" >ResourceDetailIncomingLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceDetailProperty.html" data-type="entity-link" >ResourceDetailProperty</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceFullResponseJson.html" data-type="entity-link" >ResourceFullResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceInfo.html" data-type="entity-link" >ResourceInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceInfoResource.html" data-type="entity-link" >ResourceInfoResource</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceInfoResponseJson.html" data-type="entity-link" >ResourceInfoResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceLabelSearchItemJson.html" data-type="entity-link" >ResourceLabelSearchItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceLabelSearchResponseJson.html" data-type="entity-link" >ResourceLabelSearchResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourcePropertiesResponseJson.html" data-type="entity-link" >ResourcePropertiesResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceRightsResponseJson.html" data-type="entity-link" >ResourceRightsResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceTypeResponseJson.html" data-type="entity-link" >ResourceTypeResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceTypesInVocabularyResponseJson.html" data-type="entity-link" >ResourceTypesInVocabularyResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResTypeItemJson.html" data-type="entity-link" >ResTypeItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestypeJson.html" data-type="entity-link" >RestypeJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/RouterLinkButton.html" data-type="entity-link" >RouterLinkButton</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchInfo.html" data-type="entity-link" >SearchInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchParams.html" data-type="entity-link" >SearchParams</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchResponseJson.html" data-type="entity-link" >SearchResponseJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchResponseWithQuery.html" data-type="entity-link" >SearchResponseWithQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectionItemJson.html" data-type="entity-link" >SelectionItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectionJson.html" data-type="entity-link" >SelectionJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/SessionJson.html" data-type="entity-link" >SessionJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/Source.html" data-type="entity-link" >Source</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescription.html" data-type="entity-link" >SourceDescription</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceDescriptionList.html" data-type="entity-link" >SourceDescriptionList</a>
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
                                <a href="classes/SubjectItemJson.html" data-type="entity-link" >SubjectItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/TableData.html" data-type="entity-link" >TableData</a>
                            </li>
                            <li class="link">
                                <a href="classes/TableOptions.html" data-type="entity-link" >TableOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextcriticalComment.html" data-type="entity-link" >TextcriticalComment</a>
                            </li>
                            <li class="link">
                                <a href="classes/Textcritics.html" data-type="entity-link" >Textcritics</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextcriticsList.html" data-type="entity-link" >TextcriticsList</a>
                            </li>
                            <li class="link">
                                <a href="classes/ThumbMaxJson.html" data-type="entity-link" >ThumbMaxJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimelineDate.html" data-type="entity-link" >TimelineDate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Toast.html" data-type="entity-link" >Toast</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDataJson.html" data-type="entity-link" >UserDataJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/ViewBox.html" data-type="entity-link" >ViewBox</a>
                            </li>
                            <li class="link">
                                <a href="classes/VocabularyItemJson.html" data-type="entity-link" >VocabularyItemJson</a>
                            </li>
                            <li class="link">
                                <a href="classes/VocabularyResponseJson.html" data-type="entity-link" >VocabularyResponseJson</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AnalyticsService.html" data-type="entity-link" >AnalyticsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BibliographyService.html" data-type="entity-link" >BibliographyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConversionService.html" data-type="entity-link" >ConversionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CoreService.html" data-type="entity-link" >CoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/D3Service.html" data-type="entity-link" >D3Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataApiService.html" data-type="entity-link" >DataApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataStreamerService.html" data-type="entity-link" >DataStreamerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionDataService.html" data-type="entity-link" >EditionDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionService.html" data-type="entity-link" >EditionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FolioService.html" data-type="entity-link" >FolioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GndService.html" data-type="entity-link" >GndService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpCacheService.html" data-type="entity-link" >HttpCacheService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link" >LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SideInfoService.html" data-type="entity-link" >SideInfoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StorageService.html" data-type="entity-link" >StorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToastService.html" data-type="entity-link" >ToastService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/CachingInterceptor.html" data-type="entity-link" >CachingInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/LoadingInterceptor.html" data-type="entity-link" >LoadingInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CmConfig.html" data-type="entity-link" >CmConfig</a>
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
                                <a href="interfaces/Date.html" data-type="entity-link" >Date</a>
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
                                <a href="interfaces/IMockStorage.html" data-type="entity-link" >IMockStorage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMockWindow.html" data-type="entity-link" >IMockWindow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IndexedPropJson.html" data-type="entity-link" >IndexedPropJson</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Interval.html" data-type="entity-link" >Interval</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IResourceDataResponse.html" data-type="entity-link" >IResourceDataResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IResourceInfoResources.html" data-type="entity-link" >IResourceInfoResources</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Namespace.html" data-type="entity-link" >Namespace</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryResult.html" data-type="entity-link" >QueryResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryTypeIndex.html" data-type="entity-link" >QueryTypeIndex</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Richtext.html" data-type="entity-link" >Richtext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectResponse.html" data-type="entity-link" >SelectResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectResponseBindings.html" data-type="entity-link" >SelectResponseBindings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectResponseBody.html" data-type="entity-link" >SelectResponseBody</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectResponseHead.html" data-type="entity-link" >SelectResponseHead</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Triple.html" data-type="entity-link" >Triple</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TripleComponent.html" data-type="entity-link" >TripleComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
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
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});