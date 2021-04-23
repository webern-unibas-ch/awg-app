import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, Input, NgModule } from '@angular/core';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    TextcriticalComment
} from '@awg-views/edition-view/models';

import { EditionAccoladeComponent } from './edition-accolade.component';

// Mock components
@Component({ selector: 'awg-edition-svg-sheet-nav', template: '' })
class EditionSvgSheetNavStubComponent {
    @Input()
    svgSheetsData: EditionSvgSheet[];
    @Input()
    selectedSvgSheet: EditionSvgSheet;

    // TODO: handle outputs
}

@Component({ selector: 'awg-edition-svg-sheet', template: '' })
class EditionSvgSheetStubComponent {
    @Input()
    svgSheetsData: EditionSvgSheetList;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Input()
    selectedOverlay: EditionSvgOverlay;

    // TODO: handle outputs
}

@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalComments: TextcriticalComment[];

    // TODO: handle outputs
}

describe('EditionAccoladeComponent', () => {
    let component: EditionAccoladeComponent;
    let fixture: ComponentFixture<EditionAccoladeComponent>;
    let compDe: DebugElement;
    let compEl: any;

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
                imports: [NgbAccordionWithConfigModule],
                declarations: [
                    EditionAccoladeComponent,
                    EditionSvgSheetStubComponent,
                    EditionSvgSheetNavStubComponent,
                    EditionTkaTableStubComponent
                ]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionAccoladeComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
