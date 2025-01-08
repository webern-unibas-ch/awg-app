import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Observable, of as observableOf } from 'rxjs';

import { expectToBe } from '@testing/expect-helper';

import { SearchResponseJson, SubjectItemJson } from '@awg-shared/api-objects';
import { BibliographyService } from '@awg-views/data-view/services';

import { BibliographyComponent } from './bibliography.component';

// Mock components
@Component({
    selector: 'awg-bibliography-search',
    template: '',
    standalone: false,
})
class BibliographySearchStubComponent {}

@Component({
    selector: 'awg-bibliography-list',
    template: '',
    standalone: false,
})
class BibliographyListStubComponent {
    @Input()
    bibList: SubjectItemJson[];
    @Output()
    selectItemRequest: EventEmitter<SubjectItemJson> = new EventEmitter();
}

describe('BibliographyComponent', () => {
    let component: BibliographyComponent;
    let fixture: ComponentFixture<BibliographyComponent>;

    let mockBibliographyService: Partial<BibliographyService>;
    let bibliographyService: Partial<BibliographyService>;

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

        // Inject services from root
        bibliographyService = TestBed.inject(BibliographyService);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected bibliography service should use provided mockValue', () => {
        expectToBe(bibliographyService === mockBibliographyService, true);
    });
});
