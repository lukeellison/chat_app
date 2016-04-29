import { Template } from 'meteor/templating';

import './body.html'; //Load body html
import '../../client/main.css';
import '../api/messages.js'; //Load Messages database collection and methods
import '../api/conversations.js';

import './sidebar.js'
import './chatWindow.js';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('convos');
  Meteor.subscribe('messages')
});

Template.body.events({
"click"(event) {
  const target = event.target; 
  if(!($(event.target).parent(".message").length>0 || $(event.target).is(".message"))) {
    Session.set("activeMessage",0)
  }
}
});
