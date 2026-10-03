import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { faAnglesLeft, faListUl } from '@fortawesome/free-solid-svg-icons';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionSheetFacetToggleComponent } from './edition-sheet-facet-toggle.component';

describe('EditionSheetFacetToggleComponent (DONE)', () => {
    let component: EditionSheetFacetToggleComponent;
    let fixture: ComponentFixture<EditionSheetFacetToggleComponent>;
    let compDe: DebugElement;

    let toggleSpy: Spy;
    let isMinimizedChangeSpy: Mock<(value: boolean) => void>;

    const getButtonDes = () => getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
    const getIconDes = () => getAndExpectDebugElementByCss(getButtonDes()[0], 'fa-icon', 1, 1);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSheetFacetToggleComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Create component fixture
        fixture = TestBed.createComponent(EditionSheetFacetToggleComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        toggleSpy = vi.spyOn(component, 'toggle');
        isMinimizedChangeSpy = vi.fn<(value: boolean) => void>();
        component.isMinimized.subscribe(isMinimizedChangeSpy);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have model signal `isMinimized` to hold the default value', () => {
            expectToBe(isSignal(component.isMinimized), true);

            expectToBe(component.isMinimized(), false);
        });

        it('... should have computed signal `toggleIcon` to hold the default value', () => {
            expectToBe(isSignal(component.toggleIcon), true);

            expectToEqual(component.toggleIcon(), faAnglesLeft);
        });

        it('... should have computed signal `toggleLabel` to hold the default value', () => {
            expectToBe(isSignal(component.toggleLabel), true);

            expectToBe(component.toggleLabel(), 'Minimize');
        });

        describe('VIEW', () => {
            it('... should contain one button.btn with type `button` and one fa-icon', () => {
                const buttonEl: HTMLButtonElement = getButtonDes()[0].nativeElement;

                expectToBe(buttonEl.type, 'button');
                expectToBe(buttonEl.className, 'btn btn-sm border rounded m-2');

                getIconDes();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('... if `isMinimized` is false', () => {
            it('... should have model signal `isMinimized` to hold the default value', () => {
                expectToBe(isSignal(component.isMinimized), true);

                expectToBe(component.isMinimized(), false);
            });

            it('... should have computed signal `toggleIcon` to hold the default value', () => {
                expectToBe(isSignal(component.toggleIcon), true);

                expectToEqual(component.toggleIcon(), faAnglesLeft);
            });

            it('... should have computed signal `toggleLabel` to hold the default value', () => {
                expectToBe(isSignal(component.toggleLabel), true);

                expectToBe(component.toggleLabel(), 'Minimize');
            });

            describe('VIEW', () => {
                it('... should display anglesLeft icon in button', () => {
                    expectToBe(getIconDes()[0].componentInstance.icon(), faAnglesLeft);
                });

                it('... should have title and aria-label "Minimize" on button', () => {
                    const buttonEl: HTMLButtonElement = getButtonDes()[0].nativeElement;

                    expectToBe(buttonEl.title, 'Minimize');
                    expectToBe(buttonEl.getAttribute('aria-label'), 'Minimize');
                });
            });

            describe('... if `isMinimized` is true', () => {
                beforeEach(async () => {
                    fixture.componentRef.setInput('isMinimized', true);
                    await detectChangesOnPush(fixture);
                });

                it('... should have model signal `isMinimized` to hold the provided value', () => {
                    expectToBe(component.isMinimized(), true);
                });

                it('... should have recomputed signal `toggleIcon` when input changes', () => {
                    expectToEqual(component.toggleIcon(), faListUl);
                });

                it('... should have recomputed signal `toggleLabel` when input changes', () => {
                    expectToBe(component.toggleLabel(), 'Maximize');
                });

                describe('VIEW', () => {
                    it('... should display `faListUl` icon in button', () => {
                        expectToBe(getIconDes()[0].componentInstance.icon(), faListUl);
                    });

                    it('... should have title and aria-label "Maximize" on button', () => {
                        const buttonEl: HTMLButtonElement = getButtonDes()[0].nativeElement;

                        expectToBe(buttonEl.title, 'Maximize');
                        expectToBe(buttonEl.getAttribute('aria-label'), 'Maximize');
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#toggle()', () => {
                it('... should have a method `toggle`', () => {
                    expect(component.toggle).toBeDefined();
                });

                it('... should trigger on click on button', async () => {
                    await clickAndAwaitChanges(getButtonDes()[0], fixture);

                    expectSpyCall(toggleSpy, 1);
                });

                it('... should toggle the model signal `isMinimized`', () => {
                    component.toggle();

                    expectToBe(component.isMinimized(), true);

                    component.toggle();

                    expectToBe(component.isMinimized(), false);
                });

                it('... should emit the toggled state via `isMinimizedChange`', () => {
                    component.toggle();

                    expectSpyCall(isMinimizedChangeSpy, 1, true);

                    component.toggle();

                    expectSpyCall(isMinimizedChangeSpy, 2, false);
                });

                it('... should display the toggled icon after click on button', async () => {
                    await clickAndAwaitChanges(getButtonDes()[0], fixture);

                    expectToBe(getIconDes()[0].componentInstance.icon(), faListUl);
                });
            });
        });
    });
});
