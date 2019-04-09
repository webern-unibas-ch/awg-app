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

import { ViewContainerRef } from '@angular/core';

export interface CompileHtmlModel {
    template: string;
    container: ViewContainerRef;
    imports?: any[];
    ref?: any;
}
