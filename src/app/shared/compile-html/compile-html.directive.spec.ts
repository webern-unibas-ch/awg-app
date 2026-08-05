import { ElementRef, Renderer2, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.fn>;

import { expectSpyCall, expectToBe } from '@testing/expect-helper';

import { EditionGlyphService } from '@awg-views/edition-view/services';
import {
    EditionNavigationService,
    FragmentClickEvent,
    SheetClickEvent,
} from '@awg-views/edition-view/services/edition-navigation.service';

import { CompileHtmlDirective } from './compile-html.directive';

describe('CompileHtmlDirective (DONE)', () => {
    let directive: CompileHtmlDirective;

    let applyAccessibilityAttributesSpy: Spy;
    let handleInteractionSpy: Spy;
    let handleAnchorNavigationSpy: Spy;
    let handleImageNavigationSpy: Spy;
    let serviceNavigateToIntroSpy: Spy;
    let serviceNavigateToSheetSpy: Spy;
    let serviceNavigateToReportSpy: Spy;
    let serviceGetGlyphSpy: Spy;
    let rendererSetAttributeSpy: Spy;
    let rendererSetPropertySpy: Spy;

    let mockHtmlContentSignal: WritableSignal<string>;
    let mockNativeElement: HTMLElement;

    let expectedComplexId: string;
    let expectedIntroFragment: string;
    let expectedReportFragment: string;
    let expectedSvgSheetId: string;

    beforeEach(() => {
        // Mock the input signal and native element
        mockHtmlContentSignal = signal('');
        mockNativeElement = document.createElement('div');

        TestBed.configureTestingModule({
            providers: [
                CompileHtmlDirective,
                {
                    provide: ElementRef,
                    useValue: { nativeElement: mockNativeElement },
                },
                {
                    provide: Renderer2,
                    useValue: {
                        setAttribute: vi.fn(),
                        setProperty: vi.fn(),
                    },
                },
                {
                    provide: EditionNavigationService,
                    useValue: {
                        navigateToIntroFragment: vi.fn(),
                        navigateToSvgSheet: vi.fn(),
                        navigateToReportFragment: vi.fn(),
                    },
                },
            ],
        });

        directive = TestBed.inject(CompileHtmlDirective);

        (directive as any).htmlContent = mockHtmlContentSignal;

        // Spies
        applyAccessibilityAttributesSpy = vi.spyOn(directive as any, '_applyAccessibilityAttributes');
        handleInteractionSpy = vi.spyOn(directive as any, '_handleInteraction');
        handleAnchorNavigationSpy = vi.spyOn(directive as any, '_handleAnchorNavigation');
        handleImageNavigationSpy = vi.spyOn(directive as any, '_handleImageNavigation');

        const navigationService = TestBed.inject(EditionNavigationService);
        serviceNavigateToIntroSpy = vi.spyOn(navigationService, 'navigateToIntroFragment');
        serviceNavigateToSheetSpy = vi.spyOn(navigationService, 'navigateToSvgSheet');
        serviceNavigateToReportSpy = vi.spyOn(navigationService, 'navigateToReportFragment');

        const renderer = TestBed.inject(Renderer2);
        rendererSetAttributeSpy = vi.spyOn(renderer, 'setAttribute');
        rendererSetPropertySpy = vi.spyOn(renderer, 'setProperty');

        const glyphService = TestBed.inject(EditionGlyphService);
        serviceGetGlyphSpy = vi.spyOn(glyphService, 'getGlyph').mockImplementation((glyph: string) => `${glyph}`);

        // Test data
        expectedComplexId = 'op12';
        expectedIntroFragment = 'note-80';
        expectedReportFragment = 'source_A';
        expectedSvgSheetId = 'test-1';
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('effect()', () => {
        describe('... should set innerHTML correctly depending on the input including', () => {
            it.each([
                {
                    desc: 'an empty string if content is missing',
                    inputValue: null,
                    expectedOutput: '',
                },
                {
                    desc: 'a standard HTML string',
                    inputValue: '<p>Hello World</p>',
                    expectedOutput: '<p>Hello World</p>',
                },
                {
                    desc: 'simple plain text without HTML tags',
                    inputValue: 'Plain Text Content',
                    expectedOutput: 'Plain Text Content',
                },
            ])(`... $desc`, async ({ inputValue, expectedOutput }) => {
                mockHtmlContentSignal.set(inputValue);

                TestBed.tick();

                expectSpyCall(rendererSetPropertySpy, 1, [mockNativeElement, 'innerHTML', expectedOutput]);
            });
        });

        describe('... should preserve data-attributes including', () => {
            it.each([
                {
                    desc: 'data-complex-id and data-intro-fragment-id',
                    getExpectedOutput: () =>
                        `<a data-complex-id="${expectedComplexId}" data-intro-fragment-id="${expectedIntroFragment}">Link</a>`,
                },
                {
                    desc: 'data-complex-id and data-sheet-id attributes',
                    getExpectedOutput: () =>
                        `<a data-complex-id="${expectedComplexId}" data-sheet-id="${expectedSvgSheetId}">Sheet</a>`,
                },
                {
                    desc: 'data-complex-id and data-report-fragment-id',
                    getExpectedOutput: () =>
                        `<a data-complex-id="${expectedComplexId}" data-report-fragment-id="${expectedReportFragment}">Report</a>`,
                },
            ])(`... $desc`, async ({ getExpectedOutput }) => {
                mockHtmlContentSignal.set(getExpectedOutput());

                TestBed.tick();

                expectSpyCall(rendererSetPropertySpy, 1, [mockNativeElement, 'innerHTML', getExpectedOutput()]);
            });
        });

        it('... should call `_applyAccessibilityAttributes()` when htmlContent changes', async () => {
            mockHtmlContentSignal.set('<p>Test</p>');
            TestBed.tick();

            expectSpyCall(applyAccessibilityAttributesSpy, 1);
        });
    });

    describe('METHODS', () => {
        describe('#onHostClick()', () => {
            it('... should have a method `onHostClick`', () => {
                expect((directive as any).onHostClick).toBeDefined();
            });

            it('... should call `_handleInteraction` with event target and event', () => {
                const mockTarget = document.createElement('a');
                const mockEvent = { target: mockTarget as EventTarget } as unknown as MouseEvent;

                (directive as any).onHostClick(mockEvent);

                expectSpyCall(handleInteractionSpy, 1, [mockTarget, mockEvent]);
            });
        });

        describe('#onHostKeydown()', () => {
            it('... should have a method `onHostKeydown`', () => {
                expect((directive as any).onHostKeydown).toBeDefined();
            });

            describe('... should call `_handleInteraction` when pressing', () => {
                it.each([
                    { desc: 'the Enter key', key: 'Enter' },
                    { desc: 'the Space key', key: ' ' },
                ])(`... $desc`, ({ key }) => {
                    const mockTarget = document.createElement('a');
                    const mockEvent = { target: mockTarget as EventTarget, key: key } as unknown as KeyboardEvent;

                    (directive as any).onHostKeydown(mockEvent);

                    expectSpyCall(handleInteractionSpy, 1, [mockTarget, mockEvent]);
                });
            });

            describe('... should not call `_handleInteraction` when pressing', () => {
                it.each([
                    { desc: 'the Escape key', key: 'Escape' },
                    { desc: 'the Tab key', key: 'Tab' },
                    { desc: 'any other key', key: 'ArrowUp' },
                ])(`... $desc`, ({ key }) => {
                    const mockTarget = document.createElement('a');
                    const mockEvent = { target: mockTarget as EventTarget, key: key } as unknown as KeyboardEvent;

                    (directive as any).onHostKeydown(mockEvent);

                    expect(handleInteractionSpy).not.toHaveBeenCalled();
                });
            });
        });

        describe('#_applyAccessibilityAttributes()', () => {
            it('... should have a method `_applyAccessibilityAttributes`', () => {
                expect((directive as any)._applyAccessibilityAttributes).toBeDefined();
            });

            describe('... should add accessibility attributes to dynamic links including', () => {
                it.each([
                    {
                        desc: 'links with data-intro-fragment-id',
                        getExpectedOutput: () =>
                            `<a data-complex-id="${expectedComplexId}" data-intro-fragment-id="${expectedIntroFragment}">Link</a>`,
                    },
                    {
                        desc: 'links with data-sheet-id',
                        getExpectedOutput: () =>
                            `<a data-complex-id="${expectedComplexId}" data-sheet-id="${expectedSvgSheetId}">Sheet</a>`,
                    },
                    {
                        desc: 'links with data-report-fragment-id',
                        getExpectedOutput: () =>
                            `<a data-complex-id="${expectedComplexId}" data-report-fragment-id="${expectedReportFragment}">Report</a>`,
                    },
                ])(`... $desc`, async ({ getExpectedOutput }) => {
                    const htmlString = getExpectedOutput();

                    mockNativeElement.innerHTML = htmlString;

                    mockHtmlContentSignal.set(htmlString);

                    TestBed.tick();

                    const foundAnchor = mockNativeElement.querySelector('a');

                    expectSpyCall(rendererSetAttributeSpy, 2);
                    expect(rendererSetAttributeSpy).toHaveBeenCalledWith(foundAnchor, 'tabindex', '0');
                    expect(rendererSetAttributeSpy).toHaveBeenCalledWith(foundAnchor, 'role', 'link');
                });
            });

            it('... should not add accessibility attributes to standard links without data-attributes', async () => {
                rendererSetAttributeSpy.mockClear();

                const plainHtml = '<a href="https://example.com">External Link</a>';
                mockNativeElement.innerHTML = plainHtml;

                mockHtmlContentSignal.set(plainHtml);

                TestBed.tick();

                expectSpyCall(rendererSetAttributeSpy, 0);
            });
        });

        describe('#_handleInteraction()', () => {
            it('... should have a method `_handleInteraction`', () => {
                expect((directive as any)._handleInteraction).toBeDefined();
            });

            describe('... should forward the interaction to the correct handler if target is', () => {
                const createMockDOM = (tagName: string, wrapInAnchor = false) => {
                    const element = document.createElement(tagName);
                    if (wrapInAnchor) {
                        const anchor = document.createElement('a');
                        anchor.appendChild(element);
                        return element;
                    }
                    return element;
                };

                it.each([
                    {
                        desc: 'an anchor element directly',
                        target: createMockDOM('a'),
                        getExpectedSpy: () => handleAnchorNavigationSpy,
                        getUnexpectedSpy: () => handleImageNavigationSpy,
                    },
                    {
                        desc: 'a span element wrapped inside an anchor',
                        target: createMockDOM('span', true),
                        getExpectedSpy: () => handleAnchorNavigationSpy,
                        getUnexpectedSpy: () => handleImageNavigationSpy,
                    },
                    {
                        desc: 'an image element directly',
                        target: createMockDOM('img'),
                        getExpectedSpy: () => handleImageNavigationSpy,
                        getUnexpectedSpy: () => handleAnchorNavigationSpy,
                    },
                    {
                        desc: 'an image element wrapped inside an anchor (anchor takes priority)',
                        target: createMockDOM('img', true),
                        getExpectedSpy: () => handleAnchorNavigationSpy,
                        getUnexpectedSpy: () => handleImageNavigationSpy,
                    },
                ])(`... $desc`, ({ target, getExpectedSpy, getUnexpectedSpy }) => {
                    const mockEvent = {} as unknown as Event;

                    (directive as any)._handleInteraction(target, mockEvent);

                    const expectedSpy = getExpectedSpy();
                    const expectedElement = target.closest(expectedSpy === handleAnchorNavigationSpy ? 'a' : 'img');
                    expectSpyCall(expectedSpy, 1, [expectedElement, mockEvent]);

                    expectSpyCall(getUnexpectedSpy(), 0);
                });
            });

            describe('... should do nothing', () => {
                it('... if the target is a Text node instead of an Element', () => {
                    const mockTextNode = document.createTextNode('Just some text') as unknown as EventTarget;
                    const mockEvent = {} as unknown as Event;

                    (directive as any)._handleInteraction(mockTextNode, mockEvent);

                    expectSpyCall(handleAnchorNavigationSpy, 0);
                    expectSpyCall(handleImageNavigationSpy, 0);
                });
            });
        });

        describe('#_handleAnchorNavigation()', () => {
            it('... should have a method `_handleAnchorNavigation`', () => {
                expect((directive as any)._handleAnchorNavigation).toBeDefined();
            });

            describe('... should navigate to', () => {
                const testCases = [
                    {
                        desc: 'intro fragment with complexId if data-intro-fragment-id is given',
                        attributes: { 'data-complex-id': 'op12', 'data-intro-fragment-id': 'intro-1' },
                        expectedArgs: { complexId: 'op12', fragmentId: 'intro-1' } as FragmentClickEvent,
                        getExpectedSpy: () => serviceNavigateToIntroSpy,
                    },
                    {
                        desc: 'intro fragment with empty complexId if data-complex-id is missing',
                        attributes: { 'data-intro-fragment-id': 'intro-2' },
                        expectedArgs: { complexId: '', fragmentId: 'intro-2' } as FragmentClickEvent,
                        getExpectedSpy: () => serviceNavigateToIntroSpy,
                    },
                    {
                        desc: 'svg sheet if data-sheet-id and data-complex-id are given',
                        attributes: { 'data-complex-id': 'op12', 'data-sheet-id': 'sheet-3' },
                        expectedArgs: { complexId: 'op12', sheetId: 'sheet-3' } as SheetClickEvent,
                        getExpectedSpy: () => serviceNavigateToSheetSpy,
                    },
                    {
                        desc: 'report fragment if data-report-fragment-id and data-complex-id are given',
                        attributes: { 'data-complex-id': 'op12', 'data-report-fragment-id': 'report-4' },
                        expectedArgs: { complexId: 'op12', fragmentId: 'report-4' } as FragmentClickEvent,
                        getExpectedSpy: () => serviceNavigateToReportSpy,
                    },
                ];

                it.each(testCases)(`... $desc`, ({ attributes, expectedArgs, getExpectedSpy }) => {
                    const mockAnchor = {
                        getAttribute: (key: string) => attributes[key as keyof typeof attributes] || null,
                    } as unknown as HTMLAnchorElement;

                    const mockEvent = {
                        preventDefault: vi.fn(),
                    } as unknown as Event;

                    (directive as any)._handleAnchorNavigation(mockAnchor, mockEvent);

                    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);

                    const targetSpy = getExpectedSpy();

                    expectSpyCall(targetSpy, 1, [expectedArgs]);

                    [serviceNavigateToIntroSpy, serviceNavigateToSheetSpy, serviceNavigateToReportSpy]
                        .filter(spy => spy !== targetSpy)
                        .forEach(spy => expectSpyCall(spy, 0));
                });
            });

            describe('... should not navigate (if data-complex-id is missing)', () => {
                const testCases = [
                    {
                        desc: 'to svg sheet',
                        attributes: { 'data-sheet-id': 'sheet-5' },
                    },
                    {
                        desc: 'to report fragment',
                        attributes: { 'data-report-fragment-id': 'report-6' },
                    },
                    {
                        desc: 'if data-complex-id is present but no data-sheet-id or data-report-fragment-id',
                        attributes: { 'data-complex-id': 'op12' },
                    },
                ];

                it.each(testCases)(`... $desc`, ({ attributes }) => {
                    const mockAnchor = {
                        getAttribute: (key: string) => attributes[key as keyof typeof attributes] || null,
                    } as unknown as HTMLAnchorElement;

                    const mockEvent = {
                        preventDefault: vi.fn(),
                    } as unknown as Event;

                    (directive as any)._handleAnchorNavigation(mockAnchor, mockEvent);

                    expect(mockEvent.preventDefault).not.toHaveBeenCalled();

                    expectSpyCall(serviceNavigateToIntroSpy, 0);
                    expectSpyCall(serviceNavigateToSheetSpy, 0);
                    expectSpyCall(serviceNavigateToReportSpy, 0);
                });
            });
        });

        describe('#_handleImageNavigation()', () => {
            it('... should have a method `_handleImageNavigation`', () => {
                expect((directive as any)._handleImageNavigation).toBeDefined();
            });

            describe('... should handle snippet images', () => {
                it('... and open the snippet if data-snippet-id and data-snippet-src are present', () => {
                    const mockImg = {
                        hasAttribute: (attr: string) => attr === 'data-snippet-id' || attr === 'data-snippet-src',
                        getAttribute: (attr: string) => {
                            if (attr === 'data-snippet-src') {
                                return 'path/to/image.png';
                            }
                            if (attr === 'data-snippet-id') {
                                return 'snip-123';
                            }
                            return null;
                        },
                    } as unknown as HTMLImageElement;

                    const mockEvent = { preventDefault: vi.fn() } as unknown as Event;

                    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

                    (directive as any)._handleImageNavigation(mockImg, mockEvent);

                    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
                    expect(consoleSpy).toHaveBeenCalledWith('Snippet öffnen:', {
                        src: 'path/to/image.png',
                        id: 'snip-123',
                    });

                    consoleSpy.mockRestore();
                });
            });

            describe('... should not handle images if', () => {
                it.each([
                    {
                        desc: 'data-snippet-id is missing (but src is present)',
                        hasId: false,
                        hasSrc: true,
                        attributes: { 'data-snippet-src': 'path/to/image.png' },
                    },
                    {
                        desc: 'data-snippet-src is missing (but id is present)',
                        hasId: true,
                        hasSrc: false,
                        attributes: { 'data-snippet-id': 'snip-123' },
                    },
                    {
                        desc: 'both data-snippet-id and data-snippet-src are missing',
                        hasId: false,
                        hasSrc: false,
                        attributes: {},
                    },
                ])(`... $desc`, ({ hasId, hasSrc, attributes }) => {
                    const mockImg = {
                        hasAttribute: (attr: string) => {
                            if (attr === 'data-snippet-id') {
                                return hasId;
                            }
                            if (attr === 'data-snippet-src') {
                                return hasSrc;
                            }
                            return false;
                        },
                        getAttribute: (attr: string) => attributes[attr as keyof typeof attributes] || null,
                    } as unknown as HTMLImageElement;

                    const mockEvent = { preventDefault: vi.fn() } as unknown as Event;

                    (directive as any)._handleImageNavigation(mockImg, mockEvent);

                    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
                });
            });
        });

        describe('#_replaceGlyphPlaceholders()', () => {
            it('... should have a method `_replaceGlyphPlaceholders`', () => {
                expect((directive as any)._replaceGlyphPlaceholders).toBeDefined();
            });

            const glyphTestCases = [
                {
                    desc: 'return the original string if no glyph placeholder is present',
                    inputValue: '<p>Standard HTML Content</p>',
                    getExpectedOutput: () => '<p>Standard HTML Content</p>',
                    shouldCallService: false,
                    expectedServiceArgs: [],
                },
                {
                    desc: 'replace a single glyph placeholder with the value from GlyphService',
                    inputValue: "Text with <span class='glyph accid'>{{ref.getGlyph('[a]')}}</span> here.",
                    getExpectedOutput: () => "Text with <span class='glyph accid'>[a]</span> here.",
                    shouldCallService: true,
                    expectedServiceArgs: ['[a]'],
                },
                {
                    desc: 'replace multiple glyph placeholders within the same HTML string',
                    inputValue:
                        "<span class='glyph'>{{ref.getGlyph('[p]')}}</span> and <span class='glyph unicode'>{{ref.getGlyph('[ped]')}}</span>",
                    getExpectedOutput: () =>
                        "<span class='glyph'>[p]</span> and <span class='glyph unicode'>[ped]</span>",
                    shouldCallService: true,
                    expectedServiceArgs: ['[p]', '[ped]'],
                },
            ];

            it.each(glyphTestCases)(
                `... should $desc`,
                ({ inputValue, getExpectedOutput, shouldCallService, expectedServiceArgs }) => {
                    const result = (directive as any)._replaceGlyphPlaceholders(inputValue);

                    expectToBe(result, getExpectedOutput());

                    if (shouldCallService) {
                        expect(serviceGetGlyphSpy).toHaveBeenCalledTimes(expectedServiceArgs.length);

                        expectedServiceArgs.forEach((arg, index) => {
                            expect(serviceGetGlyphSpy).toHaveBeenNthCalledWith(index + 1, arg);
                        });
                    } else {
                        expectSpyCall(serviceGetGlyphSpy, 0);
                    }
                }
            );
        });
    });
});
