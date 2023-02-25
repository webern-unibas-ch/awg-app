/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePipe } from '@angular/common';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { METADATA } from '@awg-core/core-data';
import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { ContactViewComponent } from './contact-view.component';

// Mock heading component
@Component({ selector: 'awg-heading', template: '' })
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

    let dateSpy: Spy;
    const datePipe = new DatePipe('en');

    let mockCoreService: Partial<CoreService>;
    let mockRouter: Partial<Router>;

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
        mockCoreService = { getMetaDataSection: sectionType => METADATA[sectionType] };

        // Router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [ContactViewComponent, HeadingStubComponent],
            providers: [
                { provide: CoreService, useValue: mockCoreService },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedPageMetaData = METADATA[MetaSectionTypes.page];
        expectedContactMetaData = METADATA[MetaSectionTypes.contact];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
        spyOn(component, 'routeToSidenav').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expect(mockCoreService === coreService).toBe(true);
    });

    describe('BEFORE initial data binding', () => {
        it('should have imprint title and id', () => {
            expect(component.imprintTitle).toBeDefined();
            expect(component.imprintTitle).withContext(`should be ${expectedImprintTitle}`).toBe(expectedImprintTitle);

            expect(component.imprintId).toBeDefined();
            expect(component.imprintId).withContext(`should be ${expectedImprintId}`).toBe(expectedImprintId);
        });

        it('should have citation title and id', () => {
            expect(component.citationTitle).toBeDefined();
            expect(component.citationTitle)
                .withContext(`should be ${expectedCitationTitle}`)
                .toBe(expectedCitationTitle);

            expect(component.citationId).toBeDefined();
            expect(component.citationId).withContext(`should be ${expectedCitationId}`).toBe(expectedCitationId);
        });

        it('should have documentation title and id', () => {
            expect(component.documentationTitle).toBeDefined();
            expect(component.documentationTitle)
                .withContext(`should be ${expectedDocumentationTitle}`)
                .toBe(expectedDocumentationTitle);

            expect(component.documentationId).toBeDefined();
            expect(component.documentationId)
                .withContext(`should be ${expectedDocumentationId}`)
                .toBe(expectedDocumentationId);
        });

        it('should have dateFormat', () => {
            expect(component.dateFormat).toBeDefined();
            expect(component.dateFormat).withContext(`should be ${expectedDateFormat}`).toBe(expectedDateFormat);
        });

        it('should not have metadata nor `today`', () => {
            expect(component.pageMetaData).toBeUndefined();
            expect(component.contactMetaData).toBeUndefined();
            expect(component.today).toBeUndefined();
        });

        describe('#routeToSidenav', () => {
            it('... should not have been called', () => {
                expect(component.routeToSidenav).not.toHaveBeenCalled();
            });
        });

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain 3 heading components (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 3, 3);
            });

            it('... should contain 1 `div.awg-citation-description` with 5 `p` elements', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-citation-description', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.awg-citation-description > p', 5, 5);
            });

            it('... should contain 1 `div.awg-documentation-description` with 2 `p` elements', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-documentation-description', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.awg-documentation-description > p', 2, 2);
            });

            it('... should contain 1 `div.awg-imprint-description` with 5 `p` elements', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-imprint-description', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.awg-imprint-description > p', 5, 5);
            });

            it('... should contain 1 `div#awg-disclaimer` with 17 `p` elements', () => {
                getAndExpectDebugElementByCss(compDe, 'div#awg-disclaimer', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div#awg-disclaimer > p', 17, 17);
            });

            it('... should not pass down `title` and `id` to heading components', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 3, 3);
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                expect(headingCmps[0].title).toBeUndefined();
                expect(headingCmps[0].id).toBeUndefined();

                expect(headingCmps[1].title).toBeUndefined();
                expect(headingCmps[1].id).toBeUndefined();

                expect(headingCmps[2].title).toBeUndefined();
                expect(headingCmps[2].id).toBeUndefined();
            });

            it('... should not render `version`, `versionReleaseDate` and `today` yet', () => {
                // Debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version', 1, 1);
                const releaseDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version-release', 1, 1);
                const dateDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-date', 2, 2);

                // Native elements
                const versionEl = versionDes[0].nativeElement;
                const releaseEl = releaseDes[0].nativeElement;
                const dateEl0 = dateDes[0].nativeElement;
                const dateEl1 = dateDes[1].nativeElement;

                // Check output
                expect(versionEl).toBeDefined();
                expect(versionEl.textContent).withContext('should be empty string').toBe('');

                expect(releaseEl).toBeDefined();
                expect(releaseEl.textContent).withContext('should be empty string').toBe('');

                expect(dateEl0).toBeDefined();
                expect(dateEl0.textContent).withContext('should be empty string').toBe('');
                expect(dateEl1).toBeDefined();
                expect(dateEl1.textContent).withContext('should be empty string').toBe('');
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

        describe('#routeToSideNav', () => {
            let navigationSpy: Spy;

            beforeEach(() => {
                // Create spy of mockrouter SpyObj
                navigationSpy = mockRouter.navigate as jasmine.Spy;
            });

            it('... should have been called', () => {
                // Router navigation triggerd by onInit
                expect(component.routeToSidenav).toHaveBeenCalled();
            });

            it('... should have triggered `router.navigate`', () => {
                expect(navigationSpy).toHaveBeenCalled();
                expect(navigationSpy.calls.any()).withContext('has any calls').toEqual(true);
                expect(navigationSpy.calls.count()).withContext('has been called only once').toEqual(1);
            });

            it('... should tell ROUTER to navigate to `contactInfo` outlet', () => {
                const expectedRoute = 'contactInfo';

                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const outletRoute = navArgs[0][0].outlets.side;

                expect(navArgs).toBeDefined();
                expect(navArgs[0]).toBeDefined();
                expect(outletRoute).toBeDefined();
                expect(outletRoute).withContext(`should be: ${expectedRoute}`).toBe(expectedRoute);
                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).toBeDefined();
                expect(navExtras.preserveFragment).toBeDefined();
                expect(navExtras.preserveFragment).toBeTrue();
                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return metadata', () => {
                expect(component.pageMetaData).toBeDefined();
                expect(component.pageMetaData)
                    .withContext(`should be: ${expectedPageMetaData}`)
                    .toBe(expectedPageMetaData);

                expect(component.contactMetaData).toBeDefined();
                expect(component.contactMetaData)
                    .withContext(`should be: ${expectedContactMetaData}`)
                    .toBe(expectedContactMetaData);
            });
        });

        it('should have `today`', () => {
            expectSpyCall(dateSpy, 1);
            expect(component.today).toBeDefined();
            expect(component.today).withContext(`should be ${expectedToday}`).toBe(expectedToday);
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading components', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 3, 3);
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                expect(headingCmps[0].title).toBeTruthy();
                expect(headingCmps[0].title)
                    .withContext(`should have title: ${expectedCitationTitle}`)
                    .toBe(expectedCitationTitle);

                expect(headingCmps[0].id).toBeTruthy();
                expect(headingCmps[0].id).withContext(`should have id: ${expectedCitationId}`).toBe(expectedCitationId);

                expect(headingCmps[1].title).toBeTruthy();
                expect(headingCmps[1].title)
                    .withContext(`should have title: ${expectedDocumentationTitle}`)
                    .toBe(expectedDocumentationTitle);

                expect(headingCmps[1].id).toBeTruthy();
                expect(headingCmps[1].id)
                    .withContext(`should have id: ${expectedDocumentationId}`)
                    .toBe(expectedDocumentationId);

                expect(headingCmps[2].title).toBeTruthy();
                expect(headingCmps[2].title)
                    .withContext(`should have title: ${expectedImprintTitle}`)
                    .toBe(expectedImprintTitle);

                expect(headingCmps[2].id).toBeTruthy();
                expect(headingCmps[2].id).withContext(`should have id: ${expectedImprintId}`).toBe(expectedImprintId);
            });

            it('... should render `version`, `versionReleaseDate` and `today`', () => {
                // Debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version', 1, 1);
                const releaseDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version-release', 1, 1);
                const dateDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-date', 2, 2);

                // Native elements
                const versionEl = versionDes[0].nativeElement;
                const releaseEl = releaseDes[0].nativeElement;
                const dateEl0 = dateDes[0].nativeElement;
                const dateEl1 = dateDes[1].nativeElement;

                // Pipe
                const pipedToday = datePipe.transform(expectedToday, expectedDateFormat);

                // Check output
                expect(versionEl).toBeDefined();
                expect(versionEl.textContent)
                    .withContext(`should contain ${expectedPageMetaData.version}`)
                    .toContain(expectedPageMetaData.version);

                expect(releaseEl).toBeDefined();
                expect(releaseEl.textContent)
                    .withContext(`should contain ${expectedPageMetaData.versionReleaseDate}`)
                    .toContain(expectedPageMetaData.versionReleaseDate);

                expect(dateEl0).toBeDefined();
                expect(dateEl0.textContent).withContext(`should contain ${pipedToday}`).toContain(pipedToday);
                expect(dateEl1).toBeDefined();
                expect(dateEl1.textContent).withContext(`should contain ${pipedToday}`).toContain(pipedToday);
            });
        });
    });
});
