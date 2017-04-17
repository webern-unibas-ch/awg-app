import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ng2-bootstrap/accordion';

import { CompileHtmlModule } from './compile-html';

import { HeadingComponent } from './heading';
import { MapToIterablePipe } from './map-to-iterable';
import { SanitizeHTMLPipe } from './sanitize-html';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AccordionModule.forRoot(),
        CompileHtmlModule.forRoot()
    ],
    declarations: [
        HeadingComponent,
        MapToIterablePipe,
        SanitizeHTMLPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        AccordionModule,
        CompileHtmlModule,
        HeadingComponent,
        MapToIterablePipe,
        SanitizeHTMLPipe
    ]
})
export class SharedModule { }
