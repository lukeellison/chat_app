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

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish convos that belong to the current user

  Meteor.publish('convos', function convosPublication() {
    if (!this.userId) {
      return this.ready();
    }

    return Conversations.find({ "users.ids" : this.userId });
  });
} 

Meteor.methods({
  'conversations.new'(userId, username) { //Method is being used temporarily
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
  'conversations.matchmake'() { //Method called when pressing the send button on a message
    //Make sure the user is logged in before matchmaking
    if (! Meteor.userId()) {
      alert("Please sign in");
      throw new Meteor.Error("not-authorized");
    }

    matchedUsers = Conversations.find({},{"users.ids" : 1}).map(function(item){ item.users.ids.shift(); return item.users.ids; })
    matchedUsers.push(Meteor.userId())

    const rand =  Math.floor(Math.random() * matchedUsers.length); 
    console.error(rand)    
    const randUser = Meteor.users.find({ $nin: matchedUsers }, {skip: rand, limit: -1})
  
    console.error(randUser._id)    

    //Insert into database
    // Conversations.insert({
    //   users: {
    //     ids: [Meteor.userId(), userId],
    //     usernames: [Meteor.user().username, username]
    //   },
    //   languages: "eng",
    //   lastMessage: new Date(),
    //   name: ""
    // });
  },
});
