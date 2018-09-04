import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioFormComponent } from './folio-form.component';

describe('FolioFormComponent', () => {
    let component: FolioFormComponent;
    let fixture: ComponentFixture<FolioFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ FolioFormComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FolioFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
