const { By, until } = require('selenium-webdriver');

/**
 * @typedef {Object} PlayerDimension
 * @property width {number}  The player width.
 * @property height {number} The player height.
 */

/**
 * @typedef {Object} PlayerFlashvars
 */

/**
 * @typedef {Object} PlayerSnapshot
 * @property flashvars {PlayerFlashvars} The player flashvars.
 * @property isMuted {boolean} If the player is muted.
 * @property isPlaying {boolean} If the player is playing.
 * @property isStopped {boolean} If the player is stopped.
 * @property duration {number} The duration of the player.
 * @property isAudio {boolean} If the player is playing audio file.
 * @property canAutoPlay {boolean} If the player can auto play.
 * @property useNativePlayerControls {boolean} If the player is using native player controls.
 * @property isDVR {boolean} If the player is DVR.
 * @property isPersistentNativePlayer {boolean} If the player is persistent native player.
 * @property isOverlayControls {boolean} If the controls are overlaying.
 * @property isMobileSkin {boolean} If the player skin is for mobile.
 * @property volume {number} The player volume.
 * @property isLive {boolean} If the player is live.
 * @property is360 {boolean} If the player is 360.
 * @property isDrmRequired {boolean} If DRM is required.
 * @property isLiveOffSynch {boolean} If is live off sync.
 * @property currentBitrate {number} The current bitrate.
 * @property dimensions {PlayerDimension} The player dimensions.
 */


/**
 * Opens the web page, and sets up the driver on the Kaltura iFrame. This also waits until
 *  the player is loaded.
 * @param url {string} Kaltura URL.
 * @param webDriver {!ThenableWebDriver} A WebDriver instance.
 * @returns {Promise<void>}
 */
async function setupDriverOnPlayerFrame(url, webDriver) {
    await webDriver.get(url);

    await webDriver.wait(until.elementLocated(By.css('iframe')));

    const kalturaIframe = await webDriver.findElement(By.css('iframe'));
    await webDriver.switchTo().frame(kalturaIframe);

    // Wait for UI to render
    await webDriver.wait(until.elementLocated(By.css('.mwPlayerContainer')));
    await webDriver.sleep(1000); // Add another second on top
}

class KalturaPlayer {
    /**
     * @param webDriver {!ThenableWebDriver} A WebDriver instance.
     */
    constructor(webDriver) {
        this._webDriver = webDriver;

        /**
         * A snapshot of data coming from mwEmbedPlayer
         * @type {PlayerSnapshot}
         * @private
         */
        this._snapshot = null;
    }

    /**
     * Adjusted the given drive to point to the iFrame context, and wait until the player loads.
     * @param webDriver {!ThenableWebDriver} A WebDriver instance.
     * @param url {string} Kaltura URL.
     * @returns {Promise<KalturaPlayer>}
     */
    static async build(webDriver, url) {
        await setupDriverOnPlayerFrame(url, webDriver);

        const kalturaPlayer = new KalturaPlayer(webDriver);

        await kalturaPlayer.triggerPlayerSnapshot();

        return kalturaPlayer;
    }

    /**
     * Returns the last player snapshot.
     * @returns {PlayerSnapshot}
     */
    getSnapshot() {
        return this._snapshot;
    }

    /**
     * Gets a snapshot of data from mwEmbedPlayer, stores it, and returns the value.
     * @returns {Promise<PlayerSnapshot>}
     */
    async triggerPlayerSnapshot() {
        const snapshot = await this._getDataFromEmbedPlayer();

        this._snapshot = snapshot;

        return snapshot;
    }

    async _getDataFromEmbedPlayer() {
        const className = '.mwEmbedPlayer';
        return this._webDriver.executeScript(`return {
            flashvars: document.querySelector('${className}').getFlashvars(),
            isMuted: document.querySelector('${className}').getPlayerElementMuted(),
            isPlaying: document.querySelector('${className}').isPlaying(),
            isStopped: document.querySelector('${className}').isStopped(),
            duration: document.querySelector('${className}').getDuration(),
            isAudio: document.querySelector('${className}').isAudio(),
            canAutoPlay: document.querySelector('${className}').canAutoPlay(),
            useNativePlayerControls: document.querySelector('${className}').useNativePlayerControls(),
            isDVR: document.querySelector('${className}').isDVR(),
            isPersistentNativePlayer: document.querySelector('${className}').isPersistentNativePlayer(),
            isOverlayControls: document.querySelector('${className}').isOverlayControls(),
            isMobileSkin: document.querySelector('${className}').isMobileSkin(),
            volume: document.querySelector('${className}').getPlayerElementVolume(),
            isLive: document.querySelector('${className}').isLive(),
            is360: document.querySelector('${className}').is360(),
            isDrmRequired: document.querySelector('${className}').isDrmRequired(),
            isLiveOffSynch: document.querySelector('${className}').isLiveOffSynch(),
            currentBitrate: document.querySelector('${className}').getCurrentBitrate(),
            dimensions: {
                width: document.querySelector('${className}').getWidth(),
                height: document.querySelector('${className}').getHeight()            
            }
        };`);
    }
}

// Public
exports.KalturaPlayer = KalturaPlayer;
