/* eslint-env browser */

class Meal {

    constructor(title, price, ingredients) {
        this.title = title;
        this.price = price;
        this.ingredients = ingredients;
    }

    static fromObject(obj) {
        return new Meal(obj.title, obj.price, obj.ingredients);
    }

}

export default Meal;