/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Test helper data file: mockResourceDetail.
 *
 * It provides a mocked ResourceDetail
 * response from the conversion service.
 *
 * Exposed to be called from tests.
 */
export const mockResourceDetail = {
    header: {
        objID: '2173561',
        icon: 'https://www.salsah.org:443/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=125',
        type: 'Supplement',
        lastmod: '2017-12-05 15:16:17',
        title: '[Programm:] Sdružení pro soudobou houdbu v Praze<br/>[Mi] 9. Jan 1935',
    },
    content: {
        props: [
            {
                pid: '1',
                guielement: 'text',
                label: 'Title',
                values: ['[Programm:] Sdružení pro soudobou houdbu v Praze'],
            },
            {
                pid: '597',
                guielement: 'pulldown',
                label: 'Art',
                values: ['Programm'],
            },
            {
                pid: '25',
                guielement: 'text',
                label: 'Creator',
                values: [''],
            },
            {
                pid: '43',
                guielement: 'text',
                label: 'Ort',
                values: ['Prag'],
            },
            {
                pid: '46',
                guielement: 'date',
                label: 'Date',
                values: ['[Mi] 9. Jan 1935'],
            },
            {
                pid: '200',
                guielement: 'richtext',
                label: 'Standort des physischen Originals',
                values: [null],
            },
            {
                pid: '192',
                guielement: 'richtext',
                label: 'Beschreibung',
                values: [null],
            },
            {
                pid: '221',
                guielement: 'richtext',
                label: 'Inhalt',
                values: ['<p>[Programm:] Sdružení pro soudobou houdbu v Praze</p>'],
            },
            {
                pid: '604',
                guielement: 'richtext',
                label: 'Transkription',
                values: [null],
            },
            {
                pid: '92',
                guielement: 'richtext',
                label: 'Literaturnachweis',
                values: [null],
            },
            {
                pid: '603',
                guielement: 'richtext',
                label: 'andere Quellen',
                values: [null],
            },
            {
                pid: '193',
                guielement: 'richtext',
                label: 'Quelle',
                values: [null],
            },
            {
                pid: '199',
                guielement: 'richtext',
                label: 'Kommentar',
                values: [null],
            },
        ],
        images: [
            {
                small: 'https://www.salsah.org:443/core/sendlocdata.php?res=2173574&qtype=full&reduce=3',
                medium: 'https://www.salsah.org:443/core/sendlocdata.php?res=2173574&qtype=full&reduce=3',
                big: 'https://www.salsah.org:443/core/sendlocdata.php?res=2173574&qtype=full&reduce=0',
                description: 'Programm_Prag19350109_op7-1.jpg',
                url: 'https://www.salsah.org:443/core/sendlocdata.php?res=2173574&qtype=full&reduce=0',
                label: 'Programm_Prag_19350109_Bild_1_2',
            },
            {
                small: 'https://www.salsah.org:443/core/sendlocdata.php?res=2173577&qtype=full&reduce=3',
                medium: 'https://www.salsah.org:443/core/sendlocdata.php?res=2173577&qtype=full&reduce=3',
                big: 'https://www.salsah.org:443/core/sendlocdata.php?res=2173577&qtype=full&reduce=0',
                description: 'Programm_Prag19350109_op7-2.jpg',
                url: 'https://www.salsah.org:443/core/sendlocdata.php?res=2173577&qtype=full&reduce=0',
                label: 'Programm_Prag_19350109_Bild_2_2',
            },
        ],
        incoming: [
            {
                restypeLabel: 'Chronologie',
                links: [
                    {
                        id: '2173508',
                        value: 'Vier Stücke für Geige und Klavier op. 7: Aufführung (Egon Ledeč, Vl.;  Karel Reiner, Klav.). Programm: Webern, op. 7; Leopold Spinner, Zwei kleine Stücke für Geige und Klavier (1934); Ernst Kanitz, Fünf Tänze für Klavier, Nr. 1 und 3; Hans Erich Apostel, Sonatina ritmica op. 5; Egon Wellesz, Sonate für Violine solo op. 36; Ernst Krenek, Toccata und Chaconne für Klavier op. 13; Paul Amadeus Pisk, Rondo-Suite für Violine und Klavier op. 27.\r',
                        restype: {
                            id: '28',
                            label: 'Chronologie',
                            icon: 'https://www.salsah.org:443/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=28',
                        },
                    },
                ],
            },
        ],
    },
};
