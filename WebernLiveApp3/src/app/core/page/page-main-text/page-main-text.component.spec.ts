import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMainTextComponent } from './page-main-text.component';

describe('PageMainTextComponent', () => {
    let component: PageMainTextComponent;
    let fixture: ComponentFixture<PageMainTextComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PageMainTextComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageMainTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
