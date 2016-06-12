import { Conversations } from './conversations.js'

/*additional fields:
matched:{
  users:[user ids that have been matched]
  convos:[convo ids that have been matched]
}
presence:{
  https://github.com/dan335/meteor-user-presence
}
languages:{ //all languages stored as language codes eg. "en"
  fluent: [fluent languages]
  learning: [languages to learn]
}
*/

Meteor.users.deny({update: function () { return true; }});

if (Meteor.isServer) {
  // This code only runs on the server
  // publish matched users info

  Meteor.publish('matchedUsers', function editsPublication() {
    if (!this.userId) {
      return this.ready();
    }

    //Find this user
    var user = Meteor.users.findOne(this.userId,{
      _id:1,
      username:1,
      'presence.status':1,
      'matched':1
    })

    if(user.matched){
	    //Allow them to see some information about who they are matched with
	    return Meteor.users.find({$or:[this.userId,{ "_id" : { $in : user.matched.users }}]},
	    	{fields:{
	    		_id:1,
	    		username:1,
	    		'presence.status':1,
          'matched':1
	    	}});
    }
    else{ //Just in case of incorrect structure
      return Meteor.users.find(this.userId,
        {fields:{
          _id:1,
          username:1,
          'presence.status':1,
          'matched':1
        }});
    }
  });
} 