import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { PrefixPipe } from '../prefix-pipe/prefix.pipe';
import { GraphVisualizerService } from '../services/graph-visualizer.service';
import { Triple } from '../models';

import { ForceGraphComponent } from './force-graph.component';

describe('ForceGraphComponent', () => {
    let component: ForceGraphComponent;
    let fixture: ComponentFixture<ForceGraphComponent>;
    let graphVisualizerService: GraphVisualizerService;

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
        graphVisualizerService = TestBed.inject(GraphVisualizerService);
        fixture.detectChanges();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... should render node labels instead of raw qnames if rdfs:label is available', () => {
        const forceGraphFixture = TestBed.createComponent(ForceGraphComponent);
        const forceGraphComponent = forceGraphFixture.componentInstance;

        forceGraphComponent.currentQueryResultTriples = [
            {
                subject: 'https://edition.anton-webern.ch/webern-onto#M312_Sk1',
                predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
                object: 'M 312 Sk1 [A]',
            },
            {
                subject: 'https://edition.anton-webern.ch/webern-onto#M312_Sk1',
                predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                object: 'https://edition.anton-webern.ch/webern-onto#SketchEdition',
            },
        ] as Triple[];

        forceGraphFixture.detectChanges();

        const nodeTexts = Array.from(forceGraphFixture.nativeElement.querySelectorAll('text.node-text')).map(
            (text: SVGTextElement) => text.textContent?.trim()
        );

        expect(nodeTexts).toContain('M 312 Sk1 [A]');
        expect(nodeTexts).not.toContain('awg:M312_Sk1');
    });

    it('... should attach source type and location to clicked sheet and source nodes without rendering metadata triples', () => {
        const triples = [
            {
                subject: 'https://edition.anton-webern.ch/webern-onto#M312_Sk1',
                predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
                object: 'M 312 Sk1 [A]',
            },
            {
                subject: 'https://edition.anton-webern.ch/webern-onto#M312_Sk1',
                predicate: 'https://edition.anton-webern.ch/webern-onto#hasSource',
                object: 'https://edition.anton-webern.ch/webern-onto#source_A',
            },
            {
                subject: 'https://edition.anton-webern.ch/webern-onto#source_A',
                predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
                object: 'A',
            },
            {
                subject: 'https://edition.anton-webern.ch/webern-onto#source_A',
                predicate: 'https://edition.anton-webern.ch/webern-onto#sourceType',
                object: 'Skizzen (in: Skizzenbuch 3).',
            },
            {
                subject: 'https://edition.anton-webern.ch/webern-onto#source_A',
                predicate: 'https://edition.anton-webern.ch/webern-onto#sourceLocation',
                object: 'CH-Bps, Sammlung Anton Webern.',
            },
        ] as Triple[];

        const labelMap = graphVisualizerService.extractLabelsFromTriples(triples);
        const graphData = (component as any)._triplesToD3GraphData(triples, labelMap);
        const expectedSourceDetails = [
            {
                id: 'awg:source_A',
                label: 'A',
                type: 'Skizzen (in: Skizzenbuch 3).',
                location: 'CH-Bps, Sammlung Anton Webern.',
            },
        ];

        expect(graphData.nodes.find(node => node.id === 'awg:M312_Sk1')?.sourceDetails).toEqual(expectedSourceDetails);
        expect(graphData.nodes.find(node => node.id === 'awg:source_A')?.sourceDetails).toEqual(expectedSourceDetails);
        expect(graphData.nodeTriples.some(nodeTriple => nodeTriple.nodePredicate.id === 'awg:sourceType')).toBeFalse();
        expect(graphData.nodeTriples.some(nodeTriple => nodeTriple.nodePredicate.id === 'awg:sourceLocation')).toBeFalse();
    });
});
