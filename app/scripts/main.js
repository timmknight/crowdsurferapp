'use strict';
/**
 * @ngdoc function
 * @name crowdSurferApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the crowdSurferApp
 */
angular.module('crowdSurferApp').controller('MainCtrl', ['$scope', '$http', '$filter', 'projectDataService',
    function($scope, $http, $filter, projectDataService) {
        // Set up scope
        $scope.filteredData = [];
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.pageSizeOptions = [3, 5, 10, 20];
        // For filtering by§ funding type
        $scope.fundingTypes = {
            equity: true,
            reward: true
        };
        projectDataService.get().then(function(response) {
            $scope.filteredData = response.data;
            var calcPercentage = function(project) {
                // ensure goal & raise are not 0, if they are set to 0 to avoid division issues
                if (project.goal > 0 && project.raised > 0) {
                    var divide = _.divide(project.raised, project.goal);
                    var percentage = _.multiply(divide, 100);
                    project.percentage = _.round(percentage, 2);
                } else {
                    project.percentage = 0;
                }
            };
            _.map($scope.filteredData, calcPercentage);
        });
    }
]).filter('readableFundingType', function() {
    return function(projects) {
        var readableFundingTypeData = [];
        _.map(projects, function(project) {
            if (project.funding_type === 'R') {
                project.funding_type = 'Reward';
            } else if (project.funding_type === 'E') {
                project.funding_type = 'Equity';
            }
            readableFundingTypeData.push(project);
        });
        return readableFundingTypeData;
    };
}).filter('test', function() {
    return function(projects, fundingType) {
        var fundingTypeFilteredData = [];
        _.map(projects, function(project) {
            // Not clean - there is probably a much cleaner way to do this 
            if (fundingType.equity === true && fundingType.reward === true) {
                fundingTypeFilteredData.push(project);
            } else if (fundingType.equity === true && fundingType.reward === false) {
                if (project.funding_type === 'Equity') {
                    fundingTypeFilteredData.push(project);
                }
            } else if (fundingType.equity === false && fundingType.reward === true) {
                if (project.funding_type === 'Reward') {
                    fundingTypeFilteredData.push(project);
                }
            }
        });
        return fundingTypeFilteredData;
    };
}).directive("projectList", function() {
    return {
        restrict: 'AE',
        templateUrl: '../../views/directives/projectList.html',
        scope: {
            data: "=",
            pageSize: "=",
            currentPage: "=",
            pageSizeOptions: "=",
            fundingTypes: "="
        }
    };
}).directive("projectSummary", function() {
    return {
        restrict: 'AE',
        templateUrl: '../../views/directives/projectSummary.html',
        scope: {
            project: "="
        }
    };
}).service('projectDataService', ['$http',
    function($http) {
        var dataUrl = 'https://s3-eu-west-1.amazonaws.com/crowdsurfer-json-dumps/blockchain-projects.json';
        return {
            get: function() {
                return $http.get(dataUrl);
            }
        };
    }
]);