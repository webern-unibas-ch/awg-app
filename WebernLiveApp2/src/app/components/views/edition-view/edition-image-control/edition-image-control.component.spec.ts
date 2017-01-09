/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditionImageControlComponent } from './edition-image-control.component';

describe('EditionImageControlComponent', () => {
  let component: EditionImageControlComponent;
  let fixture: ComponentFixture<EditionImageControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionImageControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionImageControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
