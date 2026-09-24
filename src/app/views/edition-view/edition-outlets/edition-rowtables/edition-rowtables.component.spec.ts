import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { ButtonMoreComponent } from '@awg-shared/button-more/button-more.component';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';
import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { RowtablesList } from '@awg-views/edition-view/models/rowtables.model';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionRowtablesComponent } from './edition-rowtables.component';

describe('EditionRowTablesComponent (DONE)', () => {
    let component: EditionRowtablesComponent;
    let fixture: ComponentFixture<EditionRowtablesComponent>;
    let compDe: DebugElement;

    let mockViewDataSignal: WritableSignal<EditionViewData<'rowtables'>>;
    let expectedViewDataContent: EditionViewDataContent<'rowtables'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'rowtables'>;
    let expectedRowtablesData: RowtablesList;

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = { rowtablesData: new RowtablesList() };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        await TestBed.configureTestingModule({
            imports: [EditionRowtablesComponent, AlertErrorComponent, ButtonMoreComponent, TwelveToneSpinnerComponent],
            providers: [
                provideRouter([]),
                {
                    provide: EditionViewService,
                    useValue: { rowtablesViewData: mockViewDataSignal.asReadonly() },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedRowtablesData = structuredClone(mockEditionData.mockRowtablesData);

        // Create component fixture
        fixture = TestBed.createComponent(EditionRowtablesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `viewData` to hold the default fallback data', () => {
            expectToBe(isSignal(component.viewData), true);

            expectToEqual(component.viewData(), createMockViewData(expectedDefaultViewDataContent));
        });

        describe('VIEW', () => {
            it('... should contain no AlertErrorComponent', () => {
                getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent', () => {
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 0, 0);
            });

            it('... should contain no div.awg-rowtables-view yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-rowtables-view', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set mock view data signal to expected data state
            expectedViewDataContent = { rowtablesData: expectedRowtablesData };
            mockViewDataSignal.set(
                createMockViewData(expectedViewDataContent, {
                    isLoading: false,
                    error: null,
                })
            );

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `viewData` to hold the expected data', () => {
            expectToEqual(component.viewData(), createMockViewData(expectedViewDataContent));
        });

        describe('VIEW', () => {
            const getRowtablesLength = () => expectedRowtablesData?.rowtables?.length || 0;
            const getRowtablesViewDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-rowtables-view.row', 1, 1);
            const getRowtablesColDes = () =>
                getAndExpectDebugElementByCss(
                    getRowtablesViewDes()[0],
                    'div.col',
                    getRowtablesLength(),
                    getRowtablesLength()
                );
            const getCardBodyDes = () =>
                getAndExpectDebugElementByCss(
                    getRowtablesViewDes()[0],
                    'div.card-body',
                    getRowtablesLength(),
                    getRowtablesLength()
                );
            const getCardFooterDes = () =>
                getAndExpectDebugElementByCss(
                    getRowtablesViewDes()[0],
                    'div.card-footer',
                    getRowtablesLength(),
                    getRowtablesLength()
                );

            it('... should render nothing if viewData is not available', async () => {
                mockViewDataSignal.set(null as any);

                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 0, 0);
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 0, 0);
                getAndExpectDebugElementByCss(compDe, 'div.awg-rowtables-view', 0, 0);
            });

            describe('on error', () => {
                const expectedErrorObject: EditionDataAssetsError = {
                    key: 'rowtables',
                    error: { status: 404, statusText: 'Data not found' },
                };

                beforeEach(async () => {
                    // Mock error state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: expectedErrorObject,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain rowtables view or spinner, but one AlertErrorComponent', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-rowtables-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(AlertErrorComponent) as AlertErrorComponent;

                    expectToEqual(alertErrorCmp.errorObject(), expectedErrorObject);
                });
            });

            describe('on loading', () => {
                beforeEach(async () => {
                    // Mock loading state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, { isLoading: true, error: null })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain rowtables view or alert, but one TwelveToneSpinnerComponent', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-rowtables-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 1, 1);
                });

                it('... should have default spinnerText on TwelveToneSpinnerComponent', () => {
                    const spinnerDes = getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 1, 1);
                    const spinnerCmp = spinnerDes[0].injector.get(
                        TwelveToneSpinnerComponent
                    ) as TwelveToneSpinnerComponent;

                    expectToBe(spinnerCmp.spinnerText(), 'loading');
                });
            });

            describe('on view data available', () => {
                beforeEach(async () => {
                    // Mock data state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: null,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should contain one outer div.awg-rowtables-view.row', () => {
                    getRowtablesViewDes();
                });

                it('... should contain as many inner div.col as entries in rowtablesData', () => {
                    expectToBe(expectedRowtablesData.rowtables.length, 4);
                    getRowtablesColDes();
                });

                it('... should contain one div.card with body and footer in each div.col ', () => {
                    const colDes = getRowtablesColDes();

                    colDes.forEach(colDe => {
                        getAndExpectDebugElementByCss(colDe, 'div.card', 1, 1);
                        getAndExpectDebugElementByCss(colDe, 'div.card-body', 1, 1);
                        getAndExpectDebugElementByCss(colDe, 'div.card-footer', 1, 1);
                    });
                });

                it('... should contain one h5.card-title in each div.card-body', () => {
                    const cardBodyDes = getCardBodyDes();

                    cardBodyDes.forEach(cardBodyDe => {
                        getAndExpectDebugElementByCss(cardBodyDe, 'h5.card-title', 1, 1);
                    });
                });

                it('... should display the correct titles in h5.card-title', () => {
                    const cardBodyDes = getCardBodyDes();

                    cardBodyDes.forEach((cardBodyDe, index) => {
                        const hDes = getAndExpectDebugElementByCss(cardBodyDe, 'h5.card-title', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const expectedHeading = 'Reihentabelle ' + expectedRowtablesData.rowtables[index].short;

                        expectToBe(hEl.textContent.trim(), expectedHeading);
                    });
                });

                it('... should text-mute the title of disabled rowtables', () => {
                    const cardBodyDes = getCardBodyDes();

                    cardBodyDes.forEach((cardBodyDe, index) => {
                        const hDes = getAndExpectDebugElementByCss(cardBodyDe, 'h5.card-title', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        if (expectedRowtablesData.rowtables[index].disabled) {
                            expectToContain(hEl.classList, 'text-muted');
                        } else {
                            expectToNotContain(hEl.classList, 'text-muted');
                        }
                    });
                });

                it('... should contain one ButtonMoreComponent in each div.card-footer', () => {
                    const cardFooterDes = getCardFooterDes();

                    cardFooterDes.forEach(cardFooterDe => {
                        getAndExpectDebugElementByDirective(cardFooterDe, ButtonMoreComponent, 1, 1);
                    });
                });

                it('... should pass down the correct targetRoute to ButtonMoreComponent', () => {
                    const cardFooterDes = getCardFooterDes();

                    cardFooterDes.forEach((cardFooterDe, index) => {
                        const buttonMoreDes = getAndExpectDebugElementByDirective(
                            cardFooterDe,
                            ButtonMoreComponent,
                            1,
                            1
                        );
                        const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent) as ButtonMoreComponent;

                        const rowtable = expectedRowtablesData.rowtables[index];
                        const expectedTargetRoute = ['../complex' + rowtable.route, 'sheets'];

                        expectToEqual(buttonMoreCmp.targetRoute(), expectedTargetRoute);
                    });
                });

                it('... should pass down the correct queryParams to ButtonMoreComponent', () => {
                    const cardFooterDes = getCardFooterDes();

                    cardFooterDes.forEach((cardFooterDe, index) => {
                        const buttonMoreDes = getAndExpectDebugElementByDirective(
                            cardFooterDe,
                            ButtonMoreComponent,
                            1,
                            1
                        );
                        const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent) as ButtonMoreComponent;

                        const rowtable = expectedRowtablesData.rowtables[index];
                        const expectedQueryParams = { id: rowtable.id };

                        expectToEqual(buttonMoreCmp.queryParams(), expectedQueryParams);
                    });
                });

                it('... should pass down the correct disabled state to ButtonMoreComponent', () => {
                    const cardFooterDes = getCardFooterDes();

                    cardFooterDes.forEach((cardFooterDe, index) => {
                        const buttonMoreDes = getAndExpectDebugElementByDirective(
                            cardFooterDe,
                            ButtonMoreComponent,
                            1,
                            1
                        );
                        const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent) as ButtonMoreComponent;

                        const rowtable = expectedRowtablesData.rowtables[index];

                        expectToBe(buttonMoreCmp.disabled(), rowtable.disabled);
                    });
                });
            });
        });
    });
});
