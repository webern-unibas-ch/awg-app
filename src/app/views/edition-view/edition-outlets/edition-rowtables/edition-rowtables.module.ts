import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionRowtablesRoutingModule, routedEditionRowtablesComponents } from './edition-rowtables-routing.module';

/**
 * The EditionRowtables module.
 *
 * It embeds the {@link EditionRowtablesComponent} and its
 * [routing definition]{@link EditionRowtablesRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionRowtablesRoutingModule],
    declarations: [routedEditionRowtablesComponents],
})
export class EditionRowtablesModule {}
