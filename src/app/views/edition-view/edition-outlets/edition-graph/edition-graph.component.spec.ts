import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionGraphComponent } from './edition-graph.component';

describe('EditionGraphComponent', () => {
    let component: EditionGraphComponent;
    let fixture: ComponentFixture<EditionGraphComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionGraphComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
