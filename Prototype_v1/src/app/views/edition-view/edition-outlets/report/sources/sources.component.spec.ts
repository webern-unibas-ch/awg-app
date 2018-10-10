/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SourcesComponent } from './sources.component';

describe('SourcesComponent', () => {
    let component: SourcesComponent;
    let fixture: ComponentFixture<SourcesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SourcesComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourcesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
