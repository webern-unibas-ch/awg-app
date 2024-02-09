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
            id: '0',
            name: 'Test Property 0',
            valuetype_id: '14',
            attributes: null,
            vocabulary_id: '4',
            guielement_id: '14',
            is_annotation: '0',
            person_id: '5',
            shortname: 'test-onto',
            longname: 'Test Ontology',
            label: 'Test Property 0',
        },
        {
            id: '1',
            name: 'Test Property 1',
            valuetype_id: '4',
            attributes: null,
            vocabulary_id: '4',
            guielement_id: '7',
            is_annotation: '0',
            person_id: '5',
            shortname: 'test-onto',
            longname: 'Test Ontology',
            label: 'Test Property 1',
        },
        {
            id: '2',
            name: 'Test Property 2',
            valuetype_id: '14',
            attributes: null,
            vocabulary_id: '4',
            guielement_id: '14',
            is_annotation: '0',
            person_id: '100',
            shortname: 'test-onto',
            longname: 'Test Ontology',
            label: 'Test Property 2',
        },
        {
            id: '3',
            name: 'Test Property 3',
            valuetype_id: '14',
            attributes: null,
            vocabulary_id: '4',
            guielement_id: '14',
            is_annotation: '0',
            person_id: '100',
            shortname: 'test-onto',
            longname: 'Test Ontology',
            label: 'Test Property 3',
        },
    ],
};
