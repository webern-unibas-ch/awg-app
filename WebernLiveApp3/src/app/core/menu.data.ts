import { MenuModel } from './menu.model';

export const MENUDATA: MenuModel[] = [
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
