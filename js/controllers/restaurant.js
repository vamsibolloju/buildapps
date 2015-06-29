// Controllers of the app

function goToRestaurant(slug){
try{             
  var scope = angular.element(document.getElementsByTagName("map")).scope();
  var rootScope = scope.$root;
      rootScope.gotoRestaurant(slug);
   }catch(err){
   	alert(err);
   }
}
function printDirective() {
        function link(scope, element, attrs) {
            element.on('click', function () {

                var elemToPrint = document.getElementById(attrs.printElementId);
                     console.log(elemToPrint)
                if (elemToPrint) {
                    printElement(elemToPrint);
                    window.print();
                }
            });
 
            window.onafterprint = function () {
                printSection.innerHTML = '';
            }
        }
 
        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            //printSection.appendChild(domClone);
        }
 
        return {
            link: link,
            restrict: 'A'
        };
    }

angular.module('app.controllers', [ 'ngSanitize' , 'menu' ,  'user' , 'mobyeat','custommod' ])
.directive('ngPrint', [printDirective])
.filter('priceFilter' , function ( mobyeat ) {
   return function ( prices , decimal , seperation ) {

      var price = JSON.parse(prices);

         for (var key in price) { 

         return mobyeat.prettyFormat(price[key] , decimal , seperation );  
         }
   }
})
.filter('priceOrderFilter' , function ( mobyeat ) {
   return function ( prices , decimal , seperation ) {
         return mobyeat.prettyFormat(prices , decimal , seperation );  
   }
})
// controller for the side menu of the ionic app
.controller('SideMenuCtrl', function($scope, $location, $state ,$ionicLoading, Projects,$stateParams, $http, $rootScope, $ionicSideMenuDelegate , $ionicHistory  , mobyeat,$cordovaFacebook ) {
    $rootScope.$on('$stateChangeSuccess', 
	  function(event, toState, toParams, fromState, fromParams){
	      if($state.current.name == "profile") $scope.profilepage = true;
         else $scope.profilepage = false;
                       if(toState.name=='menucard' ||toState.name=='cart' || toState.name == "subtotal" || toState.name == "orderitem" ){
                          $scope.backbtn=true;

                       	}
                       	else
                       	     $scope.backbtn=false;   
                       	
                  }); 

	 
	 $scope.$on('login', function (event, data) {
                $scope.currentuser = data;      
                $scope.setInits();
    });
    
    $scope.setInits = function() {
                var pro = Projects.commonLinks;                
                if($scope.currentuser){
                   pro = pro.concat(Projects.userLinks);    
                } else {
                   pro = pro.concat(Projects.authLinks);                
                }
               $scope.projects = pro;
    }

	  

    // switch the side menu on  
    $scope.toggleProjects = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    // click event of the link in side menu
    $scope.selectLink = function(project) {
    	  $location.url(project.link+"/"+Date.now());
        $ionicSideMenuDelegate.toggleLeft(false);
    }
    $scope.goToDefault = function(project) {
    	  $location.url(project+"/"+Date.now());
    }
   $scope.goBack=function(){

    	  $ionicHistory.goBack();

	}
    $scope.logout = function() {
    	  localStorage.removeItem('token'); 
        if($scope.currentuser.provider == 'facebook')
        $scope.facebookLogout();
        $scope.currentuser = null;
        $scope.$emit('login' , null);
        $scope.user = null;
        localStorage.removeItem('profileaddress');
        $location.url('/login/'+Date.now());
        $ionicSideMenuDelegate.toggleLeft(false);
    }

  $scope.facebookLogout = function () {
			 $cordovaFacebook.logout()
			    .then(function(success) {
                    $cordovaFacebook.getLoginStatus(true).then(function ( mess ) {
                     alert(JSON.stringify(mess));
                    } , function (err) {
                    	       alert("err");
                           alert(JSON.stringify(error));
			           }) 		 	    	
			    	
			    	
             }, function (error) {
           alert(JSON.stringify(error));
			                    alert("error");
             });    
    }




})

