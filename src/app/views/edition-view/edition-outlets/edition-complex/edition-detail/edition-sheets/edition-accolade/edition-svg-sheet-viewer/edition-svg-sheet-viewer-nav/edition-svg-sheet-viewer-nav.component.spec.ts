import { DOCUMENT } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
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

        fixture = TestBed.createComponent(EditionSvgSheetViewerNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        browseSvgSheetSpy = spyOn(component, 'browseSvgSheet').and.callThrough();
        browseSvgSheetRequestEmitSpy = spyOn(component.browseSvgSheetRequest, 'emit').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
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

            it('... should trigger on click on div.prev', fakeAsync(() => {
                const divPrevDes = getAndExpectDebugElementByCss(compDe, 'div.prev', 1, 1);
                const expectedDirection = -1;

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(divPrevDes[0], fixture);

                expectSpyCall(browseSvgSheetSpy, 1, expectedDirection);
            }));

            it('... should trigger on click on div.next', fakeAsync(() => {
                const divNextDes = getAndExpectDebugElementByCss(compDe, 'div.next', 1, 1);
                const expectedDirection = 1;

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(divNextDes[0], fixture);

                expectSpyCall(browseSvgSheetSpy, 1, expectedDirection);
            }));

            it('... should not emit anything if no direction is provided', () => {
                const expectedDirection = undefined;
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
