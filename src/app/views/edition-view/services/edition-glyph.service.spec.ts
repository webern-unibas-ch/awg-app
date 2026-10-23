import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { EditionGlyphService } from './edition-glyph.service';

describe('EditionGlyphService (DONE)', () => {
    let editionGlyphService: EditionGlyphService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        editionGlyphService = TestBed.inject(EditionGlyphService);
    });

    it('... should be created', () => {
        expect(editionGlyphService).toBeTruthy();
    });

    describe('#getGlyph()', () => {
        const expectGlyphMappings = (glyphMappings: [string, string][]): void => {
            glyphMappings.forEach(([alt, hex]) => {
                const glyph = editionGlyphService.getGlyph(alt);

                expectToBe(glyph, hex);
            });
        };

        it('... should have a method `getGlyph`', () => {
            expect(editionGlyphService.getGlyph).toBeDefined();
        });

        it('... should return the correct hex value for accidentals', () => {
            expectGlyphMappings([
                ['[bb]', '\uE264'],
                ['[x]', '\uE263'],
                ['[b]', '\uE260'],
                ['[#]', '\uE262'],
                ['[a]', '\uE261'],
            ]);
        });

        it('... should return the correct hex value for articulations', () => {
            expectGlyphMappings([['[>]', '\uE4A0']]);
        });

        it('... should return the correct hex value for dynamics', () => {
            expectGlyphMappings([
                ['[f]', '\uE522'],
                ['[ff]', '\uE52F'],
                ['[fff]', '\uE530'],
                ['[ffff]', '\uE531'],
                ['[mf]', '\uE52D'],
                ['[mp]', '\uE52C'],
                ['[p]', '\uE520'],
                ['[pp]', '\uE52B'],
                ['[ppp]', '\uE52A'],
                ['[pppp]', '\uE529'],
                ['[sf]', '\uE536'],
                ['[sfz]', '\uE539'],
                ['[sp]', '\uE524\uE520'],
            ]);
        });

        it('... should return the correct hex value for note values and pedal signs', () => {
            expectGlyphMappings([
                ['[Achtelnote]', '\uE1D7'],
                ['[Halbe Note]', '\uE1D3'],
                ['[Punktierte Halbe Note]', '\uE1D3 \uE1E7'],
                ['[Viertelnote]', '\uE1D5'],
                ['[Sechzehntelnote]', '\uE1D9'],
                ['[Ganze Note]', '\uE1D2'],
            ]);
        });

        it('... should return the correct hex value for playing techniques', () => {
            expectGlyphMappings([['[ped]', '\uE650']]);
        });

        describe('... should return an empty string for an invalid glyph alt value', () => {
            it.each([
                { desc: '', glyphString: '' },
                { desc: '[invalid]', glyphString: '[invalid]' },
                { desc: '[not found]', glyphString: '[not found]' },
            ])('... $desc', ({ glyphString }) => {
                const glyph = editionGlyphService.getGlyph(glyphString);

                expectToBe(glyph, '');
            });
        });
    });
});
