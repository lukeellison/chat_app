import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//Create Mongo collection for the messages
export const Messages = new Mongo.Collection("messages");
/*Current structure:
text: message content
sentAt: date object when sent
senderID: userID of sender
senderUsername: username of sender
*/
Meteor.methods({
  'messages.send'(text) { //Method called when pressing the send button on a message
  	check(text, String); //Check if input is a string

    //Make sure the user is logged in before sending
    if (! Meteor.userId()) {
      alert("Please sign in to send a message");
      throw new Meteor.Error("not-authorized");
    }
 
    //Insert into database
    Messages.insert({
      text: text,
      sentAt: new Date(),
      senderID: Meteor.userId(),
      senderUsername: Meteor.user().username
    });
  },
});
