import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFulltextComponent } from './search-fulltext.component';

describe('SearchFulltextComponent', () => {
    let component: SearchFulltextComponent;
    let fixture: ComponentFixture<SearchFulltextComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SearchFulltextComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchFulltextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
