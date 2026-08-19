import { DebugElement } from '@angular/core';
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
import { IntroBlock } from '@awg-views/edition-view/models';

import { EditionIntroContentComponent } from './edition-intro-content.component';

describe('EditionIntroContentComponent (DONE)', () => {
    let component: EditionIntroContentComponent;
    let fixture: ComponentFixture<EditionIntroContentComponent>;
    let compDe: DebugElement;

    let expectedIntroBlockContent: IntroBlock[];
    let expectedNotesLabel: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective],
            declarations: [EditionIntroContentComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedIntroBlockContent = structuredClone(mockEditionData.mockIntroSectionData.intro[0].content ?? []);
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
        it('... should not have `introBlockContent`', () => {
            expect(component.introBlockContent).toBeUndefined();
        });

        it('... should not have `notesLabel`', () => {
            expect(component.notesLabel).toBeUndefined();
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
                let sectionDes: DebugElement[];

                beforeEach(() => {
                    sectionDes = getAndExpectDebugElementByCss(
                        compDe,
                        'section.awg-edition-intro-section',
                        expectedIntroBlockContent.length + 1,
                        expectedIntroBlockContent.length + 1
                    );
                });
                describe('... intro block heading', () => {
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

                        sectionDes.forEach((sectionDe, index) => {
                            if (index < expectedIntroBlockContent.length) {
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
                                index < expectedIntroBlockContent.length ? 1 : 0,
                                index < expectedIntroBlockContent.length ? 1 : 0
                            );
                        });
                    });

                    it('... should pass the correct header string to the CompileHtmlDirective', () => {
                        sectionDes.forEach((sectionDe, index) => {
                            if (index < expectedIntroBlockContent.length) {
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
                });

                describe('... intro block content', () => {
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

                        sectionDes.forEach((sectionDe, index) => {
                            if (index < expectedIntroBlockContent.length) {
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

                    it('... should pass the correct html content strings to the CompileHtmlDirective', () => {
                        sectionDes.forEach((sectionDe, index) => {
                            if (index < expectedIntroBlockContent.length) {
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
                        (acc, block) => acc + (block.blockNotes?.length ?? 0),
                        0
                    );

                    getAndExpectDebugElementByCss(
                        getNotesSectionDe(),
                        'small > div.awg-edition-intro-note',
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
