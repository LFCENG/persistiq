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

// Define some sane default options
// Right now we only have one endpoint for intercom data
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

/**
 * The main method that makes all the requests to intercom.
 * This method deals with the intercom api and can be used
 * to make requests to the intercom api.
 *
 * @api public
 */
PersistIq.prototype.request = function(method, path, parameters, cb) {
    debug('Requesting [%s] %s with data %o', method, path, parameters);
    
    var url = this.endpoint + path;
    
    var requestOptions = {
        method: method,
        url: url
    };
    
    if (method === 'GET') {
        requestOptions.qs = parameters;
        requestOptions.headers = {
            'Accept': 'application/json'
        };
    } else {
        // requestOptions.form = parameters;
        requestOptions.body = JSON.stringify(parameters);
        requestOptions.headers = {
            'Accept': 'application/json',
            'Content-Type' : 'application/json'
        };
    }
    
    requestOptions.auth = {
        'apiKey' : this.apiKey
    };
    
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
                
                if (parsed && (parsed.error || parsed.errors)) {
                    err = new PersistIqError(data);
                    
                    // Reject the promise
                    return deferred.reject(err);
                }
            } catch (exception) {
                // Reject the promise
                // return deferred.reject(exception);
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


PersistIq.prototype.listAllLeads = function(options, cb) {
    if (_.isFunction(options)) {
        cb = options;
        options = {};
    }
    return this.request('GET', 'leads', options, cb);
};

PersistIq.prototype.listLead = function(userObj, cb) {
    return this.request('GET', 'leads', userObj, cb);
};

PersistIq.prototype.createLeads = function(leads, options, cb) {
    if (_.isFunction(options)) {
        cb = options;
        options = {};
    }
    return this.request('POST', 'leads', leads, options, cb);
};

PersistIq.prototype.updateLead = function(lead, options, cb) {
    if (_.isFunction(options)) {
        cb = options;
        options = {};
    }
    return this.request('PUT', 'leads', lead, options, cb);
};

/**
 * Expose `PersistIq` Library.
 */
module.exports = PersistIq;
