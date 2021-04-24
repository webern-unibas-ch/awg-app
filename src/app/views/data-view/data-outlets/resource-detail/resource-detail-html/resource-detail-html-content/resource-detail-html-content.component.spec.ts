import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import Spy = jasmine.Spy;

import { JsonConvert } from 'json2typescript';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';

import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockContextJson } from '@testing/mock-data';

import { GndEvent } from '@awg-core/services/gnd-service';
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
    let compEl: any;

    let navigateToResourceSpy: Spy;
    let emitSpy: Spy;

    // Json object
    let jsonConvert: JsonConvert;
    let context: ContextJson;

    let expectedContent: ResourceDetailContent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ResourceDetailHtmlContentComponent,
                    ResourceDetailHtmlContentPropsStubComponent,
                    ResourceDetailHtmlContentImageobjectsStubComponent,
                    ResourceDetailHtmlContentLinkedobjectsStubComponent,
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

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
        emitSpy = spyOn(component.resourceRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `content` inputs', () => {
            expect(component.content).toBeUndefined('should be undefined');
        });

        describe('#navigateToResource', () => {
            it('... should not have been called', () => {
                expect(navigateToResourceSpy).not.toHaveBeenCalled();
                expect(emitSpy).not.toHaveBeenCalled();
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

        it('should have `content` inputs', () => {
            expect(component.content).toBeDefined('should be defined');
            expect(component.content).toBe(expectedContent, `should be expectedIncoming: ${expectedContent}`);
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

                expect(propsCmp.props).toBeDefined();
                expect(propsCmp.props).toBe(expectedContent.props);
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

                expect(imagesCmp.images).toBeDefined();
                expect(imagesCmp.images).toBe(expectedContent.images);
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

                expect(incomingCmp.incomingGroups).toBeDefined();
                expect(incomingCmp.incomingGroups).toBe(expectedContent.incoming);
            });
        });

        describe('#navigateToResource', () => {
            it('... should trigger on event from ResourceDetailHtmlContentPropsComponent', fakeAsync(() => {
                const propsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentPropsStubComponent,
                    1,
                    1
                );
                const propsCmp = propsDes[0].injector.get(
                    ResourceDetailHtmlContentPropsStubComponent
                ) as ResourceDetailHtmlContentPropsStubComponent;

                let id;

                // Undefined
                id = undefined;
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 1, id);

                // Number
                id = 28;
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 2, id);

                // String
                id = '330';
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 3, id);
            }));

            it('... should trigger on event from ResourceDetailHtmlContentLinkedobjectsComponent', fakeAsync(() => {
                const propsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentLinkedobjectsStubComponent,
                    1,
                    1
                );
                const propsCmp = propsDes[0].injector.get(
                    ResourceDetailHtmlContentLinkedobjectsStubComponent
                ) as ResourceDetailHtmlContentLinkedobjectsStubComponent;

                let id;

                // Undefined
                id = undefined;
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 1, id);

                // Number
                id = 28;
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 2, id);

                // String
                id = '330';
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 3, id);
            }));

            it('... should not emit anything if no id is provided', fakeAsync(() => {
                // Props
                const propsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentPropsStubComponent,
                    1,
                    1
                );
                const propsCmp = propsDes[0].injector.get(
                    ResourceDetailHtmlContentPropsStubComponent
                ) as ResourceDetailHtmlContentPropsStubComponent;

                // No id
                propsCmp.resourceRequest.emit(undefined);

                // Id is undefined
                expect(emitSpy).not.toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                // Props
                const propsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentPropsStubComponent,
                    1,
                    1
                );
                const propsCmp = propsDes[0].injector.get(
                    ResourceDetailHtmlContentPropsStubComponent
                ) as ResourceDetailHtmlContentPropsStubComponent;

                let id;

                // Number
                id = 28;
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(emitSpy, 1, id.toString());

                // String
                id = '28';
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(emitSpy, 2, id);
            }));
        });
    });
});
