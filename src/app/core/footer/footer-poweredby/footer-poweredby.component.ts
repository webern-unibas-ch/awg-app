import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

import { LogoComponent } from '@awg-shared/logos/logo.component';
import { Logos } from '@awg-shared/logos/logos.model';
import { MetaPage } from '@awg-shared/meta/meta.model';

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
    imports: [FaIconComponent, LogoComponent],
})
export class FooterPoweredbyComponent {
    /**
     * Readonly input signal: logosData.
     *
     * It holds the logos data for the component.
     */
    readonly logosData = input.required<Logos>();

    /**
     * Readonly input signal: pageMetaData.
     *
     * It holds the page metadata for the footer poweredby section.
     */
    readonly pageMetaData = input.required<MetaPage>();

    /**
     * Readonly computed signal: poweredByData.
     *
     * It computes the relevant logos and pageMetaData for the poweredby section.
     */
    readonly poweredByData = computed(() => {
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
     * Readonly variable: faScrewdriverWrench.
     *
     *  It instantiates fontawesome's faScrewdriverWrench icon.
     */
    readonly faScrewdriverWrench = faScrewdriverWrench;
}
