import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionSheetViewerNavComponent } from './edition-sheet-viewer-nav.component';

describe('EditionSheetViewerNavComponent (DONE)', () => {
    let component: EditionSheetViewerNavComponent;
    let fixture: ComponentFixture<EditionSheetViewerNavComponent>;
    let compDe: DebugElement;

    let browseRequestSpy: Mock<(direction: 1 | -1) => void>;

    const getNavDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer-nav', 1, 1);
    const getButtonDes = (direction: 'prev' | 'next') =>
        getAndExpectDebugElementByCss(getNavDes()[0], `button.${direction}`, 1, 1);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSheetViewerNavComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSheetViewerNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        browseRequestSpy = vi.fn<(direction: 1 | -1) => void>();
        component.browseRequest.subscribe(browseRequestSpy);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        describe('VIEW', () => {
            it('... should contain one div.awg-edition-sheet-viewer-nav with two buttons', () => {
                getAndExpectDebugElementByCss(getNavDes()[0], 'button', 2, 2);
            });

            it.each([
                { direction: 'prev' as const, label: 'Zurück', arrow: '❮' },
                { direction: 'next' as const, label: 'Weiter', arrow: '❯' },
            ])(
                '... should contain one button.$direction with label `$label` and arrow',
                ({ direction, label, arrow }) => {
                    const buttonEl: HTMLButtonElement = getButtonDes(direction)[0].nativeElement;

                    expectToBe(buttonEl.type, 'button');
                    expectToBe(buttonEl.title, label);
                    expectToBe(buttonEl.getAttribute('aria-label'), label);

                    const spanDes = getAndExpectDebugElementByCss(getButtonDes(direction)[0], 'span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent, arrow);
                    expectToBe(spanEl.getAttribute('aria-hidden'), 'true');
                }
            );
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            describe('... output `browseRequest`', () => {
                it.each([
                    { direction: 'prev' as const, expectedDirection: -1 },
                    { direction: 'next' as const, expectedDirection: 1 },
                ])(
                    '... should emit $expectedDirection on click (incl. Enter/Space) on button.$direction',
                    async ({ direction, expectedDirection }) => {
                        await clickAndAwaitChanges(getButtonDes(direction)[0], fixture);

                        expectSpyCall(browseRequestSpy, 1, expectedDirection);
                    }
                );

                it('... should not emit on keys that do not activate the buttons (e.g. Tab)', () => {
                    const buttonEl: HTMLButtonElement = getButtonDes('next')[0].nativeElement;

                    buttonEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
                    buttonEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Tab', bubbles: true }));

                    expectSpyCall(browseRequestSpy, 0);
                });
            });
        });
    });
});
