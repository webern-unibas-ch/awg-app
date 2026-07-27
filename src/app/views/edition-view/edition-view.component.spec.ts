import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { Component, DebugElement, DOCUMENT, Input, isSignal, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective, RouterOutletStubComponent } from '@testing/router-stubs';

import { MetaIdentifiers } from '@awg-shared/meta/meta.model';

import { EDITION_ROUTE_CONSTANTS } from './edition-routes.constants';
import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from './models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from './services';

import { EditionViewComponent } from './edition-view.component';

registerLocaleData(localeDeDE);

// Mock components
@Component({
    selector: 'awg-edition-jumbotron',
    template: '',
    standalone: false,
})
class EditionJumbotronStubComponent {
    @Input()
    jumbotronId: string;
    @Input()
    jumbotronTitle: string;
}

@Component({
    selector: 'awg-scroll-to-top-button',
    template: '',
})
class ScrollToTopButtonStubComponent {}

@Component({
    selector: 'awg-meta-identifier-badges',
    template: '',
    standalone: false,
})
class MetaIdentifierBadgesStubComponent {
    @Input()
    identifiers: MetaIdentifiers | undefined;
}

describe('EditionViewComponent (DONE)', () => {
    let component: EditionViewComponent;
    let fixture: ComponentFixture<EditionViewComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let editionComplexesService: EditionComplexesService;
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let expectedSelectedEditionComplexId: string;
    let expectedSelectedEditionComplex: EditionComplex;
    let expectedSelectedEditionSeries: EditionOutlineSeries;
    let expectedSelectedEditionSection: EditionOutlineSection;

    const expectedTitle = 'Editionsübersicht';
    const expectedId = 'awg-edition-view';
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                EditionViewComponent,
                EditionJumbotronStubComponent,
                MetaIdentifierBadgesStubComponent,
                RouterOutletStubComponent,
                RouterLinkStubDirective,
            ],
            imports: [DatePipe, ScrollToTopButtonStubComponent],
            providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);
        mockDocument = TestBed.inject(DOCUMENT);

        // Init edition data
        editionComplexesService.initializeEditionComplexesList();
        editionOutlineService.initializeEditionOutline();

        // Test data
        expectedSelectedEditionComplexId = 'op12';
        expectedSelectedEditionComplex = editionComplexesService.getEditionComplexById(
            expectedSelectedEditionComplexId
        );
        expectedSelectedEditionSeries = editionOutlineService.editionOutline()[0]; // Series 1
        expectedSelectedEditionSection = expectedSelectedEditionSeries.sections[4]; // Section 5

        // Create component fixture
        fixture = TestBed.createComponent(EditionViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `id` and `title`', () => {
            expectToBe(component.EDITION_VIEW_ID, expectedId);
            expectToBe(component.EDITION_VIEW_TITLE, expectedTitle);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should have signal `isIntroView` to hold false', () => {
            expectToBe(isSignal(component.isIntroView), true);

            expectToBe(component.isIntroView(), false);
        });

        it('... should have signal `isPrefaceView` to hold false', () => {
            expectToBe(isSignal(component.isPrefaceView), true);

            expectToBe(component.isPrefaceView(), false);
        });

        it('... should have signal `isRowtablesView` to hold false', () => {
            expectToBe(isSignal(component.isRowtablesView), true);

            expectToBe(component.isRowtablesView(), false);
        });

        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have signal `selectedEditionSection` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionSection), true);

            expectToBe(component.selectedEditionSection(), null);
        });

        it('... should have signal `selectedEditionSeries` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionSeries), true);

            expectToBe(component.selectedEditionSeries(), null);
        });

        describe('VIEW', () => {
            const getEditionViewDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-view', 1, 1);

            it('... should contain one `div.awg-edition-view`', () => {
                getEditionViewDes();
            });

            it('... should contain one ScrollToTop component (stubbed) in `div.awg-edition-view`', () => {
                getAndExpectDebugElementByDirective(getEditionViewDes()[0], ScrollToTopButtonStubComponent, 1, 1);
            });

            describe('... should contain no sub-components yet', () => {
                it.each([
                    { desc: '`div.awg-edition-rowtables`', selector: 'div.awg-edition-rowtables' },
                    { desc: '`div.awg-edition-complex`', selector: 'div.awg-edition-complex' },
                    { desc: '`div.awg-edition-series`', selector: 'div.awg-edition-series' },
                ])('... should contain no $desc in `div.awg-edition-view` yet', ({ selector }) => {
                    getAndExpectDebugElementByCss(getEditionViewDes()[0], selector, 0, 0);
                });
            });

            it('... should contain one router outlet (stubbed) in `div.awg-edition-view`', () => {
                getAndExpectDebugElementByDirective(getEditionViewDes()[0], RouterOutletStubComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            vi.useFakeTimers();

            // Trigger initial data binding
            fixture.detectChanges();
        });

        afterEach(() => {
            vi.clearAllTimers();
            vi.useRealTimers();
        });

        describe('VIEW', () => {
            const getEditionViewDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-view', 1, 1);
            const getPrefaceDes = () =>
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-preface', 1, 1);
            const getRowtableDes = () =>
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-rowtables', 1, 1);
            const getComplexDes = () =>
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-complex', 1, 1);
            const getSeriesDes = () =>
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-series', 1, 1);

            describe('... if isPrefaceView is true', () => {
                beforeEach(() => {
                    editionStateService.updateIsPrefaceView(true);

                    // Trigger data binding
                    fixture.detectChanges();
                });

                it('... should have signal `isPrefaceView` to hold true', () => {
                    expectToBe(component.isPrefaceView(), true);
                });

                it('... should have one `div.awg-edition-preface` in `div.awg-edition-view`', () => {
                    getPrefaceDes();
                });

                it('... should have an h6 (breadcrumb) and a JumbotronComponent (stubbed) in `div.awg-edition-preface`', () => {
                    const prefaceDes = getPrefaceDes();

                    getAndExpectDebugElementByCss(prefaceDes[0], 'h6.awg-edition-info-breadcrumb', 1, 1);
                    getAndExpectDebugElementByDirective(prefaceDes[0], EditionJumbotronStubComponent, 1, 1);
                });

                it('... should display edition base root (AWG) and heading title in breadcrumb header (h6)', () => {
                    const hDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-preface > h6.awg-edition-info-breadcrumb',
                        1,
                        1
                    );
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;
                    const expectedBreadCrumb = `${expectedEditionRouteConstants.EDITION.short} / ${expectedEditionRouteConstants.PREFACE.short}`;

                    expectToBe(hEl.textContent?.replace(/\s+/g, ' ').trim(), expectedBreadCrumb);
                });

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', () => {
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        getPrefaceDes()[0],
                        EditionJumbotronStubComponent,
                        1,
                        1
                    );
                    const jumbotronCmp = jumbotronDes[0].injector.get(
                        EditionJumbotronStubComponent
                    ) as EditionJumbotronStubComponent;

                    expectToBe(jumbotronCmp.jumbotronId, expectedId);
                    expectToBe(jumbotronCmp.jumbotronTitle, expectedEditionRouteConstants.PREFACE.full);
                });
            });

            describe('... if isRowtablesView is true', () => {
                beforeEach(() => {
                    editionStateService.updateIsRowtablesView(true);

                    // Trigger data binding
                    fixture.detectChanges();
                });

                it('... should have signal `isRowtablesView` to hold true', () => {
                    expectToBe(component.isRowtablesView(), true);
                });

                it('... should have one `div.awg-edition-rowtables` in `div.awg-edition-view`', () => {
                    getRowtableDes();
                });

                it('... should have an h6 (breadcrumb) and a JumbotronComponent (stubbed) in `div.awg-edition-rowtables`', () => {
                    const rowtableDes = getRowtableDes();

                    getAndExpectDebugElementByCss(rowtableDes[0], 'h6.awg-edition-info-breadcrumb', 1, 1);

                    getAndExpectDebugElementByDirective(rowtableDes[0], EditionJumbotronStubComponent, 1, 1);
                });

                it('... should display edition base root (AWG) and heading title in breadcrumb header (h6)', () => {
                    const hDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-rowtables > h6.awg-edition-info-breadcrumb',
                        1,
                        1
                    );
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;
                    const expectedBreadCrumb = `${expectedEditionRouteConstants.EDITION.short} / ${expectedEditionRouteConstants.ROWTABLES.full}`;

                    expectToBe(hEl.textContent?.replace(/\s+/g, ' ').trim(), expectedBreadCrumb);
                });

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', () => {
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        getRowtableDes()[0],
                        EditionJumbotronStubComponent,
                        1,
                        1
                    );
                    const jumbotronCmp = jumbotronDes[0].injector.get(
                        EditionJumbotronStubComponent
                    ) as EditionJumbotronStubComponent;

                    expectToBe(jumbotronCmp.jumbotronId, expectedId);
                    expectToBe(jumbotronCmp.jumbotronTitle, 'Übersicht');
                });
            });

            describe('... if selectedEditionComplex is given', () => {
                const renderSelectedEditionComplex = (complex: EditionComplex): void => {
                    editionStateService.updateSelectedEditionComplex(complex);

                    fixture.detectChanges();
                };

                it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
                    renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    expectToBe(component.selectedEditionComplex(), expectedSelectedEditionComplex);
                });

                it('... should have one `div.awg-edition-complex` in `div.awg-edition-view`', () => {
                    renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    getComplexDes();
                });

                it('... should have an h6 (breadcrumb), a JumbotronComponent (stubbed) and a responsibility div in `div.awg-edition-complex`', () => {
                    renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    const complexDes = getComplexDes();

                    getAndExpectDebugElementByCss(complexDes[0], 'h6.awg-edition-info-breadcrumb', 1, 1);
                    getAndExpectDebugElementByDirective(complexDes[0], EditionJumbotronStubComponent, 1, 1);
                    getAndExpectDebugElementByCss(complexDes[0], 'div.awg-edition-responsibility', 1, 1);
                });

                it('... should display edition complex in breadcrumb header (h6)', () => {
                    renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    const hDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-complex > h6.awg-edition-info-breadcrumb',
                        1,
                        1
                    );
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                    const series = expectedSelectedEditionComplex.pubStatement.series.full;
                    const section = expectedSelectedEditionComplex.pubStatement.section.full;

                    // Handle non-breaking space by converting HTML to text
                    const complex = expectedSelectedEditionComplex.complexId.short;
                    const complexHtml = mockDocument.createElement('span');
                    complexHtml.innerHTML = complex;
                    const complexText = complexHtml.textContent?.replace(/\s+/g, ' ').trim();

                    const expectedBreadCrumb = `${awg} / ${series} / ${section} / ${complexText}`;

                    expectToBe(hEl.textContent?.replace(/\s+/g, ' ').trim(), expectedBreadCrumb);
                });

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', () => {
                    renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    // Get debug and native element of JumbotronComponent
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        getComplexDes()[0],
                        EditionJumbotronStubComponent,
                        1,
                        1
                    );
                    const jumbotronCmp = jumbotronDes[0].injector.get(
                        EditionJumbotronStubComponent
                    ) as EditionJumbotronStubComponent;

                    expectToBe(jumbotronCmp.jumbotronId, expectedId);
                    expectToBe(jumbotronCmp.jumbotronTitle, expectedSelectedEditionComplex.complexId.full);
                });

                it('... should have one paragraph with editor and version in responsibility div', () => {
                    renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const editors = expectedSelectedEditionComplex.respStatement.editors;

                    getAndExpectDebugElementByCss(pDes[0], 'span.editor', editors.length, editors.length);
                    getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                });

                it('... should display editor link and version in responsibility div', () => {
                    renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const expectedEditors = expectedSelectedEditionComplex.respStatement.editors;
                    const editorLinkDes = getAndExpectDebugElementByCss(
                        pDes[0],
                        'span.editor > a',
                        expectedEditors.length,
                        expectedEditors.length
                    );
                    const versionSpanDes = getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);

                    const editorLinkEls: HTMLAnchorElement[] = editorLinkDes.map(editor => editor.nativeElement);
                    const versionSpanEl: HTMLSpanElement = versionSpanDes[0].nativeElement;

                    editorLinkEls.forEach((editorLinkEl, i: number) => {
                        expectToBe(editorLinkEl.href, expectedEditors[i].homepage);

                        expectToBe(editorLinkEl.textContent?.trim(), expectedEditors[i].name);
                    });

                    const datePipe = new DatePipe('de-DE');
                    const expectedLastModified = datePipe.transform(
                        expectedSelectedEditionComplex.respStatement.lastModified,
                        'longDate'
                    );
                    expectToBe(versionSpanEl.textContent?.trim(), expectedLastModified);
                });

                it('... should display "---" in span.version without applying DatePipe when lastModified is "---"', () => {
                    const expectedComplexWithDash = editionComplexesService.getEditionComplexById('m212');
                    renderSelectedEditionComplex(expectedComplexWithDash);

                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);
                    const versionSpanDes = getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                    const versionSpanEl: HTMLSpanElement = versionSpanDes[0].nativeElement;

                    expectToBe(versionSpanEl.textContent?.trim(), '---');
                });

                it('... should have one MetaIdentifierBadgesComponent for each editor', () => {
                    renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    const expectedEditors = expectedSelectedEditionComplex.respStatement.editors;

                    const badgeDes = getAndExpectDebugElementByDirective(
                        compDe,
                        MetaIdentifierBadgesStubComponent,
                        expectedEditors.length,
                        expectedEditors.length
                    );
                    const badgeCmps = badgeDes.map(de => de.injector.get(MetaIdentifierBadgesStubComponent));

                    expectToEqual(badgeCmps.length, expectedEditors.length);
                });

                it('... should pass identifiers to MetaIdentifierBadgesComponent for each editor', () => {
                    renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    const expectedEditors = expectedSelectedEditionComplex.respStatement.editors;

                    const badgeDes = getAndExpectDebugElementByDirective(
                        compDe,
                        MetaIdentifierBadgesStubComponent,
                        expectedEditors.length,
                        expectedEditors.length
                    );
                    const badgeCmps = badgeDes.map(de => de.injector.get(MetaIdentifierBadgesStubComponent));

                    badgeCmps.forEach((badgeCmp, i: number) => {
                        expectToEqual(badgeCmp.identifiers, expectedEditors[i].identifiers);
                    });
                });
            });

            describe('... if selectedEditionComplex, isPrefaceView and isRowtablesView are not given', () => {
                beforeEach(() => {
                    editionStateService.updateSelectedEditionComplex(null);
                    editionStateService.updateIsPrefaceView(false);
                    editionStateService.updateIsRowtablesView(false);

                    editionStateService.updateIsIntroView(false);
                    editionStateService.updateSelectedEditionSeries(null);
                    editionStateService.updateSelectedEditionSection(null);

                    fixture.detectChanges();
                });

                it('... should have signals to hold expected values', () => {
                    expectToBe(component.isIntroView(), false);
                    expectToBe(component.isPrefaceView(), false);
                    expectToBe(component.isRowtablesView(), false);

                    expectToBe(component.selectedEditionComplex(), null);
                    expectToBe(component.selectedEditionSeries(), null);
                    expectToBe(component.selectedEditionSection(), null);
                });

                describe('... should contain no view-specific-components', () => {
                    it.each([
                        { desc: '`div.awg-edition-preface`', selector: 'div.awg-edition-preface' },
                        { desc: '`div.awg-edition-rowtables`', selector: 'div.awg-edition-rowtables' },
                        { desc: '`div.awg-edition-complex`', selector: 'div.awg-edition-complex' },
                    ])('... should contain no $desc in `div.awg-edition-view`', ({ selector }) => {
                        getAndExpectDebugElementByCss(getEditionViewDes()[0], selector, 0, 0);
                    });
                });

                it('... should have one `div.awg-edition-series` in `div.awg-edition-view`', () => {
                    getSeriesDes();
                });

                it('... should have an h6 (breadcrumb) and a JumbotronComponent (stubbed) in `div.awg-edition-series`', () => {
                    const seriesDes = getSeriesDes();

                    getAndExpectDebugElementByCss(seriesDes[0], 'h6.awg-edition-info-breadcrumb', 1, 1);
                    getAndExpectDebugElementByDirective(seriesDes[0], EditionJumbotronStubComponent, 1, 1);
                });

                it('... should pass down `editionViewId` and `editionViewTitle` to JumbotronComponent (stubbed)', () => {
                    // Get debug and native element of JumbotronComponent
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        getSeriesDes()[0],
                        EditionJumbotronStubComponent,
                        1,
                        1
                    );
                    const jumbotronCmp = jumbotronDes[0].injector.get(
                        EditionJumbotronStubComponent
                    ) as EditionJumbotronStubComponent;

                    expectToBe(jumbotronCmp.jumbotronId, expectedId);
                    expectToBe(jumbotronCmp.jumbotronTitle, expectedTitle);
                });

                it('... should pass down full edition intro const as title to JumbotronComponent (stubbed) if `isIntroView=true`', () => {
                    editionStateService.updateIsIntroView(true);

                    // Trigger data binding
                    fixture.detectChanges();

                    // Get debug and native element of JumbotronComponent
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        getSeriesDes()[0],
                        EditionJumbotronStubComponent,
                        1,
                        1
                    );
                    const jumbotronCmp = jumbotronDes[0].injector.get(
                        EditionJumbotronStubComponent
                    ) as EditionJumbotronStubComponent;

                    expectToBe(jumbotronCmp.jumbotronId, expectedId);
                    expectToBe(jumbotronCmp.jumbotronTitle, EDITION_ROUTE_CONSTANTS.EDITION_INTRO.full);
                });

                describe('... breadcrumb header (h6)', () => {
                    describe('... if no series and section is given', () => {
                        beforeEach(() => {
                            editionStateService.updateSelectedEditionSeries(null);
                            // Section automatically set to null if no series is given

                            fixture.detectChanges();
                        });

                        it('... should display edition base root (AWG)', () => {
                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                            const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                            const expectedBreadCrumb = `${awg} /`;

                            expectToBe(hEl.textContent?.replace(/\s+/g, ' ').trim(), expectedBreadCrumb);
                        });

                        it('... should have no back link to edition series overview', async () => {
                            const expectedLinkLength = 0;

                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            getAndExpectDebugElementByCss(hDes[0], 'a', expectedLinkLength, expectedLinkLength);
                        });
                    });

                    describe('... if series, but no section is given', () => {
                        beforeEach(() => {
                            editionStateService.updateSelectedEditionSeries(expectedSelectedEditionSeries);
                            editionStateService.updateSelectedEditionSection(null);

                            fixture.detectChanges();
                        });

                        it('... should display edition series', () => {
                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                            const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                            const series = expectedSelectedEditionComplex.pubStatement.series.full;
                            const expectedBreadCrumb = `${awg} / ${series} /`;

                            expectToBe(hEl.textContent?.replace(/\s+/g, ' ').trim(), expectedBreadCrumb);
                        });

                        it('... should have a back link to edition series overview', () => {
                            const expectedLinkLength = 1;

                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            getAndExpectDebugElementByCss(hDes[0], 'a', expectedLinkLength, expectedLinkLength);
                            const linkDes = getAndExpectDebugElementByDirective(
                                hDes[0],
                                RouterLinkStubDirective,
                                expectedLinkLength,
                                expectedLinkLength
                            );
                            const routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
                            const expectedRoute = EDITION_ROUTE_CONSTANTS.SERIES.route;

                            expectToBe(routerLinks.length, expectedLinkLength);
                            expectToEqual(routerLinks[0].linkParams, [expectedRoute]);
                        });
                    });

                    describe('... if series and section are given', () => {
                        beforeEach(() => {
                            editionStateService.updateSelectedEditionSeries(expectedSelectedEditionSeries);
                            editionStateService.updateSelectedEditionSection(expectedSelectedEditionSection);

                            fixture.detectChanges();
                        });

                        it('... should display edition series and section', () => {
                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                            const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                            const series = expectedSelectedEditionComplex.pubStatement.series.full;
                            const section = expectedSelectedEditionComplex.pubStatement.section.full;
                            const expectedBreadCrumb = `${awg} / ${series} / ${section}`;

                            expectToBe(hEl.textContent?.replace(/\s+/g, ' ').trim(), expectedBreadCrumb);
                        });

                        it('... should have two back links to series overview and current edition series', () => {
                            const expectedLinkLength = 2;

                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            getAndExpectDebugElementByCss(hDes[0], 'a', expectedLinkLength, expectedLinkLength);
                            const linkDes = getAndExpectDebugElementByDirective(
                                hDes[0],
                                RouterLinkStubDirective,
                                expectedLinkLength,
                                expectedLinkLength
                            );
                            const routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
                            const expectedSeriesRoute = EDITION_ROUTE_CONSTANTS.SERIES.route;
                            const expectedSeriesNumberRoute = expectedSelectedEditionSeries.series.route;

                            expectToBe(routerLinks.length, expectedLinkLength);
                            expectToEqual(routerLinks[0].linkParams, [expectedSeriesRoute]);
                            expectToEqual(routerLinks[1].linkParams, [
                                './' + expectedSeriesRoute,
                                expectedSeriesNumberRoute,
                            ]);
                        });
                    });

                    describe('... if series, section, and isIntroView is given', () => {
                        beforeEach(() => {
                            editionStateService.updateSelectedEditionSeries(expectedSelectedEditionSeries);
                            editionStateService.updateSelectedEditionSection(expectedSelectedEditionSection);
                            editionStateService.updateIsIntroView(true);

                            fixture.detectChanges();
                        });

                        it('... should display edition series, section and intro heading', () => {
                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                            const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                            const series = expectedSelectedEditionComplex.pubStatement.series.full;
                            const section = expectedSelectedEditionComplex.pubStatement.section.full;
                            const intro = EDITION_ROUTE_CONSTANTS.EDITION_INTRO.full.replace(/\u00A0/g, ' ');
                            const expectedBreadCrumb = `${awg} / ${series} / ${section} / ${intro}`;

                            expectToBe(hEl.textContent?.replace(/\s+/g, ' ').trim(), expectedBreadCrumb);
                        });

                        it('... should have three back links to series overview, current edition series and section overview', async () => {
                            const expectedLinkLength = 3;

                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            getAndExpectDebugElementByCss(hDes[0], 'a', expectedLinkLength, expectedLinkLength);
                            const linkDes = getAndExpectDebugElementByDirective(
                                hDes[0],
                                RouterLinkStubDirective,
                                expectedLinkLength,
                                expectedLinkLength
                            );
                            const routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
                            const expectedSeriesRoute = EDITION_ROUTE_CONSTANTS.SERIES.route;
                            const expectedSeriesNumberRoute = expectedSelectedEditionSeries.series.route;
                            const expectedSectionRoute = EDITION_ROUTE_CONSTANTS.SECTION.route;
                            const expectedSectionNumberRoute = expectedSelectedEditionSection.section.route;

                            expectToBe(routerLinks.length, expectedLinkLength);
                            expectToEqual(routerLinks[0].linkParams, [expectedSeriesRoute]);
                            expectToEqual(routerLinks[1].linkParams, [
                                './' + expectedSeriesRoute,
                                expectedSeriesNumberRoute,
                            ]);
                            expectToEqual(routerLinks[2].linkParams, [
                                './' + expectedSeriesRoute,
                                expectedSeriesNumberRoute,
                                expectedSectionRoute,
                                expectedSectionNumberRoute,
                            ]);
                        });
                    });
                });
            });
        });
    });
});
