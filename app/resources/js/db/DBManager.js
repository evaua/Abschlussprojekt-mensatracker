/* eslint-env browser */

import DBConfig from "../db/DBConfig.js";

var db, year, sortDateDesc = true, sortPriceDesc = true;
//Dexie.delete(DBConfig.DB_NAME);

function createDB() {
    if (db === undefined) {
        db = new Dexie(DBConfig.DB_NAME);
        db.version(1).stores({
            entries: "id, meal, price, rating, mood, *ingredients, month, date, labels",
        });
    }
}

function storeEntry(entry) {
    db.entries.add(entry);
}

function deleteEntry(id) {
    db.entries.where("id").equals(id).delete();
}

function countEntries() {
    var numOfEntries = db.entries.count();
    return numOfEntries;
}

function getAllEntriesInDB() {
    var allEntries = db.entries.orderBy("date").toArray();
    return allEntries;
}

async function getFirst10Entries(){
    let entries = await db.entries.orderBy("date").toArray();
    let firstEntries = entries.slice(entries.length-10, entries.length);
    return firstEntries;
}

async function getNext10Entries(index){
    let entries = await db.entries.toArray();
    let length = 0;
    if(index - 10 >= 0){
        length = index - 10;
    } else {
        length = 10 - index;
    }
    let nextEntries = entries.slice(length, entries.length);
    return nextEntries;
}

function getRatingsInDB() {
    var newRatings = new Array();
    getAllEntriesInDB().then(function(result) {
        for (let i = 0; i < result.length; i++) {
                newRatings[i] = result[i].rating;
        }
    });
    return newRatings;
}

function getMealsInDB() {
    var newMeals = DBConfig.MEALMONTHS,
        mealNumber = 0;
    getAllEntriesInDB().then(function(result) {
        for (let i = 0; i < newMeals.length; i++) {
            for (let j = 0; j < result.length; j++) {
                let newYear = parseInt(result[j].date.substring(6, 10));
                if (year === newYear) {
                    if (result[j].month === i) {
                        mealNumber++;
                    }
                }
            }
            newMeals[i] = mealNumber;
            mealNumber = 0;
        }
    });
    return newMeals;
}

async function getMoneyInDB() {
    var newMoney = DBConfig.MONEYMONTHS,
        monthlyMoney = 0.0;
    var entries = await getAllEntriesInDB();
    for (let i = 0; i < newMoney.length; i++) {
        for (let j = 0; j < entries.length; j++) {
            if (entries[j].month === i) {
                let newYear = parseInt(entries[j].date.substring(6, 10));
                if (year === newYear) {
                    let price = entries[j].price;
                    let number = price.replace(",", ".");
                    let floatNumber = parseFloat(number);
                    monthlyMoney += floatNumber;
                }
            }
        }
        newMoney[i] = monthlyMoney.toFixed(DBConfig.DECIMALS);
        monthlyMoney = 0.0;
    }
    return newMoney;
}

function clearDB() {
    db.entries.clear();
}
/*
function getDateSortInDB(){
    var entriesSortedDate = new Array();
    if(sortDateDesc){
        entriesSortedDate = db.entries.orderBy("date").toArray();
    }
    else{
        entriesSortedDate = db.entries.orderBy("date").reverse().toArray();
    }
    sortDateDesc = !sortDateDesc;
    return entriesSortedDate;
}


function getPriceSortInDB(){
    var entriesSortedPrice = new Array();
    if(sortPriceDesc){
        entriesSortedPrice = db.entries.orderBy("price").toArray();
    }
    else{
        entriesSortedPrice = db.entries.orderBy("price").reverse().toArray();
    }
    sortPriceDesc = !sortPriceDesc;
    return entriesSortedPrice;
} */

 function getEntriesWithMeatInDB(){
    var allMeatEntries = new Array();
    //var nowallMeatEntries =  await db.entries.where("labels").noneOf("VG").toArray();
    //console.log(nowallMeatEntries);
    allMeatEntries = db.entries.where("labels").noneOf(["V", "VG"]).toArray();
    return allMeatEntries;
}

function getEntriesWithGlutenInDB(){
    var allGlutenEntries = new Array();
    allGlutenEntries = db.entries.where("ingredients").anyOf(["Weizengluten", "Roggengluten", "Gerstengluten", "Hafergluten", "Dinkelgluten", "Kamutgluten"]).distinct().toArray();
    return allGlutenEntries;
}

function getEntriesWithLactoseInDB(){
    var allLactoseEntries = new Array();
    allLactoseEntries = db.entries.where("ingredients").equals("Milch und Milchprodukte").toArray();
    return allLactoseEntries;
}

function getDateSortDescInDB() {
    let entriesSortedDate = db.entries.orderBy("date").toArray();
    return entriesSortedDate;
}

function getDateSortAscInDB() {
    let entriesSortedDate = db.entries.orderBy("date").reverse().toArray();
    return entriesSortedDate;
}

function getPriceSortDescInDB() {
    let entriesSortedPrice = db.entries.orderBy("price").toArray();
    return entriesSortedPrice;
}

function getPriceSortAscInDB() {
    let entriesSortedPrice = db.entries.orderBy("price").reverse().toArray();
    return entriesSortedPrice;
}

function freeTextSearchInDB(input) {
    let regexp = new RegExp(input, 'i');
    return db.entries.filter(function (entrie) { return regexp.test(entrie.meal) || regexp.test(entrie.ingredients); })
    .toArray()
}

class DBManager {

    constructor() {
        return createDB();
    }

    open() {
        var date = new Date();
        year = date.getFullYear();
        db.open();
    }

    addEntry(entry) {
        return storeEntry(entry);
    }

    delete(id) {
        return deleteEntry(id);
    }

    count() {
        return countEntries();
    }

    getAllEntries() {
        return getAllEntriesInDB();
    }

    getFirstEntries(){
        return getFirst10Entries();
    }

    getNextEntries(index){
        return getNext10Entries(index);
    }

    getRatings() {
        return getRatingsInDB();
    }

    getMeals() {
        return getMealsInDB();
    }

    getMoney() {
        return getMoneyInDB();
    }

    clear() {
        return clearDB();
    }
    
    

 

    /*
        getDateSort() {

        return getDateSortInDB();
    }
    
    getPriceSort() {
        return getPriceSortInDB();
    } */
    
    getDateSortDesc() {
        return getDateSortDescInDB();
    }
    
    getDateSortAsc() {
        return getDateSortAscInDB();
    }
    
    getPriceSortDesc() {
        return getPriceSortDescInDB();
    }
    
    getPriceSortAsc() {
        return getPriceSortAscInDB();
    }
    
    getEntriesWithMeat() {
        return getEntriesWithMeatInDB();
    }
    
    getEntriesWithGluten() {
        return getEntriesWithGlutenInDB();
    }
    
    getEntriesWithLactose() {

        return getEntriesWithLactoseInDB();
    }
    
    freeTextSearch(input) {
        return freeTextSearchInDB(input);
    }


}

export default DBManager;