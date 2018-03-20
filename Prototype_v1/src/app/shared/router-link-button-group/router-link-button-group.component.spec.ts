import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterLinkButtonGroupComponent } from './router-link-button-group.component';

describe('RouterLinkButtonGroupComponent', () => {
    let component: RouterLinkButtonGroupComponent;
    let fixture: ComponentFixture<RouterLinkButtonGroupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RouterLinkButtonGroupComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RouterLinkButtonGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
