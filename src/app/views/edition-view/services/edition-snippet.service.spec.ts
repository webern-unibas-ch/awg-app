import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { EditionSnippetService } from './edition-snippet.service';

describe('EditionSnippetService (DONE)', () => {
    let editionSnippetService: EditionSnippetService;

    const getExpectedSnippetImg = (src: string, id: string, alt: string): string =>
        [
            `<img src="${src}" alt="${alt}" class="awg-edition-tkk-snippet"`,
            `role="button" tabindex="0" aria-label="${alt}"`,
            `data-snippet-src="${src}" data-snippet-id="${id}" />`,
        ].join(' ');

    beforeEach(() => {
        TestBed.configureTestingModule({});
        editionSnippetService = TestBed.inject(EditionSnippetService);
    });

    it('... should be created', () => {
        expect(editionSnippetService).toBeTruthy();
    });

    it('... should have static `SAFE_SNIPPET_ID_PATTERN`', () => {
        const pattern = (EditionSnippetService as any).SAFE_SNIPPET_ID_PATTERN as RegExp;

        expect(pattern).toBeDefined();
        expectToBe(pattern.source, '^[A-Za-z0-9_-]+$');
        expectToBe(pattern.flags, '');
    });

    describe('#getComment()', () => {
        it('... should have a method `getComment`', () => {
            expect(editionSnippetService.getComment).toBeDefined();
        });

        describe('... should keep comment unchanged if', () => {
            it('... svgGroupId is missing', () => {
                const comment = 'Text davor ##Abbildung## Text danach.';

                const result = editionSnippetService.getComment(comment, undefined);

                expectToBe(result, comment);
            });

            it('... svgGroupId has unsafe value', () => {
                const comment = 'Text davor ##Abbildung## Text danach.';

                const result = editionSnippetService.getComment(comment, 'bad\'group"><x>');

                expectToBe(result, comment);
            });
        });

        it('... should return comment unchanged if no `##Abbildung##` placeholder is present', () => {
            const comment = 'Viertelnote überschreibt Halbe Note.';
            const svgGroupId = 'testGroup';

            const result = editionSnippetService.getComment(comment, svgGroupId);

            expectToBe(result, comment);
        });

        it('... should not replace `###Abbildung###` pseudo placeholders', () => {
            const comment = 'Text davor ###Abbildung### Text danach.';
            const svgGroupId = 'testGroup';

            const result = editionSnippetService.getComment(comment, svgGroupId);

            expectToBe(result, comment);
        });

        it('... should replace a single `##Abbildung##` placeholder without suffix', () => {
            const comment = 'Text davor ##Abbildung## Text danach.';
            const svgGroupId = 'testGroup';
            const id = svgGroupId;
            const src = `assets/img/edition/snippets/${id}.png`;
            const alt = `Abbildung: ${id}`;
            const expectedImg = getExpectedSnippetImg(src, id, alt);

            const result = editionSnippetService.getComment(comment, svgGroupId);

            expectToBe(result, `Text davor ${expectedImg} Text danach.`);
        });

        it('... should replace two `##Abbildung##` placeholders with `a` and `b` suffixes', () => {
            const comment = '##Abbildung## and ##Abbildung##';
            const svgGroupId = 'testGroup';
            const idA = `${svgGroupId}a`;
            const idB = `${svgGroupId}b`;
            const srcA = `assets/img/edition/snippets/${idA}.png`;
            const srcB = `assets/img/edition/snippets/${idB}.png`;
            const altA = `Abbildung: ${idA}`;
            const altB = `Abbildung: ${idB}`;
            const expectedImgA = getExpectedSnippetImg(srcA, idA, altA);
            const expectedImgB = getExpectedSnippetImg(srcB, idB, altB);

            const result = editionSnippetService.getComment(comment, svgGroupId);

            expectToBe(result, `${expectedImgA} and ${expectedImgB}`);
        });

        it('... should replace three `##Abbildung##` placeholders with `a`, `b` and `c` suffixes', () => {
            const comment = '##Abbildung## ##Abbildung## ##Abbildung##';
            const svgGroupId = 'testGroup';
            const idA = `${svgGroupId}a`;
            const idB = `${svgGroupId}b`;
            const idC = `${svgGroupId}c`;
            const srcA = `assets/img/edition/snippets/${idA}.png`;
            const srcB = `assets/img/edition/snippets/${idB}.png`;
            const srcC = `assets/img/edition/snippets/${idC}.png`;
            const altA = `Abbildung: ${idA}`;
            const altB = `Abbildung: ${idB}`;
            const altC = `Abbildung: ${idC}`;
            const expectedImgA = getExpectedSnippetImg(srcA, idA, altA);
            const expectedImgB = getExpectedSnippetImg(srcB, idB, altB);
            const expectedImgC = getExpectedSnippetImg(srcC, idC, altC);

            const result = editionSnippetService.getComment(comment, svgGroupId);

            expectToBe(result, `${expectedImgA} ${expectedImgB} ${expectedImgC}`);
        });
    });

    describe('#_isSafeSnippetId()', () => {
        it('... should have a method `_isSafeSnippetId`', () => {
            expect((editionSnippetService as any)._isSafeSnippetId).toBeDefined();
        });

        it('... should return true for safe snippet ids', () => {
            const resultA = (editionSnippetService as any)._isSafeSnippetId('awg-tkk-m133_tf4-015');
            const resultB = (editionSnippetService as any)._isSafeSnippetId('abc_123-XYZ');

            expectToBe(resultA, true);
            expectToBe(resultB, true);
        });

        it('... should return false for unsafe snippet ids', () => {
            const resultA = (editionSnippetService as any)._isSafeSnippetId('bad id');
            const resultB = (editionSnippetService as any)._isSafeSnippetId("bad'id");
            const resultC = (editionSnippetService as any)._isSafeSnippetId('<bad>');

            expectToBe(resultA, false);
            expectToBe(resultB, false);
            expectToBe(resultC, false);
        });
    });

    describe('#_escapeHtmlAttribute()', () => {
        it('... should have a method `_escapeHtmlAttribute`', () => {
            expect((editionSnippetService as any)._escapeHtmlAttribute).toBeDefined();
        });

        it('... should escape html-sensitive characters', () => {
            const value = '&"<>\'';

            const result = (editionSnippetService as any)._escapeHtmlAttribute(value);

            expectToBe(result, '&amp;&quot;&lt;&gt;&#39;');
        });

        it('... should return unchanged value if no escaping is needed', () => {
            const value = 'awg-tkk-m133_tf4-015';

            const result = (editionSnippetService as any)._escapeHtmlAttribute(value);

            expectToBe(result, value);
        });
    });
});
