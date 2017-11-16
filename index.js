/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/


'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.b31ba447-3fe2-45a7-aa11-fd9b77d5008f';

const SKILL_NAME = 'RJI';
const WELCOME_MESSAGE = 'Welcome';
const PROMPT = 'Would you like to hear stories about technology, innovation, video or fellowships?';
const REPROMPT = 'Would you like to continue or hear more options?';
const ARTICLE_SEPARATOR = 'Next article: ';
const HELP_MESSAGE = 'You can hear stories about technology, innovation or fellowships.';
const HELP_REPROMPT = 'What can I help you with?';
const SORRY = 'Sorry, I can\'t do that yet.';
const STOP_MESSAGE = 'Goodbye!';

const news = require("news.json");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // alexa.dynamoDBTableName = 'DYNAMO_DB_RESULTS_TABLE';
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        // this.emit(':tell', WELCOME_MESSAGE);
        this.emit(':ask', PROMPT, PROMPT);
        this.emit('GetArticlesIntent')

    },
    'GetArticlesIntent': function () {
        const articleArr = news;
        // const splitTags = articleTags.split(",");
        const userResponse = this.event.request.intent.slots.CATEGORY.value;
        // const sortedArticles = articleArr.sort((a, b) => a.tags > b.tags);
        let filteredArticles = articleArr.filter(function(art){return art.tags.indexOf(userResponse) > -1}).slice(0, 4);
        const filteredArticleTitles = filteredArticles.map(function(art){return art.title});
        const speechOutput = filteredArticleTitles.join(ARTICLE_SEPARATOR);

        // this.response.cardRenderer(SKILL_NAME, randomArticle);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

// function checkTags(tags, ) {
// }
