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

import { Component, Input, Injectable, OnInit, OnChanges, SimpleChanges, Type, ModuleWithProviders, NgModule, Compiler, NgModuleFactory } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

//import { CompileService } from './CompileService';
let SingletonDefaultModule: NgModule;

import { cloneDeep } from 'lodash';

//const cache : any = {};
@Component({
    selector: '[compile-html]',
    template: `
        <span *ngIf="html !== undefined && html !== null && html.trim() !== '' && dynamicComponent !== undefined && dynamicModule !== undefined">
        <ng-container *ngComponentOutlet="dynamicComponent;
                            ngModuleFactory: dynamicModule;"></ng-container>
        </span>
    `
})
@Injectable()
export class CompileHtmlAttribute implements OnInit, OnChanges{

    @Input('compile-html') html: string;
    @Input('compile-html-ref') ref:  any;
    @Input('compile-html-error-handler') errorHandler: (ex: any) => void = console.error;

    dynamicComponent: any;
    dynamicModule: NgModuleFactory<any> | any;

    @Input('compile-html-module') module:  NgModule;
    @Input('compile-html-imports') imports: Array<Type<any> | ModuleWithProviders | any[]>;

    async update() {
        if (this.html === undefined || this.html.trim() === '') {
//            this.container.clear();
            this.dynamicComponent = undefined;
            this.dynamicModule = undefined;
            return;
        }
        /*
                const cacheKey = this.html;
                if (Object.keys(cache).indexOf(cacheKey) > -1) {
                    return cache[cacheKey];
                }
        */
        try {
            this.dynamicComponent = this.createNewComponent(this.html, this.ref);
            this.dynamicModule = this.compiler.compileModuleSync(this.createComponentModule(this.dynamicComponent));
//            cache[cacheKey] = this.dynamicComponent;
        } catch (e) {
            this.errorHandler(e);
        }
        /*
        await this.service.compile({
            template: this.html,
            container: this.container,
            ref: this.ref,
            imports: this.imports,
            module: this.module
        })
        */
    }

    private createComponentModule (componentType: any) {
        let module : NgModule = {};

        if (this.module !== undefined) {
            module = cloneDeep(this.module);
        } else if (SingletonDefaultModule !== undefined && SingletonDefaultModule !== null) {
            module = cloneDeep(SingletonDefaultModule);
        }
        module.imports = module.imports || [];
        module.imports.push( CommonModule );
//        module.imports.push( BrowserModule );
        if (this.imports !== undefined) {
            module.imports = module.imports.concat(this.imports)
        }
        if (module.declarations === undefined) {
            module.declarations = [
                componentType
            ];
        } else {
            module.declarations.push(componentType);
        }
        module.entryComponents = [
            componentType
        ];
        @NgModule(module)
        class RuntimeComponentModule {
        }
        return RuntimeComponentModule;
    }


    private createNewComponent (html:string, ref: any) {

        @Component({
            selector: 'dynamic-component',
            template: html
        })
        class DynamicComponent {
            ref: any = ref;
        }

        return DynamicComponent;
    }

    async ngOnInit() {
        this.update();
    }

    async ngOnChanges(changes: SimpleChanges) {
        //fixme only update with the required changes
        this.update();
    }

    constructor(
//      private container: ViewContainerRef,
//      private service: CompileService
        private compiler: Compiler
    ) {}
}
