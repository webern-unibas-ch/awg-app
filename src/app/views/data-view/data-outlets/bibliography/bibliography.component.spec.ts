/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';

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

    // TODO: handle output
}

describe('BibliographyComponent', () => {
    let component: BibliographyComponent;
    let fixture: ComponentFixture<BibliographyComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let getBibliographyListSpy: Observable<SearchResponseJson>;
    let expectedSearchResponseData: SearchResponseJson;

    beforeEach(
        waitForAsync(() => {
            // Create a fake bibliography service object with a `getBibliographyList()` spy
            const mockBibliographyService = jasmine.createSpyObj('BibliographyService', ['getBibliographyList']);
            // Make the spies return a synchronous Observable with the test data
            expectedSearchResponseData = {
                nhits: undefined,
                paging: undefined,
                subjects: [],
                // eslint-disable-next-line @typescript-eslint/naming-convention
                thumb_max: undefined,
                status: undefined,
                userdata: undefined
            };
            getBibliographyListSpy = mockBibliographyService.getBibliographyList.and.returnValue(observableOf()); // TODO: add real test data (SearchResponseJson)

            TestBed.configureTestingModule({
                declarations: [BibliographyComponent, BibliographySearchStubComponent, BibliographyListStubComponent],
                providers: [{ provide: BibliographyService, useValue: mockBibliographyService }]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(BibliographyComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
