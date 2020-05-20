const math = require('mathjs')
const Survey = require('./Survey');
const SurveyResponse = require('./SurveyResponse');

/**
 * Survey Management Service class
 * @type {SurveyService}
 */
module.exports = new class SurveyService {
    constructor() {
        this.surveyList = [];
    }

    /**
     * Retrieves the list of Surveys
     * @returns {[]} the survey list
     */
    getSurveyList() {
        return this.surveyList
    }

    /**
     * Retrieves a Survey by name
     * @param surveyId
     * @returns {Survey} a survey
     */
    getSurvey(surveyId) {
        const survey = this.surveyList.find(elem => elem.name === surveyId);
        if (survey === undefined) throw new Error("Survey does not exit");
        return survey;
    }

    /**
     * Adds a Survey
     * @param survey
     * @returns {Survey} a survey
     */
    addSurvey(survey) {
        if (!survey.name) throw new Error("Name field is missing");
        const result = new Survey(survey);
        if(this.surveyList.some(elem => elem.name === survey.name)) {
            throw new Error("survey already exists");
        }
        this.surveyList.push(result);
        return result;
    }

    /**
     * Deletes a Survey
     * @param surveyId
     */
    deleteSurvey(surveyId) {
        if (!this.surveyList.some(elem => elem.name === surveyId)) throw new Error("Survey does not exit");
        this.surveyList = this.surveyList.filter(elem => elem.name !== surveyId);
    }

    /**
     * Adds a question to given Survey
     * @param surveyId
     * @param body
     * @returns {[]} question pool of the Survey
     */
    addSurveyQuestion(surveyId, body) {
        const { question } = body;
        const survey = this.surveyList.find(elem => elem.name === surveyId);
        if (!survey) throw new Error("Survey does not exit");
        else if (!question) throw new Error("Missing key 'question' on the request body");
        else if (typeof question !== "string") throw new Error("Survey question needs to be a string");
        else if (survey.questions.length > 10) throw new Error("Survey size exceeded");
        survey.questions.push(question);
        return survey.questions;
    }

    /**
     * Adds a new SurveyResponse to the given Survey
     * @param surveyId
     * @returns {*}
     */
    createSurveyResponse(surveyId) {
        const survey = this.surveyList.find(elem => elem.name === surveyId);
        if (!survey) throw new Error("Survey does not exit");
        survey.responses.push(new SurveyResponse())
        return survey.responses[survey.responses.length - 1];
    }

    /**
     * Adds a response to the given SurveyResponse from the given Survey
     * @param surveyId
     * @param surveyResponseId
     * @param body
     * @returns {*}
     */
    addSurveyResponse(surveyId, surveyResponseId, body) {
        const { response } = body;
        const survey = this.surveyList.find(elem => elem.name === surveyId);
        if (!survey) throw new Error("Survey does not exit");
        const surveyResponse = survey.responses.find(elem => elem.id === surveyResponseId);
        if (!surveyResponse) throw new Error("SurveyResponse does not exit");
        else if (!response) throw new Error("Missing key 'response' on the request body");
        else if (survey.questions.length <= surveyResponse.responses.length) throw new Error("Survey responses exceed question pool")
        surveyResponse.addResponse(response);
        return surveyResponse;
    }

    /**
     * Calculates metrics for a given survey
     * @param surveyId
     * @returns {{average: number, min: number, max: number, std: number}}
     */
    getSurveyMetrics(surveyId) {
        const survey = this.surveyList.find(elem => elem.name === surveyId);
        if (!survey) throw new Error("Survey does not exit");
        const flatmap = survey.responses.flatMap(elem => elem.responses);
        if (!flatmap.length) throw new Error("No answer to this question yet");
        return {
            average: math.mean(flatmap),
            std: math.std(flatmap),
            min: math.min(flatmap),
            max: math.max(flatmap),
        }
    }

    /**
     * Calculates metrics for the given question of the given survey
     * @param surveyId
     * @param index
     * @returns {{average: number, min: number, max: number, std: number}}
     */
    getSurveyQuestionMetrics(surveyId, index) {
        const survey = this.surveyList.find(elem => elem.name === surveyId);
        const indexNb = parseInt(index, 10);
        if (!survey) throw new Error("Survey does not exit");
        else if (Number.isNaN(indexNb)) throw new Error("Invalid index")
        else if (index > survey.questions.length) throw new Error("Index out of range");
        const flatmap = survey.responses.flatMap(elem => elem.responses[parseInt(index, 10) - 1]).filter(elem => elem);
        if (!flatmap.length) throw new Error("No answer to this question yet");
        return {
            average: math.mean(flatmap),
            std: math.std(flatmap),
            min: math.min(flatmap),
            max: math.max(flatmap),
        }
    }
}()
