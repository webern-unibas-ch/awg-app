import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { IntroBlock } from '@awg-views/edition-view/models';

import { EditionIntroContentComponent } from './edition-intro-content.component';

describe('EditionIntroContentComponent (DONE)', () => {
    let component: EditionIntroContentComponent;
    let fixture: ComponentFixture<EditionIntroContentComponent>;
    let compDe: DebugElement;

    let navigateToIntroFragmentSpy: Spy;
    let navigateToIntroFragmentRequestEmitSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedIntroBlockContent: IntroBlock[];
    let expectedNotesLabel: string;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedIntroFragment: string;
    let expectedModalSnippet: string;
    let expectedReportFragment: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionIntroContentComponent, CompileHtmlComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionIntroContentComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedIntroBlockContent = JSON.parse(JSON.stringify(mockEditionData.mockIntroData.intro[0].content));
        expectedNotesLabel = 'Test notes label';

        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedIntroFragment = 'note-80';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedReportFragment = 'source_A';
        expectedSheetId = 'test-1';
        expectedNextSheetId = 'test-2';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        navigateToIntroFragmentSpy = spyOn(component, 'navigateToIntroFragment').and.callThrough();
        navigateToIntroFragmentRequestEmitSpy = spyOn(
            component.navigateToIntroFragmentRequest,
            'emit'
        ).and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigateToReportFragmentRequestEmitSpy = spyOn(
            component.navigateToReportFragmentRequest,
            'emit'
        ).and.callThrough();
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `introBlockContent`', () => {
            expect(component.introBlockContent).toBeUndefined();
        });

        it('... should not have `notesLabel`', () => {
            expect(component.notesLabel).toBeUndefined();
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        describe('VIEW', () => {
            it('... should contain no `div.awg-edition-intro-content` yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-content', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.introBlockContent = expectedIntroBlockContent;
            component.notesLabel = expectedNotesLabel;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `introBlockContent`', () => {
            expectToEqual(component.introBlockContent, expectedIntroBlockContent);
        });

        it('... should have `notesLabel`', () => {
            expectToBe(component.notesLabel, expectedNotesLabel);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-edition-intro-content`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-content', 1, 1);
            });

            it('... should contain as many awg-edition-intro-sections as introBlockContent items (+ 1 for notes)', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'section.awg-edition-intro-section',
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );
            });

            it('... should have correct id for each awg-edition-intro-section', () => {
                const sectionDes = getAndExpectDebugElementByCss(
                    compDe,
                    'section.awg-edition-intro-section',
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );

                sectionDes.forEach((sectionDe, index) => {
                    expect(sectionDe.attributes['id']).toBe(
                        index < expectedIntroBlockContent.length ? expectedIntroBlockContent[index].blockId : 'notes'
                    );
                });
            });

            describe('... content sections', () => {
                it('... should not contain an intro block heading if block header is empty', () => {
                    expectedIntroBlockContent = [
                        {
                            blockId: 'testId',
                            blockHeader: '',
                            blockContent: ['Test content'],
                            blockNotes: ['Test notes'],
                        },
                    ];
                    component.introBlockContent = expectedIntroBlockContent;
                    detectChangesOnPush(fixture);

                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );

                    sectionDes.forEach((sectionDe, index) => {
                        if (index < expectedIntroBlockContent.length) {
                            getAndExpectDebugElementByCss(sectionDe, 'div.awg-edition-intro-block > p.heading', 0, 0);
                        }
                    });
                });

                it('... should contain as many intro block headings as block headers in data', () => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );

                    sectionDes.forEach((sectionDe, index) => {
                        // Each section block, except the notes section, should have a heading
                        getAndExpectDebugElementByCss(
                            sectionDe,
                            'div.awg-edition-intro-block > p.heading',
                            index < expectedIntroBlockContent.length ? 1 : 0,
                            index < expectedIntroBlockContent.length ? 1 : 0
                        );
                    });
                });

                it('... should display correct header in each heading', () => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );

                    sectionDes.forEach((sectionDe, index) => {
                        // Each section block, except the notes section, should have a heading
                        const expectedLength = index < expectedIntroBlockContent.length ? 1 : 0;

                        const pDes = getAndExpectDebugElementByCss(
                            sectionDe,
                            'div.awg-edition-intro-block > p.heading',
                            expectedLength,
                            expectedLength
                        );

                        if (index < expectedIntroBlockContent.length) {
                            expect(pDes[0].nativeElement.textContent).toBe(
                                expectedIntroBlockContent[index].blockHeader
                            );
                        }
                    });
                });

                it('... should not contain any (additional) intro blocks if block content is empty', () => {
                    expectedIntroBlockContent = [
                        {
                            blockId: 'testId',
                            blockHeader: 'Test header',
                            blockContent: [],
                            blockNotes: ['Test notes'],
                        },
                    ];
                    component.introBlockContent = expectedIntroBlockContent;
                    detectChangesOnPush(fixture);

                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );

                    sectionDes.forEach((sectionDe, index) => {
                        if (index < expectedIntroBlockContent.length) {
                            getAndExpectDebugElementByCss(sectionDe, 'div.awg-edition-intro-block > p.heading', 1, 1);
                            getAndExpectDebugElementByCss(sectionDe, 'div.awg-edition-intro-block', 1, 1);
                        }
                    });
                });

                it('... should contain as many intro blocks as block content items in data', () => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );

                    sectionDes.forEach((sectionDe, index) => {
                        if (index < expectedIntroBlockContent.length) {
                            const expectedBlockContent = expectedIntroBlockContent[index].blockContent;
                            const expectedBlockHeader = expectedIntroBlockContent[index].blockHeader;
                            const expectedLength = expectedBlockHeader
                                ? expectedBlockContent.length + 1
                                : expectedBlockContent.length;

                            getAndExpectDebugElementByCss(
                                sectionDe,
                                'div.awg-edition-intro-block',
                                expectedLength,
                                expectedLength
                            );
                        }
                    });
                });

                it('... should have one anchor in first paragraph, and 3 in the second one in the first section', () => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );

                    const expectedLength = expectedIntroBlockContent[0].blockContent.length + 1;

                    const divDes = getAndExpectDebugElementByCss(
                        sectionDes[0],
                        'div.awg-edition-intro-block',
                        expectedLength,
                        expectedLength
                    );

                    // First div has header
                    getAndExpectDebugElementByCss(divDes[1], 'a', 1, 1);
                    getAndExpectDebugElementByCss(divDes[2], 'a', 3, 3);
                });
            });

            describe('... notes section', () => {
                it('... should be the last section', () => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );

                    const notesSectionDe = sectionDes.at(-1);
                    expect(notesSectionDe.attributes['id']).toBe('notes');
                });

                it('... should contain one horizontal line', () => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );
                    const notesSectionDe = sectionDes.at(-1);

                    getAndExpectDebugElementByCss(notesSectionDe, 'hr', 1, 1);
                });

                it('... should contain one notes heading (h5)', () => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );
                    const notesSectionDe = sectionDes.at(-1);

                    getAndExpectDebugElementByCss(notesSectionDe, 'h5', 1, 1);
                });

                it('... should display the notesLabel in the heading (h5)', () => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );
                    const notesSectionDe = sectionDes.at(-1);

                    const h5Des = getAndExpectDebugElementByCss(notesSectionDe, 'h5', 1, 1);
                    const h5El = h5Des[0].nativeElement;

                    expectToBe(h5El.textContent, expectedNotesLabel);
                });

                it('... should contain one div.awg-edition-intro-notes', () => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );
                    const notesSectionDe = sectionDes.at(-1);

                    getAndExpectDebugElementByCss(notesSectionDe, 'div.awg-edition-intro-notes', 1, 1);
                });

                it('... should contain as many (small) div.awg-edition-intro-note as block notes in data', () => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );
                    const notesSectionDe = sectionDes.at(-1);

                    // Count total block notes length by reducing block notes arrays
                    const totalBlockNotesLength = expectedIntroBlockContent.reduce(
                        (acc, block) => acc + block.blockNotes.length,
                        0
                    );

                    getAndExpectDebugElementByCss(
                        notesSectionDe,
                        'small > div.awg-edition-intro-note',
                        totalBlockNotesLength,
                        totalBlockNotesLength
                    );
                });
            });
        });

        describe('#navigateToIntroFragment()', () => {
            it('... should have a method `navigateToIntroFragment`', () => {
                expect(component.navigateToIntroFragment).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const sectionDes = getAndExpectDebugElementByCss(
                    compDe,
                    'section.awg-edition-intro-section',
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );

                const divDes = getAndExpectDebugElementByCss(
                    sectionDes[0],
                    'div.awg-edition-intro-block',
                    expectedIntroBlockContent[0].blockContent.length + 1,
                    expectedIntroBlockContent[0].blockContent.length + 1
                );

                // Find 3 anchors in last block content
                const anchorDes = getAndExpectDebugElementByCss(divDes[2], 'a', 3, 3);

                // CLick on last anchor (with navigateToIntroFragment call)
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(navigateToIntroFragmentSpy, 1, {
                    complexId: expectedComplexId,
                    fragmentId: expectedIntroFragment,
                });
            }));

            describe('... should not emit anything if', () => {
                it('... paraemeter is undefined', () => {
                    component.navigateToIntroFragment(undefined);

                    expectSpyCall(navigateToIntroFragmentRequestEmitSpy, 0);
                });
                it('... parameter is null', () => {
                    component.navigateToIntroFragment(null);

                    expectSpyCall(navigateToIntroFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is undefined', () => {
                    component.navigateToIntroFragment({ complexId: 'testComplex', fragmentId: undefined });

                    expectSpyCall(navigateToIntroFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is null', () => {
                    component.navigateToIntroFragment({ complexId: 'testComplex', fragmentId: null });

                    expectSpyCall(navigateToIntroFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is empty string', () => {
                    component.navigateToIntroFragment({ complexId: 'testComplex', fragmentId: '' });

                    expectSpyCall(navigateToIntroFragmentRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected report fragment within same complex', () => {
                const expectedIntroIds = { complexId: expectedComplexId, fragmentId: expectedIntroFragment };
                component.navigateToIntroFragment(expectedIntroIds);

                expectSpyCall(navigateToIntroFragmentRequestEmitSpy, 1, expectedIntroIds);

                const otherFragment = 'note-ref-81';
                const expectedNextIntroIds = { complexId: expectedComplexId, fragmentId: otherFragment };
                component.navigateToIntroFragment(expectedNextIntroIds);

                expectSpyCall(navigateToIntroFragmentRequestEmitSpy, 2, expectedNextIntroIds);
            });

            it('... should emit id of selected report fragment for another complex', () => {
                const expectedIntroIds = { complexId: expectedComplexId, fragmentId: expectedIntroFragment };
                component.navigateToIntroFragment(expectedIntroIds);

                expectSpyCall(navigateToIntroFragmentRequestEmitSpy, 1, expectedIntroIds);

                const otherFragment = 'note-ref-81';
                const expectedNextIntroIds = { complexId: expectedNextComplexId, fragmentId: otherFragment };
                component.navigateToIntroFragment(expectedNextIntroIds);

                expectSpyCall(navigateToIntroFragmentRequestEmitSpy, 2, expectedNextIntroIds);
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const sectionDes = getAndExpectDebugElementByCss(
                    compDe,
                    'section.awg-edition-intro-section',
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );

                const divDes = getAndExpectDebugElementByCss(
                    sectionDes[0],
                    'div.awg-edition-intro-block',
                    expectedIntroBlockContent[0].blockContent.length + 1,
                    expectedIntroBlockContent[0].blockContent.length + 1
                );

                // Find 3 anchors in first block content (after heading)
                const anchorDes = getAndExpectDebugElementByCss(divDes[1], 'a', 1, 1);

                // CLick on first anchor (with navigateToReportFragment call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, {
                    complexId: expectedComplexId,
                    fragmentId: expectedReportFragment,
                });
            }));

            describe('... should not emit anything if', () => {
                it('... paraemeter is undefined', () => {
                    component.navigateToReportFragment(undefined);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... parameter is null', () => {
                    component.navigateToReportFragment(null);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is undefined', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: undefined });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is null', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: null });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is empty string', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: '' });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected report fragment within same complex', () => {
                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                component.navigateToReportFragment(expectedReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedReportIds);

                const otherFragment = 'source_B';
                const expectedNextReportIds = { complexId: expectedComplexId, fragmentId: otherFragment };
                component.navigateToReportFragment(expectedNextReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, expectedNextReportIds);
            });

            it('... should emit id of selected report fragment for another complex', () => {
                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                component.navigateToReportFragment(expectedReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedReportIds);

                const otherFragment = 'source_B';
                const expectedNextReportIds = { complexId: expectedNextComplexId, fragmentId: otherFragment };
                component.navigateToReportFragment(expectedNextReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, expectedNextReportIds);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const sectionDes = getAndExpectDebugElementByCss(
                    compDe,
                    'section.awg-edition-intro-section',
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );

                const divDes = getAndExpectDebugElementByCss(
                    sectionDes[0],
                    'div.awg-edition-intro-block',
                    expectedIntroBlockContent[0].blockContent.length + 1,
                    expectedIntroBlockContent[0].blockContent.length + 1
                );

                // Find 3 anchors in last block content
                const anchorDes = getAndExpectDebugElementByCss(divDes[2], 'a', 3, 3);

                // CLick on second anchor (with openModal call)
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(openModalSpy, 1, expectedModalSnippet);
            }));

            describe('... should not emit anything if ', () => {
                it('... id is undefined', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });

                it('... id is null', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0, null);
                });
                it('... id is empty string', () => {
                    component.openModal('');

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });
            });

            it('... should emit id of given modal snippet', () => {
                component.openModal(expectedModalSnippet);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedModalSnippet);
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const sectionDes = getAndExpectDebugElementByCss(
                    compDe,
                    'section.awg-edition-intro-section',
                    expectedIntroBlockContent.length + 1,
                    expectedIntroBlockContent.length + 1
                );

                const divDes = getAndExpectDebugElementByCss(
                    sectionDes[0],
                    'div.awg-edition-intro-block',
                    expectedIntroBlockContent[0].blockContent.length + 1,
                    expectedIntroBlockContent[0].blockContent.length + 1
                );

                // Find 3 anchors in last block content
                const anchorDes = getAndExpectDebugElementByCss(divDes[2], 'a', 3, 3);

                // CLick on first anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSheetId });
            }));

            it('... should not emit anything if no id is provided', () => {
                const expectedSheetIds = undefined;
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);

                const expectedNextSheetIds = { complexId: undefined, sheetId: undefined };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet within same complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });
        });
    });
});
