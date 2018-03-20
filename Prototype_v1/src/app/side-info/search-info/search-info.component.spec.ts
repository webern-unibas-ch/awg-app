import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInfoComponent } from './search-info.component';

describe('SearchInfoComponent', () => {
    let component: SearchInfoComponent;
    let fixture: ComponentFixture<SearchInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SearchInfoComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
