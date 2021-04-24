/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Test helper data file: mockSearchResponseJson.
 *
 * It provides a mocked SearchResponseJson response
 * from the Salsah API.
 *
 * Exposed to be called from tests.
 */
export const mockSearchResponseJson = {
    status: 0,
    userdata: {
        lang: 'en',
        email: undefined,
        givenName: undefined,
        familyName: undefined,
        password: undefined,
        status: undefined,
        token: undefined,
        user_id: undefined,
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
            iconsrc: 'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            icontitle: 'Bibliografie',
            obj_id: '1230',
            preview_path:
                'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            preview_nx: undefined,
            preview_ny: undefined,
            rights: undefined,
            value: ['Auer 2017'],
            valuelabel: ['Kurztitel'],
            valuetype_id: ['1'],
        },
        {
            iconlabel: 'Bibliografie',
            iconsrc: 'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            icontitle: 'Bibliografie',
            obj_id: '1231',
            preview_path:
                'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            preview_nx: undefined,
            preview_ny: undefined,
            rights: undefined,
            value: ['Nelson 1974'],
            valuelabel: ['Kurztitel'],
            valuetype_id: ['1'],
        },
        {
            iconlabel: 'Bibliografie',
            iconsrc: 'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            icontitle: 'Bibliografie',
            obj_id: '1232',
            preview_path:
                'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            preview_nx: undefined,
            preview_ny: undefined,
            rights: undefined,
            value: ['Test'],
            valuelabel: ['Kurztitel'],
            valuetype_id: ['1'],
        },
        {
            iconlabel: 'Bibliografie',
            iconsrc: 'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            icontitle: 'Bibliografie',
            obj_id: '1233',
            preview_path:
                'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            preview_nx: undefined,
            preview_ny: undefined,
            rights: undefined,
            value: ['BrownJ 2014'],
            valuelabel: ['Kurztitel'],
            valuetype_id: ['1'],
        },
        {
            iconlabel: 'Bibliografie',
            iconsrc: 'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            icontitle: 'Bibliografie',
            obj_id: '1234',
            preview_path:
                'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=126',
            preview_nx: undefined,
            preview_ny: undefined,
            rights: undefined,
            value: ['Oliveira Sampaio 2000'],
            valuelabel: ['Kurztitel'],
            valuetype_id: ['1'],
        },
    ],
    thumb_max: {
        nx: 32,
        ny: 32,
    },
};
