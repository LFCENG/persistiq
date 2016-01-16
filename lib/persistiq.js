/**
 * Module dependencies.
 */
var request = require('request'),
qs = require('qs'),
_ = require('lodash'),
debug = require('debug')('persistiq'),
// Represents errors thrown by persist, see [PersistIqError.js](./PersistIqError.js.html)
PersistIqError = require('./PersistIqError'),
url = require('url'),
Q = require('q');
// Define some sane default options
var defaultOptions = {
    endpoint: 'https://api.persistiq.com/'
};

/**
 * `PersistIq` constructor.
 *
 * @param {String} apiKey - your api key
 * @param {Object} options - an options object
 * @api public
 */
function PersistIq(apiKey, options) {
    // Overload the contractor
    // Parse out single option objects
    if (_.isObject(apiKey) && !_.isString(apiKey) && apiKey.apiKey) {
        apiKey = apiKey.apiKey;
        options = _.omit(apiKey, 'apiKey');
    }
    
    // Preform some sane validation checks and throw errors
    // We need the appId
    if (!apiKey) {
        throw new PersistIqError('Invalid Api Key: ' + apiKey);
    }
    
    // Copy over the relavant data
    this.apiKey = apiKey;
    
    // Extend the defaults
    this.options = _.defaults(options || {}, PersistIq.defaultOptions);
    
    // Contruct the endpoint with the correct auth from the apiKey
    this.endpoint = this.options.endpoint;
}

/**
 * Expose `defaultOptions` for the intercom library so that this is changable.
 */
PersistIq.defaultOptions = defaultOptions;

/**
 * Helper method to create an instance easily
 *
 * Enables use like this:
 *
 *     `var persistIq = require('persistIq').create("your_API_key");`
 *
 *      or
 *
 *     `var persistIq = require('persistIq').create(options);`
 *
 * @param {String} apiKey - your api key
 * @param {Object} options - an options object
 * @api public
 */
PersistIq.create = function(apiKey, options) {
    var persistIq = new PersistIq(apiKey, options);
    return persistIq;
};

PersistIq.prototype.request = function(method, path, parameters, cb) {
    debug('Requesting [%s] %s with data %o', method, path, parameters);
    
    var url = this.endpoint + path;
    
    var requestOptions = {
        method: method,
        url: url,
        strictSSL: false   
    };
    
    if (method === 'GET') {
        requestOptions.qs = parameters;
        requestOptions.headers = {
            'x-api-key' : this.apiKey
            //'Accept': 'application/json'
        };
    } else {
        // requestOptions.form = parameters;
        requestOptions.body = JSON.stringify(parameters);
        requestOptions.headers = {
            'x-api-key' : this.apiKey
            //'Accept': 'application/json',
            //'Content-Type' : 'application/json'
        };
    }
    // create a promise to return
    var deferred = Q.defer();
    request(requestOptions, function(err, res, data) {
        if (err) {
            // Reject the promise
            return deferred.reject(err);
        }
        // Try to parse the data
        var parsed;
        if (data) {
            debug('Recieved response %s', data);
            
            try {
                parsed = JSON.parse(data);
                if (parsed && (parsed.error || parsed.errors && parsed.errors.length > 0)) {
                    err = new PersistIqError(data);
                    
                    // Reject the promise
                    return deferred.reject(err);
                }
            } catch (exception) {
                // Reject the promise
                return deferred.reject(exception);
            }
        }
        
        // Resolve the promise
        return deferred.resolve(parsed || data);
    });
    
    // Return the promise and promisify any callback provided
    return deferred.promise.nodeify(cb);
};

/**
 * GETs all the pages of an PersistIq resource in parallel.
 * @param {String} path The resource to retrieve (e.g. companies)
 * @param {Object} parameters Query parameters for the root resource
 * @param {Function} cb Optional request callback
 * @returns {Promise} A promise of an array containing all the elements of the
 * requested resource.
 *
 * @api public
 */
// ### Users

PersistIq.prototype.setOwner = function (ownerEmail) {
    if (_.isString(ownerEmail)) {
        this.ownerEmail = ownerEmail;
        var that = this;
        this.request('GET', 'v1/users', {}, function (err, data) {
            if (err) {
                throw new PersistIqError('Error fetching users: ' + err);
                return;
            }
            if (data !== null && data.users && data.users.length > 0) {
                for (var i = 0, user; user = data.users[i]; i++) {
                    if (user.email.toLowerCase() == ownerEmail.toLowerCase()) {
                        that.ownerId = user.id;
                        return;
                    }
                }
                throw new PersistIqError('Invalid ownerEmail: '+ ownerEmail);               
            } else {
                throw new PersistIqError('Invalid ownerEmail: '+ ownerEmail);
            }
        });
    } else {
        throw new PersistIqError('Invalid ownerEmail: ' + ownerEmail);
    }
};

PersistIq.prototype.listAllLeads = function(options, cb) {
    if (_.isFunction(options)) {
        cb = options;
        options = {};
    }
    return this.request('GET', 'v1/leads', options, cb);
};

PersistIq.prototype.listLead = function(lead_id, cb) {
    return this.request('GET', 'v1/leads/' + lead_id, {}, cb);
};

PersistIq.prototype.createLeads = function(leads, options, cb) {
    if (_.isFunction(options)) {
        cb = options;
        options = {};
        var parameters = {
            leads: leads
        };
    } else {
        options.leads = leads;
        var parameters = options;
    }
    if (!parameters.creator_id && this.ownerId) {
        parameters.creator_id = this.ownerId;
    }
    return this.request('POST', 'v1/leads', parameters, cb);
};

PersistIq.prototype.updateLead = function(lead_id, options, cb) {
    if (_.isFunction(options)) {
        cb = options;
        options = {};
    }
    return this.request('PUT', 'v1/leads/' + lead_id, options, cb);
};

PersistIq.prototype.addLeadsToCampaign = function(campaign_id, leads, options, cb) {
    if (_.isFunction(options)) {
        cb = options;
        options = {};
        var parameters = {
            leads: leads
        };
    } else {
        if (!options) options = {};
        options.leads = leads;
        var parameters = options;
    }
    return this.request('POST', 'v1/campaigns/' + campaign_id + '/leads', parameters, cb);
};

/**
 * Expose `PersistIq` Library.
 */
module.exports = PersistIq;
