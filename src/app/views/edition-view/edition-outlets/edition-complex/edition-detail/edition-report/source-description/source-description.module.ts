import { NgModule } from '@angular/core';

import { SourceDescComponent } from './source-desc.component';

/**
 * The source description module.
 *
 * It embeds and exports the standalone {@link SourceDescComponent}.
 */
@NgModule({
    imports: [SourceDescComponent],
    exports: [SourceDescComponent],
})
export class SourceDescriptionModule {}
