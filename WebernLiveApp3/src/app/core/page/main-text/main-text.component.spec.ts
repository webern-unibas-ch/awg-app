import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTextComponent } from './main-text.component';

describe('MainTextComponent', () => {
    let component: MainTextComponent;
    let fixture: ComponentFixture<MainTextComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ MainTextComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
