"use strict";

import Assert from 'assert-js';
import Parse from 'csv-parse';
import fs from 'fs';

export default class CSVReader {

    /**
     * constructor
     * @param  {String} filePath
     */
    constructor(filePath) {
        Assert.string(filePath);
        this._filePath = filePath;
    }

    /**
     * read
     * @return {Promise}
     */
    read() {
        return new Promise((resolve, reject) => {
            var records = [];
            var source = fs.createReadStream(this._filePath);
            var parser = Parse({
                delimiter: ',',
                columns: true
            });

            parser.on("readable", () => {
                var record;
                while (record = parser.read()) {
                    records.push(record);
                }
            });
            parser.on("error", (error) => {
                reject(error);
            });
            parser.on("end", () => {
                resolve(records);
            });
            source.pipe(parser);
        });
    }
}