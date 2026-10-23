import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
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
import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';

import { EditionOutlineComponent } from './edition-outline.component';
import { EditionSeriesCardComponent } from './edition-series-card/edition-series-card.component';

describe('EditionOutlineComponent (DONE)', () => {
    let component: EditionOutlineComponent;
    let fixture: ComponentFixture<EditionOutlineComponent>;
    let compDe: DebugElement;

    let mockOutlineSignal: WritableSignal<EditionOutlineSeries[]>;
    let expectedOutline: EditionOutlineSeries[];

    beforeEach(async () => {
        // Mock services
        expectedOutline = EditionStateHelper.getOutline();
        mockOutlineSignal = signal(expectedOutline);

        await TestBed.configureTestingModule({
            imports: [EditionOutlineComponent, EditionSeriesCardComponent],
            providers: [
                provideRouter([]),
                {
                    provide: EditionOutlineService,
                    useValue: {
                        editionOutline: mockOutlineSignal.asReadonly(),
                    },
                },
            ],
        })
            .overrideComponent(EditionSeriesCardComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Create component fixture
        fixture = TestBed.createComponent(EditionOutlineComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `editionOutline` to hold the expected outline', () => {
            expectToBe(isSignal(component.editionOutline), true);

            expectToEqual(component.editionOutline(), expectedOutline);
        });

        describe('VIEW', () => {
            it('... should not contain one div.awg-edition-series-grid yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-grid', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            const getSeriesDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-outline', 1, 1);
            const getSeriesTextDes = () =>
                getAndExpectDebugElementByCss(getSeriesDes()[0], 'div.awg-edition-outline-text', 1, 1);
            const getSeriesGridDes = () =>
                getAndExpectDebugElementByCss(getSeriesDes()[0], 'div.awg-edition-series-grid', 1, 1);
            const getGridColDes = (expectedLength: number) =>
                getAndExpectDebugElementByCss(getSeriesGridDes()[0], 'div.col', expectedLength, expectedLength);

            it('... should render no content if edition outline is not available', () => {
                mockOutlineSignal.set(null as any);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-outline', 0, 0);
            });

            it('... should contain one `div.awg-edition-outline`', () => {
                getSeriesDes();
            });

            it('... should contain one `div.awg-edition-outline-text` in `div.awg-edition-outline`', () => {
                getSeriesTextDes();
            });

            it('... should contain two paragraphs in `div.awg-edition-outline-text`', () => {
                getAndExpectDebugElementByCss(getSeriesTextDes()[0], 'p', 2, 2);
            });

            it('... should contain one `div.awg-edition-series-grid` in `div.awg-edition-outline`', () => {
                getSeriesGridDes();
            });

            it('... should contain as many div.col in `div.awg-edition-series-grid` as there are series', () => {
                getGridColDes(expectedOutline.length);
            });

            it('... should contain an EditionSeriesCardComponent (hollow) in each div.col', () => {
                const colDes = getGridColDes(expectedOutline.length);

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByDirective(colDe, EditionSeriesCardComponent, 1, 1);
                });
            });

            it('... should pass down the correct series to each EditionSeriesCardComponent (hollow)', () => {
                const colDes = getGridColDes(expectedOutline.length);

                colDes.forEach((colDe, index) => {
                    const cardDes = getAndExpectDebugElementByDirective(colDe, EditionSeriesCardComponent, 1, 1);
                    const cardCmp = cardDes[0].injector.get(EditionSeriesCardComponent);

                    expectToEqual(cardCmp.displayedSeries(), expectedOutline[index]);
                });
            });
        });
    });
});
