import { NgModule } from '@angular/core';
import { SharedModule} from '@awg-shared/shared.module';

import { FolioService } from './folio.service';

import { FolioComponent } from './folio.component';


@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        FolioComponent
    ],
    exports: [ FolioComponent ],
    providers: [ FolioService ],
})
export class FolioModule { }
