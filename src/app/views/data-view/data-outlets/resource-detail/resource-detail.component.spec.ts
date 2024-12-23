import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import Spy = jasmine.Spy;

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonConvert } from 'json2typescript';
import { of as observableOf } from 'rxjs';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockResourceDetail, mockResourceFullResponseJson } from '@testing/mock-data';
import { ActivatedRouteStub } from '@testing/router-stubs';

import { DataStreamerService, LoadingService } from '@awg-core/services';
import { GndEvent } from '@awg-core/services/gnd-service';
import { DataApiService } from '@awg-views/data-view/services';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { ResourceData, ResourceDetail, ResourceDetailHeader } from '@awg-views/data-view/models';

import { ResourceDetailComponent } from './resource-detail.component';

// Mock components
@Component({
    selector: 'awg-resource-detail-header',
    template: '',
    standalone: false,
})
class ResourceDetailHeaderStubComponent {
    @Input()
    header: ResourceDetailHeader;
    @Input()
    resourceUrl: string;
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();
}

@Component({
    selector: 'awg-resource-detail-html',
    template: '',
    standalone: false,
})
class ResourceDetailHtmlStubComponent {
    @Input()
    resourceDetailData: ResourceDetail;
    @Output()
    gndRequest: EventEmitter<GndEvent> = new EventEmitter();
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();
}

@Component({
    selector: 'awg-resource-detail-json-converted',
    template: '',
    standalone: false,
})
class ResourceDetailJsonConvertedStubComponent {
    @Input()
    resourceJsonConvertedData: ResourceDetail;
}

@Component({
    selector: 'awg-resource-detail-json-raw',
    template: '',
    standalone: false,
})
class ResourceDetailJsonRawStubComponent {
    @Input()
    resourceJsonRawData: ResourceFullResponseJson;
}

@Component({
    selector: 'awg-twelve-tone-spinner',
    template: '',
    standalone: false,
})
class TwelveToneSpinnerStubComponent {}

describe('ResourceDetailComponent', () => {
    let component: ResourceDetailComponent;
    let fixture: ComponentFixture<ResourceDetailComponent>;
    let compDe: DebugElement;

    let mockRouter: Partial<Router>;

    let navigateToSideOutletSpy: Spy;

    // Json object
    let jsonConvert: JsonConvert;
    let expectedResourceFullResponseJson: ResourceFullResponseJson;

    let expectedResourceData: ResourceData;
    let expectedResourceDetailTabTitles: {
        [key: string]: string;
    };

    beforeEach(waitForAsync(() => {
        // Stub services for test purposes
        // TODO: provide accurate types and service responses
        const mockDataApiService = {
            httpGetUrl: '/testUrl',
            getResourceData: () => observableOf(expectedResourceData),
        };
        const mockLoadingService = { getLoadingStatus: () => observableOf(false) };
        const mockDataStreamerService = {
            updateResourceId: () => {
                // Intentional empty test override
            },
        };

        // Router spy object
        mockRouter = {
            url: '/test-url',
            events: observableOf(
                new NavigationEnd(0, 'http://localhost:4200/test-url', 'http://localhost:4200/test-url')
            ),
            navigate: jasmine.createSpy('navigate'),
        };

        // Mocked activated route
        const mockActivatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

        TestBed.configureTestingModule({
            imports: [NgbNavModule],
            declarations: [
                ResourceDetailComponent,
                ResourceDetailHeaderStubComponent,
                ResourceDetailHtmlStubComponent,
                ResourceDetailJsonConvertedStubComponent,
                ResourceDetailJsonRawStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter },
                { provide: DataApiService, useValue: mockDataApiService },
                { provide: DataStreamerService, useValue: mockDataStreamerService },
                { provide: LoadingService, useValue: mockLoadingService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Convert json objects
        jsonConvert = new JsonConvert();
        expectedResourceFullResponseJson = jsonConvert.deserializeObject(
            mockResourceFullResponseJson,
            ResourceFullResponseJson
        );

        // Test data
        expectedResourceData = new ResourceData(expectedResourceFullResponseJson, mockResourceDetail);

        expectedResourceDetailTabTitles = {
            html: 'Detail',
            raw: 'JSON (raw)',
            converted: 'JSON (converted)',
        };

        // Spies
        navigateToSideOutletSpy = spyOn(component, 'navigateToSideOutlet').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `errorMessage`', () => {
            expect(component.errorMessage).toBeUndefined();
        });

        it('... should not have `oldId`', () => {
            expect(component.oldId).toBeUndefined();
        });

        it('... should not have `resourceData`', () => {
            expect(component.resourceData).toBeUndefined();
        });

        it('... should not have `resourceId`', () => {
            expect(component.resourceId).toBeUndefined();
        });

        it('... should have `resourceDetailTabTitles`', () => {
            expectToEqual(component.resourceDetailTabTitles, expectedResourceDetailTabTitles);
        });

        it('... should not have `selectedResourceDetailTabId`', () => {
            expect(component.selectedResourceDetailTabId).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-resource-view`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-resource-view', 1, 1);
            });

            it('... should not display TwelveToneSpinnerComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);
            });

            it('... should contain no `div.awg-error-message`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-error-message', 0, 0);
            });

            it('... should contain no `div.awg-resource-detail-tabs`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-resource-detail-tabs', 0, 0);
            });
        });

        describe('#navigateToSideOutlet()', () => {
            it('... should have a method `navigateToSideOutlet`', () => {
                expect(component.navigateToSideOutlet).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(navigateToSideOutletSpy, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#navigateToSideOutlet()', () => {
            let routerNavigateSpy: Spy;

            beforeEach(() => {
                // Create spy of mockrouter SpyObj
                routerNavigateSpy = mockRouter.navigate as jasmine.Spy;
            });

            it('... should have been called', () => {
                expectSpyCall(navigateToSideOutletSpy, 1);
            });

            it('... should have triggered `router.navigate`', () => {
                expectSpyCall(routerNavigateSpy, 1);
            });

            it('... should tell ROUTER to navigate to `resourceInfo` outlet', () => {
                const expectedRoute = 'resourceInfo';

                // Catch args passed to navigation spy
                const navArgs = routerNavigateSpy.calls.first().args;
                expect(navArgs).toBeDefined();
                expect(navArgs[0]).toBeDefined();
                expect(routerNavigateSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);

                const outletRoute = navArgs[0][0].outlets.side;
                expectToBe(outletRoute, expectedRoute);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // Catch args passed to navigation spy
                const navArgs = routerNavigateSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).toBeDefined();
                expectToBe(navExtras.preserveFragment, true);
                expect(routerNavigateSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });

        describe('#ngOnDestroy()', () => {
            it('... should tell ROUTER to clear side outlet', () => {
                const routerNavigateSpy = mockRouter.navigate as jasmine.Spy;

                component.ngOnDestroy();

                const navArgs = routerNavigateSpy.calls.mostRecent().args;
                expect(navArgs).toBeDefined();
                expect(navArgs[0]).toBeDefined();
                expect(routerNavigateSpy).toHaveBeenCalledWith(navArgs[0]);

                const outletRoute = navArgs[0][0].outlets.side;
                expectToBe(outletRoute, null);
            });
        });
    });
});
