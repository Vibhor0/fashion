var midway = angular.module('midway', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ui-rangeSlider']);

midway.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.when('/', '/home').otherwise('/home');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });


    $stateProvider

        .state('cart', {
        url: '/cart',
        templateUrl: './views/cart.html',
        controller: 'cartController'
    })

    .state('index', {
        templateUrl: 'index.html',
        controller: 'indexController'
    })

    .state('main_navigation', {
        templateUrl: './views/main_navigation.html',
        controller: 'mainController'
    })

    .state('main_navigation.home', {
        url: '/home',
        templateUrl: './views/home.html',
        controller: 'homeController'
    })

    .state('main_navigation.men', {
        url: '/men',
        templateUrl: './views/men.html',
        controller: 'categoryController'
    })

    .state('main_navigation.women', {
        url: '/women',
        templateUrl: './views/women.html',
        controller: 'categoryController'
    })

    .state('main_navigation.kids', {
        url: '/kids',
        templateUrl: './views/kids.html'
            //controller: 'controllers/homeController'
    })

    .state('main_navigation.brands', {
        url: '/brands',
        templateUrl: './views/brands.html'
            //controller: 'controllers/login'
    })

    .state('main_navigation.order_history', {
        url: '/accounts/orderhistory',
        templateUrl: './views/order_history.html',
        //controller: 'categoryController'
    })

    .state('main_navigation.wishlist', {
        url: '/accounts/wishlist',
        templateUrl: './views/wishlist.html',
        //controller: 'categoryController'
    })

    .state('main_navigation.addressbook', {
        url: '/accounts/addressbook',
        templateUrl: './views/addressbook.html',
        //controller: 'categoryController'
    })

    .state('main_navigation.account_settings', {
        url: '/accounts/settings',
        templateUrl: './views/account_settings.html',
        //controller: 'categoryController'
    })

    .state('main_navigation.product', {
        url: '/:type/:product',
        templateUrl: './views/product.html'
            //controller: 'controllers/productController'
    })

    .state('main_navigation.product_details', {
        url: '/:type/:product/:product_id',
        templateUrl: './views/product_details.html'
            //controller: 'controllers/productDetailsController'
    })

})

.controller('mainController', function ($scope) {

})


.controller('homeController', function ($scope) {
    $scope.brands = ['assets/images/brand1.jpg', 'assets/images/brand2.jpg', 'assets/images/brand3.jpg', 'assets/images/brand4.jpg'];
})



.controller('productController', function ($scope, $stateParams, $http) {

    var cart_button = document.getElementById('addCart_quickview');
    cart_button.addEventListener('click', function (e) {
        var id = this.previousElementSibling.innerHTML;
        var size = document.getElementById('product_size').value
        var quantity = document.getElementById('product_quantity').value
        var url = "http://127.0.0.1:8000/api/add_to_cart/";
        var data = {
            'product_id': id,
            'size': size,
            'quantity': quantity
        }

        $http.post(url, JSON.stringify(data)).
        success(function (response) {
            console.log(response);
        })
    })

    $scope.demo1 = {
        min: 20,
        max: 80
    };

    $scope.product_type = ($stateParams.type);
    $scope.product_category = ($stateParams.product);

    var url_products = "http://127.0.0.1:8000/api/" + $scope.product_type + "/" + $scope.product_category;

    var url_filters = "http://127.0.0.1:8000/api/filters/" + $scope.product_type + "/" + $scope.product_category + "/";

    $scope.product = "";
    $scope.abc = "AFsfasf";

    $http.get(url_filters)
        .then(function (response) {
            $scope.filters = response.data;
            console.log($scope.filters);
        });

    $http.get(url_products)
        .then(function (response) {
            $scope.products = response.data;
        });

    $scope.selection = [];

    $scope.getIndex = function (key, value) {
        var index = $scope.selection.map(function (d) {
            return d['key'] + " " + d['value'];
        }).indexOf(key + " " + value);
        return index;
    }



    $scope.toggleSelection = function toggleSelection(name, key) {
        var idx = $scope.getIndex(key, name);
        if (idx > -1) {
            delete $scope.selection[idx];
            console.log($scope.selection);
            var parameter = JSON.stringify($scope.selection);
            $http.post(url_products + "/", parameter)
                .then(function (response) {
                    $scope.products = response.data;
                })
        } else {
            $scope.selection.push({
                key: key,
                value: name
            });
            console.log($scope.selection);
            var parameter = JSON.stringify($scope.selection);
            $http.post(url_products + "/", parameter)
                .then(function (response) {
                    $scope.products = response.data;
                })
        }
    };

    $scope.loadQuickview = function (product_id) {
        url_quickview = url_products + "/" + product_id;
        $http.get(url_quickview)
            .then(function (response) {
                $scope.quickview_product = response.data;
                console.log($scope.quickview_product);
            });
    }

})

