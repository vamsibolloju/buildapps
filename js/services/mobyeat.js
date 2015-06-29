
angular.module("mobyeat" , [])
.constant("mobyeatUrl" , "http://192.168.1.110/mobyeat" )
//.constant("mobyeatUrl" , "http://admin.mobyeat.com" )
.filter('prettyFilter' , function ( mobyeat ) {
   return function ( price , decimal , seperation ) {
         return mobyeat.prettyFormat(price , decimal , seperation );  
   }
})
.filter('roundDistance' , function ( mobyeat ) {
   return function ( distance  ) {
         return mobyeat.roundDistance(distance );  
   }
})
 .service("mobyeat" , function ( $http , $q , mobyeatUrl , $timeout , $rootScope ) { 
   var url = mobyeatUrl+"/store/ajax";   
   this.serverCall = function ( fd  , login , msg ) {
   
     var deferred = $q.defer();
             //$timeout(function () {
                  $http.post( url , fd ,{
			                transformRequest: angular.identity,
			               headers: {'Content-Type': undefined}
			         }).success(function( data ){
                  	  		   	 $rootScope.networkerr = false;
			                if(data.code == 2)
                           deferred.reject(data.msg);
                        else
			                    deferred.resolve(data.details); 
			        	}).error(function(err){
			        		   if(!err){
			        		   	 $rootScope.networkerr = true;
			        		   }
			        		   else{
			        		    deferred.reject(err);
			        		   	 $rootScope.networkerr = false;
			        		   
			        		   }
                  });
             //},500)
           return deferred.promise;       
   }

   this.clearCart = function () {
        localStorage.removeItem("cart");
        localStorage.removeItem("delivery_options");
        localStorage.removeItem("voucher");
   }
   
   this.prettyFormat = function ( num , decimal , seperator ) {
        num = Number(num);     
        var price;        
        if(!decimal) decimal = 2;        
        price = num.toFixed( decimal );        
        if(seperator){
            price = price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        }        
        return price; 
   }   
   
   this.roundDistance = function ( num  ) {
         num = Number(num);    
         return num.toFixed(1);
   }
      
  });
