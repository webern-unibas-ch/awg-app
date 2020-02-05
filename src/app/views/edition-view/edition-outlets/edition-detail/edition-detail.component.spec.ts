/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of as observableOf } from 'rxjs';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import {
    Folio,
    EditionSvgSheet,
    EditionSvgOverlay,
    TextcriticalComment,
    TextcriticsList,
    EditionSvgSheetList,
    FolioConvoluteList,
    EditionWork,
    EditionWorks
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ModalComponent } from '@awg-shared/modal/modal.component';

import { EditionDetailComponent } from './edition-detail.component';

@Component({ selector: 'awg-edition-detail-notification', template: '' })
class EditionDetailNotificationStubComponent {}

@Component({ selector: 'awg-edition-convolute', template: '' })
class EditionConvoluteStubComponent {
    @Input()
    folioConvoluteData: FolioConvoluteList;
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

describe('EditionDetailComponent', () => {
    let component: EditionDetailComponent;
    let fixture: ComponentFixture<EditionDetailComponent>;

    let getEditionDetailDataSpy: Observable<[Folio[], EditionSvgSheet[], TextcriticsList]>;
    let getTextcriticsListSpy;
    let getEditionWorkSpy;

    beforeEach(async(() => {
        // create a fake service object with a `getEditionDetailData()` spy
        const mockEditionDataService = jasmine.createSpyObj('EditionDataService', ['getEditionDetailData']);
        // make the spies return a synchronous Observable with the test data
        getEditionDetailDataSpy = mockEditionDataService.getEditionDetailData.and.returnValue(observableOf()); // TODO: provide real test data

        const expectedTextcriticalComments = []; // TODO: provide real test data
        // create a fake bibliography service object with a `getBibliographyItemDetail()` spy
        const mockEditionService = jasmine.createSpyObj('EditionService', [
            'getTextcriticalComments',
            'getEditionWork'
        ]);
        // make the spies return a synchronous Observable with the test data
        getTextcriticsListSpy = mockEditionService.getTextcriticalComments.and.returnValue(
            expectedTextcriticalComments
        );
        getEditionWorkSpy = mockEditionService.getEditionWork.and.returnValue(observableOf(EditionWorks.op12));
        /*
        mockEditionService = {
            // getTextcriticalComments: (textcritics: TextcriticalComment[], overlay: { type: string; id: string }) => expectedTextcritics,

        };
    */

        TestBed.configureTestingModule({
            imports: [NgbModalModule, RouterTestingModule],
            declarations: [
                CompileHtmlComponent,
                EditionDetailComponent,
                EditionDetailNotificationStubComponent,
                EditionConvoluteStubComponent,
                EditionAccoladeStubComponent,
                ModalComponent
            ],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionService, useValue: mockEditionService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
