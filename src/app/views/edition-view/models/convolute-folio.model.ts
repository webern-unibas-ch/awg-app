export class ConvoluteFolio {
    folioId: string;
    systems: string;
    format: ConvoluteFolioFormat;
    content: ConvoluteFolioContent[];
}

export class ConvoluteFolioFormat {
    height: number;
    width: number;
}

export class ConvoluteFolioContent {
    sigle: string;
    measure: string;
    sectionPartition?: number;
    sections?: ConvoluteFolioSection[];
}

export class ConvoluteFolioSection {
    startSystem: number;
    endSystem: number;
    position?: number;
}
