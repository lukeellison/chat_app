import './message.html';
import { Messages } from '../api/messages.js';
import { Edits } from '../api/edits.js';

Template.message.helpers({
text(){
	const rawText = this.text;
	var outputHtml = rawText;
	const edits = Edits.find({messageId: this._id},{ sort: { "location.start": -1}});
	edits.forEach(function(edit){
		if(edit.type === "correction")
			outputHtml = outputHtml.substr(0,edit.location.start) + '<span id="'+edit._id+'" class=" edit '+edit.type+'" title="'+edit.original+'">' + edit.edit + '</span>' + outputHtml.substr(edit.location.end);
		else		
			outputHtml = outputHtml.substr(0,edit.location.start) + '<span id="'+edit._id+'" class=" edit '+edit.type+'" title="'+edit.edit+'">' + edit.original + '</span>' + outputHtml.substr(edit.location.end);
	});
	return outputHtml;
},
time() {
  //return readable string from the sentAt
  Session.get('tick') //Make this helper rerun every interval

  const now = new Date();
  const time = this.sentAt
  const dt = (now.getTime()/1000) - (time.getTime()/1000);
  if(dt < 10){ //10 seconds
  	return "A few seconds ago"
  }
  else if(dt < 60){ //60 seconds
  	return "Less than a minute ago"
  }
  else if(dt < 60*5){ //5 mins
  	return "A few minutes ago"
  }
  else if(dt < 60*60*24){ //1 day
  	if(now.getDate()>time.getDate()) //yesterday
  	return "yesterday at " + ("0" + time.getHours()).slice(-2) +":"+ ("0" + time.getMinutes()).slice(-2);
  	else return "Today at " + ("0" + time.getHours()).slice(-2) +":"+ ("0" + time.getMinutes()).slice(-2);
  }
  else
  	return this.sentAt.toDateString();
},
thisUser() {
	return this.senderId === Meteor.userId()
},
active() {
	return this._id === Session.get("activeMessage")
},
additions() {
	const editId = Session.get('activeEdit')
	const edit = Edits.findOne(editId,{additions:1});
	if(edit)
		return edit.additions;
	else return undefined;
},
editType() {
	const editId = Session.get('activeEdit')
	const edit = Edits.findOne(editId,{type:1});
	if(edit)
		return edit.type;
	else return undefined;
},
creatorUsername() {
	const editId = Session.get('activeEdit')
	const edit = Edits.findOne(editId,{creatorUsername:1});
	if(edit)
		return edit.username;
	else return undefined;
},
edit() {
	const editId = Session.get('activeEdit')
	const edit = Edits.findOne(editId,{edit:1});
	if(edit)
		return edit.edit;
	else return undefined;
},

});

Template.message.events({
"click .edit"(event) { //displays the correction
	const id = event.target.id;
	Session.set('activeEdit',id)
	const form = $('.message.active').find(".edit-additions");
	form.slideDown();
},
"click .edit-additions>.hide-pane"(event) {
	const form = $('.message.active').find(".edit-additions");
	form.slideUp(function(){
	    Session.set('activeEdit',undefined);
	});
},
"click .edit-additions>.delete-edit"(event) {
	const form = $('.message.active').find(".edit-additions");
	form.slideUp(function(){
		Meteor.call('edits.delete',Session.get('activeEdit'),Session.get('activeMessage'), function(error,result){
			if(error){
		        alert('Error deleting edit - logged')
				console.log(error);
			}
		});
	    Session.set('activeEdit',undefined);
	});
    Session.set('selectedText',undefined);
    Session.set('selectedTextRange',undefined);        
},
'submit .additionForm'(event) {
// Prevent default browser form submit
event.preventDefault();

// Get value from form element
const target = event.target;
const text = target.text.value;

// Insert the addition into the collection
Meteor.call('edits.add',Session.get('activeEdit'),text, function(error,result){
	if(error){
        alert('Error adding to edit - logged')
		console.log(error);
	}
	else{
	}
});
// Clear form
target.text.value = '';		
},
});

Template.message.onRendered(function() {
	//whenever a new message is rendered
	$(".chat-messages").prop({ scrollTop: $(".chat-messages").prop("scrollHeight") }); //scroll to new message
	Meteor.call('messages.read',Session.get('activeConvo')) //set it as read
});