import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../core/services/api-service/api.service';
import { ResourceFullResponseJson, SearchResponseJson } from '../../../../shared/api-objects';

@Injectable()
export class BibliographyService extends ApiService {

    private projectId: string = '6';
    private resTypeId: string = '126';    // test-01: 127

    // ################################
    //
    //  get bibliography via salsah api
    //
    // ################################
    getBibliographyList(): Observable<SearchResponseJson> {
        let queryString: string = '/search/';
        let params = new URLSearchParams();
        params.set('searchtype', 'extended');
        params.set('filter_by_project', this.projectId);
        params.set('filter_by_restype', this.resTypeId);
        return this.httpGet(queryString, { search: params });
    }

    getBibliographyItems(idArray: Array<string>): Observable<any> {
        let observableItemsBatch = [];
        idArray.forEach((id: string) => {
            observableItemsBatch.push( this.getBibliographyItemDetail(id));
        });
        return Observable.forkJoin(observableItemsBatch);
    }


    getBibliographyItemDetail(obj_id: string): Observable<ResourceFullResponseJson> {
        let queryString: string = '/resources/' + obj_id;
        return this.httpGet(queryString);
    }

/*
    convertResolvedPromises(response, data){
    // converts the resolved promise

        // init
        let resolvedBiblObjectPromise = [],
            // resolving SelectionListPromise
            resolvedSelectionListPromise = response[0];

        // resolving BiblObjectPromiseArray
        response[1].forEach((res) => {
            resolvedBiblObjectPromise.push(res.data);
        });

        // convert properties of resolved BiblObjectPromise
        resolvedBiblObjectPromise.forEach((res) => {
            data.push(this.convertObjectProperties(res, resolvedSelectionListPromise));         // push converted properties object into Array a
        });
    }



    // convert object properties for displaying
    convertObjectProperties(data, selectionObj) {

        let conv_obj = {};

        data['props'].forEach((prop) => {
            let propValue = [''];

            // check if values property is defined
            if ('values' in prop)
            {

                //check for gui-elements
                switch (prop.valuetype_id)
                {
                    case '4':
                        // DATE: salsah object needs to be converted (using plugin "convert_jul2greg.js")

                        prop.values[0] = convert_date(prop.values[0]);
                        propValue[0] = prop.values[0].replace(' (G)', '');
                        break; //END date

                    case '7':
                        // SELECTION PULLDOWN: selection nodes have to be read seperately

                        if (prop.values[0] !== '')
                        {
                            // identify id of selection-list from prop.attributes
                            // e.g. "selection=66"
                            let q = prop.attributes.split("=")[1].toString();

                            if (selectionObj[q])
                            {
                                //console.log('Hurray: selection' + q);
                                // localize id in selection-list object and identify the label
                                for (let i = 0; i < selectionObj[q].length; i++) {
                                    if (prop.values[0] == selectionObj[q][i].id) {
                                        propValue[0] = selectionObj[q][i].label;
                                    }
                                }
                            } else
                            {
                                console.log('NOPE:  selection' + q);
                                //TODO
                                // loadSelection(q).then(function(response){
                                //     console.log('got new selection:');
                                //     console.log(response.data.selection);
                                //     selectionObj[q] = response.data.selection;
                                //     console.log(selectionObj);
                                // })
                            }
                        } else
                        {
                            // empty value
                            propValue[0] = '';
                        };
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
                                htmlstr = awgFactory.convert(prop.values[i].utf8str, prop.values[i].textattr);

                                // replace salsah links & <p>-tags
                                htmlstr = awgFactory.replaceSalsahLink(htmlstr);
                                htmlstr = htmlstr.replace('<p>', '').replace('</p>', '');

                                // trim string
                                propValue[i] = htmlstr.trim();

                                // replace bibliography links
                                if (prop.label == 'Online-Zugang') {
                                    propValue[i] = awgFactory.replaceBiblioLink(propValue[i]);
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
                            for (var i = 0; i < prop.values.length; i++)
                            {
                                propValue[i] = prop.values[i].trim();
                            }
                        } else {
                            // empty text value
                            propValue[0] = '';
                        }
                } // END switch

                if (propValue.length > 1) {
                    conv_obj[prop.label] = propValue; // => array
                } else if (propValue.length === 1) {
                    conv_obj[prop.label] = propValue[0]; // => string
                }

            } // END if value

            // add lastmod state
            conv_obj['lastmod'] = data['resinfo']['lastmod'];

            // extract publication year from publication date
            let splitDate;
            if (splitDate = conv_obj['Publikationsdatum']) {
                let s = splitDate.split(' ');
                conv_obj['Jahr'] = s[s.length-1];
            }
        }); // END forEach PROPS

        return conv_obj;
    } // END convertObjectProperties (func)

*/
}
