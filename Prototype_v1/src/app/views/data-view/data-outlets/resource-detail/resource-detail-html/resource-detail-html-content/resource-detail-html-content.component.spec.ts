import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import Spy = jasmine.Spy;

import { JsonConvert } from 'json2typescript';

import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';
import { mockContextJson } from '@testing/mock-data/mockContextJson';

import { ContextJson } from '@awg-shared/api-objects';
import {
    ResourceDetailContent,
    ResourceDetailGroupedIncomingLinks,
    ResourceDetailImage,
    ResourceDetailProps
} from '@awg-views/data-view/models';

import { ResourceDetailHtmlContentComponent } from './resource-detail-html-content.component';

// mock components
@Component({ selector: 'awg-resource-detail-html-content-props', template: '' })
class ResourceDetailHtmlContentPropsStubComponent {
    @Input()
    props: ResourceDetailProps[];
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-resource-detail-html-content-imageobjects', template: '' })
class ResourceDetailHtmlContentImageobjectsStubComponent {
    @Input()
    images: ResourceDetailImage[];
}

@Component({ selector: 'awg-resource-detail-html-content-linkedobjects', template: '' })
class ResourceDetailHtmlContentLinkedobjectsStubComponent {
    @Input()
    incoming: ResourceDetailGroupedIncomingLinks;
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

    // json object
    let jsonConvert: JsonConvert;
    let context: ContextJson;

    let expectedContent: ResourceDetailContent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ResourceDetailHtmlContentComponent,
                ResourceDetailHtmlContentPropsStubComponent,
                ResourceDetailHtmlContentImageobjectsStubComponent,
                ResourceDetailHtmlContentLinkedobjectsStubComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // convert json object
        jsonConvert = new JsonConvert();
        context = jsonConvert.deserializeObject(mockContextJson, ContextJson);

        // test data
        const images: ResourceDetailImage[] = [
            new ResourceDetailImage(context, 0),
            new ResourceDetailImage(context, 1)
        ];
        const incoming = new ResourceDetailGroupedIncomingLinks();
        const props: ResourceDetailProps[] = [
            { pid: '1', guielement: 'text', label: 'Test-Label', value: ['Test1', 'Test2'] }
        ];
        expectedContent = { props: props, images: images, incoming: incoming };

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

            it('... should not contain ResourceDetailHtmlContentPropsComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentPropsStubComponent, 0, 0);
            });

            it('... should not contain ResourceDetailHtmlContentImageobjectsComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentImageobjectsStubComponent, 0, 0);
            });

            it('... should not contain ResourceDetailHtmlContentLinkedobjectsComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentLinkedobjectsStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.content = expectedContent;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `content` inputs', () => {
            expect(component.content).toBeDefined('should be defined');
            expect(component.content).toBe(expectedContent, `should be expectedIncoming: ${expectedContent}`);
        });

        describe('VIEW', () => {
            it('... should contain one ResourceDetailHtmlContentPropsComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentPropsStubComponent, 1, 1);
            });

            it('... should contain one ResourceDetailHtmlContentImageobjectsComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentImageobjectsStubComponent, 1, 1);
            });

            it('... should contain one ResourceDetailHtmlContentLinkedobjectsComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentLinkedobjectsStubComponent, 1, 1);
            });

            it('... should contain one ResourceDetailHtmlContentPropsComponent (stubbed) only if props provided', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentPropsStubComponent, 1, 1);

                // provide data without props property
                expectedContent.props = null;
                component.content = expectedContent;
                fixture.detectChanges();

                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentPropsStubComponent, 0, 0);
            });

            it('... should contain one ResourceDetailHtmlContentImageobjectsComponent (stubbed) only if images provided', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentImageobjectsStubComponent, 1, 1);

                // provide data without images property
                expectedContent.images = [];
                component.content = expectedContent;
                fixture.detectChanges();

                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentImageobjectsStubComponent, 0, 0);
            });

            it('... should contain one ResourceDetailHtmlContentLinkedobjectsComponent (stubbed) only if incoming provided', () => {
                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentLinkedobjectsStubComponent, 1, 1);

                // provide data without incoming property
                expectedContent.incoming = null;
                component.content = expectedContent;
                fixture.detectChanges();

                getAndExpectDebugElementByDirective(compDe, ResourceDetailHtmlContentLinkedobjectsStubComponent, 0, 0);
            });

            it('... should pass down `content.props` to ResourceDetailHtmlContentPropsComponent', () => {
                // get debug and native element of stubbed child
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
                // get debug and native element of stubbed child
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
                // get debug and native element of stubbed child
                const incomingDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentLinkedobjectsStubComponent,
                    1,
                    1
                );
                const incomingCmp = incomingDes[0].injector.get(
                    ResourceDetailHtmlContentLinkedobjectsStubComponent
                ) as ResourceDetailHtmlContentLinkedobjectsStubComponent;

                expect(incomingCmp.incoming).toBeDefined();
                expect(incomingCmp.incoming).toBe(expectedContent.incoming);
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

                // undefined
                id = undefined;
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 1, id);

                // number
                id = 28;
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 2, id);

                // string
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

                // undefined
                id = undefined;
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 1, id);

                // number
                id = 28;
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 2, id);

                // string
                id = '330';
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(navigateToResourceSpy, 3, id);
            }));

            it('... should not emit anything if no id is provided', fakeAsync(() => {
                // props
                const propsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ResourceDetailHtmlContentPropsStubComponent,
                    1,
                    1
                );
                const propsCmp = propsDes[0].injector.get(
                    ResourceDetailHtmlContentPropsStubComponent
                ) as ResourceDetailHtmlContentPropsStubComponent;

                // no id
                propsCmp.resourceRequest.emit(undefined);

                // id is undefined
                expect(emitSpy).not.toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                // props
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

                // number
                id = 28;
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(emitSpy, 1, id.toString());

                // string
                id = '28';
                propsCmp.resourceRequest.emit(id);

                expectSpyCall(emitSpy, 2, id);
            }));
        });
    });
});
