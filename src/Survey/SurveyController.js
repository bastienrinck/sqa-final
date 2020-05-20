const express = require('express');
const SurveyService = require('./SurveyService');

const router = express.Router();

/**
 * Root Route handler
 */
router.route('/')
    /**
     * Retrieves the list of Surveys
     */
    .get((req, res) => {
        res.send({survey: SurveyService.getSurveyList()});
    })
    /**
     * Creates a Survey
     * @param Survey in the body
     */
    .post((req, res) => {
        try {
            const survey = SurveyService.addSurvey(req.body);
            res.send({survey: survey});
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });

/**
 * '/:name' route handler
 * @param name
  */
router.route('/:name')
    /**
     * Retrieves a Survey by name
     * @param name
     */
    .get((req, res) => {
        try {
            const survey = SurveyService.getSurvey(req.params.name);
            res.send({survey: survey});
        } catch (err) {
            res.status(404).send({error: err.message});
        }
    })
    /**
     * Deletes a Survey by name
     * @param name
     */
    .delete((req, res) => {
        try {
            SurveyService.deleteSurvey(req.params.name);
            res.send();
        } catch (err) {
            res.status(404).send({error: err.message});
        }
    });

/**
 * '/:name/metrics' route handler
 * Retrieves metrics for the given Survey
 * @param name
 */
router.get('/:name/metrics', (req, res) => {
    try {
        const metrics = SurveyService.getSurveyMetrics(req.params.name);
        res.send({metrics: metrics});
    } catch (err) {
        res.status(400).send({error: err.message});
    }
})

/**
 * '/:name/responses' route handler
 * Creates a SurveyResponse for the given Survey
 * @param name
 */
router.post('/:name/responses', (req, res) => {
    try {
        const surveyResponse = SurveyService.createSurveyResponse(req.params.name);
        res.send({surveyResponse: surveyResponse});
    } catch (err) {
        res.status(404).send({error: err.message});
    }
});

/**
 * '/:name/responses/:id' route handler
 * Pushes a response to the given SurveyResponse of the given Survey
 * @param name
 * @param id
 */
router.post('/:name/responses/:id', (req, res) => {
    try {
        const response = SurveyService.addSurveyResponse(req.params.name, req.params.id, req.body);
        res.send({surveyResponse: response});
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

/**
 * '/:name/questions' route handler
 * Adds a question to the given Survey
 * @param name
 */
router.post('/:name/questions', (req, res) => {
    try {
        const questions = SurveyService.addSurveyQuestion(req.params.name, req.body);
        res.send({question: questions});
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

/**
 * '/:name/questions/:index/metrics' route handler
 * Retrieves metrics for the given question of the given Survey
 * @param name
 * @param index
 */
router.get('/:name/questions/:index/metrics', (req, res) => {
    try {
        const metrics = SurveyService.getSurveyQuestionMetrics(req.params.name, req.params.index);
        res.send({metrics: metrics});
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

module.exports = router;
