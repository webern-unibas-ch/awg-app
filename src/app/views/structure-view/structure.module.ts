import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

/* Routing Module */
import { StructureRoutingModule, routedStructureComponents } from './structure-routing.module';

/**
 * The structure module.
 *
 * It embeds the {@link StructureViewComponent} and its
 * [routing definition]{@link StructureRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, StructureRoutingModule],
    declarations: [routedStructureComponents]
})
export class StructureModule {}
