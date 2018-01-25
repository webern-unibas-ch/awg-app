import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ApiService } from '../api-service/api.service';
import {
    IncomingItemJson,
    ResourceFullResponseJson,
    SearchResponseJson
} from '../../../shared/api-objects';
import {
    ResourceDetail,
    ResourceDetailHeader,
    ResourceDetailIncomingLinks,
    ResourceDetailProps,
    ResourceDetailGroupedIncomingLinks
} from '../../../views/search-view/models';
import { GeoData, Hlist, Selection } from '../../core-models';
import {SubjectItemJson} from "../../../shared/api-objects/search-response-formats";

declare var htmlConverter;
declare var dateConverter;

@Injectable()
export class ConversionService extends ApiService {

    /******************************************
     *
     *  convert full text search results
     *  for displaying
     *
     *****************************************/
    public convertFullTextSearchResults(results: SearchResponseJson): SearchResponseJson {
        if (!results['subjects']) { return results; }
        // TODO: refactor with reduce??
        results['subjects'].forEach(res => {
            // clean value labels
            res.valuelabel[0] = res.valuelabel[0].replace(' (Richtext)', '');
            res.obj_id = res.obj_id.replace('_-_local', '');

            // =>Chronologie: salsah standoff needs to be converted before displaying
            // valuetype_id 14 = valuelabel 'Ereignis'
            if (res.valuetype_id[0] === '14' && res.value[0]) {
                let htmlstr: string = '';
                const utf8str: string = res.value[0]['utf8str'];
                const textattr: string = res.value[0]['textattr'];

                // check if there is standoff, otherwise leave res.value[0] alone
                // because when retrieved from cache the standoff is already converted
                if (utf8str && textattr) {
                    htmlstr = this.convertStandoffToHTML(utf8str, textattr);

                    // replace salsah links
                    htmlstr = this.replaceSalsahLink(htmlstr);

                    // strip & replace <p>-tags for displaying objt
                    htmlstr = this.replaceParagraphTags(htmlstr);

                    res.value[0] = htmlstr;
                }
            }
        });
        // remove duplicates from response
        results['subjects'] = this.distinctSubjectItemArray(results['subjects']);
        return results;
    }


