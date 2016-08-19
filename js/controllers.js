angular.module('prototypeApp.controllers', []);


// ################################
//
//  CONTROLLER FOR MAIN PAGE
//
// ################################

app.controller('mainCtrl', ['$scope', function ($scope){
    $scope.message = "Home page Ctrl"
    console.log($scope.message);

    //META
    $scope.version = '0.0.8'; //RELEASE 19.8.2016
    $scope.version_date_rel = '19. August 2016';
    $scope.version_date_ed = '29. Januar 2016';
    $scope.editors = '<a href="http://anton-webern.ch/index.php?id=3" target="_blank">Thomas Ahrend</a>';

    //INIT MODALTEXT
    $scope.modalText = {
        'sourceNotA': '<p>Die Beschreibung der weiteren Quellenbestandteile von <strong>A</strong> sowie der Quellen <strong>B</strong> bis <strong>G1</strong> einschließlich der darin gegebenenfalls enthaltenen Korrekturen erfolgt im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
        'sheetComingSoon': 'Die edierten Notentexte von <strong>Aa:SkI/1</strong>, <strong>Ab:SkII/1</strong>, <strong>Ac:SkIII/1</strong> und <strong>Ac:SkIII/7</strong> sowie <strong>Ae:SkIV/1</strong> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.',
        'editionComingSoon': '<p>Die Einleitungen, edierten Notentexte und Kritischen Berichte zu</p><ul class="none"><li>Werkedition der Druckfassung der <i>Vier Lieder</i> op. 12 <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 1) <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 2) <br/> Textedition von Nr. IV <i>Gleich und Gleich</i> (Fassung 1) </li></ul><p> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
        'M198': '<p>Das Fragment „<em>Schien mir’s als ich sah die Sonne</em>“ (M 198) für Chor und Orchester wird in AWG II/3 ediert.</p>'
    };
}]);




// ################################
//
//  CONTROLLER FOR SEARCH PAGE
//
// ################################

