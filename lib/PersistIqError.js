/**
 * Module dependencies.
 */
var util = require('util');

/**
 * `AbstractError` error.
 *
 * @api private
 */
function AbstractError(message, constr) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, constr || this);
    
    this.name = 'AbstractError';
    this.message = message;
}

/**
 * Inherit from `Error`.
 */
util.inherits(AbstractError, Error);

/**
 * `PersistIqError` error.
 *
 * @api private
 */
function PersistIqError(message) {
    AbstractError.apply(this, arguments);
    this.name = 'PersistIqError';
    this.message = message;
}

/**
 * Inherit from `AbstractError`.
 */
util.inherits(PersistIqError, AbstractError);


/**
 * Expose `PersistIqError`.
 */
module.exports = PersistIqError;
