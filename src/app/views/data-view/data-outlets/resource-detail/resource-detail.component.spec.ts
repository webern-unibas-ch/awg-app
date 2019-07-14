import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub } from '@testing/router-stubs';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import { ResourceDetail, ResourceDetailHeader } from '@awg-views/data-view/models';
import { ResourceFullResponseJson } from '@awg-shared/api-objects';

import { DataApiService } from '@awg-views/data-view/services';
import { ConversionService, DataStreamerService } from '@awg-core/services';

import { ResourceDetailComponent } from './resource-detail.component';

// mock components
@Component({ selector: 'awg-resource-detail-header', template: '' })
class ResourceDetailHeaderStubComponent {
    @Input()
    header: ResourceDetailHeader;
    @Input()
    resourceUrl: string;

    // TODO: handle outputs
}

@Component({ selector: 'awg-resource-detail-html', template: '' })
class ResourceDetailHtmlStubComponent {
    @Input()
    resourceDetailData: ResourceDetail;

    // TODO: handle outputs
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

    let mockRouter;
    let mockActivatedRoute: ActivatedRouteStub;

    beforeEach(async(() => {
        // stub services for test purposes
        // TODO: provide accurate types and service responses
        const mockConversionService = { prepareResourceData: () => {} };
        const mockDataApiService = { httpGetUrl: '', getResourceData: () => {} };
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

        /*
        mockActivatedRoute.setParamMap({ id: '1234' });
        mockActivatedRoute.paramMap.subscribe(value => console.log(value));
        */

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
