import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailHeaderComponent } from './resource-detail-header.component';
import { ResourceDetailHeader } from '@awg-views/data-view/models';
import { CompileHtmlComponent } from '@awg-shared/compile-html';

describe('ResourceDetailHtmlHeaderComponent', () => {
    let component: ResourceDetailHeaderComponent;
    let fixture: ComponentFixture<ResourceDetailHeaderComponent>;

    const expectedHeader: ResourceDetailHeader = { objID: '1234', icon: '', type: '', title: 'Test', lastmod: '' };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailHeaderComponent, CompileHtmlComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHeaderComponent);
        component = fixture.componentInstance;

        component.header = expectedHeader;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
