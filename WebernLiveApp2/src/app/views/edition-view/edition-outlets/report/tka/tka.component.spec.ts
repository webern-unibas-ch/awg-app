/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TkaComponent } from './tka.component';

describe('TkaComponent', () => {
  let component: TkaComponent;
  let fixture: ComponentFixture<TkaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TkaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TkaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
