import{d as i,e as a}from"./chunk-OFSW5ENP.js";import"./chunk-K3Y3W3I4.js";import{a as _}from"./chunk-XANVTRRY.js";import{Aa as t,Cc as r,o,pb as n}from"./chunk-H6HGVBCB.js";var d=`<div class="awg-page-not-found-view p-5 border rounded-3">
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
`;var g=`.awg-page-not-found-view-image>img{object-fit:cover;border-bottom:1px solid var(--bs-card-border-color)}
`;var e=class{constructor(){this.PAGE_NOT_FOUND_VIEW_ID="awg-page-not-found-view-heading",this.PAGE_NOT_FOUND_VIEW_TITLE="Entschuldigung, diese Seite gibt es hier nicht\u2026",this.PAGE_NOT_FOUND_VIEW_SUBTITLE="\u2026 aber m\xF6glicherweise k\xF6nnen wir Ihnen anders weiterhelfen?",this.PAGE_NOT_FOUND_VIEW_IMG_PATH="assets/img/page-not-found/Webern_Books.jpg",this.AWG_CONTACT_URL=r.AWG_PROJECT_URL+"de/info/kontakt.html"}};e=o([n({selector:"awg-page-not-found-view",template:d,changeDetection:t.OnPush,imports:[_,i,a],styles:[g]})],e);var I=[{path:"",component:e,data:{title:"AWG Online Edition \u2013 404"}}];export{I as PAGE_NOT_FOUND_VIEW_ROUTES};
