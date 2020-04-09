import { GeoDataItemJson } from '@awg-shared/api-objects';

/**
 * The GeoNames class.
 *
 * It is used in the context of the data view
 * to store the data for a geonames reference
 * and to provide the html to display a
 * geonames location.
 */
export class GeoNames {
    /**
     * The geonames id.
     */
    gnid: string;

    /**
     * The short label of a geonames location.
     */
    shortLabel: string;

    /**
     * The long label of a geonames location.
     */
    longLabel: string;

    /**
     * The latitude of a geonames location.
     */
    latitude: string;

    /**
     * The longitude of a geonames location.
     */
    longitude: string;

    /**
     * The wikipedia link of a geonames location.
     */
    wiki: string;

    /**
     * The generated html to display a geonames location in the app.
     */
    html: string;

    /**
     * Constructor of the GeoNames class.
     *
     * It initializes the class with values from
     * the given (SALSAH) API´s GeoDataItemJson response.
     *
     * @param {GeoDataItemJson[]} geoDataArray The given geo data array.
     */
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
            '" target="_blank" rel="noopener noreferrer">' +
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
                '" target="_blank" rel="noopener noreferrer">' +
                wikiIcon +
                '</a>';
        }
        this.html = this.shortLabel + ' ' + geoLink + wikiLink;
    }
}
