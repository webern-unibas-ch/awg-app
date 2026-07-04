import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { HeadingComponent } from '@awg-shared/heading/heading.component';

import { StructureViewComponent } from './structure-view.component';

// Mock components
@Component({
    selector: 'awg-heading',
    template: '',
})
class HeadingStubComponent {
    title = input.required<string>();
    id = input.required<string>();
}

describe('StructureViewComponent (DONE)', () => {
    let component: StructureViewComponent;
    let fixture: ComponentFixture<StructureViewComponent>;
    let compDe: DebugElement;

    const expectedStructureViewId = 'awg-structure-view-heading';
    const expectedStructureViewTitle = 'Datenstrukturmodell';
    const expectedStructureViewImgPath = 'assets/img/structure/WebernGraph.png';
    const expectedStructureViewSvgPath = 'assets/img/structure/WebernGraph.svg';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StructureViewComponent, HeadingStubComponent],
            declarations: [],
        })
            .overrideComponent(StructureViewComponent, {
                remove: { imports: [HeadingComponent] },
                add: { imports: [HeadingStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        // Create component fixture
        fixture = TestBed.createComponent(StructureViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `STRUCTURE_VIEW_ID`', () => {
            expectToBe(component.STRUCTURE_VIEW_ID, expectedStructureViewId);
        });

        it('... should have `STRUCTURE_VIEW_TITLE`', () => {
            expectToBe(component.STRUCTURE_VIEW_TITLE, expectedStructureViewTitle);
        });

        it('... should have `STRUCTURE_VIEW_IMG_PATH`', () => {
            expectToBe(component.STRUCTURE_VIEW_IMG_PATH, expectedStructureViewImgPath);
        });

        it('... should have `STRUCTURE_VIEW_SVG_PATH`', () => {
            expectToBe(component.STRUCTURE_VIEW_SVG_PATH, expectedStructureViewSvgPath);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-structure-view`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-structure-view', 1, 1);
            });

            it('... should contain one heading component (stubbed) in `div.awg-structure-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-structure-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
            });

            it('... should throw when accessing heading component inputs (`id` and `title`) due to missing initial data binding', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-structure-view', 1, 1);
                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(() => headingCmp.title()).toThrow();
                expect(() => headingCmp.id()).toThrow();
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

            it('... should not display svg image', () => {
                const imageDes = getAndExpectDebugElementByCss(compDe, '#awg-structure-view-svg image', 1, 1);
                const imageEl: SVGImageElement = imageDes[0].nativeElement;

                expectToBe(imageEl.getAttribute('href'), null);
                expectToBe(imageEl.getAttribute('xlink:href'), null);
                expectToBe(imageEl.getAttribute('src'), null);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass down correct values to heading component (`id` and `title`)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-structure-view', 1, 1);
                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expectToBe(headingCmp.id(), expectedStructureViewId);
                expectToBe(headingCmp.title(), expectedStructureViewTitle);
            });

            it('... should display svg image', () => {
                const imageDes = getAndExpectDebugElementByCss(compDe, '#awg-structure-view-svg image', 1, 1);
                const imageEl: SVGImageElement = imageDes[0].nativeElement;

                expectToBe(imageEl.getAttribute('href'), expectedStructureViewSvgPath);
                expectToBe(imageEl.getAttribute('xlink:href'), expectedStructureViewSvgPath);
                expectToBe(imageEl.getAttribute('src'), expectedStructureViewImgPath);
            });
        });
    });
});
