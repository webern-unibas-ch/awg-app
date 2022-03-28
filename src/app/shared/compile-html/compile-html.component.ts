/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/component-selector */

/**
 * **********************************************
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
    NgModuleFactory,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { cloneDeep } from 'lodash';

/**
 * Function: compileHtml.reverse(str)
 *
 * @param {string} str
 * @returns {string}
 */
const reverse = (str: string): string => str.split('').reverse().join('');

/**
 * Function: compileHtml.random()
 *
 * @returns {string}
 */
const random = (): string => {
    const crypto = window.crypto || (<any>window).msCrypto;
    const array = new Uint32Array(1);

    return Math.floor(crypto.getRandomValues(array)[0]).toString(16);
};

/**
 * Variable: compileHtml.currentIdTime
 */
let currentIdTime: number;

/**
 * Variable: compileHtml.currentId
 */
let currentId = 0;

/**
 * Function: compileHtml.nextId()
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
    const timeHex = reverse(currentIdTime.toString(16).padStart(12, '0'));
    const comingIdHex = reverse(comingId.toString(16).padStart(3, '0'));
    const randomHex = reverse(random()).padStart(8, '0');
    return `compile-html-${timeHex}${comingIdHex}${randomHex}`;
};

/**
 * The CompileHtml component.
 *
 * It is declared as a Component, but used like a directive.
 * It allows the dynamic creation of a component and is needed
 * for the secondary compilation of HTML code.
 *
 * It does not allow for AOT compilation so far.
 *
 * Idea, code and usage is inspired, adapted or taken from:
 * * [**patrikx3-angular-compile**](https://github.com/patrikx3/angular-compile) Build v1.1.113-149 on 02/26/2017, 7:43:58 PM
 * [Corifeus](http://github.com/patrikx3/corifeus) by [Patrik Laszlo](http://patrikx3.tk)
 *
 * Provided in: `root`.
 */
@Component({
    selector: '[compile-html]',
    template: `
        <ng-container *ngIf="html !== undefined && html !== null && html.trim() !== ''">
            <ng-container *ngComponentOutlet="dynamicComponent; ngModuleFactory: dynamicModule"></ng-container>
        </ng-container>
    `,
})
@Injectable()
export class CompileHtmlComponent implements OnChanges {
    /**
     * Input variable: compile-html.
     *
     * It keeps the html template for the dynamic component.
     */
    @Input('compile-html')
    html: string;

    /**
     * Input variable: compile-html-ref.
     *
     * It keeps the reference to the dynamic component.
     */
    @Input('compile-html-ref')
    ref: any;

    /**
     * Input variable: compile-html-error-handler.
     *
     * It keeps the custom error handler for the dynamic component.
     */
    @Input('compile-html-error-handler')
    errorHandler: (ex: any) => void = console.error;

    /**
     * Input variable: compile-html-module.
     *
     * It keeps the custom module for the dynamic component.
     */
    @Input('compile-html-module')
    module: NgModule;

    /**
     * Input variable: compile-html-imports.
     *
     * It keeps the custom imports for the dynamic component.
     */
    @Input('compile-html-imports')
    imports: Array<Type<any> | ModuleWithProviders<any> | any[]>;

    /**
     * Public variable: dynamicComponent.
     *
     * It keeps the component that is to be created dynamically.
     */
    dynamicComponent: any;

    /**
     * Public variable: dynamicModule.
     *
     * It keeps the module declarations for the component that is to be created dynamically.
     */
    dynamicModule: NgModuleFactory<any> | any;

    /**
     * Constructor of the CompileHtmlComponent.
     *
     * It declares a private {@link Compiler}
     * instance for the dynamic compilation of a given component.
     *
     * @param {Compiler} compiler Instance of the Compiler.
     */
    constructor(private compiler: Compiler) {}

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     *
     * @param {SimpleChanges} changes The changes of the input.
     */
    ngOnChanges(changes: SimpleChanges) {
        this.update();
    }

    /**
     * Public method: update.
     *
     * It updates the [dynamicComponent]{@link CompileHtmlComponent#dynamicComponent}
     * and [dynamicModule]{@link CompileHtmlComponent#dynamicModule}
     * and triggers their creation methods.
     *
     * @returns {void} The new dynamic component and its module.
     */
    update(): void {
        try {
            if (this.html === undefined || this.html === null || this.html.trim() === '') {
                this.dynamicComponent = undefined;
                this.dynamicModule = undefined;
                return;
            }

            this.dynamicComponent = this._createNewComponent(this.html, this.ref);
            this.dynamicModule = this.compiler.compileModuleSync(this._createComponentModule(this.dynamicComponent));
        } catch (e) {
            if (this.errorHandler === undefined) {
                throw e;
            } else {
                this.errorHandler(e);
            }
        }
    }

    /**
     * Private method: _createComponentModule.
     *
     * It creates the module for the dynamic component.
     *
     * @params {*} componentType The component type to be created.
     *
     * @returns The RuntimeComponentModule.
     */
    private _createComponentModule(componentType: any) {
        let module: NgModule = { imports: [], declarations: [] };

        if (this.module !== undefined) {
            module = cloneDeep(this.module);
        }
        module.imports = module.imports || [];
        module.imports.push(CommonModule);
        if (this.imports !== undefined) {
            module.imports = module.imports.concat(this.imports);
        }
        module.declarations.push(componentType);

        @NgModule({ imports: module.imports, declarations: module.declarations })
        class RuntimeComponentModule {}
        return RuntimeComponentModule;
    }

    /**
     * Private method: _createNewComponent.
     *
     * It creates the the dynamic component.
     *
     * @params {string} html The given html template for the component.
     * @params {*} ref The reference to the component type to be created.
     *
     * @returns The DynamicComponent.
     */
    private _createNewComponent(html: string, ref: any) {
        @Component({
            selector: nextId(),
            template: html,
        })
        class DynamicComponent {
            ref: any = ref;
        }

        return DynamicComponent;
    }
}
