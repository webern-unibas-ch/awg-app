import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
    standalone: false,
})
export class FooterLogoComponent {
    /**
     * Input variable: logo.
     *
     * It keeps the logo data for the component.
     */
    @Input()
    logo: Logo;

    /**
     * Public variable: getLogoClass.
     *
     * It checks a given logo id and returns the corresponding class list.
     *
     * @param {string} id The given logo id.
     *
     * @returns {string} The class list for the logo.
     */
    getLogoClass(id: string): string {
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
    }
}
