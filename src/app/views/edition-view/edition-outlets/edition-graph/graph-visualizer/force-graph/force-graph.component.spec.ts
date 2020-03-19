import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PrefixPipe } from '../prefix-pipe/prefix.pipe';
import { GraphVisualizerService } from '../services/graph-visualizer.service';

import { ForceGraphComponent } from './force-graph.component';

describe('ForceGraphComponent', () => {
    let component: ForceGraphComponent;
    let fixture: ComponentFixture<ForceGraphComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [ForceGraphComponent, PrefixPipe],
            providers: [GraphVisualizerService, PrefixPipe]
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
