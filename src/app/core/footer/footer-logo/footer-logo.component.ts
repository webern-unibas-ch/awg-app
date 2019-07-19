import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Logo } from '@awg-core/core-models';

/**
 * The FooterLogo component.
 *
 * It contains a footer logo.
 */
@Component({
    selector: 'awg-footer-logo',
    templateUrl: './footer-logo.component.html',
    styleUrls: ['./footer-logo.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterLogoComponent {
    /**
     * Input variable: logo.
     *
     * It keeps the logo data for the component.
     */
    @Input()
    logo: Logo;
}
