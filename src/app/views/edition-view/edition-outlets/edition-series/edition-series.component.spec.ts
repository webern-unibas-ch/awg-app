import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EditionSeriesComponent } from './edition-series.component';

describe('EditionSeriesComponent', () => {
    let component: EditionSeriesComponent;
    let fixture: ComponentFixture<EditionSeriesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [EditionSeriesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSeriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });
});
