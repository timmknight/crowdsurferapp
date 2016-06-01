'use strict';

/**
 * @ngdoc function
 * @name crowdSurferApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the crowdSurferApp
 */
angular.module('crowdSurferApp')
  .controller('MainCtrl', ['$scope', '$http', '$filter', 'projectDataService', 'fundingTypeFilter', function ($scope, $http, $filter, projectDataService, fundingTypeFilter) {
    $scope.filteredData = [];
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.numberOfPages;

    $scope.pageSizeOptions = [3, 5, 10, 20];

    $scope.setItemsPerPage = function (num) {
      $scope.pageSize = num;
      $scope.currentPage = 1;
    }

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    projectDataService.get().then(function (response) {

      $scope.filteredData = response.data;
      $scope.totalItems = response.data.length;
      $scope.numberOfPages = _.ceil($scope.filteredData.length / $scope.pageSize);

      var calcPercentage = function (project) {
        if (project.goal > 0 && project.raised > 0) {
          var divide = _.divide(project.raised, project.goal);
          var percentage = _.multiply(divide, 100);
          project.percentage = _.round(percentage, 2);
        } else {
          project.percentage = 0;
        }
      };
      
      _.map($scope.filteredData, calcPercentage);
      
      var unifyFundingType =function(project){
        if (project.funding_type) {
          project.funding_type = fundingTypeFilter(project.funding_type);
        }
      }

      _.map($scope.filteredData, unifyFundingType);
      
    });
  }])

  .filter('fundingType', function () {
    return function (input) {
      if (input === 'R') {
        return 'Reward'
      } else if (input === 'E') {
        return 'Equity'
      }
    };
  })

  .directive("projectList", function () {
    return {
      restrict: 'AE',
      templateUrl: '../../views/directives/projectList.html',
      scope: {
        data: "=",
        pageSize: "=",
        currentPage: "=",
        numberOfPages: "=",
        pageSizeOptions: "=",
        totalItems: "="
      }
    }
  })

  .directive("projectSummary", function () {
    return {
      restrict: 'AE',
      templateUrl: '../../views/directives/projectSummary.html',
      scope: {
        project: "="
      }
    }
  })

  .service('projectDataService', ['$http', function ($http) {
    var dataUrl = 'https://s3-eu-west-1.amazonaws.com/crowdsurfer-json-dumps/blockchain-projects.json';
    return {
      get: function () {
        return $http.get(dataUrl);
      }
    }
  }
  ]);