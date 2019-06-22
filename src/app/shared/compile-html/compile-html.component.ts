/* tslint:disable:no-input-rename */
/* tslint:disable:component-selector */

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

import {
    Component,
    Input,
    Injectable,
    OnChanges,
    SimpleChanges,
    Type,
    ModuleWithProviders,
    NgModule,
    Compiler,
    NgModuleFactory
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { cloneDeep } from 'lodash';

/**
 * compileHtml.reverse(str)
 *
 * @param {string} str
 * @returns {string}
 */
const reverse = (str: string): string =>
    str
        .split('')
        .reverse()
        .join('');

/**
 * compileHtml.random()
 *
 * @returns {string}
 */
const random = (): string => {
    return (Math.floor(Math.random() * (99999999999999999 - 10000000000000000)) + 10000000000000000).toString(16);
};

/**
 * compileHtml.currentIdTime
 */
let currentIdTime: number;

/**
 * compileHtml.currentId
 */
let currentId = 0;

/**
 * compileHtml.nextId()
 *
 * @returns {string} A randomly generated id for the dynamic component's selector.
 */

const nextId = (): string => {
    const now = Date.now();
    if (currentIdTime !== now) {
        currentId = 0;
        currentIdTime = now;
    }
    const comingId = ++currentId;
    const randomHex = reverse(random()).padStart(15, '0');
    const timeHex = reverse(currentIdTime.toString(16).padStart(12, '0'));
    const comingIdHex = reverse(comingId.toString(16).padStart(3, '0'));
    const newId = `compile-html-${timeHex}${comingIdHex}${randomHex}`;
    return newId;
};

@Component({
    selector: '[compile-html]',
    template: `
        <ng-container *ngIf="html !== undefined && html !== null && html.trim() !== ''">
            <ng-container *ngComponentOutlet="dynamicComponent; ngModuleFactory: dynamicModule"></ng-container>
        </ng-container>
    `
})
@Injectable()
export class CompileHtmlComponent implements OnChanges {
    @Input('compile-html')
    html: string;
    @Input('compile-html-ref')
    ref: any;
    @Input('compile-html-error-handler')
    errorHandler: (ex: any) => void = console.error;
    @Input('compile-html-module')
    module: NgModule;
    @Input('compile-html-imports')
    imports: Array<Type<any> | ModuleWithProviders | any[]>;

    dynamicComponent: any;
    dynamicModule: NgModuleFactory<any> | any;

    constructor(private compiler: Compiler) {}

    ngOnChanges(changes: SimpleChanges) {
        this.update();
    }

    update() {
        try {
            if (this.html === undefined || this.html === null || this.html.trim() === '') {
                //            this.container.clear();
                this.dynamicComponent = undefined;
                this.dynamicModule = undefined;
                return;
            }

            this.dynamicComponent = this.createNewComponent(this.html, this.ref);
            this.dynamicModule = this.compiler.compileModuleSync(this.createComponentModule(this.dynamicComponent));
        } catch (e) {
            if (this.errorHandler === undefined) {
                throw e;
            } else {
                this.errorHandler(e);
            }
        }
    }

    private createComponentModule(componentType: any) {
        let module: NgModule = {};

        if (this.module !== undefined) {
            module = cloneDeep(this.module);
        }
        module.imports = module.imports || [];
        module.imports.push(CommonModule);
        if (this.imports !== undefined) {
            module.imports = module.imports.concat(this.imports);
        }
        if (module.declarations === undefined) {
            module.declarations = [componentType];
        } else {
            module.declarations.push(componentType);
        }
        module.entryComponents = [componentType];
        @NgModule(module)
        class RuntimeComponentModule {}
        return RuntimeComponentModule;
    }

    private createNewComponent(html: string, ref: any) {
        @Component({
            selector: nextId(),
            template: html
        })
        class DynamicComponent {
            ref: any = ref;
        }

        return DynamicComponent;
    }
}
