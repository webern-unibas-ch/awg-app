import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { LOGOS_DATA } from '../data/logos.data';
import { Logo } from '../models/logos.model';

/**
 * The LogoLink component.
 *
 * It contains a logo link used in the navbar and footer.
 */
@Component({
    selector: 'awg-logo-link',
    templateUrl: './logo-link.component.html',
    styleUrl: './logo-link.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoLinkComponent {
    /**
     * Readonly input signal: logoData.
     *
     * It holds the logo data for the component.
     */
    readonly logoData = input.required<Logo>();

    /**
     * Readonly input signal: linkClass.
     *
     * It holds the CSS class for the anchor element.
     */
    readonly linkClass = input<string>('awg-logo-link');

    /**
     * Readonly computed signal: logoClassList.
     *
     * It derives the CSS class list automatically whenever the logo input changes.
     */
    readonly logoClassList = computed(() => {
        const id = this.logoData().id;

        const isSnfLogo = id === LOGOS_DATA['snf'].id;
        const isUnibasLogo = id === LOGOS_DATA['unibas'].id;
        const isSagwLogo = id === LOGOS_DATA['sagw'].id;

        let classList = '';
        if (isUnibasLogo || isSnfLogo || isSagwLogo) {
            classList = 'my-2';
        }
        if (isSagwLogo || isSnfLogo) {
            classList += ' float-end';
        }
        return classList;
    });
}
