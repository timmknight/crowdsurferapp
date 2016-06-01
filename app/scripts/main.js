'use strict';

/**
 * @ngdoc function
 * @name crowdSurferApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the crowdSurferApp
 */
angular.module('crowdSurferApp')
  .controller('MainCtrl', ['$scope', '$http', '$filter', 'projectDataService', function ($scope, $http, $filter, projectDataService) {
    $scope.filteredData = [];
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.numberOfPages;
    
    $scope.pageSizeOptions = [3,5,10,20];
    
    $scope.setItemsPerPage = function(num) {
      $scope.pageSize = num;
      $scope.currentPage = 1;
    }

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };
    
    projectDataService.get().then(function (response) {

      $scope.data = response.data;
      $scope.totalItems = response.data.length;
      $scope.numberOfPages = _.ceil($scope.data.length / $scope.pageSize);
      
      var calcPercentage = function(project) {
        if(project.goal > 0 && project.raised > 0) {
          var divide = _.divide(project.raised, project.goal);
          var percentage = _.multiply(divide, 100);
          project.percentage = _.round(percentage, 2);
        } else {
          project.percentage = 0;          
        }
      $scope.filteredData.push(project)        
      };
      
      _.map(response.data, calcPercentage);      
    });
  }])

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