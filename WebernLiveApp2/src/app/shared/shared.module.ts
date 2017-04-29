import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselModule, ModalModule } from 'ngx-bootstrap';

import { CompileHtmlModule } from './compile-html';

import { HeadingComponent } from './heading/heading.component';
import { ModalComponent } from './modal/modal.component';

import { MapToIterablePipe } from './map-to-iterable/map-to-iterable.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        CompileHtmlModule.forRoot()
    ],
    declarations: [
        HeadingComponent,
        ModalComponent,
        MapToIterablePipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        CarouselModule,
        ModalModule,
        CompileHtmlModule,

        HeadingComponent,
        ModalComponent,
        MapToIterablePipe
    ]
})
export class SharedModule { }
