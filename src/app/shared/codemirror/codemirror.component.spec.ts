import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { StreamLanguage } from '@codemirror/language';
import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import { EditorState, EditorStateConfig, Extension } from '@codemirror/state';

import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { CmMode, CodeMirrorComponent } from './codemirror.component';

describe('CodemirrorComponent', () => {
    let component: CodeMirrorComponent;
    let fixture: ComponentFixture<CodeMirrorComponent>;
    let compDe: DebugElement;

    let expectedMode: CmMode;
    let expectedContent: string;
    let expectedState: EditorState;

    let initSpy: Spy;
    let onContentChangeSpy: Spy;
    let emitContentChangeSpy: Spy;
    let editorDispatchSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CodeMirrorComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CodeMirrorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedMode = sparql;
        expectedContent = 'SELECT * WHERE { ?s ?p ?o }';

        const expectedExtensions: Extension[] = [StreamLanguage.define(expectedMode)];
        const config: EditorStateConfig = {
            doc: expectedContent || '',
            extensions: expectedExtensions,
        };
        expectedState = EditorState.create(config);

        // Spies on component functions
        initSpy = vi.spyOn(component, 'init');
        onContentChangeSpy = vi.spyOn(component, 'onContentChange');
        emitContentChangeSpy = vi.spyOn(component.contentChange, 'emit');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have mode', () => {
            expect(component.mode).toBeUndefined();
        });

        it('... should not have content', () => {
            expect(component.content).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one div.codemirrorhost', () => {
                // Div debug element
                getAndExpectDebugElementByCss(compDe, 'div.codemirrorhost', 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.mode = sparql;
            component.content = 'SELECT * WHERE { ?s ?p ?o }';

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have mode', () => {
            expectToEqual(component.mode, expectedMode);
        });

        it('... should have content', () => {
            expectToBe(component.content, expectedContent);
        });

        describe('#init()', () => {
            it('... should have a method `init`', () => {
                expect(component.init).toBeDefined();
            });

            it('... should trigger on ngAfterViewInit', () => {
                expectSpyCall(initSpy, 1);
            });

            it('... should init the editor with the correct state', () => {
                expectSpyCall(initSpy, 1);

                component.init(expectedState);
                fixture.detectChanges();

                expectSpyCall(initSpy, 2, expectedState);
                expectToEqual(component.editor.state, expectedState);
            });

            it('... should init the editor with the correct content if given', () => {
                expectSpyCall(initSpy, 1);

                expectToBe(component.editor.state.doc.toString(), expectedContent);
            });

            it('... should init an empty editor if no content is given', () => {
                fixture = TestBed.createComponent(CodeMirrorComponent);
                component = fixture.componentInstance;
                component.mode = sparql;
                component.content = undefined;
                fixture.detectChanges();

                expectSpyCall(initSpy, 1);
                expectToBe(component.editor.state.doc.toString(), '');
            });
        });

        describe('#onContentChange()', () => {
            it('... should have a method `onContentChange`', () => {
                expect(component.onContentChange).toBeDefined();
            });

            it('... should not trigger if editor update does not change the document', () => {
                component.editor.dispatch({
                    selection: {
                        anchor: 0,
                    },
                });
                fixture.detectChanges();

                expectSpyCall(onContentChangeSpy, 0);
                expectSpyCall(emitContentChangeSpy, 0);
            });

            it('... should trigger on change of content input', () => {
                const otherContent = 'SELECT * WHERE { ?s ?changed ?o }';
                component.editor.dispatch({
                    changes: {
                        from: 0,
                        to: component.editor.state.doc.length,
                        insert: otherContent,
                    },
                });
                fixture.detectChanges();

                expectSpyCall(onContentChangeSpy, 1, otherContent);
            });

            describe('... should emit provided content on editor change', () => {
                it('... if string is thruthy', () => {
                    component.editor.dispatch({
                        changes: {
                            from: 0,
                            to: component.editor.state.doc.length,
                            insert: expectedContent,
                        },
                    });
                    fixture.detectChanges();

                    expectSpyCall(onContentChangeSpy, 1, expectedContent);
                    expectSpyCall(emitContentChangeSpy, 1, expectedContent);
                });

                it('... if string is empty', () => {
                    component.editor.dispatch({
                        changes: {
                            from: 0,
                            to: component.editor.state.doc.length,
                            insert: '',
                        },
                    });
                    fixture.detectChanges();

                    expectSpyCall(onContentChangeSpy, 1, '');
                    expectSpyCall(emitContentChangeSpy, 1, '');
                });
            });
        });

        describe('#ngOnChanges()', () => {
            it('... should update the editor on changes of content', () => {
                editorDispatchSpy = vi.spyOn(component.editor, 'dispatch');

                // Directly trigger ngOnChanges
                component.content = 'SELECT * WHERE { ?s ?changed ?o }';
                component.ngOnChanges({
                    content: new SimpleChange(expectedContent, component.content, false),
                });

                expectSpyCall(editorDispatchSpy, 1, {
                    changes: { from: 0, to: expectedContent.length, insert: component.content },
                });
            });

            describe('... should not trigger on changes of content', () => {
                beforeEach(() => {
                    editorDispatchSpy = vi.spyOn(component.editor, 'dispatch');
                });

                it('... if first change', () => {
                    // Directly trigger ngOnChanges
                    component.content = 'SELECT * WHERE { ?s ?changed ?o }';
                    component.ngOnChanges({
                        content: new SimpleChange(expectedContent, component.content, true),
                    });

                    expectSpyCall(editorDispatchSpy, 0);
                });

                it('... if typeof content is not string', () => {
                    // Directly trigger ngOnChanges
                    component.content = undefined;
                    component.ngOnChanges({
                        content: new SimpleChange(expectedContent, component.content, false),
                    });

                    expectSpyCall(editorDispatchSpy, 0);
                });

                it('... if editor is undefined', () => {
                    // Directly trigger ngOnChanges
                    component.content = 'SELECT * WHERE { ?s ?changed ?o }';
                    component.editor = undefined;
                    component.ngOnChanges({
                        content: new SimpleChange(expectedContent, component.content, false),
                    });

                    expectSpyCall(editorDispatchSpy, 0);
                });

                it('... if content is equal to editor content', () => {
                    // Directly trigger ngOnChanges
                    component.content = expectedContent;
                    component.ngOnChanges({
                        content: new SimpleChange(expectedContent, component.content, false),
                    });

                    expectSpyCall(editorDispatchSpy, 0);
                });
            });
        });

        describe('#_supportsRangeGeometry()', () => {
            it('... should return false if document.createRange is not a function', () => {
                const hadOwnCreateRange = Object.prototype.hasOwnProperty.call(document, 'createRange');
                const ownCreateRangeDescriptor = Object.getOwnPropertyDescriptor(document, 'createRange');

                try {
                    Object.defineProperty(document, 'createRange', {
                        configurable: true,
                        writable: true,
                        value: undefined,
                    });

                    expectToBe((component as any)._supportsRangeGeometry(), false);
                } finally {
                    if (hadOwnCreateRange && ownCreateRangeDescriptor) {
                        Object.defineProperty(document, 'createRange', ownCreateRangeDescriptor);
                    } else {
                        delete (document as any).createRange;
                    }
                }
            });

            it('... should return true if range geometry APIs are available', () => {
                const createRangeSpy = vi.spyOn(document, 'createRange').mockReturnValue({
                    getClientRects: () => [] as unknown as DOMRectList,
                    getBoundingClientRect: () => new DOMRect(0, 0, 0, 0),
                } as unknown as Range);

                expectToBe((component as any)._supportsRangeGeometry(), true);

                createRangeSpy.mockRestore();
            });

            it('... should return false if getClientRects is not available', () => {
                const createRangeSpy = vi.spyOn(document, 'createRange').mockReturnValue({
                    getBoundingClientRect: () => new DOMRect(0, 0, 0, 0),
                } as unknown as Range);

                expectToBe((component as any)._supportsRangeGeometry(), false);

                createRangeSpy.mockRestore();
            });

            it('... should return false if getBoundingClientRect is not available', () => {
                const createRangeSpy = vi.spyOn(document, 'createRange').mockReturnValue({
                    getClientRects: () => [] as unknown as DOMRectList,
                } as unknown as Range);

                expectToBe((component as any)._supportsRangeGeometry(), false);

                createRangeSpy.mockRestore();
            });
        });
    });

    describe('#ngAfterViewInit() integration', () => {
        it('... should initialize with setup extensions if range geometry APIs are available', () => {
            const supportsRangeGeometrySpy = vi.spyOn(component as any, '_supportsRangeGeometry').mockReturnValue(true);
            const initLocalSpy = vi.spyOn(component, 'init').mockImplementation(() => undefined);

            component.mode = sparql;
            component.content = expectedContent;

            expect(() => fixture.detectChanges()).not.toThrow();
            expectSpyCall(supportsRangeGeometrySpy, 1);
            expectSpyCall(initLocalSpy, 1);
        });

        it('... should initialize the editor without throwing if range geometry APIs are unavailable', () => {
            const supportsRangeGeometrySpy = vi
                .spyOn(component as any, '_supportsRangeGeometry')
                .mockReturnValue(false);

            component.mode = sparql;
            component.content = expectedContent;

            expect(() => fixture.detectChanges()).not.toThrow();
            expectSpyCall(supportsRangeGeometrySpy, 1);
            expectToBe(component.editor.state.doc.toString(), expectedContent);
        });
    });
});
