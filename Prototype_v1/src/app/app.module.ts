import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

//
// main app modules & routes
import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';
import { CoreModule } from '@awg-core/core.module';
import { SharedModule } from '@awg-shared/shared.module';
import { SideInfoModule } from '@awg-side-info/side-info.module';

@NgModule({
    imports: [BrowserModule, HttpClientModule, CoreModule, SharedModule, SideInfoModule, AppRoutingModule],
    declarations: [AppComponent, routedComponents],
    bootstrap: [AppComponent]
})
export class AppModule {}
