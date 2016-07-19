var app = angular.module("Main", []);

app.directive("fileModel", ["$parse", function($parse) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind("change", function() {
                var file = element[0].files[0];
                if (file) {
                    scope.$apply(function() {
                        modelSetter(scope, file);
                        if (file.size > 1000000) {
                            scope.fileValidationMessage = "Аватар слишком большой";
                        } else if (file.type !== "image/jpeg" &&
                            file.type !== "image/gif" &&
                            file.type !== "image/png") {
                            scope.fileValidationMessage = "Неправильный тип файла";
                        } else {
                            scope.fileValidationMessage = "";
                            scope.user.avatarWillDelete = false;
                        }
                        scope.getPreview(document.querySelector("#form-avatar"), scope.user.avatarWillDelete);
                    });
                }
            });
        }
    };
}]);
app.directive("formTmp", function() {
    return {
        restrict: "A",
        templateUrl: "/public/views/form.html",
        controller: "MainCtrl"
    }
});

app.controller("MainCtrl", [
    "$http",
    "$scope",
    "$location",
    "$route",
    "$window",
    function($http, $scope, $location, $route, $window) {
        var tel = $("#phone");
        var preview = $("#preview");
        var avatar = $("#avatar");
        var editUser = $("#edit-user");

        $("#datetimepicker")
            .datetimepicker({
                format: "YYYY-MM-DD",
                locale: "ru",
                maxDate: new Date().setFullYear(new Date().getFullYear() - 10)
            })
            .on("dp.change", function() {
                $scope.user.birthDate = this.value;
            });

        $(document).ready(function() {
            tel.inputmask("+7 (999) 999-99-99", {
                autoUnmask: true,
                onUnMask: function(maskedValue, unmaskedValue) {
                    return "+7" + unmaskedValue;
                }
            });
        });
        tel.inputmask("unmaskedvalue");

        avatar.onerror = function() {
            this.onerror = null;
            this.src = $scope.user.gender
                ? "../public/default_images/" + $scope.user.gender + ".png"
                : "../public/default_images/person.png";
        };

        editUser.on("hidden.bs.modal", function() {
            $route.reload();
        });

        $scope.user = {};
        $scope.user.operation = "create/update";
        $scope.fileValidationMessage = "";

        if ($location.search().id) {
            $http.get("/id" + $location.search().id)
                .success(function(data) {
                    console.log(data);
                    if (jQuery.isEmptyObject(data)) {
                        $("#error-modal")
                            .modal(true)
                            .on("hidden.bs.modal", function() {
                                $window.location.href = "/#/";
                            });
                        return;
                    }
                    $scope.user = data;
                    $scope.user.avatarWillDelete = false;
                    preview.css("display", $scope.user.avatar ? "block" : "none");
                    if($scope.user.phone) {
                        $scope.user.phone =
                            $scope.user.phone.slice(0, 2) + " (" +
                            $scope.user.phone.slice(2, 5) + ") " +
                            $scope.user.phone.slice(5, 8) + "-" +
                            $scope.user.phone.slice(8, 10) + "-" +
                            $scope.user.phone.slice(10, 12);
                    }
                    if ($scope.user.birthDate) {
                        $scope.user.birthDatePretty = new Date(data.birthDate).toLocaleDateString("ru");
                        $scope.user.birthDate = $scope.user.birthDate.replace(/T.*/, "");
                    }
                    if (!$scope.user.avatar) {
                        avatar.attr("src", $scope.user.gender
                            ? "../public/default_images/" + $scope.user.gender + ".png"
                            : "../public/default_images/person.png");
                    }
                });
        }
        $scope.avatarPost = function(user) {
            if ($scope.file || ($scope.user.avatar && $scope.user.avatarWillDelete)) {
                var fd = new FormData;
                fd.append("operation", $scope.user.avatarWillDelete ? "deletePhoto" : "uploadPhoto");
                if ($scope.file && !$scope.user.avatarWillDelete) fd.append("file", $scope.file);
                fd.append("user", user);
                $http.post("/photo", fd,
                    {
                        transformRequest: angular.identity,
                        headers: {"Content-Type": undefined}
                    })
                    .error(function(data) {
                        console.log(data);
                        $scope.showError(data);
                    })
            }
        };
        $scope.createUser = function() {
            $http.post("/new", $scope.user)
                .success(function(newUser) {
                    $location.path("/");
                    $scope.avatarPost(newUser._id);
                })
                .error(function(data) {
                    console.log(data);
                    $scope.showError(data);
                });
        };
        $scope.updateUser = function() {
            $scope.user.operation = "create/update";
            $http.post("/id" + $location.search().id, $scope.user)
                .success(function() {
                    $scope.avatarPost($location.search().id);
                    editUser.modal("hide");
                })
                .error(function(data) {
                    console.log(data);
                    $scope.showError(data);
                });
        };
        $scope.deleteUser = function() {
            $("#delete-confirmation")
                .modal("hide")
                .on("hidden.bs.modal", function() {
                    $http.post("/id" + $location.search().id, {operation: "delete"})
                        .success(function() {
                            $location.path("/");
                            $location.url($location.path());
                        })
                        .error(function(data) {
                            console.log(data);
                            $scope.showError(data);
                        })
                })
        };
        $scope.getPreview = function(input, deleteAvatar) {
            if (input.files && input.files[0] && !deleteAvatar && !$scope.fileValidationMessage) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    preview.attr("src", e.target.result).slideDown();
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                preview.slideUp();
            }
        };
        $scope.applyValidationStyle = function(obj) {
            if (obj) {
                if (obj.$name === "firstName" || obj.$name === "lastName" || obj.$name === "email") {
                    if (obj.$pristine) return "form-group";
                    if (!obj.$pristine && obj.$valid) return "form-group has-success";
                    return "form-group has-error"
                } else {
                    if (obj.$pristine || !obj.$viewValue) return "form-group";
                    return obj.$valid ? "form-group has-success" : "form-group has-error";
                }
            }
        };
        $scope.updateDeleteAvatarState = function() {
            $scope.user.avatarWillDelete = !$scope.user.avatarWillDelete;
            $scope.user.avatarWillDelete ? preview.slideUp() : preview.slideDown();
        };
        $scope.cancelUploadAvatar = function() {
            $scope.file = "";
            document.querySelector("#form-avatar").value = "";
            $scope.user.avatar ? preview.attr("src", $scope.user.avatar).slideDown() : preview.slideUp();
            $scope.fileValidationMessage = "";
        }
    }
]);