import { ResourceFullResponseJson } from '@awg-shared/api-objects';

export class ResourceDetailHeader {
    objID: string;
    icon: string;
    type: string;
    title: string;
    lastmod: string;

    /******************************************
     *
     * replace paragraph tags
     *
     *****************************************/
    private static replaceParagraphTags(str: string): string {
        if (!str) { return; }
        str = str.replace(/<\/p><p>/g, '<br />').replace(/<p>|<\/p>/g, '').replace(str, '«$&»');
        return str;
    }

    constructor(data: ResourceFullResponseJson, currentId: string) {
        // init values
        this.objID = '---';
        this.icon = '---';
        this.type = '---';
        this.lastmod = '---';
        this.title = '---';

        // shortcuts
        const info = data.resinfo;
        const props = data.props;

        // header for accessible objects
        if (typeof info !== 'undefined') {
            const id = data.resdata.res_id;
            if (id !== currentId ) {
                console.error(`ERROR: ` +
                    `ResourceDetailHeader => ` +
                    `currentId ${currentId} not matching data.resdata.res_id ${id}`);
                return;
            }

            // extract common default metadata for header
            this.objID = id;
            this.icon = info.restype_iconsrc;
            this.type = info.restype_label;
            this.lastmod = info.lastmod;

            // extract restype specific title for header
            switch (info.restype_id) {
                // CHRONOLOGIE
                case '28':
                    // richtext value has already been converted in detail using plugin "htmlConverter"
                    let htmlstr = props['webern:event_rt'].toHtml[0];

                    // strip & replace <p>-tags for displaying title
                    htmlstr = ResourceDetailHeader.replaceParagraphTags(htmlstr);

                    this.title = htmlstr;
                    break;

                // KORRESPONDENZ (same as SUPPLEMENT)
                case '29':
                // SUPPLEMENT
                case '125':
                    this.title = props['dc:title'].toHtml[0] + '<br/>' + props['dc:date'].toHtml[0];
                    break;

                // MUSIKSTÜCK (Moldenhauer-Nummer)
                case '36':
                    this.title = '[M ' + props['webern:mnr'].toHtml[0] + '] ' + props['dc:title'].toHtml[0];
                    break;

                // WERK
                case '43':
                    this.title = props['dc:title'].toHtml[0];
                    break;

                // PERSON
                case '45':
                    const lname: string = props['salsah:lastname'].toHtml[0],
                        fname: string = props['salsah:firstname'].toHtml[0];
                    this.title = fname + ' ' + lname;
                    break;

                // BIBLIOGRAPHIE
                case '126':
                    this.title = props['webern:bibl_title_short'].toHtml[0];
                    break;

                // DEFAULT
                default:
                    this.title = info.restype_description;

            }
        } else {
            // header for undefined & restricted object
            this.objID = currentId;
            this.icon = 'http://www.salsah.org/app/icons/16x16/delete.png';
        }

        // additional header for restricted objects
        if (data.access === 'NO_ACCESS' ) {
            this.type = 'restricted';
            this.title = 'Kein Zugriff auf dieses Objekt möglich';
        }
    }
}

