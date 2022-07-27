import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { UtilityService } from '@awg-app/core/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { TextcriticalComment } from '@awg-views/edition-view/models';

import { TextcriticsListComponent } from './textcritics-list.component';

// Mock tka table component
@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalComments: TextcriticalComment[];
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

describe('TextcriticsListComponent', () => {
    let component: TextcriticsListComponent;
    let fixture: ComponentFixture<TextcriticsListComponent>;
    let compDe: DebugElement;

    let utils: UtilityService;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule],
            declarations: [TextcriticsListComponent, CompileHtmlComponent, EditionTkaTableStubComponent],
            providers: [UtilityService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextcriticsListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        utils = TestBed.inject(UtilityService);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
