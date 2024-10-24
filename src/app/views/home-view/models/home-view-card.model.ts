/**
 * The HomeViewCard class.
 *
 * It is used in the context of the home view
 * to store the data for a home view card.
 */
export class HomeViewCard {
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
     * The router link for the home view card.
     */
    linkRouter?: string | any[];

    /**
     * The href for the home view card.
     */
    linkHref?: string;

    /**
     * The link text for the home view card.
     */
    linkText: string;
}
