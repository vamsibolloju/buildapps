
angular.module('menu' , [ 'mobyeat','custommod'])
.config(function() {
		window.Stripe.setPublishableKey('pk_test_PPNjWjeb0aDyFjD46OPt4LDg');
	})
.controller('MenucardCtrl' , function ($scope ,custom, $rootScope ,$ionicModal ,mobyeat , $stateParams , $location,getMenu , $ionicLoading ) {
  $rootScope.$on("cartc" , function () {
    $scope.setItemsCount();  
  });
      
    $scope.setItemsCount = function () {
       var cart = JSON.parse(localStorage.getItem('cart') || '[]');      
       $scope.itemsCount = cart.length;    
       $scope.getTotal(cart);
       $scope.total =  $scope.getTotal( cart );
    }

    $scope.setInits = function () {

    	          $scope.catnum = null;	    
    	          $scope.menucard = custom.getMenuCard(getMenu.menus , getMenu.categories , getMenu.items );
                $scope.curr = getMenu.curr_symbol;
                $scope.decimal=getMenu.deci;
                $scope.separator=getMenu.decseparate;
                if($scope.separator=='yes')
                   $scope.separator=true;
                else $scope.separator=false;
                $scope.slug=getMenu.restaurant.restaurant_slug   
                $scope.setItemsCount();
    };   
    
$scope.getTotal = function ( cart ) {
       var sub_total = 0;
       angular.forEach(cart , function (cartitem) {
             var price = Number(cartitem.price.price);
             if(cartitem.discount){
                  price = price - Number(cartitem.discount); 
             }
             price = price * Number(cartitem.qty);
                 

             var subitem_total = 0;
             for(var subcat in cartitem.sub_item ) {
                  
               var subitems = cartitem.sub_item[subcat];
                 
                   angular.forEach(subitems , function ( subitem ) {
                       subitem_total = subitem_total + ( Number(subitem.qty) * Number(subitem.price) ); 
                   });               
             }
              sub_total = sub_total + price + subitem_total;         
       });
       return sub_total;        
    }



    $scope.openCart = function () {
    	     	   localStorage.setItem("menuid",$stateParams.menuid);       
   
       $location.url("/cart/"+$stateParams.id+"/"+Date.now());    
    }

  $ionicModal.fromTemplateUrl('templates/restaurant/item.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.modal = modal;
    });

    $scope.setItem = function (item_id) {
    $scope.orderItemDetail = null;	

      var fd = new FormData();
          fd.append("action" , "getItemById" );
          fd.append("id" , item_id );

      mobyeat.serverCall( fd ).then(function (result) {

             $scope.selectedItem = result.items[0];
      	    $scope.cooking_ref = $scope.selectedItem.cooking_ref;
             $scope.curr=result.curr_symbol;
             $scope.decimal=result.deci;
             $scope.separator=result.decseparate;
	          $scope.modal.show();       

             if($scope.separator=='yes')
                  $scope.separator=true;
             else $scope.separator=false; 
         	 $scope.$broadcast("setItemInits", false);
	          $scope.modal.show();       
        },function (error) {
        	 
        });   
      
  }



    $scope.closeItem = function () {
       $scope.modal.hide();
    }

    $scope.openCat = function ( index ) {
    	if( index == $scope.catnum ){
          $scope.catnum = null;	    
    	}
      else {
	       $scope.catnum = index;
	   }     
	 }
})
.controller("ItemCtrl" , function ($scope , $location , $rootScope , $stateParams , $state)  {
		$scope.$on("setItemInits", function (event, args) {
	  	  $scope.addonsids = [];
     	  $scope.addonsizes = {};
        if(args){
             var addonids = [] , addonsizes = {};
             var sub_item = $scope.orderItemDetail.sub_item || {};
             	      for(var key in sub_item) {
                          angular.forEach(sub_item[key] , function ( item ) {
                               addonids.push(item.sub_item_id);
                               addonsizes[item.sub_item_id] = item.qty;
                          });                              
                    }
              $scope.addonsids = addonids;                         
              $scope.addonsizes = addonsizes;
        }else{
		        $scope.orderItemDetail =  { qty : 1 ,  sub_item : {} };   
        	     if($scope.selectedItem.prices.length==1){
        	        $scope.orderItemDetail.price = $scope.selectedItem.prices[0];                   	     
        	     }  
        }         
   	});
    
    $scope.setPrice = function (price) {
      $scope.orderItemDetail.price = price;   
    }	
	
    $scope.setCookingRef = function (ref) {
      $scope.orderItemDetail.cooking_ref = ref;   
    }	

    $scope.setAddonItem = function (subcatid , addon , multival , limit) {
      if(!$scope.orderItemDetail.sub_item[subcatid] || multival == "one" ){
	       var pre = $scope.orderItemDetail.sub_item[subcatid] || [];
          if(pre.length){
              angular.forEach(pre , function ( pitem , index ) {
                  $scope.addonsids.splice(index , 1);
              });          
          }       
	       $scope.orderItemDetail.sub_item[subcatid] = [];
	   }   
	   
	   var addonindex = $scope.addonsids.indexOf(addon.sub_item_id);  	
    	if(addonindex == -1){
					   if (multival == "custom"){
						      if($scope.orderItemDetail.sub_item[subcatid].length >= limit ){
						          alert("limit cross");
						          return;      
						      }      
					   }
               addon.qty = 1; 		
    	         if(multival == 'multiple'){
                  addon.qty = document.getElementById(addon.sub_item_id).value || 1; 		
    	         }		       
			    	$scope.orderItemDetail.sub_item[subcatid].push(addon);    
			      $scope.addonsids.push(addon.sub_item_id); 
    	}else {
    		      $scope.orderItemDetail.sub_item[subcatid].splice(addonindex , 1);
			      $scope.addonsids.splice(addonindex , 1);   
    	}
    }	

    $scope.increment = function (id) {
  	    if (id) {
           document.getElementById(id).value =  Number(document.getElementById(id).value)+1;    	  
    	  }    
       $scope.orderItemDetail.qty =  $scope.orderItemDetail.qty+1;     
    }
    $scope.decrement = function (id) {
    	  if (id) {
           document.getElementById(id).value =  Number(document.getElementById(id).value)-1;    	  
    	  } else {
           $scope.orderItemDetail.qty =  $scope.orderItemDetail.qty-1;
        }   
    }


	 $scope.addToCart = function () {
 	          var item = $scope.selectedItem;
 	          var order = { item : item };
 	              order.qty = $scope.orderItemDetail.qty || 1;               

             var price , cooking_ref , sub_item = {};     
           
             price = $scope.orderItemDetail.price; 	        
 	          if(!price){
               alert("select price");
               return; 	          
 	          }
             order.price = price;
                         
             cooking_ref = $scope.orderItemDetail.cooking_ref;
             order.cooking_ref = cooking_ref;
        
             order.sub_item = $scope.orderItemDetail.sub_item;    
      
             order.order_notes = $scope.orderItemDetail.order_notes || "";    

      
        var cart = JSON.parse(localStorage.getItem("cart")) || [];
        if($scope.cartindex || $scope.cartindex == 0){
            cart[$scope.cartindex] = order;       
        } else {
            cart.push(order);
        }     
        localStorage.setItem( "cart" , JSON.stringify(cart) );
        $rootScope.$emit("cartc" , "dsved");
  	     $scope.modal.hide();
 } 
   
})
.controller("CartCtrl" , function ($scope , $rootScope , $ionicModal ,custom, mobyeat , $stateParams , $location ,cartOptions , $ionicLoading ) {
  $rootScope.$on("cartc" , function () {
    $scope.setInits();  
  });	

	 $scope.setInits = function () {

	 	         $rootScope.backpage = "/menucard/"+$stateParams.id+"/"+Date.now();
	 	         var cart = JSON.parse(localStorage.getItem("cart")) || [];
               $scope.cart = cart; 
               $scope.curr=cartOptions.curr;
               $scope.decimal=cartOptions.deci;
               $scope.separator=cartOptions.decseparate;
               if($scope.separator=='yes')
                  $scope.separator=true;
               else $scope.separator=false;  
               $scope.cart = custom.checkSubs(cart); 
               $scope.total = $scope.getTotal(cart);
               $scope.voucher_less = $scope.getVoucherLess();
               $scope.options = custom.getOptions( cartOptions.options); 
               $scope.sub_total = $scope.getSubTotal();
                $scope.less_voucher = 0;
                 var value = localStorage.getItem("voucher");    
                 if(value){
                 	        $scope.remove = true;                
                 } 	
    	 }


    $scope.increment = function (id) {
  	    if (id) {
           document.getElementById(id).value =  Number(document.getElementById(id).value)+1;    	  
    	  }    
       $scope.orderItemDetail.qty =  $scope.orderItemDetail.qty+1;     
    }
    $scope.decrement = function (id) {
    	  if (id) {
           document.getElementById(id).value =  Number(document.getElementById(id).value)-1;    	  
    	  } else {
           $scope.orderItemDetail.qty =  $scope.orderItemDetail.qty-1;
        }   
    }


   $ionicModal.fromTemplateUrl('templates/restaurant/item.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.modal = modal;
    });




     $scope.edit = function (index , openModal) {
     	 $scope.cartindex = index;
       var item_id = $scope.cart[index].item.item_id;
       $scope.orderItemDetail = angular.copy($scope.cart[index]);
	    $scope.setItem(item_id);            
     }

     $scope.delete = function (index) {
     	 if(confirm( "Do you want to delete?" )){
         $scope.cart.splice(index , 1);
         localStorage.setItem("cart" , JSON.stringify($scope.cart));
     	 } 
     }


    $scope.setItem = function (item_id) {
    $scope.$broadcast("setItemInits", true);	
	
	 //$scope.selectedItem = sitem;

      var fd = new FormData();
          fd.append("action" , "getItemById" );
          fd.append("id" , item_id );
          

      mobyeat.serverCall( fd ).then(function (result) {
             $scope.selectedItem = result.items[0];
             $scope.cooking_ref = $scope.selectedItem.cooking_ref;
             $scope.curr=result.curr_symbol;
             $scope.decimal=result.deci;
            $scope.separator=result.decseparate;
            if($scope.separator=='yes')
                  $scope.separator=true;
                 else $scope.separator=false; 
                 $scope.modal.show();       
        },function (error) {
        	 
        });   
      
  }
  
    $scope.closeItem = function () {
       $scope.modal.hide();
    }


 
 $scope.subTotal = function () {
 	var values={'sub_total':($scope.total-$scope.voucher_less),'tax':$scope.options.merchant_tax/100,
                'taxable_total' : ($scope.options.merchant_tax/100)*$scope.sub_total,
            'total_w_tax':$scope.sub_total ,'voucher_amount':$scope.less_voucher,'delivery_charge':$scope.options.merchant_delivery_charges
            };
                  localStorage.setItem("delivery_options",JSON.stringify(values));
 	 if(!$scope.currentuser){
 	        $rootScope.redirectpage = "/checkout/"+$stateParams.id+"/"+Date.now();
           $location.url("/login/"+Date.now());    
 	 } else
    $location.url("/checkout/"+$stateParams.id+"/"+Date.now()); 
 }

 $scope.goToMenu = function () {
 	 var menuid = localStorage.getItem('menuid'); 
    $location.url("/menucard/"+$stateParams.id+"/"+menuid+"/"+ Date.now()); 
 }
 //added code
 $scope.getTotal = function ( cart ) {
       var sub_total = 0;
       angular.forEach(cart , function (cartitem) {
             var price = Number(cartitem.price.price);
             if(cartitem.discount){
                  price = price - Number(cartitem.discount); 
             }
             price = price * Number(cartitem.qty);
                 

             var subitem_total = 0;
             for(var subcat in cartitem.sub_item ) {
                  
               var subitems = cartitem.sub_item[subcat];
                 
                   angular.forEach(subitems , function ( subitem ) {
                       subitem_total = subitem_total + ( Number(subitem.qty) * Number(subitem.price) ); 
                   });               
             }
              sub_total = sub_total + price + subitem_total;         
       });
       return sub_total;        
    }

    $scope.getSubTotal = function () {

       var total = Number($scope.total);
       var less_voucher = Number($scope.voucher_less) || 0;
       var delivery_charges = Number($scope.options.merchant_delivery_charges) || 0;

       var total = total - less_voucher + delivery_charges;

       total = total ;
       return total;       
    }

    $scope.getVoucherLess = function () {
             var voucher = localStorage.getItem("voucher");   	
             if (voucher) {
             	   var value = JSON.parse(voucher) , less_voucher = 0;               	
               	if(value['voucher_type']=='fixed amount')
		           	{
		           	  less_voucher=value['amount'];
		   	      }
		         	else if(value['voucher_type']=='percentage')
		         	{		 
		         	        less_voucher=($scope.subtotal)*(value['amount']/100);
		         	}
                   return less_voucher;		         
		         }
             return 0;      
    }


     $scope.usevoucher=function(voucher){
             var fd = new FormData();
             fd.append("action","applyVoucher");
             fd.append("voucher_code",voucher);
             fd.append("merchant_id",$stateParams.id);
 
         mobyeat.serverCall( fd ).then(function(data){
         	if(data){
		         	localStorage.setItem("voucher" , JSON.stringify(data));
		     			$scope.remove=true;
		     		   $scope.voucher_less = $scope.getVoucherLess();
		   
		     		   $scope.sub_total = $scope.getSubTotal();
		      }
           else{
                  alert("enter valid voucher");
                 return;         			
           }
         		
		          } , function(err){
				    		 alert(err);
				    }) 
 
     	
     	}
     	$scope.removeval=function(){
         localStorage.removeItem("voucher");
         $scope.voucher_less = 0;
         $scope.sub_total = $scope.getSubTotal();
		    
         $scope.remove=false;   		
     	}
}).controller("CheckoutCtrl", function ($scope ,custom, checkoutOptions, $rootScope ,$stateParams , $location,  mobyeat , $http , mobyeatUrl ,  $ionicModal ,$ionicLoading ) {
	
	$scope.setInits = function () {

		$scope.email = "";
$rootScope.mer_publish_key = "";
$scope.sel_delivery_type="delivery";
if($scope.sel_delivery_type == "delivery"){
  		   $scope.getAddr();
  	} 
  	 $scope.delivery_date = new Date();
	 	         $scope.options = {};
	            var cart = JSON.parse(localStorage.getItem("cart")) || [];
               $scope.cart = cart; 
                    if(cart.length){
                                  	    var d = new Date();
                                         var curr_time = d.getHours() +":"+ d.getMinutes();
                                  var weekday=new Array("sunday","monday","tuesday","wednesday","thursday",
                                         "friday","saturday")
                                  	$scope.is_merchant_open =  checkoutOptions.is_merchant_open;
                                    $scope.sell_limit= checkoutOptions.sell_limit;
                                             $scope.slottime= checkoutOptions.options.merchant_slottime;
                                  	$scope.options = custom.getOptions( checkoutOptions.options);
                                    $scope.storestarttime= checkoutOptions.stores_open_starts;
                                  	$scope.storesendtime= checkoutOptions.stores_open_ends;
                                  	$scope.curr= checkoutOptions.curr_symbol;    
                                  	$scope.storeopenday= checkoutOptions.stores_open_day;
                                    $scope.delivery_type =  checkoutOptions.delivery_type;
                                  	$scope.name=$scope.delivery_type.delivery;
                                    $rootScope.mer_publish_key = checkoutOptions.publish_key; 
                                  	$scope.slottime= checkoutOptions.merchant_slottime;
                                      $scope.starttime=custom.getSlots($scope.storestarttime[weekday[d.getDay()]],$scope.storesendtime[weekday[d.getDay()]],$scope.options.merchant_delivery_estimation,$scope.options.merchant_slottime,curr_time) ;                     	
                                    
                }              		                   
				          var fd = new FormData();
		                fd.append("action" , "getpaymentOptions");  
		                fd.append("slug" , $stateParams.id);  
		         	    mobyeat.serverCall( fd ).then(function(data){
		         	        var options = custom.getOptions(data.options);
 		         	        if(options.stripe_mode == 'Sandbox')
		                      	 window.Stripe.setPublishableKey(options.sandbox_stripe_pub_key);
		                    else window.Stripe.setPublishableKey(options.live_stripe_pub_key);                 
				    		} , function(err){
						    		 alert(err);
						   }) 
				    
		         }
    $ionicModal.fromTemplateUrl('templates/restaurant/newaddress.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.newaddmodal = modal;
    });
    
    $scope.openAddModal= function (){
        $scope.newaddmodal.show();               
    }  
    $scope.closeAddModal= function (){
        $scope.newaddmodal.hide();               
    }  
    
  $scope.setDatePicker = function () {
    try {   
     var options = {
            date: new Date(),
            mode: 'date'
     };
     if(datePicker){
       datePicker.show(options, function(date){
          $scope.dateChanged(date);   
          $scope.delivery_date = date;  
          $scope.$apply();
       });
     }
    } catch (e) {
    
    }
   }
  
   $scope.newaddress = {};
  	$scope.pyment_type = "";

   
   $scope.options = {};
         	      $scope.resto_addr = checkoutOptions.resto_addr;

                  $scope.credit_cards = checkoutOptions.credit_cards;		            
		            $scope.options = custom.getOptions(checkoutOptions.options);		          

  	$scope.dateChanged = function(date){
      	var predate=new Date(date);
      	
         var  preDate=predate.getFullYear()+'-'+predate.getMonth()+'-'+predate.getDate()
     		var weekday=new Array("sunday","monday","tuesday","wednesday","thursday",
                "friday","saturday");
                var d=new Date();
                var curr_time = d.getHours() +":"+ d.getMinutes();
                 var currDate=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();
                 currDate=currDate.split('-');
                 preDate=preDate.split('-');
                 if(currDate[0]>=preDate[0]){
                 	if( currDate[0] == preDate[0] && currDate[1]>=preDate[1]){

                   if( currDate[0] == preDate[0] &&  currDate[1] == preDate[1] && Number(currDate[2])<Number(preDate[2])){
                          curr_time="0:00";
                      	} 
                      	else if(currDate[2]==preDate[2]) {
                      		   curr_time = d.getHours() +":"+ d.getMinutes();
                      		}
                      		else {
                      			
                      			alert("Select the correct date")
                      		return
                      			}

                 		}else if(currDate[1]<preDate[1]) {
                        alert("check the Month");
                              return;
                      		}else {
                          curr_time="0:00";
                      		}
                 		
                 	}else if(currDate[0]<preDate[0]) {
                              alert("check the year");
                              return;
                      		}else {
                          curr_time="0:00";
                      		}


                $scope.starttime=custom.getSlots($scope.storestarttime[weekday[predate.getDay()]],$scope.storesendtime[weekday[predate.getDay()]],$scope.options.merchant_delivery_estimation,$scope.options.merchant_slottime,curr_time) ;                     	

   }
$scope.getAddr=function()   
{
	var user_address = localStorage.getItem("default_user_address");
		   if(user_address){
		      $scope.user_address = JSON.parse(user_address);   
         }
		   else{   
		      $scope.user_address = custom.getUserAddress($scope.currentuser); 
		   }
		   if(!$scope.user_address) {
		   	$rootScope.redirectpage = "/checkout/"+$stateParams.id;
		      $location.url("/addresslist/"+Date.now());    
		   }  
		}
  $scope.setDeliveryType = function ( type ) {
  	   if(type == $scope.sel_delivery_type)
       $scope.sel_delivery_type = '';
      else $scope.sel_delivery_type = type;  
      
  	if($scope.sel_delivery_type == "delivery"){
  		   $scope.getAddr();
  	} 
  }
  $scope.setNewAddress = function() {
      $scope.user_address = $scope.newaddress;
      $scope.closeAddModal();               
  } 	       
  
  $scope.setDefaultAddress = function () {
  	      $scope.newaddress = {};
         var user_address = localStorage.getItem("default_user_address");
		   if(user_address){
		      $scope.user_address = JSON.parse(user_address);   
         }
		   else{   
		      $scope.user_address = custom.getUserAddress($scope.currentuser); 
		   }
		   if(!$scope.user_address) {
		   	$rootScope.redirectpage = "/checkout/"+$stateParams.id;
		      $location.url("/addresslist/"+Date.now());    
		   }            
  }


$scope.stripeCheckout = function () {
  var buttons = document.getElementsByClassName('stripe-button-el');
  var sbutton = buttons[0];
      sbutton.click();
}

   $ionicModal.fromTemplateUrl('templates/restaurant/stripe.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.modal = modal;
   });

   $scope.close =function(){
       $scope.modal.hide();                
   }
  
		$scope.stripeCallback = function (code, result) {
			if (result.error) {
				window. alert('it failed! error: ' + result.error.message);
				return;
			} else {
				 $scope.stripe_token = result.id;
				 $scope.stripe_email = $scope.email;
       		 $scope.placeOrder( 'stp' , $scope.time , true );
       	}
     }
 $scope.setSemai = function( email ){
     $scope.email = email;
 }	  
  
