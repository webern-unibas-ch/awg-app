import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

import { Logos, MetaPage } from '@awg-core/core-models';

import { FooterLogoComponent } from '../footer-logo/footer-logo.component';

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
    imports: [FaIconComponent, FooterLogoComponent],
})
export class FooterPoweredbyComponent {
    /**
     * Input signal: logos.
     *
     * It holds the logos data for the component.
     */
    logos = input.required<Logos>();

    /**
     * Input signal: pageMetaData.
     *
     * It holds the page metadata for the footer declaration.
     */
    pageMetaData = input.required<MetaPage>();

    /**
     * Computed signal: poweredBydata.
     *
     * It combines the logos and pageMetaData signals into one object.
     */
    poweredBydata = computed(() => {
        const logos = this.logos();
        const page = this.pageMetaData();

        if (!logos || !page) {
            return null;
        }
        return { logos, page };
    });

    /**
     * Public variable: faScrewdriverWrench.
     *
     *  It instantiates fontawesome's faScrewdriverWrench icon.
     */
    faScrewdriverWrench = faScrewdriverWrench;
}
