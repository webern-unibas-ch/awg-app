/**
 * Object constant: EDITION_COMPLEX_PLACEHOLDER_SUBJECTS.
 *
 * It keeps the subject (with its verb) of the placeholder per placeholder type.
 */
export const EDITION_COMPLEX_PLACEHOLDER_SUBJECTS = {
    graph: { subject: 'Die Graph-Visualisierungen', verb: 'erscheinen' },
    intro: { subject: 'Die Einleitung', verb: 'erscheint' },
    sourceEvaluation: { subject: 'Die Quellenbewertung', verb: 'erscheint' },
} as const;

/**
 * The EditionComplexPlaceholderType type.
 *
 * It represents the type of an edition complex placeholder.
 */
export type EditionComplexPlaceholderType = keyof typeof EDITION_COMPLEX_PLACEHOLDER_SUBJECTS;
