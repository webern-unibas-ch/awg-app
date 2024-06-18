import { DOCUMENT } from '@angular/common';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
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
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_FIRM_SIGNS_DATA } from '@awg-views/edition-view/data';
import {
    SourceDescriptionList,
    SourceDescriptionWritingInstruments,
    SourceDescriptionWritingMaterialFormat,
    SourceDescriptionWritingMaterialItemLocation,
    SourceDescriptionWritingMaterialSystems,
    Textcritics,
} from '@awg-views/edition-view/models';

import { SourceDescriptionComponent } from './source-description.component';

// Mock components
@Component({ selector: 'awg-source-description-corrections', template: '' })
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

describe('SourceDescriptionComponent (DONE)', () => {
    let component: SourceDescriptionComponent;
    let fixture: ComponentFixture<SourceDescriptionComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let utils: UtilityService;

    let expectedSourceDescriptionListData: SourceDescriptionList;
    let expectedFirmSigns;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;
    let expectedModalSnippet: string;
    let expectedReportFragment: string;

    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                SourceDescriptionComponent,
                SourceDescriptionCorrectionsStubComponent,
                CompileHtmlComponent,
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
        utils = TestBed.inject(UtilityService);

        // Test data
        expectedSourceDescriptionListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceDescriptionListData));
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedSheetId = 'test_item_id_1';
        expectedNextSheetId = 'test_item_id_2';
        expectedReportFragment = 'source_G';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedFirmSigns = EDITION_FIRM_SIGNS_DATA;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
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

        it('... should have `FIRM_SIGNS`', () => {
            expectToEqual(component.FIRM_SIGNS, expectedFirmSigns);
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
                    const divEl = divDe.nativeElement;
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

            describe('... first description div', () => {
                it('... should contain a description-head div, but no description-body in div.card-body', () => {
                    const cardBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-list > div.awg-source-description > div.card-body',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-description-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-description-body', 0, 0);
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
                    const pEl = pDes[0].nativeElement;

                    const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span', 1, 1);
                    const siglumDes = spanDes[0];
                    const siglumEl = siglumDes.nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-siglum-container');
                    expect(pEl).toHaveClass('bold');
                    expectToBe(pEl.textContent.trim(), expectedSiglum.trim());

                    expect(siglumEl).toHaveClass('awg-source-description-siglum');
                    expectToBe(siglumEl.textContent.trim(), expectedSiglum.trim());
                });

                it('... the second paragraph displaying the source type', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[0], 'p', 3, 3);

                    const pEl = pDes[1].nativeElement;

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

                    const pEl = pDes[2].nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-location');
                    expectToBe(pEl.textContent.trim(), expectedSourceDescriptionListData.sources[0].location.trim());
                });
            });

            describe('... second description div', () => {
                it('... should contain a description-head div, and a description-body in div.card-body', () => {
                    const cardBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-list > div.awg-source-description > div.card-body',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    getAndExpectDebugElementByCss(cardBodyDes[1], 'div.awg-source-description-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[1], 'div.awg-source-description-body', 1, 1);
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
                    const pEl = pDes[0].nativeElement;

                    const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span', 2, 2);
                    const siglumDes = spanDes[0];
                    const siglumEl = siglumDes.nativeElement;

                    const addendumDes = spanDes[1];
                    const addendumEl = addendumDes.nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-siglum-container');
                    expect(pEl).toHaveClass('bold');
                    expectToBe(pEl.textContent.trim(), expectedSiglum.trim() + expectedAddendum.trim());

                    expect(siglumEl).toHaveClass('awg-source-description-siglum');
                    expectToBe(siglumEl.textContent.trim(), expectedSiglum.trim());

                    expect(addendumEl).toHaveClass('awg-source-description-siglum-addendum');
                    expectToBe(addendumEl.textContent.trim(), expectedAddendum.trim());
                });

                it('... the second paragraph displaying the source location', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[1], 'p', 2, 2);
                    const pEl = pDes[1].nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-location');
                    expectToBe(pEl.textContent.trim(), expectedSourceDescriptionListData.sources[1].location.trim());
                });

                it('... should contain up to 9 paragraphs in description-body div', () => {
                    // First description has no content, so only 2 divs
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);

                    // Get first description body div with content
                    getAndExpectDebugElementByCss(descBodyDes[0], 'div.awg-source-description-body > p', 9, 9);
                });

                it('... the first possible paragraph displaying the description', () => {
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    const pDes = getAndExpectDebugElementByCss(
                        descBodyDes[0],
                        'div.awg-source-description-body > p',
                        9,
                        9
                    );
                    const pEl = pDes[0].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML =
                        expectedSourceDescriptionListData.sources[1].description.desc[0];

                    expect(pEl).toHaveClass('awg-source-description-desc');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });

                it('... the second possible paragraph displaying the writingMaterial', () => {
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    const pDes = getAndExpectDebugElementByCss(
                        descBodyDes[0],
                        'div.awg-source-description-body > p',
                        9,
                        9
                    );
                    const pEl = pDes[1].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML =
                        '<span class="smallcaps">Beschreibstoff:&nbsp;</span><span>' +
                        expectedSourceDescriptionListData.sources[1].description.writingMaterialString +
                        '</span>';

                    expect(pEl).toHaveClass('awg-source-description-writing-material');
                    expectToBe(
                        pEl.textContent.trim().toLowerCase(),
                        expectedHtmlTextContent.textContent.trim().toLowerCase()
                    );
                });

                it('... the third possible paragraph displaying the writingInstruments', () => {
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    const pDes = getAndExpectDebugElementByCss(
                        descBodyDes[0],
                        'div.awg-source-description-body > p',
                        9,
                        9
                    );
                    const pEl = pDes[2].nativeElement;

                    const instruments = expectedSourceDescriptionListData.sources[1].description.writingInstruments;

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

                it('... the fourth possible paragraph displaying the title', () => {
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    const pDes = getAndExpectDebugElementByCss(
                        descBodyDes[0],
                        'div.awg-source-description-body > p',
                        9,
                        9
                    );
                    const pEl = pDes[3].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML =
                        'Titel:&nbsp;' + expectedSourceDescriptionListData.sources[1].description.title;

                    expect(pEl).toHaveClass('awg-source-description-title');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });

                it('... the fifth possible paragraph displaying the date', () => {
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    const pDes = getAndExpectDebugElementByCss(
                        descBodyDes[0],
                        'div.awg-source-description-body > p',
                        9,
                        9
                    );
                    const pEl = pDes[4].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML =
                        'Datierung:&nbsp;' + expectedSourceDescriptionListData.sources[1].description.date;

                    expect(pEl).toHaveClass('awg-source-description-date');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });

                it('... the sixth possible paragraph displaying the pagination', () => {
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    const pDes = getAndExpectDebugElementByCss(
                        descBodyDes[0],
                        'div.awg-source-description-body > p',
                        9,
                        9
                    );
                    const pEl = pDes[5].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML =
                        'Paginierung:&nbsp;' + expectedSourceDescriptionListData.sources[1].description.pagination;

                    expect(pEl).toHaveClass('awg-source-description-pagination');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });

                it('... the seventh possible paragraph displaying the measure numbers', () => {
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    const pDes = getAndExpectDebugElementByCss(
                        descBodyDes[0],
                        'div.awg-source-description-body > p',
                        9,
                        9
                    );
                    const pEl = pDes[6].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML =
                        'Taktzahlen:&nbsp;' + expectedSourceDescriptionListData.sources[1].description.measureNumbers;

                    expect(pEl).toHaveClass('awg-source-description-measure-numbers');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });

                it('... the eighth possible paragraph displaying the instrumentation', () => {
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    const pDes = getAndExpectDebugElementByCss(
                        descBodyDes[0],
                        'div.awg-source-description-body > p',
                        9,
                        9
                    );
                    const pEl = pDes[7].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML =
                        'Instrumentenvorsatz:&nbsp;' +
                        expectedSourceDescriptionListData.sources[1].description.instrumentation;

                    expect(pEl).toHaveClass('awg-source-description-instrumentation');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });

                it('... the ninth possible paragraph displaying the annotations', () => {
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    const pDes = getAndExpectDebugElementByCss(
                        descBodyDes[0],
                        'div.awg-source-description-body > p',
                        9,
                        9
                    );
                    const pEl = pDes[8].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML =
                        'Eintragungen:&nbsp;' + expectedSourceDescriptionListData.sources[1].description.annotations;

                    expect(pEl).toHaveClass('awg-source-description-annotations');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });

                it('... should contain one description-content div in description-body div', () => {
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-body > div.awg-source-description-content',
                        1,
                        1
                    );
                });

                it('... should contain one paragraph (no-para) displaying the label "Inhalt:" in description-content div', () => {
                    const pDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-body > div.awg-source-description-content > p.no-para',
                        1,
                        1
                    );
                    const pEl = pDes[0].nativeElement;

                    expect(pEl).toHaveClass('no-para');
                    expectToBe(pEl.textContent.trim(), 'Inhalt:');
                });

                it('... should contain as many item paragraphs (half-para) in description-content div as given content items', () => {
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                        expectedSourceDescriptionListData.sources[1].description.content.length,
                        expectedSourceDescriptionListData.sources[1].description.content.length
                    );
                });

                describe('... the item paragraphs (half-para)', () => {
                    it('... should contain the content items', () => {
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );

                        const itemDes0 = getAndExpectDebugElementByCss(
                            pDes[0],
                            'span.awg-source-description-content-item',
                            1,
                            1
                        );
                        const itemEl0 = itemDes0[0].nativeElement;

                        const itemDes1 = getAndExpectDebugElementByCss(
                            pDes[1],
                            'span.awg-source-description-content-item',
                            1,
                            1
                        );
                        const itemEl1 = itemDes1[0].nativeElement;

                        const itemDes2 = getAndExpectDebugElementByCss(
                            pDes[2],
                            'span.awg-source-description-content-item',
                            1,
                            1
                        );
                        const itemEl2 = itemDes2[0].nativeElement;

                        expectToBe(itemEl0.textContent.trim(), 'Test item (test description):');
                        expectToBe(itemEl1.textContent.trim(), 'Test item 2 without link (test description 2):');
                        expectToBe(itemEl2.textContent.trim(), 'Test item 3 without description:');
                    });

                    it('... should display the content-item (strong) with anchor link and description if given', () => {
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );
                        const contentItemDes = getAndExpectDebugElementByCss(
                            pDes[0],
                            'span.awg-source-description-content-item',
                            1,
                            1
                        );
                        const anchorDes = getAndExpectDebugElementByCss(contentItemDes[0], 'a', 1, 1);
                        const strongDes = getAndExpectDebugElementByCss(anchorDes[0], 'strong', 1, 1);
                        const strongEl = strongDes[0].nativeElement;

                        const contentItemDescriptionDes = getAndExpectDebugElementByCss(
                            pDes[0],
                            'span.awg-source-description-content-item-description',
                            1,
                            1
                        );
                        const contentItemDescriptionEl = contentItemDescriptionDes[0].nativeElement;

                        expectToBe(strongEl.textContent.trim(), 'Test item');
                        expectToBe(contentItemDescriptionEl.textContent.trim(), '(test description)');
                    });

                    it('... should display the content-item (strong) without anchor link if not given', () => {
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );
                        const contentItemDes = getAndExpectDebugElementByCss(
                            pDes[1],
                            'span.awg-source-description-content-item',
                            1,
                            1
                        );
                        getAndExpectDebugElementByCss(contentItemDes[0], 'a', 0, 0);
                        const strongDes = getAndExpectDebugElementByCss(contentItemDes[0], 'strong', 1, 1);
                        const strongEl = strongDes[0].nativeElement;

                        const contentItemDescriptionDes = getAndExpectDebugElementByCss(
                            pDes[1],
                            'span.awg-source-description-content-item-description',
                            1,
                            1
                        );
                        const contentItemDescriptionEl = contentItemDescriptionDes[0].nativeElement;

                        expectToBe(strongEl.textContent.trim(), 'Test item 2 without link');
                        expectToBe(contentItemDescriptionEl.textContent.trim(), '(test description 2)');
                    });

                    it('... should display the content-item (strong) without description if not given', () => {
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );
                        const contentItemDes = getAndExpectDebugElementByCss(
                            pDes[2],
                            'span.awg-source-description-content-item',
                            1,
                            1
                        );
                        const anchorDes = getAndExpectDebugElementByCss(contentItemDes[0], 'a', 1, 1);
                        const strongDes = getAndExpectDebugElementByCss(anchorDes[0], 'strong', 1, 1);
                        const strongEl = strongDes[0].nativeElement;

                        getAndExpectDebugElementByCss(
                            pDes[2],
                            'span.awg-source-description-content-item-description',
                            0,
                            0
                        );

                        expectToBe(strongEl.textContent.trim(), 'Test item 3 without description');
                    });
                });

                describe('... the content item folios', () => {
                    it('... should contain as many folio spans (content-item-folio) in item paragraphs as given content item folios', () => {
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const expectedFolioLength =
                            expectedSourceDescriptionListData.sources[1].description.content[0].folios.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );
                        getAndExpectDebugElementByCss(
                            pDes[0],
                            'span.awg-source-description-content-item-folio',
                            expectedFolioLength,
                            expectedFolioLength
                        );
                    });

                    it('... should have `tab` class on folio spans (content-item-folio) if content.item is given', () => {
                        // Get number of all content items of mockdata
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );

                        // Get length of folio array of 1st content item array of mockdata
                        const expectedFolioLength =
                            expectedSourceDescriptionListData.sources[1].description.content[0].folios.length;
                        const folioDes = getAndExpectDebugElementByCss(
                            pDes[0],
                            'span.awg-source-description-content-item-folio',
                            expectedFolioLength,
                            expectedFolioLength
                        );
                        const folioEl0 = folioDes[0].nativeElement;
                        const folioEl1 = folioDes[1].nativeElement;

                        expect(folioEl0).toHaveClass('tab');
                        expect(folioEl1).toHaveClass('tab');
                    });

                    it('... should have no tab class on folio spans (content-item-folio) if no content.item is given', () => {
                        // Get number of all content items of mockdata
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );

                        // Get length of folio array of 4th content item array of mockdata
                        const expectedFolioLength =
                            expectedSourceDescriptionListData.sources[1].description.content[3].folios.length;
                        const folioDes = getAndExpectDebugElementByCss(
                            pDes[3],
                            'span.awg-source-description-content-item-folio',
                            expectedFolioLength,
                            expectedFolioLength
                        );
                        const folioEl = folioDes[0].nativeElement;

                        expect(folioEl).not.toHaveClass('tab');
                    });

                    it('... should display the content-item-folio with anchor link if given', () => {
                        // Get number of all content items of mockdata
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );

                        // Get length of folio array of 1st content item array of mockdata
                        const expectedFolioLength =
                            expectedSourceDescriptionListData.sources[1].description.content[0].folios.length;
                        const folioDes = getAndExpectDebugElementByCss(
                            pDes[0],
                            'span.awg-source-description-content-item-folio',
                            expectedFolioLength,
                            expectedFolioLength
                        );

                        // Get first folio
                        const anchorDes = getAndExpectDebugElementByCss(folioDes[0], 'a', 1, 1);
                        const anchorEl0 = anchorDes[0].nativeElement;

                        // Process HTML expression of expected text content
                        const expectedHtmlTextContent = mockDocument.createElement('a');
                        expectedHtmlTextContent.innerHTML =
                            '<span>Bl.&nbsp;<span class="awg-source-description-content-item-folio-number">1<sup class="awg-source-description-content-item-folio-side">r</sup></span></span>';

                        expectToBe(anchorEl0.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                    });

                    it('... should display the content-item-folio without anchor link if not given', () => {
                        // Get number of all content items of mockdata
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );

                        // Get length of folio array of 1st content item array of mockdata
                        const expectedFolioLength =
                            expectedSourceDescriptionListData.sources[1].description.content[0].folios.length;
                        const folioDes = getAndExpectDebugElementByCss(
                            pDes[0],
                            'span.awg-source-description-content-item-folio',
                            expectedFolioLength,
                            expectedFolioLength
                        );
                        getAndExpectDebugElementByCss(folioDes[1], 'a', 0, 0);

                        // Get second folio
                        const folioEl1 = folioDes[1].nativeElement;

                        // Process HTML expression of expected text content
                        const expectedHtmlTextContent = mockDocument.createElement('a');
                        expectedHtmlTextContent.innerHTML =
                            '<span>Bl.&nbsp;<span class="awg-source-description-content-item-folio-number">29<sup class="awg-source-description-content-item-folio-side">v</sup></span></span>';

                        expectToBe(folioEl1.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                    });

                    it('... should display the content-item-folio as pages if given', () => {
                        // Get number of all content items of mockdata
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );

                        // Get length of folio array of 1st content item array of mockdata
                        const expectedFolioLength =
                            expectedSourceDescriptionListData.sources[1].description.content[0].folios.length;
                        const folioDes = getAndExpectDebugElementByCss(
                            pDes[0],
                            'span.awg-source-description-content-item-folio',
                            expectedFolioLength,
                            expectedFolioLength
                        );
                        getAndExpectDebugElementByCss(folioDes[1], 'a', 0, 0);

                        // Get third folio
                        const folioEl2 = folioDes[2].nativeElement;

                        // Process HTML expression of expected text content
                        const expectedHtmlTextContent = mockDocument.createElement('a');
                        expectedHtmlTextContent.innerHTML =
                            '<span>S.&nbsp;<span class="awg-source-description-content-item-folio-number">2</span></span>';

                        expectToBe(folioEl2.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                    });

                    it('... should display the content-item-folio with description if given', () => {
                        // Get number of all content items of mockdata
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );

                        // Get length of folio array of 4th content item array of mockdata
                        const expectedFolioLength =
                            expectedSourceDescriptionListData.sources[1].description.content[3].folios.length;
                        const folioDes = getAndExpectDebugElementByCss(
                            pDes[3],
                            'span.awg-source-description-content-item-folio',
                            expectedFolioLength,
                            expectedFolioLength
                        );
                        const folioEl = folioDes[0].nativeElement;

                        // Process HTML expression of expected text content
                        const expectedHtmlTextContent = mockDocument.createElement('a');
                        expectedHtmlTextContent.innerHTML =
                            '<span>Bl.&nbsp;<span class="awg-source-description-content-item-folio-number">2<sup class="awg-source-description-content-item-folio-side">v</sup></span></span><span class="awg-source-description-content-item-folio-description">&nbsp;&nbsp;Test item 4 without item</span>';

                        expectToBe(folioEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                    });
                });

                describe('... the content item systems', () => {
                    it('... should contain as many system spans (content-item-system) in content item folios as given systems', () => {
                        // Get number of all content items of mockdata
                        const expectedContent = expectedSourceDescriptionListData.sources[1].description.content;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContent.length,
                            expectedContent.length
                        );
                        pDes.forEach((pDe, pIndex) => {
                            // Get length of nested system groups array of all folios of 1st content item array of mockdata
                            const systemGroups = [];
                            expectedContent[pIndex].folios.forEach(folio => {
                                systemGroups.push(folio.systemGroups.flat());
                            });
                            const expectedSystems = systemGroups.flat();

                            getAndExpectDebugElementByCss(
                                pDe,
                                'span.awg-source-description-content-item-system',
                                expectedSystems.length,
                                expectedSystems.length
                            );
                        });
                    });

                    it('... should display the system labels', () => {
                        // Get number of all content items of mockdata
                        const expectedContent = expectedSourceDescriptionListData.sources[1].description.content;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContent.length,
                            expectedContent.length
                        );
                        pDes.forEach((pDe, pIndex) => {
                            // Get length of nested system groups array of all folios of 1st content item array of mockdata
                            const systemGroups = [];
                            expectedContent[pIndex].folios.forEach(folio => {
                                systemGroups.push(folio.systemGroups.flat());
                            });
                            const expectedSystems = systemGroups.flat();

                            const systemDes = getAndExpectDebugElementByCss(
                                pDe,
                                'span.awg-source-description-content-item-system',
                                expectedSystems.length,
                                expectedSystems.length
                            );
                            systemDes.forEach((system, index) => {
                                const systemEl = system.nativeElement;

                                const expectedHtmlTextContent = mockDocument.createElement('span');
                                expectedHtmlTextContent.innerHTML = `System&nbsp;${expectedSystems[index].system}`;

                                expectToBe(systemEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                            });
                        });
                    });

                    it('... should display the system description if given', () => {
                        // Get number of all content items of mockdata
                        const expectedContent = expectedSourceDescriptionListData.sources[1].description.content;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContent.length,
                            expectedContent.length
                        );
                        pDes.forEach((pDe, pIndex) => {
                            // Get length of nested system groups array of all folios of 1st content item array of mockdata
                            const systemGroups = [];
                            expectedContent[pIndex].folios.forEach(folio => {
                                systemGroups.push(folio.systemGroups.flat());
                            });
                            const expectedSystems = systemGroups.flat();
                            const expectedSystemDescriptions = expectedSystems.filter(
                                system => system.systemDescription !== undefined && system.systemDescription !== ''
                            );

                            const systemDescDes = getAndExpectDebugElementByCss(
                                pDe,
                                'span.awg-source-description-content-item-system-description',
                                expectedSystemDescriptions.length,
                                expectedSystemDescriptions.length
                            );
                            systemDescDes.forEach((systemDesc, index) => {
                                const systemDescEl = systemDesc.nativeElement;
                                const expectedSystemDescText = expectedSystemDescriptions[index].systemDescription;

                                expectToBe(systemDescEl.textContent.trim(), expectedSystemDescText);
                            });
                        });
                    });

                    it('... should display a colon after the systems if systemDescriptions, measures or rows are given, otherwise a dot.', () => {
                        // Get number of all content items of mockdata
                        const expectedContent = expectedSourceDescriptionListData.sources[1].description.content;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContent.length,
                            expectedContent.length
                        );
                        pDes.forEach((pDe, pIndex) => {
                            // Get length of nested system groups array of all folios of 1st content item array of mockdata
                            const systemGroups = [];
                            expectedContent[pIndex].folios.forEach(folio => {
                                systemGroups.push(folio.systemGroups.flat());
                            });
                            const expectedSystems = systemGroups.flat();

                            // Get the direct sibling spans of system spans
                            const spanDes = getAndExpectDebugElementByCss(
                                pDe,
                                'span.awg-source-description-content-item-system + span',
                                expectedSystems.length,
                                expectedSystems.length
                            );
                            spanDes.forEach((span, index) => {
                                const spanEl = span.nativeElement;
                                const expectedHtmlTextContent = mockDocument.createElement('span');

                                if (
                                    expectedSystems[index].systemDescription ||
                                    expectedSystems[index].measure ||
                                    expectedSystems[index].row
                                ) {
                                    expectedHtmlTextContent.innerHTML = `:&nbsp;`;
                                } else {
                                    expectedHtmlTextContent.innerHTML = `.`;
                                }

                                expectToBe(spanEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                            });
                        });
                    });

                    it('... should display measure numbers if given', () => {
                        // Get number of all content items of mockdata
                        const expectedContent = expectedSourceDescriptionListData.sources[1].description.content;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContent.length,
                            expectedContent.length
                        );
                        pDes.forEach((pDe, pIndex) => {
                            // Get length of nested system groups array of all folios of 1st content item array of mockdata
                            const systemGroups = [];
                            expectedContent[pIndex].folios.forEach(folio => {
                                systemGroups.push(folio.systemGroups.flat());
                            });
                            const expectedSystems = systemGroups.flat();
                            const expectedSystemMeasures = expectedSystems.filter(
                                system => system.measure !== undefined && system.measure !== ''
                            );
                            const systemMeasureDes = getAndExpectDebugElementByCss(
                                pDe,
                                'span.awg-source-description-content-item-measure',
                                expectedSystemMeasures.length,
                                expectedSystemMeasures.length
                            );
                            systemMeasureDes.forEach((systemMeasure, index) => {
                                const systemMeasureEl = systemMeasure.nativeElement;

                                const expectedHtmlTextContent = mockDocument.createElement('span');
                                expectedHtmlTextContent.innerHTML = `T.&nbsp;${expectedSystemMeasures[index].measure}`;

                                expectToBe(
                                    systemMeasureEl.textContent.trim(),
                                    expectedHtmlTextContent.textContent.trim()
                                );
                            });
                        });
                    });

                    it('... should have `singletab` class if the folio label length equals 1 and the system is not in the first systemGroup, and has measures', () => {
                        // Get number of all content items of mockdata
                        const expectedContent = expectedSourceDescriptionListData.sources[1].description.content;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContent.length,
                            expectedContent.length
                        );

                        // Get length of nested system groups array of all folios of 1st content item array of mockdata
                        const contentIndex = 0;
                        let expectedSystemLength = 0;
                        expectedContent[contentIndex].folios.forEach(folio => {
                            expectedSystemLength += folio.systemGroups.flat().length;
                        });

                        const systemDes = getAndExpectDebugElementByCss(
                            pDes[contentIndex],
                            'span.awg-source-description-content-item-system',
                            expectedSystemLength,
                            expectedSystemLength
                        );
                        const systemEl0 = systemDes[0].nativeElement;
                        const systemEl1 = systemDes[1].nativeElement;
                        const systemEl2 = systemDes[2].nativeElement;
                        const systemEl3 = systemDes[3].nativeElement;
                        const systemEl4 = systemDes[4].nativeElement;
                        const systemEl5 = systemDes[5].nativeElement;

                        // Bl. 1r
                        expect(systemEl0).not.toHaveClass('singletab');
                        expect(systemEl1).not.toHaveClass('singletab');

                        // Bl. 29v
                        expect(systemEl2).not.toHaveClass('singletab');
                        expect(systemEl3).not.toHaveClass('singletab');

                        // S. 2
                        expect(systemEl4).not.toHaveClass('singletab');
                        expect(systemEl5).toHaveClass('singletab');
                    });

                    it('... should have `doubletab` class if the folio label length equals 2 and the system is not in the first systemGroup, and has measures', () => {
                        // Get number of all content items of mockdata
                        const expectedContent = expectedSourceDescriptionListData.sources[1].description.content;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContent.length,
                            expectedContent.length
                        );

                        // Get length of nested system groups array of all folios of 1st content item array of mockdata
                        const contentIndex = 0;
                        let expectedSystemLength = 0;
                        expectedContent[contentIndex].folios.forEach(folio => {
                            expectedSystemLength += folio.systemGroups.flat().length;
                        });

                        const systemDes = getAndExpectDebugElementByCss(
                            pDes[contentIndex],
                            'span.awg-source-description-content-item-system',
                            expectedSystemLength,
                            expectedSystemLength
                        );
                        const systemEl0 = systemDes[0].nativeElement;
                        const systemEl1 = systemDes[1].nativeElement;
                        const systemEl2 = systemDes[2].nativeElement;
                        const systemEl3 = systemDes[3].nativeElement;
                        const systemEl4 = systemDes[4].nativeElement;
                        const systemEl5 = systemDes[5].nativeElement;

                        // Bl. 1r
                        expect(systemEl0).not.toHaveClass('doubletab');
                        expect(systemEl1).toHaveClass('doubletab');

                        // Bl. 29v
                        expect(systemEl2).not.toHaveClass('doubletab');
                        expect(systemEl3).not.toHaveClass('doubletab');

                        // S. 2
                        expect(systemEl4).not.toHaveClass('doubletab');
                        expect(systemEl5).not.toHaveClass('doubletab');
                    });

                    it('... should have `doubletab_extended` class if the folio label length is greater 2 and the system is not in the first systemGroup, and has measures', () => {
                        // Get number of all content items of mockdata
                        const expectedContent = expectedSourceDescriptionListData.sources[1].description.content;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContent.length,
                            expectedContent.length
                        );

                        // Get length of nested system groups array of all folios of 1st content item array of mockdata
                        const contentIndex = 0;
                        let expectedSystemLength = 0;
                        expectedContent[contentIndex].folios.forEach(folio => {
                            expectedSystemLength += folio.systemGroups.flat().length;
                        });

                        const systemDes = getAndExpectDebugElementByCss(
                            pDes[contentIndex],
                            'span.awg-source-description-content-item-system',
                            expectedSystemLength,
                            expectedSystemLength
                        );
                        const systemEl0 = systemDes[0].nativeElement;
                        const systemEl1 = systemDes[1].nativeElement;
                        const systemEl2 = systemDes[2].nativeElement;
                        const systemEl3 = systemDes[3].nativeElement;
                        const systemEl4 = systemDes[4].nativeElement;
                        const systemEl5 = systemDes[5].nativeElement;

                        // Bl. 1r
                        expect(systemEl0).not.toHaveClass('doubletab_extended');
                        expect(systemEl1).not.toHaveClass('doubletab_extended');

                        // Bl. 29v
                        expect(systemEl2).not.toHaveClass('doubletab_extended');
                        expect(systemEl3).toHaveClass('doubletab_extended');

                        // S. 2
                        expect(systemEl4).not.toHaveClass('doubletab_extended');
                        expect(systemEl5).not.toHaveClass('doubletab_extended');
                    });

                    it('... should have `tab` class if the system has rows and is not the first system', () => {
                        // Get number of all content items of mockdata
                        const expectedContent = expectedSourceDescriptionListData.sources[1].description.content;
                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContent.length,
                            expectedContent.length
                        );

                        // Get length of nested system groups array of all folios of 2nd content item array of mockdata
                        const contentIndex = 1;
                        let expectedSystemLength = 0;
                        expectedContent[contentIndex].folios.forEach(folio => {
                            expectedSystemLength += folio.systemGroups.flat().length;
                        });

                        const systemDes = getAndExpectDebugElementByCss(
                            pDes[contentIndex],
                            'span.awg-source-description-content-item-system',
                            expectedSystemLength,
                            expectedSystemLength
                        );
                        const systemEl0 = systemDes[0].nativeElement;
                        const systemEl1 = systemDes[1].nativeElement;
                        const systemEl2 = systemDes[2].nativeElement;
                        const systemEl3 = systemDes[3].nativeElement;
                        const systemEl4 = systemDes[4].nativeElement;
                        const systemEl5 = systemDes[5].nativeElement;
                        const systemEl6 = systemDes[6].nativeElement;
                        const systemEl7 = systemDes[7].nativeElement;
                        const systemEl8 = systemDes[8].nativeElement;
                        const systemEl9 = systemDes[9].nativeElement;
                        const systemEl10 = systemDes[10].nativeElement;
                        const systemEl11 = systemDes[11].nativeElement;

                        // Bl. 1r
                        expect(systemEl0).not.toHaveClass('tab');
                        expect(systemEl1).toHaveClass('tab');
                        expect(systemEl2).not.toHaveClass('tab');
                        expect(systemEl3).toHaveClass('tab');

                        // Bl. 29v
                        expect(systemEl4).not.toHaveClass('tab');
                        expect(systemEl5).toHaveClass('tab');
                        expect(systemEl6).not.toHaveClass('tab');
                        expect(systemEl7).toHaveClass('tab');

                        // S. 2
                        expect(systemEl8).not.toHaveClass('tab');
                        expect(systemEl9).toHaveClass('tab');
                        expect(systemEl10).not.toHaveClass('tab');
                        expect(systemEl11).toHaveClass('tab');
                    });

                    it('... should have `singletab` class if the system has rows, is first system, but not in the first systemGroup, and the folio length equals 1', () => {
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const expectedSystemLength = 12;

                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );
                        // Systems with measures
                        const systemDes = getAndExpectDebugElementByCss(
                            pDes[1],
                            'span.awg-source-description-content-item-system',
                            expectedSystemLength,
                            expectedSystemLength
                        );
                        const systemEl0 = systemDes[0].nativeElement;
                        const systemEl1 = systemDes[1].nativeElement;
                        const systemEl2 = systemDes[2].nativeElement;
                        const systemEl3 = systemDes[3].nativeElement;
                        const systemEl4 = systemDes[4].nativeElement;
                        const systemEl5 = systemDes[5].nativeElement;
                        const systemEl6 = systemDes[6].nativeElement;
                        const systemEl7 = systemDes[7].nativeElement;
                        const systemEl8 = systemDes[8].nativeElement;
                        const systemEl9 = systemDes[9].nativeElement;
                        const systemEl10 = systemDes[10].nativeElement;
                        const systemEl11 = systemDes[11].nativeElement;

                        // Bl. 1r
                        expect(systemEl0).not.toHaveClass('singletab');
                        expect(systemEl1).not.toHaveClass('singletab');
                        expect(systemEl2).not.toHaveClass('singletab');
                        expect(systemEl3).not.toHaveClass('singletab');

                        // Bl. 29v
                        expect(systemEl4).not.toHaveClass('singletab');
                        expect(systemEl5).not.toHaveClass('singletab');
                        expect(systemEl6).not.toHaveClass('singletab');
                        expect(systemEl7).not.toHaveClass('singletab');

                        // S. 2
                        expect(systemEl8).not.toHaveClass('singletab');
                        expect(systemEl9).not.toHaveClass('singletab');
                        expect(systemEl10).toHaveClass('singletab');
                        expect(systemEl11).not.toHaveClass('singletab');
                    });

                    it('... should have `doubletab` class if the system has rows, is first system, but not in the first systemGroup, and the folio length equals 2', () => {
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const expectedSystemLength = 12;

                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );
                        // Systems with measures
                        const systemDes = getAndExpectDebugElementByCss(
                            pDes[1],
                            'span.awg-source-description-content-item-system',
                            expectedSystemLength,
                            expectedSystemLength
                        );
                        const systemEl0 = systemDes[0].nativeElement;
                        const systemEl1 = systemDes[1].nativeElement;
                        const systemEl2 = systemDes[2].nativeElement;
                        const systemEl3 = systemDes[3].nativeElement;
                        const systemEl4 = systemDes[4].nativeElement;
                        const systemEl5 = systemDes[5].nativeElement;
                        const systemEl6 = systemDes[6].nativeElement;
                        const systemEl7 = systemDes[7].nativeElement;
                        const systemEl8 = systemDes[8].nativeElement;
                        const systemEl9 = systemDes[9].nativeElement;
                        const systemEl10 = systemDes[10].nativeElement;
                        const systemEl11 = systemDes[11].nativeElement;

                        // Bl. 1r
                        expect(systemEl0).not.toHaveClass('doubletab');
                        expect(systemEl1).not.toHaveClass('doubletab');
                        expect(systemEl2).toHaveClass('doubletab');
                        expect(systemEl3).not.toHaveClass('doubletab');

                        // Bl. 29v
                        expect(systemEl4).not.toHaveClass('doubletab');
                        expect(systemEl5).not.toHaveClass('doubletab');
                        expect(systemEl6).not.toHaveClass('doubletab');
                        expect(systemEl7).not.toHaveClass('doubletab');

                        // S. 2
                        expect(systemEl8).not.toHaveClass('doubletab');
                        expect(systemEl9).not.toHaveClass('doubletab');
                        expect(systemEl10).not.toHaveClass('doubletab');
                        expect(systemEl11).not.toHaveClass('doubletab');
                    });

                    it('... should have `doubletab_extended` class if the system has rows, is first system, but not in the first systemGroup, and the folio length is greater 2', () => {
                        const expectedContentLength =
                            expectedSourceDescriptionListData.sources[1].description.content.length;
                        const expectedSystemLength = 12;

                        const pDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-body > div.awg-source-description-content > p.half-para',
                            expectedContentLength,
                            expectedContentLength
                        );
                        // Systems with measures
                        const systemDes = getAndExpectDebugElementByCss(
                            pDes[1],
                            'span.awg-source-description-content-item-system',
                            expectedSystemLength,
                            expectedSystemLength
                        );
                        const systemEl0 = systemDes[0].nativeElement;
                        const systemEl1 = systemDes[1].nativeElement;
                        const systemEl2 = systemDes[2].nativeElement;
                        const systemEl3 = systemDes[3].nativeElement;
                        const systemEl4 = systemDes[4].nativeElement;
                        const systemEl5 = systemDes[5].nativeElement;
                        const systemEl6 = systemDes[6].nativeElement;
                        const systemEl7 = systemDes[7].nativeElement;

                        // Bl. 1r
                        expect(systemEl0).not.toHaveClass('doubletab_extended');
                        expect(systemEl1).not.toHaveClass('doubletab_extended');
                        expect(systemEl2).not.toHaveClass('doubletab_extended');
                        expect(systemEl3).not.toHaveClass('doubletab_extended');

                        // Bl. 29v
                        expect(systemEl4).not.toHaveClass('doubletab_extended');
                        expect(systemEl5).not.toHaveClass('doubletab_extended');
                        expect(systemEl6).toHaveClass('doubletab_extended');
                        expect(systemEl7).not.toHaveClass('doubletab_extended');
                    });
                });

                describe('... the corrections', () => {
                    it('... should contain SourceDescriptionCorrectionsComponent if corrections array is not empty', () => {
                        const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);

                        // First body has corrections
                        getAndExpectDebugElementByDirective(
                            bodyDes[0],
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should contain no SourceDescriptionCorrectionsComponent if corrections array is empty or undefined', () => {
                        const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);

                        // Second body has no corrections
                        getAndExpectDebugElementByDirective(
                            bodyDes[1],
                            SourceDescriptionCorrectionsStubComponent,
                            0,
                            0
                        );
                    });

                    it('... should pass down corrections data to SourceDescriptionCorrectionsComponent', () => {
                        const expectedCorrections =
                            expectedSourceDescriptionListData.sources[1].description.corrections;

                        const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                        // First body has corrections
                        const correctionsDes = getAndExpectDebugElementByDirective(
                            bodyDes[0],
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

            describe('... third description div', () => {
                it('... should contain a description-head div, and a description-body in div.card-body', () => {
                    const cardBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-list > div.awg-source-description > div.card-body',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    getAndExpectDebugElementByCss(cardBodyDes[2], 'div.awg-source-description-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[2], 'div.awg-source-description-body', 1, 1);
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
                    const pEl = pDes[0].nativeElement;

                    const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span', 4, 4);

                    // First span is opening bracket
                    // Last span is closing bracket
                    const siglumDes = spanDes[1];
                    const siglumEl = siglumDes.nativeElement;

                    const addendumDes = spanDes[2];
                    const addendumEl = addendumDes.nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-siglum-container');
                    expect(pEl).toHaveClass('bold');
                    expectToBe(pEl.textContent.trim(), `[${expectedSiglum}${expectedAddendum}]`);

                    expect(siglumEl).toHaveClass('awg-source-description-siglum');
                    expectToBe(siglumEl.textContent.trim(), expectedSiglum.trim());

                    expect(addendumEl).toHaveClass('awg-source-description-siglum-addendum');
                    expectToBe(addendumEl.textContent.trim(), expectedAddendum.trim());
                });

                it('... the second paragraph displaying the source type', () => {
                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        expectedSourceDescriptionListData.sources.length,
                        expectedSourceDescriptionListData.sources.length
                    );

                    const pDes = getAndExpectDebugElementByCss(descHeadDes[2], 'p', 3, 3);
                    const pEl = pDes[1].nativeElement;

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

                    const pEl = pDes[2].nativeElement;

                    expect(pEl).toHaveClass('awg-source-description-location');
                    expectToBe(pEl.textContent.trim(), expectedSourceDescriptionListData.sources[2].location.trim());
                });

                it('... should contain one paragraph in description-body div', () => {
                    // First description has no content, so only 2 divs
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);

                    // Get second description body div with content
                    getAndExpectDebugElementByCss(descBodyDes[1], 'div.awg-source-description-body > p', 1, 1);
                });

                it('... the one paragraph displaying the description', () => {
                    const descBodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    const pDes = getAndExpectDebugElementByCss(
                        descBodyDes[1],
                        'div.awg-source-description-body > p',
                        1,
                        1
                    );
                    const pEl = pDes[0].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML =
                        expectedSourceDescriptionListData.sources[2].description.desc[0];

                    expect(pEl).toHaveClass('awg-source-description-desc');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
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

        describe('#getWritingMaterialFirmSign()', () => {
            it('... should have a method `getWritingMaterialFirmSign`', () => {
                expect(component.getWritingMaterialFirmSign).toBeDefined();
            });

            it('... should return the correct firm sign when variant is provided and exists in firm sign data', () => {
                const variant = 'FIRM_JE_NO_2_LIN_12';

                const result = component.getWritingMaterialFirmSign(variant);

                expectToEqual(result, EDITION_FIRM_SIGNS_DATA[variant]);
            });

            it('... should return unknown firm sign when variant is provided but does not exist in firm sign data', () => {
                const variant = 'nonexistent';

                const result = component.getWritingMaterialFirmSign(variant);

                expectToEqual(result, { route: '', full: 'Not a known firm sign.', short: 'unknown' });
            });

            it('... should return unknown firm sign when variant is not provided', () => {
                let variant = null;

                const result1 = component.getWritingMaterialFirmSign(variant);

                expect(result1).toEqual({ route: '', full: 'Not a known firm sign.', short: 'unknown' });

                variant = undefined;

                const result2 = component.getWritingMaterialFirmSign(variant);

                expect(result2).toEqual({ route: '', full: 'Not a known firm sign.', short: 'unknown' });
            });
        });

        describe('#getWritingMaterialItemLocation()', () => {
            it('... should have a method `getWritingMaterialItemLocation`', () => {
                expect(component.getWritingMaterialItemLocation).toBeDefined();
            });

            describe('... should return empty string', () => {
                it('... if location is undefined', () => {
                    const location: SourceDescriptionWritingMaterialItemLocation = undefined;

                    const result = component.getWritingMaterialItemLocation(location);

                    expectToBe(result, '');
                });

                it('... if location is an empty object', () => {
                    const location: SourceDescriptionWritingMaterialItemLocation = {};

                    const result = component.getWritingMaterialItemLocation(location);

                    expectToBe(result, '');
                });

                it('... if folios are undefined', () => {
                    const location: SourceDescriptionWritingMaterialItemLocation = {
                        info: '',
                        folios: undefined,
                        position: 'unten links',
                    };
                    const result = component.getWritingMaterialItemLocation(location);
                    expectToBe(result, '');
                });

                it('... if folios array is empty', () => {
                    const location: SourceDescriptionWritingMaterialItemLocation = {
                        info: '',
                        folios: [],
                        position: 'oben links',
                    };
                    const result = component.getWritingMaterialItemLocation(location);
                    expectToBe(result, '');
                });
            });

            describe('... should return correct location string', () => {
                it('... for a single folio without position', () => {
                    const location: SourceDescriptionWritingMaterialItemLocation = {
                        info: '',
                        folios: ['1'],
                        position: '',
                    };

                    const result = component.getWritingMaterialItemLocation(location);

                    expectToBe(result, 'auf Bl. 1');
                });

                it('... for a single folio with position', () => {
                    const location: SourceDescriptionWritingMaterialItemLocation = {
                        info: '',
                        folios: ['1'],
                        position: 'oben links',
                    };

                    const result = component.getWritingMaterialItemLocation(location);

                    expectToBe(result, 'auf Bl. 1 oben links');
                });

                it('... for two folios', () => {
                    const location: SourceDescriptionWritingMaterialItemLocation = {
                        info: '',
                        folios: ['1', '2'],
                        position: 'unten links',
                    };
                    const result = component.getWritingMaterialItemLocation(location);
                    expectToBe(result, 'auf Bl. 1 und 2 unten links');
                });

                it('... for multiple folios', () => {
                    const location: SourceDescriptionWritingMaterialItemLocation = {
                        info: '',
                        folios: ['1', '2', '3'],
                        position: 'unten links',
                    };
                    const result = component.getWritingMaterialItemLocation(location);
                    expectToBe(result, 'auf Bl. 1, 2 und 3 unten links');
                });

                it('... for folios with r or v at the end', () => {
                    const location: SourceDescriptionWritingMaterialItemLocation = {
                        info: '',
                        folios: ['1r', '2v', '3'],
                        position: 'mittig',
                    };
                    const result = component.getWritingMaterialItemLocation(location);

                    expectToBe(result, 'auf Bl. 1<sup>r</sup>, 2<sup>v</sup> und 3 mittig');
                });

                it('... for folios with additional info', () => {
                    const location: SourceDescriptionWritingMaterialItemLocation = {
                        info: 'auf dem Kopf stehend',
                        folios: ['1', '2', '3'],
                        position: 'mittig',
                    };

                    const result = component.getWritingMaterialItemLocation(location);

                    expectToBe(result, 'auf dem Kopf stehend auf Bl. 1, 2 und 3 mittig');
                });
            });
        });

        describe('#getWritingMaterialFormat()', () => {
            it('... should have a method `getWritingMaterialFormat`', () => {
                expect(component.getWritingMaterialFormat).toBeDefined();
            });

            it('... should return format string without uncertainty', () => {
                const format: SourceDescriptionWritingMaterialFormat = {
                    orientation: 'hoch',
                    height: { value: '170', uncertainty: '' },
                    width: { value: '270', uncertainty: '' },
                };

                const result = component.getWritingMaterialFormat(format);

                expectToBe(result, 'Format: hoch 170 × 270 mm');
            });

            it('... should return format string with uncertainty', () => {
                const format: SourceDescriptionWritingMaterialFormat = {
                    orientation: 'hoch',
                    height: { value: '170', uncertainty: 'ca.' },
                    width: { value: '270–275', uncertainty: 'ca.' },
                };

                const result = component.getWritingMaterialFormat(format);

                expectToBe(result, 'Format: hoch ca. 170 × ca. 270–275 mm');
            });

            it('... should return format string with orientation `quer`', () => {
                const format: SourceDescriptionWritingMaterialFormat = {
                    orientation: 'quer',
                    height: { value: '170', uncertainty: '' },
                    width: { value: '270', uncertainty: '' },
                };

                const result = component.getWritingMaterialFormat(format);

                expectToBe(result, 'Format: quer 170 × 270 mm');
            });

            it('... should handle missing values gracefully', () => {
                const format: SourceDescriptionWritingMaterialFormat = {
                    orientation: 'hoch',
                    height: { value: '170', uncertainty: '' },
                    width: {},
                };

                const result = component.getWritingMaterialFormat(format);

                expectToBe(result, 'Format: hoch 170 ×  mm');
            });
        });

        describe('#getWritingMaterialSystems()', () => {
            it('... should have a method `getWritingMaterialSystems`', () => {
                expect(component.getWritingMaterialSystems).toBeDefined();
            });

            it('... should return correct systems string when info and addendum are undefined and system number is 1', () => {
                const systems: SourceDescriptionWritingMaterialSystems = {
                    number: 1,
                    info: undefined,
                    addendum: undefined,
                };

                const result = component.getWritingMaterialSystems(systems);

                expectToBe(result, '1 System');
            });

            it('... should return correct systems string when info and addendum are undefined and system number is bigger 1', () => {
                const systems: SourceDescriptionWritingMaterialSystems = {
                    number: 2,
                    info: undefined,
                    addendum: undefined,
                };

                const result = component.getWritingMaterialSystems(systems);

                expectToBe(result, '2 Systeme');
            });

            it('... should return correct systems string when info is given and addendum is undefined', () => {
                const systems: SourceDescriptionWritingMaterialSystems = {
                    number: 2,
                    info: 'info',
                    addendum: undefined,
                };

                const result = component.getWritingMaterialSystems(systems);

                expectToBe(result, '2 Systeme (info)');
            });

            it('... should return correct systems string when info is undefined and addendum is given', () => {
                const systems: SourceDescriptionWritingMaterialSystems = {
                    number: 3,
                    info: undefined,
                    addendum: 'addendum',
                };

                const result = component.getWritingMaterialSystems(systems);

                expectToBe(result, '3 Systeme, addendum');
            });

            it('... should return correct systems string when info and addendum are given', () => {
                const systems: SourceDescriptionWritingMaterialSystems = {
                    number: 4,
                    info: 'info',
                    addendum: 'addendum',
                };
                const result = component.getWritingMaterialSystems(systems);
                expectToBe(result, '4 Systeme (info), addendum');
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            describe('... should trigger', () => {
                it('... on click', fakeAsync(() => {
                    // Get description section
                    const descDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-desc', 2, 2);

                    const anchorDes = getAndExpectDebugElementByCss(descDes[1], 'a', 1, 1);

                    // Everything but first anchor uses modal
                    // Click on first anchor
                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(navigateToReportFragmentSpy, 1, {
                        complexId: '',
                        fragmentId: expectedReportFragment,
                    });
                }));

                describe('... on event from SourceDescriptionCorrectionsComponent (stubbed) if', () => {
                    it('... fragment id is undefined', () => {
                        const correctionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionCmp = correctionDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        correctionCmp.navigateToReportFragmentRequest.emit(undefined);

                        expectSpyCall(navigateToReportFragmentSpy, 1, undefined);
                    });

                    it('... fragment id is given', () => {
                        const correctionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionCmp = correctionDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                        correctionCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                        expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                    });
                });
            });

            describe('... should not emit anything if', () => {
                it('... paraemeter is undefined', () => {
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
                it('... on click', fakeAsync(() => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);
                    // Find description paragraphs
                    const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-description-desc', 1, 1);

                    // Find anchors in second description paragraph
                    const anchorDes = getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);

                    // Click on first anchor with modal call
                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(openModalSpy, 1, expectedModalSnippet);
                }));

                describe('... on event from SourceDescriptionCorrectionsComponent (stubbed) if', () => {
                    it('... fragment id is undefined', () => {
                        const correctionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionCmp = correctionDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        correctionCmp.openModalRequest.emit(undefined);

                        expectSpyCall(openModalSpy, 1, undefined);
                    });

                    it('... fragment id is given', () => {
                        const correctionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionCmp = correctionDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        correctionCmp.openModalRequest.emit(expectedModalSnippet);

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
                it('... on click', fakeAsync(() => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 2, 2);

                    // Find content item spans
                    const contentItemDes = getAndExpectDebugElementByCss(
                        divDes[0],
                        'span.awg-source-description-content-item',
                        3,
                        3
                    );

                    // Find anchors in second paragraph
                    const anchorDes = getAndExpectDebugElementByCss(contentItemDes[0], 'a', 1, 1);

                    // CLick on anchor (with selectSvgSheet call)
                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSheetId });
                }));

                describe('... on event from SourceDescriptionCorrectionsComponent (stubbed) if', () => {
                    it('... fragment id is undefined', () => {
                        const correctionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionCmp = correctionDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        correctionCmp.selectSvgSheetRequest.emit(undefined);

                        expectSpyCall(selectSvgSheetSpy, 1, undefined);
                    });

                    it('... fragment id is given', () => {
                        const correctionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionCorrectionsStubComponent,
                            1,
                            1
                        );
                        const correctionCmp = correctionDes[0].injector.get(
                            SourceDescriptionCorrectionsStubComponent
                        ) as SourceDescriptionCorrectionsStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };

                        correctionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

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
