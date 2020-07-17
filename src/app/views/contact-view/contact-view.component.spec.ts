/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';

import { Meta, MetaContact, MetaPage, MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';
import { CoreService } from '@awg-core/services';

import { ContactViewComponent } from './contact-view.component';
import Spy = jasmine.Spy;

// mock heading component
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
    let compEl;

    let dateSpy: Spy;
    const datePipe = new DatePipe('en');

    let mockCoreService: Partial<CoreService>;
    let mockRouter;

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

    beforeEach(async(() => {
        // mock service for test purposes
        mockCoreService = { getMetaDataSection: sectionType => METADATA[sectionType] };

        // router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [ContactViewComponent, HeadingStubComponent],
            providers: [
                { provide: CoreService, useValue: mockCoreService },
                { provide: Router, useValue: mockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedPageMetaData = METADATA[MetaSectionTypes.page];
        expectedContactMetaData = METADATA[MetaSectionTypes.contact];

        // spies on component functions
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
            expect(component.imprintTitle).toBe(expectedImprintTitle);

            expect(component.imprintId).toBeDefined();
            expect(component.imprintId).toBe(expectedImprintId);
        });

        it('should have citation title and id', () => {
            expect(component.citationTitle).toBeDefined();
            expect(component.citationTitle).toBe(expectedCitationTitle);

            expect(component.citationId).toBeDefined();
            expect(component.citationId).toBe(expectedCitationId);
        });

        it('should have documentation title and id', () => {
            expect(component.documentationTitle).toBeDefined();
            expect(component.documentationTitle).toBe(expectedDocumentationTitle);

            expect(component.documentationId).toBeDefined();
            expect(component.documentationId).toBe(expectedDocumentationId);
        });

        it('should have dateFormat', () => {
            expect(component.dateFormat).toBeDefined();
            expect(component.dateFormat).toBe(expectedDateFormat);
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

        it('should not have metadata nor `today`', () => {
            expect(component.pageMetaData).toBeUndefined('should be undefined');
            expect(component.contactMetaData).toBeUndefined('should be undefined');
            expect(component.today).toBeUndefined('should be undefined');
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
                // debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version', 1, 1);
                const releaseDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version-release', 1, 1);
                const dateDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-date', 2, 2);

                // native elements
                const versionEl = versionDes[0].nativeElement;
                const releaseEl = releaseDes[0].nativeElement;
                const dateEl0 = dateDes[0].nativeElement;
                const dateEl1 = dateDes[1].nativeElement;

                // check output
                expect(versionEl).toBeDefined();
                expect(versionEl.textContent).toBe('', 'should be empty string');

                expect(releaseEl).toBeDefined();
                expect(releaseEl.textContent).toBe('', 'should be empty string');

                expect(dateEl0).toBeDefined();
                expect(dateEl0.textContent).toBe('', 'should be empty string');
                expect(dateEl1).toBeDefined();
                expect(dateEl1.textContent).toBe('', 'should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the call to the meta service in #provideMetaData
            component.pageMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.page);
            component.contactMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.contact);

            // spy on Date.now() returning a mocked (fixed) date
            expectedToday = Date.now();
            dateSpy = spyOn(Date, 'now').and.callFake(() => expectedToday);

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('#routeToSideNav', () => {
            let navigationSpy;

            beforeEach(() => {
                // create spy of mockrouter SpyObj
                navigationSpy = mockRouter.navigate as jasmine.Spy;
            });

            it('... should have been called', () => {
                // router navigation triggerd by onInit
                expect(component.routeToSidenav).toHaveBeenCalled();
            });

            it('... should have triggered `router.navigate`', () => {
                expect(navigationSpy).toHaveBeenCalled();
                expect(navigationSpy.calls.any()).toEqual(true, 'has any calls');
                expect(navigationSpy.calls.count()).toEqual(1, 'has been called only once');
            });

            it('... should tell ROUTER to navigate to `contactInfo` outlet', () => {
                const expectedRoute = 'contactInfo';

                // catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const outletRoute = navArgs[0][0].outlets.side;

                expect(navArgs).toBeDefined('should have navArgs');
                expect(navArgs[0]).toBeDefined('should have navCommand');
                expect(outletRoute).toBeDefined('should have outletRoute');
                expect(outletRoute).toBe(expectedRoute, `should be: ${expectedRoute}`);
                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).toBeDefined('should have navExtras');
                expect(navExtras.preserveFragment).toBeDefined('should have preserveFragment extra');
                expect(navExtras.preserveFragment).toBe(true, 'should be `preserveFragment:true`');
                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return metadata', () => {
                expect(component.pageMetaData).toBeDefined();
                expect(component.pageMetaData).toBe(expectedPageMetaData);

                expect(component.contactMetaData).toBeDefined();
                expect(component.contactMetaData).toBe(expectedContactMetaData);
            });
        });

        it('should have `today`', () => {
            expectSpyCall(dateSpy, 1);
            expect(component.today).toBeDefined();
            expect(component.today).toBe(expectedToday, `should be ${expectedToday}`);
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading components', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 3, 3);
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                expect(headingCmps[0].title).toBeTruthy();
                expect(headingCmps[0].title).toBe(expectedCitationTitle, `should have title: ${expectedCitationTitle}`);

                expect(headingCmps[0].id).toBeTruthy();
                expect(headingCmps[0].id).toBe(expectedCitationId, `should have id: ${expectedCitationId}`);

                expect(headingCmps[1].title).toBeTruthy();
                expect(headingCmps[1].title).toBe(
                    expectedDocumentationTitle,
                    `should have title: ${expectedDocumentationTitle}`
                );

                expect(headingCmps[1].id).toBeTruthy();
                expect(headingCmps[1].id).toBe(expectedDocumentationId, `should have id: ${expectedDocumentationId}`);

                expect(headingCmps[2].title).toBeTruthy();
                expect(headingCmps[2].title).toBe(expectedImprintTitle, `should have title: ${expectedImprintTitle}`);

                expect(headingCmps[2].id).toBeTruthy();
                expect(headingCmps[2].id).toBe(expectedImprintId, `should have id: ${expectedImprintId}`);
            });

            it('... should render `version`, `versionReleaseDate` and `today`', () => {
                // debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version', 1, 1);
                const releaseDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version-release', 1, 1);
                const dateDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-date', 2, 2);

                // native elements
                const versionEl = versionDes[0].nativeElement;
                const releaseEl = releaseDes[0].nativeElement;
                const dateEl0 = dateDes[0].nativeElement;
                const dateEl1 = dateDes[1].nativeElement;

                // pipe
                const pipedToday = datePipe.transform(expectedToday, expectedDateFormat);

                // check output
                expect(versionEl).toBeDefined();
                expect(versionEl.textContent).toContain(
                    expectedPageMetaData.version,
                    `should contain ${expectedPageMetaData.version}`
                );

                expect(releaseEl).toBeDefined();
                expect(releaseEl.textContent).toContain(
                    expectedPageMetaData.versionReleaseDate,
                    `should contain ${expectedPageMetaData.versionReleaseDate}`
                );

                expect(dateEl0).toBeDefined();
                expect(dateEl0.textContent).toContain(pipedToday, `should contain ${pipedToday}`);
                expect(dateEl1).toBeDefined();
                expect(dateEl1.textContent).toContain(pipedToday, `should contain ${pipedToday}`);
            });
        });
    });
});
