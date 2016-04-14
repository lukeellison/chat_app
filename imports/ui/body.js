import { Template } from 'meteor/templating';

import './body.html'; //Load body html
import '../api/messages.js'; //Load Messages database collection and methods
import '../api/conversations.js';

import { Conversations } from '../api/conversations.js'
import { Messages } from '../api/messages.js';

import './conversation.js';
import './message.js';


Template.body.helpers({
  messages() { //retrieves all messages in the databases from client (insecure)

    return Messages.find({}, {sort: {sentAt : 1}});
  //   return [{senderUsername : "luke", text: "hello"},
  //             {senderUsername : "someone else", text: "yo"},
  //             {senderUsername : "luke", text: "AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage "}]
  },

  conversations() {
    const id = Meteor.userId();

    return Conversations.find({ "users.ids" : id })
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
  Meteor.call("conversations.new", "Kd5NSiiw4uTuaXYdC", ["Luke", "Jeff", "Jeff2"]); //Temporarily using this to just make convos
}
});
