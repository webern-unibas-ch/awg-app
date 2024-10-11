import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionIntroNavComponent } from './edition-intro-nav.component';

describe('EditionIntroNavComponent', () => {
    let component: EditionIntroNavComponent;
    let fixture: ComponentFixture<EditionIntroNavComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionIntroNavComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionIntroNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
