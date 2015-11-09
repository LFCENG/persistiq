
# persistIq
    
An API client in Node.JS for talking to persistIq.com. This package implements the complete API for talking with the persistIq.com API Leads -- list all leads, list a single lead, create leads and update leads 

There complete docs can be found here - http://apidocs.persistiq.com/

## Installation

To install the latest stable release with the command-line tool:
```sh
npm install --save persistIq
```

## Usage

See [docs](http://lfceng.github.io/persistIQ/) for complete API documentation and the [PersistIq API documentation](http://apidocs.persistiq.com/).

```javascript
var PersistIq = require('persistiq');

var persistIq = new PersistIq("your_API_key");

// Note: you can also require and create an instance in the same step if you would like.
// Example:
// var persistIq = require('persistIq').create("your_API_key");

// To create a lead
// Every method supports promises or callbacks.
persistIq.createLeads([{
  "email" : "luis@popcornmetrics.com",
  "first_name" : "Luis",
  "last_name": "Correia",
  "company_name": "PopcornMetrics Limited",
  "industry" : "Technology",
  "title": "Customer Success Manager"
  },{
  "email" : "super_man@krypton.com",
  "first_name" : "Clark",
  "last_name": "Kent",
  "company_name": "Krypton LLC",
  "industry" : "Marvel",
  "title": "Hero Manager"
  }]
});

// To get a lead
// (using a promise)
persistIq.getLead({ "email": "luis@popcornmetrics.com" }).then(function(res) {
  // res is **JSON** response
  // In this case:
  // {
  // "email" : "luis@popcornmetrics.com",
  // "first_name" : "Luis",
  // "last_name": "Correia",
  // "company_name": "PopcornMetrics Limited",
  // "industry" : "Technology",
  // "title": "Customer Success Manager"
  // }
}, function(err) {
  // err is an error object if there was an error
});

List of supported methods:
```javascript
* persistIq.listAllLeads
* persistIq.listLead
* persistIq.createLeads
* persistIq.updateLead
```

See [docs](http://lfceng.github.io/persistiq/) for complete API documentation and the [persistIq API documentation](http://apidocs.persistiq.com). See tests for more examples.

__Note__: Every method returns a promise but accepts callbacks too.

## License

(The MIT License)

Copyright (c) 2015 Luis Correia &lt;luiscorreia.ist@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.