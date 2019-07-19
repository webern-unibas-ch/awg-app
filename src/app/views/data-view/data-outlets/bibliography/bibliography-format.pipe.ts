import { Pipe, PipeTransform } from '@angular/core';

import { BibEntry } from './bibliography-entry.model';

/**
 * The bibliography format pipe.
 *
 * It converts a {@link BibEntry} input into a formatted `BibEntry`.
 *
 * __Usage :__
 *   `{{ bibEntry | bibFormat }}`
 */
@Pipe({
    name: 'bibFormat'
})
export class BibliographyFormatPipe implements PipeTransform {
    /**
     * Private variable: entry.
     *
     * It keeps the input BibEntry.
     */
    private entry: BibEntry;

    /**
     * Private variable: formattedEntry.
     *
     * It keeps the formatted BibEntry.
     */
    private formattedEntry: BibEntry;

    /**
     * Private array: formatFieldArr.
     *
     * It keeps the fields to be formatted.
     */
    private formatFieldArr: Array<string> = [
        'Author',
        'Titel_unselbst',
        'Titel_selbst',
        'Herausgeber',
        'unpubliziert',
        'Verlagsort',
        'Publikationsdatum',
        'Reihentitel',
        'Seitenangabe'
    ];

    /**
     * Transform method of the BibliographyFormatPipe.
     *
     * @param {BibEntry} bibItem The input BibEntry to be piped.
     *
     * @returns {*} The formatted BibEntry.
     */
    transform(bibItem: BibEntry): any {
        if (!bibItem) {
            return null;
        }
        this.entry = bibItem;
        this.formattedEntry = this.getFormatFields('edit', this.entry);
        this.getFormattedValues(this.formattedEntry);

        return this.getFormatFields('output', this.formattedEntry);
    }

    /**
     * Private function: getFormatFields.
     *
     * It gets the fields to be formatted from {@link formatFieldArr}.
     *
     * @param {string} opt Options to be set: `output` or `edit`
     * @param {BibEntry} entry The input BibEntry.
     *
     * @returns {*}
     */
    private getFormatFields(opt: string, entry: BibEntry): any {
        let output: string | object = {};
        for (let i = 0; i < this.formatFieldArr.length; i++) {
            if (entry[this.formatFieldArr[i]]) {
                if (opt === 'edit') {
                    output[this.formatFieldArr[i]] = entry[this.formatFieldArr[i]];
                } else if (opt === 'output') {
                    output = i === 0 ? entry[this.formatFieldArr[i]] : output + entry[this.formatFieldArr[i]];
                }
            }
        }
        return output;
    }

    /**
     * Private function: getFormattedValues.
     *
     * It separates the BibEntries object key-value pairs
     * by their keys and requests them to be converted.
     *
     * @param {BibEntry} entry The input BibEntry.
     *
     * @returns {*}
     */
    private getFormattedValues(entry: BibEntry): any {
        Object.keys(entry).forEach(key => {
            entry[key] = this.getFormattedValueByKey(entry, key);
        });
        return entry;
    }

    /**
     * Private function: getFormattedValueByKey.
     *
     * It requests the designated conversion
     * methods for the values of the BibEntry.
     *
     * @param {BibEntry} entry The input BibEntry.
     * @param {string} key The key of a BibEntry key-value pair.
     *
     * @returns {string}
     */
    private getFormattedValueByKey(entry: BibEntry, key: string): string {
        let value = '';
        switch (key) {
            case 'Kurztitel':
                value = this.formatBibTitleShort(entry[key]);
                break;
            case 'Author':
                value = this.formatBibAuthor(entry[key]);
                break;
            case 'Titel_selbst':
                value = this.formatBibTitleIndep(entry[key]);
                break;
            case 'Titel_unselbst':
                value = this.formatBibTitleDep(entry[key]);
                break;
            case 'Herausgeber':
                value = this.formatBibEditor(entry[key]);
                break;
            case 'unpubliziert':
                value = this.formatBibUnpublished(entry[key]);
                break;
            case 'Verlagsort':
                value = this.formatBibPubPlace(entry[key]);
                break;
            /* done in pubplace
             case 'publisher':
             value = this.formatBibPublisher(bibItem[key]);
             break;
             */
            case 'Publikationsdatum':
                value = this.formatBibPubDate(entry[key]);
                break;
            case 'Reihentitel':
                value = this.formatBibTitleSeries(entry[key]);
                break;
            case 'Seitenangabe':
                value = this.formatBibPages(entry[key]);
                break;
            default:
                value = entry[key];
        }
        return value;
    }

