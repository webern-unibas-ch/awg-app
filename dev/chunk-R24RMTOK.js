import{f as n,g as r}from"./chunk-DABVPOOX.js";import{a,b as _}from"./chunk-KWLPEQWJ.js";import{$b as d,Ua as i,o as t,xa as o}from"./chunk-DZ64OYSD.js";var g=`<div class="awg-page-not-found-view p-5 border rounded-3">
    <awg-heading [id]="PAGE_NOT_FOUND_VIEW_ID" [title]="PAGE_NOT_FOUND_VIEW_TITLE" />

    <div class="awg-page-not-found-view-body text-center">
        <h5 id="awg-page-not-found-view-subtitle">{{ PAGE_NOT_FOUND_VIEW_SUBTITLE }}</h5>

        <div class="awg-page-not-found-view-image my-4">
            <img [src]="PAGE_NOT_FOUND_VIEW_IMG_PATH" class="img-fluid rounded" alt="Page not found" />
        </div>

        <p id="awg-page-not-found-view-contact">
            Kontaktieren Sie uns gerne unter:
            <a [href]="AWG_CONTACT_URL">anton-webern.ch</a>
        </p>

        <p id="awg-page-not-found-view-back" class="mt-4">
            Zur\xFCck zur Startseite: <a [routerLink]="['/home']" routerLinkActive="active">Home</a>
        </p>
    </div>
</div>
`;var m=`.awg-page-not-found-view-image>img{object-fit:cover;border-bottom:1px solid var(--bs-card-border-color)}
`;var e=class{constructor(){this.PAGE_NOT_FOUND_VIEW_ID="awg-page-not-found-view-heading",this.PAGE_NOT_FOUND_VIEW_TITLE="Entschuldigung, diese Seite gibt es hier nicht\u2026",this.PAGE_NOT_FOUND_VIEW_SUBTITLE="\u2026 aber m\xF6glicherweise k\xF6nnen wir Ihnen anders weiterhelfen?",this.PAGE_NOT_FOUND_VIEW_IMG_PATH="assets/img/page-not-found/Webern_Books.jpg",this.AWG_CONTACT_URL=d.AWG_PROJECT_URL+"de/info/kontakt.html"}};e=t([i({selector:"awg-page-not-found-view",template:g,changeDetection:o.OnPush,imports:[a,_,n,r],styles:[m]})],e);var P=[{path:"",component:e,data:{title:"AWG Online Edition \u2013 404"}}];export{P as PAGE_NOT_FOUND_VIEW_ROUTES};
