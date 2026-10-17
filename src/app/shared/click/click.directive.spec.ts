import { Component, DebugElement, isSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { ClickDirective } from './click.directive';

// Test host component
@Component({
    template: `
        <div class="test-div" (awgClick)="onClick($event)"></div>
        <a class="test-link" (awgClick)="onClick($event)">Test link</a>
        <span class="test-role-link" role="link" (awgClick)="onClick($event)"></span>
        <div class="test-div-no-space" [clickOnSpace]="clickOnSpace()" (awgClick)="onClick($event)"></div>
        <button type="button" class="test-button" (awgClick)="onClick($event)">Test button</button>
        <a class="test-href-link" href="#" (awgClick)="onClick($event)">Test href link</a>
        <div class="test-delegating-div" (awgClick)="onClick($event)">
            <button type="button" class="test-nested-button">Nested button</button>
            <span class="test-nested-span" tabindex="0">Nested span</span>
            <button type="button" class="test-nested-button-with-child">
                <span class="test-nested-button-child">Nested button child</span>
            </button>
        </div>
        <a class="test-href-link-with-child" href="#" (awgClick)="onClick($event)">
            <span class="test-href-link-child">Href link child</span>
        </a>
        <a class="test-outer-href-link" href="#">
            <span class="test-inner-host" tabindex="0" (awgClick)="onClick($event)">Inner host</span>
        </a>
    `,
    imports: [ClickDirective],
})
class TestClickComponent {
    clickOnSpace = signal(false);
    onClick = vi.fn<(event: Event) => void>();
}

describe('ClickDirective (DONE)', () => {
    let hostComponent: TestClickComponent;
    let fixture: ComponentFixture<TestClickComponent>;
    let compDe: DebugElement;

    const getDes = (selector: string) => getAndExpectDebugElementByCss(compDe, selector, 1, 1);
    const getEl = (selector: string): HTMLElement => getDes(selector)[0].nativeElement;
    const getDirective = (selector: string): ClickDirective =>
        getAndExpectDebugElementByCss(compDe, selector, 1, 1)[0].injector.get(ClickDirective);
    const keydown = (key: string): KeyboardEvent => new KeyboardEvent('keydown', { key, bubbles: true });
    const dispatch = async (selector: string, event: Event): Promise<Event> => {
        getEl(selector).dispatchEvent(event);
        await detectChangesOnPush(fixture);
        return event;
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestClickComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestClickComponent);
        hostComponent = fixture.componentInstance;
        compDe = fixture.debugElement;

        fixture.detectChanges();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create the directive on each host element', () => {
        expect(getDirective('div.test-div')).toBeTruthy();
        expect(getDirective('a.test-link')).toBeTruthy();
        expect(getDirective('span.test-role-link')).toBeTruthy();
        expect(getDirective('div.test-div-no-space')).toBeTruthy();
        expect(getDirective('button.test-button')).toBeTruthy();
        expect(getDirective('a.test-href-link')).toBeTruthy();
        expect(getDirective('div.test-delegating-div')).toBeTruthy();
        expect(getDirective('a.test-href-link-with-child')).toBeTruthy();
        expect(getDirective('span.test-inner-host')).toBeTruthy();
    });

    describe('... input signal `clickOnSpace`', () => {
        it('... should be a signal', () => {
            expectToBe(isSignal(getDirective('div.test-div').clickOnSpace), true);
        });

        describe('... should hold by default', () => {
            it.each([
                { desc: 'true for elements that are no links', selector: 'div.test-div', expected: true },
                { desc: 'false for anchors', selector: 'a.test-link', expected: false },
                { desc: 'false for elements with role `link`', selector: 'span.test-role-link', expected: false },
            ])('... $desc', ({ selector, expected }) => {
                expectToBe(getDirective(selector).clickOnSpace(), expected);
            });
        });

        it('... should hold the provided value', async () => {
            expectToBe(getDirective('div.test-div-no-space').clickOnSpace(), false);

            hostComponent.clickOnSpace.set(true);
            await detectChangesOnPush(fixture);

            expectToBe(getDirective('div.test-div-no-space').clickOnSpace(), true);
        });
    });

    describe('... output `awgClick`', () => {
        it('... should emit the event on click', async () => {
            const event = await dispatch('div.test-div', new MouseEvent('click', { bubbles: true }));

            expectSpyCall(hostComponent.onClick, 1, event);
        });

        it('... should emit the event on keydown of Enter', async () => {
            const event = await dispatch('div.test-div', keydown('Enter'));

            expectSpyCall(hostComponent.onClick, 1, event);
        });

        it('... should emit the event on keydown of Space if enabled', async () => {
            const event = await dispatch('div.test-div', keydown(' '));

            expectSpyCall(hostComponent.onClick, 1, event);
        });

        it('... should not emit on keydown of Space if disabled', async () => {
            await dispatch('div.test-div-no-space', keydown(' '));

            expectSpyCall(hostComponent.onClick, 0);
        });

        it('... should emit on keydown of Enter but not of Space for links by default', async () => {
            await dispatch('a.test-link', keydown(' '));
            await dispatch('span.test-role-link', keydown(' '));

            expectSpyCall(hostComponent.onClick, 0);

            const event = await dispatch('a.test-link', keydown('Enter'));

            expectSpyCall(hostComponent.onClick, 1, event);
        });

        describe('... native activation (synthesized click)', () => {
            it.each(['Enter', ' '])(
                '... should not emit on keydown of "%s" for a native button (only via its click)',
                async key => {
                    await dispatch('button.test-button', keydown(key));

                    expectSpyCall(hostComponent.onClick, 0);

                    const event = await dispatch('button.test-button', new MouseEvent('click', { bubbles: true }));

                    expectSpyCall(hostComponent.onClick, 1, event);
                }
            );

            it('... should not emit on keydown of Enter for a link with href (only via its click)', async () => {
                await dispatch('a.test-href-link', keydown('Enter'));

                expectSpyCall(hostComponent.onClick, 0);

                const event = await dispatch('a.test-href-link', new MouseEvent('click', { bubbles: true }));

                expectSpyCall(hostComponent.onClick, 1, event);
            });

            it.each(['Enter', ' '])(
                '... should not emit on keydown of "%s" for a delegated native target',
                async key => {
                    await dispatch('button.test-nested-button', keydown(key));

                    expectSpyCall(hostComponent.onClick, 0);
                }
            );

            it.each(['Enter', ' '])(
                '... should emit on keydown of "%s" for a delegated non-native target',
                async key => {
                    const event = await dispatch('span.test-nested-span', keydown(key));

                    expectSpyCall(hostComponent.onClick, 1, event);
                }
            );

            it.each(['Enter', ' '])(
                '... should not emit on keydown of "%s" for a target within a delegated native element',
                async key => {
                    await dispatch('span.test-nested-button-child', keydown(key));

                    expectSpyCall(hostComponent.onClick, 0);
                }
            );

            it('... should not emit on keydown of Enter for a target within a native host', async () => {
                await dispatch('span.test-href-link-child', keydown('Enter'));

                expectSpyCall(hostComponent.onClick, 0);
            });

            it.each(['Enter', ' '])(
                '... should emit on keydown of "%s" for a non-native host within a native element outside the host',
                async key => {
                    const event = await dispatch('span.test-inner-host', keydown(key));

                    expectSpyCall(hostComponent.onClick, 1, event);
                }
            );
        });

        it('... should not emit on keydown of other keys (e.g. Tab)', async () => {
            await dispatch('div.test-div', keydown('Tab'));

            expectSpyCall(hostComponent.onClick, 0);
        });
    });

    describe('METHODS', () => {
        const keydownOn = (selector: string, key: string): KeyboardEvent => {
            const event = keydown(key);
            Object.defineProperty(event, 'target', { value: getEl(selector) });
            return event;
        };

        describe('#onEnter()', () => {
            it('... should have a method `onEnter`', () => {
                expect(getDirective('div.test-div').onEnter).toBeDefined();
            });

            describe('... should emit `awgClick` with the given event', () => {
                it.each([
                    {
                        desc: 'for a non-native target',
                        hostSelector: 'div.test-div',
                        createEvent: () => keydownOn('div.test-div', 'Enter'),
                    },
                    {
                        desc: 'for a target within a native element outside the host',
                        hostSelector: 'span.test-inner-host',
                        createEvent: () => keydownOn('span.test-inner-host', 'Enter'),
                    },
                    {
                        // Not dispatched, so the target is null
                        desc: 'for an event without element target',
                        hostSelector: 'div.test-div',
                        createEvent: () => keydown('Enter'),
                    },
                ])('... $desc', ({ hostSelector, createEvent }) => {
                    const directive = getDirective(hostSelector);
                    const emitSpy = vi.spyOn(directive.awgClick, 'emit');
                    const event = createEvent();

                    directive.onEnter(event);

                    expectSpyCall(emitSpy, 1, event);
                });
            });

            describe('... should not emit `awgClick`', () => {
                it.each([
                    {
                        desc: 'for a native target',
                        hostSelector: 'button.test-button',
                        targetSelector: 'button.test-button',
                    },
                    {
                        desc: 'for a target within a native element inside the host',
                        hostSelector: 'div.test-delegating-div',
                        targetSelector: 'span.test-nested-button-child',
                    },
                ])('... $desc', ({ hostSelector, targetSelector }) => {
                    const directive = getDirective(hostSelector);
                    const emitSpy = vi.spyOn(directive.awgClick, 'emit');

                    directive.onEnter(keydownOn(targetSelector, 'Enter'));

                    expectSpyCall(emitSpy, 0);
                });
            });
        });

        describe('#onSpace()', () => {
            it('... should have a method `onSpace`', () => {
                expect(getDirective('div.test-div').onSpace).toBeDefined();
            });

            describe('... should emit `awgClick` with the given event if enabled', () => {
                it.each([
                    {
                        desc: 'for a non-native target',
                        hostSelector: 'div.test-div',
                        createEvent: () => keydownOn('div.test-div', ' '),
                    },
                    {
                        desc: 'for a target within a native element outside the host',
                        hostSelector: 'span.test-inner-host',
                        createEvent: () => keydownOn('span.test-inner-host', ' '),
                    },
                    {
                        // Not dispatched, so the target is null
                        desc: 'for an event without element target',
                        hostSelector: 'div.test-div',
                        createEvent: () => keydown(' '),
                    },
                ])('... $desc', ({ hostSelector, createEvent }) => {
                    const directive = getDirective(hostSelector);
                    const emitSpy = vi.spyOn(directive.awgClick, 'emit');
                    const event = createEvent();

                    directive.onSpace(event);

                    expectSpyCall(emitSpy, 1, event);
                });
            });

            describe('... should not emit `awgClick`', () => {
                it.each([
                    {
                        desc: 'if disabled',
                        hostSelector: 'div.test-div-no-space',
                        targetSelector: 'div.test-div-no-space',
                    },
                    {
                        desc: 'for a native target',
                        hostSelector: 'button.test-button',
                        targetSelector: 'button.test-button',
                    },
                    {
                        desc: 'for a target within a native element inside the host',
                        hostSelector: 'div.test-delegating-div',
                        targetSelector: 'span.test-nested-button-child',
                    },
                ])('... $desc', ({ hostSelector, targetSelector }) => {
                    const directive = getDirective(hostSelector);
                    const emitSpy = vi.spyOn(directive.awgClick, 'emit');

                    directive.onSpace(keydownOn(targetSelector, ' '));

                    expectSpyCall(emitSpy, 0);
                });
            });
        });
    });
});
