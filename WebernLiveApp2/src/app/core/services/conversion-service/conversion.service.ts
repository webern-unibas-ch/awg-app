import { Injectable } from '@angular/core';

import { ApiService } from '../api-service/api.service';
import { ResourceFullResponseJson, SearchResponseJson } from '../../../shared/api-objects';

import {
    ResourceDetail,
    ResourceDetailHeader,
    ResourceDetailIncomingLinks,
    ResourceDetailProps
} from '../../../views/search-view/resource-detail-models';
import {IncomingItemJson} from "../../../shared/api-objects/resource-response-formats/src/incoming-item-json";
import {Observable} from "rxjs/Observable";

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
        results['subjects'].forEach(res => {
            // clean value labels
            res.valuelabel[0] = res.valuelabel[0].replace(' (Richtext)', '');
            res.obj_id = res.obj_id.replace('_-_local', '');

            // =>Chronologie: salsah standoff needs to be converted before displaying
            // valuetype_id 14 = valuelabel 'Ereignis'
            if (res.valuetype_id[0] == '14') {
                let htmlstr: string = this.convertStandoffToHTML(res.value[0]['utf8str'], res.value[0]['textattr']);

                // replace salsah links
                htmlstr = this.replaceSalsahLink(htmlstr);

                // strip & replace <p>-tags for displaying objtitle
                htmlstr = this.replaceParagraphTags(htmlstr);
                res.value[0] = htmlstr;
            }
        });
        return results;
    }


    /******************************************
     *
     * convert object properties for displaying
     *
     *****************************************/
    public convertObjectProperties(data: ResourceFullResponseJson) {
        let convObj = {};

        // add lastmod state
        convObj['lastmod'] = data['resinfo']['lastmod'];

        Object.keys(data['props']).forEach((key:string) => {
            const prop = data['props'][key];
            let propValue: [string] = [''];

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
                        if (prop.values[0] !== '') {
                            // identify id of selection-list from prop.attributes
                            // e.g. "selection=66"
                            let selectionId: string = prop.attributes.split("=")[1].toString();

                            // get selection from salsah api
                            this.getSelectionNodesById(selectionId).subscribe(
                                (data: Object) => {
                                    let selectionArr = data['selection'];
                                    // localize id in selection-list object and identify the label
                                    for (let i = 0; i < selectionArr.length; i++) {
                                        if (prop.values[0] === selectionArr[i].id) {
                                            propValue[0] = selectionArr[i].label;
                                        }
                                    }
                                },
                                err => console.log(err)
                            );
                        } else {
                            // empty value
                            propValue[0] = '';
                        }
                        break; //END selection

                    case '14':
                        // RICHTEXT: salsah standoff needs to be converted

                        // check for multiple && not empty values
                        if (prop.values.length > 0 && prop.values[0].utf8str !== '') {
                            // clean value labels
                            prop.label = prop.label.replace(' (Richtext)', '');

                            for (let i = 0; i < prop.values.length; i++) {
                                // init
                                let htmlstr = '';

                                // convert linear salsah standoff to html (using plugin "convert_lin2html")
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

                            // empty values
                        } else {
                            propValue[0] = '';
                        }
                        break; // END richtext

                    default: // '1'=> TEXT: properties come as they are
                        if (prop.values[0] !== '') {
                            for (let i = 0; i < prop.values.length; i++) {
                                propValue[i] = prop.values[i].trim();
                            }
                        } else {
                            // empty text value
                            propValue[0] = '';
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


    public prepareResourceDetail(data: ResourceFullResponseJson): ResourceDetail {
        if (data.access === 'OK') {
            return this.prepareAccessResource(data);
        } else {
            return this.prepareRestrictedResource(data);
        }
    }

    private prepareRestrictedResource(data: ResourceFullResponseJson): ResourceDetail {
        let detail: ResourceDetail = new ResourceDetail();
        const id = '0000';
        const header = {
            'objID': id,
            'icon': 'http://www.salsah.org/app/icons/16x16/delete.png',
            'type': 'restricted',
            'title': 'Kein Zugriff auf dieses Objekt möglich',
            'lastmod': '---'
        };
        detail = {
            header: header,
            image: [''],
            incoming: [],
            props: []
        };
        console.log('detail: ', detail);
        console.log('No access granted to resource: ', id);
        return detail;
    }

    private prepareAccessResource(data: ResourceFullResponseJson): ResourceDetail {
        // convert properties
        data = this.convertGUISpecificProps(data);

        // prepare parts of resourceDetail
        let detail: ResourceDetail = new ResourceDetail();
        detail = {
            header: this.prepareResourceDetailHeader(data),
            image: this.prepareResourceDetailImage(data),
            incoming: this.prepareResourceDetailIncomingLinks(data.incoming),
            props: this.prepareResourceDetailProperties(data.props)
        };
        return detail;
    }


    private prepareResourceDetailHeader(data) {
        let header: ResourceDetailHeader = new ResourceDetailHeader();
        const id = data.resdata.res_id;
        const info = data.resinfo;
        const props = data.props;

        if (typeof info !== undefined) {
            // extract common default metadata for header
            header['objID'] = id;
            header['icon'] = info.restype_iconsrc;
            header['type'] = info.restype_label;
            header['lastmod'] = info.lastmod;

            // extract restype specific title metadata
            switch (info.restype_id) {
                // PERSON
                case '45':
                    const lname: string = props['salsah:lastname'].toHtml[0],
                        fname: string = props['salsah:firstname'].toHtml[0];
                    header['title'] = fname + ' ' + lname;
                    break;

                // KORRESPONDENZ (same as SUPPLEMENT)
                case '29':
                // SUPPLEMENT
                case '125':
                    header['title'] = props['dc:title'].toHtml[0] + '<br/>' + props['dc:date'].toHtml[0];
                    break;

                // WERK
                case '43':
                    header['title'] = props['dc:title'].toHtml[0];
                    break;

                // MUSIKSTÜCK (Moldenhauer-Nummer)
                case '36':
                    header['title'] = '[M ' + props['webern:mnr'].toHtml[0] + '] ' + props['dc:title'].toHtml[0];
                    break;

                // CHRONOLOGIE
                case '28':
                    // richtext value has already been converted in detail using plugin "convert_lin2html"
                    let htmlstr = props['webern:event_rt'].toHtml[0];

                    // strip & replace <p>-tags for displaying title
                    htmlstr = this.replaceParagraphTags(htmlstr);

                    header['title'] = htmlstr;
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

    private prepareResourceDetailIncomingLinks(incoming: IncomingItemJson[]) {
        let incomingLinks: ResourceDetailIncomingLinks[] = [];
        incoming.forEach(ins => {
            incomingLinks.push({
                id: ins.ext_res_id.id,
                value: ins.value,
                icon: ins.resinfo.restype_iconsrc
            });
        });
        return incomingLinks;
    }

    private prepareResourceDetailProperties(props) {
        let detailProperties: ResourceDetailProps[] = [];

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
    };


    private convertGUISpecificProps(data) {
        // loop through all properties and add toHtml values
        Object.keys(data['props']).forEach((key: string) => {
            const prop = this.addHtmlValues(data['props'][key]);
            data['props'][key] = prop;
        });
        return data;
    };

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
                    this.convertSelectionValue(prop);
                    break; // END selection

                case '12': // HLIST: hlist nodes have to be called seperately
                        this.convertHlistValue(prop);
                    break; // END hlist

                case '14':  // RICHTEXT: salsah standoff needs to be converted
                    for (let i = 0; i < prop.values.length; i++) {
                        prop['toHtml'][i] = this.convertRichtextValue(prop.values[i].utf8str, prop.values[i].textattr);
                    }
                    break; // END richtex

                case '15': // GeoNAMES: GeoName nodes have to called seperately
                        this.convertGeoValue(prop);
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
    private convertGeoValue(prop) {
        // prop.values give reference id to
        // api + /geonames/{{:id}}?reqtype=node
        // result is an array nodelist (properties: id, label, name) with nodes from 0 to n

        // identify geonames gui-id from prop.values
        // e.g. ["4136"] or ["4136", "4132"]
        const geoguiId = prop.values;

        for (let i = 0; i < geoguiId.length; i++) {
            // get geonames gui data
            this.getGeonameNodesById(geoguiId[i]).subscribe(
                (geoData) => {

                    // geo-object
                    let geo = {
                        data:           geoData.nodelist,
                        gnid:           '',
                        label:          '',
                        labelString:    '',
                        latitude:       '',
                        longitude:      '',
                        wiki:           ''
                    };

                    // get labels from nodelist array
                    geo.labelString = geo.data[0].label;
                    for (let j = 1; j < geo.data.length; j++) {
                        geo.labelString += ', ' + geo.data[j].label;
                        if (j === geo.data.length - 1) {
                            // get geonames-id gnid from last array item
                            geo.gnid = geo.data[j].name.replace('gnid:', '');
                            // short label
                            geo.label = geo.data[j].label;
                            // latitude + longitude
                            geo.latitude = geo.data[j].lat;
                            geo.longitude = geo.data[j].lng;
                            // wiki
                            geo.wiki = geo.data[j].wikipedia;
                        }
                    }

                    // include icon & link for geonames
                    const geoIcon = '<img src="assets/img/logo-geonames.png" height="25" width="25" alt="' + geo.label + '" />';
                    const geoLink = '<a href="http://www.geonames.org/' + geo.gnid + '" title="' + geo.labelString + '" target="_blank">' + geoIcon + '</a>';
                    let wikiLink = '';
                    if (geo.wiki) {
                        const wikiIcon = '<img src="assets/img/logo-wiki.svg" height="25" width="25" alt="' + geo.wiki + '" />';
                        wikiLink = '<a href="http://' + geo.wiki + '" title="' + geo.wiki + '" target="_blank">' + wikiIcon + '</a>';
                    }
                    prop['toHtml'][i] = geo.label.replace(geo.label, '$& ' + geoLink + wikiLink);
                });
        }
    }

    /******************************************
     *
     * convert hlist values
     *
     *****************************************/
    private convertHlistValue(prop) {
        // prop.values give reference id to
        // api + /hlists/{{:id}}
        // result is an array hlist (properties: id, label, name, level) with nodes from 0 to n

        // identify id of hlist from prop.attributes
        // e.g. "hlist=17"
        const hlistId: string = prop.attributes.split('=')[1].toString();

        // get hlist data
        return this.getHListNodesById(hlistId).subscribe(
            (hlistData) => {
                let hlist = hlistData.hlist;
                console.info('propvalues: ', prop.values.length , ' HLIST: ', hlist.length);
                // localize id in hlist object and identify the label
                for (let i = 0; i < prop.values.length; i++) {
                    for (let j = 0; j < hlist.length; j++) {
                        if (prop.values[i] === hlist[j]['id']) {
                            prop['toHtml'][i] = hlist[j].label;
                        }
                    }
                }

            },
            err => console.log(err)
        );
    }

    /******************************************
     *
     * convert link values
     *
     *****************************************/
    private convertLinkValue(prop, i: number) {
        // add <a>-tag with click-directive; linktext is stored in "$&"
        return prop.value_firstprops[i].replace(prop.value_firstprops[i], '<a (click)="ref.showDetail(' + prop.values[i] + ')">$& (' + prop.value_restype[i] + ')</a>');
    }

    /******************************************
     *
     * convert richtext values
     *
     *****************************************/
    private convertRichtextValue(str: string, attr: string) {
        // convert salsah standoff to html (using plugin "convert_lin2html")
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
    private convertSelectionValue(prop) {
        // prop.values give reference id to
        // api + /selections/{{:id}}
        // result is an array selection (properties: id, label, name, order, label_ok) with nodes from 0 to n

        // identify id of selection-list from prop.attributes
        // e.g. "selection=66"
        const selectionId: string = prop.attributes.split('=')[1].toString();

        // get selection-list data
        return this.getSelectionNodesById(selectionId).subscribe(
            (selectionData) => {
                let selection = selectionData['selection'];
                // localize id in selection-list object and identify the label
                for (let i = 0; i < prop.values.length; i++) {
                    for (let j = 0; j < selection.length; j++) {
                        if (prop.values[i] === selection[j].id) {
                            prop['toHtml'][i] = selection[j].label;
                        }
                    }
                }
            },
            err => console.log(err)
        );
    }

    /******************************************
     *
     *  convert linear salsah standoff
     *  (string with textattributes)
     *  to html using plugin "convert_lin2html"
     *
     *****************************************/
    private convertStandoffToHTML(str: string, attr: string): string {
        return htmlConverter(JSON.parse(attr), str);
    }

    /******************************************
     *
     * get geonames node list from salsah api
     *
     *****************************************/
    private getGeonameNodesById(geoguiId: string): Observable<any> {
        const queryString: string = '/geonames/' + geoguiId + '?reqtype=node';
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
    private replaceBiblioLink(str: string){

        if (!str) { return; }

        let tmpStr,
            splitStr,
            nameStr,
            linkStr,
            regExLink = /<a (.*?)>(.*?)<\/a>/i; // regexp for links

        // check for double spaces
        str = str.replace('  ', ' ');

        //split "str" behind parentheses
        splitStr = str.split(') ');

        // get name of link from 1st part of "splitstr
        nameStr = splitStr[0].replace('(', '');

        // check for link in 2nd part of "splitstr"
        if (linkStr = regExLink.exec(splitStr[1])) {
            // ... link with <a> tag
            tmpStr = '<a target="_blank" ' + linkStr[1] + '>' + nameStr + '</a>';
        } else if (nameStr != 'DOI') {
            //... <a> tag is missing, add it
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
        let patNum = /\d{4,8}/,    // regexp for object id (4-7 DIGITS)
            patLink = /<a href="(http:\/\/www.salsah.org\/api\/resources\/\d{4,8})" class="salsah-link">(.*?)<\/a>/i, // regexp for salsah links
            p;

        // check only for salsah links
        while (p = patLink.exec(str)) {
            // i.e.: as long as patLink is detected in str do...

            // identify resource id
            let res_id = patNum.exec(p[1])[0];

            // replace href attribute with click-directive
            // linktext is stored in second regexp-result p[2]
            str = str.replace(p[0], '<a (click)="ref.showDetail(' + res_id + '); $event.stopPropagation()">' + p[2] + '</a>');
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

}
