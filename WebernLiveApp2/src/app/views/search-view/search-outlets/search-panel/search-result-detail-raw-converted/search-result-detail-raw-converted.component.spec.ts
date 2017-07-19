import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultDetailRawConvertedComponent } from './search-result-detail-raw-converted.component';

describe('SearchResultDetailRawConvertedComponent', () => {
  let component: SearchResultDetailRawConvertedComponent;
  let fixture: ComponentFixture<SearchResultDetailRawConvertedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultDetailRawConvertedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultDetailRawConvertedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
