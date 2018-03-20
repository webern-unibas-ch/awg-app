import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFulltextFormComponent } from './search-fulltext-form.component';

describe('SearchFulltextFormComponent', () => {
    let component: SearchFulltextFormComponent;
    let fixture: ComponentFixture<SearchFulltextFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SearchFulltextFormComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchFulltextFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
