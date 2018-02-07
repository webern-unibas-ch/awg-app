import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionDetailComponent } from './edition-detail.component';

describe('EditionDetailComponent', () => {
    let component: EditionDetailComponent;
    let fixture: ComponentFixture<EditionDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionDetailComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
