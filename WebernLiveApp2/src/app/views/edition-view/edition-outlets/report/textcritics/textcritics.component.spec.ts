/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TextcriticsComponent } from './textcritics.component';

describe('TextcriticsComponent', () => {
  let component: TextcriticsComponent;
  let fixture: ComponentFixture<TextcriticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextcriticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextcriticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
