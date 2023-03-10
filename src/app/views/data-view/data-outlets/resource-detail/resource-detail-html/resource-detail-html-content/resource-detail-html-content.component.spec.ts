import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { JsonConvert } from 'json2typescript';

import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockContextJson } from '@testing/mock-data';

import { GndEvent, GndEventType } from '@awg-core/services/gnd-service';
import { ContextJson } from '@awg-shared/api-objects';
import {
    ResourceDetailContent,
    ResourceDetailGroupedIncomingLinks,
    ResourceDetailImage,
    ResourceDetailProperty,
} from '@awg-views/data-view/models';

import { ResourceDetailHtmlContentComponent } from './resource-detail-html-content.component';

// Mock components
@Component({ selector: 'awg-resource-detail-html-content-props', template: '' })
class ResourceDetailHtmlContentPropsStubComponent {
    @Input()
    props: ResourceDetailProperty[];
    @Output()
    gndRequest: EventEmitter<GndEvent> = new EventEmitter();
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-resource-detail-html-content-imageobjects', template: '' })
class ResourceDetailHtmlContentImageobjectsStubComponent {
    @Input()
    images: NgxGalleryImage[];
}

@Component({ selector: 'awg-resource-detail-html-content-linkedobjects', template: '' })
class ResourceDetailHtmlContentLinkedobjectsStubComponent {
    @Input()
    incomingGroups: ResourceDetailGroupedIncomingLinks[];
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();
}

describe('ResourceDetailHtmlContentComponent (DONE)', () => {
    let component: ResourceDetailHtmlContentComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentComponent>;
    let compDe: DebugElement;

    let exposeGndSpy: Spy;
    let navigateToResourceSpy: Spy;
    let gndRequestEmitSpy: Spy;
    let resourceRequestEmitSpy: Spy;

    // Json object
    let jsonConvert: JsonConvert;
    let context: ContextJson;

    let expectedContent: ResourceDetailContent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ResourceDetailHtmlContentComponent,
                ResourceDetailHtmlContentPropsStubComponent,
                ResourceDetailHtmlContentImageobjectsStubComponent,
                ResourceDetailHtmlContentLinkedobjectsStubComponent,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Convert json object
        jsonConvert = new JsonConvert();
        context = jsonConvert.deserializeObject(mockContextJson, ContextJson);

        // Test data
        const images: ResourceDetailImage[] = [
            new ResourceDetailImage(context, 0),
            new ResourceDetailImage(context, 1),
        ];
        const incoming = [new ResourceDetailGroupedIncomingLinks()];
        const props: ResourceDetailProperty[] = [
            new ResourceDetailProperty('1', 'text', 'Test-Label', ['Test1', 'Test2']),
        ];
        expectedContent = new ResourceDetailContent(props, images, incoming);

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
        it('... should not have `content` inputs', () => {
            expect(component.content).withContext('should be undefined').toBeUndefined();
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
            it('... should contain one div.awg-resource-content', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-resource-content', 1, 1);
            });

            it('... should contain one div.row with two div.cols', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-resource-content > div.row', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.row > div.col-lg-8', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.row > div.col-lg-4', 1, 1);
            });

            it('... should contain one div.sidenav-right', () => {
                getAndExpectDebugElementByCss(compDe, 'div.col-lg-4 > div.sidenav-right', 1, 1);
            });

            it('... should contain one ResourceDetailHtmlContentPropsComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentPropsStubComponent, 1, 1);
            });

            it('... should contain one ResourceDetailHtmlContentImageobjectsComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentImageobjectsStubComponent, 1, 1);
            });

            it('... should contain one ResourceDetailHtmlContentLinkedobjectsComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentLinkedobjectsStubComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.content = expectedContent;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `content` inputs', () => {
            expect(component.content).withContext('should be defined').toBeDefined();
            expect(component.content)
                .withContext(`should be expectedIncoming: ${expectedContent}`)
                .toBe(expectedContent);
        });

        describe('VIEW', () => {
            it('... should pass down `content.props` to ResourceDetailHtmlContentPropsComponent', () => {
                // Get debug and native element of stubbed child
                const propsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentPropsStubComponent,
                    1,
                    1
                );
                const propsCmp = propsDes[0].injector.get(
                    ResourceDetailHtmlContentPropsStubComponent
                ) as ResourceDetailHtmlContentPropsStubComponent;

                expect(propsCmp.props).withContext('should be defined').toBeDefined();
                expect(propsCmp.props).withContext(`should be ${expectedContent.props}`).toBe(expectedContent.props);
            });

            it('... should pass down `content.images` to ResourceDetailHtmlContentImageobjectsComponent', () => {
                // Get debug and native element of stubbed child
                const imagesDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentImageobjectsStubComponent,
                    1,
                    1
                );
                const imagesCmp = imagesDes[0].injector.get(
                    ResourceDetailHtmlContentImageobjectsStubComponent
                ) as ResourceDetailHtmlContentImageobjectsStubComponent;

                expect(imagesCmp.images).withContext('should be defined').toBeDefined();
                expect(imagesCmp.images)
                    .withContext(`should be ${expectedContent.images}`)
                    .toBe(expectedContent.images);
            });

