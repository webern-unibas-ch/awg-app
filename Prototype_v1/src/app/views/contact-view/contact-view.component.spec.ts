/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { ContactViewComponent } from './contact-view.component';

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

    const datePipe = new DatePipe('en');

    let mockCoreService: Partial<CoreService>;
    let mockRouter;

    let expectedMetaData: Meta;
    const expectedMastHeadTitle = 'Impressum';
    const expectedMastHeadId = 'awg-masthead';
    const expectedCitationTitle = 'Zitation';
    const expectedCitationId = 'awg-citation';

    const expectedDateFormat = 'd. MMMM yyyy';

    beforeEach(async(() => {
        // mock service for test purposes
        mockCoreService = { getMetaData: () => expectedMetaData };

        // router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [ContactViewComponent, HeadingStubComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }, { provide: Router, useValue: mockRouter }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test meta data
        expectedMetaData = new Meta();
        expectedMetaData.page = {
            yearStart: 2015,
            yearRecent: 2018,
            version: '0.2.0',
            versionReleaseDate: '18. Oktober 2018'
        };

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
        spyOn(component, 'routeToSidenav').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.get(CoreService);
        expect(mockCoreService === coreService).toBe(false);

        // changing the mock service has no effect on the injected service
        const changedMetaData = new Meta();
        changedMetaData.page = {
            yearStart: 2015,
            yearRecent: 2018,
            version: '0.2.1',
            versionReleaseDate: '20. Oktober 2018'
        };
        mockCoreService.getMetaData = () => changedMetaData;
        expect(coreService.getMetaData()).toBe(expectedMetaData);
    });

    describe('BEFORE initial data binding', () => {
        it('should have masthead title and id', () => {
            expect(component.mastHeadTitle).toBeDefined();
            expect(component.mastHeadTitle).toBe(expectedMastHeadTitle);

            expect(component.mastHeadId).toBeDefined();
            expect(component.mastHeadId).toBe(expectedMastHeadId);
        });

        it('should have citation title and id', () => {
            expect(component.citationTitle).toBeDefined();
            expect(component.citationTitle).toBe(expectedCitationTitle);

            expect(component.citationId).toBeDefined();
            expect(component.citationId).toBe(expectedCitationId);
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
            expect(component.metaData).toBeUndefined('should be undefined');
            expect(component.today).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain two heading component (stubbed)', () => {
                const headingDes = compDe.queryAll(By.directive(HeadingStubComponent));

                expect(headingDes).toBeTruthy();
                expect(headingDes.length).toBe(2, 'should have two headings');
            });

            it('... should contain 1 `div.awg-citation-description` with 5 `p` elements', () => {
                const divEl = compEl.querySelectorAll('div.awg-citation-description');
                const pEl = compEl.querySelectorAll('div.awg-citation-description > p');

                expect(divEl).toBeDefined();
                expect(divEl.length).toBe(1, 'should have one `div.awg-citation-description`');

                expect(pEl).toBeDefined();
                expect(pEl.length).toBe(5, 'should have 5 `p`');
            });

            it('... should contain 1 `div.awg-masthead-description` with 21 `p` elements', () => {
                const divEl = compEl.querySelectorAll('div.awg-masthead-description');
                const pEl = compEl.querySelectorAll('div.awg-masthead-description > p');

                expect(divEl).toBeDefined();
                expect(divEl.length).toBe(1, 'should have one `div.awg-masthead-description`');

                expect(pEl).toBeDefined();
                expect(pEl.length).toBe(21, 'should have 21 `p`');
            });

            it('... should not pass down `title` and `id` to heading components', () => {
                const headingDes = compDe.queryAll(By.directive(HeadingStubComponent));
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                expect(headingCmps[0].title).toBeUndefined();
                expect(headingCmps[0].id).toBeUndefined();

                expect(headingCmps[1].title).toBeUndefined();
                expect(headingCmps[1].id).toBeUndefined();
            });

            it('... should not render `version`, `versionReleaseDate` and `today` yet', () => {
                const versionDe = compDe.query(By.css('.awg-citation-version'));
                const versionEl = versionDe.nativeElement;

                const releaseDe = compDe.query(By.css('.awg-citation-version-release'));
                const releaseEl = releaseDe.nativeElement;

                const dateDe = compDe.query(By.css('.awg-citation-date'));
                const dateEl = dateDe.nativeElement;

                expect(versionEl).toBeDefined();
                expect(versionEl.textContent).toBe('', 'should be empty string');

                expect(releaseEl).toBeDefined();
                expect(releaseEl.textContent).toBe('', 'should be empty string');

                expect(dateEl).toBeDefined();
                expect(dateEl.textContent).toBe('', 'should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        let expectedToday;

        beforeEach(() => {
            // mock the call to the meta service in #provideMetaData
            component.metaData = mockCoreService.getMetaData();

            expectedToday = Date.now();

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
                expect(component.metaData).toBeDefined();
                expect(component.metaData).toBe(expectedMetaData);
            });
        });

        it('should have `today`', () => {
            expect(component.today).toBeDefined();
            expect(component.today).toBe(expectedToday, `should be ${expectedToday}`);
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading components', () => {
                const headingDes = compDe.queryAll(By.directive(HeadingStubComponent));
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                expect(headingCmps[0].title).toBeTruthy();
                expect(headingCmps[0].title).toBe(expectedCitationTitle, `should have title: ${expectedCitationTitle}`);

                expect(headingCmps[0].id).toBeTruthy();
                expect(headingCmps[0].id).toBe(expectedCitationId, `should have id: ${expectedCitationId}`);

                expect(headingCmps[1].title).toBeTruthy();
                expect(headingCmps[1].title).toBe(expectedMastHeadTitle, `should have title: ${expectedMastHeadTitle}`);

                expect(headingCmps[1].id).toBeTruthy();
                expect(headingCmps[1].id).toBe(expectedMastHeadId, `should have id: ${expectedMastHeadId}`);
            });

            it('... should render `version`, `versionReleaseDate` and `today`', () => {
                const versionDe = compDe.query(By.css('.awg-citation-version'));
                const versionEl = versionDe.nativeElement;

                const releaseDe = compDe.query(By.css('.awg-citation-version-release'));
                const releaseEl = releaseDe.nativeElement;

                const dateDe = compDe.query(By.css('.awg-citation-date'));
                const dateEl = dateDe.nativeElement;

                const pipedToday = datePipe.transform(expectedToday, expectedDateFormat);

                expect(versionEl).toBeDefined();
                expect(versionEl.textContent).toBe(
                    expectedMetaData.page.version,
                    `should be ${expectedMetaData.page.version}`
                );

                expect(releaseEl).toBeDefined();
                expect(releaseEl.textContent).toBe(
                    expectedMetaData.page.versionReleaseDate,
                    `should be ${expectedMetaData.page.versionReleaseDate}`
                );

                expect(dateEl).toBeDefined();
                expect(dateEl.textContent).toBe(pipedToday, `should be ${pipedToday}`);
            });
        });
    });
});
