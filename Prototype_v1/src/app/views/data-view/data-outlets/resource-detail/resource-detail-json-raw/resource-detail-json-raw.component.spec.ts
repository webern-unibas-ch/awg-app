import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailJsonRawComponent } from './resource-detail-json-raw.component';

describe('ResourceDetailJsonRawComponent', () => {
  let component: ResourceDetailJsonRawComponent;
  let fixture: ComponentFixture<ResourceDetailJsonRawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceDetailJsonRawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceDetailJsonRawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
