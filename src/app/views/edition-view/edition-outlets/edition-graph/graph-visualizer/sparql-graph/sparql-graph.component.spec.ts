import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparqlGraphComponent } from './sparql-graph.component';

describe('SparqlGraphComponent', () => {
    let component: SparqlGraphComponent;
    let fixture: ComponentFixture<SparqlGraphComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SparqlGraphComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
