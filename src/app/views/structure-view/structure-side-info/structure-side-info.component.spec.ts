import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { Component, DebugElement, input, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { META_DATA } from '@awg-core/data/meta.data';
import { MetaIdentifiers, MetaSectionTypes, MetaStructure } from '@awg-core/models/meta.model';
import { MetaIdentifierBadgesComponent } from '@awg-shared/meta-identifier-badges/meta-identifier-badges.component';

import { StructureSideInfoComponent } from './structure-side-info.component';

registerLocaleData(localeDeDE);

// Mock components
@Component({
    selector: 'awg-meta-identifier-badges',
    template: '',
})
class MetaIdentifierBadgesStubComponent {
    identifiers = input.required<MetaIdentifiers>();
}

describe('StructureSideInfoComponent (DONE)', () => {
    let component: StructureSideInfoComponent;
    let fixture: ComponentFixture<StructureSideInfoComponent>;
    let compDe: DebugElement;

    let expectedStructureMetaData: MetaStructure;
    const expectedStructureSideInfoHeader = 'Strukturmodell';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StructureSideInfoComponent],
            providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
        })
            .overrideComponent(StructureSideInfoComponent, {
                remove: { imports: [MetaIdentifierBadgesComponent] },
                add: { imports: [MetaIdentifierBadgesStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedStructureMetaData = META_DATA[MetaSectionTypes.structure];

        // Create component fixture
        fixture = TestBed.createComponent(StructureSideInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have structureSideInfoHeader', () => {
            expectToBe(component.STRUCTURE_SIDE_INFO_HEADER, expectedStructureSideInfoHeader);
        });

        it('... should have `structureMetaData`', () => {
            expectToEqual(component.structureMetaData, expectedStructureMetaData);
        });

        describe('VIEW', () => {
            it('... should contain one div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain one `h5` header and 4 `p` elements in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h5#awg-structure-info-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card-body p', 4, 4);
            });

            it('... should not render `structureSideInfoHeader` yet', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-structure-info-header', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, '');
            });

            it('... should not render author information yet', () => {
                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author a', 1, 1);
                const authorEl: HTMLAnchorElement = authorDes[0].nativeElement;

                expectToBe(authorEl.href, '');
                expectToBe(authorEl.innerHTML, '');
            });

            it('... should contain one `MetaIdentifierBadgesComponent`', () => {
                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author', 1, 1);

                getAndExpectDebugElementByDirective(authorDes[0], MetaIdentifierBadgesStubComponent, 1, 1);
            });

            it('... should throw when accessing MetaIdentifierBadgesComponent inputs (`identifiers`) due to missing initial data binding', () => {
                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author', 1, 1);
                const badgeDes = getAndExpectDebugElementByDirective(
                    authorDes[0],
                    MetaIdentifierBadgesStubComponent,
                    1,
                    1
                );
                const badgeCmp = badgeDes[0].injector.get(MetaIdentifierBadgesStubComponent);

                expect(() => badgeCmp.identifiers()).toThrow();
            });

            it('... should not render last modification date yet', () => {
                const dateDes = getAndExpectDebugElementByCss(compDe, 'span#awg-structure-info-lastmodified', 1, 1);
                const dateEl: HTMLSpanElement = dateDes[0].nativeElement;

                expectToBe(dateEl.textContent, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render `structureSideInfoHeader`', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-structure-info-header', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, expectedStructureSideInfoHeader);
            });

            it('... should render author link', () => {
                const expectedAuthor = expectedStructureMetaData.authors[0];

                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author a', 1, 1);
                const authorEl: HTMLAnchorElement = authorDes[0].nativeElement;

                expectToBe(authorEl.href, expectedAuthor.homepage);
                expectToBe(authorEl.innerHTML, expectedAuthor.name);
            });

            it('... should pass down correct values to MetaIdentifierBadgesComponent (`identifiers`)', () => {
                const expectedIdentifiers = expectedStructureMetaData.authors[0].identifiers;
                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author', 1, 1);
                const badgeDes = getAndExpectDebugElementByDirective(
                    authorDes[0],
                    MetaIdentifierBadgesStubComponent,
                    1,
                    1
                );
                const badgeCmp = badgeDes[0].injector.get(MetaIdentifierBadgesStubComponent);

                expectToEqual(badgeCmp.identifiers(), expectedIdentifiers);
            });

            it('... should render last modification date in correct format', () => {
                const datePipe = new DatePipe('de-DE');
                const expectedLastModified = datePipe.transform(expectedStructureMetaData.lastModified, 'longDate');

                const lastmodDes = getAndExpectDebugElementByCss(compDe, 'span#awg-structure-info-lastmodified', 1, 1);
                const lastmodEl: HTMLSpanElement = lastmodDes[0].nativeElement;

                expectToContain(lastmodEl.textContent, expectedLastModified);
            });
        });
    });
});
