import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//
// shared modules
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CompileHtmlModule } from './compile-html';

//
// shared components
import { HeadingComponent } from './heading/heading.component';
import { ModalComponent } from './modal/modal.component';
import { RouterLinkButtonGroupComponent } from './router-link-button-group/router-link-button-group.component';

//
// shared pipes
import { MapToIterablePipe } from './map-to-iterable/map-to-iterable.pipe';
import { OrderByPipe } from './order-by/order-by.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AccordionModule.forRoot(),
        ButtonsModule.forRoot(),
        ModalModule.forRoot(),
        CompileHtmlModule
    ],
    declarations: [
        HeadingComponent,
        ModalComponent,
        RouterLinkButtonGroupComponent,
        MapToIterablePipe,
        OrderByPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AccordionModule,
        ButtonsModule,
        ModalModule,
        CompileHtmlModule,

        HeadingComponent,
        ModalComponent,
        RouterLinkButtonGroupComponent,
        MapToIterablePipe,
        OrderByPipe
    ]
})
export class SharedModule { }
