/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of as observableOf } from 'rxjs';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    Folio,
    FolioConvolute,
    FolioConvoluteList,
    TextcriticalComment,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { EditionSheetsComponent } from './edition-sheets.component';

@Component({ selector: 'awg-edition-convolute', template: '' })
class EditionConvoluteStubComponent {
    @Input()
    folioConvoluteData: FolioConvoluteList;
    @Input()
    selectedConvolute: FolioConvolute;
    @Input()
    selectedSvgSheet: EditionSvgSheet;

    // TODO: add outputs
}

@Component({ selector: 'awg-edition-accolade', template: '' })
class EditionAccoladeStubComponent {
    @Input()
    svgSheetsData: EditionSvgSheetList;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Input()
    selectedTextcriticalComments: TextcriticalComment[];
    @Input()
    selectedOverlay: EditionSvgOverlay;
    @Input()
    showTkA: boolean;

    // TODO: add outputs
}

describe('EditionSheetsComponent', () => {
    let component: EditionSheetsComponent;
    let fixture: ComponentFixture<EditionSheetsComponent>;

    let getEditionSheetsDataSpy: Observable<[Folio[], EditionSvgSheet[], TextcriticsList]>;
    let getTextcriticsListSpy;
    let getEditionComplexSpy;

    beforeEach(waitForAsync(() => {
        // Create a fake service object with a `getEditionSheetsData()` spy
        const mockEditionDataService = jasmine.createSpyObj('EditionDataService', ['getEditionSheetsData']);
        // Make the spies return a synchronous Observable with the test data
        getEditionSheetsDataSpy = mockEditionDataService.getEditionSheetsData.and.returnValue(observableOf()); // TODO: provide real test data

        const expectedTextcriticalComments = []; // TODO: provide real test data
        // Create a fake bibliography service object with a `getBibliographyItemDetail()` spy
        const mockEditionService = jasmine.createSpyObj('EditionService', [
            'getTextcriticalComments',
            'getEditionComplex',
        ]);
        // Make the spies return a synchronous Observable with the test data
        getTextcriticsListSpy =
            mockEditionService.getTextcriticalComments.and.returnValue(expectedTextcriticalComments);
        getEditionComplexSpy = mockEditionService.getEditionComplex.and.returnValue(
            observableOf(EDITION_COMPLEXES.OP12)
        );
        /*
        MockEditionService = {
            // getTextcriticalComments: (textcritics: TextcriticalComment[], overlay: { type: string; id: string }) => expectedTextcritics,

        };
    */

        TestBed.configureTestingModule({
            imports: [NgbModalModule, RouterTestingModule],
            declarations: [
                CompileHtmlComponent,
                EditionSheetsComponent,
                EditionConvoluteStubComponent,
                EditionAccoladeStubComponent,
                ModalComponent,
            ],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionService, useValue: mockEditionService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSheetsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });
});
