import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from '../../core/services/api-service/api.service';
import { ResourceFullResponseJson, SearchResponseJson } from '../../shared/api-objects';
import {forEach} from "@angular/router/src/utils/collection";

@Injectable()
export class SearchService extends ApiService {

    private projectId: string = '6';

    // ################################
    //
    //  fulltextSearch via salsah api
    //
    // ################################
    public getFulltextSearchData(searchString: string): Observable<SearchResponseJson> {
        let queryString: string = '/search/' + searchString;
        let params = new URLSearchParams();
            params.set('searchtype', 'fulltext');
            params.set('filter_by_project', this.projectId);
        return this.httpGet(queryString, { search: params });
    }

    // ################################
    //
    //  resource detail search via salsah api
    //
    // ################################
    public getSearchDetailData(id: string): Observable<ResourceFullResponseJson> {
        let queryString: string = '/resources/' + id + '_-_local';
        /*let params = new URLSearchParams();
        params.set('restype', 'info');
        params.set('reqtype', 'context');
        */
        return this.httpGet(queryString /*, { search: params } */);
    }

    public prepareRestrictedObject(id) {
        console.log('No access');
        let detail = {'header': {}, 'image': [], 'props': [], 'incoming': []};
        detail['incoming'] = null;
        detail['header'] = {
            'objID': id,
            'icon': 'http://www.salsah.org/app/icons/16x16/delete.png',
            'type': 'restricted',
            'title': 'Kein Zugriff auf dieses Objekt möglich',
            'lastmod': '---'
        };
    }

    public prepareAccessObject(id, data: ResourceFullResponseJson) {
        // TODO: SearchResultDetail (model)
        // let detail: SearchResultDetail = new SearchResultDetail;
        let detail = {'header': {}, 'image': [], 'props': [], 'incoming': []};
        detail['incoming'] = this.prepareIncomingObjects(data);
        console.log(detail);
        this.prepareSearchObject(id, data, detail);
        console.log(detail);
    }

    private prepareIncomingObjects(data: ResourceFullResponseJson) {
        let incoming = [];
        data.incoming.forEach(ins => {
            incoming.push({
                id: ins.ext_res_id.id,
                value: ins.value,
                icon: ins.resinfo.restype_iconsrc
            });
        });
        return incoming;
    }

    private prepareSearchObject(id, data, detail) {
        const url = 'www.salsah.org';
        let props = data.props;
        let info = data.resinfo;
        this.prepareObjectProperties(url, props, detail);
        this.prepareObjectHeader(id, info, props, detail);
    }

    private prepareObjectProperties(url, props, detail) {};

    private prepareObjectHeader(id, info, props, detail) {
        switch (info.restype_id) {
            // PERSON
            case '45':
                let lname = props['salsah:lastname'].values[0],
                    fname = props['salsah:firstname'].values[0];
                detail['header'] = {
                    'objID': id,
                    'icon': info.restype_iconsrc,
                    'type': info.restype_label,
                    'title': fname + ' ' + lname,
                    'lastmod': info.lastmod
                };
                break;

            // KORRESPONDENZ
            case '29':
                detail['header'] = {
                    'objID': id,
                    'icon': info.restype_iconsrc,
                    'type': info.restype_label,
                    'title': props['dc:title'].values[0] + "<br/>" + props['dc:date'].values[0],
                    'lastmod': info.lastmod
                };
                break;

            // SUPPLEMENT
            case '125':
                detail['header'] = {
                    'objID': id,
                    'icon': info.restype_iconsrc,
                    'type': info.restype_label,
                    'title': props['dc:title'].values[0] + "<br/>" + props['dc:date'].values[0],
                    'lastmod': info.lastmod
                };
                break;

            // WERK
            case '43':
                detail['header'] = {
                    'objID': id,
                    'icon': info.restype_iconsrc,
                    'type': info.restype_label,
                    'title': props['dc:title'].values[0],
                    'lastmod': info.lastmod
                }
                break;

            // MUSIKSTÜCK (Moldenhauer-Nummer)
            case '36':
                detail['header'] = {
                    'objID': id,
                    'icon': info.restype_iconsrc,
                    'type': info.restype_label,
                    'title': '[M ' + props['webern:mnr'].values[0] + '] ' + props['dc:title'].values[0],
                    'lastmod': info.lastmod
                };
                break;

            // CHRONOLOGIE
            case '28':
                let htmlstr = '';

                // RICHTEXT VALUE HAS ALREADY BEEN CONVERTED IN TMP USING PLUGIN "convert_lin2html"
                htmlstr = detail.props[0].value[0];

                // STRIP & REPLACE <p>-TAGS FOR DISPLAYING OBJTITLE
                htmlstr = htmlstr.replace(/<\/p><p>/g, '<br />');
                htmlstr = htmlstr.replace(/<p>|<\/p>/g, '');
                htmlstr = htmlstr.replace(htmlstr, '«$&»');
                detail['header'] = {
                    'objID': id,
                    'icon': info.restype_iconsrc,
                    'type': info.restype_label,
                    'title': htmlstr,
                    'lastmod': info.lastmod
                };
                break;

            default:
                detail['header'] = {
                    'objID': id,
                    'icon': typeof info !== undefined ? info.restype_iconsrc :  'http://www.salsah.org/app/icons/16x16/delete.png',
                    'type': typeof info !== undefined ? info.restype_label : '---',
                    'title': typeof info !== undefined ? info.restype_description : '---',
                    'lastmod': typeof info !== undefined ? info.lastmod : '---'
                };
        }
    }
}