    /**
     * Private function: formatBibTitleShort.
     *
     * It converts the short title of the BibEntry.
     *
     * @param {string} shortTitle The short title of the BibEntry.
     *
     * @returns {string} The formatted short title.
     */
    private formatBibTitleShort(shortTitle: string): string {
        return !shortTitle ? '' : shortTitle + ' | ';
    }

    /**
     * Private function: formatBibAuthor.
     *
     * It converts the author(s) of the BibEntry.
     *
     * @param {string} authors The author(s) of the BibEntry.
     *
     * @returns {string} The formatted author(s).
     */
    private formatBibAuthor(authors: string | object): string {
        if (!authors) {
            return '';
        }

        let formattedAuthor = '';
        if (typeof authors === 'object') {
            // get first author name
            formattedAuthor += this.splitName(authors[0], '');
            // get further author names
            const l: number = Object.keys(authors).length;
            for (let i = 1; i < l; i++) {
                // last name seperated by "und", others by comma
                const divider = i === l - 1 ? ' und ' : ', ';
                formattedAuthor += this.splitName(authors[i], divider);
            }
        } else if (typeof authors === 'string') {
            // get author name
            formattedAuthor += this.splitName(authors, '');
        }
        formattedAuthor += ': '; // ending author string with ":"
        return formattedAuthor;
    }

    /**
     * Private function: formatBibTitleIndep.
     *
     * It converts the independent title(s) of the BibEntry.
     *
     * @param {string} indepTitle The independent title(s) of the BibEntry.
     *
     * @returns {string} The formatted independent title(s).
     */
    private formatBibTitleIndep(indepTitle: string): string {
        return !indepTitle ? '' : this.entry['Typ'] !== 'Zeitschriftenartikel' ? indepTitle + ', ' : indepTitle;
    }

    /**
     * Private function: formatBibTitleDep.
     *
     * It converts the dependent title(s) of the BibEntry.
     *
     * @param {string} depTitle The dependent title(s) of the BibEntry.
     *
     * @returns {string} The formatted dependent title(s).
     */
    private formatBibTitleDep(depTitle: string): string {
        return !depTitle ? '' : '„' + depTitle + '“, in: ';
    }

    /**
     * Private function: formatBibEditor.
     *
     * It converts the editor(s) of the BibEntry.
     *
     * @param {string} editors The editor(s) of the BibEntry.
     *
     * @returns {string} The formatted editor(s).
     */
    private formatBibEditor(editors: string | object): string {
        if (!editors) {
            return '';
        }

        let formattedEditor = 'hg. von ';
        if (typeof editors === 'object') {
            // get first editor name
            formattedEditor += this.splitName(editors[0], '');
            // get further editor names
            const l: number = Object.keys(editors).length;
            for (let i = 1; i < l; i++) {
                // last name separated by "und", others by comma
                const divider = i === l - 1 ? ' und ' : ', ';
                formattedEditor += this.splitName(editors[i], divider);
            }
        } else if (typeof editors === 'string') {
            // get editor name
            formattedEditor += this.splitName(editors, '');
        }
        formattedEditor += ', '; // ending editor string with ","
        return formattedEditor;
    }

    /**
     * Private function: formatBibUnpublished.
     *
     * It converts the unpublished literature type (if any) of the BibEntry.
     *
     * @param {string} unpub The unpublished literature type of the BibEntry.
     *
     * @returns {string} The formatted unpublished literature type.
     */
    private formatBibUnpublished(unpub: string): string {
        return !unpub ? '' : unpub + ' ';
    }

