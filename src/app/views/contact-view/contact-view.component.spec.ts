import { DatePipe } from '@angular/common';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { META_DATA } from '@awg-core/core-data';
import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { ContactViewComponent } from './contact-view.component';

// Mock heading component
@Component({
    selector: 'awg-heading',
    template: '',
    standalone: false,
})
class HeadingStubComponent {
    @Input()
    title: string;
    @Input()
    id: string;
}

describe('ContactViewComponent (DONE)', () => {
    let component: ContactViewComponent;
    let fixture: ComponentFixture<ContactViewComponent>;
    let compDe: DebugElement;

    let mockCoreService: Partial<CoreService>;

    const datePipe = new DatePipe('en');
    let dateSpy: Spy;
    let provideMetaDataSpy: Spy;

    let expectedToday;
    let expectedPageMetaData: MetaPage;
    let expectedContactMetaData: MetaContact;

    const expectedImprintTitle = 'Impressum';
    const expectedImprintId = 'awg-imprint';
    const expectedCitationTitle = 'Zitation';
    const expectedCitationId = 'awg-citation';
    const expectedDocumentationTitle = 'Dokumentation';
    const expectedDocumentationId = 'awg-documentation';
    const expectedDateFormat = 'd. MMMM yyyy';

    beforeEach(waitForAsync(() => {
        // Mock service for test purposes
        mockCoreService = { getMetaDataSection: sectionType => META_DATA[sectionType] };

        TestBed.configureTestingModule({
            declarations: [ContactViewComponent, HeadingStubComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
        expectedContactMetaData = META_DATA[MetaSectionTypes.contact];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        provideMetaDataSpy = spyOn(component, 'provideMetaData').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expectToBe(mockCoreService === coreService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have imprint title and id', () => {
            expectToBe(component.imprintTitle, expectedImprintTitle);
            expectToBe(component.imprintId, expectedImprintId);
        });

        it('... should have citation title and id', () => {
            expectToBe(component.citationTitle, expectedCitationTitle);
            expectToBe(component.citationId, expectedCitationId);
        });

        it('... should have documentation title and id', () => {
            expectToBe(component.documentationTitle, expectedDocumentationTitle);
            expectToBe(component.documentationId, expectedDocumentationId);
        });

        it('... should have dateFormat', () => {
            expectToBe(component.dateFormat, expectedDateFormat);
        });

        it('... should not have metadata nor `today`', () => {
            expect(component.pageMetaData).toBeUndefined();
            expect(component.contactMetaData).toBeUndefined();
            expect(component.today).toBeUndefined();
        });

        describe('#provideMetaData()', () => {
            it('... should have a method `provideMetaData`', () => {
                expect(component.provideMetaData).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(provideMetaDataSpy, 0);
            });
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-contact-view`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
            });

            it('... should contain 3 heading components (stubbed) in `div.awg-contact-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 3, 3);
            });

            it('... should not pass down `title` and `id` to heading components', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);

                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 3, 3);
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                expect(headingCmps[0].title).toBeUndefined();
                expect(headingCmps[0].id).toBeUndefined();

                expect(headingCmps[1].title).toBeUndefined();
                expect(headingCmps[1].id).toBeUndefined();

                expect(headingCmps[2].title).toBeUndefined();
                expect(headingCmps[2].id).toBeUndefined();
            });

            it('... should contain 1 `div.awg-citation-description` with 5 `p` elements in `div.awg-contact-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-citation-description', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-citation-description > p', 5, 5);
            });

            it('... should contain 1 `div.awg-documentation-description` with 2 `p` elements in `div.awg-contact-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-documentation-description', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-documentation-description > p', 2, 2);
            });

            it('... should contain 1 `div.awg-imprint-description` with 5 `p` elements in `div.awg-contact-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-imprint-description', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-imprint-description > p', 5, 5);
            });

            it('... should contain 1 `div#awg-disclaimer` with 17 `p` elements in `div.awg-contact-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div#awg-disclaimer', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div#awg-disclaimer > p', 17, 17);
            });

            it('... should not render `version`, `versionReleaseDate` and `today` yet', () => {
                // Debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version', 1, 1);
                const releaseDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version-release', 1, 1);
                const dateDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-date', 2, 2);

                // Native elements
                const versionEl: HTMLElement = versionDes[0].nativeElement;
                const releaseEl: HTMLElement = releaseDes[0].nativeElement;
                const dateEl0: HTMLElement = dateDes[0].nativeElement;
                const dateEl1: HTMLElement = dateDes[1].nativeElement;

                // Check output
                expectToBe(versionEl.textContent, '');
                expectToBe(releaseEl.textContent, '');
                expectToBe(dateEl0.textContent, '');
                expectToBe(dateEl1.textContent, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Mock the call to the meta service in #provideMetaData
            component.pageMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.page);
            component.contactMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.contact);

            // Spy on Date.now() returning a mocked (fixed) date
            expectedToday = Date.now();
            dateSpy = spyOn(Date, 'now').and.callFake(() => expectedToday);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `today`', () => {
            expectSpyCall(dateSpy, 1);
            expectToBe(component.today, expectedToday);
        });

        describe('#provideMetaData()', () => {
            it('... should have been called', () => {
                expectSpyCall(provideMetaDataSpy, 1);
            });

            it('... should return metadata', () => {
                expectToEqual(component.pageMetaData, expectedPageMetaData);
                expectToEqual(component.contactMetaData, expectedContactMetaData);
            });
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading components', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);

                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 3, 3);
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                expectToBe(headingCmps[0].title, expectedCitationTitle);
                expectToBe(headingCmps[0].id, expectedCitationId);

                expectToBe(headingCmps[1].title, expectedDocumentationTitle);
                expectToBe(headingCmps[1].id, expectedDocumentationId);

                expectToBe(headingCmps[2].title, expectedImprintTitle);
                expectToBe(headingCmps[2].id, expectedImprintId);
            });

            it('... should render `version`, `versionReleaseDate` and `today`', () => {
                // Debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version', 1, 1);
                const releaseDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version-release', 1, 1);
                const dateDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-date', 2, 2);

                // Native elements
                const versionEl: HTMLElement = versionDes[0].nativeElement;
                const releaseEl: HTMLElement = releaseDes[0].nativeElement;
                const dateEl0: HTMLElement = dateDes[0].nativeElement;
                const dateEl1: HTMLElement = dateDes[1].nativeElement;

                // Pipe
                const pipedToday = datePipe.transform(expectedToday, expectedDateFormat);

                // Check output
                expectToContain(versionEl.textContent, expectedPageMetaData.version);
                expectToContain(releaseEl.textContent, expectedPageMetaData.versionReleaseDate);
                expectToContain(dateEl0.textContent, pipedToday);
                expectToContain(dateEl1.textContent, pipedToday);
            });
        });
    });
});
