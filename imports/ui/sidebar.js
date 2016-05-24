import './sidebar.html'
import { Conversations } from '../api/conversations.js'
import './conversation.js';

Template.sidebar.helpers({
  conversations() { //retrives conversations that this user is in
    const id = Meteor.userId();

    return Conversations.find({ "users.ids" : id })
  }
});

Template.body.events({
"click .btn-matchmake"(event) { //Event listener that calls the matchmake method when you press the matchmake button

  Meteor.call('conversations.matchmake',function(error,result){
  	if(!result) alert("No more unmatched users");
    //Resubscribe to gain info about this user (did not want people to be able to pass arguments to this subscription so it is not reactive)
  	Meteor.subscribe('matchedUsers');
  });

//  Meteor.call("conversations.new", "Kd5NSiiw4uTuaXYdC", ["Luke", "Jeff", "Jeff2"]); //Temporarily using this to just make convos
},
});