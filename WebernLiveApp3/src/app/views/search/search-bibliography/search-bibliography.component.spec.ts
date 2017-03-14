import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBibliographyComponent } from './search-bibliography.component';

describe('SearchBibliographyComponent', () => {
    let component: SearchBibliographyComponent;
    let fixture: ComponentFixture<SearchBibliographyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SearchBibliographyComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchBibliographyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
