import { Injectable } from '@angular/core';

/**
 * The EditionSnippet service.
 *
 * It provides helper methods to process
 * comment strings with image snippet placeholders.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionSnippetService {
    /**
     * Private static readonly variable: SAFE_SNIPPET_ID_PATTERN.
     *
     * It keeps a regex pattern to validate safe svgGroupId values.
     */
    private static readonly SAFE_SNIPPET_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

    /**
     * Public method: getComment.
     *
     * It replaces each placeholder
     * `##Abbildung##` in a comment string with an image tag,
     * deriving the asset path from the given svgGroupId.
     * Multiple occurrences are disambiguated with an `a`, `b`, … suffix.
     *
     * @param {string} comment The given comment string.
     * @param {string | undefined} svgGroupId The given svgGroupId.
     * @returns {string} The comment string with placeholders replaced by image tags.
     */
    getComment(comment: string, svgGroupId?: string): string {
        if (!svgGroupId || !this._isSafeSnippetId(svgGroupId)) {
            return comment;
        }

        const placeholderPattern = /(?<!#)##Abbildung##(?!#)/g;
        const count = (comment.match(placeholderPattern) ?? []).length;
        let index = 0;
        return comment.replace(placeholderPattern, () => {
            const suffix = count > 1 ? String.fromCodePoint(97 + index) : '';
            index++;
            const id = `${svgGroupId}${suffix}`;
            const src = `assets/img/edition/snippets/${id}.png`;
            const alt = `Abbildung: ${id}`;
            const clickExpression = `ref.openSnippet(${JSON.stringify(src)}, ${JSON.stringify(id)})`;
            const keydownSpaceExpression = `$event.preventDefault();${clickExpression}`;

            const escapedSrc = this._escapeHtmlAttribute(src);
            const escapedAlt = this._escapeHtmlAttribute(alt);
            const escapedClick = this._escapeHtmlAttribute(clickExpression);
            const escapedKeydownSpace = this._escapeHtmlAttribute(keydownSpaceExpression);

            return [
                `<img src="${escapedSrc}" alt="${escapedAlt}" class="awg-edition-tkk-snippet"`,
                ` role="button" tabindex="0" aria-label="${escapedAlt}"`,
                ` (click)="${escapedClick}"`,
                ` (keydown.enter)="${escapedClick}"`,
                ` (keydown.space)="${escapedKeydownSpace}" />`,
            ].join('');
        });
    }

    /**
     * Private method: _isSafeSnippetId.
     *
     * It checks if the given value matches the SAFE_SNIPPET_ID_PATTERN.
     *
     * @param {string} value The given value to check.
     * @returns {boolean} True if the value is a safe snippet ID, false otherwise.
     */
    private _isSafeSnippetId(value: string): boolean {
        return EditionSnippetService.SAFE_SNIPPET_ID_PATTERN.test(value);
    }

    /**
     * Private method: _escapeHtmlAttribute.
     *
     * It escapes special characters in a string for safe use in HTML attributes.
     *
     * @param {string} value The given string to escape.
     * @returns {string} The escaped string.
     */
    private _escapeHtmlAttribute(value: string): string {
        return value
            .replaceAll('&', '&amp;')
            .replaceAll('"', '&quot;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll("'", '&#39;');
    }
}
