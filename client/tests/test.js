// for more information, see https://hackernoon.com/react-app-powered-with-selenium-2562dab0a7bb

/**
 * Dependency Modules
 */
const assert = require("assert").strict;
const webdriver = require("selenium-webdriver");
require("geckodriver");
const describe = require("mocha").describe;
const it = require("mocha").it;
const chrome = require("selenium-webdriver/chrome");
const path = require("chromedriver").path;


const service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);


// Application Server
const serverUri = "http://localhost:3000/";
const appTitle = "React Selenium App";


/**
 * Config for Chrome browser
 * @type {!ThenableWebDriver}
 */
const browser = new webdriver.Builder()
    .usingServer()
    .withCapabilities({ browserName: "chrome" })
    .build();

/**
 * Config for Firefox browser (Comment Chrome config when you intent to test in Firefox)
 * @type {webdriver}
 */
/*
var browser = new webdriver.Builder()
 .usingServer()
 .withCapabilities({ browserName: "firefox" })
 .build();
 */

/**
 * Function to get the title and resolve it it promise.
 * @return {[type]} [description]
 */
async function logTitle() {
    return await new Promise((resolve) => {
        browser.getTitle().then(function (title) {
            resolve(title);
        });
    });
}/**
 * Sample test case
 * To check whether the given value is present in array.
 */
describe("Array", function() {
    describe("#indexOf()", function() {
        it("should return -1 when the value is not present", function() {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe("Home Page", function() {
    /**
     * Test case to load our application and check the title.
     */
    it("Should load the home page and get title", function() {
        return new Promise((resolve, reject) => {
            browser
                .get('https://www.google.com/search?sxsrf=ACYBGNRsgl7YkU6edS44OkrNugZJe-5a0Q%3A1572882354358&ei=skfAXd7OFa6GjLsPl66iKA&q=tatyova+cedh&oq=tatyova+cedh&gs_l=psy-ab.3..35i304i39l2j0i13i30l8.3275755.3278325..3278633...0.0..0.168.1090.11j1......0....1..gws-wiz.......0i131j0i67j0j35i39j0i10j0i10i203j0i203j0i22i30j0i22i10i30.tGkWmAv42-c&ved=0ahUKEwje74Sw89DlAhUuA2MBHReXCAUQ4dUDCAs&uact=5')
                .then(logTitle)
                .then(title => {
                    assert.strictEqual(title, appTitle);
                    resolve();
                })
                .catch(err => reject(err));
        });
    });

    /**
     * Test case to check whether the given element is loaded.
     */
    it("Should check whether the given element is loaded", function() {
        return new Promise((resolve, reject) => {
            browser
                .findElement({ id: "sel-button" })
                .then(elem => resolve())
                .catch(err => reject(err));
        });
    });

    /**
     * End of test cases use.
     * Closing the browser and exit.
     */
    // eslint-disable-next-line no-undef
    after(function(done) {
        // End of test use this.
        browser.quit().then(() => done());
    });
});