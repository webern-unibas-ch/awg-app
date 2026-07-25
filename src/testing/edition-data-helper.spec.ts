import { signal } from '@angular/core';

import { describe, it } from 'vitest';

import { updateMockEditionViewData } from './edition-data-helper';
import { expectToEqual } from './expect-helper';

describe('updateMockEditionData (DONE)', () => {
    interface TestData {
        foo: string;
        bar: string;
    }

    const defaultData: TestData = { foo: 'original-foo', bar: 'original-bar' };

    it('... should initialize with default data and loading/error states', () => {
        const mockEditionDataSignal = signal({ data: defaultData, isLoading: false, error: null });

        updateMockEditionViewData(mockEditionDataSignal, defaultData);

        expectToEqual(mockEditionDataSignal(), { data: defaultData, isLoading: false, error: null });
    });

    it('... should allow to override fields within the data object', () => {
        const mockEditionDataSignal = signal({ data: defaultData, isLoading: false, error: null });

        updateMockEditionViewData(mockEditionDataSignal, defaultData, {
            data: { foo: 'changed-foo' },
        });

        expectToEqual(mockEditionDataSignal(), {
            data: { foo: 'changed-foo', bar: 'original-bar' },
            isLoading: false,
            error: null,
        });
    });

    it('... should allow to override fields to undefined within the data object', () => {
        const mockEditionDataSignal = signal({ data: defaultData, isLoading: false, error: null });

        updateMockEditionViewData(mockEditionDataSignal, defaultData, {
            data: { foo: undefined },
        });

        expectToEqual(mockEditionDataSignal(), {
            data: { foo: undefined, bar: 'original-bar' },
            isLoading: false,
            error: null,
        });
    });

    it('... should update isLoading state independently', () => {
        const mockEditionDataSignal = signal({ data: defaultData, isLoading: false, error: null });
        updateMockEditionViewData(mockEditionDataSignal, defaultData, {
            isLoading: true,
        });

        expectToEqual(mockEditionDataSignal(), {
            data: defaultData,
            isLoading: true,
            error: null,
        });
    });

    it('... should update error state independently', () => {
        const mockEditionDataSignal = signal({ data: defaultData, isLoading: false, error: null });
        const mockError = { message: 'HTTP 404 Not Found' };

        updateMockEditionViewData(mockEditionDataSignal, defaultData, {
            error: mockError,
        });

        expectToEqual(mockEditionDataSignal(), {
            data: defaultData,
            isLoading: false,
            error: mockError,
        });
    });

    it('... should update isLoading and error states independently', () => {
        const mockEditionDataSignal = signal({ data: defaultData, isLoading: false, error: null });
        const mockError = { message: 'HTTP 404 Not Found' };

        updateMockEditionViewData(mockEditionDataSignal, defaultData, {
            isLoading: true,
            error: mockError,
        });

        expectToEqual(mockEditionDataSignal(), {
            data: defaultData,
            isLoading: true,
            error: mockError,
        });
    });
});
