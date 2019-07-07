import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Logos } from '@awg-core/core-models';

/**
 * The FooterPoweredBy component.
 *
 * It contains the poweredby section of the footer.
 */
@Component({
    selector: 'awg-footer-poweredby',
    templateUrl: './footer-poweredby.component.html',
    styleUrls: ['./footer-poweredby.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterPoweredbyComponent {
    /**
     * Input variable: logos.
     *
     * It keeps the logos data for the component.
     */
    @Input()
    logos: Logos;
}
