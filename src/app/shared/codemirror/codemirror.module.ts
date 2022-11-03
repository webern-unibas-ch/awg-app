/** **********************************************
 *
 *               Codemirror.module.ts
 *
 * This code is inspired, adapted or taken from:
 *
 * @robotocoral/ngx-codemirror6 repository
 * https://github.com/robotcoral/ngx-codemirror6/blob/main/src/codemirror.module.ts
 * Version 0.0.5, 29.8.2021
 *
 ************************************************/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeMirrorComponent } from './codemirror.component';

/**
 * The CodeMirror module.
 *
 * It embeds all the components used for the CodeMirror editor.
 */
@NgModule({
    imports: [CommonModule],
    declarations: [CodeMirrorComponent],
    exports: [CodeMirrorComponent],
})
export class CodeMirrorModule {}
