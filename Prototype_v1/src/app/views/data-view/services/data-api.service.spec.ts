/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { DataApiService } from './data-api.service';

describe('DataApiService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let dataApiService: DataApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DataApiService]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        dataApiService = TestBed.get(DataApiService);
    });

    it('should be created', inject([DataApiService], (service: DataApiService) => {
        expect(service).toBeTruthy();
    }));
});
