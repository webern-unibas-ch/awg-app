import { Component, isSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import * as D3_SELECTION from 'd3-selection';

import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { CanvasDragMove, CanvasDragSubjectAccessor } from './canvas-drag.model';

import { CanvasDragDirective } from './canvas-drag.directive';

@Component({
    template: `<canvas
        awgCanvasDrag
        [dragSubject]="dragSubject()"
        (dragMove)="dragMoveSpy($event)"
        (dragEnd)="dragEndSpy($event)"></canvas>`,
    imports: [CanvasDragDirective],
})
class CanvasDragTestHostComponent {
    // The subject `a` lies in the left half of the canvas (x < 50)
    readonly dragSubject = signal<CanvasDragSubjectAccessor<string>>(point => (point.x < 50 ? 'a' : undefined));
    readonly dragMoveSpy: Mock<(dragMove: CanvasDragMove<string>) => void> = vi.fn();
    readonly dragEndSpy: Mock<(subject: string) => void> = vi.fn();
}

describe('CanvasDragDirective (DONE)', () => {
    let fixture: ComponentFixture<CanvasDragTestHostComponent>;
    let host: CanvasDragTestHostComponent;
    let directive: CanvasDragDirective<string>;
    let canvasEl: HTMLCanvasElement;

    // D3-drag listens for moves and the end of a gesture on the window of the event (its view).
    // The window is set on the event afterwards, since jsdom rejects it as `view` option.
    const mouseEvent = (type: string, x: number, y: number, button = 0): MouseEvent => {
        const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button });
        Object.defineProperty(event, 'view', { value: window });
        return event;
    };
    const drag = (from: [number, number], to: [number, number], button = 0): void => {
        canvasEl.dispatchEvent(mouseEvent('mousedown', ...from, button));
        window.dispatchEvent(mouseEvent('mousemove', ...to, button));
        window.dispatchEvent(mouseEvent('mouseup', ...to, button));
    };
    const click = (at: [number, number]): void => {
        canvasEl.dispatchEvent(mouseEvent('mousedown', ...at));
        window.dispatchEvent(mouseEvent('mouseup', ...at));
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CanvasDragTestHostComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Create host fixture
        fixture = TestBed.createComponent(CanvasDragTestHostComponent);
        host = fixture.componentInstance;

        const directiveDe = getAndExpectDebugElementByDirective(fixture.debugElement, CanvasDragDirective, 1, 1)[0];
        directive = directiveDe.injector.get(CanvasDragDirective);
        canvasEl = directiveDe.nativeElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `dragSubject`', () => {
            expectToBe(isSignal(directive.dragSubject), true);

            expect(() => directive.dragSubject()).toThrow();
        });

        it('... should bind the d3 drag behaviour to the host canvas element', () => {
            const mouseDownListener = D3_SELECTION.select(canvasEl).on('mousedown.drag');

            expect(mouseDownListener).toBeDefined();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `dragSubject` to hold the provided accessor', () => {
            expectToBe(directive.dragSubject(), host.dragSubject());
        });

        describe('... drag gestures', () => {
            it('... should emit the subject and the pointer position on `dragMove` for every move', () => {
                drag([10, 20], [30, 40]);

                expectSpyCall(host.dragMoveSpy, 1, { subject: 'a', point: { x: 30, y: 40 } });
            });

            it('... should emit the subject on `dragEnd` at the end of a drag', () => {
                drag([10, 20], [30, 40]);

                expectSpyCall(host.dragEndSpy, 1, 'a');
            });

            it('... should not emit on `dragEnd` for a gesture without move (click)', () => {
                click([10, 20]);

                expectSpyCall(host.dragMoveSpy, 0);
                expectSpyCall(host.dragEndSpy, 0);
            });

            it('... should report the pointer position relative to the canvas', () => {
                vi.spyOn(canvasEl, 'getBoundingClientRect').mockReturnValue({ left: 5, top: 10 } as DOMRect);

                drag([10, 20], [30, 40]);

                expectSpyCall(host.dragMoveSpy, 1, { subject: 'a', point: { x: 25, y: 30 } });
            });

            it('... should find the subject at the start point of a gesture', () => {
                const dragSubjectSpy = vi.fn(() => 'a');
                host.dragSubject.set(dragSubjectSpy);
                fixture.detectChanges();

                drag([10, 20], [30, 40]);

                expectSpyCall(dragSubjectSpy, 1, { x: 10, y: 20 });
            });

            it('... should ignore a gesture without subject', () => {
                drag([60, 20], [30, 40]);

                expectSpyCall(host.dragMoveSpy, 0);
                expectSpyCall(host.dragEndSpy, 0);
            });

            it('... should replace a stale mouse gesture (mouseup lost) by a new one', () => {
                host.dragSubject.set(point => (point.x < 50 ? 'a' : 'b'));
                fixture.detectChanges();

                // The mouseup of the first gesture never arrives (e.g. released outside the window)
                canvasEl.dispatchEvent(mouseEvent('mousedown', 10, 20));
                drag([60, 20], [70, 40]);

                expectSpyCall(host.dragMoveSpy, 1, { subject: 'b', point: { x: 70, y: 40 } });
                expectSpyCall(host.dragEndSpy, 1, 'b');
            });

            it('... should ignore a gesture with a secondary button (d3 default)', () => {
                drag([10, 20], [30, 40], 2);

                expectSpyCall(host.dragMoveSpy, 0);
                expectSpyCall(host.dragEndSpy, 0);
            });
        });

        describe('METHODS', () => {
            describe('#_findGesture()', () => {
                it('... should have a method `_findGesture`', () => {
                    expect(directive['_findGesture']).toBeDefined();
                });

                it('... should wrap the found subject (not moved yet, without own coordinates)', () => {
                    const gesture = directive['_findGesture']({ x: 10, y: 20 } as never);

                    expectToEqual(gesture, { subject: 'a', isMoved: false });
                });

                it('... should hold undefined without a found subject', () => {
                    const gesture = directive['_findGesture']({ x: 60, y: 20 } as never);

                    expect(gesture).toBeUndefined();
                });

                it('... should hold undefined for a further touch while another drag is running', () => {
                    canvasEl.dispatchEvent(mouseEvent('mousedown', 10, 20));
                    const gesture = directive['_findGesture']({ x: 10, y: 20, identifier: 1 } as never);
                    window.dispatchEvent(mouseEvent('mouseup', 10, 20));

                    expect(gesture).toBeUndefined();
                });

                it('... should wrap the found subject of a mouse gesture while another drag is running', () => {
                    canvasEl.dispatchEvent(mouseEvent('mousedown', 10, 20));
                    const gesture = directive['_findGesture']({ x: 10, y: 20, identifier: 'mouse' } as never);
                    window.dispatchEvent(mouseEvent('mouseup', 10, 20));

                    expectToEqual(gesture, { subject: 'a', isMoved: false });
                });

                it('... should wrap the found subject again after the end of a gesture', () => {
                    click([10, 20]);
                    const gesture = directive['_findGesture']({ x: 10, y: 20 } as never);

                    expectToEqual(gesture, { subject: 'a', isMoved: false });
                });
            });
        });
    });
});
