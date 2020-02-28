import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceGraphComponent } from './force-graph.component';

describe('SparqlGraphComponent', () => {
    let component: ForceGraphComponent;
    let fixture: ComponentFixture<ForceGraphComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ForceGraphComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForceGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
