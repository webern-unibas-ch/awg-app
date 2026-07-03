import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';

import { FullscreenToggleComponent } from './fullscreen-toggle.component';
import { FullscreenToggleConfig } from './fullscreen.model';
import { FullscreenService } from './fullscreen.service';

describe('FullscreenToggleComponent (DONE)', () => {
    let component: FullscreenToggleComponent;
    let fixture: ComponentFixture<FullscreenToggleComponent>;
    let compDe: DebugElement;

    let fullscreenService: FullscreenService;
    let mockDocument: Document;

    let closeFullScreenSpy: Spy;
    let openFullScreenSpy: Spy;
    let serviceCloseFullscreenSpy: Spy;
    let serviceOpenFullscreenSpy: Spy;
    let serviceUpdateStateSpy: Spy;

    let expectedFsElement: HTMLElement;
    let expectedNonFsConfig: FullscreenToggleConfig;
    let expectedFsConfig: FullscreenToggleConfig;

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

        // Create component and test fixture
        fixture = TestBed.createComponent(FullscreenToggleComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedFsElement = mockDocument.createElement('div');
        mockDocument.body.appendChild(expectedFsElement);

        expectedNonFsConfig = {
            icon: faExpand,
            title: 'Open fullscreen',
            customClass: 'btn-outline-info',
            action: expect.any(Function),
        };
        expectedFsConfig = {
            icon: faCompress,
            title: 'Close fullscreen',
            customClass: 'btn-info',
            action: expect.any(Function),
        };

        // Component spies
        closeFullScreenSpy = vi.spyOn(component, 'closeFullscreen');
        openFullScreenSpy = vi.spyOn(component, 'openFullscreen');
    });

    afterEach(() => {
        expectedFsElement.remove();
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing `fsElement` input signal', () => {
            expectToBe(isSignal(component.fsElement), true);

            expect(() => component.fsElement()).toThrow();
        });

        it('... should have signal `isFullscreen` to hold false', () => {
            expectToBe(isSignal(component.isFullscreen), true);

            expectToBe(component.isFullscreen(), false);
        });

        it('... should have computed signal `fullscreenToggleBtn` to hold non-fs config', () => {
            expectToBe(isSignal(component.fullscreenToggleBtn), true);

            expectToEqual(component.fullscreenToggleBtn(), expectedNonFsConfig);
        });

        describe('VIEW', () => {
            it('... should contain one button', () => {
                getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
            });

            it('... should have default classes on button', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                expectToContain(btnEl.classList, 'btn');
                expectToContain(btnEl.classList, 'btn-sm');
                expectToContain(btnEl.classList, 'ms-2');
            });

            it('... should have no custom class on button yet', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                expectToNotContain(btnEl.classList, expectedNonFsConfig.customClass);
                expectToNotContain(btnEl.classList, expectedFsConfig.customClass);
            });

            it('... should have no title on button yet', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                expectToBe(btnEl.title.trim(), '');
            });

            it('... should have one fa-icon on button, but no icon content yet', () => {
                const faIconDes = getAndExpectDebugElementByCss(compDe, 'button.btn > fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expect(faIconIns()).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Mock the fsElement
            fixture.componentRef.setInput('fsElement', expectedFsElement);
            simulateFullscreenChangeEvent(expectedFsElement);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `fsElement` input signal to hold fs element', () => {
            expectToEqual(component.fsElement(), expectedFsElement);
        });

        it('... should have updated signal `isFullscreen` to hold true', () => {
            expectToBe(component.isFullscreen(), true);
        });

        it('... should have computed signal `fullscreenToggleBtn` to hold fs config', () => {
            expectToEqual(component.fullscreenToggleBtn(), expectedFsConfig);
        });

        describe('VIEW', () => {
            it('... should contain one button', () => {
                getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
            });

            it('... should have default classes on button', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                expectToContain(btnEl.classList, 'btn');
                expectToContain(btnEl.classList, 'btn-sm');
                expectToContain(btnEl.classList, 'ms-2');
            });

            describe('... not in fullscreen mode', () => {
                beforeEach(async () => {
                    // Unset fullscreen
                    simulateFullscreenChangeEvent(null);

                    await detectChangesOnPush(fixture);
                });

                it('... should have correct custom class on button ("btn-outline-info")', () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToContain(btnEl.classList, expectedNonFsConfig.customClass);
                });

                it('... should display correct title on button ("Open fullscreen")', () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.title.trim(), expectedNonFsConfig.title);
                });

                it('... should display correct icon on button ("expand")', () => {
                    const faIconDes = getAndExpectDebugElementByCss(compDe, 'button.btn > fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns(), expectedNonFsConfig.icon);
                });

                it('... should have correct action on click (openFullscreen)', async () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);

                    // Click button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(openFullScreenSpy, 1);
                });
            });

            describe('... in fullscreen mode', () => {
                beforeEach(async () => {
                    // Set fullscreen
                    simulateFullscreenChangeEvent(expectedFsElement);

                    await detectChangesOnPush(fixture);
                });

                it('... should have correct custom class on button ("btn-info")', () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToContain(btnEl.classList, expectedFsConfig.customClass);
                });

                it('... should display correct title on button ("Close fullscreen")', () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.title.trim(), expectedFsConfig.title);
                });

                it('... should display correct icon on button ("compress")', () => {
                    const faIconDes = getAndExpectDebugElementByCss(compDe, 'button.btn > fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns(), expectedFsConfig.icon);
                });

                it('... should have correct action on click (closeFullscreen)', async () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);

                    // Click button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(closeFullScreenSpy, 1);
                });
            });
        });

        describe('#Hostlistener onFullscreenChange()', () => {
            it('... should have a Hostlistener `onFullscreenChange`', () => {
                expect(component.onFullscreenChange).toBeDefined();
            });

            it('... should trigger state update (via service) based on document fullscreen changes', () => {
                expectSpyCall(serviceUpdateStateSpy, 1);

                simulateFullscreenChangeEvent(expectedFsElement);

                expectSpyCall(serviceUpdateStateSpy, 2);
            });
        });

        describe('METHODS', () => {
            describe('#closeFullscreen()', () => {
                it('... should have a method `closeFullscreen`', () => {
                    expect(component.closeFullscreen).toBeDefined();
                });

                it('... should trigger on action on "close fullscreen" button (in fullscreen mode)', async () => {
                    // Set fullscreen
                    simulateFullscreenChangeEvent(expectedFsElement);
                    await detectChangesOnPush(fixture);

                    component.fullscreenToggleBtn().action();

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

                it('... should trigger on action on "open fullscreen" button (not in fullscreen mode)', async () => {
                    // Unset fullscreen
                    simulateFullscreenChangeEvent(null);
                    await detectChangesOnPush(fixture);

                    component.fullscreenToggleBtn().action();

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
});
