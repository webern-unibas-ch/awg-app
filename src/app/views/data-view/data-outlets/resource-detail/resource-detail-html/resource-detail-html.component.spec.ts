/* tslint:disable:no-unused-variable */
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import Spy = jasmine.Spy;

import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import {
    ResourceDetail,
    ResourceDetailContent,
    ResourceDetailGroupedIncomingLinks,
    ResourceDetailHeader,
    ResourceDetailImage,
    ResourceDetailProperty
} from '@awg-views/data-view/models';
import { GndEvent } from '@awg-core/services/gnd-service';

import { ResourceDetailHtmlComponent } from './resource-detail-html.component';

// mock component
@Component({ selector: 'awg-resource-detail-html-content', template: '' })
class ResourceDetailHtmlContentStubComponent {
    @Input()
    content: ResourceDetailContent;
    @Output()
    gndRequest: EventEmitter<GndEvent> = new EventEmitter();
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

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ResourceDetailHtmlComponent, ResourceDetailHtmlContentStubComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        const header: ResourceDetailHeader = { objID: '1234', icon: '', type: '', title: 'Test', lastmod: '' };
        const images: ResourceDetailImage[] = [];
        const incoming = [new ResourceDetailGroupedIncomingLinks()];
        const props: ResourceDetailProperty[] = [
            new ResourceDetailProperty('1', 'text', 'Test-Label', ['Test1', 'Test2'])
        ];
        const content: ResourceDetailContent = { props, images, incoming };

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
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentStubComponent, 0, 0);
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
            it('should contain resource detail html content component (stubbed)', () => {
                const htmlContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentStubComponent,
                    1,
                    1
                );
            });

            it('should contain resource detail html content component (stubbed) only if content provided', () => {
                const firstContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentStubComponent,
                    1,
                    1
                );

                // provide data without content property
                expectedResourceDetailData = new ResourceDetail(undefined, undefined);

                // simulate the host parent setting the new input properties
                component.resourceDetailData = expectedResourceDetailData;
                fixture.detectChanges();

                // TODO: should be 0
                //  check angular defect with testing under ChangeDetectionStrategy.OnPush : https://github.com/angular/angular/issues/12313

                const newContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentStubComponent,
                    1,
                    1
                );
                const newContentEl = newContentDes[0].nativeElement;

                expect(newContentEl.innerHTML).toBeDefined();
                expect(newContentEl.innerHTML).toBe('', 'should be empty string');
            });

            it('... should pass down `resourceDetailData` to resource detail html content component', () => {
                const htmlContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentStubComponent,
                    1,
                    1
                );
                const htmlContentCmp = htmlContentDes[0].injector.get(
                    ResourceDetailHtmlContentStubComponent
                ) as ResourceDetailHtmlContentStubComponent;

                expect(htmlContentCmp.content).toBeDefined();
                expect(htmlContentCmp.content).toBe(expectedResourceDetailData.content);
            });
        });

        describe('#navigateToResource', () => {
            it('... should trigger on event from ResourceDetailHtmlContentComponent', fakeAsync(() => {
                const htmlContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentStubComponent,
                    1,
                    1
                );
                const htmlContentCmp = htmlContentDes[0].injector.get(
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
                const htmlContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentStubComponent,
                    1,
                    1
                );
                const htmlContentCmp = htmlContentDes[0].injector.get(
                    ResourceDetailHtmlContentStubComponent
                ) as ResourceDetailHtmlContentStubComponent;

                // id is undefined
                htmlContentCmp.resourceRequest.emit(undefined);

                expectSpyCall(navigateToResourceSpy, 1, undefined);
                expect(emitSpy).not.toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                const htmlContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentStubComponent,
                    1,
                    1
                );
                const htmlContentCmp = htmlContentDes[0].injector.get(
                    ResourceDetailHtmlContentStubComponent
                ) as ResourceDetailHtmlContentStubComponent;

                let id;

                // number
                id = 28;
                htmlContentCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 1, id);
                expectSpyCall(emitSpy, 1, id.toString());

                // string
                id = '28';
                htmlContentCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 2, id);
                expectSpyCall(emitSpy, 2, id);
            }));
        });
    });
});
