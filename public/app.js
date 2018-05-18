// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
        value: function(predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            
            var o = Object(this);
            
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
            
            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            
            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];
            
            // 5. Let k be 0.
            var k = 0;
            
            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return k.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return k;
                }
                // e. Increase k by 1.
                k++;
            }
            
            // 7. Return -1.
            return -1;
        }
    });
};
var application = angular.module("MyApp",["ngRoute","ngResource","ngAnimate","duScroll","ui.bootstrap"])
    .run(function($anchorScroll){
        "use strict";
        $anchorScroll.yOffset = 90;
    })
    .run(function($rootScope) {
        $rootScope.$on("$routeChangeSuccess", function (e, curr, old) {
            console.log(curr);
            if (curr.params.group) {
                $rootScope.title = " - " + curr.params.group[0].toUpperCase() + curr.params.group.slice(1);
            }
            else {
                $rootScope.title = "";
            }
        });
    });
application.config(["$routeProvider","$locationProvider","$compileProvider",
    function ($routeProvider,$locationProvider,$compileProvider) {
        var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
        var oldHrefList = $compileProvider.aHrefSanitizationWhitelist();
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);

    $routeProvider.when("/content/:group/blocks/:blockname/chapter/:chaptername",{
        templateUrl: "templates/newContent.html",
        controller: "MainContentCtrl",
        resolve: {
            dataBlock: function(navigate,dataFetcher,$route){
                if (!navigate.getData() || navigate.getGroup()!=$route.current.params.group){
                    return dataFetcher.get($route.current.params.group).$promise.then(
                        function(res){
                            navigate.setData(res,$route.current.params.group);
                            return res;
                        }
                    )
                }
                else return navigate.getData();
            }
        }
    })
        .when("/content/:group/blocks/:blockname",{
            template: "",
            controller: "ContentRedirecter",
            resolve:{
                dataBlock: function(navigate,dataFetcher,$route){
                    "use strict";
                    // Delete this in production.
                    return dataFetcher.get($route.current.params.group).$promise.then(
                        function(res){
                            navigate.setData(res,$route.current.params.group);
                            return res;
                        }
                    );
                    if (!navigate.getData() || navigate.getGroup()!==$route.current.params.group){
                        return dataFetcher.get($route.current.params.group).$promise.then(
                            function(res){
                                navigate.setData(res,$route.current.params.group);
                                return res;
                            }
                        )
                    }
                    else return navigate.getData();
                }
            }
        })
        .when("/content/:group",{
            template: "",
            controller: "ContentRedirecter",
            resolve:{
                dataBlock: function(navigate,dataFetcher,$route){
                    "use strict";
                    // Delete this in production.
                    return dataFetcher.get($route.current.params.group).$promise.then(
                        function(res){
                            navigate.setData(res,$route.current.params.group);
                            return res;
                        }
                    );
                    if (!navigate.getData() || navigate.getGroup()!==$route.current.params.group){
                        return dataFetcher.get($route.current.params.group).$promise.then(
                            function(res){
                                navigate.setData(res,$route.current.params.group);
                                return res;
                            }
                        )
                    }
                    else return navigate.getData();
                }
            }
        })
        .when("/authenticate",{
            templateUrl: "templates/authenticate.html",
            controller: "AuthenticateController",
            resolve: {
                loginLocal: function(github){
                  return github.authAvailable().$promise.then(res => {
                    console.log(res);
                    return res.response;
                  })
                    .catch(err => {
                      console.log(err);
                      
                      return false;
                    })
                },
                loginGithub: function(github){
                  return github.gitAvailable().$promise.then(res =>{
                    console.log(res);
                   return res.response;
                  })
                    .catch(err => {
                      console.log(err);
                      return false;
                    })
              }
              
            }
      })
        .when("/admin",{
            templateUrl: "templates/adminHome.html",
            controller: "AdminController",
            resolveRedirectTo: ["github",function(github){
                return new Promise((resolve,reject) => {
                  if (!github.authenticated){
                    console.log("Must authenticate first");
                    resolve('/authenticate');
                  }
                  else{
                    reject();
                  }
                }).then(response => {
                  console.log("In then function: "+ response);
                  return response;
                }).catch(err => {
                  console.log("In catch");
                  console.log(err);
                  return;
                });
              }]
                /*,
                user: function(github){
                    "use strict";
                    console.log("going to calculate user");
                    return github.get().$promise.then(
                      function (res) {
                            return github.getConnectionUrl().$promise.then((res) => {
                                console.log("Returning from inner promise");
                                return res;
                            });
                      }
                    )
                }*/
            
        })
        .when("/admini/:group",{
            templateUrl: function(params){
              return params.group==='mainpage' ? "templates/admin/adminMainPage.html" : "templates/admin/adminHome.html"
            },
            controller: "AdminInterfaceController",
            resolve: {
                dataBlock: function(navigate,dataFetcher,$route){
                    "use strict";
                        return dataFetcher.get($route.current.params.group).$promise.then(
                            function(res){
                                return res;
                            }
                        )
                }
            },
          resolveRedirectTo: ["github",function(github){
            return new Promise((resolve,reject) => {
              if (!github.authenticated){
                console.log("Must authenticate first");
                resolve('/authenticate');
              }
              else{
                reject();
              }
            }).then(response => {
              console.log("In then function: "+ response);
              return response;
            }).catch(err => {
              console.log("In catch");
              console.log(err);
              return;
            });
          }]

        })
        .when("/:group/search",{
            templateUrl: "templates/searchResults.html",
            controller: "searchController",
            resolve: {
                query: function($location){
                    "use strict";
                    return $location.search();
                },
                dataBlock: function(navigate,dataFetcher,$route){
                    if (!navigate.getData() || navigate.getGroup()!=$route.current.params.group){
                        return dataFetcher.get($route.current.params.group).$promise.then(
                            function(res){
                                navigate.setData(res,$route.current.params.group);
                                return res;
                            }
                        )
                    }
                    return navigate.getData();
                }
            }
        })
        .when("/404",{
            templateUrl: "templates/404.html",

        })
        .when("/",{
            templateUrl : "templates/mainmenu.html",
            controller: "MainMenuController",
            resolve: {
              dataBlock: function(dataFetcher){
                return dataFetcher.get("mainpage").$promise.then(res => res)
                  .catch(err => {console.log(err)});
              }
            }
        })
        .otherwise({
          redirectTo: "/"
        });
    $locationProvider.html5Mode(true);
}]);


