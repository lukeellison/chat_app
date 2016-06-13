import './editing.html'
import { translate } from './helpers.js'
import { Messages } from '../api/messages.js';
import { rangeInEdit } from './helpers.js'

Template.editing.helpers({
	selectedText(){
		return Session.get('selectedText');
	},
});

Template.editing.events({
"click .edit-buttons"(event) { //Correction button
	//get appropriate variables
	const button = event.target.id;

	if(button === "translate"){ //handle translations differently, temporary solution
	  const textarea = $('.chat-input textarea');
	  translate(Session.get('selectedText'), "en", "ja",function(translatedText){ //hardcoded english to japanese at the moment
	  	console.log(translatedText)
	    textarea.append(translatedText);
	  });
	  return
	}
	// the other buttons are for making edits

	//get appropraite variables
	const selectedText = Session.get('selectedText');
	const location = Session.get('selectedTextRange');
	const activeMessage = Session.get('activeMessage');
	const selectedEdit = rangeInEdit(location,activeMessage);

	//get the text in the input
	const edit = $('.chat-input textarea').val()
	if(edit === "" && button != "enquirey"){//if no input require one except for enquirey
		alert("please enter a " + button)
		return
	}

	if(selectedEdit){ //if there is an edit active then update that edit to the input
		Meteor.call("edits.update", selectedEdit._id, button, edit, function(error,result){
			if(error){
		        alert('Error updating edit - logged')
				console.log(error);
			}
		});
	}
	else{ //if there is no edit active make a new one
		Meteor.call("edits.new", button, activeMessage, Session.get('activeConvo'),selectedText, edit, location, function(error,editId){
			if(error){
		        alert('Error creating edit - logged')
				console.log(error);
			}
			else{
				//return to message send screen
				Session.set('selectedText',undefined);
				Session.set('selectedTextRange',undefined);				
			}
		});
	}
},
});