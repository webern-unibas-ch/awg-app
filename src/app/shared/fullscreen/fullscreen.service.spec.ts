import { DOCUMENT, isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import { FullscreenService } from './fullscreen.service';

describe('FullscreenService (DONE)', () => {
    let fullscreenService: FullscreenService;
    let mockDocument: Document;

    let consoleSpy: Spy;
    let exitFullscreenSpy: Spy;

    let expectedFsElement: HTMLElement;

    /**
     * Helper function to simulate a browser fullscreen change event.
     */
    const simulateFullscreenChangeEvent = (element: HTMLElement | null): void => {
        (mockDocument as any).fullscreenElement = element;
        fullscreenService.updateState();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FullscreenService],
        });

        // Inject services
        fullscreenService = TestBed.inject(FullscreenService);
        mockDocument = TestBed.inject(DOCUMENT);

        Object.defineProperty(mockDocument, 'exitFullscreen', {
            value: () => Promise.resolve(),
            configurable: true,
            writable: true,
        });
        Object.defineProperty(mockDocument, 'fullscreenElement', {
            value: null,
            configurable: true,
            writable: true,
        });

        expectedFsElement = mockDocument.createElement('div');
        mockDocument.body.appendChild(expectedFsElement);

        // Service spies
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
        exitFullscreenSpy = vi.spyOn(mockDocument, 'exitFullscreen').mockReturnValue(Promise.resolve());
    });

    afterEach(() => {
        // Clear mock objects after each test
        expectedFsElement.remove();
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    it('... should be created', () => {
        expect(fullscreenService).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock console', () => {
            console.error('Test');

            expectToBe(mockConsole.get(0), 'Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined();
        });
    });

    it('... should have a signal `isFullscreen` to hold false', () => {
        expectToBe(isSignal(fullscreenService.isFullscreen), true);

        expectToBe(fullscreenService.isFullscreen(), false);
    });

    describe('METHODS', () => {
        describe('#updateState()', () => {
            it('... should have a method `updateState`', () => {
                expect(fullscreenService.updateState).toBeDefined();
            });

            it('... should update signal `isFullscreen` based on the document state', () => {
                expectToBe(fullscreenService.isFullscreen(), false);

                simulateFullscreenChangeEvent(expectedFsElement);

                expectToBe(fullscreenService.isFullscreen(), true);

                simulateFullscreenChangeEvent(null);

                expectToBe(fullscreenService.isFullscreen(), false);
            });
        });

        describe('#closeFullscreen()', () => {
            it('... should have a method `closeFullscreen`', () => {
                expect(fullscreenService.closeFullscreen).toBeDefined();
            });

            it('... should do nothing if `exitFullscreen` is not available', () => {
                (mockDocument as any).exitFullscreen = undefined;

                expect(() => fullscreenService.closeFullscreen()).not.toThrow();
                expectSpyCall(consoleSpy, 0);
            });

            it('... should call `exitFullscreen` on the document', () => {
                fullscreenService.closeFullscreen();

                expectSpyCall(exitFullscreenSpy, 1);
            });

            it('... should catch an error if `exitFullscreen` fails', async () => {
                const err = new Error('Test error');
                exitFullscreenSpy.mockRejectedValue(err);

                fullscreenService.closeFullscreen();
                await new Promise(resolve => setTimeout(resolve, 0));

                expectSpyCall(exitFullscreenSpy, 1);
                expectSpyCall(consoleSpy, 1, err);

                const loggedError = mockConsole.get(0) as unknown as Error;
                expectToBe(loggedError, err);
            });
        });

        describe('#openFullscreen()', () => {
            let requestFullscreenSpy: Mock;

            beforeEach(() => {
                requestFullscreenSpy = vi.fn().mockResolvedValue(undefined);
                expectedFsElement.requestFullscreen = requestFullscreenSpy;
            });

            afterEach(() => {
                vi.restoreAllMocks();
            });

            it('... should have a method `openFullscreen`', () => {
                expect(fullscreenService.openFullscreen).toBeDefined();
            });

            it('... should request fullscreen mode for a given element (if not in fullscreen mode)', () => {
                simulateFullscreenChangeEvent(null);

                fullscreenService.openFullscreen(expectedFsElement);

                expectSpyCall(requestFullscreenSpy, 1);
            });

            it('... should not request fullscreen mode for a given element (if already in fullscreen mode)', () => {
                const otherElement = mockDocument.createElement('div');
                simulateFullscreenChangeEvent(otherElement);

                fullscreenService.openFullscreen(expectedFsElement);

                expectSpyCall(requestFullscreenSpy, 0);
            });

            it('... should catch an error if `requestFullscreen` fails', async () => {
                const err = new Error('Test error');
                requestFullscreenSpy.mockRejectedValue(err);

                simulateFullscreenChangeEvent(null);

                fullscreenService.openFullscreen(expectedFsElement);
                await new Promise(resolve => setTimeout(resolve, 0));

                expectSpyCall(requestFullscreenSpy, 1);
                expectSpyCall(consoleSpy, 1, err);

                const loggedError = mockConsole.get(0) as unknown as Error;
                expectToEqual(loggedError, err);
            });
        });
    });
});
