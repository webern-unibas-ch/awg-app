import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ViewContainerComponent } from './view-container.component';

describe('ViewContainerComponent (DONE)', () => {
    let component: ViewContainerComponent;
    let fixture: ComponentFixture<ViewContainerComponent>;
    let compDe: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ViewContainerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Create component fixture
        fixture = TestBed.createComponent(ViewContainerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `activateSideOutlet`', () => {
            expectToBe(isSignal(component.activateSideOutlet), true);

            expect(() => component.activateSideOutlet()).toThrow();
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

                expectToNotContain(divEl.classList, 'justify-content-center');
            });

            it('... should contain one child div (maincontent) in `div.row`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row > div', 1, 1);
                const divEl0: HTMLDivElement = divDes[0].nativeElement;

                expectToContain(divEl0.classList, 'awg-maincontent');
            });

            it('... should contain one router outlet', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutlet, 1, 1);
            });

            it('... should contain only unnamed router outlet', () => {
                const routletDes = getAndExpectDebugElementByDirective(compDe, RouterOutlet, 1, 1);

                // Main outlet should not be named
                expect(routletDes[0].attributes).toBeDefined();
                expect(routletDes[0].attributes['name']).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        describe('... with `activateSideOutlet=false`', () => {
            beforeEach(() => {
                // Set the initial values for the signal inputs
                fixture.componentRef.setInput('activateSideOutlet', false);

                // Trigger initial data binding
                fixture.detectChanges();
            });

            it('... should have input signal `activateSideOutlet` to hold false', () => {
                expectToBe(component.activateSideOutlet(), false);
            });

            describe('VIEW', () => {
                it('... should have class `justify-content-center` on `div.row`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expectToContain(divEl.classList, 'justify-content-center');
                });

                it('... should contain one child div in `div.row`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row > div', 1, 1);
                    const divEl0: HTMLDivElement = divDes[0].nativeElement;

                    expectToContain(divEl0.classList, 'awg-maincontent');
                });

                it('... should have correct grid classes on `div.awg-maincontent`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-maincontent', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expectToContain(divEl.classList, 'col-md-10');
                    expectToNotContain(divEl.classList, 'col-md-8');
                    expectToNotContain(divEl.classList, 'col-xl-9');
                });

                it('... should contain one router outlet', () => {
                    getAndExpectDebugElementByDirective(compDe, RouterOutlet, 1, 1);
                });

                it('... should contain only unnamed router outlet', () => {
                    const routletDes = getAndExpectDebugElementByDirective(compDe, RouterOutlet, 1, 1);

                    // Main outlet should not be named
                    expect(routletDes[0].attributes).toBeDefined();
                    expect(routletDes[0].attributes['name']).toBeUndefined();
                });
            });
        });

        describe('... with `activateSideOutlet=true`', () => {
            beforeEach(() => {
                // Set the initial values for the signal inputs
                fixture.componentRef.setInput('activateSideOutlet', true);

                // Trigger initial data binding
                fixture.detectChanges();
            });

            it('... should have input signal `activateSideOutlet` to hold true', () => {
                expectToBe(component.activateSideOutlet(), true);
            });

            describe('VIEW', () => {
                it('... should not have class `justify-content-center` on `div.row`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expectToNotContain(divEl.classList, 'justify-content-center');
                });

                it('... should contain two child divs in `div.row`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.container-fluid > div.row > div', 2, 2);
                    const divEl0: HTMLDivElement = divDes[0].nativeElement;
                    const divEl1: HTMLDivElement = divDes[1].nativeElement;

                    expectToContain(divEl0.classList, 'awg-maincontent');
                    expectToContain(divEl1.classList, 'awg-side-outlet');
                });

                it('... should have correct grid classes on `div.awg-maincontent`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-maincontent', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expectToContain(divEl.classList, 'col-md-8');
                    expectToContain(divEl.classList, 'col-xl-9');
                    expectToNotContain(divEl.classList, 'col-md-10');
                });

                it('... should have correct grid classes on `div.awg-side-outlet`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-side-outlet', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expectToContain(divEl.classList, 'col-md-4');
                    expectToContain(divEl.classList, 'col-xl-3');
                    expectToContain(divEl.classList, 'order-first');
                });

                it('... should contain two router outlets', () => {
                    getAndExpectDebugElementByDirective(compDe, RouterOutlet, 2, 2);
                });

                it('... should contain only one named router outlet', () => {
                    const routletDes = getAndExpectDebugElementByDirective(compDe, RouterOutlet, 2, 2);

                    // Main outlet should not be named
                    expect(routletDes[0].attributes).toBeDefined();
                    expect(routletDes[0].attributes['name']).toBeUndefined();

                    // Secondary outlet should be named 'side'
                    expect(routletDes[1].attributes).toBeDefined();
                    expectToBe(routletDes[1].attributes['name'], 'side');
                });
            });
        });
    });
});
