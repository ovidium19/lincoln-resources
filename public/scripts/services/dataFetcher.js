module.exports = function(application){
    "use strict";
    application.factory("dataFetcher",["$resource","$cacheFactory",function($resource,$cacheFactory){
        "use strict";
        //when we get data, we receive an array, therefore we have to specify isArray in the resource method definition
        var resource = $resource("/data/:source",{source:"@source"},{
            'query': {method: 'GET',isArray: true,cache: false}
        });
        return{
            get: function(group){
                var cache = $cacheFactory.get('$http');
                cache.remove('/data/'+group)
                return resource.query({source:group});
            },
            post: function(group,data){
                var cache = $cacheFactory.get('$http');
                cache.remove('/data/'+group)
                return resource.save({source:group},data);
            }
        }
    }]);
};
