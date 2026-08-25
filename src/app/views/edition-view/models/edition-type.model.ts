/**
 * The EDITION_TYPE_LABEL_MAP const.
 *
 * It is used in the context of the edition view
 * to map the technical edition type keys to their corresponding labels.
 */
export const EDITION_TYPE_LABEL_MAP = {
    workEditions: 'Werkeditionen',
    textEditions: 'Texteditionen',
    sketchEditions: 'Skizzeneditionen',
} as const;

/**
 * The EditionTypeKey type.
 *
 * It is used in the context of the edition view
 * to define a valid key for a single edition type.
 */
export type EditionTypeKey = keyof typeof EDITION_TYPE_LABEL_MAP;

/**
 * The EditionTypeLabel type.
 *
 * It is used in the context of the edition view
 * to define a valid label for a single edition type.
 */
export type EditionTypeLabel = (typeof EDITION_TYPE_LABEL_MAP)[EditionTypeKey];

/**
 * The EDITION_TYPE_KEYS const.
 *
 * It is used in the context of the edition view
 * to define the available keys for the edition types.
 */
export const EDITION_TYPE_KEYS = Object.keys(EDITION_TYPE_LABEL_MAP) as unknown as EditionTypeKey[];

/**
 * The EDITION_TYPE_LABELS const.
 *
 * It is used in the context of the edition view
 * to define the available labels for the edition types.
 */
export const EDITION_TYPE_LABELS = Object.values(EDITION_TYPE_LABEL_MAP) as unknown as EditionTypeLabel[];
