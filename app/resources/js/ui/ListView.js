/* eslint-env browser */
import {
    Event,
    Observable,
} from "../utils/Observable.js";

const TASK_VIEW_TEMPLATE_STRING = document.querySelector("#entry-template").innerHTML.trim();
//const ENTRY_DELETE_POPUP = document.getElementById("#delete-popup-template").innerHTML.trim();

function initControls(listView) {
    listView.controls = {
        entryTitle: listView.el.querySelector(".entryTitle"),
        entryPrice: listView.el.querySelector(".entryPrice"),
        entryMood: listView.el.querySelector(".entryMood"),
        entryDate: listView.el.querySelector(".entryDate"),
        entryRating: listView.el.querySelector(".entryRating"),
        entryIngredients: listView.el.querySelector(".entryIngredients"),
        ingredientList: document.querySelector(".ingredient-list"),

        mood: listView.entryElement.mood,
        entryListEl: document.querySelector(".entry-list"),
        deleteButton: listView.el.querySelector(".entryDelete"),
        infoButton: listView.el.querySelector(".entryInfo"),
        entryInfoPopup: document.getElementById("entry-InfoPopup"),
        infoPopupButton: document.getElementById("entry-infoPopupButton"),
        entryDeletePopup: document.getElementById("entry-DeletePopup"),
        popupDeleteOkButton: document.getElementById("entry-deletePopupButton"),
        popupDeleteNoButton: document.getElementById("entry-noPopupButton"),
        idOfEntry: listView.entryElement.id,
    };
}

function initEvents(listView) {
    listView.controls.deleteButton.addEventListener("click", listView.onDeleteButtonClicked.bind(listView));
    listView.controls.infoButton.addEventListener("click", listView.onInfoButtonClicked.bind(listView));
    listView.controls.infoPopupButton.addEventListener("click", listView.onInfoPopupButton.bind(listView));
    //listView.controls.popupDeleteOkButton.addEventListener("click", listView.onPopupDeleteOkButton.bind(listView));
    listView.controls.popupDeleteNoButton.addEventListener("click", listView.onPopupDeleteNoButton.bind(listView));
}

async function setIngredients(listView) {
    var ingredients = await listView.entryElement.ingredients;
    let ul = listView.controls.ingredientList;

    if(ingredients !== undefined){
        for (let i = 0; i < ingredients.length; i++) {
            let ingredient = document.createElement("li");
            ingredient.innerHTML = ingredients[i];
            if (ingredient.innerHTML !== "" && ingredient.innerHTML.length > 1) {
                ul.appendChild(ingredient);
            }
        }
    } else {
        let infoEl = document.createElement("li");
        infoEl.style.fontWeight ="bold";
        infoEl.style.fontStyle ="italic";
        infoEl.innerHTML = "Dieses Gericht enthält keine von der Mensa als deklarierenswert erachteten Inhaltsstoffe."
        ul.appendChild(infoEl);
    }
}

function clearInfo(listView) {
    while (listView.controls.ingredientList.firstChild) {
        listView.controls.ingredientList.removeChild(listView.controls.ingredientList.firstChild);
    }
}

function getOffset(el) {
    var bodyRect = document.body.getBoundingClientRect(),
            elemRect = el.getBoundingClientRect(),
         offset = elemRect.top - bodyRect.top;
     return offset;
}

class ListView extends Observable {

    constructor(entryElement) {
        super();
        this.entryElement = entryElement;
        this.el = ListView.createEntryElement();
        initControls(this);
        initEvents(this);
        if (this.controls.mood === "good-mood") {
            this.controls.entryMood.classList.add("fa-smile-beam");
            this.controls.entryMood.style.color = "green";
        }
        if (this.controls.mood === "semi-mood") {
            this.controls.entryMood.classList.add("fa-meh");
            this.controls.entryMood.style.color = "orange";
        }
        if (this.controls.mood === "bad-mood") {
            this.controls.entryMood.classList.add("fa-frown");
            this.controls.entryMood.style.color = "red";
        }
        this.controls.entryDate.innerHTML = entryElement.date;
        this.controls.entryTitle.innerHTML = entryElement.meal;
        this.controls.entryPrice.innerHTML = entryElement.price + " €";
        for (let i = 0; i < entryElement.rating; i++) {
            let starSpan = document.createElement("span");
            starSpan.classList.add("fa");
            starSpan.classList.add("fa-star");
            this.controls.entryRating.appendChild(starSpan);
        }

         this.controls.entryListEl.append(this.el);
    }

    static createEntryElement() {
        let el = document.createElement("div");
        el.innerHTML = TASK_VIEW_TEMPLATE_STRING;
        return el.firstChild;
    }

    onDeleteButtonClicked(e) {
        let y = getOffset(this.controls.deleteButton);
        this.controls.entryDeletePopup.style.top = y - 300 + "px";
        this.controls.entryDeletePopup.classList.remove("hidden");
        let event = new Event("deleteOneEntry", this.controls.idOfEntry);
        super.notifyAll(event);
    }

    onInfoButtonClicked() {
        let y = getOffset(this.controls.infoButton);
        this.controls.entryInfoPopup.classList.remove("hidden");
        this.controls.entryInfoPopup.style.top = y - 55 + "px";
        this.controls.infoPopupButton.classList.remove("hidden");
        clearInfo(this);
        setIngredients(this);
    }

    onInfoPopupButton() {
        this.controls.entryInfoPopup.classList.add("hidden");
        this.controls.infoPopupButton.classList.add("hidden");
        clearInfo(this);
    }

    onPopupDeleteOkButton(e) {
        //this.el.remove();
        this.controls.entryDeletePopup.classList.add("hidden");
        this.controls.popupDeleteNoButton.removeEventListener("click", this.onPopupDeleteNoButton.bind(this));
        
    }

    onPopupDeleteNoButton() {
        this.controls.entryDeletePopup.classList.add("hidden");
    }

}

export default ListView;