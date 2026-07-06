import {
    Component,
    DebugElement,
    EventEmitter,
    inject,
    input,
    Input,
    isSignal,
    NgModule,
    Output,
    signal,
    WritableSignal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import {
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
    EditionSvgSheetList,
    TextcriticalCommentary,
    Textcritics,
} from '@awg-views/edition-view/models';

import { EditionAccoladeComponent } from './edition-accolade.component';

// Mock components
@Component({
    selector: 'awg-edition-svg-sheet-facet',
    template: '',
    standalone: false,
})
class EditionSvgSheetFacetStubComponent {
    @Input()
    isMinimized = false;
    @Input()
    svgSheetsData: EditionSvgSheetList;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Output()
    selectSvgSheetRequest: EventEmitter<{
        complexId: string;
        sheetId: string;
    }> = new EventEmitter();
    @Output()
    toggleSheetFacetRequest: EventEmitter<boolean> = new EventEmitter();
}

@Component({
    selector: 'awg-edition-svg-sheet-viewer',
    template: '',
    standalone: false,
})
class EditionSvgSheetViewerStubComponent {
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Output()
    browseSvgSheetRequest: EventEmitter<number> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectLinkBoxRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectOverlaysRequest: EventEmitter<EditionSvgOverlay[]> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{
        complexId: string;
        sheetId: string;
    }> = new EventEmitter();
}

@Component({
    selector: 'awg-edition-svg-sheet-footer',
    template: '',
    standalone: false,
})
class EditionSvgSheetFooterStubComponent {
    @Input()
    selectedTextcriticalCommentary: TextcriticalCommentary;
    @Input()
    selectedTextcritics: Textcritics;
    @Input()
    showTkA: boolean;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{
        complexId: string;
        fragmentId: string;
    }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{
        complexId: string;
        sheetId: string;
    }> = new EventEmitter();
}

@Component({
    selector: 'awg-fullscreen-toggle',
    template: '',
})
class FullscreenToggleStubComponent {
    readonly fsElement = input.required<HTMLElement>();
}

describe('EditionAccoladeComponent (DONE)', () => {
    let component: EditionAccoladeComponent;
    let fixture: ComponentFixture<EditionAccoladeComponent>;
    let compDe: DebugElement;

    let isFullscreenMockSignal: WritableSignal<boolean>;
    let mockFullscreenService: Partial<FullscreenService>;

    let browseSvgSheetSpy: Spy;
    let browseSvgSheetRequestEmitSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectLinkBoxSpy: Spy;
    let selectLinkBoxRequestEmitSpy: Spy;
    let selectOverlaysSpy: Spy;
    let selectOverlaysRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let toggleSheetFacetSpy: Spy;
    let toggleSheetFacetRequestEmitSpy: Spy;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedReportFragment: string;
    let expectedSvgSheetsData: EditionSvgSheetList;
    let expectedOverlays: EditionSvgOverlay[];
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSelectedTextcriticalCommentary: TextcriticalCommentary;
    let expectedSelectedTextcritics: Textcritics;
    let expectedShowTkA: boolean;
    let expectedModalSnippet: string;
    let expectedLinkBoxId: string;
    let expectedIsSheetFacetMinimized: boolean;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor() {
            const config = inject(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        // Unset fullscreen by default
        isFullscreenMockSignal = signal(false);

        // Mock FullscreenService
        mockFullscreenService = {
            isFullscreen: isFullscreenMockSignal.asReadonly(),
        };

        await TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule, FullscreenToggleStubComponent],
            declarations: [
                EditionAccoladeComponent,
                EditionSvgSheetViewerStubComponent,
                EditionSvgSheetFacetStubComponent,
                EditionSvgSheetFooterStubComponent,
            ],
            providers: [{ provide: FullscreenService, useValue: mockFullscreenService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionAccoladeComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedReportFragment = 'source_A';
        expectedModalSnippet = structuredClone(mockEditionData.mockModalSnippet);
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedNextSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk2);
        expectedSvgSheetsData = {
            sheets: { workEditions: [], textEditions: [], sketchEditions: [expectedSvgSheet, expectedNextSvgSheet] },
        };
        expectedSelectedTextcritics = structuredClone(mockEditionData.mockTextcriticsData.textcritics[1]);
        expectedSelectedTextcriticalCommentary = expectedSelectedTextcritics.commentary;

        const overlayType = EditionSvgOverlayTypes.tkk;
        const id = 'tkk-1';
        const overlay = new EditionSvgOverlay(overlayType, id, id, true);
        expectedOverlays = [overlay];
        expectedLinkBoxId = 'link-box-1';
        expectedShowTkA = true;
        expectedIsSheetFacetMinimized = false;

        // Spies
        browseSvgSheetSpy = vi.spyOn(component, 'browseSvgSheet');
        browseSvgSheetRequestEmitSpy = vi.spyOn(component.browseSvgSheetRequest, 'emit');
        navigateToReportFragmentSpy = vi.spyOn(component, 'navigateToReportFragment');
        navigateToReportFragmentRequestEmitSpy = vi.spyOn(component.navigateToReportFragmentRequest, 'emit');
        openModalSpy = vi.spyOn(component, 'openModal');
        openModalRequestEmitSpy = vi.spyOn(component.openModalRequest, 'emit');
        selectLinkBoxSpy = vi.spyOn(component, 'selectLinkBox');
        selectLinkBoxRequestEmitSpy = vi.spyOn(component.selectLinkBoxRequest, 'emit');
        selectOverlaysSpy = vi.spyOn(component, 'selectOverlays');
        selectOverlaysRequestEmitSpy = vi.spyOn(component.selectOverlaysRequest, 'emit');
        selectSvgSheetSpy = vi.spyOn(component, 'selectSvgSheet');
        selectSvgSheetRequestEmitSpy = vi.spyOn(component.selectSvgSheetRequest, 'emit');
        toggleSheetFacetSpy = vi.spyOn(component, 'toggleSheetFacet');
        toggleSheetFacetRequestEmitSpy = vi.spyOn(component.toggleSheetFacetRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `isSheetFacetMinimized`', () => {
            expect(component.isSheetFacetMinimized).toBeUndefined();
        });

        it('... should not have `svgSheetsData`', () => {
            expect(component.svgSheetsData).toBeUndefined();
        });

        it('... should not have `selectedSvgSheet`', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        it('... should not have `selectedTextcriticalCommentary`', () => {
            expect(component.selectedTextcriticalCommentary).toBeUndefined();
        });

        it('... should not have `selectedTextcritics`', () => {
            expect(component.selectedTextcritics).toBeUndefined();
        });

        it('... should not have `showTkA`', () => {
            expect(component.showTkA).toBeUndefined();
        });

        it('... should have signal `isFullscreen` to hold false', () => {
            expectToBe(isSignal(component.isFullscreen), true);

            expectToBe(component.isFullscreen(), false);
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain one div.accordion-item with header and non-collapsible body yet in div.accordion', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);
                getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-header', 1, 1);

                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1);
                const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'accordion-collapse');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.isSheetFacetMinimized = expectedIsSheetFacetMinimized;
            component.svgSheetsData = structuredClone(expectedSvgSheetsData);
            component.selectedSvgSheet = structuredClone(expectedSvgSheet);
            component.selectedTextcriticalCommentary = structuredClone(expectedSelectedTextcriticalCommentary);
            component.selectedTextcritics = structuredClone(expectedSelectedTextcritics);
            component.showTkA = expectedShowTkA;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `isSheetFacetMinimized` input', () => {
            expectToEqual(component.isSheetFacetMinimized, expectedIsSheetFacetMinimized);
        });

        it('... should have `svgSheetsData` input', () => {
            expectToEqual(component.svgSheetsData, expectedSvgSheetsData);
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
        });

        it('... should have `selectedTextcriticalCommentary` input', () => {
            expectToEqual(component.selectedTextcriticalCommentary, expectedSelectedTextcriticalCommentary);
        });

        it('... should have `selectedTextcritics` input', () => {
            expectToEqual(component.selectedTextcritics, expectedSelectedTextcritics);
        });

        it('... should have `showTkA` input', () => {
            expectToBe(component.showTkA, expectedShowTkA);
        });

        describe('VIEW', () => {
            it('... should have class `fullscreen` on div.accordion only in fullscreen mode', async () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
                const accordionEl: HTMLDivElement = accordionDes[0].nativeElement;

                expectToNotContain(accordionEl.classList, 'fullscreen');

                // Set fullscreen
                isFullscreenMockSignal.set(true);
                await detectChangesOnPush(fixture);

                expectToContain(accordionEl.classList, 'fullscreen');
            });

            describe('... accordion header', () => {
                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-accolade-view.accordion-item',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(itemDes[0], 'div#awg-accolade-view > div.accordion-header', 1, 1);

                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-accolade-view-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should contain header section with div.accordion-header and header button', () => {
                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);

                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-accolade-view > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(
                        itemHeaderDes[0],
                        'div.accordion-button > button.btn',
                        1,
                        1
                    );
                    const btnEl0: HTMLButtonElement = btnDes[0].nativeElement;

                    const expectedTitle0 = 'Edierte Notentexte';

                    expectToBe(btnEl0.textContent.trim(), expectedTitle0);
                });

                it('... should contain another div with help and FullscreenToggleComponent (stubbed) in header section', () => {
                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);

                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-accolade-view > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'div.ms-auto > button.btn', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;
                    const expectedTitle = 'Hinweise zur Nutzung';

                    expectToBe(btnEl.textContent.trim(), expectedTitle);

                    getAndExpectDebugElementByDirective(itemHeaderDes[0], FullscreenToggleStubComponent, 1, 1);
                });

                it('... should contain only FullscreenToggleComponent (stubbed) in other div of header section when in fullscreen mode', async () => {
                    // Set fullscreen
                    isFullscreenMockSignal.set(true);
                    await detectChangesOnPush(fixture);

                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);

                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-accolade-view > div.accordion-header',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(itemHeaderDes[0], 'div.ms-auto > button.btn', 0, 0);

                    getAndExpectDebugElementByDirective(itemHeaderDes[0], FullscreenToggleStubComponent, 1, 1);
                });

                it('... should pass down accordion reference to the FullscreenToggleComponent', () => {
                    const fsToggleDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FullscreenToggleStubComponent,
                        1,
                        1
                    );
                    const fsToggleCmp = fsToggleDes[0].injector.get(
                        FullscreenToggleStubComponent
                    ) as FullscreenToggleStubComponent;

                    const accDes = getAndExpectDebugElementByCss(compDe, '[ngbAccordion]', 1, 1);
                    const accRef = accDes[0].references['accoladeAcc'];

                    expectToEqual(fsToggleCmp.fsElement(), accRef);
                });
            });

            describe('... accordion body', () => {
                it('... should contain one div.accordion-body in div.accordion-item', () => {
                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                    getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);
                });

                it('... should apply col-auto to sheet facet container div when minimized', async () => {
                    component.isSheetFacetMinimized = true;
                    await detectChangesOnPush(fixture);

                    const facetDivDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-svg-sheet-facet-container',
                        1,
                        1
                    );
                    const facetDivEl: HTMLDivElement = facetDivDes[0].nativeElement;

                    expectToContain(facetDivEl.classList, 'col-auto');
                    expectToNotContain(facetDivEl.classList, 'col-12');
                    expectToNotContain(facetDivEl.classList, 'col-lg-4');
                    expectToNotContain(facetDivEl.classList, 'col-xl-3');
                });

                it('... should apply col-12 col-lg-4 col-xl-3 to sheet facet container div when not minimized', async () => {
                    component.isSheetFacetMinimized = false;
                    await detectChangesOnPush(fixture);

                    const facetDivDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-svg-sheet-facet-container',
                        1,
                        1
                    );
                    const facetDivEl: HTMLDivElement = facetDivDes[0].nativeElement;

                    expectToContain(facetDivEl.classList, 'col-12');
                    expectToContain(facetDivEl.classList, 'col-lg-4');
                    expectToContain(facetDivEl.classList, 'col-xl-3');
                    expectToNotContain(facetDivEl.classList, 'col-auto');
                });

                it('... should apply col to sheet viewer container div when minimized', async () => {
                    component.isSheetFacetMinimized = true;
                    await detectChangesOnPush(fixture);

                    const viewerDivDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-svg-sheet-viewer-container',
                        1,
                        1
                    );
                    const viewerDivEl: HTMLDivElement = viewerDivDes[0].nativeElement;

                    expectToContain(viewerDivEl.classList, 'col');
                    expectToNotContain(viewerDivEl.classList, 'col-12');
                    expectToNotContain(viewerDivEl.classList, 'col-lg-8');
                    expectToNotContain(viewerDivEl.classList, 'col-xl-9');
                });

                it('... should apply col-12 col-lg-8 col-xl-9 to sheet viewer container div when not minimized', async () => {
                    component.isSheetFacetMinimized = false;
                    await detectChangesOnPush(fixture);

                    const viewerDivDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-svg-sheet-viewer-container',
                        1,
                        1
                    );
                    const viewerDivEl: HTMLDivElement = viewerDivDes[0].nativeElement;

                    expectToContain(viewerDivEl.classList, 'col-12');
                    expectToContain(viewerDivEl.classList, 'col-lg-8');
                    expectToContain(viewerDivEl.classList, 'col-xl-9');
                    expectToNotContain(viewerDivEl.classList, 'col');
                });
            });

            describe('EditionSvgSheetFacetComponent', () => {
                it('... should contain one EditionSvgSheetFacetComponent (stubbed) in the item body (div.accordion-body)', () => {
                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                    const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);

                    getAndExpectDebugElementByDirective(itemBodyDes[0], EditionSvgSheetFacetStubComponent, 1, 1);
                });

                it('... should pass down svgSheetsData to the EditionSvgSheetFacetComponent', () => {
                    const sheetFacetDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetFacetStubComponent,
                        1,
                        1
                    );
                    const sheetFacetCmp = sheetFacetDes[0].injector.get(
                        EditionSvgSheetFacetStubComponent
                    ) as EditionSvgSheetFacetStubComponent;

                    expectToEqual(sheetFacetCmp.svgSheetsData, expectedSvgSheetsData);
                });

                it('... should pass down selectedSvgSheet to the EditionSvgSheetFacetComponent', () => {
                    const sheetFacetDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetFacetStubComponent,
                        1,
                        1
                    );
                    const sheetFacetCmp = sheetFacetDes[0].injector.get(
                        EditionSvgSheetFacetStubComponent
                    ) as EditionSvgSheetFacetStubComponent;

                    expectToEqual(sheetFacetCmp.selectedSvgSheet, expectedSvgSheet);
                });
            });

            describe('EditionSvgSheetViewerComponent', () => {
                it('... should contain one EditionSvgSheetViewerComponent (stubbed) in the item body (div.accordion-body)', () => {
                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                    const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);

                    getAndExpectDebugElementByDirective(itemBodyDes[0], EditionSvgSheetViewerStubComponent, 1, 1);
                });

                it('... should not contain an EditionSvgSheetViewerComponent (stubbed) in the item body if no selectedSvgSheet is provided', () => {
                    // Reset selectedSvgSheet
                    component.selectedSvgSheet = undefined;

                    // Trigger data binding
                    fixture.detectChanges();

                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                    const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);

                    getAndExpectDebugElementByDirective(itemBodyDes[0], EditionSvgSheetViewerStubComponent, 1, 1);
                });

                it('... should pass down selectedSvgSheet to the EditionSvgSheetViewerComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetViewerStubComponent,
                        1,
                        1
                    );
                    const sheetCmp = sheetDes[0].injector.get(
                        EditionSvgSheetViewerStubComponent
                    ) as EditionSvgSheetViewerStubComponent;

                    expectToEqual(sheetCmp.selectedSvgSheet, expectedSvgSheet);
                });
            });

            describe('EditionSvgSheetFooterComponent', () => {
                it('... should contain one EditionSvgSheetFooterComponent (stubbed) in the item body (div.accordion-body)', () => {
                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                    const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);

                    getAndExpectDebugElementByDirective(itemBodyDes[0], EditionSvgSheetFooterStubComponent, 1, 1);
                });

                describe('... should not contain an EditionSvgSheetFooterComponent (stubbed) in the item body if ...', () => {
                    it('... no selectedSvgSheet is provided', () => {
                        // Reset selectedSvgSheet
                        component.selectedSvgSheet = undefined;

                        // Trigger data binding
                        fixture.detectChanges();

                        const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                        const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);

                        getAndExpectDebugElementByDirective(itemBodyDes[0], EditionSvgSheetFooterStubComponent, 1, 1);
                    });
                    it('... no selectedTextcritics are provided', () => {
                        // Reset selectedTextcritics
                        component.selectedTextcritics = undefined;

                        // Trigger data binding
                        fixture.detectChanges();

                        const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                        const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);

                        getAndExpectDebugElementByDirective(itemBodyDes[0], EditionSvgSheetFooterStubComponent, 1, 1);
                    });

                    it('... no selectedSvgSheet and no selectedTextcritics are provided', () => {
                        // Reset selectedSvgSheet and selectedTextcritics
                        component.selectedSvgSheet = undefined;
                        component.selectedTextcritics = undefined;

                        // Trigger data binding
                        fixture.detectChanges();

                        const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                        const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);

                        getAndExpectDebugElementByDirective(itemBodyDes[0], EditionSvgSheetFooterStubComponent, 1, 1);
                    });
                });

                it('... should pass down `selectedTextcritics` to the EditionSvgSheetFooterComponent', () => {
                    const footerDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetFooterStubComponent,
                        1,
                        1
                    );
                    const footerCmp = footerDes[0].injector.get(
                        EditionSvgSheetFooterStubComponent
                    ) as EditionSvgSheetFooterStubComponent;

                    expectToEqual(footerCmp.selectedTextcritics, expectedSelectedTextcritics);
                });

                it('... should pass down `selectedTextcriticalCommentary` to the EditionSvgSheetFooterComponent', () => {
                    const footerDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetFooterStubComponent,
                        1,
                        1
                    );
                    const footerCmp = footerDes[0].injector.get(
                        EditionSvgSheetFooterStubComponent
                    ) as EditionSvgSheetFooterStubComponent;

                    expectToEqual(footerCmp.selectedTextcriticalCommentary, expectedSelectedTextcriticalCommentary);
                });

                it('... should pass down `showTkA` to the EditionSvgSheetFooterComponent', () => {
                    const footerDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetFooterStubComponent,
                        1,
                        1
                    );
                    const footerCmp = footerDes[0].injector.get(
                        EditionSvgSheetFooterStubComponent
                    ) as EditionSvgSheetFooterStubComponent;

                    expectToBe(footerCmp.showTkA, expectedShowTkA);
                });
            });
        });

        describe('METHODS', () => {
            describe('#browseSvgSheet()', () => {
                it('... should have a method `browseSvgSheet`  ', () => {
                    expect(component.browseSvgSheet).toBeDefined();
                });

                it('... should trigger on browseSvgSheetRequest event from EditionSvgSheetViewerComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetViewerStubComponent,
                        1,
                        1
                    );
                    const sheetCmp = sheetDes[0].injector.get(
                        EditionSvgSheetViewerStubComponent
                    ) as EditionSvgSheetViewerStubComponent;
                    const expectedDirection = 1;

                    sheetCmp.browseSvgSheetRequest.emit(expectedDirection);

                    expectSpyCall(browseSvgSheetSpy, 1, expectedDirection);
                });

                it('... should not emit anything if no direction is provided', () => {
                    const expectedDirection = undefined;
                    component.browseSvgSheet(expectedDirection);

                    expectSpyCall(browseSvgSheetRequestEmitSpy, 0, expectedDirection);
                });

                it('... should emit a given direction', () => {
                    const expectedDirection = 1;
                    component.browseSvgSheet(expectedDirection);

                    expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);
                });

                it('... should emit the correct direction', () => {
                    let expectedDirection = 1;
                    component.browseSvgSheet(expectedDirection);

                    expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);

                    expectedDirection = -1;
                    component.browseSvgSheet(expectedDirection);

                    expectSpyCall(browseSvgSheetRequestEmitSpy, 2, expectedDirection);
                });
            });

            describe('#navigateToReportFragment()', () => {
                it('... should have a method `navigateToReportFragment`', () => {
                    expect(component.navigateToReportFragment).toBeDefined();
                });

                it('... should trigger on event from EditionSvgSheetFooterStubComponent', () => {
                    const sheetFooterDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetFooterStubComponent,
                        1,
                        1
                    );
                    const sheetFooterCmp = sheetFooterDes[0].injector.get(
                        EditionSvgSheetFooterStubComponent
                    ) as EditionSvgSheetFooterStubComponent;

                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                    sheetFooterCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                    expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                });

                describe('... should not emit anything if', () => {
                    it('... parameter is undefined', () => {
                        component.navigateToReportFragment(undefined);

                        expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                    });
                    it('... parameter is null', () => {
                        component.navigateToReportFragment(null);

                        expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                    });
                    it('... fragment id is undefined', () => {
                        component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: undefined });

                        expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                    });
                    it('... fragment id is null', () => {
                        component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: null });

                        expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                    });
                    it('... fragment id is empty string', () => {
                        component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: '' });

                        expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                    });
                });

                it('... should emit id of selected report fragment within same complex', () => {
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                    component.navigateToReportFragment(expectedReportIds);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedReportIds);

                    const otherFragment = 'source_B';
                    const expectedNextReportIds = { complexId: expectedComplexId, fragmentId: otherFragment };
                    component.navigateToReportFragment(expectedNextReportIds);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, expectedNextReportIds);
                });

                it('... should emit id of selected report fragment for another complex', () => {
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                    component.navigateToReportFragment(expectedReportIds);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedReportIds);

                    const otherFragment = 'source_B';
                    const expectedNextReportIds = { complexId: expectedNextComplexId, fragmentId: otherFragment };
                    component.navigateToReportFragment(expectedNextReportIds);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, expectedNextReportIds);
                });
            });

            describe('#openModal()', () => {
                it('... should have a method `openModal`', () => {
                    expect(component.openModal).toBeDefined();
                });

                it('... should trigger on click on header button', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-accolade-view > div.accordion-header',
                        1,
                        1
                    );

                    // Header Help Button
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'div.ms-auto > button.btn', 1, 1);
                    const expectedSnippet = 'HINT_EDITION_SHEETS';

                    // Trigger click with click helper & wait for changes
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(openModalSpy, 1, expectedSnippet);
                });

                it('... should trigger on event from EditionSvgSheetFooterStubComponent', () => {
                    const sheetFooterDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetFooterStubComponent,
                        1,
                        1
                    );
                    const sheetFooterCmp = sheetFooterDes[0].injector.get(
                        EditionSvgSheetFooterStubComponent
                    ) as EditionSvgSheetFooterStubComponent;

                    sheetFooterCmp.openModalRequest.emit(expectedModalSnippet);

                    expectSpyCall(openModalSpy, 1, expectedModalSnippet);
                });

                it('... should not emit anything if no id is provided', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0, undefined);
                });

                it('... should emit id of given modal snippet', () => {
                    component.openModal(expectedModalSnippet);

                    expectSpyCall(openModalRequestEmitSpy, 1, expectedModalSnippet);
                });
            });

            describe('#selectLinkBox()', () => {
                it('... should have a method `selectLinkBox`', () => {
                    expect(component.selectLinkBox).toBeDefined();
                });

                it('... should trigger on event from EditionSvgSheetViewerComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetViewerStubComponent,
                        1,
                        1
                    );
                    const sheetCmp = sheetDes[0].injector.get(
                        EditionSvgSheetViewerStubComponent
                    ) as EditionSvgSheetViewerStubComponent;

                    sheetCmp.selectLinkBoxRequest.emit(expectedLinkBoxId);

                    expectSpyCall(selectLinkBoxSpy, 1, expectedLinkBoxId);
                });

                it('... should emit link box id', () => {
                    component.selectLinkBox(expectedLinkBoxId);

                    expectSpyCall(selectLinkBoxRequestEmitSpy, 1, expectedLinkBoxId);
                });

                it('... should emit correct link box id', () => {
                    component.selectLinkBox(expectedLinkBoxId);

                    expectSpyCall(selectLinkBoxRequestEmitSpy, 1, expectedLinkBoxId);

                    // Trigger other link box id
                    const otherLinkBoxId = 'link-box-2';
                    component.selectLinkBox(otherLinkBoxId);

                    expectSpyCall(selectLinkBoxRequestEmitSpy, 2, otherLinkBoxId);
                });
            });

            describe('#selectOverlays()', () => {
                it('... should have a method `selectOverlays`', () => {
                    expect(component.selectOverlays).toBeDefined();
                });

                it('... should trigger on selectOverlaysRequest event from EditionSvgSheetViewerComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetViewerStubComponent,
                        1,
                        1
                    );
                    const sheetCmp = sheetDes[0].injector.get(
                        EditionSvgSheetViewerStubComponent
                    ) as EditionSvgSheetViewerStubComponent;

                    sheetCmp.selectOverlaysRequest.emit(expectedOverlays);

                    expectSpyCall(selectOverlaysSpy, 1, [expectedOverlays]);
                });

                it('... should emit overlay of provided type and id', () => {
                    component.selectOverlays(expectedOverlays);

                    expectSpyCall(selectOverlaysRequestEmitSpy, 1, [expectedOverlays]);
                });

                it('... should emit correct overlay of provided type and id', () => {
                    component.selectOverlays(expectedOverlays);

                    expectSpyCall(selectOverlaysRequestEmitSpy, 1, [expectedOverlays]);

                    // Trigger other overlays
                    const otherOverlays = [new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', 'tkk-2', true)];
                    component.selectOverlays(otherOverlays);

                    expectSpyCall(selectOverlaysRequestEmitSpy, 2, [otherOverlays]);
                });
            });

            describe('#selectSvgSheet()', () => {
                it('... should have a method `selectSvgSheet`', () => {
                    expect(component.selectSvgSheet).toBeDefined();
                });

                describe('... should trigger on selectSvgSheetRequest event from ...', () => {
                    it('... EditionSvgSheetFacetComponent', () => {
                        const sheetFacetDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetFacetStubComponent,
                            1,
                            1
                        );
                        const sheetFacetCmp = sheetFacetDes[0].injector.get(
                            EditionSvgSheetFacetStubComponent
                        ) as EditionSvgSheetFacetStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                        sheetFacetCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... EditionSvgSheetFooterStubComponent', () => {
                        const tableDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetFooterStubComponent,
                            1,
                            1
                        );
                        const tableCmp = tableDes[0].injector.get(
                            EditionSvgSheetFooterStubComponent
                        ) as EditionSvgSheetFooterStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                        tableCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });

                it('... should not emit anything if no id is provided', () => {
                    component.selectSvgSheet(undefined);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);

                    component.selectSvgSheet({ complexId: undefined, sheetId: undefined });

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0, {});
                });

                it('... should emit id of selected svg sheet within same complex', () => {
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                    component.selectSvgSheet(expectedNextSheetIds);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
                });

                it('... should emit id of selected svg sheet for another complex', () => {
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSvgSheet.id };
                    component.selectSvgSheet(expectedNextSheetIds);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
                });
            });

            describe('#toggleSheetFacet()', () => {
                it('... should have a method `toggleSheetFacet`', () => {
                    expect(component.toggleSheetFacet).toBeDefined();
                });

                describe('... should trigger on toggleSheetFacetRequest event from EditionSvgSheetFacetComponent', () => {
                    it('... when sheet facet is not minimized', async () => {
                        component.isSheetFacetMinimized = false;
                        await detectChangesOnPush(fixture);

                        const sheetFacetDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetFacetStubComponent,
                            1,
                            1
                        );
                        const sheetFacetCmp = sheetFacetDes[0].injector.get(
                            EditionSvgSheetFacetStubComponent
                        ) as EditionSvgSheetFacetStubComponent;

                        sheetFacetCmp.toggleSheetFacetRequest.emit(true);

                        expectSpyCall(toggleSheetFacetSpy, 1, true);
                    });

                    it('... when sheet facet is minimized', async () => {
                        component.isSheetFacetMinimized = true;
                        await detectChangesOnPush(fixture);

                        const sheetFacetDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetFacetStubComponent,
                            1,
                            1
                        );
                        const sheetFacetCmp = sheetFacetDes[0].injector.get(
                            EditionSvgSheetFacetStubComponent
                        ) as EditionSvgSheetFacetStubComponent;

                        sheetFacetCmp.toggleSheetFacetRequest.emit(false);

                        expectSpyCall(toggleSheetFacetSpy, 1, false);
                    });
                });

                it('... should not emit anything if no value is provided', () => {
                    component.toggleSheetFacet(undefined);

                    expectSpyCall(toggleSheetFacetRequestEmitSpy, 0, undefined);
                });

                it('... should emit toggleSheetFacetRequest with correct value', () => {
                    component.toggleSheetFacet(false);

                    expectSpyCall(toggleSheetFacetRequestEmitSpy, 1, false);

                    component.toggleSheetFacet(true);

                    expectSpyCall(toggleSheetFacetRequestEmitSpy, 2, true);
                });
            });
        });
    });
});
