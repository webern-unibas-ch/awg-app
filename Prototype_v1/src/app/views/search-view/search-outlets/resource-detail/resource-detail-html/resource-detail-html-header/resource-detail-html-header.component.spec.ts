import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailHtmlHeaderComponent } from './resource-detail-html-header.component';

describe('ResourceDetailHtmlHeaderComponent', () => {
    let component: ResourceDetailHtmlHeaderComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ResourceDetailHtmlHeaderComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
