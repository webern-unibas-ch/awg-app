import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFulltextResultsComponent } from './search-fulltext-results.component';

describe('SearchFulltextResultsComponent', () => {
  let component: SearchFulltextResultsComponent;
  let fixture: ComponentFixture<SearchFulltextResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFulltextResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFulltextResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
