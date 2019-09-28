/* eslint-env browser */

import MealGetter from "../data/MealGetter.js";
import Entry from "../data/Entry.js";
import Observable from "../utils/Observable.js";

function initEntryView(entryView) {
    entryView.entryObj = new Entry();
    initControls(entryView);
    initEvents(entryView);
}

function initControls(entryView) {
    entryView.controls = {
        entrybox: document.querySelector(".floatLeft"),
        mealPopUp: document.getElementById("meal-popup"),
        menuName: document.getElementById("checkedMeal"),
        meal: document.getElementById("meal"),
        submitButton: document.getElementById("submit"),
        cancelButton: document.getElementById("cancel"),
        starOne: document.querySelector(".one"),
        starTwo: document.querySelector(".two"),
        starThree: document.querySelector(".three"),
        starFour: document.querySelector(".four"),
        starFive: document.querySelector(".five"),
        goodMood: document.getElementById("good-mood"),
        semiMood: document.getElementById("semi-mood"),
        badMood: document.getElementById("bad-mood"),
    };
}

function initEvents(entryView) {
    entryView.controls.meal.addEventListener("click", entryView.onMealButtonClicked.bind(entryView));
    entryView.controls.submitButton.addEventListener("click", entryView.onSubmitButtonClicked.bind(entryView));
    entryView.controls.cancelButton.addEventListener("click", entryView.onCancelButtonClicked.bind(entryView));
    entryView.controls.starOne.addEventListener("click", entryView.onStarOneClicked.bind(entryView));
    entryView.controls.starTwo.addEventListener("click", entryView.onStarTwoClicked.bind(entryView));
    entryView.controls.starThree.addEventListener("click", entryView.onStarThreeClicked.bind(entryView));
    entryView.controls.starFour.addEventListener("click", entryView.onStarFourClicked.bind(entryView));
    entryView.controls.starFive.addEventListener("click", entryView.onStarFiveClicked.bind(entryView));
    entryView.controls.goodMood.addEventListener("click", entryView.onGoodMoodClicked.bind(entryView));
    entryView.controls.semiMood.addEventListener("click", entryView.onSemiMoodClicked.bind(entryView));
    entryView.controls.badMood.addEventListener("click", entryView.onBadMoodClicked.bind(entryView));
}

function removeChecked(entryView) {
    entryView.controls.starOne.classList.remove("checked");
    entryView.controls.starTwo.classList.remove("checked");
    entryView.controls.starThree.classList.remove("checked");
    entryView.controls.starFour.classList.remove("checked");
    entryView.controls.starFive.classList.remove("checked");
}

function removeCheckedMood(entryView) {
    entryView.controls.goodMood.classList.remove("checked-green");
    entryView.controls.semiMood.classList.remove("checked");
    entryView.controls.badMood.classList.remove("checked-red");
}

function clearEntryCreator(entryView) {
    removeChecked(entryView);
    removeCheckedMood(entryView);
    let menuName = document.getElementById("checkedMeal");
    menuName.innerHTML = "";
}

class EntryView extends Observable {

    constructor() {
        super();
        initEntryView(this);
    }

    onMealEntryButtonClicked(checkedMealEntry) {
        this.controls.mealPopUp.classList.add("hidden");
        this.controls.menuName.innerHTML = checkedMealEntry.trim();
    }

    onMealButtonClicked() {
        this.controls.mealPopUp = document.getElementById("meal-popup");
        this.controls.mealPopUp.classList.remove("hidden");
        let mealGetter = new MealGetter();
        mealGetter.initMealGetter();
    }

    onSubmitButtonClicked() {
        let event = new Event("submit", this);
        this.notifyAll(event);
        clearEntryCreator(this);
    }

    onCancelButtonClicked() {
        clearEntryCreator(this);
    }

    onStarOneClicked() {
        removeChecked(this);
        this.controls.starOne.classList.add("checked");
    }

    onStarTwoClicked() {
        removeChecked(this);
        this.controls.starOne.classList.add("checked");
        this.controls.starTwo.classList.add("checked");
    }

    onStarThreeClicked() {
        removeChecked(this);
        this.controls.starOne.classList.add("checked");
        this.controls.starTwo.classList.add("checked");
        this.controls.starThree.classList.add("checked");
    }

    onStarFourClicked() {
        removeChecked(this);
        this.controls.starOne.classList.add("checked");
        this.controls.starTwo.classList.add("checked");
        this.controls.starThree.classList.add("checked");
        this.controls.starFour.classList.add("checked");
    }

    onStarFiveClicked() {
        removeChecked(this);
        this.controls.starOne.classList.add("checked");
        this.controls.starTwo.classList.add("checked");
        this.controls.starThree.classList.add("checked");
        this.controls.starFour.classList.add("checked");
        this.controls.starFive.classList.add("checked");
    }

    onGoodMoodClicked(event) {
        removeCheckedMood(this);
        event.target.classList.add("checked-green");
    }

    onSemiMoodClicked(event) {
        removeCheckedMood(this);
        event.target.classList.add("checked");
    }

    onBadMoodClicked(event) {
        removeCheckedMood(this);
        event.target.classList.add("checked-red");
    }

}

export default EntryView;