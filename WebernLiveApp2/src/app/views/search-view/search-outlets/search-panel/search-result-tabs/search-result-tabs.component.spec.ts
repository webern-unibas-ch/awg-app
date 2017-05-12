import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultTabsComponent } from './search-result-tabs.component';

describe('SearchResultTabsComponent', () => {
  let component: SearchResultTabsComponent;
  let fixture: ComponentFixture<SearchResultTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
