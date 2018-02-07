import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailHtmlContentPropsComponent } from './resource-detail-html-content-props.component';

describe('ResourceDetailHtmlContentPropsComponent', () => {
    let component: ResourceDetailHtmlContentPropsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentPropsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ResourceDetailHtmlContentPropsComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentPropsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
