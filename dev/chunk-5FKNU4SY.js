import{a as u,b as p}from"./chunk-O44GI4KW.js";import{b as a}from"./chunk-QSGG4RFN.js";import"./chunk-BGGPLHQO.js";import{a as s}from"./chunk-BVPCGSEX.js";import{Ca as t,o as e,qc as o,sb as r}from"./chunk-Z3BUILC6.js";var d=`<!-- sideinfo: structure -->
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
`;var m="";var i=class{constructor(){this.STRUCTURE_SIDE_INFO_HEADER="Strukturmodell",this.structureMetaData=u[p.structure]}};i=e([r({selector:"awg-structure-info",template:d,changeDetection:t.OnPush,imports:[o,a],styles:[m]})],i);var c=`<!-- content: structure -->
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
                href="https://www.w3.org/RDF/"
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
`;var _="";var n=class{constructor(){this.STRUCTURE_VIEW_ID="awg-structure-view-heading",this.STRUCTURE_VIEW_TITLE="Datenstrukturmodell",this.STRUCTURE_VIEW_IMG_PATH="assets/img/structure/WebernGraph.png",this.STRUCTURE_VIEW_SVG_PATH="assets/img/structure/WebernGraph.svg"}};n=e([r({selector:"awg-structure-view",template:c,changeDetection:t.OnPush,imports:[s],styles:[_]})],n);var L=[{path:"",component:n,data:{title:"AWG Online Edition \u2013 Structure"}},{path:"",outlet:"side",component:i}];export{L as STRUCTURE_VIEW_ROUTES};
