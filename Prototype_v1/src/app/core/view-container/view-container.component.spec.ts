import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterLinkStubDirective, RouterOutletStubComponent } from 'testing/router-stubs';

import { ViewContainerComponent } from './view-container.component';

describe('ViewContainerComponent (DONE)', () => {
    let component: ViewContainerComponent;
    let fixture: ComponentFixture<ViewContainerComponent>;
    let compDe: DebugElement;
    let compEl: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ViewContainerComponent, RouterLinkStubDirective, RouterOutletStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewContainerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        describe('VIEW', () => {
            it('... should contain two child divs in `div.row` in `div.container-fluid`', () => {
                const divDe = compDe.queryAll(By.css('div.container-fluid > div.row > div'));

                expect(divDe).toBeDefined();
                expect(divDe.length).toBe(2, 'should have 2 child divs of `div.row`');

                expect(divDe[0].attributes).toBeDefined();
                expect(divDe[0].attributes.class).toBeDefined();
                expect(divDe[0].attributes.class).toContain('awg-sidenav', 'should have awg-sidenav class');

                expect(divDe[1].attributes).toBeDefined();
                expect(divDe[1].attributes.class).toBeDefined();
                expect(divDe[1].attributes.class).toContain('awg-maincontent', 'should have awg-maincontent class');
            });

            it('... should contain two router outlets (stubbed)', () => {
                const routletDe = compDe.queryAll(By.directive(RouterOutletStubComponent));

                expect(routletDe).toBeDefined();
                expect(routletDe.length).toBe(2, 'should have 2 router outlets');
            });

            it('... should contain only one named router outlet (stubbed)', () => {
                const routletDe = compDe.queryAll(By.directive(RouterOutletStubComponent));

                // first outlet should be named 'side'
                expect(routletDe[0].attributes).toBeDefined();
                expect(routletDe[0].attributes.name).toBeDefined();
                expect(routletDe[0].attributes.name).toBe('side', 'should have name `side`');

                // second outlet should not be named
                expect(routletDe[1].attributes).toBeDefined();
                expect(routletDe[1].attributes.name).not.toBeDefined();
            });
        });
    });
});
