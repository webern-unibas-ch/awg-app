import { NgModule } from '@angular/core';
import { SharedModule} from '@awg-shared/shared.module';

import { FolioComponent } from './folio.component';


@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        FolioComponent
    ],
    exports: [ FolioComponent ]
})
export class FolioModule { }
