/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { StructureViewComponent } from './structure-view.component';

@Component({ selector: 'awg-heading', template: '' })
class HeadingStubComponent {
    @Input()
    title: string;
    @Input()
    id: string;
}

describe('StructureViewComponent (DONE)', () => {
    let component: StructureViewComponent;
    let fixture: ComponentFixture<StructureViewComponent>;
    let debugElement: DebugElement;
    let el;
    let mockRouter;
    const expectedTitle = 'Datenstrukturmodell';
    const expectedId = 'structure';

    beforeEach(async(() => {
        // router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        // mockRouter = { navigate: jasmine.createSpy('navigate') };

        TestBed.configureTestingModule({
            declarations: [StructureViewComponent, HeadingStubComponent],
            providers: [{ provide: Router, useValue: mockRouter }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StructureViewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        el = debugElement.nativeElement;

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
            expect(component.structureTitle).toBe(expectedTitle);
            expect(component.structureId).toBe(expectedId);
        });

        describe('#routeToSidenav', () => {
            it('... should not have been called', () => {
                expect(component.routeToSidenav).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one heading component (real)', () => {
                const headingDes = debugElement.queryAll(By.directive(HeadingStubComponent));
                expect(headingDes).toBeTruthy();
                expect(headingDes.length).toBe(1, 'should have only one heading');
            });

            it('... should contain 3 `p` & 1 `svg` element', () => {
                const pEl = el.querySelectorAll('p');
                const svgEl = el.querySelectorAll('svg');

                expect(pEl.length).toBe(3, 'should have 3 `p`');
                expect(svgEl.length).toBe(1, 'should have 1 `svg`');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('#routeToSideNav', () => {
            it('... should have been called', () => {
                // router navigation triggerd by onInit
                expect(component.routeToSidenav).toHaveBeenCalled();
            });

            it('... should have triggered `router.navigate`', () => {
                // create spy of mockrouter SpyObj
                const navigationSpy = mockRouter.navigate as jasmine.Spy;

                expect(navigationSpy).toHaveBeenCalled();
                expect(navigationSpy.calls.any()).toEqual(true, 'has any calls');
                expect(navigationSpy.calls.count()).toEqual(1, 'has been called only once');
            });

            it('... should tell ROUTER to navigate to `structureInfo` outlet', () => {
                const expectedRoute = 'structureInfo';

                // create spy of mockrouter SpyObj
                const navigationSpy = mockRouter.navigate as jasmine.Spy;

                // catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const outletRoute = navArgs[0][0].outlets.side;

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
                expect(outletRoute).toBe(expectedRoute, 'should be `structureInfo`');
            });
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading component', () => {
                const headingDe = debugElement.query(By.directive(HeadingStubComponent));
                const headingCmp = headingDe.injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeTruthy();
                expect(headingCmp.title).toBe(expectedTitle, 'should have title: `Datenstrukturmodell`');

                expect(headingCmp.id).toBeTruthy();
                expect(headingCmp.id).toBe(expectedId, 'should have id: `structure`');
            });
        });
    });
});
