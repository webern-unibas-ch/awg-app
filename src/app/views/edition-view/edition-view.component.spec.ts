/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { ActivatedRouteStub, RouterLinkStubDirective, RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionService } from '@awg-views/edition-view/services';
import {
    EditionConstants,
    EditionRoute,
    EditionSeriesRoutes,
    EditionWork,
    EditionWorks,
} from '@awg-views/edition-view/models';

import { EditionViewComponent } from './edition-view.component';

// Mock jumbotron component
@Component({ selector: 'awg-edition-jumbotron', template: '' })
class EditionJumbotronStubComponent {
    @Input()
    jumbotronId: string;
    @Input()
    jumbotronTitle: string;
}

describe('EditionViewComponent (DONE)', () => {
    let component: EditionViewComponent;
    let fixture: ComponentFixture<EditionViewComponent>;
    let compDe: DebugElement;

    let mockRouter;
    let mockActivatedRoute: ActivatedRouteStub;
    let mockEditionService: Partial<EditionService>;

    let getSelectionsFromRouteSpy: Spy;
    let routeToSidenavSpy: Spy;

    let editionServiceGetEditionComplexSpy: Spy;
    let editionServiceGetSelectedEditionSeriesSpy: Spy;
    let editionServiceGetSelectedEditionSectionSpy: Spy;
    let editionServiceGetIsRowTableViewSpy: Spy;

    let expectedSelectedEditionComplex: EditionWork;
    let expectedSelectedEditionSeries: EditionSeriesRoutes;
    let expectedSelectedEditionSection: EditionRoute;
    let expectedIsRowTableView: boolean;

    const expectedSelectedEditionComplexId = 'OP12';
    const expectedTitle = 'Inhalt';
    const expectedId = 'awg-edition-view';
    const expectedEditionRoute = EditionConstants.EDITION;
    const expectedSeriesRoute = EditionConstants.SERIES;

    beforeEach(waitForAsync(() => {
        // Mock router with spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        // Mock activated route with stub class
        mockActivatedRoute = new ActivatedRouteStub();

        // Mock edition service
        mockEditionService = {
            getEditionWork: (): Observable<EditionWork> =>
                // Return op. 12 by default
                observableOf(EditionWorks[expectedSelectedEditionComplexId]),
            updateEditionWork: (editionWork: EditionWork): void => {
                // Intentional empty test override
            },
            getSelectedEditionSeries: (): Observable<EditionSeriesRoutes> =>
                observableOf(expectedSelectedEditionSeries),
            getSelectedEditionSection: (): Observable<EditionRoute> =>
                observableOf(expectedSelectedEditionSeries.sections[0]),
            getIsRowTableView: (): Observable<boolean> => observableOf(expectedIsRowTableView),
        };

        TestBed.configureTestingModule({
            declarations: [
                EditionViewComponent,
                EditionJumbotronStubComponent,
                RouterOutletStubComponent,
                RouterLinkStubDirective,
            ],
            providers: [
                { provide: EditionService, useValue: mockEditionService },
                {
                    provide: ActivatedRoute,
                    useValue: mockActivatedRoute,
                },
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
        expectedSelectedEditionComplex = EditionWorks[expectedSelectedEditionComplexId]; // Op. 12
        expectedSelectedEditionSeries = {
            series: EditionConstants.SERIES_1,
            sections: [
                EditionConstants.SECTION_1,
                EditionConstants.SECTION_2,
                EditionConstants.SECTION_3,
                EditionConstants.SECTION_4,
                EditionConstants.SECTION_5,
            ],
        };
        expectedSelectedEditionSection = expectedSelectedEditionSeries.sections[0];
        expectedIsRowTableView = true;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getSelectionsFromRouteSpy = spyOn(component, 'getSelectionsFromRoute').and.callThrough();
        routeToSidenavSpy = spyOn(component, 'routeToSidenav').and.callThrough();

        // Spies for service methods
        editionServiceGetEditionComplexSpy = spyOn(mockEditionService, 'getEditionWork').and.callThrough();
        editionServiceGetSelectedEditionSeriesSpy = spyOn(
            mockEditionService,
            'getSelectedEditionSeries'
        ).and.callThrough();
        editionServiceGetSelectedEditionSectionSpy = spyOn(
            mockEditionService,
            'getSelectedEditionSection'
        ).and.callThrough();
        editionServiceGetIsRowTableViewSpy = spyOn(mockEditionService, 'getIsRowTableView').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have title and id', () => {
            expect(component.editionViewTitle).toBeDefined();
            expect(component.editionViewTitle).withContext(`should be ${expectedTitle}`).toBe(expectedTitle);

            expect(component.editionViewId).toBeDefined();
            expect(component.editionViewId).withContext(`should be ${expectedId}`).toBe(expectedId);
        });

        it('... should have editionRoute and seriesRoute', () => {
            expect(component.editionRoute).toBeDefined();
            expect(component.editionRoute).withContext(`should be ${expectedEditionRoute}`).toBe(expectedEditionRoute);

            expect(component.seriesRoute).toBeDefined();
            expect(component.seriesRoute).withContext(`should be ${expectedSeriesRoute}`).toBe(expectedSeriesRoute);
        });

        it('... should not have isRowTableView$', () => {
            expect(component.isRowTableView$).toBeUndefined();
        });

        it('... should not have selectedEditionComplex$', () => {
            expect(component.selectedEditionComplex$).toBeUndefined();
        });

        it('... should not have selectedSeries$', () => {
            expect(component.selectedEditionSeries$).toBeUndefined();
        });

        it('... should not have selectedSection$', () => {
            expect(component.selectedEditionSection$).toBeUndefined();
        });

        describe('#getSelectionsFromRoute', () => {
            it('... should not have been called', () => {
                expectSpyCall(getSelectionsFromRouteSpy, 0);
            });

            it('... should not have called EditionService', () => {
                expectSpyCall(editionServiceGetEditionComplexSpy, 0);
                expectSpyCall(editionServiceGetSelectedEditionSeriesSpy, 0);
                expectSpyCall(editionServiceGetSelectedEditionSectionSpy, 0);
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

        describe('#routeToSidenav', () => {
            it('... should not have been called', () => {
                expectSpyCall(routeToSidenavSpy, 0);
            });
        });

        describe('VIEW', () => {
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
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#getSelectionsFromRoute', () => {
            it('... should have been called', () => {
                expectSpyCall(getSelectionsFromRouteSpy, 1);
            });

            it('... should get isRowTableView$ (via EditionService)', waitForAsync(() => {
                expectSpyCall(getSelectionsFromRouteSpy, 1);
                expectSpyCall(editionServiceGetIsRowTableViewSpy, 1);

                expect(component.isRowTableView$).toBeDefined();
                component.isRowTableView$.subscribe({
                    next: (isView: boolean) => {
                        expect(isView)
                            .withContext(`should equal ${expectedIsRowTableView}`)
                            .toEqual(expectedIsRowTableView);
                    },
                });
            }));

            it('... should get selectedEditionSeries$ (via EditionService)', waitForAsync(() => {
                expectSpyCall(getSelectionsFromRouteSpy, 1);
                expectSpyCall(editionServiceGetSelectedEditionSeriesSpy, 1);

                expect(component.selectedEditionSeries$).toBeDefined();
                component.selectedEditionSeries$.subscribe({
                    next: (series: EditionSeriesRoutes) => {
                        expect(series)
                            .withContext(`should equal ${expectedSelectedEditionSeries}`)
                            .toEqual(expectedSelectedEditionSeries);
                    },
                });
            }));

            it('... should get selectedEditionSection$ (via EditionService)', waitForAsync(() => {
                expectSpyCall(getSelectionsFromRouteSpy, 1);
                expectSpyCall(editionServiceGetSelectedEditionSectionSpy, 1);

                expect(component.selectedEditionSection$).toBeDefined();
                component.selectedEditionSection$.subscribe({
                    next: (section: EditionRoute) => {
                        expect(section)
                            .withContext(`should equal ${expectedSelectedEditionSection}`)
                            .toEqual(expectedSelectedEditionSection);
                    },
                });
            }));

            it('... should get selectedEditionComplex$ (via EditionService)', waitForAsync(() => {
                expectSpyCall(getSelectionsFromRouteSpy, 1);
                expectSpyCall(editionServiceGetEditionComplexSpy, 1);

                expect(component.selectedEditionComplex$).toBeDefined();
                component.selectedEditionComplex$.subscribe({
                    next: (work: EditionWork) => {
                        expect(work)
                            .withContext(`should equal ${EditionWorks[expectedSelectedEditionComplexId]}`)
                            .toEqual(EditionWorks[expectedSelectedEditionComplexId]);
                    },
                });
            }));
        });

        describe('#routeToSideNav', () => {
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

                expect(navArgs).withContext('should have navArgs').toBeDefined();
                expect(navArgs[0]).withContext('should have navCommand').toBeDefined();
                expect(outletRoute).withContext('should have outletRoute').toBeDefined();
                expect(outletRoute).withContext(`should be: ${expectedRoute}`).toBe(expectedRoute);

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).withContext('should have navExtras').toBeDefined();
                expect(navExtras.preserveFragment).withContext('should have preserveFragment extra').toBeDefined();
                expect(navExtras.preserveFragment).withContext('should be `preserveFragment:true`').toBe(true);

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });

        describe('VIEW', () => {
            describe('... if isRowTableView$ is given, it', () => {
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

                    const expectedBreadCrumb = `${expectedEditionRoute.short} / Reihentabellen`;

                    expect(hEl.innerText).toBeTruthy();
                    expect(hEl.innerText).withContext(`should be ${expectedBreadCrumb}`).toBe(expectedBreadCrumb);
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

                    expect(jumbotronCmp.jumbotronId).toBeDefined();
                    expect(jumbotronCmp.jumbotronId).withContext(`should be ${expectedId}`).toBe(expectedId);

                    expect(jumbotronCmp.jumbotronTitle).toBeDefined();
                    expect(jumbotronCmp.jumbotronTitle).withContext(`should be 'Übersicht'`).toBe('Übersicht');
                });
            });

            describe('... if selectedEditionComplex$ is given, it', () => {
                beforeEach(waitForAsync(() => {
                    component.selectedEditionComplex$ = observableOf(expectedSelectedEditionComplex);

                    // Trigger data binding
                    fixture.detectChanges();
                }));

                it('... should have one div.awg-edition-complex', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex', 1, 1);
                });

                it('... should have an h6, an h3 and a responsibility div in div.awg-edition-complex', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex', 1, 1);

                    getAndExpectDebugElementByCss(divDes[0], 'h6', 1, 1);
                    getAndExpectDebugElementByCss(divDes[0], 'h3.awg-edition-info-header', 1, 1);
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

                    const expectedBreadCrumb = `${expectedSelectedEditionComplex.edition.short} / ${expectedSelectedEditionComplex.series.full} / ${expectedSelectedEditionComplex.section.full}`;

                    expect(hEl.innerText).toBeTruthy();
                    expect(hEl.innerText).withContext(`should be ${expectedBreadCrumb}`).toBe(expectedBreadCrumb);
                });

                it('... should display edition complex title and catalogue number in awg-edition-info-header', () => {
                    const hDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-complex > h3.awg-edition-info-header',
                        1,
                        1
                    );
                    const titleDes = getAndExpectDebugElementByCss(hDes[0], 'em.awg-edition-info-header-title', 1, 1);
                    const catalogueDes = getAndExpectDebugElementByCss(
                        hDes[0],
                        'span.awg-edition-info-header-catalogue',
                        1,
                        1
                    );
                    const titleEl = titleDes[0].nativeElement;
                    const catalogueEl = catalogueDes[0].nativeElement;

                    const expectedHeaderTitle = expectedSelectedEditionComplex.titleStatement.title;
                    const expectedHeaderCatalogue = expectedSelectedEditionComplex.work.short;

                    expect(titleEl.innerText).toBeTruthy();
                    expect(titleEl.innerText).withContext(`should be ${expectedHeaderTitle}`).toBe(expectedHeaderTitle);

                    expect(catalogueEl.innerText).toBeTruthy();
                    expect(catalogueEl.innerText)
                        .withContext(`should be ${expectedHeaderCatalogue}`)
                        .toBe(expectedHeaderCatalogue);
                });

                it('... should have one paragraph with editor and version in responsibility div', () => {
                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const editors = expectedSelectedEditionComplex.responsibilityStatement.editors;

                    getAndExpectDebugElementByCss(pDes[0], 'span.editor', editors.length, editors.length);
                    getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                });

                it('... should display editor and version in responsibility div', () => {
                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const expectedEditors = expectedSelectedEditionComplex.responsibilityStatement.editors;
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
                        expect(editorEl.href).toBeTruthy();
                        expect(editorEl.href)
                            .withContext(`should be ${expectedEditors[i].homepage}`)
                            .toBe(expectedEditors[i].homepage);

                        expect(editorEl.innerText).toBeTruthy();
                        expect(editorEl.innerText)
                            .withContext(`should be ${expectedEditors[i].name}`)
                            .toBe(expectedEditors[i].name);
                    });

                    expect(versionEl.innerText).toBeTruthy();
                    expect(versionEl.innerText)
                        .withContext(`should be ${expectedSelectedEditionComplex.responsibilityStatement.lastModified}`)
                        .toBe(expectedSelectedEditionComplex.responsibilityStatement.lastModified);
                });
            });

            describe('... if selectedEditionComplex$ and isRowTableView$ are not given, it', () => {
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

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', () => {
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

                    expect(jumbotronCmp.jumbotronId).toBeDefined();
                    expect(jumbotronCmp.jumbotronId).withContext(`should be ${expectedId}`).toBe(expectedId);

                    expect(jumbotronCmp.jumbotronTitle).toBeDefined();
                    expect(jumbotronCmp.jumbotronTitle).withContext(`should be  ${expectedTitle}`).toBe(expectedTitle);
                });

                describe('... breadcrumb header (h6)', () => {
                    it('... should display edition base root (AWG) if no series and section is given', () => {
                        const hDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                            1,
                            1
                        );
                        const hEl = hDes[0].nativeElement;

                        const expectedBreadCrumb = `${expectedEditionRoute.short} /`;

                        expect(hEl.innerText).toBeTruthy();
                        expect(hEl.innerText).withContext(`should be ${expectedBreadCrumb}`).toBe(expectedBreadCrumb);
                    });

                    it('... should display edition series if series, but no section is given', () => {
                        component.selectedEditionSeries$ = observableOf(expectedSelectedEditionSeries);

                        // Trigger data binding
                        fixture.detectChanges();

                        const hDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-series > h6.awg-edition-info-breadcrumb',
                            1,
                            1
                        );
                        const hEl = hDes[0].nativeElement;

                        const expectedBreadCrumb = `${expectedEditionRoute.short} / ${expectedSelectedEditionSeries.series.full} /`;

                        expect(hEl.innerText).toBeTruthy();
                        expect(hEl.innerText).withContext(`should be ${expectedBreadCrumb}`).toBe(expectedBreadCrumb);
                    });

                    it('... should display edition series and section if both are given', () => {
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

                        const expectedBreadCrumb = `${expectedEditionRoute.short} / ${expectedSelectedEditionSeries.series.full} / ${expectedSelectedEditionSection.full}`;

                        expect(hEl.innerText).toBeTruthy();
                        expect(hEl.innerText).withContext(`should be ${expectedBreadCrumb}`).toBe(expectedBreadCrumb);
                    });
                });
            });
        });
    });
});
