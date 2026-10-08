import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as D3_SELECTION from 'd3-selection';
import * as D3_ZOOM from 'd3-zoom';

import { patchSvgSizeForD3Zoom } from './svg-drawing-helper';

describe('svg-drawing-helper', () => {
    describe('#patchSvgSizeForD3Zoom()', () => {
        const sizeKeys = ['width', 'height'] as const;

        let originalDescriptors: Partial<Record<(typeof sizeKeys)[number], PropertyDescriptor>>;

        const createSvgEl = (): SVGSVGElement => document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        beforeEach(() => {
            // Keep (and remove) any existing size properties, so each test starts with an unpatched prototype
            originalDescriptors = {};
            sizeKeys.forEach(key => {
                const descriptor = Object.getOwnPropertyDescriptor(SVGSVGElement.prototype, key);
                if (descriptor) {
                    originalDescriptors[key] = descriptor;
                    delete (SVGSVGElement.prototype as any)[key];
                }
            });
        });

        afterEach(() => {
            vi.unstubAllGlobals();

            // Restore the original state of the prototype
            sizeKeys.forEach(key => {
                delete (SVGSVGElement.prototype as any)[key];
                const descriptor = originalDescriptors[key];
                if (descriptor) {
                    Object.defineProperty(SVGSVGElement.prototype, key, descriptor);
                }
            });
        });

        it('... should have a method `patchSvgSizeForD3Zoom`', () => {
            expect(patchSvgSizeForD3Zoom).toBeDefined();
            expect(typeof patchSvgSizeForD3Zoom).toBe('function');
        });

        it('... should start without width and height on the SVGSVGElement prototype (jsdom)', () => {
            sizeKeys.forEach(key => {
                expect(key in SVGSVGElement.prototype).toBe(false);
            });
        });

        it('... should provide `width.baseVal` and `height.baseVal` on svg elements', () => {
            patchSvgSizeForD3Zoom();

            const svgEl = createSvgEl();

            expect(svgEl.width.baseVal.value).toBe(100);
            expect(svgEl.height.baseVal.value).toBe(100);
        });

        it('... should define configurable properties (removable after a test)', () => {
            patchSvgSizeForD3Zoom();

            sizeKeys.forEach(key => {
                expect(Object.getOwnPropertyDescriptor(SVGSVGElement.prototype, key)?.configurable).toBe(true);
            });
        });

        it('... should not overwrite existing properties', () => {
            const existingWidth = { baseVal: { value: 42 } };
            Object.defineProperty(SVGSVGElement.prototype, 'width', {
                configurable: true,
                get: () => existingWidth,
            });

            patchSvgSizeForD3Zoom();

            const svgEl = createSvgEl();

            expect(svgEl.width).toBe(existingWidth);
            expect(svgEl.height.baseVal.value).toBe(100);
        });

        it('... should not fail when called repeatedly', () => {
            patchSvgSizeForD3Zoom();

            expect(() => patchSvgSizeForD3Zoom()).not.toThrow();
            expect(createSvgEl().width.baseVal.value).toBe(100);
        });

        it('... should do nothing without SVGSVGElement (non-DOM environment)', () => {
            vi.stubGlobal('SVGSVGElement', undefined);

            expect(() => patchSvgSizeForD3Zoom()).not.toThrow();

            vi.unstubAllGlobals();
            sizeKeys.forEach(key => {
                expect(key in SVGSVGElement.prototype).toBe(false);
            });
        });

        it('... should enable d3-zoom to scale an svg element', () => {
            patchSvgSizeForD3Zoom();

            const svgSelection = D3_SELECTION.select(createSvgEl());
            const zoomBehaviour = D3_ZOOM.zoom<SVGSVGElement, unknown>();
            svgSelection.call(zoomBehaviour);

            svgSelection.call(zoomBehaviour.scaleTo, 2);

            expect(D3_ZOOM.zoomTransform(svgSelection.node() as SVGSVGElement).k).toBe(2);
        });
    });
});
