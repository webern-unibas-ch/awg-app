import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { DataService } from './data.service';

describe('DataService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let dataService: DataService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DataService]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        dataService = TestBed.get(DataService);
    });

    it('should be created', () => {
        expect(dataService).toBeTruthy();
    });
});
