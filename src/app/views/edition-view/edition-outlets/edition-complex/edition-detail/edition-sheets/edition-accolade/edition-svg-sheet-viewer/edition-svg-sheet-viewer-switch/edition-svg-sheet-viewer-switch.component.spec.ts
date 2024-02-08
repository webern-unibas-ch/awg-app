import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionSvgSheetViewerSwitchComponent } from './edition-svg-sheet-viewer-switch.component';

describe('EditionSvgSheetViewerSwitchComponent (DONE)', () => {
    let component: EditionSvgSheetViewerSwitchComponent;
    let fixture: ComponentFixture<EditionSvgSheetViewerSwitchComponent>;
    let compDe: DebugElement;

    let emitToggleSuppliedClassesOpacityRequestSpy: Spy;
    let emitToggleTkkClassesHighlightRequestSpy: Spy;
    let onSuppliedClassesOpacityToggleSpy: Spy;
    let toggleSingleSuppliedClassOpacitySpy: Spy;
    let toggleAllClassesOpacitySpy: Spy;
    let toggleTkkClassesHighlightSpy: Spy;
    let toggleUpdateAllClassesVisibilitySpy: Spy;

    let expectedClass1: string;
    let expectedClass2: string;
    let expectedSuppliedClasses: Map<string, boolean>;
    let expectedAllClassesVisible: boolean;
    let expectedTkkHighlightingVisible: boolean;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [EditionSvgSheetViewerSwitchComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetViewerSwitchComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedClass1 = 'class1';
        expectedClass2 = 'class2';
        expectedSuppliedClasses = new Map<string, boolean>();
        expectedSuppliedClasses.set(expectedClass1, true);
        expectedSuppliedClasses.set(expectedClass2, true);
        expectedAllClassesVisible = true;
        expectedTkkHighlightingVisible = true;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        emitToggleSuppliedClassesOpacityRequestSpy = spyOn(
            component.toggleSuppliedClassesOpacityRequest,
            'emit'
        ).and.callThrough();
        emitToggleTkkClassesHighlightRequestSpy = spyOn(
            component.toggleTkkClassesHighlightRequest,
            'emit'
        ).and.callThrough();
        onSuppliedClassesOpacityToggleSpy = spyOn<any>(component, '_onSuppliedClassesOpacityToggle').and.callThrough();
        toggleSingleSuppliedClassOpacitySpy = spyOn(component, 'toggleSingleSuppliedClassOpacity').and.callThrough();
        toggleAllClassesOpacitySpy = spyOn(component, 'toggleAllClassesOpacity').and.callThrough();
        toggleTkkClassesHighlightSpy = spyOn(component, 'toggleTkkClassesHighlight').and.callThrough();
        toggleUpdateAllClassesVisibilitySpy = spyOn<any>(component, '_updateAllClassesVisibility').and.callThrough();
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

        it('... should have allClassesVisible = `true`', () => {
            expectToBe(component.allClassesVisible, expectedAllClassesVisible);
        });

        it('... should have tkkHighlightingVisible = `true`', () => {
            expectToBe(component.tkkHighlightingVisible, expectedTkkHighlightingVisible);
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

            it('... should have a div.card-body with only two form-switches for all supplied classes and tkk highlighting yet', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                getAndExpectDebugElementByCss(cardBodyDe[0], 'div.form-check.form-switch', 2, 2);
            });

            it('... should have input[checked=false] and label in form-switch for all-supplied-classes', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                const formSwitchDe = getAndExpectDebugElementByCss(cardBodyDe[0], 'div.form-check.form-switch', 2, 2);
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

            it('... should have input[checked=false] and label in form-switch for tkk', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                const formSwitchDe = getAndExpectDebugElementByCss(cardBodyDe[0], 'div.form-check.form-switch', 2, 2);
                const formSwitchInputDe = getAndExpectDebugElementByCss(
                    formSwitchDe[1],
                    'input.form-check-input',
                    1,
                    1
                );
                const formSwitchLabelDe = getAndExpectDebugElementByCss(
                    formSwitchDe[1],
                    'label.form-check-label',
                    1,
                    1
                );

                const formSwitchInputEl = formSwitchInputDe[0].nativeElement;
                const formSwitchLabelEl = formSwitchLabelDe[0].nativeElement;

                expectToEqual(formSwitchInputEl.type, 'checkbox');
                expectToEqual(formSwitchInputEl.checked, false);
                expectToEqual(formSwitchInputEl.id, 'tkk');
                expectToEqual(formSwitchLabelEl.htmlFor, 'tkk');
                expectToEqual(formSwitchLabelEl.textContent.trim(), 'Textkritische Kommentare');
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

        it('... should have allClassesVisible = `true`', () => {
            expectToBe(component.allClassesVisible, expectedAllClassesVisible);
        });

        it('... should have tkkHighlightingVisible = `true`', () => {
            expectToBe(component.tkkHighlightingVisible, expectedTkkHighlightingVisible);
        });

        describe('VIEW', () => {
            it('... should have a div.card-body with as many form-switches as supplied classes (plus one for all classes and one for tkk)', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                const formSwitchDe = getAndExpectDebugElementByCss(
                    cardBodyDe[0],
                    'div.form-check.form-switch',
                    expectedSuppliedClasses.size + 2,
                    expectedSuppliedClasses.size + 2
                );
            });

            it('... should have input[checked=true] and label in form-switch for all-supplied-classes', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const formSwitchDe = getAndExpectDebugElementByCss(
                    cardBodyDe[0],
                    'div.form-check.form-switch',
                    expectedSuppliedClasses.size + 2,
                    expectedSuppliedClasses.size + 2
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

            it('... should display `Alle aus/einblenden` depending on status of allClassesVisible', async () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const formSwitchDe = getAndExpectDebugElementByCss(
                    cardBodyDe[0],
                    'div.form-check.form-switch',
                    expectedSuppliedClasses.size + 2,
                    expectedSuppliedClasses.size + 2
                );
                const formSwitchLabelDe = getAndExpectDebugElementByCss(
                    formSwitchDe[0],
                    'label.form-check-label',
                    1,
                    1
                );

                const formSwitchLabelEl = formSwitchLabelDe[0].nativeElement;

                expectToBe(component.allClassesVisible, true);
                expectToEqual(formSwitchLabelEl.textContent.trim(), 'Alle ausblenden');

                // Toggle allSuppliedClassesOpacity
                component.toggleAllClassesOpacity();
                await detectChangesOnPush(fixture);

                expectToBe(component.allClassesVisible, false);
                expectToEqual(formSwitchLabelEl.textContent.trim(), 'Alle einblenden');
            });

            it('... should trigger `toggleAllClassesOpacity`on click on form-switch for all-supplied-classes', fakeAsync(() => {
                const formSwitchInputDe = getAndExpectDebugElementByCss(
                    compDe,
                    'input.form-check-input#all-supplied-classes',
                    1,
                    1
                );

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(formSwitchInputDe[0], fixture);

                expectSpyCall(toggleAllClassesOpacitySpy, 1);
            }));

            it('... should have a form-switch for each supplied class', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                const formSwitchDes = getAndExpectDebugElementByCss(
                    cardBodyDe[0],
                    'div.form-check.form-switch',
                    expectedSuppliedClasses.size + 2,
                    expectedSuppliedClasses.size + 2
                );

                // Get form-switches for supplied classes (without first and last)
                formSwitchDes.slice(1, -1).forEach((formSwitchDe, index) => {
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

            it('... should have input[checked=true] and label in form-switch for tkk', () => {
                const cardBodyDe = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const formSwitchDe = getAndExpectDebugElementByCss(
                    cardBodyDe[0],
                    'div.form-check.form-switch',
                    expectedSuppliedClasses.size + 2,
                    expectedSuppliedClasses.size + 2
                );
                // Get last form-switch for tkk
                const formSwitchInputDe = getAndExpectDebugElementByCss(
                    formSwitchDe[expectedSuppliedClasses.size + 1],
                    'input.form-check-input',
                    1,
                    1
                );
                const formSwitchLabelDe = getAndExpectDebugElementByCss(
                    formSwitchDe[expectedSuppliedClasses.size + 1],
                    'label.form-check-label',
                    1,
                    1
                );

                const formSwitchInputEl = formSwitchInputDe[0].nativeElement;
                const formSwitchLabelEl = formSwitchLabelDe[0].nativeElement;

                expectToEqual(formSwitchInputEl.type, 'checkbox');
                expectToEqual(formSwitchInputEl.checked, true);
                expectToEqual(formSwitchInputEl.id, 'tkk');
                expectToEqual(formSwitchLabelEl.htmlFor, 'tkk');
                expectToEqual(formSwitchLabelEl.textContent.trim(), 'Textkritische Kommentare');
            });

            it('... should trigger `toggleTkkClassesHighlight` on click on form-switch for tkk', fakeAsync(() => {
                const formSwitchInputDe = getAndExpectDebugElementByCss(compDe, 'input.form-check-input#tkk', 1, 1);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(formSwitchInputDe[0], fixture);

                expectSpyCall(toggleTkkClassesHighlightSpy, 1);
            }));
        });

        describe('#ngOnChanges', () => {
            it('... should have a method ngOnChanges', () => {
                expect(component.ngOnChanges).toBeDefined();
            });

            it('... should not reset global boolean flags to `true` on first change of ngOnChanges', () => {
                component.allClassesVisible = false;
                component.tkkHighlightingVisible = false;

                component.ngOnChanges({
                    content: new SimpleChange(expectedSuppliedClasses, expectedSuppliedClasses, true),
                });

                expectToBe(component.allClassesVisible, false);
                expectToBe(component.tkkHighlightingVisible, false);
            });

            it('... should reset global boolean flags to `true` on any other change of ngOnChanges (values don’t change)', () => {
                component.allClassesVisible = false;
                component.tkkHighlightingVisible = false;

                // Directly trigger ngOnChanges
                component.suppliedClasses = new Map([...expectedSuppliedClasses]);
                component.ngOnChanges({
                    suppliedClasses: new SimpleChange(expectedSuppliedClasses, [component.suppliedClasses], false),
                });

                expectToBe(component.allClassesVisible, true);
                expectToBe(component.tkkHighlightingVisible, true);
            });

            it('... should reset global boolean flags to `true` on any other change of ngOnChanges (values change)', () => {
                component.allClassesVisible = false;
                component.tkkHighlightingVisible = false;

                // Directly trigger ngOnChanges
                component.suppliedClasses = new Map();
                component.suppliedClasses.set('another-class1', true);
                component.suppliedClasses.set('another-class2', true);
                component.ngOnChanges({
                    suppliedClasses: new SimpleChange(expectedSuppliedClasses, [component.suppliedClasses], false),
                });

                expectToBe(component.allClassesVisible, true);
                expectToBe(component.tkkHighlightingVisible, true);
            });
        });

        describe('#toggleSingleSuppliedClassOpacity()', () => {
            it('... should have a method `toggleSingleSuppliedClassOpacity`', () => {
                expect(component.toggleSingleSuppliedClassOpacity).toBeDefined();
            });

            it('... should toggle the visibility of a single supplied class', () => {
                const isSuppliedClassVisible = component.suppliedClasses.get(expectedClass1) || false;

                component.toggleSingleSuppliedClassOpacity(expectedClass1);

                expectToBe(component.suppliedClasses.get(expectedClass1), !isSuppliedClassVisible);
            });

            it('... should trigger _onSuppliedClassesOpacityToggle() with the correct parameters', () => {
                const isSuppliedClassVisible = component.suppliedClasses.get(expectedClass1) || false;

                component.toggleSingleSuppliedClassOpacity(expectedClass1);

                expectSpyCall(onSuppliedClassesOpacityToggleSpy, 1, [expectedClass1, isSuppliedClassVisible]);
            });

            it('... should not update allClassesVisible when not all suppliedClasses have the same visibility after toggling', () => {
                component.suppliedClasses.set(expectedClass1, true);
                component.suppliedClasses.set(expectedClass2, true);

                // Toggle class
                component.toggleSingleSuppliedClassOpacity(expectedClass1);

                expectToBe(component.suppliedClasses.get(expectedClass1), false);
                expectToBe(component.suppliedClasses.get(expectedClass2), true);
                expectToBe(component.allClassesVisible, expectedAllClassesVisible);
            });

            it('... should update allClassesVisible when all suppliedClasses have the same visibility after toggling', () => {
                component.suppliedClasses.set(expectedClass1, true);
                component.suppliedClasses.set(expectedClass2, false);

                // Toggle class
                component.toggleSingleSuppliedClassOpacity(expectedClass1);

                expectToBe(component.suppliedClasses.get(expectedClass1), false);
                expectToBe(component.suppliedClasses.get(expectedClass2), false);
                expectToBe(component.allClassesVisible, !expectedAllClassesVisible);

                // Toggle classes
                component.toggleSingleSuppliedClassOpacity(expectedClass1);
                component.toggleSingleSuppliedClassOpacity(expectedClass2);

                expectToBe(component.suppliedClasses.get(expectedClass1), true);
                expectToBe(component.suppliedClasses.get(expectedClass2), true);
                expectToBe(component.allClassesVisible, expectedAllClassesVisible);
            });
        });

        describe('#toggleAllClassesOpacity()', () => {
            it('... should have a method `toggleAllClassesOpacity`', () => {
                expect(component.toggleAllClassesOpacity).toBeDefined();
            });

            it('... should trigger _onSuppliedClassesOpacityToggle() with the correct parameters', () => {
                component.toggleAllClassesOpacity();

                expectSpyCall(onSuppliedClassesOpacityToggleSpy, 1, [undefined, expectedAllClassesVisible]);

                component.toggleAllClassesOpacity();

                expectSpyCall(onSuppliedClassesOpacityToggleSpy, 2, [undefined, !expectedAllClassesVisible]);
            });

            it('... should toggle the `allClassesVisible` flag', () => {
                component.toggleAllClassesOpacity();

                expectToBe(component.allClassesVisible, !expectedAllClassesVisible);

                component.toggleAllClassesOpacity();

                expectToBe(component.allClassesVisible, expectedAllClassesVisible);
            });

            it('... should update the visibility of all supplied classes', () => {
                component.toggleAllClassesOpacity();

                component.suppliedClasses.forEach((_value, key) => {
                    expectToBe(component.suppliedClasses.get(key), !expectedAllClassesVisible);
                });

                component.toggleAllClassesOpacity();

                component.suppliedClasses.forEach((_value, key) => {
                    expectToBe(component.suppliedClasses.get(key), expectedAllClassesVisible);
                });
            });

            it('... should trigger toggleTkkClassesHighlight with correct parameter', () => {
                component.toggleAllClassesOpacity();

                expectSpyCall(toggleTkkClassesHighlightSpy, 1, !expectedAllClassesVisible);

                component.toggleAllClassesOpacity();

                expectSpyCall(toggleTkkClassesHighlightSpy, 2, expectedAllClassesVisible);
            });
        });

        describe('#toggleTkkClassesHighlight()', () => {
            it('... should have a method `toggleTkkClassesHighlight`', () => {
                expect(component.toggleTkkClassesHighlight).toBeDefined();
            });

            describe('... if `isVisible` input is provided', () => {
                it('... should set the `tkkHighlightingVisible` flag to the provided input value', () => {
                    component.toggleTkkClassesHighlight(false);

                    expectToBe(component.tkkHighlightingVisible, false);

                    component.toggleTkkClassesHighlight(false);

                    expectToBe(component.tkkHighlightingVisible, false);

                    component.toggleTkkClassesHighlight(true);

                    expectToBe(component.tkkHighlightingVisible, true);
                });

                it('... should emit the provided value to the toggle request', () => {
                    component.toggleTkkClassesHighlight(false);

                    expectSpyCall(emitToggleTkkClassesHighlightRequestSpy, 1, false);

                    component.toggleTkkClassesHighlight(false);

                    expectSpyCall(emitToggleTkkClassesHighlightRequestSpy, 2, false);

                    component.toggleTkkClassesHighlight(true);

                    expectSpyCall(emitToggleTkkClassesHighlightRequestSpy, 3, true);
                });
            });

            describe('... if no `isVisible` input is provided', () => {
                it('... should toggle the `tkkHighlightingVisible` flag', () => {
                    component.toggleTkkClassesHighlight();

                    expectToBe(component.tkkHighlightingVisible, !expectedTkkHighlightingVisible);

                    component.toggleTkkClassesHighlight();

                    expectToBe(component.tkkHighlightingVisible, expectedTkkHighlightingVisible);
                });

                it('... should emit the toggled tkkHighlightingVisible` flag to the toggle request', () => {
                    component.toggleTkkClassesHighlight();

                    expectSpyCall(emitToggleTkkClassesHighlightRequestSpy, 1, !expectedTkkHighlightingVisible);

                    component.toggleTkkClassesHighlight();

                    expectSpyCall(emitToggleTkkClassesHighlightRequestSpy, 2, expectedTkkHighlightingVisible);
                });
            });

            it('... should trigger _updateAllClassesVisibility()', () => {
                component.toggleTkkClassesHighlight();

                expectSpyCall(toggleUpdateAllClassesVisibilitySpy, 1);
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
                component.toggleAllClassesOpacity();

                expectSpyCall(emitToggleSuppliedClassesOpacityRequestSpy, 1, {
                    className: undefined,
                    isCurrentlyVisible: true,
                });
            });
        });

        describe('#_updateAllClassesVisibility()', () => {
            it('... should have a method `_updateAllClassesVisibility`', () => {
                expect((component as any)._updateAllClassesVisibility).toBeDefined();
            });

            describe('... should do nothing if', () => {
                it('... supplied classes do not have the same visibility', () => {
                    component.suppliedClasses.set(expectedClass1, expectedAllClassesVisible);
                    component.suppliedClasses.set(expectedClass2, !expectedAllClassesVisible);
                    component.tkkHighlightingVisible = expectedTkkHighlightingVisible;

                    (component as any)._updateAllClassesVisibility();

                    expectToBe(component.allClassesVisible, expectedAllClassesVisible);
                });

                it('... tkkHighlightingVisible does not have the same visibility as supplied classes', () => {
                    component.suppliedClasses.set(expectedClass1, expectedAllClassesVisible);
                    component.suppliedClasses.set(expectedClass2, expectedAllClassesVisible);
                    component.tkkHighlightingVisible = !expectedAllClassesVisible;

                    (component as any)._updateAllClassesVisibility();

                    expectToBe(component.allClassesVisible, expectedAllClassesVisible);
                });
            });

            it('... should update the `allClassesVisible` flag if all supplied classes and tkkHighlightingVisible have the same visibility', () => {
                component.suppliedClasses.set(expectedClass1, !expectedAllClassesVisible);
                component.suppliedClasses.set(expectedClass2, !expectedAllClassesVisible);
                component.tkkHighlightingVisible = !expectedTkkHighlightingVisible;

                (component as any)._updateAllClassesVisibility();

                expectToBe(component.allClassesVisible, !expectedAllClassesVisible);

                component.suppliedClasses.set(expectedClass1, expectedAllClassesVisible);
                component.suppliedClasses.set(expectedClass2, expectedAllClassesVisible);
                component.tkkHighlightingVisible = expectedTkkHighlightingVisible;

                (component as any)._updateAllClassesVisibility();

                expectToBe(component.allClassesVisible, expectedAllClassesVisible);
            });
        });
    });
});
