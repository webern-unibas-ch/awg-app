import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSvgPanelComponent } from './edition-svg-panel.component';

describe('EditionSvgPanelComponent', () => {
    let component: EditionSvgPanelComponent;
    let fixture: ComponentFixture<EditionSvgPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionSvgPanelComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
