/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

import { EditionDetailComponent } from './edition-detail.component';
import { SharedModule } from '@awg-shared/shared.module';
import {
    ConvoluteFolio,
    EditionSvgFile,
    EditionSvgOverlay,
    Textcritics,
    TextcriticsList
} from '@awg-views/edition-view/models';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService, EditionService } from '@awg-views/edition-view/services';

@Component({ selector: 'awg-edition-detail-notification', template: '' })
class EditionDetailNotificationStubComponent {}

@Component({ selector: 'awg-edition-convolute', template: '' })
class EditionConvoluteStubComponent {
    @Input()
    convoluteData: ConvoluteFolio[];
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
    let getEditionDetailDataSpy: Observable<[ConvoluteFolio[], EditionSvgFile[], TextcriticsList]>;
    let editionServiceStub: Partial<EditionService>;

    beforeEach(async(() => {
        // create a fake DataService object with a `getCurrentSearchResults()` spy
        const dataServiceStub = jasmine.createSpyObj('DataService', ['getEditionDetailData']);
        // make the spies return a synchronous Observable with the test data
        getEditionDetailDataSpy = dataServiceStub.getEditionDetailData.and.returnValue(observableOf()); // TODO: provide real test data

        const expectedTextcritics = []; // TODO: provide real test data
        editionServiceStub = {
            getTextcritics: (textcritics: Textcritics[], overlay: { type: string; id: string }) => expectedTextcritics
        };

        TestBed.configureTestingModule({
            imports: [SharedModule, RouterTestingModule],
            declarations: [
                EditionDetailComponent,
                EditionDetailNotificationStubComponent,
                EditionConvoluteStubComponent,
                EditionAccoladeStubComponent
            ],
            providers: [
                { provide: DataService, useValue: dataServiceStub },
                { provide: EditionService, useValue: editionServiceStub }
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
