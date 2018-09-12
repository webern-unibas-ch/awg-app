import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ApiService } from '@awg-core/services/api-service';
import {
    ContextJson,
    GeoDataJson,
    GeoDataItemJson,
    HlistJson,
    HlistItemJson,
    IncomingItemJson,
    ResourceContextResponseJson,
    ResourceFullResponseJson,
    SearchResponseJson,
    SelectionJson,
    SelectionItemJson,
    SubjectItemJson
} from '@awg-shared/api-objects';
import {
    ResourceDetail,
    ResourceDetailHeader,
    ResourceDetailIncomingLinks,
    ResourceDetailProps,
    ResourceDetailGroupedIncomingLinks,
    ResourceDetailImage,
    ResourceDetailContent
} from '@awg-views/data-view/models';
import { GeoNames } from '@awg-core/core-models';

declare var htmlConverter;
declare var dateConverter;

@Injectable()
export class ConversionService extends ApiService {


    /******************************************
     *
     * sum up length of all arrays nested in an
     * ResourceDetailGroupedIncomingLinks object
     *
     *****************************************/
    getNestedArraysLength(obj: ResourceDetailGroupedIncomingLinks): number {
        let size: number = 0;
        // iterate over object keys
        Object.keys(obj).forEach(key => {
            // sum up length of array nested in object
            size += obj[key].length;
        });
        return size;
    }


    /******************************************
     *
     *  convert full text search results
     *  for displaying
     *
     *****************************************/
    public convertFullTextSearchResults(results: SearchResponseJson): SearchResponseJson {
        if (!results.subjects) { return results; }

        // TODO: refactor with reduce??
        results.subjects.forEach(subject => {
            // clean value labels
            subject.valuelabel[0] = subject.valuelabel[0].replace(' (Richtext)', '');
            subject.obj_id = subject.obj_id.replace('_-_local', '');

            // =>Chronologie: salsah standoff needs to be converted before displaying
            // valuetype_id 14 = valuelabel 'Ereignis'
            if (subject.valuetype_id[0] === '14' && subject.value[0]) {
                let htmlstr: string = '';
                const utf8str: string = subject.value[0].utf8str;
                const textattr: string = subject.value[0].textattr;

                // check if there is standoff, otherwise leave res.value[0] alone
                // because when retrieved from cache the standoff is already converted
                if (utf8str && textattr) {
                    htmlstr = this.convertStandoffToHTML(utf8str, textattr);

                    // replace salsah links
                    htmlstr = this.replaceSalsahLink(htmlstr);

                    // strip & replace <p>-tags for displaying objt
                    htmlstr = this.replaceParagraphTags(htmlstr);

                    subject.value[0] = htmlstr;
                }
            }
        });
        // remove duplicates from response
        results.subjects = this.distinctSubjectItemArray(results.subjects);
        return results;
    }


    /******************************************
     *
     *  prepare fulltext search result string
     *
     *****************************************/
    public prepareFullTextSearchResultText(searchData: SearchResponseJson, filteredOut: number, searchUrl: string): string {
        let resText: string;

        if (searchData.subjects) {
            const length = searchData.subjects.length;
            resText = length + ` `;
            resText += (length === 1) ? `zugängliches Resultat` : `zugängliche Resultate`;
            resText += ` von ${searchData.nhits}`;

            if (filteredOut > 0) {
                const duplString: string = (filteredOut === 1) ? `Duplikat` : `Duplikate`;
                resText += ` (${filteredOut} ${duplString} entfernt)`;
            }
        } else {
            resText = `Die Abfrage ${searchUrl} ist leider fehlgeschlagen. Wiederholen Sie die Abfrage zu einem späteren Zeitpunkt oder überprüfen sie die Suchbegriffe.`;
        }

        return resText;
    }


