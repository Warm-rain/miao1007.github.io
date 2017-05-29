/**
 *
 * API大杂汇，md中调用的动态值`[[]]`均来源于此
 */

var stackOverflowId = 4016014;
var GitHubId = 'miao1007';
var blogStartAge = 2014;
var blogFollowers = 2347;

function remove(elem,classSelector) {
    var queryResult = elem[0].querySelector(classSelector);
    var wrappedQueryResult = angular.element(queryResult);
    wrappedQueryResult.remove();
}

var app = angular.module('app', []);
app.controller('Hello', function ($scope, $http) {
    $scope.placeholder = "loading...";
    $scope.failed = "(Fetch Failed)";
    $scope.github = {
        owner: {
            login: $scope.placeholder,
            html_url: $scope.placeholder
        },
        repo: [],
        star: $scope.placeholder
    };
    $scope.blogFollowers = blogFollowers;
    $scope.timeByNow = new Date().getFullYear() - blogStartAge;
    $http.get('https://api.github.com/users/' + GitHubId +'/repos?sort=updated').then(function (response) {
        //如果此处挂了说明API使用次数过多
        var stars = response.data.map(function (repo) {
            return repo.stargazers_count;
        }).filter(function (it) {
            return it.stargazers_count != 0;
        }).reduce(function (it1, it2) {
            return it1 + it2;
        });
        var forks = response.data.map(function (repo) {
            return repo.forks_count;
        }).filter(function (it) {
            return it.forks_count != 0;
        }).reduce(function (it1, it2) {
            return it1 + it2;
        });
        $scope.github = {
            owner: response.data[0].owner,
            repo: response.data || [],
            star: stars || 0,
            fork: forks || 0
        };

    }, function (err) {
        $scope.github = {
            owner: {
                login: $scope.failed,
                html_url: ""
            },
            repo: [],
            star: $scope.failed
        };
    });

    $scope.stackoverflow = {
        display_name: $scope.placeholder,
        link: "",
        reputation: $scope.placeholder
    };
    $http.get('https://api.stackexchange.com/2.2/users/' + stackOverflowId+ '?order=desc&sort=reputation&site=stackoverflow').then(function (response) {
        debugger;
        var userInfo = response.data.items[0];
        $scope.stackoverflow = {
            display_name: userInfo.display_name || $scope.failed,
            link: userInfo.link,
            reputation: userInfo.reputation || 0
        };
    }, function (err) {
        $scope.stackoverflow = {
            display_name: $scope.failed,
            link: "",
            reputation: $scope.failed
        };
    })
});

/**
 * [[]] is for AngularJS
 * {{}} is for Jekyll
 */
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

/**
 * custom tag `society`
 * eg:
 * <contact icon="fa-home" href="{{site.data.resume.blog}}" name="Blog"></contact>
 * icons from http://fortawesome.github.io/Font-Awesome
 */
app.directive('society', function () {
    return {
        template: function (elem, attr) {
            return '<p><i class="fa ' + attr.icon + ' fa-lg fa-fw"></i> <a ng-href="' + attr.href + '">' + attr.name + '</a></p>'
        },
        link: function (scope, elem, attr) {
            scope.popup = "<span class=\'popupqr popup\'><div><img src=\'http://upload.jianshu.io/users/qrcodes/98641/1.pic_hd.jpg?imageMogr/thumbnail/320x320/quality/100\' class=\'img-rounded qrcode\'></div></span>";
            scope.showQR = function (isShow) {
                // alert("isShow" + isShow)
                if (isShow){
                    elem.append(scope.popup);
                } else {
                    remove(elem,'.popupqr');
                }
            };
            scope.frame = '<embed width="200" height="200" class="frame popup" src="http://www.jianshu.com/u/b99b0edd4e77"></embed>';
            scope.showFrame = function (isShow) {
                if (isShow){
                    elem.append(scope.frame);
                } else {
                    remove(elem,'.frame');
                }
            }
        }
    };
});
