import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

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
    styleUrls: ['./imageobjects.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceDetailHtmlContentImageobjectsComponent implements OnInit {
    /**
     * Input variable: images.
     *
     * It keeps the images for the ngx-gallery
     * of the resource detail.
     */
    @Input()
    images: NgxGalleryImage[];

    /**
     * Public variable: galleryOptions.
     *
     * It keeps the options array for the ngx-gallery.
     */
    galleryOptions: NgxGalleryOptions[] = [
        new NgxGalleryOptions({
            width: '100%',
            imageSize: 'contain',
            thumbnailSize: 'contain',
            thumbnailMargin: 5,
            thumbnailsMargin: 0,
            previewCloseOnClick: true,
            previewCloseOnEsc: true,
            previewZoom: true,
            previewRotate: true,
            linkTarget: '_blank'
        })
    ];

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {}
}
