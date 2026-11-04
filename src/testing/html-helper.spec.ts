import { describe, expect, it } from 'vitest';

import { expectToBe } from './expect-helper';

import { toInnerHtml, toTextContent } from './html-helper';

describe('html-helper', () => {
    describe('#toInnerHtml()', () => {
        it('... should have a method `toInnerHtml`', () => {
            expect(toInnerHtml).toBeDefined();
        });

        it('... should return the HTML string with a no-break space serialized as entity', () => {
            const innerHtml = toInnerHtml('<em>Vier Lieder</em> op.\u00A012');

            expectToBe(innerHtml, '<em>Vier Lieder</em> op.&nbsp;12');
        });

        it('... should return an HTML string without special characters unchanged', () => {
            const innerHtml = toInnerHtml('<em>Vier Lieder</em> op. 12');

            expectToBe(innerHtml, '<em>Vier Lieder</em> op. 12');
        });
    });

    describe('#toTextContent()', () => {
        it('... should have a method `toTextContent`', () => {
            expect(toTextContent).toBeDefined();
        });

        it('... should return the text content without tags', () => {
            const textContent = toTextContent('<em>Vier Lieder</em> op. 12');

            expectToBe(textContent, 'Vier Lieder op. 12');
        });

        it('... should return the text content with entities resolved', () => {
            const textContent = toTextContent('M&nbsp;212');

            expectToBe(textContent, 'M\u00A0212');
        });
    });
});
