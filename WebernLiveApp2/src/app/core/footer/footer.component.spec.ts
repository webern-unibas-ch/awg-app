/* tslint:disable:no-unused-variable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import { FooterComponent } from './footer.component';
import { MetaData } from '../metadata';

import { RouterLinkStubDirective }   from '../../../../../testing';

/**
 * Testing Variables
 */
let comp: FooterComponent;
let compFixture: ComponentFixture<FooterComponent>;

let testHost: TestHostComponent;
let thFixture: ComponentFixture<TestHostComponent>;

let fixture: ComponentFixture<any>;
let versionEl, versionDateEl, copyEl: DebugElement;
let expectedMeta: MetaData;

/**
 * Test Host (Parent Component)
 */
@Component({
    template: `
    <awg-footer [meta]="metaData"></awg-footer>`
})
class TestHostComponent {
    metaData: MetaData = {
        page: {
            yearStart: 2015,
            yearRecent: 2017,
            version: '1.0.0',
            versionReleaseDate: '8. November 2016'
        },
        edition: {
            editors: '',
            lastModified: ''
        }
    };
}


/***************************
 *
 * Tests for FooterComponent
 *
 ***************************/
describe('FooterComponent', () => {

    describe('> stand-alone setup', standAloneSetup);
    describe('> with test host (parent) setup', testHostSetup);
});


///////////////////////////////
/**
 * Testing the component for itself (stand-alone)
 */
function standAloneSetup() {
    // Configuration of TestModule
    beforeEach( async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FooterComponent,
                RouterLinkStubDirective
            ]
        })
        // compile template and css; afterwards no further configuration possible for TestBed instance
        .compileComponents();
    }));

    beforeEach(() => {
        // create Component & return ComponentFixture
        compFixture = TestBed.createComponent(FooterComponent);
        // FooterComponent test instance
        comp = compFixture.componentInstance;
    });

    describe('> BEFORE @Iinput binding of meta data', () => {
        it('should create the component', () => {
            expect(comp).toBeTruthy();
        });

        it('> should NOT have metaData before @Input binding', () => {
            expect(comp.meta).toBeUndefined();
        });

        it('> should follow routerLink to "/contact" when clicked (TODO)', () => {
            expect(true).toBe(false);
        });
    });

    describe('> AFTER @Iinput binding of meta data', () => {
         // pretend that the component was wired to something that supplied a metaData
        beforeEach(() => {
            fixture = compFixture;
            // find version element
            versionEl = fixture.debugElement.query(By.css('#version'));
            // find versionDate element
            versionDateEl = fixture.debugElement.query(By.css('#versionDate'));
            // find copyright element
            copyEl = fixture.debugElement.query(By.css('#copyrightPeriod'));

            expectedMeta = new MetaData();
            expectedMeta['page'] = {
                yearStart: 2015,
                yearRecent: 2017,
                version: '1.0.0',
                versionReleaseDate: '8. November 2016'
            };
            comp.meta = expectedMeta;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('> should have metaData after @Input binding', () => {
            expect(comp.meta).toBeDefined();
        });

        it('> should display values', () => {
            const expectedVersion = expectedMeta.page.version;
            const expectedVersionDate = expectedMeta.page.versionReleaseDate;
            const expectedYearStart = expectedMeta.page.yearStart;
            const expectedYearRecent = expectedMeta.page.yearRecent;

            expect(versionEl.nativeElement.textContent).toContain(expectedVersion);
            expect(versionDateEl.nativeElement.textContent).toContain(expectedVersionDate);
            expect(copyEl.nativeElement.textContent).toContain(expectedYearStart + '–' + expectedYearRecent);
        });
    });
}


///////////////////////////////
/**
 * Testing the component with test host (parent component)
 */
function testHostSetup() {
    // Configuration of TestModule
    beforeEach( async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FooterComponent,
                TestHostComponent,
                RouterLinkStubDirective
            ]
        })
        // compile template and css; afterwards no further configuration possible for TestBed instance
        .compileComponents();
    }));

    beforeEach(() => {
        // create Component & return ComponentFixture
        thFixture = TestBed.createComponent(TestHostComponent);
        // Component test instance
        testHost = thFixture.componentInstance;
    });

    describe('> BEFORE @Iinput binding of meta data', () => {

        it('> should create the testHost (parent) component', () => {
            expect(testHost).toBeTruthy();
        });

        it('> should create the child component (TODO)', () => {
            expect(true).toBe(false);
        });

        it('> should follow routerLink to "/contact" when clicked (TODO)', () => {
            expect(true).toBe(false);
        });
    });

    describe('> AFTER @Iinput binding of meta data', () => {
        // pretend that the component was wired to something that supplied a metaData
        beforeEach(() => {
            fixture = thFixture;
            // find version element
            versionEl = fixture.debugElement.query(By.css('#version'));
            // find versionDate element
            versionDateEl = fixture.debugElement.query(By.css('#versionDate'));
            // find copyright element
            copyEl = fixture.debugElement.query(By.css('#copyrightPeriod'));

            // prepare test data
            expectedMeta = testHost.metaData;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('> should have metaData after @Input binding', () => {
            expect(comp.meta).toBeDefined();
        });

        it('> should display values', () => {
            const expectedVersion = expectedMeta.page.version;
            const expectedVersionDate = expectedMeta.page.versionReleaseDate;
            const expectedYearStart = expectedMeta.page.yearStart;
            const expectedYearRecent = expectedMeta.page.yearRecent;

            expect(versionEl.nativeElement.textContent).toContain(expectedVersion);
            expect(versionDateEl.nativeElement.textContent).toContain(expectedVersionDate);
            expect(copyEl.nativeElement.textContent).toContain(expectedYearStart + '–' + expectedYearRecent);
        });
    });
}
