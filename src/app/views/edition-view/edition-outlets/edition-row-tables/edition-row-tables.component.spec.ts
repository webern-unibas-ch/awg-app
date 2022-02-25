import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionRowTablesComponent } from './edition-row-tables.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

describe('EditionRowTablesComponent', () => {
    let component: EditionRowTablesComponent;
    let fixture: ComponentFixture<EditionRowTablesComponent>;
    let compDe: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [EditionRowTablesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionRowTablesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
