/* eslint-env browser */

function getMonth() {
    var date = new Date(),
        month = date.getMonth();
    return month;
}

class Entry {

    constructor(meal, price, rating, mood, ingredients, date, labels) {
        this.id = Date.now().toString();
        this.meal = meal;
        this.price = price;
        this.rating = rating || 0;
        this.mood = mood;
        this.ingredients = ingredients;
        this.month = getMonth();
        this.date = date;
        this.labels = labels;
    }

}

export default Entry;