/**
 * Survey class
 * @type {Survey}
 */
module.exports = class Survey {
    constructor({name}) {
        if (typeof name !== "string") {
            throw new Error("Parameter name is not a string");
        }
        this.name = name;
        this.questions = []
        this.responses = [];
    }
}
