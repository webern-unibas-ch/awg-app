import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { mockEditionData } from '@testing/mock-data';

import { EditionSvgSheet, FolioConvolute } from '@awg-views/edition-view/models';

import { FolioOverviewComponent } from './folio-overview.component';
import { FolioService } from './folio.service';

describe('FolioComponent', () => {
    let component: FolioOverviewComponent;
    let fixture: ComponentFixture<FolioOverviewComponent>;

    let expectedConvolute: FolioConvolute;
    let expectedSvgSheet: EditionSvgSheet;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FolioOverviewComponent],
            providers: [FolioService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FolioOverviewComponent);
        component = fixture.componentInstance;

        // Test data
        // Mock the inputs supplied by the parent component
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedConvolute = mockEditionData.mockFolioConvoluteData.convolutes[0];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `selectedConvolute` input', () => {
            expect(component.selectedConvolute).toBeUndefined();
        });

        it('should not have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.selectedConvolute = expectedConvolute;
            component.selectedSvgSheet = expectedSvgSheet;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).toBeTruthy();
            expect(component.selectedSvgSheet).withContext(`should be ${expectedSvgSheet}`).toBe(expectedSvgSheet);
        });

        it('should have `selectedConvolute` input', () => {
            expect(component.selectedConvolute).toBeTruthy();
            expect(component.selectedConvolute).withContext(`should be ${expectedConvolute}`).toBe(expectedConvolute);
        });
    });
});
