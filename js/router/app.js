// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


angular.module('todo', ['ionic', 'ngCordova' , 'ionic.service.core' , 'ionic.service.push' , 'app.controllers', 'app.factories' , 'auth', 'angularPayments' , 'rest' , 'ngMap' , 'i18n' ])

    .constant('$ionicLoadingConfig', {
        template: "loading ... " ,
        noBackdrop: false 
    })
    .run(function (i18n) {
    	  var lang_code = localStorage.getItem('lang_code') || 'IT';
        i18n.getlangStrings(lang_code); 
    })
    .config(function($stateProvider, $urlRouterProvider, $httpProvider , $ionicAppProvider , $cordovaFacebookProvider  ) {
        var appID = 929955023728341;
        var version = "v2.0"; // or leave blank and default is v2.0
        try {        
         $cordovaFacebookProvider.browserInit(appID, version);
        } catch(e){
           
        }
		 // Identify app
		  $ionicAppProvider.identify({
		    // The App ID (from apps.ionic.io) for the server
		    app_id: 'dd1c654d',
		    // The public API key all services will use for this app
		    api_key: '44928360b36f9a4178ce7989c45304fa5c3bb008b8c0bf3a',
		    // Set the app to use development pushes
		    //dev_push: true
		    gcm_id: '482668327136'
		  });    	
    	
        // login if user
        var ifLogin = function ($location, $rootScope, $timeout, $q , mobyeat , mobyeatUrl) {
        	   $rootScope.rooturl = mobyeatUrl;
            var deferred = $q.defer();
            $timeout(function() {
                var token = localStorage.getItem('token');
                if (token) {
                      //$rootScope.currentuser = null; 
			             var client_id = localStorage.getItem('token');
			             if (client_id){
					          var fd = new FormData();
					          fd.append("action" , "getClientInfo");
                         fd.append("id" , client_id );
							    mobyeat.serverCall( fd , true ).then(function(data){
                               if(data){
  							    	             $rootScope.currentuser = data;
                      			          $rootScope.$broadcast('login',data);
                                      	}
                                      	else{
 			                                $rootScope.currentuser = null;
 			                                $location.url("/login/"+Date.now());
			                                localStorage.setItem( 'token' , '' );
                                      }
                                 $timeout(deferred.resolve);

							    } , function(err){
							                   $rootScope.currentuser = null;
                                        $location.url("/login/"+Date.now());
			                           	localStorage.setItem( 'token' , '' );
			  				    })
			         
			             }                  	
                	
                } else {
                    $timeout(deferred.resolve);
                }
            }, 0);
            return deferred.promise;
        }


        // checking any user logged in
        var isLoggedIn = function($location, $rootScope, $timeout, $q , mobyeat) {
            var deferred = $q.defer();
            $timeout(function() {
                var token = localStorage.getItem('token');
                if (token) {
                	
                      //$rootScope.currentuser = null; 
			             var client_id = localStorage.getItem('token');
			             if (client_id){
			             	
					          var fd = new FormData();
					          fd.append("action" , "getClientInfo");
					          fd.append("id" , client_id );
							    mobyeat.serverCall( fd , true ).then(function(data){
                                      if(data){
  							    	             $rootScope.currentuser = data;
							    	             $rootScope.$broadcast('login',data);
                                      	}
                                      	else{
 			                                $rootScope.currentuser = null;
                                         $location.url("/login/"+Date.now());
			                                localStorage.setItem( 'token' , '' );
                                      }
                    $timeout(deferred.resolve);

							    } , function(err){
			                               $rootScope.currentuser = null;
                                         $location.url("/login/"+Date.now());
			                           			                              
			                               localStorage.setItem( 'token' , '' );
							    })
			         
			             }                  	
                	
                } else {
                    $timeout(deferred.reject);
                    $location.url('/login/'+Date.now());
                }
            }, 0);
            return deferred.promise;
        };

        // checking no user logged in
        var isLoggedOut = function($location, $rootScope, $timeout, $q ) {
            var deferred = $q.defer();
            $timeout(function() {
                //var user = localStorage.getItem("userId");
                var token = localStorage.getItem('token');
                if (token) {
                    $timeout(deferred.reject);
                    $location.url('/search/'+Date.now());
                } else {
                    $timeout(deferred.resolve);
                }
            }, 0);
            return deferred.promise;
        };

        // checking cart
        var isCart = function($location, $rootScope, $timeout, $q ) {
            var deferred = $q.defer();
            $timeout(function() {
                var cart = localStorage.getItem('cart');
                if (cart) {
                    $timeout(deferred.resolve);

                } else {
                    $timeout(deferred.reject);
                    $location.url('/profile/'+Date.now());
                }
            }, 0);
            return deferred.promise;
        };
         $stateProvider       
        .state('search', {
            url: '/search/:ident',
            templateUrl: "templates/restaurant/search.html",
            controller : "SearchCtrl",
            resolve: {
                  loggedin: ifLogin
            }
        })
        .state('favourites', {
            url: '/favourites/:ident',
            templateUrl: "templates/restaurant/search.html",
            controller : "SearchCtrl",
            resolve: {
                  loggedin: ifLogin
            }
        })
        
			.state('restaurant', {
				url: '/restaurant/:slug/:ident',
				templateUrl: "templates/restaurant/restaurant.html",
            controller : "RestoCtrl",
                resolve: {
                  loggedin: ifLogin,
                   getMerchants : function ( rest , $q,$ionicLoading, $stateParams ) {
                  	             var deferred = $q.defer();
  	                               $ionicLoading.show()
										    rest.getMerchantBySlug($stateParams.slug).then(function(data){
                                  $ionicLoading.hide();
										   	    deferred.resolve(data);
                           	    } , function(err){
										         alert(err);
										    });
										    return deferred.promise;
                  }
                }
			})
        .state('menucard', {
            url: '/menucard/:id/:menuid/:ident',
            templateUrl: "templates/restaurant/menucard.html",
            controller : "MenucardCtrl",
                resolve: {
                  loggedin: ifLogin,
                 getMenu : function ( rest , $q,$stateParams ,$ionicLoading) {
                  	             var deferred = $q.defer();
                  	             $ionicLoading.show()
                           	    rest.getmenucard($stateParams.id , $stateParams.menuid).then(function(data){
                           	    $ionicLoading.hide();
                                        deferred.resolve(data) ;

										    } , function(err){
										    		 alert(err);
										    });
										    return deferred.promise;
                  }
                }
        })
        .state('cart', {
            url: '/cart/:id/:ident',
            templateUrl: "templates/restaurant/cart.html",
            controller : "CartCtrl",
                resolve: {
                  loggedin: ifLogin,
                  cartOptions : function ( rest , $q,$stateParams,$ionicLoading ) {
                  	             var deferred = $q.defer();
                  	            $ionicLoading.show();
                           	    rest.cartOptions($stateParams.id ).then(function(data){
									  	          deferred.resolve(data) ;
									  	          $ionicLoading.hide();
										    } , function(err){
										    		 alert(err);
										    });
										    return deferred.promise;
                  }
                }
        })
  
        .state('checkout', {
            url: '/checkout/:id/:ident',
            templateUrl: "templates/restaurant/checkout.html",
            controller : "CheckoutCtrl",
            resolve: {
                   loggedin: isLoggedIn,
                   checkoutOptions : function ( rest , $q,$stateParams,$rootScope,$ionicLoading ) {
                  	             var deferred = $q.defer();
                  	            $ionicLoading .show();
                           	    rest.checkOptions($stateParams.id, localStorage.getItem('token')).then(function(data){
									  	          deferred.resolve(data) ;
									  	     $ionicLoading .hide();

										    } , function(err){
										    		 alert(err);
										    });
										    return deferred.promise;
                  }
                }
        })
        .state('order', {
            url: '/order/:id',
            templateUrl: "templates/restaurant/order.html",
            controller : "OrderCtrl",
                resolve: {
                  loggedin: ifLogin,
                   fOrder : function ( rest , $q,$ionicLoading, $stateParams) {
                  	             var deferred = $q.defer();
                  	            $ionicLoading.show()
                           	    rest.placeorder($stateParams.id).then(function(data){
									  	          deferred.resolve(data) ;
									  	          $ionicLoading.hide()
										    } , function(err){
										    		 alert(err);
										    });
										    return deferred.promise;
                  }
                }
        })
        
        .state('orders' , {
            url: '/orders/:ident',
            templateUrl: "templates/user/orders.html",
            controller : "OrdersCtrl",
                resolve: {
                  loggedin: ifLogin,
                  orders : function ( rest , $q,$ionicLoading, $stateParams) {
                  	             var deferred = $q.defer();
                  	              $ionicLoading.show()
                           	    rest.getOrders().then(function(data){
                                        deferred.resolve(data) ;
                                        $ionicLoading.hide()
										    } , function(err){
										    		 alert(err);
										    });
										    return deferred.promise;
                  }
                }
        	})
        .state('messages' , {
            url: '/messages/:ident',
            templateUrl: "templates/user/messages.html",
            controller : "MessagesCtrl",
            resolve: {
                  loggedin : ifLogin,
                  messages : function ( rest , $q,$ionicLoading, $stateParams) {
                  	             var deferred = $q.defer();
                  	              $ionicLoading.show();
                           	    rest.getMessages().then(function(data){
                           	    	    deferred.resolve(data);
                           	    	    $ionicLoading.hide();
										    } , function(err){
										    		 alert(err);
										    });
										    return deferred.promise;
                  }
               }
        	})
         .state('orderitem' , {
            url: '/orderitem/:id/:ident',
            templateUrl: "templates/restaurant/orderitem.html",
            controller : "OrderItemCtrl",
                resolve: {
                  loggedin: ifLogin,
                  orderitem : function ( rest , $q,$ionicLoading, $stateParams) {
                  	             var deferred = $q.defer();
                  	            $ionicLoading.show()
                           	    rest.getOrderItem($stateParams.id).then(function(data){
                                        deferred.resolve(data) ;
                                        $ionicLoading.hide()
										    } , function(err){
										    		 alert(err);
										    });
										    return deferred.promise;
                  }
                }
         })        	
        	

        // route for login page 
       
            .state('login', {
                url: '/login/:ident',
                templateUrl: "templates/auth/login.html",
                controller: "LoginCtrl" ,
                resolve: {
                  loggedin: isLoggedOut
                }

            })
        // route for registration page
        .state('register', {
            url: '/register/:ident',
            templateUrl: "templates/auth/register.html",
            controller: "RegisterCtrl",
                resolve: {
                  loggedin: isLoggedOut
                }
        })
        .state('forgotpassword', {
            url: '/forgotpassword/:ident',
            templateUrl: "templates/auth/forgotpassword.html",
            controller: "forgotpasswordCtrl",
                resolve: {
                  loggedin: isLoggedOut
                }
        })
        .state('changepassword', {
            url: '/changepassword/:ident',
            templateUrl: "templates/auth/changepassword.html",
            controller: "ChangepasswordCtrl",
                resolve: {
                  loggedin: isLoggedOut
                }
        })
        .state('profile', {
            url: '/profile/:ident',
            templateUrl: "templates/user/profile.html",
            controller: "ProfileCtrl",
                resolve: {
                  loggedin: isLoggedIn
                }
            
        })
        .state('addresslist', {
            url: '/addresslist/:ident',
            templateUrl: "templates/user/addresslist.html",
            controller: "AddressListCtrl",
                resolve: {
                  loggedin: isLoggedIn,
                     getAddress : function ( rest , $q) {
                  	             var deferred = $q.defer();
                           	    rest.getAddress().then(function(data){

									  	          deferred.resolve(data) ;
										    } , function(err){
										    		 alert(err);
										    });
										    return deferred.promise;
                  }
                }
            
        })
        
			.state('addaddress' , {
				url: '/addaddress',
				templateUrl: "templates/user/address.html",
            controller: "AddressCtrl",
                resolve: {
                  loggedin: isLoggedIn,
                  editAddress: function(){ return null; }
                }
			})
			.state('editaddress' , {
				url: '/editaddress/:id',
				templateUrl: "templates/user/address.html",
            controller: "AddressCtrl",
                resolve: {
                  loggedin: isLoggedIn,
                     editAddress : function ( rest , $q,$stateParams) {
                  	             var deferred = $q.defer();
                           	    rest.getAddressbyId($stateParams.id).then(function(data){

									  	          deferred.resolve(data) ;
										    } , function(err){
										    		 alert(err);
										    });
										    return deferred.promise;
                  }
                }
			})
        .state('settigs', {
            url: '/settings',
            templateUrl: "templates/user/settings.html",
            controller: "SettingsCtrl",
                resolve: {
                  loggedin: isLoggedIn
                }
            
        });
        $urlRouterProvider.otherwise('/search/'+Date.now());
    });
