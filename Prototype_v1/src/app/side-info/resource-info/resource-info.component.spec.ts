import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceInfoComponent } from './resource-info.component';

describe('ResourceInfoComponent', () => {
    let component: ResourceInfoComponent;
    let fixture: ComponentFixture<ResourceInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ResourceInfoComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
