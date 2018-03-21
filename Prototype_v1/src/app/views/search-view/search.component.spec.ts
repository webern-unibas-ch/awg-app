/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SearchViewComponent } from './search.component';

describe('SearchViewComponent', () => {
  let component: SearchViewComponent;
  let fixture: ComponentFixture<SearchViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
