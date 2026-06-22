import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { LOGOS_DATA } from '@awg-core/core-data';
import { Logo } from '@awg-core/core-models';

/**
 * The FooterLogo component.
 *
 * It contains a footer logo.
 */
@Component({
    selector: 'awg-footer-logo',
    templateUrl: './footer-logo.component.html',
    styleUrls: ['./footer-logo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterLogoComponent {
    /**
     * Input signal: logo.
     *
     * It holds the logo data for the component.
     */
    logo = input.required<Logo>();

    /**
     * Computed signal: logoClassList.
     *
     * It derives the CSS class list automatically whenever the logo input changes.
     */
    logoClassList = computed(() => {
        const id = this.logo().id;

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
