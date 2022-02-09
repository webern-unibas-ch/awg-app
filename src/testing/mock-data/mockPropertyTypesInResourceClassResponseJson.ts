/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Test helper data file: mockPropertyTypesInResourceClassResponseJson.
 *
 * It provides a mocked PropertyTypesInResourceClassResponseJson response
 * from the Salsah API.
 *
 * Exposed to be called from tests.
 */
export const mockPropertyTypesInResourceClassResponseJson = {
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
    properties: [
        {
            id: '206',
            name: 'alternative_name',
            valuetype_id: '14',
            attributes: null,
            vocabulary_id: '4',
            guielement_id: '14',
            is_annotation: '0',
            person_id: '5',
            shortname: 'webern-onto',
            longname: 'Anton Webern Ontology',
            label: 'Namensvariante',
        },
        {
            id: '217',
            name: 'authentic_date',
            valuetype_id: '4',
            attributes: null,
            vocabulary_id: '4',
            guielement_id: '7',
            is_annotation: '0',
            person_id: '5',
            shortname: 'webern-onto',
            longname: 'Anton Webern Ontology',
            label: 'gesicherte Datierung',
        },
        {
            id: '594',
            name: 'autograph_date',
            valuetype_id: '14',
            attributes: null,
            vocabulary_id: '4',
            guielement_id: '14',
            is_annotation: '0',
            person_id: '100',
            shortname: 'webern-onto',
            longname: 'Anton Webern Ontology',
            label: 'autographe Datierung',
        },
        {
            id: '655',
            name: 'bibl_abstract',
            valuetype_id: '14',
            attributes: null,
            vocabulary_id: '4',
            guielement_id: '14',
            is_annotation: '0',
            person_id: '100',
            shortname: 'webern-onto',
            longname: 'Anton Webern Ontology',
            label: 'Abstract',
        },
    ],
};
