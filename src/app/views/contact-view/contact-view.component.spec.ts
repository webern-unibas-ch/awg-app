/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePipe } from '@angular/common';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

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

        describe('#routeToSidenav()', () => {
            it('... should have a method `routeToSidenav`', () => {
                expect(component.routeToSidenav).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.routeToSidenav).not.toHaveBeenCalled();
            });
        });

        describe('#provideMetaData()', () => {
            it('... should have a method `provideMetaData`', () => {
                expect(component.provideMetaData).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
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
                const versionEl = versionDes[0].nativeElement;
                const releaseEl = releaseDes[0].nativeElement;
                const dateEl0 = dateDes[0].nativeElement;
                const dateEl1 = dateDes[1].nativeElement;

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

        describe('#routeToSideNav()', () => {
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
                expectToBe(navigationSpy.calls.any(), true);
                expectToBe(navigationSpy.calls.count(), 1);
            });

            it('... should tell ROUTER to navigate to `contactInfo` outlet', () => {
                const expectedRoute = 'contactInfo';

                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const outletRoute = navArgs[0][0].outlets.side;

                expect(navArgs).toBeDefined();
                expect(navArgs[0]).toBeDefined();
                expectToBe(outletRoute, expectedRoute);
                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).toBeDefined();
                expectToBe(navExtras.preserveFragment, true);
                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });

        describe('#provideMetaData()', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return metadata', () => {
                expectToEqual(component.pageMetaData, expectedPageMetaData);
                expectToEqual(component.contactMetaData, expectedContactMetaData);
            });
        });

        it('... should have `today`', () => {
            expectSpyCall(dateSpy, 1);
            expectToBe(component.today, expectedToday);
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
                const versionEl = versionDes[0].nativeElement;
                const releaseEl = releaseDes[0].nativeElement;
                const dateEl0 = dateDes[0].nativeElement;
                const dateEl1 = dateDes[1].nativeElement;

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
