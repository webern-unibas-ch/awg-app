import{a as m}from"./chunk-JFKXFNRN.js";import{A as c,G as i,J as o,Ka as d,O as n,j as e,na as u,pb as p}from"./chunk-QJGXLACT.js";var l=`<!-- sideinfo: structure -->
<div class="card">
    <div class="card-body bg-light">
        <h5 id="awg-structure-info-header">{{ structureInfoHeader }}</h5>
        <p>&#9671;</p>
        <p>
            Konzept/Grafik:
            <span class="awg-structure-info-author">
                <a href="{{ (structureMetaData?.authors)[0].homepage }}">{{ (structureMetaData?.authors)[0].name }}</a>
                <awg-meta-identifier-badges [identifiers]="(structureMetaData?.authors)[0].identifiers" />
            </span>
        </p>
        <p>&#9671;</p>
        <p>
            Versionsdatum:
            <span id="awg-structure-info-lastmodified">{{ structureMetaData?.lastModified | date: 'longDate' }}</span>
        </p>
    </div>
</div>
`;var g="";var t=class{constructor(){this.structureInfoHeader="Strukturmodell",this._coreService=c(d)}ngOnInit(){this.provideMetaData()}provideMetaData(){this.structureMetaData=this._coreService.getMetaDataSection(m.structure)}};t=e([o({selector:"awg-structure-info",template:l,changeDetection:i.OnPush,standalone:!1,styles:[g]})],t);var f=`<!-- content: structure -->
<div class="awg-structure-view p-5 border rounded-3">
    <!-- heading -->
    <awg-heading [title]="structureViewTitle" [id]="structureViewId"></awg-heading>

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
            id="structure">
            <image
                xlink:href="assets/img/WebernGraph.svg"
                src="assets/img/WebernGraph.png"
                width="1980"
                height="1980" />
        </svg>
    </div>
</div>
`;var w="";var r=class{constructor(){this.structureViewTitle="Datenstrukturmodell",this.structureViewId="awg-structure-view"}};r=e([o({selector:"awg-structure-view",template:f,changeDetection:i.Eager,standalone:!1,styles:[w]})],r);var M=[{path:"",component:r,data:{title:"AWG Online Edition \u2013 Structure"}},{path:"",outlet:"side",component:t}],h=[r,t],s=class{};s=e([n({imports:[u.forChild(M)],exports:[u]})],s);var _=class{};_=e([n({imports:[p,s],declarations:[h]})],_);export{_ as StructureViewModule};
