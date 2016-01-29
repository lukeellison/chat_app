Messages = new Mongo.Collection("messages");
Convos = new Mongo.Collection("conversations");

Meteor.methods({
  sendMessage: function (text) {
    //Make sure the user is logged in before sending
    if (! Meteor.userId()) {
      alert("Please sing in to send a message");
      throw new Meteor.Error("not-authorized");
    }
 
    Messages.insert({
      text: text,
      sentAt: new Date(),
      senderID: Meteor.userId(),
      senderUsername: Meteor.user().username
    });
  },

  matchmake: function () {
    if (! Meteor.userId()) {
      alert("Please sing in to matchmake");
      throw new Meteor.Error("not-authorized");
    }

    var numUsers = Meteor.users.find().count();
    console.log(numUsers);
    var randI = Math.floor( Math.random() * numUsers );
    // var match = Meteor.users.find({$and:
    //     [{_id: {$ne: Meteor.userId()}},
    //     {connectedUsers: {$ne: Meteor.users.connectedUsers}}]},
    //     {skip: randI,
    //     fields: {_id: true}});
    var match = Meteor.users.find().fetch()[randI];

    console.log(match);

  }
});

if (Meteor.isClient) {

  Template.body.helpers({
    messages: function () {
      return Messages.find({}, {sort: {sentAt : 1}});
    //   return [{senderUsername : "luke", text: "hello"},
    //             {senderUsername : "someone else", text: "yo"},
    //             {senderUsername : "luke", text: "AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage AreallyLongMessage "}]
    },

    conversations: function () {
      return Convos.find({$or: 
          [{user1: Meteor.userId()}, 
          {user2: Meteor.userId()}]});
    }
  });

  Template.body.events({
  "click .message-send": function (event) {
    var textarea = $('.main-input textarea');

    var text = textarea.val();

    // Insert a task into the collection
    Meteor.call("sendMessage", text)

    // Clear form
    textarea.val("");
  },
  "click .btn-matchmake": function (event) {
    Meteor.call("matchmake");
  }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.message.helpers({
    time: function (id) {
      //return readable string from the sentAt
      var sentAt = Messages.findOne({_id : id}).sentAt;
      return sentAt.toDateString();
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
