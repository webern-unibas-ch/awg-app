import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ViewHandleButtonGroupComponent } from './view-handle-button-group.component';

describe('ViewHandleButtonGroupComponent', () => {
    let component: ViewHandleButtonGroupComponent;
    let fixture: ComponentFixture<ViewHandleButtonGroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [ViewHandleButtonGroupComponent],
            providers: [FormBuilder],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewHandleButtonGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
