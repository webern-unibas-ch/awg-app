import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { ERROR_UTILS, getErrorMessage } from './error.utils';

describe('ErrorUtils (DONE)', () => {
    describe('ERROR_UTILS', () => {
        it('... should reference all error utils methods', () => {
            expectToEqual(ERROR_UTILS, { getErrorMessage });
        });
    });

    describe('METHODS', () => {
        describe('#getErrorMessage()', () => {
            it('... should have a method `getErrorMessage`', () => {
                expect(getErrorMessage).toBeDefined();
            });

            describe('... should hold the message for various error types', () => {
                it.each([
                    {
                        desc: 'a structured error object (Error)',
                        error: new Error('error message'),
                        expectedMessage: 'error message',
                    },
                    {
                        desc: 'a plain object with a `message` property',
                        error: { status: 400, message: 'Custom API error message' },
                        expectedMessage: 'Custom API error message',
                    },
                    {
                        desc: 'a plain object with a `statusText` property (like HTTP errors)',
                        error: { status: 404, statusText: 'Not Found' },
                        expectedMessage: 'Not Found',
                    },
                    {
                        desc: 'a plain object without a `message` or `statusText` property (forces `JSON.stringify`)',
                        error: { errorCode: 999, fatal: true },
                        expectedMessage: '{"errorCode":999,"fatal":true}',
                    },
                    {
                        desc: 'an object where `JSON.stringify` returns undefined (falls back to the keys)',
                        error: {
                            toJSON: (): undefined => undefined,
                        },
                        expectedMessage: '[Complex Error Object with keys: toJSON]',
                    },
                    {
                        desc: 'a circular object that causes `JSON.stringify` to throw (forces catch)',
                        error: (() => {
                            const circularObj: any = { foo: 'bar' };
                            circularObj.self = circularObj;
                            return circularObj;
                        })(),
                        expectedMessage: '[Complex Error Object with keys: foo, self]',
                    },
                    {
                        desc: 'a primitive string error',
                        error: 'Fatal Store Crash',
                        expectedMessage: 'Fatal Store Crash',
                    },
                    {
                        desc: 'a primitive number error',
                        error: 500,
                        expectedMessage: '500',
                    },
                    {
                        desc: 'a primitive boolean error',
                        error: false,
                        expectedMessage: 'false',
                    },
                    {
                        desc: 'an unknown format (like null)',
                        error: null,
                        expectedMessage: 'Unknown error format',
                    },
                    {
                        desc: 'an unknown format (like undefined)',
                        error: undefined,
                        expectedMessage: 'Unknown error format',
                    },
                ])('... with $desc', ({ error, expectedMessage }) => {
                    expectToBe(getErrorMessage(error), expectedMessage);
                });
            });
        });
    });
});
