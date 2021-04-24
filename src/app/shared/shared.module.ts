import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//
// Shared modules
import { CompileHtmlModule } from './compile-html';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { SharedNgbootstrapModule } from '@awg-shared/shared-ngbootstrap.module';

//
// Shared components
import { AddressComponent } from './address/address.component';
import { HeadingComponent } from './heading/heading.component';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { ModalComponent } from './modal/modal.component';
import { OpenStreetMapComponent } from './open-street-map/open-street-map.component';
import { RouterLinkButtonGroupComponent } from './router-link-button-group/router-link-button-group.component';
import { TwelveToneSpinnerComponent } from './twelve-tone-spinner/twelve-tone-spinner.component';

//
// Shared directives
import { ExternalLinkDirective } from './external-link/external-link.directive';

//
// Shared pipes
import { OrderByPipe } from './order-by/order-by.pipe';

/**
 * The shared module.
 *
 * It embeds all the components used by different modules.
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CompileHtmlModule,
        CodemirrorModule,
        FontAwesomeModule,
        NgxGalleryModule,
        NgxJsonViewerModule,
        SharedNgbootstrapModule,
    ],
    declarations: [
        AddressComponent,
        HeadingComponent,
        JsonViewerComponent,
        ModalComponent,
        OpenStreetMapComponent,
        RouterLinkButtonGroupComponent,
        TwelveToneSpinnerComponent,
        ExternalLinkDirective,
        OrderByPipe,
    ],
    exports: [
        CommonModule,
        CodemirrorModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CompileHtmlModule,
        FontAwesomeModule,
        NgxGalleryModule,
        NgxJsonViewerModule,
        SharedNgbootstrapModule,

        AddressComponent,
        HeadingComponent,
        JsonViewerComponent,
        ModalComponent,
        OpenStreetMapComponent,
        RouterLinkButtonGroupComponent,
        TwelveToneSpinnerComponent,
        ExternalLinkDirective,
        OrderByPipe,
    ],
})
export class SharedModule {}