            it('... should pass down `content.incoming` to ResourceDetailHtmlContentLinkedobjectsComponent', () => {
                // Get debug and native element of stubbed child
                const incomingDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentLinkedobjectsStubComponent,
                    1,
                    1
                );
                const incomingCmp = incomingDes[0].injector.get(
                    ResourceDetailHtmlContentLinkedobjectsStubComponent
                ) as ResourceDetailHtmlContentLinkedobjectsStubComponent;

                expect(incomingCmp.incomingGroups).withContext('should be defined').toBeDefined();
                expect(incomingCmp.incomingGroups)
                    .withContext(`should be ${expectedContent.incoming}`)
                    .toBe(expectedContent.incoming);
            });
        });

        describe('#exposeGnd()', () => {
            let htmlContentDes;
            let htmlContentCmp;
            let gndEvent: GndEvent;

            beforeEach(() => {
                htmlContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentPropsStubComponent,
                    1,
                    1
                );
                htmlContentCmp = htmlContentDes[0].injector.get(
                    ResourceDetailHtmlContentPropsStubComponent
                ) as ResourceDetailHtmlContentPropsStubComponent;
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
            let propsDes;
            let propsCmp;
            let linkObjDes;
            let linkObjCmp;
            let id;

            beforeEach(() => {
                propsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentPropsStubComponent,
                    1,
                    1
                );
                propsCmp = propsDes[0].injector.get(
                    ResourceDetailHtmlContentPropsStubComponent
                ) as ResourceDetailHtmlContentPropsStubComponent;

                linkObjDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentLinkedobjectsStubComponent,
                    1,
                    1
                );
                linkObjCmp = linkObjDes[0].injector.get(
                    ResourceDetailHtmlContentLinkedobjectsStubComponent
                ) as ResourceDetailHtmlContentLinkedobjectsStubComponent;
            });

            describe('... should trigger on event', () => {
                describe('... from ResourceDetailHtmlContentPropsComponent if', () => {
                    it('... id is undefined', fakeAsync(() => {
                        id = undefined;
                        propsCmp.resourceRequest.emit(id);

                        expectSpyCall(navigateToResourceSpy, 1, id);
                    }));

                    it('... id is a number', fakeAsync(() => {
                        id = 28;
                        propsCmp.resourceRequest.emit(id);

                        expectSpyCall(navigateToResourceSpy, 1, id);
                    }));

                    it('... id is a string', fakeAsync(() => {
                        id = '330';
                        propsCmp.resourceRequest.emit(id);

                        expectSpyCall(navigateToResourceSpy, 1, id);
                    }));
                });

                describe('... from ResourceDetailHtmlContentLinkedobjectsComponent if', () => {
                    it('... id is undefined', fakeAsync(() => {
                        id = undefined;
                        linkObjCmp.resourceRequest.emit(id);

                        expectSpyCall(navigateToResourceSpy, 1, id);
                    }));

                    it('... id is a number', fakeAsync(() => {
                        id = 28;
                        linkObjCmp.resourceRequest.emit(id);

                        expectSpyCall(navigateToResourceSpy, 1, id);
                    }));

                    it('... id is a string', fakeAsync(() => {
                        id = '330';
                        linkObjCmp.resourceRequest.emit(id);

                        expectSpyCall(navigateToResourceSpy, 1, id);
                    }));
                });
            });

            describe('... should not emit anything if', () => {
                it('... id is undefined', fakeAsync(() => {
                    propsCmp.resourceRequest.emit(undefined);

                    expectSpyCall(navigateToResourceSpy, 1, undefined);
                    expectSpyCall(resourceRequestEmitSpy, 0);
                }));

                it('... id is null', fakeAsync(() => {
                    propsCmp.resourceRequest.emit(null);

                    expectSpyCall(navigateToResourceSpy, 1, null);
                    expectSpyCall(resourceRequestEmitSpy, 0);
                }));

                it('... id is empty string', fakeAsync(() => {
                    propsCmp.resourceRequest.emit('');

                    expectSpyCall(navigateToResourceSpy, 1, '');
                    expectSpyCall(resourceRequestEmitSpy, 0);
                }));
            });

            describe('... should emit provided resource id (as string) on click with', () => {
                it('... number input', fakeAsync(() => {
                    // Number
                    id = 28;
                    propsCmp.resourceRequest.emit(id);

                    expectSpyCall(navigateToResourceSpy, 1, id);
                    expectSpyCall(resourceRequestEmitSpy, 1, id.toString());
                }));

                it('... string input', fakeAsync(() => {
                    // String
                    id = '28';
                    propsCmp.resourceRequest.emit(id);

                    expectSpyCall(navigateToResourceSpy, 1, id);
                    expectSpyCall(resourceRequestEmitSpy, 1, id.toString());
                }));
            });
        });
    });
});
