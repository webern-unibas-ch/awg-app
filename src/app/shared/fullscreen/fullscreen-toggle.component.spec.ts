import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { faCompress, faExpand, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { FullscreenToggleComponent } from './fullscreen-toggle.component';
import { FullscreenService } from './fullscreen.service';

describe('FullscreenToggleComponent (DONE)', () => {
    let component: FullscreenToggleComponent;
    let fixture: ComponentFixture<FullscreenToggleComponent>;
    let compDe: DebugElement;

    let fullscreenService: FullscreenService;
    let mockDocument: Document;

    let closeFullScreenSpy: Spy;
    let openFullScreenSpy: Spy;
    let toggleFullscreenRequestEmitSpy: Spy;
    let serviceCloseFullscreenSpy: Spy;
    let serviceOpenFullscreenSpy: Spy;
    let serviceUpdateStateSpy: Spy;

    let expectedFaCompress: IconDefinition;
    let expectedFaExpand: IconDefinition;
    let expectedFsElement: HTMLElement;

    /**
     * Helper function to simulate a browser fullscreen change event.
     */
    const simulateFullscreenChangeEvent = (element: HTMLElement | null): void => {
        (mockDocument as any).fullscreenElement = element;
        component.onFullscreenChange();
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FullscreenToggleComponent],
            providers: [FullscreenService],
        }).compileComponents();
    });

    beforeEach(() => {
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

        // Service spies
        vi.spyOn(mockDocument, 'exitFullscreen').mockImplementation(() => Promise.resolve());
        serviceCloseFullscreenSpy = vi.spyOn(fullscreenService, 'closeFullscreen').mockImplementation(() => {});
        serviceOpenFullscreenSpy = vi.spyOn(fullscreenService, 'openFullscreen').mockImplementation(() => {});
        serviceUpdateStateSpy = vi.spyOn(fullscreenService, 'updateState');

        // Test data
        expectedFaCompress = faCompress;
        expectedFaExpand = faExpand;
        expectedFsElement = mockDocument.createElement('div');
        mockDocument.body.appendChild(expectedFsElement);

        // Create component and test fixture
        fixture = TestBed.createComponent(FullscreenToggleComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        closeFullScreenSpy = vi.spyOn(component, 'closeFullscreen');
        openFullScreenSpy = vi.spyOn(component, 'openFullscreen');
        toggleFullscreenRequestEmitSpy = vi.spyOn(component.toggleFullscreenRequest, 'emit');
    });

    afterEach(() => {
        expectedFsElement.remove();
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing `fsElement` input', () => {
            expect(() => component.fsElement()).toThrow();
        });

        it('... should have `faCompress`', () => {
            expectToBe(component.faCompress, expectedFaCompress);
        });

        it('... should have `faExpand`', () => {
            expectToBe(component.faExpand, expectedFaExpand);
        });

        it('... should have `isFullscreen` === false', () => {
            expectToBe(component.isFullscreen(), false);
        });

        describe('VIEW', () => {
            it('... should contain no button yet', () => {
                getAndExpectDebugElementByCss(compDe, 'button.btn', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Mock the fsElement
            fixture.componentRef.setInput('fsElement', expectedFsElement);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `fsElement` input', () => {
            expectToEqual(component.fsElement(), expectedFsElement);
        });

        describe('VIEW', () => {
            describe('... not in fullscreen mode', () => {
                beforeEach(async () => {
                    // Unset fullscreen
                    simulateFullscreenChangeEvent(null);

                    await detectChangesOnPush(fixture);
                });

                it('... should contain one "open fullscreen" button', () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    const expectedTitle = 'Open fullscreen';

                    expectToBe(btnEl.title.trim(), expectedTitle);
                });

                it('... should display expand icon on "open fullscreen" button', () => {
                    const faIconDes = getAndExpectDebugElementByCss(compDe, 'button.btn > fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns(), expectedFaExpand);
                });
            });

            describe('... in fullscreen mode', () => {
                beforeEach(async () => {
                    // Set fullscreen
                    simulateFullscreenChangeEvent(expectedFsElement);

                    await detectChangesOnPush(fixture);
                });

                it('... should contain one "close fullscreen" button', () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    const expectedTitle = 'Close fullscreen';

                    expectToBe(btnEl.title.trim(), expectedTitle);
                });

                it('... should display compress icon on "close fullscreen" button when in fullscreen mode', () => {
                    const faIconDes = getAndExpectDebugElementByCss(compDe, 'button.btn > fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns(), expectedFaCompress);
                });
            });
        });

        describe('#Hostlistener onFullscreenChange()', () => {
            it('... should have a hostlistener `onFullscreenChange`', () => {
                expect(component.onFullscreenChange).toBeDefined();
            });

            it('... should update `isFullscreen` state based on document fullscreen changes', () => {
                expectSpyCall(serviceUpdateStateSpy, 0);

                simulateFullscreenChangeEvent(expectedFsElement);

                expectSpyCall(serviceUpdateStateSpy, 1);
            });
        });

        describe('#closeFullscreen()', () => {
            it('... should have a method `closeFullscreen`', () => {
                expect(component.closeFullscreen).toBeDefined();
            });

            it('... should trigger on click on "close fullscreen" button (in fullscreen mode)', async () => {
                // Set fullscreen
                simulateFullscreenChangeEvent(expectedFsElement);
                await detectChangesOnPush(fixture);

                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);

                // Click button
                await clickAndAwaitChanges(btnDes[0], fixture);

                expectSpyCall(closeFullScreenSpy, 1);
            });

            it('... should trigger `fullscreenService.closeFullscreen`', () => {
                expectSpyCall(serviceCloseFullscreenSpy, 0);

                component.closeFullscreen();

                expectSpyCall(serviceCloseFullscreenSpy, 1);
            });
        });

        describe('#openFullscreen()', () => {
            it('... should have a method `openFullscreen`', () => {
                expect(component.openFullscreen).toBeDefined();
            });

            it('... should trigger on click on "open fullscreen" button (not in fullscreen mode)', async () => {
                // Unset fullscreen
                simulateFullscreenChangeEvent(null);
                await detectChangesOnPush(fixture);

                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);

                // Click button
                await clickAndAwaitChanges(btnDes[0], fixture);

                expectSpyCall(openFullScreenSpy, 1);
            });

            it('... should trigger `fullscreenService.openFullscreen` with correct element', () => {
                expectSpyCall(serviceOpenFullscreenSpy, 0);

                component.openFullscreen();

                expectSpyCall(serviceOpenFullscreenSpy, 1, expectedFsElement);
            });
        });
    });
});
