import { AppConfig } from '@awg-app/app.config';
import { Meta } from '@awg-core/core-models';

export const METADATA: Meta = {
    page: {
        yearStart: 2015,
        yearRecent: new Date().getFullYear(),
        editionUrl: AppConfig.EDITION_HOME,
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
