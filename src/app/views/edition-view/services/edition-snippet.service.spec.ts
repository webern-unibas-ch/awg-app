import { TestBed } from '@angular/core/testing';

import { expectToBe } from '@testing/expect-helper';

import { EditionSnippetService } from './edition-snippet.service';

describe('EditionSnippetService (DONE)', () => {
    let editionSnippetService: EditionSnippetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        editionSnippetService = TestBed.inject(EditionSnippetService);
    });

    it('... should be created', () => {
        expect(editionSnippetService).toBeTruthy();
    });

    describe('#getComment()', () => {
        it('... should have a method `getComment`', () => {
            expect(editionSnippetService.getComment).toBeDefined();
        });

        it('... should return comment unchanged if no `##Abbildung##` placeholder is present', () => {
            const comment = 'Viertelnote überschreibt Halbe Note.';
            const svgGroupId = 'testGroup';

            const result = editionSnippetService.getComment(comment, svgGroupId);

            expectToBe(result, comment);
        });

        it('... should replace a single `##Abbildung##` placeholder without suffix', () => {
            const svgGroupId = 'testGroup';
            const comment = 'Text davor ##Abbildung## Text danach.';
            const id = svgGroupId;
            const src = `assets/img/edition/snippets/${id}.png`;
            const expectedImg = `<img src="${src}" alt="##Abbildung##" class="awg-edition-tkk-snippet" (click)="ref.openSnippet('${src}', '${id}')" />`;

            const result = editionSnippetService.getComment(comment, svgGroupId);

            expectToBe(result, `Text davor ${expectedImg} Text danach.`);
        });

        it('... should replace two `##Abbildung##` placeholders with `a` and `b` suffixes', () => {
            const svgGroupId = 'testGroup';
            const comment = '##Abbildung## and ##Abbildung##';
            const idA = `${svgGroupId}a`;
            const srcA = `assets/img/edition/snippets/${idA}.png`;
            const idB = `${svgGroupId}b`;
            const srcB = `assets/img/edition/snippets/${idB}.png`;
            const expectedImgA = `<img src="${srcA}" alt="##Abbildung##" class="awg-edition-tkk-snippet" (click)="ref.openSnippet('${srcA}', '${idA}')" />`;
            const expectedImgB = `<img src="${srcB}" alt="##Abbildung##" class="awg-edition-tkk-snippet" (click)="ref.openSnippet('${srcB}', '${idB}')" />`;

            const result = editionSnippetService.getComment(comment, svgGroupId);

            expectToBe(result, `${expectedImgA} and ${expectedImgB}`);
        });

        it('... should replace three `##Abbildung##` placeholders with `a`, `b` and `c` suffixes', () => {
            const svgGroupId = 'testGroup';
            const comment = '##Abbildung## ##Abbildung## ##Abbildung##';
            const idA = `${svgGroupId}a`;
            const srcA = `assets/img/edition/snippets/${idA}.png`;
            const idB = `${svgGroupId}b`;
            const srcB = `assets/img/edition/snippets/${idB}.png`;
            const idC = `${svgGroupId}c`;
            const srcC = `assets/img/edition/snippets/${idC}.png`;
            const expectedImgA = `<img src="${srcA}" alt="##Abbildung##" class="awg-edition-tkk-snippet" (click)="ref.openSnippet('${srcA}', '${idA}')" />`;
            const expectedImgB = `<img src="${srcB}" alt="##Abbildung##" class="awg-edition-tkk-snippet" (click)="ref.openSnippet('${srcB}', '${idB}')" />`;
            const expectedImgC = `<img src="${srcC}" alt="##Abbildung##" class="awg-edition-tkk-snippet" (click)="ref.openSnippet('${srcC}', '${idC}')" />`;

            const result = editionSnippetService.getComment(comment, svgGroupId);

            expectToBe(result, `${expectedImgA} ${expectedImgB} ${expectedImgC}`);
        });
    });
});
