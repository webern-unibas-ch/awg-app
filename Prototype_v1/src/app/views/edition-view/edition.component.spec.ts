/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditionViewComponent } from './edition.component';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditionViewComponent', () => {
    let component: EditionViewComponent;
    let fixture: ComponentFixture<EditionViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [EditionViewComponent, HeadingComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
