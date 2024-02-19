import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Observable, ReplaySubject, lastValueFrom, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { click } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionRowTablesList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { mockEditionData } from '@testing/mock-data';
import { EditionRowTablesComponent } from './edition-row-tables.component';

describe('EditionRowTablesComponent (DONE)', () => {
    let component: EditionRowTablesComponent;
    let fixture: ComponentFixture<EditionRowTablesComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let editionServiceUpdateIsRowTablesViewSpy: Spy;
    let editionServiceClearIsRowTablesViewSpy: Spy;
    let editionDataServiceGetRowTablesSpy: Spy;

    let mockEditionService: Partial<EditionService>;
    let mockEditionDataService: Partial<EditionDataService>;
    let mockIsRowTableViewSubject: ReplaySubject<boolean>;

    let expectedRowTablesData: EditionRowTablesList;

    beforeEach(async () => {
        mockIsRowTableViewSubject = new ReplaySubject<boolean>(1);

        // Mock edition service
        mockEditionService = {
            updateIsRowTableView: (isView: boolean): void => mockIsRowTableViewSubject.next(isView),
            clearIsRowTableView: (): void => mockIsRowTableViewSubject.next(null),
        };

        // Mock edition data service
        mockEditionDataService = {
            getEditionRowTablesData: (): Observable<EditionRowTablesList> => observableOf(expectedRowTablesData),
        };

        await TestBed.configureTestingModule({
            declarations: [EditionRowTablesComponent, RouterLinkStubDirective],
            providers: [
                { provide: EditionService, useValue: mockEditionService },
                { provide: EditionDataService, useValue: mockEditionDataService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionRowTablesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockEditionService = TestBed.inject(EditionService);
        mockEditionDataService = TestBed.inject(EditionDataService);

        // Test data
        expectedRowTablesData = JSON.parse(JSON.stringify(mockEditionData.mockRowTablesData));

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        editionServiceUpdateIsRowTablesViewSpy = spyOn(mockEditionService, 'updateIsRowTableView').and.callThrough();
        editionServiceClearIsRowTablesViewSpy = spyOn(mockEditionService, 'clearIsRowTableView').and.callThrough();
        editionDataServiceGetRowTablesSpy = spyOn(mockEditionDataService, 'getEditionRowTablesData').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `rowTablesData$`', () => {
            expect(component.rowTablesData$).toBeUndefined();
        });

        it('... should not have called EditionService', () => {
            expectSpyCall(editionServiceUpdateIsRowTablesViewSpy, 0);
        });

        it('... should not have called EditionDataService', () => {
            expectSpyCall(editionDataServiceGetRowTablesSpy, 0);
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

        it('... should have updated IsRowTableViewFlag (via EditionService)', () => {
            expectSpyCall(editionServiceUpdateIsRowTablesViewSpy, 1, true);
        });

        it('... should have called EditionDataService', () => {
            expectSpyCall(editionDataServiceGetRowTablesSpy, 1);
        });

        it('... should have rowTablesData$', waitForAsync(() => {
            expectAsync(lastValueFrom(component.rowTablesData$)).toBeResolved();
            expectAsync(lastValueFrom(component.rowTablesData$))
                .withContext(`should be resolved to ${expectedRowTablesData}`)
                .toBeResolvedTo(expectedRowTablesData);
        }));

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
                    const headingDe = getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                    const headingEl = headingDe[0].nativeElement;

                    const expectedHeading = 'Reihentabelle ' + expectedRowTablesData.rowTables[index].short;

                    expectToBe(headingEl.textContent.trim(), expectedHeading);
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
                    const headingDe = getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                    const headingEl = headingDe[0].nativeElement;

                    if (expectedRowTablesData.rowTables[index].disabled) {
                        expectToContain(headingEl.classList, 'text-muted');
                    } else {
                        expect(headingEl.classList).not.toContain('text-muted');
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

                divDes.forEach((divDe, index) => {
                    const anchorDe = getAndExpectDebugElementByCss(divDe, 'div.card-footer a.btn-outline-info', 1, 1);
                    const anchorEl = anchorDe[0].nativeElement;

                    const expectedText = 'Mehr...';

                    expectToBe(anchorEl.textContent.trim(), expectedText);
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
                    const anchorDe = getAndExpectDebugElementByCss(divDe, 'div.card-footer a.btn-outline-info', 1, 1);
                    const anchorEl = anchorDe[0].nativeElement;

                    if (expectedRowTablesData.rowTables[index].disabled) {
                        expectToContain(anchorEl.classList, 'disabled');
                    } else {
                        expect(anchorEl.classList).not.toContain('disabled');
                    }
                });
            });
        });

        describe('[routerLink]', () => {
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
                routerLinks.forEach((routerLink, index) => {
                    const expectedRouterLink = ['../complex' + expectedRowTablesData.rowTables[index].route, 'sheets'];

                    expectToEqual(routerLink.linkParams, expectedRouterLink);
                });
            });

            it('... can get correct queryParams from template', () => {
                routerLinks.forEach((routerLink, index) => {
                    const expectedQueryParams = { id: expectedRowTablesData.rowTables[index].id };

                    expectToEqual(routerLink.queryParams, expectedQueryParams);
                });
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink, index) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = ['../complex' + expectedRowTablesData.rowTables[index].route, 'sheets'];

                    expect(routerLink.navigatedTo).toBeNull();

                    click(linkDe);
                    fixture.detectChanges();

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                });
            });
        });

        describe('#ngOnDestroy()', () => {
            it('... should have cleared isRowTableView$ on destroy (via EditionService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionServiceClearIsRowTablesViewSpy, 1);
            });
        });
    });
});
