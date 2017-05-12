import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultDetailRawComponent } from './search-result-detail-raw.component';

describe('SearchResultDetailRawComponent', () => {
  let component: SearchResultDetailRawComponent;
  let fixture: ComponentFixture<SearchResultDetailRawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultDetailRawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultDetailRawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
