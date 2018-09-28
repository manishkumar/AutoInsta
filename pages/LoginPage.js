"use strict";

import Page from './Page';
import UserPage from './UserPage';
import Assert from 'assert-js';

export default class LoginPage extends Page {

    /**
     * @return {String}
     */
    get url() {
        return "accounts/login";
    }


    /**
     * fillUsername
     * @param  {String} username
     * @return {Promise} promise
     */
    fillUsername(username) {
        this._logger.log("Filling username");
        return new Promise((resolve, reject) => {
            return this._userBehaviour.performWait()
                .then(() => {
                    return this.evaluate(function(username) {
                        let input = this.document.querySelector("input[name='username']");
                        let lastValue = input.value;
                        input.value = username;
                        let event = new Event('input', {
                            bubbles: true
                        });
                        // hack React15
                        event.simulated = true;
                        // hack React16 内部定义了descriptor拦截value，此处重置状态
                        let tracker = input._valueTracker;
                        if (tracker) {
                            tracker.setValue(lastValue);
                        }
                        input.dispatchEvent(event);
                    }, username);
                })
                .then(() => {
                    resolve(this);
                });
        });
    }


    /**
     * fillPassword
     * @param  {String} password
     * @return {Promise}  promise
     */
    fillPassword(password) {
        this._logger.log("Filling password");
        return new Promise((resolve, reject) => {
            this._userBehaviour.performAction(() => {
                this.evaluate(function(password) {
                        let input = this.document.querySelector("input[name='password']");
                        let lastValue = input.value;
                        input.value = password;
                        let event = new Event('input', {
                            bubbles: true
                        });
                        // hack React15
                        event.simulated = true;
                        // hack React16 内部定义了descriptor拦截value，此处重置状态
                        let tracker = input._valueTracker;
                        if (tracker) {
                            tracker.setValue(lastValue);
                        }
                        input.dispatchEvent(event);
                    }, password)
                    .then(() => {
                        resolve(this);
                    });
            });
        });
    }



    /**
     * clickSubmit Trigger the sigin submit
     * @return {Promise} submit promise
     */
    clickSubmit() {
        this._logger.log("Clicking submit");
        return new Promise((resolve, reject) => {
            this.evaluate(function() {
                    this.document.querySelector("button").click();
                })
                .then(() => {
                    resolve(this);
                })
        });
    }

    getLoggedInScreenshot() {
        return new Promise((resolve, reject) => {
            this._userBehaviour.performAction(() => {
                this.capture("logged_in");
                resolve(new UserPage(this._config, this._scraper, this._userBehaviour, this._logger));
            });
        });
    }

}