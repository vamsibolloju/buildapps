angular.module("rest" ,[ "mobyeat" ])
.service("rest" , function ( mobyeat , $q ,$rootScope,$http ) {
      this.getRestaurants = function () {
      	             var deferred = $q.defer();
                  var lat="",longi="";
            var value=JSON.parse(localStorage.getItem("profileaddress"));
 
 
   if(value) 
     var address = value.street.split(' ').join('+')+','+value.city.split(' ').join('+')+','+value.state.split(' ').join('+');
   
   if(address){
		   
		 var remoteloc = $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false")
		    remoteloc.then(function(data){
		    	if(data.data.results[0]){
		    		  longi=data.data.results[0].geometry.location.lng;
		    	     lat=data.data.results[0].geometry.location.lat;
		    		}
		    	   var fd = new FormData();
		              fd.append("latitude" , lat );
		                fd.append("longitude" , longi ); 
		                fd.append("action" , "getAllMerchants");    
								    mobyeat.serverCall( fd ).then(function(data){
							  	          deferred.resolve(data) ;
								    } , function(err){
								    		 alert(err);
								    });
		           	});   
   }     
   else  {
   
     var fd = new FormData();
		              fd.append("latitude" , lat );
		                fd.append("longitude" , longi ); 
		                fd.append("action" , "getAllMerchants");    
								    mobyeat.serverCall( fd ).then(function(data){
							  	          deferred.resolve(data) ;
								    } , function(err){
								    		 alert(err);
								    });
   
      
   }
           return deferred.promise;	 		
 		
          
						   
      }
      this.getMerchantBySlug=function(slug){
      var deferred = $q.defer();
       var from = "" , address = "" ,lat="" ,longi="" ;
         if (localStorage.getItem( "profileaddress" )) {
              address = JSON.parse( localStorage.getItem( "profileaddress" ) );
         }
          if(address)            
          from = address["street"].split(' ').join('+') + "," + address["city"].split(' ').join('+') + "," + address["state"].split(' ').join('+');
          var remoteloc = $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+from+"&sensor=false")
              remoteloc.then(function(data){
              		if(data.data.results[0]){
    		          longi=data.data.results[0].geometry.location.lng;
                 	lat=data.data.results[0].geometry.location.lat;
                          }
      	      	               var fd = new FormData();
						         fd.append("action" , "getMerchantBySlug");  
						        fd.append("slug",slug);
                           fd.append("latitude" , lat );
                          fd.append("longitude" , longi ); 
						    mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						 })
						    return deferred.promise;
      	
      	};
      	
      	
         this.addToFavourites = function ( merchant_id , msg ) {
                      var deferred = $q.defer();
               	    var fd = new FormData();
                     fd.append("action" , "addToFavourites");
                     fd.append("client_id" , localStorage.getItem('token') );
                     fd.append("merchant_id" , merchant_id );
                      mobyeat.serverCall( fd , false , msg ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
         }
         
         this.getCuisines = function(){
                      var deferred = $q.defer();
               	    var fd = new FormData();
                     fd.append("action" , "getCuisines");
                     fd.append("molile" , true );
                      mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
          }            
               	
      	
      	this.getmenucard = function (id , menuid) {
      	             var deferred = $q.defer();
               	    var fd = new FormData();
                    fd.append("action" , "getMenuByMerchant" );
                     fd.append("id" , id );
                     fd.append("menuid" , menuid );
                     
						    mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
      }
      this.cartOptions=function(id){
      	    var deferred = $q.defer();
               	    var fd = new FormData();
						    fd.append("action" , "getCartOptions");  
						    fd.append("id" , id );
						    mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
      	
      	
      	}
      	this.subtotalOptions=function(id){
      		 var deferred = $q.defer();
               	    var fd = new FormData();
                    fd.append("action" , "getSubtotalOptions" );
                     fd.append("id" , id );
						    mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
                       
      		
      		}
      		
      		this.checkOptions=function(id,clientid){
      		 var deferred = $q.defer();
      		   	var trans_type =  JSON.parse(localStorage.getItem("delivery_options")).trans_type;
               	    var fd = new FormData();
                    fd.append("action" , "getCheckoutOptions" );
                    fd.append("id" , id);  
                    fd.append("client_id" , clientid);  
               	    mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
                       
      		
      		}
      		this.getAddress=function(){

      		      		 var deferred = $q.defer();
      		      		 var fd = new FormData();
         fd.append("action" , "getUserAddresses");
         fd.append("id" , localStorage.getItem('token') );  	
      			
      			 mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
      			
      			}
      					
      			this.getAddressbyId = function (id) {
      	             var deferred = $q.defer();
               	    var fd = new FormData();
                    fd.append("action" , "getAddressById" );
                     fd.append("id" , id );
						    mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
                }
      			 this.cList=function(client_id){
      	               var deferred = $q.defer();
      			 		  var fd = new FormData();
                    fd.append("action" , "getCreditCards");
                     fd.append("id" , client_id ); 
                      mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
      			 	
      			 	}
      			 	this.creditcardId= function (id) {
      	             var deferred = $q.defer();
               	    var fd = new FormData();
                    fd.append("action" , "getCardById" );
                     fd.append("id" , id );
						    mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
                }
                this.placeorder=function(id){
                	  var deferred = $q.defer();
      			 	 var fd = new FormData();  
                       fd.append("action" , "getOrderDetails");
                       fd.append("order_id" ,id);
                       fd.append("client_id" ,localStorage.getItem('token')); 
                       
                       mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						     } , function(err){
						    		 alert(err);
						     });
						     return deferred.promise;
                	}
                
                this.getOrders=function(id){
                	  var deferred = $q.defer();
      			 		   var fd = new FormData();  
                            fd.append("action" , "getUserOrders");
                            fd.append("client_id" ,localStorage.getItem('token')); 
                      
                      mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
                }

                this.getMessages=function(id){
                	  var deferred = $q.defer();
      			 		   var fd = new FormData();  
                            fd.append("action" , "getMessages");
                            fd.append("client_id" ,localStorage.getItem('token')); 
                      
                      mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						    } , function(err){
						    		 alert(err);
						    });
						    return deferred.promise;
                }
            
               this.getOrderItem=function(id){
                	  var deferred = $q.defer();
      			 	 var fd = new FormData();  
                       fd.append("action" , "getOrderItemDetails");
                       fd.append("order_id" ,id);
                       fd.append("client_id" ,localStorage.getItem('token')); 
                       
                       mobyeat.serverCall( fd ).then(function(data){
					  	          deferred.resolve(data) ;
						     } , function(err){
						    		 alert(err);
						     });
						     return deferred.promise;
                	}            
                
      		     
})
