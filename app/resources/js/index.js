/* eslint-env browser */

import MoneyTrackerView from "./ui/MoneyTrackerView.js";
import EntryView from "./ui/EntryView.js";
import ListViewManager from "./ui/ListViewManager.js";
import StatisticsView from "./ui/StatisticsView.js";
import Entry from "./data/Entry.js";
import DataGetter from "./utils/DataGetter.js";
import DBManager from "./db/DBManager.js";
import Config from "./utils/Config.js";


var database, dataGetter, listViewManager, moreEl, textSearchField, lengthArrayDB, filterFunction, isDateDesc, isPriceDesc;

async function init() {
    isDateDesc = false;
    isPriceDesc = true;
    lengthArrayDB = Config.LENGTH_LIST_DEFAULT;
    database = new DBManager();
    database.open();
    dataGetter = new DataGetter();
    let entryView = new EntryView();
    listViewManager = new ListViewManager();
    filterFunction = database.getDateSortDesc;
    var currentMoney = await database.getMoney();
    let moneyTracker = new MoneyTrackerView(currentMoney);
    entryView.addEventListener("submit", onSubmitButtonClicked);
    listViewManager.addEventListener("deleteOneEntry",onDeleteOneEntry);
    initUI();
    getEntriesByFilter("placholder");
}

 function initUI() {
    let statisticsButton = document.getElementById("statistics"),
        deleteButton = document.getElementById("clear-list"),
        dropdownDatumButton = document.getElementById("dropdown-datum"),
        dropdownPreisButton = document.getElementById("dropdown-preis"),
        dropdownFleischButton = document.getElementById("dropdown-fleisch"),
        dropdownGlutenButton = document.getElementById("dropdown-gluten"),
        dropdownLaktoseButton = document.getElementById("dropdown-laktose");
    statisticsButton.addEventListener("click", onStatisticsButtonClicked);
    deleteButton.addEventListener("click", onDeleteButtonClicked);
    dropdownDatumButton.addEventListener("click", onDropDownFilterClicked); 
    dropdownPreisButton.addEventListener("click", onDropDownFilterClicked);
    dropdownFleischButton.addEventListener("click", onDropDownFilterClicked);
    dropdownGlutenButton.addEventListener("click", onDropDownFilterClicked);
    dropdownLaktoseButton.addEventListener("click", onDropDownFilterClicked);
    moreEl = document.getElementById("more");
    moreEl.addEventListener("click", onMoreButtonClicked); 
    textSearchField = document.getElementById("search");
    textSearchField.addEventListener("keypress", onTextSearchField);
}

async function onMoreButtonClicked(){
  lengthArrayDB = lengthArrayDB + Config.LENGTH_LIST_DEFAULT;
   getEntriesByFilter("placholder");
}

function toggleMoreButton(resultEntries) {
    if(resultEntries.length > Config.LENGTH_LIST_DEFAULT && resultEntries.length > lengthArrayDB){
        moreEl.classList.remove("hidden");
    }
    else{
       moreEl.classList.add("hidden"); 
    }
}

async function getEntriesByFilter(inputString) {
    let resultEntries,
        allEntries = await database.getAllEntries();
    if(inputString === "placholder"){
        resultEntries = await filterFunction();
    }
    else{   
        resultEntries = await filterFunction(inputString);
    }
    
    resultEntries = resultEntries.reverse();

    toggleMoreButton(resultEntries);
    if(resultEntries.length > lengthArrayDB){
        resultEntries = resultEntries.slice(0, lengthArrayDB);
    }
    listViewManager.update(resultEntries, allEntries.length);
}


async function onStatisticsButtonClicked() {
    let statisticsEl = document.getElementById("statistics-popup");
    statisticsEl.classList.remove("hidden");
    if (database.count() !== 0) {
        var meals = database.getMeals();
        var money = await database.getMoney();
        var ratings = database.getRatings();
        database.getAllEntries().then(function() {
            let statisticsView = new StatisticsView(meals, money, ratings);
        });
    } else {
        let statisticsView = new StatisticsView(Config.RATINGS, Config.MEALS, Config.MONEY);
    }
}

