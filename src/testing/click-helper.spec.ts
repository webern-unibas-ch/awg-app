import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

import { describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges, clickDispatchAndAwaitChanges } from './click-helper';

describe('click-helper', () => {
    describe('#clickAndAwaitChanges()', () => {
        it('... should have a method `clickAndAwaitChanges`', () => {
            expect(clickAndAwaitChanges).toBeDefined();
            expect(typeof clickAndAwaitChanges).toBe('function');
        });

        it('... should return early when element is disabled', async () => {
            const mockHtmlElement = {
                disabled: true,
                click: vi.fn(),
            } as unknown as HTMLElement;
            const fixture = {
                detectChanges: vi.fn(),
                whenStable: vi.fn().mockResolvedValue(undefined),
            } as unknown as ComponentFixture<any>;

            await clickAndAwaitChanges(mockHtmlElement, fixture);

            expect(mockHtmlElement.click).not.toHaveBeenCalled();

            expect(fixture.detectChanges).not.toHaveBeenCalled();
            expect(fixture.whenStable).not.toHaveBeenCalled();
        });

        it('... should trigger native click and apply changes for HTMLElement target', async () => {
            const button = document.createElement('button');
            const onClick = vi.fn();
            button.addEventListener('click', onClick);

            const fixture = {
                detectChanges: vi.fn(),
                whenStable: vi.fn().mockResolvedValue(undefined),
            } as unknown as ComponentFixture<any>;

            await clickAndAwaitChanges(button, fixture);

            expect(onClick).toHaveBeenCalledTimes(1);

            expect(fixture.detectChanges).toHaveBeenCalledTimes(2);
            expect(fixture.whenStable).toHaveBeenCalledTimes(1);
        });

        it('... should resolve DebugElement target to native element and trigger click', async () => {
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

            await clickAndAwaitChanges(debugElement, fixture);

            expect(onClick).toHaveBeenCalledTimes(1);
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
