/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { DataViewComponent } from './data-view.component';

// mock heading component
@Component({ selector: 'awg-heading', template: '' })
class HeadingStubComponent {
    @Input()
    title: string;
    @Input()
    id: string;
}

describe('DataViewComponent', () => {
    let component: DataViewComponent;
    let fixture: ComponentFixture<DataViewComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockRouter;

    const expectedTitle = 'Suche';
    const expectedId = 'search';

    beforeEach(async(() => {
        // router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [DataViewComponent, HeadingStubComponent, RouterOutletStubComponent],
            providers: [{ provide: Router, useValue: mockRouter }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'routeToSidenav').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should have title and id', () => {
            expect(component.searchTitle).toBeDefined();
            expect(component.searchTitle).toBe(expectedTitle);

            expect(component.searchId).toBeDefined();
            expect(component.searchId).toBe(expectedId);
        });

        describe('#routeToSidenav', () => {
            it('... should not have been called', () => {
                expect(component.routeToSidenav).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one heading component (stubbed)', () => {
                const headingDes = compDe.queryAll(By.directive(HeadingStubComponent));

                expect(headingDes).toBeTruthy();
                expect(headingDes.length).toBe(1, 'should have only one heading');
            });

            it('... should contain one help block div', () => {
                const divEl = compEl.querySelectorAll('div.help-block');

                expect(divEl).toBeDefined();
                expect(divEl.length).toBe(1, 'should have one `div.help-block`');
            });

            it('... should contain one router outlet (stubbed)', () => {
                const routletDe = compDe.queryAll(By.directive(RouterOutletStubComponent));

                expect(routletDe).toBeDefined();
                expect(routletDe.length).toBe(1, 'should have one router outlet');
            });

            it('... should not pass down `title` and `id` to heading component', () => {
                const headingDe = compDe.query(By.directive(HeadingStubComponent));
                const headingCmp = headingDe.injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeUndefined();
                expect(headingCmp.id).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('#routeToSideNav', () => {
            let navigationSpy;

            beforeEach(() => {
                // create spy of mockrouter SpyObj
                navigationSpy = mockRouter.navigate as jasmine.Spy;
            });

            it('... should have been called', () => {
                // router navigation triggerd by onInit
                expect(component.routeToSidenav).toHaveBeenCalled();
            });

            it('... should have triggered `router.navigate`', () => {
                expect(navigationSpy).toHaveBeenCalled();
                expect(navigationSpy.calls.any()).toEqual(true, 'has any calls');
                expect(navigationSpy.calls.count()).toEqual(1, 'has been called only once');
            });

            it('... should tell ROUTER to navigate to `searchInfo` outlet', () => {
                const expectedRoute = 'searchInfo';

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
            it('... should pass down `title` and `id` to heading component', () => {
                const headingDe = compDe.query(By.directive(HeadingStubComponent));
                const headingCmp = headingDe.injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeTruthy();
                expect(headingCmp.title).toBe(expectedTitle, `should have title: ${expectedTitle}`);

                expect(headingCmp.id).toBeTruthy();
                expect(headingCmp.id).toBe(expectedId, `should have id: ${expectedId}`);
            });
        });
    });
});
