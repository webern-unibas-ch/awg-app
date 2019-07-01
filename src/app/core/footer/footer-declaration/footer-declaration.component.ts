import { Component, Input } from '@angular/core';

import { Meta } from '@awg-core/core-models';

/**
 * The FooterDeclaration component.
 *
 * It contains the declaration section of the footer
 * with version number, release date and impressum.
 */
@Component({
    selector: 'awg-footer-declaration',
    templateUrl: './footer-declaration.component.html',
    styleUrls: ['./footer-declaration.component.css']
})
export class FooterDeclarationComponent {
    /**
     * Input variable: metaData.
     *
     * It keeps the meta data for the component.
     */
    @Input()
    metaData: Meta;
}
