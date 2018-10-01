import { NgModule } from '@angular/core';
import { SharedModule} from '@awg-shared/shared.module';

import { EditionTkaTableComponent } from './edition-tka-table.component';


@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        EditionTkaTableComponent
    ],
    exports: [ EditionTkaTableComponent ]
})
export class EditionTkaTableModule { }
