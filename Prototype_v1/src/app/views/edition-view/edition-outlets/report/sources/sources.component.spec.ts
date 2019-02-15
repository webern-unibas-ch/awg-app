/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { SourceList } from '@awg-views/edition-view/models';

import { SourcesComponent } from './sources.component';

// mock components
@Component({ selector: 'awg-source-list', template: '' })
class SourceListStubComponent {
    @Input()
    sourceListData: SourceList;

    // TODO: handle outputs
}

@Component({ selector: 'awg-source-description', template: '' })
class SourceDescriptionStubComponent {
    @Input()
    showDescriptionPanel: boolean;

    // TODO: handle outputs
}

@Component({ selector: 'awg-source-evaluation', template: '' })
class SourceEvaluationStubComponent {
    // TODO: handle outputs
}

describe('SourcesComponent', () => {
    let component: SourcesComponent;
    let fixture: ComponentFixture<SourcesComponent>;
    let expectedSourceListData: SourceList;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgbAccordionModule, RouterTestingModule],
            declarations: [
                SourcesComponent,
                SourceListStubComponent,
                SourceDescriptionStubComponent,
                SourceEvaluationStubComponent,
                RouterLinkStubDirective
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourcesComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not get sourceListData input', () => {
            expect(component.sourceListData).toBeUndefined('should be undefined');
        });

        it('should not contain source list component (stubbed)', () => {
            const sourceListEl = fixture.debugElement.query(By.directive(SourceListStubComponent));
            expect(sourceListEl).not.toBeTruthy();
        });

        it('should not contain source description component (stubbed)', () => {
            const sourceDescriptionEl = fixture.debugElement.query(By.directive(SourceDescriptionStubComponent));
            expect(sourceDescriptionEl).not.toBeTruthy();
        });

        it('should not contain source evaluation component (stubbed)', () => {
            const sourceEvaluationEl = fixture.debugElement.query(By.directive(SourceEvaluationStubComponent));
            expect(sourceEvaluationEl).not.toBeTruthy();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the input values supplied by the parent component
            expectedSourceListData = {
                sources: [
                    {
                        siglum: 'A',
                        type: 'Skizzen',
                        location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                        linkTo: 'sourceA'
                    },
                    {
                        siglum: 'B',
                        type: 'Autograph von Nr. I.',
                        location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                        linkTo: 'sourceNotA'
                    },
                    {
                        siglum: 'C',
                        type: 'Autograph von Nr. I–IV.',
                        location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                        linkTo: 'sourceNotA'
                    }
                ]
            };

            // simulate the parent setting the input properties
            component.sourceListData = expectedSourceListData;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should get sourceListData input', () => {
            expect(component.sourceListData).toBe(expectedSourceListData);
        });

        it('should contain source list component (stubbed)', () => {
            const sourceListEl = fixture.debugElement.query(By.directive(SourceListStubComponent));
            expect(sourceListEl).toBeTruthy();
        });

        it('should contain source description component (stubbed)', () => {
            const sourceDescriptionEl = fixture.debugElement.query(By.directive(SourceDescriptionStubComponent));
            expect(sourceDescriptionEl).toBeTruthy();
        });

        it('should contain source evaluation component (stubbed)', () => {
            const sourceEvaluationEl = fixture.debugElement.query(By.directive(SourceEvaluationStubComponent));
            expect(sourceEvaluationEl).toBeTruthy();
        });
    });
});
