import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { mockEditionData } from '@testing/mock-data';

import { EditionSvgSheet, FolioConvolute } from '@awg-views/edition-view/models';

import { FolioService } from './folio.service';
import { FolioOverviewComponent } from './folio-overview.component';

describe('FolioComponent', () => {
    let component: FolioOverviewComponent;
    let fixture: ComponentFixture<FolioOverviewComponent>;

    let expectedConvolute: FolioConvolute;
    let expectedSvgSheet: EditionSvgSheet;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [FolioOverviewComponent],
                providers: [FolioService],
            }).compileComponents();
        })
    );

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
        it('should not have folios input', () => {
            expect(component.selectedConvolute).toBeUndefined('should be undefined');
        });

        it('should not have svg file input', () => {
            expect(component.selectedSvgSheet).toBeUndefined('should be undefined');
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

        it('should have svg file input', () => {
            expect(component.selectedSvgSheet).toBe(expectedSvgSheet);
        });

        it('should have folios input', () => {
            expect(component.selectedConvolute).toBe(expectedConvolute);
        });
    });
});
