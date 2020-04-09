import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';

import { FooterCopyrightComponent } from './footer-copyright.component';

describe('FooterCopyrightComponent (DONE)', () => {
    let component: FooterCopyrightComponent;
    let fixture: ComponentFixture<FooterCopyrightComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedPageMetaData: MetaPage;

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

        // test data
        expectedPageMetaData = METADATA[MetaSectionTypes.page];
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have pageMetaData', () => {
            expect(component.pageMetaData).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-copyright-desc', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-copyright-desc', 1, 1);
            });

            it('... should not render copyright period yet', () => {
                const copyDes = getAndExpectDebugElementByCss(compDe, '#awg-copyright-period', 1, 1);
                const copyEl = copyDes[0].nativeElement;

                expect(copyEl.textContent).toBeDefined();
                expect(copyEl.textContent).toBe('', 'should be empty string');
            });

            it('... should not render project name yet', () => {
                const nameDes = getAndExpectDebugElementByCss(compDe, '.awg-project-name', 1, 1);
                const nameEl = nameDes[0].nativeElement;

                expect(nameEl.textContent).toBeDefined();
                expect(nameEl.textContent).toBe('', 'should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.pageMetaData = expectedPageMetaData;

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('should render copyright period', () => {
                const expectedYearStart = expectedPageMetaData.yearStart;
                const expectedYearCurrent = expectedPageMetaData.yearCurrent;

                const copyDes = getAndExpectDebugElementByCss(compDe, '#awg-copyright-period', 1, 1);
                const copyEl = copyDes[0].nativeElement;

                expect(copyEl.textContent).toBeDefined();
                expect(copyEl.textContent).toContain(
                    expectedYearStart + '–' + expectedYearCurrent,
                    `should contain ${expectedYearStart}-${expectedYearCurrent}`
                );
            });

            it('should render project name', () => {
                const expectedProjectName = expectedPageMetaData.awgProjectName;

                const nameDes = getAndExpectDebugElementByCss(compDe, '.awg-project-name', 1, 1);
                const nameEl = nameDes[0].nativeElement;

                expect(nameEl.textContent).toBeDefined();
                expect(nameEl.textContent).toContain(expectedProjectName, `should contain ${expectedProjectName}`);
            });
        });
    });
});
