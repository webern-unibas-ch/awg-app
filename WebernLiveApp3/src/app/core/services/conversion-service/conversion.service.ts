import { Injectable } from '@angular/core';
import { ResourceFullResponseJson, SearchResponseJson } from '../../../shared/api-objects';
import { ApiService } from '../api-service/api.service';

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

            // =>Chronologie =>Ereignis: salsah standoff needs to be converted before displaying
            // valuetype_id 14 = valuelabel 'Ereignis'
            if (res.valuetype_id[0] == '14') {
                let htmlstr: string = this.convertStandoffToHTML(res.value[0]['utf8str'], res.value[0]['textattr']);

                // replace salsah links
                htmlstr = this.replaceSalsahLink(htmlstr);

                // strip & replace <p>-tags for displaying objtitle
                htmlstr = htmlstr.replace(/<\/p><p>/g, '<br />');
                htmlstr = htmlstr.replace(/<p>|<\/p>/g, '');
                htmlstr = htmlstr.replace(htmlstr, '«$&»');
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
                        if (prop.values.length > 0 && prop.values[0].utf8str !== '')
                        {
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
            str = str.replace(p[0], '<a (click)="showObject(' + res_id + ')">' + p[2] + '</a>');
        } //END while

        return str;
    }

}
