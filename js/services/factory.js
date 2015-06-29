// Factories for the app data

angular.module('app.factories', [])
    .factory('Projects', function( $rootScope ) {
        return {

            commonLinks: [
             {
                title: $rootScope.lang_strings.searchRestaurants,
                link: "/search",
                icon: "icon ion-search"
            }
        
/*           , 
           {
                title: "Browse Restaurants",
                link: "/browseresto",
                icon: "icon ion-android-download"
            } 
*/
            ],

            authLinks: [
            {
                title: $rootScope.lang_strings.login,
                link: "/login",
                icon: "icon ion-log-in"
            }, {
                title: $rootScope.lang_strings.signUp,
                link: "/register",
                icon: "icon ion-log-in"
            } 
            ],
            userLinks: [
            {
                title: $rootScope.lang_strings.profile,
                link: "/profile",
                icon: "icon ion-person"
            } ,
            {
               title: $rootScope.lang_strings.myFavourites,
               link : "/favourites",
               icon : "icon ion-ios-heart"         
            } ,
            {
               title: $rootScope.lang_strings.myOrders,
               link : "/orders",
               icon : "icon ion-compose"         
            },
            {
               title: $rootScope.lang_strings.messages,
               link : "/messages",
               icon : "icon ion-email"         
            }
            
          

                     ]

            
        }
    });
