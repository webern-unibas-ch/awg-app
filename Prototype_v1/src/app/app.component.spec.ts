/* tslint:disable:no-unused-variable */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';

// mock components
@Component({ selector: 'awg-navbar', template: '' })
class NavbarStubComponent {}

@Component({ selector: 'awg-view-container', template: '' })
class ViewContainerStubComponent {}

@Component({ selector: 'awg-footer', template: '' })
class FooterStubComponent {}

describe('AppComponent (DONE)', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let compDe: DebugElement;
    let compEl: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent, FooterStubComponent, NavbarStubComponent, ViewContainerStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;
    });

    it('should create the app', async(() => {
        expect(component).toBeTruthy();
    }));

    describe('BEFORE initial data binding', () => {
        describe('VIEW', () => {
            it('... should contain one header component (stubbed)', () => {
                const navbarDes = compDe.queryAll(By.directive(NavbarStubComponent));

                expect(navbarDes).toBeDefined();
                expect(navbarDes.length).toBe(1, 'should have only one navbar');
            });

            it('... should contain one view container component (stubbed)', () => {
                const viewContainerDes = compDe.queryAll(By.directive(ViewContainerStubComponent));

                expect(viewContainerDes).toBeDefined();
                expect(viewContainerDes.length).toBe(1, 'should have only one view container');
            });

            it('... should contain one footer component (stubbed)', () => {
                const footerDes = compDe.queryAll(By.directive(FooterStubComponent));

                expect(footerDes).toBeDefined();
                expect(footerDes.length).toBe(1, 'should have only one footer');
            });
        });
    });
});
