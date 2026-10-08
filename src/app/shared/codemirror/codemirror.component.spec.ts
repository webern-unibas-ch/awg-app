import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { StreamLanguage } from '@codemirror/language';
import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import { EditorState, EditorStateConfig, Extension } from '@codemirror/state';

import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { CodeMirrorComponent } from './codemirror.component';
import { CmMode } from './codemirror.utils';

describe('CodeMirrorComponent (DONE)', () => {
    let component: CodeMirrorComponent;
    let fixture: ComponentFixture<CodeMirrorComponent>;
    let compDe: DebugElement;

    let expectedMode: CmMode;
    let expectedContent: string;
    let expectedOtherContent: string;
    let expectedState: EditorState;

    let initSpy: Spy;
    let onContentChangeSpy: Spy;
    let contentSetSpy: Spy;
    let editorDispatchSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CodeMirrorComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedMode = sparql;
        expectedContent = 'SELECT * WHERE { ?s ?p ?o }';
        expectedOtherContent = 'SELECT * WHERE { ?s ?changed ?o }';

        const expectedExtensions: Extension[] = [StreamLanguage.define(expectedMode)];
        const config: EditorStateConfig = {
            doc: expectedContent || '',
            extensions: expectedExtensions,
        };
        expectedState = EditorState.create(config);

        // Create component fixture
        fixture = TestBed.createComponent(CodeMirrorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        initSpy = vi.spyOn(component, 'init');
        onContentChangeSpy = vi.spyOn(component, 'onContentChange');
        contentSetSpy = vi.spyOn(component.content, 'set');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `mode`', () => {
            expectToBe(isSignal(component.mode), true);

            expect(() => component.mode()).toThrow();
        });

        it('... should have model signal `content` to hold the default value', () => {
            expectToBe(isSignal(component.content), true);
            expectToBe(component.content(), '');
        });

        it('... should have no editor yet', () => {
            expect(component['_editor']).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one div.codemirrorhost', () => {
                getAndExpectDebugElementByCss(compDe, 'div.codemirrorhost', 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('mode', expectedMode);
            fixture.componentRef.setInput('content', expectedContent);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `mode` to hold the provided mode', () => {
            expectToEqual(component.mode(), expectedMode);
        });

        it('... should have model signal `content` to hold the provided content', () => {
            expectToBe(component.content(), expectedContent);
        });

        it('... should have view child signal `codemirrorhost` to hold the host element', () => {
            const hostDes = getAndExpectDebugElementByCss(compDe, 'div.codemirrorhost', 1, 1);

            expectToBe(component.codemirrorhost().nativeElement, hostDes[0].nativeElement);
        });

        describe('... editor sync on content change', () => {
            beforeEach(() => {
                editorDispatchSpy = vi.spyOn(component['_editor'] as any, 'dispatch');
            });

            it('... should dispatch the provided content to the editor', () => {
                fixture.componentRef.setInput('content', expectedOtherContent);
                fixture.detectChanges();

                expectSpyCall(editorDispatchSpy, 1, {
                    changes: { from: 0, to: expectedContent.length, insert: expectedOtherContent },
                });
                expectToBe(component['_editor']?.state.doc.toString(), expectedOtherContent);
            });

            it('... should not dispatch if content is equal to editor content', () => {
                fixture.componentRef.setInput('content', expectedContent);
                fixture.detectChanges();

                expectSpyCall(editorDispatchSpy, 0);
            });

            it('... should not dispatch if editor is undefined', () => {
                component['_editor'] = undefined;

                fixture.componentRef.setInput('content', expectedOtherContent);
                fixture.detectChanges();

                expectSpyCall(editorDispatchSpy, 0);
            });
        });

        it('... should destroy the editor on component destroy', () => {
            const editorDestroySpy = vi.spyOn(component['_editor'] as any, 'destroy');

            fixture.destroy();

            expectSpyCall(editorDestroySpy, 1);
        });

        describe('METHODS', () => {
            describe('#init()', () => {
                it('... should have a method `init`', () => {
                    expect(component.init).toBeDefined();
                });

                it('... should be triggered on ngAfterViewInit', () => {
                    expectSpyCall(initSpy, 1);
                });

                it('... should init the editor with the given state', () => {
                    component.init(expectedState);
                    fixture.detectChanges();

                    expectSpyCall(initSpy, 2, expectedState);
                    expectToEqual(component['_editor']?.state, expectedState);
                });

                it('... should init the editor with the provided content', () => {
                    expectToBe(component['_editor']?.state.doc.toString(), expectedContent);
                });

                it('... should init an empty editor if no content is provided', () => {
                    fixture = TestBed.createComponent(CodeMirrorComponent);
                    component = fixture.componentInstance;
                    fixture.componentRef.setInput('mode', expectedMode);
                    fixture.detectChanges();

                    expectToBe(component['_editor']?.state.doc.toString(), '');
                });
            });

            describe('#onContentChange()', () => {
                it('... should have a method `onContentChange`', () => {
                    expect(component.onContentChange).toBeDefined();
                });

                it('... should not be triggered if editor update does not change the document', () => {
                    component['_editor']?.dispatch({
                        selection: {
                            anchor: 0,
                        },
                    });
                    fixture.detectChanges();

                    expectSpyCall(onContentChangeSpy, 0);
                    expectSpyCall(contentSetSpy, 0);
                });

                it('... should be triggered on editor change', () => {
                    component['_editor']?.dispatch({
                        changes: {
                            from: 0,
                            to: component['_editor']?.state.doc.length,
                            insert: expectedOtherContent,
                        },
                    });
                    fixture.detectChanges();

                    expectSpyCall(onContentChangeSpy, 1, expectedOtherContent);
                });

                describe('... should set the provided content on model signal `content`', () => {
                    it('... if string is truthy', () => {
                        component['_editor']?.dispatch({
                            changes: {
                                from: 0,
                                to: component['_editor'].state.doc.length,
                                insert: expectedOtherContent,
                            },
                        });
                        fixture.detectChanges();

                        expectSpyCall(contentSetSpy, 1, expectedOtherContent);
                        expectToBe(component.content(), expectedOtherContent);
                    });

                    it('... if string is empty', () => {
                        component['_editor']?.dispatch({
                            changes: {
                                from: 0,
                                to: component['_editor'].state.doc.length,
                                insert: '',
                            },
                        });
                        fixture.detectChanges();

                        expectSpyCall(contentSetSpy, 1, '');
                        expectToBe(component.content(), '');
                    });
                });

                it('... should emit `contentChange` via model signal `content`', () => {
                    const emittedValues: string[] = [];
                    component.content.subscribe(value => emittedValues.push(value));

                    component.onContentChange(expectedOtherContent);

                    expectToEqual(emittedValues, [expectedOtherContent]);
                });
            });
        });
    });

    describe('#ngAfterViewInit()', () => {
        it('... should have a method `ngAfterViewInit`', () => {
            expect(component.ngAfterViewInit).toBeDefined();
        });

        it('... should init the editor with a state holding the provided content', () => {
            fixture.componentRef.setInput('mode', expectedMode);
            fixture.componentRef.setInput('content', expectedContent);
            fixture.detectChanges();

            expectSpyCall(initSpy, 1);
            const state = initSpy.mock.calls[0][0] as EditorState;
            expectToBe(state.doc.toString(), expectedContent);
        });

        it('... should not throw if range geometry APIs are available', () => {
            vi.spyOn(document, 'createRange').mockReturnValue({
                getClientRects: () => [] as unknown as DOMRectList,
                getBoundingClientRect: () => new DOMRect(0, 0, 0, 0),
            } as unknown as Range);
            // Skip the view creation, jsdom cannot measure the basic setup
            initSpy.mockImplementation(() => undefined);

            fixture.componentRef.setInput('mode', expectedMode);
            fixture.componentRef.setInput('content', expectedContent);

            expect(() => fixture.detectChanges()).not.toThrow();
            expectSpyCall(initSpy, 1);
        });

        it('... should not throw if range geometry APIs are unavailable', () => {
            vi.spyOn(document, 'createRange').mockReturnValue({} as unknown as Range);

            fixture.componentRef.setInput('mode', expectedMode);
            fixture.componentRef.setInput('content', expectedContent);

            expect(() => fixture.detectChanges()).not.toThrow();
            expectToBe(component['_editor']?.state.doc.toString(), expectedContent);
        });
    });
});
