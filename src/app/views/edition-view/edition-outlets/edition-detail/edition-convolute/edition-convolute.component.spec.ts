import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { EditionConvoluteComponent } from './edition-convolute.component';
import { Folio, EditionSvgSheet } from '@awg-views/edition-view/models';

@Component({ selector: 'awg-edition-folio', template: '' })
class FolioStubComponent {
    @Input()
    convoluteData: Folio[];
    @Input()
    selectedSvgSheet: EditionSvgSheet;

    // TODO: handle outputs
}

describe('EditionConvoluteComponent', () => {
    let component: EditionConvoluteComponent;
    let fixture: ComponentFixture<EditionConvoluteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeModule, NgbAccordionModule],
            declarations: [EditionConvoluteComponent, FolioStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionConvoluteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
