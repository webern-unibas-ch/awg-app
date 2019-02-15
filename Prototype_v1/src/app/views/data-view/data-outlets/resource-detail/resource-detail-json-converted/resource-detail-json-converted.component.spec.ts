import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { ResourceDetail, ResourceDetailContent } from '@awg-views/data-view/models';

import { ResourceDetailJsonConvertedComponent } from './resource-detail-json-converted.component';

// mock awg-json-viewer component
@Component({ selector: 'awg-json-viewer', template: '' })
class JsonViewerStubComponent {
    @Input()
    jsonViewerHeader: string;
    @Input()
    jsonViewerData: ResourceDetail | ResourceFullResponseJson;
}

describe('ResourceDetailJsonConvertedComponent', () => {
    let component: ResourceDetailJsonConvertedComponent;
    let fixture: ComponentFixture<ResourceDetailJsonConvertedComponent>;
    let compDe: DebugElement;
    let compEl: any;

    const expectedHeader = 'Converted JSON response from Salsah-API';
    let expectedData: ResourceDetail;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailJsonConvertedComponent, JsonViewerStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailJsonConvertedComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedData = new ResourceDetail(
            { objID: '', icon: '', type: '', title: 'test', lastmod: '2019' },
            new ResourceDetailContent()
        );
        expectedData.header = { objID: '', icon: '', type: '', title: 'test', lastmod: '2019' };
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        describe('VIEW', () => {
            it('... should contain one json viewer component (stubbed)', () => {
                const viewerDes = compDe.queryAll(By.directive(JsonViewerStubComponent));

                expect(viewerDes).toBeTruthy();
                expect(viewerDes.length).toBe(1, 'should have only one json viewer');
            });

            it('should NOT have resourceJsonConvertedData', () => {
                expect(component.resourceJsonConvertedData).toBeUndefined();
            });

            it('... should not pass down `resourceJsonConvertedData` to json viewer component', () => {
                const viewerDe = compDe.query(By.directive(JsonViewerStubComponent));
                const viewerCmp = viewerDe.injector.get(JsonViewerStubComponent) as JsonViewerStubComponent;

                expect(viewerCmp.jsonViewerHeader).toBeUndefined();
                expect(viewerCmp.jsonViewerData).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.resourceJsonConvertedData = expectedData;

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass down `resourceJsonConvertedData` to json viewer component', () => {
                const viewerDe = compDe.query(By.directive(JsonViewerStubComponent));
                const viewerCmp = viewerDe.injector.get(JsonViewerStubComponent) as JsonViewerStubComponent;

                expect(viewerCmp.jsonViewerHeader).toBeTruthy();
                expect(viewerCmp.jsonViewerHeader).toBe(expectedHeader, `should have title: ${expectedHeader}`);

                expect(viewerCmp.jsonViewerData).toBeDefined();
                expect(viewerCmp.jsonViewerData).toBe(expectedData, `should have id: ${expectedData}`);
            });
        });
    });
});
