import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { Component, DebugElement, Input, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { META_DATA } from '@awg-core/core-data';
import { MetaIdentifiers, MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { StructureInfoComponent } from './structure-info.component';

registerLocaleData(localeDeDE);

// Mock MetaIdentifierBadges component
@Component({
    selector: 'awg-meta-identifier-badges',
    template: '',
    standalone: false,
})
class MetaIdentifierBadgesStubComponent {
    @Input()
    identifiers: MetaIdentifiers | undefined;
}

describe('StructureInfoComponent (DONE)', () => {
    let component: StructureInfoComponent;
    let fixture: ComponentFixture<StructureInfoComponent>;
    let compDe: DebugElement;

    let mockCoreService: Partial<CoreService>;

    const datePipe = new DatePipe('de-DE');
    let expectedStructureMetaData: MetaStructure;
    const expectedStructureInfoHeader = 'Strukturmodell';

    beforeEach(async () => {
        // Stub service for test purposes
        mockCoreService = { getMetaDataSection: sectionType => META_DATA[sectionType] };

        await TestBed.configureTestingModule({
            declarations: [StructureInfoComponent, MetaIdentifierBadgesStubComponent],
            imports: [DatePipe],
            providers: [
                { provide: LOCALE_ID, useValue: 'de-DE' },
                { provide: CoreService, useValue: mockCoreService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StructureInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedStructureMetaData = META_DATA[MetaSectionTypes.structure];

        // Spies
        vi.spyOn(component, 'provideMetaData');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expectToBe(mockCoreService === coreService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have structureInfoHeader', () => {
            expectToBe(component.structureInfoHeader, expectedStructureInfoHeader);
        });

        describe('#provideMetaData()', () => {
            it('... should have a method `provideMetaData`', () => {
                expect(component.provideMetaData).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });

            it('... should not have structureMetaData', () => {
                expect(component.structureMetaData).toBeUndefined();
            });
        });

        describe('VIEW', () => {
            it('... should contain 1 div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain one `h5` header and 4 `p` elements in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h5#awg-structure-info-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card-body p', 4, 4);
            });

            it('... should not render `structureInfoHeader` yet', () => {
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

            it('... should not pass `identifiers` to MetaIdentifierBadgesComponent yet', () => {
                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author', 1, 1);
                const badgeDes = getAndExpectDebugElementByDirective(
                    authorDes[0],
                    MetaIdentifierBadgesStubComponent,
                    1,
                    1
                );
                const badgeCmp = badgeDes[0].injector.get(MetaIdentifierBadgesStubComponent);

                expect(badgeCmp.identifiers).toBeUndefined();
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
            // Mock the call to the meta service in #provideMetaData
            component.structureMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.structure);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData()', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return structureMetaData', () => {
                expectToEqual(component.structureMetaData, expectedStructureMetaData);
            });
        });

        describe('VIEW', () => {
            it('... should render `structureInfoHeader`', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-structure-info-header', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, expectedStructureInfoHeader);
            });

            it('... should render author link', () => {
                const expectedAuthor = expectedStructureMetaData.authors[0];

                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author a', 1, 1);
                const authorEl: HTMLAnchorElement = authorDes[0].nativeElement;

                expectToBe(authorEl.href, expectedAuthor.homepage);
                expectToBe(authorEl.innerHTML, expectedAuthor.name);
            });

            it('... should pass down `identifiers` to MetaIdentifierBadgesComponent', () => {
                const expectedIdentifiers = expectedStructureMetaData.authors[0].identifiers;
                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author', 1, 1);
                const badgeDes = getAndExpectDebugElementByDirective(
                    authorDes[0],
                    MetaIdentifierBadgesStubComponent,
                    1,
                    1
                );
                const badgeCmp = badgeDes[0].injector.get(MetaIdentifierBadgesStubComponent);

                expectToEqual(badgeCmp.identifiers, expectedIdentifiers);
            });

            it('... should render last modification date in correct format', () => {
                const expectedLastModified = datePipe.transform(expectedStructureMetaData.lastModified, 'longDate');

                const lastmodDes = getAndExpectDebugElementByCss(compDe, 'span#awg-structure-info-lastmodified', 1, 1);
                const lastmodEl: HTMLSpanElement = lastmodDes[0].nativeElement;

                expectToContain(lastmodEl.textContent, expectedLastModified);
            });
        });
    });
});
