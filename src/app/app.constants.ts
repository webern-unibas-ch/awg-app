import { appHomepage, appVersion, appVersionReleaseDate } from './app.globals';

/**
 * Constant: APP_CONSTANTS.
 *
 * It keeps the app-wide constant values.
 */
export const APP_CONSTANTS = {
    /**
     * The URL of the Analytics endpoint
     * ({@link https://www.google-analytics.com/}).
     */
    ANALYTICS_ENDPOINT: 'https://www.googletagmanager.com/gtag/js',

    /**
     * The Analytics id ('G-XXXXXXXXXX').
     */
    ANALYTICS_ID: 'G-8KDNK9HM70',

    /**
     * The name of the AWG.
     */
    AWG_PROJECT_NAME: 'Anton Webern Gesamtausgabe',

    /**
     * The URL of the AWG project website
     * ({@link https://anton-webern.ch}).
     */
    AWG_PROJECT_URL: 'https://anton-webern.ch/',

    /**
     * The URL of the AWG edition website (awg-app)
     * ({@link https://edition.anton-webern.ch/}).
     */
    AWG_APP_URL: appHomepage,

    /**
     * The URL of the compodoc documentation
     * of the AWG edition website (awg-app)
     * ({@link compodoc/index.html}).
     */
    AWG_APP_COMPODOC_URL: 'compodoc/index.html',

    /**
     * The URL of the GitHub repository
     * of the AWG edition website (awg-app)
     * ({@link https://github.com/webern-unibas-ch/awg-app}).
     */
    AWG_APP_GITHUB_URL: 'https://github.com/webern-unibas-ch/awg-app',

    /**
     * The latest version of the AWG edition website (awg-app).
     */
    AWG_APP_VERSION: appVersion,

    /**
     * The release date of the latest version of the AWG edition website (awg-app).
     */
    AWG_APP_VERSION_RELEASE_DATE: appVersionReleaseDate,

    /**
     * The URL of the DaSCH
     * ({@link https://www.dasch.swiss}).
     */
    DASCH_URL: 'https://www.dasch.swiss/',

    /**
     * The URL of the DeepWiki
     * ({@link https://deepwiki.com/webern-unibas-ch/awg-app}).
     */
    DEEP_WIKI_URL: 'https://deepwiki.com/webern-unibas-ch/awg-app',

    /**
     * The URL of the DHLAB Basel
     * ({@link https://dhlab.philhist.unibas.ch}).
     */
    DHLAB_URL: 'https://dhlab.philhist.unibas.ch/',

    /**
     * The external link of the contact map.
     */
    CONTACT_MAP_LINK_URL: 'https://www.openstreetmap.org/?mlat=47.55897&mlon=7.58451#map=19/47.55897/7.58451',

    /**
     * The unsanitized embed link of the contact map.
     */
    CONTACT_MAP_UNSAFE_EMBED_URL:
        'https://www.openstreetmap.org/export/embed.html' +
        '?bbox=7.582175731658936%2C47.55789611508066%2C7.586840093135835%2C47.56003739001212' +
        '&layer=mapnik' +
        '&marker=47.55896585846639%2C7.584506571292877',

    /**
     * The URL of the Zenodo record
     * ({@link https://doi.org/10.5281/zenodo.4717678}).
     */
    AWG_APP_ZENODO_URL: 'https://doi.org/10.5281/zenodo.4717678',
} as const;
