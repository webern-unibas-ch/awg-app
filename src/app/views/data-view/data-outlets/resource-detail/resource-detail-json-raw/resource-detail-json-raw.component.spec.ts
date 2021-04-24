import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { ResourceDetail } from '@awg-views/data-view/models';

import { ResourceDetailJsonRawComponent } from './resource-detail-json-raw.component';

// Mock awg-json-viewer component
@Component({ selector: 'awg-json-viewer', template: '' })
class JsonViewerStubComponent {
    @Input()
    jsonViewerHeader: string;
    @Input()
    jsonViewerData: ResourceDetail | ResourceFullResponseJson;
}

describe('ResourceDetailJsonRawComponent (DONE)', () => {
    let component: ResourceDetailJsonRawComponent;
    let fixture: ComponentFixture<ResourceDetailJsonRawComponent>;
    let compDe: DebugElement;
    let compEl: any;

    const expectedHeader = 'Raw JSON response from Salsah-API';
    let expectedData: ResourceFullResponseJson;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ResourceDetailJsonRawComponent, JsonViewerStubComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailJsonRawComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedData = new ResourceFullResponseJson();
        expectedData.status = 1;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `resourceJsonRawData`', () => {
            expect(component.resourceJsonRawData).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one json viewer component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, JsonViewerStubComponent, 1, 1);
            });

            it('... should display `jsonViewerHeader`', () => {
                const viewerDes = getAndExpectDebugElementByDirective(compDe, JsonViewerStubComponent, 1, 1);
                const viewerCmp = viewerDes[0].injector.get(JsonViewerStubComponent) as JsonViewerStubComponent;

                expect(viewerCmp.jsonViewerHeader).toBeDefined();
                expect(viewerCmp.jsonViewerHeader).toBe(expectedHeader, `should have header: ${expectedHeader}`);
            });

            it('... should not pass down `resourceJsonRawData` to json viewer component', () => {
                const viewerDes = getAndExpectDebugElementByDirective(compDe, JsonViewerStubComponent, 1, 1);
                const viewerCmp = viewerDes[0].injector.get(JsonViewerStubComponent) as JsonViewerStubComponent;

                expect(viewerCmp.jsonViewerData).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.resourceJsonRawData = expectedData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass down `resourceJsonRawData` to json viewer component', () => {
                const viewerDes = getAndExpectDebugElementByDirective(compDe, JsonViewerStubComponent, 1, 1);
                const viewerCmp = viewerDes[0].injector.get(JsonViewerStubComponent) as JsonViewerStubComponent;

                expect(viewerCmp.jsonViewerData).toBeDefined();
                expect(viewerCmp.jsonViewerData).toBe(expectedData, `should have data: ${expectedData}`);
            });
        });
    });
});
