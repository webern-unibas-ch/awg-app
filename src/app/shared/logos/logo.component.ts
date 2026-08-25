import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';

import { LOGOS_DATA } from './logos.data';
import { Logo } from './logos.model';

/**
 * The Logo component.
 *
 * It contains a logo used in the navbar and footer.
 */
@Component({
    selector: 'awg-logo',
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ExternalLinkDirective],
})
export class LogoComponent {
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

        const isSnfLogo = id === LOGOS_DATA.snf.id;
        const isUnibasLogo = id === LOGOS_DATA.unibas.id;
        const isSagwLogo = id === LOGOS_DATA.sagw.id;

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
