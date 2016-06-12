import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Conversations } from './conversations.js'
import { Messages } from './messages.js'

//Create Mongo collection for the messages
export const Edits = new Mongo.Collection("edits");
/*Current structure:
_id: ObjectId
type: type of edit 
messageId: id of message this edit belongs to
conversationId: id of conversation this message belongs to
edit: edit that was made
original: original text before edit
location: { start: start index of edit in text
            end: end index }
createdAt: date object when created
creatorId: userId of creator
creatorUsername: username of creator
additions: [strings of additional remarks on this edit]
*/

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish convos that belong to the current user

  Meteor.publish('edits', function editsPublication() {
    if (!this.userId) {
      return this.ready();
    }
    //Get list of convo ids for this user
    //const convos = Conversations.find({ "users.ids" : this.userId }, { '_id' : 1 }).map(function(item){ return item._id; })
    const user = Meteor.users.findOne(this.userId,{'matched.convos':1})
    const convos = user.matched.convos

    //Get messages that belong to those conversations
    return Edits.find({ "conversationId" : { $in : convos }});
  });
} 

Meteor.methods({
  'edits.new'(type,message,convo,original,edit,location){
    //Make sure the user is logged in before inserting
    if (! Meteor.userId()) {
      alert("Please sign in to edit a message");
      throw new Meteor.Error("not-authorized");
    }

    const id = new Meteor.Collection.ObjectID()._str;

    Edits.insert({
      _id: id,
      type: type,
      messageId: message,
      conversationId: convo,
      original: original,
      edit: edit,
      location: location,
      createdAt: new Date(),
      creatorId: Meteor.userId(),
      creatorUsername: Meteor.user().username,
      additions: []
    })

    return id;
  },
  'edits.add'(id,addition){
    //Make sure the user is logged in before inserting
    if (! Meteor.userId()) {
      alert("Please sign in to edit a message");
      throw new Meteor.Error("not-authorized");
    };

    Edits.update({_id: id},{ $push: {additions: 
                                          {sender: Meteor.user().username, 
                                            addition: addition}
                                    }});

    return id;
  },
  'edits.delete'(editId){
    if (! Meteor.userId()) {
      alert("Please sign in to delete an edit");
      throw new Meteor.Error("not-authorized");
    };

    Edits.remove(editId)

  },
  'edits.update'(editId,newType,newEdit){
    if (! Meteor.userId()) {
      alert("Please sign in to update an edit");
      throw new Meteor.Error("not-authorized");
    };

    Edits.update({_id : editId}, {$set: {edit: newEdit, type: newType}})
  }
})
