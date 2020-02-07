/* tslint:disable:no-unused-variable */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { of as observableOf } from 'rxjs';

import Spy = jasmine.Spy;

import { getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { RouterEventsService } from '@awg-core/services';
import { AppComponent } from './app.component';

// analytics global
(window as any).ga = () => {};

// mock components
@Component({ selector: 'awg-navbar', template: '' })
class NavbarStubComponent {}

@Component({ selector: 'awg-view-container', template: '' })
class ViewContainerStubComponent {}

@Component({ selector: 'awg-footer', template: '' })
class FooterStubComponent {}

class MockRouter {
    // Router
    events = observableOf(new NavigationEnd(0, 'testUrl', 'testUrl'), [0, 0], 'testString');
}

describe('AppComponent (DONE)', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let router: Router;

    let getPreviousRouteSpy: Spy;

    beforeEach(async(() => {
        // create a fake RouterEventsService object with a `getPreviousRoute` spy
        const mockRouterEventsService = jasmine.createSpyObj('RouterEventsService', ['getPreviousRoute']);
        // make the spies return a synchronous Observable with the test data
        getPreviousRouteSpy = mockRouterEventsService.getPreviousRoute.and.returnValue(observableOf(''));

        TestBed.configureTestingModule({
            declarations: [AppComponent, FooterStubComponent, NavbarStubComponent, ViewContainerStubComponent],
            providers: [
                { provide: Router, useClass: MockRouter },
                { provide: RouterEventsService, useValue: mockRouterEventsService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        // window spy object (GoogleAnalytics)
        (window as any).ga = jasmine.createSpy('ga');

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        router = compDe.injector.get(Router);
    });

    afterEach(() => {
        (window as any).ga = undefined;
    });

    it('should create the app', async(() => {
        expect(component).toBeTruthy();
    }));

    describe('BEFORE initial data binding', () => {
        describe('VIEW', () => {
            it('... should contain one header component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, NavbarStubComponent, 1, 1);
            });

            it('... should contain one view container component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ViewContainerStubComponent, 1, 1);
            });

            it('... should contain one footer component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, FooterStubComponent, 1, 1);
            });
        });
    });
});
