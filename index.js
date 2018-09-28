"use strict";

import Assert from 'assert-js';
import LoginPage from './LoginPage';
import UserPage from './UserPage';
import phantom from 'phantom';
import UserBehaviour from './UserBehaviour';
import Logger from './Logger';
import fs from 'fs';
import Q from 'q';
import PhantomScraper from './PhantomScraper';

const config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));
const handles = JSON.parse(fs.readFileSync('../handles.json', 'utf8'));

let chain = Q.when();

createPageAndLogin()    
    .then((page) => {
        let handleCurrentIndex = 0;
        for (var i = 0; i < handles.names.length; i++) {
            chain = chain.then(() => {
                let handle = handles.names[handleCurrentIndex];
                handleCurrentIndex++;
                return followUser(page, handle);
            });
        }

        //Add final promise to close the page and exit phantom
        chain = chain.then(() => {
            return new Promise((resolve, reject) => {
                page.quit();
                resolve();
            });
        });
    })
    .catch((error) => {
        console.log(error);
        error.page.quit();
    });

/**
 * createPageAndLogin Method to login
 * @return {Promise}
 */
function createPageAndLogin() {
    return phantom.create()
        .then(instance => {
            let loginPage = new LoginPage(config, new PhantomScraper(instance), new UserBehaviour(config.minWaitTime, config.maxWaitTime), new Logger(config.logFile));
            return loginPage.open(config.userAgent);
        })
        .then((page) => {
            return page.fillUsername(config.username);
        })
        .then((page) => {
            return page.fillPassword(config.password);
        })
        .then((page) => {
            return page.clickSubmit();
        })
        .then((page) => {
            return page.getLoggedInScreenshot();
        })
        .then((page) => {
            Assert.instanceOf(page, UserPage);
            return page
        })
        .catch((error) => {
            console.log(error);
            error.page.quit();
        });
}


function followUser(page, handle) {
    Assert.instanceOf(page, UserPage);
    Assert.string(handle);    

    return page.mandatoryWait()
        .then((page) => {
            console.log(page);
            return page.goToUser(handle);
        })
        .then((page) => {
            return page.follow();
        })
        .catch((error) => {
            console.log(error);
            page.quit();
        });
}