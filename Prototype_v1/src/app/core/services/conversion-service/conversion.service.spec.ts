/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';

import { AppModule } from '../../../app.module';
import { AppRoutingModule } from '../../../app-routing.module';

import { ApiService } from '../api-service/api.service';
import { ConversionService } from './conversion.service';

describe('ConversionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
                AppRoutingModule
            ],
            providers: [
                ApiService,
                ConversionService
            ]
        });
    });

    it('should ...', inject([ConversionService], (service: ConversionService) => {
        expect(service).toBeTruthy();
    }));
});