.controller("SearchCtrl" , function ( $scope ,$state, mobyeat , $stateParams ,$rootScope, $location , $timeout , $http , $window , rest  , $ionicPopup ) {
   
    $scope.$on('mapInitialized', function(event, map) {
      $scope.objMap = map;
    });
    
				$scope.nearResto= function(k,place) {
			       var infowindow = new google.maps.InfoWindow();
           	       var center = new google.maps.LatLng(place.geometry.location.k,place.geometry.location.D);
			       infowindow.setContent(place.name);
			
			       infowindow.setPosition(center);
			       infowindow.open($scope.objMap);    
        
				  }
    
    
    
        $scope.selectResto = function (restaurant , k) {
			       var infowindow = new google.maps.InfoWindow();
			       var center = new google.maps.LatLng(k.latitude,k.longitude);
			       var distance = mobyeat.roundDistance(k.distance);
			       var open = "Closed"; 
			       var cuisines = "";  
			      
                if(k.cuisines.length){
                    for(var i=0 ; i<k.cuisines.length ; i++){
                          if(i != 0) cuisines += ",";
                         cuisines += k.cuisines[i].cuisine_name;                    
                    }
                }   			       
			       
			       if(k.isOpen) open = "Opened";
                var content = '<h3>' +k.restaurant_name + '</h3>'+open;
                if(k.distance) content = content+'<div> Distance: ' + distance +' Kilo Meters</div>';
                content = content+'<div> Address: '+k.street +',' +k.city ;
                 if(cuisines)  content = content+'<div>'+cuisines+'</div>';
			       content = content+'<button onclick="goToRestaurant(\''+k.restaurant_slug+'\')"> Go </button></div>'; 			        
			       infowindow.setContent(content);
			       infowindow.setPosition(center);
			       infowindow.open($scope.objMap);        
        } 
    
                  
                  
  $scope.setInits = function () {
  	   $scope.cuisine = { cuisine_id : 0 , cuisine_name : $scope.lang_strings.allCuisines };
     	rest.getCuisines().then(function( data ){
             data.cuisines.unshift({ cuisine_id : 0 , cuisine_name : $scope.lang_strings.allCuisines });             
            $scope.cuisines = data.cuisines;

     	} , function(err){
     		 alert(JSON.stringify(err));
 });
  	
  	$scope.searchrestopage = false;
   if($state.current.name == "search") $scope.searchrestopage = true;	
  	$scope.list = 'list';
  	$scope.searchBy = 'location';
  	$scope.delivery = true;
  	$scope.pickup = true;
  	
  	$scope.date = new Date();
   $scope.searchStr = "";
   $scope.locations = [ ];    
   $scope.restaurants = [  ];     

  if($scope.searchrestopage){
  if($scope.searchBy == 'location'){
    /* var profileaddress = localStorage.getItem("profileaddress");
      if(profileaddress){
         profileaddress = JSON.parse(profileaddress);
         profileaddress = profileaddress.street +" , "+profileaddress.city +" , "+profileaddress.state;
         $scope.searchStr = profileaddress;            
         $scope.search($scope.searchStr , $scope.delivery , $scope.pickup);  
      }*/
  }

  	  if(navigator.geolocation ){
               navigator.geolocation.getCurrentPosition(function(pos){

               var getAddr = $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+pos.coords.latitude+","+pos.coords.longitude+"&sensor=false")
               getAddr.then(function(data){

		          $scope.searchStr = data.data.results[0].formatted_address;
                  $scope.search($scope.searchStr , $scope.delivery , $scope.pickup);              	
               	}, function(err){
               	   alert(JSON.stringify(err));	 
                 })
                 },function (err) {  
                    alert(err);                 
                 });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
     
  } else {
  	      if($scope.currentuser.favourites){
    	      $scope.searchFavorites();  
  	      }
  	  else {
       $scope.noResto = true;  	  
  	  }
  }


  }

$scope.selectCuisine = function () {
 myPopup = $ionicPopup.show({
			    templateUrl: 'templates/restaurant/cuisines.html',
			    title: 'Cuisines',
			    scope: $scope,
			    buttons: [
				      {
				        text: '<b> Cancel </b>',
				        type: 'button-positive',
				        onTap: function(e) {
                        myPopup.close();				        
				          } 
				        }
				      
				    ]
			  });
}


$scope.cuisineChanged = function (cuisine) {
 $scope.cuisine = cuisine; 
 $scope.search($scope.searchStr , $scope.delivery , $scope.pickup , cuisine.cuisine_id );
 myPopup.close();
}

   $scope.changeListType = function () {
      if($scope.list == 'list'){
          $scope.list = 'map';
      } 
      else $scope.list = 'list';  
   }
   
   $scope.setDeliveryType = function( type , oppos , searchStr , cuisine ){
         if(    $scope[oppos] || !$scope[type]  ){
             $scope[type] = !$scope[type];
             $scope.search(document.getElementById("searchbox").value , $scope.delivery , $scope.pickup , cuisine.cuisine_id );  
        }
   }
   
   
   $scope.changeSeachBy = function () {
      if($scope.searchBy == 'location'){
          $scope.searchBy = 'name';
      } 
      else $scope.searchBy = 'location';  
   }
   
   $scope.setLocation = function (address) {
     searchbox.val(address);  
     $scope.locations = [  ];    
   }
    
  
   $scope.strChanged = function( ) {
   /*var query =	searchbox.val();
   if(query.length > 2)
                $timeout(function() {
                    geocoder.geocode({ address: query }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                                $scope.locations = results;
                        } else {
                            // @TODO: Figure out what to do when the geocoding fails
                        }
                    });
                }, 350); // we're throttling the input by 350ms to be nice to google's API
   */}  


  
  $scope.search = function(searchStr , delivery , pickup , cuisine ) {
  var service = 1;
  if (delivery && !pickup) service = 2;
  if (!delivery && pickup) service = 3;
   
  	if($scope.searchBy == 'location'){
     var str = searchStr.split(",");
     if(str.length >= 2){
       var street = str[0].trim();
       var city = str[1].trim();
       var state = "" ;
       var address = "";
       var longi = "" , lat = "";
       if(str[2]){
             state = str[2].trim();
             address = street.split(' ').join('+')+','+city.split(' ').join('+')+','+state.split(' ').join('+');
       } 
       else
          address = street.split(' ').join('+')+','+city.split(' ').join('+');
          var remoteloc = $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false");
		    remoteloc.then(function(data){
		    	if(data.data.results[0]){
		    		  longi=data.data.results[0].geometry.location.lng;
		    	     lat=data.data.results[0].geometry.location.lat;
		    	 	}
		    	    $scope.lat = lat;
		    	    $scope.long = longi;
		        var fd = new FormData();
              fd.append("action" , "getAllMerchants" );
             
              fd.append("latitude",lat);
              fd.append("longitude",longi);
             
              fd.append("service" , service);
              if(cuisine)              
              fd.append("cuisine_id" , cuisine);                             
          mobyeat.serverCall(fd).then(
               function (data) {
               	   $scope.locations = [];
                    	if(data){

                        	$scope.restaurants = data;
                           $scope.noResto = false;                    	
                    	}
                     else{
                        	$scope.restaurants = data;
                        	
                           $scope.noResto = true;   	
                     } 
                    } , 
                    function ( err ) {
                        	$scope.restaurants = [];
                           $scope.noResto = true;   	
               });
               
          });     
               
               
                    
     }  else {
     	          	$scope.restaurants = [];
     }
    } else {

    	  if(searchStr){

          var fd = new FormData();
              fd.append("action" , "getMerchantsByName");
              fd.append("service" , service);
              fd.append("searchresto", searchStr);

              mobyeat.serverCall(fd).then(function (data) {
                    	if(data){
                        	$scope.restaurants = data;
                           $scope.noResto = false;                    	
                    	}
                     else{
                        	$scope.restaurants = data;
                           $scope.noResto = true;   	
                     } 
              },function (err) {
                  alert(JSON.stringify(err));
              })
    	  }
    }
  }
  
  $scope.searchFavorites = function () {
               if(navigator.geolocation ){
                 navigator.geolocation.getCurrentPosition(function(pos){
	              $scope.lat = pos.coords.latitude;
		    	     $scope.long = pos.coords.longitude;
		    	         var fd = new FormData();
						        fd.append("action" , "getFavouriteRestos");
						               fd.append("latitude",$scope.lat);
						               fd.append("longitude",$scope.long);
						               fd.append("favourites" , $scope.currentuser.favourites);
						        mobyeat.serverCall(fd).then(function (data) {
						                    	if(data){
						                        	$scope.restaurants = data;
						                           $scope.noResto = false;                    	
						                    	}
						                     else{
						                        	$scope.restaurants = data;
						                           $scope.noResto = true;   	
						                     } 
						        },function (err) {
						           alert(JSON.stringify(err));
						        });   

		    	     
		    	   });
        } else {
            alert("Geolocation is not supported by this browser.");
        }  	
  	
  }   
  
   $rootScope.gotoRestaurant = function ( slug  ) {
    $state.go('restaurant', {slug:slug,ident:Date.now()});
 }

 $scope.clearMap = function () {
   document.getElementById("parent").innerHTML ="";
 }

})


