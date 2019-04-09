import { DebugElement } from '@angular/core';
import { ComponentFixture, flush } from '@angular/core/testing';

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const BUTTON_CLICK_EVENTS = {
    left: { button: 0 },
    right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(el: DebugElement | HTMLElement, eventObj: any = BUTTON_CLICK_EVENTS.left): void {
    if (el instanceof HTMLElement) {
        el.click();
    } else {
        el.triggerEventHandler('click', eventObj);
    }
}

/** Simulate element click and wait for changes to be applied */
export function clickAndAwaitChanges(clickDe: DebugElement, fixture: ComponentFixture<any>) {
    // trigger click with click helper
    click(clickDe);

    // wait for changes
    flush();
    fixture.detectChanges();
}
