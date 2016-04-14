import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//Create Mongo collection for the messages
export const Conversations = new Mongo.Collection("conversations");
/*Current structure:
_id: Object ID
users: {
	ids: [user ids involved]
	usernames: [corresponding strings]
}
languages: [agreed conversation languages]
lastMessage: Date object of most recent messsage
name: name of conversation
*/
Meteor.methods({
  'conversations.new'(userId, username) { //Method called when pressing the send button on a message
  	check(userId, String);
  	//check(username, String);

    //Make sure the user is logged in before sending
    if (! Meteor.userId()) {
      alert("Please sign in");
      throw new Meteor.Error("not-authorized");
    }
 	
    //Insert into database
    Conversations.insert({
      users: {
      	ids: [Meteor.userId(), userId],
      	usernames: [Meteor.user().username, username]
      },
      languages: "eng",
      lastMessage: new Date(),
      name: ""
    });
  },
});
