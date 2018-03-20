/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BibliographyComponent } from './bibliography.component';

describe('BibliographyComponent', () => {
  let component: BibliographyComponent;
  let fixture: ComponentFixture<BibliographyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BibliographyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
