import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { SheetNavigationTarget } from '@awg-views/edition-view/models/edition-navigation.model';
import { SourceDescContent, SourceDescFolio } from '@awg-views/edition-view/models/source-desc.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { SourceDescContentFolioComponent } from '../folio/source-desc-content-folio.component';
import { SourceDescContentSystemComponent } from '../system/source-desc-content-system.component';
import { SourceDescContentGridComponent } from './source-desc-content-grid.component';

describe('SourceDescContentGridComponent', () => {
    let component: SourceDescContentGridComponent;
    let fixture: ComponentFixture<SourceDescContentGridComponent>;
    let compDe: DebugElement;

    let mockNavigationService: Partial<EditionNavigationService>;

    let selectSvgSheetSpy: Spy;
    let serviceNavigateToSvgSheetSpy: Spy;

    let expectedContents: SourceDescContent[];
    let expectedContent: SourceDescContent;
    let expectedContentWithTwoSystems: SourceDescContent;
    let expectedContentWithoutSystems: SourceDescContent;
    let expectedFolios: SourceDescFolio[];
    let expectedFoliosWithoutSystems: SourceDescFolio[];
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedFolioId: string;
    let expectedSystemSheetId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [
                CompileHtmlDirective,
                ConditionalLinkComponent,
                SourceDescContentFolioComponent,
                SourceDescContentSystemComponent,
                SourceDescContentGridComponent,
            ],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Service spies
        serviceNavigateToSvgSheetSpy = vi.spyOn(mockNavigationService, 'navigateToSvgSheet');

        // Test data
        expectedContents = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescListData?.sources[1]?.physDesc?.contents)
        );
        expectedContent = expectedContents[0]; // Folios with one system per system group
        expectedContentWithTwoSystems = expectedContents[1]; // Folios with two systems per system group, no itemLinkTo
        expectedContentWithoutSystems = expectedContents[3]; // One folio with description, no system groups
        expectedFolios = expectedContent.folios ?? [];
        expectedFoliosWithoutSystems = expectedContentWithoutSystems.folios ?? [];
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedFolioId = 'test_folio_id_1';
        expectedSystemSheetId = 'test_id_1';
        expectedSheetId = 'test_item_id_1';
        expectedNextSheetId = 'test_item_id_2';

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescContentGridComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        selectSvgSheetSpy = vi.spyOn(component, 'selectSvgSheet');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `content`', () => {
            expectToBe(isSignal(component.content), true);

            expect(() => component.content()).toThrow();
        });

        it('... should throw when accessing computed signal `parentComplexId` due to missing input', () => {
            expectToBe(isSignal(component.parentComplexId), true);

            expect(() => component.parentComplexId()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no grid container yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-content-grid-container', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('content', expectedContent);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `content` to hold the provided content', () => {
            expectToEqual(component.content(), expectedContent);
        });

        it('... should have computed signal `parentComplexId` to hold the complexId of itemLinkTo', () => {
            expectToBe(component.parentComplexId(), expectedComplexId);
        });

        describe('... should have recomputed signal `parentComplexId` to hold an empty string if', () => {
            it.each([
                {
                    desc: 'complexId is empty',
                    getContent: () => ({ ...expectedContent, itemLinkTo: { complexId: '', sheetId: '' } }),
                },
                {
                    desc: 'itemLinkTo is undefined',
                    getContent: () => ({ ...expectedContent, itemLinkTo: undefined }),
                },
                {
                    desc: 'content is undefined',
                    getContent: () => undefined,
                },
            ])('... $desc', ({ getContent }) => {
                fixture.componentRef.setInput('content', getContent());

                expectToBe(component.parentComplexId(), '');
            });
        });

        describe('VIEW', () => {
            it('... should render no content if content is not available', async () => {
                fixture.componentRef.setInput('content', undefined);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-content-grid-container', 0, 0);
            });

            describe('... should render no grid container if', () => {
                it.each([
                    {
                        desc: 'folios are empty',
                        folios: [],
                    },
                    {
                        desc: 'folios are undefined',
                        folios: undefined,
                    },
                ])(`... $desc`, async ({ folios }) => {
                    fixture.componentRef.setInput('content', { ...expectedContent, folios });
                    await detectChangesOnPush(fixture);

                    const containerDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid-container',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(containerDes[0], 'div.awg-source-desc-content-grid', 0, 0);
                });
            });

            it('... should contain one grid container (with half-para-margin)', () => {
                const containerDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-desc-content-grid-container',
                    1,
                    1
                );
                const containerEl: HTMLDivElement = containerDes[0].nativeElement;

                expectToContain(containerEl.classList, 'half-para-margin');
            });

            it('... should contain as many grid rows as given folios', () => {
                const expectedLength = expectedFolios.length;

                getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-desc-content-grid-container > div.awg-source-desc-content-grid',
                    expectedLength,
                    expectedLength
                );
            });

            it('... should contain one folio cell in each grid row', () => {
                const gridDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-desc-content-grid',
                    expectedFolios.length,
                    expectedFolios.length
                );

                gridDes.forEach(gridDe => {
                    getAndExpectDebugElementByCss(gridDe, 'div.awg-source-desc-content-grid-folio', 1, 1);
                });
            });

            it('... should not set class `span-full` on folio cells if system groups are given', () => {
                const folioDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-desc-content-grid-folio',
                    expectedFolios.length,
                    expectedFolios.length
                );

                folioDes.forEach(folioDe => {
                    expectToBe(folioDe.nativeElement.classList.contains('span-full'), false);
                });
            });

            describe('... should set class `span-full` on folio cells if', () => {
                it.each([
                    {
                        desc: 'system groups are empty',
                        systemGroups: [],
                    },
                    {
                        desc: 'system groups are undefined',
                        systemGroups: undefined,
                    },
                ])(`... $desc`, async ({ systemGroups }) => {
                    const contentWithoutSystems: SourceDescContent = {
                        ...expectedContentWithoutSystems,
                        folios: expectedFoliosWithoutSystems.map(folio => ({ ...folio, systemGroups })),
                    };
                    fixture.componentRef.setInput('content', contentWithoutSystems);
                    await detectChangesOnPush(fixture);

                    const folioDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid-folio',
                        1,
                        1
                    );
                    const folioEl: HTMLDivElement = folioDes[0].nativeElement;

                    expectToContain(folioEl.classList, 'span-full');
                });
            });

            describe('... folio label', () => {
                it('... should contain one SourceDescContentFolioComponent in each folio cell', () => {
                    const folioDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid-folio',
                        expectedFolios.length,
                        expectedFolios.length
                    );

                    folioDes.forEach(folioDe => {
                        getAndExpectDebugElementByDirective(folioDe, SourceDescContentFolioComponent, 1, 1);
                    });
                });

                it('... should pass down the correct folioLabel and isPage values', () => {
                    const labelDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescContentFolioComponent,
                        expectedFolios.length,
                        expectedFolios.length
                    );

                    labelDes.forEach((labelDe, index) => {
                        const labelCmp = labelDe.injector.get(SourceDescContentFolioComponent);
                        const expectedFolio = expectedFolios[index];

                        expectToBe(labelCmp.folioLabel(), expectedFolio.folio);
                        expectToBe(labelCmp.isPage(), !!expectedFolio.isPage);
                    });
                });

                it('... should wrap each folio label in a ConditionalLinkComponent', () => {
                    const folioDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid-folio',
                        expectedFolios.length,
                        expectedFolios.length
                    );

                    folioDes.forEach(folioDe => {
                        const linkDes = getAndExpectDebugElementByCss(folioDe, 'awg-conditional-link', 1, 1);
                        getAndExpectDebugElementByDirective(linkDes[0], SourceDescContentFolioComponent, 1, 1);
                    });
                });

                it('... should pass down isClickable depending on folioLinkTo', () => {
                    const folioDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid-folio',
                        expectedFolios.length,
                        expectedFolios.length
                    );

                    folioDes.forEach((folioDe, index) => {
                        const linkDes = getAndExpectDebugElementByCss(folioDe, 'awg-conditional-link', 1, 1);
                        const linkCmp = linkDes[0].injector.get(ConditionalLinkComponent);

                        expectToBe(linkCmp.isClickable(), !!expectedFolios[index].folioLinkTo);
                    });
                });

                it('... should not render a folio label if folio is not given', async () => {
                    expectedFolios[0].folio = '';
                    fixture.componentRef.setInput('content', { ...expectedContent });
                    await detectChangesOnPush(fixture);

                    const folioDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid-folio',
                        expectedFolios.length,
                        expectedFolios.length
                    );

                    getAndExpectDebugElementByDirective(folioDes[0], SourceDescContentFolioComponent, 0, 0);
                });
            });

            describe('... folio description', () => {
                it('... should not render a folio description if not given', () => {
                    getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-grid-folio-description', 0, 0);
                });

                it('... should render the folio description with CompileHtmlDirective if given', async () => {
                    fixture.componentRef.setInput('content', expectedContentWithoutSystems);
                    await detectChangesOnPush(fixture);

                    const descriptionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid-folio > span.awg-source-desc-content-grid-folio-description',
                        1,
                        1
                    );
                    getAndExpectDebugElementByDirective(descriptionDes[0], CompileHtmlDirective, 1, 1);

                    const descriptionEl: HTMLSpanElement = descriptionDes[0].nativeElement;

                    expectToBe(descriptionEl.textContent.trim(), expectedFoliosWithoutSystems[0].folioDescription);
                });
            });

            describe('... systems', () => {
                describe('... should contain no systems container if', () => {
                    it.each([
                        {
                            desc: 'system groups are empty',
                            systemGroups: [],
                        },
                        {
                            desc: 'system groups are undefined',
                            systemGroups: undefined,
                        },
                    ])(`... $desc`, async ({ systemGroups }) => {
                        const contentWithoutSystems: SourceDescContent = {
                            ...expectedContentWithoutSystems,
                            folios: expectedFoliosWithoutSystems.map(folio => ({ ...folio, systemGroups })),
                        };
                        fixture.componentRef.setInput('content', contentWithoutSystems);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-desc-content-grid-systems-container',
                            0,
                            0
                        );
                    });
                });

                it('... should contain one systems container for each folio with system groups', () => {
                    const gridDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid',
                        expectedFolios.length,
                        expectedFolios.length
                    );

                    gridDes.forEach(gridDe => {
                        getAndExpectDebugElementByCss(
                            gridDe,
                            'div.awg-source-desc-content-grid-systems-container',
                            1,
                            1
                        );
                    });
                });

                it('... should contain as many system group rows as given system groups per folio', () => {
                    const containerDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid-systems-container',
                        expectedFolios.length,
                        expectedFolios.length
                    );

                    containerDes.forEach((containerDe, index) => {
                        const expectedLength = expectedFolios[index].systemGroups?.length ?? 0;

                        getAndExpectDebugElementByCss(
                            containerDe,
                            'div.awg-source-desc-content-grid-system-group',
                            expectedLength,
                            expectedLength
                        );
                    });
                });

                it('... should contain one SourceDescContentSystemComponent per system in a system group', () => {
                    const groupDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid-system-group',
                        7,
                        7
                    );

                    groupDes.forEach(groupDe => {
                        getAndExpectDebugElementByDirective(groupDe, SourceDescContentSystemComponent, 1, 1);
                    });
                });

                it('... should contain two SourceDescContentSystemComponents per system group if two systems are given', async () => {
                    fixture.componentRef.setInput('content', expectedContentWithTwoSystems);
                    await detectChangesOnPush(fixture);

                    const groupDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-desc-content-grid-system-group',
                        6,
                        6
                    );

                    groupDes.forEach(groupDe => {
                        getAndExpectDebugElementByDirective(groupDe, SourceDescContentSystemComponent, 2, 2);
                    });
                });

                it('... should pass down the correct contentSystem to each SourceDescContentSystemComponent', () => {
                    const expectedSystems = expectedFolios.flatMap(folio => (folio.systemGroups ?? []).flat());

                    const systemDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescContentSystemComponent,
                        expectedSystems.length,
                        expectedSystems.length
                    );

                    systemDes.forEach((systemDe, index) => {
                        const systemCmp = systemDe.injector.get(SourceDescContentSystemComponent);

                        expectToEqual(systemCmp.contentSystem(), expectedSystems[index]);
                    });
                });

                it('... should pass down isLastItem = true only to the very last system', () => {
                    const systemDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescContentSystemComponent,
                        7,
                        7
                    );

                    systemDes.forEach((systemDe, index) => {
                        const systemCmp = systemDe.injector.get(SourceDescContentSystemComponent);

                        expectToBe(systemCmp.isLastItem(), index === systemDes.length - 1);
                    });
                });

                it('... should pass down isLastItem = true only to the very last system with two systems per group', async () => {
                    fixture.componentRef.setInput('content', expectedContentWithTwoSystems);
                    await detectChangesOnPush(fixture);

                    const systemDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescContentSystemComponent,
                        12,
                        12
                    );

                    systemDes.forEach((systemDe, index) => {
                        const systemCmp = systemDe.injector.get(SourceDescContentSystemComponent);

                        expectToBe(systemCmp.isLastItem(), index === systemDes.length - 1);
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#selectSvgSheet()', () => {
                it('... should have a method `selectSvgSheet`', () => {
                    expect(component.selectSvgSheet).toBeDefined();
                });

                describe('... should trigger on click', () => {
                    it.each([
                        {
                            desc: 'on folio link',
                            getContent: () => expectedContent,
                            getExpectedComplexId: () => expectedComplexId,
                        },
                        {
                            desc: 'on folio link with empty complexId if itemLinkTo is empty',
                            getContent: () => expectedContentWithTwoSystems,
                            getExpectedComplexId: () => '',
                        },
                        {
                            desc: 'on folio link with empty complexId if itemLinkTo is undefined',
                            getContent: () => ({ ...expectedContent, itemLinkTo: undefined }),
                            getExpectedComplexId: () => '',
                        },
                    ])(`... $desc`, async ({ getContent, getExpectedComplexId }) => {
                        const content = getContent();
                        const folioCount = content.folios?.length ?? 0;

                        fixture.componentRef.setInput('content', content);
                        await detectChangesOnPush(fixture);

                        const folioDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-desc-content-grid-folio',
                            folioCount,
                            folioCount
                        );
                        const anchorDes = getAndExpectDebugElementByCss(folioDes[0], 'a', 1, 1);

                        await clickAndAwaitChanges(anchorDes[0], fixture);

                        expectSpyCall(selectSvgSheetSpy, 1, {
                            complexId: getExpectedComplexId(),
                            sheetId: expectedFolioId,
                        });
                    });

                    it.each([
                        {
                            desc: 'on system link',
                            getContent: () => expectedContent,
                            getExpectedComplexId: () => expectedComplexId,
                        },
                        {
                            desc: 'on system link with empty complexId if itemLinkTo is undefined',
                            getContent: () => ({ ...expectedContent, itemLinkTo: undefined }),
                            getExpectedComplexId: () => '',
                        },
                    ])(`... $desc`, async ({ getContent, getExpectedComplexId }) => {
                        fixture.componentRef.setInput('content', getContent());
                        await detectChangesOnPush(fixture);

                        const systemDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescContentSystemComponent,
                            7,
                            7
                        );
                        const anchorDes = getAndExpectDebugElementByCss(systemDes[0], 'a', 1, 1);

                        await clickAndAwaitChanges(anchorDes[0], fixture);

                        expectSpyCall(selectSvgSheetSpy, 1, {
                            complexId: getExpectedComplexId(),
                            sheetId: expectedSystemSheetId,
                        });
                    });

                    describe('... on `clicked` output', () => {
                        const getFolioLinkCmp = (index: number): ConditionalLinkComponent => {
                            const folioDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-source-desc-content-grid-folio',
                                expectedFolios.length,
                                expectedFolios.length
                            );
                            const linkDes = getAndExpectDebugElementByDirective(
                                folioDes[index],
                                ConditionalLinkComponent,
                                1,
                                1
                            );
                            return linkDes[0].injector.get(ConditionalLinkComponent);
                        };

                        const getSystemCmp = (index: number): SourceDescContentSystemComponent => {
                            const systemDes = getAndExpectDebugElementByDirective(
                                compDe,
                                SourceDescContentSystemComponent,
                                7,
                                7
                            );
                            return systemDes[index].injector.get(SourceDescContentSystemComponent);
                        };

                        it.each([
                            {
                                desc: 'of SourceDescContentSystemComponent',
                                getContent: () => expectedContent,
                                getTargetCmp: () => getSystemCmp(1),
                                expectedClickSheetId: 'test_id_2',
                                expectedNavigationCalls: 1,
                            },
                            {
                                desc: 'of SourceDescContentSystemComponent with empty sheetId if linkTo is undefined',
                                getContent: (): SourceDescContent => ({
                                    ...expectedContent,
                                    folios: expectedFolios.map((folio, folioIndex) => ({
                                        ...folio,
                                        systemGroups: folio.systemGroups?.map((systemGroup, groupIndex) =>
                                            systemGroup.map((system, systemIndex) =>
                                                folioIndex === 0 && groupIndex === 0 && systemIndex === 0
                                                    ? { ...system, linkTo: undefined }
                                                    : system
                                            )
                                        ),
                                    })),
                                }),
                                getTargetCmp: () => getSystemCmp(0),
                                expectedClickSheetId: '',
                                expectedNavigationCalls: 0,
                            },
                            {
                                desc: 'of folio ConditionalLinkComponent with empty sheetId if folioLinkTo is undefined',
                                getContent: (): SourceDescContent => ({
                                    ...expectedContent,
                                    folios: expectedFolios.map(folio => ({ ...folio, folioLinkTo: undefined })),
                                }),
                                getTargetCmp: () => getFolioLinkCmp(0),
                                expectedClickSheetId: '',
                                expectedNavigationCalls: 0,
                            },
                        ])(
                            `... $desc`,
                            async ({ getContent, getTargetCmp, expectedClickSheetId, expectedNavigationCalls }) => {
                                fixture.componentRef.setInput('content', getContent());
                                await detectChangesOnPush(fixture);

                                getTargetCmp().clicked.emit();

                                expectSpyCall(selectSvgSheetSpy, 1, {
                                    complexId: expectedComplexId,
                                    sheetId: expectedClickSheetId,
                                });
                                expectSpyCall(serviceNavigateToSvgSheetSpy, expectedNavigationCalls);
                            }
                        );
                    });
                });

                it('... should do nothing if no sheetId is provided', () => {
                    const expectedSheetIds: SheetNavigationTarget = { complexId: 'op25', sheetId: '' };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 0);
                });

                it('... should trigger NavigationService with selected svg sheet within same complex', () => {
                    const expectedSheetIds: SheetNavigationTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetId,
                    };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, [expectedSheetIds]);

                    const expectedNextSheetIds: SheetNavigationTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedNextSheetId,
                    };
                    component.selectSvgSheet(expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, [expectedNextSheetIds]);
                });

                it('... should trigger NavigationService with selected svg sheet for another complex', () => {
                    const expectedSheetIds: SheetNavigationTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetId,
                    };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, [expectedSheetIds]);

                    const expectedNextSheetIds: SheetNavigationTarget = {
                        complexId: expectedNextComplexId,
                        sheetId: expectedNextSheetId,
                    };
                    component.selectSvgSheet(expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, [expectedNextSheetIds]);
                });
            });
        });
    });
});
