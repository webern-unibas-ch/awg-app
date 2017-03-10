/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FooterComponent } from './footer.component';
import { MetaData } from '../metadata';

import { RouterLinkStubDirective }   from '../../../testing';
import { RouterOutletStubComponent } from '../../../testing';

describe('FooterComponent', () => {

    let comp: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FooterComponent,
                RouterLinkStubDirective
            ]
        });
        TestBed.compileComponents(); // compile template and css
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        comp = fixture.componentInstance;

        // pretend that it was wired to something that supplied a metaData
        let expectedMeta = new MetaData();
        comp.meta = expectedMeta;

        // trigger initial data binding
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(comp).toBeTruthy();
    });

    it('should have meta after input', () => {
        expect(comp.meta).toBeDefined();
    });

});
