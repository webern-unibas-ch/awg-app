import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { EditionSvgSheet, EditionSvgSheetId } from '@awg-views/edition-view/models/edition-svg-sheets.model';
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

    let expectedSheetId: EditionSvgSheetId;
    let expectedNextSheetId: EditionSvgSheetId;
    let expectedSheetIdWithPartialA: EditionSvgSheetId;
    let expectedOtherSheetIdWithPartialB: EditionSvgSheetId;

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

        expectedSheetId = { id: expectedSvgSheet.id, partial: undefined };
        expectedNextSheetId = { id: mockEditionData.mockSvgSheet_Sk4.id, partial: undefined };
        expectedSheetIdWithPartialA = { id: expectedSvgSheetWithPartials.id, partial: 'a' };
        expectedOtherSheetIdWithPartialB = { id: mockEditionData.mockSvgSheet_Sk3b.id, partial: 'b' };

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

        it('... should throw due to missing required input signal `selectedSheetId`', () => {
            expectToBe(isSignal(component.selectedSheetId), true);

            expect(() => component.selectedSheetId()).toThrow();
        });

        it.each([
            { name: 'isActive' as const },
            { name: 'sheetIds' as const },
            { name: 'dropdownId' as const },
            { name: 'partialLinks' as const },
        ])('... should throw when accessing computed signal `$name` due to missing inputs', ({ name }) => {
            const computedSignal = component[name];

            expectToBe(isSignal(computedSignal), true);

            expect(() => computedSignal()).toThrow();
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
                // Simulate the parent setting the input properties
                fixture.componentRef.setInput('svgSheet', expectedSvgSheet);
                fixture.componentRef.setInput('selectedSheetId', expectedSheetId);

                // Trigger initial data binding
                fixture.detectChanges();
            });

            it('... should have input signal `svgSheet` to hold the provided svg sheet', () => {
                expectToEqual(component.svgSheet(), expectedSvgSheet);
            });

            it('... should have input signal `selectedSheetId` to hold the provided sheet id', () => {
                expectToEqual(component.selectedSheetId(), expectedSheetId);
            });

            it('... should have computed signal `isActive` to hold true', () => {
                expectToBe(component.isActive(), true);
            });

            it('... should have recomputed signal `isActive` when another svg sheet is selected', async () => {
                fixture.componentRef.setInput('selectedSheetId', expectedNextSheetId);
                await detectChangesOnPush(fixture);

                expectToBe(component.isActive(), false);
            });

            it('... should have recomputed signal `isActive` when no svg sheet is selected', async () => {
                fixture.componentRef.setInput('selectedSheetId', { id: undefined, partial: undefined });
                await detectChangesOnPush(fixture);

                expectToBe(component.isActive(), false);
            });

            it('... should have computed signal `sheetIds` to hold the expected sheet ids', () => {
                expectToEqual(component.sheetIds(), { complexId: '', sheetId: expectedSvgSheet.id });
            });

            it('... should have computed signal `dropdownId` to hold the expected id (unused without partials)', () => {
                expectToBe(component.dropdownId(), 'awg-edition-sheet-facet-item-dropdown-' + expectedSvgSheet.id);
            });

            it('... should have computed signal `partialLinks` to hold an empty array', () => {
                expectToEqual(component.partialLinks(), []);
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

                    it('... should pass down `sheetIds` to the directive of the direct anchor', () => {
                        const linkDir = getLinkDirective(getDirectLinkDes()[0]);

                        expectToEqual(linkDir?.sheetIds(), component.sheetIds());
                    });

                    it('... should pass down `isActive` to the directive of the direct anchor', () => {
                        const linkDir = getLinkDirective(getDirectLinkDes()[0]);

                        expectToBe(linkDir?.isActive(), true);
                    });

                    it('... should pass down updated `isActive` to the directive if another svg sheet is selected', async () => {
                        fixture.componentRef.setInput('selectedSheetId', expectedNextSheetId);
                        await detectChangesOnPush(fixture);

                        const linkDir = getLinkDirective(getDirectLinkDes()[0]);

                        expectToBe(linkDir?.isActive(), false);
                    });
                });
            });
        });

        describe('... with svg sheet with partials', () => {
            beforeEach(() => {
                // Simulate the parent setting the input properties
                fixture.componentRef.setInput('svgSheet', expectedSvgSheetWithPartials);
                fixture.componentRef.setInput('selectedSheetId', expectedSheetIdWithPartialA);

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

            it('... should have computed signal `partialLinks` to hold the expected links', () => {
                expectToEqual(component.partialLinks(), [
                    {
                        sheetIds: { complexId: '', sheetId: expectedSvgSheetWithPartials.id + 'a' },
                        positionLabel: 'a · 1/2',
                        isActive: true,
                    },
                    {
                        sheetIds: { complexId: '', sheetId: expectedSvgSheetWithPartials.id + 'b' },
                        positionLabel: 'b · 2/2',
                        isActive: false,
                    },
                ]);
            });

            it('... should have computed signal `partialLinks` to hold only the index in the position label if a partial id is missing', async () => {
                const svgSheetWithoutPartialIds = {
                    ...expectedSvgSheetWithPartials,
                    content: expectedSvgSheetWithPartials.content.map(content => ({ ...content, partial: undefined })),
                };
                fixture.componentRef.setInput('svgSheet', svgSheetWithoutPartialIds);
                await detectChangesOnPush(fixture);

                expectToEqual(
                    component.partialLinks().map(link => link.positionLabel),
                    ['1/2', '2/2']
                );
                expectToEqual(
                    component.partialLinks().map(link => link.sheetIds.sheetId),
                    [expectedSvgSheetWithPartials.id, expectedSvgSheetWithPartials.id]
                );
            });

            it('... should have recomputed signal `partialLinks` with no active link if another svg sheet is selected', async () => {
                fixture.componentRef.setInput('selectedSheetId', expectedOtherSheetIdWithPartialB);
                await detectChangesOnPush(fixture);

                expectToBe(component.isActive(), false);
                expectToEqual(
                    component.partialLinks().map(link => link.isActive),
                    [false, false]
                );
            });

            it('... should have recomputed signal `partialLinks` with all links active if the svg sheet is selected without partial', async () => {
                fixture.componentRef.setInput('selectedSheetId', {
                    id: expectedSvgSheetWithPartials.id,
                    partial: undefined,
                });
                await detectChangesOnPush(fixture);

                expectToEqual(
                    component.partialLinks().map(link => link.isActive),
                    [true, true]
                );
            });

            describe('VIEW', () => {
                it('... should contain one dropdown and no direct anchor', () => {
                    getDropdownDes();
                    getAndExpectDebugElementByCss(compDe, 'a.awg-edition-sheet-facet-item-link', 0, 0);
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
                    fixture.componentRef.setInput('selectedSheetId', expectedOtherSheetIdWithPartialB);
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

                    it('... should pass down `sheetIds` (incl. partial) to the directive of each item anchor', () => {
                        const linkDirs = getDropdownItemDes().map(itemDe => getLinkDirective(itemDe));

                        const sheetIds = linkDirs.map(linkDir => linkDir?.sheetIds());

                        expectToEqual(sheetIds, [
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
                        fixture.componentRef.setInput('selectedSheetId', expectedOtherSheetIdWithPartialB);
                        await detectChangesOnPush(fixture);

                        const linkDirs = getDropdownItemDes().map(itemDe => getLinkDirective(itemDe));

                        const isActiveValues = linkDirs.map(linkDir => linkDir?.isActive());

                        expectToEqual(isActiveValues, [false, false]);
                    });
                });
            });
        });

        describe('... with svg sheet without content', () => {
            beforeEach(() => {
                fixture.componentRef.setInput('svgSheet', { ...expectedSvgSheet, content: [] });
                fixture.componentRef.setInput('selectedSheetId', expectedSheetId);

                fixture.detectChanges();
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
