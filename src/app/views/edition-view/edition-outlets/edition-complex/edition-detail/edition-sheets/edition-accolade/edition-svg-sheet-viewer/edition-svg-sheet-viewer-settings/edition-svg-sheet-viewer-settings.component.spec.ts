import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionSvgSheetViewerSettingsComponent } from './edition-svg-sheet-viewer-settings.component';

describe('EditionSvgSheetViewerSettingsComponent (DONE)', () => {
    let component: EditionSvgSheetViewerSettingsComponent;
    let fixture: ComponentFixture<EditionSvgSheetViewerSettingsComponent>;
    let compDe: DebugElement;

    let emitToggleSuppliedClassesOpacityRequestSpy: Spy;
    let onSuppliedClassesOpacityToggleSpy: Spy;
    let toggleSingleSuppliedClassOpacitySpy: Spy;
    let toggleAllSuppliedClassesOpacitySpy: Spy;

    let expectedClass1: string;
    let expectedClass2: string;
    let expectedSuppliedClasses: Map<string, boolean>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [EditionSvgSheetViewerSettingsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetViewerSettingsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedClass1 = 'class1';
        expectedClass2 = 'class2';
        expectedSuppliedClasses = new Map<string, boolean>();
        expectedSuppliedClasses.set(expectedClass1, true);
        expectedSuppliedClasses.set(expectedClass2, true);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        emitToggleSuppliedClassesOpacityRequestSpy = spyOn(
            component.toggleSuppliedClassesOpacityRequest,
            'emit'
        ).and.callThrough();
        onSuppliedClassesOpacityToggleSpy = spyOn<any>(component, '_onSuppliedClassesOpacityToggle').and.callThrough();
        toggleSingleSuppliedClassOpacitySpy = spyOn(component, 'toggleSingleSuppliedClassOpacity').and.callThrough();
        toggleAllSuppliedClassesOpacitySpy = spyOn(component, 'toggleAllSuppliedClassesOpacity').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have no suppliedClasses yet', () => {
            expect(component.suppliedClasses).toBeUndefined();
        });

        it('... should have allSuppliedClassesVisible = `true`', () => {
            expectToBe(component.allSuppliedClassesVisible, true);
        });

        describe('VIEW', () => {
            it('... should have an outer div.card', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
            });

            it('... should have a div.card-header and a div.card-body inside the outer div.card', () => {
                const cardDe = getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);

                getAndExpectDebugElementByCss(cardDe[0], 'div.card-body', 1, 1);
                getAndExpectDebugElementByCss(cardDe[0], 'div.card-header', 1, 1);
            });

            it('... should display title in div.card-header', () => {
                const cardHeaderDe = getAndExpectDebugElementByCss(compDe, 'div.card-header', 1, 1);

                const titleDe = getAndExpectDebugElementByCss(cardHeaderDe[0], 'span', 1, 1);
                const titleEl = titleDe[0].nativeElement;

                expectToEqual(titleEl.textContent, 'Editorische Ergänzungen');
            });

            it('... should have a div.card-body with only one form-switch for all supplied classes yet', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                const formSwitchDe = getAndExpectDebugElementByCss(cardBodyDe[0], 'div.form-check.form-switch', 1, 1);
            });

            it('... should have input[checked=false] and label in form-switch for all-supplied-classes', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                const formSwitchDe = getAndExpectDebugElementByCss(cardBodyDe[0], 'div.form-check.form-switch', 1, 1);
                const formSwitchInputDe = getAndExpectDebugElementByCss(
                    formSwitchDe[0],
                    'input.form-check-input',
                    1,
                    1
                );
                const formSwitchLabelDe = getAndExpectDebugElementByCss(
                    formSwitchDe[0],
                    'label.form-check-label',
                    1,
                    1
                );

                const formSwitchInputEl = formSwitchInputDe[0].nativeElement;
                const formSwitchLabelEl = formSwitchLabelDe[0].nativeElement;

                expectToEqual(formSwitchInputEl.type, 'checkbox');
                expectToEqual(formSwitchInputEl.checked, false);
                expectToEqual(formSwitchInputEl.id, 'all-supplied-classes');
                expectToEqual(formSwitchLabelEl.htmlFor, 'all-supplied-classes');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.suppliedClasses = expectedSuppliedClasses;

            fixture.detectChanges();
        });

        it('... should have suppliedClasses', () => {
            expectToEqual(component.suppliedClasses, expectedSuppliedClasses);
        });

        describe('VIEW', () => {
            it('... should have a div.card-body with as many form-switches as supplied classes (plus one for all classes)', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                const formSwitchDe = getAndExpectDebugElementByCss(
                    cardBodyDe[0],
                    'div.form-check.form-switch',
                    expectedSuppliedClasses.size + 1,
                    expectedSuppliedClasses.size + 1
                );
            });

            it('... should have input[checked=true] and label in form-switch for all-supplied-classes', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const formSwitchDe = getAndExpectDebugElementByCss(
                    cardBodyDe[0],
                    'div.form-check.form-switch',
                    expectedSuppliedClasses.size + 1,
                    expectedSuppliedClasses.size + 1
                );
                // Get first form-switch for all-supplied-classes
                const formSwitchInputDe = getAndExpectDebugElementByCss(
                    formSwitchDe[0],
                    'input.form-check-input',
                    1,
                    1
                );
                const formSwitchLabelDe = getAndExpectDebugElementByCss(
                    formSwitchDe[0],
                    'label.form-check-label',
                    1,
                    1
                );

                const formSwitchInputEl = formSwitchInputDe[0].nativeElement;
                const formSwitchLabelEl = formSwitchLabelDe[0].nativeElement;

                expectToEqual(formSwitchInputEl.type, 'checkbox');
                expectToEqual(formSwitchInputEl.checked, true);
                expectToEqual(formSwitchInputEl.id, 'all-supplied-classes');
                expectToEqual(formSwitchLabelEl.htmlFor, 'all-supplied-classes');
                expectToEqual(formSwitchLabelEl.textContent.trim(), 'Alle ausblenden');
            });

            it('... should display `Alle aus/einblenden` depending on status of allSuppliedClassesVisible', async () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const formSwitchDe = getAndExpectDebugElementByCss(
                    cardBodyDe[0],
                    'div.form-check.form-switch',
                    expectedSuppliedClasses.size + 1,
                    expectedSuppliedClasses.size + 1
                );
                const formSwitchLabelDe = getAndExpectDebugElementByCss(
                    formSwitchDe[0],
                    'label.form-check-label',
                    1,
                    1
                );

                const formSwitchLabelEl = formSwitchLabelDe[0].nativeElement;

                expectToBe(component.allSuppliedClassesVisible, true);
                expectToEqual(formSwitchLabelEl.textContent.trim(), 'Alle ausblenden');

                // Toggle allSuppliedClassesOpacity
                component.toggleAllSuppliedClassesOpacity();
                await detectChangesOnPush(fixture);

                expectToBe(component.allSuppliedClassesVisible, false);
                expectToEqual(formSwitchLabelEl.textContent.trim(), 'Alle einblenden');
            });

            it('... should trigger `toggleAllSuppliedClassesOpacity`on click on form-switch for all-supplied-classes', fakeAsync(() => {
                const formSwitchInputDe = getAndExpectDebugElementByCss(
                    compDe,
                    'input.form-check-input#all-supplied-classes',
                    1,
                    1
                );

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(formSwitchInputDe[0], fixture);

                expectSpyCall(toggleAllSuppliedClassesOpacitySpy, 1);
            }));

            it('... should have a form-switch for each supplied class', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                const formSwitchDes = getAndExpectDebugElementByCss(
                    cardBodyDe[0],
                    'div.form-check.form-switch',
                    expectedSuppliedClasses.size + 1,
                    expectedSuppliedClasses.size + 1
                );

                // Get form-switches for supplied classes
                formSwitchDes.slice(1).forEach((formSwitchDe, index) => {
                    const formSwitchInputDe = getAndExpectDebugElementByCss(
                        formSwitchDe,
                        'input.form-check-input',
                        1,
                        1
                    );
                    const formSwitchLabelDe = getAndExpectDebugElementByCss(
                        formSwitchDe,
                        'label.form-check-label',
                        1,
                        1
                    );

                    const formSwitchInputEl = formSwitchInputDe[0].nativeElement;
                    const formSwitchLabelEl = formSwitchLabelDe[0].nativeElement;

                    const keysArray = Array.from(expectedSuppliedClasses.keys());

                    expectToEqual(formSwitchInputEl.type, 'checkbox');
                    expectToEqual(formSwitchInputEl.checked, true);
                    expectToEqual(formSwitchInputEl.id, keysArray[index]);
                    expectToEqual(formSwitchLabelEl.htmlFor, keysArray[index]);
                    expectToEqual(formSwitchLabelEl.textContent, keysArray[index]);
                });
            });

            it('... should trigger `toggleSingleSuppliedClassOpacity` on click on form-switch for supplied class', fakeAsync(() => {
                const keysArray = Array.from(expectedSuppliedClasses.keys());

                keysArray.forEach((key, index) => {
                    const formSwitchInputDe = getAndExpectDebugElementByCss(
                        compDe,
                        'input.form-check-input#' + key,
                        1,
                        1
                    );

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(formSwitchInputDe[0], fixture);

                    expectSpyCall(toggleSingleSuppliedClassOpacitySpy, index + 1, [key]);
                });
            }));
        });

        describe('#toggleSingleSuppliedClassOpacity()', () => {
            it('... should have a method `toggleSingleSuppliedClassOpacity`', () => {
                expect(component.toggleSingleSuppliedClassOpacity).toBeDefined();
            });

            it('... should toggle the visibility of a single supplied class', () => {
                const isSuppliedClassVisible = component.suppliedClasses.get(expectedClass1) || false;

                component.toggleSingleSuppliedClassOpacity(expectedClass1);

                expectToEqual(component.suppliedClasses.get(expectedClass1), !isSuppliedClassVisible);
            });

            it('... should trigger _onSuppliedClassesOpacityToggle() with the correct parameters', () => {
                const isSuppliedClassVisible = component.suppliedClasses.get(expectedClass1) || false;

                component.toggleSingleSuppliedClassOpacity(expectedClass1);

                expectSpyCall(onSuppliedClassesOpacityToggleSpy, 1, [expectedClass1, isSuppliedClassVisible]);
            });

            it('... should not update allSuppliedClassesVisible when not all suppliedClasses have the same visibility', () => {
                component.suppliedClasses.set(expectedClass1, true);
                component.suppliedClasses.set(expectedClass2, true);

                // Toggle class 1
                component.toggleSingleSuppliedClassOpacity(expectedClass1);

                expectToEqual(component.allSuppliedClassesVisible, true);

                component.suppliedClasses.set(expectedClass1, true);
                component.suppliedClasses.set(expectedClass2, true);

                // Toggle class 2
                component.toggleSingleSuppliedClassOpacity(expectedClass2);

                expectToEqual(component.allSuppliedClassesVisible, true);
            });

            it('... should update allSuppliedClassesVisible when all suppliedClasses have the same visibility', () => {
                component.suppliedClasses.set(expectedClass1, true);
                component.suppliedClasses.set(expectedClass2, true);

                // Toggle classes
                component.toggleSingleSuppliedClassOpacity(expectedClass1);
                component.toggleSingleSuppliedClassOpacity(expectedClass2);

                expectToEqual(component.allSuppliedClassesVisible, false);

                // Toggle classes back
                component.toggleSingleSuppliedClassOpacity(expectedClass2);
                component.toggleSingleSuppliedClassOpacity(expectedClass1);

                expectToEqual(component.allSuppliedClassesVisible, true);
            });
        });

        describe('#toggleAllSuppliedClassesOpacity()', () => {
            it('... should have a method `toggleAllSuppliedClassesOpacity`', () => {
                expect(component.toggleAllSuppliedClassesOpacity).toBeDefined();
            });

            it('... should toggle the `allSuppliedClassesVisible` flag', () => {
                component.toggleAllSuppliedClassesOpacity();

                expectToEqual(component.allSuppliedClassesVisible, false);

                component.toggleAllSuppliedClassesOpacity();

                expectToEqual(component.allSuppliedClassesVisible, true);
            });

            it('... should update the visibility of all supplied classes', () => {
                component.toggleAllSuppliedClassesOpacity();

                component.suppliedClasses.forEach((_value, key) => {
                    expectToEqual(component.suppliedClasses.get(key), false);
                });

                component.toggleAllSuppliedClassesOpacity();

                component.suppliedClasses.forEach((_value, key) => {
                    expectToEqual(component.suppliedClasses.get(key), true);
                });
            });

            it('... should trigger _onSuppliedClassesOpacityToggle() with the correct parameters', () => {
                component.toggleAllSuppliedClassesOpacity();

                expectSpyCall(onSuppliedClassesOpacityToggleSpy, 1, [undefined, true]);

                component.toggleAllSuppliedClassesOpacity();

                expectSpyCall(onSuppliedClassesOpacityToggleSpy, 2, [undefined, false]);
            });
        });

        describe('#_onSuppliedClassesOpacityToggle()', () => {
            it('... should have a method `_onSuppliedClassesOpacityToggle`', () => {
                expect((component as any)._onSuppliedClassesOpacityToggle).toBeDefined();
            });

            it('... should emit the supplied className and visibility to the toggle request for a single supplied class', () => {
                component.suppliedClasses.set(expectedClass1, true);

                component.toggleSingleSuppliedClassOpacity(expectedClass1);

                expectSpyCall(emitToggleSuppliedClassesOpacityRequestSpy, 1, {
                    className: expectedClass1,
                    isCurrentlyVisible: true,
                });
            });

            it('... should emit the supplied className and visibility to the toggle request for all supplied classes', () => {
                component.toggleAllSuppliedClassesOpacity();

                expectSpyCall(emitToggleSuppliedClassesOpacityRequestSpy, 1, {
                    className: undefined,
                    isCurrentlyVisible: true,
                });
            });
        });
    });
});
