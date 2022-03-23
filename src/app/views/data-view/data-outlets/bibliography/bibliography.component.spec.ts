/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { SearchResponseJson, SubjectItemJson } from '@awg-shared/api-objects';
import { BibliographyService } from '@awg-views/data-view/services';

import { BibliographyComponent } from './bibliography.component';

// Mock components
@Component({ selector: 'awg-bibliography-search', template: '' })
class BibliographySearchStubComponent {}

@Component({ selector: 'awg-bibliography-list', template: '' })
class BibliographyListStubComponent {
    @Input()
    bibList: SubjectItemJson[];
    @Output()
    selectItemRequest: EventEmitter<SubjectItemJson> = new EventEmitter();
}

describe('BibliographyComponent', () => {
    let component: BibliographyComponent;
    let fixture: ComponentFixture<BibliographyComponent>;
    let compDe: DebugElement;

    let getBibliographyListSpy: Spy;
    let mockBibliographyService: Partial<BibliographyService>;
    let bibliographyService: Partial<BibliographyService>;

    let expectedSearchResponseData: SearchResponseJson;

    beforeEach(waitForAsync(() => {
        // Mock services
        mockBibliographyService = {
            getBibliographyList: (): Observable<SearchResponseJson> => observableOf(),
        };

        TestBed.configureTestingModule({
            declarations: [BibliographyComponent, BibliographySearchStubComponent, BibliographyListStubComponent],
            providers: [{ provide: BibliographyService, useValue: mockBibliographyService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BibliographyComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject services from root
        bibliographyService = TestBed.inject(BibliographyService);

        // Test data
        // Make the spies return a synchronous Observable with the test data
        expectedSearchResponseData = {
            nhits: undefined,
            paging: undefined,
            subjects: [],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            thumb_max: undefined,
            status: undefined,
            userdata: undefined,
        };

        // Spies on service functions
        getBibliographyListSpy = spyOn(bibliographyService, 'getBibliographyList').and.returnValue(
            observableOf(expectedSearchResponseData)
        );
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('injected bibliography service should use provided mockValue', () => {
        expect(bibliographyService === mockBibliographyService).toBe(true);
    });
});
