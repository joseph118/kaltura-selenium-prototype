const { Builder } = require('selenium-webdriver');
const { path } = require('chromedriver');
const { expect } = require('chai');


const chrome = require('selenium-webdriver/chrome');
const config = require('../config.json');
const { KalturaPlayer } = require('../core/KalturaPlayer');

describe('Simple kaltura test using core files', () => {
    chrome.setDefaultService(new chrome.ServiceBuilder(path).build());
    const driver = new Builder().forBrowser('chrome').build();

    let kalturaPlayer;

    before(async () => {
        kalturaPlayer = await KalturaPlayer.build(driver, config.url);
    });

    beforeEach(async () => {
        // Not required but getting fresh data from the player with every test.
        await kalturaPlayer.triggerPlayerSnapshot();
    });

    it('should auto play', async () => {
        expect(kalturaPlayer.getSnapshot().isPlaying).to.be.true;
    });

    it('should play with audio', async () => {
        expect(kalturaPlayer.getSnapshot().volume).to.be.greaterThan(0);
    });

    // afterEach();
    after(async () => driver.quit());
});
