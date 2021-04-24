import { DebugElement } from '@angular/core';
import { ComponentFixture, flush } from '@angular/core/testing';

/**
 * Test helper object constant: BUTTON_CLICK_EVENTS.
 *
 * It provides button click events to be passed to
 * `DebugElement.triggerEventHandler` for RouterLink event handler.
 */
export const BUTTON_CLICK_EVENTS = {
    left: { button: 0 },
    right: { button: 2 },
};

/**
 * Test helper function: click.
 *
 * It simulates the click on an element.
 * Defaults to mouse left-button click event.
 *
 * Exposed to be called from tests.
 *
 * @param {DebugElement | HTMLElement} el The element to be clicked on.
 * @param {any} eventObj The click event object. Defaults to mouse left-button click event.
 *
 * @returns {void} Triggers the event handler.
 */
export function click(el: DebugElement | HTMLElement, eventObj: any = BUTTON_CLICK_EVENTS.left): void {
    if (el instanceof HTMLElement) {
        el.click();
    } else {
        el.triggerEventHandler('click', eventObj);
    }
}

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
 * @returns {void} Triggers the click event and applies the changes to the component fixture.
 */
export function clickAndAwaitChanges(clickDe: DebugElement, fixture: ComponentFixture<any>): void {
    // Do nothing if element is disabled
    if (clickDe.nativeElement.disabled) {
        return;
    }

    // Trigger click with click helper
    click(clickDe);

    // Wait for changes to be applied
    flush();
    fixture.detectChanges();
}
