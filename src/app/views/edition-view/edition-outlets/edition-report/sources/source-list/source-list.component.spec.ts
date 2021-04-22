/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { SourceListComponent } from './source-list.component';
import { SourceList } from '@awg-views/edition-view/models';

import { CompileHtmlComponent } from '@awg-shared/compile-html';

describe('SourceListComponent', () => {
    let component: SourceListComponent;
    let fixture: ComponentFixture<SourceListComponent>;
    let expectedSourceListData: SourceList;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [RouterTestingModule],
                declarations: [SourceListComponent, CompileHtmlComponent, RouterLinkStubDirective]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceListComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not get sourceListData input', () => {
            expect(component.sourceListData).toBeUndefined('should be undefined');
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Mock the input values supplied by the parent component
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
                        linkTo: 'OP12_SOURCE_NOT_A'
                    },
                    {
                        siglum: 'C',
                        type: 'Autograph von Nr. I–IV.',
                        location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                        linkTo: 'OP12_SOURCE_NOT_A'
                    }
                ]
            };

            // Simulate the parent setting the input properties
            component.sourceListData = expectedSourceListData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should get sourceListData input', () => {
            expect(component.sourceListData).toBe(expectedSourceListData);
        });
    });
});
