var app = angular.module("UserList", []);

app.controller("UserListCtrl", [
    "$http",
    "$scope",
    function($http, $scope) {

        var search = $("#search");
        $scope.users = [];

        $http.get("/list")
            .success(function(data) {
                $scope.users = data;
            })
            .error(function(data) {
                console.log(data);
                $scope.showError(data);
            });

        search.on("input", function() {
            $http.post("/list", {search: search.val()})
                .success(function(data) {
                    $scope.users = data;
                })
                .error(function(data) {
                    console.log(data);
                    $scope.showError(data);
                });
        });
    }
]);