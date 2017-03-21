/************************************************
 *
 *               CREDITS
 *
 * This code is inspired, adapted or taken from:
 *
 * [**P3X-NG2-COMPILE-HTML**](https://patrikx3.github.com/ng2-compile-html) Build v1.1.132-230 on 3/17/2017, 7:43:58 PM
 * [Corifeus](http://github.com/patrikx3/corifeus) by [Patrik Laszlo](http://patrikx3.tk)
 *
 *
 ************************************************/

import { Directive, ElementRef, Input, Injectable, ViewContainerRef, OnInit, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';

import { CompileHtmlModel } from './compile-html.model';
import { CompileHtmlService } from './compile-html.service';

@Directive({
  selector: '[compile-html]'
})
export class CompileHtmlDirective implements OnInit, OnChanges {

    @Input('compile-html') html: string;
    @Input('compile-html-ref') compileHtmlRef: any;
    @Input('compile-html-imports') compileHtmlImports: any[];

    constructor(
        private container: ViewContainerRef,
        private service: CompileHtmlService,
        private templateRef: TemplateRef<any>
    ) { }

    ngOnInit() {
        this.update();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.update();
    }

    update() {
        let compileModel: CompileHtmlModel = {
            template: this.html,
            container: this.container,
            ref: this.compileHtmlRef,
            imports: this.compileHtmlImports
        };
        this.service.compile(compileModel);
    }


}
