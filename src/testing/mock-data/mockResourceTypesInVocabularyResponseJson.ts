/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Test helper data file: mockResourceTypesInVocabularyResponseJson.
 *
 * It provides a mocked ResourceTypesInVocabularyResponseJson response
 * from the Salsah API.
 *
 * Exposed to be called from tests.
 */
export const mockResourceTypesInVocabularyResponseJson = {
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
    resourcetypes: [
        {
            id: '0',
            label: 'Test Resource Type 0',
            properties: [
                {
                    id: '0',
                    label: 'Test Property 0',
                },
                {
                    id: '1',
                    label: 'Test Property 1',
                },
                {
                    id: '2',
                    label: 'Test Property 2',
                },
            ],
        },
        {
            id: '1',
            label: 'Test Resource Type 1',
            properties: [
                {
                    id: '3',
                    label: 'Test Property 3',
                },
                {
                    id: '4',
                    label: 'Test Property 4',
                },
            ],
        },
    ],
};
