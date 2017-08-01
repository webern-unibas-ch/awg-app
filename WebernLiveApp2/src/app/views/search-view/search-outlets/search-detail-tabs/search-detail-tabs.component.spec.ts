import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDetailTabsComponent } from './search-detail-tabs.component';

describe('SearchDetailTabsComponent', () => {
  let component: SearchDetailTabsComponent;
  let fixture: ComponentFixture<SearchDetailTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDetailTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDetailTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