app.controller('searchCtrl', ['$scope', 'salsahAPIfactory', 'awgFactory', '$http', function ($scope, salsahAPIfactory, awgFactory, $http){
    $scope.message = "Search page Ctrl"
    console.log($scope.message);

    //INIT
    $scope.APIurl = 'http://www.salsah.org';
    $scope.eventData = {};
    $scope.side = '';                   //SETS ALIGNEMT TO ALTERNATE

    $scope.isFormSubmitted = false;     //NO FORM SUBMITTED
    $scope.isDataLoaded = false;        //NO DATA LOADED
    $scope.isObjectSelected = false;    //NO OBJECT SELECTED
    $scope.isObjectLoaded = false;      //NO OBJECT LOADED
    $scope.isEventButtonClicked = false;     //NO BUTTON CLICKED
    $scope.isEventLoaded = false;       //NO EVENT LOADED
    $scope.isEventCached = false;       //NO EVENT CACHED

    var now = new Date();
    $scope.date = {
        day:            now.getDate(),
        month:          now.getMonth() + 1,
        // searchStart:    '',
        // searchEnd:      '',
        findStart:      '',
        findEnd:        ''
    };

    // SUBMIT SEARCHTEXT (function) USING salsahAPIfactory
    $scope.submit = function(query){
        //INIT
        $scope.isFormSubmitted = true;      //NOW FORM WAS SUBMITTED
        $scope.isDataLoaded = false;        //NO DATA LOADED
        $scope.isObjectSelected = false;    //NO OBJECT SELECTED
        $scope.isObjectLoaded = false;      //NO OBJECT LOADED

        $scope.searchText = query;
        // $scope.maxSize = 4; // TODO: paging
        // $scope.currentPage = 1;

        // GET SEARCHRESULTS (promise) & THEN SEND searchData TO SCOPE
        salsahAPIfactory.fulltextSearch($scope.APIurl, query).then(function (data) {
            $scope.searchData = data;            
            $scope.isFormSubmitted = false;
            $scope.isDataLoaded = true;
        }); //END then
    }; //END scope.submit (func)


    // SHOW OBJECT (function) USING salsahAPIfactory
    $scope.showObject = function(cur_id){
        //INIT
        $scope.isObjectSelected = true;     //NOW OBJECT WAS SELECTED
        $scope.isEventButtonClicked = false;     //BLEND OUT TIMELINE
        $scope.isEventLoaded = false;       //BLEND OUT TIMELINE

        //SETS CLASS=ACTIVE ON CURRENT ACTIVE OBJECT
        $scope.activeObject = function(id){
            return cur_id == id;
        };

        //GET OBJECT (as promise) & THEN SEND objData TO SCOPE
        salsahAPIfactory.getObject($scope.APIurl, cur_id).then(function(data){
            $scope.objData = data;
            $scope.isObjectLoaded = true;   //NOW OBJECT IS LOADED

            awgFactory.scrollTo(cur_id);    //SCROLL TO OBJBOX (#cur_id) AFTER LOADING

        }); //END then
    }; //END scope.showObject (func)


    // GET TODAY'S EVENTS (function) USING salsahAPIfactory
    $scope.getTodaysEvents = function(){
        //INIT
        $scope.date['searchStart'] = 1883;      //TODO: start (choosen by user // limits for specific objClasses: Werke 1908-1945)
        $scope.date['searchEnd'] = 1945;        //TODO: end (choosen by user)

        $scope.isEventButtonClicked = true;      //NOW BUTTON IS CLICKED
        $scope.isObjectSelected = false;    //BLEND OUT SEARCH OBJECT
        $scope.isObjectLoaded = false;      //BLEND OUT SEARCH OBJECT

        //ALIGNMENTS FOR TIMELINE BOXES
        $scope.timeline = {
            leftAlign: function(){$scope.side = 'left';},
            rightAlign: function(){$scope.side = 'right';},
            defaultAlign: function(){$scope.side = '';} // or 'alternate'
        };

        var objClasses = {
            //CHRONOLOGIE: restype=28, property_id=46 (date)
            //PERSON: restype=45, property_id=207 (birthdate), 208 (deathdate)
            //Korrespondenz: restype=29, property_id=46 (date)
            //Musikstück: restype=36, property:id=96 (Erstpublikaktion), 97 (Komposition)
            //Werk: restype=43, property:id=96 (Erstpublikaktion), 97 (Komposition), 226 (weitere Publikation)

            Chronologie: {
                badgeClass      : 'warning',
                badgeIconClass  : 'glyphicon-time',
                restypeID       : '28',
                propertyID      : ['46']
            },
            Korrespondenz: {
                badgeClass      : 'info',
                badgeIconClass  : 'glyphicon-envelope',
                restypeID       : '29',
                propertyID      : ['46']
            },
            Person: {
                badgeClass      : 'success',
                badgeIconClass  : 'glyphicon-user',
                restypeID       : '45',
                propertyID      : ['207', '208']
            },
            Werk: {
                badgeClass      : 'danger',
                badgeIconClass  : 'glyphicon-music',
                restypeID       : '43',
                propertyID      : ['96', '97', '226']
            }
        };

        //CHECK FOR CACHED DATA in $scope.eventData
        if ($scope.eventData == '' || Object.keys($scope.eventData).length === 0) {
            //GET EVENTS (as promise) & THEN SEND eventData TO SCOPE
            salsahAPIfactory.getDailyEvent($scope.APIurl, $scope.date, objClasses)
                .then(function(response){
                    var events = response.searchResults;
                    $scope.eventData['overallQueries'] = response.overallQueries;
                    $scope.eventData['nhits'] = events.length;

                    $scope.date['findEnd'] = awgFactory.extractYear(events[events.length-1]);
                    $scope.date['findStart'] = awgFactory.extractYear(events[0]);

                    angular.forEach(events, function(event){
                        var label = objClasses[event.objLabel];
                        event['badgeClass'] = label.badgeClass;
                        event['badgeIconClass'] = label.badgeIconClass;
                    });
                    $scope.eventData['events'] = events;
                    $scope.isEventButtonClicked = false;
                    $scope.isEventLoaded = true;        //NOW EVENT IS LOADED
                    $scope.isEventCached = true;
                }); //END then
        } else {
            $scope.isEventButtonClicked = false;
            $scope.isEventLoaded = true;        //NOW EVENT IS LOADED (FROM CACHE)
        };
    }; //END scope.getTodaysEvents (func)

}]);




// ################################
//
//  CONTROLLER FOR INTRO PAGE
//
// ################################

app.controller('introCtrl', ['$scope', function ($scope){
    $scope.message = "Intro page Ctrl"
    console.log($scope.message);

    //INIT MODAL
    $scope.showModal = false;
    $scope.toggleModal = function(id){
        $scope.showModal = !$scope.showModal;
        //GET VALUE FOR MODAL BY ID
        $scope.modalValue = $scope.modalText[id];
    };
}]);




// ################################
//
//  CONTROLLER FOR EDITION PAGE
//
// ################################

