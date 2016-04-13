import { Template } from 'meteor/templating';

import './body.html'; //Load body html
import '../api/messages.js'; //Load Messages database collection and methods

import { Messages } from '../api/messages.js';
import './message.js';
import './conversation.js';

Template.body.helpers({
  messages() { //retrieves all messages in the databases from client (insecure)

    return Messages.find({}, {sort: {sentAt : 1}});
  //   return [{senderUsername : "luke", text: "hello"},
  //             {senderUsername : "someone else", text: "yo"},
  //             {senderUsername : "luke", text: "AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage "}]
  },

  conversations() {
    return Convos.find({$or: 
        [{user1: Meteor.userId()}, 
        {user2: Meteor.userId()}]});
  }
});

Template.body.events({
"click .message-send"(event) { //Event listener that calls the messages.send method when you press the send button
  var textarea = $('.main-input textarea');

  var text = textarea.val();

  // Insert message into the collection
  Meteor.call("messages.send", text)

  // Clear form
  textarea.val("");
},
"click .btn-matchmake"(event) { //Event listener that calls the matchmake method when you press the matchmake button
  Meteor.call("matchmake");
}
});
