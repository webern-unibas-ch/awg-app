import { DOCUMENT } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { EDITION_TRADEMARKS_DATA } from '@awg-views/edition-view/data';
import {
    SourceDescriptionWritingMaterial,
    SourceDescriptionWritingMaterialDimensions,
    SourceDescriptionWritingMaterialItemLocus,
    SourceDescriptionWritingMaterialSystems,
} from '@awg-views/edition-view/models';

import { SourceDescriptionWritingMaterialsComponent } from './source-description-writing-materials.component';

describe('SourceDescriptionWritingMaterialsComponent (DONE)', () => {
    let component: SourceDescriptionWritingMaterialsComponent;
    let fixture: ComponentFixture<SourceDescriptionWritingMaterialsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedTrademarks: typeof EDITION_TRADEMARKS_DATA;
    let expectedWritingMaterials: SourceDescriptionWritingMaterial[];

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SourceDescriptionWritingMaterialsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceDescriptionWritingMaterialsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedTrademarks = EDITION_TRADEMARKS_DATA;
        expectedWritingMaterials = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescriptionListData.sources[2].physDesc.writingMaterials)
        );
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `writingMaterials`', () => {
            expect(component.writingMaterials).toBeUndefined();
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        it('... should have `TRADEMARKS`', () => {
            expectToEqual(component.TRADEMARKS, expectedTrademarks);
        });

        describe('VIEW', () => {
            it('... should contain 1 paragraph (p.awg-source-description-writing-materials)', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-writing-materials', 1, 1);
            });

            it('... should contain only 1 span in paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-writing-materials', 1, 1);
                getAndExpectDebugElementByCss(pDes[0], 'span', 1, 1);
            });

            it('... should display correct label in smallcaps', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-writing-materials', 1, 1);
                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), 'Beschreibstoff:');
                expect(spanEl).toHaveClass('smallcaps');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.writingMaterials = expectedWritingMaterials;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `writingMaterials`', () => {
            expectToEqual(component.writingMaterials, expectedWritingMaterials);
        });

        describe('VIEW', () => {
            it('... should contain a main span for each writing material', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-writing-material',
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );
            });

            it('... should contain a span with material-type for each writing material', () => {
                const typeSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-writing-material > span.awg-source-description-writing-material-type',
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );

                typeSpanDes.forEach((typeSpanDe, index) => {
                    const writingMaterial = expectedWritingMaterials[index];
                    const typeSpanEl: HTMLSpanElement = typeSpanDe.nativeElement;

                    expectToBe(typeSpanEl.textContent.trim(), writingMaterial.materialType);
                });
            });

            it('... should contain a span with the system info for each writing material', () => {
                const systemsSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-writing-material > span.awg-source-description-writing-material-systems',
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );

                systemsSpanDes.forEach((systemsSpan, index) => {
                    const systemsOutput = component.getSystems(expectedWritingMaterials[index].systems);
                    const systemsSpanEl: HTMLSpanElement = systemsSpan.nativeElement;

                    expectToBe(systemsSpanEl.textContent.trim(), systemsOutput);
                });
            });

            it('... should contain a span with the dimensions for each writing material', () => {
                const dimensionsSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-writing-material > span.awg-source-description-writing-material-dimensions',
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );

                dimensionsSpanDes.forEach((dimensionsSpanDe, index) => {
                    const dimensionsOutput = component.getDimensions(expectedWritingMaterials[index].dimensions);
                    const dimensionsSpanEl: HTMLSpanElement = dimensionsSpanDe.nativeElement;

                    expectToBe(dimensionsSpanEl.textContent.trim(), dimensionsOutput);
                });
            });

            it('... should contain a span with the trademark image of a writing material if available', () => {
                // First writing material has a trademark
                const trademarkSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-writing-material > span.awg-source-description-writing-material-trademark',
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );
                const trademarkSpanEl: HTMLSpanElement = trademarkSpanDes[0].nativeElement;

                const expectedTrademark = component.getTrademark(expectedWritingMaterials[0].trademark.variant);

                // Process HTML expression of expected text content
                const expectedHtmlTextContent = mockDocument.createElement('span');
                expectedHtmlTextContent.innerHTML =
                    '<span>Firmenzeichen: </span><br /><img class="img-thumbnail" src=' +
                    expectedTrademark.route +
                    ' title=' +
                    expectedTrademark.full +
                    ' alt=' +
                    expectedTrademark.short +
                    '/><br />';

                expectToBe(trademarkSpanEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
            });

            it('... should contain a span with a hint if no trademark is present in a writing material', () => {
                // Second writing material has no trademark
                const trademarkSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-writing-material > span.awg-source-description-writing-material-trademark',
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );
                const trademarkSpanEl: HTMLSpanElement = trademarkSpanDes[1].nativeElement;

                const expectedOutput = 'kein Firmenzeichen';

                expectToBe(trademarkSpanEl.textContent.trim(), expectedOutput);
            });

            it('... should contain a span with the folio addendum for each writing material', () => {
                const folioAddendumSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-writing-material > span.awg-source-description-writing-material-folio-addendum',
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );

                folioAddendumSpanDes.forEach((folioAddendumSpanDe, index) => {
                    const folioAddendumSpanEl: HTMLSpanElement = folioAddendumSpanDe.nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('span');
                    expectedHtmlTextContent.innerHTML =
                        '&nbsp;(Bl. ' + expectedWritingMaterials[index].folioAddendum + ')';

                    expectToBe(folioAddendumSpanEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });
            });

            it('... should end each writing material statement with a semicolon, except the last one with a full stop', () => {
                const materialSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-writing-material',
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );

                materialSpanDes.forEach((materialSpanDe, index) => {
                    const pEl: HTMLParagraphElement = materialSpanDe.nativeElement;

                    const expectedPunctuation = index === expectedWritingMaterials.length - 1 ? '.' : ';';

                    expectToBe(pEl.textContent.trim().slice(-1), expectedPunctuation);
                });
            });
        });

        describe('#getTrademark()', () => {
            it('... should have a method `getTrademark`', () => {
                expect(component.getTrademark).toBeDefined();
            });

            it('... should return the correct trademark when variant is provided and exists in trademarks data', () => {
                const variant = 'JE_NO2_LIN12_OP25_B';

                const result = component.getTrademark(variant);

                expectToEqual(result, EDITION_TRADEMARKS_DATA[variant]);
            });

            it('... should return unknown trademark when variant is provided but does not exist in trademark data', () => {
                const variant = 'nonexistent';

                const result = component.getTrademark(variant);

                expectToEqual(result, { route: '', full: 'Not a known trademark.', short: 'unknown' });
            });

            it('... should return unknown trademark when variant is not provided', () => {
                let variant = null;

                const result1 = component.getTrademark(variant);

                expectToEqual(result1, { route: '', full: 'Not a known trademark.', short: 'unknown' });

                variant = undefined;

                const result2 = component.getTrademark(variant);

                expectToEqual(result2, { route: '', full: 'Not a known trademark.', short: 'unknown' });
            });
        });

        describe('#getItemLocus()', () => {
            it('... should have a method `getItemLocus`', () => {
                expect(component.getItemLocus).toBeDefined();
            });

            describe('... should return empty string', () => {
                it('... if locus is undefined', () => {
                    const locus: SourceDescriptionWritingMaterialItemLocus = undefined;

                    const result = component.getItemLocus(locus);

                    expectToBe(result, '');
                });

                it('... if locus is an empty object', () => {
                    const locus: SourceDescriptionWritingMaterialItemLocus = {};

                    const result = component.getItemLocus(locus);

                    expectToBe(result, '');
                });
            });

            describe('... should return correct locus string', () => {
                it('... for a single folio without position', () => {
                    const locus: SourceDescriptionWritingMaterialItemLocus = {
                        preFolioInfo: '',
                        folios: ['1'],
                        position: '',
                    };

                    const result = component.getItemLocus(locus);

                    expectToBe(result, 'auf Bl. 1');
                });

                it('... for a single folio with position', () => {
                    const locus: SourceDescriptionWritingMaterialItemLocus = {
                        preFolioInfo: '',
                        folios: ['1'],
                        position: 'oben links',
                    };

                    const result = component.getItemLocus(locus);

                    expectToBe(result, 'auf Bl. 1 oben links');
                });

                it('... for two folios (with connector)', () => {
                    const locus: SourceDescriptionWritingMaterialItemLocus = {
                        preFolioInfo: '',
                        folios: ['1', '2'],
                        position: 'unten links',
                    };
                    const result = component.getItemLocus(locus);
                    expectToBe(result, 'auf Bl. 1 und 2 unten links');
                });

                it('... for multiple folios (with connector)', () => {
                    const locus: SourceDescriptionWritingMaterialItemLocus = {
                        preFolioInfo: '',
                        folios: ['1', '2', '3'],
                        position: 'unten links',
                    };
                    const result = component.getItemLocus(locus);
                    expectToBe(result, 'auf Bl. 1, 2 und 3 unten links');
                });

                it('... for all folios', () => {
                    const locus: SourceDescriptionWritingMaterialItemLocus = {
                        preFolioInfo: '',
                        folios: ['all'],
                        position: 'unten links',
                    };
                    const result = component.getItemLocus(locus);
                    expectToBe(result, 'auf allen Blättern unten links');
                });

                it('... for folios with r or v at the end', () => {
                    const locus: SourceDescriptionWritingMaterialItemLocus = {
                        preFolioInfo: '',
                        folios: ['1r', '2v', '3'],
                        position: 'mittig',
                    };
                    const result = component.getItemLocus(locus);

                    expectToBe(result, 'auf Bl. 1<sup>r</sup>, 2<sup>v</sup> und 3 mittig');
                });

                it('... for folios with preFolioInfo', () => {
                    const locus: SourceDescriptionWritingMaterialItemLocus = {
                        preFolioInfo: 'auf dem Kopf stehend',
                        folios: ['1', '2', '3'],
                        position: 'mittig',
                    };

                    const result = component.getItemLocus(locus);

                    expectToBe(result, 'auf dem Kopf stehend auf Bl. 1, 2 und 3 mittig');
                });

                it('... for preFolioInfo and position without folio', () => {
                    const locus: SourceDescriptionWritingMaterialItemLocus = {
                        preFolioInfo: 'recto',
                        folios: [],
                        position: 'oben links',
                    };

                    const result = component.getItemLocus(locus);

                    expectToBe(result, 'recto oben links');
                });
            });
        });

        describe('#getDimensions()', () => {
            it('... should have a method `getDimensions`', () => {
                expect(component.getDimensions).toBeDefined();
            });

            it('... should return format string without uncertainty', () => {
                const format: SourceDescriptionWritingMaterialDimensions = {
                    orientation: 'hoch',
                    height: { value: '170', uncertainty: '' },
                    width: { value: '270', uncertainty: '' },
                    unit: 'mm',
                };

                const result = component.getDimensions(format);

                expectToBe(result, 'Format: hoch 170 × 270 mm');
            });

            it('... should return format string with uncertainty', () => {
                const format: SourceDescriptionWritingMaterialDimensions = {
                    orientation: 'hoch',
                    height: { value: '170', uncertainty: 'ca.' },
                    width: { value: '270–275', uncertainty: 'ca.' },
                    unit: 'mm',
                };

                const result = component.getDimensions(format);

                expectToBe(result, 'Format: hoch ca. 170 × ca. 270–275 mm');
            });

            it('... should return format string with orientation `quer`', () => {
                const format: SourceDescriptionWritingMaterialDimensions = {
                    orientation: 'quer',
                    height: { value: '170', uncertainty: '' },
                    width: { value: '270', uncertainty: '' },
                    unit: 'mm',
                };

                const result = component.getDimensions(format);

                expectToBe(result, 'Format: quer 170 × 270 mm');
            });

            it('... should return format string with unit `inches`', () => {
                const format: SourceDescriptionWritingMaterialDimensions = {
                    orientation: 'quer',
                    height: { value: '170', uncertainty: '' },
                    width: { value: '270', uncertainty: '' },
                    unit: 'inches',
                };

                const result = component.getDimensions(format);

                expectToBe(result, 'Format: quer 170 × 270 inches');
            });

            it('... should handle missing values gracefully', () => {
                const format: SourceDescriptionWritingMaterialDimensions = {
                    orientation: 'hoch',
                    height: { value: '170', uncertainty: '' },
                    width: {},
                    unit: 'mm',
                };

                const result = component.getDimensions(format);

                expectToBe(result, 'Format: hoch 170 ×  mm');
            });
        });

        describe('#getSystems()', () => {
            it('... should have a method `getSystems`', () => {
                expect(component.getSystems).toBeDefined();
            });

            it('... should return correct systems string when totalSystemsAddendum and additionalInfo are undefined and system number is 1', () => {
                const systems: SourceDescriptionWritingMaterialSystems = {
                    totalSystems: 1,
                    totalSystemsAddendum: undefined,
                    additionalInfo: undefined,
                };

                const result = component.getSystems(systems);

                expectToBe(result, '1 System');
            });

            it('... should return correct systems string when totalSystemsAddendum and additionalInfo are undefined and system number is bigger 1', () => {
                const systems: SourceDescriptionWritingMaterialSystems = {
                    totalSystems: 2,
                    totalSystemsAddendum: undefined,
                    additionalInfo: undefined,
                };

                const result = component.getSystems(systems);

                expectToBe(result, '2 Systeme');
            });

            it('... should return correct systems string when totalSystemsAddendum is given and additionalInfo is undefined', () => {
                const systems: SourceDescriptionWritingMaterialSystems = {
                    totalSystems: 2,
                    totalSystemsAddendum: 'totalSystemsAddendum',
                    additionalInfo: undefined,
                };

                const result = component.getSystems(systems);

                expectToBe(result, '2 Systeme (totalSystemsAddendum)');
            });

            it('... should return correct systems string when totalSystemsAddendum is undefined and additionalInfo is given', () => {
                const systems: SourceDescriptionWritingMaterialSystems = {
                    totalSystems: 3,
                    totalSystemsAddendum: undefined,
                    additionalInfo: 'additionalInfo',
                };

                const result = component.getSystems(systems);

                expectToBe(result, '3 Systeme, additionalInfo');
            });

            it('... should return correct systems string when totalSystemsAddendum and additionalInfo are given', () => {
                const systems: SourceDescriptionWritingMaterialSystems = {
                    totalSystems: 4,
                    totalSystemsAddendum: 'totalSystemsAddendum',
                    additionalInfo: 'additionalInfo',
                };
                const result = component.getSystems(systems);
                expectToBe(result, '4 Systeme (totalSystemsAddendum), additionalInfo');
            });
        });
    });
});
