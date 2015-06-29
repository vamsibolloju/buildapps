var getStamp = function(time) {
	if (!time) return 1800; 
   if(time.indexOf(":") == -1)
      time += ":00";

   time = time.split(':')
   time = time[0] * 60 * 60 + time[1] * 60;
   return time;
}


var getTimeValue = function(stamp){
 return mintwodig(Math.floor(stamp/3600)) + ':' + mintwodig(Math.floor((stamp % 3600) / 60 * 100) / 100)
} 


mintwodig = function(n) {
   return n > 9 ? "" + n : "0" + n;
}
function getOption( id , sub_cats  ) {
   var option ="";                             
   angular.forEach(sub_cats , function ( subcat ) {
   	 if(id == subcat.subcat_id)
         option = subcat.multi_option;
   });
   return option;
}

var lat , lan;
function initialize()
{
  var mapProp = {
    center: new google.maps.LatLng(lat , lan),
    zoom:7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"),mapProp);
  
  var marker = new google.maps.Marker({
    position: mapProp.center,
    map: map
});

}

angular.module("custommod", [])
.service("custom" , function ( ) { 
 this.getMenuCard=function( menus , categories , items ) {
  var menucard = [] , menucats = [];
  angular.forEach( categories , function ( category ) { 
          var catitems = [];          
          angular.forEach( items , function ( item ) { 
                var itemcats = eval(item.category) || []; 
                if( itemcats.indexOf(category.cat_id) !== -1 ){
                      catitems.push( item );             
                }         
          });
          category.items = catitems;
  });

  angular.forEach( menus , function ( menu ) {
      menu.isCats = false; 
      var menucats = [];
      angular.forEach( categories , function (category) {
           if(category.menu_id == menu.menu_id){
	           if(category.items.length) 
	           menu.isCats = true;   
	           menucats.push(category); 
           }
      })   
      menu.cats = menucats; 
  });
  
  return menus; 

}
this.getOptions=function( options  ) {
  var opts = {};  
  if(options){
	  var len = options.length;
	  for(var i=0 ; i<len ; i++  ){
	  	  opts[ options[i].option_name ] = options[i].option_value;
	  }
  }
  return opts;  
}
this.getCartFormat=function( cart ){

  var cartList = [] , cartJson = {};
     
  angular.forEach( cart , function ( cartitem ) {

  	  cartJson.item_id = cartitem.item.item_id; 
  	  cartJson.qty = cartitem.qty;
  	  cartJson.cooking_ref = cartitem.cooking_ref;
  	  cartJson.discount = cartitem.discount;
  	  cartJson.price  = cartitem.price.price+"|"+cartitem.price.size;
     cartJson.sub_item = {} ;
     cartJson.addon_qty = {};
     cartJson.order_notes = cartitem.ordernotes || "";

     for (var sub_cat in cartitem.sub_item ) {
          var items = [];  	
          var option = getOption(sub_cat , cartitem.item.addon_item);     
          if(option == "multiple"){
             cartJson.addon_qty[sub_cat] = [];   	    
     	    }
     	    var sub_items = cartitem.sub_item[sub_cat];


     	    angular.forEach(sub_items , function (sub_item) {

     	       items.push(sub_item.sub_item_id+"|"+sub_item.price+"|"+sub_item.sub_item_name);
             if(option == "multiple"){
             cartJson.addon_qty[sub_cat].push(sub_item.qty);
             }     	    
     	    });
       	cartJson.sub_item[sub_cat] = items;
             
      
       	
     }  
     cartList.push(cartJson);
     
         
        
  });
  return cartList;
} 


  this.getUserAddress=function( user ){
   var address = {} , fields = [ "location_name" , "street" , "city" , "state" , "zipcode" , "contact_phone" ] , all = true;
   angular.forEach( fields , function (field) {
      if(user[field]) address[field] = user[field];
      else{
        all = false;
      }  
   }); 
   if (all){
      address['address_id'] = 0;
      return address;  
   }    
   else
     return null;
}



this.getSlots=function ( start_time , end_time , min_lead_time , slot_duration,currentTime ){
	min_lead_time = min_lead_time*60;
	slot_duration = slot_duration*60;
  var slots = [] , start_slot , end_slot;
  start_slot = getStamp(start_time) + min_lead_time;
    
  end_slot = start_slot + slot_duration; 
  while( getStamp(end_time) > end_slot   ){
	       if(getStamp(currentTime ) < start_slot)      
	       slots.push( getTimeValue(start_slot)+"-" +getTimeValue(end_slot));
      	 start_slot = end_slot;  
          end_slot = start_slot + slot_duration;   
  	}
   return slots;
}
  
this.getRatings=function ( ratings ) {
   var rating = { votes : 0 , rating : 0 };
   if (ratings && ratings.length) {
        rating.votes = ratings.length;
        angular.forEach(ratings , function ( r ) {
              rating.rating = rating.rating + Number(r.ratings); 
        });
         rating.rating = rating.rating/rating.votes;   
   }     
    
   return rating;
}


/*

this.loadScript=function ( lati , lang )
{
 lat = lati ; lan = lang;
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM&sensor=false&callback=initialize";
  document.body.appendChild(script);
}*/
this.getMonths=function () {
  var data = [];
  for (var i=1 ; i<=12 ; i++ ) {
     data.push("0"+i); 	
  }
  return data;
}


this. getYears=function() {
  var data = [];
  var year = 2014;
  for (var i=1 ; i<=12 ; i++ ) {
     data.push(2014+i);  	
  }
  return data;
}

 this.checkSubs = function (cart) {
     for ( var i=0 ; i<cart.length ; i++ ) {
          cart[i].isSubs = false;
          for(var key in cart[i].sub_item){
           cart[i].isSubs = true;          
          }
     }
    return cart;
 }

  });