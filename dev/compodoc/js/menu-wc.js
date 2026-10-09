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
                                            'data-bs-target="#components-links-module-AppModule-0eaf488906ca5dd6584087cdd70010d71867dad68ad032001f1efd76406d2be4eb749fcd52c5f91b24ca57db6b173e3499f8bb40a780748e51190a66a7fac646"' : 'data-bs-target="#xs-components-links-module-AppModule-0eaf488906ca5dd6584087cdd70010d71867dad68ad032001f1efd76406d2be4eb749fcd52c5f91b24ca57db6b173e3499f8bb40a780748e51190a66a7fac646"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-0eaf488906ca5dd6584087cdd70010d71867dad68ad032001f1efd76406d2be4eb749fcd52c5f91b24ca57db6b173e3499f8bb40a780748e51190a66a7fac646"' :
                                            'id="xs-components-links-module-AppModule-0eaf488906ca5dd6584087cdd70010d71867dad68ad032001f1efd76406d2be4eb749fcd52c5f91b24ca57db6b173e3499f8bb40a780748e51190a66a7fac646"' }>
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
                                <a href="components/CodeMirrorComponent.html" data-type="entity-link" >CodeMirrorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConditionalLinkComponent.html" data-type="entity-link" >ConditionalLinkComponent</a>
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
                                <a href="components/EditionComplexComponent.html" data-type="entity-link" >EditionComplexComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionComplexPlaceholderComponent.html" data-type="entity-link" >EditionComplexPlaceholderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionDetailNavComponent.html" data-type="entity-link" >EditionDetailNavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionDisclaimerWorkeditionsComponent.html" data-type="entity-link" >EditionDisclaimerWorkeditionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionFoliosLegendComponent.html" data-type="entity-link" >EditionFoliosLegendComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionFoliosPanelComponent.html" data-type="entity-link" >EditionFoliosPanelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionFoliosViewerComponent.html" data-type="entity-link" >EditionFoliosViewerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionFoliosViewerSvgComponent.html" data-type="entity-link" >EditionFoliosViewerSvgComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionGraphComponent.html" data-type="entity-link" >EditionGraphComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionGraphDescriptionComponent.html" data-type="entity-link" >EditionGraphDescriptionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionGraphDynamicComponent.html" data-type="entity-link" >EditionGraphDynamicComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionGraphStaticComponent.html" data-type="entity-link" >EditionGraphStaticComponent</a>
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
                                <a href="components/EditionSheetFacetComponent.html" data-type="entity-link" >EditionSheetFacetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSheetFacetGroupComponent.html" data-type="entity-link" >EditionSheetFacetGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSheetFacetItemComponent.html" data-type="entity-link" >EditionSheetFacetItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSheetFacetToggleComponent.html" data-type="entity-link" >EditionSheetFacetToggleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSheetFooterComponent.html" data-type="entity-link" >EditionSheetFooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSheetsComponent.html" data-type="entity-link" >EditionSheetsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSheetsPanelComponent.html" data-type="entity-link" >EditionSheetsPanelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSheetViewerAdditionsPanelComponent.html" data-type="entity-link" >EditionSheetViewerAdditionsPanelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSheetViewerComponent.html" data-type="entity-link" >EditionSheetViewerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSheetViewerNavComponent.html" data-type="entity-link" >EditionSheetViewerNavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSheetViewerSvgComponent.html" data-type="entity-link" >EditionSheetViewerSvgComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditionSideInfoComponent.html" data-type="entity-link" >EditionSideInfoComponent</a>
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
                                <a href="components/ExampleQueriesComponent.html" data-type="entity-link" >ExampleQueriesComponent</a>
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
                                <a href="components/ForceGraphLimitComponent.html" data-type="entity-link" >ForceGraphLimitComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ForceGraphSvgComponent.html" data-type="entity-link" >ForceGraphSvgComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormSwitchComponent.html" data-type="entity-link" >FormSwitchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FullscreenToggleComponent.html" data-type="entity-link" >FullscreenToggleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraphEditorActionButtonsComponent.html" data-type="entity-link" >GraphEditorActionButtonsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraphEditorSparqlComponent.html" data-type="entity-link" >GraphEditorSparqlComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraphEditorTriplesComponent.html" data-type="entity-link" >GraphEditorTriplesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraphResultsConstructComponent.html" data-type="entity-link" >GraphResultsConstructComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraphResultsEmptyComponent.html" data-type="entity-link" >GraphResultsEmptyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraphResultsSelectComponent.html" data-type="entity-link" >GraphResultsSelectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraphResultsStatusComponent.html" data-type="entity-link" >GraphResultsStatusComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraphResultsUnsupportedComponent.html" data-type="entity-link" >GraphResultsUnsupportedComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraphVisualizerComponent.html" data-type="entity-link" >GraphVisualizerComponent</a>
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
                                <a href="components/JsonViewerComponent.html" data-type="entity-link" >JsonViewerComponent</a>
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
                                <a href="components/NavLinkGroupComponent.html" data-type="entity-link" >NavLinkGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PageNotFoundViewComponent.html" data-type="entity-link" >PageNotFoundViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SelectTableComponent.html" data-type="entity-link" >SelectTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SliderZoomComponent.html" data-type="entity-link" >SliderZoomComponent</a>
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
                                <a href="components/SourceListComponent.html" data-type="entity-link" >SourceListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourceSiglumComponent.html" data-type="entity-link" >SourceSiglumComponent</a>
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
                                <a href="components/TableComponent.html" data-type="entity-link" >TableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TablePaginationComponent.html" data-type="entity-link" >TablePaginationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TextcriticsListComponent.html" data-type="entity-link" >TextcriticsListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ToastComponent.html" data-type="entity-link" >ToastComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TwelveToneSpinnerComponent.html" data-type="entity-link" >TwelveToneSpinnerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UsageHintsComponent.html" data-type="entity-link" >UsageHintsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewContainerComponent.html" data-type="entity-link" >ViewContainerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewHandleButtonGroupComponent.html" data-type="entity-link" >ViewHandleButtonGroupComponent</a>
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
                                    <a href="directives/ClickDirective.html" data-type="entity-link" >ClickDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/CompileHtmlDirective.html" data-type="entity-link" >CompileHtmlDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/EditionIntroScrollDirective.html" data-type="entity-link" >EditionIntroScrollDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/EditionSheetFacetItemLinkDirective.html" data-type="entity-link" >EditionSheetFacetItemLinkDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/EditionSheetFacetScrollDirective.html" data-type="entity-link" >EditionSheetFacetScrollDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/ExternalLinkDirective.html" data-type="entity-link" >ExternalLinkDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/SvgZoomDirective.html" data-type="entity-link" >SvgZoomDirective</a>
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
                                <a href="classes/EditionSvgSheet.html" data-type="entity-link" >EditionSvgSheet</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditionSvgSheetsList.html" data-type="entity-link" >EditionSvgSheetsList</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioConvolute.html" data-type="entity-link" >FolioConvolute</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolioConvoluteList.html" data-type="entity-link" >FolioConvoluteList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Graph.html" data-type="entity-link" >Graph</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphList.html" data-type="entity-link" >GraphList</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQuery.html" data-type="entity-link" >GraphQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphRdfData.html" data-type="entity-link" >GraphRdfData</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntroList.html" data-type="entity-link" >IntroList</a>
                            </li>
                            <li class="link">
                                <a href="classes/NavLink.html" data-type="entity-link" >NavLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrefaceList.html" data-type="entity-link" >PrefaceList</a>
                            </li>
                            <li class="link">
                                <a href="classes/RowtablesList.html" data-type="entity-link" >RowtablesList</a>
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
                            <li class="link">
                                <a href="classes/ZoomConfig.html" data-type="entity-link" >ZoomConfig</a>
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
                                    <a href="injectables/EditionBreadcrumbService.html" data-type="entity-link" >EditionBreadcrumbService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionComplexesService.html" data-type="entity-link" >EditionComplexesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionDataService.html" data-type="entity-link" >EditionDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionFolioDrawingService.html" data-type="entity-link" >EditionFolioDrawingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionFolioSegmentService.html" data-type="entity-link" >EditionFolioSegmentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionGlyphService.html" data-type="entity-link" >EditionGlyphService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionModalService.html" data-type="entity-link" >EditionModalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionNavigationService.html" data-type="entity-link" >EditionNavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditionOutlineService.html" data-type="entity-link" >EditionOutlineService</a>
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
                                    <a href="injectables/ForceGraphDrawingService.html" data-type="entity-link" >ForceGraphDrawingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FullscreenService.html" data-type="entity-link" >FullscreenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link" >LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModalService.html" data-type="entity-link" >ModalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RdfStoreService.html" data-type="entity-link" >RdfStoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SparqlQueryService.html" data-type="entity-link" >SparqlQueryService</a>
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
                                <a href="interfaces/D3Selection.html" data-type="entity-link" >D3Selection</a>
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
                                <a href="interfaces/EditionNavigationFragmentTarget.html" data-type="entity-link" >EditionNavigationFragmentTarget</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionNavigationSheetTarget.html" data-type="entity-link" >EditionNavigationSheetTarget</a>
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
                                <a href="interfaces/EditionSheetFacetPartialLink.html" data-type="entity-link" >EditionSheetFacetPartialLink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSheetFacetVisibleRange.html" data-type="entity-link" >EditionSheetFacetVisibleRange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSheetViewerAdditionsPanelChange.html" data-type="entity-link" >EditionSheetViewerAdditionsPanelChange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSvgLinkBox.html" data-type="entity-link" >EditionSvgLinkBox</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSvgOverlayLinkBox.html" data-type="entity-link" >EditionSvgOverlayLinkBox</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSvgOverlaysState.html" data-type="entity-link" >EditionSvgOverlaysState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSvgOverlayTkk.html" data-type="entity-link" >EditionSvgOverlayTkk</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSvgSheetContent.html" data-type="entity-link" >EditionSvgSheetContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSvgSheetContext.html" data-type="entity-link" >EditionSvgSheetContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionSvgSheetSelection.html" data-type="entity-link" >EditionSvgSheetSelection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionViewData.html" data-type="entity-link" >EditionViewData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditionViewDataTypeMapping.html" data-type="entity-link" >EditionViewDataTypeMapping</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExpandAllState.html" data-type="entity-link" >ExpandAllState</a>
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
                                <a href="interfaces/FolioLegend.html" data-type="entity-link" >FolioLegend</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSegment.html" data-type="entity-link" >FolioSegment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSettings.html" data-type="entity-link" >FolioSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSvgContentSegment.html" data-type="entity-link" >FolioSvgContentSegment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSvgData.html" data-type="entity-link" >FolioSvgData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSvgLine.html" data-type="entity-link" >FolioSvgLine</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSvgPoint.html" data-type="entity-link" >FolioSvgPoint</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSvgRectangle.html" data-type="entity-link" >FolioSvgRectangle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSvgSheet.html" data-type="entity-link" >FolioSvgSheet</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSvgSystems.html" data-type="entity-link" >FolioSvgSystems</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FolioSystemsLayout.html" data-type="entity-link" >FolioSystemsLayout</a>
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
                                <a href="interfaces/NavbarItem.html" data-type="entity-link" >NavbarItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NavbarItems.html" data-type="entity-link" >NavbarItems</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Point.html" data-type="entity-link" >Point</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Preface.html" data-type="entity-link" >Preface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryTypeConversion.html" data-type="entity-link" >QueryTypeConversion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RdfStore.html" data-type="entity-link" >RdfStore</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RdfStoreConstructResponse.html" data-type="entity-link" >RdfStoreConstructResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RdfStoreGlobal.html" data-type="entity-link" >RdfStoreGlobal</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RdfStoreNode.html" data-type="entity-link" >RdfStoreNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RdfStoreSelectResult.html" data-type="entity-link" >RdfStoreSelectResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RdfStoreToken.html" data-type="entity-link" >RdfStoreToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RdfStoreTriple.html" data-type="entity-link" >RdfStoreTriple</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResultGraph.html" data-type="entity-link" >ResultGraph</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResultGraphEdge.html" data-type="entity-link" >ResultGraphEdge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResultGraphNode.html" data-type="entity-link" >ResultGraphNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResultGraphNodeDraft.html" data-type="entity-link" >ResultGraphNodeDraft</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Rowtables.html" data-type="entity-link" >Rowtables</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectTableCell.html" data-type="entity-link" >SelectTableCell</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SimEdge.html" data-type="entity-link" >SimEdge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SimNode.html" data-type="entity-link" >SimNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SimulationData.html" data-type="entity-link" >SimulationData</a>
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
                                <a href="interfaces/SparqlConstructResult.html" data-type="entity-link" >SparqlConstructResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SparqlQueryRun.html" data-type="entity-link" >SparqlQueryRun</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SparqlSelectResult.html" data-type="entity-link" >SparqlSelectResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SparqlUnsupportedResult.html" data-type="entity-link" >SparqlUnsupportedResult</a>
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
                                <a href="interfaces/SvgSize.html" data-type="entity-link" >SvgSize</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableRows.html" data-type="entity-link" >TableRows</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableSortState.html" data-type="entity-link" >TableSortState</a>
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
                                <a href="interfaces/TurtleParseResult.html" data-type="entity-link" >TurtleParseResult</a>
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