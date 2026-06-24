import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

import { LogoLinkComponent } from '@awg-app/core/logo-link/logo-link.component';
import { Logos, MetaPage } from '@awg-core/core-models';

/**
 * The FooterPoweredBy component.
 *
 * It contains the poweredby section of the footer.
 */
@Component({
    selector: 'awg-footer-poweredby',
    templateUrl: './footer-poweredby.component.html',
    styleUrls: ['./footer-poweredby.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent, LogoLinkComponent],
})
export class FooterPoweredbyComponent {
    /**
     * Input signal: logosData.
     *
     * It holds the logos data for the component.
     */
    logosData = input.required<Logos>();

    /**
     * Input signal: pageMetaData.
     *
     * It holds the page metadata for the footer poweredby section.
     */
    pageMetaData = input.required<MetaPage>();

    /**
     * Computed signal: poweredByData.
     *
     * It computes the relevant logos and pageMetaData for the poweredby section.
     */
    poweredByData = computed(() => {
        const logos = this.logosData();
        const page = this.pageMetaData();

        const githubLogo = logos?.['github'];
        const angularLogo = logos?.['angular'];
        const bootstrapLogo = logos?.['bootstrap'];
        const devUrl = page?.awgAppDevUrl;

        if (!githubLogo || !angularLogo || !bootstrapLogo || !devUrl) {
            return null;
        }
        return { githubLogo, angularLogo, bootstrapLogo, devUrl };
    });

    /**
     * Public variable: faScrewdriverWrench.
     *
     *  It instantiates fontawesome's faScrewdriverWrench icon.
     */
    faScrewdriverWrench = faScrewdriverWrench;
}
