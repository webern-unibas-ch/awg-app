export class Logo {
    id: string;
    src: string;
    alt: string;
    href: string;
}

export class Logos {
    [key: string]: Logo;
}
