import { Template } from 'meteor/templating';

import './body.html'; //Load body html
import '../../client/main.css';
import '../api/messages.js'; //Load Messages database collection and methods
import '../api/conversations.js';
import '../api/edits.js'

import './sidebar.js'
import './chatWindow.js';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('convos');
  Meteor.subscribe('messages');
  Meteor.subscribe('edits');
});

Template.body.events({
"click"(event) { //Allows clicking off selected message
  const target = event.target; 
  if($(target).is(".chat-messages")){
    Session.set("activeMessage",undefined)
    Session.set("selectedText",undefined)
  }
}
});
