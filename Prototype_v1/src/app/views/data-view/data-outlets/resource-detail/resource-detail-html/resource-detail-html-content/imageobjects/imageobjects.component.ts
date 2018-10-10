import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';

import { ResourceDetailImage } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-resource-detail-html-content-imageobjects',
    templateUrl: './imageobjects.component.html',
    styleUrls: ['./imageobjects.component.css']
})
export class ResourceDetailHtmlContentImageobjectsComponent implements OnInit {
    @ViewChild('thumbBox') thumbBox: ElementRef;
    @ViewChild('thumbImageContainer') thumbContainer: ElementRef;
    @ViewChildren('thumbImages') thumbImages: QueryList<any>;
    @Input() images: ResourceDetailImage[];
    @Output() resourceRequest: EventEmitter<string> = new EventEmitter();

    currentImageIndex = 0;
    offset = 0;
    max = 50;

    constructor() { }

    ngOnInit() {
    }


    navigateToResource(id?: string): void {
        if (id) { id.toString(); }
        this.resourceRequest.emit(id);
    }


    pageThumbsLeft() {
        // calculate offset
        const thumbBoxRect = this.thumbBox.nativeElement.getBoundingClientRect();
        const tmpOffset = this.offset - thumbBoxRect.width;

        if (tmpOffset > 0) {
            this.offset = tmpOffset;
        } else {
            this.offset = 0;
        }
    }


    pageThumbsRight() {
        // calculate offset
        const thumbBoxRect = this.thumbBox.nativeElement.getBoundingClientRect();
        const tmpOffset = this.offset + thumbBoxRect.width;
        this.max = this.thumbContainer.nativeElement.getBoundingClientRect().width - thumbBoxRect.width;

        if (tmpOffset < this.max) {
            this.offset = tmpOffset;
        } else {
            this.offset = this.max;
        }
    }


    setImage(index: number): void {
        // set image number to index
        this.currentImageIndex = index;

        // calculate offset
        const thumbBoxRect = this.thumbBox.nativeElement.getBoundingClientRect();
        const thumbImage = this.thumbImages.toArray()[index].nativeElement;
        const imageRect = thumbImage.getBoundingClientRect();
        const tmpOffset = imageRect.left - thumbBoxRect.left;

        if (tmpOffset < 0) {
            this.offset += tmpOffset;
        } else if (tmpOffset + imageRect.width > thumbBoxRect.width) {
            this.offset += tmpOffset + imageRect.width - thumbBoxRect.width;
        }
    }

}
