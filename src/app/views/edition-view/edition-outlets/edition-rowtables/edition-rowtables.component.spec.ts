import { DebugElement, isSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
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
import { EditionViewData } from '@awg-views/edition-view/models/edition-data.model';
import { EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionRowtablesComponent } from './edition-rowtables.component';

describe('EditionRowTablesComponent (DONE)', () => {
    let component: EditionRowtablesComponent;
    let fixture: ComponentFixture<EditionRowtablesComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;
    let mockEditionDataService: Partial<EditionDataService>;

    let editionStateServiceUpdateIsRowtablesViewSpy: Spy;

    let expectedRowtablesData: RowtablesList;
    let expectedViewData: EditionViewData<'rowtables'>;

    beforeEach(async () => {
        // Mock services
        expectedRowtablesData = structuredClone(mockEditionData.mockRowtablesData);
        mockEditionDataService = {
            rowtablesViewData: signal({
                data: { rowtablesData: expectedRowtablesData },
                isLoading: false,
                error: null,
            }),
        };

        await TestBed.configureTestingModule({
            declarations: [EditionRowtablesComponent, RouterLinkStubDirective],
            providers: [{ provide: EditionDataService, useValue: mockEditionDataService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);
        mockEditionDataService = TestBed.inject(EditionDataService);

        // Spies
        editionStateServiceUpdateIsRowtablesViewSpy = vi.spyOn(editionStateService, 'updateIsRowtablesView');

        // Test data
        expectedViewData = {
            data: { rowtablesData: expectedRowtablesData },
            isLoading: false,
            error: null,
        };

        // Create component fixture
        fixture = TestBed.createComponent(EditionRowtablesComponent);
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
        it('... should have signal `viewData` to hold the expected data', () => {
            expectToBe(isSignal(component.viewData), true);

            expectToEqual(component.viewData(), expectedViewData);
        });

        it('... should not have called EditionStateService', () => {
            expectSpyCall(editionStateServiceUpdateIsRowtablesViewSpy, 0);
        });

        describe('VIEW', () => {
            it('... should contain no outer div.row (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called EditionStateService and updated IsRowTableView', () => {
            expectSpyCall(editionStateServiceUpdateIsRowtablesViewSpy, 1);

            expectToBe(editionStateService.isRowtablesView(), true);
        });

        describe('VIEW', () => {
            it('... should contain 1 outer div.row', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
            });

            it('... should contain as many inner div.col as entries in rowtablesData', () => {
                expectToBe(expectedRowtablesData.rowtables.length, 4);

                getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    expectedRowtablesData.rowtables.length,
                    expectedRowtablesData.rowtables.length
                );
            });

            it('... should contain 1 div.card with body and footer in each div.col ', () => {
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

            it('... should contain 1 h5.card-title in each div.card-body', () => {
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

            it('... should contain 1 anchor button in each div.card-footer', () => {
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

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks;

            beforeEach(() => {
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
