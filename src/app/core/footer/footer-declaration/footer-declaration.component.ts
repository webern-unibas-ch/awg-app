import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MetaPage } from '@awg-core/core-models';

/**
 * The FooterDeclaration component.
 *
 * It contains the declaration section of the footer
 * with version number, release date and impressum.
 */
@Component({
    selector: 'awg-footer-declaration',
    templateUrl: './footer-declaration.component.html',
    styleUrls: ['./footer-declaration.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterDeclarationComponent {
    /**
     * Input variable: pageMetaData.
     *
     * It keeps the page meta data for the component.
     */
    @Input()
    pageMetaData: MetaPage;
}
