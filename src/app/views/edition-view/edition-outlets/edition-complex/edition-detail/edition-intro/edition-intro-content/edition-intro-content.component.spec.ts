import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionIntroContentComponent } from './edition-intro-content.component';

describe('EditionIntroContentComponent', () => {
    let component: EditionIntroContentComponent;
    let fixture: ComponentFixture<EditionIntroContentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionIntroContentComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionIntroContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
