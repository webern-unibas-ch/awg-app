import { Component, inject, signal } from '@angular/core';

import { Logos, MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

/**
 * The Footer component.
 *
 * It contains the footer section of the app
 * with the {@link FooterDeclarationComponent},
 * {@link FooterCopyrightComponent},
 * {@link FooterPoweredbyComponent}
 * and {@link FooterLogoComponent}.
 */
@Component({
    selector: 'awg-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false,
})
export class FooterComponent {
    /**
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

    /**
     * Public readonly signal: logos.
     *
     * It holds the logos for the footer.
     */
    logosData = signal<Logos>(this._coreService.getLogos()).asReadonly();

    /**
     * Public readonly signal: pageMetaData.
     *
     * It holds the page metadata for the contact view via the injected CoreService.
     */
    pageMetaData = signal<MetaPage>(this._coreService.getMetaDataSection(MetaSectionTypes.page)).asReadonly();
}
