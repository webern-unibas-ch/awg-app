/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { ActivatedRouteStub, RouterLinkStubDirective, RouterOutletStubComponent } from '@testing/router-stubs';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionService } from '@awg-views/edition-view/services';

import { EditionViewComponent } from './edition-view.component';

// Mock components
@Component({ selector: 'awg-edition-jumbotron', template: '' })
class EditionJumbotronStubComponent {
    @Input()
    jumbotronId: string;
    @Input()
    jumbotronTitle: string;
}

@Component({ selector: 'awg-scroll-to-top', template: '' })
class ScrollToTopStubComponent {}

describe('EditionViewComponent (DONE)', () => {
    let component: EditionViewComponent;
    let fixture: ComponentFixture<EditionViewComponent>;
    let compDe: DebugElement;

    let mockRouter;
    let mockActivatedRoute: ActivatedRouteStub;
    let mockEditionService: Partial<EditionService>;

    let setupEditionViewSpy: Spy;
    let routeToSidenavSpy: Spy;

    let editionServiceGetSelectedEditionComplexSpy: Spy;
    let editionServiceGetSelectedEditionSeriesSpy: Spy;
    let editionServiceGetSelectedEditionSectionSpy: Spy;
    let editionServiceGetIsIntroViewSpy: Spy;
    let editionServiceGetIsPrefaceViewSpy: Spy;
    let editionServiceGetIsRowTableViewSpy: Spy;

    let expectedSelectedEditionComplexId: string;
    let expectedSelectedEditionComplex: EditionComplex;
    let expectedSelectedEditionSeries: EditionOutlineSeries;
    let expectedSelectedEditionSection: EditionOutlineSection;
    let expectedIsIntroView: boolean;
    let expectedIsPrefaceView: boolean;
    let expectedIsRowTableView: boolean;

    const expectedTitle = 'Inhalt';
    const expectedId = 'awg-edition-view';
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(waitForAsync(() => {
        // Mock router with spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        // Mock activated route with stub class
        mockActivatedRoute = new ActivatedRouteStub();

        // Mock edition service
        mockEditionService = {
            getIsIntroView: (): Observable<boolean> => observableOf(expectedIsIntroView),
            getIsPrefaceView: (): Observable<boolean> => observableOf(expectedIsPrefaceView),
            getIsRowTableView: (): Observable<boolean> => observableOf(expectedIsRowTableView),
            getSelectedEditionComplex: (): Observable<EditionComplex> =>
                // Return op. 12 by default
                observableOf(EditionComplexesService.getEditionComplexById(expectedSelectedEditionComplexId)),
            updateSelectedEditionComplex: (editionComplex: EditionComplex): void => {
                // Intentional empty test override
            },
            getSelectedEditionSeries: (): Observable<EditionOutlineSeries> =>
                observableOf(expectedSelectedEditionSeries),
            getSelectedEditionSection: (): Observable<EditionOutlineSection> =>
                observableOf(expectedSelectedEditionSection),
        };

        TestBed.configureTestingModule({
            declarations: [
                EditionViewComponent,
                EditionJumbotronStubComponent,
                RouterOutletStubComponent,
                RouterLinkStubDirective,
                ScrollToTopStubComponent,
            ],
            providers: [
                { provide: EditionService, useValue: mockEditionService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockEditionService = TestBed.inject(EditionService);

        // Test data
        expectedIsIntroView = false;
        expectedIsPrefaceView = false;
        expectedIsRowTableView = true;
        expectedSelectedEditionComplexId = 'OP12';
        expectedSelectedEditionComplex = EditionComplexesService.getEditionComplexById(
            expectedSelectedEditionComplexId
        );
        expectedSelectedEditionSeries = EditionOutlineService.getEditionOutline()[0]; // Series 1
        expectedSelectedEditionSection = expectedSelectedEditionSeries.sections[4]; // Section 5

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        setupEditionViewSpy = spyOn(component, 'setupEditionView').and.callThrough();
        routeToSidenavSpy = spyOn(component, 'routeToSidenav').and.callThrough();

        // Spies for service methods
        editionServiceGetSelectedEditionComplexSpy = spyOn(
            mockEditionService,
            'getSelectedEditionComplex'
        ).and.callThrough();
        editionServiceGetIsIntroViewSpy = spyOn(mockEditionService, 'getIsIntroView').and.callThrough();
        editionServiceGetIsPrefaceViewSpy = spyOn(mockEditionService, 'getIsPrefaceView').and.callThrough();
        editionServiceGetIsRowTableViewSpy = spyOn(mockEditionService, 'getIsRowTableView').and.callThrough();
        editionServiceGetSelectedEditionSeriesSpy = spyOn(
            mockEditionService,
            'getSelectedEditionSeries'
        ).and.callThrough();
        editionServiceGetSelectedEditionSectionSpy = spyOn(
            mockEditionService,
            'getSelectedEditionSection'
        ).and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
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
            it('... should contain one ScrollToTop component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ScrollToTopStubComponent, 1, 1);
            });

            it('... should contain one outer div', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain no div.awg-edition-row-tables yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-row-tables', 0, 0);
            });

            it('... should contain no div.awg-edition-complex yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex', 0, 0);
            });

            it('... should contain no div.awg-edition-series yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 0, 0);
            });

            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });
        });

        describe('#setupEditionView()', () => {
            it('... should have a method `setupEditionView`', () => {
                expect(component.setupEditionView).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(setupEditionViewSpy, 0);
            });

            it('... should not have called EditionService', () => {
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 0);
                expectSpyCall(editionServiceGetSelectedEditionSeriesSpy, 0);
                expectSpyCall(editionServiceGetSelectedEditionSectionSpy, 0);
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

        describe('#routeToSidenav()', () => {
            it('... should have a method `routeToSidenav`', () => {
                expect(component.routeToSidenav).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(routeToSidenavSpy, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            describe('... if isPrefaceView$ is given', () => {
                beforeEach(waitForAsync(() => {
                    component.isPrefaceView$ = observableOf(true);

                    // Trigger data binding
                    fixture.detectChanges();
                }));

                it('... should have one div.awg-edition-preface', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-preface', 1, 1);
                });

                it('... should have an h6 (breadcrumb) and a JumbotronComponent (stubbed)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-preface', 1, 1);

                    getAndExpectDebugElementByCss(divDes[0], 'h6.awg-edition-info-breadcrumb', 1, 1);

                    getAndExpectDebugElementByDirective(divDes[0], EditionJumbotronStubComponent, 1, 1);
                });

                it('... should display edition base root (AWG) and heading title in breadcrumb header (h6)', () => {
                    const hDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-preface > h6.awg-edition-info-breadcrumb',
                        1,
                        1
                    );
                    const hEl = hDes[0].nativeElement;

                    const expectedBreadCrumb = `${expectedEditionRouteConstants.EDITION.short} / ${expectedEditionRouteConstants.PREFACE.short}`;

                    expectToBe(hEl.innerText, expectedBreadCrumb);
                });

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', () => {
                    // Get debug and native element of JumbotronComponent
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-preface', 1, 1);
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        divDes[0],
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
                beforeEach(waitForAsync(() => {
                    component.isRowTableView$ = observableOf(true);

                    // Trigger data binding
                    fixture.detectChanges();
                }));

                it('... should have one div.awg-edition-row-tables', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-row-tables', 1, 1);
                });

                it('... should have an h6 (breadcrumb) and a JumbotronComponent (stubbed)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-row-tables', 1, 1);

                    getAndExpectDebugElementByCss(divDes[0], 'h6.awg-edition-info-breadcrumb', 1, 1);

                    getAndExpectDebugElementByDirective(divDes[0], EditionJumbotronStubComponent, 1, 1);
                });

                it('... should display edition base root (AWG) and heading title in breadcrumb header (h6)', () => {
                    const hDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-row-tables > h6.awg-edition-info-breadcrumb',
                        1,
                        1
                    );
                    const hEl = hDes[0].nativeElement;

                    const expectedBreadCrumb = `${expectedEditionRouteConstants.EDITION.short} / ${expectedEditionRouteConstants.ROWTABLES.full}`;

                    expectToBe(hEl.innerText, expectedBreadCrumb);
                });

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', () => {
                    // Get debug and native element of JumbotronComponent
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-row-tables', 1, 1);
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        divDes[0],
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
                beforeEach(waitForAsync(() => {
                    component.selectedEditionComplex$ = observableOf(expectedSelectedEditionComplex);

                    // Trigger data binding
                    fixture.detectChanges();
                }));

                it('... should have one div.awg-edition-complex', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex', 1, 1);
                });

                it('... should have an h6 (breadcrumb), a JumbotronComponent (stubbed) and a responsibility div in div.awg-edition-complex', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex', 1, 1);

                    getAndExpectDebugElementByCss(divDes[0], 'h6.awg-edition-info-breadcrumb', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], EditionJumbotronStubComponent, 1, 1);
                    getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-responsibility', 1, 1);
                });

                it('... should display edition complex in breadcrumb header (h6)', () => {
                    const hDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-complex > h6.awg-edition-info-breadcrumb',
                        1,
                        1
                    );
                    const hEl = hDes[0].nativeElement;

                    const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                    const series = expectedSelectedEditionComplex.pubStatement.series.full;
                    const section = expectedSelectedEditionComplex.pubStatement.section.full;
                    const expectedBreadCrumb = `${awg} / ${series} / ${section}`;

                    expectToBe(hEl.innerText, expectedBreadCrumb);
                });

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', () => {
                    // Get debug and native element of JumbotronComponent
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex', 1, 1);
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        divDes[0],
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
                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const editors = expectedSelectedEditionComplex.respStatement.editors;

                    getAndExpectDebugElementByCss(pDes[0], 'span.editor', editors.length, editors.length);
                    getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                });

                it('... should display editor and version in responsibility div', () => {
                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const expectedEditors = expectedSelectedEditionComplex.respStatement.editors;
                    const editorDes = getAndExpectDebugElementByCss(
                        pDes[0],
                        'span.editor > a',
                        expectedEditors.length,
                        expectedEditors.length
                    );
                    const versionDes = getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);

                    const editorEls = editorDes.map(editor => editor.nativeElement);
                    const versionEl = versionDes[0].nativeElement;

                    editorEls.forEach((editorEl, i: number) => {
                        expectToBe(editorEl.href, expectedEditors[i].homepage);

                        expectToBe(editorEl.innerText, expectedEditors[i].name);
                    });

                    expectToBe(versionEl.innerText, expectedSelectedEditionComplex.respStatement.lastModified);
                });
            });

            describe('... if selectedEditionComplex$, isPrefaceView$ and isRowTableView$ are not given', () => {
                beforeEach(waitForAsync(() => {
                    component.selectedEditionComplex$ = observableOf(null);
                    component.isPrefaceView$ = observableOf(null);
                    component.isRowTableView$ = observableOf(null);

                    // Trigger data binding
                    fixture.detectChanges();
                }));

                it('... should not have a div.awg-edition-preface', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-preface', 0, 0);
                });

                it('... should not have a div.awg-edition-row-tables', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-row-tables', 0, 0);
                });

                it('... should not have a div.awg-edition-complex', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex', 0, 0);
                });

                it('... should have one div.awg-edition-series', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 1, 1);
                });

                it('... should have an h6 (breadcrumb) and a JumbotronComponent (stubbed)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 1, 1);

                    getAndExpectDebugElementByCss(divDes[0], 'h6.awg-edition-info-breadcrumb', 1, 1);

                    getAndExpectDebugElementByDirective(divDes[0], EditionJumbotronStubComponent, 1, 1);
                });

                it('... should pass down `editionViewId` and `editionViewTitle` to JumbotronComponent (stubbed)', () => {
                    // Get debug and native element of JumbotronComponent
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 1, 1);
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        divDes[0],
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
                    component.isIntroView$ = observableOf(true);
                    fixture.detectChanges();

                    // Get debug and native element of JumbotronComponent
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 1, 1);
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        divDes[0],
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
                        it('... should display edition base root (AWG)', () => {
                            component.selectedEditionSeries$ = observableOf(null);
                            component.selectedEditionSection$ = observableOf(null);

                            // Trigger data binding
                            fixture.detectChanges();

                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            const hEl = hDes[0].nativeElement;

                            const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                            const expectedBreadCrumb = `${awg} /`;

                            expectToBe(hEl.innerText, expectedBreadCrumb);
                        });

                        it('... should have no back link to edition series overview', () => {
                            const expectedLinkLength = 0;

                            component.selectedEditionSeries$ = observableOf(null);
                            component.selectedEditionSection$ = observableOf(null);

                            // Trigger data binding
                            fixture.detectChanges();

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
                        it('... should display edition series', () => {
                            component.selectedEditionSeries$ = observableOf(expectedSelectedEditionSeries);
                            component.selectedEditionSection$ = observableOf(null);

                            // Trigger data binding
                            fixture.detectChanges();

                            // Trigger data binding
                            fixture.detectChanges();

                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            const hEl = hDes[0].nativeElement;

                            const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                            const series = expectedSelectedEditionComplex.pubStatement.series.full;
                            const expectedBreadCrumb = `${awg} / ${series} /`;

                            expectToBe(hEl.innerText, expectedBreadCrumb);
                        });

                        it('... should have a back link to edition series overview', () => {
                            const expectedLinkLength = 1;

                            component.selectedEditionSeries$ = observableOf(expectedSelectedEditionSeries);
                            component.selectedEditionSection$ = observableOf(null);

                            // Trigger data binding
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
                            const expectedRoute = EDITION_ROUTE_CONSTANTS.SERIES.route;

                            expectToBe(routerLinks.length, expectedLinkLength);
                            expectToEqual(routerLinks[0].linkParams, [expectedRoute]);
                        });
                    });

                    describe('... if series and section are given', () => {
                        it('... should display edition series and section', () => {
                            component.selectedEditionSeries$ = observableOf(expectedSelectedEditionSeries);
                            component.selectedEditionSection$ = observableOf(expectedSelectedEditionSection);

                            // Trigger data binding
                            fixture.detectChanges();

                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            const hEl = hDes[0].nativeElement;

                            const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                            const series = expectedSelectedEditionComplex.pubStatement.series.full;
                            const section = expectedSelectedEditionComplex.pubStatement.section.full;
                            const expectedBreadCrumb = `${awg} / ${series} / ${section}`;

                            expectToBe(hEl.innerText, expectedBreadCrumb);
                        });

                        it('... should have two back links to series overview and current edition series', () => {
                            const expectedLinkLength = 2;

                            component.selectedEditionSeries$ = observableOf(expectedSelectedEditionSeries);
                            component.selectedEditionSection$ = observableOf(expectedSelectedEditionSection);

                            // Trigger data binding
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

                            expectToBe(routerLinks.length, expectedLinkLength);
                            expectToEqual(routerLinks[0].linkParams, [expectedSeriesRoute]);
                            expectToEqual(routerLinks[1].linkParams, [
                                './' + expectedSeriesRoute,
                                expectedSeriesNumberRoute,
                            ]);
                        });
                    });

                    describe('... if series, section, and isIntroView$ is given', () => {
                        it('... should display edition series, section and intro heading', () => {
                            component.selectedEditionSeries$ = observableOf(expectedSelectedEditionSeries);
                            component.selectedEditionSection$ = observableOf(expectedSelectedEditionSection);
                            component.isIntroView$ = observableOf(true);

                            // Trigger data binding
                            fixture.detectChanges();

                            const hDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                                1,
                                1
                            );
                            const hEl = hDes[0].nativeElement;

                            const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                            const series = expectedSelectedEditionComplex.pubStatement.series.full;
                            const section = expectedSelectedEditionComplex.pubStatement.section.full;
                            const intro = EDITION_ROUTE_CONSTANTS.EDITION_INTRO.full;
                            const expectedBreadCrumb = `${awg} / ${series} / ${section} / ${intro}`;

                            expectToBe(hEl.innerText, expectedBreadCrumb);
                        });

                        it('... should have three back links to series overview, current edition series and section overview', () => {
                            const expectedLinkLength = 3;

                            component.selectedEditionSeries$ = observableOf(expectedSelectedEditionSeries);
                            component.selectedEditionSection$ = observableOf(expectedSelectedEditionSection);
                            component.isIntroView$ = observableOf(true);

                            // Trigger data binding
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

            it('... should get isIntroView$ (via EditionService)', waitForAsync(() => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionServiceGetIsIntroViewSpy, 1);

                expect(component.isIntroView$).toBeDefined();
                component.isIntroView$.subscribe({
                    next: (isView: boolean) => {
                        expectToBe(isView, expectedIsIntroView);
                    },
                });
            }));

            it('... should get isPrefaceView$ (via EditionService)', waitForAsync(() => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionServiceGetIsPrefaceViewSpy, 1);

                expect(component.isPrefaceView$).toBeDefined();
                component.isPrefaceView$.subscribe({
                    next: (isView: boolean) => {
                        expectToBe(isView, expectedIsPrefaceView);
                    },
                });
            }));

            it('... should get isRowTableView$ (via EditionService)', waitForAsync(() => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionServiceGetIsRowTableViewSpy, 1);

                expect(component.isRowTableView$).toBeDefined();
                component.isRowTableView$.subscribe({
                    next: (isView: boolean) => {
                        expectToBe(isView, expectedIsRowTableView);
                    },
                });
            }));

            it('... should get selectedEditionSeries$ (via EditionService)', waitForAsync(() => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionServiceGetSelectedEditionSeriesSpy, 1);

                expect(component.selectedEditionSeries$).toBeDefined();
                component.selectedEditionSeries$.subscribe({
                    next: (series: EditionOutlineSeries) => {
                        expectToEqual(series, expectedSelectedEditionSeries);
                    },
                });
            }));

            it('... should get selectedEditionSection$ (via EditionService)', waitForAsync(() => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionServiceGetSelectedEditionSectionSpy, 1);

                expect(component.selectedEditionSection$).toBeDefined();
                component.selectedEditionSection$.subscribe({
                    next: (section: EditionOutlineSection) => {
                        expectToEqual(section, expectedSelectedEditionSection);
                    },
                });
            }));

            it('... should get selectedEditionComplex$ (via EditionService)', waitForAsync(() => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 1);

                expect(component.selectedEditionComplex$).toBeDefined();
                component.selectedEditionComplex$.subscribe({
                    next: (complex: EditionComplex) => {
                        expectToEqual(
                            complex,
                            EditionComplexesService.getEditionComplexById(expectedSelectedEditionComplexId)
                        );
                    },
                });
            }));
        });

        describe('#routeToSideNav()', () => {
            let navigationSpy: Spy;

            beforeEach(() => {
                // Create spy of mockrouter SpyObj
                navigationSpy = mockRouter.navigate as jasmine.Spy;
            });

            it('... should have been called', () => {
                // Router navigation triggerd by onInit
                expectSpyCall(routeToSidenavSpy, 1);
            });

            it('... should have triggered `router.navigate`', () => {
                expectSpyCall(navigationSpy, 1);
            });

            it('... should tell ROUTER to navigate to `editionInfo` outlet', () => {
                const expectedRoute = 'editionInfo';

                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const outletRoute = navArgs[0][0].outlets.side;

                expect(navArgs).toBeDefined();
                expect(navArgs[0]).toBeDefined();
                expectToBe(outletRoute, expectedRoute);

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).toBeDefined();
                expectToBe(navExtras.preserveFragment, true);

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });
    });
});
