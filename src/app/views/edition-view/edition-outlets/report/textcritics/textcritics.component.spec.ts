/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { Textcritics } from '@awg-views/edition-view/models';

import { TextcriticsComponent } from './textcritics.component';

// mock heading component
@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    selectedTextcritics: Textcritics[];

    // TODO: handle outputs
}

describe('TextcriticsComponent', () => {
    let component: TextcriticsComponent;
    let fixture: ComponentFixture<TextcriticsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgbAccordionModule],
            declarations: [TextcriticsComponent, EditionTkaTableStubComponent, RouterLinkStubDirective]
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
