/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StructureViewComponent } from './structure-view.component';

describe('StructureViewComponent', () => {
    let component: StructureViewComponent;
    let fixture: ComponentFixture<StructureViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StructureViewComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StructureViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
