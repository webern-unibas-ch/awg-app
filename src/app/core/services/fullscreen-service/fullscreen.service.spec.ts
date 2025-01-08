import { DOCUMENT } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import Spy = jasmine.Spy;

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

        // Spies on service functions
        consoleSpy = spyOn(console, 'error').and.callFake(mockConsole.log);
        exitFullscreenSpy = spyOn(mockDocument, 'exitFullscreen').and.returnValue(Promise.resolve());
        fullScreenElementSpy = spyOnProperty(mockDocument, 'fullscreenElement', 'get').and.returnValue(null);
    });

    afterEach(() => {
        // Clear mock objects after each test
        mockConsole.clear();
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

        it('... should call `exitFullscreen` on the document', () => {
            fullscreenService.closeFullscreen();

            expectSpyCall(exitFullscreenSpy, 1);
        });

        it('... should catch an error if `exitFullscreen` fails', fakeAsync(() => {
            exitFullscreenSpy.and.returnValue(Promise.reject(new Error('Test error')));

            fullscreenService.closeFullscreen();

            tick();

            expectSpyCall(exitFullscreenSpy, 1);
            expectSpyCall(consoleSpy, 1, new Error('Test error'));
            expectToEqual(mockConsole.get(0), new Error('Test error'));
        }));
    });

    describe('#isFullscreen()', () => {
        it('... should have a method `isFullscreen`', () => {
            expect(fullscreenService.isFullscreen).toBeDefined();
        });

        it('... should return false if the document is not in fullscreen mode', () => {
            fullScreenElementSpy.and.returnValue(null);

            expect(fullscreenService.isFullscreen()).toBeFalse();
        });

        it('... should return true if the document is in fullscreen mode', () => {
            fullScreenElementSpy.and.returnValue({});

            expect(fullscreenService.isFullscreen()).toBeTrue();
        });
    });

    describe('#openFullscreen()', () => {
        it('... should have a method `openFullscreen`', () => {
            expect(fullscreenService.openFullscreen).toBeDefined();
        });

        it('... should request fullscreen mode for a given element (if not in fullscreen mode)', fakeAsync(() => {
            fullScreenElementSpy.and.returnValue(null);

            const element = mockDocument.createElement('div');
            const requestFullscreenSpy = spyOn(element, 'requestFullscreen').and.returnValue(Promise.resolve());

            fullscreenService.openFullscreen(element);

            tick();

            expectSpyCall(requestFullscreenSpy, 1);
        }));

        it('... should not request fullscreen mode for a given element (if already in fullscreen mode)', fakeAsync(() => {
            fullScreenElementSpy.and.returnValue({});

            const element = mockDocument.createElement('div');
            const requestFullscreenSpy = spyOn(element, 'requestFullscreen').and.returnValue(Promise.resolve());

            fullscreenService.openFullscreen(element);

            tick();

            expectSpyCall(requestFullscreenSpy, 0);
        }));

        it('... should catch an error if `requestFullscreen` fails', fakeAsync(() => {
            const element = document.createElement('div');
            const requestFullscreenSpy = spyOn(element, 'requestFullscreen').and.returnValue(
                Promise.reject(new Error('Test error'))
            );

            fullscreenService.openFullscreen(element);

            tick();

            expectSpyCall(requestFullscreenSpy, 1);
            expectSpyCall(consoleSpy, 1, new Error('Test error'));
            expectToEqual(mockConsole.get(0), new Error('Test error'));
        }));
    });
});
