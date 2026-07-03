import { Component, inject, signal } from '@angular/core';

import { LogoLinkComponent } from '../logo-link/logo-link.component';
import { Logos } from '../models/logos.model';
import { MetaPage, MetaSectionTypes } from '../models/meta.model';
import { CoreService } from '../services/core-service/core.service';

import { FooterCopyrightComponent } from './footer-copyright/footer-copyright.component';
import { FooterDeclarationComponent } from './footer-declaration/footer-declaration.component';
import { FooterPoweredbyComponent } from './footer-poweredby/footer-poweredby.component';

/**
 * The Footer component.
 *
 * It contains the footer section of the app
 * with the {@link FooterDeclarationComponent},
 * {@link FooterCopyrightComponent},
 * {@link FooterPoweredbyComponent}
 * and {@link LogoLinkComponent}.
 */
@Component({
    selector: 'awg-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [LogoLinkComponent, FooterDeclarationComponent, FooterCopyrightComponent, FooterPoweredbyComponent],
})
export class FooterComponent {
    /**
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

    /**
     * Readonly signal: logosData.
     *
     * It holds the logos data for the footer.
     */
    readonly logosData = signal<Logos>(this._coreService.getLogos()).asReadonly();

    /**
     * Readonly signal: pageMetaData.
     *
     * It holds the page metadata for the footer via the injected CoreService.
     */
    readonly pageMetaData = signal<MetaPage>(this._coreService.getMetaDataSection(MetaSectionTypes.page)).asReadonly();
}
