import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import Spy = jasmine.Spy;

import { JsonConvert } from 'json2typescript';
import { NgxGalleryImage, NgxGalleryComponent, NgxGalleryOptions, NgxGalleryModule } from 'ngx-gallery';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';
import { mockContextJson } from '@testing/mock-data/mockContextJson';

import { ResourceDetailImage } from '@awg-views/data-view/models';
import { ContextJson } from '@awg-shared/api-objects';

import { ResourceDetailHtmlContentImageobjectsComponent } from './imageobjects.component';

fdescribe('ResourceDetailHtmlContentImageobjectsComponent', () => {
    let component: ResourceDetailHtmlContentImageobjectsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentImageobjectsComponent>;
    let compDe: DebugElement;
    let compEl: any;

    // json object
    let jsonConvert: JsonConvert;
    let context: ContextJson;

    let expectedGalleryOptions: NgxGalleryOptions[];
    let expectedGalleryImages: NgxGalleryImage[];
    let expectedImages: ResourceDetailImage[];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgxGalleryModule],
            declarations: [ResourceDetailHtmlContentImageobjectsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentImageobjectsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // convert json object
        jsonConvert = new JsonConvert();
        context = jsonConvert.deserializeObject(mockContextJson, ContextJson);

        // test data
        expectedImages = [new ResourceDetailImage(context, 0), new ResourceDetailImage(context, 1)];

        expectedGalleryOptions = [
            new NgxGalleryOptions({
                width: '100%',
                height: '100%',
                imageBullets: true,
                imageSize: 'contain',
                thumbnailSize: 'contain',
                thumbnailsColumns: 4,
                thumbnailMargin: 5,
                thumbnailsMargin: 0,
                previewCloseOnClick: true,
                previewCloseOnEsc: true,
                previewZoom: true,
                previewRotate: true,
                linkTarget: '_blank'
            })
        ];

        expectedGalleryImages = [];
        expectedImages.forEach(image => {
            const gImage = {
                small: image.reductSize,
                medium: image.reductSize,
                big: image.fullSize,
                description: image.origname,
                label: image.label,
                url: image.fullSize
            };
            expectedGalleryImages.push(gImage);
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `images` inputs', () => {
            expect(component.images).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-image-obj', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-image-obj', 1, 1);
            });

            it('... should contain one header showing no number of images yet', () => {
                // header debug element
                const headerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-image-obj > h5', 1, 1);
                // size debug element
                const sizeDes = getAndExpectDebugElementByCss(headerDes[0], 'span#awg-image-number', 1, 1);
                const sizeEl = sizeDes[0].nativeElement;

                // check size output
                expect(sizeEl.textContent).toBeDefined();
                expect(sizeEl.textContent).toBe('', 'should be empty');
            });

            it('... should contain one div.awg-image-slider with no ngx-gallery yet', () => {
                const sliderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-image-obj > div.awg-image-slider',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(sliderDes[0], NgxGalleryComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        // helper function
        function expectImage(cmp: any, image: ResourceDetailImage, size: number) {
            expect(cmp.id).toBe(image.res_id, `should be ${image.res_id}`);
            expect(cmp.alt).toBe(image.label, `should be ${image.label}`);
            expect(cmp.src).toBe(image.reductSize, `should be ${image.reductSize}`);
            expect(cmp.height).toBe(size, `should be 300`);
        }

        beforeEach(() => {
            // simulate the parent setting the input properties
            component.images = expectedImages;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `images` inputs', () => {
            expect(component.images).toBeDefined('should be defined');
            expect(component.images).toBe(expectedImages, `should be expectedImages: ${expectedImages}`);
        });

        it('should have galleryOptions', () => {
            expect(component.galleryOptions).toBeDefined('should be defined');
            expect(component.galleryOptions).toEqual(
                jasmine.arrayContaining(expectedGalleryOptions),
                `should equal expectedGalleryOptions: ${expectedGalleryOptions}`
            );
        });

        it('should have galleryImages', () => {
            expect(component.galleryImages).toBeDefined('should be defined');
            expect(component.galleryImages).toEqual(
                expectedGalleryImages,
                `should equal expectedGalleryImages: ${expectedGalleryImages}`
            );
        });

        describe('VIEW', () => {
            it('... should contain one header showing number of images', () => {
                // header debug element
                const headerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-image-obj > h5', 1, 1);
                // size debug element
                const sizeDes = getAndExpectDebugElementByCss(headerDes[0], 'span#awg-image-number', 1, 1);
                const sizeEl = sizeDes[0].nativeElement;

                // check size output
                expect(sizeEl.textContent).toBeDefined();
                expect(sizeEl.textContent).toBe(
                    expectedImages.length.toString(),
                    `should be ${expectedImages.length.toString()}`
                );
            });

            it('... should contain one div.awg-image-slider with one ngx-gallery', () => {
                const sliderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-image-obj > div.awg-image-slider',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(sliderDes[0], NgxGalleryComponent, 1, 1);
            });

            it('... should pass down `galleryImages` and `galleryOptions` to NgxGalleryComponent', () => {
                // get debug and native element of NgxGalleryComponent
                const galleryDes = getAndExpectDebugElementByDirective(compDe, NgxGalleryComponent, 1, 1);
                const galleryCmp = galleryDes[0].injector.get(NgxGalleryComponent) as NgxGalleryComponent;

                expect(galleryCmp.options).toBeDefined();
                expect(galleryCmp.options).toEqual(
                    expectedGalleryOptions,
                    `should equal expectedGalleryOptions: ${expectedGalleryOptions}`
                );

                expect(galleryCmp.images).toBeDefined();
                expect(galleryCmp.images).toEqual(
                    expectedGalleryImages,
                    `should equal expectedGalleryImages: ${expectedGalleryImages}`
                );
            });
        });

        xit('should change galleryImages on input change', () => {
            expectedImages = [];
            expectedImages = [
                new ResourceDetailImage(context, 1),
                new ResourceDetailImage(context, 0),
                new ResourceDetailImage(context, 1)
            ];
            component.images = expectedImages;

            expectedGalleryImages = [];
            expectedImages.forEach(image => {
                const gImage = {
                    small: image.reductSize,
                    medium: image.reductSize,
                    big: image.fullSize,
                    description: image.origname,
                    label: image.label,
                    url: image.fullSize
                };
                expectedGalleryImages.push(gImage);
            });
            fixture.detectChanges();

            console.log(component.galleryImages);

            expect(component.galleryImages).toBeDefined('should be defined');
            expect(component.galleryImages).toEqual(
                expectedGalleryImages,
                `should equal expectedGalleryImages: ${expectedGalleryImages}`
            );

            // get debug and native element of NgxGalleryComponent
            const galleryDes = getAndExpectDebugElementByDirective(compDe, NgxGalleryComponent, 1, 1);
            const galleryCmp = galleryDes[0].injector.get(NgxGalleryComponent) as NgxGalleryComponent;

            expect(galleryCmp.images).toBeDefined();
            expect(galleryCmp.images).toEqual(
                expectedGalleryImages,
                `should equal expectedGalleryImages: ${expectedGalleryImages}`
            );
        });
    });
});
