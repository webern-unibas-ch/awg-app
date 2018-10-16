/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { SourcesComponent } from './sources.component';
import { SourceListComponent } from './source-list';
import { SourceDescriptionComponent } from './source-description';
import { SourceEvaluationComponent } from './source-evaluation';

import { SourceList } from '@awg-views/edition-view/models';

import { SharedModule } from '@awg-shared/shared.module';

describe('SourcesComponent', () => {
    let component: SourcesComponent;
    let fixture: ComponentFixture<SourcesComponent>;
    let expectedSourceListData: SourceList;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, RouterTestingModule],
            declarations: [
                SourcesComponent,
                SourceListComponent,
                SourceDescriptionComponent,
                SourceEvaluationComponent,
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

        it('should not contain source list component', () => {
            const sourceListEl = fixture.debugElement.query(By.directive(SourceListComponent));
            expect(sourceListEl).not.toBeTruthy();
        });

        it('should contain source description component (real)', () => {
            const sourceDescriptionEl = fixture.debugElement.query(By.directive(SourceDescriptionComponent));
            expect(sourceDescriptionEl).toBeTruthy();
        });

        it('should contain source evaluation component (real)', () => {
            const sourceEvaluationEl = fixture.debugElement.query(By.directive(SourceEvaluationComponent));
            expect(sourceEvaluationEl).toBeTruthy();
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

        it('should contain source list component', () => {
            const sourceListEl = fixture.debugElement.query(By.directive(SourceListComponent));
            expect(sourceListEl).toBeTruthy();
        });
    });
});
