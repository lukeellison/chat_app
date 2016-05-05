import './editing.html'
import { translate } from './helpers.js'

Template.editing.helpers({
	selectedText(){
		return Session.get('selectedText');
	},
});

Template.editing.events({
"click .edit-buttons>#1"(event) { //temporarily translates text in the textarea and replaces it in the input
  const textarea = $('.chat-input textarea');
  translate(Session.get('selectedText'), "en", "ja",function(translatedText){ //hardcoded english to japanese at the moment
  	console.log(translatedText)
    textarea.val(translatedText);
  });
},
});