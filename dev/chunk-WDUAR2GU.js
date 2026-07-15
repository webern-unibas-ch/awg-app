import{Ta as P1,Ua as O,Wa as M,Xa as k,Za as T1,Zb as h2,_b as C2,a as U2,b as q2,bb as Z,da as x,db as D,fb as h,gb as A,ha as J,na as k1,o as w1,oa as A1,ob as F1,pb as B,qb as c2,rb as R,sb as W2,tb as D1,ub as B1,va as O2,xa as y,xb as L}from"./chunk-NLZLRDAI.js";function K2(c,a){(a==null||a>c.length)&&(a=c.length);for(var l=0,e=Array(a);l<a;l++)e[l]=c[l];return e}function A3(c){if(Array.isArray(c))return c}function P3(c){if(Array.isArray(c))return K2(c)}function T3(c,a){if(!(c instanceof a))throw new TypeError("Cannot call a class as a function")}function R1(c,a){for(var l=0;l<a.length;l++){var e=a[l];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(c,u4(e.key),e)}}function F3(c,a,l){return a&&R1(c.prototype,a),l&&R1(c,l),Object.defineProperty(c,"prototype",{writable:!1}),c}function N2(c,a){var l=typeof Symbol<"u"&&c[Symbol.iterator]||c["@@iterator"];if(!l){if(Array.isArray(c)||(l=m1(c))||a&&c&&typeof c.length=="number"){l&&(c=l);var e=0,r=function(){};return{s:r,n:function(){return e>=c.length?{done:!0}:{done:!1,value:c[e++]}},e:function(f){throw f},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var s,i=!0,n=!1;return{s:function(){l=l.call(c)},n:function(){var f=l.next();return i=f.done,f},e:function(f){n=!0,s=f},f:function(){try{i||l.return==null||l.return()}finally{if(n)throw s}}}}function p(c,a,l){return(a=u4(a))in c?Object.defineProperty(c,a,{value:l,enumerable:!0,configurable:!0,writable:!0}):c[a]=l,c}function D3(c){if(typeof Symbol<"u"&&c[Symbol.iterator]!=null||c["@@iterator"]!=null)return Array.from(c)}function B3(c,a){var l=c==null?null:typeof Symbol<"u"&&c[Symbol.iterator]||c["@@iterator"];if(l!=null){var e,r,s,i,n=[],f=!0,t=!1;try{if(s=(l=l.call(c)).next,a===0){if(Object(l)!==l)return;f=!1}else for(;!(f=(e=s.call(l)).done)&&(n.push(e.value),n.length!==a);f=!0);}catch(u){t=!0,r=u}finally{try{if(!f&&l.return!=null&&(i=l.return(),Object(i)!==i))return}finally{if(t)throw r}}return n}}function R3(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function H3(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function H1(c,a){var l=Object.keys(c);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(c);a&&(e=e.filter(function(r){return Object.getOwnPropertyDescriptor(c,r).enumerable})),l.push.apply(l,e)}return l}function o(c){for(var a=1;a<arguments.length;a++){var l=arguments[a]!=null?arguments[a]:{};a%2?H1(Object(l),!0).forEach(function(e){p(c,e,l[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(c,Object.getOwnPropertyDescriptors(l)):H1(Object(l)).forEach(function(e){Object.defineProperty(c,e,Object.getOwnPropertyDescriptor(l,e))})}return c}function P2(c,a){return A3(c)||B3(c,a)||m1(c,a)||R3()}function I(c){return P3(c)||D3(c)||m1(c)||H3()}function I3(c,a){if(typeof c!="object"||!c)return c;var l=c[Symbol.toPrimitive];if(l!==void 0){var e=l.call(c,a||"default");if(typeof e!="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return(a==="string"?String:Number)(c)}function u4(c){var a=I3(c,"string");return typeof a=="symbol"?a:a+""}function w2(c){"@babel/helpers - typeof";return w2=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(a){return typeof a}:function(a){return a&&typeof Symbol=="function"&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},w2(c)}function m1(c,a){if(c){if(typeof c=="string")return K2(c,a);var l={}.toString.call(c).slice(8,-1);return l==="Object"&&c.constructor&&(l=c.constructor.name),l==="Map"||l==="Set"?Array.from(c):l==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(l)?K2(c,a):void 0}}var I1=function(){},z1={},p4={},M4=null,d4={mark:I1,measure:I1};try{typeof window<"u"&&(z1=window),typeof document<"u"&&(p4=document),typeof MutationObserver<"u"&&(M4=MutationObserver),typeof performance<"u"&&(d4=performance)}catch(c){}var E3=z1.navigator||{},E1=E3.userAgent,U1=E1===void 0?"":E1,$=z1,g=p4,q1=M4,x2=d4,a5=!!$.document,j=!!g.documentElement&&!!g.head&&typeof g.addEventListener=="function"&&typeof g.createElement=="function",L4=~U1.indexOf("MSIE")||~U1.indexOf("Trident/"),G2,U3=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,q3=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,v4={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},O3={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},g4=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],b="classic",L2="duotone",h4="sharp",C4="sharp-duotone",x4="chisel",S4="etch",N4="graphite",b4="jelly",y4="jelly-duo",w4="jelly-fill",k4="notdog",A4="notdog-duo",P4="slab",T4="slab-press",F4="thumbprint",D4="utility",B4="utility-duo",R4="utility-fill",H4="whiteboard",W3="Classic",G3="Duotone",j3="Sharp",V3="Sharp Duotone",_3="Chisel",$3="Etch",X3="Graphite",Y3="Jelly",K3="Jelly Duo",Q3="Jelly Fill",J3="Notdog",Z3="Notdog Duo",c0="Slab",a0="Slab Press",l0="Thumbprint",e0="Utility",r0="Utility Duo",s0="Utility Fill",i0="Whiteboard",I4=[b,L2,h4,C4,x4,S4,N4,b4,y4,w4,k4,A4,P4,T4,F4,D4,B4,R4,H4],l5=(G2={},p(p(p(p(p(p(p(p(p(p(G2,b,W3),L2,G3),h4,j3),C4,V3),x4,_3),S4,$3),N4,X3),b4,Y3),y4,K3),w4,Q3),p(p(p(p(p(p(p(p(p(G2,k4,J3),A4,Z3),P4,c0),T4,a0),F4,l0),D4,e0),B4,r0),R4,s0),H4,i0)),n0={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},f0={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},o0=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),t0={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-press":{regular:"faslpr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},whiteboard:{semibold:"fawsb"}},E4=["fak","fa-kit","fakd","fa-kit-duotone"],O1={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},m0=["kit"],z0="kit",u0="kit-duotone",p0="Kit",M0="Kit Duotone",e5=p(p({},z0,p0),u0,M0),d0={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},L0={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},v0={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},W1={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},j2,S2={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},g0=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],h0="classic",C0="duotone",x0="sharp",S0="sharp-duotone",N0="chisel",b0="etch",y0="graphite",w0="jelly",k0="jelly-duo",A0="jelly-fill",P0="notdog",T0="notdog-duo",F0="slab",D0="slab-press",B0="thumbprint",R0="utility",H0="utility-duo",I0="utility-fill",E0="whiteboard",U0="Classic",q0="Duotone",O0="Sharp",W0="Sharp Duotone",G0="Chisel",j0="Etch",V0="Graphite",_0="Jelly",$0="Jelly Duo",X0="Jelly Fill",Y0="Notdog",K0="Notdog Duo",Q0="Slab",J0="Slab Press",Z0="Thumbprint",c6="Utility",a6="Utility Duo",l6="Utility Fill",e6="Whiteboard",r5=(j2={},p(p(p(p(p(p(p(p(p(p(j2,h0,U0),C0,q0),x0,O0),S0,W0),N0,G0),b0,j0),y0,V0),w0,_0),k0,$0),A0,X0),p(p(p(p(p(p(p(p(p(j2,P0,Y0),T0,K0),F0,Q0),D0,J0),B0,Z0),R0,c6),H0,a6),I0,l6),E0,e6)),r6="kit",s6="kit-duotone",i6="Kit",n6="Kit Duotone",s5=p(p({},r6,i6),s6,n6),f6={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},o6={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},Q2={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},t6=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],U4=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(g0,t6),m6=["solid","regular","light","thin","duotone","brands","semibold"],q4=[1,2,3,4,5,6,7,8,9,10],z6=q4.concat([11,12,13,14,15,16,17,18,19,20]),u6=["aw","fw","pull-left","pull-right"],p6=[].concat(I(Object.keys(o6)),m6,u6,["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","inverse","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul","width-auto","width-fixed",S2.GROUP,S2.SWAP_OPACITY,S2.PRIMARY,S2.SECONDARY]).concat(q4.map(function(c){return"".concat(c,"x")})).concat(z6.map(function(c){return"w-".concat(c)})),M6={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},W="___FONT_AWESOME___",J2=16,O4="fa",W4="svg-inline--fa",l2="data-fa-i2svg",Z2="data-fa-pseudo-element",d6="data-fa-pseudo-element-pending",u1="data-prefix",p1="data-icon",G1="fontawesome-i2svg",L6="async",v6=["HTML","HEAD","STYLE","SCRIPT"],G4=["::before","::after",":before",":after"],j4=(function(){try{return!0}catch(c){return!1}})();function v2(c){return new Proxy(c,{get:function(l,e){return e in l?l[e]:l[b]}})}var V4=o({},v4);V4[b]=o(o(o(o({},{"fa-duotone":"duotone"}),v4[b]),O1.kit),O1["kit-duotone"]);var g6=v2(V4),c1=o({},t0);c1[b]=o(o(o(o({},{duotone:"fad"}),c1[b]),W1.kit),W1["kit-duotone"]);var j1=v2(c1),a1=o({},Q2);a1[b]=o(o({},a1[b]),v0.kit);var M1=v2(a1),l1=o({},f6);l1[b]=o(o({},l1[b]),d0.kit);var i5=v2(l1),h6=U3,_4="fa-layers-text",C6=q3,x6=o({},n0),n5=v2(x6),S6=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],V2=O3,N6=[].concat(I(m0),I(p6)),p2=$.FontAwesomeConfig||{};function b6(c){var a=g.querySelector("script["+c+"]");if(a)return a.getAttribute(c)}function y6(c){return c===""?!0:c==="false"?!1:c==="true"?!0:c}g&&typeof g.querySelector=="function"&&(V1=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]],V1.forEach(function(c){var a=P2(c,2),l=a[0],e=a[1],r=y6(b6(l));r!=null&&(p2[e]=r)}));var V1,$4={styleDefault:"solid",familyDefault:b,cssPrefix:O4,replacementClass:W4,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};p2.familyPrefix&&(p2.cssPrefix=p2.familyPrefix);var m2=o(o({},$4),p2);m2.autoReplaceSvg||(m2.observeMutations=!1);var z={};Object.keys($4).forEach(function(c){Object.defineProperty(z,c,{enumerable:!0,set:function(l){m2[c]=l,M2.forEach(function(e){return e(z)})},get:function(){return m2[c]}})});Object.defineProperty(z,"familyPrefix",{enumerable:!0,set:function(a){m2.cssPrefix=a,M2.forEach(function(l){return l(z)})},get:function(){return m2.cssPrefix}});$.FontAwesomeConfig=z;var M2=[];function w6(c){return M2.push(c),function(){M2.splice(M2.indexOf(c),1)}}var _=J2,E={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function k6(c){if(!(!c||!j)){var a=g.createElement("style");a.setAttribute("type","text/css"),a.innerHTML=c;for(var l=g.head.childNodes,e=null,r=l.length-1;r>-1;r--){var s=l[r],i=(s.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(i)>-1&&(e=s)}return g.head.insertBefore(a,e),c}}var A6="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function _1(){for(var c=12,a="";c-- >0;)a+=A6[Math.random()*62|0];return a}function z2(c){for(var a=[],l=(c||[]).length>>>0;l--;)a[l]=c[l];return a}function d1(c){return c.classList?z2(c.classList):(c.getAttribute("class")||"").split(" ").filter(function(a){return a})}function X4(c){return"".concat(c).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function P6(c){return Object.keys(c||{}).reduce(function(a,l){return a+"".concat(l,'="').concat(X4(c[l]),'" ')},"").trim()}function T2(c){return Object.keys(c||{}).reduce(function(a,l){return a+"".concat(l,": ").concat(c[l].trim(),";")},"")}function L1(c){return c.size!==E.size||c.x!==E.x||c.y!==E.y||c.rotate!==E.rotate||c.flipX||c.flipY}function T6(c){var a=c.transform,l=c.containerWidth,e=c.iconWidth,r={transform:"translate(".concat(l/2," 256)")},s="translate(".concat(a.x*32,", ").concat(a.y*32,") "),i="scale(".concat(a.size/16*(a.flipX?-1:1),", ").concat(a.size/16*(a.flipY?-1:1),") "),n="rotate(".concat(a.rotate," 0 0)"),f={transform:"".concat(s," ").concat(i," ").concat(n)},t={transform:"translate(".concat(e/2*-1," -256)")};return{outer:r,inner:f,path:t}}function F6(c){var a=c.transform,l=c.width,e=l===void 0?J2:l,r=c.height,s=r===void 0?J2:r,i=c.startCentered,n=i===void 0?!1:i,f="";return n&&L4?f+="translate(".concat(a.x/_-e/2,"em, ").concat(a.y/_-s/2,"em) "):n?f+="translate(calc(-50% + ".concat(a.x/_,"em), calc(-50% + ").concat(a.y/_,"em)) "):f+="translate(".concat(a.x/_,"em, ").concat(a.y/_,"em) "),f+="scale(".concat(a.size/_*(a.flipX?-1:1),", ").concat(a.size/_*(a.flipY?-1:1),") "),f+="rotate(".concat(a.rotate,"deg) "),f}var D6=`:root, :host {
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
}`;function Y4(){var c=O4,a=W4,l=z.cssPrefix,e=z.replacementClass,r=D6;if(l!==c||e!==a){var s=new RegExp("\\.".concat(c,"\\-"),"g"),i=new RegExp("\\--".concat(c,"\\-"),"g"),n=new RegExp("\\.".concat(a),"g");r=r.replace(s,".".concat(l,"-")).replace(i,"--".concat(l,"-")).replace(n,".".concat(e))}return r}var $1=!1;function _2(){z.autoAddCss&&!$1&&(k6(Y4()),$1=!0)}var B6={mixout:function(){return{dom:{css:Y4,insertCss:_2}}},hooks:function(){return{beforeDOMElementCreation:function(){_2()},beforeI2svg:function(){_2()}}}},G=$||{};G[W]||(G[W]={});G[W].styles||(G[W].styles={});G[W].hooks||(G[W].hooks={});G[W].shims||(G[W].shims=[]);var H=G[W],K4=[],Q4=function(){g.removeEventListener("DOMContentLoaded",Q4),k2=1,K4.map(function(a){return a()})},k2=!1;j&&(k2=(g.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(g.readyState),k2||g.addEventListener("DOMContentLoaded",Q4));function R6(c){j&&(k2?setTimeout(c,0):K4.push(c))}function g2(c){var a=c.tag,l=c.attributes,e=l===void 0?{}:l,r=c.children,s=r===void 0?[]:r;return typeof c=="string"?X4(c):"<".concat(a," ").concat(P6(e),">").concat(s.map(g2).join(""),"</").concat(a,">")}function X1(c,a,l){if(c&&c[a]&&c[a][l])return{prefix:a,iconName:l,icon:c[a][l]}}var H6=function(a,l){return function(e,r,s,i){return a.call(l,e,r,s,i)}},$2=function(a,l,e,r){var s=Object.keys(a),i=s.length,n=r!==void 0?H6(l,r):l,f,t,u;for(e===void 0?(f=1,u=a[s[0]]):(f=0,u=e);f<i;f++)t=s[f],u=n(u,a[t],t,a);return u};function J4(c){return I(c).length!==1?null:c.codePointAt(0).toString(16)}function Y1(c){return Object.keys(c).reduce(function(a,l){var e=c[l],r=!!e.icon;return r?a[e.iconName]=e.icon:a[l]=e,a},{})}function e1(c,a){var l=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},e=l.skipHooks,r=e===void 0?!1:e,s=Y1(a);typeof H.hooks.addPack=="function"&&!r?H.hooks.addPack(c,Y1(a)):H.styles[c]=o(o({},H.styles[c]||{}),s),c==="fas"&&e1("fa",a)}var d2=H.styles,I6=H.shims,Z4=Object.keys(M1),E6=Z4.reduce(function(c,a){return c[a]=Object.keys(M1[a]),c},{}),v1=null,c3={},a3={},l3={},e3={},r3={};function U6(c){return~N6.indexOf(c)}function q6(c,a){var l=a.split("-"),e=l[0],r=l.slice(1).join("-");return e===c&&r!==""&&!U6(r)?r:null}var s3=function(){var a=function(s){return $2(d2,function(i,n,f){return i[f]=$2(n,s,{}),i},{})};c3=a(function(r,s,i){if(s[3]&&(r[s[3]]=i),s[2]){var n=s[2].filter(function(f){return typeof f=="number"});n.forEach(function(f){r[f.toString(16)]=i})}return r}),a3=a(function(r,s,i){if(r[i]=i,s[2]){var n=s[2].filter(function(f){return typeof f=="string"});n.forEach(function(f){r[f]=i})}return r}),r3=a(function(r,s,i){var n=s[2];return r[i]=i,n.forEach(function(f){r[f]=i}),r});var l="far"in d2||z.autoFetchSvg,e=$2(I6,function(r,s){var i=s[0],n=s[1],f=s[2];return n==="far"&&!l&&(n="fas"),typeof i=="string"&&(r.names[i]={prefix:n,iconName:f}),typeof i=="number"&&(r.unicodes[i.toString(16)]={prefix:n,iconName:f}),r},{names:{},unicodes:{}});l3=e.names,e3=e.unicodes,v1=F2(z.styleDefault,{family:z.familyDefault})};w6(function(c){v1=F2(c.styleDefault,{family:z.familyDefault})});s3();function g1(c,a){return(c3[c]||{})[a]}function O6(c,a){return(a3[c]||{})[a]}function a2(c,a){return(r3[c]||{})[a]}function i3(c){return l3[c]||{prefix:null,iconName:null}}function W6(c){var a=e3[c],l=g1("fas",c);return a||(l?{prefix:"fas",iconName:l}:null)||{prefix:null,iconName:null}}function X(){return v1}var n3=function(){return{prefix:null,iconName:null,rest:[]}};function G6(c){var a=b,l=Z4.reduce(function(e,r){return e[r]="".concat(z.cssPrefix,"-").concat(r),e},{});return I4.forEach(function(e){(c.includes(l[e])||c.some(function(r){return E6[e].includes(r)}))&&(a=e)}),a}function F2(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},l=a.family,e=l===void 0?b:l,r=g6[e][c];if(e===L2&&!c)return"fad";var s=j1[e][c]||j1[e][r],i=c in H.styles?c:null,n=s||i||null;return n}function j6(c){var a=[],l=null;return c.forEach(function(e){var r=q6(z.cssPrefix,e);r?l=r:e&&a.push(e)}),{iconName:l,rest:a}}function K1(c){return c.sort().filter(function(a,l,e){return e.indexOf(a)===l})}var Q1=U4.concat(E4);function D2(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},l=a.skipLookups,e=l===void 0?!1:l,r=null,s=K1(c.filter(function(d){return Q1.includes(d)})),i=K1(c.filter(function(d){return!Q1.includes(d)})),n=s.filter(function(d){return r=d,!g4.includes(d)}),f=P2(n,1),t=f[0],u=t===void 0?null:t,m=G6(s),v=o(o({},j6(i)),{},{prefix:F2(u,{family:m})});return o(o(o({},v),X6({values:c,family:m,styles:d2,config:z,canonical:v,givenPrefix:r})),V6(e,r,v))}function V6(c,a,l){var e=l.prefix,r=l.iconName;if(c||!e||!r)return{prefix:e,iconName:r};var s=a==="fa"?i3(r):{},i=a2(e,r);return r=s.iconName||i||r,e=s.prefix||e,e==="far"&&!d2.far&&d2.fas&&!z.autoFetchSvg&&(e="fas"),{prefix:e,iconName:r}}var _6=I4.filter(function(c){return c!==b||c!==L2}),$6=Object.keys(Q2).filter(function(c){return c!==b}).map(function(c){return Object.keys(Q2[c])}).flat();function X6(c){var a=c.values,l=c.family,e=c.canonical,r=c.givenPrefix,s=r===void 0?"":r,i=c.styles,n=i===void 0?{}:i,f=c.config,t=f===void 0?{}:f,u=l===L2,m=a.includes("fa-duotone")||a.includes("fad"),v=t.familyDefault==="duotone",d=e.prefix==="fad"||e.prefix==="fa-duotone";if(!u&&(m||v||d)&&(e.prefix="fad"),(a.includes("fa-brands")||a.includes("fab"))&&(e.prefix="fab"),!e.prefix&&_6.includes(l)){var S=Object.keys(n).find(function(w){return $6.includes(w)});if(S||t.autoFetchSvg){var C=o0.get(l).defaultShortPrefixId;e.prefix=C,e.iconName=a2(e.prefix,e.iconName)||e.iconName}}return(e.prefix==="fa"||s==="fa")&&(e.prefix=X()||"fas"),e}var Y6=(function(){function c(){T3(this,c),this.definitions={}}return F3(c,[{key:"add",value:function(){for(var l=this,e=arguments.length,r=new Array(e),s=0;s<e;s++)r[s]=arguments[s];var i=r.reduce(this._pullDefinitions,{});Object.keys(i).forEach(function(n){l.definitions[n]=o(o({},l.definitions[n]||{}),i[n]),e1(n,i[n]);var f=M1[b][n];f&&e1(f,i[n]),s3()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(l,e){var r=e.prefix&&e.iconName&&e.icon?{0:e}:e;return Object.keys(r).map(function(s){var i=r[s],n=i.prefix,f=i.iconName,t=i.icon,u=t[2];l[n]||(l[n]={}),u.length>0&&u.forEach(function(m){typeof m=="string"&&(l[n][m]=t)}),l[n][f]=t}),l}}])})(),J1=[],o2={},t2={},K6=Object.keys(t2);function Q6(c,a){var l=a.mixoutsTo;return J1=c,o2={},Object.keys(t2).forEach(function(e){K6.indexOf(e)===-1&&delete t2[e]}),J1.forEach(function(e){var r=e.mixout?e.mixout():{};if(Object.keys(r).forEach(function(i){typeof r[i]=="function"&&(l[i]=r[i]),w2(r[i])==="object"&&Object.keys(r[i]).forEach(function(n){l[i]||(l[i]={}),l[i][n]=r[i][n]})}),e.hooks){var s=e.hooks();Object.keys(s).forEach(function(i){o2[i]||(o2[i]=[]),o2[i].push(s[i])})}e.provides&&e.provides(t2)}),l}function r1(c,a){for(var l=arguments.length,e=new Array(l>2?l-2:0),r=2;r<l;r++)e[r-2]=arguments[r];var s=o2[c]||[];return s.forEach(function(i){a=i.apply(null,[a].concat(e))}),a}function e2(c){for(var a=arguments.length,l=new Array(a>1?a-1:0),e=1;e<a;e++)l[e-1]=arguments[e];var r=o2[c]||[];r.forEach(function(s){s.apply(null,l)})}function Y(){var c=arguments[0],a=Array.prototype.slice.call(arguments,1);return t2[c]?t2[c].apply(null,a):void 0}function s1(c){c.prefix==="fa"&&(c.prefix="fas");var a=c.iconName,l=c.prefix||X();if(a)return a=a2(l,a)||a,X1(f3.definitions,l,a)||X1(H.styles,l,a)}var f3=new Y6,J6=function(){z.autoReplaceSvg=!1,z.observeMutations=!1,e2("noAuto")},Z6={i2svg:function(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return j?(e2("beforeI2svg",a),Y("pseudoElements2svg",a),Y("i2svg",a)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},l=a.autoReplaceSvgRoot;z.autoReplaceSvg===!1&&(z.autoReplaceSvg=!0),z.observeMutations=!0,R6(function(){a8({autoReplaceSvgRoot:l}),e2("watch",a)})}},c8={icon:function(a){if(a===null)return null;if(w2(a)==="object"&&a.prefix&&a.iconName)return{prefix:a.prefix,iconName:a2(a.prefix,a.iconName)||a.iconName};if(Array.isArray(a)&&a.length===2){var l=a[1].indexOf("fa-")===0?a[1].slice(3):a[1],e=F2(a[0]);return{prefix:e,iconName:a2(e,l)||l}}if(typeof a=="string"&&(a.indexOf("".concat(z.cssPrefix,"-"))>-1||a.match(h6))){var r=D2(a.split(" "),{skipLookups:!0});return{prefix:r.prefix||X(),iconName:a2(r.prefix,r.iconName)||r.iconName}}if(typeof a=="string"){var s=X();return{prefix:s,iconName:a2(s,a)||a}}}},T={noAuto:J6,config:z,dom:Z6,parse:c8,library:f3,findIconDefinition:s1,toHtml:g2},a8=function(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},l=a.autoReplaceSvgRoot,e=l===void 0?g:l;(Object.keys(H.styles).length>0||z.autoFetchSvg)&&j&&z.autoReplaceSvg&&T.dom.i2svg({node:e})};function B2(c,a){return Object.defineProperty(c,"abstract",{get:a}),Object.defineProperty(c,"html",{get:function(){return c.abstract.map(function(e){return g2(e)})}}),Object.defineProperty(c,"node",{get:function(){if(j){var e=g.createElement("div");return e.innerHTML=c.html,e.children}}}),c}function l8(c){var a=c.children,l=c.main,e=c.mask,r=c.attributes,s=c.styles,i=c.transform;if(L1(i)&&l.found&&!e.found){var n=l.width,f=l.height,t={x:n/f/2,y:.5};r.style=T2(o(o({},s),{},{"transform-origin":"".concat(t.x+i.x/16,"em ").concat(t.y+i.y/16,"em")}))}return[{tag:"svg",attributes:r,children:a}]}function e8(c){var a=c.prefix,l=c.iconName,e=c.children,r=c.attributes,s=c.symbol,i=s===!0?"".concat(a,"-").concat(z.cssPrefix,"-").concat(l):s;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:o(o({},r),{},{id:i}),children:e}]}]}function r8(c){var a=["aria-label","aria-labelledby","title","role"];return a.some(function(l){return l in c})}function h1(c){var a=c.icons,l=a.main,e=a.mask,r=c.prefix,s=c.iconName,i=c.transform,n=c.symbol,f=c.maskId,t=c.extra,u=c.watchable,m=u===void 0?!1:u,v=e.found?e:l,d=v.width,S=v.height,C=[z.replacementClass,s?"".concat(z.cssPrefix,"-").concat(s):""].filter(function(q){return t.classes.indexOf(q)===-1}).filter(function(q){return q!==""||!!q}).concat(t.classes).join(" "),w={children:[],attributes:o(o({},t.attributes),{},{"data-prefix":r,"data-icon":s,class:C,role:t.attributes.role||"img",viewBox:"0 0 ".concat(d," ").concat(S)})};!r8(t.attributes)&&!t.attributes["aria-hidden"]&&(w.attributes["aria-hidden"]="true"),m&&(w.attributes[l2]="");var N=o(o({},w),{},{prefix:r,iconName:s,main:l,mask:e,maskId:f,transform:i,symbol:n,styles:o({},t.styles)}),P=e.found&&l.found?Y("generateAbstractMask",N)||{children:[],attributes:{}}:Y("generateAbstractIcon",N)||{children:[],attributes:{}},F=P.children,f2=P.attributes;return N.children=F,N.attributes=f2,n?e8(N):l8(N)}function Z1(c){var a=c.content,l=c.width,e=c.height,r=c.transform,s=c.extra,i=c.watchable,n=i===void 0?!1:i,f=o(o({},s.attributes),{},{class:s.classes.join(" ")});n&&(f[l2]="");var t=o({},s.styles);L1(r)&&(t.transform=F6({transform:r,startCentered:!0,width:l,height:e}),t["-webkit-transform"]=t.transform);var u=T2(t);u.length>0&&(f.style=u);var m=[];return m.push({tag:"span",attributes:f,children:[a]}),m}function s8(c){var a=c.content,l=c.extra,e=o(o({},l.attributes),{},{class:l.classes.join(" ")}),r=T2(l.styles);r.length>0&&(e.style=r);var s=[];return s.push({tag:"span",attributes:e,children:[a]}),s}var X2=H.styles;function i1(c){var a=c[0],l=c[1],e=c.slice(4),r=P2(e,1),s=r[0],i=null;return Array.isArray(s)?i={tag:"g",attributes:{class:"".concat(z.cssPrefix,"-").concat(V2.GROUP)},children:[{tag:"path",attributes:{class:"".concat(z.cssPrefix,"-").concat(V2.SECONDARY),fill:"currentColor",d:s[0]}},{tag:"path",attributes:{class:"".concat(z.cssPrefix,"-").concat(V2.PRIMARY),fill:"currentColor",d:s[1]}}]}:i={tag:"path",attributes:{fill:"currentColor",d:s}},{found:!0,width:a,height:l,icon:i}}var i8={found:!1,width:512,height:512};function n8(c,a){!j4&&!z.showMissingIcons&&c&&console.error('Icon with name "'.concat(c,'" and prefix "').concat(a,'" is missing.'))}function n1(c,a){var l=a;return a==="fa"&&z.styleDefault!==null&&(a=X()),new Promise(function(e,r){if(l==="fa"){var s=i3(c)||{};c=s.iconName||c,a=s.prefix||a}if(c&&a&&X2[a]&&X2[a][c]){var i=X2[a][c];return e(i1(i))}n8(c,a),e(o(o({},i8),{},{icon:z.showMissingIcons&&c?Y("missingIconAbstract")||{}:{}}))})}var c4=function(){},f1=z.measurePerformance&&x2&&x2.mark&&x2.measure?x2:{mark:c4,measure:c4},u2='FA "7.2.0"',f8=function(a){return f1.mark("".concat(u2," ").concat(a," begins")),function(){return o3(a)}},o3=function(a){f1.mark("".concat(u2," ").concat(a," ends")),f1.measure("".concat(u2," ").concat(a),"".concat(u2," ").concat(a," begins"),"".concat(u2," ").concat(a," ends"))},C1={begin:f8,end:o3},b2=function(){};function a4(c){var a=c.getAttribute?c.getAttribute(l2):null;return typeof a=="string"}function o8(c){var a=c.getAttribute?c.getAttribute(u1):null,l=c.getAttribute?c.getAttribute(p1):null;return a&&l}function t8(c){return c&&c.classList&&c.classList.contains&&c.classList.contains(z.replacementClass)}function m8(){if(z.autoReplaceSvg===!0)return y2.replace;var c=y2[z.autoReplaceSvg];return c||y2.replace}function z8(c){return g.createElementNS("http://www.w3.org/2000/svg",c)}function u8(c){return g.createElement(c)}function t3(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},l=a.ceFn,e=l===void 0?c.tag==="svg"?z8:u8:l;if(typeof c=="string")return g.createTextNode(c);var r=e(c.tag);Object.keys(c.attributes||[]).forEach(function(i){r.setAttribute(i,c.attributes[i])});var s=c.children||[];return s.forEach(function(i){r.appendChild(t3(i,{ceFn:e}))}),r}function p8(c){var a=" ".concat(c.outerHTML," ");return a="".concat(a,"Font Awesome fontawesome.com "),a}var y2={replace:function(a){var l=a[0];if(l.parentNode)if(a[1].forEach(function(r){l.parentNode.insertBefore(t3(r),l)}),l.getAttribute(l2)===null&&z.keepOriginalSource){var e=g.createComment(p8(l));l.parentNode.replaceChild(e,l)}else l.remove()},nest:function(a){var l=a[0],e=a[1];if(~d1(l).indexOf(z.replacementClass))return y2.replace(a);var r=new RegExp("".concat(z.cssPrefix,"-.*"));if(delete e[0].attributes.id,e[0].attributes.class){var s=e[0].attributes.class.split(" ").reduce(function(n,f){return f===z.replacementClass||f.match(r)?n.toSvg.push(f):n.toNode.push(f),n},{toNode:[],toSvg:[]});e[0].attributes.class=s.toSvg.join(" "),s.toNode.length===0?l.removeAttribute("class"):l.setAttribute("class",s.toNode.join(" "))}var i=e.map(function(n){return g2(n)}).join(`
`);l.setAttribute(l2,""),l.innerHTML=i}};function l4(c){c()}function m3(c,a){var l=typeof a=="function"?a:b2;if(c.length===0)l();else{var e=l4;z.mutateApproach===L6&&(e=$.requestAnimationFrame||l4),e(function(){var r=m8(),s=C1.begin("mutate");c.map(r),s(),l()})}}var x1=!1;function z3(){x1=!0}function o1(){x1=!1}var A2=null;function e4(c){if(q1&&z.observeMutations){var a=c.treeCallback,l=a===void 0?b2:a,e=c.nodeCallback,r=e===void 0?b2:e,s=c.pseudoElementsCallback,i=s===void 0?b2:s,n=c.observeMutationsRoot,f=n===void 0?g:n;A2=new q1(function(t){if(!x1){var u=X();z2(t).forEach(function(m){if(m.type==="childList"&&m.addedNodes.length>0&&!a4(m.addedNodes[0])&&(z.searchPseudoElements&&i(m.target),l(m.target)),m.type==="attributes"&&m.target.parentNode&&z.searchPseudoElements&&i([m.target],!0),m.type==="attributes"&&a4(m.target)&&~S6.indexOf(m.attributeName))if(m.attributeName==="class"&&o8(m.target)){var v=D2(d1(m.target)),d=v.prefix,S=v.iconName;m.target.setAttribute(u1,d||u),S&&m.target.setAttribute(p1,S)}else t8(m.target)&&r(m.target)})}}),j&&A2.observe(f,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function M8(){A2&&A2.disconnect()}function d8(c){var a=c.getAttribute("style"),l=[];return a&&(l=a.split(";").reduce(function(e,r){var s=r.split(":"),i=s[0],n=s.slice(1);return i&&n.length>0&&(e[i]=n.join(":").trim()),e},{})),l}function L8(c){var a=c.getAttribute("data-prefix"),l=c.getAttribute("data-icon"),e=c.innerText!==void 0?c.innerText.trim():"",r=D2(d1(c));return r.prefix||(r.prefix=X()),a&&l&&(r.prefix=a,r.iconName=l),r.iconName&&r.prefix||(r.prefix&&e.length>0&&(r.iconName=O6(r.prefix,c.innerText)||g1(r.prefix,J4(c.innerText))),!r.iconName&&z.autoFetchSvg&&c.firstChild&&c.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=c.firstChild.data)),r}function v8(c){var a=z2(c.attributes).reduce(function(l,e){return l.name!=="class"&&l.name!=="style"&&(l[e.name]=e.value),l},{});return a}function g8(){return{iconName:null,prefix:null,transform:E,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function r4(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},l=L8(c),e=l.iconName,r=l.prefix,s=l.rest,i=v8(c),n=r1("parseNodeAttributes",{},c),f=a.styleParser?d8(c):[];return o({iconName:e,prefix:r,transform:E,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:s,styles:f,attributes:i}},n)}var h8=H.styles;function u3(c){var a=z.autoReplaceSvg==="nest"?r4(c,{styleParser:!1}):r4(c);return~a.extra.classes.indexOf(_4)?Y("generateLayersText",c,a):Y("generateSvgReplacementMutation",c,a)}function C8(){return[].concat(I(E4),I(U4))}function s4(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!j)return Promise.resolve();var l=g.documentElement.classList,e=function(m){return l.add("".concat(G1,"-").concat(m))},r=function(m){return l.remove("".concat(G1,"-").concat(m))},s=z.autoFetchSvg?C8():g4.concat(Object.keys(h8));s.includes("fa")||s.push("fa");var i=[".".concat(_4,":not([").concat(l2,"])")].concat(s.map(function(u){return".".concat(u,":not([").concat(l2,"])")})).join(", ");if(i.length===0)return Promise.resolve();var n=[];try{n=z2(c.querySelectorAll(i))}catch(u){}if(n.length>0)e("pending"),r("complete");else return Promise.resolve();var f=C1.begin("onTree"),t=n.reduce(function(u,m){try{var v=u3(m);v&&u.push(v)}catch(d){j4||d.name==="MissingIcon"&&console.error(d)}return u},[]);return new Promise(function(u,m){Promise.all(t).then(function(v){m3(v,function(){e("active"),e("complete"),r("pending"),typeof a=="function"&&a(),f(),u()})}).catch(function(v){f(),m(v)})})}function x8(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;u3(c).then(function(l){l&&m3([l],a)})}function S8(c){return function(a){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=(a||{}).icon?a:s1(a||{}),r=l.mask;return r&&(r=(r||{}).icon?r:s1(r||{})),c(e,o(o({},l),{},{mask:r}))}}var N8=function(a){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=l.transform,r=e===void 0?E:e,s=l.symbol,i=s===void 0?!1:s,n=l.mask,f=n===void 0?null:n,t=l.maskId,u=t===void 0?null:t,m=l.classes,v=m===void 0?[]:m,d=l.attributes,S=d===void 0?{}:d,C=l.styles,w=C===void 0?{}:C;if(a){var N=a.prefix,P=a.iconName,F=a.icon;return B2(o({type:"icon"},a),function(){return e2("beforeDOMElementCreation",{iconDefinition:a,params:l}),h1({icons:{main:i1(F),mask:f?i1(f.icon):{found:!1,width:null,height:null,icon:{}}},prefix:N,iconName:P,transform:o(o({},E),r),symbol:i,maskId:u,extra:{attributes:S,styles:w,classes:v}})})}},b8={mixout:function(){return{icon:S8(N8)}},hooks:function(){return{mutationObserverCallbacks:function(l){return l.treeCallback=s4,l.nodeCallback=x8,l}}},provides:function(a){a.i2svg=function(l){var e=l.node,r=e===void 0?g:e,s=l.callback,i=s===void 0?function(){}:s;return s4(r,i)},a.generateSvgReplacementMutation=function(l,e){var r=e.iconName,s=e.prefix,i=e.transform,n=e.symbol,f=e.mask,t=e.maskId,u=e.extra;return new Promise(function(m,v){Promise.all([n1(r,s),f.iconName?n1(f.iconName,f.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(d){var S=P2(d,2),C=S[0],w=S[1];m([l,h1({icons:{main:C,mask:w},prefix:s,iconName:r,transform:i,symbol:n,maskId:t,extra:u,watchable:!0})])}).catch(v)})},a.generateAbstractIcon=function(l){var e=l.children,r=l.attributes,s=l.main,i=l.transform,n=l.styles,f=T2(n);f.length>0&&(r.style=f);var t;return L1(i)&&(t=Y("generateAbstractTransformGrouping",{main:s,transform:i,containerWidth:s.width,iconWidth:s.width})),e.push(t||s.icon),{children:e,attributes:r}}}},y8={mixout:function(){return{layer:function(l){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.classes,s=r===void 0?[]:r;return B2({type:"layer"},function(){e2("beforeDOMElementCreation",{assembler:l,params:e});var i=[];return l(function(n){Array.isArray(n)?n.map(function(f){i=i.concat(f.abstract)}):i=i.concat(n.abstract)}),[{tag:"span",attributes:{class:["".concat(z.cssPrefix,"-layers")].concat(I(s)).join(" ")},children:i}]})}}}},w8={mixout:function(){return{counter:function(l){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.title,s=r===void 0?null:r,i=e.classes,n=i===void 0?[]:i,f=e.attributes,t=f===void 0?{}:f,u=e.styles,m=u===void 0?{}:u;return B2({type:"counter",content:l},function(){return e2("beforeDOMElementCreation",{content:l,params:e}),s8({content:l.toString(),title:s,extra:{attributes:t,styles:m,classes:["".concat(z.cssPrefix,"-layers-counter")].concat(I(n))}})})}}}},k8={mixout:function(){return{text:function(l){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.transform,s=r===void 0?E:r,i=e.classes,n=i===void 0?[]:i,f=e.attributes,t=f===void 0?{}:f,u=e.styles,m=u===void 0?{}:u;return B2({type:"text",content:l},function(){return e2("beforeDOMElementCreation",{content:l,params:e}),Z1({content:l,transform:o(o({},E),s),extra:{attributes:t,styles:m,classes:["".concat(z.cssPrefix,"-layers-text")].concat(I(n))}})})}}},provides:function(a){a.generateLayersText=function(l,e){var r=e.transform,s=e.extra,i=null,n=null;if(L4){var f=parseInt(getComputedStyle(l).fontSize,10),t=l.getBoundingClientRect();i=t.width/f,n=t.height/f}return Promise.resolve([l,Z1({content:l.innerHTML,width:i,height:n,transform:r,extra:s,watchable:!0})])}}},p3=new RegExp('"',"ug"),i4=[1105920,1112319],n4=o(o(o(o({},{FontAwesome:{normal:"fas",400:"fas"}}),f0),M6),L0),t1=Object.keys(n4).reduce(function(c,a){return c[a.toLowerCase()]=n4[a],c},{}),A8=Object.keys(t1).reduce(function(c,a){var l=t1[a];return c[a]=l[900]||I(Object.entries(l))[0][1],c},{});function P8(c){var a=c.replace(p3,"");return J4(I(a)[0]||"")}function T8(c){var a=c.getPropertyValue("font-feature-settings").includes("ss01"),l=c.getPropertyValue("content"),e=l.replace(p3,""),r=e.codePointAt(0),s=r>=i4[0]&&r<=i4[1],i=e.length===2?e[0]===e[1]:!1;return s||i||a}function F8(c,a){var l=c.replace(/^['"]|['"]$/g,"").toLowerCase(),e=parseInt(a),r=isNaN(e)?"normal":e;return(t1[l]||{})[r]||A8[l]}function f4(c,a){var l="".concat(d6).concat(a.replace(":","-"));return new Promise(function(e,r){if(c.getAttribute(l)!==null)return e();var s=z2(c.children),i=s.filter(function(I2){return I2.getAttribute(Z2)===a})[0],n=$.getComputedStyle(c,a),f=n.getPropertyValue("font-family"),t=f.match(C6),u=n.getPropertyValue("font-weight"),m=n.getPropertyValue("content");if(i&&!t)return c.removeChild(i),e();if(t&&m!=="none"&&m!==""){var v=n.getPropertyValue("content"),d=F8(f,u),S=P8(v),C=t[0].startsWith("FontAwesome"),w=T8(n),N=g1(d,S),P=N;if(C){var F=W6(S);F.iconName&&F.prefix&&(N=F.iconName,d=F.prefix)}if(N&&!w&&(!i||i.getAttribute(u1)!==d||i.getAttribute(p1)!==P)){c.setAttribute(l,P),i&&c.removeChild(i);var f2=g8(),q=f2.extra;q.attributes[Z2]=a,n1(N,d).then(function(I2){var w3=h1(o(o({},f2),{},{icons:{main:I2,mask:n3()},prefix:d,iconName:P,extra:q,watchable:!0})),E2=g.createElementNS("http://www.w3.org/2000/svg","svg");a==="::before"?c.insertBefore(E2,c.firstChild):c.appendChild(E2),E2.outerHTML=w3.map(function(k3){return g2(k3)}).join(`
`),c.removeAttribute(l),e()}).catch(r)}else e()}else e()})}function D8(c){return Promise.all([f4(c,"::before"),f4(c,"::after")])}function B8(c){return c.parentNode!==document.head&&!~v6.indexOf(c.tagName.toUpperCase())&&!c.getAttribute(Z2)&&(!c.parentNode||c.parentNode.tagName!=="svg")}var R8=function(a){return!!a&&G4.some(function(l){return a.includes(l)})},H8=function(a){if(!a)return[];var l=new Set,e=a.split(/,(?![^()]*\))/).map(function(f){return f.trim()});e=e.flatMap(function(f){return f.includes("(")?f:f.split(",").map(function(t){return t.trim()})});var r=N2(e),s;try{for(r.s();!(s=r.n()).done;){var i=s.value;if(R8(i)){var n=G4.reduce(function(f,t){return f.replace(t,"")},i);n!==""&&n!=="*"&&l.add(n)}}}catch(f){r.e(f)}finally{r.f()}return l};function o4(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(j){var l;if(a)l=c;else if(z.searchPseudoElementsFullScan)l=c.querySelectorAll("*");else{var e=new Set,r=N2(document.styleSheets),s;try{for(r.s();!(s=r.n()).done;){var i=s.value;try{var n=N2(i.cssRules),f;try{for(n.s();!(f=n.n()).done;){var t=f.value,u=H8(t.selectorText),m=N2(u),v;try{for(m.s();!(v=m.n()).done;){var d=v.value;e.add(d)}}catch(C){m.e(C)}finally{m.f()}}}catch(C){n.e(C)}finally{n.f()}}catch(C){z.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(i.href," (").concat(C.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(C){r.e(C)}finally{r.f()}if(!e.size)return;var S=Array.from(e).join(", ");try{l=c.querySelectorAll(S)}catch(C){}}return new Promise(function(C,w){var N=z2(l).filter(B8).map(D8),P=C1.begin("searchPseudoElements");z3(),Promise.all(N).then(function(){P(),o1(),C()}).catch(function(){P(),o1(),w()})})}}var I8={hooks:function(){return{mutationObserverCallbacks:function(l){return l.pseudoElementsCallback=o4,l}}},provides:function(a){a.pseudoElements2svg=function(l){var e=l.node,r=e===void 0?g:e;z.searchPseudoElements&&o4(r)}}},t4=!1,E8={mixout:function(){return{dom:{unwatch:function(){z3(),t4=!0}}}},hooks:function(){return{bootstrap:function(){e4(r1("mutationObserverCallbacks",{}))},noAuto:function(){M8()},watch:function(l){var e=l.observeMutationsRoot;t4?o1():e4(r1("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}},m4=function(a){var l={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return a.toLowerCase().split(" ").reduce(function(e,r){var s=r.toLowerCase().split("-"),i=s[0],n=s.slice(1).join("-");if(i&&n==="h")return e.flipX=!0,e;if(i&&n==="v")return e.flipY=!0,e;if(n=parseFloat(n),isNaN(n))return e;switch(i){case"grow":e.size=e.size+n;break;case"shrink":e.size=e.size-n;break;case"left":e.x=e.x-n;break;case"right":e.x=e.x+n;break;case"up":e.y=e.y-n;break;case"down":e.y=e.y+n;break;case"rotate":e.rotate=e.rotate+n;break}return e},l)},U8={mixout:function(){return{parse:{transform:function(l){return m4(l)}}}},hooks:function(){return{parseNodeAttributes:function(l,e){var r=e.getAttribute("data-fa-transform");return r&&(l.transform=m4(r)),l}}},provides:function(a){a.generateAbstractTransformGrouping=function(l){var e=l.main,r=l.transform,s=l.containerWidth,i=l.iconWidth,n={transform:"translate(".concat(s/2," 256)")},f="translate(".concat(r.x*32,", ").concat(r.y*32,") "),t="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),u="rotate(".concat(r.rotate," 0 0)"),m={transform:"".concat(f," ").concat(t," ").concat(u)},v={transform:"translate(".concat(i/2*-1," -256)")},d={outer:n,inner:m,path:v};return{tag:"g",attributes:o({},d.outer),children:[{tag:"g",attributes:o({},d.inner),children:[{tag:e.icon.tag,children:e.icon.children,attributes:o(o({},e.icon.attributes),d.path)}]}]}}}},Y2={x:0,y:0,width:"100%",height:"100%"};function z4(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return c.attributes&&(c.attributes.fill||a)&&(c.attributes.fill="black"),c}function q8(c){return c.tag==="g"?c.children:[c]}var O8={hooks:function(){return{parseNodeAttributes:function(l,e){var r=e.getAttribute("data-fa-mask"),s=r?D2(r.split(" ").map(function(i){return i.trim()})):n3();return s.prefix||(s.prefix=X()),l.mask=s,l.maskId=e.getAttribute("data-fa-mask-id"),l}}},provides:function(a){a.generateAbstractMask=function(l){var e=l.children,r=l.attributes,s=l.main,i=l.mask,n=l.maskId,f=l.transform,t=s.width,u=s.icon,m=i.width,v=i.icon,d=T6({transform:f,containerWidth:m,iconWidth:t}),S={tag:"rect",attributes:o(o({},Y2),{},{fill:"white"})},C=u.children?{children:u.children.map(z4)}:{},w={tag:"g",attributes:o({},d.inner),children:[z4(o({tag:u.tag,attributes:o(o({},u.attributes),d.path)},C))]},N={tag:"g",attributes:o({},d.outer),children:[w]},P="mask-".concat(n||_1()),F="clip-".concat(n||_1()),f2={tag:"mask",attributes:o(o({},Y2),{},{id:P,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[S,N]},q={tag:"defs",children:[{tag:"clipPath",attributes:{id:F},children:q8(v)},f2]};return e.push(q,{tag:"rect",attributes:o({fill:"currentColor","clip-path":"url(#".concat(F,")"),mask:"url(#".concat(P,")")},Y2)}),{children:e,attributes:r}}}},W8={provides:function(a){var l=!1;$.matchMedia&&(l=$.matchMedia("(prefers-reduced-motion: reduce)").matches),a.missingIconAbstract=function(){var e=[],r={fill:"currentColor"},s={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};e.push({tag:"path",attributes:o(o({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var i=o(o({},s),{},{attributeName:"opacity"}),n={tag:"circle",attributes:o(o({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return l||n.children.push({tag:"animate",attributes:o(o({},s),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:o(o({},i),{},{values:"1;0;1;1;0;1;"})}),e.push(n),e.push({tag:"path",attributes:o(o({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:l?[]:[{tag:"animate",attributes:o(o({},i),{},{values:"1;0;0;0;0;1;"})}]}),l||e.push({tag:"path",attributes:o(o({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:o(o({},i),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:e}}}},G8={hooks:function(){return{parseNodeAttributes:function(l,e){var r=e.getAttribute("data-fa-symbol"),s=r===null?!1:r===""?!0:r;return l.symbol=s,l}}}},j8=[B6,b8,y8,w8,k8,I8,E8,U8,O8,W8,G8];Q6(j8,{mixoutsTo:T});var f5=T.noAuto,M3=T.config,o5=T.library,d3=T.dom,S1=T.parse,t5=T.findIconDefinition,m5=T.toHtml,L3=T.icon,z5=T.layer,v3=T.text,g3=T.counter;var r2=class c{defaultPrefix="fas";fallbackIcon=null;fixedWidth;set autoAddCss(a){M3.autoAddCss=a,this._autoAddCss=a}get autoAddCss(){return this._autoAddCss}_autoAddCss=!0;static \u0275fac=R({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,deps:[],target:D.Injectable});static \u0275prov=W2({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,providedIn:"root"})};B({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:r2,decorators:[{type:O2,args:[{providedIn:"root"}]}]});var R2=class c{definitions={};addIcons(...a){for(let l of a){l.prefix in this.definitions||(this.definitions[l.prefix]={}),this.definitions[l.prefix][l.iconName]=l;for(let e of l.icon[2])typeof e=="string"&&(this.definitions[l.prefix][e]=l)}}addIconPacks(...a){for(let l of a){let e=Object.keys(l).map(r=>l[r]);this.addIcons(...e)}}getIconDefinition(a,l){return a in this.definitions&&l in this.definitions[a]?this.definitions[a][l]:null}static \u0275fac=R({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,deps:[],target:D.Injectable});static \u0275prov=W2({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,providedIn:"root"})};B({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:R2,decorators:[{type:O2,args:[{providedIn:"root"}]}]});var V8=c=>{throw new Error(`Could not find icon with iconName=${c.iconName} and prefix=${c.prefix} in the icon library.`)},_8=()=>{throw new Error("Property `icon` is required for `fa-icon`/`fa-duotone-icon` components.")},y1=c=>c!=null&&(c===90||c===180||c===270||c==="90"||c==="180"||c==="270"),C3=c=>{let a=y1(c.rotate),l={[`fa-${c.animation}`]:c.animation!=null&&!c.animation.startsWith("spin"),"fa-spin":c.animation==="spin"||c.animation==="spin-reverse","fa-spin-pulse":c.animation==="spin-pulse"||c.animation==="spin-pulse-reverse","fa-spin-reverse":c.animation==="spin-reverse"||c.animation==="spin-pulse-reverse","fa-pulse":c.animation==="spin-pulse"||c.animation==="spin-pulse-reverse","fa-fw":c.fixedWidth,"fa-border":c.border,"fa-inverse":c.inverse,"fa-layers-counter":c.counter,"fa-flip-horizontal":c.flip==="horizontal"||c.flip==="both","fa-flip-vertical":c.flip==="vertical"||c.flip==="both",[`fa-${c.size}`]:c.size!==null,[`fa-rotate-${c.rotate}`]:a,"fa-rotate-by":c.rotate!=null&&!a,[`fa-pull-${c.pull}`]:c.pull!==null,[`fa-stack-${c.stackItemSize}`]:c.stackItemSize!=null};return Object.keys(l).map(e=>l[e]?e:null).filter(e=>e!=null)},N1=new WeakSet,h3="fa-auto-css";function H2(c,a){if(!a.autoAddCss||N1.has(c))return;if(c.getElementById(h3)!=null){a.autoAddCss=!1,N1.add(c);return}let l=c.createElement("style");l.setAttribute("type","text/css"),l.setAttribute("id",h3),l.innerHTML=d3.css();let e=c.head.childNodes,r=null;for(let s=e.length-1;s>-1;s--){let i=e[s],n=i.nodeName.toUpperCase();["STYLE","LINK"].indexOf(n)>-1&&(r=i)}c.head.insertBefore(l,r),a.autoAddCss=!1,N1.add(c)}var $8=c=>c.prefix!==void 0&&c.iconName!==void 0,X8=(c,a)=>$8(c)?c:Array.isArray(c)&&c.length===2?{prefix:c[0],iconName:c[1]}:{prefix:a,iconName:c},K=class c{stackItemSize=h("1x");size=h();_effect=A1(()=>{if(this.size())throw new Error('fa-icon is not allowed to customize size when used inside fa-stack. Set size on the enclosing fa-stack instead: <fa-stack size="4x">...</fa-stack>.')});static \u0275fac=R({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,deps:[],target:D.Directive});static \u0275dir=F1({minVersion:"17.1.0",version:"21.0.0",type:c,isStandalone:!0,selector:"fa-icon[stackItemSize],fa-duotone-icon[stackItemSize]",inputs:{stackItemSize:{classPropertyName:"stackItemSize",publicName:"stackItemSize",isSignal:!0,isRequired:!1,transformFunction:null},size:{classPropertyName:"size",publicName:"size",isSignal:!0,isRequired:!1,transformFunction:null}},ngImport:L})};B({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:K,decorators:[{type:P1,args:[{selector:"fa-icon[stackItemSize],fa-duotone-icon[stackItemSize]"}]}],propDecorators:{stackItemSize:[{type:M,args:[{isSignal:!0,alias:"stackItemSize",required:!1}]}],size:[{type:M,args:[{isSignal:!0,alias:"size",required:!1}]}]}});var Q=class c{size=h();classes=Z(()=>{let a=this.size(),l=a?{[`fa-${a}`]:!0}:{};return q2(U2({},l),{"fa-stack":!0})});static \u0275fac=R({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,deps:[],target:D.Component});static \u0275cmp=c2({minVersion:"17.1.0",version:"21.0.0",type:c,isStandalone:!0,selector:"fa-stack",inputs:{size:{classPropertyName:"size",publicName:"size",isSignal:!0,isRequired:!1,transformFunction:null}},host:{properties:{class:"classes()"}},ngImport:L,template:"<ng-content />",isInline:!0,changeDetection:y.OnPush})};B({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:Q,decorators:[{type:O,args:[{selector:"fa-stack",template:"<ng-content />",host:{"[class]":"classes()"},changeDetection:y.OnPush}]}],propDecorators:{size:[{type:M,args:[{isSignal:!0,alias:"size",required:!1}]}]}});var U=class c{icon=A();title=A();animation=A();mask=A();flip=A();size=A();pull=A();border=A();inverse=A();symbol=A();rotate=A();fixedWidth=A();transform=A();a11yRole=A();renderedIconHTML=Z(()=>{let a=this.icon()??this.config.fallbackIcon;if(!a)return _8(),"";let l=this.findIconDefinition(a);if(!l)return"";let e=this.buildParams();H2(this.document,this.config);let r=L3(l,e);return this.sanitizer.bypassSecurityTrustHtml(r.html.join(`
`))});document=x(J);sanitizer=x(h2);config=x(r2);iconLibrary=x(R2);stackItem=x(K,{optional:!0});stack=x(Q,{optional:!0});constructor(){this.stack!=null&&this.stackItem==null&&console.error('FontAwesome: fa-icon and fa-duotone-icon elements must specify stackItemSize attribute when wrapped into fa-stack. Example: <fa-icon stackItemSize="2x" />.')}findIconDefinition(a){let l=X8(a,this.config.defaultPrefix);if("icon"in l)return l;let e=this.iconLibrary.getIconDefinition(l.prefix,l.iconName);return e??(V8(l),null)}buildParams(){let a=this.fixedWidth(),l={flip:this.flip(),animation:this.animation(),border:this.border(),inverse:this.inverse(),size:this.size(),pull:this.pull(),rotate:this.rotate(),fixedWidth:typeof a=="boolean"?a:this.config.fixedWidth,stackItemSize:this.stackItem!=null?this.stackItem.stackItemSize():void 0},e=this.transform(),r=typeof e=="string"?S1.transform(e):e,s=this.mask(),i=s!=null?this.findIconDefinition(s):null,n={},f=this.a11yRole();f!=null&&(n.role=f);let t={};return l.rotate!=null&&!y1(l.rotate)&&(t["--fa-rotate-angle"]=`${l.rotate}`),{title:this.title(),transform:r,classes:C3(l),mask:i??void 0,symbol:this.symbol(),attributes:n,styles:t}}static \u0275fac=R({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,deps:[],target:D.Component});static \u0275cmp=c2({minVersion:"17.1.0",version:"21.0.0",type:c,isStandalone:!0,selector:"fa-icon",inputs:{icon:{classPropertyName:"icon",publicName:"icon",isSignal:!0,isRequired:!1,transformFunction:null},title:{classPropertyName:"title",publicName:"title",isSignal:!0,isRequired:!1,transformFunction:null},animation:{classPropertyName:"animation",publicName:"animation",isSignal:!0,isRequired:!1,transformFunction:null},mask:{classPropertyName:"mask",publicName:"mask",isSignal:!0,isRequired:!1,transformFunction:null},flip:{classPropertyName:"flip",publicName:"flip",isSignal:!0,isRequired:!1,transformFunction:null},size:{classPropertyName:"size",publicName:"size",isSignal:!0,isRequired:!1,transformFunction:null},pull:{classPropertyName:"pull",publicName:"pull",isSignal:!0,isRequired:!1,transformFunction:null},border:{classPropertyName:"border",publicName:"border",isSignal:!0,isRequired:!1,transformFunction:null},inverse:{classPropertyName:"inverse",publicName:"inverse",isSignal:!0,isRequired:!1,transformFunction:null},symbol:{classPropertyName:"symbol",publicName:"symbol",isSignal:!0,isRequired:!1,transformFunction:null},rotate:{classPropertyName:"rotate",publicName:"rotate",isSignal:!0,isRequired:!1,transformFunction:null},fixedWidth:{classPropertyName:"fixedWidth",publicName:"fixedWidth",isSignal:!0,isRequired:!1,transformFunction:null},transform:{classPropertyName:"transform",publicName:"transform",isSignal:!0,isRequired:!1,transformFunction:null},a11yRole:{classPropertyName:"a11yRole",publicName:"a11yRole",isSignal:!0,isRequired:!1,transformFunction:null}},outputs:{icon:"iconChange",title:"titleChange",animation:"animationChange",mask:"maskChange",flip:"flipChange",size:"sizeChange",pull:"pullChange",border:"borderChange",inverse:"inverseChange",symbol:"symbolChange",rotate:"rotateChange",fixedWidth:"fixedWidthChange",transform:"transformChange",a11yRole:"a11yRoleChange"},host:{properties:{"attr.title":"title() ?? undefined",innerHTML:"renderedIconHTML()"},classAttribute:"ng-fa-icon"},ngImport:L,template:"",isInline:!0,changeDetection:y.OnPush})};B({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:U,decorators:[{type:O,args:[{selector:"fa-icon",template:"",host:{class:"ng-fa-icon","[attr.title]":"title() ?? undefined","[innerHTML]":"renderedIconHTML()"},changeDetection:y.OnPush}]}],ctorParameters:()=>[],propDecorators:{icon:[{type:M,args:[{isSignal:!0,alias:"icon",required:!1}]},{type:k,args:["iconChange"]}],title:[{type:M,args:[{isSignal:!0,alias:"title",required:!1}]},{type:k,args:["titleChange"]}],animation:[{type:M,args:[{isSignal:!0,alias:"animation",required:!1}]},{type:k,args:["animationChange"]}],mask:[{type:M,args:[{isSignal:!0,alias:"mask",required:!1}]},{type:k,args:["maskChange"]}],flip:[{type:M,args:[{isSignal:!0,alias:"flip",required:!1}]},{type:k,args:["flipChange"]}],size:[{type:M,args:[{isSignal:!0,alias:"size",required:!1}]},{type:k,args:["sizeChange"]}],pull:[{type:M,args:[{isSignal:!0,alias:"pull",required:!1}]},{type:k,args:["pullChange"]}],border:[{type:M,args:[{isSignal:!0,alias:"border",required:!1}]},{type:k,args:["borderChange"]}],inverse:[{type:M,args:[{isSignal:!0,alias:"inverse",required:!1}]},{type:k,args:["inverseChange"]}],symbol:[{type:M,args:[{isSignal:!0,alias:"symbol",required:!1}]},{type:k,args:["symbolChange"]}],rotate:[{type:M,args:[{isSignal:!0,alias:"rotate",required:!1}]},{type:k,args:["rotateChange"]}],fixedWidth:[{type:M,args:[{isSignal:!0,alias:"fixedWidth",required:!1}]},{type:k,args:["fixedWidthChange"]}],transform:[{type:M,args:[{isSignal:!0,alias:"transform",required:!1}]},{type:k,args:["transformChange"]}],a11yRole:[{type:M,args:[{isSignal:!0,alias:"a11yRole",required:!1}]},{type:k,args:["a11yRoleChange"]}]}});var s2=class c extends U{swapOpacity=h();primaryOpacity=h();secondaryOpacity=h();primaryColor=h();secondaryColor=h();findIconDefinition(a){let l=super.findIconDefinition(a);if(l!=null&&!Array.isArray(l.icon[4]))throw new Error(`The specified icon does not appear to be a Duotone icon. Check that you specified the correct style: <fa-duotone-icon [icon]="['fad', '${l.iconName}']" /> or use: <fa-icon icon="${l.iconName}" /> instead.`);return l}buildParams(){let a=super.buildParams(),l=this.swapOpacity();(l===!0||l==="true")&&(Array.isArray(a.classes)?a.classes.push("fa-swap-opacity"):typeof a.classes=="string"?a.classes=[a.classes,"fa-swap-opacity"]:a.classes=["fa-swap-opacity"]),a.styles==null&&(a.styles={});let e=this.primaryOpacity();e!=null&&(a.styles["--fa-primary-opacity"]=e.toString());let r=this.secondaryOpacity();r!=null&&(a.styles["--fa-secondary-opacity"]=r.toString());let s=this.primaryColor();s!=null&&(a.styles["--fa-primary-color"]=s);let i=this.secondaryColor();return i!=null&&(a.styles["--fa-secondary-color"]=i),a}static \u0275fac=R({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,deps:null,target:D.Component});static \u0275cmp=c2({minVersion:"17.1.0",version:"21.0.0",type:c,isStandalone:!0,selector:"fa-duotone-icon",inputs:{swapOpacity:{classPropertyName:"swapOpacity",publicName:"swapOpacity",isSignal:!0,isRequired:!1,transformFunction:null},primaryOpacity:{classPropertyName:"primaryOpacity",publicName:"primaryOpacity",isSignal:!0,isRequired:!1,transformFunction:null},secondaryOpacity:{classPropertyName:"secondaryOpacity",publicName:"secondaryOpacity",isSignal:!0,isRequired:!1,transformFunction:null},primaryColor:{classPropertyName:"primaryColor",publicName:"primaryColor",isSignal:!0,isRequired:!1,transformFunction:null},secondaryColor:{classPropertyName:"secondaryColor",publicName:"secondaryColor",isSignal:!0,isRequired:!1,transformFunction:null}},usesInheritance:!0,ngImport:L,template:"",isInline:!0,changeDetection:y.OnPush})};B({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:s2,decorators:[{type:O,args:[{selector:"fa-duotone-icon",template:"",changeDetection:y.OnPush}]}],propDecorators:{swapOpacity:[{type:M,args:[{isSignal:!0,alias:"swapOpacity",required:!1}]}],primaryOpacity:[{type:M,args:[{isSignal:!0,alias:"primaryOpacity",required:!1}]}],secondaryOpacity:[{type:M,args:[{isSignal:!0,alias:"secondaryOpacity",required:!1}]}],primaryColor:[{type:M,args:[{isSignal:!0,alias:"primaryColor",required:!1}]}],secondaryColor:[{type:M,args:[{isSignal:!0,alias:"secondaryColor",required:!1}]}]}});var x3=(c,a,l)=>{if(!c)throw new Error(`${l} should be used as child of ${a} only.`)},V=class c{size=h();fixedWidth=h();faFw=Z(()=>{let a=this.fixedWidth();return typeof a=="boolean"?a:this.config.fixedWidth});classes=Z(()=>{let a=this.size(),l=a?{[`fa-${a}`]:!0}:{};return q2(U2({},l),{"fa-fw":this.faFw(),"fa-layers":!0})});document=x(J);config=x(r2);ngOnInit(){H2(this.document,this.config)}static \u0275fac=R({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,deps:[],target:D.Component});static \u0275cmp=c2({minVersion:"17.1.0",version:"21.0.0",type:c,isStandalone:!0,selector:"fa-layers",inputs:{size:{classPropertyName:"size",publicName:"size",isSignal:!0,isRequired:!1,transformFunction:null},fixedWidth:{classPropertyName:"fixedWidth",publicName:"fixedWidth",isSignal:!0,isRequired:!1,transformFunction:null}},host:{properties:{class:"classes()"}},ngImport:L,template:"<ng-content />",isInline:!0,changeDetection:y.OnPush})};B({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:V,decorators:[{type:O,args:[{selector:"fa-layers",template:"<ng-content />",host:{"[class]":"classes()"},changeDetection:y.OnPush}]}],propDecorators:{size:[{type:M,args:[{isSignal:!0,alias:"size",required:!1}]}],fixedWidth:[{type:M,args:[{isSignal:!0,alias:"fixedWidth",required:!1}]}]}});var i2=class c{content=h.required();title=h();position=h();renderedHTML=Z(()=>{let a=this.buildParams();return this.updateContent(a)});document=x(J);config=x(r2);parent=x(V,{optional:!0});sanitizer=x(h2);constructor(){x3(this.parent,"FaLayersComponent","FaLayersCounterComponent")}buildParams(){let a=this.position();return{title:this.title(),classes:a!=null?[`fa-layers-${a}`]:void 0}}updateContent(a){return H2(this.document,this.config),this.sanitizer.bypassSecurityTrustHtml(g3(this.content()||"",a).html.join(""))}static \u0275fac=R({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,deps:[],target:D.Component});static \u0275cmp=c2({minVersion:"17.1.0",version:"21.0.0",type:c,isStandalone:!0,selector:"fa-layers-counter",inputs:{content:{classPropertyName:"content",publicName:"content",isSignal:!0,isRequired:!0,transformFunction:null},title:{classPropertyName:"title",publicName:"title",isSignal:!0,isRequired:!1,transformFunction:null},position:{classPropertyName:"position",publicName:"position",isSignal:!0,isRequired:!1,transformFunction:null}},host:{properties:{innerHTML:"renderedHTML()"},classAttribute:"ng-fa-layers-counter"},ngImport:L,template:"",isInline:!0,changeDetection:y.OnPush})};B({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:i2,decorators:[{type:O,args:[{selector:"fa-layers-counter",template:"",host:{class:"ng-fa-layers-counter","[innerHTML]":"renderedHTML()"},changeDetection:y.OnPush}]}],ctorParameters:()=>[],propDecorators:{content:[{type:M,args:[{isSignal:!0,alias:"content",required:!0}]}],title:[{type:M,args:[{isSignal:!0,alias:"title",required:!1}]}],position:[{type:M,args:[{isSignal:!0,alias:"position",required:!1}]}]}});var n2=class c{content=h.required();title=h();flip=h();size=h();pull=h();border=h();inverse=h();rotate=h();fixedWidth=h();transform=h();renderedHTML=Z(()=>{let a=this.buildParams();return this.updateContent(a)});document=x(J);config=x(r2);parent=x(V,{optional:!0});sanitizer=x(h2);constructor(){x3(this.parent,"FaLayersComponent","FaLayersTextComponent")}buildParams(){let a={flip:this.flip(),border:this.border(),inverse:this.inverse(),size:this.size(),pull:this.pull(),rotate:this.rotate(),fixedWidth:this.fixedWidth()},l=this.transform(),e=typeof l=="string"?S1.transform(l):l,r={};return a.rotate!=null&&!y1(a.rotate)&&(r["--fa-rotate-angle"]=`${a.rotate}`),{transform:e,classes:C3(a),title:this.title(),styles:r}}updateContent(a){return H2(this.document,this.config),this.sanitizer.bypassSecurityTrustHtml(v3(this.content()||"",a).html.join(`
`))}static \u0275fac=R({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,deps:[],target:D.Component});static \u0275cmp=c2({minVersion:"17.1.0",version:"21.0.0",type:c,isStandalone:!0,selector:"fa-layers-text",inputs:{content:{classPropertyName:"content",publicName:"content",isSignal:!0,isRequired:!0,transformFunction:null},title:{classPropertyName:"title",publicName:"title",isSignal:!0,isRequired:!1,transformFunction:null},flip:{classPropertyName:"flip",publicName:"flip",isSignal:!0,isRequired:!1,transformFunction:null},size:{classPropertyName:"size",publicName:"size",isSignal:!0,isRequired:!1,transformFunction:null},pull:{classPropertyName:"pull",publicName:"pull",isSignal:!0,isRequired:!1,transformFunction:null},border:{classPropertyName:"border",publicName:"border",isSignal:!0,isRequired:!1,transformFunction:null},inverse:{classPropertyName:"inverse",publicName:"inverse",isSignal:!0,isRequired:!1,transformFunction:null},rotate:{classPropertyName:"rotate",publicName:"rotate",isSignal:!0,isRequired:!1,transformFunction:null},fixedWidth:{classPropertyName:"fixedWidth",publicName:"fixedWidth",isSignal:!0,isRequired:!1,transformFunction:null},transform:{classPropertyName:"transform",publicName:"transform",isSignal:!0,isRequired:!1,transformFunction:null}},host:{properties:{innerHTML:"renderedHTML()"},classAttribute:"ng-fa-layers-text"},ngImport:L,template:"",isInline:!0,changeDetection:y.OnPush})};B({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:n2,decorators:[{type:O,args:[{selector:"fa-layers-text",template:"",host:{class:"ng-fa-layers-text","[innerHTML]":"renderedHTML()"},changeDetection:y.OnPush}]}],ctorParameters:()=>[],propDecorators:{content:[{type:M,args:[{isSignal:!0,alias:"content",required:!0}]}],title:[{type:M,args:[{isSignal:!0,alias:"title",required:!1}]}],flip:[{type:M,args:[{isSignal:!0,alias:"flip",required:!1}]}],size:[{type:M,args:[{isSignal:!0,alias:"size",required:!1}]}],pull:[{type:M,args:[{isSignal:!0,alias:"pull",required:!1}]}],border:[{type:M,args:[{isSignal:!0,alias:"border",required:!1}]}],inverse:[{type:M,args:[{isSignal:!0,alias:"inverse",required:!1}]}],rotate:[{type:M,args:[{isSignal:!0,alias:"rotate",required:!1}]}],fixedWidth:[{type:M,args:[{isSignal:!0,alias:"fixedWidth",required:!1}]}],transform:[{type:M,args:[{isSignal:!0,alias:"transform",required:!1}]}]}});var b1=class c{static \u0275fac=R({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c,deps:[],target:D.NgModule});static \u0275mod=B1({minVersion:"14.0.0",version:"21.0.0",ngImport:L,type:c,imports:[U,s2,V,n2,i2,Q,K],exports:[U,s2,V,n2,i2,Q,K]});static \u0275inj=D1({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:c})};B({minVersion:"12.0.0",version:"21.0.0",ngImport:L,type:b1,decorators:[{type:T1,args:[{imports:[U,s2,V,n2,i2,Q,K],exports:[U,s2,V,n2,i2,Q,K]}]}]});var S3=`@if (showScrollButton()) {
    <button type="button" class="awg-scroll-to-top-btn btn btn-info" aria-label="Scroll to top" (click)="scrollToTop()">
        <fa-icon [icon]="faArrowUp" />
    </button>
}
`;var N3=`.awg-scroll-to-top-btn{position:fixed;bottom:30px;right:30px;text-align:right;color:#fff;z-index:1000}.awg-scroll-to-top-btn:hover{cursor:pointer;color:#f0f0f0}
`;var C5={prefix:"fas",iconName:"envelope",icon:[512,512,[128386,9993,61443],"f0e0","M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z"]};var x5={prefix:"fas",iconName:"sort-up",icon:[384,512,["sort-asc"],"f0de","M32 224c-12.9 0-24.6-7.8-29.6-19.8S.2 178.5 9.4 169.4l160-160c12.5-12.5 32.8-12.5 45.3 0l160 160c9.2 9.2 11.9 22.9 6.9 34.9S364.9 224 352 224L32 224z"]};var S5={prefix:"fas",iconName:"expand",icon:[448,512,[],"f065","M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32S0 334.3 0 352l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"]};var N5={prefix:"fas",iconName:"table",icon:[448,512,[],"f0ce","M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64l-320 0-6.5-.3C25.2 476.4 0 449.1 0 416L0 96C0 60.7 28.7 32 64 32l320 0zM64 320l0 96 128 0 0-96-128 0zm192 0l0 96 128 0 0-96-128 0zM64 256l128 0 0-96-128 0 0 96zm192 0l128 0 0-96-128 0 0 96z"]};var b5={prefix:"fas",iconName:"chevron-right",icon:[320,512,[9002],"f054","M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"]};var y5={prefix:"fas",iconName:"network-wired",icon:[576,512,[],"f6ff","M248 88l80 0 0 48-80 0 0-48zm-8-56c-26.5 0-48 21.5-48 48l0 64c0 26.5 21.5 48 48 48l16 0 0 32-224 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0 0 32-16 0c-26.5 0-48 21.5-48 48l0 64c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-64c0-26.5-21.5-48-48-48l-16 0 0-32 192 0 0 32-16 0c-26.5 0-48 21.5-48 48l0 64c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-64c0-26.5-21.5-48-48-48l-16 0 0-32 96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-224 0 0-32 16 0c26.5 0 48-21.5 48-48l0-64c0-26.5-21.5-48-48-48l-96 0zM448 376l8 0 0 48-80 0 0-48 72 0zm-256 0l8 0 0 48-80 0 0-48 72 0z"]};var w5={prefix:"fas",iconName:"diagram-project",icon:[512,512,["project-diagram"],"f542","M0 80C0 53.5 21.5 32 48 32l96 0c26.5 0 48 21.5 48 48l0 16 128 0 0-16c0-26.5 21.5-48 48-48l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-16-128 0 0 16c0 7.3-1.7 14.3-4.6 20.5l68.6 91.5 80 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96c0-7.3 1.7-14.3 4.6-20.5L128 224 48 224c-26.5 0-48-21.5-48-48L0 80z"]};var k5={prefix:"fas",iconName:"folder",icon:[512,512,[128193,128447,61716,"folder-blank"],"f07b","M64 448l384 0c35.3 0 64-28.7 64-64l0-240c0-35.3-28.7-64-64-64L298.7 80c-6.9 0-13.7-2.2-19.2-6.4L241.1 44.8C230 36.5 216.5 32 202.7 32L64 32C28.7 32 0 60.7 0 96L0 384c0 35.3 28.7 64 64 64z"]};var b3={prefix:"fas",iconName:"arrow-up",icon:[384,512,[8593],"f062","M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"]};var Q8={prefix:"fas",iconName:"house",icon:[512,512,[127968,63498,63500,"home","home-alt","home-lg-alt"],"f015","M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"]},A5=Q8;var P5={prefix:"fas",iconName:"arrow-right",icon:[512,512,[8594],"f061","M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"]};var T5={prefix:"fas",iconName:"calendar-xmark",icon:[448,512,["calendar-times"],"f273","M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-32c0-17.7 14.3-32 32-32zM291.9 220.1c-9.4-9.4-24.6-9.4-33.9 0l-33.9 33.9-33.9-33.9c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l33.9 33.9-33.9 33.9c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l33.9-33.9 33.9 33.9c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-33.9-33.9 33.9-33.9c9.4-9.4 9.4-24.6 0-33.9z"]};var J8={prefix:"fas",iconName:"file-lines",icon:[384,512,[128441,128462,61686,"file-alt","file-text"],"f15c","M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM120 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"]},F5=J8;var Z8={prefix:"fas",iconName:"circle-check",icon:[512,512,[61533,"check-circle"],"f058","M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"]},D5=Z8;var B5={prefix:"fas",iconName:"list",icon:[512,512,["list-squares"],"f03a","M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"]};var R5={prefix:"fas",iconName:"chevron-down",icon:[448,512,[],"f078","M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"]};var c5={prefix:"fas",iconName:"minimize",icon:[512,512,["compress-arrows-alt"],"f78c","M456 224l-144 0c-13.3 0-24-10.7-24-24l0-144c0-9.7 5.8-18.5 14.8-22.2S322.1 32.2 329 39l40 40 73.4-73.4C446 2 450.9 0 456 0s10 2 13.7 5.7l36.7 36.7C510 46 512 50.9 512 56s-2 10-5.7 13.7L433 143 473 183c6.9 6.9 8.9 17.2 5.2 26.2S465.7 224 456 224zm0 64c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-40 40 73.4 73.4c3.6 3.6 5.7 8.5 5.7 13.7s-2 10-5.7 13.7l-36.7 36.7C466 510 461.1 512 456 512s-10-2-13.7-5.7L369 433 329 473c-6.9 6.9-17.2 8.9-26.2 5.2S288 465.7 288 456l0-144c0-13.3 10.7-24 24-24l144 0zm-256 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-40-40-73.4 73.4C66 510 61.1 512 56 512s-10-2-13.7-5.7L5.7 469.7C2 466 0 461.1 0 456s2-10 5.7-13.7L79 369 39 329c-6.9-6.9-8.9-17.2-5.2-26.2S46.3 288 56 288l144 0zM56 224c-9.7 0-18.5-5.8-22.2-14.8S32.2 189.9 39 183L79 143 5.7 69.7C2 66 0 61.1 0 56S2 46 5.7 42.3L42.3 5.7C46 2 50.9 0 56 0S66 2 69.7 5.7L143 79 183 39c6.9-6.9 17.2-8.9 26.2-5.2S224 46.3 224 56l0 144c0 13.3-10.7 24-24 24L56 224z"]},H5=c5;var I5={prefix:"fas",iconName:"music",icon:[512,512,[127925],"f001","M468 7c7.6 6.1 12 15.3 12 25l0 304c0 44.2-43 80-96 80s-96-35.8-96-80 43-80 96-80c11.2 0 22 1.6 32 4.6l0-116.7-224 49.8 0 206.3c0 44.2-43 80-96 80s-96-35.8-96-80 43-80 96-80c11.2 0 22 1.6 32 4.6L128 96c0-15 10.4-28 25.1-31.2l288-64c9.5-2.1 19.4 .2 27 6.3z"]};var E5={prefix:"fas",iconName:"compress",icon:[448,512,[],"f066","M160 64c0-17.7-14.3-32-32-32S96 46.3 96 64l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"]};var U5={prefix:"fas",iconName:"square",icon:[448,512,[9632,9723,9724,61590],"f0c8","M64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32z"]};var q5={prefix:"fas",iconName:"screwdriver-wrench",icon:[576,512,["tools"],"f7d9","M70.8-6.7c5.4-5.4 13.8-6.2 20.2-2L209.9 70.5c8.9 5.9 14.2 15.9 14.2 26.6l0 49.6 90.8 90.8c33.3-15 73.9-8.9 101.2 18.5L542.2 382.1c18.7 18.7 18.7 49.1 0 67.9l-60.1 60.1c-18.7 18.7-49.1 18.7-67.9 0L288.1 384c-27.4-27.4-33.5-67.9-18.5-101.2l-90.8-90.8-49.6 0c-10.7 0-20.7-5.3-26.6-14.2L23.4 58.9c-4.2-6.3-3.4-14.8 2-20.2L70.8-6.7zm145 303.5c-6.3 36.9 2.3 75.9 26.2 107.2l-94.9 95c-28.1 28.1-73.7 28.1-101.8 0s-28.1-73.7 0-101.8l135.4-135.5 35.2 35.1zM384.1 0c20.1 0 39.4 3.7 57.1 10.5 10 3.8 11.8 16.5 4.3 24.1L388.8 91.3c-3 3-4.7 7.1-4.7 11.3l0 41.4c0 8.8 7.2 16 16 16l41.4 0c4.2 0 8.3-1.7 11.3-4.7l56.7-56.7c7.6-7.5 20.3-5.7 24.1 4.3 6.8 17.7 10.5 37 10.5 57.1 0 43.2-17.2 82.3-45 111.1l-49.1-49.1c-33.1-33-78.5-45.7-121.1-38.4l-56.8-56.8 0-29.7-.2-5c-.8-12.4-4.4-24.3-10.5-34.9 29.4-35 73.4-57.2 122.7-57.3z"]};var O5={prefix:"fas",iconName:"angles-left",icon:[448,512,[171,"angle-double-left"],"f100","M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 256 406.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"]};var W5={prefix:"fas",iconName:"list-ul",icon:[512,512,["list-dots"],"f0ca","M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM48 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 256a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"]};var G5={prefix:"fas",iconName:"circle-info",icon:[512,512,["info-circle"],"f05a","M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"]};var j5={prefix:"fas",iconName:"sort-down",icon:[384,512,["sort-desc"],"f0dd","M32 288c-12.9 0-24.6 7.8-29.6 19.8S.2 333.5 9.4 342.6l160 160c12.5 12.5 32.8 12.5 45.3 0l160-160c9.2-9.2 11.9-22.9 6.9-34.9S364.9 288 352 288L32 288z"]};var y3=class{constructor(){this._document=x(J),this.showScrollButton=k1(!1),this.faArrowUp=b3}onWindowScroll(){let l=this._document.defaultView?.scrollY||0;this.showScrollButton.set(l>=300)}scrollToTop(){this._document.defaultView?.scrollTo({top:0,behavior:"smooth"})}};y3=w1([O({selector:"awg-scroll-to-top-button",template:S3,host:{"(window:scroll)":"onWindowScroll()"},changeDetection:y.OnPush,imports:[U],styles:[N3]})],y3);var a7={thomas_ahrend:{name:"Thomas Ahrend",homepage:C2.AWG_PROJECT_URL+"de/projekt/mitarbeitende.html",identifiers:{gnd:"129772429",viaf:"74941235"}},michael_matter:{name:"Michael Matter",homepage:C2.AWG_PROJECT_URL+"de/projekt/mitarbeitende.html",identifiers:{gnd:"1069569267",viaf:"256375308"}},stefan_muennich:{name:"Stefan M\xFCnnich",homepage:C2.AWG_PROJECT_URL+"de/projekt/mitarbeitende.html",identifiers:{gnd:"1068032472",orcid:"0000-0002-0744-5374",viaf:"314885087"}}};export{U as a,b1 as b,C5 as c,x5 as d,S5 as e,N5 as f,b5 as g,y5 as h,w5 as i,k5 as j,A5 as k,P5 as l,T5 as m,F5 as n,D5 as o,B5 as p,R5 as q,H5 as r,I5 as s,E5 as t,U5 as u,q5 as v,O5 as w,W5 as x,G5 as y,j5 as z,y3 as A,a7 as B};
