import { Template } from 'meteor/templating';

import './layout.html'; //Load main layout
import './chat.html'; 
import '../../client/main.css';
import '../api/messages.js'; //Load Messages database collection and methods
import '../api/users.js'
import '../api/conversations.js';
import '../api/edits.js';

import './sidebar.js'
import './chatWindow.js';

Template.layout.onCreated(function layoutOnCreated() { //Subscriptions with reactivity for when a new user is matched
  this.autorun(() => {
    var matchedConvos = []
    if(Meteor.user()){
      if(Meteor.user().matched)
        matchedConvos = Meteor.user().matched.convos;
    }
    Meteor.subscribe('matchedUsers');
    Meteor.subscribe('convos');
    Meteor.subscribe('edits',matchedConvos);
    Meteor.subscribe('messages',matchedConvos);
  });
});

Template.layout.events({
"click"(event) { //Allows clicking off selected message
  const target = event.target; 
  if($(target).is(".chat-messages")){
    Session.set("activeMessage",undefined)
    Session.set("selectedText",undefined)
    Session.set("selectedTextRange",undefined)
  }
},
});

$(window).focus(function() { //Function for updating read status once window is in focus
  Meteor.call('messages.read',Session.get('activeConvo'))
});

