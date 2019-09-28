/* eslint-env browser */
import Config from "../utils/Config.js";
import MenuDataManager from "./MenuDataManager.js";
import ViewController from "../ui/MenuViewController.js";

/*function initMealGetter() {
    this.initUI();
    MenuDataManager.update().then(this.onMenuUpdate);
}*/
function showMenuFor(day) {
    let weekday = day || getCurrentWeekday(),
        menu = MenuDataManager.getMenuFor(weekday);
    ViewController.showMenuForDay(menu, weekday);
}

function onDaySelected(event) {
    showMenuFor(event.data);
}

function onMenuUpdate() {
    let currentWeekday = getCurrentWeekday();
    showMenuFor(currentWeekday);
}

function getCurrentWeekday() {
    let now = new Date(),
        dayNumber = now.getDay();
    // Handle weekends when current day is Saturday (6) or Sunday (5) and no 
    // menu data will be available
    if (dayNumber === 0 || dayNumber === 6) {
        // Select current Friday (5) to display last available day
        // of current week
        dayNumber = 5;
    }
    // Return weekday from array where Monday is on index 0
    return Config.WEEKDAYS_LONG[dayNumber - 1];
}

class MealGetter {

    initMealGetter() {
        this.initUI();
        MenuDataManager.update().then(onMenuUpdate);
    }

    initUI() {
        let daySelector = document.querySelector(".day-selector"),
            menuEl = document.querySelector(".daily-menu");
        ViewController.setDaySelectorElement(daySelector);
        ViewController.setMenuElement(menuEl);
        ViewController.addEventListener("daySelected", onDaySelected);
    }

}

export default MealGetter;