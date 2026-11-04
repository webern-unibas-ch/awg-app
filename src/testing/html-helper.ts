/**
 * Test helper function: toInnerHtml.
 *
 * It returns the given HTML string as the browser serializes it
 * (e.g. a no-break space as `&nbsp;`), to compare it with the innerHTML of a rendered element.
 *
 * @param {string} html The given HTML string.
 * @returns {string} The serialized HTML string.
 */
export function toInnerHtml(html: string): string {
    const spanEl = document.createElement('span');
    spanEl.innerHTML = html;
    return spanEl.innerHTML;
}

/**
 * Test helper function: toTextContent.
 *
 * It returns the text content of the given HTML string (without tags, entities resolved),
 * to compare it with the textContent of a rendered element.
 *
 * @param {string} html The given HTML string.
 * @returns {string} The text content.
 */
export function toTextContent(html: string): string {
    const spanEl = document.createElement('span');
    spanEl.innerHTML = html;
    return spanEl.textContent;
}
