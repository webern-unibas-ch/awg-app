/**
 * The Logo class.
 *
 * It is used in the context of the app framework
 * to store the data for a single logo.
 */
export class Logo {
    /**
     * The id of the logo.
     */
    id: string;

    /**
     * The image source (url) of the logo.
     */
    src: string;

    /**
     * The alternative image text of the logo.
     */
    alt: string;

    /**
     * The href attribute (url) of the logo (triggered on click).
     */
    href: string;
}

/**
 * The Logos class.
 *
 * It is used in the context of the app framework
 * to store the data for all logos.
 */
export class Logos {
    /**
     * The array of logos.
     */
    [key: string]: Logo;
}
