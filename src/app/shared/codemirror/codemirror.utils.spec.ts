import { afterEach, describe, expect, it, vi } from 'vitest';

import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import { EditorState } from '@codemirror/state';
import { EditorView } from 'codemirror';

import { expectSpyCall, expectToBe } from '@testing/expect-helper';

import { CODEMIRROR_THEME, CmMode, createEditorState, supportsRangeGeometry } from './codemirror.utils';

/**
 * Helper function: mockRangeGeometry.
 *
 * It mocks document.createRange with or without range geometry APIs.
 *
 * @param {boolean} available Whether the range geometry APIs should be available.
 */
function mockRangeGeometry(available: boolean): void {
    const range = available
        ? {
              getClientRects: () => [] as unknown as DOMRectList,
              getBoundingClientRect: () => new DOMRect(0, 0, 0, 0),
          }
        : {};
    vi.spyOn(document, 'createRange').mockReturnValue(range as unknown as Range);
}

describe('codemirror.utils', () => {
    const expectedMode: CmMode = sparql;
    const expectedContent = 'SELECT * WHERE { ?s ?p ?o }';
    const expectedOtherContent = 'SELECT * WHERE { ?s ?changed ?o }';

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('CODEMIRROR_THEME', () => {
        it('... should be defined', () => {
            expect(CODEMIRROR_THEME).toBeDefined();
        });
    });

    describe('#createEditorState()', () => {
        it('... should have a method `createEditorState`', () => {
            expect(createEditorState).toBeDefined();
        });

        it('... should create an editor state holding the provided content', () => {
            const state = createEditorState(expectedMode, expectedContent, vi.fn());

            expect(state).toBeInstanceOf(EditorState);
            expectToBe(state.doc.toString(), expectedContent);
        });

        it('... should create an empty editor state if content is empty', () => {
            const state = createEditorState(expectedMode, '', vi.fn());

            expectToBe(state.doc.toString(), '');
        });

        it('... should include the basic setup if range geometry APIs are available', () => {
            mockRangeGeometry(true);

            const state = createEditorState(expectedMode, expectedContent, vi.fn());

            // The basic setup enables multiple selections
            expectToBe(state.facet(EditorState.allowMultipleSelections), true);
        });

        it('... should not include the basic setup if range geometry APIs are unavailable', () => {
            mockRangeGeometry(false);

            const state = createEditorState(expectedMode, expectedContent, vi.fn());

            expectToBe(state.facet(EditorState.allowMultipleSelections), false);
        });

        describe('... with update listener', () => {
            it('... should call onDocChange with the new content on document changes', () => {
                const onDocChange = vi.fn();
                const view = new EditorView({
                    state: createEditorState(expectedMode, expectedContent, onDocChange),
                    parent: document.createElement('div'),
                });

                view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: expectedOtherContent } });

                expectSpyCall(onDocChange, 1, expectedOtherContent);
                view.destroy();
            });

            it('... should not call onDocChange if the document does not change', () => {
                const onDocChange = vi.fn();
                const view = new EditorView({
                    state: createEditorState(expectedMode, expectedContent, onDocChange),
                    parent: document.createElement('div'),
                });

                view.dispatch({ selection: { anchor: 0 } });

                expectSpyCall(onDocChange, 0);
                view.destroy();
            });
        });
    });

    describe('#supportsRangeGeometry()', () => {
        it('... should have a method `supportsRangeGeometry`', () => {
            expect(supportsRangeGeometry).toBeDefined();
        });

        it('... should be false if document.createRange is not a function', () => {
            const hadOwnCreateRange = Object.prototype.hasOwnProperty.call(document, 'createRange');
            const ownCreateRangeDescriptor = Object.getOwnPropertyDescriptor(document, 'createRange');

            try {
                Object.defineProperty(document, 'createRange', {
                    configurable: true,
                    writable: true,
                    value: undefined,
                });

                expectToBe(supportsRangeGeometry(), false);
            } finally {
                if (hadOwnCreateRange && ownCreateRangeDescriptor) {
                    Object.defineProperty(document, 'createRange', ownCreateRangeDescriptor);
                } else {
                    delete (document as any).createRange;
                }
            }
        });

        it('... should be true if range geometry APIs are available', () => {
            mockRangeGeometry(true);

            expectToBe(supportsRangeGeometry(), true);
        });

        it('... should be false if getClientRects is not available', () => {
            vi.spyOn(document, 'createRange').mockReturnValue({
                getBoundingClientRect: () => new DOMRect(0, 0, 0, 0),
            } as unknown as Range);

            expectToBe(supportsRangeGeometry(), false);
        });

        it('... should be false if getBoundingClientRect is not available', () => {
            vi.spyOn(document, 'createRange').mockReturnValue({
                getClientRects: () => [] as unknown as DOMRectList,
            } as unknown as Range);

            expectToBe(supportsRangeGeometry(), false);
        });
    });
});
