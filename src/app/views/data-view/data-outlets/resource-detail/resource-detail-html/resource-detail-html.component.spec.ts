/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { GndEvent, GndEventType } from '@awg-core/services/gnd-service';
import {
    ResourceDetail,
    ResourceDetailContent,
    ResourceDetailGroupedIncomingLinks,
    ResourceDetailHeader,
    ResourceDetailImage,
    ResourceDetailProperty,
} from '@awg-views/data-view/models';

import { ResourceDetailHtmlComponent } from './resource-detail-html.component';

// Mock component
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

    let expectedResourceDetailData: ResourceDetail;

    let exposeGndSpy: Spy;
    let navigateToResourceSpy: Spy;
    let gndRequestEmitSpy: Spy;
    let resourceRequestEmitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailHtmlComponent, ResourceDetailHtmlContentStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        const header: ResourceDetailHeader = { objID: '1234', icon: '', type: '', title: 'Test', lastmod: '' };
        const images: ResourceDetailImage[] = [];
        const incoming = [new ResourceDetailGroupedIncomingLinks()];
        const props: ResourceDetailProperty[] = [
            new ResourceDetailProperty('1', 'text', 'Test-Label', ['Test1', 'Test2']),
        ];
        const content: ResourceDetailContent = { props, images, incoming };

        expectedResourceDetailData = new ResourceDetail(header, content);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        navigateToResourceSpy = spyOn(component, 'navigateToResource').and.callThrough();
        exposeGndSpy = spyOn(component, 'exposeGnd').and.callThrough();
        gndRequestEmitSpy = spyOn(component.gndRequest, 'emit').and.callThrough();
        resourceRequestEmitSpy = spyOn(component.resourceRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `resourceDetailData` inputs', () => {
            expect(component.resourceDetailData).toBeUndefined();
        });

        describe('#exposeGnd()', () => {
            it('... should have a method `exposeGnd`', () => {
                expect(component.exposeGnd).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(exposeGndSpy).not.toHaveBeenCalled();
                expect(gndRequestEmitSpy).not.toHaveBeenCalled();
            });
        });

        describe('#navigateToResource()', () => {
            it('... should have a method `navigateToResource`', () => {
                expect(component.navigateToResource).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(navigateToResourceSpy).not.toHaveBeenCalled();
                expect(resourceRequestEmitSpy).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should not contain resource detail html content component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.resourceDetailData = expectedResourceDetailData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `resourceDetailData` inputs', () => {
            expect(component.resourceDetailData).withContext('should be defined').toBeDefined();
            expect(component.resourceDetailData)
                .withContext(`should be ${expectedResourceDetailData}`)
                .toBe(expectedResourceDetailData);
        });

        describe('VIEW', () => {
            it('... should contain resource detail html content component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentStubComponent, 1, 1);
            });

            it('... should contain resource detail html content component (stubbed) only if content provided', () => {
                // Provide data without content property
                expectedResourceDetailData = new ResourceDetail(undefined, undefined);

                // Simulate the host parent setting the new input properties
                component.resourceDetailData = expectedResourceDetailData;
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentStubComponent, 0, 0);
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
                expect(htmlContentCmp.content)
                    .withContext(`should be ${expectedResourceDetailData.content}`)
                    .toBe(expectedResourceDetailData.content);
            });
        });

        describe('#exposeGnd()', () => {
            let htmlContentDes;
            let htmlContentCmp;
            let gndEvent: GndEvent;

            beforeEach(() => {
                htmlContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentStubComponent,
                    1,
                    1
                );
                htmlContentCmp = htmlContentDes[0].injector.get(
                    ResourceDetailHtmlContentStubComponent
                ) as ResourceDetailHtmlContentStubComponent;
            });

            describe('... should trigger on event from ResourceDetailHtmlContentComponent if', () => {
                it('... gndEvent is undefined', fakeAsync(() => {
                    gndEvent = undefined;
                    htmlContentCmp.gndRequest.emit(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, gndEvent);
                }));

                it('... gndEvent is SET', fakeAsync(() => {
                    gndEvent = new GndEvent(GndEventType.SET, '123');
                    htmlContentCmp.gndRequest.emit(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, gndEvent);
                }));

                it('... gndEvent is GET', fakeAsync(() => {
                    gndEvent = new GndEvent(GndEventType.GET, '123');
                    htmlContentCmp.gndRequest.emit(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, gndEvent);
                }));

                it('... gndEvent is REMOVE', fakeAsync(() => {
                    gndEvent = new GndEvent(GndEventType.REMOVE, '123');
                    htmlContentCmp.gndRequest.emit(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, gndEvent);
                }));
            });

            describe('... should not emit anything if', () => {
                it('... gndEvent is undefined', fakeAsync(() => {
                    gndEvent = undefined;
                    htmlContentCmp.gndRequest.emit(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, undefined);
                    expectSpyCall(gndRequestEmitSpy, 0);
                }));

                it('... gndEvent is null', fakeAsync(() => {
                    gndEvent = null;
                    htmlContentCmp.gndRequest.emit(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, null);
                    expectSpyCall(gndRequestEmitSpy, 0);
                }));

                it('... gndEvent type is undefined', fakeAsync(() => {
                    gndEvent = new GndEvent(undefined, '123');
                    htmlContentCmp.gndRequest.emit(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, null);
                    expectSpyCall(gndRequestEmitSpy, 0);
                }));
            });

            describe('... should emit provided gndEvent on click with', () => {
                it('... SET event', fakeAsync(() => {
                    gndEvent = new GndEvent(GndEventType.SET, '123');
                    htmlContentCmp.gndRequest.emit(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, gndEvent);
                    expectSpyCall(gndRequestEmitSpy, 1, gndEvent);
                }));

                it('... GET event', fakeAsync(() => {
                    gndEvent = new GndEvent(GndEventType.GET, '123');
                    htmlContentCmp.gndRequest.emit(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, gndEvent);
                    expectSpyCall(gndRequestEmitSpy, 1, gndEvent);
                }));

                it('... REMOVE event', fakeAsync(() => {
                    gndEvent = new GndEvent(GndEventType.REMOVE, '123');
                    htmlContentCmp.gndRequest.emit(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, gndEvent);
                    expectSpyCall(gndRequestEmitSpy, 1, gndEvent);
                }));
            });
        });

        describe('#navigateToResource()', () => {
            let htmlContentDes;
            let htmlContentCmp;
            let id;

            beforeEach(() => {
                htmlContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentStubComponent,
                    1,
                    1
                );
                htmlContentCmp = htmlContentDes[0].injector.get(
                    ResourceDetailHtmlContentStubComponent
                ) as ResourceDetailHtmlContentStubComponent;
            });

            describe('... should trigger on event from ResourceDetailHtmlContentComponent if', () => {
                it('... id is undefined', fakeAsync(() => {
                    id = undefined;
                    htmlContentCmp.resourceRequest.emit(id);

                    expectSpyCall(navigateToResourceSpy, 1, id);
                }));

                it('... id is a number', fakeAsync(() => {
                    id = 28;
                    htmlContentCmp.resourceRequest.emit(id);

                    expectSpyCall(navigateToResourceSpy, 1, id);
                }));

                it('... id is a string', fakeAsync(() => {
                    id = '330';
                    htmlContentCmp.resourceRequest.emit(id);

                    expectSpyCall(navigateToResourceSpy, 1, id);
                }));
            });

            describe('... should not emit anything if', () => {
                it('... id is undefined', fakeAsync(() => {
                    htmlContentCmp.resourceRequest.emit(undefined);

                    expectSpyCall(navigateToResourceSpy, 1, undefined);
                    expectSpyCall(resourceRequestEmitSpy, 0);
                }));

                it('... id is null', fakeAsync(() => {
                    htmlContentCmp.resourceRequest.emit(null);

                    expectSpyCall(navigateToResourceSpy, 1, null);
                    expectSpyCall(resourceRequestEmitSpy, 0);
                }));

                it('... id is empty string', fakeAsync(() => {
                    htmlContentCmp.resourceRequest.emit('');

                    expectSpyCall(navigateToResourceSpy, 1, '');
                    expectSpyCall(resourceRequestEmitSpy, 0);
                }));
            });

            describe('... should emit provided resource id (as string) on click with', () => {
                it('... number input', fakeAsync(() => {
                    id = 28;
                    htmlContentCmp.resourceRequest.emit(id);

                    expectSpyCall(navigateToResourceSpy, 1, id);
                    expectSpyCall(resourceRequestEmitSpy, 1, id.toString());
                }));

                it('... string input', fakeAsync(() => {
                    id = '28';
                    htmlContentCmp.resourceRequest.emit(id);

                    expectSpyCall(navigateToResourceSpy, 1, id);
                    expectSpyCall(resourceRequestEmitSpy, 1, id.toString());
                }));
            });
        });
    });
});
