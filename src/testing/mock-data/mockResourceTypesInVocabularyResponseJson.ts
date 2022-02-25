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
            id: '43',
            label: 'Work [Anton Webern Ontology]',
            properties: [
                {
                    id: '389',
                    label: 'Opus',
                },
                {
                    id: '1',
                    label: 'Title',
                },
                {
                    id: '856',
                    label: 'Gemeinsame Normdatei (GND)',
                },
                {
                    id: '97',
                    label: 'Datum der Komposition',
                },
                {
                    id: '94',
                    label: 'Aufführungen',
                },
                {
                    id: '96',
                    label: 'Datum der Erstpublikation',
                },
                {
                    id: '224',
                    label: 'Erstverlag (Richtext)',
                },
                {
                    id: '226',
                    label: 'Datum weitere Publikation',
                },
                {
                    id: '225',
                    label: 'weiterer Verlag',
                },
                {
                    id: '196',
                    label: 'Besetzung',
                },
                {
                    id: '193',
                    label: 'Quelle (Richtext)',
                },
                {
                    id: '896',
                    label: 'weitere, für die Edition nicht relevante Quelle',
                },
                {
                    id: '198',
                    label: 'Textquelle',
                },
                {
                    id: '204',
                    label: 'hat Satz',
                },
                {
                    id: '199',
                    label: 'Kommentar (Richtext)',
                },
            ],
        },
    ],
};