    /******************************************
     *
     * convert object properties for displaying
     *
     *****************************************/
    public convertObjectProperties(data: ResourceFullResponseJson) {
        const convObj = {};
        console.log('convertdata: ', data);
        // add lastmod state
        convObj['lastmod'] = data.resinfo.lastmod;

        Object.keys(data.props).forEach((key: string) => {
            const prop = data.props[key];
            let propValue: string[] = [''];   // empty text value

            // check if values property is defined
            if (prop.hasOwnProperty('values') && prop.values != undefined) {
                // check for gui-elements
                switch (prop.valuetype_id) {
                    case '4':
                        // DATE: salsah object needs to be converted (using plugin "dateConverter")
                        if (prop.values[0] !== '') {
                            propValue[0] = this.convertDateValue(prop.values[0]);
                        }
                        break; // END date

                    case '7':
                        // SELECTION PULLDOWN: selection nodes have to be read seperately
                        // TODO
                        if (prop.values !== []) {
                            propValue = this.convertSelectionValue(prop.values, prop.attributes);
                            console.log('propValue: ', propValue);
                        }
                        break; // END selection

                    case '14':
                        // RICHTEXT: salsah standoff needs to be converted

                        // check for multiple && not empty values
                        if (prop.values.length > 0 && prop.values[0].utf8str !== '') {
                            // clean value labels
                            prop.label = prop.label.replace(' (Richtext)', '');

                            for (let i = 0; i < prop.values.length; i++) {
                                // init
                                let htmlstr = '';

                                // convert linear salsah standoff to html (using plugin "htmlConverter")
                                htmlstr = this.convertStandoffToHTML(prop.values[i].utf8str, prop.values[i].textattr);

                                // replace salsah links & <p>-tags
                                htmlstr = this.replaceSalsahLink(htmlstr);
                                htmlstr = htmlstr.replace('<p>', '').replace('</p>', '');

                                // trim string
                                propValue[i] = htmlstr.trim();

                                // replace bibliography links
                                if (prop.label === 'Online-Zugang') {
                                    propValue[i] = this.replaceBiblioLink(propValue[i]);
                                }
                            }
                        }
                        break; // END richtext

                    default: // '1'=> TEXT: properties come as they are
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

            // extract publication year from publication date
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


    public prepareResourceDetail(data: ResourceFullResponseJson, currentId: string): ResourceDetail {
        if (data.access === 'OK') {
            return this.prepareAccessibleResource(data, currentId);
        } else {
            return this.prepareRestrictedResource(data, currentId);
        }
    }

    private prepareRestrictedResource(data: ResourceFullResponseJson, currentId: string): ResourceDetail {
        const header: ResourceDetailHeader = new ResourceDetailHeader(data, currentId);
        const content = undefined;

        const detail: ResourceDetail = new ResourceDetail(header, content);
        return detail;
    }

    private prepareAccessibleResource(data: ResourceFullResponseJson, currentId: string): ResourceDetail {
        // convert properties
        data = this.convertGUISpecificProps(data);

        // prepare parts of resourceDetail
        const header: ResourceDetailHeader = new ResourceDetailHeader(data, currentId);
        const content: ResourceDetailContent = {
            props: this.prepareResourceDetailProperties(data.props),
            images: this.prepareResourceDetailImage(currentId),
            incoming: this.prepareResourceDetailIncomingLinks(data.incoming)
        };

        const detail: ResourceDetail = new ResourceDetail(header, content);
        return detail;
    }


    private prepareResourceDetailImage(id: string): ResourceDetailImage[] {
        // id of image context for api + "/resources/{{:id}}_-_local?reqtype=context"
        // result is an array of ResourceDetailImage
        let output: ResourceDetailImage[] = [];

        // get resource context data
        this.getAdditionalInfoFromApi(ResourceContextResponseJson, id).subscribe(
            (contextData: ResourceContextResponseJson) => {
                // check for existing resource_context in response
                // else return undefined output if necessary
                if (!contextData.resource_context.res_id) {
                    // console.info('ConversionService# prepareResourceDetailImage: got no resource_context id\'s from context response: ', contextData);
                    return;
                } else {
                    const context: ContextJson = {...contextData.resource_context};

                    // IMAGE OBJECT (context == 2)
                    if (context.context == 2 && context.resclass_name === "image") {
                        if (context.res_id.length === context.firstprop.length) {
                            for (let i = 0; i < context.res_id.length; i++) {
                                // build new ResourceDetailImage-Object from context and index
                                const image: ResourceDetailImage = new ResourceDetailImage(context, i);
                                output[i] = image;
                            }
                        } else {
                            console.warn('ConversionService - Array length for context objects is not consistent with firstprops length!', context);
                            return;
                        }
                        // STANDARD OBJECT (context == 0 || 1)
                    } else if (context.context < 2) {
                        console.info('ConversionService - got no image context', context);
                        return;
                    }
                }
                return output;
            },
            err => console.error(err)
        );
        return output;
    }


    private prepareResourceDetailIncomingLinks(incomingArray: IncomingItemJson[]): ResourceDetailGroupedIncomingLinks {
        const incomingLinks: ResourceDetailIncomingLinks[] = [];
        incomingArray.forEach(incoming => {
            incomingLinks.push(new ResourceDetailIncomingLinks(incoming));
        });
        const groupedIncomingLinks: ResourceDetailGroupedIncomingLinks = this.groupByRestype(incomingLinks);
        return groupedIncomingLinks;
    }


    private prepareResourceDetailProperties(props) {
        const detailProperties: ResourceDetailProps[] = [];

        // loop through property keys
        Object.keys(props).forEach((key: string) => {
            const prop: any = props[key];

            // clean value labels
            if (prop.label) {
                prop.label = prop.label.replace(' (Richtext)', '');
            }

            // push default values into searchDetailProperties
            detailProperties.push({
                pid: prop.pid,
                guielement: prop.guielement,
                label: prop.label,
                value: prop.toHtml
            });
        }); // END forEach props
        return detailProperties;
    }


    private convertGUISpecificProps(data: ResourceFullResponseJson) {
        // loop through all properties and add toHtml values
        Object.keys(data.props).forEach((key: string) => {
            const prop = this.addHtmlValues(data.props[key]);
            data.props[key] = prop;
        });
        return data;
    }

    private addHtmlValues(prop, url?): [string] {
        prop.toHtml = [''];

        if (prop.values) {
            switch (prop.valuetype_id) {

                case '4':   // DATE: salsah object needs to be converted (using plugin "dateConverter")
                    for (let i = 0; i < prop.values.length; i++) {
                        prop.toHtml[i] = this.convertDateValue(prop.values[i]);
                    }
                    break; // END date

                case '6':   // LINKVALUE (searchbox): links to another salsah object need to be converted
                    for (let i = 0; i < prop.values.length; i++) {
                        prop.toHtml[i] = this.convertLinkValue(prop, i);
                    }
                    break; // END linkvalue

                case '7': // SELECTION (pulldown): selection nodes have to be read seperately
                    prop.toHtml = this.convertSelectionValue(prop.values, prop.attributes);
                    break; // END selection

                case '12': // HLIST: hlist nodes have to be called seperately
                    prop.toHtml = this.convertHlistValue(prop.values, prop.attributes);
                    break; // END hlist

                case '14':  // RICHTEXT: salsah standoff needs to be converted
                    for (let i = 0; i < prop.values.length; i++) {
                        prop.toHtml[i] = this.convertRichtextValue(prop.values[i].utf8str, prop.values[i].textattr);
                    }
                    break; // END richtext

                case '15': // GeoNAMES: GeoName nodes have to called seperately
                    prop.toHtml = this.convertGeoValue(prop.values);
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


    /******************************************
     *
     * convert date values
     *
     *****************************************/
    private convertDateValue(dateObj) {
        let date = dateConverter(dateObj);
        date = date.replace(' (G)', '');
        return date;
    }

    /******************************************
     *
     * convert geoNames values
     *
     *****************************************/
    private convertGeoValue(values): string[] {
        // values give reference id to api + "/geonames/{{:id}}?reqtype=node"
        // result is an array nodelist (properties: id, label, name) with nodes from 0 to n

        let output: string[] = [''];

        // identify geonames gui-id from values
        // e.g. ["4136"] or ["4136", "4132"]
        values.forEach((valueId, index) => {
            // get geonames data
            this.getAdditionalInfoFromApi(GeoDataJson, valueId).subscribe(
                (geoNamesData: GeoDataJson) => {
                    // check for existing nodelist in geonames response
                    // else return empty prop if necessary
                    if (!geoNamesData.nodelist) {
                        console.info('ConversionService# convertGeoValue: got no nodelist from geonames response: ', geoNamesData);
                        return output[index] = '';
                    }
                    // snapshot of nodelist array
                    const geoDataArray: GeoDataItemJson[] = [...geoNamesData.nodelist];

                    // build new GeoNames-Object from nodelist array
                    const geo: GeoNames = new GeoNames(geoDataArray);

                    // construct and return html value
                    output[index] = geo.html;
                    return output;
                }
            )
        });
        return output;
    }

    /******************************************
     *
     * convert hlist values
     *
     *****************************************/
    private convertHlistValue(values, attributes): string[] {
        // prop.values give reference id to
        // api + /hlists/{{:id}}
        // result is an array hlist (properties: id, label, name, level) with nodes from 0 to n

        let output: string[] = [''];

        // identify id of hlist from prop.attributes
        // e.g. "hlist=17"
        const nodeId: string = this.getNodeIdFromAttributes(attributes);

        // get hlist data
        this.getAdditionalInfoFromApi(HlistJson, nodeId).subscribe(
            (hlistData: HlistJson) => {
                // check for existing hlist in response
                // esle return empty prop if necessary
                if (!hlistData.hlist) {
                    console.info('ConversionService# convertHListValue: got no hlist from response: ', hlistData);
                    return output;
                }
                // snapshot of hlist array
                const hlistArray: HlistItemJson[] = [...hlistData.hlist];
                // localize id in hlist array and identify the label
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

    /******************************************
     *
     * convert link values
     *
     *****************************************/
    private convertLinkValue(prop, i: number): string {
        // add <a>-tag with click-directive; linktext is stored in "$&"
        const firstValue = prop.value_firstprops[i];
        const replaceValue = '<a (click)="ref.navigateToResource(\'' + prop.values[i] + '\')">$& (' + prop.value_restype[i] + ')</a>';
        const linkValue = firstValue.replace(firstValue, replaceValue);
        return linkValue;
    }

    /******************************************
     *
     * convert richtext values
     *
     *****************************************/
    private convertRichtextValue(str: string, attr: string): string {
        // convert salsah standoff to html (using plugin "htmlConverter")
        let rtValue: string = this.convertStandoffToHTML(str, attr);

        // replace salsah links
        rtValue = this.replaceSalsahLink(rtValue);

        return rtValue;
    }

    // TODO: check if it is possible to unify with hlist conversion?
    /******************************************
     *
     * convert selection values
     *
     *****************************************/
    private convertSelectionValue(values, attributes): string[] {
        // values give reference id to api + "/selections/{{:id}}"
        // result is an array of selection labels

        let output: string[] = [''];

        // identify id of selection-list from attributes
        // e.g. "selection=66"
        const nodeId: string = this.getNodeIdFromAttributes(attributes);

        // get selection-list data
        this.getAdditionalInfoFromApi(SelectionJson, nodeId).subscribe(
            (selectionData: SelectionJson) => {
                // check for existing selection in response
                // else return empty prop if necessary
                if (!selectionData.selection) {
                    console.info('ConversionService# convertSelectionValue: got no selection from response: ', selectionData);
                    return output;
                }
                // snapshot of selection array
                const selectionArray: SelectionItemJson[] = [...selectionData.selection];
                // localize id in selection-list array and identify the label
                values.forEach((valueId, index) => {
                    const filteredSelection: SelectionItemJson[] = selectionArray.filter(selectionItem => selectionItem.id === valueId );
                    output[index] = filteredSelection[0].label;
                });
                return output;
            },
            err => console.error(err)
        );
        return output;
    }

    /******************************************
     *
     *  convert linear salsah standoff
     *  (string with textattributes)
     *  to html using plugin "htmlConverter"
     *
     *****************************************/
    private convertStandoffToHTML(str: string, attr: string): string {
        if (!str) { return; }
        if (!attr) { return str; }
        return htmlConverter(JSON.parse(attr), str);
    }


    /******************************************
     *
     * get additional resource info from salsah api
     *
     *****************************************/
    private getAdditionalInfoFromApi(responseType: any, valueId: string): Observable<any> {
        let queryString: string;
        switch (responseType) {
            case GeoDataJson:
                queryString = '/geonames/' + valueId + '?reqtype=node';
                break;
            case HlistJson:
                queryString = '/hlists/' + valueId;
                break;
            case ResourceContextResponseJson:
                queryString = '/resources/' + valueId + '_-_local?reqtype=context';
                break;
            case SelectionJson:
                queryString = '/selections/' + valueId;
                break;
        }
        return this.getApiResponse(responseType, queryString);
    }


    /******************************************
     *
     * get node id from attributes value
     *
     *****************************************/
    private getNodeIdFromAttributes(attributes): string {
        // identify node id from prop.attributes
        // e.g. "hlist=17" or "selection=77"
        return attributes.split('=')[1].toString();
    }


    /******************************************
     *
     *  find inner links in online-access-property
     *  and rebuild the values for displaying
     *
     *****************************************/
    private replaceBiblioLink(str: string) {

        if (!str) { return; }

        let tmpStr,
            splitStr,
            nameStr,
            linkStr;
        const regExLink = /<a (.*?)>(.*?)<\/a>/i; // regexp for links

        // check for double spaces
        str = str.replace('  ', ' ');

        // split "str" behind parentheses
        splitStr = str.split(') ');

        // get name of link from 1st part of "splitstr
        nameStr = splitStr[0].replace('(', '');

        // check for link in 2nd part of "splitstr"
        if (linkStr = regExLink.exec(splitStr[1])) {
            // ... link with <a> tag
            tmpStr = '<a target="_blank" ' + linkStr[1] + '>' + nameStr + '</a>';
        } else if (nameStr !== 'DOI') {
            // ... <a> tag is missing, add it
            tmpStr = '<a target="_blank" href="' + splitStr[1] + '">' + nameStr + '</a>';
        } else {
            // no links, pure string
            tmpStr = nameStr + ': ' + splitStr[1];
        }
        return tmpStr;
    }

    /******************************************
     *
     * find inner salsah links in richtext
     * and replace them with click-directive
     *
     *****************************************/
    private replaceSalsahLink(str: string): string {
        if (!str) { return; }
        const patNum = /\d{4,8}/;    // regexp for object id (4-8 DIGITS)
        const patLink = /<a href="(http:\/\/www.salsah.org\/api\/resources\/\d{4,8})" class="salsah-link">(.*?)<\/a>/i; // regexp for salsah links
        let p;

        // check only for salsah links
        while (p = patLink.exec(str)) {
            // i.e.: as long as patLink is detected in str do...

            // identify resource id
            const res_id = patNum.exec(p[1])[0];

            // replace href attribute with click-directive
            // linktext is stored in second regexp-result p[2]
            const replaceValue = '<a (click)="ref.navigateToResource(\'' + res_id + '\'); $event.stopPropagation()">' + p[2] + '</a>';
            str = str.replace(p[0], replaceValue);
        } // END while

        return str;
    }


    /******************************************
     *
     * replace paragraph tags
     *
     *****************************************/
    private replaceParagraphTags(str: string): string {
        if (!str) { return; }
        str = str.replace(/<\/p><p>/g, '<br />').replace(/<p>|<\/p>/g, '').replace(str, '«$&»');
        return str;
    }


    /******************************************
     *
     * remove duplicates from array (SubjectItemJson[])
     *
     *****************************************/
    private distinctSubjectItemArray(arr: SubjectItemJson[]) {
        /*
        * see https://gist.github.com/telekosmos/3b62a31a5c43f40849bb#gistcomment-2137855
        *
        * This function checks for every array position (reduce)
        * if the obj_id of the entry at the current position (y) is already in the array (findIndex)
        * and if not pushes y into x that is initalized as empty array []
        *
        */
        if (!arr) { return; }
        let filteredOut: number = 0;
        return arr.reduce((x, y) => x.findIndex(e => e.obj_id === y.obj_id) < 0 ? [...x, y] : (filteredOut += 1, x), []);
    }


    /******************************************
     *
     * group array of incoming links by restype
     *
     *****************************************/
    private groupByRestype(incomingLinks: ResourceDetailIncomingLinks[]): ResourceDetailGroupedIncomingLinks {
        const groups = {};
        // iterate over incoming links to group by restype
        incomingLinks.forEach(link => {
            const group = link.restype.label;
            if (group in groups) {
                groups[group].push(link);   // push link into existing restype group
            } else {
                groups[group] = [link];     // create restype group and make link the first entry
            }
        });
        return groups;
    }

}
