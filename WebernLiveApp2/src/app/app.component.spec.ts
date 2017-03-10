/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';

import { AppComponent } from './app.component';

import { FooterComponent } from './core/footer/footer.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { SidenavComponent } from './core/sidenav/sidenav.component';

import { RouterLinkStubDirective }   from '../testing';
import { RouterOutletStubComponent } from '../testing';

describe('AppComponent', () => {
    beforeEach( async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                FooterComponent, NavbarComponent, SidenavComponent,
                RouterLinkStubDirective, RouterOutletStubComponent
                /*
                FooterStubComponent, NavbarStubComponent, SidenavStubComponent
                */
            ],
        });
        TestBed.compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

});