.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
})

.controller('productDetailsController', function ($scope, $stateParams, $http) {

    $scope.product_type = ($stateParams.type);
    $scope.product_category = ($stateParams.product);
    $scope.product_id = ($stateParams.product_id)

    var url = "http://127.0.0.1:8000/api/" + $scope.product_type + "/" + $scope.product_category +
        "/" + $scope.product_id;

    $http.get(url)
        .success(function (response) {
            $scope.product = response;
        });
    
    var cart_button = document.getElementById('details_addCart');
    cart_button.addEventListener('click', function (e) {
        var size = document.getElementById('product_details_size').value
        var quantity = document.getElementById('product_details_quantity').value
        var url = "http://127.0.0.1:8000/api/add_to_cart/";
        var data = {
            'product_id': $scope.product_id,
            'size': size,
            'quantity': quantity
        }

        $http.post(url, JSON.stringify(data)).
        success(function (response) {
            console.log(response);
        })
    })

})

.controller('cartController', function ($scope, $http) {
    $scope.footerWidth = {
        'width': '100%'
    }
    
    var cart_url = "http://127.0.0.1:8000/api/cart";
    var data = {
        'user': 'admin'
    }
    
    $http.get(cart_url)
        .then(function (response) {
            $scope.cart_list = response.data;
            $scope.price = 0;
        console.log(response.data)
            for(var i=0; i<$scope.cart_list.length; i++) {
                $scope.price += $scope.cart_list[i].price
                console.log($scope.cart_list[i].price)
            }
        })
})

.controller('indexController', function ($scope, $stateParams, $http) {
    var jwt_token;
    $http.get('http://127.0.0.1:8000/api/token').success(function (data, status) {
        jwt_token = data.token;
    })

    var cart_url = "http://127.0.0.1:8000/api/cart";
    var data = {
        'user': 'admin'
    }
    
    $http.get(cart_url)
        .then(function (response) {
            $scope.cart_list = response.data;
            $scope.price = 0;
        console.log(response.data)
            for(var i=0; i<$scope.cart_list.length; i++) {
                $scope.price += $scope.cart_list[i].price
                console.log($scope.cart_list[i].price)
            }
        })

    $http.get("http://127.0.0.1:8000/api/categories")
        .then(function (response) {
            //$scope.filters = response.data;
            $scope.men = response.data.Men;
            $scope.women = response.data.Women;
            $scope.boys = response.data.Boys;
            $scope.girls = response.data.Girls;
            $scope.accessories = response.data.Accessories;

            console.log(response.data);
        });

    var hidden_el = document.getElementsByClassName("hidden-content"),
        control_el = document.getElementsByClassName("toggle-content");
    var cart = document.getElementsByClassName("cart_slide")[0];



    // Get the elements
    hidden_el = hidden_el[0];
    control_el = control_el[0];

    var showHide = function () {
        var element_classes = (" " + hidden_el.className + " ").replace(/[\n\t\r]/g, " "),
            remove_class = "slide-down",
            add_class = "slide-up",
            is_showing = element_classes.indexOf(" " + remove_class + " ") > -1;

        if (!is_showing) {
            // Switch variable values
            remove_class = [add_class, add_class = remove_class][0];
        }

        // Remove the previous class (if present) and add the new class
        hidden_el.className = (element_classes.replace(" " + remove_class + " ", "") + " " + add_class + " ").trim();

        return false;
    };

    control_el.onmouseover = showHide;

    control_el.onmouseout = showHide;

    cart.onmouseover = showHide;

    cart.onmouseout = showHide;

    var form = document.getElementById('signup_user');
    form.addEventListener('submit', function (e) {
        console.log("Fsdfsd");
        var data = {
            'email': "this.username.value"
        };
        console.log(data);

        $http.post('http://127.0.0.1:8000/api/signup_user/', JSON.stringify(data))
            .success(function (response) {
                console.log(response);
            })
    })

});