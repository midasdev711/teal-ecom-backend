// Kobe 07/16/20 - Deprecation warnining. This should be deprecated becase:
// 1. It only handles errors and not "good" responses. meaningless
// 2. Does not provide value

import HttpStatus from 'http-status-codes';

function ErrorResponse(code, msg) {
  this.msg  = msg;
  this.code = code;

  console.error('An error has been logged. MESSAGE: ' + msg + ', CODE: ' + code);
}

ErrorResponse.prototype.toJSON = function(){
  return {
    title: this.msg || HttpStatus.getStatusText(this.code)
  };
}

module.exports = ErrorResponse;
