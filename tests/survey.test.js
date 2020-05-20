const request = require('supertest')
const app = require('../src/app')
describe('Endpoints', () => {
    let survey;
    let surveyResponse;
    it('GET / success', async () => {
        const res = await request(app).get('/survey');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('survey');
        expect(res.body.survey).toHaveLength(0);
    });

    it('POST / bad request', async () => {
        const res = await request(app).post('/survey').send();
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST / invalid var type', async () => {
        const res = await request(app).post('/survey').send({name: 1});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST / success', async () => {
        const res = await request(app).post('/survey').send({name: 'dolphin'});
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('survey');
    });

    it('POST / duplicated survey', async () => {
        const res = await request(app).post('/survey').send({name: 'dolphin'});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('GET /:name unknown survey', async () => {
        const res = await request(app).get('/survey/d0lphin');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
    });

    it('GET /:name success', async () => {
        const res = await request(app).get('/survey/dolphin');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('survey');
        survey = res.body.survey;
    });

    it('GET /:name/metrics no SurveyResponse yet', async () => {
        const res = await request(app).get('/survey/dolphin/metrics');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/responses success', async () => {
        const res = await request(app).post('/survey/dolphin/responses');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('surveyResponse');
        surveyResponse = res.body.surveyResponse;
    });

    it('GET /:name/metrics no SurveyResponse yet', async () => {
        const res = await request(app).get('/survey/dolphin/metrics');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/responses unknown survey', async () => {
        const res = await request(app).post('/survey/d0lphin/responses');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
    });

    it('GET /:name/metrics no answer yet', async () => {
        const res = await request(app).get('/survey/dolphin/metrics');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/questions unknown survey', async () => {
        const res = await request(app).post('/survey/d0lphin/questions').send({question: "How are you ?"});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/questions bad request', async () => {
        const res = await request(app).post('/survey/dolphin/questions').send();
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/question invalid var type ', async () => {
        const res = await request(app).post('/survey/dolphin/questions').send({question: 1});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/questions success', async () => {
        const res = await request(app).post('/survey/dolphin/questions').send({question: "How are you ?"});
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('question');
        expect(res.body.question).toHaveLength(1);
    });

    it('GET /:name/metrics/:index/metrics no answer yet', async () => {
        const res = await request(app).get('/survey/dolphin/questions/1/metrics');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/responses/:id invalid var type', async () => {
        const res = await request(app).post(`/survey/dolphin/responses/${surveyResponse.id}`).send({response: "1"});
        expect(res.statusCode).toEqual(400);
    });

    it('POST /:name/responses/:id out of range', async () => {
        const res = await request(app).post(`/survey/dolphin/responses/${surveyResponse.id}`).send({response: 6});
        expect(res.statusCode).toEqual(400);
    });

    it('POST /:name/responses/:id success success', async () => {
        const res = await request(app).post(`/survey/dolphin/responses/${surveyResponse.id}`).send({response: 1});
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('surveyResponse');
    });

    it('POST /:name/responses/:id exceeded question pool', async () => {
        const res = await request(app).post(`/survey/dolphin/responses/${surveyResponse.id}`).send({response: 1});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/responses/:id unknown Survey', async () => {
        const res = await request(app).post(`/survey/d0lphin/responses/${surveyResponse.id}`).send({response: 1});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/responses/:id unknown SurveyResponse', async () => {
        const res = await request(app).post(`/survey/dolphin/responses/unknown`).send({response: 1});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/responses/:id bad request', async () => {
        const res = await request(app).post(`/survey/dolphin/responses/${surveyResponse.id}`).send();
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('GET /:name/metrics success', async () => {
        const res = await request(app).get('/survey/dolphin/metrics');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('metrics');
    });

    it('GET /:name/metrics unknown Survey', async () => {
        const res = await request(app).get('/survey/d0lphin/metrics');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('GET /:name/metrics/:index/metrics unknown Survey', async () => {
        const res = await request(app).get('/survey/d0lphin/questions/2/metrics');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('GET /:name/metrics/:index/metrics invalid var type', async () => {
        const res = await request(app).get('/survey/dolphin/questions/d/metrics');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('GET /:name/metrics/:index/metrics success', async () => {
        const res = await request(app).get('/survey/dolphin/questions/1/metrics');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('metrics');
    });

    it('GET /:name/metrics/:index/metrics out of range', async () => {
        const res = await request(app).get('/survey/dolphin/questions/2/metrics');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /:name/questions exceeded size', async () => {
        for (let i = 0; i <= 9; i += 1) {
            await request(app).post('/survey/dolphin/questions').send({question: "How are you ?"});
        }
        const res =  await request(app).post('/survey/dolphin/questions').send({question: "How are you ?"});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('DELETE /:name unknown Survey', async () => {
        const res = await request(app).delete('/survey/d0lphin');
        expect(res.statusCode).toEqual(404);
    });

    it('DELETE /:name success', async () => {
        const res = await request(app).delete('/survey/dolphin');
        expect(res.statusCode).toEqual(200);
    });
})
