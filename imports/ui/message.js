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
time(id) {
  //return readable string from the sentAt
  var sentAt = Messages.findOne({_id : id}).sentAt;
  return sentAt.toDateString();
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
	    Session.set('activeEdit',undefined);
	});
	Meteor.call('edits.delete',Session.get('activeEdit'),Session.get('activeMessage'))
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
Meteor.call('edits.add',Session.get('activeEdit'),text)

// Clear form
target.text.value = '';
},
});