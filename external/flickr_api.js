var request = require("request");
var apiKey = "8c020cf826187d880481ad6e4a8b452e";
var userId = "90807967%40N08";
var photoSetId = "";
var requestStringPhotoSets = "https://api.flickr.com/services/rest/?method=" +
    "flickr.photosets.getList&api_key="+apiKey+"&user_id="+userId+"&page=1&per_page=9&format=json&nojsoncallback=1";


self = module.exports = {
    getPhotoSets: function(callback){
        console.log(requestStringPhotoSets);
        request(requestStringPhotoSets,function(error,response,body){
            body = JSON.parse(body);
            if(!error) {
                callback(null, body);
            }else{
                callback(error);
            }
        })
    },
    getPhotos: function(photoSetId, callback){
        var requestStringPhotos = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&" +
            "api_key=" + apiKey +"&photoset_id="+ photoSetId +"&user_id="+ userId +"&format=json&nojsoncallback=1";
        request(requestStringPhotos, function(err,response, body) {
            if(!err) {
                console.log( );
            }
        })
    }

};