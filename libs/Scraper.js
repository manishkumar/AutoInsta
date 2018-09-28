"use strict";

import Assert from 'assert-js';
import Webdriver from 'selenium-webdriver';

export default class Scraper {
    constructor() {
        this._error = "Derived class should override this medthod";
    }

    open() {
        throw this._error;
    }

    onLoadFinished() {
        throw this._error;
    }

    evaluate() {
        throw this._error;
    }

    getValueFromPage() {
        throw this._error;
    }

    fetchZipData() {
        throw this._error;
    }

    close() {
        throw this._error;
    }

    capture() {
        throw this._error;
    }
}