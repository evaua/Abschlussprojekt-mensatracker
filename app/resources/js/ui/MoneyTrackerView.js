/* eslint-env browser */

import Config from "../utils/Config.js";

var inputField, okButton, chosenBudget, spentMoney;
let myStorage;


function initMoneyTracker(money) {
    let button = document.getElementById("moneytracker-button");
    button.addEventListener("click", onButtonClicked);
    spentMoney = monthlyMoney(money);
    myStorage = localStorage;
    inputField = document.getElementById("moneytracker-input");
    inputField.addEventListener("keypress", function(e) {
        var key = e.which || e.keyCode;
        if (key === Config.ENTER_CODE) {
            confirmedInput(money);
        }
    });
    chosenBudget = myStorage.getItem("budget");
    if (chosenBudget !== null) {
        setNewBudget();
        getLoadingBarValues();
    }
}

function onButtonClicked() {
    inputField.classList.remove("hidden");
    inputField.focus();
}

function confirmedInput(money) {
    inputField.classList.add("hidden");
    if (inputField.value !== "") {
        if (inputField.value === "0") {
            let shownBudget = document.getElementById("moneytracker-value");
            shownBudget.innerHTML = "";
            myStorage.clear();
            inputField.value = "";
            var elem = document.getElementById("myBar");
            elem.innerHTML = "";
            elem.style.width = 0;
        } else {
            chosenBudget = inputField.value;
            chosenBudget = parseInt(chosenBudget);
            chosenBudget = chosenBudget.toFixed(Config.DECIMALS);
            spentMoney = monthlyMoney(money);
            myStorage.setItem("budget", chosenBudget);
            setNewBudget();
            inputField.value = "";
            getLoadingBarValues();
        }
    }
}

function monthlyMoney(money) {
    var currentMoney = 0;
    let date = new Date();
    let month = date.getMonth();
    for (var i = 0; i < money.length; i++) {
        if (month === i) {
            currentMoney = money[i];
        }
    }
    return currentMoney;
}

function setNewBudget() {
    let shownBudget = document.getElementById("moneytracker-value");
    shownBudget.innerHTML = spentMoney + " " + Config.EURO_CHAR + " / " + chosenBudget + " " + Config.EURO_CHAR;
}

function getLoadingBarValues() {
    let value = chosenBudget / 100;
    let ld = spentMoney / value;
    var elem = document.getElementById("myBar");
    var width = 0;
    var id = setInterval(frame, 10);
    function frame() {
        if (width > ld) {
            clearInterval(id);
            width++;
            elem.innerHTML = width * 1 + "%";
        } else if (ld === 0){
            clearInterval(id);
            elem.innerHTML = "";
            elem.style.width = 0;
        } else {
            if (width < ld) {
                width++;
                if (width <= 100) {
                    elem.style.width = width + "%";
                }
                elem.innerHTML = width * 1 + "%";
                if (width < 50) {
                    elem.style.backgroundColor = "#4CC972";
                }
                if (width >= 50) {
                    elem.style.backgroundColor = "#A3C924";
                }
                if (width >= 80) {
                    elem.style.backgroundColor = "#E65437";
                }
            }
        }
    }
}

class MoneyTrackerView {

    constructor(money) {
        initMoneyTracker(money);
        this.budget = myStorage.getItem("budget") || inputField.value;
    }

}

export default MoneyTrackerView;