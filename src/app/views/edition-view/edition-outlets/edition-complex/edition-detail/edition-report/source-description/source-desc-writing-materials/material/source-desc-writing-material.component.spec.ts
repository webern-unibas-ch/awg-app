import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { SourceDescriptionWritingMaterial } from '@awg-views/edition-view/models/source-description.model';

import { getDimensions, getSystems } from '../source-desc-writing-materials.utils';
import { SourceDescWritingTrademarkComponent } from '../trademark/source-desc-writing-trademark.component';
import { SourceDescWritingWatermarkComponent } from '../watermark/source-desc-writing-watermark.component';
import { SourceDescWritingMaterialComponent } from './source-desc-writing-material.component';

describe('SourceDescWritingMaterialComponent', () => {
    let component: SourceDescWritingMaterialComponent;
    let fixture: ComponentFixture<SourceDescWritingMaterialComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedMaterial: SourceDescriptionWritingMaterial;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SourceDescWritingMaterialComponent,
                SourceDescWritingTrademarkComponent,
                SourceDescWritingWatermarkComponent,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        const writingMaterials = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescListData.sources[2].physDesc.writingMaterials)
        );
        expectedMaterial = {
            ...writingMaterials[0],
            watermark: {
                variant: 'Test watermark',
                locus: [{ preFolioInfo: '', folios: ['2v'], position: 'oben rechts' }],
            },
        };

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescWritingMaterialComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `material`', () => {
            expectToBe(isSignal(component.material), true);

            expect(() => component.material()).toThrow();
        });

        it.each(['materialType', 'systems', 'dimensions', 'folioAddendum'] as const)(
            '... should throw when accessing computed signal `%s` due to missing input',
            signalName => {
                expectToBe(isSignal(component[signalName]), true);

                expect(() => component[signalName]()).toThrow();
            }
        );

        describe('VIEW', () => {
            it('... should contain the writing material span, but no content yet', () => {
                const materialDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(materialDes[0], 'span', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('material', expectedMaterial);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `material` to hold the provided material', () => {
            expectToEqual(component.material(), expectedMaterial);
        });

        it('... should have computed signal `materialType` to hold the material type', () => {
            expectToBe(component.materialType(), expectedMaterial.materialType);
        });

        it('... should have recomputed signal `materialType` to hold an empty string if material type is undefined', () => {
            fixture.componentRef.setInput('material', { ...expectedMaterial, materialType: undefined });

            expectToBe(component.materialType(), '');
        });

        it('... should have computed signal `systems` to hold the systems string', () => {
            expectToBe(component.systems(), getSystems(expectedMaterial.systems));
        });

        it('... should have computed signal `dimensions` to hold the dimensions string', () => {
            expectToBe(component.dimensions(), getDimensions(expectedMaterial.dimensions));
        });

        it('... should have computed signal `folioAddendum` to hold the folio addendum', () => {
            expectToBe(component.folioAddendum(), expectedMaterial.folioAddendum);
        });

        it('... should have recomputed signal `folioAddendum` to hold an empty string if folio addendum is undefined', () => {
            fixture.componentRef.setInput('material', { ...expectedMaterial, folioAddendum: undefined });

            expectToBe(component.folioAddendum(), '');
        });

        describe('VIEW', () => {
            it('... should contain one writing material span', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-writing-material', 1, 1);
            });

            it('... should contain a span with the material type', () => {
                const typeSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material > span.awg-source-desc-writing-material-type',
                    1,
                    1
                );
                const typeSpanEl: HTMLSpanElement = typeSpanDes[0].nativeElement;

                expectToBe(typeSpanEl.textContent.trim(), expectedMaterial.materialType);
            });

            it('... should contain a span with the system info', () => {
                const systemsSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material > span.awg-source-desc-writing-material-systems',
                    1,
                    1
                );
                const systemsSpanEl: HTMLSpanElement = systemsSpanDes[0].nativeElement;

                expectToBe(systemsSpanEl.textContent.trim(), getSystems(expectedMaterial.systems));
            });

            it('... should contain a span with the dimensions', () => {
                const dimensionsSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material > span.awg-source-desc-writing-material-dimensions',
                    1,
                    1
                );
                const dimensionsSpanEl: HTMLSpanElement = dimensionsSpanDes[0].nativeElement;

                expectToBe(dimensionsSpanEl.textContent.trim(), getDimensions(expectedMaterial.dimensions));
            });

            it('... should contain a span with the folio addendum', () => {
                const folioAddendumSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material > span.awg-source-desc-writing-material-folio-addendum',
                    1,
                    1
                );
                const folioAddendumSpanEl: HTMLSpanElement = folioAddendumSpanDes[0].nativeElement;

                // Process HTML expression of expected text content
                const expectedHtmlTextContent = mockDocument.createElement('span');
                expectedHtmlTextContent.innerHTML = '&nbsp;(Bl. ' + expectedMaterial.folioAddendum + ')';

                expectToBe(folioAddendumSpanEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
            });

            describe('... should not render a span if empty:', () => {
                it.each([
                    {
                        desc: 'material type',
                        changes: { materialType: '' },
                        selector: 'span.awg-source-desc-writing-material-type',
                    },
                    {
                        desc: 'systems',
                        changes: { systems: undefined },
                        selector: 'span.awg-source-desc-writing-material-systems',
                    },
                    {
                        desc: 'dimensions',
                        changes: { dimensions: undefined },
                        selector: 'span.awg-source-desc-writing-material-dimensions',
                    },
                    {
                        desc: 'folio addendum',
                        changes: { folioAddendum: '' },
                        selector: 'span.awg-source-desc-writing-material-folio-addendum',
                    },
                ])('... $desc', async ({ changes, selector }) => {
                    fixture.componentRef.setInput('material', { ...expectedMaterial, ...changes });
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, selector, 0, 0);
                });
            });

            describe('... trademark', () => {
                it('... should contain one SourceDescWritingTrademarkComponent', () => {
                    getAndExpectDebugElementByDirective(compDe, SourceDescWritingTrademarkComponent, 1, 1);
                });

                it('... should pass down the trademark to SourceDescWritingTrademarkComponent', () => {
                    const trademarkDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescWritingTrademarkComponent,
                        1,
                        1
                    );
                    const trademarkCmp = trademarkDes[0].injector.get(SourceDescWritingTrademarkComponent);

                    expectToEqual(trademarkCmp.trademark(), expectedMaterial.trademark);
                });
            });

            describe('... watermark', () => {
                it('... should contain one SourceDescWritingWatermarkComponent', () => {
                    getAndExpectDebugElementByDirective(compDe, SourceDescWritingWatermarkComponent, 1, 1);
                });

                it('... should pass down the watermark to SourceDescWritingWatermarkComponent', () => {
                    const watermarkDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescWritingWatermarkComponent,
                        1,
                        1
                    );
                    const watermarkCmp = watermarkDes[0].injector.get(SourceDescWritingWatermarkComponent);

                    expectToEqual(watermarkCmp.watermark(), expectedMaterial.watermark);
                });
            });
        });
    });
});