    /**
     * Private function: formatBibPubPlace.
     *
     * It converts the publication place and publisher of the BibEntry.
     *
     * @param {string} pubPlace The publication place of the BibEntry.
     *
     * @returns {string} The formatted publication place and publisher.
     */
    private formatBibPubPlace(pubPlace: string | object): string {
        const pub = this.entry['Verlag'] ? this.entry['Verlag'] : null;
        if (!pubPlace) {
            // no place but publisher
            if (pub) {
                console.log('Ort fehlt: "' + pub + '" (' + this.entry['Kurztitel'] + ')');
            }
            // no place nor publisher ("zeitschriftenartikel")
            return '';
        }

        let out = '';
        // pubPlace == object
        if (typeof pubPlace === 'object') {
            const locl = Object.keys(pubPlace).length;
            if (pub) {
                if (typeof pub === 'object') {
                    const publ = Object.keys(pub).length;
                    if (publ === locl) {
                        // publisher == object
                        // case: "Kassel: Bärenreiter, und Stuttgart: Metzler,"
                        for (let i = 0; i < locl; i++) {
                            if (i === locl - 1) {
                                out += 'und ';
                            }
                            out += pubPlace[i] + ': ' + pub[i] + ', ';
                        }
                    }
                } else {
                    // publisher == String
                    // case: "Kassel, New York: Bärenreiter,"
                    for (let i = 0; i < locl; i++) {
                        if (i === locl - 1) {
                            out += pubPlace[i] + ': ' + pub + ', ';
                        } else {
                            out += pubPlace[i] + ', ';
                        }
                    }
                }
            } else {
                // no publisher
                // case: "Wien, Stuttgart,"
                for (let i = 0; i < locl; i++) {
                    out += pubPlace[i] + ', ';
                }
                if (!this.entry['unpubliziert']) {
                    console.log('Verlag fehlt: "' + out + '" (' + this.entry['Kurztitel'] + ')');
                }
            }
        } else {
            if (pub) {
                out += pubPlace + ': ';
                // publisher == object
                // case: "Wien: Böhlau, Lafite, "
                if (typeof pub === 'object') {
                    const publ = Object.keys(pub).length;
                    for (let i = 0; i < publ; i++) {
                        out += pub[i] + ', ';
                    }
                } else {
                    // publisher == String
                    // case: "Wien: Böhlau,"
                    out += pub + ', ';
                }
            } else {
                // place without publisher (e.g. "Hochschulschriften")
                // case: "Wien, "
                if (!this.entry['unpubliziert']) {
                    console.log('Verlag fehlt: "' + out + '" (' + this.entry['Kurztitel'] + ')');
                }
                out += pubPlace + ', ';
            }
        }
        return out;
    }

    /**
     * Private function: formatBibPublisher.
     *
     * It converts the publisher of the BibEntry.
     *
     * @param {string} pub The publisher of the BibEntry.
     *
     * @returns {string} The formatted publisher.
     *
     * DONE IN {@link formatBibPubPlace}.
     */
    private formatBibPublisher(pub: string): string {
        return '';
    }

    /**
     * Private function: formatBibPubDate.
     *
     * It converts the publication date of the BibEntry.
     *
     * @param {string} pubDate The publication date of the BibEntry.
     *
     * @returns {string} The formatted publication date.
     */
    private formatBibPubDate(pubDate: string) {
        return this.entry['Typ'] === 'Zeitschriftenartikel' ? ' (' + pubDate + ')' : ' ' + pubDate;
    }

    /**
     * Private function: formatBibTitleSeries.
     *
     * It converts the series title of the BibEntry.
     *
     * @param {string} seriesTitle The series title of the BibEntry.
     *
     * @returns {string} The formatted series title.
     */
    private formatBibTitleSeries(seriesTitle: string): string {
        return !seriesTitle ? '' : ' (' + seriesTitle + ')';
    }

    /**
     * Private function: formatBibPages.
     *
     * It converts the page numbers of the BibEntry.
     *
     * @param {string} pageNum The page numbers of the BibEntry.
     *
     * @returns {string} The formatted page numbers.
     */
    private formatBibPages(pageNum: string | object): string {
        if (!pageNum) {
            return '';
        }

        let pages = '';
        if (typeof pageNum === 'object') {
            const l: number = Object.keys(pageNum).length;
            for (let i = 0; i < l; i++) {
                const prefix: string = i === 0 ? ', S. ' : ', ';
                pages += prefix + pageNum[i];
            }
        } else if (typeof pageNum === 'string' && pageNum) {
            pages = ', S. ' + pageNum;
        }
        return pages;
    }

    /**
     * Private function: splitName.
     *
     * It splits a comma-separated name and defines the order
     * of items (according to bibliography style).
     *
     * @param {string} name A name to be converted.
     * @param {string} pre_delimiter The delimiter to appear before a name, e.g. a comma.
     *
     * @returns {string} The splitted name(s).
     */
    private splitName(name: string, pre_delimiter: string): string {
        let tmp = [];
        if (name.match(',')) {
            tmp = name.split(', ');
            // changes positions of first and last name
            // look here: http://stackoverflow.com/a/5306832
            tmp.splice(1, 0, tmp.splice(0, 1)[0]);
            return pre_delimiter + tmp[0] + ' ' + tmp[1];
        } else {
            return pre_delimiter + name;
        }
    }
}
