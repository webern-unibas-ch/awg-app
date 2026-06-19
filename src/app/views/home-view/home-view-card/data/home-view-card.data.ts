import { HomeViewCard } from '../models/home-view-card.model';

/**
 * The HOME_VIEW_CARD_DATA constant.
 *
 * It contains the data for the home view cards.
 */
export const HOME_VIEW_CARD_DATA: HomeViewCard[] = [
    {
        title: 'Editionsübersicht',
        text: 'Entdecken Sie die Online-Edition und ihre Inhalte.',
        imgSrc: 'assets/img/home/edition_sample.jpg',
        imgAlt: 'Edition Overview',
        link: { type: 'internal', route: ['/edition', 'series'] },
        linkText: 'Zur Editionsübersicht',
    },
    {
        title: 'Graph-Visualisierungen (beta)',
        text: 'Erkunden Sie die graphische Repräsentation der Editionsdaten.',
        imgSrc: 'assets/img/home/graph_sample.png',
        imgAlt: 'Graph',
        link: { type: 'internal', route: ['/edition', 'complex', 'op25', 'graph'] },
        linkText: 'Zu den Graph-Visualisierungen',
    },
    {
        title: 'Datenbank-Suche (DSP)',
        text: 'Finden Sie biografische und werkgeschichtliche Kontextinformationen in der DSP-Datenbank.',
        imgSrc: 'assets/img/home/database_sample.png',
        imgAlt: 'Search',
        link: { type: 'external', href: 'https://app.dasch.swiss/project/ot7I2nU-SdeXIf17LX_h3g' },
        linkText: 'Zur Datenbank-Suche',
    },
    {
        title: 'Anton Webern Gesamtausgabe',
        text: 'Informieren Sie sich über die Anton Webern Gesamtausgabe, die Webern-Forschung und Anton Webern.',
        imgSrc: 'assets/img/home/awg.jpg',
        imgAlt: 'Edition Project',
        link: { type: 'external', href: 'https://anton-webern.ch/' },
        linkText: 'Zur Projekt-Website',
    },
];
