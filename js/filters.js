angular.module('prototypeApp.filters', []);

app.filter('highlight', function() {
    return function(haystack, needle) {
        //IF HAYSTACK && NEEDLE EXIST
        if ((haystack && needle) || angular.isNumber(needle)) {
            //CONVERT TO STRING
            haystack = haystack.toString();
            needle = needle.toString();

            //ONLY PROCEED IF HAYSTACK INCLUDES NEEDLE
            if (haystack.toLowerCase().includes(needle.toLowerCase())) {

                //INIT SEARCH- & REPLACE-STRING
                    //GLOBAL SEARCH FOR NEEDLE
                var searchString = new RegExp('(' + needle + ')', 'gi'),
                    //REPLACE WITH HIGHLIGHTED-CLASS
                    replaceString = '<span class="highlighted">$1</span>';

                //CHECK FOR HTML-TAGS ("<") IN HAYSTACK...
                if (res = haystack.match(/</g)) { //RETURNS MATCHES

                    //INIT INDEX-POSITIONS
                    var strStartPos = 0,
                        tagStartPos = 0,
                        tagEndPos = 0,
                        tmp = []; //ARRAY_CONTAINER FOR SUBSTRINGS

                    //LOOP THROUGH MATCH-ARRAY res
                    for (var i = 0; i < res.length; i++) {
                        //GET START- & END-INDEXPOSITION OF NEXT HTML-TAG
                        tagStartPos = haystack.indexOf("<", strStartPos);
                        tagEndPos = haystack.indexOf(">", tagStartPos) + 1;

                        //GET AND REPLACE SUBSTRING ON THE LEFT SIDE OF A HTML-TAG (from StringStartPosition to TagStartPosition)
                        tmp[2*i] = haystack.substring(strStartPos, tagStartPos).replace(searchString, replaceString);

                        //SKIP THE HTML-TAG
                        tmp[2*i+1] = haystack.substring(tagStartPos, tagEndPos);

                        //TAKE ENDPOSITION OF HTML-TAG AS STARTPOSITION FOR NEXT LOOP
                        strStartPos = tagEndPos;
                    }
                    //GET AND REPLACE SUBSTRING ON THE RIGHT SIDE OF LAST HTML-TAG (from last StringStartPosition)
                    tmp[tmp.length] = haystack.substr(strStartPos).replace(searchString, replaceString);

                    //JOIN THE REPLACED ELEMENTS OF TMP-ARRAY INTO STRING HAYSTACK
                    haystack = tmp.join('');

                //THERE IS NO LINK: SIMPLY HIGHLIGHT NEEDLE
                } else {
                    haystack = haystack.replace(searchString, replaceString);
                };
            };
        };
        return haystack;
    };
});
