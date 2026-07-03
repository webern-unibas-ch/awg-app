import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { META_DATA } from '../../data/meta.data';
import { MetaPage, MetaSectionTypes } from '../../models/meta.model';

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
        // Test data
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];

        // Create component fixture
        fixture = TestBed.createComponent(FooterCopyrightComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `pageMetaData`', () => {
            expectToBe(isSignal(component.pageMetaData), true);

            expect(() => component.pageMetaData()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-copyright-desc yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-copyright-desc', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `pageMetaData` to hold provided data', () => {
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
