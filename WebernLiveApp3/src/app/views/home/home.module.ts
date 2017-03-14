import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { HomeRoutingModule, routedHomeComponents } from './home-routing.module';
import { HomeStructureComponent } from './home-structure/home-structure.component';

@NgModule({
  imports: [ SharedModule, HomeRoutingModule ],
  declarations: [ routedHomeComponents, HomeStructureComponent ]
})
export class HomeModule { }
