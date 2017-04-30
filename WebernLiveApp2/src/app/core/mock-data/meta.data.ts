import { Meta } from '../models';

export const METADATA: Meta[] = [
    {
        page: {
            yearStart: 2015,
            yearRecent: (new Date()).getFullYear(),
            // TODO: change to 0.1.0 with current date
            version: '0.0.9', //RELEASE 21.11.2016
            versionReleaseDate: '21. November 2016'
        },
        edition: {
            editors: '<a href="http://anton-webern.ch/index.php?id=3" target="_blank">Thomas Ahrend</a>',
            lastModified: '29. Januar 2016'
        }
    }
];
