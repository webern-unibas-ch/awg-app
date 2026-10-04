import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import {
    createD3TestLinkBoxGroups,
    createD3TestRootGroup,
    createD3TestSvg,
    createD3TestTkkGroups,
} from '@testing/svg-drawing-helper';

import {
    D3Selection,
    EditionSvgLinkBox,
    EditionSvgOverlay,
    EditionSvgOverlayColorState,
    EditionSvgOverlayTypes,
} from '@awg-views/edition-view/models';
import { EditionSvgDrawingService } from '@awg-views/edition-view/services';

import { EditionSvgOverlayService } from './edition-svg-overlay.service';

describe('EditionSvgOverlayService (DONE)', () => {
    let service: EditionSvgOverlayService;

    let mockDocument: Document;
    let mockEditionSvgDrawingService: EditionSvgDrawingService;

    let serviceFillD3SelectionWithColorSpy: Spy;
    let serviceGetGroupsBySelectorSpy: Spy;

    let expectedSvgRootGroup: D3Selection;
    let expectedTkkOverlays: EditionSvgOverlay[];
    let expectedLinkBoxes: EditionSvgLinkBox[];

    const getTkkRect = (id: string): SVGRectElement | null =>
        expectedSvgRootGroup.node()?.querySelector(`#${id} rect.tkk-overlay-group-box`) ?? null;
    const getRectFill = (id: string): string | null | undefined => getTkkRect(id)?.getAttribute('fill');
    const createColorState = (partial: Partial<EditionSvgOverlayColorState> = {}): EditionSvgOverlayColorState => ({
        selectedDataIds: new Set(),
        hoveredDataId: undefined,
        isHighlighted: true,
        ...partial,
    });

    beforeAll(() => {
        const svgElementPrototype = (globalThis as any).SVGElement?.prototype;

        if (svgElementPrototype && typeof svgElementPrototype.getBBox !== 'function') {
            Object.defineProperty(svgElementPrototype, 'getBBox', {
                value: () => ({ x: 0, y: 0, width: 10, height: 10 }),
                configurable: true,
            });
        }
    });

    beforeEach(() => {
        // Mock service
        mockEditionSvgDrawingService = {
            fillD3SelectionWithColor: (selection: D3Selection, color: string) => {
                if (selection) {
                    selection.attr('fill', color);
                }
            },
            getD3SelectionById: (rootGroup: D3Selection, id: string) => rootGroup?.select('#' + id),
            getD3SelectionByDataId: (rootGroup: D3Selection, dataId: string) => {
                const selection = rootGroup?.selectAll(`[data-tkk-id="${dataId}"]`);
                return selection && !selection.empty() ? selection : rootGroup?.select(`#${dataId}`);
            },
            getGroupsBySelector: (rootGroup: D3Selection, selector: string) => rootGroup?.selectAll('g.' + selector),
        } as unknown as EditionSvgDrawingService;

        TestBed.configureTestingModule({
            providers: [{ provide: EditionSvgDrawingService, useValue: mockEditionSvgDrawingService }],
        });

        service = TestBed.inject(EditionSvgOverlayService);
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedTkkOverlays = [
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1'),
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', 'tkk-2'),
        ];
        expectedLinkBoxes = [{ svgGroupId: 'link-box-1', linkTo: { complexId: 'testComplex', sheetId: 'Test_Sk1' } }];

        expectedSvgRootGroup = createD3TestRootGroup(createD3TestSvg(mockDocument));
        createD3TestTkkGroups(expectedSvgRootGroup, expectedTkkOverlays);
        createD3TestLinkBoxGroups(expectedSvgRootGroup, expectedLinkBoxes);

        // Spies
        serviceFillD3SelectionWithColorSpy = vi.spyOn(mockEditionSvgDrawingService, 'fillD3SelectionWithColor');
        serviceGetGroupsBySelectorSpy = vi.spyOn(mockEditionSvgDrawingService, 'getGroupsBySelector');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be created', () => {
        expect(service).toBeTruthy();
    });

    it('... should have private `_tkkOverlayColors` for the tkk overlay states', () => {
        expectToEqual(service['_tkkOverlayColors'], {
            fill: 'tomato',
            hover: 'orange',
            selected: 'green',
            transparent: 'transparent',
        });
    });

    it.each([
        ['_overlayBoxesOpacity', 0.3],
        ['_overlayBoxAdditionalSpace', 1.5],
        ['_overlayBoxCornerRadius', 1],
        ['_tkkOverlayBoxClass', 'tkk-overlay-group-box'],
        ['_tkkOverlayLabel', 'Textkritische Anmerkungen anzeigen'],
        ['_linkBoxLabel', 'Verknüpfte Skizze öffnen'],
    ])('... should have private `%s` = %s', (key, expected) => {
        expectToBe((service as any)[key], expected);
    });

    describe('#createSvgOverlays()', () => {
        it('... should have a method `createSvgOverlays`', () => {
            expect(service.createSvgOverlays).toBeDefined();
        });

        it('... should return an empty array without a root group selection', () => {
            expectToEqual(service.createSvgOverlays(undefined), []);
        });

        it('... should return an empty array if no tkk groups can be selected', () => {
            serviceGetGroupsBySelectorSpy.mockImplementation((rootGroup: D3Selection, selector: string) =>
                selector === EditionSvgOverlayTypes.tkk ? undefined : rootGroup.selectAll('g.' + selector)
            );

            expectToEqual(service.createSvgOverlays(expectedSvgRootGroup), []);
        });

        it('... should return the available tkk overlays (not selected)', () => {
            expectToEqual(service.createSvgOverlays(expectedSvgRootGroup), expectedTkkOverlays);
            expectSpyCall(serviceGetGroupsBySelectorSpy, 2, [expectedSvgRootGroup, EditionSvgOverlayTypes.tkk]);
        });

        it('... should use the data-tkk-id attribute as data id if present', () => {
            expectedSvgRootGroup.select('#tkk-2').attr('data-tkk-id', 'tkk-1');

            const overlays = service.createSvgOverlays(expectedSvgRootGroup);

            expectToEqual(
                overlays.map(overlay => [overlay.id, overlay.dataId]),
                [
                    ['tkk-1', 'tkk-1'],
                    ['tkk-2', 'tkk-1'],
                ]
            );
        });

        it('... should skip tkk groups without id', () => {
            expectedSvgRootGroup.append('g').attr('class', 'tkk');

            expectToBe(service.createSvgOverlays(expectedSvgRootGroup).length, expectedTkkOverlays.length);
        });

        it('... should not add a tkk overlay twice for duplicate group ids', () => {
            expectedSvgRootGroup.append('g').attr('class', 'tkk').attr('id', 'tkk-1');

            expectToBe(service.createSvgOverlays(expectedSvgRootGroup).length, expectedTkkOverlays.length);
        });

        it('... should draw an overlay box for each tkk group (around its bounding box)', () => {
            // Bounding boxes before drawing (jsdom: patched getBBox, browser: real dimensions)
            const bBoxes = new Map(
                expectedTkkOverlays.map(overlay => [
                    overlay.id,
                    (expectedSvgRootGroup.select('#' + overlay.id).node() as SVGGElement).getBBox(),
                ])
            );

            service.createSvgOverlays(expectedSvgRootGroup);

            expectedTkkOverlays.forEach(overlay => {
                const rect = getTkkRect(overlay.id);
                const bBox = bBoxes.get(overlay.id) as DOMRect;

                expect(rect).toBeTruthy();
                expectToBe(rect?.parentElement?.getAttribute('class'), 'tkk-overlay-group');
                expectToBe(rect?.getAttribute('fill'), 'tomato');
                expectToBe(rect?.getAttribute('opacity'), '0.3');
                expectToBe(rect?.getAttribute('rx'), '1');
                expectToBe(rect?.getAttribute('width'), String(bBox.width + 3));
                expectToBe(rect?.getAttribute('height'), String(bBox.height + 3));
                expectToBe(rect?.getAttribute('x'), String(bBox.x - 1.5));
                expectToBe(rect?.getAttribute('y'), String(bBox.y - 1.5));
            });
        });

        it('... should make each tkk overlay box a focusable toggle button', () => {
            service.createSvgOverlays(expectedSvgRootGroup);

            expectedTkkOverlays.forEach(overlay => {
                const rect = getTkkRect(overlay.id);

                expectToBe(rect?.getAttribute('tabindex'), '0');
                expectToBe(rect?.getAttribute('role'), 'button');
                expectToBe(rect?.getAttribute('aria-pressed'), 'false');
                expectToBe(rect?.getAttribute('aria-label'), 'Textkritische Anmerkungen anzeigen');
            });
        });

        it('... should make each link box group a focusable link', () => {
            service.createSvgOverlays(expectedSvgRootGroup);

            const linkBoxEl = expectedSvgRootGroup.select('#link-box-1').node() as Element;

            expectToBe(linkBoxEl.getAttribute('tabindex'), '0');
            expectToBe(linkBoxEl.getAttribute('role'), 'link');
            expectToBe(linkBoxEl.getAttribute('aria-label'), 'Verknüpfte Skizze öffnen');
        });

        it('... should not draw anything on link box groups', () => {
            service.createSvgOverlays(expectedSvgRootGroup);

            expectToBe((expectedSvgRootGroup.select('#link-box-1').node() as Element).childElementCount, 0);
        });

        it('... should skip drawing if the tkk group cannot be selected by id', () => {
            vi.spyOn(mockEditionSvgDrawingService, 'getD3SelectionById').mockReturnValue(undefined);

            const overlays = service.createSvgOverlays(expectedSvgRootGroup);

            expectToBe(overlays.length, expectedTkkOverlays.length);
            expect(getTkkRect('tkk-1')).toBeNull();
        });
    });

    describe('#toggleTkkSelection()', () => {
        it('... should have a method `toggleTkkSelection`', () => {
            expect(service.toggleTkkSelection).toBeDefined();
        });

        it('... should add a not yet selected data id', () => {
            expectToEqual(service.toggleTkkSelection(new Set(['tkk-1']), 'tkk-2'), new Set(['tkk-1', 'tkk-2']));
        });

        it('... should remove an already selected data id', () => {
            expectToEqual(service.toggleTkkSelection(new Set(['tkk-1', 'tkk-2']), 'tkk-1'), new Set(['tkk-2']));
        });

        it('... should not mutate the given set', () => {
            const selected = new Set(['tkk-1']);

            service.toggleTkkSelection(selected, 'tkk-2');

            expectToEqual(selected, new Set(['tkk-1']));
        });
    });

    describe('#getTkkOverlaysByDataIds()', () => {
        let multiPartOverlays: EditionSvgOverlay[];

        beforeEach(() => {
            multiPartOverlays = [
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1'),
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2a', 'tkk-2'),
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-3', 'tkk-3'),
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2b', 'tkk-2'),
            ];
        });

        it('... should have a method `getTkkOverlaysByDataIds`', () => {
            expect(service.getTkkOverlaysByDataIds).toBeDefined();
        });

        it('... should return all parts of the selected data ids in their original order', () => {
            expectToEqual(service.getTkkOverlaysByDataIds(multiPartOverlays, new Set(['tkk-2', 'tkk-1'])), [
                multiPartOverlays[0],
                multiPartOverlays[1],
                multiPartOverlays[3],
            ]);
        });

        it('... should return the same overlay instances (no copies)', () => {
            const [result] = service.getTkkOverlaysByDataIds(multiPartOverlays, new Set(['tkk-3']));

            expectToBe(result, multiPartOverlays[2]);
        });

        it('... should return an empty array for no data ids', () => {
            expectToEqual(service.getTkkOverlaysByDataIds(multiPartOverlays, new Set()), []);
        });
    });

    describe('#getTkkDataId()', () => {
        beforeEach(() => {
            service.createSvgOverlays(expectedSvgRootGroup);
            expectedSvgRootGroup.select('#link-box-1').append('path');
        });

        it('... should have a method `getTkkDataId`', () => {
            expect(service.getTkkDataId).toBeDefined();
        });

        it('... should return the data id for a tkk overlay box', () => {
            expectToBe(service.getTkkDataId(getTkkRect('tkk-1')), 'tkk-1');
        });

        it.each([
            ['a link box', () => expectedSvgRootGroup.select('#link-box-1 path').node()],
            ['null', () => null],
        ])('... should return undefined for %s', (_label, getTarget) => {
            expect(service.getTkkDataId(getTarget() as unknown as EventTarget | null)).toBeUndefined();
        });
    });

    describe('#getSvgOverlayTarget()', () => {
        beforeEach(() => {
            service.createSvgOverlays(expectedSvgRootGroup);
            expectedSvgRootGroup.select('#link-box-1').append('path');
        });

        it('... should have a method `getSvgOverlayTarget`', () => {
            expect(service.getSvgOverlayTarget).toBeDefined();
        });

        it('... should return the tkk data id for a tkk overlay box', () => {
            expectToEqual(service.getSvgOverlayTarget(getTkkRect('tkk-1')), {
                type: EditionSvgOverlayTypes.tkk,
                dataId: 'tkk-1',
            });
        });

        it('... should return the data-tkk-id for a tkk overlay box if present', () => {
            expectedSvgRootGroup.select('#tkk-2').attr('data-tkk-id', 'tkk-shared');

            expectToEqual(service.getSvgOverlayTarget(getTkkRect('tkk-2')), {
                type: EditionSvgOverlayTypes.tkk,
                dataId: 'tkk-shared',
            });
        });

        it('... should return the link box id for an element inside a link box group', () => {
            const pathEl = expectedSvgRootGroup.select('#link-box-1 path').node() as Element;

            expectToEqual(service.getSvgOverlayTarget(pathEl), {
                type: EditionSvgOverlayTypes.linkBox,
                id: 'link-box-1',
            });
        });

        it.each([
            ['null', () => null],
            ['a non-element target', () => mockDocument],
            ['the root group', () => expectedSvgRootGroup.node()],
            ['a tkk group without overlay box', () => expectedSvgRootGroup.select('#tkk-1').node()],
        ])('... should return undefined for %s', (_label, getTarget) => {
            expect(service.getSvgOverlayTarget(getTarget() as unknown as EventTarget | null)).toBeUndefined();
        });

        it('... should return undefined for a link box group without id', () => {
            const groupEl = expectedSvgRootGroup.append('g').attr('class', 'link-box').append('path').node() as Element;

            expect(service.getSvgOverlayTarget(groupEl)).toBeUndefined();
        });
    });

    describe('#updateTkkOverlayColors()', () => {
        beforeEach(() => {
            service.createSvgOverlays(expectedSvgRootGroup);
        });

        it('... should have a method `updateTkkOverlayColors`', () => {
            expect(service.updateTkkOverlayColors).toBeDefined();
        });

        it('... should do nothing without a root group selection', () => {
            service.updateTkkOverlayColors(undefined, expectedTkkOverlays, createColorState());

            expectSpyCall(serviceFillD3SelectionWithColorSpy, 0);
        });

        it.each([
            { label: 'default', state: {}, expected: ['tomato', 'tomato'] },
            { label: 'hovered', state: { hoveredDataId: 'tkk-1' }, expected: ['orange', 'tomato'] },
            { label: 'selected', state: { selectedDataIds: new Set(['tkk-2']) }, expected: ['tomato', 'green'] },
            {
                label: 'selected and hovered',
                state: { selectedDataIds: new Set(['tkk-1']), hoveredDataId: 'tkk-1' },
                expected: ['green', 'tomato'],
            },
            {
                label: 'not highlighted',
                state: { selectedDataIds: new Set(['tkk-1']), hoveredDataId: 'tkk-2', isHighlighted: false },
                expected: ['transparent', 'transparent'],
            },
        ])('... should color the overlay boxes for the $label state', ({ state, expected }) => {
            service.updateTkkOverlayColors(expectedSvgRootGroup, expectedTkkOverlays, createColorState(state));

            expectToEqual([getRectFill('tkk-1'), getRectFill('tkk-2')], expected);
        });

        it('... should set `aria-pressed` of the overlay boxes according to the selection', () => {
            service.updateTkkOverlayColors(
                expectedSvgRootGroup,
                expectedTkkOverlays,
                createColorState({ selectedDataIds: new Set(['tkk-2']) })
            );

            expectToEqual(
                [getTkkRect('tkk-1')?.getAttribute('aria-pressed'), getTkkRect('tkk-2')?.getAttribute('aria-pressed')],
                ['false', 'true']
            );
        });

        it.each([
            { isHighlighted: true, expected: { tabindex: '0', ariaHidden: null, pointerEvents: null } },
            { isHighlighted: false, expected: { tabindex: '-1', ariaHidden: 'true', pointerEvents: 'none' } },
        ])(
            '... should set the interactivity of the overlay boxes (isHighlighted: $isHighlighted)',
            ({ isHighlighted, expected }) => {
                service.updateTkkOverlayColors(
                    expectedSvgRootGroup,
                    expectedTkkOverlays,
                    createColorState({ isHighlighted })
                );

                ['tkk-1', 'tkk-2'].forEach(id => {
                    const rect = getTkkRect(id);
                    expectToEqual(
                        {
                            tabindex: rect?.getAttribute('tabindex'),
                            ariaHidden: rect?.getAttribute('aria-hidden'),
                            pointerEvents: rect?.getAttribute('pointer-events'),
                        },
                        expected
                    );
                });
            }
        );

        it('... should restore the interactivity of the overlay boxes when highlighted again', () => {
            service.updateTkkOverlayColors(
                expectedSvgRootGroup,
                expectedTkkOverlays,
                createColorState({ isHighlighted: false })
            );
            service.updateTkkOverlayColors(expectedSvgRootGroup, expectedTkkOverlays, createColorState());

            const rect = getTkkRect('tkk-1');
            expectToBe(rect?.getAttribute('tabindex'), '0');
            expect(rect?.hasAttribute('aria-hidden')).toBe(false);
            expect(rect?.hasAttribute('pointer-events')).toBe(false);
        });

        it('... should color all parts of a multi-part tkk overlay (same data id) together', () => {
            expectedSvgRootGroup.select('#tkk-1').attr('data-tkk-id', 'tkk-shared');
            expectedSvgRootGroup.select('#tkk-2').attr('data-tkk-id', 'tkk-shared');
            const overlays = expectedTkkOverlays.map(
                overlay => new EditionSvgOverlay(overlay.type, overlay.id, 'tkk-shared')
            );

            service.updateTkkOverlayColors(
                expectedSvgRootGroup,
                overlays,
                createColorState({ hoveredDataId: 'tkk-shared' })
            );

            expectToEqual([getRectFill('tkk-1'), getRectFill('tkk-2')], ['orange', 'orange']);
            expectSpyCall(serviceFillD3SelectionWithColorSpy, 1);
        });

        it('... should not fail for overlays without data id', () => {
            const overlays = [new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-x', '')];

            expect(() =>
                service.updateTkkOverlayColors(expectedSvgRootGroup, overlays, createColorState())
            ).not.toThrow();
        });

        it('... should not fail if no element with the data id is found', () => {
            vi.spyOn(mockEditionSvgDrawingService, 'getD3SelectionByDataId').mockReturnValue(undefined);

            expect(() =>
                service.updateTkkOverlayColors(expectedSvgRootGroup, expectedTkkOverlays, createColorState())
            ).not.toThrow();
        });
    });
});
