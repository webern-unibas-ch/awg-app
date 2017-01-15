import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
    name: 'sanitizeHTML'
})
export class SanitizeHTMLPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer){}

    transform(value: string): SafeHtml {
        if (!value) {
            return null;
        }
        return this._sanitizer.bypassSecurityTrustHtml(value);
    }

}
