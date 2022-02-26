import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { NgxGalleryImage } from '@kolkov/ngx-gallery';

import { ApiService } from '@awg-core/services/api-service';

import { GeoNames } from '@awg-core/core-models';
import {
    ContextJson,
    GeoDataItemJson,
    GeoDataJson,
    HlistItemJson,
    HlistJson,
    IncomingItemJson,
    PropertyJson,
    ResourceContextResponseJson,
    ResourceFullResponseJson,
    SearchResponseJson,
    SelectionItemJson,
    SelectionJson,
    SubjectItemJson,
} from '@awg-shared/api-objects';
import {
    IResourceDataResponse,
    ResourceDetail,
    ResourceDetailContent,
    ResourceDetailGroupedIncomingLinks,
    ResourceDetailHeader,
    ResourceDetailImage,
    ResourceDetailIncomingLink,
    ResourceDetailProperty,
    SearchResponseWithQuery,
} from '@awg-views/data-view/models';
import { BibEntry } from '@awg-views/data-view/data-outlets/bibliography/bibliography-entry.model';

/**
 * Declared variable: htmlConverter.
 *
 * It provides access to the embedded htmlConverter plugin (see `/src/assets/js/htmlConverter`).
 */
declare const htmlConverter: any;

/**
 * Declared variable: dateConverter.
 *
 * It provides access to the embedded dateConverter plugin (see `/src/assets/js/dateConverter`).
 */
declare const dateConverter: any;

