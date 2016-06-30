var app = angular.module("UserList", []);

app.controller("UserListCtrl", [
    "$http",
    "$scope",
    function($http, $scope) {

        var search = $("#search");
        var list = $("#list");
        var scroll = $("#scrollbar");
        var pageNumber = 1;
        var delay;
        $scope.users = [];

        $scope.getList = function(page, search) {
            $http.get("/list?page=" + (page ? page : "") + "&search=" + (search ? search : ""))
                .success(function(data) {
                    if (page === 0) {
                        $scope.users = data;
                        if (search === undefined) {
                            list.width(list[0].offsetWidth + (list[0].offsetWidth - list[0].clientWidth) + 5);
                        }
                        if (list.height() >= 600) {
                            $scope.getList(1, search ? search : "");
                            pageNumber++
                        }
                    } else {
                        Array.prototype.push.apply($scope.users, data);
                    }
                })
                .error(function(data) {
                    console.log(data);
                    $scope.showError(data);
                });
        }; $scope.getList(0);

        search.on("input", function() {
            $scope.getList(0, search.val());
            pageNumber = 1;
            list.scrollTop(0);
            scroll.height(list.innerHeight() * (list.innerHeight() / list[0].scrollHeight) + "px");
        });

        list.scroll(function() {
            if (list.scrollTop() + list.innerHeight() >= list[0].scrollHeight) {
                $scope.getList(pageNumber, search.val());
                pageNumber++;
            }
            if (scroll.css('opacity') == 0) {
                scroll.animate({opacity: 1}, 100);
            }
            clearTimeout(delay);
            delay = setTimeout(function() {
                scroll.animate({opacity: 0}, 200);
            }, 1500);
            scroll.height(list.innerHeight() * (list.innerHeight() / list[0].scrollHeight) + "px");
            scroll.css("top", list.scrollTop() + list.scrollTop() / list[0].scrollHeight * list.innerHeight() + "px");
        });

        list.height($(window).height() - 106 - 54 - 20 - 100);
    }
]);