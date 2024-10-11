import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionIntroEmptyComponent } from './edition-intro-empty.component';

describe('EditionIntroEmptyComponent', () => {
    let component: EditionIntroEmptyComponent;
    let fixture: ComponentFixture<EditionIntroEmptyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionIntroEmptyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionIntroEmptyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
