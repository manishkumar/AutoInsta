"use strict";

import Page from './Page';

export const MANDATORY_WAIT_TIME = 30*1000;
export const FOLLOW_WAIT_TIME = 1*1000;

export default class UserPage extends Page {

    /**
     * @return {String}
     */
    get url() {
        return "/";
    }


    mandatoryWait() {
        return new Promise((resolve, reject) => {
            this._userBehaviour.performWait(MANDATORY_WAIT_TIME)
                    .then(() => {
                        resolve(this);    
                    });
        });
    }

    /**
     * goToUser users page
     * @return {Promise}
     */
    goToUser(handle) {
        this._logger.log("Opening user @" + handle);
        return new Promise((resolve, reject) => {
            this._userBehaviour.performAction(() => {
                this.evaluate(function(handle) {
                    window.location.href = "/" + handle;
                }, handle);

                this.onLoadFinished()
                    .then(() => {
                        this.capture(handle);
                        resolve(this);
                    });                    
            });
        });
    }


    follow() {
        this._logger.log("Following");
        return new Promise((resolve, reject) => {
            this._userBehaviour.performAction(() => {
                this.clickByText("button", "Follow");
                this._userBehaviour.performWait(FOLLOW_WAIT_TIME)
                    .then(() => {
                        resolve(this);    
                    });
            });
        });
    }
}