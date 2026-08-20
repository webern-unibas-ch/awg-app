import { Component, DebugElement, DOCUMENT, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import {
    SourceDescription,
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
    contents: SourceDescriptionContent[] = [];
}
@Component({ selector: 'awg-source-description-corrections', template: '', standalone: false })
class SourceDescriptionCorrectionsStubComponent {
    @Input()
    corrections: Textcritics[] = [];
}

@Component({ selector: 'awg-source-description-details', template: '', standalone: false })
class SourceDescriptionDetailsStubComponent {
    @Input()
    details: string[] | undefined;
    @Input()
    detailsClass: string | undefined;
    @Input()
    detailsLabel: string | undefined;
}

@Component({ selector: 'awg-source-description-writing-materials', template: '', standalone: false })
class SourceDescriptionWritingMaterialsStubComponent {
    @Input()
    writingMaterials: SourceDescriptionWritingMaterial[] = [];
}

describe('SourceDescriptionComponent (DONE)', () => {
    let component: SourceDescriptionComponent;
    let fixture: ComponentFixture<SourceDescriptionComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedSourceDescriptionListData: SourceDescriptionList;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective],
            declarations: [
                SourceDescriptionComponent,
                SourceDescriptionContentsStubComponent,
                SourceDescriptionCorrectionsStubComponent,
                SourceDescriptionDetailsStubComponent,
                SourceDescriptionWritingMaterialsStubComponent,
                AbbrDirective,
                RouterLinkStubDirective,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedSourceDescriptionListData = structuredClone(mockEditionData.mockSourceDescriptionListData);

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescriptionComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have default `sourceDescriptionListData` input', () => {
            expectToBe(component.sourceDescriptionListData, null);
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
            component.sourceDescriptionListData = structuredClone(expectedSourceDescriptionListData);

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
                let cardBodyDes: DebugElement[];
                let paragraphDes: DebugElement[];
                let firstSourceDescription: SourceDescription;

                beforeEach(() => {
                    firstSourceDescription = expectedSourceDescriptionListData.sources[0];
                    const totalSources = expectedSourceDescriptionListData.sources.length;

                    cardBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-list > div.awg-source-description > div.card-body',
                        totalSources,
                        totalSources
                    );

                    const descHeadDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-head',
                        totalSources,
                        totalSources
                    );

                    paragraphDes = getAndExpectDebugElementByCss(descHeadDes[0], 'p', 3, 3);
                });

                it('... should contain a description-head div, but no physDesc in div.card-body', () => {
                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-description-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-description-phys-desc', 0, 0);
                });

                it('... should contain 3 paragraphs in first description-head div', () => {
                    expectToBe(paragraphDes.length, 3);
                });

                describe('... the first paragraph', () => {
                    it('... should display a siglum (bold) without an addendum', () => {
                        const expectedSiglum = firstSourceDescription.siglum;
                        const pEl: HTMLParagraphElement = paragraphDes[0].nativeElement;

                        const spanDes = getAndExpectDebugElementByCss(paragraphDes[0], 'span', 1, 1);
                        const siglumSpanEl: HTMLSpanElement = spanDes[0].nativeElement;

                        expectToContain(pEl.classList, 'awg-source-description-siglum-container');
                        expectToContain(pEl.classList, 'bold');
                        expectToBe(pEl.textContent.trim(), expectedSiglum.trim());

                        expectToContain(siglumSpanEl.classList, 'awg-source-description-siglum');
                        expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                    });
                });

                describe('... the second paragraph', () => {
                    it('... should have one CompileHtmlDirective', () => {
                        const directiveIns = paragraphDes[1].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                        expect(directiveIns).toBeTruthy();
                    });

                    it('... should pass down the source type to the CompileHtmlDirective', () => {
                        const directiveIns = paragraphDes[1].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                        expectToBe(directiveIns.htmlContent(), firstSourceDescription.type);
                    });

                    it('... should display the source type', () => {
                        const pEl: HTMLParagraphElement = paragraphDes[1].nativeElement;

                        expectToContain(pEl.classList, 'awg-source-description-type');
                        expectToBe(pEl.textContent.trim(), firstSourceDescription.type.trim());
                    });
                });

                describe('... the third paragraph', () => {
                    it('... should have one AbbrDirective', () => {
                        const directiveIns = paragraphDes[2].injector.get(AbbrDirective) as AbbrDirective;
                        expect(directiveIns).toBeTruthy();
                    });

                    it('... should pass down the source location to the AbbrDirective', () => {
                        const directiveIns = paragraphDes[2].injector.get(AbbrDirective) as AbbrDirective;

                        expectToBe(directiveIns.text, firstSourceDescription.location);
                    });

                    it('... should display the source location', () => {
                        const pEl: HTMLParagraphElement = paragraphDes[2].nativeElement;

                        expectToContain(pEl.classList, 'awg-source-description-location');
                        expectToBe(pEl.textContent.trim(), firstSourceDescription.location.trim());
                    });
                });
            });

            describe('... second description div (all possible physDesc entries, with only writing material string)', () => {
                describe('... the description-head', () => {
                    let cardBodyDes: DebugElement[];
                    let paragraphDes: DebugElement[];
                    let secondSourceDescription: SourceDescription;

                    beforeEach(() => {
                        secondSourceDescription = expectedSourceDescriptionListData.sources[1];
                        const totalSources = expectedSourceDescriptionListData.sources.length;

                        cardBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-list > div.awg-source-description > div.card-body',
                            totalSources,
                            totalSources
                        );

                        const descHeadDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-head',
                            totalSources,
                            totalSources
                        );

                        paragraphDes = getAndExpectDebugElementByCss(descHeadDes[1], 'p', 2, 2);
                    });
                    it('... should contain a description-head div, and a physDesc in div.card-body', () => {
                        getAndExpectDebugElementByCss(cardBodyDes[1], 'div.awg-source-description-head', 1, 1);
                        getAndExpectDebugElementByCss(cardBodyDes[1], 'div.awg-source-description-phys-desc', 1, 1);
                    });

                    it('... should contain 2 paragraphs in second description-head div', () => {
                        expectToBe(paragraphDes.length, 2);
                    });

                    describe('... the first paragraph', () => {
                        it('... should display a siglum (bold) with addendum', () => {
                            const expectedSiglum = expectedSourceDescriptionListData.sources[1].siglum;
                            const expectedAddendum = expectedSourceDescriptionListData.sources[1].siglumAddendum ?? '';

                            const pEl: HTMLParagraphElement = paragraphDes[0].nativeElement;

                            const spanDes = getAndExpectDebugElementByCss(paragraphDes[0], 'span', 2, 2);
                            const siglumSpanDes = spanDes[0];
                            const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;

                            const addendumSpanDes = spanDes[1];
                            const addendumSpanEl: HTMLSpanElement = addendumSpanDes.nativeElement;

                            expectToContain(pEl.classList, 'awg-source-description-siglum-container');
                            expectToContain(pEl.classList, 'bold');
                            expectToBe(pEl.textContent.trim(), expectedSiglum.trim() + expectedAddendum.trim());

                            expectToContain(siglumSpanEl.classList, 'awg-source-description-siglum');
                            expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());

                            expectToContain(addendumSpanEl.classList, 'awg-source-description-siglum-addendum');
                            expectToBe(addendumSpanEl.textContent.trim(), expectedAddendum.trim());
                        });
                    });

                    describe('... the second paragraph', () => {
                        it('... should have one AbbrDirective', () => {
                            const directiveIns = paragraphDes[1].injector.get(AbbrDirective) as AbbrDirective;
                            expect(directiveIns).toBeTruthy();
                        });

                        it('... should pass down the source location to the AbbrDirective', () => {
                            const directiveIns = paragraphDes[1].injector.get(AbbrDirective) as AbbrDirective;
                            expectToBe(directiveIns.text, secondSourceDescription.location);
                        });

                        it('... should display the source location', () => {
                            const pEl: HTMLParagraphElement = paragraphDes[1].nativeElement;

                            expectToContain(pEl.classList, 'awg-source-description-location');
                            expectToBe(pEl.textContent.trim(), secondSourceDescription.location.trim());
                        });
                    });
                });

                describe('... the physDesc', () => {
                    it('... should contain up to 8 details components (stubbed) in physDesc div', () => {
                        // First description has no content, so only 2 divs
                        const physDescDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-source-description-phys-desc',
                            2,
                            2
                        );

                        getAndExpectDebugElementByDirective(
                            physDescDes[0],
                            SourceDescriptionDetailsStubComponent,
                            8,
                            8
                        );
                    });

                    it('... should pass down the conditions to the first details component', () => {
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

                        expectToEqual(
                            detailCmp.details,
                            expectedSourceDescriptionListData.sources[1].physDesc.conditions
                        );
                        expectToBe(detailCmp.detailsLabel, '');
                        expectToBe(detailCmp.detailsClass, 'conditions');
                    });

                    describe('... the writing materials', () => {
                        it('... should pass down the writingMaterials to the second details component', () => {
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
                    });

                    describe('... the writing instruments', () => {
                        let paragraphDes: DebugElement[];
                        let expectedInstrumentsData: SourceDescriptionWritingInstruments;

                        beforeEach(() => {
                            const instruments =
                                expectedSourceDescriptionListData.sources[1].physDesc.writingInstruments;

                            if (!instruments) {
                                throw new Error('Expected writingInstruments to be defined.');
                            }

                            expectedInstrumentsData = instruments;

                            const physDescDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-source-description-phys-desc',
                                2,
                                2
                            );

                            paragraphDes = getAndExpectDebugElementByCss(
                                physDescDes[0],
                                'p.awg-source-description-writing-instruments',
                                1,
                                1
                            );
                        });

                        it('... should contain one paragraph in physDesc div', () => {
                            expectToBe(paragraphDes.length, 1);
                        });

                        it('... should display the label in the first span of the paragraph', () => {
                            const spanDes = getAndExpectDebugElementByCss(paragraphDes[0], 'span', 2, 2);
                            const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                            expectToBe(spanEl.textContent.trim(), 'Schreibstoff:');
                        });

                        it('... should have one CompileHtmlDirective in the writing instruments paragraph', () => {
                            getAndExpectDebugElementByDirective(paragraphDes[0], CompileHtmlDirective, 1, 1);
                        });

                        it('... should pass down the formatted instruments string to the CompileHtmlDirective', () => {
                            const directiveDes = getAndExpectDebugElementByDirective(
                                paragraphDes[0],
                                CompileHtmlDirective,
                                1,
                                1
                            );
                            const directiveIns = directiveDes[0].injector.get(
                                CompileHtmlDirective
                            ) as CompileHtmlDirective;

                            const expectedHtmlContent = component.getWritingInstruments(expectedInstrumentsData);

                            expectToBe(directiveIns.htmlContent(), expectedHtmlContent);
                        });

                        it('... should display the writingInstruments in the second span of the paragraph', () => {
                            const spanDes = getAndExpectDebugElementByCss(paragraphDes[0], 'span', 2, 2);
                            const spanEl: HTMLSpanElement = spanDes[1].nativeElement;

                            const secondaryInstruments = expectedInstrumentsData.secondary ?? [];
                            const secondaryString =
                                secondaryInstruments.length > 0 ? '; ' + secondaryInstruments.join(', ') : '';

                            // Process HTML expression of expected text content
                            const expectedHtmlTextContent = mockDocument.createElement('p');
                            expectedHtmlTextContent.innerHTML =
                                '<span>' + expectedInstrumentsData.main + secondaryString + '.</span>';

                            expectToBe(spanEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                        });
                    });

                    it('... should pass down the titles to the third details component', () => {
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

                    it('... should pass down the dates to the fourth details component', () => {
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

                    it('... should pass down the paginations to the fifth details component', () => {
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

                        expectToEqual(
                            detailCmp.details,
                            expectedSourceDescriptionListData.sources[1].physDesc.paginations
                        );
                        expectToBe(detailCmp.detailsLabel, 'Paginierung');
                        expectToBe(detailCmp.detailsClass, 'paginations');
                    });

                    it('... should pass down the measureNumbers to the sixth details component', () => {
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

                    it('... should pass down the instrumentations to the seventh details component', () => {
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

                    it('... should pass down the annotations to the eighth details component', () => {
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

                        expectToEqual(
                            detailCmp.details,
                            expectedSourceDescriptionListData.sources[1].physDesc.annotations
                        );
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
                            const expectedCorrections =
                                expectedSourceDescriptionListData.sources[1].physDesc.corrections;

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
                    const expectedAddendum = expectedSourceDescriptionListData.sources[2].siglumAddendum ?? '';

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

                    expectToContain(pEl.classList, 'awg-source-description-siglum-container');
                    expectToContain(pEl.classList, 'bold');
                    expectToBe(pEl.textContent.trim(), `[${expectedSiglum}${expectedAddendum}]`);

                    expectToContain(siglumSpanEl.classList, 'awg-source-description-siglum');
                    expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());

                    expectToContain(addendumSpanEl.classList, 'awg-source-description-siglum-addendum');
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

                    expectToContain(pEl.classList, 'awg-source-description-type');
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

                    expectToContain(pEl.classList, 'awg-source-description-location');
                    expectToBe(pEl.textContent.trim(), expectedSourceDescriptionListData.sources[2].location.trim());
                });

                it('... should contain one details component (stubbed) in physDesc div', () => {
                    // First physDesc has no content, so only 2 divs
                    const physDescDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-phys-desc',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(physDescDes[1], SourceDescriptionDetailsStubComponent, 1, 1);
                });

                it('... should pass down the conditions to the details component', () => {
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

        describe('METHODS', () => {
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
        });
    });
});
