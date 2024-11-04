import{b as p,s as m}from"./chunk-WHG4UXFL.js";import"./chunk-I254P3LG.js";import"./chunk-OCUTK2OC.js";import{Ca as e,I as i,Ra as a,T as n,Z as s,tb as d}from"./chunk-VFHTK4A5.js";var l=`<!-- sideinfo: structure -->
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
`;var g="";var t,r=(t=class{constructor(_){this.coreService=_,this.structureInfoHeader="Strukturmodell"}ngOnInit(){this.provideMetaData()}provideMetaData(){this.structureMetaData=this.coreService.getMetaDataSection(p.structure)}},t.ctorParameters=()=>[{type:m}],t);r=e([n({selector:"awg-structure-info",template:l,changeDetection:i.OnPush,styles:[g]})],r);var h=`<!-- content: structure -->
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
`;var w="";var o=class{constructor(){this.structureViewTitle="Datenstrukturmodell",this.structureViewId="awg-structure-view"}};o=e([n({selector:"awg-structure-view",template:h,changeDetection:i.Default,styles:[w]})],o);var M=[{path:"",component:o,data:{title:"AWG Online Edition \u2013 Structure"}},{path:"",outlet:"side",component:r}],f=[o,r],u=class{};u=e([s({imports:[a.forChild(M)],exports:[a]})],u);var S=class{};S=e([s({imports:[d,u],declarations:[f]})],S);export{S as StructureViewModule};
