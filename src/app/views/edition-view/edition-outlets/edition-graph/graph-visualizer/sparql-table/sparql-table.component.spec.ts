import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { SparqlTableComponent } from './sparql-table.component';

describe('SparqlTableComponent', () => {
    let component: SparqlTableComponent;
    let fixture: ComponentFixture<SparqlTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbPaginationModule],
            declarations: [SparqlTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlTableComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
