'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('crowdSurferApp'));

  var MainCtrl;
  var scope;
  
  describe('Api call & response', function () {
    
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $http, $httpBackend) {

      scope = $rootScope.$new();
      MainCtrl = $controller('MainCtrl', {
        
        $scope: scope
        
      });

      // Fake a call to the api 
      $httpBackend
        .when('GET', 'https://s3-eu-west-1.amazonaws.com/crowdsurfer-json-dumps/blockchain-projects.json')
        // return an array of objects - data is irrelevant just needs to be an array of objects
        .respond(200, [{ foo: 'bar', goal: 1, raised: 2, barfoo: 'boofar' }, { foo: 'bar', goal: 1, raised: 2, barfoo: 'boofar' }]);

      // Give ctrl the $http & $httpBackend singletons 
      MainCtrl.$http = $http;
      MainCtrl.$httpBackend = $httpBackend;

      // Make the fake call
      MainCtrl.$http.get('https://s3-eu-west-1.amazonaws.com/crowdsurfer-json-dumps/blockchain-projects.json')
        .then(function (response) {
          
          // Only set status & data as these are all I need to test the call
          MainCtrl.status = response.status;
          MainCtrl.data = response.data;
          
        }, function (error) {
          
          MainCtrl.status = error.status;
          MainCtrl.data = error.data;
          
        });

      MainCtrl.$httpBackend.flush();

    }));

    // Status code tests

    it('should make a call to the api & get a status 200', function () {

      expect(MainCtrl.status).toBe(200);

    });


    it('should make a call to the api & not recieve a 404 status', function () {

      expect(MainCtrl.status).not.toBe(404);

    });

    // Data tests 

    it('should make a call to the api & an array of objects returned', function () {

      expect(MainCtrl.data).toEqual([{ foo: 'bar', goal: 1, raised: 2, barfoo: 'boofar' },{ foo: 'bar', goal: 1, raised: 2, barfoo: 'boofar' }]);

    });

    it('should make a call to the api & not recieve an object', function () {

      expect(MainCtrl.data).not.toEqual({});

    });

    it('should make a call to the api & not recieve a different response to the return response', function () {

      expect(MainCtrl.data).not.toEqual({ notFoo: 'notBar' });
      expect(MainCtrl.data).not.toEqual([{ notFoo: 'notBar', blah: 'blah' }]);

    });
  });
});
