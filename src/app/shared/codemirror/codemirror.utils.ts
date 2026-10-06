import { StreamLanguage, StreamParser } from '@codemirror/language';
import { EditorState, Extension } from '@codemirror/state';
import { basicSetup, EditorView } from 'codemirror';

/**
 * The CmMode type.
 *
 * It represents the mode of a codemirror editor object.
 */
export type CmMode = StreamParser<unknown>;

/**
 * Object constant: CODEMIRROR_THEME.
 *
 * It keeps the custom theme extension of the codemirror editor.
 */
export const CODEMIRROR_THEME: Extension = EditorView.theme({
    /* eslint-disable @typescript-eslint/naming-convention */
    '&': {
        fontSize: 'small',
        minHeight: '300px',
    },
    '.cm-gutters': {
        color: '#999',
    },
    '.cm-scroller': {
        overflow: 'auto',
        maxHeight: '300px',
    },
    /* eslint-enable @typescript-eslint/naming-convention */
});

/**
 * Utils method: supportsRangeGeometry.
 *
 * It checks if the current DOM implementation supports range geometry APIs
 * required by CodeMirror view measurement plugins.
 *
 * @returns {boolean} A boolean indicating support for range geometry APIs.
 */
export function supportsRangeGeometry(): boolean {
    if (typeof document === 'undefined' || typeof document.createRange !== 'function') {
        return false;
    }

    const range = document.createRange() as Partial<Range>;

    return typeof range.getClientRects === 'function' && typeof range.getBoundingClientRect === 'function';
}

/**
 * Utils method: createEditorState.
 *
 * It creates the state of a codemirror editor with the given mode and content.
 * The basic setup extensions are only added if the DOM supports range geometry APIs.
 *
 * @param {CmMode} mode The given language mode.
 * @param {string} content The given initial content.
 * @param {(content: string) => void} onDocChange The callback for changes of the document.
 * @returns {EditorState} The created editor state.
 */
export function createEditorState(mode: CmMode, content: string, onDocChange: (content: string) => void): EditorState {
    const setupExtensions: Extension[] = supportsRangeGeometry() ? [basicSetup] : [];

    return EditorState.create({
        doc: content || '',
        extensions: [
            ...setupExtensions,
            EditorView.lineWrapping,

            // Apply the custom editor theme
            CODEMIRROR_THEME,

            // Listen for editor content changes
            EditorView.updateListener.of(update => {
                if (update.docChanged) {
                    onDocChange(update.state.doc.toString());
                }
            }),

            // Define the language mode
            StreamLanguage.define(mode),
        ],
    });
}
