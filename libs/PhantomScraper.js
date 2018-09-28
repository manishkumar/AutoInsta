"use strict";

import Assert from 'assert-js';
import Phantom from 'phantom';
import Scraper from './Scraper';

export default class PhantomScraper extends Scraper {

    /**
     * constructor
     * @param  {Phantom} instance
     */
    constructor(instace) {
        super();
        Assert.instanceOf(instace, Phantom.constructor);
        this._instance = instace;
    }

    /**
     * open the page
     * @param  {userAgent} userAgent
     * @param  {String} url
     * @return {Promise}
     */
    open(userAgent, url) {
        Assert.string(userAgent);
        Assert.string(url);
        return new Promise((resolve, reject) => {
            this._instance.createPage()
                .then(page => {
                    this._page = page;
                    this._page.setting("userAgent", userAgent);
                    this._page.property("viewportSize", {
                        width: 1920,
                        height: 1080
                    });
                    this._page.property("onConsoleMessage", function(msg) {
                        console.log(msg);
                    });
                    return this._page.open(url);
                })
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * onLoadFinished
     * @return {Promise}
     */
    onLoadFinished() {
        return new Promise((resolve, reject) => {
            this._page.on("onLoadFinished", (status) => {
                this._page.off("onLoadFinished");
                if (status === "success") {
                    resolve();
                } else {
                    reject("onLoadFinished fail");
                }
            });
        });
    }

    /**
     * evaluate
     * @param  {function} func
     * @param  variable params
     * @return {Promise}
     */
    evaluate(func, ...params) {
        return this._page.evaluate(func, ...params);
    }

    /**
     * getValueFromPage Method to return a value from page
     * @param  {function} func
     * @param  {Array} params
     * @return {Promise}
     */
    getValueFromPage(func, params) {
        return this.evaluate(func, params);
    }

    /**
     * close
     */
    close() {
        return new Promise((resolve, reject) => {
            this._page.close();
            resolve();
        });
    }

    /**
     * quit
     */
    quit() {
        this._instance.exit();
    }

    /**
     * capture Save the page screenshot
     * @param  {String} name
     */
    capture(name) {
        this._page.render(name);
    }


    /**
     * Click given element's position
     * @param  {Position { x: x-coordinate, y: y-coordinate } } position
     */
    clickElement(position) {
        return this._page.sendEvent('click', [position.x, position.y]);
    }

    /**
    * Press a given key
    * @param {Int} key value
    */
    keyPress(value) {
        //return this._page.sendEvent('keypress', 32, null, null, 0x02000000 | 0x08000000);
        return this._page.sendEvent('keypress', 32); //Space key
    }
}