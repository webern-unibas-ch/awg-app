import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { ResourceDetailHtmlContentComponent } from './resource-detail-html-content.component';
import {
    ResourceDetailGroupedIncomingLinks,
    ResourceDetailImage,
    ResourceDetailProps
} from '@awg-views/data-view/models';

// mock components
@Component({ selector: 'awg-resource-detail-html-content-props', template: '' })
class ResourceDetailHtmlContentPropsStubComponent {
    @Input()
    props: ResourceDetailProps[];

    // TODO: handle outputs
}

@Component({ selector: 'awg-resource-detail-html-content-imageobjects', template: '' })
class ResourceDetailHtmlContentImageobjectsStubComponent {
    @Input()
    images: ResourceDetailImage[];

    // TODO: handle outputs
}

@Component({ selector: 'awg-resource-detail-html-content-linkedobjects', template: '' })
class ResourceDetailHtmlContentLinkedobjectsStubComponent {
    @Input()
    incoming: ResourceDetailGroupedIncomingLinks;

    // TODO: handle outputs
}

describe('ResourceDetailHtmlContentComponent', () => {
    let component: ResourceDetailHtmlContentComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentComponent>;
    let compDe: DebugElement;
    let compEl: any;

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

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
