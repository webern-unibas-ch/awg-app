import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { AlertErrorStubComponent, TwelveToneSpinnerStubComponent } from '@testing/component-stubs';
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
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { RowtablesList } from '@awg-views/edition-view/models';
import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
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
            imports: [AlertErrorStubComponent, TwelveToneSpinnerStubComponent],
            declarations: [EditionRowtablesComponent, RouterLinkStubDirective],
            providers: [
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
            it('... should contain no AlertErrorComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);
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
            it('... should render nothing if viewData is not available', async () => {
                mockViewDataSignal.set(null as any);

                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);
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

                it('... should not contain rowtables view or spinner, but one AlertErrorComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-rowtables-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

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

                it('... should not contain rowtables view or alert, but one TwelveToneSpinnerComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-rowtables-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                });

                it('... should have default spinnerText on TwelveToneSpinnerComponent', () => {
                    const spinnerDes = getAndExpectDebugElementByDirective(
                        compDe,
                        TwelveToneSpinnerStubComponent,
                        1,
                        1
                    );
                    const spinnerCmp = spinnerDes[0].injector.get(
                        TwelveToneSpinnerStubComponent
                    ) as TwelveToneSpinnerStubComponent;

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
                    getAndExpectDebugElementByCss(compDe, 'div.awg-rowtables-view.row', 1, 1);
                });

                it('... should contain as many inner div.col as entries in rowtablesData', () => {
                    const rowDes = getAndExpectDebugElementByCss(compDe, 'div.awg-rowtables-view.row', 1, 1);

                    expectToBe(expectedRowtablesData.rowtables.length, 4);
                    getAndExpectDebugElementByCss(
                        rowDes[0],
                        'div.col',
                        expectedRowtablesData.rowtables.length,
                        expectedRowtablesData.rowtables.length
                    );
                });

                it('... should contain one div.card with body and footer in each div.col ', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.col',
                        expectedRowtablesData.rowtables.length,
                        expectedRowtablesData.rowtables.length
                    );

                    divDes.forEach(divDe => {
                        getAndExpectDebugElementByCss(divDe, 'div.card', 1, 1);
                        getAndExpectDebugElementByCss(divDe, 'div.card-body', 1, 1);
                        getAndExpectDebugElementByCss(divDe, 'div.card-footer', 1, 1);
                    });
                });

                it('... should contain one h5.card-title in each div.card-body', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.col',
                        expectedRowtablesData.rowtables.length,
                        expectedRowtablesData.rowtables.length
                    );

                    divDes.forEach(divDe => {
                        getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                    });
                });

                it('... should display the correct titles in h5.card-title', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.col',
                        expectedRowtablesData.rowtables.length,
                        expectedRowtablesData.rowtables.length
                    );

                    divDes.forEach((divDe, index) => {
                        const hDes = getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const expectedHeading = 'Reihentabelle ' + expectedRowtablesData.rowtables[index].short;

                        expectToBe(hEl.textContent.trim(), expectedHeading);
                    });
                });

                it('... should text-mute the title of disabled rowtables', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.col',
                        expectedRowtablesData.rowtables.length,
                        expectedRowtablesData.rowtables.length
                    );

                    divDes.forEach((divDe, index) => {
                        const hDes = getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        if (expectedRowtablesData.rowtables[index].disabled) {
                            expectToContain(hEl.classList, 'text-muted');
                        } else {
                            expectToNotContain(hEl.classList, 'text-muted');
                        }
                    });
                });

                it('... should contain one anchor button in each div.card-footer', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.col',
                        expectedRowtablesData.rowtables.length,
                        expectedRowtablesData.rowtables.length
                    );

                    divDes.forEach(divDe => {
                        getAndExpectDebugElementByCss(divDe, 'div.card-footer a.btn-outline-info', 1, 1);
                    });
                });

                it('... should display the correct text in anchor buttons', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.col',
                        expectedRowtablesData.rowtables.length,
                        expectedRowtablesData.rowtables.length
                    );

                    divDes.forEach(divDe => {
                        const aDes = getAndExpectDebugElementByCss(divDe, 'div.card-footer a.btn-outline-info', 1, 1);
                        const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                        const expectedText = 'Mehr ...';

                        expectToBe(aEl.textContent.trim(), expectedText);
                    });
                });

                it('... should disable the buttons of disabled rowtables', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.col',
                        expectedRowtablesData.rowtables.length,
                        expectedRowtablesData.rowtables.length
                    );

                    divDes.forEach((divDe, index) => {
                        const aDes = getAndExpectDebugElementByCss(divDe, 'div.card-footer a.btn-outline-info', 1, 1);
                        const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                        if (expectedRowtablesData.rowtables[index].disabled) {
                            expectToContain(aEl.classList, 'disabled');
                        } else {
                            expectToNotContain(aEl.classList, 'disabled');
                        }
                    });
                });
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLinkStubDirective[];

            beforeEach(async () => {
                // Mock data state
                mockViewDataSignal.set(
                    createMockViewData(expectedViewDataContent, {
                        isLoading: false,
                        error: null,
                    })
                );

                await detectChangesOnPush(fixture);

                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkStubDirective,
                    expectedRowtablesData.rowtables.length,
                    expectedRowtablesData.rowtables.length
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedRowtablesData.rowtables.length);
            });

            it('... can get correct linkParams from template', () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const expectedRouterLink = ['../complex' + expectedRowtablesData.rowtables[index].route, 'sheets'];

                    expectToEqual(routerLink.linkParams, expectedRouterLink);
                }
            });

            it('... can get correct queryParams from template', () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const expectedQueryParams = { id: expectedRowtablesData.rowtables[index].id };

                    expectToEqual(routerLink.queryParams, expectedQueryParams);
                }
            });

            it('... can click all links in template', async () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = ['../complex' + expectedRowtablesData.rowtables[index].route, 'sheets'];

                    expectToBe(routerLink.navigatedTo, null);

                    await clickAndAwaitChanges(linkDe, fixture);

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                }
            });
        });
    });
});
