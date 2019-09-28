/* eslint-env browser */

class WeeklyMenu {

    constructor() {
        this.data = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
        };
    }

    get monday() {
        return this.data.monday;
    }

    get tuesday() {
        return this.data.tuesday;
    }

    get wednesday() {
        return this.data.wednesday;
    }

    get thursday() {
        return this.data.thursday;
    }

    get friday() {
        return this.data.friday;
    }

    set monday(value) {
        this.data.monday = value;
    }

    set tuesday(value) {
        this.data.tuesday = value;
    }

    set wednesday(value) {
        this.data.wednesday = value;
    }

    set thursday(value) {
        this.data.thursday = value;
    }

    set friday(value) {
        this.data.friday = value;
    }
}

export default WeeklyMenu;