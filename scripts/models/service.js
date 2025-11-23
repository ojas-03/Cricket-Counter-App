import Over from "./model.js";

export const Service = {
    overs:[],

    addRuns(runsObject) {
        const runs = new Over(runsObject.firstBall, runsObject.secondBall, runsObject.thirdBall, runsObject.fourthBall, runsObject.fifthBall, runsObject.sixthBall);
        this.overs.push(runs);
        return runs;
        console.log("Runs added in overs-array");
    }
}