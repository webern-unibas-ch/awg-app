import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
    imports:        [ RouterModule, SharedModule ],
    declarations:   [ FooterComponent, NavbarComponent, SidenavComponent ],
    exports:        [ FooterComponent, NavbarComponent, SidenavComponent ]
})
export class FrameworkModule { }
