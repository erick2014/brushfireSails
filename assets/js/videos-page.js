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

      $http.get('/video')
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
        })

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

      	$timeout(function(){
     
      		$scope.videos.unshift(_newVideo);
      		$scope.busySubmittingVideo=false;
      		$scope.newVideoTitle="";
      		$scope.newVideoSrc="";
      		 		console.log($scope.videos)
      	},750);
      }
	 }
]);