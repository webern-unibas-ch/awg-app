import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { FooterComponent } from './footer.component';
import { FooterLogoComponent } from './footer-logo/footer-logo.component';
import { FooterTextComponent } from './footer-text/footer-text.component';

@NgModule({
    imports: [SharedModule],
    declarations: [FooterComponent, FooterLogoComponent, FooterTextComponent],
    exports: [FooterComponent]
})
export class FooterModule {}
