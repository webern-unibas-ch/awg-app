import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import { FullscreenService } from './fullscreen.service';

describe('FullscreenService (DONE)', () => {
    let fullscreenService: FullscreenService;

    let mockDocument: Document;

    let consoleSpy: Spy;
    let exitFullscreenSpy: Spy;
    let fullScreenElementSpy: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Inject service
        fullscreenService = TestBed.inject(FullscreenService);
        mockDocument = TestBed.inject(DOCUMENT);

        Object.defineProperty(mockDocument, 'exitFullscreen', {
            value: () => Promise.resolve(),
            configurable: true,
            writable: true,
        });
        Object.defineProperty(mockDocument, 'fullscreenElement', {
            get: () => null,
            configurable: true,
        });

        // Spies on service functions
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
        exitFullscreenSpy = vi.spyOn(mockDocument, 'exitFullscreen').mockReturnValue(Promise.resolve());
        fullScreenElementSpy = vi.spyOn(mockDocument, 'fullscreenElement', 'get').mockReturnValue(null);
    });

    afterEach(() => {
        // Clear mock objects after each test
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

    describe('#closeFullscreen()', () => {
        it('... should have a method `closeFullscreen`', () => {
            expect(fullscreenService.closeFullscreen).toBeDefined();
        });

        it('... should do nothing if `exitFullscreen` is not available', () => {
            exitFullscreenSpy.mockRestore();
            Object.defineProperty(mockDocument, 'exitFullscreen', {
                value: undefined,
                configurable: true,
                writable: true,
            });

            expect(() => fullscreenService.closeFullscreen()).not.toThrow();
            expectSpyCall(consoleSpy, 0);
        });

        it('... should call `exitFullscreen` on the document', () => {
            fullscreenService.closeFullscreen();

            expectSpyCall(exitFullscreenSpy, 1);
        });

        it('... should catch an error if `exitFullscreen` fails', async () => {
            exitFullscreenSpy.mockReturnValue(Promise.reject(new Error('Test error')));

            fullscreenService.closeFullscreen();
            await Promise.resolve();

            expectSpyCall(exitFullscreenSpy, 1);
            expectSpyCall(consoleSpy, 1, new Error('Test error'));
            expectToEqual(mockConsole.get(0), new Error('Test error'));
        });
    });

    describe('#isFullscreen()', () => {
        it('... should have a method `isFullscreen`', () => {
            expect(fullscreenService.isFullscreen).toBeDefined();
        });

        it('... should return false if the document is not in fullscreen mode', () => {
            fullScreenElementSpy.mockReturnValue(null);

            expect(fullscreenService.isFullscreen()).toBe(false);
        });

        it('... should return true if the document is in fullscreen mode', () => {
            fullScreenElementSpy.mockReturnValue({});

            expect(fullscreenService.isFullscreen()).toBe(true);
        });
    });

    describe('#openFullscreen()', () => {
        it('... should have a method `openFullscreen`', () => {
            expect(fullscreenService.openFullscreen).toBeDefined();
        });

        it('... should request fullscreen mode for a given element (if not in fullscreen mode)', () => {
            fullScreenElementSpy.mockReturnValue(null);

            const element = mockDocument.createElement('div');
            // Redefine as configurable/writable for spy
            Object.defineProperty(element, 'requestFullscreen', {
                value: () => Promise.resolve(),
                configurable: true,
                writable: true,
            });
            const requestFullscreenSpy = vi.spyOn(element, 'requestFullscreen').mockReturnValue(Promise.resolve());

            fullscreenService.openFullscreen(element);

            expectSpyCall(requestFullscreenSpy, 1);
        });

        it('... should not request fullscreen mode for a given element (if already in fullscreen mode)', () => {
            fullScreenElementSpy.mockReturnValue({});

            const element = mockDocument.createElement('div');
            // Redefine as configurable/writable for spy
            Object.defineProperty(element, 'requestFullscreen', {
                value: () => Promise.resolve(),
                configurable: true,
                writable: true,
            });
            const requestFullscreenSpy = vi.spyOn(element, 'requestFullscreen').mockReturnValue(Promise.resolve());

            fullscreenService.openFullscreen(element);

            expectSpyCall(requestFullscreenSpy, 0);
        });

        it('... should catch an error if `requestFullscreen` fails', async () => {
            const element = mockDocument.createElement('div');
            // Redefine as configurable/writable for spy
            Object.defineProperty(element, 'requestFullscreen', {
                value: () => Promise.resolve(),
                configurable: true,
                writable: true,
            });
            const requestFullscreenSpy = vi
                .spyOn(element, 'requestFullscreen')
                .mockReturnValue(Promise.reject(new Error('Test error')));

            fullscreenService.openFullscreen(element);
            await Promise.resolve();

            expectSpyCall(requestFullscreenSpy, 1);
            expectSpyCall(consoleSpy, 1, new Error('Test error'));
            expectToEqual(mockConsole.get(0), new Error('Test error'));
        });
    });
});
