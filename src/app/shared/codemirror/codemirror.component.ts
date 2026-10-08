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
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    model,
    viewChild,
    ViewEncapsulation,
} from '@angular/core';

import { EditorState } from '@codemirror/state';
import { EditorView } from 'codemirror';

import { CmMode, createEditorState } from './codemirror.utils';

/**
 * The CodeMirror component.
 *
 * It contains a CodeMirror editor instance
 * with two-way binding of its content.
 */
@Component({
    selector: 'awg-codemirror',
    templateUrl: './codemirror.component.html',
    styleUrls: ['./codemirror.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeMirrorComponent implements AfterViewInit {
    /**
     * Private readonly injection variable: _destroyRef.
     *
     * It keeps the DestroyRef to clean up the editor view.
     */
    private readonly _destroyRef = inject(DestroyRef);

    /**
     * Readonly input signal: mode.
     *
     * It holds the mode of the codemirror editor.
     */
    readonly mode = input.required<CmMode>();

    /**
     * Readonly model signal: content.
     *
     * It holds the content of the codemirror editor.
     * Changes from the editor are emitted via `contentChange`.
     * @default ''
     */
    readonly content = model<string>('');

    /**
     * Readonly view child signal: codemirrorhost.
     *
     * It holds the reference to the host element of the codemirror editor.
     */
    readonly codemirrorhost = viewChild.required<ElementRef<HTMLDivElement>>('codemirrorhost');

    /**
     * Private variable: _editor.
     *
     * It keeps the EditorView instance.
     */
    private _editor: EditorView | undefined;

    /**
     * Constructor of the CodeMirrorComponent.
     *
     * It syncs external content changes into the editor
     * and destroys the editor view on component destroy.
     */
    constructor() {
        effect(() => {
            const content = this.content();
            if (this._editor && content !== this._editor.state.doc.toString()) {
                this._editor.dispatch({
                    changes: {
                        from: 0,
                        to: this._editor.state.doc.length,
                        insert: content,
                    },
                });
            }
        });

        this._destroyRef.onDestroy(() => this._editor?.destroy());
    }

    /**
     * Angular life cycle hook: ngAfterViewInit.
     *
     * It initializes the editor view after initializing the view.
     * The editor is created in this hook (and not in an afterRender hook)
     * so that its DOM listeners run inside the NgZone.
     */
    ngAfterViewInit(): void {
        this.init(createEditorState(this.mode(), this.content(), content => this.onContentChange(content)));
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
        this._editor = new EditorView({
            state,
            parent: this.codemirrorhost().nativeElement,
        });
    }

    /**
     * Public method: onContentChange.
     *
     * It listens for a change of the editor content
     * and sets it on the content model signal.
     *
     * @param {string} content The given content.
     *
     * @returns {void} Sets the changed content.
     */
    onContentChange(content: string): void {
        this.content.set(content);
    }
}
