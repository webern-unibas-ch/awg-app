import{D as n,Db as d,M as r,Na as g,S as o,X as s,j as e,kb as p,ob as t,qc as m,ya as u}from"./chunk-ENBQVWXT.js";var h=`<!-- sideinfo: contact -->
<div class="card">
    <div class="card-body bg-light">
        <h5 id="awg-contact-info-header" class="mb-3">{{ contactInfoHeader }}</h5>
        <awg-address [pageMetaData]="pageMetaData" [contactMetaData]="contactMetaData"></awg-address>
        <awg-open-street-map [osmEmbedUrl]="osmEmbedUrl" [osmLinkUrl]="osmLinkUrl"></awg-open-street-map>
    </div>
</div>
`;var b="";var a=class{constructor(){this.contactInfoHeader="Kontakt",this._coreService=n(d),this._sanitizer=n(u)}ngOnInit(){this.provideMetaData(),this.provideOSMUrls()}provideMetaData(){this.pageMetaData=this._coreService.getMetaDataSection(t.page),this.contactMetaData=this._coreService.getMetaDataSection(t.contact)}provideOSMUrls(){this.osmEmbedUrl=this._sanitizer.bypassSecurityTrustResourceUrl(p.UNSAFE_OSM_EMBED_URL),this.osmLinkUrl=p.OSM_LINK_URL}};a=e([o({selector:"awg-contact-info",template:h,changeDetection:r.OnPush,standalone:!1,styles:[b]})],a);var f=`<!-- content: contact -->
<div class="awg-contact-view p-5 border rounded-3">
    <!-- citation -->
    <!-- citation heading -->
    <awg-heading [title]="citationTitle" [id]="citationId"></awg-heading>

    <!-- citation description -->
    <div class="awg-citation-description mb-5">
        <p class="smallcaps">Empfohlene Zitierweisen:</p>

        <p class="italic">Website:</p>
        <p class="awg-citation-text">
            {{ pageMetaData.awgProjectName }}. Projekt-Website:
            <a href="{{ pageMetaData?.awgProjectUrl }}"> {{ pageMetaData?.awgProjectUrl }} </a>, abgerufen am
            <span class="awg-citation-date">{{ today | date: dateFormat }}</span
            >.
        </p>

        <p class="italic">Online-Edition:</p>
        <p class="awg-citation-text">
            {{ pageMetaData.awgProjectName }}. Online-Edition (Version
            <span class="awg-citation-version">{{ pageMetaData?.version }}</span> vom
            <span class="awg-citation-version-release">{{ pageMetaData?.versionReleaseDate }}</span
            >): <a href="{{ pageMetaData?.awgAppUrl }}"> {{ pageMetaData?.awgAppUrl }} </a>, abgerufen am
            <span class="awg-citation-date">{{ today | date: dateFormat }}</span
            >.
        </p>
    </div>

    <!-- documentation -->
    <!-- documentation heading -->
    <awg-heading [title]="documentationTitle" [id]="documentationId"></awg-heading>

    <!-- documentation description -->
    <div class="awg-documentation-description mb-5">
        <p class="awg-documentation-text">
            <span class="smallcaps">GitHub:</span><br />
            Repository unter:
            <a href="{{ pageMetaData?.githubUrl }}">
                {{ pageMetaData?.githubUrl }}
            </a>
        </p>

        <p class="awg-documentation-text">
            <span class="smallcaps">Compodoc:</span><br />
            Dokumentation von Struktur und Funktionalit\xE4ten der Angular App:
            <a id="awg-compodoc" href="{{ pageMetaData?.compodocUrl }}"> AWG-APP documentation </a>
        </p>
    </div>

    <!-- imprint -->
    <!-- imprint heading -->
    <awg-heading [title]="imprintTitle" [id]="imprintId"></awg-heading>

    <!-- imprint description -->
    <div class="awg-imprint-description">
        <p>
            <span class="smallcaps">Herausgeber:</span><br />
            {{ pageMetaData.awgProjectName }}<br />
            {{ contactMetaData.address.institution }}<br />
            {{ contactMetaData.address.street }}<br />
            {{ contactMetaData.address.postalCode }}&nbsp;{{ contactMetaData.address.city }}<br />
            {{ contactMetaData.address.country }}<br /><br />
        </p>

        <p>
            <span class="smallcaps">Konzept:</span><br />
            {{ pageMetaData.awgProjectName }}<br /><br />
        </p>
        <p>
            <span class="smallcaps">Texte/Inhalte:</span><br />
            Die Verantwortung f\xFCr die Inhalte der Website liegt bei der {{ pageMetaData.awgProjectName }}. Bei
            inhaltlichen Fragen wenden Sie sich bitte an die unter Kontakt angegebene Adresse.<br /><br />
        </p>
        <p>
            <span class="smallcaps">Materialien, Notentexte und Bilder (vgl. Lizenzierung):</span><br />
            Digitales Archiv der {{ pageMetaData.awgProjectName }}<br />
            Online-Edition der {{ pageMetaData.awgProjectName }}<br /><br />
        </p>
        <p>
            <span class="smallcaps">Programmierung &amp; Webdesign:</span><br />
            Stefan M\xFCnnich<br />
            Wissenschaftlicher Mitarbeiter der {{ pageMetaData.awgProjectName }}, Basel<br /><a
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
            S\xE4mtliche im Rahmen der {{ pageMetaData.awgProjectName }} erarbeiteten und auf ihrer Website oder ihrer
            Online-Edition ver\xF6ffentlichten Inhalte sowie auch alle Inhalte, die von der Website oder der Online-Edition
            der Anton Webern Gesamtausgabe aus auf der DaSCH Service Platform (DSP)/SALSAH (Projektbereich der Anton
            Webern Gesamtausgabe) f\xFCr den Nutzer zug\xE4nglich sind, sind urheberrechtlich gesch\xFCtzt und werden \u2013 sofern
            nicht anders deklariert \u2013 zu den Bedingungen der Creative Commons-Lizenz \u201ENamensnennung \u2013 Weitergabe unter
            gleichen Bedingungen 4.0 International" (<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de"
                >CC BY-SA-4.0</a
            >) zur Verf\xFCgung gestellt. Jede davon abweichende Verwertung bedarf der vorherigen schriftlichen Zustimmung
            durch den jeweiligen Rechteinhaber. Allf\xE4llige Bewilligungsgesuche sind an die
            {{ pageMetaData.awgProjectName }} zu richten (Kontakt). Alle Rechte an zug\xE4nglich gemachten externen
            Bildinhalten verbleiben bei den Privateigent\xFCmern bzw. den archivierenden Institutionen, bei denen die
            Rechte f\xFCr eine allf\xE4llige Weiterverwendung einzuholen sind.
        </p>

        <p>
            Der Software-Code der Online-Edition wird auf
            <a href="{{ pageMetaData?.githubUrl }}">GitHub</a> unter einer
            <a href="https://opensource.org/licenses/MIT">MIT</a>-Lizenz zur Verf\xFCgung gestellt.
        </p>

        <p class="italic">Externe Links:</p>
        <p>
            Die {{ pageMetaData.awgProjectName }} hat keinen Einfluss auf und \xFCbernimmt keine Verantwortung f\xFCr die
            Inhalte der von ihrer Website, von ihrer Online-Edition oder von der DaSCH Service Platform (DSP)/SALSAH
            (Projektbereich der {{ pageMetaData.awgProjectName }}) aus verlinkten externen Internetseiten. Eine Pr\xFCfung
            bei der Verlinkung ergab keine strafbaren Inhalte auf diesen Seiten. Alle Linkangaben sind ohne Gew\xE4hr.
            Seitenaufrufe externer Seiten \xFCber diese Links erfolgen auf eigene Gefahr. Dies gilt f\xFCr alle Links auf der
            Website und der Online-Edition der {{ pageMetaData.awgProjectName }} sowie auf der DaSCH Service Platform
            (DSP)/SALSAH (Projektbereich der Anton Webern Gesamtausgabe).
        </p>

        <p class="italic">Haftungserkl\xE4rung:</p>
        <p>
            Die {{ pageMetaData.awgProjectName }} bem\xFCht sich um richtige und aktualisierte Informationen auf ihrer
            Website und ihrer Online-Edition, \xFCbernimmt jedoch keinerlei Garantien oder Zusicherungen betreffend der
            Vollst\xE4ndigkeit der auf dieser enthaltenen bzw. referenzierten Informationen. Prinzipiell erfolgen Zugang,
            Benutzung und Inanspruchnahme der Dienstleistungen der Website der
            {{ pageMetaData.awgProjectName }} ausschlie\xDFlich auf eigenes Risiko des Nutzers. Weder die Gesamtausgabe
            noch eine von ihr beigezogene, in Herstellung, Informationseingabe und Informationsvermittlung der Website
            involvierte Hilfsperson sind in irgendeiner Form haftbar f\xFCr etwaige Sch\xE4den, die im Zusammenhang mit
            Zugang, Benutzung oder m\xF6glichen St\xF6rungen beim Gebrauch der Website auftreten k\xF6nnten.
        </p>

        <p class="italic">Google Analytics:</p>
        <p>
            Die {{ pageMetaData.awgProjectName }} setzt auf Grundlage ihrer berechtigten Interessen (d.h. Interesse an
            der Analyse und Optimierung unseres Onlineangebotes im Sinne des Art.
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
            Die {{ pageMetaData.awgProjectName }} setzt Google Analytics nur mit aktivierter IP-Anonymisierung ein. Das
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
`;var w=`.awg-contact-view{text-align:justify;text-justify:inter-word}
`;var i=class{constructor(){this.imprintTitle="Impressum",this.imprintId="awg-imprint",this.citationTitle="Zitation",this.citationId="awg-citation",this.documentationTitle="Dokumentation",this.documentationId="awg-documentation",this.dateFormat="d. MMMM yyyy",this._coreService=n(d)}ngOnInit(){this.provideMetaData(),this.today=Date.now()}provideMetaData(){this.pageMetaData=this._coreService.getMetaDataSection(t.page),this.contactMetaData=this._coreService.getMetaDataSection(t.contact)}};i=e([o({selector:"awg-contact-view",template:f,changeDetection:r.Default,standalone:!1,styles:[w]})],i);var A=[{path:"",component:i,data:{title:"AWG Online Edition \u2013 Contact"}},{path:"",outlet:"side",component:a}],D=[i,a],c=class{};c=e([s({imports:[g.forChild(A)],exports:[g]})],c);var v=class{};v=e([s({imports:[m,c],declarations:[D]})],v);export{v as ContactViewModule};
