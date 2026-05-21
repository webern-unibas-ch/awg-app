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
     * Public method: getComment.
     *
     * It replaces each placeholder
     * `##Abbildung##` in a comment string with an image tag,
     * deriving the asset path from the given svgGroupId.
     * Multiple occurrences are disambiguated with an `a`, `b`, … suffix.
     *
     * @param {string} comment The given comment string.
     * @param {string} svgGroupId The given svgGroupId.
     * @returns {string} The comment string with placeholders replaced by image tags.
     */
    getComment(comment: string, svgGroupId: string): string {
        const count = (comment.match(/##Abbildung##/g) ?? []).length;
        let index = 0;
        return comment.replace(/##Abbildung##/g, () => {
            const suffix = count > 1 ? String.fromCharCode(97 + index) : '';
            index++;
            const id = `${svgGroupId}${suffix}`;
            const src = `assets/img/edition/snippets/${id}.png`;
            return `<img src="${src}" alt="##Abbildung##" class="awg-edition-tkk-snippet" (click)="ref.openSnippet('${src}', '${id}')" />`;
        });
    }
}
