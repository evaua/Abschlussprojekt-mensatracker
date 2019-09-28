/* eslint-env browser */

import {
    DownloadWorker,
    DownloadJob,
} from "./DownloadWorker.js";

import Config from "./Config.js";

let jsonResult;

function getDate(day) {
    let numWeekday = Config.WEEKDAYS_SHORT_CAP.indexOf(day) + 1,
        today = new Date(),
        realToday = today.getDay(),
        diffWeekday = numWeekday - realToday,
        mealToday = new Date(today.getTime() + diffWeekday * 24 * 60 * 60000),
        dd = String(mealToday.getDate()).padStart(2, '0'),
        mm = String(mealToday.getMonth() + 1).padStart(2, '0'),
        yyyy = mealToday.getFullYear(),
        date = dd + '.' + mm + '.' + yyyy;
    return date;
}

function getJsonValues(data) {
    let menuName = document.getElementById("checkedMeal"),
        resultArray = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j].name === menuName.innerHTML) {
                resultArray.push(data[i][j].cost.students);
                resultArray.push(getDate(data[i][j].day));
                resultArray.push(data[i][j].contentInformation);
                resultArray.push(data[i][j].labels);
            }
        }
    }
    return resultArray;
}

function getMood() {
    let moods = document.getElementsByClassName("fas");
    var currMood = "";
    for (let i = 0; i < moods.length; i++) {
        let mood = moods[i];
        if (mood.classList.contains("checked") || mood.classList.contains("checked-green") || mood.classList.contains("checked-red")) {
            currMood = document.getElementsByClassName("fas")[i].id;
        }
    }
    return currMood;
}


function getStars() {
    let stars = document.getElementsByClassName("fa");
    var rating = 0;
    for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        if (star.classList.contains("checked")) {
            rating += 1;
        }
    }
    return rating;
}

function createUpdatePromise() {
    return new Promise(function(resolve, reject) {
        let worker = new DownloadWorker();
        worker.addEventListener("finish", function(results) {
            resolve(results);
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

class DataGetter {

    constructor() {
        let promise = createUpdatePromise();
        promise.then(function(result) {
            jsonResult = result.data;
        });

    }

    getData() {
        let resultArray = [],
            meal = document.getElementById("checkedMeal"),
            jsonValues = getJsonValues(jsonResult),
            price = jsonValues[0],
            date = jsonValues[1],
            ingredients = jsonValues[2],
            label = jsonValues[3],
            stars = getStars(),
            mood = getMood();
        resultArray.push(meal.innerHTML);
        resultArray.push(price);
        resultArray.push(stars);
        resultArray.push(mood);
        resultArray.push(ingredients);
        resultArray.push(date);
        resultArray.push(label);
        return resultArray;
    }

}

export default DataGetter;