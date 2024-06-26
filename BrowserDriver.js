const chromeWebDriver = require("selenium-webdriver/chrome"),
    proxy = require("selenium-webdriver/proxy"),
    firefox = require("selenium-webdriver/firefox"),
    edgeDriver = require("selenium-webdriver/edge");
require('dotenv').config();

const {
    By,
    until,
    Capabilities,
    Builder,
    Key,
    Browser,
    Actions,
} = require("selenium-webdriver");
var rimraf = require("rimraf");
const chromedriverPath = require("chromedriver").path;
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const chromePaths = require("chrome-paths");

const fs = require("fs");
const readline = require("readline");
const moment = require("moment/moment");
const { default: axios } = require("axios");
const { platform } = require("process");
let watchingTimeLimit = 5 * 60 * 1000;

function convert(file) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(file);
        // Handle stream error (IE: file not found)
        stream.on("error", reject);

        const reader = readline.createInterface({
            input: stream,
        });

        const array = [];

        reader.on("line", (line) => {
            array.push(line);
        });

        reader.on("close", () => resolve(array));
    });
}

class BrowserDriver {
    async removeDrive() {
        if (this.driver == null) {
            return;
        }
        await this.driver.quit();
        // console.log("s", this.userdir);
        if (platform.includes("win")) {
            rimraf.windowsSync(this.userdir);
        } else {
            rimraf.moveRemoveSync(this.userdir);
        }
    }
    constructor({ url, username, password }) {
        try {
            var temp = "/tmp/chrome_profiles/" + getRndInteger(2000, 13000);
            if (platform.includes("win")) {
                temp = "D:\\temp\\" + getRndInteger(2000, 13000);
            }
            const prs = getRndInteger(2000, 13000);
            // console.log("chormepath", { path: chromePaths.chrome, temp });
            var chromeCapabilities = Capabilities.chrome();
            chromeCapabilities.setPageLoadStrategy("normal");
            chromeCapabilities.setAcceptInsecureCerts(true);
            // chromeCapabilities.setProxy({ proxyType: "manual", httpProxy: url, sslProxy: url, socksUsername: username, socksPassword: password })
            var chromeOptions = new chromeWebDriver.Options();
            chromeOptions.merge(chromeCapabilities);
            chromeOptions.detachDriver(true);
            // chromeOptions.setChromeBinaryPath('chromedriver.exe');
            // chromeOptions.setChromeBinaryPath(chromePaths.chrome);
            chromeOptions.excludeSwitches(["enable-automation", "enable-logging"]);
            chromeOptions.set("useAutomationExtension", false);
            chromeOptions.addArguments("start-maximized");
            chromeOptions.addArguments("autodetect=false");
            chromeOptions.addArguments("lang=id");
            chromeOptions.addArguments("log-level=3");
            chromeOptions.addArguments("disable-logging");
            let x = temp;
            if (platform.includes("win")) {
                chromeOptions.addArguments(`profile-directory=${prs}`);
                chromeOptions.addArguments(`user-data-dir=${x}`);
            }
            // const randomOS = [Platform.MAC, Platform.LINUX, Platform.WINDOWS];
            // chromeOptions.setPlatform(randomOS[Math.floor(Math.random() * randomOS.length)])
            // const deviceName = ['iPhone SE', 'iPhone XR', 'iPhone 12 Pro', 'iPhone X',    'PIXEL 5'];
            // var item = deviceName[Math.floor(Math.random() * deviceName.length)];
            // if (profileChrome != "") {
            // let s = profileChrome.split("\\");
            // let profile_name = s[s.length - 1];
            // let profile_dir = profileChrome.replace("\\" + s[s.length - 1], "");
            // chromeOptions.addArguments(`user-data-dir=${profile_dir}`);
            // chromeOptions.addArguments(`profile-directory=${profile_name}`);
            // console.log("chromeOptuions", JSON.stringify(chromeOptions));
            var firefoxOptions = new firefox.Options();
            // firefoxOptions.addArguments("start-maximized");
            var edgeOptions = new edgeDriver.Options();
            edgeOptions.detachDriver(true);
            edgeOptions.excludeSwitches(["enable-automation", "enable-logging"]);
            edgeOptions.set("useAutomationExtension", false);
            edgeOptions.addArguments("start-maximized");
            if (url != "") {
                edgeDriver.setProxy({ proxyType: "manual", httpProxy: url, sslProxy: url, socksUsername: username, socksPassword: password })
            }
            var driver = new Builder();
            var listBrowser = [];
            if (process.env.CHROME == "TRUE") {
                listBrowser.push(Browser.CHROME)
            }
            if (process.env.FIREFOX == "TRUE") {
                listBrowser.push(Browser.FIREFOX)
            }
            if (process.env.EDGE == "TRUE") {
                listBrowser.push(Browser.EDGE)
            }
            const randBrowser = listBrowser[Math.floor(Math.random() * listBrowser.length)];
            driver.forBrowser(randBrowser);
            // driver.setChromeService(new chromeWebDriver.ServiceBuilder('chromedriver.exe'))
            driver.setChromeOptions(chromeOptions);
            driver.setEdgeOptions(edgeOptions);
            driver.setFirefoxOptions(firefoxOptions);
            var urlServer = `${process.env.SELENIUM_HUB_HOST}:${process.env.SELENIUM_HUB_PORT ?? 4444}`;
            driver.usingServer(`${urlServer}`);

            // driver.usingWebDriverProxy(url)
            // driver.setFirefoxService(new firefox.ServiceBuilder('geckodriver.exe'))
            // console.log("dasda", JSON.stringify(driver));
            this.driver = driver.build();
            this.Qualityvideo144 = false;
            this.watchingTime = 0;
            this.userdir = x;
        } catch (error) {
            console.log("constructor", error);
        }
    }
    async myIp() {
        if (this.driver == null) {
            return;
        }
        const prs = await this.driver.getCapabilities();
        console.log(prs)
        await this.driver.get(
            "https://www.whatismybrowser.com/detect/what-is-my-user-agent/"
        );
        await this.driver.sleep(getRndInteger(3000, 5000));
        await this.driver.get("https://whoer.net/");
        await this.driver.sleep(getRndInteger(3000, 5000));
    }
    async SeoSosmed({ url, keyword }) {
        try {
            if (this.driver == null) {
                return;
            }
            await this.driver.get(keyword);
            await this.driver.sleep(getRndInteger(3000, 5000));
            const originalWindow = await this.driver.getWindowHandle();

            var das = await this.driver.findElements(
                By.xpath(`//a[contains(@href,'${url}')]`)
            );
            if (das.length == 0) {
                throw new Error("link not found");
                return;
            }
            console.log("link found");
            await this.driver
                .findElement(By.xpath(`//a[contains(@href,'${url}')]`))
                .click();
            await this.driver.sleep(getRndInteger(3000, 5000));
            var tabs = await this.driver.getAllWindowHandles();
            var tabtujuan = "";
            if (tabs.length == 1) {
                throw new Error("Tab Changes")
            } else {
                tabs.forEach(async (handle) => {
                    if (handle !== originalWindow) {
                        await this.driver.switchTo().window(handle);
                        const getCurrentUrl = await this.driver.getCurrentUrl();
                        console.log("urlSekarang", getCurrentUrl);
                        if (getCurrentUrl.includes(url)) {
                            tabtujuan = handle;
                        } else {
                            await this.driver.close();
                        }
                    }
                });
            }
            if (tabtujuan != "") return;
            await this.driver.switchTo().window(tabtujuan);
            await this.driver.sleep(getRndInteger(13000, 60000));
            console.log("SeoSosmed finish ", { url, keyword });
            return;
        } catch (error) {
            console.log("SeoSosmed err", { url, keyword, error });
            return;
        }
    }
    async SeoWebsite({ url, keyword }) {
        const timestart = moment();
        try {
            if (this.driver == null) {
                throw new Error("driver not found")
            }
            await this.driver.manage().deleteAllCookies();
            // await this.driver.get("chrome://settings/clearBrowserData");
            // await this.driver.sleep(getRndInteger(1000, 3000));
            // let clearBtn = await this.driver.findElements(
            //     By.xpath('//*[@id="clearBrowsingDataConfirm"]')
            // );
            // if (clearBtn.length > 0) {
            //     await this.driver
            //         .findElement(By.xpath('//*[@id="clearBrowsingDataConfirm"]'))
            //         .click();
            // }
            await this.driver.get("https://google.co.id");
            // L2AGLb
            let acceptCokies = await this.driver.findElements(By.id("L2AGLb"));
            if (acceptCokies.length > 0) {
                await this.driver.findElement(By.id("L2AGLb")).click();
            }
            const getTitleGoogle = await this.driver.getTitle();
            if (getTitleGoogle != "Google") {
                throw new Error("URL Bukan Google")
            }
            await this.driver.sleep(getRndInteger(1000, 3000));
            let dataAds = await this.driver.findElements(By.name("q"));
            if (!dataAds) {
                throw new Error("Gagal searching")
            }
            const urlVideo = url;
            await this.driver.findElement(By.name("q")).sendKeys(keyword, Key.ENTER);
            this.driver.actions().move({ x: 200, y: 1500, duration: 1000 });
            await this.driver.sleep(getRndInteger(2000, 3000));
            let getSearchLink = await this.driver.findElements(
                By.xpath(`//a[contains(@href,'${urlVideo}')]`)
            );
            await this.driver.sleep(getRndInteger(10000, 30000));
            if (getSearchLink.length == 0) {
                var searching = true,
                    pagesearch = 1;
                var scrollGOogle = 0,
                    isFound = false;
                for (let index = 0; pagesearch <= 15; index++) {
                    scrollGOogle = scrollGOogle + 5000;
                    await this.driver.executeScript(
                        `window.scrollTo(0,${scrollGOogle});`
                    );
                    await this.driver.sleep(getRndInteger(1000, 2000));
                    // await this.driver.executeScript(`window.scrollTo(0,-5000);`);
                    let getSearchLink1 = await this.driver.findElements(
                        By.xpath(`//a[contains(@href,'${urlVideo}')]`)
                    );
                    if (getSearchLink1.length > 0) {
                        searching = false;
                        await this.driver
                            .findElement(By.xpath(`//a[contains(@href,'${urlVideo}')]`))
                            .click();
                    } else if (scrollGOogle == 50000 && index > 9) {
                        await this.driver.get(url);
                        break;
                    } else {
                        var sd2 = await this.driver.findElements(
                            By.xpath(`//a[contains(@href,'search?q=')]`)
                        );
                        var sd3 = await this.driver.findElements(
                            By.xpath(`//a[contains(@id,'pnnext')]`)
                        );
                        if (sd2.length > 0) {
                            pagesearch = 15
                        } else if (sd3.length > 0) {
                            sd.click();
                        }
                    }
                    await this.driver.sleep(getRndInteger(1000, 2000));
                    pagesearch = pagesearch + 1;
                }
                if (!isFound) {
                    throw new Error("Gagal searching link")
                }
            } else {
                await this.driver.executeScript(`window.scrollTo(0,5000);`);
                await this.driver.sleep(getRndInteger(2000, 3000));
                await this.driver.executeScript(`window.scrollTo(0,-5000);`);
                await this.driver
                    .findElement(By.xpath(`//a[contains(@href,'${urlVideo}')]`))
                    .click();
            }
            await this.driver.sleep(getRndInteger(3000, 5000));
            const getCurrentUrl = await this.driver.getCurrentUrl();
            console.log("getCurrentUrl", getCurrentUrl);
            if (!getCurrentUrl.includes(url)) {
                return;
            }
            await this.driver.sleep(getRndInteger(3000, 9000));
            let scroll = 0;
            var scrollHeight = await this.driver.executeScript(
                "return document.documentElement.scrollHeight"
            );
            var pageup = false
            // console.log('scrollHeight', scrollHeight)
            this.watchingTime = 0;
            var stayMaxTime = getRndInteger(20000, 30000)
            do {
                if (pageup == false) {
                    scroll = scroll + getRndInteger(100, 340);
                } else {
                    scroll = scroll - getRndInteger(100, 340);
                }
                await this.driver.executeScript(`window.scrollTo(0,${scroll});`);
                const timeStay = getRndInteger(2000, 5000);
                this.watchingTime += timeStay
                await this.driver.sleep(timeStay);
                if (scroll >= scrollHeight) {
                    pageup = true
                    await this.driver.sleep(getRndInteger(5000, 15000));
                } else if (pageup == true && scroll >= scrollHeight) {
                    pageup = false
                    await this.driver.sleep(getRndInteger(5000, 15000));
                } else if (pageup == true && scroll <= 0) {
                    pageup = false
                }
                // console.log({ pageup, scroll, watchingTime: this.watchingTime })
            } while (this.watchingTime <= stayMaxTime);
            await this.driver.sleep(getRndInteger(20000, 40000));
            const time = moment.duration(moment().diff(timestart));
            console.log("SEOWebsite finish ", { url, keyword, finish_at: time.asSeconds() });
            return;
        } catch (error) {
            const time = moment().format("YYYY-MM-DD hh:mm:ss");
            console.error("Error SEOWebsite ", { url, keyword, error, time });
        }
    }
    async WebsiteDirect({ url, keyword }) {
        try {
            if (this.driver == null) {
                throw new Error("driver not found")
            }
            await this.driver.manage().deleteAllCookies();
            // await this.driver.get("chrome://settings/clearBrowserData");
            // await this.driver.sleep(getRndInteger(1000, 3000));
            // let clearBtn = await this.driver.findElements(
            //     By.xpath('//*[@id="clearBrowsingDataConfirm"]')
            // );
            // if (clearBtn.length > 0) {
            //     await this.driver
            //         .findElement(By.xpath('//*[@id="clearBrowsingDataConfirm"]'))
            //         .click();
            // }
            const urlVideo = url;
            await this.driver.get(url);

            await this.driver.sleep(getRndInteger(3000, 5000));
            const getCurrentUrl = await this.driver.getCurrentUrl();
            console.log("getCurrentUrl", getCurrentUrl);
            if (!getCurrentUrl.includes(url)) {
                return;
            }
            await this.driver.sleep(getRndInteger(3000, 9000));
            let scroll = 0;
            var scrollHeight = await this.driver.executeScript(
                "return document.documentElement.scrollHeight"
            );
            var pageup = false
            // console.log('scrollHeight', scrollHeight)
            this.watchingTime = 0;
            var stayMaxTime = getRndInteger(120000, 300000)
            do {
                if (pageup == false) {
                    scroll = scroll + getRndInteger(100, 340);
                } else {
                    scroll = scroll - getRndInteger(100, 340);
                }
                await this.driver.executeScript(`window.scrollTo(0,${scroll});`);
                const timeStay = getRndInteger(2000, 5000);
                this.watchingTime += timeStay
                await this.driver.sleep(timeStay);
                if (scroll >= scrollHeight) {
                    pageup = true
                    await this.driver.sleep(getRndInteger(10000, 15000));
                } else if (pageup == true && scroll >= scrollHeight) {
                    pageup = false
                    await this.driver.sleep(getRndInteger(10000, 15000));
                } else if (pageup == true && scroll <= 0) {
                    pageup = false
                }

                console.log({ pageup, scroll, watchingTime: this.watchingTime })
            } while (this.watchingTime <= stayMaxTime);
            // await this.driver.sleep(getRndInteger(20000, 40000));
            const time = moment().format("YYYY-MM-DD hh:mm:ss");
            console.log("SEOWebsite finish ", { url, keyword, finish_at: time });
            return;
        } catch (error) {
            const time = moment().format("YYYY-MM-DD hh:mm:ss");
            console.error("Error SEOWebsite ", { url, keyword, error, time });
        }
    }
    async youtube_parser(url) {
        var regExp =
            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return match && match[7].length == 11 ? match[7] : false;
    }
    async SeoYoutube({ url, keyword }) {
        try {
            if (this.driver == null) {
                throw new Error("Driver not found")
            }
            const videoId = await this.youtube_parser(url);
            if (videoId == false) {
                throw new Error("Video Id Kosong")
            }
            await this.driver.get("https://youtube.com/");
            await this.driver.sleep(getRndInteger(3000, 5000));
            if (keyword == null) return;
            await this.driver.findElement(By.name("search_query")).click();
            await this.driver.sleep(getRndInteger(3000, 5000));
            await this.driver.findElement(By.name("search_query")).sendKeys(keyword);
            await this.driver
                .findElement(By.xpath("//button[@id='search-icon-legacy']/yt-icon"))
                .click();
            await this.driver.sleep(getRndInteger(3000, 5000));
            let searchFound = await this.driver.wait(until.titleContains(keyword));
            if (!searchFound) return;
            let isFound = false;
            let ScrollSearch = 2000;
            for (let i = 0; true; i++) {
                let marchingVideo = await this.driver.findElements(
                    By.xpath(`//a[contains(@href,'${videoId}')]`)
                );
                // console.log("search marchingVideo " + marchingVideo.length);
                if (marchingVideo.length !== 0) {
                    // console.log("search found");
                    isFound = true;
                    break;
                }
                let no_result = await this.driver.findElements(
                    By.xpath(
                        `//*[@id="message"][@class="style-scope ytd-message-renderer"]`
                    )
                );
                // if (no_result) {
                //     break;
                // }
                // console.log("search " + i);
                await this.driver.executeScript(`window.scrollTo(0,${ScrollSearch} );`);
                ScrollSearch += 5000;
                await this.driver.sleep(getRndInteger(2000, 3000));
                if (i >= 10) break;
            }

            if (!isFound) {
                throw new Error("Gagal searching video by id")
            }
            await this.driver
                .findElement(By.xpath(`//a[contains(@href,'${videoId}')]`))
                .click();
            await this.driver.sleep(getRndInteger(4000, 5000));
            const getCurrentUrl = await this.driver.getCurrentUrl();
            // console.log("getCurrentUrl", getCurrentUrl);
            if (!getCurrentUrl.includes(videoId)) {
                return;
            }
            this.watchingTime = 0;
            do {
                await this.checkAdsYoutube();
                const ads = await this.driver.findElements(
                    By.xpath("//div[contains(@class,'ytp-ad-player-overlay')]")
                );
                if (ads.length == 0) {
                    var waiting = getRndInteger(2000, 5000);
                    await this.driver.sleep(waiting);
                    await this.changeQuality();
                    this.watchingTime = this.watchingTime + waiting;
                }
                // console.log(
                //     "watchingTime " + this.watchingTime + " dari " + watchingTimeLimit
                // );
                // console.log("watching " + this.watchingTime >= watchingTimeLimit);
            } while (this.watchingTime <= watchingTimeLimit);
            const time = moment().format("YYYY-MM-DD hh:mm:ss");
            console.log("SEOYoutube finish ", { url, keyword, finish_at: time });
            return;
        } catch (error) {
            const time = moment().format("YYYY-MM-DD hh:mm:ss");
            console.error("Error SEOYoutube ", { url, keyword, error, time });
            return;
        }
    }
    async changeQuality() {
        try {
            if (this.Qualityvideo144 == true) {
                return;
            }
            let videoQuality = await this.driver.findElements(
                By.css(`button.ytp-button.ytp-settings-button`)
            );
            if (videoQuality.length > 0) {
                await this.driver
                    .findElement(By.css(`button.ytp-button.ytp-settings-button`))
                    .click();
                await this.driver.sleep(getRndInteger(1000, 2000));
                await this.driver
                    .findElement(By.xpath(`//div[contains(text(),'Quality')]`))
                    .click();
                await this.driver.sleep(getRndInteger(1000, 2000));
                const haveQuality144 = await this.driver.findElements(
                    By.xpath(`//span[contains(text(),'144p')]`)
                );
                const haveQuality360 = await this.driver.findElements(
                    By.xpath(`//span[contains(text(),'360p')]`)
                );
                if (haveQuality144.length > 0) {
                    await this.driver
                        .findElement(By.xpath(`//span[contains(text(),'144p')]`))
                        .click();
                    await this.driver.sleep(getRndInteger(1000, 2000));
                    this.Qualityvideo144 = true;
                } else if (haveQuality360.length > 0) {
                    await this.driver
                        .findElement(By.xpath(`//span[contains(text(),'360p')]`))
                        .click();
                    await this.driver.sleep(getRndInteger(1000, 2000));
                    this.Qualityvideo144 = true;
                }
            }
            // console.log("quality video ", videoQuality.length);
            return;
        } catch (error) {
            // console.error("changeQuality", error);
            return;
        }
    }
    async checkAdsYoutube() {
        try {
            let msg = "Ads Not Found";
            let dataAds = await this.driver.findElements(
                By.xpath("//div[contains(@class,'ytp-ad-player-overlay')]")
            );
            if (dataAds.length > 0) {
                msg = "Ads Found";
                let btn_skip_ads = By.xpath(
                    '//span[@class="ytp-ad-skip-button-container"]["style=opacity:0.5;"]'
                );
                var das = await this.driver.wait(
                    until.elementLocated(btn_skip_ads),
                    30000,
                    "not found skip ads",
                    1000
                );
                if (das) {
                    let findBtnSkipAds = this.driver.findElement(btn_skip_ads);
                    let readyToSkip = await this.driver.wait(
                        until.elementIsVisible(findBtnSkipAds),
                        30000
                    );
                    if (readyToSkip) {
                        // console.log("ads Click");
                        findBtnSkipAds.click();
                    } else {
                        return;
                    }
                }
            }
            return;
        } catch (error) {
            // console.error("checkAdsYoutube Err", error);
            return;
        }
    }
}
module.exports = { BrowserDriver }