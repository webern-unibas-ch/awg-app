import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriplesEditorComponent } from './triples-editor.component';

describe('TriplesEditorComponent', () => {
    let component: TriplesEditorComponent;
    let fixture: ComponentFixture<TriplesEditorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TriplesEditorComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TriplesEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
