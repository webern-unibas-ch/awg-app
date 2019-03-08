import { Component, Input, OnInit } from '@angular/core';

import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';

import { ResourceDetailImage } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-resource-detail-html-content-imageobjects',
    templateUrl: './imageobjects.component.html',
    styleUrls: ['./imageobjects.component.css']
})
export class ResourceDetailHtmlContentImageobjectsComponent implements OnInit {
    @Input()
    images: ResourceDetailImage[];

    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    constructor() {}

    ngOnInit() {
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
