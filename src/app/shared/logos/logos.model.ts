/**
 * The Logo interface.
 *
 * It defines the structure of a single logo object.
 */
export interface Logo {
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
 * The LogoKeys type.
 *
 * It defines the valid keys for the logos used in the app.
 */
export type LogoKeys =
    'angular' | 'awg' | 'bootstrap' | 'github' | 'gnd' | 'orcid' | 'sagw' | 'snf' | 'sparql' | 'unibas' | 'viaf';

/**
 * The Logos type.
 *
 * It defines a dictionary of logo objects,
 * mapped by the valid LogoKeys.
 */
export type Logos = {
    /**
     * The collection of logos mapped by their keys.
     */
    [key in LogoKeys]?: Logo;
};
