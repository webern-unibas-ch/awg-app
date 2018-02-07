import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailHtmlContentComponent } from './resource-detail-html-content.component';

describe('ResourceDetailHtmlContentComponent', () => {
    let component: ResourceDetailHtmlContentComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ResourceDetailHtmlContentComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
