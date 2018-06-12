//front page controller
module.exports = function(application){
    "use strict";
    application.controller("MainMenuController",["$scope","$location","dataBlock","$timeout",
        function($scope,$location,dataBlock,$timeout){
                "use strict";
                //preload hover images
                 console.log("preloading images");
                 var students = new Image();
                 var educators = new Image();
                 students.src = "/assets/css/images/StudentsOver.png";
                 educators.src = "/assets/css/images/EducatorsOver.png";
                 //----------------------------------------
                $scope.selectGroup = function(group){
                    $location.url("/content/"+group+"/");
                };
                $scope.data = dataBlock[0];
                //always scroll top when accessing front page
                $("#mainContent").scrollTop(0);
                
                //logo animation
                var animation = bodymovin.loadAnimation({
                    container: document.getElementById("bm"),
                    loop: true,
                    renderer: 'svg',
                    autoplay: true,
                    animationData: require('../../logo.json')
                });
                
                //quote-carousel in the front-page
                var carousel  = $(".carousel");
                carousel.carousel({
                    autoplay: true,
                    interval: 4500
                });
                //setting image backgrounds
                $timeout(function(){
                  $(".main-page.one").css({
                    background: `url("${$scope.data.background_up.src}")  no-repeat fixed top center`,
                    backgroundSize: "cover"
                  });
                  $(".main-page.two").css({
                    background: `url("${$scope.data.background_down.src}")  no-repeat fixed top center`,
                    backgroundSize: "cover"
                  });
                },0);
               
                
                //unused vars...will delete eventually still figuring if i need them
                var body = angular.element(document.getElementById("mainContent"));
                var portion_one = angular.element(document.getElementsByClassName("home-container"));
                var bm = angular.element(document.getElementById("bm"));
        
    }]);
};
