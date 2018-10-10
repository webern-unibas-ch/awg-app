import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionAccoladeComponent } from './edition-accolade.component';

describe('EditionAccoladeComponent', () => {
    let component: EditionAccoladeComponent;
    let fixture: ComponentFixture<EditionAccoladeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionAccoladeComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionAccoladeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
