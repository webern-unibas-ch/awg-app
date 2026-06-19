import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

/**
 * Test helper function: clickAndAwaitChanges.
 *
 * It simulates the click on an element
 * and waits for changes to be applied.
 *
 * Exposed to be called from tests.
 *
 * @param {DebugElement } clickDe The DebugElement to be clicked on.
 * @param {ComponentFixture<any>} fixture The component fixture on which the changes are applied.
 *
 * @returns {Promise<void>} Triggers the click event and applies the changes to the component fixture.
 */
export async function clickAndAwaitChanges(
    clickTarget: DebugElement | HTMLElement,
    fixture: ComponentFixture<any>
): Promise<void> {
    const targetEl = clickTarget && 'nativeElement' in clickTarget ? clickTarget.nativeElement : clickTarget;

    if ((targetEl as HTMLButtonElement)?.disabled) {
        return;
    }

    targetEl.click();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

/**
 * Test helper function: clickDispatchAndAwaitChanges.
 *
 * It dispatches a native click event on an element
 * (useful for listeners attached outside Angular, e.g. D3)
 * and waits for fixture changes to stabilize.
 *
 * @param {DebugElement | Element} clickTarget The element or DebugElement to dispatch a click event on.
 * @param {ComponentFixture<any>} fixture The component fixture on which the changes are applied.
 *
 * @returns {Promise<void>} Dispatches the click event and applies the changes to the component fixture.
 */
export async function clickDispatchAndAwaitChanges(
    clickTarget: DebugElement | Element,
    fixture: ComponentFixture<any>
): Promise<void> {
    const targetEl = clickTarget instanceof Element ? clickTarget : (clickTarget.nativeElement as Element);

    // Do nothing if the target is disabled (for native form controls).
    if ((targetEl as HTMLButtonElement)?.disabled) {
        return;
    }

    targetEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}
