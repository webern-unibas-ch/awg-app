import { TestBed } from '@angular/core/testing';

import { GraphVisualizerService } from './graph-visualizer.service';

describe('GraphVisualizerService', () => {
    let graphVisualizerService: GraphVisualizerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GraphVisualizerService],
        });
        graphVisualizerService = TestBed.inject(GraphVisualizerService);
    });

    it('should be created', () => {
        expect(graphVisualizerService).toBeTruthy();
    });
});
