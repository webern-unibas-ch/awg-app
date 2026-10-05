import { Component, DebugElement, isSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

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
        </div>
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

    const getEl = (selector: string): HTMLElement =>
        getAndExpectDebugElementByCss(compDe, selector, 1, 1)[0].nativeElement;
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
    });

    describe('... input signal `clickOnSpace`', () => {
        it('... should be a signal', () => {
            expectToBe(isSignal(getDirective('div.test-div').clickOnSpace), true);
        });

        it('... should hold true by default for elements that are no links', () => {
            expectToBe(getDirective('div.test-div').clickOnSpace(), true);
        });

        it('... should hold false by default for anchors', () => {
            expectToBe(getDirective('a.test-link').clickOnSpace(), false);
        });

        it('... should hold false by default for elements with role `link`', () => {
            expectToBe(getDirective('span.test-role-link').clickOnSpace(), false);
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

            expect(hostComponent.onClick).toHaveBeenCalledExactlyOnceWith(event);
        });

        it('... should emit the event on keydown of Enter', async () => {
            const event = await dispatch('div.test-div', keydown('Enter'));

            expect(hostComponent.onClick).toHaveBeenCalledExactlyOnceWith(event);
        });

        it('... should emit the event on keydown of Space if enabled', async () => {
            const event = await dispatch('div.test-div', keydown(' '));

            expect(hostComponent.onClick).toHaveBeenCalledExactlyOnceWith(event);
        });

        it('... should not emit on keydown of Space if disabled', async () => {
            await dispatch('div.test-div-no-space', keydown(' '));

            expect(hostComponent.onClick).not.toHaveBeenCalled();
        });

        it('... should emit on keydown of Enter but not of Space for links by default', async () => {
            await dispatch('a.test-link', keydown(' '));
            await dispatch('span.test-role-link', keydown(' '));

            expect(hostComponent.onClick).not.toHaveBeenCalled();

            const event = await dispatch('a.test-link', keydown('Enter'));

            expect(hostComponent.onClick).toHaveBeenCalledExactlyOnceWith(event);
        });

        describe('... native activation (synthesized click)', () => {
            it.each(['Enter', ' '])(
                '... should not emit on keydown of "%s" for a native button (only via its click)',
                async key => {
                    await dispatch('button.test-button', keydown(key));

                    expect(hostComponent.onClick).not.toHaveBeenCalled();

                    const event = await dispatch('button.test-button', new MouseEvent('click', { bubbles: true }));

                    expect(hostComponent.onClick).toHaveBeenCalledExactlyOnceWith(event);
                }
            );

            it('... should not emit on keydown of Enter for a link with href (only via its click)', async () => {
                await dispatch('a.test-href-link', keydown('Enter'));

                expect(hostComponent.onClick).not.toHaveBeenCalled();

                const event = await dispatch('a.test-href-link', new MouseEvent('click', { bubbles: true }));

                expect(hostComponent.onClick).toHaveBeenCalledExactlyOnceWith(event);
            });

            it.each(['Enter', ' '])(
                '... should not emit on keydown of "%s" for a delegated native target',
                async key => {
                    await dispatch('button.test-nested-button', keydown(key));

                    expect(hostComponent.onClick).not.toHaveBeenCalled();
                }
            );

            it.each(['Enter', ' '])(
                '... should emit on keydown of "%s" for a delegated non-native target',
                async key => {
                    const event = await dispatch('span.test-nested-span', keydown(key));

                    expect(hostComponent.onClick).toHaveBeenCalledExactlyOnceWith(event);
                }
            );
        });

        it('... should not emit on keydown of other keys (e.g. Tab)', async () => {
            await dispatch('div.test-div', keydown('Tab'));

            expect(hostComponent.onClick).not.toHaveBeenCalled();
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

            it('... should emit `awgClick` with the given event for a non-native target', () => {
                const directive = getDirective('div.test-div');
                const emitSpy = vi.spyOn(directive.awgClick, 'emit');
                const event = keydownOn('div.test-div', 'Enter');

                directive.onEnter(event);

                expect(emitSpy).toHaveBeenCalledExactlyOnceWith(event);
            });

            it('... should not emit `awgClick` for a native target', () => {
                const directive = getDirective('button.test-button');
                const emitSpy = vi.spyOn(directive.awgClick, 'emit');

                directive.onEnter(keydownOn('button.test-button', 'Enter'));

                expect(emitSpy).not.toHaveBeenCalled();
            });
        });

        describe('#onSpace()', () => {
            it('... should have a method `onSpace`', () => {
                expect(getDirective('div.test-div').onSpace).toBeDefined();
            });

            it('... should emit `awgClick` with the given event for a non-native target if enabled', () => {
                const directive = getDirective('div.test-div');
                const emitSpy = vi.spyOn(directive.awgClick, 'emit');
                const event = keydownOn('div.test-div', ' ');

                directive.onSpace(event);

                expect(emitSpy).toHaveBeenCalledExactlyOnceWith(event);
            });

            it('... should not emit `awgClick` if disabled', () => {
                const directive = getDirective('div.test-div-no-space');
                const emitSpy = vi.spyOn(directive.awgClick, 'emit');

                directive.onSpace(keydownOn('div.test-div-no-space', ' '));

                expect(emitSpy).not.toHaveBeenCalled();
            });

            it('... should not emit `awgClick` for a native target', () => {
                const directive = getDirective('button.test-button');
                const emitSpy = vi.spyOn(directive.awgClick, 'emit');

                directive.onSpace(keydownOn('button.test-button', ' '));

                expect(emitSpy).not.toHaveBeenCalled();
            });
        });
    });
});
