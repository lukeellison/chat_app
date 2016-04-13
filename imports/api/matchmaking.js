Meteor.methods({
  'matchmaking.start'() { //Method called when pressing the matchmaking button 
    //Check if signed in
    if (! Meteor.userId()) {
      alert("Please sing in to matchmake");
      throw new Meteor.Error("not-authorized");
    }

    var numUsers = Meteor.users.find().count(); //count number of users
    console.log(numUsers);
    var randI = Math.floor( Math.random() * numUsers ); //random index
    // var match = Meteor.users.find({$and:
    //     [{_id: {$ne: Meteor.userId()}},
    //     {connectedUsers: {$ne: Meteor.users.connectedUsers}}]},
    //     {skip: randI,
    //     fields: {_id: true}});
    var match = Meteor.users.find().fetch()[randI]; // fetch user with that index

    console.log(match);

  }
});