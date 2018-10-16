/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditionSvgFileNavComponent } from './edition-svg-file-nav.component';

describe('EditionSvgFileNavComponent', () => {
    let component: EditionSvgFileNavComponent;
    let fixture: ComponentFixture<EditionSvgFileNavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionSvgFileNavComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgFileNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
