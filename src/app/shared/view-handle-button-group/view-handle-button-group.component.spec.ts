import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDiagramProject, faGripHorizontal, faTable } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ViewHandle, ViewHandleTypes } from './view-handle.model';

import { ViewHandleButtonGroupComponent } from './view-handle-button-group.component';

describe('ViewHandleButtonGroupComponent (DONE)', () => {
    let component: ViewHandleButtonGroupComponent;
    let fixture: ComponentFixture<ViewHandleButtonGroupComponent>;
    let compDe: DebugElement;

    let expectedViewHandles: ViewHandle[];
    let expectedSelectedViewType: ViewHandleTypes;

    let viewChangeRequestSpy: Spy;

    const btnGroupSelector = 'div.awg-view-handle-btn-group > div.btn-group';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ViewHandleButtonGroupComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedViewHandles = [
            new ViewHandle('Graph view', ViewHandleTypes.GRAPH, faDiagramProject),
            new ViewHandle('Table view', ViewHandleTypes.TABLE, faTable),
            new ViewHandle('Grid view', ViewHandleTypes.GRID, faGripHorizontal),
        ];
        expectedSelectedViewType = ViewHandleTypes.GRAPH;

        // Create component fixture
        fixture = TestBed.createComponent(ViewHandleButtonGroupComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        viewChangeRequestSpy = vi.spyOn(component.viewChangeRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `viewHandles` to hold the default value', () => {
            expectToBe(isSignal(component.viewHandles), true);
            expectToEqual(component.viewHandles(), []);
        });

        it('... should throw due to missing required input signal `selectedViewType`', () => {
            expectToBe(isSignal(component.selectedViewType), true);

            expect(() => component.selectedViewType()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-view-handle-btn-group', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-view-handle-btn-group', 1, 1);
            });

            it('... should contain another div.btn-group in div.awg-view-handle-btn-group', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, btnGroupSelector, 1, 1);
                const divEl: HTMLDivElement = divDes[0].nativeElement;

                expectToBe(divEl.getAttribute('role'), 'group');
                expectToBe(divEl.getAttribute('aria-label'), 'View handle button group');
            });

            it('... should contain no input elements in div.btn-group yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, btnGroupSelector, 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'input', 0, 0);
            });

            it('... should contain no label elements in div.btn-group yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, btnGroupSelector, 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'label', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        const getInputEls = (): HTMLInputElement[] =>
            getAndExpectDebugElementByCss(
                compDe,
                `${btnGroupSelector} > input`,
                expectedViewHandles.length,
                expectedViewHandles.length
            ).map(de => de.nativeElement);

        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('viewHandles', expectedViewHandles);
            fixture.componentRef.setInput('selectedViewType', expectedSelectedViewType);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `viewHandles` to hold the provided view handles', () => {
            expectToEqual(component.viewHandles(), expectedViewHandles);
        });

        it('... should have input signal `selectedViewType` to hold the provided view type', () => {
            expectToBe(component.selectedViewType(), expectedSelectedViewType);
        });

        describe('VIEW', () => {
            it('... should contain as many radio elements (input.btn-check) in div.btn-group as viewHandles given', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, btnGroupSelector, 1, 1);
                const inputDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'input.btn-check',
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                inputDes.forEach(inputDe => {
                    const inputEl: HTMLInputElement = inputDe.nativeElement;

                    expectToBe(inputEl.type, 'radio');
                });
            });

            it('... should group all radio elements by name `viewHandle`', () => {
                getInputEls().forEach(inputEl => {
                    expectToBe(inputEl.name, 'viewHandle');
                });
            });

            it('... should set the value of the input elements to the viewHandle types', () => {
                getInputEls().forEach((inputEl, i) => {
                    expectToBe(inputEl.value, expectedViewHandles[i].type);
                });
            });

            it('... should set the id of the input elements to `{viewHandle.type}-view-button`', () => {
                getInputEls().forEach((inputEl, i) => {
                    expectToBe(inputEl.id, `${expectedViewHandles[i].type}-view-button`);
                });
            });

            it('... should check only the radio element of the selected view type', () => {
                const inputEls = getInputEls();

                expectToBe(inputEls[0].checked, true);
                expectToBe(inputEls[1].checked, false);
                expectToBe(inputEls[2].checked, false);
            });

            it('... should check the radio element of a changed selected view type', async () => {
                fixture.componentRef.setInput('selectedViewType', ViewHandleTypes.TABLE);
                await detectChangesOnPush(fixture);

                const inputEls = getInputEls();

                expectToBe(inputEls[0].checked, false);
                expectToBe(inputEls[1].checked, true);
                expectToBe(inputEls[2].checked, false);
            });

            it('... should contain as many label elements in div.btn-group as viewHandles given', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, btnGroupSelector, 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'label',
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );
            });

            it('... should set the `for` attribute of the label elements to `{viewHandle.type}-view-button`', () => {
                const labelDes = getAndExpectDebugElementByCss(
                    compDe,
                    `${btnGroupSelector} > label`,
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                labelDes.forEach((labelDe, i) => {
                    expectToBe(labelDe.attributes['for'], `${expectedViewHandles[i].type}-view-button`);
                });
            });

            it('... should emit the view type by click on a label', () => {
                const labelDes = getAndExpectDebugElementByCss(
                    compDe,
                    `${btnGroupSelector} > label`,
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                (labelDes[1].nativeElement as HTMLLabelElement).click();

                expectSpyCall(viewChangeRequestSpy, 1, ViewHandleTypes.TABLE);
            });

            it('... should display a visually hidden `{type} view` text in the label elements', () => {
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    `${btnGroupSelector} > label > span.visually-hidden`,
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                spanDes.forEach((spanDe, i) => {
                    const spanEl: HTMLSpanElement = spanDe.nativeElement;

                    expectToBe(spanEl.textContent, `${expectedViewHandles[i].type} view`);
                });
            });

            it('... should display the viewHandle icon in each label element', () => {
                const labelDes = getAndExpectDebugElementByCss(
                    compDe,
                    `${btnGroupSelector} > label`,
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                labelDes.forEach((labelDe, i) => {
                    const faIconDes = getAndExpectDebugElementByDirective(labelDe, FaIconComponent, 1, 1);
                    const faIconIns = faIconDes[0].injector.get(FaIconComponent);

                    expectToEqual(faIconIns.icon(), expectedViewHandles[i].icon);
                });
            });

            it('... should display tooltip with `{type} view` for each view handle', () => {
                const tooltipDes = getAndExpectDebugElementByDirective(
                    compDe,
                    NgbTooltip,
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                tooltipDes.forEach((tooltipDe, i) => {
                    const tooltipCmp = tooltipDe.injector.get(NgbTooltip);

                    expectToBe(tooltipCmp.ngbTooltip, `${expectedViewHandles[i].type} view`);
                });
            });

            describe('... output `viewChangeRequest`', () => {
                it('... should emit GRAPH by change event from GRAPH radio button', () => {
                    getInputEls()[0].dispatchEvent(new Event('change'));

                    expectSpyCall(viewChangeRequestSpy, 1, ViewHandleTypes.GRAPH);
                });

                it('... should emit TABLE by change event from TABLE radio button', () => {
                    getInputEls()[1].dispatchEvent(new Event('change'));

                    expectSpyCall(viewChangeRequestSpy, 1, ViewHandleTypes.TABLE);
                });

                it('... should emit GRID by change event from GRID radio button', () => {
                    getInputEls()[2].dispatchEvent(new Event('change'));

                    expectSpyCall(viewChangeRequestSpy, 1, ViewHandleTypes.GRID);
                });
            });
        });
    });
});
