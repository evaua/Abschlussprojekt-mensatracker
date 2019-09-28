/* eslint-env browser */


import Observable from "../utils/Observable.js";

class View extends Observable {

    constructor() {
        super();
        this.el = undefined;
    }

    setElement(el) {
        this.el = el;
    }

    show() {
        if (this.el) {
            this.el.classList.remove("hidden");
        }
    }

    hide() {
        if (this.el) {
            this.el.classList.add("hidden");
        }
    }
}

export default View;