    /******************************************
     *
     *  prepare fulltext search result string
     *
     *****************************************/
    public prepareFullTextSearchResultText(searchData: SearchResponseJson, filteredOut: number, searchUrl: string): string {
        let resText: string;

        if (searchData['subjects']) {
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

        // add lastmod state
        convObj['lastmod'] = data['resinfo']['lastmod'];

        Object.keys(data['props']).forEach((key: string) => {
            const prop = data['props'][key];
            const propValue: [string] = [''];   // empty text value

            // check if values property is defined
            if ('values' in prop) {
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
                        if (prop.values[0] !== '') {
                            this.convertSelectionValue(prop, propValue[0]);
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

    private prepareRestrictedResource(data: ResourceFullResponseJson, currentId): ResourceDetail {
        let detail: ResourceDetail = new ResourceDetail();
        const header = {
            'objID': currentId,
            'icon': 'http://www.salsah.org/app/icons/16x16/delete.png',
            'type': 'restricted',
            'title': 'Kein Zugriff auf dieses Objekt möglich',
            'lastmod': '---'
        };
        detail = {
            header: header,
            content: {
                props: [],
                image: [''],
                incoming: {}
            }
        };
        return detail;
    }

    private prepareAccessibleResource(data: ResourceFullResponseJson, currentId: string): ResourceDetail {
        // convert properties
        data = this.convertGUISpecificProps(data);

        // prepare parts of resourceDetail
        let detail: ResourceDetail = new ResourceDetail();
        detail = {
            header: this.prepareResourceDetailHeader(data, currentId),
            content: {
                props: this.prepareResourceDetailProperties(data.props),
                image: this.prepareResourceDetailImage(data),
                incoming: this.prepareResourceDetailIncomingLinks(data.incoming)
            }
        };
        return detail;
    }


    private prepareResourceDetailHeader(data: ResourceFullResponseJson, currentId: string) {
        let header: ResourceDetailHeader = new ResourceDetailHeader();
        const id = data.resdata.res_id;
        if (id !== currentId ) {
            console.error(`ERROR: ` +
                `conversionService#prepareResourceDetailHeader =>` +
                ` currentId ${currentId} not matching data resource id ${id}`);
            return;
        }
        const info = data.resinfo;
        const props = data.props;

        if (typeof info !== 'undefined') {
            // extract common default metadata for header
            header['objID'] = id;
            header['icon'] = info.restype_iconsrc;
            header['type'] = info.restype_label;
            header['lastmod'] = info.lastmod;

            // extract restype specific title metadata
            switch (info.restype_id) {
                // CHRONOLOGIE
                case '28':
                    // richtext value has already been converted in detail using plugin "htmlConverter"
                    let htmlstr = props['webern:event_rt'].toHtml[0];

                    // strip & replace <p>-tags for displaying title
                    htmlstr = this.replaceParagraphTags(htmlstr);

                    header['title'] = htmlstr;
                    break;

                // KORRESPONDENZ (same as SUPPLEMENT)
                case '29':
                // SUPPLEMENT
                case '125':
                    header['title'] = props['dc:title'].toHtml[0] + '<br/>' + props['dc:date'].toHtml[0];
                    break;

                // MUSIKSTÜCK (Moldenhauer-Nummer)
                case '36':
                    header['title'] = '[M ' + props['webern:mnr'].toHtml[0] + '] ' + props['dc:title'].toHtml[0];
                    break;

                // WERK
                case '43':
                    header['title'] = props['dc:title'].toHtml[0];
                    break;

                // PERSON
                case '45':
                    const lname: string = props['salsah:lastname'].toHtml[0],
                        fname: string = props['salsah:firstname'].toHtml[0];
                    header['title'] = fname + ' ' + lname;
                    break;

                // BIBLIOGRAPHIE
                case '126':
                    header['title'] = props['webern:bibl_title_short'].toHtml[0];
                    break;

                // DEFAULT
                default:
                    header['title'] = info.restype_description;

            }
        } else {
            // header for undefined object
            header = {
                'objID': id,
                'icon': 'http://www.salsah.org/app/icons/16x16/delete.png',
                'type': '---',
                'title': '---',
                'lastmod': '---'
            };
        }
        return header;
    }

    private prepareResourceDetailImage(data) {
        // TODO:
        return [''];
    }

    private prepareResourceDetailIncomingLinks(incoming: IncomingItemJson[]): ResourceDetailGroupedIncomingLinks {
        let groupedIncomingLinks: ResourceDetailGroupedIncomingLinks;
        const incomingLinks: ResourceDetailIncomingLinks[] = [];
        incoming.forEach(ins => {
            incomingLinks.push({
                id: ins.ext_res_id.id,
                value: ins.value,
                restype: {
                    id: ins.resinfo.restype_id,
                    label: ins.resinfo.restype_label,
                    icon: ins.resinfo.restype_iconsrc
                }
            });
        });
        groupedIncomingLinks = this.groupByRestype(incomingLinks);
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


    private convertGUISpecificProps(data) {
        // loop through all properties and add toHtml values
        Object.keys(data['props']).forEach((key: string) => {
            const prop = this.addHtmlValues(data['props'][key]);
            data['props'][key] = prop;
        });
        return data;
    }

    private addHtmlValues(prop, url?): [string] {
        prop['toHtml'] = [''];

        if (prop.values) {
            switch (prop.valuetype_id) {

                case '4':   // DATE: salsah object needs to be converted (using plugin "dateConverter")
                    for (let i = 0; i < prop.values.length; i++) {
                        prop['toHtml'][i] = this.convertDateValue(prop.values[i]);
                    }
                    break; // END date

                case '6':   // LINKVALUE (searchbox): links to another salsah object need to be converted
                    for (let i = 0; i < prop.values.length; i++) {
                        prop['toHtml'][i] = this.convertLinkValue(prop, i);
                    }
                    break; // END linkvalue

                case '7': // SELECTION (pulldown): selection nodes have to be read seperately
                    this.convertSelectionValue(prop, prop['toHtml']);
                    break; // END selection

                case '12': // HLIST: hlist nodes have to be called seperately
                        this.convertHlistValue(prop, prop['toHtml']);
                    break; // END hlist

                case '14':  // RICHTEXT: salsah standoff needs to be converted
                    for (let i = 0; i < prop.values.length; i++) {
                        prop['toHtml'][i] = this.convertRichtextValue(prop.values[i].utf8str, prop.values[i].textattr);
                    }
                    break; // END richtex

                case '15': // GeoNAMES: GeoName nodes have to called seperately
                        this.convertGeoValue(prop, prop['toHtml']);
                 break; // END geonames

                // '1' => TEXT: properties come as they are
                default:
                    for (let i = 0; i < prop.values.length; i++) {
                        prop['toHtml'][i] = prop.values[i];
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
    private convertGeoValue(input, output) {
        // input.values give reference id to api + "/geonames/{{:id}}?reqtype=node"
        // result is an array nodelist (properties: id, label, name) with nodes from 0 to n

        // identify geonames gui-id from input.values
        // e.g. ["4136"] or ["4136", "4132"]
        const geoGuiId = input.values;

        for (let i = 0; i < geoGuiId.length; i++) {
            // get geonames gui data
            this.getGeonameNodesById(geoGuiId[i]).subscribe(
                geoNamesData => {
                    // check for existing nodelist in geonames response
                    // esle return empty prop if necessary
                    if (!geoNamesData.body.nodelist) {
                        console.info(`ConversionService#convertGeoValue: got no nodelist from geonames response: ${geoNamesData}`);
                        return output[i] = '';
                    }
                    // new empty GeoData-Object
                    const geo: GeoData = new GeoData();
                    // fill geoData object with nodelist from geoNamesResponse
                    geo['nodeList'] = geoNamesData.body.nodelist;

                    // get labels from nodelist array
                    geo.longLabel = geo.nodeList[0].label;
                    for (let j = 1; j < geo.nodeList.length; j++) {
                        const geoItem = geo.nodeList[j];
                        geo.longLabel += ', ' + geoItem.label;
                        if (j === geo.nodeList.length - 1) {
                            // get geonames-id gnid from last array item
                            geo['gnid'] = geoItem.name.replace('gnid:', '');
                            // short label
                            geo['shortLabel'] = geoItem.label;
                            // latitude + longitude
                            geo['latitude'] = geoItem.lat;
                            geo['longitude'] = geoItem.lng;
                            // wiki
                            geo['wiki'] = geoItem.wikipedia;
                        }
                    }

                    // prepare icon & link for geonames
                    const geoIcon = '<img src="assets/img/logo-geonames.png" height="25" width="25" alt="' + geo.shortLabel + '" />';
                    const geoLink = '<a href="http://www.geonames.org/' +
                                     geo.gnid + '" title="' + geo.longLabel +
                                     '" target="_blank">' + geoIcon + '</a>';
                    let wikiLink = '';
                    if (geo.wiki) {
                        const wikiIcon = '<img src="assets/img/logo-wiki.svg" height="25" width="25" alt="' + geo.wiki + '" />';
                        wikiLink = '<a href="http://' + geo.wiki + '" title="' + geo.wiki + '" target="_blank">' + wikiIcon + '</a>';
                    }
                    // construct "toHtml"-value
                    output[i] = geo.shortLabel + ' ' + geoLink + wikiLink;
                    return output;
               });
        }
    }

    /******************************************
     *
     * convert hlist values
     *
     *****************************************/
    private convertHlistValue(input, output) {
        // prop.values give reference id to
        // api + /hlists/{{:id}}
        // result is an array hlist (properties: id, label, name, level) with nodes from 0 to n

        // identify id of hlist from prop.attributes
        // e.g. "hlist=17"
        const hlistId: string = input.attributes.split('=')[1].toString();

        // get hlist data
        this.getHListNodesById(hlistId).subscribe(
            (hlistData) => {
                // check for existing hlist in response
                // esle return empty prop if necessary
                if (!hlistData.body.hlist) {
                    console.info('ConversionService#convertHListValue: got no hlist from response: ', hlistData);
                    return output = [''];
                }
                const hlist: Hlist[] = hlistData.body.hlist;
                // localize id in hlist object and identify the label
                for (let i = 0; i < input.values.length; i++) {
                    for (let j = 0; j < hlist.length; j++) {
                        if (input.values[i] === hlist[j]['id']) {
                            output[i] = hlist[j]['label'];
                        }
                    }
                }
                return output;
            },
            err => console.error(err)
        );
    }

    /******************************************
     *
     * convert link values
     *
     *****************************************/
    private convertLinkValue(prop, i: number) {
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
    private convertRichtextValue(str: string, attr: string) {
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
    private convertSelectionValue(input, output) {
        // input.values give reference id to api + "/selections/{{:id}}"
        // result is an array selection (properties: id, label, name, order, label_ok) with nodes from 0 to n

        // identify id of selection-list from input.attributes
        // e.g. "selection=66"
        const selectionId: string = input.attributes.split('=')[1].toString();

        // get selection-list data
        this.getSelectionNodesById(selectionId).subscribe(
            (selectionData) => {
                // check for existing selection in response
                // esle return empty prop if necessary
                if (!selectionData.body.selection) {
                    console.info(`ConversionService#convertSelectionValue: got no selection from response: ${selectionData}`);
                    return output = [''];
                }
                const selection: Selection[] = selectionData.body.selection;
                // localize id in selection-list object and identify the label
                for (let i = 0; i < input.values.length; i++) {
                    for (let j = 0; j < selection.length; j++) {
                        if (input.values[i] === selection[j]['id']) {
                            output[i] = selection[j]['label'];
                        }
                    }
                }
                return output;
            },
            err => console.error(err)
        );
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
     * get geonames node list from salsah api
     *
     *****************************************/
    private getGeonameNodesById(geoGuiId: string): Observable<any> {
        const queryString: string = '/geonames/' + geoGuiId + '?reqtype=node';
        return this.httpGet(queryString);
    }

    /******************************************
     *
     * get hlist node object from salsah api
     *
     *****************************************/
    private getHListNodesById(hlistId: string): Observable<any> {
        const queryString: string = '/hlists/' + hlistId;
        return this.httpGet(queryString);
    }

    /******************************************
     *
     * get selection node list object from salsah api
     *
     *****************************************/
    private getSelectionNodesById(selectionId: string): Observable<any> {
        const queryString: string = '/selections/' + selectionId;
        return this.httpGet(queryString);
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
