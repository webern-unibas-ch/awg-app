/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EditionOverviewComponent } from './edition-overview.component';
import { RouterLinkButtonGroupComponent } from '@awg-shared/router-link-button-group/router-link-button-group.component';

describe('EditionOverviewComponent', () => {
    let component: EditionOverviewComponent;
    let fixture: ComponentFixture<EditionOverviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [EditionOverviewComponent, RouterLinkButtonGroupComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
