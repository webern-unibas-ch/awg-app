import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { HomeRoutingModule, routedHomeComponents } from './home-routing.module';

@NgModule({
  imports: [ SharedModule, HomeRoutingModule ],
  declarations: [ routedHomeComponents ]
})
export class HomeModule { }