require('./scripts/directives/textParagraph')(application);
require('./scripts/controllers/admin/AdminInterfaceController')(application);
require('./scripts/controllers/AuthenticateController')(application);
require('./scripts/controllers/AdminController')(application);
require('./scripts/controllers/ArrayDeleteModalCtrl')(application);
require('./scripts/controllers/ArrayAddModalCtrl')(application);
require('./scripts/controllers/ArrayEditModalCtrl')(application);
require('./scripts/controllers/ArrayAddComponentModalCtrl')(application);
require('./scripts/controllers/ArraySuccessModalCtrl')(application);
require('./scripts/controllers/ArrayQuizModal')(application);
require('./scripts/controllers/WarnModalCtrl')(application);
require('./scripts/directives/collapsibleCard')(application);
require('./scripts/controllers/ContentRedirecter')(application);
require('./scripts/controllers/MainContentCtrl')(application);
require('./scripts/controllers/MainMenuController')(application);
require('./scripts/controllers/searchController')(application);
require('./scripts/controllers/TestCtrl')(application);
require('./scripts/services/dataFetcher')(application);
require('./scripts/services/navigate')(application);
require('./scripts/services/fileService')(application);
require('./scripts/services/github')(application);
require('./scripts/services/convertData')(application);
require('./scripts/services/links')(application);
require('./scripts/services/authors')(application);
require('./scripts/filters/capitalize')(application);
require('./scripts/filters/noSpaces')(application);
require('./scripts/filters/singular')(application);
require('./scripts/filters/nicename')(application);
require('./scripts/directives/AdminDirectives/chapterSummaryAdmin')(application);
require('./scripts/directives/AdminDirectives/navMenuAdmin')(application);
require('./scripts/directives/AdminDirectives/undoList')(application);
require('./scripts/directives/AdminDirectives/collapsible')(application);
require('./scripts/directives/AdminDirectives/editElement')(application);
require('./scripts/directives/AdminDirectives/components/textParagraph')(application);
require('./scripts/directives/AdminDirectives/components/textQuote')(application);
require('./scripts/directives/AdminDirectives/components/textAlert')(application);
require('./scripts/directives/AdminDirectives/components/textMyth')(application);
require('./scripts/directives/AdminDirectives/components/linkReference')(application);
require('./scripts/directives/AdminDirectives/components/telephone')(application);
require('./scripts/directives/AdminDirectives/components/email')(application);
require('./scripts/directives/AdminDirectives/components/video')(application);
require('./scripts/directives/AdminDirectives/components/quiz')(application);
require('./scripts/directives/AdminDirectives/components/videoCarousel')(application);
require('./scripts/directives/AdminDirectives/components/files')(application);
require('./scripts/directives/AdminDirectives/components/quoteMain')(application);
require('./scripts/directives/AdminDirectives/components/listImages')(application);
require('./scripts/directives/AdminDirectives/fileUploader')(application);
require('./scripts/directives/AdminDirectives/validFile')(application);
require('./scripts/directives/AdminDirectives/validAnswer')(application);
require('./scripts/directives/AdminDirectives/interactiveTiles')(application);
require('./scripts/directives/AdminDirectives/components/image')(application);
require('./scripts/directives/AdminDirectives/components/websiteLinks')(application);
require('./scripts/directives/AdminDirectives/components/listText')(application);
require('./scripts/directives/AdminDirectives/components/mediaDescription')(application);
require('./scripts/directives/appForm')(application);
require('./scripts/directives/chapterSummary')(application);
require('./scripts/directives/fontSizeSelector')(application);
require('./scripts/directives/ifsEditable')(application);
require('./scripts/directives/ifsExtendable')(application);
require('./scripts/directives/ifsVideo')(application);
require('./scripts/directives/linkEmail')(application);
require('./scripts/directives/mediaDescription')(application);
require('./scripts/directives/linkTelephone')(application);
require('./scripts/directives/listText')(application);
require('./scripts/directives/listImages')(application);
require('./scripts/directives/navMenu')(application);
require('./scripts/directives/quizCarousel')(application);
require('./scripts/directives/quizModalStart')(application);
require('./scripts/directives/textQuote')(application);
require('./scripts/directives/themeSelector')(application);
require('./scripts/directives/thoughtBubble')(application);
require('./scripts/directives/topBar')(application);
require('./scripts/directives/videoCarousel')(application);
require('./scripts/directives/matchText')(application);
