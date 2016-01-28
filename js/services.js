angular.module('prototypeApp.services', []);


/*

                     routeNavigation
                INSPIRED BY Tilman Potthof,
                SEE CREDITS: ROUTING NAVBAR

*/
// app.factory('routeNavigation', function($route, $location){
//     var routes = [];
//     angular.forEach($route.routes, function(route, path){
//         if (route.name) {
//             if (route.name !== 'Kontakt'){
//                 routes.push({
//                     path: path,
//                     name: route.name
//                 });
//             } else {
//                 routes.push ({
//                     path_rightnav: path,
//                     name_rightnav: route.name
//                 })
//             }
//         }
//     });
//     return {
//         routes: routes,
//         activeRoute: function (route) {
//             return route.path === $location.path();
//         }
//     };
// });


/*

                    salsahAPIservice

*/
app.factory('salsahAPIservice', function($http){

    //CONVERTS LINEAR SALSAH STANDOFF (string with textattributes) TO HTML USING PLUGIN "convert_lin2html"
    function convert (str, attr) {
        var y = JSON.parse(attr);
        var x = str;
        var z = convert_lin2html(y, x);
        return z;
    }; //END convert (func)


    //CALLS AN OBJECT VIA http.get AND PREPARES DATA FOR DISPLAYING IN VIEW
    function getObject (url, id){

        //INIT
        var tmp = {'header': {}, 'props':[], 'incoming':[]};
        var data, props, info = {};

        //GET DATA
        return $http.get(url + '/api/resources/' + id).then(function (response){
            data = response.data;
            if (data.access === 'OK') {
                props = data.props;
                info = data.resinfo;

                //PREPARE INCOMING PROPERTIES
                angular.forEach(data.incoming, function(ins){
                    tmp['incoming'].push({
                        id: ins.ext_res_id.id,
                        value: ins.value,
                        icon: ins.resinfo.restype_iconsrc
                    });
                }); // END forEach data.incoming

                //PREPARE OBJECT PROPERTIES
                angular.forEach(props, function(prop){
                    var propValue = [''];

                    //CLEAN VALUE LABELS
                    prop.label = prop.label.replace(' (Richtext)', '');

                    //CHECK IF VALUES PROPERTY IS DEFINED
                    if ('values' in prop) {

                        //CHECK FOR GUI-ELEMENTS
                        switch (prop.valuetype_id) {
                            case '14': // RICHTEXT: SALSAH STANDOFF NEEDS TO BE CONVERTED

                                //CHECK FOR MUTLIPLE && NOT EMPTY VALUES
                                if (prop.values.length > 0 && prop.values[0].utf8str !== '') {
                                    for (var i = 0; i < prop.values.length; i++){

                                        //INIT
                                        var htmlstr = '',
                                            salsahLink = [],

                                            //REGEXP FOR OBJECT ID (4-6 DIGITS)
                                            patNum = /\d{4,6}/,

                                            //REGEXP FOR SALSAH LINKS
                                            patLink = /<a href="(http:\/\/www.salsah.org\/api\/resources\/\d{4,6})" class="salsah-link">(.*?)<\/a>/i;

                                        //CONVERT LINEAR SALSAH STANDOFF TO HTML (USING PLUGIN "convert_lin2html")
                                        htmlstr = convert(prop.values[i].utf8str, prop.values[i].textattr);

                                        //CHECK ONLY! FOR SALSAH LINKS
                                        while (p = patLink.exec(htmlstr)) {
                                            //i.e.: AS LONG AS patLink IS DETECTED IN htmlstr DO...

                                            //GET RESOURCE ID
                                            var res_id = patNum.exec(p[1])[0];

                                            //REPLACE HREF ATTRIBUTE WITH NG-CLICK-DIRECTIVE
                                            //LINKTEXT IS STORED IN SECOND RegExp-RESULT p[2]
                                            htmlstr = htmlstr.replace(p[0], '<a ng-click="showObject(' + res_id + ')">' + p[2] + '</a>');
                                        }; //END while

                                        //CHECK IF <p>-TAGS NOT EXIST (indexOf -1), THEN ADD THEM & CONCAT STRING TO propValue[0]
                                        if (htmlstr.indexOf('<p>') === -1) {
                                            propValue[0] += htmlstr.replace(htmlstr, '<p>$&</p>');
                                        } else {
                                            propValue[0] += htmlstr;
                                        };
                                    };

                                //EMPTY VALUES
                                } else {
                                    propValue[0] = '';
                                };
                                break; //END richtext

                            case '4': // DATE: SALSAH OBJECT NEEDS TO BE CONVERTED (USING PLUGIN "convert_jul2greg.js")
                                propValue[0] = convert_date(prop.values[0]);
                                break; //END date

                            case '6': //SEARCHBOX: LINKAGE TO ANOTHER SALSAH OBJECT NEEDS TO BE CONVERTED
                                if (prop.values.length > 0) {
                                    for (var i = 0; i < prop.values.length; i++){
                                        //ADD <p> & <a> with NG-CLICK-DIRECTIVE
                                        //LINKTEXT IS STORED IN $&
                                        propValue[0] += prop.value_firstprops[i].replace(prop.value_firstprops[i], '<p><a ng-click="showObject(' + prop.values[i] + ')">$& (' + prop.value_restype[i] + ')<a/></p>');

                                        if (prop.value_restype[i] === 'Chronology') {
                                            // TODO: possibly numeric value should be converted
                                            //console.log('ChronologieItem found: ' + prop.values[0]);
                                        } //END if
                                    } //END for
                                } else {
                                    console.log('= 0:::: ' + propValue[0]);
                                }
                                break; //END searchbox

                            case '12': //HLIST: HLIST NODES HAVE TO BE READ SEPERATLY
                                console.log('detected hlist');
                                //VALUES[0] gives reference id to
                                // http://test-01.salsah.org/api/hlists/{{:id}}?reqtype=node
                                //result is an array (properties: id, label, name) with nodes from 0 to n
                                break; //END hlist

                            default: // '1'=> TEXT: PROPERTIES COME AS THEY ARE
                                if (prop.values[0] !== '') {
                                    for (var i = 0; i < prop.values.length; i++){
                                        propValue[0] += prop.values[i];
                                    };
                                } else {

                                    // EMPTY TEXT VALUE
                                    propValue[0] = '';
                                };
                        } //END switch

                        //PUSH VALUES INTO TMP VARIABLE
                        tmp.props.push({
                            pid: prop.pid,
                            guielement: prop.guielement,
                            label: prop.label,
                            value: propValue
                        });

                    //ELSE VALUES PROPERTY NOT DEFINED
                    } else {

                        //PUSH EMPTY VALUE INTO TMP VARIABLE
                        tmp.props.push({
                            pid: prop.pid,
                            guielement: prop.guielement,
                            label: prop.label,
                            // VALUE NOT DEFINED
                            value: ''
                        }); // END PUSH
                    }; //END if else
                }); // END forEach PROPS

                //PREPARE OBJECT META INFOS
                switch (info.restype_label) {
                    case 'Person':
                        var lname = props['salsah:lastname'].values[0],
                            fname = props['salsah:firstname'].values[0];
                        tmp['header'] = {
                            'obj_id': id,
                            'icon': info.restype_iconsrc,
                            'type': info.restype_label,
                            'title': fname + ' ' + lname,
                            'lastmod': info.lastmod
                        }
                        break;

                    case 'Supplement':
                        tmp['header'] = {
                            'obj_id': id,
                            'icon': info.restype_iconsrc,
                            'type': info.restype_label,
                            'title': props['dc:title'].values[0],
                            'lastmod': info.lastmod
                        }
                        break;

                    case 'Werk':
                        tmp['header'] = {
                            'obj_id': id,
                            'icon': info.restype_iconsrc,
                            'type': info.restype_label,
                            'title': props['dc:title'].values[0],
                            'lastmod': info.lastmod
                        }
                        break;

                    case 'Musikstück (Moldenhauer-Nummer)':
                        tmp['header'] = {
                            'obj_id': id,
                            'icon': info.restype_iconsrc,
                            'type': info.restype_label,
                            'title': '[M ' + props['webern:mnr'].values[0] + '] ' + props['dc:title'].values[0],
                            'lastmod': info.lastmod
                        }
                        break;

                    case 'Chronology':
                        var htmlstr = '';

                        // RICHTEXT VALUE HAS ALREADY BEEN CONVERTED IN TMP USING PLUGIN "convert_lin2html"
                        htmlstr = tmp.props[0].value[0];

                        //STRIP & REPLACE <p>-TAGS FOR DISPLAYING OBJTITLE
                        htmlstr = htmlstr.replace(/<\/p><p>/g, '<br />');
                        htmlstr = htmlstr.replace(/<p>|<\/p>/g, '');
                        htmlstr = htmlstr.replace(htmlstr, '«$&»');
                        tmp['header'] = {
                            'obj_id': id,
                            'icon': info.restype_iconsrc,
                            'type': info.restype_label,
                            'title': htmlstr,
                            'lastmod': info.lastmod
                        }
                        break;

                    default:
                    // TODO
                }; //END switch MTEA-INFOS
            } //END if access === OK

            // ELSE no acces to objects
            else {
                console.log('No access');
                tmp['incoming'] = '';
                tmp['header'] = {
                    'obj_id': id,
                    'icon': 'http://www.salsah.org/app/icons/16x16/delete.png',
                    'type': 'restricted',
                    'title': 'Kein Zugriff auf dieses Objekt möglich',
                    'lastmod': '---'
                }
            }

            return tmp;

        }); // END then
    }; //END getObject (func)


    //FULLTEXTSEARCH VIA SALSAH API
    function fulltextSearch (url, query) {

        //GET DATA
        return $http.get(url + '/api/search/' + query + '?searchtype=fulltext&filter_by_project=6').then(function (response){
            tmp = response.data;

            // =>Chronologie =>Ereignis: SALSAH STANDOFF NEEDS TO BE CONVERTED BEFORE DISPLAYING
            angular.forEach(tmp.subjects, function(subj){

                //CLEAN VALUE LABELS
                subj.valuelabel[0] = subj.valuelabel[0].replace(' (Richtext)', '');

                //valuetype_id 14 = valuelabel 'Ereignis'
                if (subj.valuetype_id[0] == '14') {
                    var htmlstr = '';
                    htmlstr = convert(subj.value[0].utf8str, subj.value[0].textattr);

                    //STRIP & REPLACE <p>-TAGS FOR DISPLAYING OBJTITLE
                    htmlstr = htmlstr.replace(/<\/p><p>/g, '<br />');
                    htmlstr = htmlstr.replace(/<p>|<\/p>/g, '');
                    htmlstr = htmlstr.replace(htmlstr, '«$&»');
                    subj.value[0] = htmlstr;
                }; // END if
            }); // END forEach

            return tmp;

        }); // END then
    }; //END fulltextSearch (func)


    return {
        convert2html: convert,  //RETURNS A STRING
        getObject: getObject,   //RETURNS A PROMISE
        fulltextSearch: fulltextSearch  //RETURNS A PROMISE
    };
})
