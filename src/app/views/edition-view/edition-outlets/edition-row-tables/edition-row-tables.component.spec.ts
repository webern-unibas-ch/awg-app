import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { Observable, lastValueFrom, of as observableOf } from 'rxjs';

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
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionRowTablesList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

import { mockEditionData } from '@testing/mock-data';
import { EditionRowTablesComponent } from './edition-row-tables.component';

describe('EditionRowTablesComponent (DONE)', () => {
    let component: EditionRowTablesComponent;
    let fixture: ComponentFixture<EditionRowTablesComponent>;
    let compDe: DebugElement;

    let editionDataServiceGetRowTablesDataSpy: Spy;
    let editionStateServiceUpdateIsRowTablesViewSpy: Spy;

    let editionStateService: EditionStateService;
    let mockEditionDataService: Partial<EditionDataService>;

    let expectedRowTablesData: EditionRowTablesList;

    beforeEach(async () => {
        // Mock edition data service
        mockEditionDataService = {
            getEditionRowTablesData: (): Observable<EditionRowTablesList> => observableOf(expectedRowTablesData),
        };

        await TestBed.configureTestingModule({
            declarations: [EditionRowTablesComponent, RouterLinkStubDirective],
            providers: [{ provide: EditionDataService, useValue: mockEditionDataService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);
        mockEditionDataService = TestBed.inject(EditionDataService);

        // Spies
        editionDataServiceGetRowTablesDataSpy = vi.spyOn(mockEditionDataService, 'getEditionRowTablesData');
        editionStateServiceUpdateIsRowTablesViewSpy = vi.spyOn(editionStateService, 'updateIsRowTableView');

        // Test data
        expectedRowTablesData = structuredClone(mockEditionData.mockRowTablesData);

        // Create component fixture
        fixture = TestBed.createComponent(EditionRowTablesComponent);
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
        it('... should not have `rowTablesData$`', () => {
            expect(component.rowTablesData$).toBeUndefined();
        });

        it('... should not have called EditionStateService', () => {
            expectSpyCall(editionStateServiceUpdateIsRowTablesViewSpy, 0);
        });

        it('... should not have called EditionDataService', () => {
            expectSpyCall(editionDataServiceGetRowTablesDataSpy, 0);
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
            expectSpyCall(editionStateServiceUpdateIsRowTablesViewSpy, 1);

            expectToBe(editionStateService.isRowTableView(), true);
        });

        it('... should have called EditionDataService', () => {
            expectSpyCall(editionDataServiceGetRowTablesDataSpy, 1);
        });

        it('... should have rowTablesData$', async () => {
            await expect(lastValueFrom(component.rowTablesData$)).resolves.not.toThrow();
            await expect(lastValueFrom(component.rowTablesData$)).resolves.toEqual(expectedRowTablesData);
        });

        describe('VIEW', () => {
            it('... should contain 1 outer div.row', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
            });

            it('... should contain as many inner div.col as entries in rowTablesData', () => {
                expectToBe(expectedRowTablesData.rowTables.length, 4);

                getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    expectedRowTablesData.rowTables.length,
                    expectedRowTablesData.rowTables.length
                );
            });

            it('... should contain 1 div.card with body and footer in each div.col ', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    expectedRowTablesData.rowTables.length,
                    expectedRowTablesData.rowTables.length
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
                    expectedRowTablesData.rowTables.length,
                    expectedRowTablesData.rowTables.length
                );

                divDes.forEach(divDe => {
                    getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                });
            });

            it('... should display the correct titles in h5.card-title', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    expectedRowTablesData.rowTables.length,
                    expectedRowTablesData.rowTables.length
                );

                divDes.forEach((divDe, index) => {
                    const hDes = getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    const expectedHeading = 'Reihentabelle ' + expectedRowTablesData.rowTables[index].short;

                    expectToBe(hEl.textContent.trim(), expectedHeading);
                });
            });

            it('... should text-mute the title of disabled rowtables', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    expectedRowTablesData.rowTables.length,
                    expectedRowTablesData.rowTables.length
                );

                divDes.forEach((divDe, index) => {
                    const hDes = getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    if (expectedRowTablesData.rowTables[index].disabled) {
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
                    expectedRowTablesData.rowTables.length,
                    expectedRowTablesData.rowTables.length
                );

                divDes.forEach(divDe => {
                    getAndExpectDebugElementByCss(divDe, 'div.card-footer a.btn-outline-info', 1, 1);
                });
            });

            it('... should display the correct text in anchor buttons', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    expectedRowTablesData.rowTables.length,
                    expectedRowTablesData.rowTables.length
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
                    expectedRowTablesData.rowTables.length,
                    expectedRowTablesData.rowTables.length
                );

                divDes.forEach((divDe, index) => {
                    const aDes = getAndExpectDebugElementByCss(divDe, 'div.card-footer a.btn-outline-info', 1, 1);
                    const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                    if (expectedRowTablesData.rowTables[index].disabled) {
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
                    expectedRowTablesData.rowTables.length,
                    expectedRowTablesData.rowTables.length
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedRowTablesData.rowTables.length);
            });

            it('... can get correct linkParams from template', () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const expectedRouterLink = ['../complex' + expectedRowTablesData.rowTables[index].route, 'sheets'];

                    expectToEqual(routerLink.linkParams, expectedRouterLink);
                }
            });

            it('... can get correct queryParams from template', () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const expectedQueryParams = { id: expectedRowTablesData.rowTables[index].id };

                    expectToEqual(routerLink.queryParams, expectedQueryParams);
                }
            });

            it('... can click all links in template', async () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = ['../complex' + expectedRowTablesData.rowTables[index].route, 'sheets'];

                    expectToBe(routerLink.navigatedTo, null);

                    await clickAndAwaitChanges(linkDe, fixture);

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                }
            });
        });

        describe('#ngOnDestroy()', () => {
            it('... should have cleared isRowTableView on destroy (via EditionStateService)', () => {
                component.ngOnDestroy();

                expectToBe(editionStateService.isRowTableView(), false);
            });
        });
    });
});
