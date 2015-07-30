angular.module('brushfire_videosPage',[])

.config(function($sceDelegateProvider){
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',
		'*://www.youtube.com/**'
	])

})

angular.module('brushfire_videosPage')
	
	.controller('PageCtrl',['$scope','$http',

    function($scope,$http){

  		$scope.videosLoading=true;
      //JWR=Json WebSocket Response
      io.socket.get('/video',function whenServerResponds(data,JWR){
        console.log("executing socket get request...",JWR)
        $scope.videosLoading=false;

        if( JWR.statusCode>=400 ){
          console.log("something bad happened");
        }

        $scope.videos=data;

        $scope.$apply();

      })

      /*$http.get('/video')
        .then(function onSuccess(sailsResponse){
          console.log("sails res",sailsResponse);
          $scope.videos=sailsResponse.data;
        })
  		  .catch( function onError(sailsResponse){
          if(sailsResponse.status='404'){
            return;
          }
          console.log("An unexpected error occurred: "+sailsResponse.statusText);
        })
        .finally(function eitherWay(){
          $scope.videosLoading=false;
        }) */

      $scope.submitNewVideo=function(){

      	if( $scope.busySubmittingVideo ){
      		return;
      	}

      	var _newVideo={
      		title:$scope.newVideoTitle,
      		src:$scope.newVideoSrc
      	};

      	var parser=document.createElement('a');
      	
      	parser.href=_newVideo.src;
      	
      	var youtubeID=parser.search.substring(parser.search.indexOf("=")+1,parser.search.length);
      	_newVideo.src='https://www.youtube.com/embed/'+youtubeID;

      	$scope.busySubmittingVideo=true;

        io.socket.post('/video',{
          title:_newVideo.title,
          src:_newVideo.src
        },
        function whenServerResponds(data,JWR){
          $scope.videosLoading=false;

          if( JWR.statusCode>=400 ){
            console.log("something bad happened");
          }

          $scope.videos.unshift(_newVideo);
          $scope.busySubmittingVideo=false;
          $scope.newVideoTitle="";
          $scope.newVideoSrc="";
          $scope.$apply();
        
        });

        io.socket.on('video',function whenAvideoIsCreatedUpdatedOrDestroyed(event){
          //add thew new video to the DOM
          $scope.videos.unshift({title:event.data.title,src:event.data.src});
          //Apply the changes to the DOM
          //(We have to do this since 'io.socket.get' is not an angular-specific magical promisy-thing)
          $scope.$apply();
        })

	     }
     }
]);