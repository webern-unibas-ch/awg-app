import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStructureComponent } from './home-structure.component';

describe('HomeStructureComponent', () => {
    let component: HomeStructureComponent;
    let fixture: ComponentFixture<HomeStructureComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ HomeStructureComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeStructureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
