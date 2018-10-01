import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioComponent } from './folio.component';

describe('FolioComponent', () => {
    let component: FolioComponent;
    let fixture: ComponentFixture<FolioComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ FolioComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FolioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
