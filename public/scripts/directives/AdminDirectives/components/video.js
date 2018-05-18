module.exports = function(application){
    "use strict";
    application.directive('videoAdmin',["fileService",function(fileService){
        return{
            restrict : 'E',
            scope:{
                item: "="
            },
            template: require('../../../../templates/admin/components/video.html'),
            link: function(scope,elem,attrs,ctrl){
                $(elem).find('input[type="text"]').on("focus",function(e){
                    $(this).select();
                });
                if (attrs.hasOwnProperty('formName')){
                    $(elem).find('.sub-form').attr('name',attrs['form-name']);
                }
            },
            controllerAs: 'ctrl',
            controller: ["$scope","$http","$sce","$jsonpCallbacks",function($scope,$http,$sce,$jsonpCallbacks){
                function isitYoutube(url){
                    if (!url) return false;
                    
                    let re = /(?:youtube).*(?:\/)(?:watch\?v=)?([-a-zA-Z0-9_]+)(?:\??[-a-zA-Z0-9_=\?&]*)$/;
                    let res = re.exec(url);
                    if (res && res.length>1){
                        return res[1];
                    }
                    else return false;
                }
                let ctrl = this;
                let changed = 0;
                ctrl.element = $scope.item;
                if (!ctrl.element.hasOwnProperty('video') || !ctrl.element.video){
                    ctrl.element.video = {
                        src: '',
                        thumb: ''
                    };
                }
                if (!ctrl.element.video.thumb){
                    ctrl.currentImage = "None";
                }
                else if(ctrl.element.video.thumb.startsWith('blob')){
                    ctrl.currentImage = fileService.getFileName(ctrl.element.video.thumb);
                }
                else{
                    ctrl.currentImage = ctrl.element.video.thumb.replace("image/","");
                }
                $scope.$watch(function(){
                    return ctrl.element.video.src;
                },function(newV,oldV){
                    if (!changed){
                        changed++;
                    }
                    else if ($scope.componentSpecifics.url.$valid) {
                      let res = isitYoutube(newV);
                      if (res) {
                        ctrl.element.video.src = `https://www.youtube.com/embed/${res}`;
                        ctrl.element.video.thumb = `https://img.youtube.com/vi/${res}/maxresdefault.jpg`;
                        ctrl.currentImage = ctrl.element.video.thumb;
                        ctrl.youtube = false;
                      }
                    }
                });
                $scope.$on("receiveFile",function(e,args) {
                    e.stopPropagation();
                    args[0] = ctrl.element;
                    ctrl.currentImage = args[1].name;
                    fileService.addFile(args);
                    fileService.createUrls(args);
                })
            }]
        }
    }]);
};