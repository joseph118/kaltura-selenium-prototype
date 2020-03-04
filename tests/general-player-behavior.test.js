const { Builder } = require('selenium-webdriver');
const { path } = require('chromedriver');
const { expect } = require('chai');

const chrome = require('selenium-webdriver/chrome');
chrome.setDefaultService(new chrome.ServiceBuilder(path).build());

const config = require('../config.json');
const { KalturaPlayer } = require('../core/KalturaPlayer');

let driver;
let kalturaPlayer;

describe('Testing Media Player', () => {
    before(async () => {
        driver = new Builder().forBrowser('chrome').build();
        kalturaPlayer = await KalturaPlayer.build(driver, config.url);
    });
    after(async () => {
        driver.quit();
    });

    it('should auto play', async () => {
        await kalturaPlayer.triggerPlayerSnapshot();
        expect(kalturaPlayer.getSnapshot().isPlaying).to.be.true;
    });
    it('should play with audio', async () => {
        expect(kalturaPlayer.getSnapshot().volume).to.be.greaterThan(0);
    });
});

// describe('autoPlay config', () => {
//     it('should auto play', async () => {
//         await kalturaPlayer.triggerPlayerSnapshot();
//         expect(kalturaPlayer.getSnapshot().isPlaying).to.be.true;
//     });
// });

// describe('autoMute config', () => {
//     it('should play without audio', async () => {
//         await kalturaPlayer.triggerPlayerSnapshot();
//         expect(kalturaPlayer.getSnapshot().volume).to.equal(0);
//         expect(kalturaPlayer.getSnapshot().isMuted).to.be.true;
//     });
// });

// it('should play with audio', async () => {
//     await kalturaPlayer.triggerPlayerSnapshot();
//     expect(kalturaPlayer.getSnapshot().volume).to.be.greaterThan(0);
//     expect(kalturaPlayer.getSnapshot().isMuted).to.be.false;
// }, '');
