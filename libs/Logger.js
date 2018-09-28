"use strict";

import fs from 'fs';
import Assert from 'assert-js';

export default class Logger {

    /**
     * constructor
     * @param  {string} logfile
     */
    constructor(logfile) {
        Assert.string(logfile);
        this._logfile = logfile;
    }

    /**
     * log
     * @param {String} content
     */
    log(content) {
        //var datetime = '[' + new Date().toISOString() + ']: ';
        var datetime = '[' + new Date() + ']: ';
        var text = datetime + content + '\n';
        fs.appendFile(this._logfile, text, function(err) {
            if(err) {
                return;
            }            
        });
    }

}