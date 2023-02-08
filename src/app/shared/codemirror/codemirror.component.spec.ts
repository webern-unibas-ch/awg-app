import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { StreamLanguage } from '@codemirror/language';
import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import { EditorState, EditorStateConfig, Extension } from '@codemirror/state';
import { basicSetup } from 'codemirror';

import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';

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

        fixture = TestBed.createComponent(CodeMirrorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedMode = sparql;
        expectedContent = 'SELECT * WHERE { ?s ?p ?o }';

        const expectedExtensions: Extension[] = [basicSetup, StreamLanguage.define(expectedMode)];
        const config: EditorStateConfig = {
            doc: expectedContent || '',
            extensions: expectedExtensions,
        };
        expectedState = EditorState.create(config);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        initSpy = spyOn(component, 'init').and.callThrough();
        onContentChangeSpy = spyOn(component, 'onContentChange').and.callThrough();
        emitContentChangeSpy = spyOn(component.contentChange, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have mode', () => {
            expect(component.mode).toBeUndefined();
        });

        it('should not have content', () => {
            expect(component.content).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one div.codemirrorhost', () => {
                // Div debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.codemirrorhost', 1, 1);
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

        it('should have mode', () => {
            expect(component.mode).toBeDefined();
            expect(component.mode).withContext(`should equal ${expectedMode}`).toEqual(expectedMode);
        });

        it('should have content', () => {
            expect(component.content).toBeDefined();
            expect(component.content).withContext(`should equal ${expectedContent}`).toEqual(expectedContent);
        });

        describe('#init()', () => {
            it('... should have `init()` method', () => {
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
                expect(component.editor.state).toBeDefined();
                expect(component.editor.state).withContext(`should equal ${expectedState}`).toEqual(expectedState);
            });

            it('... should init the editor with the correct content if given', () => {
                expectSpyCall(initSpy, 1);

                expect(component.editor.state.doc.toString()).toBeDefined();
                expect(component.editor.state.doc.toString())
                    .withContext(`should equal ${expectedContent}`)
                    .toEqual(expectedContent);
            });

            it('... should init an empty editor if no content is given', () => {
                fixture = TestBed.createComponent(CodeMirrorComponent);
                component = fixture.componentInstance;
                component.mode = sparql;
                component.content = undefined;
                fixture.detectChanges();

                expectSpyCall(initSpy, 1);
                expect(component.editor.state.doc.toString()).toBeDefined();
                expect(component.editor.state.doc.toString()).withContext(`should equal ''`).toEqual('');
            });
        });

        describe('#onContentChange()', () => {
            it('... should have `onContentChange()` method', () => {
                expect(component.onContentChange).toBeDefined();
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
                editorDispatchSpy = spyOn(component.editor, 'dispatch').and.callThrough();

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
                    editorDispatchSpy = spyOn(component.editor, 'dispatch').and.callThrough();
                });

                it('...if first change', () => {
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
    });
});
