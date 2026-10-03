import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { FormSwitchComponent } from '@awg-shared/form-switch/form-switch.component';

import { EditionSvgOverlayTypes } from '@awg-views/edition-view/models/edition-svg-overlay.model';
import { EditionTkaLabelComponent } from '../../../../edition-tka/edition-tka-label/edition-tka-label.component';

import { EditionSheetViewerAdditionsPanelComponent } from './edition-sheet-viewer-additions-panel.component';
import { EditionSheetViewerAdditionsPanelChange } from './edition-sheet-viewer-additions-panel.model';

const expectedSuppliedClassLabels = new Map([
    ['foliation', 'Blattangabe'],
    ['staffN', 'Systemangabe'],
    ['measureN', 'Taktzahlen'],
    ['clef', 'Schlüssel'],
    ['clef_key', 'Schlüssel mit Tonart'],
    ['key', 'Tonart'],
    ['accid', 'Akzidenzien'],
    ['hyphen', 'Silbentrennung'],
]);

describe('EditionSheetViewerAdditionsPanelComponent (DONE)', () => {
    let component: EditionSheetViewerAdditionsPanelComponent;
    let fixture: ComponentFixture<EditionSheetViewerAdditionsPanelComponent>;
    let compDe: DebugElement;

    let visibilityChangeSpy: Mock<(change: EditionSheetViewerAdditionsPanelChange) => void>;
    let toggleSpy: Spy;
    let toggleAllSpy: Spy;

    let expectedSheetId: string;
    let expectedClass1: string;
    let expectedClass2: string;
    let expectedSuppliedClasses: string[];
    let expectedTkkKey: string;
    let expectedAdditionsKeys: string[];

    const getCardBodyDes = () => getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);
    const getFormSwitchDes = (count: number) =>
        getAndExpectDebugElementByCss(getCardBodyDes()[0], 'div.form-check.form-switch', count, count);
    const getInputEl = (key: string): HTMLInputElement =>
        getAndExpectDebugElementByCss(compDe, `input.form-check-input[id="awg-addition-${key}"]`, 1, 1)[0]
            .nativeElement;
    const getLabelDe = (key: string): DebugElement =>
        getAndExpectDebugElementByCss(compDe, `label.form-check-label[for="awg-addition-${key}"]`, 1, 1)[0];

    const setVisibility = (key: string, isVisible: boolean) =>
        component.visibility.update(visibility => new Map(visibility).set(key, isVisible));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSheetViewerAdditionsPanelComponent, EditionTkaLabelComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSheetId = 'test-item-id-1';
        expectedClass1 = 'class1';
        expectedClass2 = 'class2';
        expectedSuppliedClasses = [expectedClass1, expectedClass2];
        expectedTkkKey = EditionSvgOverlayTypes.tkk;
        expectedAdditionsKeys = [expectedClass1, expectedClass2, expectedTkkKey];

        // Create component fixture
        fixture = TestBed.createComponent(EditionSheetViewerAdditionsPanelComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        visibilityChangeSpy = vi.fn();
        component.visibilityChange.subscribe(visibilityChangeSpy);

        toggleSpy = vi.spyOn(component, 'toggle');
        toggleAllSpy = vi.spyOn(component, 'toggleAll');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `sheetId`', () => {
            expectToBe(isSignal(component.sheetId), true);

            expect(() => component.sheetId()).toThrow();
        });

        it('... should throw due to missing required input signal `suppliedClasses`', () => {
            expectToBe(isSignal(component.suppliedClasses), true);

            expect(() => component.suppliedClasses()).toThrow();
        });

        it('... should have input signal `hasTkkOverlays` to hold the default value `false`', () => {
            expectToBe(isSignal(component.hasTkkOverlays), true);

            expectToBe(component.hasTkkOverlays(), false);
        });

        it('... should have `inputIdPrefix` to hold the prefix of the checkbox ids', () => {
            expectToBe(component.inputIdPrefix, 'awg-addition-');
        });

        it('... should have `tkkKey` to hold the tkk addition key', () => {
            expectToBe(component.tkkKey, expectedTkkKey);
        });

        it('... should have `suppliedClassLabels` to hold the supplied class labels', () => {
            expectToEqual(component.suppliedClassLabels, expectedSuppliedClassLabels);
        });

        it.each(['additionsKeys', 'visibility', 'allVisible'] as const)(
            '... should throw when accessing computed signal `%s` due to missing inputs',
            signalName => {
                expectToBe(isSignal(component[signalName]), true);

                expect(() => component[signalName]()).toThrow();
            }
        );

        describe('VIEW', () => {
            it('... should contain one div.card with a div.card-header and a div.card-body', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);

                getAndExpectDebugElementByCss(cardDes[0], 'div.card-header', 1, 1);
                getAndExpectDebugElementByCss(cardDes[0], 'div.card-body', 1, 1);
            });

            it('... should display the title in div.card-header', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'div.card-header > span', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent, 'Editorische Ergänzungen');
            });

            it('... should contain only one form-switch for all supplied classes yet', () => {
                getFormSwitchDes(1);
                getAndExpectDebugElementByDirective(compDe, FormSwitchComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('sheetId', expectedSheetId);
            fixture.componentRef.setInput('suppliedClasses', expectedSuppliedClasses);
            fixture.componentRef.setInput('hasTkkOverlays', true);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `sheetId` to hold the provided sheet id', () => {
            expectToBe(component.sheetId(), expectedSheetId);
        });

        it('... should have input signal `suppliedClasses` to hold the provided supplied classes', () => {
            expectToEqual(component.suppliedClasses(), expectedSuppliedClasses);
        });

        it('... should have input signal `hasTkkOverlays` to hold the provided flag', () => {
            expectToBe(component.hasTkkOverlays(), true);
        });

        it.each([
            { hasTkk: true, expected: ['class1', 'class2', EditionSvgOverlayTypes.tkk] },
            { hasTkk: false, expected: ['class1', 'class2'] },
        ])(
            '... should have computed signal `additionKeys` to hold the expected keys (hasTkkOverlays: $hasTkk)',
            ({ hasTkk, expected }) => {
                fixture.componentRef.setInput('hasTkkOverlays', hasTkk);

                expectToEqual(component.additionsKeys(), expected);
            }
        );

        it('... should have linked signal `visibility` to hold all addition keys as visible', () => {
            expectToEqual(component.visibility(), new Map(expectedAdditionsKeys.map(key => [key, true])));
        });

        it('... should have linked signal `visibility` reset to all visible for new addition keys', () => {
            setVisibility(expectedClass1, false);
            setVisibility(expectedTkkKey, false);

            fixture.componentRef.setInput('suppliedClasses', ['class3']);

            expectToEqual(
                component.visibility(),
                new Map([
                    ['class3', true],
                    [expectedTkkKey, true],
                ])
            );
        });

        it.each([
            { state: 'all are visible', hidden: [], expected: true },
            { state: 'a class is hidden', hidden: ['class1'], expected: false },
            { state: 'tkk is hidden', hidden: [EditionSvgOverlayTypes.tkk], expected: false },
        ])('... should have computed signal `allVisible` to hold $expected if $state', ({ hidden, expected }) => {
            hidden.forEach(key => setVisibility(key, false));

            expectToBe(component.allVisible(), expected);
        });

        describe('VIEW', () => {
            it('... should place each FormSwitchComponent in its own div.col of a responsive div.row', () => {
                const colDes = getAndExpectDebugElementByCss(
                    getCardBodyDes()[0],
                    'div.row.row-cols-1.row-cols-sm-2.row-cols-xl-3 > div.col',
                    expectedAdditionsKeys.length + 1,
                    expectedAdditionsKeys.length + 1
                );

                colDes.forEach(colDe => getAndExpectDebugElementByDirective(colDe, FormSwitchComponent, 1, 1));
            });

            it('... should contain one form-switch per additions key plus one for all', () => {
                getFormSwitchDes(expectedAdditionsKeys.length + 1);
            });

            it('... should pass down `inputId` and `checked` to each FormSwitchComponent', async () => {
                setVisibility(expectedClass2, false);
                await detectChangesOnPush(fixture);

                const formSwitchDes = getAndExpectDebugElementByDirective(
                    compDe,
                    FormSwitchComponent,
                    expectedAdditionsKeys.length + 1,
                    expectedAdditionsKeys.length + 1
                );
                const formSwitchCmps = formSwitchDes.map(de => de.injector.get(FormSwitchComponent));

                expectToEqual(
                    formSwitchCmps.map(cmp => [cmp.inputId(), cmp.checked()]),
                    [
                        ['awg-addition-all', false],
                        [`awg-addition-${expectedClass1}`, true],
                        [`awg-addition-${expectedClass2}`, false],
                        [`awg-addition-${expectedTkkKey}`, true],
                    ]
                );
            });

            describe('... form-switch for all', () => {
                it('... should contain a checked checkbox with label `Alle ausblenden`', () => {
                    const inputEl = getInputEl('all');

                    expectToBe(inputEl.type, 'checkbox');
                    expectToBe(inputEl.checked, true);
                    expectToBe(getLabelDe('all').nativeElement.textContent.trim(), 'Alle ausblenden');
                });

                it('... should contain an unchecked checkbox with label `Alle einblenden` if not all are visible', async () => {
                    setVisibility(expectedClass1, false);
                    await detectChangesOnPush(fixture);

                    expectToBe(getInputEl('all').checked, false);
                    expectToBe(getLabelDe('all').nativeElement.textContent.trim(), 'Alle einblenden');
                });

                it('... should trigger `toggleAll` on change', () => {
                    getInputEl('all').dispatchEvent(new Event('change'));

                    expectSpyCall(toggleAllSpy, 1);
                });
            });

            describe('... form-switches for switch keys', () => {
                it.each(['class1', 'class2', EditionSvgOverlayTypes.tkk])(
                    '... should contain a checked checkbox for `%s`',
                    key => {
                        const inputEl = getInputEl(key);

                        expectToBe(inputEl.type, 'checkbox');
                        expectToBe(inputEl.checked, true);
                    }
                );

                it.each(['class1', 'class2', EditionSvgOverlayTypes.tkk])(
                    '... should contain an unchecked checkbox for `%s` if hidden',
                    async key => {
                        setVisibility(key, false);
                        await detectChangesOnPush(fixture);

                        expectToBe(getInputEl(key).checked, false);
                    }
                );

                it.each([...expectedSuppliedClassLabels])(
                    '... should display the label for the supplied class `%s` (`%s`)',
                    async (suppliedClass, expectedLabel) => {
                        fixture.componentRef.setInput('suppliedClasses', [suppliedClass]);
                        await detectChangesOnPush(fixture);

                        expectToBe(getLabelDe(suppliedClass).nativeElement.textContent.trim(), expectedLabel);
                    }
                );

                it.each(['class1', 'class2'])(
                    '... should display the class name `%s` as label without a known label',
                    key => {
                        const labelDe = getLabelDe(key);

                        expectToBe(labelDe.nativeElement.textContent.trim(), key);
                        getAndExpectDebugElementByDirective(labelDe, EditionTkaLabelComponent, 0, 0);
                    }
                );

                it('... should contain EditionTkaLabelComponent as label for the tkk key', () => {
                    getAndExpectDebugElementByDirective(getLabelDe(expectedTkkKey), EditionTkaLabelComponent, 1, 1);
                });

                it('... should pass down `sheetId` and `labelType` to EditionTkaLabelComponent', () => {
                    const labelDes = getAndExpectDebugElementByDirective(compDe, EditionTkaLabelComponent, 1, 1);
                    const labelCmp = labelDes[0].injector.get(EditionTkaLabelComponent);

                    expectToBe(labelCmp.id(), expectedSheetId);
                    expectToBe(labelCmp.labelType(), 'commentary');
                });

                it('... should not contain a form-switch for tkk without tkk overlays', async () => {
                    fixture.componentRef.setInput('hasTkkOverlays', false);
                    await detectChangesOnPush(fixture);

                    getFormSwitchDes(expectedSuppliedClasses.length + 1);
                    getAndExpectDebugElementByCss(compDe, `input[id="awg-addition-${expectedTkkKey}"]`, 0, 0);
                    getAndExpectDebugElementByDirective(compDe, EditionTkaLabelComponent, 0, 0);
                });

                it.each(['class1', 'class2', EditionSvgOverlayTypes.tkk])(
                    '... should trigger `toggle` with `%s` on change',
                    key => {
                        getInputEl(key).dispatchEvent(new Event('change'));

                        expectSpyCall(toggleSpy, 1, key);
                    }
                );
            });
        });

        describe('METHODS', () => {
            describe('#toggle()', () => {
                it('... should have a method `toggle`', () => {
                    expect(component.toggle).toBeDefined();
                });

                it.each(['class1', EditionSvgOverlayTypes.tkk])(
                    '... should toggle the visibility of `%s` only and emit the new state',
                    key => {
                        component.toggle(key);

                        expectSpyCall(visibilityChangeSpy, 1, { key, isVisible: false });
                        expectToEqual(
                            component.visibility(),
                            new Map(expectedAdditionsKeys.map(additionsKey => [additionsKey, additionsKey !== key]))
                        );

                        component.toggle(key);

                        expectSpyCall(visibilityChangeSpy, 2, { key, isVisible: true });
                        expectToBe(component.allVisible(), true);
                    }
                );

                it('... should not mutate the input signal `suppliedClasses`', () => {
                    component.toggle(expectedClass1);

                    expectToEqual(component.suppliedClasses(), [expectedClass1, expectedClass2]);
                });
            });

            describe('#toggleAll()', () => {
                it('... should have a method `toggleAll`', () => {
                    expect(component.toggleAll).toBeDefined();
                });

                it('... should hide all additions and emit each change if all are visible', () => {
                    component.toggleAll();

                    expectToBe(component.allVisible(), false);
                    expectToEqual(
                        visibilityChangeSpy.mock.calls.map(([change]) => change),
                        expectedAdditionsKeys.map(key => ({ key, isVisible: false }))
                    );
                });

                it.each([
                    { state: 'in a mixed state', hidden: ['class1'] },
                    { state: 'if all are hidden', hidden: ['class1', 'class2', EditionSvgOverlayTypes.tkk] },
                ])('... should show all additions and emit each change $state', ({ hidden }) => {
                    hidden.forEach(key => setVisibility(key, false));

                    component.toggleAll();

                    expectToBe(component.allVisible(), true);
                    expectToEqual(
                        visibilityChangeSpy.mock.calls.map(([change]) => change),
                        expectedAdditionsKeys.map(key => ({ key, isVisible: true }))
                    );
                });
            });
        });
    });
});
