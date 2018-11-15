/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppModule } from '@awg-app/app.module';
import { AppRoutingModule } from '@awg-app/app-routing.module';
import { ApiService } from './api.service';

describe('ApiService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let apiService: ApiService;

    // TODO: add APP_BASE_HREF , see https://angular.io/api/common/APP_BASE_HREF

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, AppRoutingModule, HttpClientTestingModule, RouterTestingModule],
            providers: [ApiService]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        apiService = TestBed.get(ApiService);
    });

    it('should inject', inject([ApiService], (service: ApiService) => {
        expect(service).toBeTruthy();
    }));
});
