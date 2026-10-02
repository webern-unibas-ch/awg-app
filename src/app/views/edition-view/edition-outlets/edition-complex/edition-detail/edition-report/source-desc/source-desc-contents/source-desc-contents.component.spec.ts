import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { ButtonExpandAllComponent } from '@awg-shared/button-expand-all/button-expand-all.component';

import { SourceDescContent } from '@awg-views/edition-view/models/source-desc.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { SourceDescContentGridComponent } from './grid/source-desc-content-grid.component';
import { SourceDescContentItemComponent } from './item/source-desc-content-item.component';
import { SourceDescContentsComponent } from './source-desc-contents.component';

describe('SourceDescContentsComponent', () => {
    let component: SourceDescContentsComponent;
    let fixture: ComponentFixture<SourceDescContentsComponent>;
    let compDe: DebugElement;

    let mockNavigationService: Partial<EditionNavigationService>;

    let expectedContents: SourceDescContent[];
    let expectedOpenAllContentDetails: boolean;

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [
                ButtonExpandAllComponent,
                SourceDescContentsComponent,
                SourceDescContentGridComponent,
                SourceDescContentItemComponent,
            ],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedContents = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescListData?.sources[1]?.physDesc?.contents)
        );
        expectedOpenAllContentDetails = true;

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescContentsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `contents`', () => {
            expectToBe(isSignal(component.contents), true);

            expect(() => component.contents()).toThrow();
        });

        it('... should throw when accessing computed signal `contentsState.allOpen` due to missing input', () => {
            expectToBe(isSignal(component.contentsState.allOpen), true);

            expect(() => component.contentsState.allOpen()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-source-desc-contents', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-contents', 1, 1);
            });

            it('... should contain one paragraph (no-para-margin) in div displaying the contents label in smallcaps', () => {
                const expectedLabel = 'Inhalt:';

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-contents-label', 1, 1);
                const pEl = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'no-para-margin');

                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), expectedLabel);
            });

            it('... should contain one ButtonExpandAllComponent in the label paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-contents-label', 1, 1);

                getAndExpectDebugElementByDirective(pDes[0], ButtonExpandAllComponent, 1, 1);
            });

            it('... should contain no contents details or SourceDescContentGridComponent (yet)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-contents', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'details.awg-source-desc-contents-details', 0, 0);
                getAndExpectDebugElementByDirective(divDes[0], SourceDescContentGridComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('contents', expectedContents);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `contents` to hold the expected contents', () => {
            expectToEqual(component.contents(), expectedContents);
        });

        it('... should have computed signal `contentsState.allOpen` to hold the default value', () => {
            expectToEqual(component.contentsState.allOpen(), expectedOpenAllContentDetails);
        });

        describe('VIEW', () => {
            it('... should pass down the correct isOpen state to the ButtonExpandAllComponent', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-contents-label', 1, 1);
                const buttonDes = getAndExpectDebugElementByDirective(pDes[0], ButtonExpandAllComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(ButtonExpandAllComponent) as ButtonExpandAllComponent;

                expectToEqual(buttonCmp.isOpen(), expectedOpenAllContentDetails);
            });

            it('... should update `contentsState` when the ButtonExpandAllComponent model changes', async () => {
                const buttonDes = getAndExpectDebugElementByDirective(compDe, ButtonExpandAllComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(ButtonExpandAllComponent) as ButtonExpandAllComponent;

                buttonCmp.isOpen.set(true);

                await detectChangesOnPush(fixture);

                expectToEqual(component.contentsState.allOpen(), true);

                buttonCmp.isOpen.set(false);

                await detectChangesOnPush(fixture);

                expectToEqual(component.contentsState.allOpen(), false);
            });

            describe('... the content details', () => {
                let expectedContentsWithItems: SourceDescContent[];
                let expectedContentsWithItemsLength: number;

                beforeEach(() => {
                    expectedContentsWithItems = component
                        .contents()
                        .filter(content => content.item || content.itemDescription);
                    expectedContentsWithItemsLength = expectedContentsWithItems.length;
                });

                it('... should contain only as many content details (with half-para-margin) in div as given content items', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-contents', 1, 1);

                    const detailDes = getAndExpectDebugElementByCss(
                        divDes[0],
                        'details.awg-source-desc-content-details',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    detailDes.forEach(detailDe => {
                        const detailEl = detailDe.nativeElement;

                        expectToContain(detailEl.classList, 'half-para-margin');
                    });
                });

                it('... should have an id for each content detail', () => {
                    const detailsDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-desc-content-details',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    detailsDes.forEach((detailsDe, index) => {
                        const detailsEl: HTMLDetailsElement = detailsDe.nativeElement;

                        expect(detailsEl).toBeTruthy();
                        expectToBe(detailsEl.id, index.toString());
                    });
                });

                describe('... expand and collapse', () => {
                    const toggleDetails = async (detailsDe: DebugElement, open: boolean): Promise<void> => {
                        const detailsEl: HTMLDetailsElement = detailsDe.nativeElement;
                        detailsEl.open = open;
                        detailsEl.dispatchEvent(new Event('toggle'));
                        await detectChangesOnPush(fixture);
                    };

                    const getButtonCmp = (): ButtonExpandAllComponent => {
                        const buttonDes = getAndExpectDebugElementByDirective(compDe, ButtonExpandAllComponent, 1, 1);
                        return buttonDes[0].injector.get(ButtonExpandAllComponent) as ButtonExpandAllComponent;
                    };

                    const getDetailsDes = (): DebugElement[] =>
                        getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-desc-content-details',
                            expectedContentsWithItemsLength,
                            expectedContentsWithItemsLength
                        );

                    it('... should have all content details open by default', () => {
                        getDetailsDes().forEach(detailsDe => {
                            expectToBe(detailsDe.nativeElement.hasAttribute('open'), true);
                        });
                    });

                    it('... should open or close all details via the ButtonExpandAllComponent', async () => {
                        // Close all details
                        getButtonCmp().isOpen.set(false);
                        await detectChangesOnPush(fixture);

                        getDetailsDes().forEach(detailsDe => {
                            expectToBe(detailsDe.nativeElement.hasAttribute('open'), false);
                        });

                        // Open all details
                        getButtonCmp().isOpen.set(true);
                        await detectChangesOnPush(fixture);

                        getDetailsDes().forEach(detailsDe => {
                            expectToBe(detailsDe.nativeElement.hasAttribute('open'), true);
                        });
                    });

                    it('... should switch the button to closed when one details element is closed individually', async () => {
                        await toggleDetails(getDetailsDes()[0], false);

                        expectToBe(component.contentsState.isOpen(0), false);
                        expectToBe(component.contentsState.allOpen(), false);
                        expectToBe(getButtonCmp().isOpen(), false);
                    });

                    it('... should switch the button back to open when the closed details element is opened again', async () => {
                        await toggleDetails(getDetailsDes()[0], false);
                        await toggleDetails(getDetailsDes()[0], true);

                        expectToBe(component.contentsState.allOpen(), true);
                        expectToBe(getButtonCmp().isOpen(), true);
                    });

                    it('... should switch the button to open when all details are opened individually after closing all', async () => {
                        component.contentsState.setAll(false);
                        await detectChangesOnPush(fixture);

                        for (const detailsDe of getDetailsDes()) {
                            await toggleDetails(detailsDe, true);
                        }

                        expectToBe(component.contentsState.allOpen(), true);
                        expectToBe(getButtonCmp().isOpen(), true);
                    });
                });

                it('... should contain as many summary elements (with no-para-margin) in details as given content items', () => {
                    const summaryDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-desc-content-details > summary.awg-source-desc-content-item-summary',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    summaryDes.forEach(summaryDe => {
                        const summaryEl = summaryDe.nativeElement;

                        expectToContain(summaryEl.classList, 'no-para-margin');
                    });
                });

                it('... should contain one SourceDescContentItemComponent in each summary', () => {
                    const summaryDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-desc-content-details > summary.awg-source-desc-content-item-summary',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    summaryDes.forEach(summaryDe => {
                        getAndExpectDebugElementByDirective(summaryDe, SourceDescContentItemComponent, 1, 1);
                    });
                });

                it('... should pass down the content to each SourceDescContentItemComponent', () => {
                    const itemDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescContentItemComponent,
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    itemDes.forEach((itemDe, index) => {
                        const itemCmp = itemDe.injector.get(SourceDescContentItemComponent);

                        expectToEqual(itemCmp.content(), expectedContentsWithItems[index]);
                    });
                });
            });

            describe('... the content grids', () => {
                let expectedContentsWithFolios: SourceDescContent[];
                let expectedContentsWithFoliosLength: number;

                beforeEach(() => {
                    expectedContentsWithFolios = component
                        .contents()
                        .filter(content => (content.folios?.length ?? 0) > 0);
                    expectedContentsWithFoliosLength = expectedContentsWithFolios.length;
                });

                it('... should render no SourceDescContentGridComponent if `folios` is not provided', async () => {
                    const contentsWithoutFolios = expectedContents.map(content => {
                        const contentWithoutFolios = { ...content };
                        delete contentWithoutFolios.folios;
                        return contentWithoutFolios;
                    });

                    fixture.componentRef.setInput('contents', contentsWithoutFolios);
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByDirective(compDe, SourceDescContentGridComponent, 0, 0);
                });

                it('... should contain as many SourceDescContentGridComponents in description-contents div as given content items with folios', () => {
                    getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescContentGridComponent,
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );
                });

                it('... should pass the content with folios to SourceDescContentGridComponent', () => {
                    const gridDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescContentGridComponent,
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    gridDes.forEach((gridDe, index) => {
                        const gridCmp: SourceDescContentGridComponent = gridDe.componentInstance;

                        expectToEqual(gridCmp.content(), expectedContentsWithFolios[index]);
                    });
                });
            });
        });
    });
});
