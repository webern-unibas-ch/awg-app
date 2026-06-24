import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { META_DATA } from '@awg-core/core-data';
import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';

import { FooterCopyrightComponent } from './footer-copyright.component';

describe('FooterCopyrightComponent (DONE)', () => {
    let component: FooterCopyrightComponent;
    let fixture: ComponentFixture<FooterCopyrightComponent>;
    let compDe: DebugElement;

    let expectedPageMetaData: MetaPage;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterCopyrightComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterCopyrightComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('pageMetaData', {} as MetaPage);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `pageMetaData` input', () => {
            expectToEqual(component.pageMetaData(), {} as MetaPage);
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-copyright-desc yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-copyright-desc', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have updated `pageMetaData` input', () => {
            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-copyright-desc', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-copyright-desc', 1, 1);
            });

            it('... should render copyright period', () => {
                const expectedPeriod = `${expectedPageMetaData.yearStart}–${expectedPageMetaData.yearCurrent}`;

                const copyDes = getAndExpectDebugElementByCss(compDe, '#awg-copyright-period', 1, 1);
                const copyEl: HTMLElement = copyDes[0].nativeElement;

                expectToContain(copyEl.textContent, expectedPeriod);
            });

            it('... should render project name', () => {
                const expectedProjectName = expectedPageMetaData.awgProjectName;

                const nameDes = getAndExpectDebugElementByCss(compDe, '.awg-project-name', 1, 1);
                const nameEl: HTMLElement = nameDes[0].nativeElement;

                expectToContain(nameEl.textContent, expectedProjectName);
            });
        });
    });
});
