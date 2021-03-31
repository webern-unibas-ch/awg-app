import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { customJasmineMatchers } from '@testing/custom-matchers';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective, RouterOutletStubComponent } from '@testing/router-stubs';

import { ViewContainerComponent } from './view-container.component';

describe('ViewContainerComponent (DONE)', () => {
    let component: ViewContainerComponent;
    let fixture: ComponentFixture<ViewContainerComponent>;
    let compDe: DebugElement;
    let compEl: any;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ViewContainerComponent, RouterLinkStubDirective, RouterOutletStubComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        // add custom jasmine matchers (ToHaveCssClass)
        jasmine.addMatchers(customJasmineMatchers);

        fixture = TestBed.createComponent(ViewContainerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        describe('VIEW', () => {
            it('... should contain two child divs in `div.row` in `div.container-fluid`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row > div', 2, 2);
                const divEl0 = divDes[0].nativeElement;
                const divEl1 = divDes[1].nativeElement;

                expect(divEl0).toHaveCssClass('awg-maincontent');
                expect(divEl1).toHaveCssClass('awg-sidenav');
            });

            it('... should contain two router outlets (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 2, 2);
            });

            it('... should contain only one named router outlet (stubbed)', () => {
                const routletDes = getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 2, 2);

                // main outlet should not be named
                expect(routletDes[0].attributes).toBeDefined();
                expect(routletDes[0].attributes.name).not.toBeDefined();

                // secondary outlet should be named 'side'
                expect(routletDes[1].attributes).toBeDefined();
                expect(routletDes[1].attributes.name).toBeDefined();
                expect(routletDes[1].attributes.name).toBe('side', 'should have name `side`');
            });
        });
    });
});
