/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of as observableOf } from 'rxjs';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { Folio, EditionSvgFile, EditionSvgOverlay, Textcritics, TextcriticsList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ModalComponent } from '@awg-shared/modal/modal.component';

import { EditionDetailComponent } from './edition-detail.component';

@Component({ selector: 'awg-edition-detail-notification', template: '' })
class EditionDetailNotificationStubComponent {}

@Component({ selector: 'awg-edition-convolute', template: '' })
class EditionConvoluteStubComponent {
    @Input()
    convoluteData: Folio[];
    @Input()
    selectedSvgFile: EditionSvgFile;

    // TODO: add outputs
}

@Component({ selector: 'awg-edition-accolade', template: '' })
class EditionAccoladeStubComponent {
    @Input()
    svgFileData: EditionSvgFile[];
    @Input()
    selectedSvgFile: EditionSvgFile;
    @Input()
    selectedTextcritics: Textcritics[];
    @Input()
    selectedOverlay: EditionSvgOverlay;
    @Input()
    showTkA: boolean;

    // TODO: add outputs
}

describe('EditionDetailComponent', () => {
    let component: EditionDetailComponent;
    let fixture: ComponentFixture<EditionDetailComponent>;

    let mockEditionService: Partial<EditionService>;
    let getEditionDetailDataSpy: Observable<[Folio[], EditionSvgFile[], TextcriticsList]>;

    beforeEach(async(() => {
        // create a fake service object with a `getEditionDetailData()` spy
        const mockEditionDataService = jasmine.createSpyObj('EditionDataService', ['getEditionDetailData']);
        // make the spies return a synchronous Observable with the test data
        getEditionDetailDataSpy = mockEditionDataService.getEditionDetailData.and.returnValue(observableOf()); // TODO: provide real test data

        const expectedTextcritics = []; // TODO: provide real test data
        mockEditionService = {
            getTextcritics: (textcritics: Textcritics[], overlay: { type: string; id: string }) => expectedTextcritics
        };

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
