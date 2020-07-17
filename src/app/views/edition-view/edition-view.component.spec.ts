/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { of as observableOf } from 'rxjs';
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

describe('EditionViewComponent', () => {
    let component: EditionViewComponent;
    let fixture: ComponentFixture<EditionViewComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockRouter;
    let mockActivatedRoute: ActivatedRouteStub;
    let mockEditionService: Partial<EditionService>;

    let routeToSidenavSpy: Spy;

    let expectedWork: EditionWork;

    const expectedTitle = 'Beispieledition ausgewählter Skizzen';
    const expectedId = 'awg-edition-view';

    beforeEach(async(() => {
        // router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        // mocked activated route
        mockActivatedRoute = new ActivatedRouteStub({ compositionId: 'op12' });

        // stub service for test purposes
        mockEditionService = {
            getEditionWork: () => observableOf(expectedWork),
            updateEditionWork: (work: EditionWork) => {
                expectedWork = work;
            }
        };

        TestBed.configureTestingModule({
            declarations: [EditionViewComponent, HeadingStubComponent, RouterOutletStubComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter },
                { provide: EditionService, useValue: mockEditionService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedWork = EditionWorks.op12;

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        routeToSidenavSpy = spyOn(component, 'routeToSidenav').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected editionService should not be the same', () => {
        const editionService = TestBed.inject(EditionService);
        expect(mockEditionService === editionService).toBe(false);
    });

    it('changing the stub service has no effect on the injected service', () => {
        const editionService = TestBed.inject(EditionService);
        const changedEditionWork: EditionWork = EditionWorks.op25;
        mockEditionService.updateEditionWork(changedEditionWork);

        mockEditionService.getEditionWork().subscribe((result: EditionWork) => {
            expect(result).toBe(changedEditionWork);
        });
        editionService.getEditionWork().subscribe((result: EditionWork) => {
            expect(result).toBe(expectedWork);
        });
    });

    describe('BEFORE initial data binding', () => {
        it('should have title and id', () => {
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

        it('... should not have `editionWork$` yet', () => {
            expect(component.editionWork$).toBeUndefined();
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
            // trigger initial data binding
            fixture.detectChanges();
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

        it('... should pass down `title` and `id` to heading component', () => {
            const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
            const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

            expect(headingCmp.title).toBeTruthy();
            expect(headingCmp.title).toBe(expectedTitle, `should have title: ${expectedTitle}`);

            expect(headingCmp.id).toBeTruthy();
            expect(headingCmp.id).toBe(expectedId, `should have id: ${expectedId}`);
        });

        describe('VIEW', () => {
            it('... should have one div.awg-edition-work with a h6, a h3 and a responsibility div', async(() => {
                fixture.whenStable().then(() => {
                    // wait for async data
                    fixture.detectChanges(); // refresh template

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-work', 1, 1);

                    getAndExpectDebugElementByCss(divDes[0], 'h6', 1, 1);
                    getAndExpectDebugElementByCss(divDes[0], 'h3.awg-edition-info-header', 1, 1);
                    getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-responsibility', 1, 1);
                });
            }));
        });
    });
});
