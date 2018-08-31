import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwelveToneSpinnerComponent } from './twelve-tone-spinner.component';

describe('TwelveToneSpinnerComponent', () => {
  let component: TwelveToneSpinnerComponent;
  let fixture: ComponentFixture<TwelveToneSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwelveToneSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwelveToneSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
