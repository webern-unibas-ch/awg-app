import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightTextComponent } from './right-text.component';

describe('RightTextComponent', () => {
    let component: RightTextComponent;
    let fixture: ComponentFixture<RightTextComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RightTextComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RightTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
