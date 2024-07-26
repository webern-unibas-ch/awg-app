import{G as s,Ma as a,Oa as n,R as u,X as i,l as e,ob as d}from"./chunk-KHOU7TSZ.js";var l=`<!-- content: structure -->

<!-- heading -->
<awg-heading [title]="structureViewTitle" [id]="structureViewId"></awg-heading>

<!-- description -->
<p>
    Das Modell zeigt die f\xFCr eine AWG-Online-Edition projektierte Datenstruktur, die zur Zeit intern in der
    Webern-SALSAH-Datenbank implementiert wird.
</p>

<p>
    Die erforderlichen Objektklassen und Eigenschaften werden von SALSAH intern als RDF (<a
        href="https://www.w3.org/RDF/"
        >Resource Description Framework</a
    >) Triple verwaltet. Sie sind in der Grafik als Ellipsen symbolisiert, deren Verkn\xFCpfungen und Verweise
    untereinander als Pfeile dargestellt.
</p>

<p>
    Komplexere Objektstrukturen, wie die aus mehreren Unter- oder Einzelobjekten zu modellierenden Notentexte oder
    Kritischen Berichte, sind als Gruppen zusammengefasst. Zudem sind die Schnittstellen zum dokumentarischen Bereich
    der Webern-SALSAH-Datenbank angedeutet.
</p>

<!-- svg graphic of structure -->
<svg
    version="1.1"
    xmlns="https://www.w3.org/2000/svg"
    xmlns:xlink="https://www.w3.org/1999/xlink"
    viewBox="0 0 1980 1980"
    id="structure">
    <image xlink:href="assets/img/WebernGraph.svg" src="assets/img/WebernGraph.png" width="1980" height="1980" />
</svg>
`;var m="";var t,r=(t=class{constructor(w){this.router=w,this.structureViewTitle="Datenstrukturmodell",this.structureViewId="awg-structure-view"}ngOnInit(){this.routeToSidenav()}routeToSidenav(){this.router.navigate([{outlets:{side:"structureInfo"}}],{preserveFragment:!0,queryParamsHandling:"preserve"})}},t.ctorParameters=()=>[{type:a}],t);r=e([u({selector:"awg-structure-view",template:l,changeDetection:s.OnPush,styles:[m]})],r);var f=[{path:"",component:r,data:{title:"AWG Online Edition \u2013 Structure"}}],p=[r],o=class{};o=e([i({imports:[n.forChild(f)],exports:[n]})],o);var c=class{};c=e([i({imports:[d,o],declarations:[p]})],c);export{c as StructureViewModule};
