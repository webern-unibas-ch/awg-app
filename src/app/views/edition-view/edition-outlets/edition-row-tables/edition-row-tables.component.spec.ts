import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReplaySubject } from 'rxjs';
import Spy = jasmine.Spy;

import { expectSpyCall } from '@testing/expect-helper';

import { EDITION_ROW_TABLES_DATA } from '@awg-views/edition-view/data';
import { EditionRowTables } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { EditionRowTablesComponent } from './edition-row-tables.component';

describe('EditionRowTablesComponent (DONE)', () => {
    let component: EditionRowTablesComponent;
    let fixture: ComponentFixture<EditionRowTablesComponent>;
    let compDe: DebugElement;

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
            imports: [RouterTestingModule],
            declarations: [EditionRowTablesComponent],
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
        it('... should not have rowTablesData', () => {
            expect(component.rowTablesData).toBeUndefined();
        });

        it('... should not have called EditionService', () => {
            expectSpyCall(editionServiceUpdateIsRowTablesViewSpy, 0);
        });

        it('... should not have called EditionDataService', () => {
            expectSpyCall(editionDataServiceGetRowTablesSpy, 0);
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

        it('... should have rowTablesData', () => {
            expect(component.rowTablesData).toEqual(EDITION_ROW_TABLES_DATA);
        });

        describe('#ngOnDestroy', () => {
            it('... should have cleared isRowTableView$ on destroy (via EditionService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionServiceClearIsRowTablesViewSpy, 1);
            });
        });
    });
});
