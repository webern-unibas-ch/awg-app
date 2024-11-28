import { DOCUMENT } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faCompress, faExpand, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { FullscreenService } from '@awg-app/core/services';

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

    beforeEach(waitForAsync(() => {
        // Mocked fullscreenService
        mockFullscreenService = {
            isFullscreen: (): boolean => false,
            openFullscreen: (): void => {},
            closeFullscreen: (): void => {},
        };

        TestBed.configureTestingModule({
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
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        closeFullScreenSpy = spyOn(component, 'closeFullscreen').and.callThrough();
        openFullScreenSpy = spyOn(component, 'openFullscreen').and.callThrough();
        toggleFullscreenSpy = spyOn(component, 'toggleFullscreen').and.callThrough();
        toggleFullscreenRequestEmitSpy = spyOn(component.toggleFullscreenRequest, 'emit').and.callThrough();
        serviceCloseFullscreenSpy = spyOn(mockFullscreenService, 'closeFullscreen').and.callThrough();
        serviceOpenFullscreenSpy = spyOn(mockFullscreenService, 'openFullscreen').and.callThrough();
    }));

    afterAll(() => {
        cleanStylesFromDOM();
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
            it('... should contain no button', () => {
                getAndExpectDebugElementByCss(compDe, 'button', 0, 0);
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
                it('... should contain one "open fullscreen" button', () => {
                    const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                    const buttonEl: HTMLButtonElement = buttonDes[0].nativeElement;

                    const expectedTitle = 'Open fullscreen';

                    expectToBe(buttonEl.title.trim(), expectedTitle);
                });

                it('... should display expand icon on "open fullscreen" button', () => {
                    const faIconDes = getAndExpectDebugElementByCss(compDe, 'button.btn > fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns, expectedFaExpand);
                });
            });

            describe('... in fullscreen mode', () => {
                beforeEach(() => {
                    // Set fullscreen
                    component.isFullscreen = true;
                    detectChangesOnPush(fixture);
                });

                it('... should contain one "close fullscreen" button', () => {
                    const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                    const buttonEl: HTMLButtonElement = buttonDes[0].nativeElement;

                    const expectedTitle = 'Close fullscreen';

                    expectToBe(buttonEl.title.trim(), expectedTitle);
                });

                it('... should display compress icon on "close fullscreen" button when in fullscreen mode', () => {
                    const faIconDes = getAndExpectDebugElementByCss(compDe, 'button.btn > fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns, expectedFaCompress);
                });
            });
        });

        describe('#Hostlistener onFullscreenChange()', () => {
            it('... should have a hostlistener `onFullscreenChange`', () => {
                expect(component.onFullscreenChange).toBeDefined();
            });

            it('... should get fullscreen mode from `fullscreenService.isFullscreen`', () => {
                const isFullscreenSpy = spyOn(mockFullscreenService, 'isFullscreen').and.callThrough();

                // Simulate fullscreenchange event
                const event = new Event('fullscreenchange');
                mockDocument.dispatchEvent(event);

                expectSpyCall(isFullscreenSpy, 1);
            });

            it('... should trigger `toggleFullscreen` method with correct fullscreen mode', () => {
                expectedIsFullscreen = true;
                spyOn(mockFullscreenService, 'isFullscreen').and.returnValue(expectedIsFullscreen);

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

            it('... should trigger on click on "close fullscreen" button (in fullscreen mode)', () => {
                // Set fullscreen
                component.isFullscreen = true;
                detectChangesOnPush(fixture);

                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                // Click button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

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

            it('... should trigger on click on "open fullscreen" button (not in fullscreen mode)', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                // Click button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

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

            it('... should toggle `isFullscreen` variable', () => {
                component.isFullscreen = false;
                detectChangesOnPush(fixture);

                component.toggleFullscreen(true);

                expectToBe(component.isFullscreen, true);

                component.toggleFullscreen(false);

                expectToBe(component.isFullscreen, false);
            });

            it('... should emit the correct fullscreen mode', () => {
                component.isFullscreen = false;
                detectChangesOnPush(fixture);

                component.toggleFullscreen(true);

                expectSpyCall(toggleFullscreenRequestEmitSpy, 1, true);

                component.toggleFullscreen(false);

                expectSpyCall(toggleFullscreenRequestEmitSpy, 2, false);
            });
        });
    });
});
