var lang_strings = {
    EN: {
    },
    IT: {
        addMoreItems: "Add More Items",
        addtoorder: " Add to your order",
        addons: "Addons",
        address: "Address",
        allCuisines: "All Cuisines",
        back: "Back",
        cart: "Cart",
        cancel: "Cancel",
        changeAddress: "Change Address",
        changeOrderStatus:"Change Order Status",
        checkout: "Check Out",
        checkoutOptions: "Checkout Options",
        city: "City",
        cityErr:"City Name is required",
        clientAddress: "Client Address",
        close: "Close",
        closed: "CLOSED",

        closedErr: "This restaurant is closed now. Please check the opening times",
        cod: "Cash on Delivery",
        contactName:"Contact Name",
        contactNameErr:"Contact Name is required",
        cookingRef: "Cooking Ref",
        createAccount: "Create your account",
        createReselAccount:"Create Reseller Account",
        cuisine: "Cuisine",
        cuisineErr:"Select cuisine type",
        customerDetails: "Customer Details",
        delivery: "DELIVERY",
        deliveryCharges: "Delivery Charges",
        deliveryDistanceCovered: "Delivery Distance Covered",
        deliveryDate: "Delivery Date",
        deliveryEstimation: "Delivery Estimation",
        deliveryFee: "Delivery Fee",

        deliveryTime: "Delivery Time",
        deliverTo: "Deliver to",
        deliveryType: "Delivery Type",

        distance: "Distance",
        email: "Email",
        emailErr: "Email is required",
        enterCode: "Enter code",
        enterAddress:"Enter the correct Address",
        favRestos: "My favourite restaurants",
        finalTotal: "Final Total",
        firstName: "First Name",
        firstNameErr: "First Name is required",
        foodItem: "Food Item",
        forgotpswd: "Forgot Password",
        freeDelivery: "Free Delivery",
        goToOrder: "Go to Order",
        hasBeen: "has been",
        isRequired: "is Required",
        items: "items",
        km: "km",
        lastName: "Last Name",
        lastNameErr: "Last Name is required",
        list: "List",
        limited:"Limited",
        locationName: "Location Name",
        login: "Login",
        loginInfo:"Login-Information",
        loginAndSignUp: "Login and SignUp",
        loginToYourAccount: "Login to your account",

        logout: "Logout",
        map: "Map",
        membershipLimit:"MemberShip Limit",
        menu: "Menu",
        menuCard: "Menu Card",
        menuErr: "No menu items for this menu",
        merchantName: "Merchant Name",
        message: "Message",
        messages: "Messages",
        minutes: "minutes",
        mobilenumErr: "Mobilenumber is required",
        mustBeLogged: "Must be logged in to order",
        myFavourites: "My Favourites",
        myOrders: "My Orders",
        name: "Name",
        networkErr: "Please check your network and please try again",
        newAddress: "New Address",
        noMenuCard: "No Menu Card",
        noRestos: "No restaurants found",
        notAvaliable: "Not Avaliable",

        open: "OPEN",
        order: "Order",
        orderDate: "Order Date",
        orderDetails: "Order Details",
        orderNow: "ORDER NOW",
        orderNumber: "Order Number",
        orderSent: "Order sent,Thank you!",
        password: "Password",
        payment: "Payment",
        paymentType: "Payment Type",
        payWithStripe: "Pay with stripe",
        phoneNumber: "Phone number",
        pinCode: "Pincode",
        placeOrder: "Place Order",
        pleaseSelect:"Please Select",

        preOrder: "Pre Order",
        price: "Price",
        print: "Print",
        profile: "Profile",

        profileErr: "Please fill the address fields",
        pswdErr: "Password is required",
        quantity: "Quantity",
        register: "Register",
        removeVoucher: " Remove Voucher",
        reselErr:"Reseller email is required",
        resellers:"Resellers",

        reselLogin:"Login to your Reseller account",
        reselName: "Reseller Name",
        reselEmail: "Reseller Email",
        reselProfile: "Reseller profile",
        restoName:"Restaurant Name",
        restoNameErr:"Restaurantname is required",
        restoNumErr:"Restaurant Number is required",
        restoPhone:"Restaurant Phone",
        save: "Save",
        search: "Search",
        searching:"Searching.....",
        searchRestaurants: "Search Restaurants",
        searchRestos: "Search restaurants by",
        selectPackage:"Please Select your package",
        selectCountryErr:"Select Country",
        sellLimit:"Sell Limit",
        sellLimitErr: "This merchant is not currently accepting orders",

        sentOn: "Sent On",
        services:"Services",
        setDefaultAddress: "SetDefault Address",
        setNewAddress: "Set New Address",
        signUp: "Sign Up",
        state: "State",
        status: "Status",

        street: "Street",
        streetErr:"Street is Required",
        stripe: "Stripe",
        stripeConnect:"Stripe Connect",
        stripePubKey: "Stripe Publish Key",
        stripeSecKey: "Stripe Secret Key",
        submit: "Submit",
        subTotal: "Sub total",
        takeAway: "TAKEAWAY",
        timeTable: "Time table",
        title: "Mobyeat",
        total: "Total",
        transType: "TransType",
        unlimited:"Unlimited",
        
        update: "Update",
        updateCartItem: "Update Cart Item",
        updateProfile: "Update Profile",
        userName:"User Name",
        userNameErr:"Username is required",
        useVoucher: "Use Voucher",
        voucher: "Voucher",
        voucherLess: "Voucher Less",
        withFB: "Login with facebook",
        yourMessage: "Your Message",
        yourOrder: "Your Order",
        zipCode: "Zip code",
        zipCodeErr:"Zip Code is Required"
    }
}

angular.module("i18n", [])
    .service("i18n", function($rootScope) {
        this.getlangStrings = function(lang_code) {
            if (!lang_code) lang_code = "IT";
            $rootScope.lang_strings = lang_strings[lang_code];
        }
    });