/**
 * The Conversion service.
 *
 * It handles the conversion of the HTTP response data (JSON)
 * from the given (SALSAH) API into a form that can be
 * displayed via HTML.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class ConversionService extends ApiService {
    /**
     * Public variable: filteredOut.
     *
     * It keeps the number of filtered duplicates of a search response list.
     */
    filteredOut: number;

    /**
     * Constructor of the ConversionService.
     *
     * It declares a public {@link HttpClient} instance
     * with a super reference to base class (ApiService)
     * and a private {@link StorageService} instance.
     *
     * @param {HttpClient} http Instance of the HttpClient.
     */
    constructor(public http: HttpClient) {
        super(http);
    }

    /**
     * Public method: convertFullTextSearchResults.
     *
     * It converts the results of a full text search
     * to be displayed via HTML.
     *
     * @param {SearchResponseJson} searchResults The given results of a search request.
     *
     * @returns {SearchResponseJson} The converted full text search results.
     */
    convertFullTextSearchResults(searchResults: SearchResponseJson): SearchResponseJson {
        if (!searchResults.subjects) {
            return searchResults;
        }

        // TODO: refactor with reduce??
        searchResults.subjects.forEach(subject => {
            // Clean value labels
            subject.valuelabel[0] = subject.valuelabel[0].replace(' (Richtext)', '');
            subject.obj_id = subject.obj_id.replace('_-_local', '');

            // =>Chronologie: salsah standoff needs to be converted before displaying
            // Valuetype_id 14 = valuelabel 'Ereignis'
            if (subject.valuetype_id[0] === '14' && subject.value[0]) {
                let htmlstr = '';
                const utf8str: string = subject.value[0].utf8str;
                const textattr: string = subject.value[0].textattr;

                // Check if there is standoff, otherwise leave res.value[0] alone
                // Because when retrieved from cache the standoff is already converted
                if (utf8str && textattr) {
                    htmlstr = this._convertStandoffToHTML(utf8str, textattr);

                    // Replace salsah links
                    htmlstr = this._replaceSalsahLink(htmlstr);

                    // Strip & replace <p>-tags for displaying
                    htmlstr = this._replaceParagraphTags(htmlstr);

                    subject.value[0] = htmlstr;
                }
            }
        });
        // Remove duplicates from response
        searchResults.subjects = this._distinctSubjects(searchResults.subjects);
        return searchResults;
    }

    /**
     * Public method: prepareFullTextSearchResultText.
     *
     * It prepares the fulltext search result text
     * to be displayed in the search info.
     *
     * @param {SearchResponseWithQuery} searchResponseWithQuery The given results and query of a search request.
     * @param {string} searchUrl The given url of a search request.
     *
     * @returns {string} The text to be displayed.
     */
    prepareFullTextSearchResultText(searchResponseWithQuery: SearchResponseWithQuery, searchUrl: string): string {
        let resText: string;

        const searchResults = { ...searchResponseWithQuery.data };

        if (searchResults.subjects) {
            const currentLength = searchResults.subjects.length;
            const totalLength = searchResults.nhits;
            const resString: string = length === 1 ? 'Ergbnis' : 'Ergebnisse';
            resText = `${currentLength} / ${totalLength} ${resString}`;
            if (this.filteredOut > 0) {
                resText += ' (Duplikate enfternt)';
            }
        } else {
            resText = `Die Abfrage ${searchUrl} ist leider fehlgeschlagen. Wiederholen Sie die Abfrage zu einem späteren Zeitpunkt oder überprüfen sie die Suchbegriffe.`;
        }

        return resText;
    }

    /**
     * Public method: convertObjectProperties.
     *
     * It converts object properties of a resource request
     * to be displayed in the bibliography detail view.
     *
     * @param {ResourceFullResponseJson} resourceFullResponseData The given resource data.
     *
     * @returns {BibEntry} The converted resource object.
     */
    convertObjectProperties(resourceFullResponseData: ResourceFullResponseJson): BibEntry {
        const convObj = {};
        // Add lastmod state
        convObj['lastmod'] = resourceFullResponseData.resinfo.lastmod;

        Object.keys(resourceFullResponseData.props).forEach((key: string) => {
            const prop = resourceFullResponseData.props[key];
            let propValue = []; // Empty text value array

            // Check if values property is defined
            if (prop.hasOwnProperty('values') && prop.values !== undefined) {
                // Check for gui-elements
                switch (prop.valuetype_id) {
                    case '4':
                        // DATE: salsah object needs to be converted (using plugin "dateConverter")
                        if (prop.values[0] !== '') {
                            propValue[0] = this._convertDateValue(prop.values[0]);
                        }
                        break; // END date

                    case '7':
                        // SELECTION PULLDOWN: selection nodes have to be read seperately
                        // TODO
                        if (prop.values !== []) {
                            propValue = this._convertSelectionValues(prop.values, prop.attributes);
                        }
                        break; // END selection

                    case '14':
                        // RICHTEXT: salsah standoff needs to be converted

                        // Check for multiple && not empty values
                        if (prop.values.length > 0 && prop.values[0].utf8str !== '') {
                            // Clean value labels
                            prop.label = prop.label.replace(' (Richtext)', '');

                            for (let i = 0; i < prop.values.length; i++) {
                                // Init

                                let htmlstr = '';

                                // Convert linear salsah standoff to html (using plugin "htmlConverter")
                                htmlstr = this._convertStandoffToHTML(prop.values[i].utf8str, prop.values[i].textattr);

                                // Replace salsah links & <p>-tags
                                htmlstr = this._replaceSalsahLink(htmlstr);
                                htmlstr = htmlstr.replace('<p>', '').replace('</p>', '');

                                // Trim string
                                propValue[i] = htmlstr.trim();

                                // Replace bibliography links
                                if (prop.label === 'Online-Zugang') {
                                    propValue[i] = this._adjustBiblioLink(propValue[i]);
                                }
                            }
                        }
                        break; // END richtext

                    default:
                        // '1'=> TEXT: properties come as they are
                        if (prop.values[0] !== '') {
                            for (let i = 0; i < prop.values.length; i++) {
                                propValue[i] = prop.values[i].trim();
                            }
                        }
                } // END switch
                if (propValue.length > 1) {
                    convObj[prop.label] = propValue; // => array
                } else if (propValue.length === 1) {
                    convObj[prop.label] = propValue[0]; // => string
                }
            } // END if value

            // Extract publication year from publication date
            /*
             TODO#add:
             let splitDate;
             if (splitDate = convObj['Publikationsdatum']) {
             let s = splitDate.split(' ');
             convObj['Jahr'] = s[s.length-1];
             }
             */
        }); // END forEach PROPS

        return convObj;
    } // END convertObjectProperties (func)

    /**
     * Public method: convertResourceData.
     *
     * It converts a resource response from the given (SALSAH) Api
     * to a resource detail object. It checks if the resource data
     * is accessible and delegates it to the respective
     * resource detail creation methods.
     *
     * @param {IResourceDataResponse} resourceData The given resource data.
     * @param {string} resourceId The given id of the current resource.
     *
     * @returns {ResourceDetail} The converted resource detail object.
     */
    convertResourceData(resourceData: IResourceDataResponse, resourceId: string): ResourceDetail {
        if (!resourceData || !resourceData[0] || !resourceData[0].access) {
            return new ResourceDetail(undefined, undefined);
        }
        if (resourceData[0].access === 'OK') {
            return this._prepareAccessibleResource(resourceData, resourceId);
        } else {
            return this._prepareRestrictedResource(resourceData, resourceId);
        }
    }

    /**
     * Private method: _prepareRestrictedResource.
     *
     * It prepares header and content of a restricted resource
     * to be displayed via HTML.
     *
     * @param {IResourceDataResponse} resourceData The given resource data.
     * @param {string} resourceId The given id of the current resource.
     *
     * @returns {ResourceDetail} The resource detail object.
     */
    private _prepareRestrictedResource(resourceData: IResourceDataResponse, resourceId: string): ResourceDetail {
        const header: ResourceDetailHeader = new ResourceDetailHeader(resourceData[0], resourceId);
        const content = undefined;

        return new ResourceDetail(header, content);
    }

    /**
     * Private method: _prepareAccessibleResource.
     *
     * It prepares header and content of an accessible resource
     * to be displayed via HTML.
     *
     * @param {IResourceDataResponse} resourceData The given resource data.
     * @param {string} resourceId The given id of the current resource.
     *
     * @returns {ResourceDetail} The resource detail object.
     */
    private _prepareAccessibleResource(resourceData: IResourceDataResponse, resourceId: string): ResourceDetail {
        const resourceFullResponseData = resourceData[0];
        const resourceContextData = resourceData[1];

        // Convert properties to be displayed via HTML
        resourceFullResponseData.props = this._convertGUISpecificProps(resourceFullResponseData.props);

        // Prepare parts of resourceDetail
        const header: ResourceDetailHeader = new ResourceDetailHeader(resourceFullResponseData, resourceId);
        const props: ResourceDetailProperty[] = this._prepareResourceDetailProperties(resourceFullResponseData.props);
        const images: NgxGalleryImage[] = this._prepareResourceDetailImage(resourceContextData);
        const incoming: ResourceDetailGroupedIncomingLinks[] = this._prepareResourceDetailIncomingLinks(
            resourceFullResponseData.incoming
        );
        const content = new ResourceDetailContent(props, images, incoming);

        return new ResourceDetail(header, content);
    }

    /**
     * Private method: _prepareResourceDetailImage.
     *
     * It prepares the images content of an accessible resource
     * to be displayed via HTML.
     *
     * @param {ResourceContextResponseJson} resourceContextData The given resource context data.
     *
     * @returns {NgxGalleryImage[]} The image array of the resource detail.
     */
    private _prepareResourceDetailImage(resourceContextData: ResourceContextResponseJson): NgxGalleryImage[] {
        // Id of image context for api + "/resources/{{:id}}_-_local?reqtype=context"
        // Result is an array of NgxGalleryImage
        const images: NgxGalleryImage[] = [];

        if (!resourceContextData.resource_context.res_id) {
            // console.log('ConversionService# _prepareResourceDetailImage: got no resource_context id\'s from context response: ', contextData);
            return;
        } else {
            const context: ContextJson = { ...resourceContextData.resource_context };

            // IMAGE OBJECT (context == 2)
            // IMAGE OBJECT (context == 2)
            if (context.context === 2 && context.resclass_name === 'image') {
                if (
                    context.res_id.length === context.firstprop.length ||
                    context.res_id.length === context.locations.length
                ) {
                    for (let i = 0; i < context.res_id.length; i++) {
                        // Build new ResourceDetailImage-Object from context and index
                        const image = new ResourceDetailImage(context, i);

                        const gImage = new NgxGalleryImage({
                            small: image.reductSize,
                            medium: image.reductSize,
                            big: image.fullSize,
                            description: image.origname,
                            label: image.label,
                            url: image.fullSize,
                        });

                        images.push(gImage);
                    }
                    return images;
                } else {
                    console.warn(
                        'ConversionService - Array length for context objects is not consistent with firstprops length!',
                        context
                    );
                    return;
                }
                // STANDARD OBJECT (context == 0 || 1)
            } else if (context.context < 2) {
                console.warn('ConversionService - got no image context', context);
                return;
            }
        }

        return images;
    }

    /**
     * Private method: _prepareResourceDetailIncomingLinks.
     *
     * It prepares and groups the incoming links content
     * of an accessible resource to be displayed via HTML.
     *
     * @param {IncomingItemJson[]} incomingArray The given IncomingItemJson.
     *
     * @returns {ResourceDetailGroupedIncomingLinks[]} The grouped incoming links array of the resource detail.
     */
    private _prepareResourceDetailIncomingLinks(
        incomingArray: IncomingItemJson[]
    ): ResourceDetailGroupedIncomingLinks[] {
        if (!incomingArray) {
            return;
        }

        // Map incoming array items into new array (immutable)
        const incomingLinks: ResourceDetailIncomingLink[] = incomingArray.map(
            incoming => new ResourceDetailIncomingLink({ ...incoming })
        );

        // Return links grouped by restype
        return this._groupByRestype(incomingLinks);
    }

    /**
     * Private method: _prepareResourceDetailProperties.
     *
     * It prepares the properties content of an accessible resource
     * to be displayed via HTML.
     *
     * @param {PropertyJson[]} props The given properties.
     *
     * @returns {ResourceDetailProperty[]} The properties array of the resource detail.
     */
    private _prepareResourceDetailProperties(props: PropertyJson[]): ResourceDetailProperty[] {
        if (!props) {
            return;
        }

        // Helper method to clean value labels
        const cleanLabel = (str: string): string => str.replace(' (Richtext)', '');

        // Map default values into ResourceDetailProperties array
        return Object.entries(props).map(prop => {
            prop[1].label = cleanLabel(prop[1].label);

            return new ResourceDetailProperty(prop[1].pid, prop[1].guielement, prop[1].label, prop[1].toHtml);
        });
    }

    /**
     * Private method: _convertGUISpecificProps.
     *
     * It converts properties of an accessible resource
     * to be displayed via HTML.
     *
     * In fact, it adds an 'toHtml' property to the props array.
     *
     * @param {PropertyJson[]} props The given properties.
     *
     * @returns {*} The converted resource data.
     */
    private _convertGUISpecificProps(props: PropertyJson[]): any {
        // Loop through all properties and add toHtml values
        Object.keys(props).forEach((key: string) => {
            props[key] = this._addHtmlValues(props[key]);
        });
        return props;
    }

    /**
     * Private method: _addHtmlValues.
     *
     * It adds an 'toHtml' property to the props array
     * of an accessible resource to be displayed via HTML.
     *
     * @param {*} prop The given property.
     * @param {string} [url] A given optional url.
     *
     * @returns {string[]} The converted property.
     */
    private _addHtmlValues(prop: any, url?: string): [string] {
        prop.toHtml = [];

        if (prop.values) {
            switch (prop.valuetype_id) {
                case '4': // DATE: salsah object needs to be converted (using plugin "dateConverter")
                    for (let i = 0; i < prop.values.length; i++) {
                        prop.toHtml[i] = this._convertDateValue(prop.values[i]);
                    }
                    break; // END date

                case '6': // LINKVALUE (searchbox): links to another salsah object need to be converted
                    for (let i = 0; i < prop.values.length; i++) {
                        prop.toHtml[i] = this._convertLinkValue(prop, i);
                    }
                    break; // END linkvalue

                case '7': // SELECTION (pulldown): selection nodes have to be called separately
                    prop.toHtml = this._convertSelectionValues(prop.values, prop.attributes);
                    break; // END selection

                case '12': // HLIST: hlist nodes have to be called separately
                    prop.toHtml = this._convertHlistValues(prop.values, prop.attributes);
                    break; // END hlist

                case '14': // RICHTEXT: salsah standoff needs to be converted
                    for (let i = 0; i < prop.values.length; i++) {
                        // Convert richtext standoff
                        prop.toHtml[i] = this._convertRichtextValue(prop.values[i].utf8str, prop.values[i].textattr);
                    }
                    break; // END richtext

                case '15': // GeoNAMES: GeoName nodes have to be called separately
                    prop.toHtml = this._convertGeoValues(prop.values);
                    break; // END geonames

                // '1' => TEXT: properties come as they are
                default:
                    for (let i = 0; i < prop.values.length; i++) {
                        prop.toHtml[i] = prop.values[i];
                    }
            } // END switch
        } else {
            // console.log('empty prop.values for', prop.guielement.toUpperCase(), 'in property "', prop.label, '" :::: ');
        }
        return prop;
    }

    /**
     * Private method: _convertDateValue.
     *
     * It converts date values of an accessible resource
     * to be displayed via HTML.
     *
     * Conversion goes from Julian Day Number (JDN)
     * to Gregorian Calendar.
     *
     * @param {*} dateObj The given date object.
     *
     * @returns {string} The converted date string.
     */
    private _convertDateValue(dateObj: any): string {
        let date: string = dateConverter(dateObj);
        date = date.replace(' (G)', '');
        return date;
    }

    /**
     * Private method: _convertGeoValues.
     *
     * It converts geonames values of an accessible resource
     * to be displayed via HTML.
     *
     * @param {string[]} values The given property values.
     *
     * @returns {string[]} The converted geo names array.
     */
    private _convertGeoValues(values: string[]): string[] {
        // Values give reference id to api + "/geonames/{{:id}}?reqtype=node"
        // Result is an array nodelist (properties: id, label, name) with nodes from 0 to n

        const output = [];

        // Identify geonames gui-id from values
        // E.g. ["4136"] or ["4136", "4132"]
        values.forEach((valueId, index) => {
            // Get geonames data
            this._getAdditionalInfoFromApi(GeoDataJson, valueId).subscribe((geoNamesData: GeoDataJson) => {
                // Check for existing nodelist in geonames response
                // Else return empty prop if necessary
                if (!geoNamesData.nodelist) {
                    console.warn(
                        'ConversionService# _convertGeoValues: got no nodelist from geonames response: ',
                        geoNamesData
                    );
                    output[index] = '';
                    return output;
                }
                // Snapshot of nodelist array
                const geoDataArray: GeoDataItemJson[] = [...geoNamesData.nodelist];

                // Build new GeoNames-Object from geoData array
                const geo: GeoNames = new GeoNames(geoDataArray);

                // Construct and return html value
                output[index] = geo.html;
                return output;
            });
        });
        return output;
    }

    /**
     * Private method: _convertHlistValues.
     *
     * It converts hierarchy list values of an accessible resource
     * to be displayed via HTML.
     *
     * @param {string[]} values The given property values.
     * @param {string} attributes The given HTML attributes.
     *
     * @returns {string[]} The converted hlist array.
     */
    private _convertHlistValues(values: string[], attributes: string): string[] {
        // Prop.values give reference id to
        // Api + /hlists/{{:id}}
        // Result is an array hlist (properties: id, label, name, level) with nodes from 0 to n

        const output = [];

        // Identify id of hlist from prop.attributes
        // E.g. "hlist=17"
        const nodeId: string = this._getNodeIdFromAttributes(attributes);

        // Get hlist data
        this._getAdditionalInfoFromApi(HlistJson, nodeId).subscribe(
            (hlistData: HlistJson) => {
                // Check for existing hlist in response
                // Esle return empty prop if necessary
                if (!hlistData.hlist) {
                    console.warn('ConversionService# convertHListValue: got no hlist from response: ', hlistData);
                    return output;
                }
                // Snapshot of hlist array
                const hlistArray: HlistItemJson[] = [...hlistData.hlist];
                // Localize id in hlist array and identify the label
                values.forEach((valueId, index) => {
                    const filteredHlist: HlistItemJson[] = hlistArray.filter(hlistItem => hlistItem.id === valueId);
                    output[index] = filteredHlist[0].label;
                });
                return output;
            },
            err => console.error(err)
        );
        return output;
    }

    /**
     * Private method: _convertLinkValue.
     *
     * It converts a link value of an accessible resource
     * to be displayed via HTML.
     *
     * @param {*} prop The given property value.
     * @param {number} index The given index position.
     *
     * @returns {string} The converted link value.
     */
    private _convertLinkValue(prop: any, index: number): string {
        // Add <a>-tag with click-directive; linktext is stored in "$&"
        const firstValue = prop.value_firstprops[index];
        const replaceValue =
            '<a (click)="ref.navigateToResource(\'' +
            prop.values[index] +
            '\')">$& (' +
            prop.value_restype[index] +
            ')</a>';
        return firstValue.replace(firstValue, replaceValue);
    }

    /**
     * Private method: _convertRichtextValue.
     *
     * It converts a rich text value of an accessible resource
     * to be displayed via HTML.
     *
     * @param {string} str The given utf8 string of a rich text property.
     * @param {string} attr The given standoff attributes of a richtext property.
     *
     * @returns {string} The converted rich text value.
     */
    private _convertRichtextValue(str: string, attr: string): string {
        // Convert salsah standoff to html (using plugin "htmlConverter")
        const rtValue: string = this._convertStandoffToHTML(str, attr);

        // Replace salsah links
        return this._replaceSalsahLink(rtValue);
    }

    /**
     * Private method: _convertSelectionValues.
     *
     * It converts selection values of an accessible resource
     * to be displayed via HTML.
     *
     * @param {string[]} values The given property values.
     * @param {string} attributes The given HTML attributes.
     *
     * @returns {string[]} The converted selection array.
     *
     * TODO: check if it is possible to unify with hlist conversion?
     */
    private _convertSelectionValues(values: string[], attributes: string): string[] {
        // Values give reference id to api + "/selections/{{:id}}"
        // Result is an array of selection labels

        const output = [];

        // Identify id of selection-list from attributes
        // E.g. "selection=66"
        const nodeId: string = this._getNodeIdFromAttributes(attributes);

        // Get selection-list data
        this._getAdditionalInfoFromApi(SelectionJson, nodeId).subscribe(
            (selectionData: SelectionJson) => {
                // Check for existing selection in response
                // Else return empty prop if necessary
                if (!selectionData.selection) {
                    console.warn(
                        'ConversionService# _convertSelectionValues: got no selection from response: ',
                        selectionData
                    );
                    return output;
                }
                // Snapshot of selection array
                const selectionArray: SelectionItemJson[] = [...selectionData.selection];
                // Localize id in selection-list array and identify the label
                values.forEach((valueId, index) => {
                    const filteredSelection: SelectionItemJson[] = selectionArray.filter(
                        selectionItem => selectionItem.id === valueId
                    );
                    output[index] = filteredSelection[0].label;
                });
                return output;
            },
            err => console.error(err)
        );
        return output;
    }

    /**
     * Private method: _convertStandoffToHTML.
     *
     * It converts linear SALSAH standoff
     * (utf8 string with standoff attributes)
     * to html using plugin 'htmlConverter'.
     *
     * @param {string} str The given utf8 string of a rich text property.
     * @param {string} attr The given standoff attributes of a richtext property.
     *
     * @returns {string} The converted standoff.
     *
     * @todo check if it is possible to unify with hlist conversion?
     */
    private _convertStandoffToHTML(str: string, attr: string): string {
        if (!str) {
            return;
        }
        if (!attr) {
            return str;
        }
        return htmlConverter(JSON.parse(attr), str);
    }

    /**
     * Private method: _getAdditionalInfoFromApi.
     *
     * It makes additional calls to the given (SALSAH) API
     * to get additional resource infos in case of geoames,
     * hlists, selections or image values.
     *
     * @param {*} responseJsonType The given json type of the API response.
     * @param {string} id The given id of a resource.
     *
     * @returns {Observable<any>} The observable of the HTTP response.
     */
    private _getAdditionalInfoFromApi(responseJsonType: any, id: string): Observable<any> {
        let queryPath: string;
        switch (responseJsonType) {
            case GeoDataJson:
                queryPath = 'geonames/' + id + '?reqtype=node';
                break;
            case HlistJson:
                queryPath = 'hlists/' + id;
                break;
            case ResourceContextResponseJson:
                queryPath = 'resources/' + id + '_-_local?reqtype=context';
                break;
            case SelectionJson:
                queryPath = 'selections/' + id;
                break;
        }
        return this.getApiResponse(responseJsonType, queryPath);
    }

    /**
     * Private method: _getNodeIdFromAttributes.
     *
     * It gets a node id from the prop.attributes
     * of a selections or hlists value.
     *
     * @param {string} attributes The given prop.attributes.
     *
     * @returns {string} id The node id.
     */
    private _getNodeIdFromAttributes(attributes: string): string {
        // Identify node id from prop.attributes
        // E.g. "hlist=17" or "selection=77"
        return attributes.split('=')[1].toString();
    }

    /**
     * Private method: _adjustBiblioLink.
     *
     * It finds internal links in the online-access property
     * of a bibliography link and adjusts the values
     * to be displayed via HTML.
     *
     * @param {string} str The given link string.
     * @example
     * str = '(PDF) http://www.example.com/myPdf.pdf'
     *
     * @returns {string} The adjusted bibliography link.
     */
    private _adjustBiblioLink(str: string): string {
        if (!str) {
            return;
        }

        let outStr: string;
        let linkRegArr: RegExpExecArray;

        // Check for double spaces
        str = str.replace('  ', ' ');

        // Split "str" behind closing parentheses
        const splitArr: string[] = str.split(') ');

        // Get label of link from 1st part of splitArr (without opening parentheses)
        const labelStr: string = splitArr[0].replace('(', '');

        // Regexp for links
        const regExLink = /<a\\s+(?:[^>]*?\\s+)?(href=(["'])(.*?)\\2)>(.*?)<\/a>/i;

        // Check for link in 2nd part of splitArr
        if (regExLink.exec(splitArr[1])) {
            // ... link with <a> tag
            linkRegArr = regExLink.exec(splitArr[1]);
            outStr = '<a ' + linkRegArr[1] + '>' + labelStr + '</a>';
        } else if (labelStr !== 'DOI') {
            // ... <a> tag is missing, add it
            outStr = '<a href="' + splitArr[1] + '">' + labelStr + '</a>';
        } else {
            // No links, pure string
            outStr = labelStr + ': ' + splitArr[1];
        }
        return outStr;
    }

    /**
     * Private method: _replaceSalsahLink.
     *
     * It finds internal salsah links in richtext values
     * and replaces them with Angular click-directives.
     *
     * @param {string} str The given richtext value.
     *
     * @returns {string} The adjusted richtext value.
     */
    private _replaceSalsahLink(str: string): string {
        if (!str) {
            return;
        }

        // Regexp for Salsah links
        // Including subgroup for object id: /[1-9]\d{0,9}/ (any up-to 10-digit integer greater 0)
        const regLink =
            /<a\s+(?:[^>]*?\s+)?href=(["'])((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?salsah\.org\/api\/resources\/([1-9]\d{0,9}))\1 class=(["'])salsah-link\5>(.*?)<\/a>/i;

        let regArr: RegExpExecArray;

        // Check for salsah links in str
        while (regLink.exec(str)) {
            // I.e.: as long as regLink is detected in str do...
            regArr = regLink.exec(str);

            // Resource id is in 4th array entry
            const resId = regArr[4];
            // Link text is stored in last array entry
            const resTextContent = regArr[regArr.length - 1];

            // Replace href attribute with click-directive
            const replaceValue =
                '<a (click)="ref.navigateToResource(\'' +
                resId +
                '\'); $event.stopPropagation()">' +
                resTextContent +
                '</a>';
            str = str.replace(regArr[0], replaceValue);
        } // END while

        return str;
    }

    /**
     * Private method: _replaceParagraphTags.
     *
     * It removes paragraph tags in richtext values
     * and replaces line breaks instead for multiple lines.
     *
     * @param {string} str The given richtext value.
     *
     * @returns {string} The adjusted richtext value.
     */
    private _replaceParagraphTags(str: string): string {
        if (!str) {
            return;
        }
        str = str
            .replace(/<\/p><p>/g, '<br />')
            .replace(/<p>|<\/p>/g, '')
            .replace(str, '«$&»');
        return str;
    }

    /**
     * Private method: _distinctSubjects.
     *
     * It removes duplicates from an array (SubjectItemJson[]).
     * It checks for every array position (reduce) if the obj_id
     * of the entry at the current position (y) is already
     * in the array (findIndex). If that is not the case it
     * pushes y into x which is initialized as empty array [].
     *
     * See also {@link https://gist.github.com/telekosmos/3b62a31a5c43f40849bb#gistcomment-2137855}.
     *
     * @param {SubjectItemJson[]} subjects The given subject with possible duplicates.
     *
     * @returns {SubjectItemJson[]} The distinct subjects.
     */
    private _distinctSubjects(subjects: SubjectItemJson[]): SubjectItemJson[] {
        if (!subjects) {
            return;
        }
        this.filteredOut = 0;
        const distinctObj = {};
        let distinctArr = [];

        subjects.forEach((subject: SubjectItemJson) => (distinctObj[subject.obj_id] = subject));
        distinctArr = Object.values(distinctObj);

        this.filteredOut = subjects.length - distinctArr.length;

        return distinctArr;
    }

    /**
     * Private method: _groupByRestype.
     *
     * It groups an array of incoming links
     * by their resource type.
     *
     * @param {ResourceDetailIncomingLink[]} incomingLinks The given incoming links.
     *
     * @returns {ResourceDetailGroupedIncomingLinks} The grouped incoming links.
     */
    private _groupByRestype(incomingLinks: ResourceDetailIncomingLink[]): ResourceDetailGroupedIncomingLinks[] {
        if (!incomingLinks) {
            return;
        }

        // Find out and alphabetically sort all the unique restype labels
        const restypeLabels = new Set(incomingLinks.map(incomingLink => incomingLink.restype.label).sort());

        // Produce a list of restypes with its incoming links
        return Array.from(restypeLabels).map(label => ({
            restypeLabel: label,
            links: incomingLinks.filter(incomingLink => incomingLink.restype.label === label),
        }));
    }
}
