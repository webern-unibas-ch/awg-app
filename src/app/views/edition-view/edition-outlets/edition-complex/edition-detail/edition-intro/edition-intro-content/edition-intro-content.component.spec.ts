import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { IntroBlock } from '@awg-views/edition-view/models';
import { EditionGlyphService } from '@awg-views/edition-view/services';

import { EditionIntroContentComponent } from './edition-intro-content.component';

describe('EditionIntroContentComponent (DONE)', () => {
    let component: EditionIntroContentComponent;
    let fixture: ComponentFixture<EditionIntroContentComponent>;
    let compDe: DebugElement;

    let getGlyphSpy: Spy;
    let navigateToIntroFragmentSpy: Spy;
    let navigateToIntroFragmentRequestEmitSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let editionGlyphServiceGetGlyphSpy: Spy;

    let mockEditionGlyphService: Partial<EditionGlyphService>;

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
        mockEditionGlyphService = {
            getGlyph: (glyphString: string): string => {
                switch (glyphString) {
                    case '[a]':
                        return '\u266E';
                    case '[b]':
                        return '\u266D';
                    default:
                        return 'glyphString';
                }
            },
        };

        await TestBed.configureTestingModule({
            declarations: [EditionIntroContentComponent, CompileHtmlComponent],
            providers: [{ provide: EditionGlyphService, useValue: mockEditionGlyphService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionIntroContentComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockEditionGlyphService = TestBed.inject(EditionGlyphService);

        // Test data
        expectedIntroBlockContent = structuredClone(mockEditionData.mockIntroData.intro[0].content);
        expectedNotesLabel = 'Test notes label';

        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedIntroFragment = 'note-80';
        expectedModalSnippet = structuredClone(mockEditionData.mockModalSnippet);
        expectedReportFragment = 'source_A';
        expectedSheetId = 'test-1';
        expectedNextSheetId = 'test-2';

        // Spies
        getGlyphSpy = vi.spyOn(component, 'getGlyph');
        navigateToIntroFragmentSpy = vi.spyOn(component, 'navigateToIntroFragment');
        navigateToIntroFragmentRequestEmitSpy = vi.spyOn(component.navigateToIntroFragmentRequest, 'emit');
        navigateToReportFragmentSpy = vi.spyOn(component, 'navigateToReportFragment');
        navigateToReportFragmentRequestEmitSpy = vi.spyOn(component.navigateToReportFragmentRequest, 'emit');
        openModalSpy = vi.spyOn(component, 'openModal');
        openModalRequestEmitSpy = vi.spyOn(component.openModalRequest, 'emit');
        selectSvgSheetSpy = vi.spyOn(component, 'selectSvgSheet');
        selectSvgSheetRequestEmitSpy = vi.spyOn(component.selectSvgSheetRequest, 'emit');

        editionGlyphServiceGetGlyphSpy = vi.spyOn(mockEditionGlyphService, 'getGlyph');
    });

    afterEach(() => {
        vi.clearAllMocks();
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
                    const expectedId =
                        index < expectedIntroBlockContent.length ? expectedIntroBlockContent[index].blockId : 'notes';

                    expectToBe(sectionDe.attributes['id'], expectedId);
                });
            });

            describe('... content sections', () => {
                it('... should not contain an intro block heading if block header is empty', async () => {
                    expectedIntroBlockContent = [
                        {
                            blockId: 'testId',
                            blockHeader: '',
                            blockContent: ['Test content'],
                            blockNotes: ['Test notes'],
                        },
                    ];
                    component.introBlockContent = expectedIntroBlockContent;
                    await detectChangesOnPush(fixture);

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
                            const pEl: HTMLParagraphElement = pDes[0].nativeElement;
                            expectToBe(pEl.textContent, expectedIntroBlockContent[index].blockHeader);
                        }
                    });
                });

                it('... should not contain any (additional) intro blocks if block content is empty', async () => {
                    expectedIntroBlockContent = [
                        {
                            blockId: 'testId',
                            blockHeader: 'Test header',
                            blockContent: [],
                            blockNotes: ['Test notes'],
                        },
                    ];
                    component.introBlockContent = expectedIntroBlockContent;
                    await detectChangesOnPush(fixture);

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
                // Helper function to get the notes section debug element
                const getNotesSectionDe = (): DebugElement => {
                    const expectedLength = expectedIntroBlockContent.length + 1;
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedLength,
                        expectedLength
                    );
                    const lastSection = sectionDes.at(-1);

                    expect(lastSection).toBeDefined();

                    if (!lastSection) {
                        return {} as DebugElement;
                    }

                    return lastSection;
                };

                it('... should be the last section', () => {
                    const notesSectionDe = getNotesSectionDe();

                    expectToBe(notesSectionDe.attributes['id'], 'notes');
                });

                describe('... should contain', () => {
                    it.each([
                        { desc: 'one horizontal line', selector: 'hr' },
                        { desc: 'one notes heading (h5)', selector: 'h5' },
                        { desc: 'one div.awg-edition-intro-notes', selector: 'div.awg-edition-intro-notes' },
                    ])('... $desc', ({ selector }) => {
                        getAndExpectDebugElementByCss(getNotesSectionDe(), selector, 1, 1);
                    });
                });

                it('... should display the notesLabel in the heading (h5)', () => {
                    const hDes = getAndExpectDebugElementByCss(getNotesSectionDe(), 'h5', 1, 1);
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    expectToBe(hEl.textContent, expectedNotesLabel);
                });

                it('... should contain as many (small) div.awg-edition-intro-note as block notes in data', () => {
                    // Count total block notes length by reducing block notes arrays
                    const totalBlockNotesLength = expectedIntroBlockContent.reduce(
                        (acc, block) => acc + block.blockNotes.length,
                        0
                    );

                    getAndExpectDebugElementByCss(
                        getNotesSectionDe(),
                        'small > div.awg-edition-intro-note',
                        totalBlockNotesLength,
                        totalBlockNotesLength
                    );
                });
            });
        });

        describe('#getGlyph()', () => {
            it('... should have a method `getGlyph`', () => {
                expect(component.getGlyph).toBeDefined();
            });

            it('... should trigger on change detection', async () => {
                // 2 glyphs in detected content
                expectSpyCall(getGlyphSpy, 2);

                await detectChangesOnPush(fixture);

                expectSpyCall(getGlyphSpy, 4);
            });

            it('... should call `getGlyphs` method from EditionGlyphService with correct glyph string', () => {
                // 2 glyphs in detected content
                expectSpyCall(editionGlyphServiceGetGlyphSpy, 2);

                component.getGlyph('[bb]');

                expectSpyCall(editionGlyphServiceGetGlyphSpy, 3, '[bb]');
            });

            it('... should return the glyph string from EditionGlyphService', () => {
                const result = component.getGlyph('[bb]');

                expectToBe(result, 'glyphString');
            });
        });

        describe('#navigateToIntroFragment()', () => {
            it('... should have a method `navigateToIntroFragment`', () => {
                expect(component.navigateToIntroFragment).toBeDefined();
            });

            it('... should trigger on click', async () => {
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
                await clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(navigateToIntroFragmentSpy, 1, {
                    complexId: expectedComplexId,
                    fragmentId: expectedIntroFragment,
                });
            });

            describe('... should not emit anything if', () => {
                it('... parameter is undefined', () => {
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

            it('... should trigger on click', async () => {
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
                await clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, {
                    complexId: expectedComplexId,
                    fragmentId: expectedReportFragment,
                });
            });

            describe('... should not emit anything if', () => {
                it('... parameter is undefined', () => {
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

            it('... should trigger on click', async () => {
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
                await clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(openModalSpy, 1, expectedModalSnippet);
            });

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

            it('... should trigger on click', async () => {
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
                await clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSheetId });
            });

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
