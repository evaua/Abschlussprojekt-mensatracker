/* eslint-env browser */
import ListView from "./ListView.js";
import {
    Event,
    Observable,
} from "../utils/Observable.js";

function resetListView(listViewManager) {
    listViewManager.listViewArray.forEach(function(listView) {
        listView.el.remove();
    });
}

function initControls(listViewManager) {
    listViewManager.controls = {
        popupDeleteOkButton: document.getElementById("entry-deletePopupButton"),
        entryDeletePopup: document.getElementById("entry-DeletePopup"),
    };
}

function initEvents(listViewManager) {
    listViewManager.controls.popupDeleteOkButton.addEventListener("click", listViewManager.onDeleteEntryOk.bind(listViewManager));
}

function setEntryCounter(shownEntries, allEntries) {
    let entryCounter = document.getElementById("entry-counter");
    entryCounter.innerHTML = shownEntries + " von " + allEntries + " Einträgen";
}

function createMonthElement(entry){
    let monthEl = document.createElement("span"),
        line = document.createElement("hr");
    monthEl.innerHTML = entry.date.substring(3,10);
    monthEl.appendChild(line);
}   

class ListViewManager extends Observable {
    constructor(entryArray) {
        super();
        initControls(this);
        initEvents(this);
        this.listViewArray = [];
    }
 
    update(databaseEntries, shownEntries) {
        resetListView(this);        
        for(var i = 0; i < databaseEntries.length; i++){
            let listView = new ListView(databaseEntries[i]);
            listView.addEventListener("deleteOneEntry", this.onDeleteOneEntryCandidate.bind(this));
            this.listViewArray.push(listView);
            if(i === 0){
                createMonthElement(databaseEntries[i]);
            }
            if(i !== 0 && databaseEntries[i].month !== databaseEntries[i-1].month){
                createMonthElement(databaseEntries[i]);
            }
        }
        setEntryCounter(databaseEntries.length, shownEntries);
    }

    clear() {
        resetListView(this);
    }
    
    onDeleteOneEntryCandidate(e){
        this.currentDeleteCandidate = e.data;
    }
    
    onDeleteEntryOk(){
        this.controls.entryDeletePopup.classList.add("hidden");
        let event = new Event("deleteOneEntry", this.currentDeleteCandidate);
        this.notifyAll(event);
    }
    
  

}

export default ListViewManager;