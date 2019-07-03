import { AppConfig } from '@awg-app/app.config';
import { Meta } from '@awg-core/core-models';

/**
 * Object constant for metadata.
 *
 * It provides metadata used throughout different parts of the app.
 *
 * Available main sections: `page`, `edition`, `structure`.
 */
export const METADATA: Meta = {
    page: {
        yearStart: 2015,
        yearCurrent: new Date().getFullYear(),
        editionUrl: AppConfig.EDITION_HOME,
        githubUrl: AppConfig.GITHUB_HOME,
        compodocUrl: AppConfig.COMPODOC_HOME,
        webernUrl: AppConfig.WEBERN_HOME,
        version: AppConfig.VERSION,
        versionReleaseDate: AppConfig.VERSION_RELEASE_DATE
    },
    edition: {
        editors:
            '<a href="' +
            AppConfig.WEBERN_HOME +
            'index.php?id=3" target="_blank" ref="noopener noreferrer">Thomas Ahrend</a>',
        lastModified: '29. Januar 2016'
    },
    structure: {
        author: 'Stefan Münnich',
        lastModified: '29. Januar 2016'
    }
};
