/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { TextcriticsList } from '@awg-views/edition-view/models';
import { CriticsListComponent } from './critics-list/critics-list.component';
import { TextcriticsComponent } from './textcritics.component';

// mock critics list component
@Component({ selector: 'awg-critics-list', template: '' })
class CriticsListStubComponent {
    @Input()
    textcriticsData: TextcriticsList;

    // TODO: handle outputs
}

describe('TextcriticsComponent', () => {
    let component: TextcriticsComponent;
    let fixture: ComponentFixture<TextcriticsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgbAccordionModule],
            declarations: [TextcriticsComponent, CriticsListStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextcriticsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
