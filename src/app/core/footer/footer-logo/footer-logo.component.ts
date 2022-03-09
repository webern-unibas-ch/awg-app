import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Logo } from '@awg-core/core-models';
import { LOGOSDATA } from '@awg-core/mock-data';

/**
 * The FooterLogo component.
 *
 * It contains a footer logo.
 */
@Component({
    selector: 'awg-footer-logo',
    templateUrl: './footer-logo.component.html',
    styleUrls: ['./footer-logo.component.css'],
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
     * It checks a given logo id for the logo
     * being part of the (right) main footer.
     *
     * @param {string} id The given logo id.
     *
     * @returns {boolean} The boolean value of the comparison.
     */
    getLogoClass(id: string) {
        const isSnfLogo = id === LOGOSDATA.snf.id;
        const isUnibasLogo = id === LOGOSDATA.unibas.id;
        const isSagwLogo = id === LOGOSDATA.sagw.id;

        let classList = '';
        if (isUnibasLogo || isSnfLogo || isSagwLogo) {
            classList = 'my-2';
        }
        if (isUnibasLogo || isSnfLogo) {
            classList += ' float-end';
        }
        return classList;
    }
}
