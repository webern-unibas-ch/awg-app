import { DOCUMENT } from '@angular/common';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { UtilityService } from '@awg-core/services';
import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import {
    SourceDescriptionContent,
    SourceDescriptionList,
    SourceDescriptionWritingInstruments,
    SourceDescriptionWritingMaterial,
    Textcritics,
} from '@awg-views/edition-view/models';

import { SourceDescriptionComponent } from './source-description.component';

// Mock components
@Component({ selector: 'awg-source-description-contents', template: '', standalone: false })
class SourceDescriptionContentsStubComponent {
    @Input()
    contents: SourceDescriptionContent[];
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}
@Component({ selector: 'awg-source-description-corrections', template: '', standalone: false })
class SourceDescriptionCorrectionsStubComponent {
    @Input()
    corrections: Textcritics[];
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-source-description-details', template: '', standalone: false })
class SourceDescriptionDetailsStubComponent {
    @Input()
    details: string[];
    @Input()
    detailsClass: string;
    @Input()
    detailsLabel: string;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-source-description-writing-materials', template: '', standalone: false })
class SourceDescriptionWritingMaterialsStubComponent {
    @Input()
    writingMaterials: SourceDescriptionWritingMaterial[];
}

describe('SourceDescriptionComponent (DONE)', () => {
    let component: SourceDescriptionComponent;
    let fixture: ComponentFixture<SourceDescriptionComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedSourceDescriptionListData: SourceDescriptionList;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;
    let expectedModalSnippet: string;
    let expectedReportFragment: string;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                SourceDescriptionComponent,
                SourceDescriptionContentsStubComponent,
                SourceDescriptionCorrectionsStubComponent,
                SourceDescriptionDetailsStubComponent,
                SourceDescriptionWritingMaterialsStubComponent,
                CompileHtmlComponent,
                AbbrDirective,
                RouterLinkStubDirective,
            ],
            providers: [UtilityService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceDescriptionComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedSourceDescriptionListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceDescriptionListData));
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedSheetId = 'test_item_id_1';
        expectedNextSheetId = 'test_item_id_2';
        expectedReportFragment = 'source_G';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));

        // Spies
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigateToReportFragmentRequestEmitSpy = spyOn(
            component.navigateToReportFragmentRequest,
            'emit'
        ).and.callThrough();
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `sourceDescriptionListData`', () => {
            expect(component.sourceDescriptionListData).toBeUndefined();
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        describe('VIEW', () => {
            it('... should contain no div yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.sourceDescriptionListData = expectedSourceDescriptionListData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `sourceDescriptionListData`', () => {
            expectToEqual(component.sourceDescriptionListData, expectedSourceDescriptionListData);
        });

        describe('VIEW', () => {
            it('... should contain one main description list div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-list', 1, 1);
            });

            it('... should contain as many description divs in main list div as description data has sources', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-description-list > div.awg-source-description',
                    expectedSourceDescriptionListData.sources.length,
                    expectedSourceDescriptionListData.sources.length
                );
            });

            it('... should have `card` class on each description div', () => {
                const sourceDescDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-description-list > div.awg-source-description',
                    expectedSourceDescriptionListData.sources.length,
                    expectedSourceDescriptionListData.sources.length
                );

                sourceDescDes.forEach(divDe => {
                    const divEl: HTMLDivElement = divDe.nativeElement;
                    expectToContain(divEl.classList, 'card');
                });
            });

            it('... should have 1 div.card-body in each description div', () => {
                const sourceDescDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-description-list > div.awg-source-description',
                    expectedSourceDescriptionListData.sources.length,
                    expectedSourceDescriptionListData.sources.length
                );

                sourceDescDes.forEach(divDe => {
                    getAndExpectDebugElementByCss(divDe, 'div.card-body', 1, 1);
                });
            });

            describe('... first description div (no physDesc entries)', () => {
                it('... should contain a description-head div, but no physDesc in div.card-body', () => {
                    const cardBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-list > div.awg-source-description > div.card-body',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-description-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-description-phys-desc', 0, 0);
                });

                it('... should contain 3 paragraphs in first description-head div', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    getAndExpectDebugElementByCss(descHeadDes[0], 'p', 3, 3);
                });

                it('... the first paragraph displaying a siglum (bold) without an addendum', () => {
                    const expectedSiglum = expectedSourceDescriptionListData.sources[0].siglum;

                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[0], 'p', 3, 3);
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                    const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span', 1, 1);
                    const siglumSpanDes = spanDes[0];
                    const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-siglum-container');
                    expect(pEl).toHaveClass('bold');
                    expectToBe(pEl.textContent.trim(), expectedSiglum.trim());

                    expect(siglumSpanEl).toHaveClass('awg-source-description-siglum');
                    expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                });

                it('... the second paragraph displaying the source type', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[0], 'p', 3, 3);

                    const pEl: HTMLParagraphElement = pDes[1].nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-type');
                    expectToBe(pEl.textContent.trim(), expectedSourceDescriptionListData.sources[0].type.trim());
                });

                it('... the third paragraph displaying the source location', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[0], 'p', 3, 3);

                    const pEl: HTMLParagraphElement = pDes[2].nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-location');
                    expectToBe(pEl.textContent.trim(), expectedSourceDescriptionListData.sources[0].location.trim());
                });
            });

            describe('... second description div (all possibly physDesc entries, with only writing material string)', () => {
                it('... should contain a description-head div, and a physDesc in div.card-body', () => {
                    const cardBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-list > div.awg-source-description > div.card-body',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    getAndExpectDebugElementByCss(cardBodyDes[1], 'div.awg-source-description-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[1], 'div.awg-source-description-phys-desc', 1, 1);
                });

                it('... should contain 2 paragraphs in second description-head div', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    getAndExpectDebugElementByCss(descHeadDes[1], 'p', 2, 2);
                });

                it('... the first paragraph displaying a siglum (bold) with addendum', () => {
                    const expectedSiglum = expectedSourceDescriptionListData.sources[1].siglum;
                    const expectedAddendum = expectedSourceDescriptionListData.sources[1].siglumAddendum;

                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[1], 'p', 2, 2);
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                    const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span', 2, 2);
                    const siglumSpanDes = spanDes[0];
                    const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;

                    const addendumSpanDes = spanDes[1];
                    const addendumSpanEl: HTMLSpanElement = addendumSpanDes.nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-siglum-container');
                    expect(pEl).toHaveClass('bold');
                    expectToBe(pEl.textContent.trim(), expectedSiglum.trim() + expectedAddendum.trim());

                    expect(siglumSpanEl).toHaveClass('awg-source-description-siglum');
                    expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());

                    expect(addendumSpanEl).toHaveClass('awg-source-description-siglum-addendum');
                    expectToBe(addendumSpanEl.textContent.trim(), expectedAddendum.trim());
                });

                it('... the second paragraph displaying the source location', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[1], 'p', 2, 2);
                    const pEl: HTMLParagraphElement = pDes[1].nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-location');
                    expectToBe(pEl.textContent.trim(), expectedSourceDescriptionListData.sources[1].location.trim());
                });

                it('... should contain 1 paragraph in physDesc div', () => {
                    // First description has no content, so only 2 divs
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    // Get first physDesc div with content
                    getAndExpectDebugElementByCss(physDescDes[0], 'div.awg-source-description-phys-desc > p', 1, 1);
                });

                it('... the paragraph in physDesc div displaying the writingInstruments', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );
                    const pDes = getAndExpectDebugElementByCss(
                        physDescDes[0],
                        'div.awg-source-description-phys-desc > p',
                        1,
                        1
                    );
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                    const instruments = expectedSourceDescriptionListData.sources[1].physDesc.writingInstruments;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML =
                        '<span class="smallcaps">Schreibstoff:&nbsp;</span><span>' +
                        instruments.main +
                        '; ' +
                        instruments.secondary.join(', ') +
                        '.</span>';

                    expect(pEl).toHaveClass('awg-source-description-writing-instruments');
                    expectToBe(
                        pEl.textContent.trim().toLowerCase(),
                        expectedHtmlTextContent.textContent.trim().toLowerCase()
                    );
                });

                it('... should contain up to 8 source description details components (stubbed) in physDesc div', () => {
                    // First description has no content, so only 2 divs
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(physDescDes[0], SourceDescriptionDetailsStubComponent, 8, 8);
                });

                it('... should pass down the conditions to the first source description details component', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    const detailDes = getAndExpectDebugElementByDirective(
                        physDescDes[0],
                        SourceDescriptionDetailsStubComponent,
                        8,
                        8
                    );
                    const detailCmp = detailDes[0].injector.get(
                        SourceDescriptionDetailsStubComponent
                    ) as SourceDescriptionDetailsStubComponent;

                    expectToEqual(detailCmp.details, expectedSourceDescriptionListData.sources[1].physDesc.conditions);
                    expectToBe(detailCmp.detailsLabel, '');
                    expectToBe(detailCmp.detailsClass, 'conditions');
                });

                it('... should pass down the writingMaterials to the second source description details component', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    const detailDes = getAndExpectDebugElementByDirective(
                        physDescDes[0],
                        SourceDescriptionDetailsStubComponent,
                        8,
                        8
                    );
                    const detailCmp = detailDes[1].injector.get(
                        SourceDescriptionDetailsStubComponent
                    ) as SourceDescriptionDetailsStubComponent;

                    expectToEqual(
                        detailCmp.details,
                        expectedSourceDescriptionListData.sources[1].physDesc.writingMaterialStrings
                    );
                    expectToBe(detailCmp.detailsLabel, 'Beschreibstoff');
                    expectToBe(detailCmp.detailsClass, 'writing-materials');
                });

                it('... should contain no SourceDescriptionWritingMaterialsComponent if writing materials array is empty', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    // First physDesc has no writing materials array
                    getAndExpectDebugElementByDirective(
                        physDescDes[0],
                        SourceDescriptionWritingMaterialsStubComponent,
                        0,
                        0
                    );
                });

                it('... should pass down the titles to the third source description details component', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    const detailDes = getAndExpectDebugElementByDirective(
                        physDescDes[0],
                        SourceDescriptionDetailsStubComponent,
                        8,
                        8
                    );
                    const detailCmp = detailDes[2].injector.get(
                        SourceDescriptionDetailsStubComponent
                    ) as SourceDescriptionDetailsStubComponent;

                    expectToEqual(detailCmp.details, expectedSourceDescriptionListData.sources[1].physDesc.titles);
                    expectToBe(detailCmp.detailsLabel, 'Titel');
                    expectToBe(detailCmp.detailsClass, 'titles');
                });

                it('... should pass down the dates to the fourth source description details component', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    const detailDes = getAndExpectDebugElementByDirective(
                        physDescDes[0],
                        SourceDescriptionDetailsStubComponent,
                        8,
                        8
                    );
                    const detailCmp = detailDes[3].injector.get(
                        SourceDescriptionDetailsStubComponent
                    ) as SourceDescriptionDetailsStubComponent;

                    expectToEqual(detailCmp.details, expectedSourceDescriptionListData.sources[1].physDesc.dates);
                    expectToBe(detailCmp.detailsLabel, 'Datierung');
                    expectToBe(detailCmp.detailsClass, 'dates');
                });

                it('... should pass down the paginations to the fifth source description details component', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    const detailDes = getAndExpectDebugElementByDirective(
                        physDescDes[0],
                        SourceDescriptionDetailsStubComponent,
                        8,
                        8
                    );
                    const detailCmp = detailDes[4].injector.get(
                        SourceDescriptionDetailsStubComponent
                    ) as SourceDescriptionDetailsStubComponent;

                    expectToEqual(detailCmp.details, expectedSourceDescriptionListData.sources[1].physDesc.paginations);
                    expectToBe(detailCmp.detailsLabel, 'Paginierung');
                    expectToBe(detailCmp.detailsClass, 'paginations');
                });

                it('... should pass down the measureNumbers to the sixth source description details component', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    const detailDes = getAndExpectDebugElementByDirective(
                        physDescDes[0],
                        SourceDescriptionDetailsStubComponent,
                        8,
                        8
                    );
                    const detailCmp = detailDes[5].injector.get(
                        SourceDescriptionDetailsStubComponent
                    ) as SourceDescriptionDetailsStubComponent;

                    expectToEqual(
                        detailCmp.details,
                        expectedSourceDescriptionListData.sources[1].physDesc.measureNumbers
                    );
                    expectToBe(detailCmp.detailsLabel, 'Taktzahlen');
                    expectToBe(detailCmp.detailsClass, 'measure-numbers');
                });

                it('... should pass down the instrumentations to the seventh source description details component', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    const detailDes = getAndExpectDebugElementByDirective(
                        physDescDes[0],
                        SourceDescriptionDetailsStubComponent,
                        8,
                        8
                    );
                    const detailCmp = detailDes[6].injector.get(
                        SourceDescriptionDetailsStubComponent
                    ) as SourceDescriptionDetailsStubComponent;

                    expectToEqual(
                        detailCmp.details,
                        expectedSourceDescriptionListData.sources[1].physDesc.instrumentations
                    );
                    expectToBe(detailCmp.detailsLabel, 'Instrumentenvorsatz');
                    expectToBe(detailCmp.detailsClass, 'instrumentations');
                });

                it('... should pass down the annotations to the eighth source description details component', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    const detailDes = getAndExpectDebugElementByDirective(
                        physDescDes[0],
                        SourceDescriptionDetailsStubComponent,
                        8,
                        8
                    );
                    const detailCmp = detailDes[7].injector.get(
                        SourceDescriptionDetailsStubComponent
                    ) as SourceDescriptionDetailsStubComponent;

                    expectToEqual(detailCmp.details, expectedSourceDescriptionListData.sources[1].physDesc.annotations);
                    expectToBe(detailCmp.detailsLabel, 'Eintragungen');
                    expectToBe(detailCmp.detailsClass, 'annotations');
                });

                describe('... the contents', () => {
                    it('... should contain SourceDescriptionContentsComponent if contents array is not empty', () => {
                        const physDescDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-phys-desc',
                            2,
                            2
                        );

                        // First physDesc has contents
                        getAndExpectDebugElementByDirective(
                            physDescDes[0],
                            SourceDescriptionContentsStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should contain no SourceDescriptionContentsComponent if contents array is empty or undefined', () => {
                        const physDescDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-phys-desc',
                            2,
                            2
                        );

                        // Second physDesc has no contents
                        getAndExpectDebugElementByDirective(
                            physDescDes[1],
                            SourceDescriptionContentsStubComponent,
                            0,
                            0
                        );
                    });

                    it('... should pass down contents data to SourceDescriptionContentsComponent', () => {
                        const expectedContents = expectedSourceDescriptionListData.sources[1].physDesc.contents;

                        const physDescDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-phys-desc',
                            2,
                            2
                        );
                        // First physDesc has contents
                        const contentsDes = getAndExpectDebugElementByDirective(
                            physDescDes[0],
                            SourceDescriptionContentsStubComponent,
                            1,
                            1
                        );
                        const contentsCmp = contentsDes[0].injector.get(SourceDescriptionContentsStubComponent);

                        expectToEqual(contentsCmp.contents, expectedContents);
                    });
                });

                describe('... the corrections', () => {
                    it('... should contain SourceDescriptionCorrectionsComponent if corrections array is not empty', () => {
                        const physDescDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-phys-desc',
                            2,
                            2
                        );

                        // First physDesc has corrections
                        getAndExpectDebugElementByDirective(
                            physDescDes[0],
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should contain no SourceDescriptionCorrectionsComponent if corrections array is empty or undefined', () => {
                        const physDescDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-phys-desc',
                            2,
                            2
                        );

                        // Second physDesc has no corrections
                        getAndExpectDebugElementByDirective(
                            physDescDes[1],
                            SourceDescriptionCorrectionsStubComponent,
                            0,
                            0
                        );
                    });

                    it('... should pass down corrections data to SourceDescriptionCorrectionsComponent', () => {
                        const expectedCorrections = expectedSourceDescriptionListData.sources[1].physDesc.corrections;

                        const physDescDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-phys-desc',
                            2,
                            2
                        );
                        // First physDesc has corrections
                        const correctionsDes = getAndExpectDebugElementByDirective(
                            physDescDes[0],
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionsCmp = correctionsDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        );

                        expectToEqual(correctionsCmp.corrections, expectedCorrections);
                    });
                });
            });

            describe('... third description div (only conditions and writing materials in physDesc)', () => {
                it('... should contain a description-head div, and a physDesc in div.card-body', () => {
                    const cardBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-list > div.awg-source-description > div.card-body',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    getAndExpectDebugElementByCss(cardBodyDes[2], 'div.awg-source-description-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[2], 'div.awg-source-description-phys-desc', 1, 1);
                });

                it('... should contain 3 paragraphs in second description-head div', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    getAndExpectDebugElementByCss(descHeadDes[2], 'p', 3, 3);
                });

                it('... the first paragraph displaying a siglum (bold) with addendum and brackets (missing)', () => {
                    const expectedSiglum = expectedSourceDescriptionListData.sources[2].siglum;
                    const expectedAddendum = expectedSourceDescriptionListData.sources[2].siglumAddendum;

                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[2], 'p', 3, 3);
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                    const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span', 4, 4);

                    // First span is opening bracket
                    // Last span is closing bracket
                    const siglumSpanDes = spanDes[1];
                    const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;

                    const addendumSpanDes = spanDes[2];
                    const addendumSpanEl: HTMLSpanElement = addendumSpanDes.nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-siglum-container');
                    expect(pEl).toHaveClass('bold');
                    expectToBe(pEl.textContent.trim(), `[${expectedSiglum}${expectedAddendum}]`);

                    expect(siglumSpanEl).toHaveClass('awg-source-description-siglum');
                    expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());

                    expect(addendumSpanEl).toHaveClass('awg-source-description-siglum-addendum');
                    expectToBe(addendumSpanEl.textContent.trim(), expectedAddendum.trim());
                });

                it('... the second paragraph displaying the source type', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[2], 'p', 3, 3);
                    const pEl: HTMLParagraphElement = pDes[1].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML = expectedSourceDescriptionListData.sources[2].type;

                    expect(pEl).toHaveClass('awg-source-description-type');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });

                it('... the third paragraph displaying the source location', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[2], 'p', 3, 3);
                    const pEl: HTMLParagraphElement = pDes[2].nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-location');
                    expectToBe(pEl.textContent.trim(), expectedSourceDescriptionListData.sources[2].location.trim());
                });

                it('... should contain 1 source description details components (stubbed) in physDesc div', () => {
                    // First physDesc has no content, so only 2 divs
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(physDescDes[1], SourceDescriptionDetailsStubComponent, 1, 1);
                });

                it('... should pass down the conditions to the source description details component', () => {
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    const detailDes = getAndExpectDebugElementByDirective(
                        physDescDes[1],
                        SourceDescriptionDetailsStubComponent,
                        1,
                        1
                    );
                    const detailCmp = detailDes[0].injector.get(
                        SourceDescriptionDetailsStubComponent
                    ) as SourceDescriptionDetailsStubComponent;

                    expectToEqual(detailCmp.details, expectedSourceDescriptionListData.sources[2].physDesc.conditions);
                    expectToBe(detailCmp.detailsLabel, '');
                    expectToBe(detailCmp.detailsClass, 'conditions');
                });

                describe('... the writing materials', () => {
                    it('... should contain 1 SourceDescriptionWritingMaterialsComponent if writing materials array is not empty', () => {
                        const physDescDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-phys-desc',
                            2,
                            2
                        );

                        // Second physDesc has writing materials
                        getAndExpectDebugElementByDirective(
                            physDescDes[1],
                            SourceDescriptionWritingMaterialsStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should pass down the writingMaterials to the writing materials component', () => {
                        const physDescDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-phys-desc',
                            2,
                            2
                        );

                        // Second physDesc has writing materials
                        const writingMaterialsDes = getAndExpectDebugElementByDirective(
                            physDescDes[1],
                            SourceDescriptionWritingMaterialsStubComponent,
                            1,
                            1
                        );
                        const writingMaterialCmp = writingMaterialsDes[0].injector.get(
                            SourceDescriptionWritingMaterialsStubComponent
                        ) as SourceDescriptionWritingMaterialsStubComponent;

                        expectToEqual(
                            writingMaterialCmp.writingMaterials,
                            expectedSourceDescriptionListData.sources[2].physDesc.writingMaterials
                        );
                    });
                });
            });
        });

        describe('#getWritingInstruments()', () => {
            it('... should have a method `getWritingInstruments`', () => {
                expect(component.getWritingInstruments).toBeDefined();
            });

            describe('... should return only main writing instrument when', () => {
                it('... secondary is undefined', () => {
                    const writingInstruments: SourceDescriptionWritingInstruments = {
                        main: 'main instrument',
                        secondary: undefined,
                    };

                    const result = component.getWritingInstruments(writingInstruments);

                    expectToBe(result, 'main instrument.');
                });

                it('... secondary is an empty array', () => {
                    const writingInstruments: SourceDescriptionWritingInstruments = {
                        main: 'main instrument',
                        secondary: [],
                    };

                    const result = component.getWritingInstruments(writingInstruments);

                    expectToBe(result, 'main instrument.');
                });
            });

            it('... should return main and a single secondary writing instrument if provided', () => {
                const writingInstruments: SourceDescriptionWritingInstruments = {
                    main: 'main instrument',
                    secondary: ['secondary1'],
                };

                const result = component.getWritingInstruments(writingInstruments);

                expectToBe(result, 'main instrument; secondary1.');
            });

            it('... should return main and mulitple secondary writing instruments if provided', () => {
                const writingInstruments: SourceDescriptionWritingInstruments = {
                    main: 'main instrument',
                    secondary: ['secondary1', 'secondary2', 'secondary3'],
                };

                const result = component.getWritingInstruments(writingInstruments);

                expectToBe(result, 'main instrument; secondary1, secondary2, secondary3.');
            });

            it('... should handle case when main is undefined', () => {
                const writingInstruments: SourceDescriptionWritingInstruments = {
                    main: undefined,
                    secondary: ['secondary1', 'secondary2'],
                };

                const result = component.getWritingInstruments(writingInstruments);

                expectToBe(result, 'undefined; secondary1, secondary2.');
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            describe('... should trigger', () => {
                describe('... on event from SourceDescriptionDetailComponent (stubbed) if', () => {
                    it('... sheet id is undefined', () => {
                        const detailDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionDetailsStubComponent,
                            9,
                            9
                        );
                        const detailCmp = detailDes[0].injector.get(
                            SourceDescriptionDetailsStubComponent
                        ) as SourceDescriptionDetailsStubComponent;

                        detailCmp.navigateToReportFragmentRequest.emit(undefined);

                        expectSpyCall(navigateToReportFragmentSpy, 1, undefined);
                    });

                    it('... sheet id is given', () => {
                        const detailDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionDetailsStubComponent,
                            9,
                            9
                        );
                        const detailCmp = detailDes[0].injector.get(
                            SourceDescriptionDetailsStubComponent
                        ) as SourceDescriptionDetailsStubComponent;

                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                        detailCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                        expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                    });
                });

                describe('... on event from SourceDescriptionCorrectionsComponent (stubbed) if', () => {
                    it('... fragment id is undefined', () => {
                        const correctionsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionsCmp = correctionsDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        correctionsCmp.navigateToReportFragmentRequest.emit(undefined);

                        expectSpyCall(navigateToReportFragmentSpy, 1, undefined);
                    });

                    it('... fragment id is given', () => {
                        const correctionsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionsCmp = correctionsDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                        correctionsCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                        expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                    });
                });
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

            describe('... should trigger', () => {
                describe('... on event from SourceDescriptionDetailComponent (stubbed) if', () => {
                    it('... sheet id is undefined', () => {
                        const detailDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionDetailsStubComponent,
                            9,
                            9
                        );
                        const detailCmp = detailDes[0].injector.get(
                            SourceDescriptionDetailsStubComponent
                        ) as SourceDescriptionDetailsStubComponent;

                        detailCmp.openModalRequest.emit(undefined);

                        expectSpyCall(openModalSpy, 1, undefined);
                    });

                    it('... sheet id is given', () => {
                        const detailDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionDetailsStubComponent,
                            9,
                            9
                        );
                        const detailCmp = detailDes[0].injector.get(
                            SourceDescriptionDetailsStubComponent
                        ) as SourceDescriptionDetailsStubComponent;

                        detailCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(openModalSpy, 1, expectedModalSnippet);
                    });
                });

                describe('... on event from SourceDescriptionCorrectionsComponent (stubbed) if', () => {
                    it('... fragment id is undefined', () => {
                        const correctionsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionsCmp = correctionsDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        correctionsCmp.openModalRequest.emit(undefined);

                        expectSpyCall(openModalSpy, 1, undefined);
                    });

                    it('... fragment id is given', () => {
                        const correctionsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionsCmp = correctionsDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        correctionsCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(openModalSpy, 1, expectedModalSnippet);
                    });
                });
            });

            describe('... should not emit anything if ', () => {
                it('... id is undefined', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });

                it('... id is null', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0, null);
                });
                it('... id is empty string', () => {
                    component.openModal('');

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });
            });

            it('... should emit id of given modal snippet', () => {
                component.openModal(expectedModalSnippet);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedModalSnippet);
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            describe('... should trigger', () => {
                describe('... on event from SourceDescriptionContentsComponent (stubbed) if', () => {
                    it('... sheet id is undefined', () => {
                        const contentsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionContentsStubComponent,
                            1,
                            1
                        );
                        const contentsCmp = contentsDes[0].injector.get(
                            SourceDescriptionContentsStubComponent
                        ) as SourceDescriptionContentsStubComponent;

                        contentsCmp.selectSvgSheetRequest.emit(undefined);

                        expectSpyCall(selectSvgSheetSpy, 1, undefined);
                    });

                    it('... sheet id is given', () => {
                        const contentsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionContentsStubComponent,
                            1,
                            1
                        );
                        const contentsCmp = contentsDes[0].injector.get(
                            SourceDescriptionContentsStubComponent
                        ) as SourceDescriptionContentsStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };

                        contentsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });

                describe('... on event from SourceDescriptionCorrectionsComponent (stubbed) if', () => {
                    it('... sheet id is undefined', () => {
                        const correctionsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionsCmp = correctionsDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        correctionsCmp.selectSvgSheetRequest.emit(undefined);

                        expectSpyCall(selectSvgSheetSpy, 1, undefined);
                    });

                    it('... sheet id is given', () => {
                        const correctionsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionsCmp = correctionsDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };

                        correctionsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });

                describe('... on event from SourceDescriptionDetailComponent (stubbed) if', () => {
                    it('... sheet id is undefined', () => {
                        const detailDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionDetailsStubComponent,
                            9,
                            9
                        );
                        const detailCmp = detailDes[0].injector.get(
                            SourceDescriptionDetailsStubComponent
                        ) as SourceDescriptionDetailsStubComponent;

                        detailCmp.selectSvgSheetRequest.emit(undefined);

                        expectSpyCall(selectSvgSheetSpy, 1, undefined);
                    });

                    it('... sheet id is given', () => {
                        const detailDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionDetailsStubComponent,
                            9,
                            9
                        );
                        const detailCmp = detailDes[0].injector.get(
                            SourceDescriptionDetailsStubComponent
                        ) as SourceDescriptionDetailsStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };

                        detailCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });
            });

            it('... should not emit anything if no id is provided', () => {
                const expectedSheetIds = undefined;
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);

                const expectedNextSheetIds = { complexId: undefined, sheetId: undefined };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet within same complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });
        });
    });
});
