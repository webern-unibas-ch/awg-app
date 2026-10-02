import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { SourceDescriptionSystem } from '@awg-views/edition-view/models/source-description.model';

import { SourceDescContentSystemComponent } from './source-desc-content-system.component';

describe('SourceDescContentSystemComponent', () => {
    let component: SourceDescContentSystemComponent;
    let fixture: ComponentFixture<SourceDescContentSystemComponent>;
    let compDe: DebugElement;

    let clickedEmitSpy: Spy;

    let expectedContentSystem: SourceDescriptionSystem;
    let expectedIsLastItem: boolean;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AbbrDirective, CompileHtmlDirective, ConditionalLinkComponent, SourceDescContentSystemComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedContentSystem = {
            system: '1',
            systemDescription: 'Test system description',
            measure: '1–3',
            linkTo: 'test_sheet_1',
            row: { rowType: 'P', rowBase: '0', rowNumber: '1' },
        };
        expectedIsLastItem = false;

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescContentSystemComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        clickedEmitSpy = vi.spyOn(component.clicked, 'emit');
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `contentSystem`', () => {
            expectToBe(isSignal(component.contentSystem), true);

            expect(() => component.contentSystem()).toThrow();
        });

        it('... should have input signal `isLastItem` to hold the default value', () => {
            expectToBe(isSignal(component.isLastItem), true);

            expectToBe(component.isLastItem(), false);
        });

        it('... should throw when accessing computed signal `hasValidRow` due to missing input', () => {
            expectToBe(isSignal(component.hasValidRow), true);

            expect(() => component.hasValidRow()).toThrow();
        });

        it('... should throw when accessing computed signal `hasDivider` due to missing input', () => {
            expectToBe(isSignal(component.hasDivider), true);

            expect(() => component.hasDivider()).toThrow();
        });

        it('... should throw when accessing computed signal `isClickable` due to missing input', () => {
            expectToBe(isSignal(component.isClickable), true);

            expect(() => component.isClickable()).toThrow();
        });

        it('... should have output `clicked`', () => {
            expect(component.clicked).toBeDefined();
        });

        describe('VIEW', () => {
            it('... should contain no system container span yet', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-grid-system-container', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('contentSystem', expectedContentSystem);
            fixture.componentRef.setInput('isLastItem', expectedIsLastItem);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `contentSystem` to hold the provided content system', () => {
            expect(component.contentSystem()).toEqual(expectedContentSystem);
        });

        it('... should have input signal `isLastItem` to hold the provided value', () => {
            expectToBe(component.isLastItem(), expectedIsLastItem);
        });

        it('... should have computed signal `hasValidRow` to hold true', () => {
            expectToBe(component.hasValidRow(), true);
        });

        describe('... should have recomputed signal `hasValidRow` to hold false if row is', () => {
            it.each([
                { desc: 'missing', row: undefined },
                { desc: 'empty', row: {} },
            ])('... $desc', ({ row }) => {
                fixture.componentRef.setInput('contentSystem', { ...expectedContentSystem, row });

                expectToBe(component.hasValidRow(), false);
            });
        });

        it('... should have computed signal `hasDivider` to hold true', () => {
            expectToBe(component.hasDivider(), true);
        });

        describe('... should have recomputed signal `hasDivider` to hold', () => {
            it.each([
                {
                    desc: 'true if only a system description is given',
                    changes: { measure: undefined, row: undefined },
                    expected: true,
                },
                {
                    desc: 'true if only a measure is given',
                    changes: { systemDescription: undefined, row: undefined },
                    expected: true,
                },
                {
                    desc: 'true if only a valid row is given',
                    changes: { systemDescription: undefined, measure: undefined },
                    expected: true,
                },
                {
                    desc: 'false if neither description, measure nor valid row is given',
                    changes: { systemDescription: undefined, measure: undefined, row: {} },
                    expected: false,
                },
            ])('... $desc', ({ changes, expected }) => {
                fixture.componentRef.setInput('contentSystem', { ...expectedContentSystem, ...changes });

                expectToBe(component.hasDivider(), expected);
            });
        });

        it('... should have computed signal `isClickable` to hold true', () => {
            expectToBe(component.isClickable(), true);
        });

        describe('... should have recomputed signal `isClickable` to hold false if linkTo is', () => {
            it.each([
                { desc: 'empty', linkTo: '' },
                { desc: 'undefined', linkTo: undefined },
            ])('... $desc', ({ linkTo }) => {
                fixture.componentRef.setInput('contentSystem', { ...expectedContentSystem, linkTo });

                expectToBe(component.isClickable(), false);
            });
        });

        describe('VIEW', () => {
            it('... should render no content if contentSystem is not available', async () => {
                fixture.componentRef.setInput('contentSystem', undefined);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-grid-system-container', 0, 0);
            });

            it('... should contain one system container span', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-grid-system-container', 1, 1);
            });

            it('... should display the system number', () => {
                const systemDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-grid-system',
                    1,
                    1
                );
                const systemEl: HTMLSpanElement = systemDes[0].nativeElement;

                expectToBe(systemEl.textContent.trim(), 'System 1');
            });

            it('... should not display the system number if not given', async () => {
                fixture.componentRef.setInput('contentSystem', { ...expectedContentSystem, system: undefined });
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-grid-system', 0, 0);
            });

            it('... should display the divider colon', () => {
                const containerEl: HTMLSpanElement = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-grid-system-container',
                    1,
                    1
                )[0].nativeElement;

                expect(containerEl.textContent).toContain(': ');
            });

            it('... should not display the divider colon if neither description, measure nor row is given', async () => {
                fixture.componentRef.setInput('contentSystem', { system: '1' });
                await detectChangesOnPush(fixture);

                const containerEl: HTMLSpanElement = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-grid-system-container',
                    1,
                    1
                )[0].nativeElement;

                expect(containerEl.textContent).not.toContain(':');
            });

            it('... should display the system description with CompileHtmlDirective', () => {
                const descriptionDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-grid-system-description',
                    1,
                    1
                );
                getAndExpectDebugElementByDirective(descriptionDes[0], CompileHtmlDirective, 1, 1);

                const descriptionEl: HTMLSpanElement = descriptionDes[0].nativeElement;

                expect(descriptionEl.textContent).toContain(expectedContentSystem.systemDescription);
            });

            it('... should not display the system description if not given', async () => {
                fixture.componentRef.setInput('contentSystem', {
                    ...expectedContentSystem,
                    systemDescription: undefined,
                });
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-grid-system-description', 0, 0);
            });

            it('... should display the measure', () => {
                const measureDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-grid-measure',
                    1,
                    1
                );
                getAndExpectDebugElementByDirective(measureDes[0], AbbrDirective, 1, 1);

                const measureEl: HTMLSpanElement = measureDes[0].nativeElement;

                expect(measureEl.textContent).toContain(expectedContentSystem.measure);
            });

            it('... should not display the measure if not given', async () => {
                fixture.componentRef.setInput('contentSystem', { ...expectedContentSystem, measure: undefined });
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-grid-measure', 0, 0);
            });

            it('... should display the row with type, base (as sub) and number', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-grid-row', 1, 1);
                const subDes = getAndExpectDebugElementByCss(rowDes[0], 'sub', 1, 1);

                const rowEl: HTMLSpanElement = rowDes[0].nativeElement;
                const subEl: HTMLElement = subDes[0].nativeElement;

                expectToBe(subEl.textContent, expectedContentSystem.row?.rowBase);
                expectToBe(rowEl.textContent.replace(/\s+/g, ' ').trim(), 'P0 (1)');
            });

            it('... should display the row without number if not given', async () => {
                fixture.componentRef.setInput('contentSystem', {
                    ...expectedContentSystem,
                    row: { rowType: 'P', rowBase: '0' },
                });
                await detectChangesOnPush(fixture);

                const rowEl: HTMLSpanElement = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-grid-row',
                    1,
                    1
                )[0].nativeElement;

                expectToBe(rowEl.textContent.trim(), 'P0');
            });

            it('... should not display the row if row is empty', async () => {
                fixture.componentRef.setInput('contentSystem', { ...expectedContentSystem, row: {} });
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-grid-row', 0, 0);
            });

            it('... should end with a semicolon if not the last item', () => {
                const containerEl: HTMLSpanElement = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-grid-system-container',
                    1,
                    1
                )[0].nativeElement;

                expectToBe(containerEl.textContent.trim().endsWith(';'), true);
            });

            it('... should end with a period if the last item', async () => {
                fixture.componentRef.setInput('isLastItem', true);
                await detectChangesOnPush(fixture);

                const containerEl: HTMLSpanElement = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-grid-system-container',
                    1,
                    1
                )[0].nativeElement;

                expectToBe(containerEl.textContent.trim().endsWith('.'), true);
            });

            describe('... ConditionalLinkComponent', () => {
                it('... should contain two ConditionalLinkComponents (measure and row)', () => {
                    getAndExpectDebugElementByDirective(compDe, ConditionalLinkComponent, 2, 2);
                });

                it('... should pass down isClickable = true if linkTo is given', () => {
                    const linkDes = getAndExpectDebugElementByDirective(compDe, ConditionalLinkComponent, 2, 2);

                    linkDes.forEach(linkDe => {
                        const linkCmp = linkDe.injector.get(ConditionalLinkComponent);
                        expectToBe(linkCmp.isClickable(), true);
                    });
                });

                it('... should pass down isClickable = false if linkTo is not given', async () => {
                    fixture.componentRef.setInput('contentSystem', { ...expectedContentSystem, linkTo: undefined });
                    await detectChangesOnPush(fixture);

                    const linkDes = getAndExpectDebugElementByDirective(compDe, ConditionalLinkComponent, 2, 2);

                    linkDes.forEach(linkDe => {
                        const linkCmp = linkDe.injector.get(ConditionalLinkComponent);
                        expectToBe(linkCmp.isClickable(), false);
                    });
                });

                it('... should emit `clicked` when the measure link is clicked', async () => {
                    const measureDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-desc-content-grid-measure',
                        1,
                        1
                    );
                    const anchorDes = getAndExpectDebugElementByCss(measureDes[0], 'a', 1, 1);

                    await clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(clickedEmitSpy, 1);
                });

                it('... should emit `clicked` when the row link is clicked', async () => {
                    const rowDes = getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-grid-row', 1, 1);
                    const anchorDes = getAndExpectDebugElementByCss(rowDes[0], 'a', 1, 1);

                    await clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(clickedEmitSpy, 1);
                });

                it('... should not render links (and not emit) if linkTo is not given', async () => {
                    fixture.componentRef.setInput('contentSystem', { ...expectedContentSystem, linkTo: undefined });
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
                    expectSpyCall(clickedEmitSpy, 0);
                });
            });
        });
    });
});
