import{$ as i1,Ba as m1,Bb as g2,Db as C2,Eb as b1,Fa as z1,Fb as y1,Ha as p1,Nb as w1,Ta as $,Ua as u1,Va as M1,Yc as k1,Zc as e2,_ as h2,a as r1,b as s1,da as T,db as d1,eb as L1,ga as f1,gb as v1,ha as n1,la as a2,lb as h1,mb as g1,nb as C1,ob as x1,oc as x2,ra as o1,rc as l2,sa as t1,sc as S,wb as S1,xb as N1}from"./chunk-M2TNWWXX.js";function P2(c,l){(l==null||l>c.length)&&(l=c.length);for(var a=0,e=Array(l);a<l;a++)e[a]=c[a];return e}function h3(c){if(Array.isArray(c))return c}function g3(c){if(Array.isArray(c))return P2(c)}function C3(c,l){if(!(c instanceof l))throw new TypeError("Cannot call a class as a function")}function A1(c,l){for(var a=0;a<l.length;a++){var e=l[a];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(c,f4(e.key),e)}}function x3(c,l,a){return l&&A1(c.prototype,l),a&&A1(c,a),Object.defineProperty(c,"prototype",{writable:!1}),c}function i2(c,l){var a=typeof Symbol<"u"&&c[Symbol.iterator]||c["@@iterator"];if(!a){if(Array.isArray(c)||(a=_2(c))||l&&c&&typeof c.length=="number"){a&&(c=a);var e=0,r=function(){};return{s:r,n:function(){return e>=c.length?{done:!0}:{done:!1,value:c[e++]}},e:function(n){throw n},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var s,i=!0,f=!1;return{s:function(){a=a.call(c)},n:function(){var n=a.next();return i=n.done,n},e:function(n){f=!0,s=n},f:function(){try{i||a.return==null||a.return()}finally{if(f)throw s}}}}function u(c,l,a){return(l=f4(l))in c?Object.defineProperty(c,l,{value:a,enumerable:!0,configurable:!0,writable:!0}):c[l]=a,c}function S3(c){if(typeof Symbol<"u"&&c[Symbol.iterator]!=null||c["@@iterator"]!=null)return Array.from(c)}function N3(c,l){var a=c==null?null:typeof Symbol<"u"&&c[Symbol.iterator]||c["@@iterator"];if(a!=null){var e,r,s,i,f=[],n=!0,t=!1;try{if(s=(a=a.call(c)).next,l===0){if(Object(a)!==a)return;n=!1}else for(;!(n=(e=s.call(a)).done)&&(f.push(e.value),f.length!==l);n=!0);}catch(z){t=!0,r=z}finally{try{if(!n&&a.return!=null&&(i=a.return(),Object(i)!==i))return}finally{if(t)throw r}}return f}}function b3(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function y3(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function P1(c,l){var a=Object.keys(c);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(c);l&&(e=e.filter(function(r){return Object.getOwnPropertyDescriptor(c,r).enumerable})),a.push.apply(a,e)}return a}function o(c){for(var l=1;l<arguments.length;l++){var a=arguments[l]!=null?arguments[l]:{};l%2?P1(Object(a),!0).forEach(function(e){u(c,e,a[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(c,Object.getOwnPropertyDescriptors(a)):P1(Object(a)).forEach(function(e){Object.defineProperty(c,e,Object.getOwnPropertyDescriptor(a,e))})}return c}function z2(c,l){return h3(c)||N3(c,l)||_2(c,l)||b3()}function k(c){return g3(c)||S3(c)||_2(c)||y3()}function w3(c,l){if(typeof c!="object"||!c)return c;var a=c[Symbol.toPrimitive];if(a!==void 0){var e=a.call(c,l||"default");if(typeof e!="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return(l==="string"?String:Number)(c)}function f4(c){var l=w3(c,"string");return typeof l=="symbol"?l:l+""}function o2(c){"@babel/helpers - typeof";return o2=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(l){return typeof l}:function(l){return l&&typeof Symbol=="function"&&l.constructor===Symbol&&l!==Symbol.prototype?"symbol":typeof l},o2(c)}function _2(c,l){if(c){if(typeof c=="string")return P2(c,l);var a={}.toString.call(c).slice(8,-1);return a==="Object"&&c.constructor&&(a=c.constructor.name),a==="Map"||a==="Set"?Array.from(c):a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?P2(c,l):void 0}}var T1=function(){},V2={},n4={},o4=null,t4={mark:T1,measure:T1};try{typeof window<"u"&&(V2=window),typeof document<"u"&&(n4=document),typeof MutationObserver<"u"&&(o4=MutationObserver),typeof performance<"u"&&(t4=performance)}catch(c){}var k3=V2.navigator||{},F1=k3.userAgent,D1=F1===void 0?"":F1,R=V2,L=n4,B1=o4,r2=t4,c5=!!R.document,B=!!L.documentElement&&!!L.head&&typeof L.addEventListener=="function"&&typeof L.createElement=="function",m4=~D1.indexOf("MSIE")||~D1.indexOf("Trident/"),S2,A3=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,P3=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,z4={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},T3={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},p4=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],C="classic",J="duotone",u4="sharp",M4="sharp-duotone",d4="chisel",L4="etch",v4="graphite",h4="jelly",g4="jelly-duo",C4="jelly-fill",x4="notdog",S4="notdog-duo",N4="slab",b4="slab-press",y4="thumbprint",w4="utility",k4="utility-duo",A4="utility-fill",P4="whiteboard",F3="Classic",D3="Duotone",B3="Sharp",H3="Sharp Duotone",R3="Chisel",E3="Etch",U3="Graphite",I3="Jelly",W3="Jelly Duo",O3="Jelly Fill",q3="Notdog",G3="Notdog Duo",j3="Slab",_3="Slab Press",V3="Thumbprint",$3="Utility",X3="Utility Duo",Y3="Utility Fill",K3="Whiteboard",T4=[C,J,u4,M4,d4,L4,v4,h4,g4,C4,x4,S4,N4,b4,y4,w4,k4,A4,P4],a5=(S2={},u(u(u(u(u(u(u(u(u(u(S2,C,F3),J,D3),u4,B3),M4,H3),d4,R3),L4,E3),v4,U3),h4,I3),g4,W3),C4,O3),u(u(u(u(u(u(u(u(u(S2,x4,q3),S4,G3),N4,j3),b4,_3),y4,V3),w4,$3),k4,X3),A4,Y3),P4,K3)),Q3={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},J3={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},Z3=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),c0={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-press":{regular:"faslpr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},whiteboard:{semibold:"fawsb"}},F4=["fak","fa-kit","fakd","fa-kit-duotone"],H1={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},a0=["kit"],l0="kit",e0="kit-duotone",r0="Kit",s0="Kit Duotone",l5=u(u({},l0,r0),e0,s0),i0={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},f0={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},n0={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},R1={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},N2,s2={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},o0=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],t0="classic",m0="duotone",z0="sharp",p0="sharp-duotone",u0="chisel",M0="etch",d0="graphite",L0="jelly",v0="jelly-duo",h0="jelly-fill",g0="notdog",C0="notdog-duo",x0="slab",S0="slab-press",N0="thumbprint",b0="utility",y0="utility-duo",w0="utility-fill",k0="whiteboard",A0="Classic",P0="Duotone",T0="Sharp",F0="Sharp Duotone",D0="Chisel",B0="Etch",H0="Graphite",R0="Jelly",E0="Jelly Duo",U0="Jelly Fill",I0="Notdog",W0="Notdog Duo",O0="Slab",q0="Slab Press",G0="Thumbprint",j0="Utility",_0="Utility Duo",V0="Utility Fill",$0="Whiteboard",e5=(N2={},u(u(u(u(u(u(u(u(u(u(N2,t0,A0),m0,P0),z0,T0),p0,F0),u0,D0),M0,B0),d0,H0),L0,R0),v0,E0),h0,U0),u(u(u(u(u(u(u(u(u(N2,g0,I0),C0,W0),x0,O0),S0,q0),N0,G0),b0,j0),y0,_0),w0,V0),k0,$0)),X0="kit",Y0="kit-duotone",K0="Kit",Q0="Kit Duotone",r5=u(u({},X0,K0),Y0,Q0),J0={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},Z0={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},T2={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},c6=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],D4=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(o0,c6),a6=["solid","regular","light","thin","duotone","brands","semibold"],B4=[1,2,3,4,5,6,7,8,9,10],l6=B4.concat([11,12,13,14,15,16,17,18,19,20]),e6=["aw","fw","pull-left","pull-right"],r6=[].concat(k(Object.keys(Z0)),a6,e6,["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","inverse","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul","width-auto","width-fixed",s2.GROUP,s2.SWAP_OPACITY,s2.PRIMARY,s2.SECONDARY]).concat(B4.map(function(c){return"".concat(c,"x")})).concat(l6.map(function(c){return"w-".concat(c)})),s6={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},F="___FONT_AWESOME___",F2=16,H4="fa",R4="svg-inline--fa",W="data-fa-i2svg",D2="data-fa-pseudo-element",i6="data-fa-pseudo-element-pending",$2="data-prefix",X2="data-icon",E1="fontawesome-i2svg",f6="async",n6=["HTML","HEAD","STYLE","SCRIPT"],E4=["::before","::after",":before",":after"],U4=(function(){try{return!0}catch(c){return!1}})();function Z(c){return new Proxy(c,{get:function(a,e){return e in a?a[e]:a[C]}})}var I4=o({},z4);I4[C]=o(o(o(o({},{"fa-duotone":"duotone"}),z4[C]),H1.kit),H1["kit-duotone"]);var o6=Z(I4),B2=o({},c0);B2[C]=o(o(o(o({},{duotone:"fad"}),B2[C]),R1.kit),R1["kit-duotone"]);var U1=Z(B2),H2=o({},T2);H2[C]=o(o({},H2[C]),n0.kit);var Y2=Z(H2),R2=o({},J0);R2[C]=o(o({},R2[C]),i0.kit);var s5=Z(R2),t6=A3,W4="fa-layers-text",m6=P3,z6=o({},Q3),i5=Z(z6),p6=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],b2=T3,u6=[].concat(k(a0),k(r6)),Y=R.FontAwesomeConfig||{};function M6(c){var l=L.querySelector("script["+c+"]");if(l)return l.getAttribute(c)}function d6(c){return c===""?!0:c==="false"?!1:c==="true"?!0:c}L&&typeof L.querySelector=="function"&&(I1=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]],I1.forEach(function(c){var l=z2(c,2),a=l[0],e=l[1],r=d6(M6(a));r!=null&&(Y[e]=r)}));var I1,O4={styleDefault:"solid",familyDefault:C,cssPrefix:H4,replacementClass:R4,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};Y.familyPrefix&&(Y.cssPrefix=Y.familyPrefix);var _=o(o({},O4),Y);_.autoReplaceSvg||(_.observeMutations=!1);var p={};Object.keys(O4).forEach(function(c){Object.defineProperty(p,c,{enumerable:!0,set:function(a){_[c]=a,K.forEach(function(e){return e(p)})},get:function(){return _[c]}})});Object.defineProperty(p,"familyPrefix",{enumerable:!0,set:function(l){_.cssPrefix=l,K.forEach(function(a){return a(p)})},get:function(){return _.cssPrefix}});R.FontAwesomeConfig=p;var K=[];function L6(c){return K.push(c),function(){K.splice(K.indexOf(c),1)}}var H=F2,A={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function v6(c){if(!(!c||!B)){var l=L.createElement("style");l.setAttribute("type","text/css"),l.innerHTML=c;for(var a=L.head.childNodes,e=null,r=a.length-1;r>-1;r--){var s=a[r],i=(s.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(i)>-1&&(e=s)}return L.head.insertBefore(l,e),c}}var h6="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function W1(){for(var c=12,l="";c-- >0;)l+=h6[Math.random()*62|0];return l}function V(c){for(var l=[],a=(c||[]).length>>>0;a--;)l[a]=c[a];return l}function K2(c){return c.classList?V(c.classList):(c.getAttribute("class")||"").split(" ").filter(function(l){return l})}function q4(c){return"".concat(c).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function g6(c){return Object.keys(c||{}).reduce(function(l,a){return l+"".concat(a,'="').concat(q4(c[a]),'" ')},"").trim()}function p2(c){return Object.keys(c||{}).reduce(function(l,a){return l+"".concat(a,": ").concat(c[a].trim(),";")},"")}function Q2(c){return c.size!==A.size||c.x!==A.x||c.y!==A.y||c.rotate!==A.rotate||c.flipX||c.flipY}function C6(c){var l=c.transform,a=c.containerWidth,e=c.iconWidth,r={transform:"translate(".concat(a/2," 256)")},s="translate(".concat(l.x*32,", ").concat(l.y*32,") "),i="scale(".concat(l.size/16*(l.flipX?-1:1),", ").concat(l.size/16*(l.flipY?-1:1),") "),f="rotate(".concat(l.rotate," 0 0)"),n={transform:"".concat(s," ").concat(i," ").concat(f)},t={transform:"translate(".concat(e/2*-1," -256)")};return{outer:r,inner:n,path:t}}function x6(c){var l=c.transform,a=c.width,e=a===void 0?F2:a,r=c.height,s=r===void 0?F2:r,i=c.startCentered,f=i===void 0?!1:i,n="";return f&&m4?n+="translate(".concat(l.x/H-e/2,"em, ").concat(l.y/H-s/2,"em) "):f?n+="translate(calc(-50% + ".concat(l.x/H,"em), calc(-50% + ").concat(l.y/H,"em)) "):n+="translate(".concat(l.x/H,"em, ").concat(l.y/H,"em) "),n+="scale(".concat(l.size/H*(l.flipX?-1:1),", ").concat(l.size/H*(l.flipY?-1:1),") "),n+="rotate(".concat(l.rotate,"deg) "),n}var S6=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function G4(){var c=H4,l=R4,a=p.cssPrefix,e=p.replacementClass,r=S6;if(a!==c||e!==l){var s=new RegExp("\\.".concat(c,"\\-"),"g"),i=new RegExp("\\--".concat(c,"\\-"),"g"),f=new RegExp("\\.".concat(l),"g");r=r.replace(s,".".concat(a,"-")).replace(i,"--".concat(a,"-")).replace(f,".".concat(e))}return r}var O1=!1;function y2(){p.autoAddCss&&!O1&&(v6(G4()),O1=!0)}var N6={mixout:function(){return{dom:{css:G4,insertCss:y2}}},hooks:function(){return{beforeDOMElementCreation:function(){y2()},beforeI2svg:function(){y2()}}}},D=R||{};D[F]||(D[F]={});D[F].styles||(D[F].styles={});D[F].hooks||(D[F].hooks={});D[F].shims||(D[F].shims=[]);var w=D[F],j4=[],_4=function(){L.removeEventListener("DOMContentLoaded",_4),t2=1,j4.map(function(l){return l()})},t2=!1;B&&(t2=(L.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(L.readyState),t2||L.addEventListener("DOMContentLoaded",_4));function b6(c){B&&(t2?setTimeout(c,0):j4.push(c))}function c2(c){var l=c.tag,a=c.attributes,e=a===void 0?{}:a,r=c.children,s=r===void 0?[]:r;return typeof c=="string"?q4(c):"<".concat(l," ").concat(g6(e),">").concat(s.map(c2).join(""),"</").concat(l,">")}function q1(c,l,a){if(c&&c[l]&&c[l][a])return{prefix:l,iconName:a,icon:c[l][a]}}var y6=function(l,a){return function(e,r,s,i){return l.call(a,e,r,s,i)}},w2=function(l,a,e,r){var s=Object.keys(l),i=s.length,f=r!==void 0?y6(a,r):a,n,t,z;for(e===void 0?(n=1,z=l[s[0]]):(n=0,z=e);n<i;n++)t=s[n],z=f(z,l[t],t,l);return z};function V4(c){return k(c).length!==1?null:c.codePointAt(0).toString(16)}function G1(c){return Object.keys(c).reduce(function(l,a){var e=c[a],r=!!e.icon;return r?l[e.iconName]=e.icon:l[a]=e,l},{})}function E2(c,l){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},e=a.skipHooks,r=e===void 0?!1:e,s=G1(l);typeof w.hooks.addPack=="function"&&!r?w.hooks.addPack(c,G1(l)):w.styles[c]=o(o({},w.styles[c]||{}),s),c==="fas"&&E2("fa",l)}var Q=w.styles,w6=w.shims,$4=Object.keys(Y2),k6=$4.reduce(function(c,l){return c[l]=Object.keys(Y2[l]),c},{}),J2=null,X4={},Y4={},K4={},Q4={},J4={};function A6(c){return~u6.indexOf(c)}function P6(c,l){var a=l.split("-"),e=a[0],r=a.slice(1).join("-");return e===c&&r!==""&&!A6(r)?r:null}var Z4=function(){var l=function(s){return w2(Q,function(i,f,n){return i[n]=w2(f,s,{}),i},{})};X4=l(function(r,s,i){if(s[3]&&(r[s[3]]=i),s[2]){var f=s[2].filter(function(n){return typeof n=="number"});f.forEach(function(n){r[n.toString(16)]=i})}return r}),Y4=l(function(r,s,i){if(r[i]=i,s[2]){var f=s[2].filter(function(n){return typeof n=="string"});f.forEach(function(n){r[n]=i})}return r}),J4=l(function(r,s,i){var f=s[2];return r[i]=i,f.forEach(function(n){r[n]=i}),r});var a="far"in Q||p.autoFetchSvg,e=w2(w6,function(r,s){var i=s[0],f=s[1],n=s[2];return f==="far"&&!a&&(f="fas"),typeof i=="string"&&(r.names[i]={prefix:f,iconName:n}),typeof i=="number"&&(r.unicodes[i.toString(16)]={prefix:f,iconName:n}),r},{names:{},unicodes:{}});K4=e.names,Q4=e.unicodes,J2=u2(p.styleDefault,{family:p.familyDefault})};L6(function(c){J2=u2(c.styleDefault,{family:p.familyDefault})});Z4();function Z2(c,l){return(X4[c]||{})[l]}function T6(c,l){return(Y4[c]||{})[l]}function I(c,l){return(J4[c]||{})[l]}function c3(c){return K4[c]||{prefix:null,iconName:null}}function F6(c){var l=Q4[c],a=Z2("fas",c);return l||(a?{prefix:"fas",iconName:a}:null)||{prefix:null,iconName:null}}function E(){return J2}var a3=function(){return{prefix:null,iconName:null,rest:[]}};function D6(c){var l=C,a=$4.reduce(function(e,r){return e[r]="".concat(p.cssPrefix,"-").concat(r),e},{});return T4.forEach(function(e){(c.includes(a[e])||c.some(function(r){return k6[e].includes(r)}))&&(l=e)}),l}function u2(c){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=l.family,e=a===void 0?C:a,r=o6[e][c];if(e===J&&!c)return"fad";var s=U1[e][c]||U1[e][r],i=c in w.styles?c:null,f=s||i||null;return f}function B6(c){var l=[],a=null;return c.forEach(function(e){var r=P6(p.cssPrefix,e);r?a=r:e&&l.push(e)}),{iconName:a,rest:l}}function j1(c){return c.sort().filter(function(l,a,e){return e.indexOf(l)===a})}var _1=D4.concat(F4);function M2(c){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=l.skipLookups,e=a===void 0?!1:a,r=null,s=j1(c.filter(function(M){return _1.includes(M)})),i=j1(c.filter(function(M){return!_1.includes(M)})),f=s.filter(function(M){return r=M,!p4.includes(M)}),n=z2(f,1),t=n[0],z=t===void 0?null:t,m=D6(s),d=o(o({},B6(i)),{},{prefix:u2(z,{family:m})});return o(o(o({},d),U6({values:c,family:m,styles:Q,config:p,canonical:d,givenPrefix:r})),H6(e,r,d))}function H6(c,l,a){var e=a.prefix,r=a.iconName;if(c||!e||!r)return{prefix:e,iconName:r};var s=l==="fa"?c3(r):{},i=I(e,r);return r=s.iconName||i||r,e=s.prefix||e,e==="far"&&!Q.far&&Q.fas&&!p.autoFetchSvg&&(e="fas"),{prefix:e,iconName:r}}var R6=T4.filter(function(c){return c!==C||c!==J}),E6=Object.keys(T2).filter(function(c){return c!==C}).map(function(c){return Object.keys(T2[c])}).flat();function U6(c){var l=c.values,a=c.family,e=c.canonical,r=c.givenPrefix,s=r===void 0?"":r,i=c.styles,f=i===void 0?{}:i,n=c.config,t=n===void 0?{}:n,z=a===J,m=l.includes("fa-duotone")||l.includes("fad"),d=t.familyDefault==="duotone",M=e.prefix==="fad"||e.prefix==="fa-duotone";if(!z&&(m||d||M)&&(e.prefix="fad"),(l.includes("fa-brands")||l.includes("fab"))&&(e.prefix="fab"),!e.prefix&&R6.includes(a)){var h=Object.keys(f).find(function(x){return E6.includes(x)});if(h||t.autoFetchSvg){var v=Z3.get(a).defaultShortPrefixId;e.prefix=v,e.iconName=I(e.prefix,e.iconName)||e.iconName}}return(e.prefix==="fa"||s==="fa")&&(e.prefix=E()||"fas"),e}var I6=(function(){function c(){C3(this,c),this.definitions={}}return x3(c,[{key:"add",value:function(){for(var a=this,e=arguments.length,r=new Array(e),s=0;s<e;s++)r[s]=arguments[s];var i=r.reduce(this._pullDefinitions,{});Object.keys(i).forEach(function(f){a.definitions[f]=o(o({},a.definitions[f]||{}),i[f]),E2(f,i[f]);var n=Y2[C][f];n&&E2(n,i[f]),Z4()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(a,e){var r=e.prefix&&e.iconName&&e.icon?{0:e}:e;return Object.keys(r).map(function(s){var i=r[s],f=i.prefix,n=i.iconName,t=i.icon,z=t[2];a[f]||(a[f]={}),z.length>0&&z.forEach(function(m){typeof m=="string"&&(a[f][m]=t)}),a[f][n]=t}),a}}])})(),V1=[],G={},j={},W6=Object.keys(j);function O6(c,l){var a=l.mixoutsTo;return V1=c,G={},Object.keys(j).forEach(function(e){W6.indexOf(e)===-1&&delete j[e]}),V1.forEach(function(e){var r=e.mixout?e.mixout():{};if(Object.keys(r).forEach(function(i){typeof r[i]=="function"&&(a[i]=r[i]),o2(r[i])==="object"&&Object.keys(r[i]).forEach(function(f){a[i]||(a[i]={}),a[i][f]=r[i][f]})}),e.hooks){var s=e.hooks();Object.keys(s).forEach(function(i){G[i]||(G[i]=[]),G[i].push(s[i])})}e.provides&&e.provides(j)}),a}function U2(c,l){for(var a=arguments.length,e=new Array(a>2?a-2:0),r=2;r<a;r++)e[r-2]=arguments[r];var s=G[c]||[];return s.forEach(function(i){l=i.apply(null,[l].concat(e))}),l}function O(c){for(var l=arguments.length,a=new Array(l>1?l-1:0),e=1;e<l;e++)a[e-1]=arguments[e];var r=G[c]||[];r.forEach(function(s){s.apply(null,a)})}function U(){var c=arguments[0],l=Array.prototype.slice.call(arguments,1);return j[c]?j[c].apply(null,l):void 0}function I2(c){c.prefix==="fa"&&(c.prefix="fas");var l=c.iconName,a=c.prefix||E();if(l)return l=I(a,l)||l,q1(l3.definitions,a,l)||q1(w.styles,a,l)}var l3=new I6,q6=function(){p.autoReplaceSvg=!1,p.observeMutations=!1,O("noAuto")},G6={i2svg:function(){var l=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return B?(O("beforeI2svg",l),U("pseudoElements2svg",l),U("i2svg",l)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var l=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=l.autoReplaceSvgRoot;p.autoReplaceSvg===!1&&(p.autoReplaceSvg=!0),p.observeMutations=!0,b6(function(){_6({autoReplaceSvgRoot:a}),O("watch",l)})}},j6={icon:function(l){if(l===null)return null;if(o2(l)==="object"&&l.prefix&&l.iconName)return{prefix:l.prefix,iconName:I(l.prefix,l.iconName)||l.iconName};if(Array.isArray(l)&&l.length===2){var a=l[1].indexOf("fa-")===0?l[1].slice(3):l[1],e=u2(l[0]);return{prefix:e,iconName:I(e,a)||a}}if(typeof l=="string"&&(l.indexOf("".concat(p.cssPrefix,"-"))>-1||l.match(t6))){var r=M2(l.split(" "),{skipLookups:!0});return{prefix:r.prefix||E(),iconName:I(r.prefix,r.iconName)||r.iconName}}if(typeof l=="string"){var s=E();return{prefix:s,iconName:I(s,l)||l}}}},b={noAuto:q6,config:p,dom:G6,parse:j6,library:l3,findIconDefinition:I2,toHtml:c2},_6=function(){var l=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=l.autoReplaceSvgRoot,e=a===void 0?L:a;(Object.keys(w.styles).length>0||p.autoFetchSvg)&&B&&p.autoReplaceSvg&&b.dom.i2svg({node:e})};function d2(c,l){return Object.defineProperty(c,"abstract",{get:l}),Object.defineProperty(c,"html",{get:function(){return c.abstract.map(function(e){return c2(e)})}}),Object.defineProperty(c,"node",{get:function(){if(B){var e=L.createElement("div");return e.innerHTML=c.html,e.children}}}),c}function V6(c){var l=c.children,a=c.main,e=c.mask,r=c.attributes,s=c.styles,i=c.transform;if(Q2(i)&&a.found&&!e.found){var f=a.width,n=a.height,t={x:f/n/2,y:.5};r.style=p2(o(o({},s),{},{"transform-origin":"".concat(t.x+i.x/16,"em ").concat(t.y+i.y/16,"em")}))}return[{tag:"svg",attributes:r,children:l}]}function $6(c){var l=c.prefix,a=c.iconName,e=c.children,r=c.attributes,s=c.symbol,i=s===!0?"".concat(l,"-").concat(p.cssPrefix,"-").concat(a):s;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:o(o({},r),{},{id:i}),children:e}]}]}function X6(c){var l=["aria-label","aria-labelledby","title","role"];return l.some(function(a){return a in c})}function c1(c){var l=c.icons,a=l.main,e=l.mask,r=c.prefix,s=c.iconName,i=c.transform,f=c.symbol,n=c.maskId,t=c.extra,z=c.watchable,m=z===void 0?!1:z,d=e.found?e:a,M=d.width,h=d.height,v=[p.replacementClass,s?"".concat(p.cssPrefix,"-").concat(s):""].filter(function(P){return t.classes.indexOf(P)===-1}).filter(function(P){return P!==""||!!P}).concat(t.classes).join(" "),x={children:[],attributes:o(o({},t.attributes),{},{"data-prefix":r,"data-icon":s,class:v,role:t.attributes.role||"img",viewBox:"0 0 ".concat(M," ").concat(h)})};!X6(t.attributes)&&!t.attributes["aria-hidden"]&&(x.attributes["aria-hidden"]="true"),m&&(x.attributes[W]="");var g=o(o({},x),{},{prefix:r,iconName:s,main:a,mask:e,maskId:n,transform:i,symbol:f,styles:o({},t.styles)}),N=e.found&&a.found?U("generateAbstractMask",g)||{children:[],attributes:{}}:U("generateAbstractIcon",g)||{children:[],attributes:{}},y=N.children,q=N.attributes;return g.children=y,g.attributes=q,f?$6(g):V6(g)}function $1(c){var l=c.content,a=c.width,e=c.height,r=c.transform,s=c.extra,i=c.watchable,f=i===void 0?!1:i,n=o(o({},s.attributes),{},{class:s.classes.join(" ")});f&&(n[W]="");var t=o({},s.styles);Q2(r)&&(t.transform=x6({transform:r,startCentered:!0,width:a,height:e}),t["-webkit-transform"]=t.transform);var z=p2(t);z.length>0&&(n.style=z);var m=[];return m.push({tag:"span",attributes:n,children:[l]}),m}function Y6(c){var l=c.content,a=c.extra,e=o(o({},a.attributes),{},{class:a.classes.join(" ")}),r=p2(a.styles);r.length>0&&(e.style=r);var s=[];return s.push({tag:"span",attributes:e,children:[l]}),s}var k2=w.styles;function W2(c){var l=c[0],a=c[1],e=c.slice(4),r=z2(e,1),s=r[0],i=null;return Array.isArray(s)?i={tag:"g",attributes:{class:"".concat(p.cssPrefix,"-").concat(b2.GROUP)},children:[{tag:"path",attributes:{class:"".concat(p.cssPrefix,"-").concat(b2.SECONDARY),fill:"currentColor",d:s[0]}},{tag:"path",attributes:{class:"".concat(p.cssPrefix,"-").concat(b2.PRIMARY),fill:"currentColor",d:s[1]}}]}:i={tag:"path",attributes:{fill:"currentColor",d:s}},{found:!0,width:l,height:a,icon:i}}var K6={found:!1,width:512,height:512};function Q6(c,l){!U4&&!p.showMissingIcons&&c&&console.error('Icon with name "'.concat(c,'" and prefix "').concat(l,'" is missing.'))}function O2(c,l){var a=l;return l==="fa"&&p.styleDefault!==null&&(l=E()),new Promise(function(e,r){if(a==="fa"){var s=c3(c)||{};c=s.iconName||c,l=s.prefix||l}if(c&&l&&k2[l]&&k2[l][c]){var i=k2[l][c];return e(W2(i))}Q6(c,l),e(o(o({},K6),{},{icon:p.showMissingIcons&&c?U("missingIconAbstract")||{}:{}}))})}var X1=function(){},q2=p.measurePerformance&&r2&&r2.mark&&r2.measure?r2:{mark:X1,measure:X1},X='FA "7.2.0"',J6=function(l){return q2.mark("".concat(X," ").concat(l," begins")),function(){return e3(l)}},e3=function(l){q2.mark("".concat(X," ").concat(l," ends")),q2.measure("".concat(X," ").concat(l),"".concat(X," ").concat(l," begins"),"".concat(X," ").concat(l," ends"))},a1={begin:J6,end:e3},f2=function(){};function Y1(c){var l=c.getAttribute?c.getAttribute(W):null;return typeof l=="string"}function Z6(c){var l=c.getAttribute?c.getAttribute($2):null,a=c.getAttribute?c.getAttribute(X2):null;return l&&a}function c8(c){return c&&c.classList&&c.classList.contains&&c.classList.contains(p.replacementClass)}function a8(){if(p.autoReplaceSvg===!0)return n2.replace;var c=n2[p.autoReplaceSvg];return c||n2.replace}function l8(c){return L.createElementNS("http://www.w3.org/2000/svg",c)}function e8(c){return L.createElement(c)}function r3(c){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=l.ceFn,e=a===void 0?c.tag==="svg"?l8:e8:a;if(typeof c=="string")return L.createTextNode(c);var r=e(c.tag);Object.keys(c.attributes||[]).forEach(function(i){r.setAttribute(i,c.attributes[i])});var s=c.children||[];return s.forEach(function(i){r.appendChild(r3(i,{ceFn:e}))}),r}function r8(c){var l=" ".concat(c.outerHTML," ");return l="".concat(l,"Font Awesome fontawesome.com "),l}var n2={replace:function(l){var a=l[0];if(a.parentNode)if(l[1].forEach(function(r){a.parentNode.insertBefore(r3(r),a)}),a.getAttribute(W)===null&&p.keepOriginalSource){var e=L.createComment(r8(a));a.parentNode.replaceChild(e,a)}else a.remove()},nest:function(l){var a=l[0],e=l[1];if(~K2(a).indexOf(p.replacementClass))return n2.replace(l);var r=new RegExp("".concat(p.cssPrefix,"-.*"));if(delete e[0].attributes.id,e[0].attributes.class){var s=e[0].attributes.class.split(" ").reduce(function(f,n){return n===p.replacementClass||n.match(r)?f.toSvg.push(n):f.toNode.push(n),f},{toNode:[],toSvg:[]});e[0].attributes.class=s.toSvg.join(" "),s.toNode.length===0?a.removeAttribute("class"):a.setAttribute("class",s.toNode.join(" "))}var i=e.map(function(f){return c2(f)}).join(`
`);a.setAttribute(W,""),a.innerHTML=i}};function K1(c){c()}function s3(c,l){var a=typeof l=="function"?l:f2;if(c.length===0)a();else{var e=K1;p.mutateApproach===f6&&(e=R.requestAnimationFrame||K1),e(function(){var r=a8(),s=a1.begin("mutate");c.map(r),s(),a()})}}var l1=!1;function i3(){l1=!0}function G2(){l1=!1}var m2=null;function Q1(c){if(B1&&p.observeMutations){var l=c.treeCallback,a=l===void 0?f2:l,e=c.nodeCallback,r=e===void 0?f2:e,s=c.pseudoElementsCallback,i=s===void 0?f2:s,f=c.observeMutationsRoot,n=f===void 0?L:f;m2=new B1(function(t){if(!l1){var z=E();V(t).forEach(function(m){if(m.type==="childList"&&m.addedNodes.length>0&&!Y1(m.addedNodes[0])&&(p.searchPseudoElements&&i(m.target),a(m.target)),m.type==="attributes"&&m.target.parentNode&&p.searchPseudoElements&&i([m.target],!0),m.type==="attributes"&&Y1(m.target)&&~p6.indexOf(m.attributeName))if(m.attributeName==="class"&&Z6(m.target)){var d=M2(K2(m.target)),M=d.prefix,h=d.iconName;m.target.setAttribute($2,M||z),h&&m.target.setAttribute(X2,h)}else c8(m.target)&&r(m.target)})}}),B&&m2.observe(n,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function s8(){m2&&m2.disconnect()}function i8(c){var l=c.getAttribute("style"),a=[];return l&&(a=l.split(";").reduce(function(e,r){var s=r.split(":"),i=s[0],f=s.slice(1);return i&&f.length>0&&(e[i]=f.join(":").trim()),e},{})),a}function f8(c){var l=c.getAttribute("data-prefix"),a=c.getAttribute("data-icon"),e=c.innerText!==void 0?c.innerText.trim():"",r=M2(K2(c));return r.prefix||(r.prefix=E()),l&&a&&(r.prefix=l,r.iconName=a),r.iconName&&r.prefix||(r.prefix&&e.length>0&&(r.iconName=T6(r.prefix,c.innerText)||Z2(r.prefix,V4(c.innerText))),!r.iconName&&p.autoFetchSvg&&c.firstChild&&c.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=c.firstChild.data)),r}function n8(c){var l=V(c.attributes).reduce(function(a,e){return a.name!=="class"&&a.name!=="style"&&(a[e.name]=e.value),a},{});return l}function o8(){return{iconName:null,prefix:null,transform:A,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function J1(c){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},a=f8(c),e=a.iconName,r=a.prefix,s=a.rest,i=n8(c),f=U2("parseNodeAttributes",{},c),n=l.styleParser?i8(c):[];return o({iconName:e,prefix:r,transform:A,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:s,styles:n,attributes:i}},f)}var t8=w.styles;function f3(c){var l=p.autoReplaceSvg==="nest"?J1(c,{styleParser:!1}):J1(c);return~l.extra.classes.indexOf(W4)?U("generateLayersText",c,l):U("generateSvgReplacementMutation",c,l)}function m8(){return[].concat(k(F4),k(D4))}function Z1(c){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!B)return Promise.resolve();var a=L.documentElement.classList,e=function(m){return a.add("".concat(E1,"-").concat(m))},r=function(m){return a.remove("".concat(E1,"-").concat(m))},s=p.autoFetchSvg?m8():p4.concat(Object.keys(t8));s.includes("fa")||s.push("fa");var i=[".".concat(W4,":not([").concat(W,"])")].concat(s.map(function(z){return".".concat(z,":not([").concat(W,"])")})).join(", ");if(i.length===0)return Promise.resolve();var f=[];try{f=V(c.querySelectorAll(i))}catch(z){}if(f.length>0)e("pending"),r("complete");else return Promise.resolve();var n=a1.begin("onTree"),t=f.reduce(function(z,m){try{var d=f3(m);d&&z.push(d)}catch(M){U4||M.name==="MissingIcon"&&console.error(M)}return z},[]);return new Promise(function(z,m){Promise.all(t).then(function(d){s3(d,function(){e("active"),e("complete"),r("pending"),typeof l=="function"&&l(),n(),z()})}).catch(function(d){n(),m(d)})})}function z8(c){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;f3(c).then(function(a){a&&s3([a],l)})}function p8(c){return function(l){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=(l||{}).icon?l:I2(l||{}),r=a.mask;return r&&(r=(r||{}).icon?r:I2(r||{})),c(e,o(o({},a),{},{mask:r}))}}var u8=function(l){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=a.transform,r=e===void 0?A:e,s=a.symbol,i=s===void 0?!1:s,f=a.mask,n=f===void 0?null:f,t=a.maskId,z=t===void 0?null:t,m=a.classes,d=m===void 0?[]:m,M=a.attributes,h=M===void 0?{}:M,v=a.styles,x=v===void 0?{}:v;if(l){var g=l.prefix,N=l.iconName,y=l.icon;return d2(o({type:"icon"},l),function(){return O("beforeDOMElementCreation",{iconDefinition:l,params:a}),c1({icons:{main:W2(y),mask:n?W2(n.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:N,transform:o(o({},A),r),symbol:i,maskId:z,extra:{attributes:h,styles:x,classes:d}})})}},M8={mixout:function(){return{icon:p8(u8)}},hooks:function(){return{mutationObserverCallbacks:function(a){return a.treeCallback=Z1,a.nodeCallback=z8,a}}},provides:function(l){l.i2svg=function(a){var e=a.node,r=e===void 0?L:e,s=a.callback,i=s===void 0?function(){}:s;return Z1(r,i)},l.generateSvgReplacementMutation=function(a,e){var r=e.iconName,s=e.prefix,i=e.transform,f=e.symbol,n=e.mask,t=e.maskId,z=e.extra;return new Promise(function(m,d){Promise.all([O2(r,s),n.iconName?O2(n.iconName,n.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(M){var h=z2(M,2),v=h[0],x=h[1];m([a,c1({icons:{main:v,mask:x},prefix:s,iconName:r,transform:i,symbol:f,maskId:t,extra:z,watchable:!0})])}).catch(d)})},l.generateAbstractIcon=function(a){var e=a.children,r=a.attributes,s=a.main,i=a.transform,f=a.styles,n=p2(f);n.length>0&&(r.style=n);var t;return Q2(i)&&(t=U("generateAbstractTransformGrouping",{main:s,transform:i,containerWidth:s.width,iconWidth:s.width})),e.push(t||s.icon),{children:e,attributes:r}}}},d8={mixout:function(){return{layer:function(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.classes,s=r===void 0?[]:r;return d2({type:"layer"},function(){O("beforeDOMElementCreation",{assembler:a,params:e});var i=[];return a(function(f){Array.isArray(f)?f.map(function(n){i=i.concat(n.abstract)}):i=i.concat(f.abstract)}),[{tag:"span",attributes:{class:["".concat(p.cssPrefix,"-layers")].concat(k(s)).join(" ")},children:i}]})}}}},L8={mixout:function(){return{counter:function(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.title,s=r===void 0?null:r,i=e.classes,f=i===void 0?[]:i,n=e.attributes,t=n===void 0?{}:n,z=e.styles,m=z===void 0?{}:z;return d2({type:"counter",content:a},function(){return O("beforeDOMElementCreation",{content:a,params:e}),Y6({content:a.toString(),title:s,extra:{attributes:t,styles:m,classes:["".concat(p.cssPrefix,"-layers-counter")].concat(k(f))}})})}}}},v8={mixout:function(){return{text:function(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.transform,s=r===void 0?A:r,i=e.classes,f=i===void 0?[]:i,n=e.attributes,t=n===void 0?{}:n,z=e.styles,m=z===void 0?{}:z;return d2({type:"text",content:a},function(){return O("beforeDOMElementCreation",{content:a,params:e}),$1({content:a,transform:o(o({},A),s),extra:{attributes:t,styles:m,classes:["".concat(p.cssPrefix,"-layers-text")].concat(k(f))}})})}}},provides:function(l){l.generateLayersText=function(a,e){var r=e.transform,s=e.extra,i=null,f=null;if(m4){var n=parseInt(getComputedStyle(a).fontSize,10),t=a.getBoundingClientRect();i=t.width/n,f=t.height/n}return Promise.resolve([a,$1({content:a.innerHTML,width:i,height:f,transform:r,extra:s,watchable:!0})])}}},n3=new RegExp('"',"ug"),c4=[1105920,1112319],a4=o(o(o(o({},{FontAwesome:{normal:"fas",400:"fas"}}),J3),s6),f0),j2=Object.keys(a4).reduce(function(c,l){return c[l.toLowerCase()]=a4[l],c},{}),h8=Object.keys(j2).reduce(function(c,l){var a=j2[l];return c[l]=a[900]||k(Object.entries(a))[0][1],c},{});function g8(c){var l=c.replace(n3,"");return V4(k(l)[0]||"")}function C8(c){var l=c.getPropertyValue("font-feature-settings").includes("ss01"),a=c.getPropertyValue("content"),e=a.replace(n3,""),r=e.codePointAt(0),s=r>=c4[0]&&r<=c4[1],i=e.length===2?e[0]===e[1]:!1;return s||i||l}function x8(c,l){var a=c.replace(/^['"]|['"]$/g,"").toLowerCase(),e=parseInt(l),r=isNaN(e)?"normal":e;return(j2[a]||{})[r]||h8[a]}function l4(c,l){var a="".concat(i6).concat(l.replace(":","-"));return new Promise(function(e,r){if(c.getAttribute(a)!==null)return e();var s=V(c.children),i=s.filter(function(L2){return L2.getAttribute(D2)===l})[0],f=R.getComputedStyle(c,l),n=f.getPropertyValue("font-family"),t=n.match(m6),z=f.getPropertyValue("font-weight"),m=f.getPropertyValue("content");if(i&&!t)return c.removeChild(i),e();if(t&&m!=="none"&&m!==""){var d=f.getPropertyValue("content"),M=x8(n,z),h=g8(d),v=t[0].startsWith("FontAwesome"),x=C8(f),g=Z2(M,h),N=g;if(v){var y=F6(h);y.iconName&&y.prefix&&(g=y.iconName,M=y.prefix)}if(g&&!x&&(!i||i.getAttribute($2)!==M||i.getAttribute(X2)!==N)){c.setAttribute(a,N),i&&c.removeChild(i);var q=o8(),P=q.extra;P.attributes[D2]=l,O2(g,M).then(function(L2){var L3=c1(o(o({},q),{},{icons:{main:L2,mask:a3()},prefix:M,iconName:N,extra:P,watchable:!0})),v2=L.createElementNS("http://www.w3.org/2000/svg","svg");l==="::before"?c.insertBefore(v2,c.firstChild):c.appendChild(v2),v2.outerHTML=L3.map(function(v3){return c2(v3)}).join(`
`),c.removeAttribute(a),e()}).catch(r)}else e()}else e()})}function S8(c){return Promise.all([l4(c,"::before"),l4(c,"::after")])}function N8(c){return c.parentNode!==document.head&&!~n6.indexOf(c.tagName.toUpperCase())&&!c.getAttribute(D2)&&(!c.parentNode||c.parentNode.tagName!=="svg")}var b8=function(l){return!!l&&E4.some(function(a){return l.includes(a)})},y8=function(l){if(!l)return[];var a=new Set,e=l.split(/,(?![^()]*\))/).map(function(n){return n.trim()});e=e.flatMap(function(n){return n.includes("(")?n:n.split(",").map(function(t){return t.trim()})});var r=i2(e),s;try{for(r.s();!(s=r.n()).done;){var i=s.value;if(b8(i)){var f=E4.reduce(function(n,t){return n.replace(t,"")},i);f!==""&&f!=="*"&&a.add(f)}}}catch(n){r.e(n)}finally{r.f()}return a};function e4(c){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(B){var a;if(l)a=c;else if(p.searchPseudoElementsFullScan)a=c.querySelectorAll("*");else{var e=new Set,r=i2(document.styleSheets),s;try{for(r.s();!(s=r.n()).done;){var i=s.value;try{var f=i2(i.cssRules),n;try{for(f.s();!(n=f.n()).done;){var t=n.value,z=y8(t.selectorText),m=i2(z),d;try{for(m.s();!(d=m.n()).done;){var M=d.value;e.add(M)}}catch(v){m.e(v)}finally{m.f()}}}catch(v){f.e(v)}finally{f.f()}}catch(v){p.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(i.href," (").concat(v.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(v){r.e(v)}finally{r.f()}if(!e.size)return;var h=Array.from(e).join(", ");try{a=c.querySelectorAll(h)}catch(v){}}return new Promise(function(v,x){var g=V(a).filter(N8).map(S8),N=a1.begin("searchPseudoElements");i3(),Promise.all(g).then(function(){N(),G2(),v()}).catch(function(){N(),G2(),x()})})}}var w8={hooks:function(){return{mutationObserverCallbacks:function(a){return a.pseudoElementsCallback=e4,a}}},provides:function(l){l.pseudoElements2svg=function(a){var e=a.node,r=e===void 0?L:e;p.searchPseudoElements&&e4(r)}}},r4=!1,k8={mixout:function(){return{dom:{unwatch:function(){i3(),r4=!0}}}},hooks:function(){return{bootstrap:function(){Q1(U2("mutationObserverCallbacks",{}))},noAuto:function(){s8()},watch:function(a){var e=a.observeMutationsRoot;r4?G2():Q1(U2("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}},s4=function(l){var a={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return l.toLowerCase().split(" ").reduce(function(e,r){var s=r.toLowerCase().split("-"),i=s[0],f=s.slice(1).join("-");if(i&&f==="h")return e.flipX=!0,e;if(i&&f==="v")return e.flipY=!0,e;if(f=parseFloat(f),isNaN(f))return e;switch(i){case"grow":e.size=e.size+f;break;case"shrink":e.size=e.size-f;break;case"left":e.x=e.x-f;break;case"right":e.x=e.x+f;break;case"up":e.y=e.y-f;break;case"down":e.y=e.y+f;break;case"rotate":e.rotate=e.rotate+f;break}return e},a)},A8={mixout:function(){return{parse:{transform:function(a){return s4(a)}}}},hooks:function(){return{parseNodeAttributes:function(a,e){var r=e.getAttribute("data-fa-transform");return r&&(a.transform=s4(r)),a}}},provides:function(l){l.generateAbstractTransformGrouping=function(a){var e=a.main,r=a.transform,s=a.containerWidth,i=a.iconWidth,f={transform:"translate(".concat(s/2," 256)")},n="translate(".concat(r.x*32,", ").concat(r.y*32,") "),t="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),z="rotate(".concat(r.rotate," 0 0)"),m={transform:"".concat(n," ").concat(t," ").concat(z)},d={transform:"translate(".concat(i/2*-1," -256)")},M={outer:f,inner:m,path:d};return{tag:"g",attributes:o({},M.outer),children:[{tag:"g",attributes:o({},M.inner),children:[{tag:e.icon.tag,children:e.icon.children,attributes:o(o({},e.icon.attributes),M.path)}]}]}}}},A2={x:0,y:0,width:"100%",height:"100%"};function i4(c){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return c.attributes&&(c.attributes.fill||l)&&(c.attributes.fill="black"),c}function P8(c){return c.tag==="g"?c.children:[c]}var T8={hooks:function(){return{parseNodeAttributes:function(a,e){var r=e.getAttribute("data-fa-mask"),s=r?M2(r.split(" ").map(function(i){return i.trim()})):a3();return s.prefix||(s.prefix=E()),a.mask=s,a.maskId=e.getAttribute("data-fa-mask-id"),a}}},provides:function(l){l.generateAbstractMask=function(a){var e=a.children,r=a.attributes,s=a.main,i=a.mask,f=a.maskId,n=a.transform,t=s.width,z=s.icon,m=i.width,d=i.icon,M=C6({transform:n,containerWidth:m,iconWidth:t}),h={tag:"rect",attributes:o(o({},A2),{},{fill:"white"})},v=z.children?{children:z.children.map(i4)}:{},x={tag:"g",attributes:o({},M.inner),children:[i4(o({tag:z.tag,attributes:o(o({},z.attributes),M.path)},v))]},g={tag:"g",attributes:o({},M.outer),children:[x]},N="mask-".concat(f||W1()),y="clip-".concat(f||W1()),q={tag:"mask",attributes:o(o({},A2),{},{id:N,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[h,g]},P={tag:"defs",children:[{tag:"clipPath",attributes:{id:y},children:P8(d)},q]};return e.push(P,{tag:"rect",attributes:o({fill:"currentColor","clip-path":"url(#".concat(y,")"),mask:"url(#".concat(N,")")},A2)}),{children:e,attributes:r}}}},F8={provides:function(l){var a=!1;R.matchMedia&&(a=R.matchMedia("(prefers-reduced-motion: reduce)").matches),l.missingIconAbstract=function(){var e=[],r={fill:"currentColor"},s={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};e.push({tag:"path",attributes:o(o({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var i=o(o({},s),{},{attributeName:"opacity"}),f={tag:"circle",attributes:o(o({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return a||f.children.push({tag:"animate",attributes:o(o({},s),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:o(o({},i),{},{values:"1;0;1;1;0;1;"})}),e.push(f),e.push({tag:"path",attributes:o(o({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:a?[]:[{tag:"animate",attributes:o(o({},i),{},{values:"1;0;0;0;0;1;"})}]}),a||e.push({tag:"path",attributes:o(o({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:o(o({},i),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:e}}}},D8={hooks:function(){return{parseNodeAttributes:function(a,e){var r=e.getAttribute("data-fa-symbol"),s=r===null?!1:r===""?!0:r;return a.symbol=s,a}}}},B8=[N6,M8,d8,L8,v8,w8,k8,A8,T8,F8,D8];O6(B8,{mixoutsTo:b});var f5=b.noAuto,o3=b.config,n5=b.library,t3=b.dom,m3=b.parse,o5=b.findIconDefinition,t5=b.toHtml,z3=b.icon,m5=b.layer,H8=b.text,R8=b.counter;var U8=["*"],I8=(()=>{class c{defaultPrefix="fas";fallbackIcon=null;fixedWidth;set autoAddCss(a){o3.autoAddCss=a,this._autoAddCss=a}get autoAddCss(){return this._autoAddCss}_autoAddCss=!0;static \u0275fac=function(e){return new(e||c)};static \u0275prov=h2({token:c,factory:c.\u0275fac,providedIn:"root"})}return c})(),W8=(()=>{class c{definitions={};addIcons(...a){for(let e of a){e.prefix in this.definitions||(this.definitions[e.prefix]={}),this.definitions[e.prefix][e.iconName]=e;for(let r of e.icon[2])typeof r=="string"&&(this.definitions[e.prefix][r]=e)}}addIconPacks(...a){for(let e of a){let r=Object.keys(e).map(s=>e[s]);this.addIcons(...r)}}getIconDefinition(a,e){return a in this.definitions&&e in this.definitions[a]?this.definitions[a][e]:null}static \u0275fac=function(e){return new(e||c)};static \u0275prov=h2({token:c,factory:c.\u0275fac,providedIn:"root"})}return c})(),O8=c=>{throw new Error(`Could not find icon with iconName=${c.iconName} and prefix=${c.prefix} in the icon library.`)},q8=()=>{throw new Error("Property `icon` is required for `fa-icon`/`fa-duotone-icon` components.")},u3=c=>c!=null&&(c===90||c===180||c===270||c==="90"||c==="180"||c==="270"),G8=c=>{let l=u3(c.rotate),a={[`fa-${c.animation}`]:c.animation!=null&&!c.animation.startsWith("spin"),"fa-spin":c.animation==="spin"||c.animation==="spin-reverse","fa-spin-pulse":c.animation==="spin-pulse"||c.animation==="spin-pulse-reverse","fa-spin-reverse":c.animation==="spin-reverse"||c.animation==="spin-pulse-reverse","fa-pulse":c.animation==="spin-pulse"||c.animation==="spin-pulse-reverse","fa-fw":c.fixedWidth,"fa-border":c.border,"fa-inverse":c.inverse,"fa-layers-counter":c.counter,"fa-flip-horizontal":c.flip==="horizontal"||c.flip==="both","fa-flip-vertical":c.flip==="vertical"||c.flip==="both",[`fa-${c.size}`]:c.size!==null,[`fa-rotate-${c.rotate}`]:l,"fa-rotate-by":c.rotate!=null&&!l,[`fa-pull-${c.pull}`]:c.pull!==null,[`fa-stack-${c.stackItemSize}`]:c.stackItemSize!=null};return Object.keys(a).map(e=>a[e]?e:null).filter(e=>e!=null)},e1=new WeakSet,p3="fa-auto-css";function j8(c,l){if(!l.autoAddCss||e1.has(c))return;if(c.getElementById(p3)!=null){l.autoAddCss=!1,e1.add(c);return}let a=c.createElement("style");a.setAttribute("type","text/css"),a.setAttribute("id",p3),a.innerHTML=t3.css();let e=c.head.childNodes,r=null;for(let s=e.length-1;s>-1;s--){let i=e[s],f=i.nodeName.toUpperCase();["STYLE","LINK"].indexOf(f)>-1&&(r=i)}c.head.insertBefore(a,r),l.autoAddCss=!1,e1.add(c)}var _8=c=>c.prefix!==void 0&&c.iconName!==void 0,V8=(c,l)=>_8(c)?c:Array.isArray(c)&&c.length===2?{prefix:c[0],iconName:c[1]}:{prefix:l,iconName:c},$8=(()=>{class c{stackItemSize=l2("1x");size=l2();_effect=t1(()=>{if(this.size())throw new Error('fa-icon is not allowed to customize size when used inside fa-stack. Set size on the enclosing fa-stack instead: <fa-stack size="4x">...</fa-stack>.')});static \u0275fac=function(e){return new(e||c)};static \u0275dir=M1({type:c,selectors:[["fa-icon","stackItemSize",""],["fa-duotone-icon","stackItemSize",""]],inputs:{stackItemSize:[1,"stackItemSize"],size:[1,"size"]}})}return c})(),X8=(()=>{class c{size=l2();classes=x2(()=>{let a=this.size(),e=a?{[`fa-${a}`]:!0}:{};return s1(r1({},e),{"fa-stack":!0})});static \u0275fac=function(e){return new(e||c)};static \u0275cmp=$({type:c,selectors:[["fa-stack"]],hostVars:2,hostBindings:function(e,r){e&2&&w1(r.classes())},inputs:{size:[1,"size"]},ngContentSelectors:U8,decls:1,vars:0,template:function(e,r){e&1&&(b1(),y1(0))},encapsulation:2,changeDetection:0})}return c})(),M3=(()=>{class c{icon=S();title=S();animation=S();mask=S();flip=S();size=S();pull=S();border=S();inverse=S();symbol=S();rotate=S();fixedWidth=S();transform=S();a11yRole=S();renderedIconHTML=x2(()=>{let a=this.icon()??this.config.fallbackIcon;if(!a)return q8(),"";let e=this.findIconDefinition(a);if(!e)return"";let r=this.buildParams();j8(this.document,this.config);let s=z3(e,r);return this.sanitizer.bypassSecurityTrustHtml(s.html.join(`
`))});document=T(a2);sanitizer=T(k1);config=T(I8);iconLibrary=T(W8);stackItem=T($8,{optional:!0});stack=T(X8,{optional:!0});constructor(){this.stack!=null&&this.stackItem==null&&console.error('FontAwesome: fa-icon and fa-duotone-icon elements must specify stackItemSize attribute when wrapped into fa-stack. Example: <fa-icon stackItemSize="2x" />.')}findIconDefinition(a){let e=V8(a,this.config.defaultPrefix);if("icon"in e)return e;let r=this.iconLibrary.getIconDefinition(e.prefix,e.iconName);return r??(O8(e),null)}buildParams(){let a=this.fixedWidth(),e={flip:this.flip(),animation:this.animation(),border:this.border(),inverse:this.inverse(),size:this.size(),pull:this.pull(),rotate:this.rotate(),fixedWidth:typeof a=="boolean"?a:this.config.fixedWidth,stackItemSize:this.stackItem!=null?this.stackItem.stackItemSize():void 0},r=this.transform(),s=typeof r=="string"?m3.transform(r):r,i=this.mask(),f=i!=null?this.findIconDefinition(i):null,n={},t=this.a11yRole();t!=null&&(n.role=t);let z={};return e.rotate!=null&&!u3(e.rotate)&&(z["--fa-rotate-angle"]=`${e.rotate}`),{title:this.title(),transform:s,classes:G8(e),mask:f??void 0,symbol:this.symbol(),attributes:n,styles:z}}static \u0275fac=function(e){return new(e||c)};static \u0275cmp=$({type:c,selectors:[["fa-icon"]],hostAttrs:[1,"ng-fa-icon"],hostVars:2,hostBindings:function(e,r){e&2&&(N1("innerHTML",r.renderedIconHTML(),m1),d1("title",r.title()??void 0))},inputs:{icon:[1,"icon"],title:[1,"title"],animation:[1,"animation"],mask:[1,"mask"],flip:[1,"flip"],size:[1,"size"],pull:[1,"pull"],border:[1,"border"],inverse:[1,"inverse"],symbol:[1,"symbol"],rotate:[1,"rotate"],fixedWidth:[1,"fixedWidth"],transform:[1,"transform"],a11yRole:[1,"a11yRole"]},outputs:{icon:"iconChange",title:"titleChange",animation:"animationChange",mask:"maskChange",flip:"flipChange",size:"sizeChange",pull:"pullChange",border:"borderChange",inverse:"inverseChange",symbol:"symbolChange",rotate:"rotateChange",fixedWidth:"fixedWidthChange",transform:"transformChange",a11yRole:"a11yRoleChange"},decls:0,vars:0,template:function(e,r){},encapsulation:2,changeDetection:0})}return c})();var S5=(()=>{class c{static \u0275fac=function(e){return new(e||c)};static \u0275mod=u1({type:c});static \u0275inj=i1({})}return c})();var y5={prefix:"fas",iconName:"envelope",icon:[512,512,[128386,9993,61443],"f0e0","M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z"]};var w5={prefix:"fas",iconName:"sort-up",icon:[384,512,["sort-asc"],"f0de","M32 224c-12.9 0-24.6-7.8-29.6-19.8S.2 178.5 9.4 169.4l160-160c12.5-12.5 32.8-12.5 45.3 0l160 160c9.2 9.2 11.9 22.9 6.9 34.9S364.9 224 352 224L32 224z"]};var k5={prefix:"fas",iconName:"expand",icon:[448,512,[],"f065","M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32S0 334.3 0 352l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"]};var A5={prefix:"fas",iconName:"table",icon:[448,512,[],"f0ce","M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64l-320 0-6.5-.3C25.2 476.4 0 449.1 0 416L0 96C0 60.7 28.7 32 64 32l320 0zM64 320l0 96 128 0 0-96-128 0zm192 0l0 96 128 0 0-96-128 0zM64 256l128 0 0-96-128 0 0 96zm192 0l128 0 0-96-128 0 0 96z"]};var P5={prefix:"fas",iconName:"chevron-right",icon:[320,512,[9002],"f054","M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"]};var T5={prefix:"fas",iconName:"network-wired",icon:[576,512,[],"f6ff","M248 88l80 0 0 48-80 0 0-48zm-8-56c-26.5 0-48 21.5-48 48l0 64c0 26.5 21.5 48 48 48l16 0 0 32-224 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0 0 32-16 0c-26.5 0-48 21.5-48 48l0 64c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-64c0-26.5-21.5-48-48-48l-16 0 0-32 192 0 0 32-16 0c-26.5 0-48 21.5-48 48l0 64c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-64c0-26.5-21.5-48-48-48l-16 0 0-32 96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-224 0 0-32 16 0c26.5 0 48-21.5 48-48l0-64c0-26.5-21.5-48-48-48l-96 0zM448 376l8 0 0 48-80 0 0-48 72 0zm-256 0l8 0 0 48-80 0 0-48 72 0z"]};var F5={prefix:"fas",iconName:"diagram-project",icon:[512,512,["project-diagram"],"f542","M0 80C0 53.5 21.5 32 48 32l96 0c26.5 0 48 21.5 48 48l0 16 128 0 0-16c0-26.5 21.5-48 48-48l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-16-128 0 0 16c0 7.3-1.7 14.3-4.6 20.5l68.6 91.5 80 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96c0-7.3 1.7-14.3 4.6-20.5L128 224 48 224c-26.5 0-48-21.5-48-48L0 80z"]};var D5={prefix:"fas",iconName:"folder",icon:[512,512,[128193,128447,61716,"folder-blank"],"f07b","M64 448l384 0c35.3 0 64-28.7 64-64l0-240c0-35.3-28.7-64-64-64L298.7 80c-6.9 0-13.7-2.2-19.2-6.4L241.1 44.8C230 36.5 216.5 32 202.7 32L64 32C28.7 32 0 60.7 0 96L0 384c0 35.3 28.7 64 64 64z"]};var d3={prefix:"fas",iconName:"arrow-up",icon:[384,512,[8593],"f062","M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"]};var Y8={prefix:"fas",iconName:"house",icon:[512,512,[127968,63498,63500,"home","home-alt","home-lg-alt"],"f015","M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"]},B5=Y8;var H5={prefix:"fas",iconName:"arrow-right",icon:[512,512,[8594],"f061","M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"]};var R5={prefix:"fas",iconName:"calendar-xmark",icon:[448,512,["calendar-times"],"f273","M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-32c0-17.7 14.3-32 32-32zM291.9 220.1c-9.4-9.4-24.6-9.4-33.9 0l-33.9 33.9-33.9-33.9c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l33.9 33.9-33.9 33.9c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l33.9-33.9 33.9 33.9c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-33.9-33.9 33.9-33.9c9.4-9.4 9.4-24.6 0-33.9z"]};var K8={prefix:"fas",iconName:"file-lines",icon:[384,512,[128441,128462,61686,"file-alt","file-text"],"f15c","M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM120 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"]},E5=K8;var Q8={prefix:"fas",iconName:"circle-check",icon:[512,512,[61533,"check-circle"],"f058","M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"]},U5=Q8;var I5={prefix:"fas",iconName:"list",icon:[512,512,["list-squares"],"f03a","M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"]};var W5={prefix:"fas",iconName:"chevron-down",icon:[448,512,[],"f078","M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"]};var J8={prefix:"fas",iconName:"minimize",icon:[512,512,["compress-arrows-alt"],"f78c","M456 224l-144 0c-13.3 0-24-10.7-24-24l0-144c0-9.7 5.8-18.5 14.8-22.2S322.1 32.2 329 39l40 40 73.4-73.4C446 2 450.9 0 456 0s10 2 13.7 5.7l36.7 36.7C510 46 512 50.9 512 56s-2 10-5.7 13.7L433 143 473 183c6.9 6.9 8.9 17.2 5.2 26.2S465.7 224 456 224zm0 64c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-40 40 73.4 73.4c3.6 3.6 5.7 8.5 5.7 13.7s-2 10-5.7 13.7l-36.7 36.7C466 510 461.1 512 456 512s-10-2-13.7-5.7L369 433 329 473c-6.9 6.9-17.2 8.9-26.2 5.2S288 465.7 288 456l0-144c0-13.3 10.7-24 24-24l144 0zm-256 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-40-40-73.4 73.4C66 510 61.1 512 56 512s-10-2-13.7-5.7L5.7 469.7C2 466 0 461.1 0 456s2-10 5.7-13.7L79 369 39 329c-6.9-6.9-8.9-17.2-5.2-26.2S46.3 288 56 288l144 0zM56 224c-9.7 0-18.5-5.8-22.2-14.8S32.2 189.9 39 183L79 143 5.7 69.7C2 66 0 61.1 0 56S2 46 5.7 42.3L42.3 5.7C46 2 50.9 0 56 0S66 2 69.7 5.7L143 79 183 39c6.9-6.9 17.2-8.9 26.2-5.2S224 46.3 224 56l0 144c0 13.3-10.7 24-24 24L56 224z"]},O5=J8;var q5={prefix:"fas",iconName:"music",icon:[512,512,[127925],"f001","M468 7c7.6 6.1 12 15.3 12 25l0 304c0 44.2-43 80-96 80s-96-35.8-96-80 43-80 96-80c11.2 0 22 1.6 32 4.6l0-116.7-224 49.8 0 206.3c0 44.2-43 80-96 80s-96-35.8-96-80 43-80 96-80c11.2 0 22 1.6 32 4.6L128 96c0-15 10.4-28 25.1-31.2l288-64c9.5-2.1 19.4 .2 27 6.3z"]};var G5={prefix:"fas",iconName:"compress",icon:[448,512,[],"f066","M160 64c0-17.7-14.3-32-32-32S96 46.3 96 64l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"]};var j5={prefix:"fas",iconName:"square",icon:[448,512,[9632,9723,9724,61590],"f0c8","M64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32z"]};var _5={prefix:"fas",iconName:"screwdriver-wrench",icon:[576,512,["tools"],"f7d9","M70.8-6.7c5.4-5.4 13.8-6.2 20.2-2L209.9 70.5c8.9 5.9 14.2 15.9 14.2 26.6l0 49.6 90.8 90.8c33.3-15 73.9-8.9 101.2 18.5L542.2 382.1c18.7 18.7 18.7 49.1 0 67.9l-60.1 60.1c-18.7 18.7-49.1 18.7-67.9 0L288.1 384c-27.4-27.4-33.5-67.9-18.5-101.2l-90.8-90.8-49.6 0c-10.7 0-20.7-5.3-26.6-14.2L23.4 58.9c-4.2-6.3-3.4-14.8 2-20.2L70.8-6.7zm145 303.5c-6.3 36.9 2.3 75.9 26.2 107.2l-94.9 95c-28.1 28.1-73.7 28.1-101.8 0s-28.1-73.7 0-101.8l135.4-135.5 35.2 35.1zM384.1 0c20.1 0 39.4 3.7 57.1 10.5 10 3.8 11.8 16.5 4.3 24.1L388.8 91.3c-3 3-4.7 7.1-4.7 11.3l0 41.4c0 8.8 7.2 16 16 16l41.4 0c4.2 0 8.3-1.7 11.3-4.7l56.7-56.7c7.6-7.5 20.3-5.7 24.1 4.3 6.8 17.7 10.5 37 10.5 57.1 0 43.2-17.2 82.3-45 111.1l-49.1-49.1c-33.1-33-78.5-45.7-121.1-38.4l-56.8-56.8 0-29.7-.2-5c-.8-12.4-4.4-24.3-10.5-34.9 29.4-35 73.4-57.2 122.7-57.3z"]};var V5={prefix:"fas",iconName:"angles-left",icon:[448,512,[171,"angle-double-left"],"f100","M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 256 406.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"]};var $5={prefix:"fas",iconName:"list-ul",icon:[512,512,["list-dots"],"f0ca","M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM48 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 256a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"]};var X5={prefix:"fas",iconName:"circle-info",icon:[512,512,["info-circle"],"f05a","M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"]};var Y5={prefix:"fas",iconName:"sort-down",icon:[384,512,["sort-desc"],"f0dd","M32 288c-12.9 0-24.6 7.8-29.6 19.8S.2 333.5 9.4 342.6l160 160c12.5 12.5 32.8 12.5 45.3 0l160-160c9.2-9.2 11.9-22.9 6.9-34.9S364.9 288 352 288L32 288z"]};function Z8(c,l){if(c&1){let a=S1();g1(0,"button",1),g2("click",function(){f1(a);let r=C2();return n1(r.scrollToTop())}),x1(1,"fa-icon",2),C1()}if(c&2){let a=C2();p1(),h1("icon",a.faArrowUp)}}var l7=(()=>{class c{constructor(){this._document=T(a2),this.showScrollButton=o1(!1),this.faArrowUp=d3}onWindowScroll(){let e=this._document.defaultView?.scrollY||0;this.showScrollButton.set(e>=300)}scrollToTop(){this._document.defaultView?.scrollTo({top:0,behavior:"smooth"})}static{this.\u0275fac=function(e){return new(e||c)}}static{this.\u0275cmp=$({type:c,selectors:[["awg-scroll-to-top-button"]],hostBindings:function(e,r){e&1&&g2("scroll",function(){return r.onWindowScroll()},z1)},decls:1,vars:1,consts:[["type","button","aria-label","Scroll to top",1,"awg-scroll-to-top-btn","btn","btn-info"],["type","button","aria-label","Scroll to top",1,"awg-scroll-to-top-btn","btn","btn-info",3,"click"],[3,"icon"]],template:function(e,r){e&1&&L1(0,Z8,2,1,"button",0),e&2&&v1(r.showScrollButton()?0:-1)},dependencies:[M3],styles:[".awg-scroll-to-top-btn[_ngcontent-%COMP%]{position:fixed;bottom:30px;right:30px;text-align:right;color:#fff;z-index:1000}.awg-scroll-to-top-btn[_ngcontent-%COMP%]:hover{cursor:pointer;color:#f0f0f0}"],changeDetection:0})}}return c})();var s7={thomas_ahrend:{name:"Thomas Ahrend",homepage:e2.AWG_PROJECT_URL+"de/projekt/mitarbeitende.html",identifiers:{gnd:"129772429",viaf:"74941235"}},michael_matter:{name:"Michael Matter",homepage:e2.AWG_PROJECT_URL+"de/projekt/mitarbeitende.html",identifiers:{gnd:"1069569267",viaf:"256375308"}},stefan_muennich:{name:"Stefan M\xFCnnich",homepage:e2.AWG_PROJECT_URL+"de/projekt/mitarbeitende.html",identifiers:{gnd:"1068032472",orcid:"0000-0002-0744-5374",viaf:"314885087"}}};export{M3 as a,S5 as b,y5 as c,w5 as d,k5 as e,A5 as f,P5 as g,T5 as h,F5 as i,D5 as j,B5 as k,H5 as l,R5 as m,E5 as n,U5 as o,I5 as p,W5 as q,O5 as r,q5 as s,G5 as t,j5 as u,_5 as v,V5 as w,$5 as x,X5 as y,Y5 as z,l7 as A,s7 as B};
