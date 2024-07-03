import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LOGOSDATA } from '@awg-core/core-data';
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
        const isSnfLogo = id === LOGOSDATA['snf'].id;
        const isUnibasLogo = id === LOGOSDATA['unibas'].id;
        const isSagwLogo = id === LOGOSDATA['sagw'].id;

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
