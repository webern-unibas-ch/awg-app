import abbreviationsData from 'assets/data/edition/abbreviations.json';

/**
 * Object constant: ABBREVIATIONS.
 *
 * It keeps abbreviations and their full forms by abbreviation key.
 */
const ABBREVIATIONS: Record<string, string> = abbreviationsData.abbreviations;

/**
 * Object constant: ABBREVIATIONS_PATTERN.
 *
 * It keeps a regex pattern to match abbreviations in text.
 * Abbreviations are sorted by length in descending order to
 * ensure that longer abbreviations are matched first.
 */
const ABBREVIATIONS_PATTERN = Object.keys(ABBREVIATIONS)
    .sort((left, right) => right.length - left.length)
    .map(abbreviation => abbreviation.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
    .join('|');

/**
 * Utils method: applyAbbreviations.
 *
 * It replaces abbreviation matches in an element's text nodes with <abbr> elements.
 *
 * @param root The element whose text nodes should be processed.
 * @returns Wraps abbreviation matches in the element.
 */
export function applyAbbreviations(root: HTMLElement): void {
    const doc = root.ownerDocument;
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: node =>
            // Skip text nodes that are inside an <abbr> element to avoid double wrapping
            node.parentElement?.closest('abbr') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });

    const textNodes: Text[] = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode as Text);
    }

    const regex = new RegExp(String.raw`(?<!\w)(${ABBREVIATIONS_PATTERN})(?!\w)`, 'g');

    textNodes.forEach(textNode => {
        const parts = textNode.data.split(regex);

        if (parts.length === 1) {
            return;
        }

        const fragment = doc.createDocumentFragment();

        parts
            .filter(Boolean)
            .map(part => {
                const explanation = ABBREVIATIONS[part];
                if (!explanation) {return doc.createTextNode(part);}

                const abbr = doc.createElement('abbr');
                abbr.title = explanation;
                abbr.textContent = part;
                return abbr;
            })
            .forEach(node => fragment.append(node));

        textNode.parentNode?.replaceChild(fragment, textNode);
    });
}

/**
 * Utils constants: ABBR_UTILS.
 *
 * It keeps a namespace reference to the abbreviation utility methods.
 */
export const ABBR_UTILS = {
    applyAbbreviations,
} as const;
