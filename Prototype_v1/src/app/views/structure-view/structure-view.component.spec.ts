/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StructureViewComponent } from './structure-view.component';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('StructureViewComponent', () => {
    let component: StructureViewComponent;
    let fixture: ComponentFixture<StructureViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [StructureViewComponent, HeadingComponent]
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
