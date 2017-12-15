import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccordionModule, CarouselModule, ModalModule } from 'ngx-bootstrap';

import { CompileHtmlModule } from './compile-html';

import { HeadingComponent } from './heading/heading.component';
import { ModalComponent } from './modal/modal.component';
import { RouterLinkButtonGroupComponent } from './router-link-button-group/router-link-button-group.component';

import { MapToIterablePipe } from './map-to-iterable/map-to-iterable.pipe';
import { OrderByPipe } from './order-by/order-by.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AccordionModule,
        ModalModule,
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
        CarouselModule,
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
