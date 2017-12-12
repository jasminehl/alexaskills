'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');

// var app = chatskills.app('journalism_capstone');
var app = new Alexa.app('journalism_capstone');

const util = require('util')

// http://localhost:8080/alexa/journalism_capstone

const SKILL_NAME = 'RJI';
const WELCOME_MESSAGE = 'Welcome';
const PROMPT = 'Would you like to hear stories about technology, innovation, videos, or RJI fellowships?';
const REPROMPT = 'Would you like to continue or hear more?';
const ARTICLE_SEPARATOR = '. The next article\'s headline is ';
const HELP_MESSAGE = 'You can hear stories about technology, innovation, videos, or RJI fellowships.';
const HELP_REPROMPT = 'What can I help you with?';
const SORRY = 'Sorry, I can\'t do that yet.';
const STOP_MESSAGE = 'Goodbye!';

const news = require("./news.json");

app.launch(function(req, res) {
	res.say(PROMPT).reprompt(PROMPT).shouldEndSession(false);
});

app.intent('ContinueIntent', {
    'utterances': ['continue']
}, function(req, res) {
	res.say(PROMPT).reprompt(PROMPT).shouldEndSession(false);
});

app.intent('ArticlesIntent', {
  'slots': { 'TAG': 'LITERAL' },
  'utterances': ['tell me {|stories} about {technology|innovation|videos|fellowships|TAG}', '{technology|innovation|videos|fellowships|TAG}', '{give me|read} articles {about|on} {technology|innovation|videos|fellowships|TAG}', 'continue']
}, function(req, res) {
	function jsUcfirst(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}

	var currentTag = req.slot('TAG')
	if (!currentTag) {
		res.say(HELP_MESSAGE).reprompt(HELP_REPROMPT).shouldEndSession(false);
		return true
	} else {
		var slice = 0
		const articleArr = news;
		let filteredArticles = articleArr.filter(function(art){return art.tags.indexOf(jsUcfirst(currentTag)) > -1}).slice(0, 4);
		const filteredArticleTitles = filteredArticles.map(function(art){return art.title});
		const speechOutput = filteredArticleTitles.join(ARTICLE_SEPARATOR) + REPROMPT;

		res.session('tag', currentTag)
		res.session('slice', slice)

		res.say(speechOutput).reprompt(REPROMPT).shouldEndSession(false);
		return true
	}
});

app.intent('ReadMoreIntent', {
	'utterances': ['Read More', 'hear more options']
}, function(req, res) {
	function jsUcfirst(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}

	var currentTag = req.session('tag')
	var slice = req.session('slice') || 0
	if (!currentTag) {
		res.say(HELP_MESSAGE).reprompt(HELP_REPROMPT).shouldEndSession(false);
		return true
	} else {
		slice += 1
		const articleArr = news;
		let filteredArticles = articleArr.filter(function(art){return art.tags.indexOf(jsUcfirst(currentTag)) > -1})
		console.log(util.inspect(filteredArticles, false, null))
		let slicedArticles = filteredArticles.slice(slice * 5, (slice * 5) + 5);

		if(slicedArticles && slicedArticles.length > 0) {
			const slicedArticleTitles = slicedArticles.map(function(art){return art.title});
			const speechOutput = slicedArticleTitles.join(ARTICLE_SEPARATOR) + ". " + REPROMPT;

			res.session('tag', currentTag)
			res.session('slice', slice)

			res.say(speechOutput).reprompt(REPROMPT).shouldEndSession(false);
		} else {
			res.clear('tag')
			res.clear('slice')
			res.say("There are no more articles. " + PROMPT).reprompt(REPROMPT).shouldEndSession(false);
		}

		return true
	}
});

app.intent('ReadArticleIntent', {
	'slots': { 'TITLE': 'LITERAL' },
	'utterances': ['Read {TITLE}']
}, function(req, res) {
	let currentTitle = req.slot('TITLE')
	if (!currentTitle) {
		res.say(HELP_MESSAGE).reprompt(HELP_REPROMPT).shouldEndSession(false);
		return true
	} else {
		const articleArr = news;
		let filteredArticle = articleArr.filter(function(art){ return art.title.toLowerCase().trim() === currentTitle.toLowerCase().trim() });

		if(filteredArticle && filteredArticle.length >= 1) {
			const speechOutput = filteredArticle[0].title + ". The content of the article is " + filteredArticle[0].summary
			res.say(speechOutput).shouldEndSession(true);
			return true
		} else {
			res.say(HELP_MESSAGE).reprompt(HELP_REPROMPT).shouldEndSession(false);
			return true
		}
	}
});

app.intent('AMAZON.HelpIntent', function(req, res) {
	res.say(HELP_MESSAGE).reprompt(HELP_REPROMPT).shouldEndSession(false);
});
app.intent('AMAZON.CancelIntent', function(req, res) {
	res.say(STOP_MESSAGE).shouldEndSession(false);
});
app.intent('AMAZON.StopIntent', function(req, res) {
	res.say(STOP_MESSAGE).shouldEndSession(false);
});


module.exports = app;
