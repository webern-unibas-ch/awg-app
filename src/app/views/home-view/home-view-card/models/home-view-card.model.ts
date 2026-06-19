/**
 * The HomeViewCardInternalLink type.
 *
 * It is used in the context of the home view
 * to define the type for an internal link of a home view card.
 */
export interface HomeViewCardInternalLink {
    /**
     * The type of the link, which is 'internal' for internal links.
     */
    type: 'internal';

    /**
     * The route array for the internal link.
     */
    route: string[];
}

/**
 * The HomeViewCardExternalLink type.
 *
 * It is used in the context of the home view
 * to define the type for an external link of a home view card.
 */
export interface HomeViewCardExternalLink {
    /**
     * The type of the link, which is 'external' for external links.
     */
    type: 'external';

    /**
     * The href string for the external link.
     */
    href: string;
}

/**
 * The HomeViewCardLink type.
 *
 * It is used in the context of the home view
 * to define the type for the link of a home view card.
 */
export type HomeViewCardLink = HomeViewCardInternalLink | HomeViewCardExternalLink;

/**
 * The HomeViewCard interface.
 *
 * It is used in the context of the home view
 * to store the data for a home view card.
 */
export interface HomeViewCard {
    /**
     * The image source for the home view card.
     */
    imgSrc: string;

    /**
     * The image alt for the home view card.
     */
    imgAlt: string;

    /**
     * The title for the home view card.
     */
    title: string;

    /**
     * The text for the home view card.
     */
    text: string;

    /**
     * The link for the home view card.
     */
    link: HomeViewCardLink;

    /**
     * The link text for the home view card.
     */
    linkText: string;
}
