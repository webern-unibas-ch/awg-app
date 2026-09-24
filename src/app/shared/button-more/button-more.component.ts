import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * The ButtonMore component.
 *
 * It contains the button to show more content.
 */
@Component({
    selector: 'awg-button-more',
    templateUrl: './button-more.component.html',
    styleUrl: './button-more.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class ButtonMoreComponent {
    /**
     * Readonly input signal: targetRoute.
     *
     * It holds the target route for the button.
     */
    targetRoute = input.required<string[]>();

    /**
     * Readonly input signal: queryParams.
     *
     * It holds the query parameters for the button's target route.
     */
    queryParams = input<Record<string, string> | null>(null);

    /**
     * Readonly input signal: disabled.
     *
     * It holds the disabled state of the button.
     */
    disabled = input<boolean>(false);
}
