import { NgModule } from '@angular/core';
import { SharedModule} from '@awg-shared/shared.module';

import { FolioService } from './folio.service';

import { FolioComponent } from './folio.component';
import { FolioSvgGridComponent } from './folio-svg-grid/folio-svg-grid.component';


@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        FolioComponent,
        FolioSvgGridComponent
    ],
    exports: [ FolioComponent ],
    providers: [ FolioService ],
})
export class FolioModule { }
