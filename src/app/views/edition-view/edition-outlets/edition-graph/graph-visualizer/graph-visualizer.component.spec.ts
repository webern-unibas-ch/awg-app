import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphVisualizerComponent } from './graph-visualizer.component';

describe('GraphVisualizerComponent', () => {
    let component: GraphVisualizerComponent;
    let fixture: ComponentFixture<GraphVisualizerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GraphVisualizerComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GraphVisualizerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
