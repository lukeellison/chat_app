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
	const editId = Session.get('activeEdit')
	const additions = Edits.findOne(editId,{additions:1}).additions;
	return additions;
},
editType() {
	const editId = Session.get('activeEdit')
	const type = Edits.findOne(editId,{type:1}).type;
	return type;
},
creatorUsername() {
	const editId = Session.get('activeEdit')
	const username = Edits.findOne(editId,{creatorUsername:1}).username;
	return username;
},
edit() {
	const editId = Session.get('activeEdit')
	const edit = Edits.findOne(editId,{edit:1}).edit;
	return edit;
},

});

Template.message.events({
"click .corrected"(event) { //displays the correction
	const id = event.target.id;
	Session.set('activeEdit',id)
	$(this).find(".edit-additions").slideDown();
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