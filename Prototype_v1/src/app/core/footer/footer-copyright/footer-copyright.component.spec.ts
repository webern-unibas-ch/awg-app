import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FooterCopyrightComponent } from './footer-copyright.component';
import { Meta } from '@awg-core/core-models';

describe('FooterCopyrightComponent (DONE)', () => {
    let component: FooterCopyrightComponent;
    let fixture: ComponentFixture<FooterCopyrightComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedMetaData: Meta;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterCopyrightComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterCopyrightComponent);
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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have metaData', () => {
            expect(component.metaData).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-copyright-desc', () => {
                const footerCopyrightDes = fixture.debugElement.queryAll(By.css('div.awg-copyright-desc'));

                expect(footerCopyrightDes).toBeTruthy();
                expect(footerCopyrightDes.length).toBe(1, 'should have 1 div.awg-copyright-desc');
            });

            it('... should not render metaData yet', () => {
                const copyDe = fixture.debugElement.query(By.css('#awg-copyright-period'));
                const copyEl = copyDe.nativeElement;

                expect(copyEl.textContent).toBeDefined();
                expect(copyEl.textContent).toBe('', 'should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.metaData = expectedMetaData;

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('should render values', () => {
                const expectedYearStart = expectedMetaData.page.yearStart;
                const expectedYearRecent = expectedMetaData.page.yearRecent;

                const copyDe = fixture.debugElement.query(By.css('#awg-copyright-period'));
                const copyEl = copyDe.nativeElement;

                expect(copyEl.textContent).toContain(expectedYearStart + '–' + expectedYearRecent);
            });
        });
    });
});
