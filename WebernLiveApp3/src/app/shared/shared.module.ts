import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { AccordionModule } from 'ng2-bootstrap/accordion';

import { HeadingComponent } from './heading';

import { MapToIterablePipe } from './map-to-iterable';
import { SanitizeHTMLPipe } from './sanitize-html';

@NgModule({
    imports: [
        AccordionModule.forRoot(),
        CommonModule,
        FormsModule
    ],
    declarations: [
        HeadingComponent,
        MapToIterablePipe,
        SanitizeHTMLPipe
    ],
    exports: [
        AccordionModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        HeadingComponent,
        MapToIterablePipe,
        SanitizeHTMLPipe
    ]
})
export class SharedModule { }
