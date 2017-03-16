import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionDetailSvgPanelComponent } from './edition-detail-svg-panel.component';

describe('EditionDetailSvgPanelComponent', () => {
    let component: EditionDetailSvgPanelComponent;
    let fixture: ComponentFixture<EditionDetailSvgPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionDetailSvgPanelComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionDetailSvgPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
