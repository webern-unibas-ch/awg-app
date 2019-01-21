import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//
// shared modules
import { CompileHtmlModule } from './compile-html';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    NgbAccordionModule,
    NgbButtonsModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbTabsetModule,
    NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

//
// shared components
import { HeadingComponent } from './heading/heading.component';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { ModalComponent } from './modal/modal.component';
import { RouterLinkButtonGroupComponent } from './router-link-button-group/router-link-button-group.component';
import { TwelveToneSpinnerComponent } from './twelve-tone-spinner/twelve-tone-spinner.component';

//
// shared pipes
import { OrderByPipe } from './order-by/order-by.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CompileHtmlModule,
        FontAwesomeModule,
        NgbAccordionModule,
        NgbButtonsModule,
        NgbCollapseModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbTabsetModule,
        NgbTooltipModule,
        NgxJsonViewerModule
    ],
    declarations: [
        HeadingComponent,
        JsonViewerComponent,
        ModalComponent,
        RouterLinkButtonGroupComponent,
        TwelveToneSpinnerComponent,
        OrderByPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CompileHtmlModule,
        FontAwesomeModule,
        NgbAccordionModule,
        NgbButtonsModule,
        NgbCollapseModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbTabsetModule,
        NgbTooltipModule,
        NgxJsonViewerModule,

        HeadingComponent,
        JsonViewerComponent,
        ModalComponent,
        OrderByPipe,
        RouterLinkButtonGroupComponent,
        TwelveToneSpinnerComponent
    ]
})
export class SharedModule {}
