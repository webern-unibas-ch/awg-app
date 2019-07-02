/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of as observableOf } from 'rxjs';

import { BibliographyDetailComponent } from './bibliography-detail.component';
import { BibliographyFormatPipe } from '../bibliography-format.pipe';
import { BibEntry } from '../bibliography-entry.model';

import { BibliographyService } from '@awg-views/data-view/services';
import { ConversionService } from '@awg-core/services';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';

describe('BibliographyDetailComponent', () => {
    let component: BibliographyDetailComponent;
    let fixture: ComponentFixture<BibliographyDetailComponent>;

    let mockConversionService: Partial<ConversionService>;
    let getBibliographyListSpy: Observable<ResourceFullResponseJson>;

    let expectedObjId: string;
    let expectedBibItemDetailBody: ResourceFullResponseJson;
    let expectedConvertedBibItemDetail: BibEntry;

    beforeEach(async(() => {
        // create a fake bibliography service object with a `getBibliographyItemDetail()` spy
        const mockBibliographyService = jasmine.createSpyObj('BibliographyService', ['getBibliographyItemDetail']);
        // make the spies return a synchronous Observable with the test data
        expectedBibItemDetailBody = new ResourceFullResponseJson();
        getBibliographyListSpy = mockBibliographyService.getBibliographyItemDetail.and.returnValue(
            observableOf(expectedBibItemDetailBody)
        );

        // stub conversionService to return convertedBibItemDetail
        expectedConvertedBibItemDetail = new BibEntry('Test', 'Monographie', 'Tim Test', 'Testbuch', '2018');
        mockConversionService = {
            convertObjectProperties: (resourceData: ResourceFullResponseJson) => expectedConvertedBibItemDetail
        };

        TestBed.configureTestingModule({
            declarations: [BibliographyDetailComponent, BibliographyFormatPipe],
            providers: [
                { provide: BibliographyService, useValue: mockBibliographyService },
                { provide: ConversionService, useValue: mockConversionService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BibliographyDetailComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not get objId input', () => {
            expect(component.objId).toBeUndefined('should be undefined');
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the inputs supplied by the parent component
            expectedObjId = '1234';

            // simulate the parent setting the input properties
            component.objId = expectedObjId;
            component.bibItemDetail.convertedData = expectedConvertedBibItemDetail;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should get objId input', () => {
            expect(component.objId).toBe(expectedObjId);
        });
    });
});
