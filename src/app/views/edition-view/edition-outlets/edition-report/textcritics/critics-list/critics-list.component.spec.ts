import { Component, Input } from '@angular/core';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionTkaTableComponent } from '@awg-views/edition-view/edition-outlets/edition-tka-table/edition-tka-table.component';
import { TextcriticalComment } from '@awg-views/edition-view/models';

import { CriticsListComponent } from './critics-list.component';

// mock tka table component
@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalComments: TextcriticalComment[];

    // TODO: handle outputs
}

describe('CriticsListComponent', () => {
    let component: CriticsListComponent;
    let fixture: ComponentFixture<CriticsListComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [NgbAccordionModule],
                declarations: [CriticsListComponent, CompileHtmlComponent, EditionTkaTableStubComponent]
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
