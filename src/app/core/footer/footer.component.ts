import { Component, inject, OnInit } from '@angular/core';

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
export class FooterComponent implements OnInit {
    /**
     * Public variable: logos.
     *
     * It keeps the logos for the footer.
     */
    logos: Logos;

    /**
     * Public variable: pageMetaData.
     *
     * It keeps the page metadata for the footer.
     */
    pageMetaData: MetaPage;

    /**
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.provideMetaData();
    }

    /**
     * Public method: provideMetaData.
     *
     * It calls the CoreService to provide
     * the metadata and logos for the footer.
     *
     * @returns {void} Sets the pageMetaData and logos variables.
     */
    provideMetaData(): void {
        this.pageMetaData = this._coreService.getMetaDataSection(MetaSectionTypes.page);
        this.logos = this._coreService.getLogos();
    }
}
