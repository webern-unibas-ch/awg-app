import { Component, Input } from '@angular/core';

import { Meta } from '@awg-core/core-models';

/**
 * The FooterCopyright component.
 *
 * It contains the copyright section of the footer.
 */
@Component({
    selector: 'awg-footer-copyright',
    templateUrl: './footer-copyright.component.html',
    styleUrls: ['./footer-copyright.component.css']
})
export class FooterCopyrightComponent {
    /**
     * Input variable: metaData.
     *
     * It keeps the meta data for the component.
     */
    @Input()
    metaData: Meta;
}
