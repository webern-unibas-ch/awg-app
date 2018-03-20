import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompileHtmlDirective } from './compile-html.directive';
import { CompileHtmlService } from './compile-html.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CompileHtmlDirective
    ],
    exports: [
        CompileHtmlDirective
    ]
})
export class CompileHtmlModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CompileHtmlModule,
            providers: [ CompileHtmlService ]
        };
    }
}
