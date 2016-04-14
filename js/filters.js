angular.module('prototypeApp.filters', []);

app.filter('highlight', function() {
    return function(haystack, needle) {
        //IF HAYSTACK && NEEDLE EXIST
        if (haystack && needle) {
            haystack = haystack.toString(); //CONVERT TO STRING

            //ONLY PROCEED IF HAYSTACK INCLUDES NEEDLE
            if (haystack.includes(needle)) {

                //INIT SEARCH- & REPLACE-STRING
                    //GLOBAL SEARCH FOR NEEDLE
                var searchString = new RegExp('(' + needle + ')', 'gi'),
                    //REPLACE WITH HIGHLIGHTED-CLASS
                    replaceString = '<span class="highlighted">$1</span>';

                //CHECK FOR LINK-TAGS ("<a") IN HAYSTACK...
                if (res = haystack.match(/<a/g)) { //RETURNS MATCHES

                    //INIT INDEX-POSITIONS
                    var strStartPos = 0,
                        linkStartPos = 0,
                        linkEndPos = 0,
                        tmp = []; //ARRAY_CONTAINER FOR SUBSTRINGS

                    //LOOP THROUGH MATCH-ARRAY res
                    for (var i = 0; i < res.length; i++) {
                        //GET START- & END-INDEXPOSITION OF NEXT LINK-TAG
                        linkStartPos = haystack.indexOf("<a", strStartPos);
                        linkEndPos = haystack.indexOf(">", linkStartPos) + 1;

                        //GET AND REPLACE SUBSTRING ON THE LEFT SIDE OF NEXT LINK
                        tmp[2*i] = haystack.substring(strStartPos, linkStartPos).replace(searchString, replaceString);

                        //SKIP THE LINK
                        tmp[2*i+1] = haystack.substring(linkStartPos, linkEndPos);

                        //TAKE ENDPOSITION OF LINK AS STARTPOSITION FOR NEXT LOOP
                        strStartPos = linkEndPos;
                    }
                    //GET AND REPLACE SUBSTRING ON THE RIGHT SIDE OF LAST LINK
                    tmp[tmp.length] = haystack.substr(strStartPos).replace(searchString, replaceString);                    

                    //JOIN THE REPLACED ELEMENTS OF TMP-ARRAY INTO STRING HAYSTACK
                    haystack = tmp.join("");

                //THERE IS NO LINK: SIMPLY HIGHLIGHT NEEDLE
                } else {
                    haystack = haystack.replace(searchString, replaceString);
                };
            };
        };
        return haystack;
    };
});
