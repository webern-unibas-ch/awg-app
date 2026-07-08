import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { Component, DebugElement, DOCUMENT, Input, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { BehaviorSubject, delay, Observable, of as observableOf } from 'rxjs';

import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective, RouterOutletStubComponent } from '@testing/router-stubs';

import { MetaIdentifiers } from '@awg-core/models/meta.model';

import { EDITION_ROUTE_CONSTANTS } from './edition-route-constants';
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
    selector: 'awg-scroll-to-top',
    template: '',
    standalone: false,
})
class ScrollToTopStubComponent {}

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

    let mockEditionStateService: Partial<EditionStateService>;

    let setupEditionViewSpy: Spy;

    let editionStateServiceGetSelectedEditionComplexSpy: Spy;
    let editionStateServiceGetSelectedEditionSeriesSpy: Spy;
    let editionStateServiceGetSelectedEditionSectionSpy: Spy;
    let editionStateServiceGetIsIntroViewSpy: Spy;
    let editionStateServiceGetIsPrefaceViewSpy: Spy;
    let editionStateServiceGetIsRowTableViewSpy: Spy;

    let expectedSelectedEditionComplexId: string;
    let expectedSelectedEditionComplex: EditionComplex;
    let expectedSelectedEditionSeries: EditionOutlineSeries;
    let expectedSelectedEditionSection: EditionOutlineSection;
    let expectedIsIntroView: boolean;
    let expectedIsPrefaceView: boolean;
    let expectedIsRowTableView: boolean;

    const expectedTitle = 'Editionsübersicht';
    const expectedId = 'awg-edition-view';
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        // Mock edition state service
        mockEditionStateService = {
            getIsIntroView: (): Observable<boolean> => observableOf(expectedIsIntroView),
            getIsPrefaceView: (): Observable<boolean> => observableOf(expectedIsPrefaceView),
            getIsRowTableView: (): Observable<boolean> => observableOf(expectedIsRowTableView),
            getSelectedEditionComplex: (): Observable<EditionComplex> =>
                // Return op. 12 by default
                observableOf(EditionComplexesService.getEditionComplexById(expectedSelectedEditionComplexId)),
            updateSelectedEditionComplex: (): void => {
                // Intentional empty test override
            },
            getSelectedEditionSeries: (): Observable<EditionOutlineSeries> =>
                observableOf(expectedSelectedEditionSeries),
            getSelectedEditionSection: (): Observable<EditionOutlineSection> =>
                observableOf(expectedSelectedEditionSection),
        };

        await TestBed.configureTestingModule({
            declarations: [
                EditionViewComponent,
                EditionJumbotronStubComponent,
                MetaIdentifierBadgesStubComponent,
                RouterOutletStubComponent,
                RouterLinkStubDirective,
                ScrollToTopStubComponent,
            ],
            imports: [DatePipe],
            providers: [
                { provide: LOCALE_ID, useValue: 'de-DE' },
                { provide: EditionStateService, useValue: mockEditionStateService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);
        mockEditionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedIsIntroView = false;
        expectedIsPrefaceView = false;
        expectedIsRowTableView = true;
        expectedSelectedEditionComplexId = 'op12';
        expectedSelectedEditionComplex = EditionComplexesService.getEditionComplexById(
            expectedSelectedEditionComplexId
        );
        expectedSelectedEditionSeries = EditionOutlineService.getEditionOutline()[0]; // Series 1
        expectedSelectedEditionSection = expectedSelectedEditionSeries.sections[4]; // Section 5

        // Spies
        setupEditionViewSpy = vi.spyOn(component, 'setupEditionView');

        // Spies for service methods
        editionStateServiceGetSelectedEditionComplexSpy = vi.spyOn(
            mockEditionStateService,
            'getSelectedEditionComplex'
        );
        editionStateServiceGetIsIntroViewSpy = vi.spyOn(mockEditionStateService, 'getIsIntroView');
        editionStateServiceGetIsPrefaceViewSpy = vi.spyOn(mockEditionStateService, 'getIsPrefaceView');
        editionStateServiceGetIsRowTableViewSpy = vi.spyOn(mockEditionStateService, 'getIsRowTableView');
        editionStateServiceGetSelectedEditionSeriesSpy = vi.spyOn(mockEditionStateService, 'getSelectedEditionSeries');
        editionStateServiceGetSelectedEditionSectionSpy = vi.spyOn(
            mockEditionStateService,
            'getSelectedEditionSection'
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have title and id', () => {
            expectToBe(component.editionViewTitle, expectedTitle);
            expectToBe(component.editionViewId, expectedId);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should not have `isIntroView$`', () => {
            expect(component.isIntroView$).toBeUndefined();
        });

        it('... should not have `isPrefaceView$`', () => {
            expect(component.isPrefaceView$).toBeUndefined();
        });

        it('... should not have `isRowTableView$`', () => {
            expect(component.isRowTableView$).toBeUndefined();
        });

        it('... should not have `selectedEditionComplex$`', () => {
            expect(component.selectedEditionComplex$).toBeUndefined();
        });

        it('... should not have `selectedSeries$`', () => {
            expect(component.selectedEditionSeries$).toBeUndefined();
        });

        it('... should not have `selectedSection$`', () => {
            expect(component.selectedEditionSection$).toBeUndefined();
        });

        describe('VIEW', () => {
            const getEditionViewDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-view', 1, 1);

            it('... should contain one `div.awg-edition-view`', () => {
                getEditionViewDes();
            });

            it('... should contain one ScrollToTop component (stubbed) in `div.awg-edition-view`', () => {
                getAndExpectDebugElementByDirective(getEditionViewDes()[0], ScrollToTopStubComponent, 1, 1);
            });

            describe('... should contain no sub-components yet', () => {
                it.each([
                    { desc: '`div.awg-edition-row-tables`', selector: 'div.awg-edition-row-tables' },
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

        describe('#setupEditionView()', () => {
            it('... should have a method `setupEditionView`', () => {
                expect(component.setupEditionView).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(setupEditionViewSpy, 0);
            });

            it('... should not have called EditionStateService', () => {
                expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 0);
                expectSpyCall(editionStateServiceGetSelectedEditionSeriesSpy, 0);
                expectSpyCall(editionStateServiceGetSelectedEditionSectionSpy, 0);
            });

            it('... should not have set isIntroView$', () => {
                expect(component.isIntroView$).toBeUndefined();
            });

            it('... should not have set isPrefaceView$', () => {
                expect(component.isPrefaceView$).toBeUndefined();
            });

            it('... should not have set isRowTableView$', () => {
                expect(component.isRowTableView$).toBeUndefined();
            });

            it('... should not have set selectedEditionComplex$', () => {
                expect(component.selectedEditionComplex$).toBeUndefined();
            });

            it('... should not have set selectedSeries$', () => {
                expect(component.selectedEditionSeries$).toBeUndefined();
            });

            it('... should not have set selectedSection$', () => {
                expect(component.selectedEditionSection$).toBeUndefined();
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
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-row-tables', 1, 1);
            const getComplexDes = () =>
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-complex', 1, 1);
            const getSeriesDes = () =>
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-series', 1, 1);

            describe('... if isPrefaceView$ is given', () => {
                beforeEach(async () => {
                    component.isPrefaceView$ = observableOf(true).pipe(delay(0));

                    // Trigger data binding
                    fixture.detectChanges();
                    vi.runAllTimers();
                    await Promise.resolve();
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

            describe('... if isRowTableView$ is given', () => {
                beforeEach(async () => {
                    component.isRowTableView$ = observableOf(true).pipe(delay(0));

                    // Trigger data binding
                    fixture.detectChanges();
                    vi.runAllTimers();
                    await Promise.resolve();
                });

                it('... should have one `div.awg-edition-row-tables` in `div.awg-edition-view`', () => {
                    getRowtableDes();
                });

                it('... should have an h6 (breadcrumb) and a JumbotronComponent (stubbed) in `div.awg-edition-row-tables`', () => {
                    const rowtableDes = getRowtableDes();

                    getAndExpectDebugElementByCss(rowtableDes[0], 'h6.awg-edition-info-breadcrumb', 1, 1);

                    getAndExpectDebugElementByDirective(rowtableDes[0], EditionJumbotronStubComponent, 1, 1);
                });

                it('... should display edition base root (AWG) and heading title in breadcrumb header (h6)', () => {
                    const hDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-row-tables > h6.awg-edition-info-breadcrumb',
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

            describe('... if selectedEditionComplex$ is given', () => {
                const renderSelectedEditionComplex = async (complex: EditionComplex): Promise<void> => {
                    component.selectedEditionComplex$ = observableOf(complex).pipe(delay(0));

                    // Trigger data binding
                    fixture.detectChanges();
                    vi.runAllTimers();
                    await Promise.resolve();
                };

                it('... should have one `div.awg-edition-complex` in `div.awg-edition-view`', async () => {
                    await renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    getComplexDes();
                });

                it('... should have an h6 (breadcrumb), a JumbotronComponent (stubbed) and a responsibility div in `div.awg-edition-complex`', async () => {
                    await renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    const complexDes = getComplexDes();

                    getAndExpectDebugElementByCss(complexDes[0], 'h6.awg-edition-info-breadcrumb', 1, 1);
                    getAndExpectDebugElementByDirective(complexDes[0], EditionJumbotronStubComponent, 1, 1);
                    getAndExpectDebugElementByCss(complexDes[0], 'div.awg-edition-responsibility', 1, 1);
                });

                it('... should display edition complex in breadcrumb header (h6)', async () => {
                    await renderSelectedEditionComplex(expectedSelectedEditionComplex);

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

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', async () => {
                    await renderSelectedEditionComplex(expectedSelectedEditionComplex);

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

                it('... should have one paragraph with editor and version in responsibility div', async () => {
                    await renderSelectedEditionComplex(expectedSelectedEditionComplex);

                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const editors = expectedSelectedEditionComplex.respStatement.editors;

                    getAndExpectDebugElementByCss(pDes[0], 'span.editor', editors.length, editors.length);
                    getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                });

                it('... should display editor link and version in responsibility div', async () => {
                    await renderSelectedEditionComplex(expectedSelectedEditionComplex);

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

                it('... should display "---" in span.version without applying DatePipe when lastModified is "---"', async () => {
                    const expectedComplexWithDash = EditionComplexesService.getEditionComplexById('m212');
                    await renderSelectedEditionComplex(expectedComplexWithDash);

                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);
                    const versionSpanDes = getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                    const versionSpanEl: HTMLSpanElement = versionSpanDes[0].nativeElement;

                    expectToBe(versionSpanEl.textContent?.trim(), '---');
                });

                it('... should have one MetaIdentifierBadgesComponent for each editor', async () => {
                    await renderSelectedEditionComplex(expectedSelectedEditionComplex);

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

                it('... should pass identifiers to MetaIdentifierBadgesComponent for each editor', async () => {
                    await renderSelectedEditionComplex(expectedSelectedEditionComplex);

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

            describe('... if selectedEditionComplex$, isPrefaceView$ and isRowTableView$ are not given', () => {
                let selectedEditionSeriesSubject: BehaviorSubject<EditionOutlineSeries | null>;
                let selectedEditionSectionSubject: BehaviorSubject<EditionOutlineSection | null>;
                let isIntroViewSubject: BehaviorSubject<boolean>;

                beforeEach(async () => {
                    selectedEditionSeriesSubject = new BehaviorSubject<EditionOutlineSeries | null>(null);
                    selectedEditionSectionSubject = new BehaviorSubject<EditionOutlineSection | null>(null);
                    isIntroViewSubject = new BehaviorSubject<boolean>(false);

                    component.selectedEditionComplex$ = observableOf(null);
                    component.isPrefaceView$ = observableOf(null);
                    component.isRowTableView$ = observableOf(null);
                    component.selectedEditionSeries$ = selectedEditionSeriesSubject.asObservable();
                    component.selectedEditionSection$ = selectedEditionSectionSubject.asObservable();
                    component.isIntroView$ = isIntroViewSubject.asObservable();

                    // Trigger data binding
                    fixture.detectChanges();
                    vi.runAllTimers();
                    await Promise.resolve();
                });

                describe('... should contain no view-specific-components', () => {
                    it.each([
                        { desc: '`div.awg-edition-preface`', selector: 'div.awg-edition-preface' },
                        { desc: '`div.awg-edition-row-tables`', selector: 'div.awg-edition-row-tables' },
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

                it('... should pass down full edition intro const as title to JumbotronComponent (stubbed) if `isIntroView=true`', async () => {
                    isIntroViewSubject.next(true);

                    // Trigger data binding
                    fixture.detectChanges();
                    vi.runAllTimers();
                    await Promise.resolve();

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
                        it('... should display edition base root (AWG)', async () => {
                            selectedEditionSeriesSubject.next(null);
                            selectedEditionSectionSubject.next(null);

                            // Trigger data binding
                            fixture.detectChanges();
                            vi.runAllTimers();
                            await Promise.resolve();

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

                            selectedEditionSeriesSubject.next(null);
                            selectedEditionSectionSubject.next(null);

                            // Trigger data binding
                            fixture.detectChanges();
                            vi.runAllTimers();
                            await Promise.resolve();

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
                        it('... should display edition series', async () => {
                            selectedEditionSeriesSubject.next(expectedSelectedEditionSeries);
                            selectedEditionSectionSubject.next(null);

                            // Trigger data binding
                            fixture.detectChanges();
                            vi.runAllTimers();
                            await Promise.resolve();

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

                        it('... should have a back link to edition series overview', async () => {
                            const expectedLinkLength = 1;

                            selectedEditionSeriesSubject.next(expectedSelectedEditionSeries);
                            selectedEditionSectionSubject.next(null);

                            // Trigger data binding
                            fixture.detectChanges();
                            vi.runAllTimers();
                            await Promise.resolve();

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
                        it('... should display edition series and section', async () => {
                            selectedEditionSeriesSubject.next(expectedSelectedEditionSeries);
                            selectedEditionSectionSubject.next(expectedSelectedEditionSection);

                            // Trigger data binding
                            fixture.detectChanges();
                            vi.runAllTimers();
                            await Promise.resolve();

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

                        it('... should have two back links to series overview and current edition series', async () => {
                            const expectedLinkLength = 2;

                            selectedEditionSeriesSubject.next(expectedSelectedEditionSeries);
                            selectedEditionSectionSubject.next(expectedSelectedEditionSection);

                            // Trigger data binding
                            fixture.detectChanges();
                            vi.runAllTimers();
                            await Promise.resolve();

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

                    describe('... if series, section, and isIntroView$ is given', () => {
                        it('... should display edition series, section and intro heading', async () => {
                            selectedEditionSeriesSubject.next(expectedSelectedEditionSeries);
                            selectedEditionSectionSubject.next(expectedSelectedEditionSection);
                            isIntroViewSubject.next(true);

                            // Trigger data binding
                            fixture.detectChanges();
                            vi.runAllTimers();
                            await Promise.resolve();
                            fixture.detectChanges();

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

                            selectedEditionSeriesSubject.next(expectedSelectedEditionSeries);
                            selectedEditionSectionSubject.next(expectedSelectedEditionSection);
                            isIntroViewSubject.next(true);

                            // Trigger data binding
                            fixture.detectChanges();
                            vi.runAllTimers();
                            await Promise.resolve();
                            fixture.detectChanges();

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

        describe('#setupEditionView()', () => {
            it('... should have been called', () => {
                expectSpyCall(setupEditionViewSpy, 1);
            });

            it('... should get isIntroView$ (via EditionStateService)', () => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionStateServiceGetIsIntroViewSpy, 1);

                expect(component.isIntroView$).toBeDefined();
                component.isIntroView$.subscribe({
                    next: (isView: boolean) => {
                        expectToBe(isView, expectedIsIntroView);
                    },
                });
            });

            it('... should get isPrefaceView$ (via EditionStateService)', () => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionStateServiceGetIsPrefaceViewSpy, 1);

                expect(component.isPrefaceView$).toBeDefined();
                component.isPrefaceView$.subscribe({
                    next: (isView: boolean) => {
                        expectToBe(isView, expectedIsPrefaceView);
                    },
                });
            });

            it('... should get isRowTableView$ (via EditionStateService)', () => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionStateServiceGetIsRowTableViewSpy, 1);

                expect(component.isRowTableView$).toBeDefined();
                component.isRowTableView$.subscribe({
                    next: (isView: boolean) => {
                        expectToBe(isView, expectedIsRowTableView);
                    },
                });
            });

            it('... should get selectedEditionSeries$ (via EditionStateService)', () => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionStateServiceGetSelectedEditionSeriesSpy, 1);

                expect(component.selectedEditionSeries$).toBeDefined();
                component.selectedEditionSeries$.subscribe({
                    next: (series: EditionOutlineSeries) => {
                        expectToEqual(series, expectedSelectedEditionSeries);
                    },
                });
            });

            it('... should get selectedEditionSection$ (via EditionStateService)', () => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionStateServiceGetSelectedEditionSectionSpy, 1);

                expect(component.selectedEditionSection$).toBeDefined();
                component.selectedEditionSection$.subscribe({
                    next: (section: EditionOutlineSection) => {
                        expectToEqual(section, expectedSelectedEditionSection);
                    },
                });
            });

            it('... should get selectedEditionComplex$ (via EditionStateService)', () => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 1);

                expect(component.selectedEditionComplex$).toBeDefined();
                component.selectedEditionComplex$.subscribe({
                    next: (complex: EditionComplex) => {
                        expectToEqual(
                            complex,
                            EditionComplexesService.getEditionComplexById(expectedSelectedEditionComplexId)
                        );
                    },
                });
            });
        });
    });
});
