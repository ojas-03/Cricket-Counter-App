import Over from "./model.js";

export const Service = {
    overs:[],

    addRuns(runsObject) {
        const runs = new Over(runsObject.runCount, runsObject.totalRunCount, runsObject.wicketCount, runsObject.overCount, runsObject.totalBallCount, runsObject.extras, runsObject.statusButtonID);
        this.overs.push(runs);
        
        console.log("Runs added in overs-array", this.overs);
        return runs;
    },

    retrieveLastRecord() {
        return this.overs[this.overs.length - 1];
    }
}