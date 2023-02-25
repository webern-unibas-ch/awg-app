import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { BibliographyFormatPipe } from './bibliography-format.pipe';
import { BibliographyListComponent } from './bibliography-list/bibliography-list.component';
import { BibliographySearchComponent } from './bibliography-search/bibliography-search.component';

/* Routing Module */
import { BibliographyRoutingModule, routedBibliographyComponents } from './bibliography-routing.module';

/**
 * The bibliography module.
 *
 * It embeds the bibliography components and their [routing definition]{@link BibliographyRoutingModule},
 * the {@link BibliographySearchComponent}, {@link BibliographyListComponent}, {@link BibliographyFormatPipe}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, BibliographyRoutingModule],
    declarations: [
        routedBibliographyComponents,
        BibliographySearchComponent,
        BibliographyListComponent,
        BibliographyFormatPipe,
    ],
    exports: [
        routedBibliographyComponents,
        BibliographySearchComponent,
        BibliographyListComponent,
        BibliographyFormatPipe,
    ],
})
export class BibliographyModule {}
