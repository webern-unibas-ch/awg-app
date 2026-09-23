import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionSectionCardComponent } from './edition-section-card/edition-section-card.component';
import { EditionSectionsComponent } from './edition-sections.component';

describe('EditionSectionsComponent (DONE)', () => {
    let component: EditionSectionsComponent;
    let fixture: ComponentFixture<EditionSectionsComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let expectedSeries: EditionOutlineSeries;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSectionsComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedSeries = EditionStateHelper.getSeries('1');

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `selectedSeries` to hold null', () => {
            expectToEqual(component.selectedSeries(), null);
        });

        describe('VIEW', () => {
            it('... should not contain a div.awg-edition-sections-grid yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sections-grid', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            editionStateService.updateSelectedEditionSeries(expectedSeries);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedSeries` to hold the expected series', () => {
            expectToEqual(component.selectedSeries(), expectedSeries);
        });

        describe('VIEW', () => {
            it('... should render no content if selectedSeries is not available', () => {
                editionStateService.updateSelectedEditionSeries(null);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sections-grid', 0, 0);
            });

            it('... should contain one div.awg-edition-sections-grid', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sections-grid', 1, 1);
            });

            it('... should contain as many div.cols with a EditionSectionCard as sections', () => {
                const expectedSectionsLength = expectedSeries.sections.length;

                getAndExpectDebugElementByDirective(
                    compDe,
                    EditionSectionCardComponent,
                    expectedSectionsLength,
                    expectedSectionsLength
                );
            });

            it('... should pass down the correct section to the EditionSectionCard', () => {
                const cardDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionSectionCardComponent,
                    expectedSeries.sections.length,
                    expectedSeries.sections.length
                );

                cardDes.forEach((cardDe, index) => {
                    const cardComponent = cardDe.injector.get(EditionSectionCardComponent);

                    expectToBe(cardComponent.displayedSection(), expectedSeries.sections[index]);
                });
            });
        });
    });
});
