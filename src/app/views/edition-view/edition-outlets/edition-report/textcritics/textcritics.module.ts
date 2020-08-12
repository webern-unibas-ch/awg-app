import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';
import { EditionTkaTableModule } from '../../edition-tka-table/edition-tka-table.module';

import { CriticsListComponent } from './critics-list';
import { TextcriticsComponent } from './textcritics.component';

/**
 * The EditionTextcritics module.
 *
 * It embeds the textcritics components as well as the
 * {@link SharedModule} and {@link EditionTkaTableModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaTableModule],
    declarations: [CriticsListComponent, TextcriticsComponent],
    exports: [CriticsListComponent, TextcriticsComponent]
})
export class TextcriticsModule {}
