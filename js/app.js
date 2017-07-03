/**
 *
 * API大杂汇，md中调用的动态值`[[]]`均来源于此
 */

var stackOverflowId = 4016014;
var stackAPI = 'https://api.stackexchange.com/2.2/users/' + stackOverflowId+ '?order=desc&sort=reputation&site=stackoverflow';
var GitHubId = 'miao1007';
var gitHubAPI = 'https://api.github.com/users/' + GitHubId +'/repos?sort=updated';
var blogStartAge = 2014;
var blogWords = 139808;
console.log('welcome to view my resume');

function kFormatter(num) {
    return num > 999 ? (num/1000).toFixed(1) + 'K' : num
}

var app = angular.module('app', ['ui.bootstrap']);

/**
 * [[]] is for AngularJS
 * {{}} is for Jekyll
 */
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller('Hello', function ($scope, $http) {
    $scope.placeholder = "loading...";
    $scope.failed = "NET_ERR";
    $scope.github = {
        owner: {
            login: $scope.placeholder,
            html_url: $scope.placeholder
        },
        repo: [],
        star: $scope.placeholder
    };
    $scope.blogWords = kFormatter(blogWords);
    $scope.timeByNow = new Date().getFullYear() - blogStartAge;
    $http.get(gitHubAPI).then(function (response) {
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
    $http.get(stackAPI).then(function (response) {
        var userInfo = response.data.items[0];
        $scope.stackoverflow = {
            display_name: userInfo.display_name || $scope.failed,
            link: userInfo.link,
            reputation: kFormatter(userInfo.reputation || 0)
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
 * for navigator
 */
app.controller('nav', function ($scope, $log) {

    $scope.status = {
        isOpen: false
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
    };
});
