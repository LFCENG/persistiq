var assert = require('assert');
var it = require('it');

var describe = it.describe;

// Please change apiKey
var API_KEY = 'YOUR_API_KEY';
var OWNER_EMAIL = 'YOUR_USER_EMAIL_IN_PERSISTIQ';


var persistIq = require('../index.js').create(API_KEY);
persistIq.setOwner(OWNER_EMAIL);
setTimeout(function () {
    describe('PersistIq', function(it){
        describe('#listAllLeads()', function(it){
            describe('should get all leads', function(done){
                persistIq.listAllLeads(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log('Reponse: pesistiq.listAllLeads');
                    console.log(res);
                    done();
                });
            });
        });
        
        describe('#createLeads()', function(){
            describe('should create Leads', function(done){
                persistIq.createLeads([{
                    'email' : 'somebody@example.com',
                    'first_name' : 'Somebody',
                    'last_name' : 'Like Me'
                }], function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log('Reponse: persistiq.createLeads');
                    console.log(res);
                    done();
                });
            });
        });
        
        describe('#listLead()', function(){
            describe('should get a specific lead', function(done){
                persistIq.listLead("l_N9Byoy", function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log('Reponse: persistiq.listLeads');
                    console.log(res);
                    done();
                });
            });
        });
        
        describe('#updateLead()', function(){
            describe('should update a specific lead', function(done){
                persistIq.updateLead("l_N9Byoy", { 
                    data: {
                        'email': 'somebody@example.com',
                        'first_name': "ME"
                    }
                }, function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log('Reponse: persistiq.updateLead');
                    console.log(res);
                    done();
                });
            });
        });
    });
}, 1000);
