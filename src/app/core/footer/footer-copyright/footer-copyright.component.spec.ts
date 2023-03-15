import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { METADATA } from '@awg-core/core-data';
import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';

import { FooterCopyrightComponent } from './footer-copyright.component';

describe('FooterCopyrightComponent (DONE)', () => {
    let component: FooterCopyrightComponent;
    let fixture: ComponentFixture<FooterCopyrightComponent>;
    let compDe: DebugElement;

    let expectedPageMetaData: MetaPage;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FooterCopyrightComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterCopyrightComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedPageMetaData = METADATA[MetaSectionTypes.page];
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have pageMetaData', () => {
            expect(component.pageMetaData).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-copyright-desc', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-copyright-desc', 1, 1);
            });

            it('... should not render copyright period yet', () => {
                const copyDes = getAndExpectDebugElementByCss(compDe, '#awg-copyright-period', 1, 1);
                const copyEl = copyDes[0].nativeElement;

                expect(copyEl.textContent).toBeDefined();
                expect(copyEl.textContent).toBeFalsy();
            });

            it('... should not render project name yet', () => {
                const nameDes = getAndExpectDebugElementByCss(compDe, '.awg-project-name', 1, 1);
                const nameEl = nameDes[0].nativeElement;

                expect(nameEl.textContent).toBeDefined();
                expect(nameEl.textContent).toBeFalsy();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.pageMetaData = expectedPageMetaData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render copyright period', () => {
                const expectedYearStart = expectedPageMetaData.yearStart;
                const expectedYearCurrent = expectedPageMetaData.yearCurrent;

                const copyDes = getAndExpectDebugElementByCss(compDe, '#awg-copyright-period', 1, 1);
                const copyEl = copyDes[0].nativeElement;

                expect(copyEl.textContent).toBeTruthy();
                expect(copyEl.textContent)
                    .withContext(`should contain ${expectedYearStart}-${expectedYearCurrent}`)
                    .toContain(expectedYearStart + '–' + expectedYearCurrent);
            });

            it('... should render project name', () => {
                const expectedProjectName = expectedPageMetaData.awgProjectName;

                const nameDes = getAndExpectDebugElementByCss(compDe, '.awg-project-name', 1, 1);
                const nameEl = nameDes[0].nativeElement;

                expect(nameEl.textContent).toBeTruthy();
                expect(nameEl.textContent)
                    .withContext(`should contain ${expectedProjectName}`)
                    .toContain(expectedProjectName);
            });
        });
    });
});
