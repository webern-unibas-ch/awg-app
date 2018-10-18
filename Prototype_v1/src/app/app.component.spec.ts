/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterLinkStubDirective, RouterOutletStubComponent } from 'testing/router-stubs';

import { AppComponent } from './app.component';
import { FooterComponent } from './core/footer/footer.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { EditionInfoComponent } from './side-info/edition-info/edition-info.component';

import { MetaService } from '@awg-core/services';

import { Component, DebugElement, Input } from '@angular/core';
import { ResourceDetailHeader } from '@awg-views/data-view/models';
import { Meta } from '@awg-core/core-models';
import { HomeViewComponent } from '@awg-views/home-view/home-view.component';

// mock components
@Component({ selector: 'awg-navbar', template: '' })
class NavbarStubComponent {}

@Component({ selector: 'awg-footer', template: '' })
class FooterStubComponent {
    @Input()
    meta: Meta;
}

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockMetaService: Partial<MetaService>;

    let expectedMetaData: Meta;

    beforeEach(async(() => {
        // stub service for test purposes
        mockMetaService = { getMetaData: () => expectedMetaData };

        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                FooterStubComponent,
                NavbarStubComponent,
                EditionInfoComponent,
                RouterLinkStubDirective,
                RouterOutletStubComponent
            ],
            providers: [MetaService]
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test meta data
        expectedMetaData = {
            page: { yearStart: null, yearRecent: null, version: '', versionReleaseDate: '' },
            edition: { editors: 'Test Editor 1', lastModified: '9. Oktober 2018' },
            structure: { author: '', lastModified: '' }
        };

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
    });

    it('should create the app', async(() => {
        expect(component).toBeTruthy();
    }));
});
