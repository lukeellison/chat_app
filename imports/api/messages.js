import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Conversations } from './conversations.js'

//Create Mongo collection for the messages
export const Messages = new Mongo.Collection("messages");
/*Current structure:
_id: ObjectId
conversationId: id of conversation this message belongs to
text: message content
sentAt: date object when sent
senderId: userId of sender
senderUsername: username of sender
*/

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish convos that belong to the current user

  Meteor.publish('messages', function messagesPublication() {
    if (!this.userId) {
      return this.ready();
    }

    //Get list of convo ids for this user
    const convos = Conversations.find({ "users.ids" : this.userId }, { '_id' : 1 }).map(function(item){ return item._id; })

    //Get messages that belong to those conversations
    return Messages.find({ "conversationId" : { $in : convos }});
  });
} 

Meteor.methods({
  'messages.send'(convo, text) { //Method called when pressing the send button on a message
  	check(text, String); //Check if input is a string

    //Make sure the user is logged in before sending
    if (! Meteor.userId()) {
      alert("Please sign in to send a message");
      throw new Meteor.Error("not-authorized");
    }
    
    //Insert into database
    Messages.insert({
      conversationId: convo,
      text: text,
      sentAt: new Date(),
      senderId: Meteor.userId(),
      senderUsername: Meteor.user().username
    });
  },
});