app.controller('editionCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams){
    $scope.message = "Edition page Ctrl"
    console.log($scope.message);

    //INIT MODAL
    $scope.showModal = false;
    $scope.toggleModal = function(id){
        $scope.showModal = !$scope.showModal;
        //GET VALUE FOR MODAL BY ID
        $scope.modalValue = $scope.modalText[id];
    };

    //INIT SHEETS
    $scope.sheet2 ="Aa:SkI/2";
    $scope.sheet3 ="Aa:SkI/3";
    $scope.sheet4 ="Aa:SkI/4";
    $scope.sheet5 ="Aa:SkI/5";
    $scope.sheet = $scope.sheet2;

    //CHECK FOR ROUTEPARAMS
    if ($routeParams.id) {
        $scope.sheet = $routeParams.id;
    };

    $scope.sheets = {
    	"Aa:SkI/2": {
    		"svg": "img/SkI_2n_small_cut_opt.svg",
    		"image": "img/SkI_2n_small.jpg",
    		"alt": "Aa:SkI/2"
    	},
    	"Aa:SkI/3": {
            "svg": "img/SkI_3n_small_cut_opt.svg",
    		"image": "img/SkI_3n_small.jpg",
    		"alt": "Aa:SkI/3"
    	},
    	"Aa:SkI/4": {
            "svg": "img/SkI_4n_small_cut_opt.svg",
    		"image": "img/SkI_4n_small.jpg",
    		"alt": "Aa:SkI/4"
    	},
    	"Aa:SkI/5": {
            "svg": "img/SkI_5n_small_cut_opt.svg",
    		"image": "img/SkI_5n_small.jpg",
    		"alt": "Aa:SkI/5"
    	}
    };

    //GET TKA
    $http.get('data/tka.json').then(function (response){
        var tmp = response.data;
        $scope.showTkA = false;

        //MARKS THE ACTIVE AREA
        $scope.isActive = function(id){
            return $scope.selected == id;
        };


        //GET TKA FOR WHOLE MEASURE/SYSTEM OR SINGLE ITEM (func)
        $scope.getTkA = function(field, id){
            //INIT
            $scope.showTkA = true;
            $scope.items = [];
            switch (field) {
                case 'measure':
                    $scope.selected = 'm' + id;
                    $scope.items = getTkaValue(tmp[$scope.sheet]);
                    break;
                case 'system':
                    $scope.selected = 's' + id;
                    $scope.items = getTkaValue(tmp[$scope.sheet]);
                    break;
                case 'single':
                    $scope.selected = id;
                    $scope.items.push(tmp[$scope.sheet][id]);
            };

            //GET Tka VALUES
            function getTkaValue(item) {
                console.log('hurray');
                var tmpArray = [];
                angular.forEach(item, function(entry){
                    //CLEAN VALUES
                    var tkaValue = entry[field].replace("[", "").replace("]", "");
                    //CHECK IF VALUE MATCHES ID
                    if (tkaValue == id) {
                        tmpArray.push(entry);
                    };
                }); //END forEach
                return tmpArray;
            } //END getTkaValue (func)

        }; // END getTkA (func)


        //SWITCHES BETWEEN SVG-SHEETS (func)
        $scope.selectSVG = function(id){
            $scope.sheet = id;
            $scope.showTkA = false;
            $scope.selected = '';
        };

        //MARKS THE ACTIVE SVG-SHEET
        $scope.activeSheet = function(id){
            return $scope.sheet == id;
        };
    }); // END http.then

}]);




// ################################
//
//  CONTROLLER FOR REPORT PAGE
//
// ################################

app.controller('reportCtrl', ['$scope', 'awgFactory', function ($scope, awgFactory){
    $scope.message = "Report page Ctrl"
    console.log($scope.message);

    //INIT MODAL
    $scope.showModal = false;
    $scope.toggleModal = function(id){
        $scope.showModal = !$scope.showModal;
        //GET VALUE FOR MODAL BY ID
        $scope.modalValue = $scope.modalText[id];
    };

    // SCROLL (function) USING awgFactory
    $scope.scrollTo = function(id){
        awgFactory.scrollTo(id);
    };
}]);




// ################################
//
//  CONTROLLER FOR STRUCTURE PAGE
//
// ################################

app.controller('structureCtrl', ['$scope', function ($scope){
    $scope.message = "Structure page Ctrl"
    console.log($scope.message);
}]);




// ################################
//
//  CONTROLLER FOR CONTACT PAGE
//
// ################################

app.controller('contactCtrl', ['$scope', function ($scope){
    $scope.message = "Contact page Ctrl"
    console.log($scope.message);
}]);
