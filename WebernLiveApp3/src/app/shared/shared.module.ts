import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { HeadingComponent } from './heading/heading.component';
import { ModalComponent } from './modal/modal.component';

import { MapToIterablePipe } from './map-to-iterable/map-to-iterable.pipe';
import { SanitizeHTMLPipe } from './sanitize-html/sanitize-html.pipe';

@NgModule({
    imports: [ CommonModule, FormsModule ],
    declarations: [
        HeadingComponent, ModalComponent,
        MapToIterablePipe, SanitizeHTMLPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        HeadingComponent, ModalComponent,
        MapToIterablePipe, SanitizeHTMLPipe
    ]
})
export class SharedModule { }
