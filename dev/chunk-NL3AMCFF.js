import{a as u}from"./chunk-QRXHJ3XP.js";import{F as r,Oa as a,Q as d,W as e,ob as g,za as o}from"./chunk-EKT2L5DS.js";var p=`<div class="col-12 col-xl-9 awg-page-not-found">
    <h2 id="awg-page-not-found-title">{{ pageNotFoundTitle }}</h2>

    <h5 id="awg-page-not-found-subtitle">{{ pageNotFoundSubTitle }}</h5>

    <div class="awg-page-not-found-body text-center">
        <div class="awg-page-not-found-image my-4">
            <img [src]="pageNotFoundImgPath" width="70%" alt="Page not found" />
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
`;var m="";var t=class{constructor(){this.pageNotFoundTitle="Entschuldigung, diese Seite gibt es hier nicht\u2026",this.pageNotFoundSubTitle="\u2026 aber m\xF6glicherweise k\xF6nnen wir Ihnen anders weiterhelfen?",this._pageNotFoundImgPath="assets/img/page-not-found/Webern_Books.jpg",this._awgContactUrl=u.AWG_PROJECT_URL+"index.php?id=41"}get pageNotFoundImgPath(){return this._pageNotFoundImgPath}get awgContactUrl(){return this._awgContactUrl}};t=o([d({selector:"awg-page-not-found-view",template:p,changeDetection:r.OnPush,styles:[m]})],t);var _=[{path:"",component:t,data:{title:"AWG Online Edition \u2013 404"}}],s=[t],n=class{};n=o([e({imports:[a.forChild(_)],exports:[a]})],n);var l=class{};l=o([e({imports:[g,n],declarations:[s]})],l);export{l as PageNotFoundViewModule};
