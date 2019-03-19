import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { ContactRoutingModule, routedComponents } from './contact-routing.module';

@NgModule({
    imports: [SharedModule, ContactRoutingModule],
    declarations: [routedComponents]
})
export class ContactModule {}