.controller("RestoCtrl" , function ( $scope ,custom, $rootScope ,$ionicLoading,  mobyeat , $stateParams , $location , getMerchants , rest , $ionicModal , $ionicPopup ) {
    var merchant;
    $scope.setInits = function () {

        $scope.days = [
		        'monday',
				  'tuesday',
				  'wednesday',
				  'thursday',
				  'friday',
				  'saturday',
				  'sunday'        
        ];     	
    	   mobyeat.clearCart();
         $scope.showmap = false;
                	    $scope.restaurant =  getMerchants.restaurant;
                      if($scope.currentuser){
	                	    $scope.currentuser.favourites = ($scope.currentuser.favourites).split(",");
	                	    if ($scope.currentuser.favourites.length == 1 && $scope.currentuser.favourites[0] == "" ) $scope.currentuser.favourites = [];  
	                	    if( ($scope.currentuser.favourites).indexOf($scope.restaurant.merchant_id) !== -1 )
	                	    $scope.favourite = true;
                      	}  
                      $scope.menus = getMerchants.menus;     
                   	 $scope.options = custom.getOptions( getMerchants.options);
                   	 $scope.store_open_day = getMerchants.stores_open_day || [];
                      $scope.store_open_starts = getMerchants.stores_open_starts || {};
                      $scope.store_open_ends = getMerchants.stores_open_ends || {};
                      $scope.cuisines = getMerchants.cuisines;
                      $scope.curr = getMerchants.curr_symbol;
                   	 $scope.ratings = custom.getRatings(getMerchants.ratings);
                   	 $scope.rating_meanings = getMerchants.rating_meanings; 
                   	 
                   	 if(localStorage.getItem('token')){
		                      var fd = new FormData();
		                          fd.append("action" , "getRating");
		                          fd.append("client_id" , localStorage.getItem('token') );
		                          fd.append("merchant_id" , $scope.restaurant.merchant_id );
		                   	 
		                      mobyeat.serverCall( fd ).then(function (data) {
		                         $scope.userrating = data.ratings;
		                      },function () {
		                      
		                      });                   	 
                   	 }
                   	 
                   	 
                   	 $scope.decimal=getMerchants.deci;
                   	 $scope.distance=getMerchants.distance;
                      $scope.separator=getMerchants.decseparate;
                              if($scope.separator=='yes')
                                  $scope.separator=true;
                              else $scope.separator=false;   
                     $scope.country_name = getMerchants.country_name;
                     $scope.isOpened=getMerchants.is_merchant_open

      
    }

   $ionicModal.fromTemplateUrl('templates/restaurant/timetable.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.modal = modal;
   });
   
   
   $scope.isOpen = function (day) {
      if($scope.store_open_day.indexOf(day) !=-1) return true;   
   }

  $scope.viewMap = function (restostreet,restocity) {
   	 var street = restostreet.trim();
       var city = restocity.trim();
            $scope.lat = $scope.options.merchant_latitude , $scope.long = $scope.options.merchant_longtitude; 
          if(!$scope.lat && !$scope.long){
           var address = street.split(' ').join('+')+','+city.split(' ').join('+');
          var remoteloc = $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false");
		    remoteloc.then(function(data){
		    	if(data.data.results[0]){
		    		  longi=data.data.results[0].geometry.location.lng;
		    	     lat=data.data.results[0].geometry.location.lat;
		    	 	}
                  $scope.lat=lat;
                  $scope.long=longi;
 		    	 })
		    }
		    
		   
        $scope.showmap = true;
     } 
     var myPopup;
   $scope.openRating = function(){
			 myPopup = $ionicPopup.show({
			    templateUrl: 'templates/restaurant/ratings.html',
			    title: 'Rating',
			    scope: $scope,
                           buttons: [
                                     {
                                       text: '<b> Cancel </b>',
                                       type: 'button-positive',
                                       onTap: function(e) {
                                             myPopup.close();                                        
                                         } 
                                       }
                                     
                                   ]
			  });
   }
   
   $scope.setRating = function (r) {
         var fd = new FormData();
             fd.append( "action" , "setRating"); 				
             fd.append("client_id" , localStorage.getItem("token") );				             
             fd.append("merchant_id" , $scope.restaurant.merchant_id );				             
             fd.append("rating" , r);
              mobyeat.serverCall( fd ).then(
                 function () {
                   $scope.userrating = r;
                   myPopup.close();          
                },function (err) {
                   alert(JSON.stringify(err));
                });        
      
      
           
      
   }
   
   $scope.viewTimeTable = function () {
       	 $scope.modal.show();         
   }
   $scope.closeModal = function () {
       	 $scope.modal.hide();         
   } 

   $scope.viewMenu = function () {
          $location.url("");
   }

   $scope.getMenu = function ( merchant_id , menu_id ,restaurant_slug) {
   	$scope.slug=restaurant_slug
          $scope.$emit('update_parent_controller', $scope.slug);

          $location.url('menucard/'+merchant_id+'/'+menu_id+'/'+Date.now());
   } 
  
   $scope.addToFavourites = function () {
       var msg = "Add to favourites";    	
   	 if($scope.favourite){
   	   $scope.currentuser.favourites = $scope.currentuser.favourites.splice( $scope.restaurant.merchant_id , 1  );
         $scope.favourite = false;    	 
         msg = "Removed from favourites"   	 
   	 } 
       else{
       	$scope.currentuser.favourites.push($scope.restaurant.merchant_id);     
         $scope.favourite = true;
       } 
       rest.addToFavourites($scope.currentuser.favourites , msg).then(function () {
       },function () {
       });   	 
   }  
 
})
.controller( 'OrderCtrl', function($scope, $ionicLoading, $stateParams , fOrder) {
  $scope.setInits = function () {

  	       	$scope.fdata=fOrder;
            $scope.useraddress = JSON.parse(fOrder.address);  
  }
})
.controller( 'OrdersCtrl', function($scope, $ionicLoading, $stateParams , orders , $location) {
  $scope.setInits = function () {

  	       	$scope.orders = orders;
  }
  $scope.goToOrder = function ( order_id ) {
     $location.url('orderitem/'+order_id+"/"+Date.now());
  }  
  
})

.controller( 'MessagesCtrl', function($scope, $stateParams , $ionicLoading, messages , $location) {
  $scope.setInits = function () {

          	$scope.messages = messages;
  }
  
  $scope.goToOrder = function ( order_id ) {
     $location.url('orderitem/'+order_id+"/"+Date.now());
  }  
  
})


.controller( 'OrderItemCtrl', function($scope, $ionicLoading, $stateParams , orderitem , $location) {
  $scope.setInits = function () {

  	       	$scope.orderitem = orderitem.order;
  	       	$scope.orderDetails=orderitem.order_details;
  	       	$scope.curr=orderitem.curr;
  	       	$scope.decimal=orderitem.decimal;
  	       	$scope.separator=orderitem.separator;
  	       	for(var i=0;i<$scope.orderDetails.length;i++){
  	       		if(orderitem.order_details[i].addon)
  	       		  	       	$scope.indiaddon=JSON.parse(orderitem.order_details[i].addon)
  	       		}

  }
})
.controller( 'SettingsCtrl', function($scope , $location) {

   $scope.setInits = function () {
   
   }
   
   $scope.goSettings = function ( setting ) {
      $location.url(setting);
   }

});
