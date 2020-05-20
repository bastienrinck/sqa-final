# API details

## GET /survey
### Output
```json
{
  "survey": [
    {
      "name": "dolphin",
      "questions": [],
      "responses": []
    }
  ]
}
```

## POST /survey
### Input
```json
{
	"name": "dolphin"
}
```
### Output
```json
{
  "survey": {
    "name": "dolphin",
    "questions": [],
    "responses": []
  }
}
```

## GET /survey/:name
### Output
```json
{
  "survey": {
    "name": "dolphin",
    "questions": [],
    "responses": []
  }
}
```

## Delete /survey/:name
No input/output

## POST /survey/:name/question
### Input
```json
{
	"question": "How are you?"
}
```
### Output
```json
{
  "question": [
    "How are you?"
  ]
}
```

## POST /survey/:name/responses
### Output
```json
{
  "surveyResponse": {
    "id": "e473f012-b991-4f8d-9d27-e31ddb01a26b",
    "responses": []
  }
}
```

## POST /survey/:name/responses/:surveyResponseId
### Input
```json
{
	"response": 4
}
```
### Output
```json
{
  "surveyResponse": {
    "id": "e473f012-b991-4f8d-9d27-e31ddb01a26b",
    "responses": [
      4
    ]
  }
}
```

## GET /survey/:name/metrics
### Output
```json
{
  "metrics": {
    "average": 2.3333333333333335,
    "std": 1.5275252316519468,
    "min": 1,
    "max": 4
  }
}
```

## GET /survey/:name/questions/:questionIndex/metrics
### Output
```json
{
  "metrics": {
    "average": 3.6666666666666665,
    "std": 1.5275252316519465,
    "min": 2,
    "max": 5
  }
}
```
