import { Component } from '@angular/core';

import { LogoComponent } from '@awg-shared/logos/logo.component';
import { LOGOS_DATA } from '@awg-shared/logos/logos.data';

import { META_DATA } from '../data/meta.data';
import { MetaSectionTypes } from '../models/meta.model';

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
 * and {@link LogoComponent}.
 */
@Component({
    selector: 'awg-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [LogoComponent, FooterDeclarationComponent, FooterCopyrightComponent, FooterPoweredbyComponent],
})
export class FooterComponent {
    /**
     * Readonly variable: logosData.
     *
     * It kepps the logos data for the footer.
     */
    readonly logosData = LOGOS_DATA;

    /**
     * Readonly variable: pageMetaData.
     *
     * It keeps the page metadata for the footer.
     */
    readonly pageMetaData = META_DATA[MetaSectionTypes.page];
}
