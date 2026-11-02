import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink, UrlTree } from '@angular/router';

/**
 * The ConditionalLink component.
 *
 * It conditionally renders a clickable link (a router link if a target route is given,
 * otherwise a click event) or a non-clickable content.
 */
@Component({
    selector: 'awg-conditional-link',
    templateUrl: './conditional-link.component.html',
    styleUrl: './conditional-link.component.scss',
    imports: [NgTemplateOutlet, RouterLink],
})
export class ConditionalLinkComponent {
    /**
     * Readonly input signal: isClickable.
     *
     * It indicates whether the target is clickable.
     */
    readonly isClickable = input<boolean>(false);

    /**
     * Readonly input signal: targetRoute.
     *
     * It holds the route the clickable link navigates to, if any.
     */
    readonly targetRoute = input<readonly unknown[] | string | UrlTree | null>(null);

    /**
     * Readonly output signal: clicked.
     *
     * It emits an event when the clickable target without a target route is clicked
     * (with a target route, the router link navigates instead).
     */
    readonly clicked = output();
}
