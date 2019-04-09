import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureInfoComponent } from './structure-info.component';

describe('StructureInfoComponent', () => {
    let component: StructureInfoComponent;
    let fixture: ComponentFixture<StructureInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StructureInfoComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StructureInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
