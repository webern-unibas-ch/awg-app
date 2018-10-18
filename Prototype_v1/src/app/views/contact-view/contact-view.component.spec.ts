/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { Component, DebugElement, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ContactViewComponent } from './contact-view.component';
import { MetaService } from '@awg-core/services';
import { Meta } from '@awg-core/core-models';
import { By } from '@angular/platform-browser';

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

    let mockMetaService: Partial<MetaService>;
    let mockRouter;

    let expectedMetaData: Meta;
    const expectedTitle = 'Impressum';
    const expectedId = 'masthead';
    const expectedDateFormat = 'd. MMMM yyyy';

    beforeEach(async(() => {
        // mock service for test purposes
        mockMetaService = { getMetaData: () => expectedMetaData };

        // router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [ContactViewComponent, HeadingStubComponent],
            providers: [{ provide: MetaService, useValue: mockMetaService }, { provide: Router, useValue: mockRouter }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test meta data
        expectedMetaData = {
            page: { yearStart: 2015, yearRecent: 2018, version: '0.2.0', versionReleaseDate: '18. Oktober 2018' },
            edition: { editors: '', lastModified: '' },
            structure: { author: '', lastModified: '' }
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

    it('stub service and injected metaService should not be the same', () => {
        const metaService = TestBed.get(MetaService);
        expect(mockMetaService === metaService).toBe(false);

        // changing the mock service has no effect on the injected service
        const changedMetaData = {
            page: { yearStart: 2015, yearRecent: 2018, version: '0.2.1', versionReleaseDate: '20. Oktober 2018' },
            edition: { editors: '', lastModified: '' },
            structure: { author: '', lastModified: '' }
        };
        mockMetaService.getMetaData = () => changedMetaData;
        expect(metaService.getMetaData()).toBe(expectedMetaData);
    });

    describe('BEFORE initial data binding', () => {
        it('should have title and id', () => {
            expect(component.contactTitle).toBeDefined();
            expect(component.contactTitle).toBe(expectedTitle);

            expect(component.contactId).toBeDefined();
            expect(component.contactId).toBe(expectedId);
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
            it('... should contain one heading component (stubbed)', () => {
                const headingDes = compDe.queryAll(By.directive(HeadingStubComponent));

                expect(headingDes).toBeTruthy();
                expect(headingDes.length).toBe(1, 'should have only one heading');
            });

            it('... should contain 1 `div.contact-description` with 22 `p` elements', () => {
                const divEl = compEl.querySelectorAll('div.contact-description');
                const pEl = compEl.querySelectorAll('div.contact-description > p');

                expect(divEl).toBeDefined();
                expect(divEl.length).toBe(1, 'should have one `div.contact-description`');

                expect(pEl).toBeDefined();
                expect(pEl.length).toBe(22, 'should have 22 `p`');
            });

            it('... should not pass down `title` and `id` to heading component', () => {
                const headingDe = compDe.query(By.directive(HeadingStubComponent));
                const headingCmp = headingDe.injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeUndefined();
                expect(headingCmp.id).toBeUndefined();
            });

            it('... should not render `version`, `versionReleaseDate` and `today` yet', () => {
                const versionDe = compDe.query(By.css('.citation-version'));
                const versionEl = versionDe.nativeElement;

                const releaseDe = compDe.query(By.css('.citation-version-release'));
                const releaseEl = releaseDe.nativeElement;

                const dateDe = compDe.query(By.css('.citation-date'));
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
        beforeEach(() => {
            // mock the call to the meta service in #provideMetaData
            component.metaData = mockMetaService.getMetaData();

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
                expect(component.metaData).toBe(expectedMetaData);
            });
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading component', () => {
                const headingDe = compDe.query(By.directive(HeadingStubComponent));
                const headingCmp = headingDe.injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeTruthy();
                expect(headingCmp.title).toBe(expectedTitle, `should have title: ${expectedTitle}`);

                expect(headingCmp.id).toBeTruthy();
                expect(headingCmp.id).toBe(expectedId, `should have id: ${expectedId}`);
            });

            it('... should render `version`, `versionReleaseDate` and `today`', () => {
                const versionDe = compDe.query(By.css('.citation-version'));
                const versionEl = versionDe.nativeElement;

                const releaseDe = compDe.query(By.css('.citation-version-release'));
                const releaseEl = releaseDe.nativeElement;

                const dateDe = compDe.query(By.css('.citation-date'));
                const dateEl = dateDe.nativeElement;

                const pipedToday = datePipe.transform(Date.now(), expectedDateFormat);

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
