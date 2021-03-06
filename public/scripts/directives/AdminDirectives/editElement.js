module.exports = function(application){
    "use strict";
    application.directive("editElement",["$parse","$uibModal","$timeout",function($parse,$uibModal,$timeout){
        return{
            restrict: 'E',
            template: require('../../../templates/admin/edit-element.html'),
            link: function(scope,elem,attrs){
                var element;
                var arr = $parse(attrs['contextArray'])(scope);
                var index = $parse(attrs['indexInContext'])(scope);
                var type = attrs['editType'];
                //minor fix as this does not update correctly when changing pages in the editor
                if (type === 'Chapter'){
                    scope.$watch('selChapter',function(newV,oldV){
                        element = newV;
                    });
                }
                else if (type==='Block'){
                    scope.$watch('selBlock',function(newV,oldV){
                        element=newV;
                    })
                }
                else{
                    element = arr[index];
                    var chapter = scope[attrs['chapter']];
                    var section = $parse(attrs['section'])(scope);
                }
                $(elem).click(function(e){
                    if (!$uibModal) return;
                    console.log(scope);
                    var master;
                    if (type === 'Chapter' || type === 'Block'){
                        master = element.name;
                    }
                    else{
                      master = angular.copy(element);
                    }
                    
                    let changed=false;
                    let init=0;
                    let watcher = scope.$watch(function(){return element;},function(){
                        if (init>0){
                            changed=true;
                            watcher();
                        }
                        init++;
                    },true);
                    
                    var modalInstance = $uibModal.open({
                        template: require('../../../templates/modal/arrayEditModal.html'),
                        controller: "ArrayEditModalCtrl",
                        animation: false,
                        windowClass: "my-modal modal-edit",
                        backdrop: 'static',
                        resolve: {
                            item: function(){
                                return{
                                    element,
                                    chapter:  chapter ?  chapter.name : '',
                                    section:  section ?  section : undefined,
                                    type
                                }
                            }
                        }
                    });
                    modalInstance.result.then(function(res){
                        if (type==='Chapter' || type==='Block'){
                            console.log(scope);
                            watcher();
                            return;
                        }
                        else{
                          var index = scope.$index;
                        }
                        if (changed || res.reboot) {
                            if (type==='Section'){
                                console.log("Broadcasting");
                                scope.broadcast();
                            }
                            console.log(res.element);
                            if (res.reboot){
                                arr[index]=undefined;
                                $timeout(function(){
                                    console.log("Rebooting element through timeout");
                                    console.log("Writing at index: "+index);
                                    arr[index] = res.element;
                                },100);
                            }
                            scope.registerUndo('Edit',{
                                type,
                                context: arr,
                                index,
                                element: res.reboot ? res.element : element,
                                master,
                                title: type==='Component' ? master.type : type==='Section' ? master.subtitle : master.name
                            });
                        }
                        else{
                            watcher();
                        }
                        
        
                    },function(reason){
                      if (type==='Chapter' || type==='Block'){
                        console.log(scope);
                        element.name = master;
                        watcher();
                        return;
                      }
                      else{
                        let index = scope.$index;
                        console.log(reason);
                        console.log("Writing at index: "+index);
                        arr[index] = angular.copy(master);
                        element = arr[index];
                      }
                    });
                });
                scope.$on("recentlyAdded",(e,args) =>{
                    e.preventDefault();
                    let s = args[0];
                    let thisElem = s;
                   
                    if (s === element){
                        $(elem).click();
                    }
                })
            },
            controller: ["$scope",function($scope){
            
            }]
        }
    }]);
};