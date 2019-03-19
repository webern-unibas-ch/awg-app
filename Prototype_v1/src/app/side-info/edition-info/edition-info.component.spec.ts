/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { EditionInfoComponent } from './edition-info.component';
import { RouterLinkStubDirective } from 'testing/router-stubs';

describe('EditionInfoComponent', () => {
    let component: EditionInfoComponent;
    let fixture: ComponentFixture<EditionInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionInfoComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
