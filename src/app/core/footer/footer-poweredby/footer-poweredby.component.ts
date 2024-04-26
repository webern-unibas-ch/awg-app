import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

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
})
export class FooterPoweredbyComponent {
    /**
     * Input variable: logos.
     *
     * It keeps the logos data for the component.
     */
    @Input()
    logos: Logos;

    /**
     * Input variable: pageMetaData.
     *
     * It keeps the page metadata for the component.
     */
    @Input()
    pageMetaData: MetaPage;

    /**
     * Public variable: faScrewdriverWrench.
     *
     *  It instantiates fontawesome's faScrewdriverWrench icon.
     */
    faScrewdriverWrench = faScrewdriverWrench;
}
