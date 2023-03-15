import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { PrefixPipe } from '../prefix-pipe/prefix.pipe';
import { GraphVisualizerService } from '../services/graph-visualizer.service';

import { ForceGraphComponent } from './force-graph.component';

describe('ForceGraphComponent', () => {
    let component: ForceGraphComponent;
    let fixture: ComponentFixture<ForceGraphComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, FormsModule],
            declarations: [ForceGraphComponent, PrefixPipe],
            providers: [GraphVisualizerService, PrefixPipe],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForceGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });
});
