
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
// installs persistiq package
var PersistIq = require('persistiq');

// authenticate persistiq
var persistIq = new PersistIq("your_API_key");

// set leads owner, by fecthing the user from the email. you can also send the specific user id in the createLeads call by addind a parameter 'creator_id': <id>
persistIq.setOwner('luis@popcornmetrics.com');

// Note: you can also require and create an instance in the same step if you would like.
// Example:
// var persistIq = require('persistIq').create("your_API_key");

// To create a leads
// Every method supports promises or callbacks.
var leads = [{
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
var options = {}; //check persistiq documentation for more options

persistIq.createLeads(leads, options, function(err, data) {
    // console.log(data);
});

// To get a lead
// (using a promise)
persistIq.getLead(<lead_id>).then(function(res) {
  // res is **JSON** response
//{
//  "status": "success",
//  "errors": null,
//  "leads": [
//    {
//      "id": "l_1abc",
//      "status": "replied",
//      "data": {
//        "email": "bob@test.co",
//        "first_name": "bob",
//       "company_name": "Test Inc"
//     },
//      "bounced": false,
//      "optedout": false,
//      "sent_count": 5,
//      "replied_count": 1,
//      "last_sent_at": "2014-07-09T15:08:44.000-07:00"
//    }
}, function(err) {
  // err is an error object if there was an error
});

List of supported methods:
```javascript
* persistiq.setOwner
* persistiq.listAllLeads
* persistiq.listLead
* persistiq.createLeads
* persistiq.updateLead
* persistiq.addLeadsToCampaign
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
