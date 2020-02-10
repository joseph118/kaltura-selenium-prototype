const { By, until } = require('selenium-webdriver');

/**
 * Generates a query string for selenium script execution.
 * @param action {string} The function name available by the custom element.
 * @returns {}
 */
function generatePlayerQueryString(action) {
    return `return document.querySelector('.mwEmbedPlayer').${action};`;
}

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
        this.webDriver = webDriver;
        this.flashvars = null;
        this.playerData = null;
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

        await kalturaPlayer.generateData();

        return kalturaPlayer;
    }

    getPlayerData() {
        return this.playerData;
    }

    getFlashVars() {
        return this.flashvars;
    }

    async generateData() {
        const [
            flashvars,
            playerData
        ] = await Promise.all([
            this._getFlashVars(),
            this._getPlayerData()
        ]);

        this.flashvars = flashvars;
        this.playerData = playerData;
    }

    async _getFlashVars() {
        return this.webDriver.executeScript(generatePlayerQueryString(`getFlashvars()`));
    }

    async _getPlayerData() {
        const isMutedPromise = this.webDriver.executeScript(generatePlayerQueryString(`getPlayerElementMuted()`));
        const isPlayingPromise = this.webDriver.executeScript(generatePlayerQueryString(`isPlaying()`));
        const isStoppedPromise = this.webDriver.executeScript(generatePlayerQueryString(`isStopped()`));
        const durationPromise = this.webDriver.executeScript(generatePlayerQueryString(`getDuration()`));
        const playerHeightPromise = this.webDriver.executeScript(generatePlayerQueryString(`getHeight()`));
        const playerWidthPromise = this.webDriver.executeScript(generatePlayerQueryString(`getWidth()`));
        const isAudioPromise = this.webDriver.executeScript(generatePlayerQueryString(`isAudio()`));
        const canAutoPlayPromise = this.webDriver.executeScript(generatePlayerQueryString(`canAutoPlay()`));
        const useNativePlayerControlsPromise = this.webDriver.executeScript(generatePlayerQueryString(`useNativePlayerControls()`));
        const isDVRPromise = this.webDriver.executeScript(generatePlayerQueryString(`isDVR()`));
        const isPersistentNativePlayerPromise = this.webDriver.executeScript(generatePlayerQueryString(`isPersistentNativePlayer()`));
        const isOverlayControlsPromise = this.webDriver.executeScript(generatePlayerQueryString(`isOverlayControls()`));
        const isMobileSkinPromise = this.webDriver.executeScript(generatePlayerQueryString(`isMobileSkin()`));
        const playerVolumePromise = this.webDriver.executeScript(generatePlayerQueryString(`getPlayerElementVolume()`));
        const isLivePromise = this.webDriver.executeScript(generatePlayerQueryString(`isLive()`));
        const is360Promise = this.webDriver.executeScript(generatePlayerQueryString(`is360()`));
        const isDrmRequiredPromise = this.webDriver.executeScript(generatePlayerQueryString(`isDrmRequired()`));
        const isLiveOffSynchPromise = this.webDriver.executeScript(generatePlayerQueryString(`isLiveOffSynch()`));
        const currentBitratePromise = this.webDriver.executeScript(generatePlayerQueryString(`getCurrentBitrate()`));

        const [
            isMuted,
            isPlaying,
            isStopped,
            duration,
            playerHeight,
            playerWidth,
            isAudio,
            canAutoPlay,
            useNativePlayerControls,
            isDVR,
            isPersistentNativePlayer,
            isOverlayControls,
            isMobileSkin,
            playerVolume,
            isLive,
            is360,
            isDrmRequired,
            isLiveOffSynch,
            currentBitrate
        ] = await Promise.all([
            isMutedPromise,
            isPlayingPromise,
            isStoppedPromise,
            durationPromise,
            playerHeightPromise,
            playerWidthPromise,
            isAudioPromise,
            canAutoPlayPromise,
            useNativePlayerControlsPromise,
            isDVRPromise,
            isPersistentNativePlayerPromise,
            isOverlayControlsPromise,
            isMobileSkinPromise,
            playerVolumePromise,
            isLivePromise,
            is360Promise,
            isDrmRequiredPromise,
            isLiveOffSynchPromise,
            currentBitratePromise
        ]);

        return {
            dimensions: {
                width: playerWidth,
                height: playerHeight
            },

            volume: playerVolume,

            isAudio,
            isMuted,
            isPlaying,
            isStopped,
            duration,
            canAutoPlay,
            useNativePlayerControls,
            isDVR,
            isPersistentNativePlayer,
            isOverlayControls,
            isMobileSkin,
            isLive,
            is360,
            isDrmRequired,
            isLiveOffSynch,
            currentBitrate
        }
    }
}

// Public
exports.KalturaPlayer = KalturaPlayer;
