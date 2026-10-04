import { Component, DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { FormSwitchComponent } from './form-switch.component';

@Component({
    template: `<awg-form-switch inputId="test-switch" [checked]="true"
        ><span class="test-label">Label</span></awg-form-switch
    >`,
    imports: [FormSwitchComponent],
})
class FormSwitchTestHostComponent {}

describe('FormSwitchComponent (DONE)', () => {
    let component: FormSwitchComponent;
    let fixture: ComponentFixture<FormSwitchComponent>;
    let compDe: DebugElement;

    let checkedChangeSpy: Mock<(isChecked: boolean) => void>;

    let expectedInputId: string;

    const getFormSwitchDes = () => getAndExpectDebugElementByCss(compDe, 'div.form-check.form-switch', 1, 1);
    const getInputEl = (): HTMLInputElement =>
        getAndExpectDebugElementByCss(getFormSwitchDes()[0], 'input.form-check-input', 1, 1)[0].nativeElement;
    const getLabelEl = (): HTMLLabelElement =>
        getAndExpectDebugElementByCss(getFormSwitchDes()[0], 'label.form-check-label', 1, 1)[0].nativeElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormSwitchComponent, FormSwitchTestHostComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormSwitchComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedInputId = 'test-switch';

        // Spies
        checkedChangeSpy = vi.fn();
        component.checkedChange.subscribe(checkedChangeSpy);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `inputId`', () => {
            expectToBe(isSignal(component.inputId), true);

            expect(() => component.inputId()).toThrow();
        });

        it('... should throw due to missing required input signal `checked`', () => {
            expectToBe(isSignal(component.checked), true);

            expect(() => component.checked()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one div.form-check.form-switch with a checkbox and a label', () => {
                expectToBe(getInputEl().type, 'checkbox');
                getLabelEl();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('inputId', expectedInputId);
            fixture.componentRef.setInput('checked', true);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `inputId` to hold the provided id', () => {
            expectToBe(component.inputId(), expectedInputId);
        });

        it('... should have input signal `checked` to hold the provided state', () => {
            expectToBe(component.checked(), true);
        });

        describe('VIEW', () => {
            it('... should link the label to the checkbox via `inputId`', () => {
                expectToBe(getInputEl().id, expectedInputId);
                expectToBe(getLabelEl().htmlFor, expectedInputId);
            });

            it.each([true, false])('... should reflect the `checked` state %s in the checkbox', async isChecked => {
                fixture.componentRef.setInput('checked', isChecked);
                await detectChangesOnPush(fixture);

                expectToBe(getInputEl().checked, isChecked);
            });

            describe('... output `checkedChange`', () => {
                it.each([true, false])('... should emit the new checked state %s on change', isChecked => {
                    const inputEl = getInputEl();

                    inputEl.checked = isChecked;
                    inputEl.dispatchEvent(new Event('change'));

                    expectSpyCall(checkedChangeSpy, 1, isChecked);
                });
            });

            it('... should project the given content into the label', () => {
                const hostFixture = TestBed.createComponent(FormSwitchTestHostComponent);
                hostFixture.detectChanges();

                const switchDes = getAndExpectDebugElementByDirective(
                    hostFixture.debugElement,
                    FormSwitchComponent,
                    1,
                    1
                );
                const labelDes = getAndExpectDebugElementByCss(switchDes[0], 'label.form-check-label', 1, 1);
                const projectedDes = getAndExpectDebugElementByCss(labelDes[0], 'span.test-label', 1, 1);

                expectToBe(projectedDes[0].nativeElement.textContent, 'Label');
            });
        });
    });
});
