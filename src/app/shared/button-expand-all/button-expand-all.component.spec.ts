import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { ButtonExpandAllComponent } from './button-expand-all.component';

describe('ButtonExpandAllComponent (DONE)', () => {
    let component: ButtonExpandAllComponent;
    let fixture: ComponentFixture<ButtonExpandAllComponent>;
    let compDe: DebugElement;

    let toggleSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonExpandAllComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Create component fixture
        fixture = TestBed.createComponent(ButtonExpandAllComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        toggleSpy = vi.spyOn(component, 'toggle');
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have model signal `isOpen` to hold the default value', () => {
            expectToBe(isSignal(component.isOpen), true);

            expectToBe(component.isOpen(), false);
        });

        describe('VIEW', () => {
            it('... should contain a small muted container span in the label paragraph', () => {
                const containerSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-btn-expand-all-container',
                    1,
                    1
                );
                const containerSpanEl: HTMLSpanElement = containerSpanDes[0].nativeElement;

                expectToContain(containerSpanEl.classList, 'small');
                expectToContain(containerSpanEl.classList, 'text-muted');
            });

            it('... should contain a button in the toggle span', () => {
                const containerSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-btn-expand-all-container',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(containerSpanDes[0], 'button.awg-btn-expand-all-btn', 1, 1);
            });

            it('... should not display a text on the button yet', () => {
                const expectedToggleText = '';

                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-btn-expand-all-btn', 1, 1);
                const btnEl: HTMLSpanElement = btnDes[0].nativeElement;

                expectToBe(btnEl.textContent.trim(), expectedToggleText);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('isOpen', true);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have model signal `isOpen` to hold the provided value', () => {
            expectToBe(component.isOpen(), true);
        });

        describe('VIEW', () => {
            it('... should display a text in the toggle span', () => {
                const expectedToggleText = 'Alles einklappen';

                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-btn-expand-all-btn', 1, 1);
                const btnEl: HTMLSpanElement = btnDes[0].nativeElement;

                expectToBe(btnEl.textContent.trim(), expectedToggleText);
            });

            it('... should have correct `aria-expanded` attribute on the button', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-btn-expand-all-btn', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                expectToBe(btnEl.hasAttribute('aria-expanded'), true);
            });

            it('... should toggle the button text when clicked', async () => {
                const expectedToggleTextOpen = 'Alles einklappen';
                const expectedToggleTextClosed = 'Alles ausklappen';

                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-btn-expand-all-btn', 1, 1);
                const btnEl: HTMLSpanElement = btnDes[0].nativeElement;

                expectToBe(btnEl.textContent.trim(), expectedToggleTextOpen);

                await clickAndAwaitChanges(btnDes[0], fixture);

                expectToBe(btnEl.textContent.trim(), expectedToggleTextClosed);

                await clickAndAwaitChanges(btnDes[0], fixture);

                expectToBe(btnEl.textContent.trim(), expectedToggleTextOpen);
            });

            it('... should update `aria-expanded` when clicked', async () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-btn-expand-all-btn', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                expectToBe(btnEl.getAttribute('aria-expanded'), 'true');

                await clickAndAwaitChanges(btnDes[0], fixture);

                expectToBe(btnEl.getAttribute('aria-expanded'), 'false');

                await clickAndAwaitChanges(btnDes[0], fixture);

                expectToBe(btnEl.getAttribute('aria-expanded'), 'true');
            });
        });

        describe('METHODS', () => {
            describe('#toggle()', () => {
                it('... should have a method `toggle`', () => {
                    expect(component.toggle).toBeDefined();
                });

                it('... should trigger on click', async () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-btn-expand-all-btn', 1, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(toggleSpy, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(toggleSpy, 2);
                });

                it('... should toggle the model signal `isOpen`', () => {
                    component.toggle();

                    expectToEqual(component.isOpen(), false);

                    component.toggle();

                    expectToEqual(component.isOpen(), true);
                });
            });
        });
    });
});
