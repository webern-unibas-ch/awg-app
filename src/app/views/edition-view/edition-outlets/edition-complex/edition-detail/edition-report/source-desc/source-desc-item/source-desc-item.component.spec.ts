import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { SourceDesc } from '@awg-views/edition-view/models/source-desc.model';
import { AbbrDirective } from '@awg-views/edition-view/shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

import { SourceSiglumComponent } from '../../source-siglum/source-siglum.component';
import { SourceDescContentsComponent } from '../source-desc-contents/source-desc-contents.component';
import { SourceDescCorrectionsComponent } from '../source-desc-corrections/source-desc-corrections.component';
import { SourceDescDetailsComponent } from '../source-desc-details/source-desc-details.component';
import { SourceDescWritingInstrumentsComponent } from '../source-desc-writing-instruments/source-desc-writing-instruments.component';
import { SourceDescWritingMaterialsComponent } from '../source-desc-writing-materials/source-desc-writing-materials.component';
import { SourceDescItemComponent } from './source-desc-item.component';

describe('SourceDescItemComponent (DONE)', () => {
    let component: SourceDescItemComponent;
    let fixture: ComponentFixture<SourceDescItemComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedSourceDescWithoutPhysDesc: SourceDesc;
    let expectedSourceDescWithAllEntries: SourceDesc;
    let expectedSourceDescWithWritingMaterials: SourceDesc;

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

    /**
     * Helper: expectSiglumParagraph.
     *
     * It expects the given paragraph to be bold and to contain one SourceSiglumComponent (hollow)
     * with the given source and class prefix.
     */
    const expectSiglumParagraph = (pDe: DebugElement, source: SourceDesc): void => {
        const pEl: HTMLParagraphElement = pDe.nativeElement;

        expectToContain(pEl.classList, 'bold');

        const siglumDes = getAndExpectDebugElementByDirective(pDe, SourceSiglumComponent, 1, 1);
        const siglumCmp = siglumDes[0].injector.get(SourceSiglumComponent);

        expectToEqual(siglumCmp.siglumData(), source);
        expectToBe(siglumCmp.classPrefix(), 'awg-source-desc');
        expectToBe(siglumCmp.isClickable(), false);
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AbbrDirective,
                CompileHtmlDirective,
                SourceDescContentsComponent,
                SourceDescCorrectionsComponent,
                SourceDescDetailsComponent,
                SourceDescItemComponent,
                SourceDescWritingInstrumentsComponent,
                SourceDescWritingMaterialsComponent,
                SourceSiglumComponent,
            ],
        })
            .overrideComponent(SourceDescContentsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(SourceDescCorrectionsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(SourceDescDetailsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(SourceDescWritingInstrumentsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(SourceDescWritingMaterialsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(SourceSiglumComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        const sources = structuredClone(mockEditionData.mockSourceDescListData).sources;
        expectedSourceDescWithoutPhysDesc = sources[0]; // No physDesc entries
        expectedSourceDescWithAllEntries = sources[1]; // All possible physDesc entries, with only writing material strings
        expectedSourceDescWithWritingMaterials = sources[2]; // Only conditions and writing materials in physDesc

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescItemComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `sourceDescData`', () => {
            expectToBe(isSignal(component.sourceDescData), true);

            expect(() => component.sourceDescData()).toThrow();
        });

        it.each(['physDesc', 'hasPhysDesc', 'details'] as const)(
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
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('sourceDescData', expectedSourceDescWithAllEntries);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `sourceDescData` to hold the provided source description', () => {
            expectToEqual(component.sourceDescData(), expectedSourceDescWithAllEntries);
        });

        it('... should have computed signal `physDesc` to hold the physical description', () => {
            expectToEqual(component.physDesc(), expectedSourceDescWithAllEntries.physDesc);
        });

        it('... should have computed signal `hasPhysDesc` to hold true', () => {
            expectToBe(component.hasPhysDesc(), true);
        });

        it('... should have recomputed signal `hasPhysDesc` to hold false if physDesc is empty', () => {
            fixture.componentRef.setInput('sourceDescData', expectedSourceDescWithoutPhysDesc);

            expectToBe(component.hasPhysDesc(), false);
        });

        it('... should have computed signal `details` to hold all details sections in display order', () => {
            const physDesc = expectedSourceDescWithAllEntries.physDesc;

            expectToEqual(component.details(), [
                { key: 'titles', label: 'Titel', cssClass: 'titles', details: physDesc.titles },
                { key: 'dates', label: 'Datierung', cssClass: 'dates', details: physDesc.dates },
                { key: 'paginations', label: 'Paginierung', cssClass: 'paginations', details: physDesc.paginations },
                {
                    key: 'measureNumbers',
                    label: 'Taktzahlen',
                    cssClass: 'measure-numbers',
                    details: physDesc.measureNumbers,
                },
                {
                    key: 'instrumentations',
                    label: 'Instrumentenvorsatz',
                    cssClass: 'instrumentations',
                    details: physDesc.instrumentations,
                },
                { key: 'annotations', label: 'Eintragungen', cssClass: 'annotations', details: physDesc.annotations },
            ]);
        });

        it('... should have recomputed signal `details` to skip sections with empty or undefined details', () => {
            fixture.componentRef.setInput('sourceDescData', {
                ...expectedSourceDescWithAllEntries,
                physDesc: { ...expectedSourceDescWithAllEntries.physDesc, dates: [], annotations: undefined },
            });

            expectToEqual(
                component.details().map(detail => detail.key),
                ['titles', 'paginations', 'measureNumbers', 'instrumentations']
            );
        });

        it('... should have recomputed signal `details` to hold an empty array if physDesc is empty', () => {
            fixture.componentRef.setInput('sourceDescData', expectedSourceDescWithoutPhysDesc);

            expectToEqual(component.details(), []);
        });

        describe('VIEW', () => {
            it('... should contain one div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
            });

            describe('... should not render a head paragraph if', () => {
                it.each([
                    { desc: 'siglum', changes: { siglum: '' }, selector: 'awg-source-siglum' },
                    { desc: 'type', changes: { type: '' }, selector: 'p.awg-source-desc-type' },
                    { desc: 'location', changes: { location: '' }, selector: 'p.awg-source-desc-location' },
                ])('... $desc is empty', async ({ changes, selector }) => {
                    fixture.componentRef.setInput('sourceDescData', {
                        ...expectedSourceDescWithoutPhysDesc,
                        ...changes,
                    });
                    await detectChangesOnPush(fixture);

                    const headDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-head', 1, 1);

                    getAndExpectDebugElementByCss(headDes[0], selector, 0, 0);
                    getAndExpectDebugElementByCss(headDes[0], 'p', 2, 2);
                });
            });

            describe('... with a source without physDesc entries', () => {
                let paragraphDes: DebugElement[];

                beforeEach(async () => {
                    fixture.componentRef.setInput('sourceDescData', expectedSourceDescWithoutPhysDesc);
                    await detectChangesOnPush(fixture);

                    paragraphDes = getHeadParagraphDes(3);
                });

                it('... should contain a description-head div, but no physDesc in div.card-body', () => {
                    const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-phys-desc', 0, 0);
                });

                describe('... the first paragraph', () => {
                    it('... should contain a SourceSiglumComponent (hollow) in bold for a siglum without an addendum', () => {
                        expectSiglumParagraph(paragraphDes[0], expectedSourceDescWithoutPhysDesc);
                    });
                });

                describe('... the second paragraph', () => {
                    it('... should have one CompileHtmlDirective', () => {
                        const directiveIns = paragraphDes[1].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                        expect(directiveIns).toBeTruthy();
                    });

                    it('... should pass down the source type to the CompileHtmlDirective', () => {
                        const directiveIns = paragraphDes[1].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                        expectToBe(directiveIns.htmlContent(), expectedSourceDescWithoutPhysDesc.type);
                    });

                    it('... should display the source type', () => {
                        const pEl: HTMLParagraphElement = paragraphDes[1].nativeElement;

                        expectToContain(pEl.classList, 'awg-source-desc-type');
                        expectToBe(pEl.textContent.trim(), expectedSourceDescWithoutPhysDesc.type.trim());
                    });
                });

                describe('... the third paragraph', () => {
                    it('... should have one AbbrDirective', () => {
                        const directiveIns = paragraphDes[2].injector.get(AbbrDirective) as AbbrDirective;

                        expect(directiveIns).toBeTruthy();
                    });

                    it('... should pass down the source location to the AbbrDirective', () => {
                        const directiveIns = paragraphDes[2].injector.get(AbbrDirective) as AbbrDirective;

                        expectToBe(directiveIns.text(), expectedSourceDescWithoutPhysDesc.location);
                    });

                    it('... should display the source location', () => {
                        const pEl: HTMLParagraphElement = paragraphDes[2].nativeElement;

                        expectToContain(pEl.classList, 'awg-source-desc-location');
                        expectToBe(pEl.textContent.trim(), expectedSourceDescWithoutPhysDesc.location.trim());
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
                        it('... should contain a SourceSiglumComponent (hollow) in bold for a siglum with addendum', () => {
                            expectSiglumParagraph(paragraphDes[0], expectedSourceDescWithAllEntries);
                        });
                    });

                    describe('... the second paragraph', () => {
                        it('... should have one AbbrDirective', () => {
                            const directiveIns = paragraphDes[1].injector.get(AbbrDirective) as AbbrDirective;

                            expect(directiveIns).toBeTruthy();
                        });

                        it('... should pass down the source location to the AbbrDirective', () => {
                            const directiveIns = paragraphDes[1].injector.get(AbbrDirective) as AbbrDirective;

                            expectToBe(directiveIns.text(), expectedSourceDescWithAllEntries.location);
                        });

                        it('... should display the source location', () => {
                            const pEl: HTMLParagraphElement = paragraphDes[1].nativeElement;

                            expectToContain(pEl.classList, 'awg-source-desc-location');
                            expectToBe(pEl.textContent.trim(), expectedSourceDescWithAllEntries.location.trim());
                        });
                    });
                });

                describe('... the physDesc', () => {
                    it('... should contain 8 SourceDescDetailsComponents (hollow) in physDesc div', () => {
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

                            expectToEqual(detailCmp.details(), expectedSourceDescWithAllEntries.physDesc[key]);
                            expectToBe(detailCmp.detailsLabel(), label);
                            expectToBe(detailCmp.detailsClass(), cssClass);
                        });
                    });

                    it('... should contain no SourceDescWritingMaterialsComponent (hollow) if writing materials array is empty', () => {
                        getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescWritingMaterialsComponent, 0, 0);
                    });

                    describe('... the writing instruments', () => {
                        it('... should contain one SourceDescWritingInstrumentsComponent (hollow) in physDesc div', () => {
                            getAndExpectDebugElementByDirective(
                                getPhysDescDe(),
                                SourceDescWritingInstrumentsComponent,
                                1,
                                1
                            );
                        });

                        it('... should pass down the writingInstruments to SourceDescWritingInstrumentsComponent (hollow)', () => {
                            const instrumentsDes = getAndExpectDebugElementByDirective(
                                getPhysDescDe(),
                                SourceDescWritingInstrumentsComponent,
                                1,
                                1
                            );
                            const instrumentsCmp = instrumentsDes[0].injector.get(
                                SourceDescWritingInstrumentsComponent
                            );

                            expectToEqual(
                                instrumentsCmp.writingInstruments(),
                                expectedSourceDescWithAllEntries.physDesc.writingInstruments
                            );
                        });
                    });

                    describe('... the contents', () => {
                        it('... should contain SourceDescContentsComponent (hollow) if contents array is not empty', () => {
                            getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescContentsComponent, 1, 1);
                        });

                        it('... should pass down contents data to SourceDescContentsComponent (hollow)', () => {
                            const contentsDes = getAndExpectDebugElementByDirective(
                                getPhysDescDe(),
                                SourceDescContentsComponent,
                                1,
                                1
                            );
                            const contentsCmp = contentsDes[0].injector.get(SourceDescContentsComponent);

                            expectToEqual(contentsCmp.contents(), expectedSourceDescWithAllEntries.physDesc.contents);
                        });

                        it('... should contain no SourceDescContentsComponent (hollow) if contents array is empty or undefined', async () => {
                            fixture.componentRef.setInput('sourceDescData', expectedSourceDescWithWritingMaterials);
                            await detectChangesOnPush(fixture);

                            getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescContentsComponent, 0, 0);
                        });
                    });

                    describe('... the corrections', () => {
                        it('... should contain SourceDescCorrectionsComponent (hollow) if corrections array is not empty', () => {
                            getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescCorrectionsComponent, 1, 1);
                        });

                        it('... should pass down corrections data to SourceDescCorrectionsComponent (hollow)', () => {
                            const correctionsDes = getAndExpectDebugElementByDirective(
                                getPhysDescDe(),
                                SourceDescCorrectionsComponent,
                                1,
                                1
                            );
                            const correctionsCmp = correctionsDes[0].injector.get(SourceDescCorrectionsComponent);

                            expectToEqual(
                                correctionsCmp.corrections(),
                                expectedSourceDescWithAllEntries.physDesc.corrections
                            );
                        });

                        it('... should contain no SourceDescCorrectionsComponent (hollow) if corrections array is empty or undefined', async () => {
                            fixture.componentRef.setInput('sourceDescData', expectedSourceDescWithWritingMaterials);
                            await detectChangesOnPush(fixture);

                            getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescCorrectionsComponent, 0, 0);
                        });
                    });
                });
            });

            describe('... with a source with only conditions and writing materials in physDesc', () => {
                let paragraphDes: DebugElement[];

                beforeEach(async () => {
                    fixture.componentRef.setInput('sourceDescData', expectedSourceDescWithWritingMaterials);
                    await detectChangesOnPush(fixture);

                    paragraphDes = getHeadParagraphDes(3);
                });

                it('... should contain a description-head div, and a physDesc in div.card-body', () => {
                    const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-head', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[0], 'div.awg-source-desc-phys-desc', 1, 1);
                });

                it('... the first paragraph containing a SourceSiglumComponent (hollow) in bold for a missing siglum with addendum', () => {
                    expectSiglumParagraph(paragraphDes[0], expectedSourceDescWithWritingMaterials);
                });

                it('... the second paragraph displaying the source type', () => {
                    const pEl: HTMLParagraphElement = paragraphDes[1].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('p');
                    expectedHtmlTextContent.innerHTML = expectedSourceDescWithWritingMaterials.type;

                    expectToContain(pEl.classList, 'awg-source-desc-type');
                    expectToBe(pEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });

                it('... the third paragraph displaying the source location', () => {
                    const pEl: HTMLParagraphElement = paragraphDes[2].nativeElement;

                    expectToContain(pEl.classList, 'awg-source-desc-location');
                    expectToBe(pEl.textContent.trim(), expectedSourceDescWithWritingMaterials.location.trim());
                });

                it('... should contain one SourceDescDetailsComponent (hollow) in physDesc div', () => {
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

                    expectToEqual(detailCmp.details(), expectedSourceDescWithWritingMaterials.physDesc.conditions);
                    expectToBe(detailCmp.detailsLabel(), '');
                    expectToBe(detailCmp.detailsClass(), 'conditions');
                });

                describe('... should contain no details component for conditions if conditions are', () => {
                    it.each([
                        { desc: 'undefined', conditions: undefined },
                        { desc: 'empty', conditions: [] },
                    ])('... $desc', async ({ conditions }) => {
                        fixture.componentRef.setInput('sourceDescData', {
                            ...expectedSourceDescWithWritingMaterials,
                            physDesc: { ...expectedSourceDescWithWritingMaterials.physDesc, conditions },
                        });
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByDirective(getPhysDescDe(), SourceDescDetailsComponent, 0, 0);
                    });
                });

                describe('... the writing materials', () => {
                    it('... should contain one SourceDescWritingMaterialsComponent (hollow) if writing materials array is not empty', () => {
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
                            expectedSourceDescWithWritingMaterials.physDesc.writingMaterials
                        );
                    });

                    describe('... if writingMaterialStrings are undefined', () => {
                        it.each([
                            {
                                desc: 'should still render SourceDescWritingMaterialsComponent if writingMaterials are given',
                                getWritingMaterials: () =>
                                    expectedSourceDescWithWritingMaterials.physDesc.writingMaterials,
                                expectedWritingMaterialsCmps: 1,
                            },
                            {
                                desc: 'should render no writing materials at all if writingMaterials are undefined, too',
                                getWritingMaterials: () => undefined,
                                expectedWritingMaterialsCmps: 0,
                            },
                        ])('... $desc', async ({ getWritingMaterials, expectedWritingMaterialsCmps }) => {
                            fixture.componentRef.setInput('sourceDescData', {
                                ...expectedSourceDescWithWritingMaterials,
                                physDesc: {
                                    ...expectedSourceDescWithWritingMaterials.physDesc,
                                    writingMaterials: getWritingMaterials(),
                                    writingMaterialStrings: undefined,
                                },
                            });
                            await detectChangesOnPush(fixture);

                            getAndExpectDebugElementByDirective(
                                getPhysDescDe(),
                                SourceDescWritingMaterialsComponent,
                                expectedWritingMaterialsCmps,
                                expectedWritingMaterialsCmps
                            );

                            const detailDes = getAndExpectDebugElementByDirective(
                                getPhysDescDe(),
                                SourceDescDetailsComponent,
                                1,
                                1
                            );
                            const detailCmp = detailDes[0].injector.get(SourceDescDetailsComponent);

                            // Only the conditions are rendered as details, no writing material strings
                            expectToBe(detailCmp.detailsClass(), 'conditions');
                        });
                    });
                });
            });
        });
    });
});
