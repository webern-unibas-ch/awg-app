import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

/* Routing Module */
import { StructureViewRoutingModule, routedStructureViewComponents } from './structure-view-routing.module';

/**
 * The structureView module.
 *
 * It embeds the {@link StructureViewComponent} and its
 * [routing definition]{@link StructureViewRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, StructureViewRoutingModule],
    declarations: [routedStructureViewComponents],
})
export class StructureViewModule {}