$scope.placeOrder = function (type ,time,valid ) {
	     
	     if(valid && !($scope.sel_delivery_type != 'pickup' && $scope.sel_delivery_type != 'delivery')){
	        if(!type) {
             alert("select payment type");
             return;         
        } 

               var cart = localStorage.getItem("cart");
               if(cart) cart = JSON.parse(cart);
              
               cart = custom.getCartFormat(cart);
          
               var voucher = localStorage.getItem("voucher");
                if (voucher) voucher = JSON.parse(voucher) || {};


               var delivery_options = JSON.parse(localStorage.getItem("delivery_options")) 
                   delivery_options.trans_type=$scope.sel_delivery_type;
                             delivery_options.delivery_date=$scope.delivery_date;
                             delivery_options.delivery_time=time;


                       var order = { 
                         id : $stateParams.id,
                         client_id : localStorage.getItem("token"),
                         deliveryoptions : delivery_options,
                         voucher : voucher,
                         cart : cart ,
                         payment_type : type
                        };
                        
                        if($scope.sel_delivery_type == "delivery")
                        order.address_id = $scope.user_address.address_id;
                        else if($scope.sel_delivery_type == "pickup")
                        order.address_id = 0;
                        
                        order.address = $scope.user_address;
                               
                        var voucher = localStorage.getItem("voucher"); 
                        if(voucher) order.voucher = JSON.parse(voucher);
      	               if(type == 'stp'){
                            if (!$scope.stripe_token){			                   
			                     $scope.time = time;	  
			                     $scope.modal.show();
			                     return;
			                   }
			                   else{ 
                              var stpdata = {};			              
			                         stpdata.stripetoken = $scope.stripe_token;
			                         stpdata.stripeEmail = $scope.stripe_email;
                                  order.stpdata = stpdata;			                   
			                   }         
			               }
			              
                             $http.post(mobyeatUrl+'/store/placeOrder',order ,{
			                              headers: { 'Content-Type': undefined }
			                           }).success(function( data ) {
			                             $scope.close();
                                      mobyeat.clearCart();
			                             $location.url("/order/"+data.details);
			                     }).error(function(err) { // called asynchronously if an error occurs
                                  alert("error");                                   
                                   alert(err);
			                     });
                         
               }
      
 	       else
	$scope.submitted=true;
	
	}
	
	
	})


