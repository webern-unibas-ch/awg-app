/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DataViewComponent } from './data.component';

describe('DataViewComponent', () => {
    let component: DataViewComponent;
    let fixture: ComponentFixture<DataViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DataViewComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
