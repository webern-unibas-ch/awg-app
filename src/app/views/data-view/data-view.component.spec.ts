/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    expectToBe,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { DataViewComponent } from './data-view.component';

// Mock heading component
@Component({ selector: 'awg-heading', template: '' })
class HeadingStubComponent {
    @Input()
    title: string;
    @Input()
    id: string;
}

describe('DataViewComponent (DONE)', () => {
    let component: DataViewComponent;
    let fixture: ComponentFixture<DataViewComponent>;
    let compDe: DebugElement;

    let mockRouter: Partial<Router>;

    const expectedTitle = 'Suche';
    const expectedId = 'search';

    beforeEach(waitForAsync(() => {
        // Router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [DataViewComponent, HeadingStubComponent, RouterOutletStubComponent],
            providers: [{ provide: Router, useValue: mockRouter }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'routeToSideOutlet').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have title and id', () => {
            expectToBe(component.searchTitle, expectedTitle);
            expectToBe(component.searchId, expectedId);
        });

        describe('#routeToSideOutlet()', () => {
            it('... should have a method `routeToSideOutlet`', () => {
                expect(component.routeToSideOutlet).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.routeToSideOutlet).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-data-view`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-data-view', 1, 1);
            });

            it('... should contain one heading component (stubbed) in `div.awg-data-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-data-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
            });

            it('... should not pass down `title` and `id` to heading component', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-data-view', 1, 1);
                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeUndefined();
                expect(headingCmp.id).toBeUndefined();
            });

            it('... should contain one help block div in `div.awg-data-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-data-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.help-block', 1, 1);
            });

            it('... should contain one router outlet (stubbed) in `div.awg-data-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-data-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], RouterOutletStubComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#routeToSideOutlet()', () => {
            let navigationSpy: Spy;

            beforeEach(() => {
                // Create spy of mockrouter SpyObj
                navigationSpy = mockRouter.navigate as jasmine.Spy;
            });

            it('... should have been called', () => {
                // Router navigation triggerd by onInit
                expect(component.routeToSideOutlet).toHaveBeenCalled();
            });

            it('... should have triggered `router.navigate`', () => {
                expectSpyCall(navigationSpy, 1);
            });

            it('... should tell ROUTER to navigate to `searchInfo` outlet', () => {
                const expectedRoute = 'searchInfo';

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

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading component', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-data-view', 1, 1);
                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expectToBe(headingCmp.title, expectedTitle);
                expectToBe(headingCmp.id, expectedId);
            });
        });
    });
});
