import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { POPPER_UTILS } from '@awg-shared/utils/popper-utils';

import { ForceGraphLimitComponent } from './force-graph-limit.component';

describe('ForceGraphLimitComponent (DONE)', () => {
    let component: ForceGraphLimitComponent;
    let fixture: ComponentFixture<ForceGraphLimitComponent>;
    let compDe: DebugElement;

    let limitChangeSpy: Mock<(limit: number) => void>;

    const expectedTripleCount = 60;
    const expectedLimit = 50;

    const getCountButtonText = (): string =>
        getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-limit > button[disabled]', 1, 1)[0]
            .nativeElement.textContent.trim()
            .replace(/\s+/g, ' ');
    const getItemDes = (expectedCount: number): DebugElement[] =>
        getAndExpectDebugElementByCss(compDe, 'div.dropdown-menu > button', expectedCount, expectedCount);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ForceGraphLimitComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ForceGraphLimitComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        limitChangeSpy = vi.fn();
        component.limit.subscribe(limitChangeSpy);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `tripleCount`', () => {
            expectToBe(isSignal(component.tripleCount), true);

            expect(() => component.tripleCount()).toThrow();
        });

        it('... should throw due to missing required model signal `limit`', () => {
            expectToBe(isSignal(component.limit), true);

            expect(() => component.limit()).toThrow();
        });

        it('... should have `dropdownPopperOptions`', () => {
            expectToBe(component.dropdownPopperOptions, POPPER_UTILS.fixedDropdownPopperOptions);
        });

        describe('VIEW', () => {
            it('... should contain one button group with a count button, a toggle and a dropdown menu', () => {
                const btnGroupDes = getAndExpectDebugElementByCss(compDe, 'div.btn-group.awg-force-graph-limit', 1, 1);

                getAndExpectDebugElementByCss(btnGroupDes[0], 'button[disabled]', 1, 1);
                getAndExpectDebugElementByCss(btnGroupDes[0], 'button.dropdown-toggle-split', 1, 1);
                getAndExpectDebugElementByCss(btnGroupDes[0], 'div.dropdown-menu', 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('tripleCount', expectedTripleCount);
            fixture.componentRef.setInput('limit', expectedLimit);
            fixture.detectChanges();
        });

        it('... should have input signal `tripleCount` to hold the provided triple count', () => {
            expectToBe(component.tripleCount(), expectedTripleCount);
        });

        it('... should have model signal `limit` to hold the provided limit', () => {
            expectToBe(component.limit(), expectedLimit);
        });

        it('... should have computed signal `limitValues` to hold the limit values below the triple count', () => {
            expectToEqual(component.limitValues(), [5, 10, 25, 50]);
        });

        it('... should have computed signal `isLimited` to hold true for a limit below the triple count', () => {
            expectToBe(component.isLimited(), true);
        });

        it('... should have computed signal `isLimited` to hold false for a limit equal to the triple count', () => {
            fixture.componentRef.setInput('limit', expectedTripleCount);

            expectToBe(component.isLimited(), false);
        });

        describe('VIEW', () => {
            it('... should pass down `dropdownPopperOptions` and no container to the NgbDropdown', () => {
                const btnGroupDes = getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-limit', 1, 1);
                const ngbDropdown = btnGroupDes[0].injector.get(NgbDropdown);

                expectToBe(ngbDropdown.popperOptions, component.dropdownPopperOptions);
                expect(ngbDropdown.container).toBeFalsy();
            });

            it('... should display the limit and the triple count in the count button', () => {
                expectToBe(getCountButtonText(), '50 von 60 Triples');
            });

            it('... should display only the triple count in the count button without limitation', async () => {
                fixture.componentRef.setInput('limit', expectedTripleCount);
                await detectChangesOnPush(fixture);

                expectToBe(getCountButtonText(), '60 Triples');
            });

            it('... should enable the toggle button', () => {
                const toggleDes = getAndExpectDebugElementByCss(compDe, 'button.dropdown-toggle-split', 1, 1);

                expectToBe(toggleDes[0].nativeElement.disabled, false);
            });

            it('... should disable the toggle button without triples', async () => {
                fixture.componentRef.setInput('tripleCount', 0);
                await detectChangesOnPush(fixture);

                const toggleDes = getAndExpectDebugElementByCss(compDe, 'button.dropdown-toggle-split', 1, 1);

                expectToBe(toggleDes[0].nativeElement.disabled, true);
            });

            it('... should contain one item per limit value and one item without limit', () => {
                const itemDes = getItemDes(5);

                expectToEqual(
                    itemDes.map(de => de.nativeElement.textContent.trim()),
                    ['5', '10', '25', '50', 'Kein Limit']
                );
            });

            it('... should contain only the item without limit for a small triple count', async () => {
                fixture.componentRef.setInput('tripleCount', 3);
                await detectChangesOnPush(fixture);

                const itemDes = getItemDes(1);

                expectToBe(itemDes[0].nativeElement.textContent.trim(), 'Kein Limit');
            });

            it('... should set `limit` to the limit value of a clicked item', async () => {
                const itemDes = getItemDes(5);

                await clickAndAwaitChanges(itemDes[1], fixture);

                expectToBe(component.limit(), 10);
                expectSpyCall(limitChangeSpy, 1, 10);
            });

            it('... should set `limit` to the triple count on a click on the item without limit', async () => {
                const itemDes = getItemDes(5);

                await clickAndAwaitChanges(itemDes[4], fixture);

                expectToBe(component.limit(), expectedTripleCount);
                expectSpyCall(limitChangeSpy, 1, expectedTripleCount);
            });
        });
    });
});
