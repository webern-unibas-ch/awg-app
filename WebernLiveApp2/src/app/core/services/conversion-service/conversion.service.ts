import { Injectable } from '@angular/core';

import { ApiService } from '../api-service/api.service';
import { ResourceFullResponseJson, SearchResponseJson } from '../../../shared/api-objects';

import {
    SearchDetail,
    SearchDetailHeaderForDisplay,
    SearchDetailIncomingLinksForDisplay,
    SearchDetailPropsForDisplay
} from '../../../views/search-view/search-models';

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
                htmlstr = htmlstr.replace(/<\/p><p>/g, '<br />').replace(/<p>|<\/p>/g, '').replace(htmlstr, '«$&»');
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
            let prop = data['props'][key];
            let propValue:[string] = [''];

            // check if values property is defined
            if ('values' in prop) {
                //check for gui-elements
                switch (prop.valuetype_id) {
                    case '4':
                        // DATE: salsah object needs to be converted (using plugin "dateConverter")
                        if (prop.values[0] !== '') {
                            propValue[0] = this.convertDate(prop.values[0]);
                        }
                        break; //END date

                    case '7':
                        // SELECTION PULLDOWN: selection nodes have to be read seperately
                        if (prop.values[0] !== '') {
                            // identify id of selection-list from prop.attributes
                            // e.g. "selection=66"
                            let selectionId: string = prop.attributes.split("=")[1].toString();

                            // get selection from salsah api
                            this.getSelectionsById(selectionId).subscribe(
                                (data: Object) => {
                                    let selectionArr = data['selection'];
                                    // localize id in selection-list object and identify the label
                                    for (let i = 0; i < selectionArr.length; i++) {
                                        if (prop.values[0] == selectionArr[i].id) {
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
                        //TODO: doesn't work yet
                        console.log('convService#selectionOuterLoop: ', propValue[0]);
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
                                if (prop.label == 'Online-Zugang') {
                                    propValue[i] = this.replaceBiblioLink(propValue[i]);
                                }
                            }

                            // empty values
                        } else {
                            propValue[0] = '';
                        };
                        break; // END richtext

                    default: // '1'=> TEXT: properties come as they are
                        if (prop.values[0] !== '')
                        {
                            for (let i = 0; i < prop.values.length; i++)
                            {
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
        // TODO#rm
        // console.log('convObj: ', convObj );

        return convObj;
    } // END convertObjectProperties (func)


    /******************************************
     *
     * convert date objects
     *
     *****************************************/
    private convertDate(dateObj) {
        let date = dateConverter(dateObj);
        date = date.replace(' (G)', '');
        return date;
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
     * get selection list object
     * from salsah api
     *
     *****************************************/
    private getSelectionsById(selectionId: string): any {
        let queryString: string = '/selections/' + selectionId;
        return this.httpGet(queryString);
    }


    /******************************************
     *
     *  find inner links in online-access-property
     *  and rebuild the values for displaying
     *
     *****************************************/
    private replaceBiblioLink(str: string){
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
        // TODO: add type
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
            str = str.replace(p[0], '<a (click)="ref.showObject(' + res_id + '); $event.stopPropagation()">' + p[2] + '</a>');
        } //END while

        return str;
    }


    public prepareRestrictedObject(id) {
        console.log('No access to resource: ', id);
        let detail: SearchDetail = new SearchDetail();
        detail['header'] = {
            'objID': id,
            'icon': 'http://www.salsah.org/app/icons/16x16/delete.png',
            'type': 'restricted',
            'title': 'Kein Zugriff auf dieses Objekt möglich',
            'lastmod': '---'
        };
    }

    public prepareAccessObject(id, data: ResourceFullResponseJson) {
        let detail: SearchDetail = new SearchDetail();
        const url = 'www.salsah.org';
        let props = data.props;
        let info = data.resinfo;

        detail['incoming'] = this.prepareSearchDetailIncomingLinks(data);
        detail['props'] = this.prepareSearchDetailProperties(url, data);
        detail['header'] = this.prepareSearchDetailHeader(id, info, props, detail);
        console.log('preparedDetail: ', detail);
    }

    private prepareSearchDetailIncomingLinks(data: ResourceFullResponseJson) {
        let incomingLinks: SearchDetailIncomingLinksForDisplay[] = [];
        data.incoming.forEach(ins => {
            incomingLinks.push({
                id: ins.ext_res_id.id,
                value: ins.value,
                icon: ins.resinfo.restype_iconsrc
            });
        });
        return incomingLinks;
    }

    private prepareSearchDetailProperties(url, data) {
        let searchDetailProperties: SearchDetailPropsForDisplay[] = [];

        // loop through property keys
        Object.keys(data['props']).forEach((key: string) => {
            const prop: any = data['props'][key];

            // clean value labels
            if (prop.label) {
                prop.label = prop.label.replace(' (Richtext)', '');
            }

            // push default values into searchDetailProperties
            searchDetailProperties.push({
                pid: prop.pid,
                guielement: prop.guielement,
                label: prop.label,
                value: ['']
            });

            // check if values property is defined
            if ('values' in prop) {
                let convertedPropValue: string[] = [];
                convertedPropValue = this.convertGUISpecificValues(url, prop);
                // push convertedPropValue into searchDetailProperties
                searchDetailProperties['value'] = convertedPropValue;
            }
        }); // END forEach props
        return searchDetailProperties;
    };

    private prepareSearchDetailHeader(id, info, props, detail) {
        let header: SearchDetailHeaderForDisplay = new SearchDetailHeaderForDisplay();
        if (typeof info !== undefined) {
            header['objID'] = id;
            header['icon'] = info.restype_iconscrs;
            header['type'] = info.restype_label;
            header['lastmod'] = info.lastmod;

            switch (info.restype_id) {
                // PERSON
                case '45':
                    const lname: string = props['salsah:lastname'].values[0],
                        fname: string = props['salsah:firstname'].values[0];
                    header['title'] = fname + ' ' + lname;
                    break;

                // KORRESPONDENZ (same as SUPPLEMENT)
                case '29':
                // SUPPLEMENT
                case '125':
                    header['title'] = props['dc:title'].values[0] + '<br/>' + props['dc:date'].values[0];
                    break;

                // WERK
                case '43':
                    header['title'] = props['dc:title'].values[0];
                    break;

                // MUSIKSTÜCK (Moldenhauer-Nummer)
                case '36':
                    header['title'] = '[M ' + props['webern:mnr'].values[0] + '] ' + props['dc:title'].values[0];
                    break;

                // CHRONOLOGIE
                case '28':
                    let htmlstr: string = '';

                    // richtext value has already been converted in detail using plugin "convert_lin2html"
                    htmlstr = detail.props[0].value[0];

                    // strip & replace <p>-tags for displaying title
                    htmlstr = htmlstr.replace(/<\/p><p>/g, '<br />').replace(/<p>|<\/p>/g, '').replace(htmlstr, '«$&»');

                    header['title'] = htmlstr;
                    break;

                // DEFAULT
                default:
                    header['title'] = info.restype_description;

            }
        } else {
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

    private convertGUISpecificValues(url, prop): [string] {
        let propValue: [string] = [''];

        switch (prop.valuetype_id) {
            // DATE: salsah object needs to be converted (using plugin "dateConverter")
            case '4':
                if (prop.values[0] !== '') {
                    prop.values[0] = this.convertDate(prop.values[0]);
                    // TODO: rm? if generic
                    propValue[0] = prop.values[0];
                } else {
                    console.log('empty dateValue:::: ', prop);
                }
                break; // END date

            // LINKVALUE (ResourcePointer): linkage to another salsah object needs to be converted
            case '6':
                if (prop.values.length > 0) {
                    for (let i = 0; i < prop.values.length; i++){
                        // add <p> & <a> with click-directive
                        // linktext is stored in "$&"
                        propValue[0] += prop.value_firstprops[i].replace(prop.value_firstprops[i], '<p><a (click)="ref.showObject(' + prop.values[i] + ')">$& (' + prop.value_restype[i] + ')<a/></p>');
                    } // END for
                } else {
                    console.log('empty linkValue:::: ', prop);
                }
                break; // END linkvalue

                // TODO: continue for other cases
            /*
            case '7': // SELECTION PULLDOWN: SELECTION NODES HAVE TO BE READ SEPERATLY
                if (prop.values[0] !== '') {

                    //IDENTIFY ID OF SELECTION-LIST FROM prop.attributes
                    //e.g. "selection=66"
                    var q = prop.attributes.split("=");

                    //GET SELECTION-LIST DATA
                    $http.get(url + '/api/selections/' + q[1]).then(function (response){
                        var selection = response.data.selection;

                        //LOCALIZE ID IN SELECTION-LIST AND IDENTIFY THE LABEL
                        for (var i = 0; i < selection.length; i++) {
                            if (selection[i].id == prop.values[0]) propValue[0] = selection[i].label;
                        }
                        return propValue[0];
                    });
                } else {
                    // EMPTY VALUE
                    propValue[0] = '';
                };
                break; // END selection

            case '12': // HLIST: HLIST NODES HAVE TO BE CALLED SEPERATLY
                if (prop.values[0] !== '') {
                    //VALUES[0] gives reference id to
                    // url + /api/hlists/{{:id}}?reqtype=node
                    //result is an array nodelist (properties: id, label, name) with nodes from 0 to n

                    //IDENTIFY HLIST ID FROM prop.values
                    //e.g. ["4128"] or ["4128", "4130"]
                    var hlist_id = prop.values;

                    for (var i = 0; i < hlist_id.length; i++) {
                        //GET HLIST DATA
                        $http.get(url + '/api/hlists/' + hlist_id[i] + '?reqtype=node').then(function (response){
                            var hlist = response.data.nodelist;

                            //GET LABELS FROM NODELIST ARRAY
                            var hlist_string = hlist[0].label;
                            for (var j = 1; j < hlist.length; j++) {
                                hlist_string += ' > ' + hlist[j].label;
                                if (j == hlist.length-1) {
                                    //SHORT LABEL
                                    hlist_label = hlist[j].label;
                                };
                            };

                            // WRAP hlist_string WITH <p>-TAGS
                            hlist_string = hlist_string.replace(hlist_string, '<p>$&</p>');

                            propValue[0] += hlist_string;
                        });
                    };
                } else {
                    // EMPTY VALUE
                    propValue[0] = '';
                };
                break; // END hlist
*/
            // RICHTEXT: salsah standoff needs to be converted
            case '14':
                // check for not empty values
                if (prop.values.length > 0 && prop.values[0].utf8str !== '') {
                    for (let i = 0; i < prop.values.length; i++) {
                        let htmlstr: string = '';

                        // convert linear salsah standoff to html (using plugin "convert_lin2html")
                        htmlstr = this.convertStandoffToHTML(prop.values[i].utf8str, prop.values[i].textattr);

                        // replace salsah links & <p>-tags
                        htmlstr = this.replaceSalsahLink(htmlstr);

                        // check if <p>-tags not exist (indexOf -1), then add them & concat string to propValue[0]
                        propValue[0] += (htmlstr.indexOf('<p>') === -1) ? htmlstr.replace(htmlstr, '<p>$&</p>') :
                            htmlstr;
                    }
                // empty values
                } else {
                    propValue[0] = '';
                }
                break; // END richtext
/*
            case '15': // GeoNAMES: GeoName nodes have to be converted
                if (prop.values[0] !== '') {
                    // values[0] gives reference id to
                    // url + /api/geonames/{{:id}}?reqtype=node
                    // result is an array nodelist (properties: id, label, name) with nodes from 0 to n

                    // identify geonames gui-id from prop.values
                    // e.g. ["4136"] or ["4136", "4132"]
                    let geogui_id = prop.values;

                    for (let i = 0; i < geogui_id.length; i++) {
                        // get geonames gui data
                        $http.get(url + '/api/geonames/' + geogui_id[i] + '?reqtype=node').then(function (response){

                            // geo-object
                            let geo = {
                                data:           [],
                                label:          '',
                                label_string:   '',
                                label_url:      '',
                                gnid:           ''
                            };
                            geo.data = response.data.nodelist;

                            // get labels from nodelist array
                            geo.label_string = geo.data[0].label;
                            for (let j = 1; j < geo.data.length; j++) {
                                geo.label_string += ', ' + geo.data[j].label;
                                if (j == geo.data.length-1) {
                                    // get geonames-id gnid from last array item
                                    geo.gnid = geo.data[j].name.replace('gnid:', '');
                                    // short label
                                    geo.label = geo.data[j].label;
                                }
                            }

                            // include geonames icon & url to gnid, embedded in <p>-tags
                            geo.label_url = geo.label.replace(geo.label, '<p>$& <a href="http://www.geonames.org/' + geo.gnid + '" title="' + geo.label_string + '" target="_blank"><img src="img/geonames.png" height="25" width="25" alt="' + geo.label + '" /></a></p>')

                            propValue[0] += geo.label_url;
                        });
                    };
                } else {
                    // EMPTY VALUE
                    propValue[0] = '';
                };
                break; // END geonames
 */
            // '1' => TEXT: properties come as they are
            default:
                // empty value
                propValue[0] = '';
                if (prop.values[0] !== '') {
                    for (let i = 0; i < prop.values.length; i++) {
                        propValue[i] = prop.values[i];
                    }
                } // END default
        } // END switch

        console.log('propValue: ', propValue);

        return prop;
    }

}
