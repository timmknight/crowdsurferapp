'use strict';

/**
 * @ngdoc function
 * @name crowdSurferApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the crowdSurferApp
 */
angular.module('crowdSurferApp')
  .controller('MainCtrl', ['$scope', '$http', 'projectDataService', function ($scope, $http, projectDataService) {
    $scope.filteredData = []
    $scope.currentPage = 0;
    $scope.maxSize = 5;
    $scope.pageSize = 10;
    $scope.pages = [];
    $scope.numberOfPages;
    

    projectDataService.get().then(function (response) {
      
      $scope.data = response.data;
      $scope.totalItems = response.data.length;
      $scope.numberOfPages = Math.ceil($scope.data.length / $scope.pageSize);

      for (var i = 0; i < response.data.length; i++) {
        console.log(response.data[i]);
        $scope.filteredData.push(response.data[i]);        
        // mutate filteredData rather than the response
        $scope.filteredData[i].percentage = Math.round((($scope.filteredData[i].raised / $scope.filteredData[i].goal) * 100));     
      }
      
      for (var n = 0; n <= $scope.numberOfPages - 1; n++) {
        $scope.pages.push(n);
      }
    });
  }])

  .filter('startFrom', function () {
    return function (input, start) {
      start = +start; //parse to int
      return input.slice(start);
    }
  })

  .directive("projectSummary", function () {  
    return {
      restrict: 'ACEM',
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