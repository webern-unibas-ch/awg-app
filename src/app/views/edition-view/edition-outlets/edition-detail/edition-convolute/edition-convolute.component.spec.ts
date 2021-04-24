import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input, NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { EditionConvoluteComponent } from './edition-convolute.component';
import { Folio, EditionSvgSheet } from '@awg-views/edition-view/models';

@Component({ selector: 'awg-edition-folio', template: '' })
class FolioStubComponent {
    @Input()
    folioData: Folio[];
    @Input()
    selectedSvgSheet: EditionSvgSheet;

    // TODO: handle outputs
}

describe('EditionConvoluteComponent', () => {
    let component: EditionConvoluteComponent;
    let fixture: ComponentFixture<EditionConvoluteComponent>;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [FontAwesomeModule, NgbAccordionWithConfigModule],
                declarations: [EditionConvoluteComponent, FolioStubComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionConvoluteComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
