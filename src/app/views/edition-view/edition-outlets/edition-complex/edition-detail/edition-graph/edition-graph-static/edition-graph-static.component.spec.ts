import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data/edition-graph-images.data';

import { EditionGraphStaticComponent } from './edition-graph-static.component';

describe('EditionGraphStaticComponent (DONE)', () => {
    let component: EditionGraphStaticComponent;
    let fixture: ComponentFixture<EditionGraphStaticComponent>;
    let compDe: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionGraphStaticComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Create component fixture
        fixture = TestBed.createComponent(EditionGraphStaticComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `imageKey` to hold undefined', () => {
            expectToBe(isSignal(component.imageKey), true);

            expect(component.imageKey()).toBeUndefined();
        });

        it('... should have `GRAPH_IMAGES` to hold the static graph image paths', () => {
            expectToBe(component.GRAPH_IMAGES.OP12, '');
            expectToBe(component.GRAPH_IMAGES.OP25, EDITION_GRAPH_IMAGES_DATA.GRAPH_IMAGE_OP25.route);
        });

        it('... should have computed signal `imageSrc` to hold null', () => {
            expectToBe(isSignal(component.imageSrc), true);

            expectToBe(component.imageSrc(), null);
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-graph-static', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-static', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('imageKey', 'OP25');

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `imageKey` to hold the provided key', () => {
            expectToBe(component.imageKey(), 'OP25');
        });

        describe('... computed signal `imageSrc`', () => {
            it('... should hold the image path of a known key with a mapped value', () => {
                expectToBe(component.imageSrc(), EDITION_GRAPH_IMAGES_DATA.GRAPH_IMAGE_OP25.route);
            });

            it.each([
                { desc: 'no imageKey is provided', imageKey: undefined },
                { desc: 'an empty imageKey is provided', imageKey: '' },
                { desc: 'the imageKey does not exist in data', imageKey: 'NON_EXISTENT_KEY' },
                { desc: 'the imageKey exists but the mapped value is an empty string', imageKey: 'OP12' },
                { desc: 'the imageKey is a prototype property like `toString`', imageKey: 'toString' },
            ])('... should hold null if $desc', async ({ imageKey }) => {
                fixture.componentRef.setInput('imageKey', imageKey);
                await detectChangesOnPush(fixture);

                expectToBe(component.imageSrc(), null);
            });
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-graph-static if no image is found', async () => {
                fixture.componentRef.setInput('imageKey', 'OP12');
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-static', 0, 0);
            });

            it('... should contain one div.awg-graph-static', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-static', 1, 1);
            });

            it('... should display header and image of the static graph', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-static', 1, 1);

                const hDes = getAndExpectDebugElementByCss(divDes[0], 'h4', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                const imgDes = getAndExpectDebugElementByCss(divDes[0], 'img', 1, 1);
                const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                expectToContain(hEl.textContent, 'Statischer Graph');
                expectToContain(imgEl.src, EDITION_GRAPH_IMAGES_DATA.GRAPH_IMAGE_OP25.route);
                expectToBe(imgEl.alt, 'Static network representation of data for OP25');
            });
        });
    });
});
