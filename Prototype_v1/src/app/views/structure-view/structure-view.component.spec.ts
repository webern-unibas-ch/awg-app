/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StructureViewComponent } from './structure-view.component';
import { HeadingComponent } from '@awg-shared/heading/heading.component';

describe('StructureViewComponent', () => {
    let component: StructureViewComponent;
    let fixture: ComponentFixture<StructureViewComponent>;
    let mockRouter;

    beforeEach(async(() => {
        // router spy object
        // mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockRouter = { navigate: jasmine.createSpy('navigate') };

        TestBed.configureTestingModule({
            declarations: [StructureViewComponent, HeadingComponent],
            providers: [{ provide: Router, useValue: mockRouter }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StructureViewComponent);
        component = fixture.componentInstance;

        // spies on component functions
        spyOn(component, 'routeToSidenav');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have title and id', () => {
        const testStructureTitle = 'Datenstrukturmodell';
        const testStructureId = 'structure';

        expect(component.structureTitle).toBe(testStructureTitle);
        expect(component.structureId).toBe(testStructureId);
    });

    describe('BEFORE initial data binding', () => {
        describe('#routeToSidenav', () => {
            it('... should not have been called', () => {
                expect(component.routeToSidenav).not.toHaveBeenCalled();
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
                expect(component.routeToSidenav).toHaveBeenCalled();
            });

            it('... should tell ROUTER to navigate to structureInfo outlet', () => {
                const route = 'structureInfo';
                const outlet = { outlets: { side: route } };
                // const navigationSpy = mockRouter.navigate as jasmine.Spy;
                /*
                // spyOn(router, 'navigate');
                fixture.detectChanges();
                // trigger router navigation
                // mockRouter.navigate([outlet]);

                fixture.detectChanges();
*/
                component.routeToSidenav();
                /*
                fixture.detectChanges();

                console.log('comp', component);
                console.log('router', mockRouter);

                fixture.detectChanges();

                /*
                // args passed to router.navigate() spy
                console.log('navSpy', navigationSpy.calls);
                const navArgs = navigationSpy.calls.first().args[0];
                console.log('navargs', navArgs);

                // fixture.detectChanges();
*/
                // expecting to navigate to structureInfo outlet
                expect(mockRouter.navigate).not.toHaveBeenCalled();
                expect(mockRouter.navigate).toHaveBeenCalledWith('hero');
                // expect(navArgs[0].outlets.side).toBe(outlet, 'should be `structureInfo`');
            });
        });
    });
});
