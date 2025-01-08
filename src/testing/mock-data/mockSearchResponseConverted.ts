/**
 * Test helper data file: mockSearchResponseConverted.
 *
 * It provides a mocked conversion of a SearchResponseJson
 * response from the Salsah API.
 *
 * Exposed to be called from tests.
 */
export const mockSearchResponseConverted = {
    status: 0,
    userdata: {
        lang: 'en',
    },
    nhits: '5',
    paging: [
        {
            current: true,
            show_nrows: 10,
            start_at: 0,
        },
    ],
    subjects: [
        {
            iconlabel: 'Bibliografie',
            iconsrc: 'https://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            icontitle: 'Bibliografie',
            obj_id: '1234',
            preview_path:
                'https://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            value: ['Test'],
            valuelabel: ['Kurztitel'],
            valuetype_id: ['1'],
        },
        {
            iconlabel: 'Bibliografie',
            iconsrc: 'https://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            icontitle: 'Bibliografie',
            obj_id: '2225189',
            preview_path:
                'https://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            value: ['Oliveira Sampaio 2000'],
            valuelabel: ['Kurztitel'],
            valuetype_id: ['1'],
        },
        {
            iconlabel: 'Bibliografie',
            iconsrc: 'https://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            icontitle: 'Bibliografie',
            obj_id: '2233403',
            preview_path:
                'https://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            value: ['Nelson 1974'],
            valuelabel: ['Kurztitel'],
            valuetype_id: ['1'],
        },
        {
            iconlabel: 'Bibliografie',
            iconsrc: 'https://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            icontitle: 'Bibliografie',
            obj_id: '2430568',
            preview_path:
                'https://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            value: ['BrownJ 2014'],
            valuelabel: ['Kurztitel'],
            valuetype_id: ['1'],
        },
        {
            iconlabel: 'Bibliografie',
            iconsrc: 'https://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            icontitle: 'Bibliografie',
            obj_id: '2516682',
            preview_path:
                'https://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            value: ['Auer 2017'],
            valuelabel: ['Kurztitel'],
            valuetype_id: ['1'],
        },
    ],
    thumb_max: {
        nx: 32,
        ny: 32,
    },
};
