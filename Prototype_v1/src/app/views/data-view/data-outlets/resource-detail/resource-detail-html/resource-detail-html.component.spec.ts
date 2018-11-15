/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { ResourceDetailHtmlComponent } from './resource-detail-html.component';
import { ResourceDetailContent } from '@awg-views/data-view/models';

// mock component
@Component({ selector: 'awg-resource-detail-html-content', template: '' })
class ResourceDetailHtmlContentStubComponent {
    @Input()
    content: ResourceDetailContent;

    // TODO: handle outputs
}

describe('ResourceDetailHtmlComponent', () => {
    let component: ResourceDetailHtmlComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlComponent>;
    let compDe: DebugElement;
    let compEl: any;

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

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
