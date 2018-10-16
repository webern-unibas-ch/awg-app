import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailHtmlContentImageobjectsComponent } from './imageobjects.component';
import { ResourceDetailImage } from '@awg-views/data-view/models';

describe('ResourceDetailHtmlContentImageobjectsComponent', () => {
    let component: ResourceDetailHtmlContentImageobjectsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentImageobjectsComponent>;
    let images: ResourceDetailImage[];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailHtmlContentImageobjectsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentImageobjectsComponent);
        component = fixture.componentInstance;

        images = [];

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
