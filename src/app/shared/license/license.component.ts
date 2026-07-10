import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';

/**
 * The License component.
 *
 * It contains the license template of the app.
 */
@Component({
    selector: 'awg-license',
    templateUrl: './license.component.html',
    styleUrls: ['./license.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ExternalLinkDirective],
})
export class LicenseComponent {
    /**
     * Readonly variable: LICENSE_LINK
     *
     * It contains the link to the license.
     */
    readonly LICENSE_LINK = 'https://creativecommons.org/licenses/by-sa/4.0/';

    /**
     * Readonly variable: LICENSE_TEXT
     *
     * It contains the short text of the license.
     */
    readonly LICENSE_TEXT =
        'Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International Lizenz';

    /**
     * Readonly variable: LICENSE_ICONS
     *
     * It contains the icons of the license.
     */
    readonly LICENSE_ICONS = [
        { src: 'https://mirrors.creativecommons.org/presskit/icons/cc.svg', alt: 'Creative Commons icon' },
        { src: 'https://mirrors.creativecommons.org/presskit/icons/by.svg', alt: 'Creative Commons Attribution icon' },
        { src: 'https://mirrors.creativecommons.org/presskit/icons/sa.svg', alt: 'Creative Commons ShareAlike icon' },
    ];
}
