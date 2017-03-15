import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { HeadingComponent } from './heading';
import { ModalComponent } from './modal';

import { MapToIterablePipe } from './map-to-iterable';
import { SanitizeHTMLPipe } from './sanitize-html';

@NgModule({
    imports: [ CommonModule, FormsModule ],
    declarations: [
        HeadingComponent, ModalComponent,
        MapToIterablePipe, SanitizeHTMLPipe
    ],
    exports: [
        CommonModule, FormsModule, MaterialModule,
        HeadingComponent, ModalComponent,
        MapToIterablePipe, SanitizeHTMLPipe
    ]
})
export class SharedModule { }
