import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { IntroBlock } from '@awg-views/edition-view/models/intro.model';

import { EditionIntroContentComponent } from './edition-intro-content.component';

describe('EditionIntroContentComponent (DONE)', () => {
    let component: EditionIntroContentComponent;
    let fixture: ComponentFixture<EditionIntroContentComponent>;
    let compDe: DebugElement;

    let expectedIntroBlockContent: IntroBlock[];
    let expectedLength: number;
    let expectedNotesLabel: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionIntroContentComponent, CompileHtmlDirective],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedIntroBlockContent = structuredClone(mockEditionData.mockIntroSectionData.intro[0].content ?? []);
        expectedLength = expectedIntroBlockContent.length;
        expectedNotesLabel = 'Test notes label';

        // Create component fixture
        fixture = TestBed.createComponent(EditionIntroContentComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `introBlockContent`', () => {
            expectToBe(isSignal(component.introBlockContent), true);

            expect(() => component.introBlockContent()).toThrow();
        });

        it('... should throw due to missing required input signal `notesLabel`', () => {
            expectToBe(isSignal(component.notesLabel), true);

            expect(() => component.notesLabel()).toThrow();
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
            fixture.componentRef.setInput('introBlockContent', expectedIntroBlockContent);
            fixture.componentRef.setInput('notesLabel', expectedNotesLabel);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `introBlockContent` to hold the expected content', () => {
            expectToEqual(component.introBlockContent(), expectedIntroBlockContent);
        });

        it('... should have input signal `notesLabel` to hold the expected label', () => {
            expectToBe(component.notesLabel(), expectedNotesLabel);
        });

        describe('VIEW', () => {
            it('... should render no content if `introBlockContent` is empty', () => {
                fixture.componentRef.setInput('introBlockContent', []);
                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-content', 0, 0);
            });

            it('... should contain one `div.awg-edition-intro-content`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-content', 1, 1);
            });

            it('... should contain as many awg-edition-intro-sections as introBlockContent items (+ 1 for notes)', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'section.awg-edition-intro-section',
                    expectedLength + 1,
                    expectedLength + 1
                );
            });

            it('... should have correct id for each awg-edition-intro-section', () => {
                const sectionDes = getAndExpectDebugElementByCss(
                    compDe,
                    'section.awg-edition-intro-section',
                    expectedLength + 1,
                    expectedLength + 1
                );

                sectionDes.forEach((sectionDe, index) => {
                    const expectedId = index < expectedLength ? expectedIntroBlockContent[index].blockId : 'notes';

                    expectToBe(sectionDe.attributes['id'], expectedId);
                });
            });

            describe('... content sections', () => {
                let sectionDes: DebugElement[];

                const getExpectedLength = () => expectedLength;
                const getSectionDes = () =>
                    getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        getExpectedLength() + 1,
                        getExpectedLength() + 1
                    );

                beforeEach(() => {
                    sectionDes = getSectionDes();
                });

                describe('... intro block heading', () => {
                    it('... should not contain an intro block heading if block header is empty', async () => {
                        const introBlockWithoutHeader = [
                            {
                                blockId: 'testId',
                                blockHeader: '',
                                blockContent: ['Test content'],
                                blockNotes: ['Test notes'],
                            },
                        ];
                        fixture.componentRef.setInput('introBlockContent', introBlockWithoutHeader);
                        await detectChangesOnPush(fixture);

                        sectionDes = getAndExpectDebugElementByCss(
                            compDe,
                            'section.awg-edition-intro-section',
                            introBlockWithoutHeader.length + 1,
                            introBlockWithoutHeader.length + 1
                        );

                        sectionDes.forEach((sectionDe, index) => {
                            if (index < introBlockWithoutHeader.length) {
                                getAndExpectDebugElementByCss(
                                    sectionDe,
                                    'div.awg-edition-intro-block > p.heading',
                                    0,
                                    0
                                );
                            }
                        });
                    });

                    it('... should contain as many intro block headings as block headers in data', () => {
                        sectionDes.forEach((sectionDe, index) => {
                            // Each section block, except the notes section, should have a heading
                            getAndExpectDebugElementByCss(
                                sectionDe,
                                'div.awg-edition-intro-block > p.heading',
                                index < expectedLength ? 1 : 0,
                                index < expectedLength ? 1 : 0
                            );
                        });
                    });

                    it('... should pass the correct header string to the CompileHtmlDirective', () => {
                        sectionDes.forEach((sectionDe, index) => {
                            if (index < expectedLength) {
                                const currentBlock = expectedIntroBlockContent[index];

                                if (currentBlock.blockHeader) {
                                    const expectedTotalDirectiveInstances = 1 + currentBlock.blockContent.length;

                                    const allDirectiveDes = getAndExpectDebugElementByDirective(
                                        sectionDe,
                                        CompileHtmlDirective,
                                        expectedTotalDirectiveInstances,
                                        expectedTotalDirectiveInstances
                                    );
                                    const headerDirectiveDe = allDirectiveDes[0];
                                    const headerDirectiveIns = headerDirectiveDe.injector.get(CompileHtmlDirective);

                                    expectToBe(headerDirectiveIns.htmlContent(), currentBlock.blockHeader);
                                }
                            }
                        });
                    });

                    it('... should display correct header in each heading', () => {
                        sectionDes.forEach((sectionDe, index) => {
                            // Each section block, except the notes section, should have a heading
                            const expectedHeadingLength = index < expectedLength ? 1 : 0;

                            const pDes = getAndExpectDebugElementByCss(
                                sectionDe,
                                'div.awg-edition-intro-block > p.heading',
                                expectedHeadingLength,
                                expectedHeadingLength
                            );

                            if (index < expectedLength) {
                                const pEl: HTMLParagraphElement = pDes[0].nativeElement;
                                expectToBe(pEl.textContent, expectedIntroBlockContent[index].blockHeader);
                            }
                        });
                    });
                });

                describe('... intro block content', () => {
                    it('... should not contain any (additional) intro blocks if block content is empty', async () => {
                        const introBlockWithoutContent = [
                            {
                                blockId: 'testId',
                                blockHeader: 'Test header',
                                blockContent: [],
                                blockNotes: ['Test notes'],
                            },
                        ];
                        fixture.componentRef.setInput('introBlockContent', introBlockWithoutContent);
                        await detectChangesOnPush(fixture);

                        sectionDes = getAndExpectDebugElementByCss(
                            compDe,
                            'section.awg-edition-intro-section',
                            introBlockWithoutContent.length + 1,
                            introBlockWithoutContent.length + 1
                        );

                        sectionDes.forEach((sectionDe, index) => {
                            if (index < introBlockWithoutContent.length) {
                                getAndExpectDebugElementByCss(
                                    sectionDe,
                                    'div.awg-edition-intro-block > p.heading',
                                    1,
                                    1
                                );
                                getAndExpectDebugElementByCss(sectionDe, 'div.awg-edition-intro-block', 1, 1);
                            }
                        });
                    });

                    it('... should contain as many intro blocks as block content items in data', () => {
                        sectionDes.forEach((sectionDe, index) => {
                            if (index < expectedLength) {
                                const expectedBlockContent = expectedIntroBlockContent[index].blockContent;
                                const expectedBlockHeader = expectedIntroBlockContent[index].blockHeader;
                                const expectedBlockLength = expectedBlockHeader
                                    ? expectedBlockContent.length + 1
                                    : expectedBlockContent.length;

                                getAndExpectDebugElementByCss(
                                    sectionDe,
                                    'div.awg-edition-intro-block',
                                    expectedBlockLength,
                                    expectedBlockLength
                                );
                            }
                        });
                    });

                    it('... should pass the correct html content strings to the CompileHtmlDirective', () => {
                        sectionDes.forEach((sectionDe, index) => {
                            if (index < expectedLength) {
                                const currentBlock = expectedIntroBlockContent[index];

                                const expectedTotalDirectiveInstances =
                                    (currentBlock.blockHeader ? 1 : 0) + currentBlock.blockContent.length;

                                const allDirectiveDes = getAndExpectDebugElementByDirective(
                                    sectionDe,
                                    CompileHtmlDirective,
                                    expectedTotalDirectiveInstances,
                                    expectedTotalDirectiveInstances
                                );

                                const contentDirectiveDes = currentBlock.blockHeader
                                    ? allDirectiveDes.slice(1)
                                    : allDirectiveDes;

                                currentBlock.blockContent.forEach((expectedText, contentIndex) => {
                                    const currentDirectiveDe = contentDirectiveDes[contentIndex];
                                    const currentDirectiveIns = currentDirectiveDe.injector.get(CompileHtmlDirective);

                                    expectToBe(currentDirectiveIns.htmlContent(), expectedText);
                                });
                            }
                        });
                    });

                    it('... should have one anchor in first paragraph, and 3 in the second one in the first section', () => {
                        const expectedBlockLength = expectedIntroBlockContent[0].blockContent.length + 1;

                        const divDes = getAndExpectDebugElementByCss(
                            sectionDes[0],
                            'div.awg-edition-intro-block',
                            expectedBlockLength,
                            expectedBlockLength
                        );

                        // First div has header
                        getAndExpectDebugElementByCss(divDes[1], 'a', 1, 1);
                        getAndExpectDebugElementByCss(divDes[2], 'a', 3, 3);
                    });
                });
            });

            describe('... notes section', () => {
                // Helper function to get the notes section debug element
                const getNotesSectionDe = (): DebugElement => {
                    const sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedLength + 1,
                        expectedLength + 1
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
                        (acc, block) => acc + (block.blockNotes?.length ?? 0),
                        0
                    );

                    getAndExpectDebugElementByCss(
                        getNotesSectionDe(),
                        'div.awg-edition-intro-note.small',
                        totalBlockNotesLength,
                        totalBlockNotesLength
                    );
                });

                it('... should pass the correct html note strings to the CompileHtmlDirective', () => {
                    const totalBlockNotesLength = expectedIntroBlockContent.reduce(
                        (acc, block) => acc + (block.blockNotes?.length ?? 0),
                        0
                    );

                    const notesSectionDe = getNotesSectionDe();
                    const noteDirectiveDes = getAndExpectDebugElementByDirective(
                        notesSectionDe,
                        CompileHtmlDirective,
                        totalBlockNotesLength,
                        totalBlockNotesLength
                    );

                    const allExpectedNotes = expectedIntroBlockContent.flatMap(block => block.blockNotes);

                    allExpectedNotes.forEach((expectedNoteText, noteIndex) => {
                        const currentDirectiveDe = noteDirectiveDes[noteIndex];
                        const currentDirectiveIns = currentDirectiveDe.injector.get(CompileHtmlDirective);

                        expectToBe(currentDirectiveIns.htmlContent(), expectedNoteText);
                    });
                });
            });
        });
    });
});
