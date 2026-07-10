import{a as p,b as d}from"./chunk-OJ6QD77K.js";import{b as u}from"./chunk-CV47EMGM.js";import"./chunk-UM3DSDLU.js";import{a,b as i}from"./chunk-6PWV2ASN.js";import{Ca as t,o as e,pc as s,sb as r}from"./chunk-JQ4SIPF7.js";var m=`<!-- sideinfo: structure -->
<div class="card">
    <div class="card-body bg-light">
        <h5 id="awg-structure-info-header">{{ STRUCTURE_SIDE_INFO_HEADER }}</h5>
        <p>&#9671;</p>
        <p>
            Konzept/Grafik:
            @if (structureMetaData?.authors?.[0]; as author) {
                <span class="awg-structure-info-author">
                    <a [href]="author.homepage">{{ author.name }}</a>
                    <awg-meta-identifier-badges [identifiers]="author.identifiers" />
                </span>
            }
        </p>
        <p>&#9671;</p>
        <p>
            Versionsdatum:
            <span id="awg-structure-info-lastmodified">{{ structureMetaData.lastModified | date: 'longDate' }}</span>
        </p>
    </div>
</div>
`;var c="";var n=class{constructor(){this.STRUCTURE_SIDE_INFO_HEADER="Strukturmodell",this.structureMetaData=p[d.structure]}};n=e([r({selector:"awg-structure-info",template:m,changeDetection:t.OnPush,imports:[s,i,u],styles:[c]})],n);var _=`<!-- content: structure -->
<div class="awg-structure-view p-5 border rounded-3">
    <!-- heading -->
    <awg-heading [id]="STRUCTURE_VIEW_ID" [title]="STRUCTURE_VIEW_TITLE" />

    <!-- content -->
    <div class="awg-structure-view-content">
        <p>
            Das Modell zeigt die f\xFCr eine AWG-Online-Edition projektierte Datenstruktur, die zur Zeit intern in der
            Webern-DSP-Datenbank implementiert wird.
        </p>

        <p>
            Die erforderlichen Objektklassen und Eigenschaften werden von DSP intern als RDF (<a
                [href]="'https://www.w3.org/RDF/'"
                >Resource Description Framework</a
            >) Triple verwaltet. Sie sind in der Grafik als Ellipsen symbolisiert, deren Verkn\xFCpfungen und Verweise
            untereinander als Pfeile dargestellt.
        </p>

        <p>
            Komplexere Objektstrukturen, wie die aus mehreren Unter- oder Einzelobjekten zu modellierenden Notentexte
            oder Kritischen Berichte, sind als Gruppen zusammengefasst. Zudem sind die Schnittstellen zum
            dokumentarischen Bereich der Webern-DSP-Datenbank angedeutet.
        </p>

        <!-- svg graphic of structure -->
        <svg
            version="1.1"
            xmlns="https://www.w3.org/2000/svg"
            xmlns:xlink="https://www.w3.org/1999/xlink"
            viewBox="0 0 1980 1980"
            id="awg-structure-view-svg">
            <image
                [attr.href]="STRUCTURE_VIEW_SVG_PATH"
                [attr.xlink:href]="STRUCTURE_VIEW_SVG_PATH"
                [attr.src]="STRUCTURE_VIEW_IMG_PATH"
                width="1980"
                height="1980" />
        </svg>
    </div>
</div>
`;var l="";var o=class{constructor(){this.STRUCTURE_VIEW_ID="awg-structure-view-heading",this.STRUCTURE_VIEW_TITLE="Datenstrukturmodell",this.STRUCTURE_VIEW_IMG_PATH="assets/img/structure/WebernGraph.png",this.STRUCTURE_VIEW_SVG_PATH="assets/img/structure/WebernGraph.svg"}};o=e([r({selector:"awg-structure-view",template:_,changeDetection:t.OnPush,imports:[i,a],styles:[l]})],o);var B=[{path:"",component:o,data:{title:"AWG Online Edition \u2013 Structure"}},{path:"",outlet:"side",component:n}];export{B as STRUCTURE_VIEW_ROUTES};
