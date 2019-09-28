/* eslint-env browser */

function calculateRatings(ratings) {
    let counter = 0;
    for (let i = 0; i < ratings.length; i++) {
        let rating = ratings[i];
        counter += rating;
    }
    counter /= ratings.length;
    return counter;
}

class Statistics {

    constructor(meals, money, ratings) {
        this.meals = meals || 0;
        this.money = money || 0;
        this.rating = calculateRatings(ratings) || 0;
    }

}

export default Statistics;