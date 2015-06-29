
angular.module('auth' , [ 'mobyeat' ])
 .run(function ( $rootScope , $http , mobyeat ) {
 })
 .controller('RegisterCtrl' , function ( $scope ,$ionicLoading, $rootScope , $http , $location , mobyeat) {
     $scope.setInits = function () {
     	  $scope.errors = []; 
     	  $scope.user = {};
     }      
     $scope.register = function (valid) {
     	if(valid){
     		 var user = $scope.user;
                  $ionicLoading.show();
                     var fd = new FormData();
					          fd.append("action","clientRegistration"); 
                              
						   for ( var key in user ) {
                         fd.append( key , user[key] );
                     }					     
					     
					       mobyeat.serverCall( fd ).then(function(data){
						    	         $ionicLoading.hide();
						    	    localStorage.setItem( 'token' , data.client_id );
							            $rootScope.currentuser = data;
							            console.log(data.client_id);
                           $scope.$emit('login',$rootScope.currentuser);
		                           $location.url('/search/'+Date.now());
						    } , function(err){
						    	    $ionicLoading.hide(); 
                         	 $scope.errors.push(err);
						    });
     		}
			else
			$scope.submitted=true;		     
					     
     }  
      $scope.login=function(){
    $location.url("/login/"+Date.now());    	
    	} 
 
 })
 .controller('LoginCtrl' , function ( $scope , mobyeat , $rootScope ,$ionicLoading, $location , $cordovaFacebook , $ionicUser, $ionicPush) {
   $scope.setInits = function () {
    if ($scope.redirectpage) { 
       $scope.failerror = "Must be logged in to order";
   }   
}

	  $scope.identifyUser = function() {
	  
	    var user = $ionicUser.get();
	    if(!user.user_id) {
	      // Set your user_id here, or generate a random one.
	      user.user_id = $ionicUser.generateGUID();
	    };
	
	    // Add some metadata to your user object.
	    angular.extend(user, $scope.currentuser );
	
	    // Identify your user with the Ionic User Service
	    $ionicUser.identify(user).then(function(){
	      $scope.identified = true;
	      alert('Identified user ' + user.name + '\n ID ' + user.user_id);
	      $scope.pushRegister();
	    });
	  };
	  
	 $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
	    alert("Successfully registered token " + data.token);
	    //localStorage.setItem( 'device_data' , JSON.stringify(data));
       var fd = new FormData();
           fd.append("action", "setDeviceToken" );
	        fd.append("client_id", localStorage.getItem('token') );
	        fd.append("device_token", data.token);
	        
	        mobyeat.serverCall(fd).then(function (data) {
	        } , function (err) {
	              alert(err);
	        });   
	  });	  
		$scope.pushRegister = function() {
		    // Register with the Ionic Push service.  All parameters are optional.
		    $ionicPush.register({
		      canShowAlert: true, //Can pushes show an alert on your screen?
		      canSetBadge: true, //Can pushes update app icon badges?
		      canPlaySound: true, //Can notifications play a sound?
		      canRunActionsOnWake: true, //Can run actions outside the app,
		      onNotification: function(notification) {
		        // Handle new push notifications here
		        // console.log(notification);
		        return true;
		      }
		    });
		  };	  


    $scope.login = function ( valid, username , password ) {
    	if(valid){
                $ionicLoading.show();
		          var fd = new FormData();
		          fd.append("action" , "clientLogin");
		          fd.append("username" , username);
		          fd.append("password" , password);
                mobyeat.serverCall( fd ).then(function(data){
				    	         $ionicLoading.hide();
                           $rootScope.currentuser = data;
                           localStorage.setItem( 'token' , data.client_id );
                           $scope.$emit('login',$rootScope.currentuser);
                           $scope.identifyUser();
                           if ($scope.redirectpage) {
							          $location.url($scope.redirectpage);
							      } else {
                               $location.url('/search/'+Date.now());
                           }
				    } , function(err){
                     $ionicLoading.hide(); 
                     $scope.failerror = err;     			            
				    });
    		}
    		else $scope.submitted=true;
    }
    $scope.register=function(){
      $location.url("/register/"+Date.now());    	
    }
    $scope.goToForgotPassword=function(){
      $location.url("/forgotpassword/"+Date.now());    	
    }
    $scope.facebookLogin = function () {
         $cordovaFacebook.login(["public_profile", "email", "user_friends"])
             .then(function(success) {
                    $scope.getFacebookUser(); 
               }, function (error) {
                    alert("error");
                    alert(JSON.stringify(error));
               });
    }
    $scope.facebookLogout = function () {
			 $cordovaFacebook.logout()
			    .then(function(success) {
             }, function (error) {
             });    
    }

    $scope.getFacebookUser = function () {
    	      $ionicLoading.show();
				$cordovaFacebook.api("me", ["public_profile"])
				    .then(function(fbuser) {
		                     var fd = new FormData();
							          fd.append("action","facebookAuth"); 
		                         fd.append('first_name', fbuser.first_name  );
		                         fd.append('last_name', fbuser.last_name  );
		                         fd.append('email_address', fbuser.email  );
		                	    mobyeat.serverCall( fd ).then(function(data){
                                       $ionicLoading.hide();
								    	         localStorage.setItem( 'token' , data.client_id );
									            $rootScope.currentuser = data;
									            $scope.$emit('login',$rootScope.currentuser);
		                                 $location.url('/search/'+Date.now());
                           } , function(err){
								    	    alert(JSON.stringify(err));
								    	    $ionicLoading.hide(); 
		                         	 $scope.errors.push(err);
								    });
				    }, function (error) {
                    alert("error");
                    alert(JSON.stringify(error));
				    });    
    }
 })
.controller('forgotpasswordCtrl',function($scope,mobyeat,$location){
	$scope.forgotpassword=function(email){
		var fd = new FormData();
		          fd.append("action" , "forgotPassword");
		          fd.append("email" , email);
                fd.append('mobile','mobile');
                  mobyeat.serverCall( fd ).then(function(data){
                      $location.url("/changepassword/"+Date.now());    	
				    } , function(err){ 

	                  $scope.failerror = err;     			            
				    })
		}
	})
	.controller('ChangepasswordCtrl',function($scope,mobyeat,$location){
		$scope.changepassword=function(code,password){
	           var fd = new FormData();
		          fd.append("action" , "changePassword");
		          fd.append("code" , code);
		          fd.append("password" , password);
                fd.append('mobile','mobile');
                  mobyeat.serverCall( fd ).then(function(data){
                      $location.url("/login/"+Date.now());    	
				    } , function(err){ 

	                  $scope.failerror = err;     			            
				    })
			}
		})
		
		
		
		
