import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSubMenuComponent } from './page-sub-menu.component';

describe('PageSubMenuComponent', () => {
    let component: PageSubMenuComponent;
    let fixture: ComponentFixture<PageSubMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PageSubMenuComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageSubMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
