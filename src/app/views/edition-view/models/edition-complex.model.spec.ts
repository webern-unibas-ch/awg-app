import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import {
    EDITION_CATALOGUE_TYPE_CONSTANTS,
    EDITION_ROUTE_CONSTANTS,
    EditionRouteConstant,
} from '../edition-routes.constants';

import { EditionComplex, EditionComplexPubStatement } from './edition-complex.model';

describe('EditionComplex (DONE)', () => {
    const defaultResp = { editors: [], lastModified: '---' };
    const defaultPub = { series: '1', section: '5' };

    describe('... should create an edition complex with', () => {
        it.each([
            { desc: 'opus number', catalogueType: 'OPUS', expectedType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS },
            { desc: 'M number', catalogueType: 'MNR', expectedType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR },
            { desc: 'M* number', catalogueType: 'MNR_X', expectedType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR_X },
            { desc: 'unknown catalogue type', catalogueType: 'BWV', expectedType: new EditionRouteConstant() },
        ])('... $desc', ({ catalogueType, expectedType }) => {
            const complex = new EditionComplex(
                { title: 'Test Complex', catalogueType, catalogueNumber: '100' },
                defaultResp,
                defaultPub
            );

            expectToEqual(complex.titleStatement.catalogueType, expectedType);
            expectToBe(complex.complexId.route, `${expectedType.route}100`);
            expectToBe(
                complex.baseRoute,
                `${EDITION_ROUTE_CONSTANTS.EDITION.route}${EDITION_ROUTE_CONSTANTS.COMPLEX.route}${expectedType.route}100`
            );
        });
    });

    it('... should replace slashes in the catalogue number for the complex route', () => {
        const complex = new EditionComplex(
            { title: 'Test Complex', catalogueType: 'MNR', catalogueNumber: '100/2' },
            defaultResp,
            defaultPub
        );

        expectToBe(complex.complexId.route, `${EDITION_CATALOGUE_TYPE_CONSTANTS.MNR.route}100_2`);
        expectToBe(complex.complexId.short, `${EDITION_CATALOGUE_TYPE_CONSTANTS.MNR.short}&nbsp;100/2`);
    });

    it('... should have an empty resp statement if it is missing', () => {
        const complex = new EditionComplex(
            { title: 'Test Missing Resp Complex', catalogueType: 'OPUS', catalogueNumber: '100' },
            null as any,
            defaultPub
        );

        expectToEqual(complex.respStatement, { editors: [], lastModified: '' });
    });

    it('... should have an empty pub statement if it is missing', () => {
        const complex = new EditionComplex(
            { title: 'Test Missing Pub Complex', catalogueType: 'OPUS', catalogueNumber: '100' },
            defaultResp,
            null as any
        );

        expectToEqual(complex.pubStatement, new EditionComplexPubStatement());
    });

    it('... should have the given availability in the pub statement', () => {
        const availability = { workEdition: { protectedUntil: '2049' } };
        const complex = new EditionComplex(
            { title: 'Test Complex', catalogueType: 'OPUS', catalogueNumber: '12' },
            defaultResp,
            { ...defaultPub, availability }
        );

        expectToEqual(complex.pubStatement.availability, availability);
    });

    it('... should have no availability in the pub statement if it is missing', () => {
        const complex = new EditionComplex(
            { title: 'Test Complex', catalogueType: 'OPUS', catalogueNumber: '12' },
            defaultResp,
            defaultPub
        );

        expect(complex.pubStatement.availability).toBeUndefined();
    });

    it('... should have a ref-based editor if editor $ref is not found in PERSONS_DATA', () => {
        const complex = new EditionComplex(
            { title: 'Test Complex', catalogueType: 'OPUS', catalogueNumber: '12' },
            { editors: [{ $ref: 'PERSON_UNKNOWN' }], lastModified: '2026-08-12' },
            defaultPub
        );

        expectToEqual(complex.respStatement.editors, [{ name: 'PERSON_UNKNOWN', homepage: '', identifiers: {} }]);
    });

    it('... should have the given Werkedition', () => {
        const workEdition = { textVersions: { m212: '3' } };
        const complex = new EditionComplex(
            { title: 'Test Complex', catalogueType: 'OPUS', catalogueNumber: '12' },
            defaultResp,
            defaultPub,
            workEdition
        );

        expectToEqual(complex.workEdition, workEdition);
    });

    it('... should have no Werkedition if it is missing', () => {
        const complex = new EditionComplex(
            { title: 'Test Complex', catalogueType: 'MNR', catalogueNumber: '100' },
            defaultResp,
            defaultPub
        );

        expect(complex.workEdition).toBeUndefined();
    });

    it('... should throw when instantiating an edition complex with missing title statement', () => {
        const createIncompleteComplex = () => new EditionComplex(null as any, defaultResp, defaultPub);

        expect(createIncompleteComplex).toThrow(
            '[EditionComplexModel] Cannot instantiate complex: Missing catalogueType or catalogueNumber.'
        );
    });
});
