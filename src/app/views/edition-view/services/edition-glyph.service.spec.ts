import { TestBed } from '@angular/core/testing';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { EDITION_GLYPHS_DATA } from '@awg-views/edition-view/data';

import { EditionGlyphService } from './edition-glyph.service';

describe('EditionGlyphService', () => {
    let editionGlyphService: EditionGlyphService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        editionGlyphService = TestBed.inject(EditionGlyphService);
    });

    it('... should be created', () => {
        expect(editionGlyphService).toBeTruthy();
    });

    it('... should have `GLYPHS`', () => {
        expectToEqual(editionGlyphService.GLYPHS, EDITION_GLYPHS_DATA);
    });

    describe('#getGlyph()', () => {
        it('... should have a method `getGlyph`', () => {
            expect(editionGlyphService.getGlyph).toBeDefined();
        });

        it('... should return the correct hex value for a valid glyph alt value', () => {
            expectToBe(editionGlyphService.getGlyph('[bb]'), '\uD834\uDD2B'); // DOUBLE_FLAT
            expectToBe(editionGlyphService.getGlyph('[x]'), '\uD834\uDD2A'); // DOUBLE_SHARP
            expectToBe(editionGlyphService.getGlyph('[b]'), '\u266D'); // FLAT
            expectToBe(editionGlyphService.getGlyph('[#]'), '\u266F'); // SHARP
            expectToBe(editionGlyphService.getGlyph('[a]'), '\u266E'); // NATURAL
            expectToBe(editionGlyphService.getGlyph('[f]'), '\uD834\uDD91'); // FORTE
            expectToBe(editionGlyphService.getGlyph('[ped]'), '\uD834\uDDAE'); // PEDAL
        });

        it('... should return an empty string for an invalid glyph alt value', () => {
            expectToBe(editionGlyphService.getGlyph(''), '');
            expectToBe(editionGlyphService.getGlyph('[invalid]'), '');
            expectToBe(editionGlyphService.getGlyph('[not found]'), '');
        });
    });
});
