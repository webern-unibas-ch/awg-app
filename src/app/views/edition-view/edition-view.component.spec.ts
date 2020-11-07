/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';
import { ActivatedRouteStub, RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionService } from '@awg-views/edition-view/services';
import { EditionWork, EditionWorks } from '@awg-views/edition-view/models';

import { EditionViewComponent } from './edition-view.component';

// mock heading component
@Component({ selector: 'awg-heading', template: '' })
class HeadingStubComponent {
    @Input()
    title: string;
    @Input()
    id: string;
}

describe('EditionViewComponent (DONE)', () => {
    let component: EditionViewComponent;
    let fixture: ComponentFixture<EditionViewComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockRouter;
    let mockActivatedRoute: ActivatedRouteStub;
    let mockEditionService: Partial<EditionService>;

    let getEditionWorkFromRouteSpy: Spy;
    let routeToSidenavSpy: Spy;

    let editionServiceGetWorkSpy: Spy;
    let editionServiceUpdateWorkSpy: Spy;

    let expectedWorkId = 'op12';
    let expectedWork: EditionWork;

    const expectedTitle = 'Beispieledition ausgewählter Skizzen';
    const expectedId = 'awg-edition-view';

    beforeEach(
        waitForAsync(() => {
            // mock router with spy object
            mockRouter = jasmine.createSpyObj('Router', ['navigate']);

            // mock activated route with stub class
            mockActivatedRoute = new ActivatedRouteStub();

            // mock edition service
            mockEditionService = {
                getEditionWork: (): Observable<EditionWork> => {
                    // return op. 12 by default
                    return observableOf(EditionWorks[expectedWorkId]);
                },
                updateEditionWork: (editionWork: EditionWork): void => {}
            };

            TestBed.configureTestingModule({
                declarations: [EditionViewComponent, HeadingStubComponent, RouterOutletStubComponent],
                providers: [
                    { provide: EditionService, useValue: mockEditionService },
                    {
                        provide: ActivatedRoute,
                        useValue: mockActivatedRoute
                    },
                    { provide: Router, useValue: mockRouter }
                ]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        mockEditionService = TestBed.inject(EditionService);

        // test data
        expectedWork = EditionWorks[expectedWorkId]; // op. 12

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getEditionWorkFromRouteSpy = spyOn(component, 'getEditionWorkFromRoute').and.callThrough();
        routeToSidenavSpy = spyOn(component, 'routeToSidenav').and.callThrough();

        // spies for service methods
        editionServiceUpdateWorkSpy = spyOn(mockEditionService, 'updateEditionWork').and.callThrough();
        editionServiceGetWorkSpy = spyOn(mockEditionService, 'getEditionWork').and.callThrough();
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
            expect(component.editionViewTitle).toBe(expectedTitle);

            expect(component.editionViewId).toBeDefined();
            expect(component.editionViewId).toBe(expectedId);
        });

        it('... should not pass down `title` and `id` to heading component', () => {
            const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
            const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

            expect(headingCmp.title).toBeUndefined();
            expect(headingCmp.id).toBeUndefined();
        });

        describe('#getEditionWorkFromRoute', () => {
            it('... should not have been called', () => {
                expectSpyCall(getEditionWorkFromRouteSpy, 0);
            });

            it('... should not have called EditionService', () => {
                expectSpyCall(editionServiceUpdateWorkSpy, 0);
                expectSpyCall(editionServiceGetWorkSpy, 0);
            });

            it('... should not have set editionWork$', () => {
                expect(component.editionWork$).toBeUndefined();
            });
        });

        describe('#routeToSidenav', () => {
            it('... should not have been called', () => {
                expectSpyCall(routeToSidenavSpy, 0);
            });
        });

        describe('VIEW', () => {
            it('... should contain one heading component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
            });

            it('... should have no div.awg-edition-work yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-work', 0, 0);
            });

            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // set route params via ActivatedRoute mock
            expectedWorkId = 'op12';
            mockActivatedRoute.testParamMap = { compositionId: expectedWorkId }; // op. 12

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('... should pass down `title` and `id` to heading component', () => {
            const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
            const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

            expect(headingCmp.title).toBeTruthy();
            expect(headingCmp.title).toBe(expectedTitle, `should have title: ${expectedTitle}`);

            expect(headingCmp.id).toBeTruthy();
            expect(headingCmp.id).toBe(expectedId, `should have id: ${expectedId}`);
        });

        describe('#getEditionWorkFromRoute', () => {
            it('... should have been called', () => {
                expectSpyCall(getEditionWorkFromRouteSpy, 1);
            });

            it('... should get id from router', () => {
                expectSpyCall(getEditionWorkFromRouteSpy, 1);

                expectSpyCall(editionServiceUpdateWorkSpy, 1, EditionWorks[expectedWorkId]);
            });

            it('... should get correct id from router', () => {
                // call with op. 12 (default)
                expectSpyCall(getEditionWorkFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateWorkSpy, 1, EditionWorks['op12']);

                // ----------------
                // change to op. 25
                mockActivatedRoute.testParamMap = { compositionId: 'op25' };

                // trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionWorkFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateWorkSpy, 2, EditionWorks['op25']);

                // ------------------
                // change to non-existing id
                mockActivatedRoute.testParamMap = { compositionId: 'fail' };

                // trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionWorkFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateWorkSpy, 3, EditionWorks['fail']);

                // ------------------
                // change to empty id
                mockActivatedRoute.testParamMap = { compositionId: '' };

                // trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionWorkFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateWorkSpy, 4, EditionWorks['']);

                // ----------------------
                // change to another key
                mockActivatedRoute.testParamMap = { anotherId: 'op12' };

                // trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionWorkFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateWorkSpy, 5, EditionWorks['']);
            });

            it('... should have updated edition work (via EditionService)', () => {
                expectSpyCall(getEditionWorkFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateWorkSpy, 1, EditionWorks[expectedWorkId]);
            });

            it('... should get edition work from EditionService and set editionWork', done => {
                expectSpyCall(getEditionWorkFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateWorkSpy, 1, EditionWorks[expectedWorkId]);
                expectSpyCall(editionServiceGetWorkSpy, 1);

                expect(component.editionWork$).toBeDefined();

                component.editionWork$.subscribe((work: EditionWork) => {
                    expect(work).toEqual(EditionWorks[expectedWorkId]);
                    done();
                });
            });

            it('... should get correct edition work from EditionService and set correct editionWork', done => {
                // ----------------
                // check for op. 12
                expectSpyCall(getEditionWorkFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateWorkSpy, 1, EditionWorks[expectedWorkId]);
                expectSpyCall(editionServiceGetWorkSpy, 1);

                // subscribe to editionWork observable (changed values will be reflected here)
                expect(component.editionWork$).toBeDefined();
                let sub = component.editionWork$.subscribe(work => {
                    expect(work).toEqual(EditionWorks[expectedWorkId], `should equal ${EditionWorks[expectedWorkId]}`);
                    done();
                });

                sub.unsubscribe();

                // ----------------
                // change to op. 25
                expectedWorkId = 'op25';
                mockActivatedRoute.testParamMap = { compositionId: expectedWorkId };

                // apply changes
                fixture.detectChanges();

                expectSpyCall(getEditionWorkFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateWorkSpy, 2, EditionWorks[expectedWorkId]);
                expectSpyCall(editionServiceGetWorkSpy, 2);

                expect(component.editionWork$).toBeDefined();
                sub = component.editionWork$.subscribe(work => {
                    expect(work).toEqual(EditionWorks['op25'], `should equal ${EditionWorks['op25']}`);
                    done();
                });

                sub.unsubscribe();

                // ----------------
                // change to ''
                expectedWorkId = '';
                mockActivatedRoute.testParamMap = { compositionId: expectedWorkId };

                // apply changes
                fixture.detectChanges();

                expectSpyCall(getEditionWorkFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateWorkSpy, 3, EditionWorks[expectedWorkId]);
                expectSpyCall(editionServiceGetWorkSpy, 3);

                expect(component.editionWork$).toBeDefined();
                sub = component.editionWork$.subscribe(work => {
                    expect(work).toEqual(EditionWorks[''], `should equal ${EditionWorks['']}`);
                    done();
                });

                sub.unsubscribe();
            });
        });

        describe('#routeToSideNav', () => {
            let navigationSpy: Spy;

            beforeEach(() => {
                // create spy of mockrouter SpyObj
                navigationSpy = mockRouter.navigate as jasmine.Spy;
            });

            it('... should have been called', () => {
                // router navigation triggerd by onInit
                expectSpyCall(routeToSidenavSpy, 1);
            });

            it('... should have triggered `router.navigate`', () => {
                expectSpyCall(navigationSpy, 1);
            });

            it('... should tell ROUTER to navigate to `editionInfo` outlet', () => {
                const expectedRoute = 'editionInfo';

                // catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const outletRoute = navArgs[0][0].outlets.side;

                expect(navArgs).toBeDefined('should have navArgs');
                expect(navArgs[0]).toBeDefined('should have navCommand');
                expect(outletRoute).toBeDefined('should have outletRoute');
                expect(outletRoute).toBe(expectedRoute, `should be: ${expectedRoute}`);

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).toBeDefined('should have navExtras');
                expect(navExtras.preserveFragment).toBeDefined('should have preserveFragment extra');
                expect(navExtras.preserveFragment).toBe(true, 'should be `preserveFragment:true`');

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });

        describe('VIEW', () => {
            it('... should have one div.awg-edition-work with a h6, a h3 and a responsibility div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-work', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'h6', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'h3.awg-edition-info-header', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-responsibility', 1, 1);
            });

            it(
                '... should display editionWork in breadcrumb header (h6)',
                waitForAsync(() => {
                    // wait for async data
                    fixture.detectChanges(); // refresh template

                    const hDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-work > h6.awg-edition-info-breadcrumb',
                        1,
                        1
                    );
                    const hEl = hDes[0].nativeElement;

                    const expectedBreadCrumb = `${expectedWork.edition.short} / ${expectedWork.series.full} / ${expectedWork.section.full}`;

                    expect(hEl.innerText).toBeTruthy();
                    expect(hEl.innerText).toBe(expectedBreadCrumb, `should be ${expectedBreadCrumb}`);
                })
            );

            it(
                '... should display editionWork title and catalogue number in awg-edition-info-header',
                waitForAsync(() => {
                    // wait for async data
                    fixture.detectChanges(); // refresh template

                    const hDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-work > h3.awg-edition-info-header',
                        1,
                        1
                    );
                    const titleDes = getAndExpectDebugElementByCss(hDes[0], 'i.awg-edition-info-header-title', 1, 1);
                    const catalogueDes = getAndExpectDebugElementByCss(
                        hDes[0],
                        'span.awg-edition-info-header-catalogue',
                        1,
                        1
                    );
                    const titleEl = titleDes[0].nativeElement;
                    const catalogueEl = catalogueDes[0].nativeElement;

                    const expectedHeaderTitle = expectedWork.titleStatement.title;
                    const expectedHeaderCatalogue = expectedWork.work.short;

                    expect(titleEl.innerText).toBeTruthy();
                    expect(titleEl.innerText).toBe(expectedHeaderTitle, `should be ${expectedHeaderTitle}`);

                    expect(catalogueEl.innerText).toBeTruthy();
                    expect(catalogueEl.innerText).toBe(expectedHeaderCatalogue, `should be ${expectedHeaderCatalogue}`);
                })
            );

            it(
                '... should have one paragraph with editor and version in responsibility div',
                waitForAsync(() => {
                    // wait for async data
                    fixture.detectChanges(); // refresh template

                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const editors = expectedWork.responsibilityStatement.editors;

                    getAndExpectDebugElementByCss(pDes[0], 'span.editor', editors.length, editors.length);
                    getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                })
            );

            it(
                '... should display editor and version in responsibility div',
                waitForAsync(() => {
                    // wait for async data
                    fixture.detectChanges(); // refresh template

                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const expectedEditors = expectedWork.responsibilityStatement.editors;
                    const editorDes = getAndExpectDebugElementByCss(
                        pDes[0],
                        'span.editor > a',
                        expectedEditors.length,
                        expectedEditors.length,
                        'in responsibility div'
                    );
                    const versionDes = getAndExpectDebugElementByCss(
                        pDes[0],
                        'span.version',
                        1,
                        1,
                        'in responsibility div'
                    );

                    const editorEls = editorDes.map(editor => editor.nativeElement);
                    const versionEl = versionDes[0].nativeElement;

                    editorEls.forEach((editorEl, i: number) => {
                        expect(editorEl.href).toBeTruthy();
                        expect(editorEl.href).toBe(
                            expectedEditors[i].homepage,
                            `should be ${expectedEditors[i].homepage}`
                        );

                        expect(editorEl.innerText).toBeTruthy();
                        expect(editorEl.innerText).toBe(
                            expectedEditors[i].name,
                            `should be ${expectedEditors[i].name}`
                        );
                    });

                    expect(versionEl.innerText).toBeTruthy();
                    expect(versionEl.innerText).toBe(
                        expectedWork.responsibilityStatement.lastModified,
                        `should be ${expectedWork.responsibilityStatement.lastModified}`
                    );
                })
            );
        });
    });
});
