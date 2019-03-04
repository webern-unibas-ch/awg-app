/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import Spy = jasmine.Spy;

import { expectSpyCall } from '@testing/expect-helper';

import {
    ResourceDetail,
    ResourceDetailContent,
    ResourceDetailGroupedIncomingLinks,
    ResourceDetailHeader,
    ResourceDetailImage,
    ResourceDetailProps
} from '@awg-views/data-view/models';

import { ResourceDetailHtmlComponent } from './resource-detail-html.component';

// mock component
@Component({ selector: 'awg-resource-detail-html-content', template: '' })
class ResourceDetailHtmlContentStubComponent {
    @Input()
    content: ResourceDetailContent;
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();
}

describe('ResourceDetailHtmlComponent (DONE)', () => {
    let component: ResourceDetailHtmlComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedResourceDetailData: ResourceDetail;

    let navigateToResourceSpy: Spy;
    let emitSpy: Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailHtmlComponent, ResourceDetailHtmlContentStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        const header: ResourceDetailHeader = { objID: '1234', icon: '', type: '', title: 'Test', lastmod: '' };
        const images: ResourceDetailImage[] = [];
        const incoming = new ResourceDetailGroupedIncomingLinks();
        const props: ResourceDetailProps[] = [
            { pid: '1', guielement: 'text', label: 'Test-Label', value: ['Test1', 'Test2'] }
        ];
        const content: ResourceDetailContent = { props: props, images: images, incoming: incoming };

        expectedResourceDetailData = new ResourceDetail(header, content);

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        navigateToResourceSpy = spyOn(component, 'navigateToResource').and.callThrough();
        emitSpy = spyOn(component.resourceRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `resourceDetailData` inputs', () => {
            expect(component.resourceDetailData).toBeUndefined('should be undefined');
        });

        describe('#navigateToResource', () => {
            it('... should not have been called', () => {
                expect(navigateToResourceSpy).not.toHaveBeenCalled();
                expect(emitSpy).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('should not contain resource detail html content component (stubbed)', () => {
                const htmlContentEl = fixture.debugElement.query(By.directive(ResourceDetailHtmlComponent));
                expect(htmlContentEl).not.toBeTruthy();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.resourceDetailData = expectedResourceDetailData;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `resourceDetailData` inputs', () => {
            expect(component.resourceDetailData).toBeDefined('should be defined');
            expect(component.resourceDetailData).toBe(expectedResourceDetailData);
        });

        describe('VIEW', () => {
            it('should only contain resource detail html content component (stubbed) if content provided', () => {
                let htmlContentDe = compDe.query(By.directive(ResourceDetailHtmlContentStubComponent));
                expect(htmlContentDe).toBeTruthy();

                // provide data without content property
                expectedResourceDetailData.content = null;
                component.resourceDetailData = expectedResourceDetailData;
                fixture.detectChanges();

                htmlContentDe = fixture.debugElement.query(By.directive(ResourceDetailHtmlContentStubComponent));
                expect(htmlContentDe).not.toBeTruthy();
            });

            it('... should pass down `resourceDetailData` to resource detail html content component', () => {
                const htmlContentDe = compDe.query(By.directive(ResourceDetailHtmlContentStubComponent));
                const htmlContentCmp = htmlContentDe.injector.get(
                    ResourceDetailHtmlContentStubComponent
                ) as ResourceDetailHtmlContentStubComponent;

                expect(htmlContentCmp.content).toBeDefined();
                expect(htmlContentCmp.content).toBe(expectedResourceDetailData.content);
            });
        });

        describe('#navigateToResource', () => {
            it('... should trigger on event from child component', fakeAsync(() => {
                const htmlContentDe = compDe.query(By.directive(ResourceDetailHtmlContentStubComponent));
                const htmlContentCmp = htmlContentDe.injector.get(
                    ResourceDetailHtmlContentStubComponent
                ) as ResourceDetailHtmlContentStubComponent;

                let id;

                // undefined
                id = undefined;
                htmlContentCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 1, id);

                // number
                id = 28;
                htmlContentCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 2, id);

                // string
                id = '330';
                htmlContentCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 3, id);
            }));

            it('... should not emit anything if no id is provided', fakeAsync(() => {
                const htmlContentDe = compDe.query(By.directive(ResourceDetailHtmlContentStubComponent));
                const htmlContentCmp = htmlContentDe.injector.get(
                    ResourceDetailHtmlContentStubComponent
                ) as ResourceDetailHtmlContentStubComponent;

                htmlContentCmp.resourceRequest.emit(undefined);

                // id is undefined
                expect(emitSpy).not.toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                const htmlContentDe = compDe.query(By.directive(ResourceDetailHtmlContentStubComponent));
                const htmlContentCmp = htmlContentDe.injector.get(
                    ResourceDetailHtmlContentStubComponent
                ) as ResourceDetailHtmlContentStubComponent;

                let id;

                // number
                id = 28;
                htmlContentCmp.resourceRequest.emit(id);

                expectSpyCall(emitSpy, 1, id.toString());

                // string
                id = '28';
                htmlContentCmp.resourceRequest.emit(id);

                expectSpyCall(emitSpy, 2, id);
            }));
        });
    });
});
