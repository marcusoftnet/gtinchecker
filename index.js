const FILENAME = './gtins.csv';
var fs = require('fs');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

var gtins = require('./config.json').gtins;
//var gtins = ['7332494267243']; // ok
//var gtins = ['7332513106065']; // not found
//var gtins = ['7393155001149']; // fail

var fd = fs.openSync(FILENAME, 'w');
fs.appendFileSync(FILENAME, `Row;GTIN;Name;Last updated;GTIN Label;\n`);

for (var i = 0; i < gtins.length; i++) {
	let current = gtins[i];
	getGTINInfo(current, i+1)
		.then(function (data) {
			
			var row = `${data[0]};${current};${data[1]};${data[2]};${data[3]};\n`;
			fs.appendFile(FILENAME, row, function (err) {
				console.log(`Row ${data[0]} written for GTIN: ${current};`)
			});
		});
}

driver.quit();


function getGTINInfo(gtin, rowno) {
	driver.get('http://directory.gs1.se/Gepirsearch/SearchGtin.aspx');
	driver.findElement(By.name('ctl00$body$GtinInput')).sendKeys(gtin);
	driver.findElement(By.name('ctl00$body$SearchButton')).click();

	return waitForElement(driver, By.id("ctl00_body_SearchResult_ResultRepeater_ctl01_NameLabel"), 10000)
		.getText()
		.then(
			function(text){
				var p = [];
				p.push(rowno);
				p.push(getTextForElementById('ctl00_body_SearchResult_ResultRepeater_ctl01_NameLabel'));
				p.push(getTextForElementById('ctl00_body_SearchResult_ResultRepeater_ctl01_LastUpdatedLabel'));
				p.push(getTextForElementById('ctl00_body_SearchResult_ResultRepeater_ctl01_GlnLabel'));
				return Promise.all(p);
			},
			function(err) {
				var p = [rowno, 'Not found', '-', '-'];
				return Promise.all(p);
			}
		);
}

function getTextForElementById(selectorId) {
	return driver
		.findElement(By.id(selectorId))
		.getText()
		.then(
			function (text) { return text; },
			function (err)  { return "Broken at gs1.se"}
		);
}

function waitForElement(driver, locator, timeout) {
  var timeout = timeout || DEFAULT_TIMEOUT;
  return driver.wait(until.elementLocated(locator), timeout);
};
