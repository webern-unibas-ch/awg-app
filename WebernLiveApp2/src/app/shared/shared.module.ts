import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselModule, ModalModule } from 'ng2-bootstrap';

import { ModalComponent } from './modal/modal.component';

import { MapToIterablePipe } from './map-to-iterable/map-to-iterable.pipe';
import { SanitizeHTMLPipe } from './sanitize-html/sanitize-html.pipe';

@NgModule({
    imports: [ CommonModule, FormsModule, ModalModule ],
    declarations: [
        ModalComponent,

        MapToIterablePipe,
        SanitizeHTMLPipe
    ],
    exports: [
        CommonModule, FormsModule,
        CarouselModule, ModalModule,

        ModalComponent,
        MapToIterablePipe,
        SanitizeHTMLPipe
    ]
})
export class SharedModule { }
