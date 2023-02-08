/** **********************************************
 *
 *               Codemirror.component.ts
 *
 * This code is inspired, adapted or taken from:
 *
 * @robotocoral/ngx-codemirror6 repository
 * https://github.com/robotcoral/ngx-codemirror6/blob/main/src/codemirror.component.ts
 * Version 0.0.5, 29.8.2021
 *
 ************************************************/

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';

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
 * The EditorStateConfig type.
 *
 * It represents the config object of a codemirror editor state.
 */
type EditorStateConfig = Parameters<typeof EditorState.create>[0];

/**
 * The CodeMirror component.
 *
 * It contains a CodeMirror editor instance that is
 * provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-codemirror',
    templateUrl: './codemirror.component.html',
    styleUrls: ['./codemirror.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeMirrorComponent implements AfterViewInit, OnChanges {
    /**
     * Input variable: mode.
     *
     * It keeps the mode of the codemirror editor.
     */
    @Input() mode: CmMode;

    /**
     * Input variable: content.
     *
     * It keeps the content of the codemirror editor.
     */
    @Input() content: string;

    /**
     * Output variable: contentChange.
     *
     * It keeps an event emitter to update the content after editor changes.
     */
    @Output() contentChange: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: editor.
     *
     * It keeps the EditorView instance.
     */
    @Output() editor: EditorView;

    /**
     * ViewChild variable: codemirrorhost.
     *
     * It keeps the reference to the HTML template of the codemirror editor.
     */
    @ViewChild('codemirrorhost') codemirrorhost: ElementRef = null;

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     *
     * @param {SimpleChanges} changes The changes of the input.
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['content'] &&
            !changes['content'].isFirstChange() &&
            typeof changes['content'].currentValue === 'string' &&
            this.editor &&
            this.content !== this.editor.state.doc.toString()
        ) {
            this.editor.dispatch({
                changes: {
                    from: 0,
                    to: this.editor.state.doc.length,
                    insert: this.content,
                },
            });
        }
    }

    /**
     * Angular life cycle hook: ngAfterViewInit.
     *
     * It calls the containing methods
     * after initializing the view.
     */
    ngAfterViewInit(): void {
        const editorTheme = EditorView.theme({
            /* eslint-disable @typescript-eslint/naming-convention */
            '&': {
                fontSize: 'small',
                minHeight: '300px',
            },
            /* eslint-disable @typescript-eslint/naming-convention */
            '.cm-gutters': {
                color: '#999',
            },
            /* eslint-disable @typescript-eslint/naming-convention */
            '.cm-scroller': {
                overflow: 'auto',
                maxHeight: '300px',
            },
        });
        const editorThemeExtension: Extension[] = [editorTheme];

        const ext: Extension[] = [
            basicSetup,
            EditorView.lineWrapping,

            // Apply the custom editor theme
            editorThemeExtension,

            // Listen for editor content changes
            EditorView.updateListener.of(view => {
                if (view.docChanged) {
                    this.onContentChange(view.state.doc.toString());
                }
            }),

            // Define the language mode
            StreamLanguage.define(this.mode),
        ];

        const config: EditorStateConfig = {
            doc: this.content || '',
            extensions: ext,
        };

        const state = EditorState.create(config);
        this.init(state);
    }

    /**
     * Public method: init.
     *
     * It initializes the CodeMirror editor view with a given state.
     *
     * @param {EditorState} state The given editor state.
     *
     * @returns {void} Inits the editor view.
     */
    init(state: EditorState): void {
        this.editor = new EditorView({
            state,
            parent: this.codemirrorhost.nativeElement,
        });
    }

    /**
     * Public method: onContentChange.
     *
     * It listens for a change of the content
     * and emits it via the contentChange EventEmitter.
     *
     * @param {string} content The given content.
     *
     * @returns {void} Emits the changed content.
     */
    onContentChange(content: string): void {
        this.contentChange.emit(content);
    }
}
