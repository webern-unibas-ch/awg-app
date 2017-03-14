import { MenuModel } from './menu.model';

export const MENUDATA: MenuModel[] = [
    {
        label: 'Projekt',
        linkTo: '/project',
        subMenu: [
            { label: 'Übersicht', linkTo: 'overview' },
            { label: 'Mitarbeitende', linkTo: 'team' },
            { label: 'Editorial Board', linkTo: 'board' },
            { label: 'Kooperationen', linkTo: 'cooperations' }
        ]
    },
    {
        label: 'Anton Webern',
        linkTo: '/webern',
        subMenu: [
            { label: 'Übersicht', linkTo: 'overview' },
            { label: 'Chronologie', linkTo: 'chronology' },
            { label: 'Briefe', linkTo: 'correspondence' },
            { label: 'Personen', linkTo: 'persons' }
        ]
    },
    {
        label: 'Werke',
        linkTo: '/works',
        subMenu: [
            {label: 'Übersicht', linkTo: 'overview'},
            {label: 'Opuszahl', linkTo: 'opus'},
            {label: 'Moldenhauer-Nr.', linkTo: 'moldenhauer'}
        ]
    },
    {
        label: 'Edition',
        linkTo: '/edition',
        subMenu: [
            { label: 'Übersicht', linkTo: 'overview' },
            { label: 'Gliederung', linkTo: 'outline' },
            { label: 'Print-Edition', linkTo: 'print' },
            { label: 'Online-Edition', linkTo: 'online' }
        ]
    },
    {
        label: 'Forschung',
        linkTo: '/research',
        subMenu: [
            { label: 'Übersicht', linkTo: 'overview' },
            { label: 'Webern-Studien', linkTo: 'studies' },
            { label: 'Webern Vorträge', linkTo: 'lectures' },
            { label: 'Tagungen', linkTo: 'conferences' },
            { label: 'Archive', linkTo: 'archives' },
            { label: 'Weitere Aktivitäten', linkTo: 'activities' }
        ]
    }
];
