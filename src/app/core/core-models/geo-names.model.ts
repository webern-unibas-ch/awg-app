import { GeoDataItemJson } from '@awg-shared/api-objects';

export class GeoNames {
    gnid: string;
    shortLabel: string;
    longLabel: string;
    latitude: string;
    longitude: string;
    wiki: string;
    html: string;

    constructor(geoDataArray: GeoDataItemJson[]) {
        this.longLabel = geoDataArray[0].label;
        for (let j = 1; j < geoDataArray.length; j++) {
            const geoItem: GeoDataItemJson = geoDataArray[j];
            this.longLabel += ', ' + geoItem.label;
            if (j === geoDataArray.length - 1) {
                // get geonames-id gnid from last array item
                this.gnid = geoItem.name.replace('gnid:', '');
                // short label
                this.shortLabel = geoItem.label;
                // latitude + longitude
                this.latitude = geoItem.lat;
                this.longitude = geoItem.lng;
                // wiki
                this.wiki = geoItem.wikipedia;
            }
        }
        // prepare icon & link for geonames
        const geoIcon =
            '<img src="assets/img/logos/geonames.png" height="25" width="25" alt="' + this.shortLabel + '" />';
        const geoLink =
            '<a href="https://www.geonames.org/' +
            this.gnid +
            '" title="' +
            this.longLabel +
            '" target="_blank" ref="noopener noreferrer">' +
            geoIcon +
            '</a>';
        let wikiLink = '';
        if (this.wiki) {
            const wikiIcon = '<img src="assets/img/logos/wiki.svg" height="25" width="25" alt="' + this.wiki + '" />';
            wikiLink =
                '<a href="https://' +
                this.wiki +
                '" title="' +
                this.wiki +
                '" target="_blank" ref="noopener noreferrer">' +
                wikiIcon +
                '</a>';
        }
        this.html = this.shortLabel + ' ' + geoLink + wikiLink;
    }
}
