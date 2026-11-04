import { describe, it } from 'vitest';

import { expectToBe } from './expect-helper';

import { toInnerHtml, toTextContent } from './html-helper';

describe('htmlHelper', () => {
    describe('#toInnerHtml()', () => {
        it('... should return the HTML string with a no-break space serialized as entity', () => {
            const serializedHtml = toInnerHtml('<em>Vier Lieder</em> op.\u00A012');

            expectToBe(serializedHtml, '<em>Vier Lieder</em> op.&nbsp;12');
        });

        it('... should return an HTML string without special characters unchanged', () => {
            const serializedHtml = toInnerHtml('<em>Vier Lieder</em> op. 12');

            expectToBe(serializedHtml, '<em>Vier Lieder</em> op. 12');
        });
    });

    describe('#toTextContent()', () => {
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
