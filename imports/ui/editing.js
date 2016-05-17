import './editing.html'
import { translate } from './helpers.js'
import { Messages } from '../api/messages.js';

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
    textarea.append(translatedText);
  });
},
"click .edit-buttons>#2"(event) {
	const selectedText = Session.get('selectedText');
	const location = Session.get('selectedTextRange');
	const activeMessage = Session.get('activeMessage');
	// const text = Messages.findOne({"_id" : activeMessage},{"text" : 1}).text;
	// const i = text.indexOf(selectedText)
	// if(i<0){
	// 	alert('Do not overlap corrections')
	// 	return;
	// }

	const edit = $('.chat-input textarea').val()
	if(edit === ""){
		alert("please enter a correction")
		return
	}

	Meteor.call("edits.new", "Correction", activeMessage, Session.get('activeConvo'),selectedText, edit, location, function(error,newId){
		if(error){
			console.log(error);
			return;
		}
		// console.log(newId);
		// const output = text.substr(0,i) + '<span id="'+newId+'" class="correction" title="'+selectedText+'">' + edit + '</span>' + text.substr(i+selectedText.length);
		// Meteor.call("messages.correct",activeMessage,output)		
	});
},
});