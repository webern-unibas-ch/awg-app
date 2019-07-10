import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';

import { ResourceDetailImage } from '@awg-views/data-view/models';

/**
 * The ResourceDetailHtmlContentImageobjects component.
 *
 * It displays the images of a resource detail
 * of the data view of the app
 * with an image slider of the ngx.gallery library.
 */
@Component({
    selector: 'awg-resource-detail-html-content-imageobjects',
    templateUrl: './imageobjects.component.html',
    styleUrls: ['./imageobjects.component.css']
})
export class ResourceDetailHtmlContentImageobjectsComponent implements OnInit, OnChanges {
    /**
     * Input variable: images.
     *
     * It keeps the images for the resource detail.
     */
    @Input()
    images: ResourceDetailImage[];

    /**
     * Public variable: galleryImages.
     *
     * It keeps the images array for the ngx-gallery.
     */
    galleryImages: NgxGalleryImage[];

    /**
     * Public variable: galleryOptions.
     *
     * It keeps the options array for the ngx-gallery.
     */
    galleryOptions: NgxGalleryOptions[];

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.setOptions();
        this.setImages();
    }

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     *
     * @param {SimpleChanges} changes The changes of the input.
     */
    ngOnChanges(changes: SimpleChanges) {
        if (!changes['images'].isFirstChange()) {
            this.setImages();
        }
    }

    /**
     * Public method: setOptions.
     *
     * It sets the options for the ngx-gallery.
     *
     * @returns {void} Sets the galleryOptions variable.
     */
    setOptions() {
        this.galleryOptions = [
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
                previewRotate: true
            })
        ];
    }

    /**
     * Public method: setImages.
     *
     * It prepares the images from the component input
     * to be displayed in the ngx-gallery.
     *
     * @returns {void} Sets the galleryImages variable.
     *
     * @todo update immutable
     */
    setImages() {
        this.galleryImages = [];
        this.images.forEach(image => {
            const gImage = {
                small: image.reductSize,
                medium: image.reductSize,
                big: image.fullSize,
                description: image.origname,
                label: image.label,
                url: image.fullSize
            };

            this.galleryImages.push(gImage);
        });
    }
}
