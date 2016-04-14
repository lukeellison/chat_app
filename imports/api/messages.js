import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//Create Mongo collection for the messages
export const Messages = new Mongo.Collection("messages");
/*Current structure:
conversationId: id of conversation this message belongs to
text: message content
sentAt: date object when sent
senderId: userId of sender
senderUsername: username of sender
*/
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
