import './conversation.html'

import { Messages } from '../api/messages.js';

Template.conversation.helpers({
convoName() {
  const name = this.name;
  let users = this.users.usernames;

  //return string for conversation name
  if(name == ""){ //If no name
    users.splice(users.indexOf(Meteor.user().username), 1); //Remove user from array

    var newName = users[0]; //Set it to the only name initially
    if (users[0].length > 1 && typeof users[0] !== 'string'){ //If there are more members then add them to the convo name
    	newName = users[0][0]; //First set it to first other memeber of group
	  	for (var i = 1; i < users[0].length ; i++) {
        newName += ', ' + users[0][i] //Accumulate members of conversation seperated by commas
	  	};
    }
  	return newName //Return comma seperated members of conversation
  }
  else return name; //Otherwise just return the chosen name
},
active(){ //Checks if this conversation is active
  return this._id === Session.get('activeConvo');
},
num_unread(){
  const messages = Messages.find({
    conversationId:this._id,
    read:false,
    senderId:{$ne:Meteor.userId()}
  })
  return messages.count()
}

});

Template.body.events({
  'click .conversation'(event) { //Clicking a conversation sets it as active
    Session.set('activeConvo', this._id);
    //Also deactive selected message from previous conversation
    Session.set("activeMessage",undefined)
    Session.set("selectedText",undefined)
    Session.set("selectedTextRange",undefined)

    //mark read messages
    Meteor.call('messages.read',this._id)
  },
});