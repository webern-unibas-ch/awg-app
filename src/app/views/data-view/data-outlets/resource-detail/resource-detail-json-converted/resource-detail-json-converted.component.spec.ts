import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { ResourceDetail, ResourceDetailContent } from '@awg-views/data-view/models';

import { ResourceDetailJsonConvertedComponent } from './resource-detail-json-converted.component';

// Mock awg-json-viewer component
@Component({ selector: 'awg-json-viewer', template: '' })
class JsonViewerStubComponent {
    @Input()
    jsonViewerHeader: string;
    @Input()
    jsonViewerData: ResourceDetail | ResourceFullResponseJson;
}

describe('ResourceDetailJsonConvertedComponent (DONE)', () => {
    let component: ResourceDetailJsonConvertedComponent;
    let fixture: ComponentFixture<ResourceDetailJsonConvertedComponent>;
    let compDe: DebugElement;

    const expectedHeader = 'Converted JSON response from Salsah-API';
    let expectedData: ResourceDetail;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ResourceDetailJsonConvertedComponent, JsonViewerStubComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailJsonConvertedComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedData = new ResourceDetail(
            { objID: '', icon: '', type: '', title: 'test', lastmod: '2019' },
            new ResourceDetailContent(undefined, undefined, undefined)
        );
        expectedData.header = { objID: '', icon: '', type: '', title: 'test', lastmod: '2019' };
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `resourceJsonConvertedData`', () => {
            expect(component.resourceJsonConvertedData).toBeUndefined();
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

            it('... should not pass down `resourceJsonConvertedData` to json viewer component', () => {
                const viewerDes = getAndExpectDebugElementByDirective(compDe, JsonViewerStubComponent, 1, 1);
                const viewerCmp = viewerDes[0].injector.get(JsonViewerStubComponent) as JsonViewerStubComponent;

                expect(viewerCmp.jsonViewerData).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.resourceJsonConvertedData = expectedData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `resourceJsonConvertedData`', () => {
            expect(component.resourceJsonConvertedData).toBeDefined('should be defined');
            expect(component.resourceJsonConvertedData).toEqual(expectedData, `should equal ${expectedData}`);
        });

        describe('VIEW', () => {
            it('... should pass down `resourceJsonConvertedData` to json viewer component', () => {
                const viewerDes = getAndExpectDebugElementByDirective(compDe, JsonViewerStubComponent, 1, 1);
                const viewerCmp = viewerDes[0].injector.get(JsonViewerStubComponent) as JsonViewerStubComponent;

                expect(viewerCmp.jsonViewerData).toBeDefined();
                expect(viewerCmp.jsonViewerData).toBe(expectedData, `should have data: ${expectedData}`);
            });
        });
    });
});
