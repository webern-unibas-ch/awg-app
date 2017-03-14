import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionIntroComponent } from './edition-intro.component';

describe('EditionIntroComponent', () => {
    let component: EditionIntroComponent;
    let fixture: ComponentFixture<EditionIntroComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionIntroComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionIntroComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
