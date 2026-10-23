import { Component } from '@angular/core';

import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';

/**
 * The License component.
 *
 * It contains the license template of the app.
 */
@Component({
    selector: 'awg-license',
    templateUrl: './license.component.html',
    styleUrl: './license.component.scss',
    imports: [ExternalLinkDirective],
})
export class LicenseComponent {
    /**
     * Readonly variable: licenseLink
     *
     * It contains the link to the license.
     */
    readonly licenseLink = 'https://creativecommons.org/licenses/by-sa/4.0/';

    /**
     * Readonly variable: licenseText
     *
     * It contains the short text of the license.
     */
    readonly licenseText =
        'Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International Lizenz';

    /**
     * Readonly variable: licenseIcons
     *
     * It contains the icons of the license.
     */
    readonly licenseIcons = [
        { src: 'https://mirrors.creativecommons.org/presskit/icons/cc.svg', alt: 'Creative Commons icon' },
        { src: 'https://mirrors.creativecommons.org/presskit/icons/by.svg', alt: 'Creative Commons Attribution icon' },
        { src: 'https://mirrors.creativecommons.org/presskit/icons/sa.svg', alt: 'Creative Commons ShareAlike icon' },
    ];
}