async function onSubmitButtonClicked() {
    let entryParams = dataGetter.getData();
    if (entryParams[0] !== "") {
        let entry = new Entry(entryParams[0], entryParams[1], entryParams[2], entryParams[3], entryParams[4], entryParams[5], entryParams[6]);
        database.addEntry(entry);
        getEntriesByFilter("placholder");
        let audio = new Audio("./resources/data/coins.mp3");
        audio.play();
        let newMoney = await database.getMoney();
        let newMoneyTracker = new MoneyTrackerView(newMoney);
    } else {
        let information = document.getElementById("nomeal");
        information.classList.add("triggered");
        setTimeout(untrigger, 2000);
    }
}

function untrigger(information) {
    let info = document.getElementById("nomeal");
    info.classList.add("untriggered");
    info.classList.remove("triggered");
    setTimeout(function() {
        info.classList.remove("untriggered");
    }, 2000);
}

function onDeleteButtonClicked() {
    let clearEl = document.getElementById("delete-popup");
    clearEl.classList.remove("hidden");
    let okEl = document.getElementById("delete-ok");
    okEl.addEventListener("click", onDelete);
    let cancelEl = document.getElementById("delete-cancel");
    cancelEl.addEventListener("click", onCancel);
}

function onDelete() {
    let clearEl = document.getElementById("delete-popup");
    clearEl.classList.add("hidden");
    database.clear();
    listViewManager.clear();
    let money = database.getMoney();
    let moneyTracker = new MoneyTrackerView(money);
}

function onDeleteOneEntry(e){
    database.delete(e.data);
    getEntriesByFilter("placholder");
}

function onCancel() {
    let clearEl = document.getElementById("delete-popup");
    clearEl.classList.add("hidden");
}


function onDeleteOneElement() {
    let deleteElementButton = document.getElementById("entry-deletePopupButton");
    deleteElementButton.addEventListener("click", onDelete);
}

function onTextSearchField(e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      
      database.freeTextSearch(textSearchField.value);
      filterFunction = database.freeTextSearch;
      getEntriesByFilter(textSearchField.value);
    }
}

async function onDropDownFilterClicked(event) {
    lengthArrayDB = Config.LENGTH_LIST_DEFAULT;
    let filterButton = document.querySelector(".dropdown-content"),
        dateIcon = document.getElementById("datum-icon"),
        priceIcon = document.getElementById("preis-icon");
    switch (event.target.id){ 
        case "dropdown-datum":
            if(isDateDesc){
                filterFunction = database.getDateSortDesc;
            }
            else{
                filterFunction = database.getDateSortAsc;
            }
            isDateDesc = !isDateDesc;
            getEntriesByFilter("placholder");
            toggleIcon(dateIcon, filterButton);
            break;
        case "dropdown-preis":
            if(isPriceDesc){
                filterFunction = database.getPriceSortDesc;
            }
            else{
                filterFunction = database.getPriceSortAsc;
            }
            isPriceDesc = !isPriceDesc;
            getEntriesByFilter("placholder");
            toggleIcon(priceIcon, filterButton);
            break;
        case "dropdown-fleisch":
            filterFunction = database.getEntriesWithMeat;
            getEntriesByFilter("placholder");
            let fleischEl = document.getElementById("dropdown-fleisch");
            toggleActivation(fleischEl, filterButton);
            break;
        case "dropdown-gluten":
            filterFunction = database.getEntriesWithGluten;
            getEntriesByFilter("placholder");
            let glutenEl = document.getElementById("dropdown-gluten");
            toggleActivation(glutenEl, filterButton);
            break;
        case "dropdown-laktose":
            filterFunction = database.getEntriesWithLactose;
            getEntriesByFilter("placholder");
            let laktoseEl = document.getElementById("dropdown-laktose");
            toggleActivation(laktoseEl, filterButton);
            break;
    } 
}

function toggleIcon(el, filterButton){
    let childNodesArray = Array.from(filterButton.childNodes);
    childNodesArray.forEach(function(child) {
        if(child.classList){
             child.classList.remove("activated");
        }
    });
    if(el.classList.contains("fa-caret-down")){
        el.classList.remove("fa-caret-down");
        el.classList.add("fa-caret-up");
    } else {
        el.classList.remove("fa-caret-up");
        el.classList.add("fa-caret-down");
    }
}

async function toggleActivation(el, filterButton){
    let childNodesArray = Array.from(filterButton.childNodes);
    childNodesArray.forEach(function(child) {
        if(child.classList){
             child.classList.remove("activated");
        }
    });
    if(el.classList.contains("activated")){
        el.classList.remove("activated");
    } else {
        el.classList.add("activated");
    }
}



init();