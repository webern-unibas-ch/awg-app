import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ActivatedRouteStub } from '@testing/router-stubs';
import { mockResourceDetail, mockResourceFullResponseJson } from '@testing/mock-data';

import { of as observableOf } from 'rxjs';
import { JsonConvert } from 'json2typescript';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import { ConversionService, DataStreamerService, LoadingService } from '@awg-core/services';
import { DataApiService } from '@awg-views/data-view/services';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { ResourceData, ResourceDetail, ResourceDetailHeader } from '@awg-views/data-view/models';

import { ResourceDetailComponent } from './resource-detail.component';

// mock components
@Component({ selector: 'awg-resource-detail-header', template: '' })
class ResourceDetailHeaderStubComponent {
    @Input()
    header: ResourceDetailHeader;
    @Input()
    resourceUrl: string;
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-resource-detail-html', template: '' })
class ResourceDetailHtmlStubComponent {
    @Input()
    resourceDetailData: ResourceDetail;
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-resource-detail-json-converted', template: '' })
class ResourceDetailJsonConvertedStubComponent {
    @Input()
    resourceJsonConvertedData: ResourceDetail;
}

@Component({ selector: 'awg-resource-detail-json-raw', template: '' })
class ResourceDetailJsonRawStubComponent {
    @Input()
    resourceJsonRawData: ResourceFullResponseJson;
}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('ResourceDetailComponent', () => {
    let component: ResourceDetailComponent;
    let fixture: ComponentFixture<ResourceDetailComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockRouter: Spy;
    let mockActivatedRoute: ActivatedRouteStub;

    // json object
    let jsonConvert: JsonConvert;
    let expectedResourceFullResponseJson: ResourceFullResponseJson;

    let expectedResourceData: ResourceData;

    beforeEach(async(() => {
        // stub services for test purposes
        // TODO: provide accurate types and service responses
        const mockConversionService = { prepareResourceData: () => {} };
        const mockDataApiService = {
            httpGetUrl: '',
            getResourceData: () => observableOf(expectedResourceData)
        };
        const mockLoadingService = { getLoadingStatus: () => observableOf(false) };
        const mockStreamerService = { updateResourceId: () => {} };

        // router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        // mocked activated route
        mockActivatedRoute = new ActivatedRouteStub();

        TestBed.configureTestingModule({
            imports: [NgbTabsetModule],
            declarations: [
                ResourceDetailComponent,
                ResourceDetailHeaderStubComponent,
                ResourceDetailHtmlStubComponent,
                ResourceDetailJsonConvertedStubComponent,
                ResourceDetailJsonRawStubComponent,
                TwelveToneSpinnerStubComponent
            ],
            providers: [
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: ConversionService, useValue: mockConversionService },
                { provide: DataApiService, useValue: mockDataApiService },
                { provide: DataStreamerService, useValue: mockStreamerService },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        mockActivatedRoute.setParamMap({ id: '1234' });
        mockActivatedRoute.paramMap.subscribe(value => console.log(value));

        // convert json objects
        jsonConvert = new JsonConvert();
        expectedResourceFullResponseJson = jsonConvert.deserializeObject(
            mockResourceFullResponseJson,
            ResourceFullResponseJson
        );

        // test data
        expectedResourceData = new ResourceData(expectedResourceFullResponseJson, mockResourceDetail);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
