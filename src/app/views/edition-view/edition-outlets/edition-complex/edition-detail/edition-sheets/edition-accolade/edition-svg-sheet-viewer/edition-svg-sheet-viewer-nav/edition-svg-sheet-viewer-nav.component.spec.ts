import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionSvgSheetViewerNavComponent } from './edition-svg-sheet-viewer-nav.component';

describe('EditionSvgSheetViewerNavComponent', () => {
    let component: EditionSvgSheetViewerNavComponent;
    let fixture: ComponentFixture<EditionSvgSheetViewerNavComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let browseSvgSheetSpy: Spy;
    let browseSvgSheetRequestEmitSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSvgSheetViewerNavComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetViewerNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Spies
        browseSvgSheetSpy = vi.spyOn(component, 'browseSvgSheet');
        browseSvgSheetRequestEmitSpy = vi.spyOn(component.browseSvgSheetRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        describe('VIEW', () => {
            it('... should contain one div.awg-edition-svg-sheet-viewer-nav', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-viewer-nav', 1, 1);
            });

            it('... should contain 1 div.prev and 1 div.next in div.awg-edition-svg-sheet-viewer-nav', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-viewer-nav > div', 2, 2);

                const sheetViewerNavDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-viewer-nav',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(sheetViewerNavDes[0], 'div.prev', 1, 1);
                getAndExpectDebugElementByCss(sheetViewerNavDes[0], 'div.next', 1, 1);
            });

            it('... should display left arrow in div.prev', () => {
                const divPrevDes = getAndExpectDebugElementByCss(compDe, 'div.prev', 1, 1);

                const spanDes = getAndExpectDebugElementByCss(divPrevDes[0], 'span', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                // Process HTML expression of expected text content
                const expectedHtmlTextContent = mockDocument.createElement('span');
                expectedHtmlTextContent.innerHTML = '&#10094;';

                expectToBe(spanEl.textContent, expectedHtmlTextContent.textContent);
            });

            it('... should display right arrow in div.next', () => {
                const divNextDes = getAndExpectDebugElementByCss(compDe, 'div.next', 1, 1);

                const spanDes = getAndExpectDebugElementByCss(divNextDes[0], 'span', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                // Process HTML expression of expected text content
                const expectedHtmlTextContent = mockDocument.createElement('span');
                expectedHtmlTextContent.innerHTML = '&#10095;';

                expectToBe(spanEl.textContent, expectedHtmlTextContent.textContent);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#browseSvgSheet()', () => {
            it('... should have a method `browseSvgSheet`  ', () => {
                expect(component.browseSvgSheet).toBeDefined();
            });

            it('... should trigger on click on div.prev', async () => {
                const divPrevDes = getAndExpectDebugElementByCss(compDe, 'div.prev', 1, 1);
                const expectedDirection = -1;

                // Trigger click with click helper & wait for changes
                await clickAndAwaitChanges(divPrevDes[0], fixture);

                expectSpyCall(browseSvgSheetSpy, 1, expectedDirection);
            });

            it('... should trigger on click on div.next', async () => {
                const divNextDes = getAndExpectDebugElementByCss(compDe, 'div.next', 1, 1);
                const expectedDirection = 1;

                // Trigger click with click helper & wait for changes
                await clickAndAwaitChanges(divNextDes[0], fixture);

                expectSpyCall(browseSvgSheetSpy, 1, expectedDirection);
            });

            it('... should not emit anything if no direction is provided', () => {
                const expectedDirection: number = undefined;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 0, expectedDirection);
            });

            it('... should emit a given direction', () => {
                const expectedDirection = 1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);
            });

            it('... should emit the correct direction', () => {
                let expectedDirection = 1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);

                expectedDirection = -1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 2, expectedDirection);
            });
        });
    });
});
