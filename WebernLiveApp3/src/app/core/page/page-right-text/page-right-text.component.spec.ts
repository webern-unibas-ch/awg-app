import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRightTextComponent } from './page-right-text.component';

describe('PageRightTextComponent', () => {
    let component: PageRightTextComponent;
    let fixture: ComponentFixture<PageRightTextComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PageRightTextComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageRightTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
