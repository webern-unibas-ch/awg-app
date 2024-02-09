/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Observable, of as observableOf } from 'rxjs';

import { ConversionService } from '@awg-core/services';
import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { BibliographyService } from '@awg-views/data-view/services';

import { BibEntry } from '../bibliography-entry.model';
import { BibliographyFormatPipe } from '../bibliography-format.pipe';
import { BibliographyDetailComponent } from './bibliography-detail.component';

describe('BibliographyDetailComponent', () => {
    let component: BibliographyDetailComponent;
    let fixture: ComponentFixture<BibliographyDetailComponent>;

    let mockConversionService: Partial<ConversionService>;
    let getBibliographyListSpy: Observable<ResourceFullResponseJson>;

    let expectedObjId: string;
    let expectedBibItemDetailBody: ResourceFullResponseJson;
    let expectedConvertedBibItemDetail: BibEntry;

    beforeEach(waitForAsync(() => {
        // Create a fake bibliography service object with a `getBibliographyItemDetail()` spy
        const mockBibliographyService = jasmine.createSpyObj('BibliographyService', ['getBibliographyItemDetail']);
        // Make the spies return a synchronous Observable with the test data
        expectedBibItemDetailBody = new ResourceFullResponseJson();
        getBibliographyListSpy = mockBibliographyService.getBibliographyItemDetail.and.returnValue(
            observableOf(expectedBibItemDetailBody)
        );

        // Stub conversionService to return convertedBibItemDetail
        expectedConvertedBibItemDetail = new BibEntry('Test', 'Monographie', 'Tim Test', 'Testbuch', '2018');
        mockConversionService = {
            convertObjectProperties: (resourceData: ResourceFullResponseJson) => expectedConvertedBibItemDetail,
        };

        TestBed.configureTestingModule({
            declarations: [BibliographyDetailComponent, BibliographyFormatPipe],
            providers: [
                { provide: BibliographyService, useValue: mockBibliographyService },
                { provide: ConversionService, useValue: mockConversionService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BibliographyDetailComponent);
        component = fixture.componentInstance;

        // Test data
        expectedObjId = '1234';
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have objId input', () => {
            expect(component.objId).toBeUndefined();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.objId = expectedObjId;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have objId input', () => {
            expect(component.objId).toBeTruthy();
            expect(component.objId).withContext(`should be ${expectedObjId}`).toBe(expectedObjId);
        });
    });
});
