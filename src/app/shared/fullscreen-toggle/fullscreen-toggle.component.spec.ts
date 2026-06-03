import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faCompress, faExpand, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { FullscreenService } from '@awg-core/services';

import { FullscreenToggleComponent } from './fullscreen-toggle.component';

describe('FullscreenToggleComponent (DONE)', () => {
    let component: FullscreenToggleComponent;
    let fixture: ComponentFixture<FullscreenToggleComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let mockFullscreenService: Partial<FullscreenService>;

    let closeFullScreenSpy: Spy;
    let openFullScreenSpy: Spy;
    let toggleFullscreenSpy: Spy;
    let toggleFullscreenRequestEmitSpy: Spy;
    let serviceCloseFullscreenSpy: Spy;
    let serviceOpenFullscreenSpy: Spy;

    let expectedFaCompress: IconDefinition;
    let expectedFaExpand: IconDefinition;
    let expectedFsElement: HTMLElement;
    let expectedIsFullscreen: boolean;

    beforeEach(async () => {
        // Mocked fullscreenService
        mockFullscreenService = {
            isFullscreen: (): boolean => false,
            openFullscreen: (): void => {},
            closeFullscreen: (): void => {},
        };

        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [FullscreenToggleComponent],
            providers: [{ provide: FullscreenService, useValue: mockFullscreenService }],
        }).compileComponents();

        fixture = TestBed.createComponent(FullscreenToggleComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Mock the document
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedFaCompress = faCompress;
        expectedFaExpand = faExpand;
        expectedFsElement = mockDocument.createElement('div');
        expectedIsFullscreen = false;

        // Spies on component functions
        closeFullScreenSpy = vi.spyOn(component, 'closeFullscreen');
        openFullScreenSpy = vi.spyOn(component, 'openFullscreen');
        toggleFullscreenSpy = vi.spyOn(component, 'toggleFullscreen');
        toggleFullscreenRequestEmitSpy = vi.spyOn(component.toggleFullscreenRequest, 'emit');
        serviceCloseFullscreenSpy = vi.spyOn(mockFullscreenService, 'closeFullscreen');
        serviceOpenFullscreenSpy = vi.spyOn(mockFullscreenService, 'openFullscreen');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `fsElement` input', () => {
            expect(component.fsElement).toBeUndefined();
        });

        it('... should have `faCompress`', () => {
            expectToBe(component.faCompress, expectedFaCompress);
        });

        it('... should have `faExpand`', () => {
            expectToBe(component.faExpand, expectedFaExpand);
        });

        it('... should have `isFullscreen` === false', () => {
            expectToBe(component.isFullscreen, expectedIsFullscreen);
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
            component.fsElement = expectedFsElement;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `fsElement` input', () => {
            expectToEqual(component.fsElement, expectedFsElement);
        });

        describe('VIEW', () => {
            describe('... not in fullscreen mode', () => {
                beforeEach(async () => {
                    // Unset fullscreen
                    component.isFullscreen = false;
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
                    component.isFullscreen = true;
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

            it('... should get fullscreen mode from `fullscreenService.isFullscreen`', () => {
                const isFullscreenSpy = vi.spyOn(mockFullscreenService, 'isFullscreen');

                // Simulate fullscreenchange event
                const event = new Event('fullscreenchange');
                mockDocument.dispatchEvent(event);

                expectSpyCall(isFullscreenSpy, 1);
            });

            it('... should trigger `toggleFullscreen` method with correct fullscreen mode', () => {
                expectedIsFullscreen = true;
                vi.spyOn(mockFullscreenService, 'isFullscreen').mockReturnValue(expectedIsFullscreen);

                expectSpyCall(toggleFullscreenSpy, 0);

                // Simulate fullscreenchange event
                const event = new Event('fullscreenchange');
                mockDocument.dispatchEvent(event);

                expectSpyCall(toggleFullscreenSpy, 1, expectedIsFullscreen);
            });
        });

        describe('#closeFullscreen()', () => {
            it('... should have a method `closeFullscreen`', () => {
                expect(component.closeFullscreen).toBeDefined();
            });

            it('... should trigger on click on "close fullscreen" button (in fullscreen mode)', async () => {
                // Set fullscreen
                component.isFullscreen = true;
                await detectChangesOnPush(fixture);

                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                // Click button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(closeFullScreenSpy, 1);
            });

            it('... should trigger `fullscreenService.closeFullscreen`', () => {
                expectSpyCall(serviceCloseFullscreenSpy, 0);

                component.closeFullscreen();

                expectSpyCall(serviceCloseFullscreenSpy, 1);
            });

            it('... should trigger `toggleFullscreen` method', () => {
                expectSpyCall(toggleFullscreenSpy, 0);

                component.closeFullscreen();

                expectSpyCall(toggleFullscreenSpy, 1);
            });

            it('... should set `isFullscreen` to false (via `toggleFullscreen`)', () => {
                component.isFullscreen = true;

                component.closeFullscreen();

                expectToBe(component.isFullscreen, false);
            });
        });

        describe('#openFullscreen()', () => {
            it('... should have a method `openFullscreen`', () => {
                expect(component.openFullscreen).toBeDefined();
            });

            it('... should trigger on click on "open fullscreen" button (not in fullscreen mode)', async () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                // Click button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(openFullScreenSpy, 1, expectedFsElement);
            });

            it('... should trigger `fullscreenService.openFullscreen`', () => {
                expectSpyCall(serviceOpenFullscreenSpy, 0);

                component.openFullscreen(expectedFsElement);

                expectSpyCall(serviceOpenFullscreenSpy, 1);
            });

            it('... should trigger `toggleFullscreen` method', () => {
                expectSpyCall(toggleFullscreenSpy, 0);

                component.openFullscreen(expectedFsElement);

                expectSpyCall(toggleFullscreenSpy, 1);
            });

            it('... should set `isFullscreen` to true (via `toggleFullscreen`)', () => {
                component.isFullscreen = false;

                component.openFullscreen(expectedFsElement);

                expectToBe(component.isFullscreen, true);
            });
        });

        describe('#toggleFullscreen()', () => {
            it('... should have a method `toggleFullscreen`', () => {
                expect(component.toggleFullscreen).toBeDefined();
            });

            it('... should toggle `isFullscreen` variable', async () => {
                component.isFullscreen = false;
                await detectChangesOnPush(fixture);

                component.toggleFullscreen(true);

                expectToBe(component.isFullscreen, true);

                component.toggleFullscreen(false);

                expectToBe(component.isFullscreen, false);
            });

            it('... should emit the correct fullscreen mode', async () => {
                component.isFullscreen = false;
                await detectChangesOnPush(fixture);

                component.toggleFullscreen(true);

                expectSpyCall(toggleFullscreenRequestEmitSpy, 1, true);

                component.toggleFullscreen(false);

                expectSpyCall(toggleFullscreenRequestEmitSpy, 2, false);
            });
        });
    });
});
