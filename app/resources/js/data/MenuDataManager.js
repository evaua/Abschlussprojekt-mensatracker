/* eslint-env browser */

import {
    DownloadJob,
    DownloadWorker
} from "../utils/DownloadWorker.js";
import WeeklyMenu from "./WeeklyMenu.js";
import Config from "../utils/Config.js";

var menuData = new WeeklyMenu();

function getLongWeekday(shortWeekday) {
    let index = Config.WEEKDAYS_SHORT.indexOf(shortWeekday.toLowerCase());
    return Config.WEEKDAYS_LONG[index];
}

function translateMenuEntries(menuData) {
    for (let i = 0; i < menuData.length; i++) {
        let entry = menuData[i];
        entry.day = getLongWeekday(entry.day);
        if (entry.category.startsWith("S")) {
            entry.category = "soup";
        }
        if (entry.category.startsWith("HG")) {
            entry.category = "main";
        }
        if (entry.category.startsWith("B")) {
            entry.category = "sides";
        }
        if (entry.category.startsWith("N")) {
            entry.category = "dessert";
        }
    }
    return menuData;
}

function createMenu(dailyMenus) {
    let newMenu = new WeeklyMenu();
    for (let i = 0; i < dailyMenus.length; i++) {
        let menuForCurrentDay = dailyMenus[i],
            currentShortDay, currentLongDay;
        if (menuForCurrentDay.length === 0) {
            continue;
        }
        currentShortDay = menuForCurrentDay[0].day;
        currentLongDay = getLongWeekday(currentShortDay);
        newMenu[currentLongDay] = translateMenuEntries(menuForCurrentDay);
    }
    return newMenu;
}

function createUpdatePromise() {
    return new Promise(function(resolve, reject) {
        let worker = new DownloadWorker();
        worker.addEventListener("finish", function(results) {
            menuData = createMenu(results.data);
            resolve();
        });
        worker.addEventListener("error", function(error) {
            reject(error.data);
        });
        for (let i = 0; i < Config.WEEKDAYS_SHORT.length; i++) {
            let requestURL = Config.BASE_API_URL.replace("{{day}}", Config
                .WEEKDAYS_SHORT[
                    i]);
            worker.addJob(new DownloadJob(requestURL, "json"));
        }
        worker.start();
    });
}

class MenuDataManger {

    update() {
        let updatePromise = createUpdatePromise();
        return updatePromise;
    }

    getMenuFor(day) {
        if (!Config.WEEKDAYS_LONG.includes(day)) {
            throw new Error(`[DataManger] Unrecognized day string "${day}"`);
        }
        return menuData[day];

    }

}

export default new MenuDataManger();