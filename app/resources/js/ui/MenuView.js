/* eslint-env browser */

import Config from "../utils/Config.js";
import Observable from "../utils/Observable.js";

class MenuView extends Observable {

    constructor(el) {
        super();
        this.element = el || undefined;
    }

    show() {
        if (this.element) {
            this.element.classList.remove(Config.CSS_HIDDEN_CLASS_NAME);
            this.element.addEventListener("click", this.onElementClicked);
        }
    }

    hide() {
        if (this.element) {
            this.element.classList.add(Config.CSS_HIDDEN_CLASS_NAME);
        }
    }

    static fromTemplate(template, data) {
        let container = document.createElement("button"),
            // RegEx from: https://stackoverflow.com/questions/17056064/javascript-regex-match-all-and-replace
            elString = template.replace(/\{\{(.*?)\}\}/g, function(match, token) {
                return data[token];
            });
        container.innerHTML = elString;
        return new MenuView(container.firstChild);
    }

}

export default MenuView;