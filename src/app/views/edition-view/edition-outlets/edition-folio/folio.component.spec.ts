import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioComponent } from './folio.component';
import { FolioService } from './folio.service';
import { Folio, FolioSvgData, EditionSvgSheet, FolioCalculation, FolioSettings } from '@awg-views/edition-view/models';

describe('FolioComponent', () => {
    let component: FolioComponent;
    let fixture: ComponentFixture<FolioComponent>;
    let expectedConvoluteData: Folio[];
    let expectedSvgSheet: EditionSvgSheet;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FolioComponent],
            providers: [FolioService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FolioComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not get convoluteData input', () => {
            expect(component.convoluteData).toBeUndefined('should be undefined');
        });

        it('should not get svg file input', () => {
            expect(component.selectedSvgSheet).toBeUndefined('should be undefined');
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the inputs supplied by the parent component
            expectedSvgSheet = {
                id: 'Aa:SkI/2',
                svg: 'assets/img/edition/SkI_2n_small_cut_opt.svg',
                image: 'assets/img/edition/SkI_2_small.jpg',
                alt: 'Aa:SkI/2'
            };
            const folioFormatSettings: FolioSettings = {
                factor: 1.5,
                formatX: 175,
                formatY: 270,
                initialOffsetX: 5,
                initialOffsetY: 5,
                numberOfFolios: 0
            };
            expectedConvoluteData = [
                {
                    folioId: '1r',
                    systems: '16',
                    format: {
                        height: 175,
                        width: 270
                    },
                    content: [
                        {
                            sigle: 'Aa:SkI/1a',
                            measure: '1–2, [3–6]',
                            sectionPartition: 1,
                            sections: [
                                {
                                    startSystem: 2,
                                    endSystem: 4
                                }
                            ]
                        }
                    ]
                }
            ];

            // simulate the parent setting the input properties
            component.convoluteData = expectedConvoluteData;
            component.selectedSvgSheet = expectedSvgSheet;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should get svg file input', () => {
            expect(component.selectedSvgSheet).toBe(expectedSvgSheet);
        });

        it('should get convoluteData input', () => {
            expect(component.convoluteData).toBe(expectedConvoluteData);
        });
    });
});
