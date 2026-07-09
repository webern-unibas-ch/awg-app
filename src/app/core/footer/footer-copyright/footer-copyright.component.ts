import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MetaPage } from '@awg-shared/meta/meta.model';

/**
 * The FooterCopyright component.
 *
 * It contains the copyright section of the footer.
 */
@Component({
    selector: 'awg-footer-copyright',
    templateUrl: './footer-copyright.component.html',
    styleUrls: ['./footer-copyright.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterCopyrightComponent {
    /**
     * Readonly input signal: pageMetaData.
     *
     * It holds the page metadata for the footer copyright.
     */
    readonly pageMetaData = input.required<MetaPage>();
}
