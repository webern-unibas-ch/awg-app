/**
 * Test helper data file: mockResourceFullResponseJson.
 *
 * It provides a mocked ResourceFullResponseJson response
 * from the Salsah API.
 *
 * Exposed to be called from tests.
 */
export const mockResourceFullResponseJson = {
    resinfo: {
        project_id: '6',
        person_id: '30',
        restype_id: '36',
        handle_id: null,
        restype_name: 'webern:musical_piece',
        restype_label: 'Musikstück (Moldenhauer-Nummer)',
        restype_description: 'einzelnes Musikstück (identifiziert durch Moldenhauer-Nummer)',
        restype_iconsrc:
            'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=36',
        preview: null,
        locations: null,
        locdata: null,
        resclass_name: 'object',
        resclass_has_location: false,
        lastmod: '2017-04-04 15:25:54',
        lastmod_utc: '2017-04-04 13:25:54',
        value_of: 0
    },
    resdata: {
        res_id: '11398',
        restype_name: 'webern:musical_piece',
        restype_label: 'Musikstück (Moldenhauer-Nummer)',
        iconsrc: 'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=36',
        resclass_name: 'object',
        rights: '2'
    },
    props: {
        'webern:mnr': {
            pid: '93',
            regular_property: 1,
            valuetype_id: '2',
            guielement: 'text',
            is_annotation: '0',
            label: 'Moldenhauer-Nummer',
            attributes: null,
            occurrence: '1',
            values: ['21'],
            value_ids: ['67657'],
            comments: [''],
            value_rights: ['1'],
            value_iconsrcs: [''],
            value_restype: [''],
            value_firstprops: ['']
        },
        'dc:title': {
            pid: '1',
            regular_property: 1,
            valuetype_id: '1',
            guielement: 'text',
            is_annotation: '0',
            label: 'Title',
            attributes: 'size=80;maxlength=255',
            occurrence: '0-n',
            values: ['"Du träumst so süss im Sommerwind" '],
            value_ids: ['67651'],
            comments: [''],
            value_rights: ['1'],
            value_iconsrcs: [''],
            value_restype: [''],
            value_firstprops: ['']
        },
        'webern:date_composition': {
            pid: '97',
            regular_property: 1,
            valuetype_id: '4',
            guielement: 'date',
            is_annotation: '0',
            label: 'Datum der Komposition',
            attributes: null,
            occurrence: '0-1',
            values: [
                {
                    dateval1: '2416116',
                    dateval2: '2416480',
                    calendar: 'GREGORIAN',
                    dateprecision1: 'YEAR',
                    dateprecision2: 'YEAR'
                }
            ],
            value_ids: ['67654'],
            comments: ['1903] '],
            value_rights: ['1'],
            value_iconsrcs: [''],
            value_restype: [''],
            value_firstprops: ['']
        },
        'webern:performance': {
            pid: '94',
            regular_property: 1,
            valuetype_id: '6',
            guielement: 'searchbox',
            is_annotation: '0',
            label: 'Aufführungen',
            attributes: 'restypeid=28;numprops=1',
            occurrence: '0-n'
        },
        'webern:date_firstpublication': {
            pid: '96',
            regular_property: 1,
            valuetype_id: '4',
            guielement: 'date',
            is_annotation: '0',
            label: 'Datum der Erstpublikation',
            attributes: null,
            occurrence: '0-1'
        },
        'webern:firstpublisher': {
            pid: '95',
            regular_property: 1,
            valuetype_id: '1',
            guielement: 'text',
            is_annotation: '0',
            label: 'Erstverlag',
            attributes: null,
            occurrence: '0-1'
        },
        'webern:instrumentation_rt': {
            pid: '196',
            regular_property: 1,
            valuetype_id: '14',
            guielement: 'richtext',
            is_annotation: '0',
            label: 'Besetzung',
            attributes: null,
            occurrence: '0-1',
            values: [
                {
                    utf8str: 'Ges, Kl',
                    textattr: '{}',
                    resource_reference: [],
                    resid: '26396'
                }
            ],
            value_ids: ['135434'],
            comments: [''],
            value_rights: ['1'],
            value_iconsrcs: [''],
            value_restype: [''],
            value_firstprops: ['']
        },
        'dc:source_rt': {
            pid: '193',
            regular_property: 1,
            valuetype_id: '14',
            guielement: 'richtext',
            is_annotation: '0',
            label: 'Quelle (Richtext)',
            attributes: null,
            occurrence: '0-n',
            values: [
                {
                    utf8str:
                        '["Du träumst so süss im Sommerwind": Skizze, 2 S., Bleistift mit zahlreichen Korrekturen] Stiftung Martin Bodmer-Bibliotheca Bodmeriana / Genf (Signatur Ms 11706)\r',
                    textattr: '{"p":[{"start":0,"end":163}]}',
                    resource_reference: [],
                    resid: '2426569'
                }
            ],
            value_ids: ['135430'],
            comments: [''],
            value_rights: ['1'],
            value_iconsrcs: [''],
            value_restype: [''],
            value_firstprops: ['']
        },
        'webern:textsource_rt': {
            pid: '198',
            regular_property: 1,
            valuetype_id: '14',
            guielement: 'richtext',
            is_annotation: '0',
            label: 'Textquelle',
            attributes: null,
            occurrence: '0-n',
            values: [
                {
                    utf8str:
                        'Franz Evers, Erntelieder, Leipzig 1901. (Vgl. auch Conrad Ansorge, Erntelieder op. 18, Berlin 1908: Nr. 3.)\r',
                    textattr: '{"italic":[{"start":13,"end":24},{"start":67,"end":78}],"p":[{"start":0,"end":108}]}',
                    resource_reference: [],
                    resid: '2426570'
                }
            ],
            value_ids: ['135438'],
            comments: [''],
            value_rights: ['1'],
            value_iconsrcs: [''],
            value_restype: [''],
            value_firstprops: ['']
        },
        'salsah:comment_rt': {
            pid: '199',
            regular_property: 1,
            valuetype_id: '14',
            guielement: 'richtext',
            is_annotation: '1',
            label: 'Kommentar (Richtext)',
            attributes: null,
            occurrence: '0-n',
            values: [
                {
                    utf8str: 'Moldenhauer 1980, S. 655, liest "Du träumst so heiß im Sommerwind".\r',
                    textattr: '{"p":[{"start":0,"end":68}]}',
                    resource_reference: [],
                    resid: '2426571'
                }
            ],
            value_ids: ['135442'],
            comments: [''],
            value_rights: ['1'],
            value_iconsrcs: [''],
            value_restype: [''],
            value_firstprops: ['']
        }
    },
    incoming: [],
    access: 'OK',
    status: 0,
    userdata: {
        lang: 'en',
        language_id: '4',
        PHPSESSION: 'TRUE'
    }
};
