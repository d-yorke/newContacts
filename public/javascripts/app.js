angular.module("Contacts", [
    "ngRoute",
    "UserList",
    "Main"
])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "/public/views/list.html",
                controller: "UserListCtrl"
            })
            .when("/user", {
                templateUrl: "/public/views/user-details.html",
                controller: ""
            })
            .when("/create", {
                templateUrl: "/public/views/create.html",
                controller: "MainCtrl"
            })
            .otherwise({
                redirectTo: "/"
            });
})
    .controller("GlobalCtrl", ["$scope", function($scope) {
        $scope.error = "";
        $scope.showError = function(err) {
            $scope.error = err;
            $("#alert-container").slideDown().delay(2000).slideUp();
        }
    }]);