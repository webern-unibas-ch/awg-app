import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';
import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionOutlineComponent } from './edition-outline.component';
import { EditionSeriesCardComponent } from './edition-series-card/edition-series-card.component';

describe('EditionOutlineComponent (DONE)', () => {
    let component: EditionOutlineComponent;
    let fixture: ComponentFixture<EditionOutlineComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let stateServiceUpdateSeriesSpy: Spy;

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
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        stateServiceUpdateSeriesSpy = vi.spyOn(editionStateService, 'updateSelectedEditionSeries');

        // Create component fixture
        fixture = TestBed.createComponent(EditionOutlineComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `editionOutline` to hold the expected outline', () => {
            expectToBe(isSignal(component.editionOutline), true);

            expectToEqual(component.editionOutline(), expectedOutline);
        });

        it('... should have cleared the selected edition series in the constructor (via service)', () => {
            expectSpyCall(stateServiceUpdateSeriesSpy, 1, null);
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
            const getSeriesDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 1, 1);
            const getSeriesTextDes = () =>
                getAndExpectDebugElementByCss(getSeriesDes()[0], 'div.awg-edition-series-text', 1, 1);
            const getSeriesGridDes = () =>
                getAndExpectDebugElementByCss(getSeriesDes()[0], 'div.awg-edition-series-grid', 1, 1);
            const getGridColDes = (expectedLength: number) =>
                getAndExpectDebugElementByCss(getSeriesGridDes()[0], 'div.col', expectedLength, expectedLength);

            it('... should render no content if edition outline is not available', () => {
                mockOutlineSignal.set(null as any);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 0, 0);
            });

            it('... should contain one `div.awg-edition-series`', () => {
                getSeriesDes();
            });

            it('... should contain one `div.awg-edition-series-text` in `div.awg-edition-series`', () => {
                getSeriesTextDes();
            });

            it('... should contain two paragraphs in `div.awg-edition-series-text`', () => {
                getAndExpectDebugElementByCss(getSeriesTextDes()[0], 'p', 2, 2);
            });

            it('... should contain one `div.awg-edition-series-grid` in `div.awg-edition-series`', () => {
                getSeriesGridDes();
            });

            it('... should contain as many div.col in `div.awg-edition-series-grid` as there are series', () => {
                getGridColDes(expectedOutline.length);
            });

            it('... should contain an EditionSeriesCardComponent in each div.col', () => {
                const colDes = getGridColDes(expectedOutline.length);

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByDirective(colDe, EditionSeriesCardComponent, 1, 1);
                });
            });

            it('... should pass down the correct series to each EditionSeriesCardComponent', () => {
                const colDes = getGridColDes(expectedOutline.length);

                colDes.forEach((colDe, index) => {
                    const cardDes = getAndExpectDebugElementByDirective(colDe, EditionSeriesCardComponent, 1, 1);
                    const cardCmp = cardDes[0].injector.get(EditionSeriesCardComponent) as EditionSeriesCardComponent;

                    expectToEqual(cardCmp.displayedSeries(), expectedOutline[index]);
                });
            });
        });
    });
});
