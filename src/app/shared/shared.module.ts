import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//
// Shared modules
import { SharedNgbootstrapModule } from '@awg-shared/shared-ngbootstrap.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

//
// Shared components
import { AlertErrorComponent } from './alert-error/alert-error.component';
import { AlertInfoComponent } from './alert-info/alert-info.component';
import { ButtonScrollToTopComponent } from './button-scroll-to-top/button-scroll-to-top.component';
import { FullscreenToggleComponent } from './fullscreen/fullscreen-toggle.component';
import { HeadingComponent } from './heading/heading.component';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { LicenseComponent } from './license/license.component';
import { LogoComponent } from './logos/logo.component';
import { MetaIdentifierBadgesComponent } from './meta/meta-identifier-badges/meta-identifier-badges.component';
import { ModalComponent } from './modal/modal.component';
import { TableComponent } from './table/table.component';
import { ToastComponent } from './toast/toast.component';
import { TwelveToneSpinnerComponent } from './twelve-tone-spinner/twelve-tone-spinner.component';
import { ViewHandleButtonGroupComponent } from './view-handle-button-group/view-handle-button-group.component';

//
// Shared directives
import { ExternalLinkDirective } from './external-link/external-link.directive';

//
// Edition components and directives (moved to edition view; kept here until SharedModule cleanup)
import { AbbrDirective } from '@awg-views/edition-view/shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';
import { LanguageSwitcherComponent } from '@awg-views/edition-view/shared/language-switcher/language-switcher.component';

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
        AlertErrorComponent,
        FontAwesomeModule,
        NgxJsonViewerModule,
        SharedNgbootstrapModule,
        AlertInfoComponent,
        ButtonScrollToTopComponent,
        FullscreenToggleComponent,
        HeadingComponent,
        LanguageSwitcherComponent,
        LicenseComponent,
        LogoComponent,
        MetaIdentifierBadgesComponent,
        ModalComponent,
        TableComponent,
        ToastComponent,
        TwelveToneSpinnerComponent,
        ViewHandleButtonGroupComponent,
        AbbrDirective,
        CompileHtmlDirective,
        ExternalLinkDirective,
    ],
    declarations: [JsonViewerComponent],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,
        NgxJsonViewerModule,
        SharedNgbootstrapModule,
        AlertErrorComponent,
        AlertInfoComponent,
        ButtonScrollToTopComponent,
        FullscreenToggleComponent,
        HeadingComponent,
        JsonViewerComponent,
        LanguageSwitcherComponent,
        LicenseComponent,
        LogoComponent,
        MetaIdentifierBadgesComponent,
        ModalComponent,
        TableComponent,
        ToastComponent,
        TwelveToneSpinnerComponent,
        ViewHandleButtonGroupComponent,
        AbbrDirective,
        ExternalLinkDirective,
        CompileHtmlDirective,
    ],
})
export class SharedModule {}
