import{Ca as e,I as s,Pa as a,Ra as o,T as u,Z as i,sb as d}from"./chunk-LY2JR32L.js";var l=`<!-- content: structure -->
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
`;var c="";var t,r=(t=class{constructor(g){this.router=g,this.structureViewTitle="Datenstrukturmodell",this.structureViewId="awg-structure-view"}ngOnInit(){this.routeToSidenav()}routeToSidenav(){this.router.navigate([{outlets:{side:"structureInfo"}}],{preserveFragment:!0,queryParamsHandling:"preserve"})}},t.ctorParameters=()=>[{type:a}],t);r=e([u({selector:"awg-structure-view",template:l,changeDetection:s.OnPush,styles:[c]})],r);var S=[{path:"",component:r,data:{title:"AWG Online Edition \u2013 Structure"}}],m=[r],n=class{};n=e([i({imports:[o.forChild(S)],exports:[o]})],n);var p=class{};p=e([i({imports:[d,n],declarations:[m]})],p);export{p as StructureViewModule};
