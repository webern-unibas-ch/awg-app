import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//
// Shared modules
import { SharedNgbootstrapModule } from '@awg-shared/shared-ngbootstrap.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { CodeMirrorModule } from './codemirror/codemirror.module';
import { CompileHtmlModule } from './compile-html';

//
// Shared components
import { AlertErrorComponent } from './alert-error/alert-error.component';
import { AlertInfoComponent } from './alert-info/alert-info.component';
import { DisclaimerWorkeditionsComponent } from './disclaimer-workeditions/disclaimer-workeditions.component';
import { FullscreenToggleComponent } from './fullscreen/fullscreen-toggle.component';
import { HeadingComponent } from './heading/heading.component';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';
import { LicenseComponent } from './license/license.component';
import { LogoComponent } from './logos/logo.component';
import { MetaIdentifierBadgesComponent } from './meta/meta-identifier-badges/meta-identifier-badges.component';
import { ModalComponent } from './modal/modal.component';
import { RouterLinkButtonGroupComponent } from './router-link-button-group/router-link-button-group.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { TablePaginationComponent } from './table/table-pagination/table-pagination.component';
import { TableComponent } from './table/table.component';
import { ToastComponent } from './toast/toast.component';
import { TwelveToneSpinnerComponent } from './twelve-tone-spinner/twelve-tone-spinner.component';
import { ViewHandleButtonGroupComponent } from './view-handle-button-group/view-handle-button-group.component';

//
// Shared directives
import { AbbrDirective } from './abbr/abbr.directive';
import { ExternalLinkDirective } from './external-link/external-link.directive';

//
// Shared pipes
import { OrderByPipe } from './order-by-pipe/order-by.pipe';

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
        CodeMirrorModule,
        FontAwesomeModule,
        NgxJsonViewerModule,
        SharedNgbootstrapModule,
        AlertInfoComponent,
        FullscreenToggleComponent,
        HeadingComponent,
        LogoComponent,
        MetaIdentifierBadgesComponent,
    ],
    declarations: [
        AlertErrorComponent,
        DisclaimerWorkeditionsComponent,
        JsonViewerComponent,
        LanguageSwitcherComponent,
        LicenseComponent,
        ModalComponent,
        RouterLinkButtonGroupComponent,
        ScrollToTopComponent,
        TableComponent,
        TablePaginationComponent,
        ToastComponent,
        TwelveToneSpinnerComponent,
        ViewHandleButtonGroupComponent,
        AbbrDirective,
        ExternalLinkDirective,
        OrderByPipe,
    ],
    exports: [
        CommonModule,
        CodeMirrorModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CompileHtmlModule,
        FontAwesomeModule,
        NgxJsonViewerModule,
        SharedNgbootstrapModule,
        AlertErrorComponent,
        AlertInfoComponent,
        DisclaimerWorkeditionsComponent,
        FullscreenToggleComponent,
        HeadingComponent,
        JsonViewerComponent,
        LanguageSwitcherComponent,
        LicenseComponent,
        LogoComponent,
        MetaIdentifierBadgesComponent,
        ModalComponent,
        RouterLinkButtonGroupComponent,
        ScrollToTopComponent,
        TableComponent,
        ToastComponent,
        TwelveToneSpinnerComponent,
        ViewHandleButtonGroupComponent,
        AbbrDirective,
        ExternalLinkDirective,
        OrderByPipe,
    ],
})
export class SharedModule {}
