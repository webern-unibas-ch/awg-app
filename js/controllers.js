angular.module('prototypeApp.controllers', []);


/**** CONTROLLER FOR MAIN PAGE ****/
app.controller('mainCtrl', ['$scope', function ($scope){
    $scope.message = "Home page Ctrl"
    console.log($scope.message);

    //META
    $scope.version = '0.0.3'; //RELEASE 15.3.2016
    $scope.version_date = '29. Januar 2016';
    $scope.editors = '<a href="http://anton-webern.ch/index.php?id=3" target="_blank">Thomas Ahrend</a>';

    //INIT MODALTEXT
    $scope.modalText = {
        'sourceNotA': '<p>Die Beschreibung der weiteren Quellenbestandteile von <strong>A</strong> sowie der Quellen <strong>B</strong> bis <strong>G1</strong> einschließlich der darin gegebenenfalls enthaltenen Korrekturen erfolgt im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
        'sheetComingSoon': 'Die edierten Notentexte von <strong>Aa:SkI/1</strong>, <strong>Ab:SkII/1</strong>, <strong>Ac:SkIII/1</strong> und <strong>Ac:SkIII/7</strong> sowie <strong>Ae:SkIV/1</strong> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.',
        'editionComingSoon': '<p>Die Einleitungen, edierten Notentexte und Kritischen Berichte zu</p><ul class="none"><li>Werkedition der Druckfassung der <i>Vier Lieder</i> op. 12 <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 1) <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 2) <br/> Textedition von Nr. IV <i>Gleich und Gleich</i> (Fassung 1) </li></ul><p> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
        'M198': '<p>Das Fragment „<em>Schien mir’s als ich sah die Sonne</em>“ (M 198) für Chor und Orchester wird in AWG II/3 ediert.</p>'
    };
}]);


/**** CONTROLLER FOR SEARCH PAGE ****/
app.controller('searchCtrl', ['$scope', 'salsahAPIservice', 'awgService', function ($scope, salsahAPIservice, awgService){
    $scope.message = "Search page Ctrl"
    console.log($scope.message);

    //INIT
    $scope.isFormSubmitted = false;     //NO FORM SUBMITTED
    $scope.isDataLoaded = false;        //NO DATA LOADED
    $scope.isObjectSelected = false;    //NO OBJECT SELECTED
    $scope.isObjectLoaded = false;      //NO OBJECT LOADED
    $scope.APIurl = 'http://www.salsah.org';


    // SUBMIT QUERY (function) USING salsahAPIservice
    $scope.submit = function(query){
        //INIT
        $scope.isFormSubmitted = true;      //NOW FORM WAS SUBMITTED
        $scope.isDataLoaded = false;        //NO DATA LOADED
        $scope.isObjectSelected = false;    //NO OBJECT SELECTED
        $scope.isObjectLoaded = false;      //NO OBJECT LOADED

        $scope.searchText = query;
        // $scope.maxSize = 4; // TODO
        // $scope.currentPage = 1;

        // GET SEARCHRESULTS (promise) & THEN SEND searchData TO SCOPE
        salsahAPIservice.fulltextSearch($scope.APIurl, query).then(function (data) {
            $scope.searchData = data;
            $scope.isFormSubmitted = false;
            $scope.isDataLoaded = true;
        }); //END then
    }; //END scope.submit (func)


    // SHOW OBJECT (function) USING salsahAPIservice
    $scope.showObject = function(cur_id){
        //INIT
        $scope.isObjectSelected = true;  //NOW OBJECT WAS SELECTED

        //SETS CLASS=ACTIVE ON CURRENT ACTIVE OBJECT
        $scope.activeObject = function(id){
            return cur_id == id;
        };

        //GET OBJECT (as promise) & THEN SEND objData TO SCOPE
        salsahAPIservice.getObject($scope.APIurl, cur_id).then(function(data){
            $scope.objData = data;
            $scope.isObjectLoaded = true;  //NOW OBJECT IS LOADED

            //SCROLL TO OBJBOX (#cur_id) AFTER LOADING
            awgService.scrollTo(cur_id);

        }); //END then
    }; //END scope.showObject (func)
}]);


/**** CONTROLLER FOR INTRO PAGE ****/
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


/**** CONTROLLER FOR EDITION PAGE ****/
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

    //DISPLAY TKA
    $http.get('data/tka.json').then(function (response){
        var tmp = response.data;
        $scope.showTkA = false;

        //MARKS THE ACTIVE AREA
        $scope.isActive = function(id){
            return $scope.selected == id;
        };

        //DISPLAYS SINGLE TKA (func)
        $scope.getSingleTkA = function(id){
            //INIT
            $scope.selected = id;
            $scope.showTkA = true;
            $scope.items = [];

            //GET DATA
            $scope.items.push(tmp[$scope.sheet][id]);
        }; //END getSingleTkA (func)

        //DISPLAYS TKA FOR WHOLE MEASURE (func)
        $scope.getMeasureTkA = function(id){
            //INIT
            $scope.selected = id;
            $scope.showTkA = true;
            $scope.items = [];

            //GET DATA
            angular.forEach(tmp[$scope.sheet], function(entry){
                //CLEAN VALUES
                var tmp_measure = entry.measure.replace("[", "").replace("]", "");
                //CHECK IF MEASURE MATCHES ID
                if (tmp_measure == id) {
                    $scope.items.push(entry);
                };
            }); //END forEach
        }; // END getMeasureTkA (func)

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


/**** CONTROLLER FOR REPORT PAGE ****/
app.controller('reportCtrl', ['$scope', '$http', 'awgService', function ($scope, $http, awgService){
    $scope.message = "Report page Ctrl"
    console.log($scope.message);

    //INIT MODAL
    $scope.showModal = false;
    $scope.toggleModal = function(id){
        $scope.showModal = !$scope.showModal;
        //GET VALUE FOR MODAL BY ID
        $scope.modalValue = $scope.modalText[id];
    };

    // SCROLL (function) USING awgService
    $scope.scrollTo = function(id){
        awgService.scrollTo(id);
    };
}]);


/**** CONTROLLER FOR STRUCTURE PAGE ****/
app.controller('structureCtrl', ['$scope', function ($scope){
    $scope.message = "Structure page Ctrl"
    console.log($scope.message);
}]);


/**** CONTROLLER FOR CONTACT PAGE ****/
app.controller('contactCtrl', ['$scope', function ($scope){
    $scope.message = "Contact page Ctrl"
    console.log($scope.message);
}]);
