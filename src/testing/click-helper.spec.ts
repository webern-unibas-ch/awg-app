import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

import { describe, expect, it, vi } from 'vitest';

import { BUTTON_CLICK_EVENTS, click, clickAndAwaitChanges, clickDispatchAndAwaitChanges } from './click-helper';

describe('click-helper', () => {
    describe('BUTTON_CLICK_EVENTS', () => {
        it('... should have `BUTTON_CLICK_EVENTS` with `left` and `right`', () => {
            expect(BUTTON_CLICK_EVENTS).toBeDefined();
            expect(BUTTON_CLICK_EVENTS.left).toBeDefined();
            expect(BUTTON_CLICK_EVENTS.right).toBeDefined();
        });

        it('... should expose left and right button event objects', () => {
            expect(BUTTON_CLICK_EVENTS.left).toEqual({ button: 0 });
            expect(BUTTON_CLICK_EVENTS.right).toEqual({ button: 2 });
        });
    });

    describe('#click()', () => {
        it('... should have a method `click`', () => {
            expect(click).toBeDefined();
            expect(typeof click).toBe('function');
        });

        it('... should call native click when target is an HTMLElement', () => {
            const button = document.createElement('button');
            const onClick = vi.fn();
            button.addEventListener('click', onClick);

            click(button);

            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('... should call triggerEventHandler when target is a DebugElement', () => {
            const eventObj = { button: 1 };
            const debugElement = {
                triggerEventHandler: vi.fn(),
            } as unknown as DebugElement;

            click(debugElement, eventObj);

            expect(debugElement.triggerEventHandler).toHaveBeenCalledTimes(1);
            expect(debugElement.triggerEventHandler).toHaveBeenCalledWith('click', eventObj);
        });
    });

    describe('#clickAndAwaitChanges()', () => {
        it('... should have a method `clickAndAwaitChanges`', () => {
            expect(clickAndAwaitChanges).toBeDefined();
            expect(typeof clickAndAwaitChanges).toBe('function');
        });

        it('... should return early when element is disabled', async () => {
            const clickDe = {
                nativeElement: { disabled: true },
                triggerEventHandler: vi.fn(),
            } as unknown as DebugElement;
            const fixture = {
                detectChanges: vi.fn(),
                whenStable: vi.fn().mockResolvedValue(undefined),
            } as unknown as ComponentFixture<any>;

            await clickAndAwaitChanges(clickDe, fixture);

            expect(clickDe.triggerEventHandler).not.toHaveBeenCalled();
            expect(fixture.detectChanges).not.toHaveBeenCalled();
            expect(fixture.whenStable).not.toHaveBeenCalled();
        });

        it('... should trigger click and apply changes when element is enabled', async () => {
            const clickDe = {
                nativeElement: { disabled: false },
                triggerEventHandler: vi.fn(),
            } as unknown as DebugElement;
            const fixture = {
                detectChanges: vi.fn(),
                whenStable: vi.fn().mockResolvedValue(undefined),
            } as unknown as ComponentFixture<any>;

            await clickAndAwaitChanges(clickDe, fixture);

            expect(clickDe.triggerEventHandler).toHaveBeenCalledTimes(1);
            expect(clickDe.triggerEventHandler).toHaveBeenCalledWith('click', BUTTON_CLICK_EVENTS.left);
            expect(fixture.detectChanges).toHaveBeenCalledTimes(2);
            expect(fixture.whenStable).toHaveBeenCalledTimes(1);
        });
    });

    describe('#clickDispatchAndAwaitChanges()', () => {
        it('... should have a method `clickDispatchAndAwaitChanges`', () => {
            expect(clickDispatchAndAwaitChanges).toBeDefined();
            expect(typeof clickDispatchAndAwaitChanges).toBe('function');
        });

        it('... should return early when target element is disabled', async () => {
            const disabledButton = document.createElement('button');
            disabledButton.disabled = true;
            const fixture = {
                detectChanges: vi.fn(),
                whenStable: vi.fn().mockResolvedValue(undefined),
            } as unknown as ComponentFixture<any>;

            await clickDispatchAndAwaitChanges(disabledButton, fixture);

            expect(fixture.detectChanges).not.toHaveBeenCalled();
            expect(fixture.whenStable).not.toHaveBeenCalled();
        });

        it('... should dispatch native click and apply changes for Element target', async () => {
            const button = document.createElement('button');
            const onClick = vi.fn();
            button.addEventListener('click', onClick);
            const fixture = {
                detectChanges: vi.fn(),
                whenStable: vi.fn().mockResolvedValue(undefined),
            } as unknown as ComponentFixture<any>;

            await clickDispatchAndAwaitChanges(button, fixture);

            expect(onClick).toHaveBeenCalledTimes(1);
            expect(fixture.detectChanges).toHaveBeenCalledTimes(2);
            expect(fixture.whenStable).toHaveBeenCalledTimes(1);
        });

        it('... should resolve DebugElement target to native element and dispatch click', async () => {
            const button = document.createElement('button');
            const onClick = vi.fn();
            button.addEventListener('click', onClick);
            const debugElement = {
                nativeElement: button,
            } as unknown as DebugElement;
            const fixture = {
                detectChanges: vi.fn(),
                whenStable: vi.fn().mockResolvedValue(undefined),
            } as unknown as ComponentFixture<any>;

            await clickDispatchAndAwaitChanges(debugElement, fixture);

            expect(onClick).toHaveBeenCalledTimes(1);
            expect(fixture.detectChanges).toHaveBeenCalledTimes(2);
            expect(fixture.whenStable).toHaveBeenCalledTimes(1);
        });
    });
});