.controller("stripeCtrl",function($scope,$stateParams,$rootScope,$location,mobyeat , $stateParams , custom){
	
	$scope.setInits=function(){
                var fd = new FormData();
                fd.append("action" , "getpaymentOptions");  
                fd.append("slug" , $stateParams.slug);  
         	    mobyeat.serverCall( fd ).then(function(data){
         	        var options = custom.getOptions(data.options);	
                    if(options.stripe_mode == 'Sandbox')
                      	 window.Stripe.setPublishableKey(options.sandbox_stripe_pub_key);
                    else window.Stripe.setPublishableKey(options.live_stripe_pub_key);                 
		    		} , function(err){
				    		 alert(err);
				   }) 
				     var fc=new FormData();
 					 fc.append("action" , "getorderDetails");  
                fc.append("order_id" ,$stateParams.orderid); 
                fc.append("client_id",localStorage.getItem('token'))
              mobyeat.serverCall( fc).then(function(data){
                        $scope.orderInfo=data;	
 		    		} , function(err){
				    		 alert(err);
				    })
			 }
			$scope.stripeCallback = function (code, result) {
			if (result.error) {
				window. alert('it failed! error: ' + result.error.message);
				return;
			} else {
				console.log('success! token: ' + result.id);
			}
				 var fd = new FormData();
          fd.append("action" , "stripePayment");
          fd.append('stripetoken',result.id);
          fd.append('stripeEmail',$scope.email);
          fd.append('stripeTokenType',result.type);
          fd.append('amount', $scope.orderInfo.total_w_tax);
          fd.append('orderid',$scope.orderInfo.order_id);  
          fd.append('merchant_id',$scope.orderInfo.merchant_id);  
       	 mobyeat.serverCall(fd).then(function(data){
		      console.log(data+" success");
		       $location.url("/order/"+$stateParams.orderid);

		    } , function(err){
		    		 alert(err);
		    })
	}


	   $scope.removeOrder = function () {
	      var fd = new FormData();
	          fd.append("orderId" , $stateParams.orderid);
	          fd.append("action" ,"removeOrder");
	          mobyeat.serverCall(fd).then(function (data) {
                $location.url("/checkout/"+$stateParams.slug+"/"+Date.now());
        	    },
	          function (err) {
                alert(JSON.stringify(err));	          
	          }); 
	   }
	})
