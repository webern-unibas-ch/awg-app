import { MetaIdentifiers } from '../meta.model';

/**
 * The MetaIdentifierBadge interface.
 *
 * It defines the structure for a single identifier badge.
 */
export interface MetaIdentifierBadge {
    /**
     * The key corresponding to the specific authority identifier type.
     */
    key: keyof MetaIdentifiers;

    /**
     * The target URL the badge links to.
     */
    fullUrl: string;

    /**
     * The image source path for the badge icon.
     */
    src: string;

    /**
     * The label for the badge.
     */
    label: string;

    /**
     * The title text for the badge.
     */
    titleText: string;
}
