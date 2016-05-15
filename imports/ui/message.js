import './message.html';
import { Messages } from '../api/messages.js';
import { Edits } from '../api/edits.js';

Template.message.helpers({
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
	if(Edits && Session.get('activeEdit')){
		const editId = Session.get('activeEdit')
		const additions = Edits.findOne(editId,{additions:1}).additions;
		return additions;		
	}
	else return undefined;
},
editType() {
	if(Edits && Session.get('activeEdit')){
		const editId = Session.get('activeEdit')
		const type = Edits.findOne(editId,{type:1}).type;
		return type;		
	}
	else return undefined;
},
creatorUsername() {
	if(Edits && Session.get('activeEdit')){
		const editId = Session.get('activeEdit')
		const username = Edits.findOne(editId,{creatorUsername:1}).username;
		return username;		
	}
	else return undefined;
},
edit() {
	if(Edits && Session.get('activeEdit')){
		const editId = Session.get('activeEdit')
		const edit = Edits.findOne(editId,{edit:1}).edit;
		return edit;		
	}
	else return undefined;
},

});

Template.message.events({
"click .correction"(event) { //displays the correction
	const id = event.target.id;
	Session.set('activeEdit',id)
	const form = $('.message.active').find(".edit-additions");
	form.slideDown();
},
"click .edit-additions>.hide-pane"(event) {
	const form = $('.message.active').find(".edit-additions");
	form.slideUp();
},
"click .edit-additions>.delete-edit"(event) {
	const form = $('.message.active').find(".edit-additions");
	form.slideUp();
	Meteor.call('edits.delete',Session.get('activeEdit'),Session.get('activeMessage'))
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