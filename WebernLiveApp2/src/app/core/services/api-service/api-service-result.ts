import { JsonConvert } from 'json2typescript';

/**
 * Result class used as API request response in ApiService
 */
export class ApiServiceResult {

    /**
     * Status number
     */
    status: number = 0;

    /**
     * Status text
     */
    statusText: string = '';

    /**
     * Status number
     */
    body: any;

    /**
     * Gets the result body as instance of classObject.
     * @param classObject
     * @returns {any}
     */
    getBody(classObject?: {new(): any}): any {
        if (!classObject) return this.body;
        try {
            let jsonConvert: JsonConvert = new JsonConvert();
            return jsonConvert.deserializeObject(this.body, classObject);
        } catch(e) {
            console.log(e);
        }
        return null;
    }

}
