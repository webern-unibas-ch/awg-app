import { Card } from './cards.model';

export const SEARCHCARDDATA: Card[] = [
    {
        label: 'fulltext',
        title: 'Volltextsuche',
        icon: 'search',
        image: 'https://source.unsplash.com/ABAmxzlot8E/', // 'assets/img/search/search-fulltext.jpeg',
        linkTo: 'fulltext'
    },
    {
        label: 'timeline',
        title: 'Timeline',
        icon: 'timeline',
        image: 'https://source.unsplash.com/r-EecLdRRww/', // assets/img/search/search-timeline.jpeg',
        linkTo: 'timeline'
    },
    {
        label: 'bibliography',
        title: 'Bibliographie',
        icon: 'library_books',
        image: 'https://source.unsplash.com/sfL_QOnmy00/', // assets/img/search/search-bibliography.jpeg',
        linkTo: 'bibliography'
    }
];
