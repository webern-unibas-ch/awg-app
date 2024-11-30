import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { StructureViewComponent } from './structure-view.component';

// Mock heading component
@Component({ selector: 'awg-heading', template: '' })
class HeadingStubComponent {
    @Input()
    title: string;
    @Input()
    id: string;
}

describe('StructureViewComponent (DONE)', () => {
    let component: StructureViewComponent;
    let fixture: ComponentFixture<StructureViewComponent>;
    let compDe: DebugElement;

    const expectedTitle = 'Datenstrukturmodell';
    const expectedId = 'awg-structure-view';

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [StructureViewComponent, HeadingStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StructureViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have title and id', () => {
            expectToBe(component.structureViewTitle, expectedTitle);
            expectToBe(component.structureViewId, expectedId);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-structure-view`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-structure-view', 1, 1);
            });

            it('... should contain one heading component (stubbed) in `div.awg-structure-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-structure-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
            });

            it('... should not pass down `title` and `id` to heading component', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeUndefined();
                expect(headingCmp.id).toBeUndefined();
            });

            it('... should contain one `div.awg-structure-view-content` in `div.awg-structure-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-structure-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-structure-view-content', 1, 1);
            });

            it('... should contain three `p` & one `svg` element in div.awg-structure-view-content', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-structure-view-content', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'p', 3, 3);
                getAndExpectDebugElementByCss(divDes[0], 'svg', 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading component', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expectToBe(headingCmp.title, expectedTitle);
                expectToBe(headingCmp.id, expectedId);
            });
        });
    });
});
