"use strict";
let co = require("co");
let request = require("co-request");
let scraper = require("./scrapeSplitter.js");

let url = 'http://gepir.gs1.se/web/sv/Home/SearchNumber?KeyCode=GTIN&KeyValue=7310155802002&Method=Search+Party+By+GTIN&LanguageCode=SV&Re=&_=-1';

let options = {
	url : url,
	proxy : 'http://proxy01.ica.se:8080'
};
 
 
co(function *() {
 	let result = yield request(options); 
	let address = scraper.scrapeAddress(result.body);
    console.log(address);

}).catch(function (err) {
    console.err(err);
});
