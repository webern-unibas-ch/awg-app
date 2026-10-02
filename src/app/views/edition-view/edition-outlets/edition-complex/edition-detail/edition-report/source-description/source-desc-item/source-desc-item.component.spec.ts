import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import {
    SourceDescription,
    SourceDescriptionWritingInstruments,
} from '@awg-views/edition-view/models/source-description.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { SourceDescContentsComponent } from '../source-desc-contents/source-desc-contents.component';
import { SourceDescCorrectionsComponent } from '../source-desc-corrections/source-desc-corrections.component';
import { SourceDescDetailsComponent } from '../source-desc-details/source-desc-details.component';
import { SourceDescWritingMaterialsComponent } from '../source-desc-writing-materials/source-desc-writing-materials.component';
import { SourceDescItemComponent } from './source-desc-item.component';

describe('SourceDescItemComponent', () => {
    let component: SourceDescItemComponent;
    let fixture: ComponentFixture<SourceDescItemComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockNavigationService: Partial<EditionNavigationService>;

    let expectedSourceWithoutPhysDesc: SourceDescription;
    let expectedSourceWithAllEntries: SourceDescription;
    let expectedSourceWithWritingMaterials: SourceDescription;

    /**
     * Helper: getPhysDescDe.
     *
     * It returns the single physDesc div of the rendered source description.
     */
    const getPhysDescDe = (): DebugElement =>
        getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-phys-desc', 1, 1)[0];

    /**
     * Helper: getHeadParagraphDes.
     *
     * It returns the paragraphs of the description head.
     */
    const getHeadParagraphDes = (expectedCount: number): DebugElement[] => {
        const headDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-head', 1, 1);
        return getAndExpectDebugElementByCss(headDes[0], 'p', expectedCount, expectedCount);
    };

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [
                AbbrDirective,
                CompileHtmlDirective,
                SourceDescContentsComponent,
                SourceDescCorrectionsComponent,
                SourceDescDetailsComponent,
                SourceDescItemComponent,
                SourceDescWritingMaterialsComponent,
            ],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        const sources = structuredClone(mockEditionData.mockSourceDescListData).sources;
        expectedSourceWithoutPhysDesc = sources[0]; // No physDesc entries
        expectedSourceWithAllEntries = sources[1]; // All possible physDesc entries, with only writing material strings
        expectedSourceWithWritingMaterials = sources[2]; // Only conditions and writing materials in physDesc

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescItemComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `sourceDescription`', () => {
            expectToBe(isSignal(component.sourceDescription), true);

            expect(() => component.sourceDescription()).toThrow();
        });

        it.each(['physDesc', 'hasPhysDesc', 'writingInstruments'] as const)(
            '... should throw when accessing computed signal `%s` due to missing input',
            signalName => {
                expectToBe(isSignal(component[signalName]), true);

                expect(() => component[signalName]()).toThrow();
            }
        );

        describe('VIEW', () => {
            it('... should contain the card body with a description head, but no content yet', () => {
                const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const headDes = getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-head', 1, 1);

                getAndExpectDebugElementByCss(headDes[0], 'p', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('sourceDescription', expectedSourceWithAllEntries);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `sourceDescription` to hold the provided source description', () => {
            expectToEqual(component.sourceDescription(), expectedSourceWithAllEntries);
        });

        it('... should have computed signal `physDesc` to hold the physical description', () => {
            expectToEqual(component.physDesc(), expectedSourceWithAllEntries.physDesc);
        });

        it('... should have computed signal `hasPhysDesc` to hold true', () => {
            expectToBe(component.hasPhysDesc(), true);
        });

        it('... should have recomputed signal `hasPhysDesc` to hold false if physDesc is empty', () => {
            fixture.componentRef.setInput('sourceDescription', expectedSourceWithoutPhysDesc);

            expectToBe(component.hasPhysDesc(), false);
        });

        it('... should have computed signal `writingInstruments` to hold the formatted writing instruments', () => {
            expectToBe(
                component.writingInstruments(),
                component.getWritingInstruments(expectedSourceWithAllEntries.physDesc.writingInstruments)
            );
        });

        describe('... should have recomputed signal `writingInstruments` to hold an empty string if', () => {
            it.each([
                { desc: 'main writing instrument is missing', writingInstruments: { secondary: ['secondary1'] } },
                { desc: 'writing instruments are undefined', writingInstruments: undefined },
                { desc: 'physDesc is empty', writingInstruments: 'emptyPhysDesc' as const },
            ])('... $desc', ({ writingInstruments }) => {
                const physDesc =
                    writingInstruments === 'emptyPhysDesc'
                        ? {}
                        : { ...expectedSourceWithAllEntries.physDesc, writingInstruments };
                fixture.componentRef.setInput('sourceDescription', { ...expectedSourceWithAllEntries, physDesc });

                expectToBe(component.writingInstruments(), '');
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
            });

            describe('... with a source without physDesc entries', () => {
                let paragraphDes: DebugElement[];

                beforeEach(async () => {
                    fixture.componentRef.setInput('sourceDescription', expectedSourceWithoutPhysDesc);
                    await detectChangesOnPush(fixture);

                    paragraphDes = getHeadParagraphDes(3);
                });

                it('... should contain a description-head div, but no physDesc in div.card-body', () => {
                    const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-phys-desc', 0, 0);
                });

                describe('... the first paragraph', () => {
                    it('... should display a siglum (bold) without an addendum', () => {
                        const expectedSiglum = expectedSourceWithoutPhysDesc.siglum;
                        const pEl: HTMLParagraphElement = paragraphDes[0].nativeElement;

                        const spanDes = getAndExpectDebugElementByCss(paragraphDes[0], 'span', 1, 1);
                        const siglumSpanEl: HTMLSpanElement = spanDes[0].nativeElement;

                        expectToContain(pEl.classList, 'awg-source-desc-siglum-container');
                        expectToContain(pEl.classList, 'bold');
                        expectToBe(pEl.textContent.trim(), expectedSiglum.trim());

                        expectToContain(siglumSpanEl.classList, 'awg-source-desc-siglum');
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

                        expectToBe(directiveIns.htmlContent(), expectedSourceWithoutPhysDesc.type);
                    });

                    it('... should display the source type', () => {
                        const pEl: HTMLParagraphElement = paragraphDes[1].nativeElement;

                        expectToContain(pEl.classList, 'awg-source-desc-type');
                        expectToBe(pEl.textContent.trim(), expectedSourceWithoutPhysDesc.type.trim());
                    });
                });

                describe('... the third paragraph', () => {
                    it('... should have one AbbrDirective', () => {
                        const directiveIns = paragraphDes[2].injector.get(AbbrDirective) as AbbrDirective;

                        expect(directiveIns).toBeTruthy();
                    });

                    it('... should pass down the source location to the AbbrDirective', () => {
                        const directiveIns = paragraphDes[2].injector.get(AbbrDirective) as AbbrDirective;

                        expectToBe(directiveIns.text(), expectedSourceWithoutPhysDesc.location);
                    });

                    it('... should display the source location', () => {
                        const pEl: HTMLParagraphElement = paragraphDes[2].nativeElement;

                        expectToContain(pEl.classList, 'awg-source-desc-location');
                        expectToBe(pEl.textContent.trim(), expectedSourceWithoutPhysDesc.location.trim());
                    });
                });
            });

            describe('... with a source with all possible physDesc entries (only writing material strings)', () => {
                describe('... the description-head', () => {
                    let paragraphDes: DebugElement[];

                    beforeEach(() => {
                        paragraphDes = getHeadParagraphDes(2);
                    });

                    it('... should contain a description-head div, and a physDesc in div.card-body', () => {
                        const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                        getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-head', 1, 1);
                        getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-phys-desc', 1, 1);
                    });

                    describe('... the first paragraph', () => {
                        it('... should display a siglum (bold) with addendum', () => {
                            const expectedSiglum = expectedSourceWithAllEntries.siglum;
                            const expectedAddendum = expectedSourceWithAllEntries.siglumAddendum ?? '';

                            const pEl: HTMLParagraphElement = paragraphDes[0].nativeElement;

                            const spanDes = getAndExpectDebugElementByCss(paragraphDes[0], 'span', 2, 2);
                            const siglumSpanEl: HTMLSpanElement = spanDes[0].nativeElement;
                            const addendumSpanEl: HTMLSpanElement = spanDes[1].nativeElement;

                            expectToContain(pEl.classList, 'awg-source-desc-siglum-container');
                            expectToContain(pEl.classList, 'bold');
                            expectToBe(pEl.textContent.trim(), expectedSiglum.trim() + expectedAddendum.trim());

                            expectToContain(siglumSpanEl.classList, 'awg-source-desc-siglum');
                            expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());

                            expectToContain(addendumSpanEl.classList, 'awg-source-desc-siglum-addendum');
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

                            expectToBe(directiveIns.text(), expectedSourceWithAllEntries.location);
                        });

                        it('... should display the source location', () => {
                            const pEl: HTMLParagraphElement = paragraphDes[1].nativeElement;

                            expectToContain(pEl.classList, 'awg-source-desc-location');
                            expectToBe(pEl.textContent.trim(), expectedSourceWithAllEntries.location.trim());
                        });
                    });
                });

                describe('... the physDesc', () => {
                    it('... should contain 8 details components (stubbed) in physDesc div', () => {
                        getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescDetailsComponent, 8, 8);
                    });

                    describe('... should pass down the correct values to the details components:', () => {
                        it.each([
                            { desc: 'conditions', index: 0, key: 'conditions', label: '', cssClass: 'conditions' },
                            {
                                desc: 'writingMaterialStrings',
                                index: 1,
                                key: 'writingMaterialStrings',
                                label: 'Beschreibstoff',
                                cssClass: 'writing-materials',
                            },
                            { desc: 'titles', index: 2, key: 'titles', label: 'Titel', cssClass: 'titles' },
                            { desc: 'dates', index: 3, key: 'dates', label: 'Datierung', cssClass: 'dates' },
                            {
                                desc: 'paginations',
                                index: 4,
                                key: 'paginations',
                                label: 'Paginierung',
                                cssClass: 'paginations',
                            },
                            {
                                desc: 'measureNumbers',
                                index: 5,
                                key: 'measureNumbers',
                                label: 'Taktzahlen',
                                cssClass: 'measure-numbers',
                            },
                            {
                                desc: 'instrumentations',
                                index: 6,
                                key: 'instrumentations',
                                label: 'Instrumentenvorsatz',
                                cssClass: 'instrumentations',
                            },
                            {
                                desc: 'annotations',
                                index: 7,
                                key: 'annotations',
                                label: 'Eintragungen',
                                cssClass: 'annotations',
                            },
                        ] as const)('... $desc', ({ index, key, label, cssClass }) => {
                            const detailDes = getAndExpectDebugElementByDirective(
                                getPhysDescDe(),
                                SourceDescDetailsComponent,
                                8,
                                8
                            );
                            const detailCmp = detailDes[index].injector.get(SourceDescDetailsComponent);

                            expectToEqual(detailCmp.details(), expectedSourceWithAllEntries.physDesc[key]);
                            expectToBe(detailCmp.detailsLabel(), label);
                            expectToBe(detailCmp.detailsClass(), cssClass);
                        });
                    });

                    it('... should contain no SourceDescWritingMaterialsComponent if writing materials array is empty', () => {
                        getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescWritingMaterialsComponent, 0, 0);
                    });

                    describe('... the writing instruments', () => {
                        let paragraphDes: DebugElement[];
                        let expectedInstrumentsData: SourceDescriptionWritingInstruments;

                        beforeEach(() => {
                            const instruments = expectedSourceWithAllEntries.physDesc.writingInstruments;

                            if (!instruments) {
                                expect.fail('Expected writingInstruments to be defined.');
                            }

                            expectedInstrumentsData = instruments;

                            paragraphDes = getAndExpectDebugElementByCss(
                                getPhysDescDe(),
                                'p.awg-source-desc-writing-instruments',
                                1,
                                1
                            );
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

                            expectToBe(
                                directiveIns.htmlContent(),
                                component.getWritingInstruments(expectedInstrumentsData)
                            );
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

                        it('... should contain no writing instruments paragraph if main writing instrument is missing', async () => {
                            fixture.componentRef.setInput('sourceDescription', {
                                ...expectedSourceWithAllEntries,
                                physDesc: {
                                    ...expectedSourceWithAllEntries.physDesc,
                                    writingInstruments: { secondary: ['secondary1'] },
                                },
                            });
                            await detectChangesOnPush(fixture);

                            getAndExpectDebugElementByCss(
                                getPhysDescDe(),
                                'p.awg-source-desc-writing-instruments',
                                0,
                                0
                            );
                        });
                    });

                    describe('... the contents', () => {
                        it('... should contain SourceDescContentsComponent if contents array is not empty', () => {
                            getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescContentsComponent, 1, 1);
                        });

                        it('... should pass down contents data to SourceDescContentsComponent', () => {
                            const contentsDes = getAndExpectDebugElementByDirective(
                                getPhysDescDe(),
                                SourceDescContentsComponent,
                                1,
                                1
                            );
                            const contentsCmp = contentsDes[0].injector.get(SourceDescContentsComponent);

                            expectToEqual(contentsCmp.contents(), expectedSourceWithAllEntries.physDesc.contents);
                        });

                        it('... should contain no SourceDescContentsComponent if contents array is empty or undefined', async () => {
                            fixture.componentRef.setInput('sourceDescription', expectedSourceWithWritingMaterials);
                            await detectChangesOnPush(fixture);

                            getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescContentsComponent, 0, 0);
                        });
                    });

                    describe('... the corrections', () => {
                        it('... should contain SourceDescCorrectionsComponent if corrections array is not empty', () => {
                            getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescCorrectionsComponent, 1, 1);
                        });

                        it('... should pass down corrections data to SourceDescCorrectionsComponent', () => {
                            const correctionsDes = getAndExpectDebugElementByDirective(
                                getPhysDescDe(),
                                SourceDescCorrectionsComponent,
                                1,
                                1
                            );
                            const correctionsCmp = correctionsDes[0].injector.get(SourceDescCorrectionsComponent);

                            expectToEqual(
                                correctionsCmp.corrections(),
                                expectedSourceWithAllEntries.physDesc.corrections
                            );
                        });

                        it('... should contain no SourceDescCorrectionsComponent if corrections array is empty or undefined', async () => {
                            fixture.componentRef.setInput('sourceDescription', expectedSourceWithWritingMaterials);
                            await detectChangesOnPush(fixture);

                            getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescCorrectionsComponent, 0, 0);
                        });
                    });
                });
            });

            describe('... with a source with only conditions and writing materials in physDesc', () => {
                let paragraphDes: DebugElement[];

                beforeEach(async () => {
                    fixture.componentRef.setInput('sourceDescription', expectedSourceWithWritingMaterials);
                    await detectChangesOnPush(fixture);

                    paragraphDes = getHeadParagraphDes(3);
                });

                it('... should contain a description-head div, and a physDesc in div.card-body', () => {
                    const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-phys-desc', 1, 1);
                });

                it('... the first paragraph displaying a siglum (bold) with addendum and brackets (missing)', () => {
                    const expectedSiglum = expectedSourceWithWritingMaterials.siglum;
                    const expectedAddendum = expectedSourceWithWritingMaterials.siglumAddendum ?? '';

                    const pEl: HTMLParagraphElement = paragraphDes[0].nativeElement;

                    const spanDes = getAndExpectDebugElementByCss(paragraphDes[0], 'span', 4, 4);

                    // First span is opening bracket, last span is closing bracket
                    const siglumSpanEl: HTMLSpanElement = spanDes[1].nativeElement;
                    const addendumSpanEl: HTMLSpanElement = spanDes[2].nativeElement;

                    expectToContain(pEl.classList, 'awg-source-desc-siglum-container');
                    expectToContain(pEl.classList, 'bold');
                    expectToBe(pEl.textContent.trim(), `[${expectedSiglum}${expectedAddendum}]`);

                    expectToContain(siglumSpanEl.classList, 'awg-source-desc-siglum');
                    expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());

                    expectToContain(addendumSpanEl.classList, 'awg-source-desc-siglum-addendum');
                    expectToBe(addendumSpanEl.textContent.trim(), expectedAddendum.trim());
                });

                it('... the second paragraph displaying the source type', () => {
                    const pEl: HTMLParagraphElement = paragraphDes[1].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML = expectedSourceWithWritingMaterials.type;

                    expectToContain(pEl.classList, 'awg-source-desc-type');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });

                it('... the third paragraph displaying the source location', () => {
                    const pEl: HTMLParagraphElement = paragraphDes[2].nativeElement;

                    expectToContain(pEl.classList, 'awg-source-desc-location');
                    expectToBe(pEl.textContent.trim(), expectedSourceWithWritingMaterials.location.trim());
                });

                it('... should contain one details component (stubbed) in physDesc div', () => {
                    getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescDetailsComponent, 1, 1);
                });

                it('... should pass down the conditions to the details component', () => {
                    const detailDes = getAndExpectDebugElementByDirective(
                        getPhysDescDe(),
                        SourceDescDetailsComponent,
                        1,
                        1
                    );
                    const detailCmp = detailDes[0].injector.get(SourceDescDetailsComponent);

                    expectToEqual(detailCmp.details(), expectedSourceWithWritingMaterials.physDesc.conditions);
                    expectToBe(detailCmp.detailsLabel(), '');
                    expectToBe(detailCmp.detailsClass(), 'conditions');
                });

                describe('... the writing materials', () => {
                    it('... should contain one SourceDescWritingMaterialsComponent if writing materials array is not empty', () => {
                        getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescWritingMaterialsComponent, 1, 1);
                    });

                    it('... should pass down the writingMaterials to the writing materials component', () => {
                        const writingMaterialsDes = getAndExpectDebugElementByDirective(
                            getPhysDescDe(),
                            SourceDescWritingMaterialsComponent,
                            1,
                            1
                        );
                        const writingMaterialsCmp = writingMaterialsDes[0].injector.get(
                            SourceDescWritingMaterialsComponent
                        );

                        expectToEqual(
                            writingMaterialsCmp.writingMaterials(),
                            expectedSourceWithWritingMaterials.physDesc.writingMaterials
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

                it.each([
                    {
                        desc: 'an empty string if writing instruments are undefined',
                        writingInstruments: undefined,
                        expected: '',
                    },
                    {
                        desc: 'only main writing instrument when secondary is undefined',
                        writingInstruments: { main: 'main instrument', secondary: undefined },
                        expected: 'main instrument.',
                    },
                    {
                        desc: 'only main writing instrument when secondary is an empty array',
                        writingInstruments: { main: 'main instrument', secondary: [] },
                        expected: 'main instrument.',
                    },
                    {
                        desc: 'main and a single secondary writing instrument if provided',
                        writingInstruments: { main: 'main instrument', secondary: ['secondary1'] },
                        expected: 'main instrument; secondary1.',
                    },
                    {
                        desc: 'main and multiple secondary writing instruments if provided',
                        writingInstruments: {
                            main: 'main instrument',
                            secondary: ['secondary1', 'secondary2', 'secondary3'],
                        },
                        expected: 'main instrument; secondary1, secondary2, secondary3.',
                    },
                    {
                        desc: '`undefined` for main if main is undefined',
                        writingInstruments: { main: undefined, secondary: ['secondary1', 'secondary2'] },
                        expected: 'undefined; secondary1, secondary2.',
                    },
                ])(
                    '... should return $desc',
                    ({
                        writingInstruments,
                        expected,
                    }: {
                        writingInstruments: SourceDescriptionWritingInstruments | undefined;
                        expected: string;
                    }) => {
                        expectToBe(component.getWritingInstruments(writingInstruments), expected);
                    }
                );
            });
        });
    });
});
