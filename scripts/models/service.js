import Over from "./model.js";

export const Service = {
    overs:[],

    addRuns(runsObject) {
        const runs = new Over(runsObject.runCount, runsObject.totalRunCount, runsObject.wicketCount, runsObject.overCount, runsObject.totalBallCount, runsObject.extras, runsObject.statusButtonID);
        this.overs.push(runs);
        
        // console.log("Runs added in overs-array", this.overs);
        return runs;
    },

    statusButtonsReset() {
        let i = 1;
        let resetArray = [];
        if(this.overs[this.overs.length - i].totalBallCount %6 == 0) {
            while(i <= 6) {
               resetArray.push(this.overs[this.overs.length - i]);
                i++; 
            }
        }
        else {
            while(i<=this.overs.length && this.overs[this.overs.length - i].totalBallCount %6 != 0) {
                resetArray.push(this.overs[this.overs.length - i]);
                i++;
            }
        }
        return resetArray;
    },
    
    retrieveLastRecord() {
        // console.log("Last record", this.overs);
        return this.overs[this.overs.length - 1];
        
    }
}