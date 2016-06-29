var app = angular.module("UserList", []);

app.controller("UserListCtrl", [
    "$http",
    "$scope",
    function($http, $scope) {

        var search = $("#search");
        var list = $("#list");
        var pageNumber = 1;
        $scope.users = [];

        $scope.getList = function(page, search) {
            $http.get("/list?page=" + (page ? page : "") + "&search=" + (search ? search : ""))
                .success(function(data) {
                    if (page === 0) {
                        $scope.users = data;
                    } else {
                        Array.prototype.push.apply($scope.users, data);
                    }
                })
                .error(function(data) {
                    console.log(data);
                    $scope.showError(data);
                });
        }; $scope.getList(0, "");

        search.on("input", function() {
            $scope.getList(0, search.val());
            pageNumber = 1;
        });

        list.scroll(function() {
            if (list.scrollTop() + list.innerHeight() >= list[0].scrollHeight) {
                $scope.getList(pageNumber, search.val());
                pageNumber++;
            }
        });
    }
]);