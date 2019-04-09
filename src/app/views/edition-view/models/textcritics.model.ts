export class Textcritics {
    measure: string;
    system: string;
    location: string;
    comment: string;
}

export class TextcriticsList {
    [key: string]: Textcritics[];
}
