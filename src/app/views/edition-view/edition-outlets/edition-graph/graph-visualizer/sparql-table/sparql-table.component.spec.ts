import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparqlTableComponent } from './sparql-table.component';

describe('SparqlTableComponent', () => {
    let component: SparqlTableComponent;
    let fixture: ComponentFixture<SparqlTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SparqlTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
