import { ResourceFullResponseJson } from '@awg-shared/api-objects';

/**
 * The ResourceDetailHeader class.
 *
 * It is used in the context of the resource detail view
 * to store the data for the resource detail header.
 */
export class ResourceDetailHeader {
    /**
     * The object id of the resource.
     */
    objID: string;

    /**
     * The icon for the type of object of the resource.
     */
    icon: string;

    /**
     * The type of the resource.
     */
    type: string;

    /**
     * The title of the resource.
     */
    title: string;

    /**
     * The last modification date of the resource.
     */
    lastmod: string;

    /**
     * Private static method: replaceParagraphTags.
     *
     * It replaces paragraph tags with break lines
     * in a resource's rich text area (here: title).
     */
    private static replaceParagraphTags(str: string): string {
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
     * Constructor of the ResourceDetailHeader class.
     *
     * It initializes the class with values from a
     * given ResourceFullResponseJson and the id
     * of the current resource.
     *
     * @param {ResourceFullResponseJson} data The given ResourceFullResponseJson.
     * @param {string} currentId The given id of the current resource.
     */
    constructor(data: ResourceFullResponseJson, currentId: string) {
        // Init values
        this.objID = '---';
        this.icon = '---';
        this.type = '---';
        this.lastmod = '---';
        this.title = '---';

        // Shortcuts
        const info = data.resinfo;
        const props = data.props;

        // Header for accessible objects
        if (typeof info !== 'undefined') {
            const id = data.resdata.res_id;
            if (id !== currentId) {
                console.error(
                    'ERROR: ' +
                        'ResourceDetailHeader => ' +
                        `currentId ${currentId} not matching data.resdata.res_id ${id}`
                );
                return;
            }

            // Extract common default metadata for header
            this.objID = id;
            this.icon = info.restype_iconsrc;
            this.type = info.restype_label;
            this.lastmod = info.lastmod;

            // Extract restype specific title for header
            switch (info.restype_id) {
                // CHRONOLOGIE
                case '28':
                    // Richtext value has already been converted in detail using plugin "htmlConverter"
                    let htmlstr = props['webern:event_rt'].toHtml[0];

                    // Strip & replace <p>-tags for displaying title
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
                    const lname: string = props['salsah:lastname'].toHtml[0];
                    const fname: string = props['salsah:firstname'].toHtml[0];
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
            // Header for undefined & restricted object
            this.objID = currentId;
            this.icon = 'https://www.salsah.org/app/icons/16x16/delete.png';
        }

        // Additional header for restricted objects
        if (data.access === 'NO_ACCESS') {
            this.type = 'restricted';
            this.title = 'Kein Zugriff auf dieses Objekt möglich';
        }
    }
}
