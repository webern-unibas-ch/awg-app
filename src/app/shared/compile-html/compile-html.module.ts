/************************************************
 *
 *               CREDITS
 *
 * This code is inspired, adapted or taken from:
 *
 * [**patrikx3-angular-compile**](https://github.com/patrikx3/angular-compile) Build v1.1.113-149 on 02/26/2017, 7:43:58 PM
 * [Corifeus](http://github.com/patrikx3/corifeus) by [Patrik Laszlo](http://patrikx3.tk)
 *
 *
 ************************************************/

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompileHtmlComponent } from './compile-html.component';

export class CompileServiceConfig {
    module: NgModule;
}

// exports = component
@NgModule({
    imports: [CommonModule],
    declarations: [CompileHtmlComponent],
    exports: [CompileHtmlComponent],
    entryComponents: []
})
export class CompileHtmlModule {
    static forRoot(config: CompileServiceConfig): ModuleWithProviders {
        return {
            ngModule: CompileHtmlModule,
            providers: [{ provide: CompileServiceConfig, useValue: config }]
        };
    }
}
