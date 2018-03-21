import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { BibliographySearchComponent } from './bibliography-search/bibliography-search.component';
import { BibliographyListComponent } from './bibliography-list/bibliography-list.component';
import { BibliographyFormatPipe } from './bibliography-format.pipe';

import { BibliographyService } from '../../services';


@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        BibliographySearchComponent,
        BibliographyListComponent,
        BibliographyFormatPipe
    ],
    providers: [ BibliographyService ]
    exports: [
        BibliographySearchComponent,
        BibliographyListComponent,
        BibliographyFormatPipe
    ]
})
export class BibliographyModule { }
