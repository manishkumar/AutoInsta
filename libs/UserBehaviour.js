"use strict";

import Assert from 'assert-js';

export default class UserBehaviour {

    /**
     * constructor
     * @param  {number} minWaitSeconds
     * @param  {number} maxWaitSeconds
     */
    constructor(minWaitSeconds, maxWaitSeconds) {
        Assert.greaterThan(minWaitSeconds, maxWaitSeconds);
        this._minWaitSeconds = minWaitSeconds;
        this._maxWaitSeconds = maxWaitSeconds;
    }

    /**
     * randomTimeInterval
     * @returns {number}
     */
    _randomTimeInterval() {
        return Math.floor(Math.random() * (this._maxWaitSeconds - this._minWaitSeconds + 1) + this._minWaitSeconds) * 1000;
    }

    /**
     * performAction
     * @param  {function} action
     */
    performAction(action) {
        setTimeout(() => {
            action();
        }, this._randomTimeInterval());       
    }

    /**
     * performWait
     * @param {number} waitTime @optional
     * @return  {Promise}
     */
    performWait(waitTime) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {                
                resolve();
            }, waitTime != undefined ? waitTime : this._randomTimeInterval());
        });        
    }
}