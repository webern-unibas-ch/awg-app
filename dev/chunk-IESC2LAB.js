import{a as o}from"./chunk-JFKXFNRN.js";import{c as d,h as w}from"./chunk-BRH62FAR.js";import"./chunk-XA6OODQX.js";import{e as b}from"./chunk-TB3YYFUQ.js";import{a as f}from"./chunk-5PJJYBDS.js";import{Aa as n,Bc as m,Db as r,ea as s,lc as h,o as t,pb as a,qa as e,rb as i}from"./chunk-Z63PGVKB.js";var _=`<!-- sideinfo: contact -->
<div class="card">
    <div class="card-body bg-light">
        <h5 id="awg-contact-side-info-header" class="mb-3">{{ CONTACT_SIDE_INFO_HEADER }}</h5>
        <awg-contact-address [pageMetaData]="pageMetaData()" [contactMetaData]="contactMetaData()" />
        <awg-contact-map [embedUrl]="mapEmbedUrl()" [linkUrl]="mapLinkUrl()" />
    </div>
</div>
`;var D="";var I=`<address>
    @let contact = contactMetaData();
    @let page = pageMetaData();

    <p id="awg-contact-address-header" class="smallcaps">
        <strong>
            <a href="{{ page?.awgProjectUrl }}">{{ page?.awgProjectName }}</a>
        </strong>
    </p>
    <p class="awg-contact-address-content">
        <span id="awg-contact-address-institution">{{ contact?.address?.institution }}</span>
        <br />
        <span id="awg-contact-address-street">{{ contact?.address?.street }}</span>
        <br />
        <span id="awg-contact-address-postal-city"
            >{{ contact?.address?.postalCode }}&nbsp;{{ contact?.address?.city }}</span
        >
        <br />
        <span id="awg-contact-address-country">{{ contact?.address?.country }}</span>
    </p>
    <p class="awg-contact-address-content">
        <span id="awg-contact-address-phone">{{ contact?.phone?.label }}&nbsp;{{ contact?.phone?.number }}</span>
        <br />
        <span id="awg-contact-address-email"
            >{{ contact?.email?.label }}&nbsp;<a href="{{ contact?.email?.mailto }}">{{
                contact?.email?.safeString
            }}</a></span
        >
    </p>
</address>
`;var C="";var c=class{constructor(){this.pageMetaData=r.required(),this.contactMetaData=r.required()}static{this.propDecorators={pageMetaData:[{type:i,args:[{isSignal:!0,alias:"pageMetaData",required:!0,transform:void 0}]}],contactMetaData:[{type:i,args:[{isSignal:!0,alias:"contactMetaData",required:!0,transform:void 0}]}]}}};c=t([a({selector:"awg-contact-address",template:I,changeDetection:n.OnPush,styles:[C]})],c);var v=`<iframe
    title="Contact Map View"
    id="awg-contact-map-embed"
    [width]="IFRAME_SETTINGS.width"
    [height]="IFRAME_SETTINGS.height"
    [src]="embedUrl()">
</iframe>

<div id="awg-contact-map-link">
    <small>
        <a href="{{ linkUrl() }}">{{ LINK_LABEL }}</a>
    </small>
</div>
`;var S="";var p=class{constructor(){this.embedUrl=r.required(),this.linkUrl=r.required(),this.LINK_LABEL="Gr\xF6\xDFere Karte anzeigen",this.IFRAME_SETTINGS={width:"100%",height:"350"}}static{this.propDecorators={embedUrl:[{type:i,args:[{isSignal:!0,alias:"embedUrl",required:!0,transform:void 0}]}],linkUrl:[{type:i,args:[{isSignal:!0,alias:"linkUrl",required:!0,transform:void 0}]}]}}};p=t([a({selector:"awg-contact-map",template:v,changeDetection:n.OnPush,styles:[S]})],p);var l=class{constructor(){this._coreService=s(d),this._sanitizer=s(b),this.CONTACT_SIDE_INFO_HEADER="Kontakt",this.contactMetaData=e(this._coreService.getMetaDataSection(o.contact)).asReadonly(),this.pageMetaData=e(this._coreService.getMetaDataSection(o.page)).asReadonly(),this.mapEmbedUrl=e(this._sanitizer.bypassSecurityTrustResourceUrl(m.CONTACT_MAP_UNSAFE_EMBED_URL)).asReadonly(),this.mapLinkUrl=e(m.CONTACT_MAP_LINK_URL).asReadonly()}};l=t([a({selector:"awg-contact-side-info",template:_,changeDetection:n.OnPush,imports:[c,p],styles:[D]})],l);var A=`<!-- content: contact -->
<div class="awg-contact-view p-5 border rounded-3">
    @let page = pageMetaData();
    @let contact = contactMetaData();

    <!-- citation -->
    <!-- citation heading -->
    <awg-heading [title]="CITATION_TITLE" [id]="CITATION_ID" />

    <!-- citation description -->
    <div class="awg-citation-description mb-5">
        <p class="smallcaps">Empfohlene Zitierweisen:</p>

        <p class="italic">Website:</p>
        <p class="awg-citation-text">
            {{ page.awgProjectName }}. Projekt-Website:
            <a href="{{ page?.awgProjectUrl }}"> {{ page?.awgProjectUrl }} </a>, abgerufen am
            <span class="awg-citation-date">{{ today() | date: 'longDate' }}</span
            >.
        </p>

        <p class="italic">Online-Edition:</p>
        <p class="awg-citation-text">
            {{ page.awgProjectName }}. Online-Edition (Version
            <span class="awg-citation-version">{{ page?.awgAppVersion }}</span> vom
            <span class="awg-citation-version-release">{{ page?.awgAppVersionReleaseDate | date: 'longDate' }}</span
            >): <a href="{{ page?.awgAppUrl }}"> {{ page?.awgAppUrl }} </a>, abgerufen am
            <span class="awg-citation-date">{{ today() | date: 'longDate' }}</span
            >.
        </p>
    </div>

    <!-- documentation -->
    <!-- documentation heading -->
    <awg-heading [title]="DOCUMENTATION_TITLE" [id]="DOCUMENTATION_ID" />

    <!-- documentation description -->
    <div class="awg-documentation-description mb-5">
        <p class="awg-documentation-text">
            <span class="smallcaps">GitHub:</span><br />
            Repository unter:
            <a href="{{ page?.awgAppGithubUrl }}">
                {{ page?.awgAppGithubUrl }}
            </a>
        </p>

        <p class="awg-documentation-text">
            <span class="smallcaps">Compodoc:</span><br />
            Dokumentation von Struktur und Funktionalit\xE4ten der Angular App:
            <a id="awg-compodoc" href="{{ page?.compodocUrl }}"> Compodoc documentation </a> <br />
            <span class="smallcaps">DeepWiki:</span><br />
            Interaktive (KI-basierte) Dokumentation der Angular App:
            <a id="awg-deepwiki" href="{{ page?.deepWikiUrl }}"> DeepWiki documentation </a> <br />
        </p>
    </div>

    <!-- imprint -->
    <!-- imprint heading -->
    <awg-heading [title]="IMPRINT_TITLE" [id]="IMPRINT_ID" />

    <!-- imprint description -->
    <div class="awg-imprint-description">
        <p>
            <span class="smallcaps">Herausgeber:</span><br />
            {{ page.awgProjectName }}<br />
            {{ contact.address.institution }}<br />
            {{ contact.address.street }}<br />
            {{ contact.address.postalCode }}&nbsp;{{ contact.address.city }}<br />
            {{ contact.address.country }}<br /><br />
        </p>

        <p>
            <span class="smallcaps">Konzept:</span><br />
            {{ page.awgProjectName }}<br /><br />
        </p>
        <p>
            <span class="smallcaps">Texte/Inhalte:</span><br />
            Die Verantwortung f\xFCr die Inhalte der Website liegt bei der {{ page.awgProjectName }}. Bei inhaltlichen
            Fragen wenden Sie sich bitte an die unter Kontakt angegebene Adresse.<br /><br />
        </p>
        <p>
            <span class="smallcaps">Materialien, Notentexte und Bilder (vgl. Lizenzierung):</span><br />
            Digitales Archiv der {{ page.awgProjectName }}<br />
            Online-Edition der {{ page.awgProjectName }}<br /><br />
        </p>
        <p>
            <span class="smallcaps">Programmierung &amp; Webdesign:</span><br />
            @for (developer of contact?.developers; track developer.name) {
                {{ developer.name }}<awg-meta-identifier-badges [identifiers]="developer.identifiers" /><br />
            }
            Wissenschaftlicher Mitarbeiter der {{ page.awgProjectName }}, Basel<br /><a
                href="mailto:stefan.muennich@unibas.ch"
                >stefan.muennich [at] unibas [dot] ch</a
            ><br /><br />
        </p>
    </div>

    <!-- disclaimer description -->
    <div id="awg-disclaimer">
        <p><span class="smallcaps">Disclaimer/Haftungserkl\xE4rung:</span><br /></p>
        <p class="italic">Urheberrecht und Lizenzierung:</p>
        <p>
            S\xE4mtliche im Rahmen der {{ page.awgProjectName }} erarbeiteten und auf ihrer Website oder ihrer
            Online-Edition ver\xF6ffentlichten Inhalte sowie auch alle Inhalte, die von der Website oder der Online-Edition
            der Anton Webern Gesamtausgabe aus auf der DaSCH Service Platform (DSP)/SALSAH (Projektbereich der Anton
            Webern Gesamtausgabe) f\xFCr den Nutzer zug\xE4nglich sind, sind urheberrechtlich gesch\xFCtzt und werden \u2013 sofern
            nicht anders deklariert \u2013 zu den Bedingungen der Creative Commons-Lizenz \u201ENamensnennung \u2013 Weitergabe unter
            gleichen Bedingungen 4.0 International" (<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de"
                >CC BY-SA-4.0</a
            >) zur Verf\xFCgung gestellt. Jede davon abweichende Verwertung bedarf der vorherigen schriftlichen Zustimmung
            durch den jeweiligen Rechteinhaber. Allf\xE4llige Bewilligungsgesuche sind an die {{ page.awgProjectName }} zu
            richten (Kontakt). Alle Rechte an zug\xE4nglich gemachten externen Bildinhalten verbleiben bei den
            Privateigent\xFCmern bzw. den archivierenden Institutionen, bei denen die Rechte f\xFCr eine allf\xE4llige
            Weiterverwendung einzuholen sind.
        </p>

        <p>
            Der Software-Code der Online-Edition wird auf
            <a href="{{ page?.awgAppGithubUrl }}">GitHub</a> unter einer
            <a href="https://opensource.org/licenses/MIT">MIT</a>-Lizenz zur Verf\xFCgung gestellt.
        </p>

        <p class="italic">Externe Links:</p>
        <p>
            Die {{ page.awgProjectName }} hat keinen Einfluss auf und \xFCbernimmt keine Verantwortung f\xFCr die Inhalte der
            von ihrer Website, von ihrer Online-Edition oder von der DaSCH Service Platform (DSP)/SALSAH (Projektbereich
            der {{ page.awgProjectName }}) aus verlinkten externen Internetseiten. Eine Pr\xFCfung bei der Verlinkung ergab
            keine strafbaren Inhalte auf diesen Seiten. Alle Linkangaben sind ohne Gew\xE4hr. Seitenaufrufe externer Seiten
            \xFCber diese Links erfolgen auf eigene Gefahr. Dies gilt f\xFCr alle Links auf der Website und der Online-Edition
            der {{ page.awgProjectName }} sowie auf der DaSCH Service Platform (DSP)/SALSAH (Projektbereich der Anton
            Webern Gesamtausgabe).
        </p>

        <p class="italic">Haftungserkl\xE4rung:</p>
        <p>
            Die {{ page.awgProjectName }} bem\xFCht sich um richtige und aktualisierte Informationen auf ihrer Website und
            ihrer Online-Edition, \xFCbernimmt jedoch keinerlei Garantien oder Zusicherungen betreffend der Vollst\xE4ndigkeit
            der auf dieser enthaltenen bzw. referenzierten Informationen. Prinzipiell erfolgen Zugang, Benutzung und
            Inanspruchnahme der Dienstleistungen der Website der {{ page.awgProjectName }} ausschlie\xDFlich auf eigenes
            Risiko des Nutzers. Weder die Gesamtausgabe noch eine von ihr beigezogene, in Herstellung,
            Informationseingabe und Informationsvermittlung der Website involvierte Hilfsperson sind in irgendeiner Form
            haftbar f\xFCr etwaige Sch\xE4den, die im Zusammenhang mit Zugang, Benutzung oder m\xF6glichen St\xF6rungen beim
            Gebrauch der Website auftreten k\xF6nnten.
        </p>

        <p class="italic">Google Analytics:</p>
        <p>
            Die {{ page.awgProjectName }} setzt auf Grundlage ihrer berechtigten Interessen (d.h. Interesse an der
            Analyse und Optimierung unseres Onlineangebotes im Sinne des Art.
            <a href="https://dejure.org/gesetze/DSGVO/6.html">6</a> Abs. 1 lit. f. DSGVO) Google Analytics, einen
            Webanalysedienst der Google LLC (\u201EGoogle\u201C) ein. Google verwendet Cookies. Die durch das Cookie erzeugten
            Informationen \xFCber Benutzung des Onlineangebotes durch die Nutzer werden in der Regel an einen Server von
            Google in den USA \xFCbertragen und dort gespeichert.
        </p>

        <p>
            Google ist unter dem Privacy-Shield-Abkommen zertifiziert und bietet hierdurch eine Garantie, das
            europ\xE4ische Datenschutzrecht einzuhalten (<a
                href="https://www.privacyshield.gov/participant?id=a2zt000000001L5AAI&status=Active"
                >https://www.privacyshield.gov/participant?id=a2zt000000001L5AAI&status=Active</a
            >).
        </p>

        <p>
            Google wird diese Informationen in unserem Auftrag benutzen, um die Nutzung unseres Onlineangebotes durch
            die Nutzer auszuwerten, um Reports \xFCber die Aktivit\xE4ten innerhalb dieses Onlineangebotes zusammenzustellen
            und um weitere, mit der Nutzung dieses Onlineangebotes und der Internetnutzung verbundene Dienstleistungen,
            uns gegen\xFCber zu erbringen. Dabei k\xF6nnen aus den verarbeiteten Daten pseudonyme Nutzungsprofile der Nutzer
            erstellt werden.
        </p>

        <p>
            Die {{ page.awgProjectName }} setzt Google Analytics nur mit aktivierter IP-Anonymisierung ein. Das
            bedeutet, die IP-Adresse der Nutzer wird von Google innerhalb von Mitgliedstaaten der Europ\xE4ischen Union
            oder in anderen Vertragsstaaten des Abkommens \xFCber den Europ\xE4ischen Wirtschaftsraum gek\xFCrzt. Nur in
            Ausnahmef\xE4llen wird die volle IP-Adresse an einen Server von Google in den USA \xFCbertragen und dort gek\xFCrzt.
        </p>

        <p>
            Die von dem Browser des Nutzers \xFCbermittelte IP-Adresse wird nicht mit anderen Daten von Google
            zusammengef\xFChrt. Die Nutzer k\xF6nnen die Speicherung der Cookies durch eine entsprechende Einstellung ihrer
            Browser-Software verhindern; die Nutzer k\xF6nnen dar\xFCber hinaus die Erfassung der durch das Cookie erzeugten
            und auf ihre Nutzung des Onlineangebotes bezogenen Daten an Google sowie die Verarbeitung dieser Daten durch
            Google verhindern, indem sie das unter folgendem Link verf\xFCgbare Browser-Plugin herunterladen und
            installieren:
            <a href="https://tools.google.com/dlpage/gaoptout?hl=de">https://tools.google.com/dlpage/gaoptout?hl=de</a>.
        </p>

        <p>
            Weitere Informationen zur Datennutzung durch Google, Einstellungs- und Widerspruchsm\xF6glichkeiten, erfahren
            Sie in der Datenschutzerkl\xE4rung von Google (<a href="https://policies.google.com/technologies/ads"
                >https://policies.google.com/technologies/ads</a
            >) sowie in den Einstellungen f\xFCr die Darstellung von Werbeeinblendungen durch Google (<a
                href="https://adssettings.google.com/authenticated"
                >https://adssettings.google.com/authenticated</a
            >).
        </p>

        <p>Die personenbezogenen Daten der Nutzer werden nach 14 Monaten gel\xF6scht.</p>

        <p>
            [<a href="https://datenschutz-generator.de/"
                >Erstellt mit Datenschutz-Generator.de von RA Dr. Thomas Schwenke</a
            >; vom Websiteinhaber angepasst]
        </p>
    </div>
</div>
`;var N=`.awg-contact-view{text-align:justify;text-justify:inter-word}
`;var g=class{constructor(){this._coreService=s(d),this.CITATION_ID="awg-citation",this.CITATION_TITLE="Zitation",this.IMPRINT_ID="awg-imprint",this.IMPRINT_TITLE="Impressum",this.DOCUMENTATION_ID="awg-documentation",this.DOCUMENTATION_TITLE="Dokumentation",this.contactMetaData=e(this._coreService.getMetaDataSection(o.contact)).asReadonly(),this.pageMetaData=e(this._coreService.getMetaDataSection(o.page)).asReadonly(),this.today=e(Date.now()).asReadonly()}};g=t([a({selector:"awg-contact-view",template:A,changeDetection:n.OnPush,imports:[h,f,w],styles:[N]})],g);var ze=[{path:"",component:g,data:{title:"AWG Online Edition \u2013 Contact"}},{path:"",outlet:"side",component:l}];export{ze as CONTACT_VIEW_ROUTES};
