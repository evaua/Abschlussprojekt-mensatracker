/* eslint-env browser */

import {
    Event,
    Observable,
} from "./Observable.js";

const SUPPORTED_RESULT_TYPES = ["json", "text"];

function handleErrors(response) {
    if (!response.ok) {
        throw new Error(`DownloadWorker] HTTP error while fetching data "${response.statusText}"`);
    }
    return response;
}

function createDownloadPromiseFromJob(job) {
    return new Promise(function(resolve, reject) {
        if (!SUPPORTED_RESULT_TYPES.includes(job.resultType)) {
            reject(new Error(`[DownloadWorker] Unsupported result type "${job.resultType}"`));
        }
        fetch(job.url).then(handleErrors).then(function(response) {
            if (job.resultType === "json") {
                return response.json();
            } else if (job.resultType === "text") {
                return response.text();
            }
            return undefined;
        }).then(function(result) {
            resolve(result);
        });
    });
}

class DownloadJob {
    constructor(url, resultType) {
        this.url = url;
        this.resultType = resultType;
        Object.freeze(this);
    }
}

class DownloadWorker extends Observable {

    constructor() {
        super();
        this.jobs = [];
    }

    addJob(job) {
        this.jobs.push(job);
    }

    start() {
        let promises = [],
            self = this;
        for (let i = 0; i < this.jobs.length; i++) {
            let promise = createDownloadPromiseFromJob(this.jobs[i]);
            promises.push(promise);
        }
        Promise.all(promises).then(function(results) {
            let event = new Event("finish", results);
            self.notifyAll(event);
        }).catch(function(error) {
            let event = new Event("error", error);
            self.notifyAll(event);
        });
    }
}

export {
    DownloadJob,
    DownloadWorker,
};

export default DownloadWorker;