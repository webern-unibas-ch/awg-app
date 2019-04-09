import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { StructureRoutingModule, routedComponents } from './structure-routing.module';

@NgModule({
    imports: [SharedModule, StructureRoutingModule],
    declarations: [routedComponents]
})
export class StructureModule {}
