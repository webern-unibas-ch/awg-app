import { Menu } from '../models';

export const MENUDATA: Menu[] = [
    {
        label: 'Home',
        linkTo: '/home',
        subMenu: [
            { label: 'Übersicht', linkTo: 'overview' },
            { label: 'Datenstruktur', linkTo: 'structure' }
        ]
    },
    {
        label: 'Beispieledition',
        linkTo: '/edition',
        subMenu: [
            { label: 'Übersicht', linkTo: 'overview' },
            { label: 'Einleitung', linkTo: 'intro' },
            { label: 'Edierter Notentext', linkTo: 'detail' },
            { label: 'Kritischer Bericht', linkTo: 'report' }
        ]
    },
    {
        label: 'Suche',
        linkTo: '/search',
        subMenu: [
            { label: 'Übersicht', linkTo: 'overview' },
            { label: 'Volltext-Suche', linkTo: 'fulltext' },
            { label: 'Timeline', linkTo: 'timeline' },
            { label: 'Bibliographie', linkTo: 'bibliography' }
        ]
    }
];
