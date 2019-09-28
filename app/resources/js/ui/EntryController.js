/* eslint-env browser */

import EntryView from "./EntryView.js";
import {
    Event,
    Observable
} from "../utils/Observable.js";

var entryList,
    entryViews = [];

function onNewEntryRequested() {
    let event = new Event("entryRequest");
    this.notifyAll(event);
}

function onListCleanupRequested() {

}

class EntryController extends Observable {

    constructor() {
        super();
        let createEntryButton = document.getElementById("submit"),
            clearListButton = document.getElementById("clear-list");
        entryList = document.querySelector(".entry-list");
        createEntryButton.addEventListener("click", onNewEntryRequested.bind(this));
        clearListButton.addEventListener("click", onListCleanupRequested.bind(this));
    }

    add(entry) {
        let view = new EntryView(entry);
        entryViews.push(view);
        entryList.appendChild(view.getElement());
        //view.addEventListener("taskViewStatusChange", onTaskViewUpdated.bind(this));
        //view.addEventListener("taskViewTextChange", onTaskViewUpdated.bind(this));
        view.setFocus();
    }

    remove(entry) {
        for (let i = 0; i < entryViews.length; i++) {
            let currentView = entryViews[i];
            if (currentView.getEntry().id === task.id) {
                currentView.removeElement();
                entryViews.splice(i, 1);
                break;
            }
        }
    }

}

export default new TaskController();