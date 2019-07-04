import { Component, OnInit } from '@angular/core';

import { Logos, MetaSectionKey, MetaPage } from '@awg-core/core-models';
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
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    /**
     * Public variable: pageMetaData.
     *
     * It keeps the page meta data for the footer.
     */
    pageMetaData: MetaPage;

    /**
     * Public variable: logos.
     *
     * It keeps the logos for the footer.
     */
    logos: Logos;

    /**
     * Constructor of the FooterComponent.
     *
     * It declares a private CoreService instance
     * to get the meta data and logos.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     */
    constructor(private coreService: CoreService) {}

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
     * the meta data and logos for the footer.
     *
     * @returns {void} Sets the pageMetaData and logos variables.
     */
    provideMetaData(): void {
        this.pageMetaData = this.coreService.getMetaDataSection(MetaSectionKey.page);
        this.logos = this.coreService.getLogos();
    }
}
