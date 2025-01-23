import{M as r,Na as a,S as d,X as t,j as o,kb as g,qc as u}from"./chunk-VVRUCA53.js";var p=`<div class="awg-page-not-found-view p-5 border rounded-3">
    <awg-heading [id]="'awg-page-not-found-title'" [title]="pageNotFoundTitle"></awg-heading>

    <div class="awg-page-not-found-body text-center">
        <h5 id="awg-page-not-found-subtitle">{{ pageNotFoundSubTitle }}</h5>

        <div class="awg-page-not-found-image my-4">
            <img [src]="pageNotFoundImgPath" class="img-fluid rounded" alt="Page not found" />
        </div>

        <p id="awg-page-not-found-contact">
            Kontaktieren sie uns gerne unter:
            <a [href]="awgContactUrl">anton-webern.ch</a>
        </p>

        <p id="awg-page-not-found-back" class="mt-4">
            Zur\xFCck zur Startseite: <a [routerLink]="['/home']" routerLinkActive="active">Home</a>
        </p>
    </div>
</div>
`;var m=`.awg-page-not-found-image>img{object-fit:cover;border-bottom:1px solid var(--bs-card-border-color)}
`;var e=class{constructor(){this.pageNotFoundTitle="Entschuldigung, diese Seite gibt es hier nicht\u2026",this.pageNotFoundSubTitle="\u2026 aber m\xF6glicherweise k\xF6nnen wir Ihnen anders weiterhelfen?",this._pageNotFoundImgPath="assets/img/page-not-found/Webern_Books.jpg",this._awgContactUrl=g.AWG_PROJECT_URL+"index.php?id=41"}get pageNotFoundImgPath(){return this._pageNotFoundImgPath}get awgContactUrl(){return this._awgContactUrl}};e=o([d({selector:"awg-page-not-found-view",template:p,changeDetection:r.Default,standalone:!1,styles:[m]})],e);var w=[{path:"",component:e,data:{title:"AWG Online Edition \u2013 404"}}],s=[e],n=class{};n=o([t({imports:[a.forChild(w)],exports:[a]})],n);var l=class{};l=o([t({imports:[u,n],declarations:[s]})],l);export{l as PageNotFoundViewModule};
