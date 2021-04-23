import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ActivatedRouteStub } from '@testing/router-stubs';
import { mockResourceDetail, mockResourceFullResponseJson } from '@testing/mock-data';

import { of as observableOf } from 'rxjs';
import { JsonConvert } from 'json2typescript';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import { DataStreamerService, LoadingService } from '@awg-core/services';
import { GndEvent } from '@awg-core/services/gnd-service';
import { DataApiService } from '@awg-views/data-view/services';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { ResourceData, ResourceDetail, ResourceDetailHeader } from '@awg-views/data-view/models';

import { ResourceDetailComponent } from './resource-detail.component';

// Mock components
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
    gndRequest: EventEmitter<GndEvent> = new EventEmitter();
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

    // Json object
    let jsonConvert: JsonConvert;
    let expectedResourceFullResponseJson: ResourceFullResponseJson;

    let expectedResourceData: ResourceData;

    beforeEach(
        waitForAsync(() => {
            // Stub services for test purposes
            // TODO: provide accurate types and service responses
            const mockDataApiService = {
                httpGetUrl: '/testUrl',
                getResourceData: () => observableOf(expectedResourceData)
            };
            const mockLoadingService = { getLoadingStatus: () => observableOf(false) };
            const mockDataStreamerService = { updateResourceId: () => {} };

            // Router spy object
            mockRouter = jasmine.createSpyObj('Router', ['navigate']);
            // Mocked activated route
            mockActivatedRoute = new ActivatedRouteStub();

            TestBed.configureTestingModule({
                imports: [NgbNavModule],
                declarations: [
                    ResourceDetailComponent,
                    ResourceDetailHeaderStubComponent,
                    ResourceDetailHtmlStubComponent,
                    ResourceDetailJsonConvertedStubComponent,
                    ResourceDetailJsonRawStubComponent,
                    TwelveToneSpinnerStubComponent
                ],
                providers: [
                    { provide: ActivatedRoute, useValue: mockActivatedRoute },
                    { provide: Router, useValue: mockRouter },
                    { provide: DataApiService, useValue: mockDataApiService },
                    { provide: DataStreamerService, useValue: mockDataStreamerService },
                    { provide: LoadingService, useValue: mockLoadingService }
                ]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // MockActivatedRoute.setParamMap({ id: '1234' });
        // MockActivatedRoute.paramMap.subscribe(value => console.log(value));

        // Convert json objects
        jsonConvert = new JsonConvert();
        expectedResourceFullResponseJson = jsonConvert.deserializeObject(
            mockResourceFullResponseJson,
            ResourceFullResponseJson
        );

        // Test data
        expectedResourceData = new ResourceData(expectedResourceFullResponseJson, mockResourceDetail);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
