import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';
import Spy = jasmine.Spy;

import { click } from '@testing/click-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EDITION_ROW_TABLES_DATA } from '@awg-views/edition-view/data';
import { EditionRowTables } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

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

    beforeEach(async () => {
        mockIsRowTableViewSubject = new ReplaySubject<boolean>(1);

        // Mock edition service
        mockEditionService = {
            updateIsRowTableView: (isView: boolean): void => mockIsRowTableViewSubject.next(isView),
            clearIsRowTableView: (): void => mockIsRowTableViewSubject.next(null),
        };

        // Mock edition data service
        mockEditionDataService = {
            getRowTables: (): EditionRowTables[] => EDITION_ROW_TABLES_DATA,
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

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        editionServiceUpdateIsRowTablesViewSpy = spyOn(mockEditionService, 'updateIsRowTableView').and.callThrough();
        editionServiceClearIsRowTablesViewSpy = spyOn(mockEditionService, 'clearIsRowTableView').and.callThrough();
        editionDataServiceGetRowTablesSpy = spyOn(mockEditionDataService, 'getRowTables').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `rowTablesData`', () => {
            expect(component.rowTablesData).toBeUndefined();
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

        it('... should have received `rowTablesData`', () => {
            expect(component.rowTablesData).toEqual(EDITION_ROW_TABLES_DATA);
        });

        describe('VIEW', () => {
            it('... should contain 1 outer div.row', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
            });

            it('... should contain as many inner div.col as entries in rowTablesData', () => {
                expect(component.rowTablesData.length).toBe(13);

                getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    component.rowTablesData.length,
                    component.rowTablesData.length
                );
            });

            it('... should contain 1 div.card with body and footer in each div.col ', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    component.rowTablesData.length,
                    component.rowTablesData.length
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
                    component.rowTablesData.length,
                    component.rowTablesData.length
                );

                divDes.forEach(divDe => {
                    getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                });
            });

            it('... should display the correct titles in h5.card-title', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    component.rowTablesData.length,
                    component.rowTablesData.length
                );

                divDes.forEach((divDe, index) => {
                    const headingDe = getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                    const headingEl = headingDe[0].nativeElement;

                    const expectedHeading = 'Reihentabelle ' + component.rowTablesData[index].short;

                    expect(headingEl.textContent).toBeTruthy();
                    expect(headingEl.textContent.trim())
                        .withContext(`should be ${expectedHeading}`)
                        .toBe(expectedHeading);
                });
            });

            it('... should text-mute the title of disabled rowtables', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    component.rowTablesData.length,
                    component.rowTablesData.length
                );

                divDes.forEach((divDe, index) => {
                    const headingDe = getAndExpectDebugElementByCss(divDe, 'div.card-body h5.card-title', 1, 1);
                    const headingEl = headingDe[0].nativeElement;

                    if (component.rowTablesData[index].disabled) {
                        expect(headingEl.classList).toContain('text-muted');
                    } else {
                        expect(headingEl.classList).not.toContain('text-muted');
                    }
                });
            });

            it('... should contain 1 anchor button in each div.card-footer', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    component.rowTablesData.length,
                    component.rowTablesData.length
                );

                divDes.forEach(divDe => {
                    getAndExpectDebugElementByCss(divDe, 'div.card-footer a.btn-outline-info', 1, 1);
                });
            });

            it('... should display the correct text in anchor buttons', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    component.rowTablesData.length,
                    component.rowTablesData.length
                );

                divDes.forEach((divDe, index) => {
                    const anchorDe = getAndExpectDebugElementByCss(divDe, 'div.card-footer a.btn-outline-info', 1, 1);
                    const anchorEl = anchorDe[0].nativeElement;

                    const expectedText = 'Mehr...';

                    expect(anchorEl.textContent).toBeTruthy();
                    expect(anchorEl.textContent.trim()).withContext(`should be ${expectedText}`).toBe(expectedText);
                });
            });

            it('... should disable the buttons of disabled rowtables', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    component.rowTablesData.length,
                    component.rowTablesData.length
                );

                divDes.forEach((divDe, index) => {
                    const anchorDe = getAndExpectDebugElementByCss(divDe, 'div.card-footer a.btn-outline-info', 1, 1);
                    const anchorEl = anchorDe[0].nativeElement;

                    if (component.rowTablesData[index].disabled) {
                        expect(anchorEl.classList).toContain('disabled');
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
                    component.rowTablesData.length,
                    component.rowTablesData.length
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
                expect(routerLinks.length)
                    .withContext('should have 13 routerLinks')
                    .toBe(component.rowTablesData.length);

                routerLinks.forEach((routerLink, index) => {
                    const expectedRouterLink = ['../complex' + component.rowTablesData[index].route, 'sheets'];

                    expect(routerLink.linkParams)
                        .withContext(`should equal ${expectedRouterLink}}`)
                        .toEqual(expectedRouterLink);
                });
            });

            it('... can get queryParams from template', () => {
                expect(routerLinks.length)
                    .withContext('should have 13 routerLinks')
                    .toBe(component.rowTablesData.length);

                routerLinks.forEach((routerLink, index) => {
                    const expectedQueryParams = { id: component.rowTablesData[index].id };

                    expect(routerLink.queryParams)
                        .withContext(`should equal ${expectedQueryParams}}`)
                        .toEqual(expectedQueryParams);
                });
            });

            it('... can click all links in template', () => {
                expect(routerLinks.length)
                    .withContext('should have 13 routerLinks')
                    .toBe(component.rowTablesData.length);

                routerLinks.forEach((routerLink, index) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = ['../complex' + component.rowTablesData[index].route, 'sheets'];

                    expect(routerLink.navigatedTo).toBeNull();

                    click(linkDe);
                    fixture.detectChanges();

                    expect(routerLink.navigatedTo)
                        .withContext(`should equal ${expectedRouterLink}`)
                        .toEqual(expectedRouterLink);
                });
            });
        });

        describe('#ngOnDestroy', () => {
            it('... should have cleared isRowTableView$ on destroy (via EditionService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionServiceClearIsRowTablesViewSpy, 1);
            });
        });
    });
});
