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
createdAt: Date object
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
  'conversations.matchmake'() { //Method called when pressing the matchmake button
    //Make sure the user is logged in before matchmaking
    if (! Meteor.userId()) {
      alert("Please sign in");
      throw new Meteor.Error("not-authorized");
    }

    //find all the users already in a conversation with this user
    matchedUsers = Conversations.find({"users.ids": Meteor.userId()},{"users.ids" : 1}).map(function(item){ item.users.ids.shift(); return item.users.ids; })
    matchedUsers.push(Meteor.userId()) //add themselves to the list

    //find how many users are left unmatched
    length_unmactchedUsers = Meteor.users.find().count() - matchedUsers.length

    if(length_unmactchedUsers < 1){
      return false
    }
    //Generate a random int for which user to pick out of all of the unmatched users
    const rand =  Math.floor(Math.random() * length_unmactchedUsers); 
    //Find the user using the random number from all users not including any that have already been matched
    const randUser = Meteor.users.findOne({ "_id": { $nin: matchedUsers }}, {skip: rand})
  
    //Insert into database
    Conversations.insert({
      users: {
        ids: [Meteor.userId(), randUser._id],
        usernames: [Meteor.user().username, randUser.username]
      },
      languages: "eng",
      createdAt: new Date(),
      name: ""
    }, function(err, id){
      //Add a field to the user collection to keep track of who the user is matched with
      Meteor.users.update(Meteor.userId(),{$push:{
        'matched.users':randUser._id,
        'matched.convos':id
      }})
      Meteor.users.update(randUser._id,{$push:{
        'matched.users':randUser._id,
        'matched.convos':id
      }})
    });

    return true;
  },
});
