/**
 * utilsSpec.js
 *
 * Created by niko on 1/21/14.
 */

var should = require("should");

var utilsHelper = require('../../app/utils/jsonUtilsHelper');
var utils = require("../../app/utils/jsonUtils");




describe("utils", function(){
  var generateDoneCallback = function(done) {
    return function(err){
      done();
    };
  };
  var shouldThrowHereCallback = generateDoneCallback;

  var shouldntThrowHereCallback = function(err){
    throw "this shouldn't throw here: " + err;
  };
  describe('jsonUtilsHelpers:', function() {
    describe('checkBoolean:', function() {
      it('should not work when value==undefined', function(done) {
        utilsHelper.checkBoolean()
          .done(function(value) {
            throw "Wtf: "+value;
          }, function(err) {
            done();
          });
      });
      it('"true" should return true', function(done) {
        utilsHelper.checkBoolean('true')
          .done(function(value) {
            should(value).ok;
            done();
          }, function(err) {
            throw "Wtf: "+JSON.stringify(err);
          });
      });
    });
  });
  describe("validateJSONBody", function() {
    it("basic should work", function(done) {
      utils.validateJSONBody({"key" : "value" }, undefined, function(validatedParams){
        validatedParams["key"].should.equal("value");
        done();
      });
    });

    it("should call callback if everything is successful", function(done) {
      utils.validateJSONBody({"key" : "value"}, undefined, function (validatedParams){
        done();
      });
    });

    it("should call missingParamCallback when appropriate", function(done) {
      var object = utils.validateJSONBody({"key" : "value" }, {missingkey: {required: true}}, shouldntThrowHereCallback, function(problemParams){
        problemParams.should.have.property("missingkey");
        done();
      });
    });

    it("should work with more data", function(done) {
      var object = utils.validateJSONBody({"username" : "testuser","password" : "testpass"}, undefined, function (validatedParams){
        validatedParams.username.should.equal("testuser");
        validatedParams.password.should.equal("testpass");
        done();
      });
    });
    describe("required attribute:", function() {

    });

    describe("validate types per parameter", function(){
      describe("Boolean: ", function(){
        var requiredParams = {
          booleankey: {
            required: true,
            type: "Boolean"
          }
        };

        it("true works" , function(done) {
          var jsonBody = {"booleankey" : true };
          utils.validateJSONBody(jsonBody, requiredParams, function (validatedParams){
            should(validatedParams).have.property('booleankey', true);
            done();
          }, shouldntThrowHereCallback);
        });
        it("'true' works" , function(done) {
          var jsonBody = {"booleankey" : 'true' };
          utils.validateJSONBody(jsonBody, requiredParams, function (validatedParams){
            should(validatedParams).have.property('booleankey', true);
            done();
          }, shouldntThrowHereCallback);
        });
        it("'false' works" , function(done) {
          var jsonBody = {"booleankey" : "false" };
          utils.validateJSONBody(jsonBody, requiredParams, function (validatedParams){
            should(validatedParams).have.property('booleankey', false);
            done();
          }, shouldntThrowHereCallback);
        });
        it("false works" , function(done) {
          var jsonBody = {"booleankey" : false };
          utils.validateJSONBody(jsonBody, requiredParams, function (validatedParams){
            should(validatedParams).have.property('booleankey', false);
            done();
          }, shouldntThrowHereCallback);
        });
        it("reject a string" , function(done) {
          var jsonBody = {"booleankey" : "badvaluelol" };
          var object = utils.validateJSONBody(jsonBody, requiredParams, generateDoneCallback(done), shouldThrowHereCallback(done));
        });
      });

      describe("Number:" , function() {
        var requiredParams = {
          numberkey: {
            required: true,
            type: "number"
          }
        };

        describe("integers work" , function(done) {
          it('case1', function(done){
            utils.validateJSONBody({"numberkey" : 1 }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('numberkey', 1);
              done();
            }, shouldntThrowHereCallback);
          });

          it('case2', function(done){
            utils.validateJSONBody({"numberkey" : "1000000000000" }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('numberkey', 1000000000000);
              done();
            }, shouldntThrowHereCallback);
          });

          it('case3', function(done){
            utils.validateJSONBody({"numberkey" : -1 }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('numberkey', -1);
              done();
            }, shouldntThrowHereCallback);
          });

          it('case4', function(done){
            utils.validateJSONBody({"numberkey" : 0 }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('numberkey', 0);
              done();
            }, shouldntThrowHereCallback);
          });
        });

        describe("decimals work" , function(done) {
          it('case1', function(done){
            utils.validateJSONBody({"numberkey" : 1.1 }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('numberkey', 1.1);
              done();
            }, shouldntThrowHereCallback);
          });
          it('case2', function(done){
            utils.validateJSONBody({"numberkey" : "1000000000000.1" }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('numberkey', 1000000000000.1);
              done();
            }, shouldntThrowHereCallback);
          });
          it('case3', function(done){
            utils.validateJSONBody({"numberkey" : -1.1 }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('numberkey', -1.1);
              done();
            }, shouldntThrowHereCallback);
          });
          it('case4', function(done){
            utils.validateJSONBody({"numberkey" : 0.0 }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('numberkey', 0.0);
              done();
            }, shouldntThrowHereCallback);
          });

        });
        it("reject a string" , function(done) {
          var jsonBody = {"numberkey" : "badvaluelol" };
          var object = utils.validateJSONBody(jsonBody, requiredParams, shouldntThrowHereCallback, shouldThrowHereCallback(done));
        });
      });
      describe("String:" , function() {
        var requiredParams = {
          stringkey: {
            required: true,
            type: "String"
          }
        };

        describe("anything thats a string works?" , function() {

          it('case4', function(done){
            utils.validateJSONBody({"stringkey" : "apple" }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('stringkey', "apple");
              done();
            }, shouldntThrowHereCallback);
          });
          it('case4', function(done){
            utils.validateJSONBody({"stringkey" : "1000000000000" }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('stringkey', "1000000000000");
              done();
            }, shouldntThrowHereCallback);
          });
          it('case4', function(done){
            utils.validateJSONBody({"stringkey" : "" }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('stringkey', "");
              done();
            }, shouldntThrowHereCallback);
          });
          it('case4', function(done){
            utils.validateJSONBody({"stringkey" : "/oaldoasd?Adadkloakdadad/ aae 23 534534 65 asda dz d" }, requiredParams, function (validatedParams){
              should(validatedParams).have.property('stringkey', "/oaldoasd?Adadkloakdadad/ aae 23 534534 65 asda dz d");
              done();
            }, shouldntThrowHereCallback);
          });
        });
        describe("reject: ", function() {
          it("integers", function(done){
            var jsonBody = {"stringkey" : 12 };
            var object = utils.validateJSONBody(jsonBody, requiredParams, function (validatedParams){
              done();
            }, shouldThrowHereCallback(done));
          });
          it("decimals", function(done){
            var jsonBody = {"stringkey" : 1.3 };
            var object = utils.validateJSONBody(jsonBody, requiredParams, function (validatedParams){
              done();
            }, shouldThrowHereCallback(done));
          });
          it("objects", function(done){
            var jsonBody = {"stringkey" : {"farting": "wow"} };
            var object = utils.validateJSONBody(jsonBody, requiredParams, function (validatedParams){
              done();
            }, shouldThrowHereCallback(done));
          });
          it("arrays", function(done){
            var jsonBody = {"stringkey" : ["nonya"] };
            var object = utils.validateJSONBody(jsonBody, requiredParams, function (validatedParams){
              done();
            }, shouldThrowHereCallback(done));
          });
        });
      });
    });
  });
});