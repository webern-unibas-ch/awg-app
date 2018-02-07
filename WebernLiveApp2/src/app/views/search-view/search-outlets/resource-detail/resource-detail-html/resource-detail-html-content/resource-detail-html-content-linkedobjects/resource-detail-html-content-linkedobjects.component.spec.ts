import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailHtmlContentLinkedobjectsComponent } from './resource-detail-html-content-linkedobjects.component';

describe('ResourceDetailHtmlContentLinkedobjectsComponent', () => {
    let component: ResourceDetailHtmlContentLinkedobjectsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentLinkedobjectsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ResourceDetailHtmlContentLinkedobjectsComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentLinkedobjectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
