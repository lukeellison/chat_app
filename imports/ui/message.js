import './message.html';
import { Messages } from '../api/messages.js';

Template.message.helpers({
time(id) {
  //return readable string from the sentAt
  var sentAt = Messages.findOne({_id : id}).sentAt;
  alert(sentAt)
  return sentAt.toDateString();
}
});