import { TestBed } from '@angular/core/testing';

import { GraphVisualizerService } from './graph-visualizer.service';
import { PrefixPipe } from '../prefix-pipe/prefix.pipe';

describe('GraphVisualizerService', () => {
    let graphVisualizerService: GraphVisualizerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GraphVisualizerService, PrefixPipe],
        });
        graphVisualizerService = TestBed.inject(GraphVisualizerService);
    });

    it('should be created', () => {
        expect(graphVisualizerService).toBeTruthy();
    });
});
