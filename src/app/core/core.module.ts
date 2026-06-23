import { NgModule, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SharedModule } from '@awg-shared/shared.module';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ViewContainerComponent } from './view-container/view-container.component';

import { httpInterceptorProviders } from './interceptors';

@NgModule({
    imports: [SharedModule, FooterComponent],
    declarations: [NavbarComponent, ViewContainerComponent],
    exports: [NavbarComponent, ViewContainerComponent, FooterComponent],
    providers: [httpInterceptorProviders, Title],
})
export class CoreModule {
    constructor() {
        const parentModule = inject(CoreModule, { optional: true, skipSelf: true });

        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
