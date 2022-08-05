import { TestBed } from '@angular/core/testing';

import { EditionSvgDrawingService } from './edition-svg-drawing.service';

describe('EditionSvgDrawingService', () => {
    let service: EditionSvgDrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EditionSvgDrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
