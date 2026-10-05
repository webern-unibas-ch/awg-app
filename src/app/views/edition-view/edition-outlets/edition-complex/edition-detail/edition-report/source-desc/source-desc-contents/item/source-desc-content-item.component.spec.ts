import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { EditionNavigationSheetTarget } from '@awg-views/edition-view/models/edition-navigation.model';
import { SourceDescContent } from '@awg-views/edition-view/models/source-desc.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { SourceDescContentItemComponent } from './source-desc-content-item.component';

describe('SourceDescContentItemComponent', () => {
    let component: SourceDescContentItemComponent;
    let fixture: ComponentFixture<SourceDescContentItemComponent>;
    let compDe: DebugElement;

    let mockNavigationService: Partial<EditionNavigationService>;

    let selectSvgSheetSpy: Spy;
    let serviceNavigateToSvgSheetSpy: Spy;

    let expectedContents: SourceDescContent[];
    let expectedContent: SourceDescContent;
    let expectedContentWithoutLink: SourceDescContent;
    let expectedContentWithoutDescription: SourceDescContent;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective, ConditionalLinkComponent, SourceDescContentItemComponent],
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
        expectedContent = expectedContents[0]; // Item with link and description
        expectedContentWithoutLink = expectedContents[1]; // Item with description, but without link
        expectedContentWithoutDescription = expectedContents[2]; // Item with link, but without description
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedSheetId = 'test_item_id_1';
        expectedNextSheetId = 'test_item_id_2';

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescContentItemComponent);
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

        describe('#sheetTarget', () => {
            it('... should be a computed signal', () => {
                expectToBe(isSignal(component.sheetTarget), true);
            });

            it('... should hold the complexId and sheetId of itemLinkTo', () => {
                expectToEqual(component.sheetTarget(), { complexId: expectedComplexId, sheetId: expectedSheetId });
            });

            it('... should hold empty ids if itemLinkTo is undefined', async () => {
                fixture.componentRef.setInput('content', { ...expectedContent, itemLinkTo: undefined });
                await detectChangesOnPush(fixture);

                expectToEqual(component.sheetTarget(), { complexId: '', sheetId: '' });
            });
        });

        describe('#isClickable', () => {
            it('... should be a computed signal', () => {
                expectToBe(isSignal(component.isClickable), true);
            });

            it('... should be true if complexId and sheetId are given', () => {
                expectToBe(component.isClickable(), true);
            });

            describe('... should be false if', () => {
                it.each([
                    {
                        desc: 'complexId is missing',
                        missingComplexId: true,
                        missingSheetId: false,
                        missingItemLinkTo: false,
                    },
                    {
                        desc: 'sheetId is missing',
                        missingComplexId: false,
                        missingSheetId: true,
                        missingItemLinkTo: false,
                    },
                    {
                        desc: 'both IDs are missing',
                        missingComplexId: true,
                        missingSheetId: true,
                        missingItemLinkTo: false,
                    },
                    {
                        desc: 'itemLinkTo is missing',
                        missingComplexId: false,
                        missingSheetId: false,
                        missingItemLinkTo: true,
                    },
                ])('... $desc', async ({ missingComplexId, missingSheetId, missingItemLinkTo }) => {
                    const { itemLinkTo, ...content } = expectedContent;
                    const contentWithoutIds: SourceDescContent = {
                        ...content,
                        ...(missingItemLinkTo
                            ? {}
                            : {
                                  itemLinkTo: {
                                      ...(missingComplexId ? {} : { complexId: itemLinkTo?.complexId }),
                                      ...(missingSheetId ? {} : { sheetId: itemLinkTo?.sheetId }),
                                  },
                              }),
                    };

                    fixture.componentRef.setInput('content', contentWithoutIds);
                    await detectChangesOnPush(fixture);

                    expectToBe(component.isClickable(), false);
                });
            });
        });

        describe('VIEW', () => {
            it('... should contain one span.awg-source-desc-content-item', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-item', 1, 1);
            });

            it('... should end with a colon', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-item', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim().endsWith(':'), true);
            });

            describe('... with content.item', () => {
                it('... should contain one ConditionalLinkComponent', () => {
                    getAndExpectDebugElementByDirective(compDe, ConditionalLinkComponent, 1, 1);
                });

                it('... should pass down isClickable to ConditionalLinkComponent', () => {
                    const linkDes = getAndExpectDebugElementByDirective(compDe, ConditionalLinkComponent, 1, 1);
                    const linkCmp = linkDes[0].injector.get(ConditionalLinkComponent);

                    expectToBe(linkCmp.isClickable(), component.isClickable());
                });

                it('... should not render an anchor if not clickable', async () => {
                    fixture.componentRef.setInput('content', { ...expectedContent, itemLinkTo: undefined });
                    await detectChangesOnPush(fixture);

                    const linkDes = getAndExpectDebugElementByDirective(compDe, ConditionalLinkComponent, 1, 1);
                    const linkCmp = linkDes[0].injector.get(ConditionalLinkComponent);

                    expectToBe(linkCmp.isClickable(), false);
                    getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
                });

                it.each([
                    {
                        desc: 'with anchor link and description if given',
                        getContent: () => expectedContent,
                        expectedAnchors: 1,
                        expectedLabel: 'Test item',
                        expectedDescription: '(test description)',
                    },
                    {
                        desc: 'without anchor link if not given',
                        getContent: () => expectedContentWithoutLink,
                        expectedAnchors: 0,
                        expectedLabel: 'Test item 2 without link',
                        expectedDescription: '(test description 2)',
                    },
                    {
                        desc: 'without description if not given',
                        getContent: () => expectedContentWithoutDescription,
                        expectedAnchors: 1,
                        expectedLabel: 'Test item 3 without description',
                        expectedDescription: undefined,
                    },
                ])(
                    `... should display the content-item label (strong) $desc`,
                    async ({ getContent, expectedAnchors, expectedLabel, expectedDescription }) => {
                        fixture.componentRef.setInput('content', getContent());
                        await detectChangesOnPush(fixture);

                        const contentItemDes = getAndExpectDebugElementByCss(
                            compDe,
                            'span.awg-source-desc-content-item',
                            1,
                            1
                        );
                        getAndExpectDebugElementByCss(contentItemDes[0], 'a', expectedAnchors, expectedAnchors);

                        const strongDes = getAndExpectDebugElementByCss(contentItemDes[0], 'strong', 1, 1);
                        const strongEl: HTMLElement = strongDes[0].nativeElement;

                        expectToBe(strongEl.textContent.trim(), expectedLabel);

                        const expectedDescriptionCount = expectedDescription ? 1 : 0;
                        const descriptionDes = getAndExpectDebugElementByCss(
                            contentItemDes[0],
                            'span.awg-source-desc-content-item-description',
                            expectedDescriptionCount,
                            expectedDescriptionCount
                        );

                        if (expectedDescription) {
                            expectToBe(descriptionDes[0].nativeElement.textContent.trim(), expectedDescription);
                        }
                    }
                );
            });

            describe('... with content.itemDescription', () => {
                it('... should render a description without an item', async () => {
                    const contentWithoutItem = { ...expectedContent };
                    delete contentWithoutItem.item;
                    delete contentWithoutItem.itemLinkTo;

                    fixture.componentRef.setInput('content', contentWithoutItem);
                    await detectChangesOnPush(fixture);

                    const descriptionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-desc-content-item-description',
                        1,
                        1
                    );

                    expectToBe(
                        descriptionDes[0].nativeElement.textContent.trim(),
                        contentWithoutItem.itemDescription?.trim()
                    );
                    getAndExpectDebugElementByDirective(compDe, ConditionalLinkComponent, 0, 0);
                });

                describe('... should render a non-breaking space between item and description only if', () => {
                    it.each([
                        {
                            desc: 'both item and description are given',
                            getContent: () => expectedContent,
                            expectedSpaces: 1,
                        },
                        {
                            desc: 'not if description is missing',
                            getContent: () => expectedContentWithoutDescription,
                            expectedSpaces: 0,
                        },
                        {
                            desc: 'not if item is missing',
                            getContent: () => ({ ...expectedContent, item: '' }),
                            expectedSpaces: 0,
                        },
                    ])(`... $desc`, async ({ getContent, expectedSpaces }) => {
                        fixture.componentRef.setInput('content', getContent());
                        await detectChangesOnPush(fixture);

                        const spanDes = compDe.queryAll(By.css('span.awg-source-desc-content-item > span'));
                        const spaceDes = spanDes.filter(spanDe => spanDe.nativeElement.textContent === ' ');

                        expectToBe(spaceDes.length, expectedSpaces);
                    });
                });

                it('... should contain one CompileHtmlDirective for the description', () => {
                    const descriptionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-desc-content-item-description',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(descriptionDes[0], CompileHtmlDirective, 1, 1);
                });

                it('... should pass down the description to the CompileHtmlDirective', () => {
                    const descriptionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-desc-content-item-description',
                        1,
                        1
                    );
                    const compileHtmlDes = getAndExpectDebugElementByDirective(
                        descriptionDes[0],
                        CompileHtmlDirective,
                        1,
                        1
                    );
                    const compileHtmlIns = compileHtmlDes[0].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                    expectToBe(compileHtmlIns.htmlContent(), expectedContent.itemDescription);
                });
            });
        });

        describe('METHODS', () => {
            describe('#selectSvgSheet()', () => {
                it('... should have a method `selectSvgSheet`', () => {
                    expect(component.selectSvgSheet).toBeDefined();
                });

                it('... should trigger on click on content item', async () => {
                    const anchorDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-desc-content-item a',
                        1,
                        1
                    );

                    await clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSheetId });
                });

                it('... should do nothing if no sheetId is provided', () => {
                    const expectedSheetIds: EditionNavigationSheetTarget = { complexId: 'op25', sheetId: '' };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);
                });

                it('... should trigger NavigationService with selected svg sheet within same complex', () => {
                    const expectedSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetId,
                    };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedNextSheetId,
                    };
                    component.selectSvgSheet(expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
                });

                it('... should trigger NavigationService with selected svg sheet for another complex', () => {
                    const expectedSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetId,
                    };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedNextComplexId,
                        sheetId: expectedNextSheetId,
                    };
                    component.selectSvgSheet(expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
                });
            });
        });
    });
});
