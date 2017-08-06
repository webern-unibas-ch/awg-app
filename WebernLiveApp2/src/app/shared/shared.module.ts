import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CarouselModule, ModalModule } from 'ngx-bootstrap';

import { CompileHtmlModule } from './compile-html';

import { HeadingComponent } from './heading/heading.component';
import { ModalComponent } from './modal/modal.component';
import { RouterLinkButtonGroupComponent } from './router-link-button-group/router-link-button-group.component';

import { MapToIterablePipe } from './map-to-iterable/map-to-iterable.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ModalModule,
        CompileHtmlModule.forRoot()
    ],
    declarations: [
        HeadingComponent,
        ModalComponent,
        RouterLinkButtonGroupComponent,
        MapToIterablePipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        CarouselModule,
        ModalModule,
        CompileHtmlModule,

        HeadingComponent,
        ModalComponent,
        RouterLinkButtonGroupComponent,
        MapToIterablePipe
    ]
})
export class SharedModule { }
