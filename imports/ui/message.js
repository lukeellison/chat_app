import './message.html';
import { Messages } from '../api/messages.js';

Template.message.helpers({
time(id) {
  //return readable string from the sentAt
  var sentAt = Messages.findOne({_id : id}).sentAt;
  return sentAt.toDateString();
},
thisUser() {
	return this.senderId === Meteor.userId()
},
text() {
	let str = this.text
	let output = str;
	str = str.substring(200);
	while (str.length > 0) {
		output += str.substring(0, 200) + '\n';
		str = str.substring(200);
	}
	return output;
}
});