import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
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

import { SourceDescWritingInstruments } from '@awg-views/edition-view/models/source-desc.model';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

import { SourceDescWritingInstrumentsComponent } from './source-desc-writing-instruments.component';

describe('SourceDescWritingInstrumentsComponent (DONE)', () => {
    let component: SourceDescWritingInstrumentsComponent;
    let fixture: ComponentFixture<SourceDescWritingInstrumentsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedWritingInstruments: SourceDescWritingInstruments;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective, SourceDescWritingInstrumentsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        const writingInstruments = structuredClone(mockEditionData.mockSourceDescListData).sources[1].physDesc
            .writingInstruments;

        if (!writingInstruments) {
            expect.fail('Expected writingInstruments to be defined in mock data.');
        }
        expectedWritingInstruments = writingInstruments;

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescWritingInstrumentsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `writingInstruments` to hold the default value', () => {
            expectToBe(isSignal(component.writingInstruments), true);

            expect(component.writingInstruments()).toBeUndefined();
        });

        it('... should have computed signal `formattedWritingInstruments` to hold an empty string', () => {
            expectToBe(isSignal(component.formattedWritingInstruments), true);

            expectToBe(component.formattedWritingInstruments(), '');
        });

        describe('VIEW', () => {
            it('... should contain no writing instruments paragraph yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-writing-instruments', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('writingInstruments', expectedWritingInstruments);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `writingInstruments` to hold the provided writing instruments', () => {
            expectToEqual(component.writingInstruments(), expectedWritingInstruments);
        });

        it('... should have computed signal `formattedWritingInstruments` to hold the formatted writing instruments', () => {
            expectToBe(
                component.formattedWritingInstruments(),
                component.getWritingInstruments(expectedWritingInstruments)
            );
        });

        describe('... should have recomputed signal `formattedWritingInstruments` to hold an empty string if', () => {
            it.each([
                { desc: 'main writing instrument is missing', writingInstruments: { secondary: ['secondary1'] } },
                { desc: 'writing instruments are undefined', writingInstruments: undefined },
            ])('... $desc', ({ writingInstruments }) => {
                fixture.componentRef.setInput('writingInstruments', writingInstruments);

                expectToBe(component.formattedWritingInstruments(), '');
            });
        });

        describe('VIEW', () => {
            const getParagraphDes = () =>
                getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-writing-instruments', 1, 1);

            describe('... should render no content if', () => {
                it.each([
                    { desc: 'main writing instrument is missing', writingInstruments: { secondary: ['secondary1'] } },
                    { desc: 'writing instruments are undefined', writingInstruments: undefined },
                ])('... $desc', async ({ writingInstruments }) => {
                    fixture.componentRef.setInput('writingInstruments', writingInstruments);
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-writing-instruments', 0, 0);
                });
            });

            it('... should contain one writing instruments paragraph', () => {
                getParagraphDes();
            });

            it('... should display the label in the first span of the paragraph', () => {
                const spanDes = getAndExpectDebugElementByCss(getParagraphDes()[0], 'span', 2, 2);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), 'Schreibstoff:');
            });

            it('... should have one CompileHtmlDirective in the paragraph', () => {
                getAndExpectDebugElementByDirective(getParagraphDes()[0], CompileHtmlDirective, 1, 1);
            });

            it('... should pass down the formatted instruments string to the CompileHtmlDirective', () => {
                const directiveDes = getAndExpectDebugElementByDirective(
                    getParagraphDes()[0],
                    CompileHtmlDirective,
                    1,
                    1
                );
                const directiveIns = directiveDes[0].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                expectToBe(directiveIns.htmlContent(), component.getWritingInstruments(expectedWritingInstruments));
            });

            it('... should display the writing instruments in the second span of the paragraph', () => {
                const spanDes = getAndExpectDebugElementByCss(getParagraphDes()[0], 'span', 2, 2);
                const spanEl: HTMLSpanElement = spanDes[1].nativeElement;

                const secondaryInstruments = expectedWritingInstruments.secondary ?? [];
                const secondaryString = secondaryInstruments.length > 0 ? '; ' + secondaryInstruments.join(', ') : '';

                // Process HTML expression of expected text content
                const expectedHtmlTextContent = mockDocument.createElement('p');
                expectedHtmlTextContent.innerHTML =
                    '<span>' + expectedWritingInstruments.main + secondaryString + '.</span>';

                expectToBe(spanEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
            });
        });

        describe('METHODS', () => {
            describe('#getWritingInstruments()', () => {
                it('... should have a method `getWritingInstruments`', () => {
                    expect(component.getWritingInstruments).toBeDefined();
                });

                it.each([
                    {
                        desc: 'an empty string if writing instruments are undefined',
                        writingInstruments: undefined,
                        expected: '',
                    },
                    {
                        desc: 'only main writing instrument when secondary is undefined',
                        writingInstruments: { main: 'main instrument', secondary: undefined },
                        expected: 'main instrument.',
                    },
                    {
                        desc: 'only main writing instrument when secondary is an empty array',
                        writingInstruments: { main: 'main instrument', secondary: [] },
                        expected: 'main instrument.',
                    },
                    {
                        desc: 'main and a single secondary writing instrument if provided',
                        writingInstruments: { main: 'main instrument', secondary: ['secondary1'] },
                        expected: 'main instrument; secondary1.',
                    },
                    {
                        desc: 'main and multiple secondary writing instruments if provided',
                        writingInstruments: {
                            main: 'main instrument',
                            secondary: ['secondary1', 'secondary2', 'secondary3'],
                        },
                        expected: 'main instrument; secondary1, secondary2, secondary3.',
                    },
                    {
                        desc: '`undefined` for main if main is undefined',
                        writingInstruments: { main: undefined, secondary: ['secondary1', 'secondary2'] },
                        expected: 'undefined; secondary1, secondary2.',
                    },
                ])(
                    '... should return $desc',
                    ({
                        writingInstruments,
                        expected,
                    }: {
                        writingInstruments: SourceDescWritingInstruments | undefined;
                        expected: string;
                    }) => {
                        expectToBe(component.getWritingInstruments(writingInstruments), expected);
                    }
                );
            });
        });
    });
});
