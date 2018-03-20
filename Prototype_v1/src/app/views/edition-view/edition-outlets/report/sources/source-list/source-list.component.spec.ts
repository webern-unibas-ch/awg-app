/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SourceListComponent } from './source-list.component';

describe('SourceListComponent', () => {
  let component: SourceListComponent;
  let fixture: ComponentFixture<SourceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
