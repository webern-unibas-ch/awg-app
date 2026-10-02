import { beforeEach, describe, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { EDITION_TRADEMARKS_DATA } from '@awg-views/edition-view/data/edition-trademarks.data';
import {
    SourceDescriptionWritingMaterialDimensions,
    SourceDescriptionWritingMaterialItemLocus,
    SourceDescriptionWritingMaterialSystems,
} from '@awg-views/edition-view/models/source-description.model';

import { getDimensions, getItemLocus, getSystems, getTrademark } from './source-desc-writing-materials.utils';

describe('SourceDescWritingMaterials utils', () => {
    let expectedUnknownTrademark: { route: string; full: string; short: string };

    beforeEach(() => {
        expectedUnknownTrademark = { route: '', full: 'Not a known trademark.', short: 'unknown' };
    });

    describe('getTrademark', () => {
        it('... should return the correct trademark when variant is provided and exists in trademarks data', () => {
            const variant = 'JE_NO2_LIN12_OP25_B';

            const result = getTrademark(variant);

            expectToEqual(result, EDITION_TRADEMARKS_DATA[variant]);
        });

        describe('... should return unknown trademark when variant is', () => {
            it.each([
                { desc: 'not in trademark data', variant: 'nonexistent' },
                { desc: 'a prototype property like `toString`', variant: 'toString' },
                { desc: 'empty', variant: '' },
                { desc: 'null', variant: null as any },
                { desc: 'undefined', variant: undefined as any },
            ])('... $desc', ({ variant }) => {
                expectToEqual(getTrademark(variant), expectedUnknownTrademark);
            });
        });
    });

    describe('getItemLocus', () => {
        describe('... should return empty string if locus.folios is', () => {
            it.each([
                { desc: 'undefined', locus: {} },
                { desc: 'an empty array', locus: { folios: [] } },
                { desc: 'an array of empty strings', locus: { folios: ['', ''] } },
            ])('... $desc', ({ locus }) => {
                expectToBe(getItemLocus(locus), '');
            });
        });

        describe('... should return correct locus string', () => {
            it.each([
                {
                    desc: 'for a single folio without position',
                    locus: { preFolioInfo: '', folios: ['1'], position: '' },
                    expected: 'auf Bl. 1',
                },
                {
                    desc: 'for a single folio with position',
                    locus: { preFolioInfo: '', folios: ['1'], position: 'oben links' },
                    expected: 'auf Bl. 1 oben links',
                },
                {
                    desc: 'for two folios (with connector)',
                    locus: { preFolioInfo: '', folios: ['1', '2'], position: 'unten links' },
                    expected: 'auf Bl. 1 und 2 unten links',
                },
                {
                    desc: 'for multiple folios (with connector)',
                    locus: { preFolioInfo: '', folios: ['1', '2', '3'], position: 'unten links' },
                    expected: 'auf Bl. 1, 2 und 3 unten links',
                },
                {
                    desc: 'for all folios',
                    locus: { preFolioInfo: '', folios: ['all'], position: 'unten links' },
                    expected: 'auf allen Blättern unten links',
                },
                {
                    desc: 'for folios with r or v at the end',
                    locus: { preFolioInfo: '', folios: ['1r', '2v', '3'], position: 'mittig' },
                    expected: 'auf Bl. 1<sup>r</sup>, 2<sup>v</sup> und 3 mittig',
                },
                {
                    desc: 'for folios with preFolioInfo',
                    locus: {
                        preFolioInfo: 'auf dem Kopf stehend',
                        folios: ['1', '2', '3'],
                        position: 'mittig',
                    },
                    expected: 'auf dem Kopf stehend auf Bl. 1, 2 und 3 mittig',
                },
                {
                    desc: 'for preFolioInfo and position without folio',
                    locus: { preFolioInfo: 'recto', folios: [], position: 'oben links' },
                    expected: 'recto oben links',
                },
            ])(
                '... $desc',
                ({ locus, expected }: { locus: SourceDescriptionWritingMaterialItemLocus; expected: string }) => {
                    expectToBe(getItemLocus(locus), expected);
                }
            );
        });
    });

    describe('getDimensions', () => {
        describe('... should return empty string if', () => {
            it.each([
                { desc: 'dimensions is undefined', dimensions: undefined },
                {
                    desc: 'both height and width are undefined',
                    dimensions: { orientation: 'hoch', height: undefined, width: undefined, unit: 'mm' },
                },
            ])('... $desc', ({ dimensions }) => {
                expectToBe(getDimensions(dimensions), '');
            });
        });

        describe('... should return format string', () => {
            it.each([
                {
                    desc: 'without uncertainty',
                    dimensions: {
                        orientation: 'hoch',
                        height: { value: '170', uncertainty: '' },
                        width: { value: '270', uncertainty: '' },
                        unit: 'mm',
                    },
                    expected: 'Format: hoch 170 × 270 mm',
                },
                {
                    desc: 'with uncertainty',
                    dimensions: {
                        orientation: 'hoch',
                        height: { value: '170', uncertainty: 'ca.' },
                        width: { value: '270–275', uncertainty: 'ca.' },
                        unit: 'mm',
                    },
                    expected: 'Format: hoch ca. 170 × ca. 270–275 mm',
                },
                {
                    desc: 'with orientation `quer`',
                    dimensions: {
                        orientation: 'quer',
                        height: { value: '170', uncertainty: '' },
                        width: { value: '270', uncertainty: '' },
                        unit: 'mm',
                    },
                    expected: 'Format: quer 170 × 270 mm',
                },
                {
                    desc: 'with unit `inches`',
                    dimensions: {
                        orientation: 'quer',
                        height: { value: '170', uncertainty: '' },
                        width: { value: '270', uncertainty: '' },
                        unit: 'inches',
                    },
                    expected: 'Format: quer 170 × 270 inches',
                },
                {
                    desc: 'without orientation',
                    dimensions: {
                        height: { value: '170', uncertainty: '' },
                        width: { value: '270', uncertainty: '' },
                        unit: 'mm',
                    },
                    expected: 'Format: 170 × 270 mm',
                },
                {
                    desc: 'and handle single missing dimensions values gracefully',
                    dimensions: {
                        orientation: 'hoch',
                        height: { value: '170', uncertainty: '' },
                        width: {},
                        unit: 'mm',
                    },
                    expected: 'Format: hoch 170 ×  mm',
                },
            ])(
                '... $desc',
                ({
                    dimensions,
                    expected,
                }: {
                    dimensions: SourceDescriptionWritingMaterialDimensions;
                    expected: string;
                }) => {
                    expectToBe(getDimensions(dimensions), expected);
                }
            );
        });
    });

    describe('getSystems', () => {
        describe('... should return empty string if', () => {
            it.each([
                { desc: 'systems is undefined', systems: undefined },
                { desc: 'totalSystems is 0', systems: { totalSystems: 0 } },
            ])('... $desc', ({ systems }) => {
                expectToBe(getSystems(systems), '');
            });
        });

        describe('... should return correct systems string when', () => {
            it.each([
                {
                    desc: 'totalSystemsAddendum and additionalInfo are undefined and system number is 1',
                    systems: { totalSystems: 1 },
                    expected: '1 System',
                },
                {
                    desc: 'totalSystemsAddendum and additionalInfo are undefined and system number is bigger 1',
                    systems: { totalSystems: 2 },
                    expected: '2 Systeme',
                },
                {
                    desc: 'totalSystemsAddendum is given and additionalInfo is undefined',
                    systems: { totalSystems: 2, totalSystemsAddendum: 'totalSystemsAddendum' },
                    expected: '2 Systeme (totalSystemsAddendum)',
                },
                {
                    desc: 'totalSystemsAddendum is undefined and additionalInfo is given',
                    systems: { totalSystems: 3, additionalInfo: 'additionalInfo' },
                    expected: '3 Systeme, additionalInfo',
                },
                {
                    desc: 'totalSystemsAddendum and additionalInfo are given',
                    systems: {
                        totalSystems: 4,
                        totalSystemsAddendum: 'totalSystemsAddendum',
                        additionalInfo: 'additionalInfo',
                    },
                    expected: '4 Systeme (totalSystemsAddendum), additionalInfo',
                },
            ])(
                '... $desc',
                ({ systems, expected }: { systems: SourceDescriptionWritingMaterialSystems; expected: string }) => {
                    expectToBe(getSystems(systems), expected);
                }
            );
        });
    });
});
