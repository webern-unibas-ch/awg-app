import { appHomepage, appVersion, appVersionReleaseDate } from './app.globals';

/**
 * App constants with app-wide constant values.
 */
export class AppConstants {
    /**
     * Static readonly variable: ANALYTICS_ENDPOINT.
     *
     * It keeps the URL of the Analytics endpoint
     * ({@link https://www.google-analytics.com/}).
     */
    static readonly ANALYTICS_ENDPOINT = 'https://www.googletagmanager.com/gtag/js';

    /**
     * Static readonly variable: ANALYTICS_ID.
     *
     * It keeps the Analytics id ('G-XXXXXXXXXX').
     */
    static readonly ANALYTICS_ID = 'G-8KDNK9HM70';

    /**
     * Static readonly variable: AWG_PROJECT_NAME.
     *
     * It keeps the name of the AWG.
     */
    static readonly AWG_PROJECT_NAME = 'Anton Webern Gesamtausgabe';

    /**
     * Static readonly variable: AWG_PROJECT_URL.
     *
     * It keeps the URL of the AWG project website
     * ({@link https://anton-webern.ch}).
     */
    static readonly AWG_PROJECT_URL = 'https://anton-webern.ch/';

    /**
     * Static readonly variable: AWG_APP_URL.
     *
     * It keeps the URL of the AWG edition website (awg-app)
     * ({@link https://edition.anton-webern.ch/}).
     */
    static readonly AWG_APP_URL: string = appHomepage;

    /**
     * Static readonly variable: AWG_APP_COMPODOC_URL.
     *
     * It keeps the URL of the compodoc documentation
     * of the AWG edition website (awg-app)
     * ({@link compodoc/index.html}).
     */
    static readonly AWG_APP_COMPODOC_URL = 'compodoc/index.html';

    /**
     * Static readonly variable: AWG_APP_GITHUB_URL.
     *
     * It keeps the URL of the GitHub repository
     * of the AWG edition website (awg-app)
     * ({@link https://github.com/webern-unibas-ch/awg-app}).
     */
    static readonly AWG_APP_GITHUB_URL = 'https://github.com/webern-unibas-ch/awg-app';

    /**
     * Static readonly variable: AWG_APP_VERSION.
     *
     * It keeps the latest version of the AWG edition website (awg-app).
     */
    static readonly AWG_APP_VERSION: string = appVersion;

    /**
     * Static readonly variable: AWG_APP_VERSION_RELEASE_DATE.
     *
     * It keeps the release date of the latest version of the AWG edition website (awg-app).
     */
    static readonly AWG_APP_VERSION_RELEASE_DATE: string = appVersionReleaseDate;

    /**
     * Static readonly variable: DASCH_URL.
     *
     * It keeps the URL of the DaSCH
     * ({@link https://www.dasch.swiss}).
     */
    static readonly DASCH_URL = 'https://www.dasch.swiss/';

    /**
     * Static readonly variable: DEEP_WIKI_URL.
     *
     * It keeps the URL of the DeepWiki
     * ({@link https://deepwiki.com/webern-unibas-ch/awg-app}).
     */
    static readonly DEEP_WIKI_URL = 'https://deepwiki.com/webern-unibas-ch/awg-app';

    /**
     * Static readonly variable: DHLAB_URL.
     *
     * It keeps the URL of the DHLAB Basel
     * ({@link https://dhlab.philhist.unibas.ch}).
     */
    static readonly DHLAB_URL = 'https://dhlab.philhist.unibas.ch/';

    /**
     * Static readonly variable: CONTACT_MAP_LINK_URL.
     *
     * It keeps the external link of the contact map.
     */
    static readonly CONTACT_MAP_LINK_URL =
        'https://www.openstreetmap.org/?mlat=47.55897&mlon=7.58451#map=19/47.55897/7.58451';

    /**
     * Static readonly variable: CONTACT_MAP_UNSAFE_EMBED_URL.
     *
     * It keeps the unsanitized embed link of the contact map.
     */
    static readonly CONTACT_MAP_UNSAFE_EMBED_URL =
        'https://www.openstreetmap.org/export/embed.html' +
        '?bbox=7.582175731658936%2C47.55789611508066%2C7.586840093135835%2C47.56003739001212' +
        '&layer=mapnik' +
        '&marker=47.55896585846639%2C7.584506571292877';

    /**
     * Static readonly variable: AWG_APP_ZENODO_URL.
     *
     * It keeps the URL of the Zenodo record
     * ({@link https://doi.org/10.5281/zenodo.4717678}).
     */
    static readonly AWG_APP_ZENODO_URL = 'https://doi.org/10.5281/zenodo.4717678';
}
