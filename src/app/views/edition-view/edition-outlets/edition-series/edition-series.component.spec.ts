import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionSeriesComponent } from './edition-series.component';

describe('EditionSeriesComponent', () => {
    let component: EditionSeriesComponent;
    let fixture: ComponentFixture<EditionSeriesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionSeriesComponent, RouterOutletStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSeriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
