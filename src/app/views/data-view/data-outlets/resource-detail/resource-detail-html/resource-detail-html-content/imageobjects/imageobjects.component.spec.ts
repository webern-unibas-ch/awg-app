import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { JsonConvert } from 'json2typescript';
import { NgxGalleryImage, NgxGalleryComponent, NgxGalleryOptions, NgxGalleryModule } from 'ngx-gallery';

import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { mockContextJson } from '@testing/mock-data';

import { ResourceDetailImage } from '@awg-views/data-view/models';
import { ContextJson } from '@awg-shared/api-objects';

import { ResourceDetailHtmlContentImageobjectsComponent } from './imageobjects.component';

describe('ResourceDetailHtmlContentImageobjectsComponent', () => {
    let component: ResourceDetailHtmlContentImageobjectsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentImageobjectsComponent>;
    let compDe: DebugElement;
    let compEl: any;

    // json object
    let jsonConvert: JsonConvert;
    let context: ContextJson;

    let expectedGalleryOptions: NgxGalleryOptions[];
    let expectedImages: NgxGalleryImage[];

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

        const images = [new ResourceDetailImage(context, 0), new ResourceDetailImage(context, 1)];
        expectedImages = [];
        images.forEach(image => {
            const gImage = {
                small: image.reductSize,
                medium: image.reductSize,
                big: image.fullSize,
                description: image.origname,
                label: image.label,
                url: image.fullSize
            };
            expectedImages.push(gImage);
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `images` inputs', () => {
            expect(component.images).toBeUndefined('should be undefined');
        });

        it('should have galleryOptions', () => {
            expect(component.galleryOptions).toBeDefined('should be defined');
            expect(component.galleryOptions).toEqual(
                jasmine.arrayContaining(expectedGalleryOptions),
                `should equal expectedGalleryOptions: ${expectedGalleryOptions}`
            );
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-image-obj', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-image-obj', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
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

        describe('VIEW', () => {
            it('... should contain one div.awg-image-obj', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-image-obj', 1, 1);
            });

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

            it('... should contain one div.awg-image-slider with one NgxGalleryComponent', () => {
                const sliderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-image-obj > div.awg-image-slider',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(sliderDes[0], NgxGalleryComponent, 1, 1);
            });

            it('... should pass down `images` and `galleryOptions` to NgxGalleryComponent', () => {
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
                    expectedImages,
                    `should equal expectedGalleryImages: ${expectedImages}`
                );
            });
        });
    });
});
