import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { FooterComponent } from './footer.component';
import { FooterCopyrightComponent } from './footer-copyright/footer-copyright.component';
import { FooterDeclarationComponent } from './footer-declaration/footer-declaration.component';
import { FooterLogoComponent } from './footer-logo/footer-logo.component';
import { FooterPoweredbyComponent } from './footer-poweredby/footer-poweredby.component';

@NgModule({
    imports: [SharedModule],
    declarations: [
        FooterComponent,
        FooterCopyrightComponent,
        FooterDeclarationComponent,
        FooterLogoComponent,
        FooterPoweredbyComponent
    ],
    exports: [FooterComponent]
})
export class FooterModule {}
