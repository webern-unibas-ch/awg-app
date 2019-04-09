import { Pipe, PipeTransform } from '@angular/core';

import { BibEntry } from './bibliography-entry';

@Pipe({
    name: 'bibFormat'
})
export class BibliographyFormatPipe implements PipeTransform {
    private entry: BibEntry;
    private formattedEntry: BibEntry;
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

    transform(bibItem: BibEntry): any {
        if (!bibItem) {
            return null;
        }
        this.entry = bibItem;
        this.formattedEntry = this.getFormatFields('edit', this.entry);
        this.getFilteredValues(this.formattedEntry);

        return this.getFormatFields('output', this.formattedEntry);
    }

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

    private getFilteredValues(entry: BibEntry) {
        Object.keys(entry).forEach(key => {
            entry[key] = this.getFilteredValueByKey(entry, key);
        });
        return entry;
    }

    private getFilteredValueByKey(entry: BibEntry, key: string): string {
        let value = '';
        switch (key) {
            case 'Kurztitel':
                value = this.filterBibTitleShort(entry[key]);
                break;
            case 'Author':
                value = this.filterBibAuthor(entry[key]);
                break;
            case 'Titel_selbst':
                value = this.filterBibTitleIndep(entry[key]);
                break;
            case 'Titel_unselbst':
                value = this.filterBibTitleDep(entry[key]);
                break;
            case 'Herausgeber':
                value = this.filterBibEditor(entry[key]);
                break;
            case 'unpubliziert':
                value = this.filterBibUnpublished(entry[key]);
                break;
            case 'Verlagsort':
                value = this.filterBibPubPlace(entry[key]);
                break;
            /* done in pubplace
             case 'publisher':
             value = this.filterBibPublisher(bibItem[key]);
             break;
             */
            case 'Publikationsdatum':
                value = this.filterBibPubDate(entry[key]);
                break;
            case 'Reihentitel':
                value = this.filterBibTitleSeries(entry[key]);
                break;
            case 'Seitenangabe':
                value = this.filterBibPages(entry[key]);
                break;
            default:
                value = entry[key];
        }
        return value;
    }

    private filterBibTitleShort(shortTitle: string) {
        const title: string = !shortTitle ? '' : shortTitle + ' | ';
        return title;
    }

    // filter for authors in bibliography
    private filterBibAuthor(authors: string | object) {
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

    // filter for independent titles in bibliography
    private filterBibTitleIndep(indepTitle: string) {
        const formattedTitle: string = !indepTitle
            ? ''
            : this.entry['Typ'] !== 'Zeitschriftenartikel'
            ? indepTitle + ', '
            : indepTitle;
        return formattedTitle;
    }

    // filter for dependent titles in bibliography
    private filterBibTitleDep(depTitle: string) {
        const formattedTitle: string = !depTitle ? '' : '„' + depTitle + '“, in: ';
        return formattedTitle;
    }

    // filter for editors in bibliography
    private filterBibEditor(editors: string | object) {
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
                // last name seperated by "und", others by comma
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

    // filter for unpublished literature in bibliography
    private filterBibUnpublished(unpub: string) {
        const type: string = !unpub ? '' : unpub + ' ';
        return type;
    }

    // filter for publication place in bilbiography
    private filterBibPubPlace(pubPlace: string | object) {
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

    // filter for publisher in bibliography
    private filterBibPublisher(pub: string) {
        return '';
    }

    // filter for date in bibliography
    private filterBibPubDate(pubDate: string) {
        const date = this.entry['Typ'] === 'Zeitschriftenartikel' ? ' (' + pubDate + ')' : ' ' + pubDate;
        return date;
    }

    // filter for series titles in bibliography
    private filterBibTitleSeries(seriesTitle: string) {
        const title: string = !seriesTitle ? '' : ' (' + seriesTitle + ')';
        return title;
    }

    // filter for pages in bibliography
    private filterBibPages(pageNum: string | object) {
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

    // splits array with names and defines the order of items (according to bibliography style)
    private splitName(name, pre_delimiter) {
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
