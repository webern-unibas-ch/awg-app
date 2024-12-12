import{D as c,Eb as p,H as o,Na as a,S as i,X as n,j as e,pb as d,rc as m}from"./chunk-CIYDP5DD.js";var l=`<!-- sideinfo: structure -->
<div class="card">
    <div class="card-body bg-light">
        <h5 id="awg-structure-info-header">{{ structureInfoHeader }}</h5>
        <p>&#9671;</p>
        <p>
            Konzept/Grafik:
            <span class="awg-structure-info-author">
                <a href="{{ (structureMetaData?.authors)[0].homepage }}">{{ (structureMetaData?.authors)[0].name }}</a>
            </span>
        </p>
        <p>&#9671;</p>
        <p>
            Versionsdatum: <span id="awg-structure-info-lastmodified">{{ structureMetaData?.lastModified }}</span>
        </p>
    </div>
</div>
`;var g="";var t=class{constructor(){this.structureInfoHeader="Strukturmodell",this._coreService=c(p)}ngOnInit(){this.provideMetaData()}provideMetaData(){this.structureMetaData=this._coreService.getMetaDataSection(d.structure)}};t=e([i({selector:"awg-structure-info",template:l,changeDetection:o.OnPush,styles:[g]})],t);var w=`<!-- content: structure -->
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
`;var h="";var r=class{constructor(){this.structureViewTitle="Datenstrukturmodell",this.structureViewId="awg-structure-view"}};r=e([i({selector:"awg-structure-view",template:w,changeDetection:o.Default,styles:[h]})],r);var k=[{path:"",component:r,data:{title:"AWG Online Edition \u2013 Structure"}},{path:"",outlet:"side",component:t}],f=[r,t],s=class{};s=e([n({imports:[a.forChild(k)],exports:[a]})],s);var _=class{};_=e([n({imports:[m,s],declarations:[f]})],_);export{_ as StructureViewModule};
