/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { SourceListComponent } from './source-list.component';
import { SharedModule } from '@awg-shared/shared.module';
import { SourceList } from '@awg-views/edition-view/models';

describe('SourceListComponent', () => {
    let component: SourceListComponent;
    let fixture: ComponentFixture<SourceListComponent>;
    let expectedSourceListData: SourceList;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, RouterTestingModule],
            declarations: [SourceListComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

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
    });
});
