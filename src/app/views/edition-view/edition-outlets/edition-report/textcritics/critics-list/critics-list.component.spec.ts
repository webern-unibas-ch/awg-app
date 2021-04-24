import { Component, Input, NgModule } from '@angular/core';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { TextcriticalComment } from '@awg-views/edition-view/models';

import { CriticsListComponent } from './critics-list.component';

// Mock tka table component
@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalComments: TextcriticalComment[];

    // TODO: handle outputs
}

describe('CriticsListComponent', () => {
    let component: CriticsListComponent;
    let fixture: ComponentFixture<CriticsListComponent>;

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
                declarations: [CriticsListComponent, CompileHtmlComponent, EditionTkaTableStubComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(CriticsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
