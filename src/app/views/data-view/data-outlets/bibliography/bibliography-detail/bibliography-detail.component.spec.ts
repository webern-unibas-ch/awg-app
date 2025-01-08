import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { expectToBe } from '@testing/expect-helper';

import { ConversionService } from '@awg-core/services';
import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { BibliographyFormatPipe } from '@awg-views/data-view/data-outlets/bibliography//bibliography-format.pipe';
import { BibEntry } from '@awg-views/data-view/data-outlets/bibliography/bibliography-entry.model';
import { BibliographyService } from '@awg-views/data-view/services';

import { BibliographyDetailComponent } from './bibliography-detail.component';

describe('BibliographyDetailComponent', () => {
    let component: BibliographyDetailComponent;
    let fixture: ComponentFixture<BibliographyDetailComponent>;

    let mockBibliographyService: Partial<BibliographyService>;
    let mockConversionService: Partial<ConversionService>;

    let getBibliographyListSpy: Spy;

    let expectedObjId: string;
    let expectedBibItemDetailBody: ResourceFullResponseJson;
    let expectedConvertedBibItemDetail: BibEntry;

    beforeEach(waitForAsync(() => {
        mockBibliographyService = {
            getBibliographyItemDetail: () => observableOf(expectedBibItemDetailBody),
        };
        mockConversionService = {
            convertObjectProperties: () => expectedConvertedBibItemDetail,
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
        expectedBibItemDetailBody = new ResourceFullResponseJson();
        expectedConvertedBibItemDetail = new BibEntry('Test', 'Monographie', 'Tim Test', 'Testbuch', '2018');

        // Spies
        getBibliographyListSpy = spyOn(mockBibliographyService, 'getBibliographyItemDetail').and.callThrough();
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
            getBibliographyListSpy.and.returnValue(observableOf(expectedBibItemDetailBody));

            // Simulate the parent setting the input properties
            component.objId = expectedObjId;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have objId input', () => {
            expectToBe(component.objId, expectedObjId);
        });
    });
});
