import './conversation.html'

import { Messages } from '../api/messages.js';

Template.conversation.helpers({
convoName() {
  if(this.name === ""){ //if name not set
    var usernames = this.users.usernames.slice() //make copy
    usernames.splice(usernames.indexOf(Meteor.user().username),1) //remove yourself
    return usernames[0] //should only be 1 other user atm
  }
  else return this.name
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
},
status(){
  //Find userIds in this conversation not including yourself
  var convoUsers = this.users.ids.slice() //make copy for splice
  convoUsers.splice(convoUsers.indexOf(Meteor.userId()),1)

  //For now the collection for one of them (should only be one atm)
  const user = Meteor.users.findOne({
    _id:{$in:convoUsers}
  })

  //return their status
  if(user) return user.presence.status
  else return 'offline'
}

});

Template.conversation.events({
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