import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectToBe,
    expectToContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective, RouterOutletStubComponent } from '@testing/router-stubs';

import { ViewContainerComponent } from './view-container.component';

describe('ViewContainerComponent (DONE)', () => {
    let component: ViewContainerComponent;
    let fixture: ComponentFixture<ViewContainerComponent>;
    let compDe: DebugElement;

    let expectedActivateSideOutlet: boolean;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ViewContainerComponent, RouterLinkStubDirective, RouterOutletStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewContainerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedActivateSideOutlet = true;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `activateSideOutlet`', () => {
            expect(component.activateSideOutlet).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one `div.container-fluid`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.container-fluid', 1, 1);
            });

            it('... should contain one `div.row` in `div.container-fluid`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row', 1, 1);
            });

            it('... should not have class `justify-content-center` on `div.row`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row', 1, 1);
                const divEl: HTMLDivElement = divDes[0].nativeElement;

                expect(divEl.classList).not.toContain('justify-content-center');
            });

            it('... should contain one child div (maincontent) in `div.row`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row > div', 1, 1);
                const divEl0: HTMLDivElement = divDes[0].nativeElement;

                expect(divEl0).toHaveClass('awg-maincontent');
            });

            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });

            it('... should contain only unnamed router outlet (stubbed)', () => {
                const routletDes = getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);

                // Main outlet should not be named
                expect(routletDes[0].attributes).toBeDefined();
                expect(routletDes[0].attributes['name']).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent component setting the input
            component.activateSideOutlet = expectedActivateSideOutlet;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            describe('... with `showSideOutlet=true`', () => {
                it('... should not have class `justify-content-center` on `div.row`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expect(divEl.classList).not.toContain('justify-content-center');
                });

                it('... should contain two child divs in `div.row`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row > div', 2, 2);
                    const divEl0: HTMLDivElement = divDes[0].nativeElement;
                    const divEl1: HTMLDivElement = divDes[1].nativeElement;

                    expect(divEl0).toHaveClass('awg-maincontent');
                    expect(divEl1).toHaveClass('awg-side-outlet');
                });

                it('... should have correct grid classes on `div.awg-maincontent`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-maincontent', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expectToContain(divEl.classList, 'col-md-8');
                    expectToContain(divEl.classList, 'col-xl-9');
                    expect(divEl.classList).not.toContain('col-md-10');
                });

                it('... should have correct grid classes on `div.awg-side-outlet`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-side-outlet', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expectToContain(divEl.classList, 'col-md-4');
                    expectToContain(divEl.classList, 'col-xl-3');
                    expectToContain(divEl.classList, 'order-first');
                });

                it('... should contain two router outlets (stubbed)', () => {
                    getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 2, 2);
                });

                it('... should contain only one named router outlet (stubbed)', () => {
                    const routletDes = getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 2, 2);

                    // Main outlet should not be named
                    expect(routletDes[0].attributes).toBeDefined();
                    expect(routletDes[0].attributes['name']).toBeUndefined();

                    // Secondary outlet should be named 'side'
                    expect(routletDes[1].attributes).toBeDefined();
                    expectToBe(routletDes[1].attributes['name'], 'side');
                });
            });

            describe('... with `showSideOutlet=false`', () => {
                beforeEach(() => {
                    // Simulate the parent component setting the input
                    component.activateSideOutlet = false;

                    // Trigger initial data binding
                    fixture.detectChanges();
                });

                it('... should have class `justify-content-center` on `div.row`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expectToContain(divEl.classList, 'justify-content-center');
                });

                it('... should contain one child div in `div.row`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row > div', 1, 1);
                    const divEl0: HTMLDivElement = divDes[0].nativeElement;

                    expect(divEl0).toHaveClass('awg-maincontent');
                });

                it('... should have correct grid classes on `div.awg-maincontent`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-maincontent', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expectToContain(divEl.classList, 'col-md-10');
                    expect(divEl.classList).not.toContain('col-md-8');
                    expect(divEl.classList).not.toContain('col-xl-9');
                });

                it('... should contain one router outlet (stubbed)', () => {
                    getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
                });

                it('... should contain only unnamed router outlet (stubbed)', () => {
                    const routletDes = getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);

                    // Main outlet should not be named
                    expect(routletDes[0].attributes).toBeDefined();
                    expect(routletDes[0].attributes['name']).toBeUndefined();
                });
            });
        });
    });
});
