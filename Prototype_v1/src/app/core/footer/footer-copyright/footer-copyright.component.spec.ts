import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { Meta } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';

import { FooterCopyrightComponent } from './footer-copyright.component';

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

        // test data
        expectedMetaData = METADATA;
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
                getAndExpectDebugElementByCss(compDe, 'div.awg-copyright-desc', 1, 1);
            });

            it('... should not render metaData yet', () => {
                const copyDes = getAndExpectDebugElementByCss(compDe, '#awg-copyright-period', 1, 1);

                expect(copyDes[0].nativeElement.textContent).toBeDefined();
                expect(copyDes[0].nativeElement.textContent).toBe('', 'should be empty string');
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

                const copyDes = getAndExpectDebugElementByCss(compDe, '#awg-copyright-period', 1, 1);
                const copyEl = copyDes[0].nativeElement;

                expect(copyEl.textContent).toBeDefined();
                expect(copyEl.textContent).toContain(
                    expectedYearStart + '–' + expectedYearRecent,
                    `should contain ${expectedYearStart}-${expectedYearRecent}`
                );
            });
        });
    });
});
