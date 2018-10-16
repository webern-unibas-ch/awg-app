import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailHeaderComponent } from './resource-detail-header.component';

describe('ResourceDetailHtmlHeaderComponent', () => {
    let component: ResourceDetailHeaderComponent;
    let fixture: ComponentFixture<ResourceDetailHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailHeaderComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
