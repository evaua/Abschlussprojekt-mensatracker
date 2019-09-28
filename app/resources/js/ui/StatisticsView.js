/* eslint-env browser */

import Config from "../utils/Config.js";
import Statistics from "../data/Statistics.js";

function initUI(meals, money, rating) {
    Chart.defaults.global.defaultFontSize = 20;
    Chart.defaults.global.defaultFontFamily = "Helvetica";
    initMealGraph(meals);
    initMoneyGraph(money);
    initRating(rating);
    let okButton = document.getElementById("statistics-ok");
    okButton.addEventListener("click", onOkButtonClicked);
}

function initRating(rating) {
    let starOne = document.getElementById("one"),
        starTwo = document.getElementById("two"),
        starThree = document.getElementById("three"),
        starFour = document.getElementById("four"),
        starFive = document.getElementById("five");
    if (rating > Config.RATING_ONE) {
        starOne.classList.add("checked");
        if (rating > Config.RATING_TWO) {
            starTwo.classList.add("checked");
            if (rating > Config.RATING_THREE) {
                starThree.classList.add("checked");
                if (rating > Config.RATING_FOUR) {
                    starFour.classList.add("checked");
                    if (rating > Config.RATING_FIVE) {
                        starFive.classList.add("checked");
                    }
                }
            }
        }
    }
}

function initMealGraph(meals) {
    var ctx = document.getElementById("number-chart").getContext("2d");
    let mealChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            datasets: [{
                data: meals,
                backgroundColor: ["#5A4EBF", "#5A4EBF", "#5A4EBF", "#5A4EBF", "#5A4EBF", "#5A4EBF", "#5A4EBF", "#5A4EBF", "#5A4EBF", "#5A4EBF", "#5A4EBF", "#5A4EBF"],
                borderWidth: 1,
            }],
        },
        options: {
            legend: {
                display: false,
                labels: {
                    display: false,
                },
            },
            title: {
                display: true,
                text: "Deine Mahlzeiten pro Monat*",
                defaultFontColor: "#000",
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                    },
                }],
            },
        },
    });
    return mealChart;
}

function initMoneyGraph(money) {
    var nextCtx = document.getElementById("money-chart").getContext("2d");
    let moneyChart = new Chart(nextCtx, {
        type: "line",
        data: {
            labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            datasets: [{
                data: money,
                borderColor: "#7464FF",
                fill: true,
            }],
        },
        options: {
            legend: {
                display: false,
                labels: {
                    display: false,
                },
            },
            title: {
                display: true,
                text: "Deine Ausgaben pro Monat*",
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                            return value.toFixed(Config.DECIMALS) + " " + Config.EURO_CHAR;
                        },
                    },
                }],
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.yLabel.toFixed(Config.DECIMALS);
                    },
                },
            },
        },
    });
    return moneyChart;
}

function onOkButtonClicked() {
    let starOne = document.getElementById("one"),
        starTwo = document.getElementById("two"),
        starThree = document.getElementById("three"),
        starFour = document.getElementById("four"),
        starFive = document.getElementById("five"),
        statisticsEl = document.getElementById("statistics-popup");
    statisticsEl.classList.add("hidden");
    starOne.classList.remove("checked");
    starTwo.classList.remove("checked");
    starThree.classList.remove("checked");
    starFour.classList.remove("checked");
    starFive.classList.remove("checked");
}

class StatisticsView {

    constructor(meals, money, ratings) {
        let statistics = new Statistics(meals, money, ratings);
        initUI(statistics.meals, statistics.money, statistics.rating);
    }

}

export default StatisticsView;