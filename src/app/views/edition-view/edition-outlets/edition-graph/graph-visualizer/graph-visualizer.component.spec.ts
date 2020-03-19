import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { D3SimulationNode, Triple } from './models';
import { GraphVisualizerService } from './services/graph-visualizer.service';

import { GraphVisualizerComponent } from './graph-visualizer.component';
import { GraphRDFData } from '@awg-views/edition-view/models';

// mock components
@Component({ selector: 'awg-force-graph', template: '' })
class ForceGraphStubComponent {
    @Input() queryResultTriples: Triple[];
    @Input() height: number;
    @Output() clickedNodeRequest = new EventEmitter<D3SimulationNode>();
}

@Component({ selector: 'awg-force-graph-no-result', template: '' })
class ForceGraphNoResultStubComponent {
    @Input() height: number;
}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('GraphVisualizerComponent', () => {
    let component: GraphVisualizerComponent;
    let fixture: ComponentFixture<GraphVisualizerComponent>;

    let expectedGraphRDFData: GraphRDFData;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, NgbAccordionModule],
            declarations: [
                GraphVisualizerComponent,
                ForceGraphStubComponent,
                ForceGraphNoResultStubComponent,
                TwelveToneSpinnerStubComponent,
                CodemirrorComponent
            ],
            providers: [GraphVisualizerService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GraphVisualizerComponent);
        component = fixture.componentInstance;

        // test data
        expectedGraphRDFData = {
            query: 'CONSTRUCT \n WHERE { \n\t ?nodeA ?edge ?nodeB \n }',
            triples: '@prefix dc: <http://purl.org/dc/elements/1.1/> .\n\n w:Author1 dc:creator w:Test1 .'
        };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.graphRDFInputData = expectedGraphRDFData;

            // trigger initial data binding
            fixture.detectChanges();
        });
    });
});
