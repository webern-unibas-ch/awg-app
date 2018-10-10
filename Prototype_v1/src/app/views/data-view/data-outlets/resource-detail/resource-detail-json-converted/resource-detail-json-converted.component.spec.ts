import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailJsonConvertedComponent } from './resource-detail-json-converted.component';

describe('ResourceDetailJsonConvertedComponent', () => {
    let component: ResourceDetailJsonConvertedComponent;
    let fixture: ComponentFixture<ResourceDetailJsonConvertedComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailJsonConvertedComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailJsonConvertedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
