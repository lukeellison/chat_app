import { Template } from 'meteor/templating';

import './body.html'; //Load body html
import '../api/messages.js'; //Load Messages database collection and methods
import '../api/conversations.js';

import { Conversations } from '../api/conversations.js'
import { Messages } from '../api/messages.js';

import './conversation.js';
import './message.js';

Template.body.helpers({
  messages() { //retrieves active conversations messages in the databases from client (insecure)

    const convo = Session.get('activeConvo'); //Get the active conversation from the session variable

    return Messages.find({conversationId: convo}, {sort: {sentAt : 1}}); //Return the messages for the active conversation

  },

  conversations() { //retrives conversations that this user is in
    const id = Meteor.userId();

    return Conversations.find({ "users.ids" : id })
  }
});

Template.body.events({
"click .message-send"(event) { //Event listener that calls the messages.send method when you press the send button
  var textarea = $('.main-input textarea'); //Find the main text area
  const text = textarea.val(); //get the text from the text area

  const convo = Session.get('activeConvo'); //Get the active conversation to post it to

  // Insert message into the collection
  Meteor.call("messages.send", convo, text)

  // Clear form
  textarea.val("");
},
"click .btn-matchmake"(event) { //Event listener that calls the matchmake method when you press the matchmake button
  Meteor.call("conversations.new", "Kd5NSiiw4uTuaXYdC", ["Luke", "Jeff", "Jeff2"]); //Temporarily using this to just make convos
}
});
