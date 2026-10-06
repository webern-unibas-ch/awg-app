import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { EditionSvgSheet, EditionSvgSheetSelection } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionSheetFacetItemLinkDirective } from './edition-sheet-facet-item-link.directive';
import { EditionSheetFacetItemComponent } from './edition-sheet-facet-item.component';

describe('EditionSheetFacetItemComponent (DONE)', () => {
    let component: EditionSheetFacetItemComponent;
    let fixture: ComponentFixture<EditionSheetFacetItemComponent>;
    let compDe: DebugElement;

    let mockNavigationService: Partial<EditionNavigationService>;

    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartials: EditionSvgSheet;

    let expectedSelection: EditionSvgSheetSelection;
    let expectedNextSelection: EditionSvgSheetSelection;
    let expectedSelectionWithPartialA: EditionSvgSheetSelection;
    let expectedOtherSelectionWithPartialB: EditionSvgSheetSelection;

    const getDirectLinkDes = () => getAndExpectDebugElementByCss(compDe, 'a.awg-edition-sheet-facet-item-link', 1, 1);
    const getDropdownDes = () =>
        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-facet-item-link-dropdown', 1, 1);
    const getDropdownToggleDes = () =>
        getAndExpectDebugElementByCss(getDropdownDes()[0], 'a.awg-edition-sheet-facet-item-link-dropdown-toggle', 1, 1);
    const getDropdownItemDes = () =>
        getAndExpectDebugElementByCss(
            getDropdownDes()[0],
            'a.dropdown-item',
            expectedSvgSheetWithPartials.content.length,
            expectedSvgSheetWithPartials.content.length
        );
    const getLinkDirective = (de: DebugElement) => de.injector.get(EditionSheetFacetItemLinkDirective, null);

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [EditionSheetFacetItemComponent],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedSvgSheetWithPartials = structuredClone(mockEditionData.mockSvgSheet_Sk2);

        expectedSelection = {
            id: expectedSvgSheet.id,
            fullId: expectedSvgSheet.id,
            content: mockEditionData.mockSvgSheet_Sk1.content[0],
        };
        expectedNextSelection = {
            id: mockEditionData.mockSvgSheet_Sk4.id,
            fullId: mockEditionData.mockSvgSheet_Sk4.id,
            content: mockEditionData.mockSvgSheet_Sk1.content[0],
        };
        expectedSelectionWithPartialA = {
            id: expectedSvgSheetWithPartials.id,
            fullId: `${expectedSvgSheetWithPartials.id}a`,
            content: mockEditionData.mockSvgSheet_Sk1.content[0],
        };
        expectedOtherSelectionWithPartialB = {
            id: mockEditionData.mockSvgSheet_Sk3b.id,
            fullId: `${mockEditionData.mockSvgSheet_Sk3b.id}b`,
            content: mockEditionData.mockSvgSheet_Sk1.content[0],
        };

        // Create component fixture
        fixture = TestBed.createComponent(EditionSheetFacetItemComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `svgSheet`', () => {
            expectToBe(isSignal(component.svgSheet), true);

            expect(() => component.svgSheet()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSvgSheet`', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(() => component.selectedSvgSheet()).toThrow();
        });

        it.each([
            { name: 'isActive' as const },
            { name: 'dropdownId' as const },
            { name: 'sheetPartials' as const },
            { name: 'sheetTarget' as const },
        ])('... should throw when accessing computed signal `$name` due to missing inputs', ({ name }) => {
            const computedSignal = component[name];

            expectToBe(isSignal(computedSignal), true);

            expect(() => computedSignal()).toThrow();
        });

        it('... should have variable `dropdownPopperOptions` to set a fixed positioning strategy', () => {
            const defaultOptions = { placement: 'bottom-start' as const, modifiers: [] };

            expectToEqual(component.dropdownPopperOptions(defaultOptions), { ...defaultOptions, strategy: 'fixed' });
        });

        describe('VIEW', () => {
            it('... should contain no anchors and no dropdown (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-facet-item-link-dropdown', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        describe('... with svg sheet without partials', () => {
            beforeEach(() => {
                // Set the initial values for the signal inputs
                fixture.componentRef.setInput('svgSheet', expectedSvgSheet);
                fixture.componentRef.setInput('selectedSvgSheet', expectedSelection);

                // Trigger initial data binding
                fixture.detectChanges();
            });

            it('... should have input signal `svgSheet` to hold the provided svg sheet', () => {
                expectToEqual(component.svgSheet(), expectedSvgSheet);
            });

            it('... should have input signal `selectedSvgSheet` to hold the provided svg sheet selection', () => {
                expectToEqual(component.selectedSvgSheet(), expectedSelection);
            });

            it('... should have computed signal `isActive` to hold true', () => {
                expectToBe(component.isActive(), true);
            });

            it('... should have recomputed signal `isActive` when another svg sheet is selected', async () => {
                fixture.componentRef.setInput('selectedSvgSheet', expectedNextSelection);
                await detectChangesOnPush(fixture);

                expectToBe(component.isActive(), false);
            });

            it('... should have recomputed signal `isActive` when no svg sheet is selected', async () => {
                fixture.componentRef.setInput('selectedSvgSheet', undefined);
                await detectChangesOnPush(fixture);

                expectToBe(component.isActive(), false);
            });

            it('... should have computed signal `sheetTarget` to hold the expected sheet target', () => {
                expectToEqual(component.sheetTarget(), { complexId: '', sheetId: expectedSvgSheet.id });
            });

            it('... should have recomputed signal `sheetTarget` when another svg sheet is provided', async () => {
                fixture.componentRef.setInput('svgSheet', mockEditionData.mockSvgSheet_Sk4);
                await detectChangesOnPush(fixture);

                expectToEqual(component.sheetTarget(), { complexId: '', sheetId: mockEditionData.mockSvgSheet_Sk4.id });
            });

            it('... should have computed signal `dropdownId` to hold the expected id (unused without partials)', () => {
                expectToBe(component.dropdownId(), 'awg-edition-sheet-facet-item-dropdown-' + expectedSvgSheet.id);
            });

            it('... should have recomputed signal `dropdownId` when another svg sheet is provided', async () => {
                fixture.componentRef.setInput('svgSheet', mockEditionData.mockSvgSheet_Sk4);
                await detectChangesOnPush(fixture);

                expectToBe(
                    component.dropdownId(),
                    'awg-edition-sheet-facet-item-dropdown-' + mockEditionData.mockSvgSheet_Sk4.id
                );
            });

            it('... should have computed signal `sheetPartials` to hold an empty array', () => {
                expectToEqual(component.sheetPartials(), []);
            });

            describe('VIEW', () => {
                it('... should contain one direct anchor and no dropdown', () => {
                    const aEl: HTMLAnchorElement = getDirectLinkDes()[0].nativeElement;

                    expectToContain(aEl.classList, 'btn');
                    expectToContain(aEl.classList, 'btn-default');
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-facet-item-link-dropdown', 0, 0);
                });

                it('... should display the sheet label in the direct anchor', () => {
                    const aEl: HTMLAnchorElement = getDirectLinkDes()[0].nativeElement;

                    expectToBe(aEl.textContent.trim(), expectedSvgSheet.label);
                });

                describe('EditionSheetFacetItemLinkDirective', () => {
                    it('... should be applied to the direct anchor', () => {
                        const linkDir = getLinkDirective(getDirectLinkDes()[0]);

                        expect(linkDir).toBeTruthy();
                    });

                    it('... should pass down `sheetTarget` to the directive of the direct anchor', () => {
                        const linkDir = getLinkDirective(getDirectLinkDes()[0]);

                        expectToEqual(linkDir?.sheetTarget(), component.sheetTarget());
                    });

                    it('... should pass down `isActive` to the directive of the direct anchor', () => {
                        const linkDir = getLinkDirective(getDirectLinkDes()[0]);

                        expectToBe(linkDir?.isActive(), true);
                    });

                    it('... should pass down updated `isActive` to the directive if another svg sheet is selected', async () => {
                        fixture.componentRef.setInput('selectedSvgSheet', expectedNextSelection);
                        await detectChangesOnPush(fixture);

                        const linkDir = getLinkDirective(getDirectLinkDes()[0]);

                        expectToBe(linkDir?.isActive(), false);
                    });

                    it('... should have `active` class on the direct anchor if the svg sheet is selected', () => {
                        const aEl: HTMLAnchorElement = getDirectLinkDes()[0].nativeElement;

                        expectToContain(aEl.classList, 'active');
                        expectToNotContain(aEl.classList, 'text-muted');
                    });

                    it('... should have `text-muted` class on the direct anchor if another svg sheet is selected', async () => {
                        fixture.componentRef.setInput('selectedSvgSheet', expectedNextSelection);
                        await detectChangesOnPush(fixture);

                        const aEl: HTMLAnchorElement = getDirectLinkDes()[0].nativeElement;

                        expectToContain(aEl.classList, 'text-muted');
                        expectToNotContain(aEl.classList, 'active');
                    });

                    it('... should navigate to `sheetTarget` on click of the direct anchor', async () => {
                        await clickAndAwaitChanges(getDirectLinkDes()[0], fixture);

                        expectSpyCall(mockNavigationService.navigateToSvgSheet as any, 1, component.sheetTarget());
                    });
                });
            });
        });

        describe('... with svg sheet with partials', () => {
            beforeEach(() => {
                // Set the initial values for the signal inputs
                fixture.componentRef.setInput('svgSheet', expectedSvgSheetWithPartials);
                fixture.componentRef.setInput('selectedSvgSheet', expectedSelectionWithPartialA);

                // Trigger initial data binding
                fixture.detectChanges();
            });

            it('... should have computed signal `isActive` to hold true if one of its partials is selected', () => {
                expectToBe(component.isActive(), true);
            });

            it('... should have computed signal `dropdownId` to hold the expected id', () => {
                expectToBe(
                    component.dropdownId(),
                    'awg-edition-sheet-facet-item-dropdown-' + expectedSvgSheetWithPartials.id
                );
            });

            it('... should have computed signal `sheetPartials` to hold the expected links', () => {
                expectToEqual(component.sheetPartials(), [
                    {
                        sheetTarget: { complexId: '', sheetId: expectedSvgSheetWithPartials.id + 'a' },
                        positionLabel: 'a · 1/2',
                        isActive: true,
                    },
                    {
                        sheetTarget: { complexId: '', sheetId: expectedSvgSheetWithPartials.id + 'b' },
                        positionLabel: 'b · 2/2',
                        isActive: false,
                    },
                ]);
            });

            it('... should have computed signal `sheetPartials` to hold only the index in the position label if a partial id is missing', async () => {
                const svgSheetWithoutPartialIds = {
                    ...expectedSvgSheetWithPartials,
                    content: expectedSvgSheetWithPartials.content.map(content => ({ ...content, partial: undefined })),
                };
                fixture.componentRef.setInput('svgSheet', svgSheetWithoutPartialIds);
                await detectChangesOnPush(fixture);

                expectToEqual(
                    component.sheetPartials().map(link => link.positionLabel),
                    ['1/2', '2/2']
                );
                expectToEqual(
                    component.sheetPartials().map(link => link.sheetTarget.sheetId),
                    [expectedSvgSheetWithPartials.id, expectedSvgSheetWithPartials.id]
                );
            });

            it('... should have recomputed signal `sheetPartials` with no active link if another svg sheet is selected', async () => {
                fixture.componentRef.setInput('selectedSvgSheet', expectedOtherSelectionWithPartialB);
                await detectChangesOnPush(fixture);

                expectToBe(component.isActive(), false);
                expectToEqual(
                    component.sheetPartials().map(link => link.isActive),
                    [false, false]
                );
            });

            it('... should have recomputed signal `sheetPartials` with no active link if no svg sheet is selected', async () => {
                fixture.componentRef.setInput('selectedSvgSheet', undefined);
                await detectChangesOnPush(fixture);

                expectToBe(component.isActive(), false);
                expectToEqual(
                    component.sheetPartials().map(link => link.isActive),
                    [false, false]
                );
            });

            it('... should have recomputed signal `sheetPartials` with no active link if an unknown partial of the svg sheet is selected', async () => {
                fixture.componentRef.setInput('selectedSvgSheet', {
                    id: expectedSvgSheetWithPartials.id,
                    fullId: `${expectedSvgSheetWithPartials.id}z`,
                    content: mockEditionData.mockSvgSheet_Sk1.content[0],
                });
                await detectChangesOnPush(fixture);

                expectToBe(component.isActive(), true);
                expectToEqual(
                    component.sheetPartials().map(link => link.isActive),
                    [false, false]
                );
            });

            it('... should have recomputed signal `sheetPartials` with only the link of the selected partial active', async () => {
                fixture.componentRef.setInput('selectedSvgSheet', {
                    id: expectedSvgSheetWithPartials.id,
                    fullId: `${expectedSvgSheetWithPartials.id}b`,
                    content: mockEditionData.mockSvgSheet_Sk1.content[0],
                });
                await detectChangesOnPush(fixture);

                expectToBe(component.isActive(), true);
                expectToEqual(
                    component.sheetPartials().map(link => link.isActive),
                    [false, true]
                );
            });

            describe('VIEW', () => {
                it('... should contain one dropdown and no direct anchor', () => {
                    getDropdownDes();
                    getAndExpectDebugElementByCss(compDe, 'a.awg-edition-sheet-facet-item-link', 0, 0);
                });

                it('... should pass down `dropdownPopperOptions` and no container to the NgbDropdown', () => {
                    const ngbDropdown = getDropdownDes()[0].injector.get(NgbDropdown);

                    expectToBe(ngbDropdown.popperOptions, component.dropdownPopperOptions);
                    expect(ngbDropdown.container).toBeFalsy();
                });

                it('... should have a unique id on the toggle anchor referenced by the dropdown menu', () => {
                    const toggleEl: HTMLAnchorElement = getDropdownToggleDes()[0].nativeElement;
                    const menuDes = getAndExpectDebugElementByCss(getDropdownDes()[0], 'div.dropdown-menu', 1, 1);
                    const menuEl: HTMLDivElement = menuDes[0].nativeElement;

                    expectToBe(toggleEl.id, component.dropdownId());
                    expectToBe(menuEl.getAttribute('aria-labelledby'), component.dropdownId());
                });

                it('... should display the sheet label and a badge with the partials count in the toggle anchor', () => {
                    const spanDes = getAndExpectDebugElementByCss(getDropdownToggleDes()[0], 'span:not(.badge)', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToContain(spanEl.textContent, expectedSvgSheetWithPartials.label);

                    const badgeDes = getAndExpectDebugElementByCss(spanDes[0], 'span.badge', 1, 1);
                    const badgeEl: HTMLSpanElement = badgeDes[0].nativeElement;

                    expectToBe(badgeEl.textContent, expectedSvgSheetWithPartials.content.length.toString());
                });

                it('... should have `active` class on the toggle anchor if one of its partials is selected', () => {
                    const toggleEl: HTMLAnchorElement = getDropdownToggleDes()[0].nativeElement;

                    expectToContain(toggleEl.classList, 'active');
                    expectToNotContain(toggleEl.classList, 'text-muted');
                });

                it('... should have `text-muted` class on the toggle anchor if another svg sheet is selected', async () => {
                    fixture.componentRef.setInput('selectedSvgSheet', expectedOtherSelectionWithPartialB);
                    await detectChangesOnPush(fixture);

                    const toggleEl: HTMLAnchorElement = getDropdownToggleDes()[0].nativeElement;

                    expectToContain(toggleEl.classList, 'text-muted');
                    expectToNotContain(toggleEl.classList, 'active');
                });

                it('... should contain as many item anchors (.dropdown-item) as partials in sheet content', () => {
                    getDropdownItemDes();
                });

                it('... should display the sheet label with partial id and numbered position in item anchors', () => {
                    const count = expectedSvgSheetWithPartials.content.length;

                    getDropdownItemDes().forEach((itemDe, index) => {
                        const itemEl: HTMLAnchorElement = itemDe.nativeElement;
                        const partial = expectedSvgSheetWithPartials.content[index].partial;

                        expectToBe(
                            itemEl.textContent.trim(),
                            `${expectedSvgSheetWithPartials.label} [${partial} · ${index + 1}/${count}]`
                        );
                    });
                });

                it('... should display only the numbered position in item anchors if a partial id is missing', async () => {
                    fixture.componentRef.setInput('svgSheet', {
                        ...expectedSvgSheetWithPartials,
                        content: expectedSvgSheetWithPartials.content.map(content => ({
                            ...content,
                            partial: undefined,
                        })),
                    });
                    await detectChangesOnPush(fixture);

                    const labels = getDropdownItemDes().map(itemDe => itemDe.nativeElement.textContent.trim());

                    expectToEqual(labels, [
                        `${expectedSvgSheetWithPartials.label} [1/2]`,
                        `${expectedSvgSheetWithPartials.label} [2/2]`,
                    ]);
                });

                describe('EditionSheetFacetItemLinkDirective', () => {
                    it('... should be applied to each item anchor', () => {
                        getDropdownItemDes().forEach(itemDe => {
                            const linkDir = getLinkDirective(itemDe);

                            expect(linkDir).toBeTruthy();
                        });
                    });

                    it('... should not be applied to the dropdown toggle anchor', () => {
                        const linkDir = getLinkDirective(getDropdownToggleDes()[0]);

                        expect(linkDir).toBeNull();
                    });

                    it('... should pass down `sheetTarget` (incl. partial) to the directive of each item anchor', () => {
                        const linkDirs = getDropdownItemDes().map(itemDe => getLinkDirective(itemDe));

                        const sheetTarget = linkDirs.map(linkDir => linkDir?.sheetTarget());

                        expectToEqual(sheetTarget, [
                            { complexId: '', sheetId: expectedSvgSheetWithPartials.id + 'a' },
                            { complexId: '', sheetId: expectedSvgSheetWithPartials.id + 'b' },
                        ]);
                    });

                    it('... should pass down `isActive` to the directive of each item anchor (only selected partial)', () => {
                        const linkDirs = getDropdownItemDes().map(itemDe => getLinkDirective(itemDe));

                        const isActiveValues = linkDirs.map(linkDir => linkDir?.isActive());

                        expectToEqual(isActiveValues, [true, false]);
                    });

                    it('... should pass down updated `isActive` to the directives if another svg sheet is selected', async () => {
                        fixture.componentRef.setInput('selectedSvgSheet', expectedOtherSelectionWithPartialB);
                        await detectChangesOnPush(fixture);

                        const linkDirs = getDropdownItemDes().map(itemDe => getLinkDirective(itemDe));

                        const isActiveValues = linkDirs.map(linkDir => linkDir?.isActive());

                        expectToEqual(isActiveValues, [false, false]);
                    });

                    it('... should navigate to the `sheetTarget` of the partial on click of an item anchor', async () => {
                        await clickAndAwaitChanges(getDropdownItemDes()[1], fixture);

                        expectSpyCall(mockNavigationService.navigateToSvgSheet as any, 1, {
                            complexId: '',
                            sheetId: expectedSvgSheetWithPartials.id + 'b',
                        });
                    });

                    it('... should not navigate on click of the dropdown toggle anchor', async () => {
                        await clickAndAwaitChanges(getDropdownToggleDes()[0], fixture);

                        expectSpyCall(mockNavigationService.navigateToSvgSheet as any, 0);
                    });
                });
            });
        });

        describe('... with svg sheet without content', () => {
            beforeEach(() => {
                fixture.componentRef.setInput('svgSheet', { ...expectedSvgSheet, content: [] });
                fixture.componentRef.setInput('selectedSvgSheet', expectedSelection);

                fixture.detectChanges();
            });

            it('... should have computed signal `isActive` to hold true if the svg sheet is selected', () => {
                expectToBe(component.isActive(), true);
            });

            it('... should have computed signal `sheetPartials` to hold an empty array', () => {
                expectToEqual(component.sheetPartials(), []);
            });

            it('... should have computed signal `sheetTarget` to hold the expected sheet target', () => {
                expectToEqual(component.sheetTarget(), { complexId: '', sheetId: expectedSvgSheet.id });
            });

            describe('VIEW', () => {
                it('... should contain no anchors and no dropdown', () => {
                    getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-facet-item-link-dropdown', 0, 0);
                });
            });
        });
    });
});
