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
      $scope.numberOfPages = Math.ceil($scope.data.length / $scope.pageSize);

      for (var i = 0; i < response.data.length; i++) {
        $scope.filteredData.push(response.data[i]);
        // mutate filteredData rather than the response
        $scope.filteredData[i].percentage = Math.round((($scope.filteredData[i].raised / $scope.filteredData[i].goal) * 100));
      }
      
    });
  }])


  .directive("projectSummary", function () {
    return {
      restrict: 'ACEM',
      templateUrl: '../../views/directives/projectSummary.html',
      scope: {
        project: "="
      }
    }
  })
  
  // .directive("projectList", function () {
  //   return {
  //     restrict: 'ACEM',
  //     templateUrl: '../../views/directives/projectList.html'
  //     ,
  //     scope: {
  //       inputData: "="
  //     }
  //   }
  // })

  .service('projectDataService', ['$http', function ($http) {
    var dataUrl = 'https://s3-eu-west-1.amazonaws.com/crowdsurfer-json-dumps/blockchain-projects.json';
    return {
      get: function () {
        return $http.get(dataUrl);
      }
    }
  }
  ]);