angular.module('prototypeApp.controllers', []);


/**** CONTROLLER FOR MAIN PAGE ****/
app.controller('mainCtrl', ['$scope', function ($scope){
    $scope.message = "Home page Ctrl"
    console.log($scope.message);

    //META
    $scope.version_date = "31. März 2015";
    $scope.editors = "Thomas Ahrend";

    //INIT MODALTEXT
    $scope.modalText = {
        'sourceNotA': '<p>Die Beschreibung der weiteren Quellenbestandteile von <strong>A</strong> sowie der Quellen <strong>B</strong> bis <strong>G1</strong> einschließlich der darin gegebenenfalls enthaltenen Korrekturen erfolgt im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
        'sheetComingSoon': 'Die edierten Notentexte von <strong>Aa:SkI/1</strong>, <strong>Ab:SkII/1</strong>, <strong>Ac:SkIII/1</strong> und <strong>Ac:SkIII/7</strong> sowie <strong>Ae:SkIV/1</strong> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.',
        'editionComingSoon': '<p>Die Einleitungen, edierten Notentexte und Kritischen Berichte zu</p><ul class="none"><li>Werkedition der Druckfassung der <i>Vier Lieder</i> op. 12 <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 1) <br/> Textedition von Nr. I „<i>Der Tag ist     vergangen</i>“ (Fassung 2) <br/> Textedition von Nr. IV <i>Gleich und Gleich</i> (Fassung 1) </li></ul><p> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.        </p>',
        'M198': '<p>Das Fragment „<em>Schien mir’s als ich sah die Sonne</em>“ (M 198) für Chor und Orchester wird in AWG II/3 ediert.</p>'
    };
}]);


/**** CONTROLLER FOR SEARCH PAGE ****/
app.controller('searchCtrl', ['$scope', '$http', 'salsahAPIservice', function ($scope, $http, salsahAPIservice){
    $scope.message = "Search page Ctrl"
    console.log($scope.message);

    //INIT
    // var backTo_id = null;
    // $scope.id_old = null;
    $scope.isFormSubmitted = false;     //NO FORM SUBMITTED
    $scope.isDataLoaded = false;        //NO DATA LOADED
    $scope.isObjectSelected = false;    //NO OBJECT SELECTED
    $scope.isObjectLoaded = false;      //NO OBJECT LOADED
    $scope.APIurl = 'http://www.salsah.org';

    // SUBMIT QUERY (function) USING salsahAPIservice
    $scope.submit = function(query){
        //INIT
        $scope.isFormSubmitted = true;      // NOW FORM WAS SUBMITTED
        $scope.isDataLoaded = false;        //NO DATA LOADED
        $scope.isObjectSelected = false;    //NO OBJECT SELECTED
        $scope.isObjectLoaded = false;      //NO OBJECT LOADED

        $scope.maxSize = 4;
        $scope.currentPage = 1;
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
        $scope.isObjectSelected = true; //NOW OBJECT WAS SELECTED

        //GET OBJECT (promise) & THEN SEND objData TO SCOPE
        salsahAPIservice.getObject($scope.APIurl, cur_id).then(function(data){
            $scope.objData = data;
            //NOW OBJECT IS LOADED
            $scope.isObjectLoaded = true;

            //STORE OLD ID
            // if ($scope.id_old !== null) {
            //     $scope.id_old = backTo_id;
            // } else {
            //     $scope.id_old = cur_id;
            // };
            // backTo_id = cur_id;

        }); //END then
    }; //END scope.showObject (func)
}]);


/**** CONTROLLER FOR INTRO PAGE ****/
app.controller('introCtrl', ['$scope', function ($scope){
    $scope.message = "Intro page Ctrl"
    console.log($scope.message);

    $scope.showModal = false;
    $scope.toggleModal = function(id){
        $scope.showModal = !$scope.showModal;
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
    		"svg": "img/SkI_2_small_opt.svg",
    		"image": "img/SkI_2_small.jpg",
    		"alt": "Aa:SkI/2"
    	},
    	"Aa:SkI/3": {
            "svg": "img/SkI_3_small_opt.svg",
    		"image": "img/SkI_3_small.jpg",
    		"alt": "Aa:SkI/3"
    	},
    	"Aa:SkI/4": {
            "svg": "img/SkI_4_small_opt.svg",
    		"image": "img/SkI_4.jpg",
    		"alt": "Aa:SkI/4"
    	},
    	"Aa:SkI/5": {
            "svg": "img/SkI_5_small_opt.svg",
    		"image": "img/SkI_5.jpg",
    		"alt": "Aa:SkI/5"
    	}
    };

    //DISPLAY TkA
    $http.get('data/tka.json').then(function (response){
        var tmp = response.data;
        $scope.showTkA = false;

        $scope.isActive = function(id){
            return $scope.selected == id;
        };

        $scope.getSingleTkA = function(id){
            //INIT
            $scope.selected = id;
            $scope.showTkA = true;
            $scope.items = [];

            //GET DATA
            $scope.items.push(tmp[$scope.sheet][id]);
        }; //END getSingleTkA (func)

        $scope.getMeasureTkA = function(id){
            //INIT
            $scope.showTkA = true;
            $scope.selected = id;
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

        $scope.selectSVG = function(id){
            $scope.sheet = id;
            $scope.showTkA = false;
            $scope.selected = '';
        };

        $scope.activeSheet = function(id){
            return $scope.sheet == id;
        };
    }); // END http.then

}]);


/**** CONTROLLER FOR REPORT PAGE ****/
app.controller('reportCtrl', ['$scope', '$http', '$location', '$anchorScroll', function ($scope, $http, $location, $anchorScroll){
    $scope.message = "Report page Ctrl"
    console.log($scope.message);

    //INIT MODAL
    $scope.showModal = false;
    $scope.toggleModal = function(id){
        $scope.showModal = !$scope.showModal;
        $scope.modalValue = $scope.modalText[id];
    };

    $scope.linkTo = function(id){
        // save original hash
        var old = $location.hash();
        // set new hash id
        $location.hash(id);
        // scroll to id
        $anchorScroll();
        //reset original hash
        $location.hash(old);
    };

    // GET JSON DATA
    $http.get('data/sourcelist.json').then(function (response){
        $scope.sourceList = response.data;
    });

    $http.get('data/tka.json').then(function (response){
        $scope.tka = response.data;
    });
}]);


/**** CONTROLLER FOR CONTACT PAGE ****/
app.controller('contactCtrl', ['$scope', function ($scope){
    $scope.message = "Contact page Ctrl."
    console.log($scope.message);
}]);
