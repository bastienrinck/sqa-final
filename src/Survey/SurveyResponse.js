const uuidv4 = require('uuid').v4;

/**
 * Survey responses class
 * @type {SurveyResponse}
 */
module.exports = class SurveyResponse {
    constructor() {
        this.id = uuidv4();
        this.responses = [];
    }

    addResponse(response) {
        if (typeof response !== "number") throw new Error("Response must be an integer");
        if (response < 1 || response > 5) throw new Error("Responses value need to be between 1 and 5");
        this.responses.push(response);
    }
}
