/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input, NgModule } from '@angular/core';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { TextcriticsList } from '@awg-views/edition-view/models';
import { TextcriticsComponent } from './textcritics.component';

// Mock critics list component
@Component({ selector: 'awg-critics-list', template: '' })
class CriticsListStubComponent {
    @Input()
    textcriticsData: TextcriticsList;

    // TODO: handle outputs
}

describe('TextcriticsComponent', () => {
    let component: TextcriticsComponent;
    let fixture: ComponentFixture<TextcriticsComponent>;

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
                declarations: [TextcriticsComponent, CriticsListStubComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(TextcriticsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
