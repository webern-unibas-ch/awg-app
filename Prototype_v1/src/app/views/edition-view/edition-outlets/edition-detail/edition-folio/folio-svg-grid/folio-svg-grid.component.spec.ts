import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioSvgGridComponent } from './folio-svg-grid.component';

describe('FolioSvgGridComponent', () => {
  let component: FolioSvgGridComponent;
  let fixture: ComponentFixture<FolioSvgGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolioSvgGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolioSvgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
