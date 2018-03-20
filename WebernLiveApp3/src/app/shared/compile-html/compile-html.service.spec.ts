import { TestBed, inject } from '@angular/core/testing';

import { CompileHtmlService } from './compile-html.service';

describe('CompileHtmlService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CompileHtmlService]
        });
    });

    it('should ...', inject([CompileHtmlService], (service: CompileHtmlService) => {
        expect(service).toBeTruthy();
    }));
});
