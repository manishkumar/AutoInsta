"use strict";

import Assert from 'assert-js';
import Scraper from './Scraper';
import UserBehaviour from './UserBehaviour';
import Logger from './Logger';

export default class Page {
    /**
     * constructor
     * @param  {Object} config
     * @param  {Scraper} scraper
     * @param  {UserBehaviour} userBehaviour
     * @param  {Logger} logger
     */
    constructor(config, scraper, userBehaviour, logger) {
        Assert.object(config);
        Assert.instanceOf(scraper, Scraper);
        Assert.instanceOf(userBehaviour, UserBehaviour);
        Assert.instanceOf(logger, Logger);
        this._config = config;
        this._baseUrl = config.baseUrl;
        this._scraper = scraper;
        this._userBehaviour = userBehaviour;
        this._logger = logger;
    }

    get url() {
        throw "This method needs to be overridden in derived page class";
    }

    /**
     * open the page
     * @param  {userAgent} userAgent
     * @return {Promise} page open promise
     */
    open(userAgent) {
        Assert.string(userAgent);
        console.log("opening")
        return new Promise((resolve, reject) => {
            this._scraper.open(userAgent, this._baseUrl + this.url)
                .then(() => {
                    console.log("opened")
                    resolve(this);
                })
                .catch(error => {
                    reject({
                        "page": this,
                        "error": error
                    });
                });;
        });
    }

    /**
     * evaluate
     * @param  {function} func
     * @param  {Array} params
     * @return {Promise}
     */
    evaluate(func, ...params) {
        return this._scraper.evaluate(func, ...params);
    }

    /**
     * getValueFromPage Method to return a value from page
     * @param  {function} func
     * @param  {Array} params
     * @return {Promise}
     */
    getValueFromPage(func, params) {
        return this._scraper.getValueFromPage(func, params);
    }

    /**
     * onLoadFinished
     * @return {Promise}
     */
    onLoadFinished() {
        return new Promise((resolve, reject) => {
            this._scraper.onLoadFinished(this.waitTill)
                .then(() => {
                    resolve(this);
                })
                .catch(error => {
                    reject({
                        "page": this,
                        "error": error
                    });
                });;
        });
    }

    /**
     * close the page 
     * @return {Promise}    
     */
    close() {
        return new Promise((resolve, reject) => {
            this._scraper.close()
                .then(() => {
                    resolve(this);
                })
                .catch(e => {
                    reject({
                        "page": this,
                        "error": e
                    });
                });
        });
    }

    /**
     * quit
     */
    quit() {
        this._userBehaviour.performAction(() => {
            this._scraper.quit();
        });
    }

    /**
     * capture Save the page screenshot
     * @param  {String} name
     */
    capture(name) {
        this._scraper.capture(this._config.snapshotDirectory + name + ".png");
    }

    /**
     * waitTill
     * @param  {function} asyncTest
     * @return {Promise}
     */
    waitTill(asyncTest) {
        Assert.isFunction(asyncTest);
        return new Promise((resolve, reject) => {
            const maxTryCount = 100;
            let tryCount = 0;

            function wait() {
                asyncTest().then(function(value) {
                    tryCount++;
                    if (value === true) {
                        resolve();
                    } else {
                        if (tryCount >= maxTryCount) {
                            reject("Max try count exceeded");
                        } else {
                            setTimeout(wait, 250);
                        }
                    }
                }).catch(function(e) {
                    reject(e);
                });
            }
            wait();
        });
    }

    /**
     * requestFocus
     * @return {Promise}
     */
    requestFocus() {
        return new Promise((resolve, reject) => {
            this._scraper.switchToFirstWindow()
                .then(() => {
                    resolve(this);
                });
        });
    }

    /**
     * Click given element's position
     * @param  {Position { x: x-coordinate, y: y-coordinate } } position
     */
    clickElement(position) {
        return this._scraper.clickElement(position);
    }

    /**
    * Press a given key
    * @param {Int} key value
    */
    keyPress(value) {
        return this._scraper.keyPress(value);
    }

    /**
    * Click element using text content
    @param {String} tag
    @param {String} content
    */
    clickByText(tag, content) {
        return this.evaluate(function(tag, content) {
            var tags = document.getElementsByTagName(tag);
            
            for (var i = 0; i < tags.length; i++) {
                if (tags[i].textContent == content) {
                    tags[i].click();
                    break;
                }
            }
        }, tag, content);
    }
}