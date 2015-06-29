
angular.module("user" , [ "mobyeat",'custommod' ])

.controller( 'ProfileCtrl', function($scope , mobyeat ,$location ,$http , $rootScope ) {

   $scope.setInits = function () {
   $rootScope.backpage = "";	
   var user = angular.copy( $scope.currentuser );	
   console.log($scope.currentuser);
       delete user.password;
       $scope.user = user;   
      localStorage.setItem("profileaddress",JSON.stringify($scope.user));

   }

   $scope.updateProfile = function (valid) {
        if (valid) {
               var user = $scope.user;
   	         delete user.client_id;
      localStorage.setItem("profileaddress",JSON.stringify($scope.user));
               var fd = new FormData();
                   fd.append("action" , "updateClientProfile");
               for (var key in user) {
                   fd.append( key , user[key] );
                }
                   fd.append("client_id" , localStorage.getItem("token"));
               
               mobyeat.serverCall( fd ).then(
                     function (data) {
          $location.url('/search/'+Date.now());
                     },
                     function (err) {

                        alert(JSON.stringify(err)); 
                     }
               ); 
  
       }  else {
         $scope.submitted = true;       
       }
  
   }

})

.controller("AddressListCtrl" , function( $scope , mobyeat , $location , getAddress ){
   $scope.setInits = function () {

     $scope.default_address = JSON.parse(localStorage.getItem("default_user_address") || "{}");
     //$scope.default_address = default_address; 	
     $scope.addresslist = [];
     var client_id = localStorage.getItem("token");
         
         
   

                        $scope.addresslist = getAddress;     
                   
                         

   }
   $scope.changeAddress = function (address) {
      $scope.default_address = address;   
   }


   $scope.setDefaultAddress = function () {
      localStorage.setItem("default_user_address" , JSON.stringify($scope.default_address)); 
      if ($scope.redirectpage) {
          $location.url($scope.redirectpage);
      }
   }
   
   $scope.editAddress = function ( address ) {
     $location.url("/editaddress/"+address.address_id);
   }

})

.controller("AddressCtrl" , function ($scope , $stateParams , mobyeat, $http, $location , editAddress) {
 $scope.setInits = function () {
 	   
      $scope.addr = { };
	   if( $stateParams.id ){
                        editAddress.contact_phone = Number(editAddress.contact_phone);
                        editAddress.zipcode = Number(editAddress.zipcode);
                                                    
                        $scope.addr = editAddress;                     
	   }  

 }

 $scope.save = function (valid) {
 	if(valid){
 		 var fd = new FormData();
         fd.append("action" , "addAddress");
         if ( $stateParams.id){
           fd.append("id" , $stateParams.id );      
           delete $scope.addr.address_id;
           delete $scope.addr.client_id;        
         } else {
              var client_id = $scope.currentuser.client_id;
                  $scope.address.client_id = client_id;         
         }         
         
         var address = $scope.addr;
         for (var key in address) {
            fd.append(key , address[key]);         
         }
         
         mobyeat.serverCall( fd ).then(
                     function (data) {
                       $location.url("/addresslist/"+Date.now());       
                     },
                     function (err) {
                        alert(err); 
                     }
         );
 		}
 		else $scope.submitted=true;
    
 }


});

