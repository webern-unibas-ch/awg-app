import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { EditionDataService } from './edition-data.service';

describe('EditionDataService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let dataService: EditionDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EditionDataService]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        dataService = TestBed.get(EditionDataService);
    });

    it('should be created', () => {
        expect(dataService).toBeTruthy();
    });
});
